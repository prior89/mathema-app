import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { BillingService } from './billing.service';
import { VerifyPurchaseDto } from './dto/verify-purchase.dto';

@UseGuards(JwtAuthGuard)
@Controller('billing')
export class BillingController {
  constructor(private readonly billing: BillingService) {}

  /** Current entitlement + minimal subscription summary for UI gating.
   * Also includes the daily AI Solver quota snapshot so the client can
   * render `5/8 used today` style indicators without a second round-trip. */
  @Get('status')
  async status(@CurrentUser('id') userId: string) {
    const [entitlement, sub, solverQuota] = await Promise.all([
      this.billing.getEntitlement(userId),
      this.billing.getSubscription(userId),
      this.billing.getSolverQuota(userId),
    ]);
    return {
      premium: entitlement.premium,
      entitlement,
      subscription: sub
        ? {
            productId: sub.productId,
            status: sub.status,
            expiryTime: sub.expiryTime,
            autoRenewing: sub.autoRenewing,
            isInIntroOfferPeriod: sub.isInIntroOfferPeriod,
          }
        : null,
      quota: { solver: solverQuota },
      monetization: this.billing.getMonetizationStrategy(),
      billingUiEnabled: this.billing.isBillingUiEnabled(),
    };
  }

  /** One-time cardless Premium Preview.
   *
   * Launch strategy: let learners feel the full loop first, then ask for Play
   * Billing only at a value moment. This is separate from Google Play free
   * trials, which remain available later as an A/B-testable offer.
   */
  @Post('preview/start')
  @HttpCode(200)
  async startPreview(@CurrentUser('id') userId: string) {
    return this.billing.startPremiumPreview(userId);
  }

  /** Client posts the Play purchaseToken after a successful purchase.
   * Phase 1: throws NotImplemented; Phase 2 will verify via Google API and
   * upsert the Subscription row. */
  @Post('verify')
  @HttpCode(200)
  async verify(
    @CurrentUser('id') userId: string,
    @Body() dto: VerifyPurchaseDto,
  ) {
    return this.billing.verifyAndRecordPurchase(userId, dto.productId, dto.purchaseToken);
  }
}
