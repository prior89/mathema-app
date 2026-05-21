import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { SubscriptionStatus } from '@prisma/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { FREE_TIER_SOLVER_LIMIT } from './free-tier-solver-quota.guard';
import { PlayApiClient } from './play-api-client.service';
import { QuotaService } from './quota.service';

/** Internal shape after mapping a Play subscriptionsv2 payload to our row
 *  fields. Reused by both verify-on-purchase (with userId in scope) and
 *  RTDN ingest (looks up by purchaseToken only). */
interface MappedSubscriptionState {
  productId: string;
  status: SubscriptionStatus;
  startTime: Date;
  expiryTime: Date;
  autoRenewing: boolean;
  isInIntroOfferPeriod: boolean;
  orderId?: string;
  countryCode?: string;
  playSubscriptionState: string;
}

/**
 * Google Play Billing — Phase 2 + Phase 4.
 *
 * Phase 2 added Play Developer API v3 (subscriptionsv2) verification + upsert.
 * Phase 4 adds RTDN-driven re-verification: `verifyAndRecordPurchaseByToken`
 * looks up the local row by purchaseToken (no userId in scope on RTDN) and
 * re-runs the same upsert + audit pipeline. The Play-state → our-row mapping
 * lives in a shared private helper so both code paths agree byte-for-byte.
 */
