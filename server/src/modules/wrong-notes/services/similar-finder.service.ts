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
      select: { unitId: true, difficulty: true },
    });
    if (!src) return [];

    const select = {
      id: true,
      source: true,
      body: true,
      difficulty: true,
      unit: { select: { name: true } },
    } as const;

    const exact = await this.prisma.problem.findMany({
      where: {
        id: { not: problemId },
        unitId: src.unitId,
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
              unitId: src.unitId,
              difficulty: { not: src.difficulty },
              ...USABLE_QUALITY,
            },
            take: limit - exact.length,
            select,
          })
        : [];

    return [...exact, ...rest].map((p) => {
      const en = lang !== 'ko' ? PROBLEM_EN[p.source]?.body : undefined;
      return {
        id: p.id,
        preview: toPreview(en ?? p.body),
        chapter: pickUnit(p.unit.name, lang),
        difficulty: pickDifficulty(p.difficulty, lang),
      };
    });
  }
}
