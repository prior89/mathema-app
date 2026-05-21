import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { BillingService } from './billing.service';
import { QuotaService } from './quota.service';

/** Free-tier daily AI Solver call cap. Premium users bypass. Source of
 * truth for the limit number — keep this value in sync with the pricing
 * memory (`project_matheo_pricing_india`). */
export const FREE_TIER_SOLVER_LIMIT = 8;

@Injectable()
export class FreeTierSolverQuotaGuard implements CanActivate {
  constructor(
    private readonly billing: BillingService,
    private readonly quota: QuotaService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<{ user?: { id?: string } }>();
    const userId = req.user?.id;
    if (!userId) return false; // JwtAuthGuard should have run first; defensive.

    // Premium short-circuit — no Redis touch, no counter increment for paid users.
    if (await this.billing.isPremium(userId)) return true;

    const used = await this.quota.incrementSolver(userId);
    if (used > FREE_TIER_SOLVER_LIMIT) {
      throw new ForbiddenException({
        error: 'QuotaExceeded',
        message: `Daily AI Solver limit reached (${FREE_TIER_SOLVER_LIMIT}/day). Upgrade to Premium for unlimited.`,
        limit: FREE_TIER_SOLVER_LIMIT,
        used,
        resetAt: this.quota.resetAt().toISOString(),
        productSuggestion: 'premium_monthly',
      });
    }
    return true;
  }
}