@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly playApi: PlayApiClient,
    private readonly quota: QuotaService,
  ) {}

  /** Returns true iff the user is currently entitled.
   *
   * Google Play subscription states that grant entitlement until `expiryTime`:
   *   - ACTIVE     paid + renewing
   *   - GRACE      payment failed but Google grace period — still entitled
   *   - CANCELED   user canceled but the period they already paid for runs
   *                until expiryTime. Cutting them off immediately would be
   *                wrong both contractually and UX-wise.
   *
   * States that do NOT grant entitlement:
   *   - ON_HOLD    payment failed past grace
   *   - PAUSED     user paused subscription
   *   - EXPIRED    period ended
   */
  async isPremium(userId: string): Promise<boolean> {
    const sub = await this.prisma.subscription.findUnique({ where: { userId } });
    if (!sub) return false;
    if (sub.status !== 'ACTIVE' && sub.status !== 'GRACE' && sub.status !== 'CANCELED') {
      return false;
    }
    return sub.expiryTime.getTime() > Date.now();
  }

  /** Returns the full subscription row (or null) for the user. Used by /billing/status. */
  async getSubscription(userId: string) {
    return this.prisma.subscription.findUnique({ where: { userId } });
  }

  /** Daily AI Solver quota snapshot for /billing/status. Premium users get
   * `limit: null` (unlimited) but we still surface `used` for informational
   * UI; for free users `limit` is the FREE_TIER_SOLVER_LIMIT constant
   * (single source of truth lives in the guard module). */
  async getSolverQuota(
    userId: string,
  ): Promise<{ used: number; limit: number | null; resetAt: string }> {
    const premium = await this.isPremium(userId);
    const used = await this.quota.getSolverUsed(userId);
    return {
      used,
      limit: premium ? null : FREE_TIER_SOLVER_LIMIT,
      resetAt: this.quota.resetAt().toISOString(),
    };
  }

  /** Maps a raw Play subscriptionsv2 payload to our SubscriptionStatus +
   *  derived fields. Pure function (no I/O), shared by verifyAndRecordPurchase
   *  and verifyAndRecordPurchaseByToken so the two paths can never diverge.
   *
   *  `productIdFallback` is used when the Play payload itself doesn't carry
   *  the productId (rare — usually inferable from lineItems[0]). Caller can
   *  pass the client-asserted productId for the on-purchase path, or the
   *  productId already stored on the local row for the RTDN path. */
  private mapPlaySubscription(
    playSubscription: any,
    productIdFallback: string,
  ): MappedSubscriptionState {
    // Play v2 returns subscriptionState as: SUBSCRIPTION_STATE_ACTIVE,
    // SUBSCRIPTION_STATE_CANCELED, SUBSCRIPTION_STATE_IN_GRACE_PERIOD,
    // SUBSCRIPTION_STATE_ON_HOLD, SUBSCRIPTION_STATE_PAUSED, SUBSCRIPTION_STATE_EXPIRED, ...
    const stateMap: Record<string, SubscriptionStatus> = {
      SUBSCRIPTION_STATE_ACTIVE: 'ACTIVE',
      SUBSCRIPTION_STATE_IN_GRACE_PERIOD: 'GRACE',
      SUBSCRIPTION_STATE_ON_HOLD: 'ON_HOLD',
      SUBSCRIPTION_STATE_PAUSED: 'PAUSED',
      SUBSCRIPTION_STATE_CANCELED: 'CANCELED',
      SUBSCRIPTION_STATE_EXPIRED: 'EXPIRED',
    };
    const playSubscriptionState: string = playSubscription.subscriptionState ?? '';
    const status: SubscriptionStatus = stateMap[playSubscriptionState] ?? 'EXPIRED';

    // Pick the longest expiryTime across all lineItems (Google can return
    // multiple if there are upgrades/downgrades pending).
    const lineItems: any[] = playSubscription.lineItems ?? [];
    const expiryTimes = lineItems
      .map((li: any) => (li.expiryTime ? new Date(li.expiryTime) : null))
      .filter(Boolean) as Date[];
    const expiryTime = expiryTimes.length
      ? new Date(Math.max(...expiryTimes.map((d) => d.getTime())))
      : new Date(0);

    // Intro-offer period: any lineItem currently in offerDetails with basePlanId
    // ending in "-intro" OR with offerTags including "launch-promo-60d".
    const isInIntroOfferPeriod = lineItems.some(
      (li: any) =>
        (li.offerDetails?.offerTags ?? []).includes('launch-promo-60d') ||
        String(li.offerDetails?.basePlanId ?? '').endsWith('-intro'),
    );

    // auto-renewing: latest renewal info on first lineItem.
    const autoRenewing =
      lineItems[0]?.autoRenewingPlan?.autoRenewEnabled ?? (status === 'ACTIVE');

    const orderId: string | undefined =
      playSubscription.latestOrderId ?? playSubscription.linkedPurchaseToken ?? undefined;

    const startTime = playSubscription.startTime
      ? new Date(playSubscription.startTime)
      : new Date();

    const countryCode: string | undefined = playSubscription.regionCode ?? undefined;

    // Prefer Play-asserted productId from first lineItem, fall back to caller.
    const productId: string =
      lineItems[0]?.productId ?? productIdFallback;

    return {
      productId,
      status,
      startTime,
      expiryTime,
      autoRenewing,
      isInIntroOfferPeriod,
      orderId,
      countryCode,
      playSubscriptionState,
    };
  }

  /** Verifies a purchaseToken via Google Play Developer API v3 (subscriptionsv2)
   * and upserts the Subscription row. Audit log is written after upsert so the
   * FK to Subscription is satisfied. Called by the client on a fresh purchase
   * via POST /billing/verify (userId comes from the JWT). */
  async verifyAndRecordPurchase(
    userId: string,
    productId: string,
    purchaseToken: string,
  ): Promise<{ status: SubscriptionStatus; expiryTime: Date; isInIntroOfferPeriod: boolean }> {
    let playSubscription: any;
    try {
      playSubscription = await this.playApi.getSubscription(productId, purchaseToken);
    } catch (e) {
      this.logger.error(`Play API verify failed: ${(e as Error).message}`);
      throw new BadRequestException('Invalid purchase token or Play API unavailable');
    }

    const mapped = this.mapPlaySubscription(playSubscription, productId);

    // Upsert by userId (unique) — different purchaseToken for the same user
    // replaces (e.g. user upgraded or repurchased).
    const sub = await this.prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        productId: mapped.productId,
        purchaseToken,
        orderId: mapped.orderId,
        status: mapped.status,
        startTime: mapped.startTime,
        expiryTime: mapped.expiryTime,
        autoRenewing: mapped.autoRenewing,
        isInIntroOfferPeriod: mapped.isInIntroOfferPeriod,
        countryCode: mapped.countryCode,
      },
      update: {
        productId: mapped.productId,
        purchaseToken,
        orderId: mapped.orderId,
        status: mapped.status,
        startTime: mapped.startTime,
        expiryTime: mapped.expiryTime,
        autoRenewing: mapped.autoRenewing,
        isInIntroOfferPeriod: mapped.isInIntroOfferPeriod,
        countryCode: mapped.countryCode,
      },
    });

    await this.prisma.subscriptionEvent.create({
      data: {
        subscriptionId: sub.id,
        eventType: 'verify',
        payload: {
          playSubscriptionState: mapped.playSubscriptionState,
          productId: mapped.productId,
          purchaseToken: purchaseToken.slice(0, 8) + '...', // truncate — token is sensitive
          derivedStatus: mapped.status,
          expiryTime: mapped.expiryTime.toISOString(),
          isInIntroOfferPeriod: mapped.isInIntroOfferPeriod,
        } as any,
      },
    });

    return {
      status: mapped.status,
      expiryTime: mapped.expiryTime,
      isInIntroOfferPeriod: mapped.isInIntroOfferPeriod,
    };
  }

  /** RTDN entry-point: re-verify a purchaseToken against Play and update the
   *  existing local row. Unlike the on-purchase path we do NOT have a userId
   *  in scope — the RTDN payload doesn't carry one. We look the row up by
   *  purchaseToken (which is `@unique`), so duplicate webhooks are idempotent
   *  at the DB level too.
   *
   *  Returns:
   *    - `{ found: true, ... }` on success.
   *    - `{ found: false }` when no local Subscription row exists for the
   *      token. This happens when an RTDN arrives before the client has
   *      POSTed /billing/verify — we can't link to a user. Caller logs +
   *      audits, but we can't write a SubscriptionEvent (subscriptionId is
   *      a non-null FK), so the audit happens upstream as a plain log line.
   *
   *  `eventType` is passed through to the SubscriptionEvent row so the audit
   *  trail names the RTDN notification (e.g. "rtdn:2" for RENEWED). */
  async verifyAndRecordPurchaseByToken(
    purchaseToken: string,
    eventType: string = 'rtdn',
  ): Promise<
    | { found: false }
    | {
        found: true;
        status: SubscriptionStatus;
        expiryTime: Date;
        isInIntroOfferPeriod: boolean;
      }
  > {
    const existing = await this.prisma.subscription.findUnique({
      where: { purchaseToken },
    });
    if (!existing) {
      this.logger.warn(
        `RTDN for unknown purchaseToken ${purchaseToken.slice(0, 8)}... — no local user mapping yet, skipping.`,
      );
      return { found: false };
    }

    let playSubscription: any;
    try {
      playSubscription = await this.playApi.getSubscription(
        existing.productId,
        purchaseToken,
      );
    } catch (e) {
      this.logger.error(
        `Play API re-verify failed for token ${purchaseToken.slice(0, 8)}...: ${(e as Error).message}`,
      );
      // Don't throw — RTDN handler must return 200 to Pub/Sub. Re-throw as a
      // typed error so the caller can audit + swallow.
      throw new BadRequestException('Play API unavailable for RTDN re-verify');
    }

    const mapped = this.mapPlaySubscription(playSubscription, existing.productId);

    const sub = await this.prisma.subscription.update({
      where: { id: existing.id },
      data: {
        productId: mapped.productId,
        // purchaseToken is unchanged (we looked up by it)
        orderId: mapped.orderId,
        status: mapped.status,
        startTime: mapped.startTime,
        expiryTime: mapped.expiryTime,
        autoRenewing: mapped.autoRenewing,
        isInIntroOfferPeriod: mapped.isInIntroOfferPeriod,
        countryCode: mapped.countryCode,
      },
    });

    await this.prisma.subscriptionEvent.create({
      data: {
        subscriptionId: sub.id,
        eventType,
        payload: {
          playSubscriptionState: mapped.playSubscriptionState,
          productId: mapped.productId,
          purchaseToken: purchaseToken.slice(0, 8) + '...',
          derivedStatus: mapped.status,
          expiryTime: mapped.expiryTime.toISOString(),
          isInIntroOfferPeriod: mapped.isInIntroOfferPeriod,
        } as any,
      },
    });

    return {
      found: true,
      status: mapped.status,
      expiryTime: mapped.expiryTime,
      isInIntroOfferPeriod: mapped.isInIntroOfferPeriod,
    };
  }

  /** Lightweight informational-audit path: write a SubscriptionEvent row
   *  WITHOUT re-querying Play. Used for notification types that don't
   *  warrant a state mutation (e.g. PRICE_CHANGE_CONFIRMED). Returns `false`
   *  if no local Subscription row exists for the token (orphan event). */
  async appendInformationalEvent(
    purchaseToken: string,
    eventType: string,
    payload: Record<string, unknown>,
  ): Promise<boolean> {
    const existing = await this.prisma.subscription.findUnique({
      where: { purchaseToken },
    });
    if (!existing) {
      this.logger.warn(
        `RTDN informational event ${eventType} for unknown token ${purchaseToken.slice(0, 8)}... — skipping audit.`,
      );
      return false;
    }
    await this.prisma.subscriptionEvent.create({
      data: {
        subscriptionId: existing.id,
        eventType,
        payload: {
          ...payload,
          purchaseToken: purchaseToken.slice(0, 8) + '...',
        } as any,
      },
    });
    return true;
  }
}
