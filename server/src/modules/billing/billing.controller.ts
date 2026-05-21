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
    const [premium, sub, solverQuota] = await Promise.all([
      this.billing.isPremium(userId),
      this.billing.getSubscription(userId),
      this.billing.getSolverQuota(userId),
    ]);
    return {
      premium,
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
    };
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
