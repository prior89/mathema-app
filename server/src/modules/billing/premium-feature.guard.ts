import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BillingService } from './billing.service';
import { PREMIUM_FEATURE_KEY, PremiumFeature } from './premium-feature.decorator';

@Injectable()
export class PremiumFeatureGuard implements CanActivate {
  constructor(
    private readonly billing: BillingService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    if (!this.billing.isBillingUiEnabled()) return true;

    const req = ctx.switchToHttp().getRequest<{ user?: { id?: string } }>();
    const userId = req.user?.id;
    if (!userId) return false;

    if (await this.billing.isPremium(userId)) return true;

    const feature = this.reflector.getAllAndOverride<PremiumFeature | undefined>(
      PREMIUM_FEATURE_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );

    throw new ForbiddenException({
      error: 'PremiumRequired',
      message: 'This feature requires Matheo Premium.',
      feature: feature ?? 'premium',
      productSuggestion: 'premium_monthly',
    });
  }
}