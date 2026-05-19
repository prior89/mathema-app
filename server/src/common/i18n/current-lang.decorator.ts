import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Supported UI / response languages.
 *   en: default — primary launch market.
 *   ko: dev / Korean market.
 *   hi: India regional support (legacy from initial India PoC).
 *   es: roadmap — Latin America / global expansion (dicts filled progressively).
 *
 * Add a new code here, then add a branch wherever the type is exhaustively switched
 * (search for `lang === 'en'` / `pickByLang`). Helpers fall back to `en` if a code's
 * dict entry is missing, so partial coverage during rollout is safe.
 */
// Future expansion: add 'es' (Latin America) when ready. Keep the literal union
// in sync with `app/src/lib/i18n.tsx` and the translation dicts.
export type Lang = 'ko' | 'en' | 'hi';

const SUPPORTED: ReadonlyArray<Lang> = ['ko', 'en', 'hi'];

/**
 * Resolve language from `?lang=` query or Accept-Language header.
 * Default = 'en'.
 */
export const CurrentLang = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): Lang => {
    const req = ctx.switchToHttp().getRequest();
    const q = req.query?.lang;
    if (typeof q === 'string' && (SUPPORTED as ReadonlyArray<string>).includes(q)) {
      return q as Lang;
    }
    const al = String(req.headers['accept-language'] || '').toLowerCase();
    for (const code of SUPPORTED) {
      if (al.startsWith(code)) return code;
    }
    return 'en';
  },
);

/**
 * Pick a localized value from per-language dicts, falling back to `en`, then to `fallback`.
 * Pass only the language dicts you have — missing ones gracefully fall through to `en`.
 *
 *   pickByLang(lang, { en: 'Today', ko: '오늘', hi: 'आज', es: 'Hoy' }, 'Today')
 */
export function pickByLang(
  lang: Lang,
  dicts: Partial<Record<Lang, string>>,
  fallback: string,
): string {
  return dicts[lang] ?? dicts.en ?? fallback;
}

/**
 * Legacy helper kept for backward compatibility with existing call sites.
 * New code should use `pickByLang` instead.
 */
export function pickT<T extends string>(
  lang: Lang,
  dictEn: Record<string, T>,
  key: string,
  fallback: string,
  dictHi?: Record<string, T>,
): string {
  if (lang === 'hi' && dictHi?.[key]) return dictHi[key];
  if (lang === 'en' || lang === 'hi') return dictEn[key] ?? fallback;
  return fallback;
}
