import { Injectable, Logger, BadRequestException, ConflictException } from '@nestjs/common';
import { SubscriptionStatus } from '@prisma/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import {
  MONETIZATION_STRATEGY,
  PREMIUM_PREVIEW_DAYS,
  PREMIUM_PREVIEW_PRODUCT_ID,
} from './billing.constants';
import { ObfuscatedAccountService } from './obfuscated-account.service';
import { PlayApiClient } from './play-api-client.service';
import { QuotaService } from './quota.service';
import { RtdnRetryableError } from './rtdn.errors';

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
  linkedPurchaseToken?: string;
  countryCode?: string;
  playSubscriptionState: string;
  playAcknowledgementState?: string;
}

type VerifyPurchaseResult = {
  status: SubscriptionStatus;
  expiryTime: Date;
  isInIntroOfferPeriod: boolean;
  acknowledged: boolean;
  acknowledgedAt: Date | null;
};

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
    private readonly obfuscatedAccount: ObfuscatedAccountService,
  ) {}

  /** HMAC obfuscated id for BillingFlowParams.setObfuscatedAccountId (Android). */
  getObfuscatedAccountIdForUser(userId: string): string {
    return this.obfuscatedAccount.forUser(userId);
  }

  getMonetizationStrategy() {
    return MONETIZATION_STRATEGY;
  }

  /** Runtime switch: flip BILLING_UI_ENABLED=true on the backend to expose
   *  paywall / upgrade CTAs without an app rebuild. Defaults off (v1.0 free). */
  isBillingUiEnabled(): boolean {
    const raw = process.env.BILLING_UI_ENABLED ?? '';
    return raw === 'true' || raw === '1';
  }

  private isEntitled(sub: {
    status: SubscriptionStatus;
    expiryTime: Date;
  } | null): boolean {
    if (!sub) return false;
    if (sub.status !== 'ACTIVE' && sub.status !== 'GRACE' && sub.status !== 'CANCELED') {
      return false;
    }
    return sub.expiryTime.getTime() > Date.now();
  }

  private isPreviewProduct(productId: string | null | undefined): boolean {
    return productId === PREMIUM_PREVIEW_PRODUCT_ID;
  }

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
    return this.isEntitled(sub);
  }

  /** Returns the full subscription row (or null) for the user. Used by /billing/status. */
  async getSubscription(userId: string) {
    return this.prisma.subscription.findUnique({ where: { userId } });
  }

  async getEntitlement(userId: string) {
    const sub = await this.getSubscription(userId);
    const premium = this.isEntitled(sub);
    const preview = this.isPreviewProduct(sub?.productId);
    return {
      premium,
      tier: premium ? 'PREMIUM' : 'FREE',
      source: premium ? (preview ? 'PREVIEW' : 'PLAY') : null,
      preview: preview
        ? {
            active: premium,
            startedAt: sub?.startTime.toISOString() ?? null,
            expiresAt: sub?.expiryTime.toISOString() ?? null,
            days: PREMIUM_PREVIEW_DAYS,
          }
        : null,
      previewEligibility: {
        eligible: !sub,
        reason: !sub
          ? null
          : preview
            ? 'preview_already_used'
            : 'subscription_history_exists',
      },
    };
  }

  /** Daily AI Solver quota snapshot for /billing/status. Premium users get
   * `limit: null` (unlimited) but we still surface `used` for informational
   * UI; free users get a dynamic limit (16/day during the first 7 days after
   * signup, then 8/day). */
  async getSolverQuota(userId: string): Promise<{
    used: number;
    limit: number | null;
    resetAt: string;
    inGrace: boolean;
    graceEndsAt: string | null;
  }> {
    const premium = await this.isPremium(userId);
    const used = await this.quota.getSolverUsed(userId);
    if (premium) {
      return {
        used,
        limit: null,
        resetAt: this.quota.resetAt().toISOString(),
        inGrace: false,
        graceEndsAt: null,
      };
    }
    const grace = await this.quota.getSolverGraceState(userId);
    return {
      used,
      limit: grace.limit,
      resetAt: this.quota.resetAt().toISOString(),
      inGrace: grace.inGrace,
      graceEndsAt: grace.inGrace ? grace.graceEndsAt.toISOString() : null,
    };
  }

  /** Cardless Premium Preview.
   *
   * One-time launch preview: no Play Billing purchase token and no payment
   * method. It uses the existing Subscription row as an entitlement ledger so
   * all existing `isPremium()` gates work without a schema change.
   */
  async startPremiumPreview(userId: string): Promise<{
    premium: true;
    productId: string;
    expiryTime: Date;
  }> {
    const existing = await this.getSubscription(userId);
    if (existing) {
      throw new ConflictException({
        code: this.isPreviewProduct(existing.productId)
          ? 'premium_preview_already_used'
          : 'premium_preview_not_available',
        message: 'Premium Preview is available once per account before any subscription.',
      });
    }

    const now = new Date();
    const expiryTime = new Date(now.getTime() + PREMIUM_PREVIEW_DAYS * 24 * 60 * 60 * 1000);
    const sub = await this.prisma.subscription.create({
      data: {
        userId,
        productId: PREMIUM_PREVIEW_PRODUCT_ID,
        purchaseToken: `preview:${userId}`,
        orderId: null,
        status: 'ACTIVE',
        startTime: now,
        expiryTime,
        autoRenewing: false,
        isInIntroOfferPeriod: false,
        countryCode: null,
      },
    });

    await this.prisma.subscriptionEvent.create({
      data: {
        subscriptionId: sub.id,
        eventType: 'preview.start',
        payload: {
          productId: PREMIUM_PREVIEW_PRODUCT_ID,
          days: PREMIUM_PREVIEW_DAYS,
          expiryTime: expiryTime.toISOString(),
          paymentMethodRequired: false,
        } as any,
      },
    });

    return { premium: true, productId: PREMIUM_PREVIEW_PRODUCT_ID, expiryTime };
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

    const orderId: string | undefined = playSubscription.latestOrderId ?? undefined;
    const linkedPurchaseToken: string | undefined =
      playSubscription.linkedPurchaseToken ?? undefined;
    const playAcknowledgementState: string | undefined =
      playSubscription.acknowledgementState ?? undefined;

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
      linkedPurchaseToken,
      countryCode,
      playSubscriptionState,
      playAcknowledgementState,
    };
  }

  private assertPlayPurchaseReady(playSubscription: any): void {
    const state = String(playSubscription?.subscriptionState ?? '');
    if (state.includes('PENDING')) {
      throw new BadRequestException(
        'Purchase is still pending — wait until Google confirms payment before verifying',
      );
    }
  }

  /** Bind purchase token + optional Play obfuscated account id to JWT user. */
  private async assertPurchaseAccountBinding(
    userId: string,
    playSubscription: any,
    purchaseToken: string,
  ): Promise<'matched' | 'legacy_no_id'> {
    const byToken = await this.prisma.subscription.findUnique({
      where: { purchaseToken },
    });
    if (byToken && byToken.userId !== userId) {
      throw new ConflictException({
        error: 'PurchaseTokenConflict',
        message: 'This Google Play purchase is already linked to another Matheo account.',
      });
    }

    const playId: string | null =
      playSubscription?.externalAccountIdentifiers?.obfuscatedExternalAccountId ?? null;

    if (!playId) {
      return 'legacy_no_id';
    }

    if (!this.obfuscatedAccount.isConfigured()) {
      this.logger.warn(
        'Play returned obfuscatedExternalAccountId but PLAY_OBFUSCATED_ACCOUNT_SECRET is unset',
      );
      return 'legacy_no_id';
    }

    const expected = this.obfuscatedAccount.forUser(userId);
    if (playId !== expected) {
      throw new ConflictException({
        error: 'AccountBindingMismatch',
        message: 'Purchase account identifier does not match the signed-in Matheo user.',
      });
    }

    return 'matched';
  }

  /** Resolve a subscription row for RTDN / voided paths (token history included). */
  private async findSubscriptionForRtdn(purchaseToken: string, orderId?: string) {
    const byToken = await this.prisma.subscription.findUnique({
      where: { purchaseToken },
    });
    if (byToken) return byToken;

    const byHistory = await this.prisma.subscriptionPurchaseToken.findUnique({
      where: { purchaseToken },
      include: { subscription: true },
    });
    if (byHistory) return byHistory.subscription;

    if (orderId) {
      const byOrder = await this.prisma.subscription.findFirst({
        where: { orderId },
      });
      if (byOrder) return byOrder;
    }

    return this.prisma.subscription.findFirst({
      where: { linkedPurchaseToken: purchaseToken },
    });
  }

  /** When RTDN targets a superseded token, re-query Play with the current token. */
  private async resolveAuthoritativePurchaseToken(
    sub: { purchaseToken: string; productId: string },
    eventToken: string,
  ): Promise<{ productId: string; token: string }> {
    if (sub.purchaseToken === eventToken) {
      return { productId: sub.productId, token: eventToken };
    }
    const hist = await this.prisma.subscriptionPurchaseToken.findUnique({
      where: { purchaseToken: eventToken },
    });
    if (hist?.supersededAt) {
      return { productId: sub.productId, token: sub.purchaseToken };
    }
    return { productId: sub.productId, token: eventToken };
  }

  private async recordPurchaseTokenHistory(
    subscriptionId: string,
    previousToken: string | null,
    newToken: string,
    productId: string,
    linkedFromToken?: string,
  ): Promise<void> {
    if (previousToken && previousToken !== newToken) {
      await this.prisma.subscriptionPurchaseToken.upsert({
        where: { purchaseToken: previousToken },
        create: {
          subscriptionId,
          purchaseToken: previousToken,
          productId,
          supersededAt: new Date(),
        },
        update: { supersededAt: new Date() },
      });
    }

    await this.prisma.subscriptionPurchaseToken.upsert({
      where: { purchaseToken: newToken },
      create: {
        subscriptionId,
        purchaseToken: newToken,
        productId,
        linkedFromToken:
          linkedFromToken ?? (previousToken && previousToken !== newToken ? previousToken : null),
      },
      update: {
        productId,
        linkedFromToken:
          linkedFromToken ?? (previousToken && previousToken !== newToken ? previousToken : undefined),
      },
    });
  }

  private subscriptionRowData(mapped: MappedSubscriptionState, purchaseToken: string) {
    return {
      productId: mapped.productId,
      purchaseToken,
      orderId: mapped.orderId,
      linkedPurchaseToken: mapped.linkedPurchaseToken,
      status: mapped.status,
      startTime: mapped.startTime,
      expiryTime: mapped.expiryTime,
      autoRenewing: mapped.autoRenewing,
      isInIntroOfferPeriod: mapped.isInIntroOfferPeriod,
      countryCode: mapped.countryCode,
    };
  }

  private async ensureServerAcknowledgement(
    subscriptionId: string,
    mapped: MappedSubscriptionState,
    purchaseToken: string,
  ): Promise<{ acknowledged: boolean; acknowledgedAt: Date | null; acknowledgementState: string }> {
    const alreadyAcked =
      mapped.playAcknowledgementState === 'ACKNOWLEDGEMENT_STATE_ACKNOWLEDGED';

    if (alreadyAcked) {
      const now = new Date();
      await this.prisma.subscription.update({
        where: { id: subscriptionId },
        data: {
          acknowledgedAt: now,
          acknowledgementState: 'ACKNOWLEDGED',
        },
      });
      return { acknowledged: true, acknowledgedAt: now, acknowledgementState: 'ACKNOWLEDGED' };
    }

    try {
      await this.playApi.acknowledgeSubscription(mapped.productId, purchaseToken);
      const now = new Date();
      await this.prisma.subscription.update({
        where: { id: subscriptionId },
        data: {
          acknowledgedAt: now,
          acknowledgementState: 'ACKNOWLEDGED',
        },
      });
      return { acknowledged: true, acknowledgedAt: now, acknowledgementState: 'ACKNOWLEDGED' };
    } catch (e) {
      this.logger.error(
        `Server acknowledge failed for ${mapped.productId} token ${purchaseToken.slice(0, 8)}...: ${(e as Error).message}`,
      );
      await this.prisma.subscription.update({
        where: { id: subscriptionId },
        data: { acknowledgementState: 'FAILED' },
      });
      return { acknowledged: false, acknowledgedAt: null, acknowledgementState: 'FAILED' };
    }
  }

  /** Verifies a purchaseToken via Google Play Developer API v3 (subscriptionsv2)
   * and upserts the Subscription row. Audit log is written after upsert so the
   * FK to Subscription is satisfied. Called by the client on a fresh purchase
   * via POST /billing/verify (userId comes from the JWT). */
  async verifyAndRecordPurchase(
    userId: string,
    productId: string,
    purchaseToken: string,
  ): Promise<VerifyPurchaseResult> {
    let playSubscription: any;
    try {
      playSubscription = await this.playApi.getSubscription(productId, purchaseToken);
    } catch (e) {
      this.logger.error(`Play API verify failed: ${(e as Error).message}`);
      throw new BadRequestException('Invalid purchase token or Play API unavailable');
    }

    this.assertPlayPurchaseReady(playSubscription);
    const binding = await this.assertPurchaseAccountBinding(
      userId,
      playSubscription,
      purchaseToken,
    );
    const mapped = this.mapPlaySubscription(playSubscription, productId);
    const priorSub = await this.prisma.subscription.findUnique({ where: { userId } });

    const sub = await this.prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        ...this.subscriptionRowData(mapped, purchaseToken),
        acknowledgementState:
          mapped.playAcknowledgementState === 'ACKNOWLEDGEMENT_STATE_ACKNOWLEDGED'
            ? 'ACKNOWLEDGED'
            : 'PENDING',
      },
      update: this.subscriptionRowData(mapped, purchaseToken),
    });

    await this.recordPurchaseTokenHistory(
      sub.id,
      priorSub?.purchaseToken ?? null,
      purchaseToken,
      mapped.productId,
      mapped.linkedPurchaseToken,
    );

    await this.prisma.subscriptionEvent.create({
      data: {
        subscriptionId: sub.id,
        eventType: 'verify',
        payload: {
          playSubscriptionState: mapped.playSubscriptionState,
          productId: mapped.productId,
          purchaseToken: purchaseToken.slice(0, 8) + '...',
          derivedStatus: mapped.status,
          expiryTime: mapped.expiryTime.toISOString(),
          isInIntroOfferPeriod: mapped.isInIntroOfferPeriod,
          accountBinding: binding,
        } as any,
      },
    });

    const ack = await this.ensureServerAcknowledgement(sub.id, mapped, purchaseToken);

    return {
      status: mapped.status,
      expiryTime: mapped.expiryTime,
      isInIntroOfferPeriod: mapped.isInIntroOfferPeriod,
      acknowledged: ack.acknowledged,
      acknowledgedAt: ack.acknowledgedAt,
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
    const existing = await this.findSubscriptionForRtdn(purchaseToken);
    if (!existing) {
      this.logger.warn(
        `RTDN for unknown purchaseToken ${purchaseToken.slice(0, 8)}... — no local user mapping yet, skipping.`,
      );
      return { found: false };
    }

    const authToken = await this.resolveAuthoritativePurchaseToken(existing, purchaseToken);

    let playSubscription: any;
    try {
      playSubscription = await this.playApi.getSubscription(
        authToken.productId,
        authToken.token,
      );
    } catch (e) {
      this.logger.error(
        `Play API re-verify failed for token ${purchaseToken.slice(0, 8)}...: ${(e as Error).message}`,
      );
      throw new RtdnRetryableError(
        `Play API unavailable for RTDN re-verify: ${(e as Error).message}`,
      );
    }

    const mapped = this.mapPlaySubscription(playSubscription, authToken.productId);
    const rowToken = authToken.token;

    const sub = await this.prisma.subscription.update({
      where: { id: existing.id },
      data: this.subscriptionRowData(mapped, rowToken),
    });

    if (existing.purchaseToken !== rowToken) {
      await this.recordPurchaseTokenHistory(
        sub.id,
        existing.purchaseToken,
        rowToken,
        mapped.productId,
        mapped.linkedPurchaseToken,
      );
    }

    await this.prisma.subscriptionEvent.create({
      data: {
        subscriptionId: sub.id,
        eventType,
        payload: {
          playSubscriptionState: mapped.playSubscriptionState,
          productId: mapped.productId,
          purchaseToken: purchaseToken.slice(0, 8) + '...',
          authoritativeToken:
            authToken.token !== purchaseToken ? authToken.token.slice(0, 8) + '...' : undefined,
          derivedStatus: mapped.status,
          expiryTime: mapped.expiryTime.toISOString(),
          isInIntroOfferPeriod: mapped.isInIntroOfferPeriod,
        } as any,
      },
    });

    await this.ensureServerAcknowledgement(sub.id, mapped, rowToken);

    return {
      found: true,
      status: mapped.status,
      expiryTime: mapped.expiryTime,
      isInIntroOfferPeriod: mapped.isInIntroOfferPeriod,
    };
  }

  /** Voided purchase RTDN: re-query Play API before revoking entitlement. */
  async handleVoidedPurchase(
    purchaseToken: string,
    orderId: string | undefined,
    eventType: string,
    voidedMeta: Record<string, unknown>,
  ): Promise<{ found: boolean; revoked: boolean }> {
    const existing = await this.findSubscriptionForRtdn(purchaseToken, orderId);
    if (!existing) {
      this.logger.warn(
        `Voided RTDN for unknown purchaseToken ${purchaseToken.slice(0, 8)}... — orphan.`,
      );
      return { found: false, revoked: false };
    }

    let playSubscription: any;
    try {
      playSubscription = await this.playApi.getSubscription(
        existing.productId,
        purchaseToken,
      );
    } catch (e) {
      throw new RtdnRetryableError(
        `Play API voided re-verify failed: ${(e as Error).message}`,
      );
    }

    const mapped = this.mapPlaySubscription(playSubscription, existing.productId);
    const stillEntitled = this.isEntitled({
      status: mapped.status,
      expiryTime: mapped.expiryTime,
    });

    if (stillEntitled) {
      this.logger.warn(
        `Voided RTDN but Play API still entitled (state=${mapped.playSubscriptionState}) — no revoke`,
      );
      await this.prisma.subscriptionEvent.create({
        data: {
          subscriptionId: existing.id,
          eventType,
          payload: {
            ...voidedMeta,
            playSubscriptionState: mapped.playSubscriptionState,
            derivedStatus: mapped.status,
            revoked: false,
            purchaseToken: purchaseToken.slice(0, 8) + '...',
          } as any,
        },
      });
      return { found: true, revoked: false };
    }

    const sub = await this.prisma.subscription.update({
      where: { id: existing.id },
      data: this.subscriptionRowData(mapped, purchaseToken),
    });

    await this.prisma.subscriptionEvent.create({
      data: {
        subscriptionId: sub.id,
        eventType,
        payload: {
          ...voidedMeta,
          playSubscriptionState: mapped.playSubscriptionState,
          derivedStatus: mapped.status,
          revoked: true,
          purchaseToken: purchaseToken.slice(0, 8) + '...',
        } as any,
      },
    });

    return { found: true, revoked: true };
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
    const existing = await this.findSubscriptionForRtdn(purchaseToken);
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
