import { PrivacyController } from './privacy.controller';
import { CURRENT_POLICY_VERSION } from './privacy.service';

describe('PrivacyController policy contract', () => {
  it('publishes the current version and the Korean under-14 guardian threshold', () => {
    const controller = new PrivacyController({} as never);
    const policy = controller.policy('en');
    const children = policy.sections.find((section) => section.heading === 'Children & guardians');

    expect(policy.version).toBe(CURRENT_POLICY_VERSION);
    expect(children?.body).toContain('under 14 in Korea');
    expect(children?.body).not.toContain('under 18 (IN)');
    expect(children?.body).toContain('guest accounts cannot enable');
  });
});
