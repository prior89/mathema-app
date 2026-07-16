import { GUARDS_METADATA } from '@nestjs/common/constants';
import { PREMIUM_FEATURE_KEY } from '../billing/premium-feature.decorator';
import { PremiumFeatureGuard } from '../billing/premium-feature.guard';
import { ReportsController } from './reports.controller';

describe('ReportsController premium boundaries', () => {
  const premiumWeeklyMethods = [
    'generate',
    'weeklyList',
    'weeklyById',
    'current',
    'timeVsAccuracy',
    'nextFocus',
    'achievements',
    'byWeek',
  ] as const;

  it.each(premiumWeeklyMethods)('%s requires weekly_reports entitlement', (method) => {
    const handler = ReportsController.prototype[method];
    const guards = Reflect.getMetadata(GUARDS_METADATA, handler) ?? [];

    expect(Reflect.getMetadata(PREMIUM_FEATURE_KEY, handler)).toBe('weekly_reports');
    expect(guards).toContain(PremiumFeatureGuard);
  });

  it('keeps calibration available without the weekly-report entitlement', () => {
    const handler = ReportsController.prototype.calibration;
    const guards = Reflect.getMetadata(GUARDS_METADATA, handler) ?? [];

    expect(Reflect.getMetadata(PREMIUM_FEATURE_KEY, handler)).toBeUndefined();
    expect(guards).not.toContain(PremiumFeatureGuard);
  });
});
