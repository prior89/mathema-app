/**
 * backfill-lesson-problem-set.ts — populate the LessonProblemSet shadow
 * inventory from the existing ConceptLesson.masterySetProblemIds and
 * KoreanConceptLesson.masterySetProblemIds arrays.
 *
 * Phase 1 of the expand-contract migration: write the new table but leave
 * the runtime path on the legacy arrays. Idempotent — re-running upserts on
 * (country, chapterCode, setType, version).
 *
 * Status assignment:
 *   - array length === 20 AND every Problem passes the active-pool filter
 *     (qualityStatus IN NULL/APPROVED/USABLE, conceptMismatch != true)
 *     → READY
 *   - array length === 20 but at least one Problem is EXCLUDED/mismatched
 *     → NEEDS_REVIEW (caller should reauthor the set)
 *   - array length !== 20 (including 0)
 *     → no LessonProblemSet row created — the gap surfaces in the readiness
 *       endpoint as "no MASTERY_3STEP set yet"
 *
 * Phase 2 adds STUDY_1STEP and DIAGNOSTIC rows too. Runtime can then read
 * all three product surfaces through the same inventory contract.
 *
 * Run:
 *   DATABASE_URL=... npx ts-node scripts/backfill-lesson-problem-set.ts
 */

import { PrismaClient, CountryCode, SetType, SetStatus } from '@prisma/client';

async function backfillSide(args: {
  prisma: PrismaClient;
  country: CountryCode;
  lessons: Array<{ id: string; chapterCode: string; masterySetProblemIds: string[]; masterySetCuratedAt: Date | null }>;
  fkColumn: 'conceptLessonId' | 'koreanConceptLessonId';
}) {
  const { prisma, country, lessons, fkColumn } = args;
  let ready = 0;
  let needsReview = 0;
  let skipped = 0;

  for (const lesson of lessons) {
    if (lesson.masterySetProblemIds.length !== 20) {
      skipped++;
      continue;
    }
    // Phase 1.5 readiness contract — every check that the student runtime
    // depends on, not just the quality flags. A canonical 20-set must:
    //   (1) contain exactly 20 distinct Problem rows
    //   (2) each Problem passes the active-pool filter
    //       (qualityStatus IN NULL/APPROVED/USABLE, conceptMismatch != true)
    //   (3) each Problem has exactly 3 ProblemStep rows (CONCEPT/PROCESS/ANSWER)
    //   (4) each step has exactly 5 ProblemChoice rows
    //   (5) each step has exactly one isCorrect=true choice
    //   (6) each Problem's lesson FK points back to this lesson — guards
    //       against orphaned IDs that survived a chapter reclassify
    const problems = await prisma.problem.findMany({
      where: { id: { in: lesson.masterySetProblemIds } },
      select: {
        id: true,
        qualityStatus: true,
        conceptMismatch: true,
        conceptLessonId: true,
        koreanConceptLessonId: true,
        steps: {
          select: {
            stepIndex: true,
            choices: { select: { isCorrect: true } },
          },
        },
      },
    });
    const expectedFk = fkColumn === 'conceptLessonId' ? 'conceptLessonId' : 'koreanConceptLessonId';
    const failures: string[] = [];
    if (problems.length !== 20) failures.push(`pool=${problems.length}/20`);
    for (const p of problems) {
      const qsOk = p.qualityStatus === null || p.qualityStatus === 'APPROVED' || p.qualityStatus === 'USABLE';
      if (!qsOk) failures.push(`${p.id.slice(0, 8)}:quality`);
      if (p.conceptMismatch === true) failures.push(`${p.id.slice(0, 8)}:mismatch`);
      if ((p as any)[expectedFk] !== lesson.id) failures.push(`${p.id.slice(0, 8)}:fk`);
      if (p.steps.length !== 3) failures.push(`${p.id.slice(0, 8)}:steps=${p.steps.length}`);
      for (const s of p.steps) {
        if (s.choices.length !== 5) failures.push(`${p.id.slice(0, 8)}:s${s.stepIndex}.choices=${s.choices.length}`);
        const correctCount = s.choices.filter((c) => c.isCorrect).length;
        if (correctCount !== 1) failures.push(`${p.id.slice(0, 8)}:s${s.stepIndex}.correct=${correctCount}`);
      }
    }
    const status: SetStatus = failures.length === 0 ? 'READY' : 'NEEDS_REVIEW';
    const note = failures.length ? `  ⚠ ${failures.slice(0, 3).join(', ')}${failures.length > 3 ? `, +${failures.length - 3} more` : ''}` : '';

    await prisma.lessonProblemSet.upsert({
      where: {
        country_chapterCode_setType_version: {
          country,
          chapterCode: lesson.chapterCode,
          setType: 'MASTERY_3STEP',
          version: 1,
        },
      },
      update: {
        problemIds: lesson.masterySetProblemIds,
        status,
        curatedAt: lesson.masterySetCuratedAt,
        [fkColumn]: lesson.id,
      },
      create: {
        country,
        setType: 'MASTERY_3STEP',
        version: 1,
        chapterCode: lesson.chapterCode,
        problemIds: lesson.masterySetProblemIds,
        status,
        curatedAt: lesson.masterySetCuratedAt,
        [fkColumn]: lesson.id,
      },
    });

    if (status === 'READY') ready++;
    else needsReview++;
    console.log(`[${country}] ${status.padEnd(13)} ${lesson.chapterCode}${note}`);
  }

  return { ready, needsReview, skipped, total: lessons.length };
}

