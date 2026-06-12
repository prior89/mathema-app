import {
  ageFromBirthDate,
  requiresGuardianConsent,
  requiresGuardianConsentFromAge,
  resolveConsentMethod,
  GUARDIAN_CONSENT_AGE_THRESHOLD_DEFAULT,
  GUARDIAN_CONSENT_AGE_THRESHOLD_KR,
} from './guardian-consent.util';

describe('guardian-consent.util', () => {
  const now = new Date('2026-06-11T12:00:00Z');

  it('computes age with birthday not yet reached this year', () => {
    expect(ageFromBirthDate(new Date('2014-12-01'), now)).toBe(11);
  });

  it('requires consent under 13 for IN/default (COPPA / Duolingo-style)', () => {
    expect(requiresGuardianConsent(new Date('2014-06-01'), 'IN', now)).toBe(true); // 12
    expect(requiresGuardianConsent(new Date('2013-06-01'), 'IN', now)).toBe(false); // 13
    expect(requiresGuardianConsentFromAge(12, 'IN')).toBe(true);
    expect(requiresGuardianConsentFromAge(13, 'IN')).toBe(false);
    expect(ageFromBirthDate(new Date('2014-01-01'), now)).toBeLessThan(GUARDIAN_CONSENT_AGE_THRESHOLD_DEFAULT);
  });

  it('requires consent under 14 for KR (PIPA)', () => {
    expect(requiresGuardianConsent(new Date('2013-06-01'), 'KR', now)).toBe(true); // 13
    expect(requiresGuardianConsent(new Date('2012-06-01'), 'KR', now)).toBe(false); // 14
    expect(requiresGuardianConsentFromAge(13, 'KR')).toBe(true);
    expect(requiresGuardianConsentFromAge(14, 'KR')).toBe(false);
    expect(GUARDIAN_CONSENT_AGE_THRESHOLD_KR).toBe(14);
  });

  it('does not require consent for teens/adults or missing birthDate', () => {
    expect(requiresGuardianConsent(new Date('2010-01-01'), 'IN', now)).toBe(false);
    expect(requiresGuardianConsent(new Date('2000-01-01'), 'KR', now)).toBe(false);
    expect(requiresGuardianConsent(null, 'IN', now)).toBe(false);
    expect(requiresGuardianConsent(undefined, 'KR', now)).toBe(false);
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