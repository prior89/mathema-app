import { CountryCode } from '@prisma/client';

/** Minors under 18 need verifiable guardian consent (IN DPDP §9; KR best practice + PIPA under-14). */
export const GUARDIAN_CONSENT_AGE_THRESHOLD = 18;

export const CURRENT_GUARDIAN_POLICY_VERSION = '2026-06-11';

export function ageFromBirthDate(birthDate: Date, now = new Date()): number {
  let age = now.getUTCFullYear() - birthDate.getUTCFullYear();
  const m = now.getUTCMonth() - birthDate.getUTCMonth();
  if (m < 0 || (m === 0 && now.getUTCDate() < birthDate.getUTCDate())) {
    age -= 1;
  }
  return age;
}

export function requiresGuardianConsent(birthDate: Date | null | undefined, now = new Date()): boolean {
  if (!birthDate) return false;
  return ageFromBirthDate(birthDate, now) < GUARDIAN_CONSENT_AGE_THRESHOLD;
}

export function resolveConsentMethod(country: CountryCode): 'KR_PASS' | 'KR_EMAIL_OTP' | 'IN_EMAIL_OTP' {
  if (country === 'KR') {
    return process.env.GUARDIAN_PASS_ENABLED === 'true' ? 'KR_PASS' : 'KR_EMAIL_OTP';
  }
  return 'IN_EMAIL_OTP';
}