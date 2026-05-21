import { Injectable, NotImplementedException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

/**
 * Google Play Billing — Phase 1 skeleton.
 *
 * Phase 1 (this file): entitlement read + verify-on-purchase endpoint shape.
 * Phase 2 (later): wire `googleapis` Android Publisher v3 to actually verify
 * purchaseTokens, ingest RTDN webhooks, and update Subscription rows.
 */
@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService) {}

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

  /** Placeholder for Phase 2 — verifies a purchaseToken via Google Play
   * Developer API and upserts the Subscription row. For now, throw
   * `NotImplementedException` so the controller compiles and the
   * frontend can wire its UI against the endpoint shape. */
  async verifyAndRecordPurchase(
    _userId: string,
    _productId: string,
    _purchaseToken: string,
  ): Promise<never> {
    throw new NotImplementedException(
      'Phase 2 — Google Play Developer API integration not yet wired',
    );
  }
}
