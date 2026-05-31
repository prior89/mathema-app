/**
 * 한국 2022 개정 교육과정 — 43 chapters concept content.
 *
 *   중1~중3: 21 chapters (middle-school.ts)
 *   고1 공통: 7 chapters (high-common.ts)
 *   고2~고3 선택: 15 chapters (high-elective.ts)
 *
 * Seed flow: `server/scripts/seed-korean-concept-steps.ts` reads
 * KOREAN_CHAPTER_CONTENT and creates KoreanConceptStep rows for the
 * 43 KoreanConceptLessons.
 */

import { KoreanChapterContentMap } from './types';
import { MIDDLE_SCHOOL_CONTENT } from './middle-school';
import { HIGH_COMMON_CONTENT } from './high-common';
import { HIGH_ELECTIVE_CONTENT } from './high-elective';

export * from './types';

export const KOREAN_CHAPTER_CONTENT: KoreanChapterContentMap = {
  ...MIDDLE_SCHOOL_CONTENT,
  ...HIGH_COMMON_CONTENT,
  ...HIGH_ELECTIVE_CONTENT,
};
