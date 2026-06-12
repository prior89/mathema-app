/** Onboarding/register welcome uses ko or en only (hi ships inside the app later). */
export type OnboardingLang = 'ko' | 'en';

/** English onboarding for India, Indonesia, UAE (and other non-KR markets at launch). */
const EN_ONBOARDING_REGIONS = new Set(['IN', 'ID', 'AE', 'SG', 'AU', 'US', 'GB', 'UK']);

/**
 * Pre-auth onboarding language — before the user picks a country chip.
 *
 * Priority (no IP / no server call):
 *   1. BCP-47 tags from navigator.languages — ko or region KR → Korean
 *   2. Region IN / ID / AE (and other EN markets) → English
 *      (hi-IN still → English: v1 India onboarding is EN-first)
 *   3. IANA timezone fallback when region is missing
 *   4. Default English
 *
 * After country selection, `langForCountry()` is authoritative (KR → ko).
 */
export function detectOnboardingLang(): OnboardingLang {
  if (typeof window === 'undefined') return 'en';

  const tags = [
    ...(navigator.languages ?? []),
    navigator.language,
  ].filter(Boolean).map((t) => t.toLowerCase());

  for (const tag of tags) {
    const [langPart, regionPart] = tag.split('-');
    if (langPart === 'ko' || regionPart === 'kr') return 'ko';
    if (regionPart && EN_ONBOARDING_REGIONS.has(regionPart.toUpperCase())) return 'en';
  }

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz === 'Asia/Seoul') return 'ko';
    if (
      tz === 'Asia/Kolkata'
      || tz === 'Asia/Jakarta'
      || tz === 'Asia/Dubai'
    ) return 'en';
  } catch { /* ignore */ }

  return 'en';
}

/** Post country-chip selection — matches backend CountryCode behaviour. */
export function langForCountry(country: string | null | undefined): OnboardingLang {
  return country === 'KR' ? 'ko' : 'en';
}