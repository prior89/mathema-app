import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { Lang } from '../../../common/i18n/current-lang.decorator';
import { PROBLEM_EN } from '../../../common/i18n/content-en';
import { pickDifficulty, pickUnit } from '../wrong-notes.repository';

// Same gate the practice pool uses: NULL = not yet graded, treated as USABLE.
const USABLE_QUALITY = {
  OR: [
    { qualityStatus: null },
    { qualityStatus: { in: ['APPROVED', 'USABLE'] as ('APPROVED' | 'USABLE')[] } },
  ],
};

// First line of the body, cut to card length without splitting a $...$ math
// span — a half-open span makes MathText render raw LaTeX source.
function toPreview(body: string): string {
  const firstLine = (body.split('\n')[0] ?? '').trim();
  if (firstLine.length <= 90) return firstLine;
  let cutEnd = 90;
  if ((firstLine.slice(0, cutEnd).match(/\$/g) ?? []).length % 2 === 1) {
    const close = firstLine.indexOf('$', cutEnd);
    cutEnd = close === -1 ? firstLine.length : close + 1;
  }
  return cutEnd >= firstLine.length ? firstLine : `${firstLine.slice(0, cutEnd)}…`;
}

/**
 * Similar-problem suggestions for the wrong-note detail screen.
 * Same unit + same difficulty first, padded with same-unit neighbours.
 * Returns a card-ready shape (preview / chapter / difficulty label) instead
 * of raw Problem rows — internal enum values never reach the client.
 * TODO: switch to embedding search once pgvector lands.
 */
@Injectable()
export class SimilarFinderService {
  constructor(private readonly prisma: PrismaService) {}

  async findSimilar(problemId: string, limit = 5, lang: Lang = 'en') {
    const src = await this.prisma.problem.findUnique({
      where: { id: problemId },
      select: {
        unitId: true,
        subUnitId: true,
        conceptLessonId: true,
        koreanConceptLessonId: true,
        difficulty: true,
      },
    });
    if (!src) return [];

    // Korean problems share a legacy fallback unitId because Problem.unitId
    // is non-null, so unitId is not a chapter boundary for the KR tree.
    // Prefer the real lesson FK for both curricula; use sub-unit/unit only for
    // legacy rows that have no lesson mapping.
    const chapterScope = src.koreanConceptLessonId
      ? { koreanConceptLessonId: src.koreanConceptLessonId }
      : src.conceptLessonId
        ? { conceptLessonId: src.conceptLessonId }
        : src.subUnitId
          ? { subUnitId: src.subUnitId }
          : { unitId: src.unitId };

    const select = {
      id: true,
      source: true,
      body: true,
      difficulty: true,
      unit: { select: { name: true } },
      conceptLesson: {
        select: { titleKo: true, titleEn: true, titleHi: true },
      },
      koreanConceptLesson: {
        select: { titleKo: true, titleEn: true },
      },
    } as const;

    const exact = await this.prisma.problem.findMany({
      where: {
        id: { not: problemId },
        ...chapterScope,
        difficulty: src.difficulty,
        ...USABLE_QUALITY,
      },
      take: limit,
      select,
    });
    const rest =
      exact.length < limit
        ? await this.prisma.problem.findMany({
            where: {
              id: { not: problemId, notIn: exact.map((p) => p.id) },
              ...chapterScope,
              difficulty: { not: src.difficulty },
              ...USABLE_QUALITY,
            },
            take: limit - exact.length,
            select,
          })
        : [];

    return [...exact, ...rest].map((p) => {
      const en = lang !== 'ko' ? PROBLEM_EN[p.source]?.body : undefined;
      const lessonTitle = p.koreanConceptLesson
        ? (lang === 'ko'
            ? p.koreanConceptLesson.titleKo
            : p.koreanConceptLesson.titleEn ?? p.koreanConceptLesson.titleKo)
        : p.conceptLesson
          ? (lang === 'ko'
              ? p.conceptLesson.titleKo
              : lang === 'hi'
                ? p.conceptLesson.titleHi ?? p.conceptLesson.titleEn
                : p.conceptLesson.titleEn)
          : pickUnit(p.unit.name, lang);
      return {
        id: p.id,
        preview: toPreview(en ?? p.body),
        chapter: lessonTitle,
        difficulty: pickDifficulty(p.difficulty, lang),
      };
    });
  }
}
