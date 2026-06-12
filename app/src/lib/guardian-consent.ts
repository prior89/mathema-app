/** Mirrors server guardian-consent.util — keep thresholds in sync. */
export const GUARDIAN_CONSENT_AGE_THRESHOLD_KR = 14;
export const GUARDIAN_CONSENT_AGE_THRESHOLD_DEFAULT = 13;

export const AGE_PICKER_MIN = 11;
export const AGE_PICKER_MAX = 18;

export type GuardianCountry = 'IN' | 'KR' | string | null | undefined;

export function guardianConsentAgeThreshold(country?: GuardianCountry): number {
  return country === 'KR' ? GUARDIAN_CONSENT_AGE_THRESHOLD_KR : GUARDIAN_CONSENT_AGE_THRESHOLD_DEFAULT;
}

export function ageFromBirthDate(birthDate: Date | string, now = new Date()): number {
  const bd = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  let age = now.getUTCFullYear() - bd.getUTCFullYear();
  const m = now.getUTCMonth() - bd.getUTCMonth();
  if (m < 0 || (m === 0 && now.getUTCDate() < bd.getUTCDate())) age -= 1;
  return age;
}

export function requiresGuardianConsentFromAge(age: number, country?: GuardianCountry): boolean {
  return age < guardianConsentAgeThreshold(country);
}

/** Self-reported age → approximate ISO birth date (mid-year). */
export function birthDateFromAge(age: number, now = new Date()): string {
  const year = now.getUTCFullYear() - age;
  return new Date(Date.UTC(year, 6, 1)).toISOString();
}

export function requiresGuardianConsent(
  birthDate: string | null | undefined,
  country?: GuardianCountry,
  now = new Date(),
): boolean {
  if (!birthDate) return false;
  return ageFromBirthDate(birthDate, now) < guardianConsentAgeThreshold(country);
}

export function requiresAgeProfile(
  birthDate: string | null | undefined,
  role?: string | null,
): boolean {
  return role === 'STUDENT' && !birthDate;
}

export function guardianConsentSatisfied(me: {
  role?: string | null;
  birthDate?: string | null;
  guardianConsentVerifiedAt?: string | null;
  country?: GuardianCountry;
}): boolean {
  if (me.role !== 'STUDENT') return true;
  if (requiresAgeProfile(me.birthDate, me.role)) return false;
  if (!requiresGuardianConsent(me.birthDate, me.country)) return true;
  return !!me.guardianConsentVerifiedAt;
}