import type { Lang } from './i18n';
import { langForCountry } from './onboarding-locale';

export type LangPreference = 'auto' | Lang;

const PREF_KEY = 'mathema.langPreference';

export function getLangPreference(): LangPreference {
  try {
    const v = localStorage.getItem(PREF_KEY);
    if (v === 'auto' || v === 'ko' || v === 'en' || v === 'hi') return v;
  } catch { /* ignore */ }
  return 'auto';
}

export function setLangPreference(pref: LangPreference): void {
  try {
    localStorage.setItem(PREF_KEY, pref);
  } catch { /* ignore */ }
}

/** Resolve UI language from explicit preference or account country. */
export function resolveAppLang(country?: string | null): Lang {
  const pref = getLangPreference();
  if (pref !== 'auto') return pref;
  return langForCountry(country);
}