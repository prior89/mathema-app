import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

/**
 * Resolves a Concept to the chapterCode a student should practice for it —
 * country-correct so a KR learner deep-links to the Korean chapter, not the
 * NCERT one. Returns null when no lesson can be resolved, so a missing link
 * degrades to the generic chapter list rather than a broken route.
 *
 *   NCERT markets (IN/AE/…): Concept.code IS the ConceptLesson.chapterCode
 *     (ConceptsBootstrap seeds them 1:1). We still verify the lesson exists.
 *   KR: KoreanConceptLesson has no unitId/Concept FK, so we resolve via the
 *     concept's problems — the dominant Problem.koreanConceptLessonId → its
 *     chapterCode. The frontend routes by the "K-" prefix, so returning the
 *     Korean chapterCode is enough to land on the Korean lesson.
 */
@Injectable()
export class ConceptChapterLinkService {
  constructor(private readonly prisma: PrismaService) {}

  async resolveForUser(userId: string, conceptIds: string[]): Promise<Record<string, string | null>> {
    const ids = [...new Set(conceptIds.filter(Boolean))];
    const out: Record<string, string | null> = {};
    for (const id of ids) out[id] = null;
    if (ids.length === 0) return out;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { country: true },
    });
    if ((user?.country ?? 'IN') === 'KR') {
      await this.resolveKr(ids, out);
    } else {
      await this.resolveNcert(ids, out);
    }
    return out;
  }

  /** NCERT markets: Concept.code === ConceptLesson.chapterCode (verified). */
  private async resolveNcert(conceptIds: string[], out: Record<string, string | null>): Promise<void> {
    const concepts = await this.prisma.concept.findMany({
      where: { id: { in: conceptIds } },
      select: { id: true, code: true },
    });
    const codes = concepts.map((c) => c.code);
    if (codes.length === 0) return;
    const lessons = await this.prisma.conceptLesson.findMany({
      where: { chapterCode: { in: codes } },
      select: { chapterCode: true },
    });
    const valid = new Set(lessons.map((l) => l.chapterCode));
    for (const c of concepts) {
      if (valid.has(c.code)) out[c.id] = c.code;
    }
  }

  /** KR: pick the dominant Korean chapter among the concept's problems. */
  private async resolveKr(conceptIds: string[], out: Record<string, string | null>): Promise<void> {
    const links = await this.prisma.problemConcept.findMany({
      where: {
        conceptId: { in: conceptIds },
        problem: { koreanConceptLessonId: { not: null } },
      },
      select: {
        conceptId: true,
        problem: { select: { koreanConceptLessonId: true } },
      },
    });
    if (links.length === 0) return;

    // conceptId → (lessonId → count), then keep the most-linked lesson.
    const counts = new Map<string, Map<string, number>>();
    for (const l of links) {
      const lessonId = l.problem.koreanConceptLessonId;
      if (!lessonId) continue;
      const perLesson = counts.get(l.conceptId) ?? new Map<string, number>();
      perLesson.set(lessonId, (perLesson.get(lessonId) ?? 0) + 1);
      counts.set(l.conceptId, perLesson);
    }

    const dominantByConcept = new Map<string, string>();
    const lessonIds = new Set<string>();
    for (const [conceptId, perLesson] of counts) {
      let bestId = '';
      let bestN = -1;
      for (const [lessonId, n] of perLesson) {
        if (n > bestN) { bestN = n; bestId = lessonId; }
      }
      if (bestId) {
        dominantByConcept.set(conceptId, bestId);
        lessonIds.add(bestId);
      }
    }
    if (lessonIds.size === 0) return;

    const lessons = await this.prisma.koreanConceptLesson.findMany({
      where: { id: { in: [...lessonIds] } },
      select: { id: true, chapterCode: true },
    });
    const codeById = new Map(lessons.map((l) => [l.id, l.chapterCode]));
    for (const [conceptId, lessonId] of dominantByConcept) {
      out[conceptId] = codeById.get(lessonId) ?? null;
    }
  }
}
