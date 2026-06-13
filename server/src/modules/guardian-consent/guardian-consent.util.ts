import { CountryCode } from '@prisma/client';

/**
 * Country-aware guardian gate (industry + statute aligned):
 *   KR — PIPA: consent required for users under 14
 *   IN / default — COPPA / Duolingo-style edtech: under 13 → parent email
 *   (DPDP defines "child" as under 18; users 13–17 get enhanced teen defaults
 *    — no targeted ads, analytics opt-in only — documented in Privacy Policy)
 */
export const GUARDIAN_CONSENT_AGE_THRESHOLD_KR = 14;
export const GUARDIAN_CONSENT_AGE_THRESHOLD_DEFAULT = 13;

/** @deprecated Use guardianConsentAgeThreshold(country) */
export const GUARDIAN_CONSENT_AGE_THRESHOLD = GUARDIAN_CONSENT_AGE_THRESHOLD_DEFAULT;

/** Self-reported age picker range — middle-school-first audience. */
export const AGE_PICKER_MIN = 11;
export const AGE_PICKER_MAX = 18;

export const CURRENT_GUARDIAN_POLICY_VERSION = '2026-06-12';

export function guardianConsentAgeThreshold(country?: CountryCode | string | null): number {
  return country === 'KR' ? GUARDIAN_CONSENT_AGE_THRESHOLD_KR : GUARDIAN_CONSENT_AGE_THRESHOLD_DEFAULT;
}

export function ageFromBirthDate(birthDate: Date, now = new Date()): number {
  let age = now.getUTCFullYear() - birthDate.getUTCFullYear();
  const m = now.getUTCMonth() - birthDate.getUTCMonth();
  if (m < 0 || (m === 0 && now.getUTCDate() < birthDate.getUTCDate())) {
    age -= 1;
  }
  return age;
}

export function requiresGuardianConsentFromAge(age: number, country?: CountryCode | string | null): boolean {
  return age < guardianConsentAgeThreshold(country);
}

/** Approximate DOB from self-reported age — not exact verification.
 * Anchored to Jan 1 so ageFromBirthDate() returns exactly `age` for the
 * whole calendar year. The previous Jul 1 anchor made every student one
 * year younger during Jan–Jun, wrongly triggering the guardian gate. */
export function birthDateFromAge(age: number, now = new Date()): Date {
  const year = now.getUTCFullYear() - age;
  return new Date(Date.UTC(year, 0, 1));
}

export function requiresGuardianConsent(
  birthDate: Date | null | undefined,
  country?: CountryCode | string | null,
  now = new Date(),
): boolean {
  if (!birthDate) return false;
  return ageFromBirthDate(birthDate, now) < guardianConsentAgeThreshold(country);
}

/** Student accounts must declare age once (self-reported). */
export function requiresAgeProfile(
  birthDate: Date | null | undefined,
  role?: string | null,
): boolean {
  return role === 'STUDENT' && !birthDate;
}

export function guardianAccessSatisfied(user: {
  role?: string | null;
  birthDate?: Date | null;
  guardianConsentVerifiedAt?: Date | null;
  country?: CountryCode | string | null;
}): boolean {
  if (user.role !== 'STUDENT') return true;
  if (requiresAgeProfile(user.birthDate, user.role)) return false;
  if (!requiresGuardianConsent(user.birthDate, user.country)) return true;
  return !!user.guardianConsentVerifiedAt;
}

export function resolveConsentMethod(country: CountryCode): 'KR_PASS' | 'KR_EMAIL_OTP' | 'IN_EMAIL_OTP' {
  if (country === 'KR') {
    return process.env.GUARDIAN_PASS_ENABLED === 'true' ? 'KR_PASS' : 'KR_EMAIL_OTP';
  }
  return 'IN_EMAIL_OTP';
}