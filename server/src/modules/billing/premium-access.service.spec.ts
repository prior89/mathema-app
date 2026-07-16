import { PremiumAccessService } from './premium-access.service';
import { FREE_TIER_MASTERY_PROBLEMS } from './billing.constants';

function mockBilling(isBillingUiEnabled: boolean, isPremium: boolean) {
  return {
    isBillingUiEnabled: jest.fn().mockReturnValue(isBillingUiEnabled),
    isPremium: jest.fn().mockResolvedValue(isPremium),
  };
}

describe('PremiumAccessService', () => {
  it('effectiveMasterySetIds returns full set when gating is off', async () => {
    const billing = mockBilling(false, false);
    const svc = new PremiumAccessService(billing as any);
    const ids = Array.from({ length: 20 }, (_, i) => `p${i}`);
    await expect(svc.effectiveMasterySetIds('u1', ids)).resolves.toEqual(ids);
  });

  it('effectiveMasterySetIds slices to free tier cap for non-premium users', async () => {
    const billing = mockBilling(true, false);
    const svc = new PremiumAccessService(billing as any);
    const ids = Array.from({ length: 20 }, (_, i) => `p${i}`);
    const out = await svc.effectiveMasterySetIds('u1', ids);
    expect(out).toHaveLength(FREE_TIER_MASTERY_PROBLEMS);
    expect(out).toEqual(ids.slice(0, FREE_TIER_MASTERY_PROBLEMS));
  });

  it('redactInsightJson nulls insight for free users when billing is on', async () => {
    const billing = mockBilling(true, false);
    const svc = new PremiumAccessService(billing as any);
    const note = { id: 'n1', insightJson: { summary: 'x' } };
    await expect(svc.redactInsightJson('u1', note)).resolves.toEqual({
      id: 'n1',
      insightJson: null,
    });
  });

  it('redactInsightJson preserves insight for premium users', async () => {
    const billing = mockBilling(true, true);
    const svc = new PremiumAccessService(billing as any);
    const note = { id: 'n1', insightJson: { summary: 'x' } };
    await expect(svc.redactInsightJson('u1', note)).resolves.toEqual(note);
  });

  it('requirePremiumAccess allows access when gating is off', async () => {
    const billing = mockBilling(false, false);
    const svc = new PremiumAccessService(billing as any);

    await expect(svc.requirePremiumAccess('student-1', 'weekly_reports')).resolves.toBeUndefined();
    expect(billing.isPremium).not.toHaveBeenCalled();
  });

  it('requirePremiumAccess returns the standard PremiumRequired contract', async () => {
    const billing = mockBilling(true, false);
    const svc = new PremiumAccessService(billing as any);

    await expect(
      svc.requirePremiumAccess('student-1', 'weekly_reports'),
    ).rejects.toMatchObject({
      response: {
        error: 'PremiumRequired',
        feature: 'weekly_reports',
        productSuggestion: 'premium_monthly',
      },
    });
    expect(billing.isPremium).toHaveBeenCalledWith('student-1');
  });
});
