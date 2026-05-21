import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { SubscriptionStatus } from '@prisma/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { PlayApiClient } from './play-api-client.service';

/**
 * Google Play Billing — Phase 2.
 *
 * Phase 1 was a skeleton; Phase 2 wires `googleapis` Android Publisher v3
 * (subscriptionsv2) to actually verify purchaseTokens and upserts the
 * Subscription row. RTDN webhook ingestion is still TODO.
 */
@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly playApi: PlayApiClient,
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

  /** Verifies a purchaseToken via Google Play Developer API v3 (subscriptionsv2)
   * and upserts the Subscription row. Audit log is written after upsert so the
   * FK to Subscription is satisfied. */
  async verifyAndRecordPurchase(
    userId: string,
    productId: string,
    purchaseToken: string,
  ): Promise<{ status: SubscriptionStatus; expiryTime: Date; isInIntroOfferPeriod: boolean }> {
    // 1. Call Play Developer API.
    let playSubscription: any;
    try {
      playSubscription = await this.playApi.getSubscription(productId, purchaseToken);
    } catch (e) {
      this.logger.error(`Play API verify failed: ${(e as Error).message}`);
      throw new BadRequestException('Invalid purchase token or Play API unavailable');
    }

    // 2. Map Play subscription state -> our SubscriptionStatus enum.
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
    const status: SubscriptionStatus =
      stateMap[playSubscription.subscriptionState as string] ?? 'EXPIRED';

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

    // Optional fields from regionalPriceMigrationConfig / regionCode etc.
    const countryCode: string | undefined = playSubscription.regionCode ?? undefined;

    // 3. Upsert Subscription row by userId (unique). Different purchaseToken
    // for the same user replaces (e.g. user upgraded or repurchased).
    const sub = await this.prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        productId,
        purchaseToken,
        orderId,
        status,
        startTime,
        expiryTime,
        autoRenewing,
        isInIntroOfferPeriod,
        countryCode,
      },
      update: {
        productId,
        purchaseToken,
        orderId,
        status,
        startTime,
        expiryTime,
        autoRenewing,
        isInIntroOfferPeriod,
        countryCode,
      },
    });

    // 4. Audit log.
    await this.prisma.subscriptionEvent.create({
      data: {
        subscriptionId: sub.id,
        eventType: 'verify',
        payload: {
          playSubscriptionState: playSubscription.subscriptionState,
          productId,
          purchaseToken: purchaseToken.slice(0, 8) + '...', // truncate — token is sensitive
          derivedStatus: status,
          expiryTime: expiryTime.toISOString(),
          isInIntroOfferPeriod,
        } as any,
      },
    });

    return { status, expiryTime, isInIntroOfferPeriod };
  }
}
