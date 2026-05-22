import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { BillingService } from './billing.service';
import { QuotaService } from './quota.service';
import { FREE_TIER_SOLVER_LIMIT } from './billing.constants';

// FREE_TIER_SOLVER_LIMIT is re-exported here for legacy consumers
// (analytics, billing.controller, …) that imported it from this path
// before billing.constants.ts existed. Single source of truth lives in
// billing.constants — see the doc comment there for the cycle history.
export { FREE_TIER_SOLVER_LIMIT };

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
