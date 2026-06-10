import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PremiumFeatureGuard } from './premium-feature.guard';
import { PREMIUM_FEATURE_KEY } from './premium-feature.decorator';

function mockCtx(userId?: string): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ user: userId ? { id: userId } : undefined }),
    }),
    getHandler: () => ({}),
    getClass: () => ({}),
  } as ExecutionContext;
}

function mockBilling(isBillingUiEnabled: boolean, isPremium: boolean) {
  return {
    isBillingUiEnabled: jest.fn().mockReturnValue(isBillingUiEnabled),
    isPremium: jest.fn().mockResolvedValue(isPremium),
  };
}

describe('PremiumFeatureGuard', () => {
  const ORIG = process.env.BILLING_UI_ENABLED;

  afterEach(() => {
    process.env.BILLING_UI_ENABLED = ORIG;
    jest.clearAllMocks();
  });

  it('allows when billing UI is disabled (PoC / IT mode)', async () => {
    const billing = mockBilling(false, false);
    const reflector = new Reflector();
    const guard = new PremiumFeatureGuard(billing as any, reflector);
    await expect(guard.canActivate(mockCtx('u1'))).resolves.toBe(true);
    expect(billing.isPremium).not.toHaveBeenCalled();
  });

  it('allows premium users when billing is on', async () => {
    const billing = mockBilling(true, true);
    const reflector = new Reflector();
    const guard = new PremiumFeatureGuard(billing as any, reflector);
    await expect(guard.canActivate(mockCtx('u1'))).resolves.toBe(true);
  });

  it('blocks free users with PremiumRequired payload', async () => {
    const billing = mockBilling(true, false);
    const reflector = new Reflector();
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue('weekly_reports');
    const guard = new PremiumFeatureGuard(billing as any, reflector);

    await expect(guard.canActivate(mockCtx('u1'))).rejects.toMatchObject({
      response: {
        error: 'PremiumRequired',
        feature: 'weekly_reports',
        productSuggestion: 'premium_monthly',
      },
    });
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(
      PREMIUM_FEATURE_KEY,
      expect.any(Array),
    );
  });

  it('returns false when user id is missing', async () => {
    const billing = mockBilling(true, false);
    const guard = new PremiumFeatureGuard(billing as any, new Reflector());
    await expect(guard.canActivate(mockCtx())).resolves.toBe(false);
  });
});