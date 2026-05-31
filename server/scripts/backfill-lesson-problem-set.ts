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
 * Phase 2 (post-launch) will add STUDY_1STEP and DIAGNOSTIC rows; this run
 * only handles MASTERY_3STEP.
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
    // Re-check quality status of every problem in the set. A lesson whose
    // canonical 20 contains an EXCLUDED row should not advertise as READY.
    const problems = await prisma.problem.findMany({
      where: { id: { in: lesson.masterySetProblemIds } },
      select: { id: true, qualityStatus: true, conceptMismatch: true },
    });
    const allGood = problems.length === 20 && problems.every((p) => {
      const qsOk = p.qualityStatus === null || p.qualityStatus === 'APPROVED' || p.qualityStatus === 'USABLE';
      const mismatchOk = p.conceptMismatch !== true;
      return qsOk && mismatchOk;
    });
    const status: SetStatus = allGood ? 'READY' : 'NEEDS_REVIEW';

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
    console.log(`[${country}] ${status.padEnd(13)} ${lesson.chapterCode}`);
  }

  return { ready, needsReview, skipped, total: lessons.length };
}

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log('Backfilling LessonProblemSet (MASTERY_3STEP only)...\n');

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

    console.log('');
    console.log('Done.');
    console.log(`  IN: ${inResult.ready} READY, ${inResult.needsReview} NEEDS_REVIEW, ${inResult.skipped} skipped (array != 20) / ${inResult.total} total`);
    console.log(`  KR: ${krResult.ready} READY, ${krResult.needsReview} NEEDS_REVIEW, ${krResult.skipped} skipped (array != 20) / ${krResult.total} total`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
