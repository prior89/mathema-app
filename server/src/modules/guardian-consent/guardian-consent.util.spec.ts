import {
  ageFromBirthDate,
  birthDateFromAge,
  requiresGuardianConsent,
  requiresGuardianConsentFromAge,
  resolveConsentMethod,
  isKrUnder14SignupBlocked,
  GUARDIAN_CONSENT_AGE_THRESHOLD_DEFAULT,
  GUARDIAN_CONSENT_AGE_THRESHOLD_KR,
} from './guardian-consent.util';

describe('guardian-consent.util', () => {
  const now = new Date('2026-06-11T12:00:00Z');

  it('computes age with birthday not yet reached this year', () => {
    expect(ageFromBirthDate(new Date('2014-12-01'), now)).toBe(11);
  });

  it('requires consent under 18 for IN/default (DPDP Act §9 + Rule 10)', () => {
    expect(requiresGuardianConsent(new Date('2014-06-01'), 'IN', now)).toBe(true); // 12
    expect(requiresGuardianConsent(new Date('2009-06-01'), 'IN', now)).toBe(true); // 17
    expect(requiresGuardianConsent(new Date('2008-06-01'), 'IN', now)).toBe(false); // 18
    expect(requiresGuardianConsentFromAge(17, 'IN')).toBe(true);
    expect(requiresGuardianConsentFromAge(18, 'IN')).toBe(false);
    expect(GUARDIAN_CONSENT_AGE_THRESHOLD_DEFAULT).toBe(18);
    expect(ageFromBirthDate(new Date('2014-01-01'), now)).toBeLessThan(GUARDIAN_CONSENT_AGE_THRESHOLD_DEFAULT);
  });

  it('requires consent under 14 for KR (PIPA)', () => {
    expect(requiresGuardianConsent(new Date('2013-06-01'), 'KR', now)).toBe(true); // 13
    expect(requiresGuardianConsent(new Date('2012-06-01'), 'KR', now)).toBe(false); // 14
    expect(requiresGuardianConsentFromAge(13, 'KR')).toBe(true);
    expect(requiresGuardianConsentFromAge(14, 'KR')).toBe(false);
    expect(GUARDIAN_CONSENT_AGE_THRESHOLD_KR).toBe(14);
  });

  it('does not require consent for adults or missing birthDate', () => {
    expect(requiresGuardianConsent(new Date('2005-01-01'), 'IN', now)).toBe(false); // 21
    expect(requiresGuardianConsent(new Date('2000-01-01'), 'KR', now)).toBe(false); // 26
    expect(requiresGuardianConsent(null, 'IN', now)).toBe(false);
    expect(requiresGuardianConsent(undefined, 'KR', now)).toBe(false);
  });

  it('round-trips self-reported age exactly, any day of the year', () => {
    // Regression: the old Jul 1 anchor undercounted by one during Jan-Jun,
    // so a self-reported 14yo (KR) was wrongly guardian-gated.
    const days = [
      new Date('2026-01-01T00:00:00Z'),
      new Date('2026-06-13T12:00:00Z'),
      new Date('2026-06-30T23:59:59Z'),
      new Date('2026-07-01T00:00:00Z'),
      new Date('2026-12-31T23:59:59Z'),
    ];
    for (const day of days) {
      for (const age of [11, 13, 14, 18]) {
        expect(ageFromBirthDate(birthDateFromAge(age, day), day)).toBe(age);
      }
    }
    expect(requiresGuardianConsent(birthDateFromAge(14, now), 'KR', now)).toBe(false);
    expect(requiresGuardianConsent(birthDateFromAge(13, now), 'KR', now)).toBe(true);
    expect(requiresGuardianConsent(birthDateFromAge(18, now), 'IN', now)).toBe(false);
    expect(requiresGuardianConsent(birthDateFromAge(17, now), 'IN', now)).toBe(true);
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

  // KR PIPA under-14 sign-up gate. Default ALLOW: under-14 onboards through the
  // decree-compliant email-OTP guardian rail (시행령 제17조의2 method 5). Blocks
  // only under an explicit KR_UNDER14_REQUIRE_PASS opt-in with no live PASS.
  describe('isKrUnder14SignupBlocked', () => {
    const under14 = new Date('2013-06-01'); // age 13 at `now`
    const over14 = new Date('2012-06-01');  // age 14 at `now`
    const saved = {
      enabled: process.env.GUARDIAN_PASS_ENABLED,
      provider: process.env.GUARDIAN_PASS_PROVIDER,
      requirePass: process.env.KR_UNDER14_REQUIRE_PASS,
    };
    afterEach(() => {
      // Restore env so tests stay order-independent.
      for (const [k, v] of [
        ['GUARDIAN_PASS_ENABLED', saved.enabled],
        ['GUARDIAN_PASS_PROVIDER', saved.provider],
        ['KR_UNDER14_REQUIRE_PASS', saved.requirePass],
      ] as const) {
        if (v === undefined) delete process.env[k];
        else process.env[k] = v;
      }
    });

    it('ALLOWS a KR under-14 by default (email-OTP consent rail, method 5)', () => {
      delete process.env.GUARDIAN_PASS_ENABLED;
      delete process.env.GUARDIAN_PASS_PROVIDER;
      delete process.env.KR_UNDER14_REQUIRE_PASS;
      expect(isKrUnder14SignupBlocked(under14, 'KR', now)).toBe(false);
    });

    it('never blocks KR 14+ or non-KR minors', () => {
      process.env.KR_UNDER14_REQUIRE_PASS = 'true'; // even under the strict opt-in
      expect(isKrUnder14SignupBlocked(over14, 'KR', now)).toBe(false);
      expect(isKrUnder14SignupBlocked(under14, 'IN', now)).toBe(false); // IN uses its own gate
      expect(isKrUnder14SignupBlocked(null, 'KR', now)).toBe(false);
    });

    it('blocks under-14 only when PASS is required but not live', () => {
      process.env.KR_UNDER14_REQUIRE_PASS = 'true';
      process.env.GUARDIAN_PASS_PROVIDER = 'mock';
      delete process.env.GUARDIAN_PASS_ENABLED;
      expect(isKrUnder14SignupBlocked(under14, 'KR', now)).toBe(true);
    });

    it('allows under-14 when PASS is required AND a real provider is live', () => {
      process.env.KR_UNDER14_REQUIRE_PASS = 'true';
      process.env.GUARDIAN_PASS_ENABLED = 'true';
      process.env.GUARDIAN_PASS_PROVIDER = 'nice';
      expect(isKrUnder14SignupBlocked(under14, 'KR', now)).toBe(false);
    });
  });
});