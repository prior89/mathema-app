import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

/**
 * Resolves a Concept to the chapterCode a student should practice for it —
 * country-correct so a KR learner deep-links to the Korean chapter, not the
 * NCERT one — AND gates on prerequisite readiness.
 *
 * Prerequisite gating (research: the strongest, most model-independent finding —
 * targeting a weakness whose prerequisites are unmet is "undesirable difficulty"
 * / below productive struggle; it teaches little). When a weak concept's
 * prerequisites are not yet mastered, we surface the weakest unmet prerequisite
 * so the UI can route the learner *there first* instead of to a chapter they
 * cannot productively engage with.
 *
 * chapterCode resolution:
 *   NCERT markets: Concept.code IS the ConceptLesson.chapterCode (1:1 seed).
 *   KR: KoreanConceptLesson has no Concept FK, so resolve via the concept's
 *     problems — the dominant Problem.koreanConceptLessonId → its chapterCode.
 *   Prerequisites are stored on Concept.prerequisiteConceptIds as Concept.codes
 *   (the codebase convention; resolved to ids here).
 */
export type ChapterLink = {
  /** The concept's own chapter (country-correct), or null if unresolved. */
  chapterCode: string | null;
  /** True when every prerequisite is sufficiently mastered (or there are none). */
  prereqReady: boolean;
  /** When not ready, the chapter of the weakest unmet prerequisite to do first. */
  prereqChapterCode: string | null;
};

/** MasteryTrajectory score (0..100) at/above which a prerequisite counts as met. */
const PREREQ_MASTERED_THRESHOLD = 50;

@Injectable()
export class ConceptChapterLinkService {
  constructor(private readonly prisma: PrismaService) {}

  async resolveForUser(userId: string, conceptIds: string[]): Promise<Record<string, ChapterLink>> {
    const ids = [...new Set(conceptIds.filter(Boolean))];
    const out: Record<string, ChapterLink> = {};
    for (const id of ids) out[id] = { chapterCode: null, prereqReady: true, prereqChapterCode: null };
    if (ids.length === 0) return out;

    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { country: true } });
    const country: 'IN' | 'KR' = (user?.country ?? 'IN') === 'KR' ? 'KR' : 'IN';

    // Requested concepts + their prerequisite codes.
    const concepts = await this.prisma.concept.findMany({
      where: { id: { in: ids } },
      select: { id: true, code: true, prerequisiteConceptIds: true },
    });
    const prereqCodes = [...new Set(concepts.flatMap((c) => c.prerequisiteConceptIds ?? []))];
    const prereqConcepts = prereqCodes.length
      ? await this.prisma.concept.findMany({ where: { code: { in: prereqCodes } }, select: { id: true, code: true } })
      : [];
    const prereqIdByCode = new Map(prereqConcepts.map((c) => [c.code, c.id]));

    // User mastery across requested + prerequisite concepts.
    const allIds = [...new Set([...ids, ...prereqConcepts.map((c) => c.id)])];
    const traj = await this.prisma.masteryTrajectory.findMany({
      where: { userId, conceptId: { in: allIds } },
      select: { conceptId: true, masteryScore: true },
    });
    const masteryById = new Map(traj.map((t) => [t.conceptId, t.masteryScore]));

    // Country-correct chapterCodes for everything (requested + prerequisites).
    const chapterByConcept = await this.chapterCodesFor(allIds, country);

    for (const c of concepts) {
      const chapterCode = chapterByConcept.get(c.id) ?? null;
      const unmet: Array<{ id: string; score: number }> = [];
      for (const code of c.prerequisiteConceptIds ?? []) {
        const pid = prereqIdByCode.get(code);
        if (!pid) continue; // prerequisite concept not in the graph — skip
        const score = masteryById.get(pid) ?? 0; // never attempted → not mastered
        if (score < PREREQ_MASTERED_THRESHOLD) unmet.push({ id: pid, score });
      }
      if (unmet.length === 0) {
        out[c.id] = { chapterCode, prereqReady: true, prereqChapterCode: null };
      } else {
        unmet.sort((a, b) => a.score - b.score); // weakest prerequisite first
        out[c.id] = {
          chapterCode,
          prereqReady: false,
          prereqChapterCode: chapterByConcept.get(unmet[0].id) ?? null,
        };
      }
    }
    return out;
  }

  /** conceptId → country-correct chapterCode (null when unresolved). */
  private async chapterCodesFor(conceptIds: string[], country: 'IN' | 'KR'): Promise<Map<string, string | null>> {
    const map = new Map<string, string | null>();
    for (const id of conceptIds) map.set(id, null);
    if (conceptIds.length === 0) return map;
    if (country === 'KR') await this.resolveKr(conceptIds, map);
    else await this.resolveNcert(conceptIds, map);
    return map;
  }

  /** NCERT markets: Concept.code === ConceptLesson.chapterCode (verified). */
  private async resolveNcert(conceptIds: string[], map: Map<string, string | null>): Promise<void> {
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
      if (valid.has(c.code)) map.set(c.id, c.code);
    }
  }

  /** KR: pick the dominant Korean chapter among the concept's problems. */
  private async resolveKr(conceptIds: string[], map: Map<string, string | null>): Promise<void> {
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
      map.set(conceptId, codeById.get(lessonId) ?? null);
    }
  }
}
