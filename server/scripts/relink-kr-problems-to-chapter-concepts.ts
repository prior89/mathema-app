/**
 * Fix the degenerate KR problem→concept linkage.
 *
 * Root cause (2026-07-03 DB audit): all 1720 KR problems share one unitId, so
 * ConceptsBootstrap's unit-based linker attached every one of them to a SINGLE
 * NCERT concept (C7-CH01-INTEGERS). Result: KR per-concept mastery / weakness /
 * error-patterns / deep-links all collapse to one concept — the core loop's
 * precision is destroyed for the KR-first market.
 *
 * Fix (Approach A — chapter-level, symmetric with NCERT where Concept.code =
 * chapterCode 1:1):
 *   1. Seed one Concept per KoreanConceptLesson, code = its chapterCode.
 *   2. Link each KR problem to its own chapter's concept (via koreanConceptLessonId).
 *   3. Remove the degenerate links (any KR-problem ProblemConcept that isn't its
 *      chapter concept).
 *
 * Idempotent. Run: npx ts-node --transpile-only scripts/relink-kr-problems-to-chapter-concepts.ts
 */
import { PrismaClient, GradeLevel } from '@prisma/client';

const prisma = new PrismaClient();

// KoreanGrade → GradeLevel (Concept.gradeLevel is the NCERT enum; used only for
// recommendation grade-filtering, so the middle/high alignment is what matters).
const KR_GRADE_TO_LEVEL: Record<string, GradeLevel> = {
  MIDDLE_1: GradeLevel.CLASS_7,
  MIDDLE_2: GradeLevel.CLASS_8,
  MIDDLE_3: GradeLevel.CLASS_9,
  HIGH_1: GradeLevel.CLASS_10,
  HIGH_2: GradeLevel.CLASS_11,
  HIGH_3: GradeLevel.CLASS_12,
};

async function main() {
  // 1) Seed a Concept per KoreanConceptLesson.
  const lessons = await prisma.koreanConceptLesson.findMany({
    select: {
      id: true, chapterCode: true, titleKo: true, titleEn: true,
      koreanGrade: true, prerequisiteCodes: true,
    },
  });
  console.log(`KR lessons: ${lessons.length}`);

  const conceptIdByChapter = new Map<string, string>();
  for (const l of lessons) {
    const c = await prisma.concept.upsert({
      where: { code: l.chapterCode },
      update: {
        name: l.titleEn ?? l.titleKo,
        nameKo: l.titleKo,
        subject: 'math',
        gradeLevel: KR_GRADE_TO_LEVEL[l.koreanGrade] ?? null,
        prerequisiteConceptIds: l.prerequisiteCodes ?? [],
      },
      create: {
        code: l.chapterCode,
        name: l.titleEn ?? l.titleKo,
        nameKo: l.titleKo,
        subject: 'math',
        gradeLevel: KR_GRADE_TO_LEVEL[l.koreanGrade] ?? null,
        prerequisiteConceptIds: l.prerequisiteCodes ?? [],
        relatedConceptIds: [],
      },
      select: { id: true },
    });
    conceptIdByChapter.set(l.chapterCode, c.id);
  }
  console.log(`KR concepts upserted: ${conceptIdByChapter.size}`);

  // 2) + 3) Relink each KR problem to its chapter concept; drop degenerate links.
  const krProblems = await prisma.problem.findMany({
    where: { koreanConceptLessonId: { not: null } },
    select: { id: true, koreanConceptLesson: { select: { chapterCode: true } } },
  });
  console.log(`KR problems: ${krProblems.length}`);

  let linked = 0;
  let removed = 0;
  let skipped = 0;
  for (const p of krProblems) {
    const chapterCode = p.koreanConceptLesson?.chapterCode;
    const conceptId = chapterCode ? conceptIdByChapter.get(chapterCode) : undefined;
    if (!conceptId) { skipped++; continue; }

    await prisma.problemConcept.upsert({
      where: { problemId_conceptId: { problemId: p.id, conceptId } },
      update: { weight: 1.0 },
      create: { problemId: p.id, conceptId, weight: 1.0 },
    });
    linked++;

    // Remove the old degenerate link(s) — anything other than this chapter concept.
    const del = await prisma.problemConcept.deleteMany({
      where: { problemId: p.id, conceptId: { not: conceptId } },
    });
    removed += del.count;
  }

  console.log(`Linked to chapter concept: ${linked}`);
  console.log(`Degenerate links removed: ${removed}`);
  console.log(`Skipped (no chapter/concept): ${skipped}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
