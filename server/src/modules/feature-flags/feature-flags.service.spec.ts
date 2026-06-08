import { ConfigService } from '@nestjs/config';
import { FeatureFlagsService } from './feature-flags.service';

describe('FeatureFlagsService', () => {
  const config = { get: jest.fn() };
  const svc = new FeatureFlagsService(config as unknown as ConfigService);

  beforeEach(() => jest.clearAllMocks());

  it('disables flags when rollout percent is 0', () => {
    config.get.mockReturnValue('0');
    expect(svc.isEnabled('adaptive_diagnostic', 'user-1')).toBe(false);
    expect(svc.getPublicFlags('user-1').adaptive_diagnostic).toBe(false);
  });

  it('enables flags for all users when rollout percent is 100', () => {
    config.get.mockReturnValue('100');
    expect(svc.isEnabled('adaptive_diagnostic')).toBe(true);
    expect(svc.getPublicFlags().adaptive_diagnostic).toBe(true);
  });

  it('buckets users deterministically for partial rollout', () => {
    config.get.mockReturnValue('50');
    const u1 = svc.isEnabled('adaptive_diagnostic', 'user-a');
    const u2 = svc.isEnabled('adaptive_diagnostic', 'user-a');
    expect(u1).toBe(u2);
  });
});