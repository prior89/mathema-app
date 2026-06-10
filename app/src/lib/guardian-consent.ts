/** Mirrors server guardian-consent.util — keep age threshold in sync. */
export const GUARDIAN_CONSENT_AGE_THRESHOLD = 18;

export function ageFromBirthDate(birthDate: Date | string, now = new Date()): number {
  const bd = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  let age = now.getUTCFullYear() - bd.getUTCFullYear();
  const m = now.getUTCMonth() - bd.getUTCMonth();
  if (m < 0 || (m === 0 && now.getUTCDate() < bd.getUTCDate())) age -= 1;
  return age;
}

export function requiresGuardianConsent(
  birthDate: string | null | undefined,
  now = new Date(),
): boolean {
  if (!birthDate) return false;
  return ageFromBirthDate(birthDate, now) < GUARDIAN_CONSENT_AGE_THRESHOLD;
}

export function guardianConsentSatisfied(me: {
  birthDate?: string | null;
  guardianConsentVerifiedAt?: string | null;
}): boolean {
  if (!requiresGuardianConsent(me.birthDate)) return true;
  return !!me.guardianConsentVerifiedAt;
}