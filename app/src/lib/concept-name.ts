import type { Lang } from './i18n';

/**
 * Pick the localised concept name. Server returns nameKo populated from
 * NCERT_CHAPTERS.titleKo for every NCERT row; null only when the seed has
 * no Korean title yet. Korean users get the Korean title; everyone else
 * (en, hi) falls back to the English `name`.
 *
 * Accepts both the legacy `{concept: {name, nameKo}}` shape (mastery rows,
 * error patterns) and the flat `{conceptName, conceptNameKo}` shape
 * (diagnostic mastery, review schedule).
 */
export function pickConceptName(
  src: { name: string; nameKo?: string | null } | { conceptName: string; conceptNameKo?: string | null },
  lang: Lang,
): string {
  if ('conceptName' in src) {
    return lang === 'ko' && src.conceptNameKo ? src.conceptNameKo : src.conceptName;
  }
  return lang === 'ko' && src.nameKo ? src.nameKo : src.name;
}
