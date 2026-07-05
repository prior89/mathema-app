import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { BillingService } from './billing.service';
import { QuotaService } from './quota.service';
import { FREE_TIER_OCR_DAILY_LIMIT } from './billing.constants';

// Loose daily ceiling for the OCR-only endpoint (/math-helper/ocr). Unlike
// FreeTierSolverQuotaGuard this does NOT touch the solver credit — OCR has its
// own key namespace so a retake never costs a solve. Its only job is to stop a
// logged-in client (incl. zero-PII guests) from looping the paid Mathpix +
// GPT-vision OCR path unboundedly. Premium bypasses, matching the solver guard.
@Injectable()
export class OcrDailyQuotaGuard implements CanActivate {
  constructor(
    private readonly billing: BillingService,
    private readonly quota: QuotaService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<{ user?: { id?: string } }>();
    const userId = req.user?.id;
    if (!userId) return false; // JwtAuthGuard should have run first; defensive.

    // Premium short-circuit — no Redis touch, no counter increment.
    if (await this.billing.isPremium(userId)) return true;

    const used = await this.quota.incrementOcr(userId);
    if (used > FREE_TIER_OCR_DAILY_LIMIT) {
      throw new ForbiddenException({
        error: 'OcrQuotaExceeded',
        message: `Daily image-scan limit reached (${FREE_TIER_OCR_DAILY_LIMIT}/day). Upgrade to Premium for unlimited.`,
        limit: FREE_TIER_OCR_DAILY_LIMIT,
        used,
        resetAt: this.quota.resetAt().toISOString(),
        productSuggestion: 'premium_monthly',
      });
    }
    return true;
  }
}