async function backfillCandidateSet(args: {
  prisma: PrismaClient;
  country: CountryCode;
  lessons: Array<{ id: string; chapterCode: string }>;
  fkColumn: 'conceptLessonId' | 'koreanConceptLessonId';
  setType: SetType;
  target: number;
}) {
  const { prisma, country, lessons, fkColumn, setType, target } = args;
  let ready = 0;
  let needsReview = 0;

  for (const lesson of lessons) {
    const where: any = {
      [fkColumn]: lesson.id,
      conceptMismatch: { not: true },
      OR: [
        { qualityStatus: null },
        { qualityStatus: { in: ['APPROVED', 'USABLE'] } },
      ],
      AND: setType === 'STUDY_1STEP'
        ? [
            { steps: { some: { stepIndex: 1 } } },
            { steps: { none: { stepIndex: { gte: 2 } } } },
          ]
        : [
            { steps: { some: { stepIndex: 1 } } },
          ],
    };

    const problems = await prisma.problem.findMany({
      where,
      orderBy: [{ difficultyLevel: 'asc' }, { createdAt: 'asc' }],
      take: Math.max(target, 20),
      select: {
        id: true,
        steps: {
          orderBy: { stepIndex: 'asc' },
          select: {
            stepIndex: true,
            choices: { select: { isCorrect: true } },
          },
        },
      },
    });

    const valid = problems.filter((p) => {
      const first = p.steps.find((s) => s.stepIndex === 1);
      if (!first || first.choices.length !== 5) return false;
      if (first.choices.filter((c) => c.isCorrect).length !== 1) return false;
      if (setType === 'STUDY_1STEP' && p.steps.length !== 1) return false;
      return true;
    });
    const ids = valid.slice(0, target).map((p) => p.id);
    const status: SetStatus = ids.length >= target ? 'READY' : 'NEEDS_REVIEW';

    await prisma.lessonProblemSet.upsert({
      where: {
        country_chapterCode_setType_version: {
          country,
          chapterCode: lesson.chapterCode,
          setType,
          version: 1,
        },
      },
      update: {
        problemIds: ids,
        status,
        curatedAt: ids.length > 0 ? new Date() : null,
        retiredAt: null,
        [fkColumn]: lesson.id,
      },
      create: {
        country,
        chapterCode: lesson.chapterCode,
        setType,
        version: 1,
        problemIds: ids,
        status,
        curatedAt: ids.length > 0 ? new Date() : null,
        [fkColumn]: lesson.id,
      },
    });

    if (status === 'READY') ready++;
    else needsReview++;
    const count = `${ids.length}/${target}`;
    console.log(`[${country}] ${status.padEnd(13)} ${String(setType).padEnd(12)} ${lesson.chapterCode} ${count}`);
  }

  return { ready, needsReview, total: lessons.length };
}

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log('Backfilling LessonProblemSet (MASTERY_3STEP / STUDY_1STEP / DIAGNOSTIC)...\n');

    const ncert = await prisma.conceptLesson.findMany({
      select: { id: true, chapterCode: true, masterySetProblemIds: true, masterySetCuratedAt: true },
    });
    const korean = await prisma.koreanConceptLesson.findMany({
      select: { id: true, chapterCode: true, masterySetProblemIds: true, masterySetCuratedAt: true },
    });

    const inResult = await backfillSide({
      prisma,
      country: 'IN',
      lessons: ncert,
      fkColumn: 'conceptLessonId',
    });
    console.log('');
    const krResult = await backfillSide({
      prisma,
      country: 'KR',
      lessons: korean,
      fkColumn: 'koreanConceptLessonId',
    });

    console.log('\nBackfilling STUDY_1STEP...');
    const inStudy = await backfillCandidateSet({
      prisma,
      country: 'IN',
      lessons: ncert,
      fkColumn: 'conceptLessonId',
      setType: 'STUDY_1STEP',
      target: 20,
    });
    const krStudy = await backfillCandidateSet({
      prisma,
      country: 'KR',
      lessons: korean,
      fkColumn: 'koreanConceptLessonId',
      setType: 'STUDY_1STEP',
      target: 20,
    });

    console.log('\nBackfilling DIAGNOSTIC...');
    const inDiagnostic = await backfillCandidateSet({
      prisma,
      country: 'IN',
      lessons: ncert,
      fkColumn: 'conceptLessonId',
      setType: 'DIAGNOSTIC',
      target: 1,
    });
    const krDiagnostic = await backfillCandidateSet({
      prisma,
      country: 'KR',
      lessons: korean,
      fkColumn: 'koreanConceptLessonId',
      setType: 'DIAGNOSTIC',
      target: 1,
    });

    console.log('');
    console.log('Done.');
    console.log(`  IN: ${inResult.ready} READY, ${inResult.needsReview} NEEDS_REVIEW, ${inResult.skipped} skipped (array != 20) / ${inResult.total} total`);
    console.log(`  KR: ${krResult.ready} READY, ${krResult.needsReview} NEEDS_REVIEW, ${krResult.skipped} skipped (array != 20) / ${krResult.total} total`);
    console.log(`  IN STUDY: ${inStudy.ready} READY, ${inStudy.needsReview} NEEDS_REVIEW / ${inStudy.total} total`);
    console.log(`  KR STUDY: ${krStudy.ready} READY, ${krStudy.needsReview} NEEDS_REVIEW / ${krStudy.total} total`);
    console.log(`  IN DIAGNOSTIC: ${inDiagnostic.ready} READY, ${inDiagnostic.needsReview} NEEDS_REVIEW / ${inDiagnostic.total} total`);
    console.log(`  KR DIAGNOSTIC: ${krDiagnostic.ready} READY, ${krDiagnostic.needsReview} NEEDS_REVIEW / ${krDiagnostic.total} total`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
