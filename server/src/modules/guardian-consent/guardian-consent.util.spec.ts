import {
  ageFromBirthDate,
  requiresGuardianConsent,
  resolveConsentMethod,
  GUARDIAN_CONSENT_AGE_THRESHOLD,
} from './guardian-consent.util';

describe('guardian-consent.util', () => {
  const now = new Date('2026-06-11T12:00:00Z');

  it('computes age with birthday not yet reached this year', () => {
    expect(ageFromBirthDate(new Date('2010-12-01'), now)).toBe(15);
  });

  it('requires consent for minors under threshold', () => {
    const birth = new Date('2010-01-01');
    expect(requiresGuardianConsent(birth, now)).toBe(true);
    expect(ageFromBirthDate(birth, now)).toBeLessThan(GUARDIAN_CONSENT_AGE_THRESHOLD);
  });

  it('does not require consent for adults or missing birthDate', () => {
    expect(requiresGuardianConsent(new Date('2000-01-01'), now)).toBe(false);
    expect(requiresGuardianConsent(null, now)).toBe(false);
    expect(requiresGuardianConsent(undefined, now)).toBe(false);
  });

  it('resolves KR email OTP by default', () => {
    const prev = process.env.GUARDIAN_PASS_ENABLED;
    delete process.env.GUARDIAN_PASS_ENABLED;
    expect(resolveConsentMethod('KR')).toBe('KR_EMAIL_OTP');
    process.env.GUARDIAN_PASS_ENABLED = prev;
  });

  it('resolves KR PASS when enabled', () => {
    process.env.GUARDIAN_PASS_ENABLED = 'true';
    expect(resolveConsentMethod('KR')).toBe('KR_PASS');
    delete process.env.GUARDIAN_PASS_ENABLED;
  });

  it('resolves IN email OTP', () => {
    expect(resolveConsentMethod('IN')).toBe('IN_EMAIL_OTP');
  });
});