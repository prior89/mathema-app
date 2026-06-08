/**
 * Fills KR (or any) grade buckets that are 1–2 READY DIAGNOSTIC sets short of
 * MIN_READY_DIAGNOSTIC_SETS. Creates version-2 sets using a second valid
 * problem from the same lesson pool.
 *
 * Run after backfill-lesson-problem-set.ts:
 *   npx ts-node scripts/backfill-diagnostic-grade-gap.ts
 */
import { PrismaClient } from '@prisma/client';
import {
  MIN_READY_DIAGNOSTIC_SETS,
  countReadyDiagnosticSets,
  evaluateDiagnosticPoolGate,
  expectedDiagnosticPoolGrades,
  formatDiagnosticPoolGateReport,
} from '../src/modules/diagnostic/diagnostic-pool-gate';

async function secondValidProblemId(
  prisma: PrismaClient,
  lessonId: string,
  fk: 'conceptLessonId' | 'koreanConceptLessonId',
  exclude: Set<string>,
): Promise<string | null> {
  const problems = await prisma.problem.findMany({
    where: {
      [fk]: lessonId,
      conceptMismatch: { not: true },
      OR: [
        { qualityStatus: null },
        { qualityStatus: { in: ['APPROVED', 'USABLE'] } },
      ],
      steps: { some: { stepIndex: 1 } },
    },
    orderBy: [{ difficultyLevel: 'asc' }, { createdAt: 'asc' }],
    take: 12,
    select: {
      id: true,
      steps: {
        where: { stepIndex: 1 },
        take: 1,
        select: { choices: { select: { isCorrect: true } } },
      },
    },
  });
  for (const p of problems) {
    if (exclude.has(p.id)) continue;
    const first = p.steps[0];
    if (!first || first.choices.length !== 5) continue;
    if (first.choices.filter((c) => c.isCorrect).length !== 1) continue;
    return p.id;
  }
  return null;
}

async function fillGradeGaps(prisma: PrismaClient) {
  for (const key of expectedDiagnosticPoolGrades()) {
    const ready = await countReadyDiagnosticSets(prisma, key);
    const deficit = MIN_READY_DIAGNOSTIC_SETS - ready;
    if (deficit <= 0) continue;

    const fk = key.country === 'IN' ? 'conceptLessonId' : 'koreanConceptLessonId';
    const sets = await prisma.lessonProblemSet.findMany({
      where: {
        country: key.country,
        setType: 'DIAGNOSTIC',
        status: 'READY',
        retiredAt: null,
        version: 1,
        ...(key.country === 'IN'
          ? { conceptLesson: { ncertClass: key.grade } }
          : { koreanConceptLesson: { koreanGrade: key.grade } }),
      },
      take: deficit,
      select: {
        country: true,
        chapterCode: true,
        problemIds: true,
        conceptLessonId: true,
        koreanConceptLessonId: true,
      },
    });

    for (const set of sets) {
      const lessonId = set.conceptLessonId ?? set.koreanConceptLessonId;
      if (!lessonId) continue;
      const exclude = new Set(set.problemIds);
      const altId = await secondValidProblemId(prisma, lessonId, fk, exclude);
      if (!altId) continue;

      await prisma.lessonProblemSet.upsert({
        where: {
          country_chapterCode_setType_version: {
            country: set.country,
            chapterCode: set.chapterCode,
            setType: 'DIAGNOSTIC',
            version: 2,
          },
        },
        update: {
          problemIds: [altId],
          status: 'READY',
          curatedAt: new Date(),
          retiredAt: null,
          [fk]: lessonId,
        },
        create: {
          country: set.country,
          chapterCode: set.chapterCode,
          setType: 'DIAGNOSTIC',
          version: 2,
          problemIds: [altId],
          status: 'READY',
          curatedAt: new Date(),
          [fk]: lessonId,
        },
      });
      console.log(`[${key.country} ${key.grade}] gap fill v2 ${set.chapterCode} → ${altId.slice(0, 8)}`);
    }
  }
}

async function main() {
  const prisma = new PrismaClient();
  try {
    const before = await evaluateDiagnosticPoolGate(prisma);
    console.log(formatDiagnosticPoolGateReport(before));
    if (before.ok) {
      console.log('\nNo gap fill needed.');
      return;
    }
    console.log('\nFilling grade gaps...\n');
    await fillGradeGaps(prisma);
    const after = await evaluateDiagnosticPoolGate(prisma);
    console.log('\n' + formatDiagnosticPoolGateReport(after));
    if (!after.ok) process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});