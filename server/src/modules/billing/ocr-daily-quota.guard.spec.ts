import { ExecutionContext } from '@nestjs/common';
import { OcrDailyQuotaGuard } from './ocr-daily-quota.guard';
import { FREE_TIER_OCR_DAILY_LIMIT } from './billing.constants';

function mockCtx(userId?: string): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ user: userId ? { id: userId } : undefined }),
    }),
  } as ExecutionContext;
}

function mockBilling(isPremium: boolean) {
  return { isPremium: jest.fn().mockResolvedValue(isPremium) };
}

function mockQuota(used: number) {
  return {
    incrementOcr: jest.fn().mockResolvedValue(used),
    resetAt: jest.fn().mockReturnValue(new Date('2026-01-02T00:00:00.000Z')),
  };
}

describe('OcrDailyQuotaGuard', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns false when user id is missing', async () => {
    const guard = new OcrDailyQuotaGuard(mockBilling(false) as any, mockQuota(1) as any);
    await expect(guard.canActivate(mockCtx())).resolves.toBe(false);
  });

  it('lets premium through without touching the counter', async () => {
    const billing = mockBilling(true);
    const quota = mockQuota(0);
    const guard = new OcrDailyQuotaGuard(billing as any, quota as any);
    await expect(guard.canActivate(mockCtx('u1'))).resolves.toBe(true);
    expect(quota.incrementOcr).not.toHaveBeenCalled();
  });

  it('allows a free user at the limit', async () => {
    const guard = new OcrDailyQuotaGuard(
      mockBilling(false) as any,
      mockQuota(FREE_TIER_OCR_DAILY_LIMIT) as any,
    );
    await expect(guard.canActivate(mockCtx('u1'))).resolves.toBe(true);
  });

  it('blocks a free user past the limit with OcrQuotaExceeded', async () => {
    const guard = new OcrDailyQuotaGuard(
      mockBilling(false) as any,
      mockQuota(FREE_TIER_OCR_DAILY_LIMIT + 1) as any,
    );
    await expect(guard.canActivate(mockCtx('u1'))).rejects.toMatchObject({
      response: {
        error: 'OcrQuotaExceeded',
        limit: FREE_TIER_OCR_DAILY_LIMIT,
        productSuggestion: 'premium_monthly',
      },
    });
  });
});
