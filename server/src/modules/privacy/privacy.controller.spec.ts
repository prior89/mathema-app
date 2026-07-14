import { PrivacyController } from './privacy.controller';
import { CURRENT_POLICY_VERSION } from './privacy.service';

describe('PrivacyController policy contract', () => {
  it('publishes the current version and the enforced India under-18 guardian threshold', () => {
    const controller = new PrivacyController({} as never);
    const policy = controller.policy('en');
    const children = policy.sections.find((section) => section.heading === 'Children & guardians');

    expect(policy.version).toBe(CURRENT_POLICY_VERSION);
    expect(children?.body).toContain('under 18 (IN)');
    expect(children?.body).not.toContain('under 13');
    expect(children?.body).toContain('guest accounts cannot enable');
  });
});
