/**
 * Transient, self-reported decision used only to decide whether Google
 * sign-in may be offered. The birth date itself never leaves the component,
 * is never persisted, and is cleared as soon as the decision is derived.
 */
export type PreAuthAgeBand = 'child' | 'eligible';
export type PreAuthRegion = 'KR' | 'IN' | 'OTHER';

const MINIMUM_GOOGLE_AGE: Record<PreAuthRegion, number> = {
  // Google Accounts can be self-managed from age 14 in South Korea.
  KR: 14,
  // India's DPDP child protections apply until age 18.
  IN: 18,
  // Unknown/future markets fail conservatively until their policy is mapped.
  OTHER: 18,
};

function parseDateOnly(value: string): { year: number; month: number; day: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const check = new Date(Date.UTC(year, month - 1, day));
  if (
    check.getUTCFullYear() !== year
    || check.getUTCMonth() !== month - 1
    || check.getUTCDate() !== day
  ) return null;
  return { year, month, day };
}

export function derivePreAuthAgeBand(
  birthDate: string,
  region: PreAuthRegion,
  today: Date = new Date(),
): PreAuthAgeBand | null {
  const birth = parseDateOnly(birthDate);
  if (!birth || Number.isNaN(today.getTime())) return null;

  const current = {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
  };
  if (
    birth.year > current.year
    || (birth.year === current.year && birth.month > current.month)
    || (birth.year === current.year && birth.month === current.month && birth.day > current.day)
  ) return null;

  let age = current.year - birth.year;
  if (
    current.month < birth.month
    || (current.month === birth.month && current.day < birth.day)
  ) age -= 1;

  return age >= MINIMUM_GOOGLE_AGE[region] ? 'eligible' : 'child';
}

/** Unknown and child users must never mount/initialise Google Identity. */
export function canOfferGoogleSignIn(ageBand: PreAuthAgeBand | null): boolean {
  return ageBand === 'eligible';
}
