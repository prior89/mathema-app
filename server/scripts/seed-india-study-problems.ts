/**
 * seed-india-study-problems.ts
 *
 * Builds the NCERT/India Study (single-step) practice pool from the curated
 * Formula Mastery pool. The student-facing practice screen expects exactly one
 * ANSWER step with 5 choices, while Mastery keeps the full CONCEPT/PROCESS/
 * ANSWER flow. This script clones only the final-answer interaction into a
 * separate STUDY_1STEP inventory row.
 *
 * Safety:
 *   - default mode is idempotent and non-destructive
 *   - only rows with source prefix "Matheo IN Formula Study v1" are reused
 *   - existing NCERT / LLM / admin-authored rows are not deleted
 *   - use --refresh only when you deliberately want to recreate this generated
 *     source prefix for the selected chapters
 *
 * Usage:
 *   DATABASE_URL=... npx ts-node scripts/seed-india-mastery-problems.ts
 *   DATABASE_URL=... npx ts-node scripts/seed-india-study-problems.ts
 *   DATABASE_URL=... npx ts-node scripts/seed-india-study-problems.ts --code C7-CH01-INTEGERS
 *   DATABASE_URL=... npx ts-node scripts/seed-india-study-problems.ts --refresh
 */

import {
  Prisma,
  PrismaClient,
  SetStatus,
  SetType,
  StepType,
} from '@prisma/client';
import { NCERT_CHAPTERS, NcertChapter } from '../src/common/curriculum/ncert-chapters';

const prisma = new PrismaClient();
const STUDY_SOURCE_PREFIX = 'Matheo IN Formula Study v1';
const MASTERY_SOURCE_PREFIX = 'Matheo IN Formula Mastery v1';
const TARGET = 20;

const args = process.argv.slice(2);
const refresh = args.includes('--refresh');
const dryRun = args.includes('--dry-run');
const codeIdx = args.indexOf('--code');
const onlyCode = codeIdx >= 0 ? args[codeIdx + 1] : null;

const masteryProblemInclude = {
  steps: {
    orderBy: { stepIndex: 'asc' as const },
    include: {
      choices: { orderBy: { choiceIndex: 'asc' as const } },
    },
  },
} satisfies Prisma.ProblemInclude;

type MasteryProblem = Prisma.ProblemGetPayload<{ include: typeof masteryProblemInclude }>;
type MasteryStep = MasteryProblem['steps'][number];

type LessonRow = {
  id: string;
  unitId: string | null;
  subUnitId: string | null;
  chapterCode: string;
};

function orderedByIds<T extends { id: string }>(ids: string[], rows: T[]): T[] {
  const byId = new Map(rows.map((row) => [row.id, row]));
  return ids.map((id) => byId.get(id)).filter((row): row is T => Boolean(row));
}

function answerStepFor(problem: MasteryProblem, chapterCode: string, slot: number): MasteryStep {
  const answerStep = problem.steps.find((step) => step.stepType === StepType.ANSWER);
  if (!answerStep) {
    throw new Error(`${chapterCode} slot ${slot}: source mastery problem has no ANSWER step`);
  }
  if (answerStep.choices.length !== 5) {
    throw new Error(`${chapterCode} slot ${slot}: ANSWER choices != 5`);
  }
  const correctCount = answerStep.choices.filter((choice) => choice.isCorrect).length;
  if (correctCount !== 1) {
    throw new Error(`${chapterCode} slot ${slot}: ANSWER correct choices != 1`);
  }
  return answerStep;
}

function polishedStudyRationale(choice: MasteryStep['choices'][number], chapterTitle: string): string | undefined {
  if (choice.isCorrect) return undefined;
  const raw = choice.rationale?.trim() ?? '';
  if (raw && !/plausible wrong answer|common calculation|process slip/i.test(raw)) {
    return raw;
  }
  if (choice.distractorType === 'CALC_ERROR') {
    return 'This answer is close, but it comes from a calculation slip. Recheck the signs, arithmetic, or exponent in the final step.';
  }
  if (choice.distractorType === 'PROCESS_SKIP') {
    return 'This comes from stopping one step early. Finish the substitution and simplification before choosing.';
  }
  if (choice.distractorType === 'CONCEPT_CONFUSION') {
    return `This uses a different concept. This question is testing ${chapterTitle}, so match the chapter idea first.`;
  }
  if (choice.distractorType === 'TIME_PRESSURE_GUESS') {
    return 'This looks like a quick guess. Write the setup first so the answer follows from the problem.';
  }
  return 'This option does not follow from the setup. Check the formula and the final simplification before trying again.';
}

function studyExpectedSolution(problem: MasteryProblem): Prisma.InputJsonValue | undefined {
  const raw = problem.expectedSolutionSteps as any;
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const steps = Array.isArray(raw.steps) ? raw.steps.map((step: unknown) => String(step)) : [];
    const explanation = typeof raw.explanation === 'string'
      ? raw.explanation
      : steps.length > 0
        ? [
          'Work through the setup in order:',
          ...steps.map((step: string, index: number) => `${index + 1}. ${step}`),
          `So the correct answer is ${problem.answer}.`,
        ].join('\n')
        : null;
    return {
      ...raw,
      ...(steps.length > 0 ? { steps } : {}),
      ...(explanation ? { explanation } : {}),
    } as Prisma.InputJsonValue;
  }
  return {
    explanation: `Use the key idea, substitute the given values carefully, and simplify to get ${problem.answer}.`,
  };
}

async function deleteGeneratedRows(lessonId: string) {
  const existing = await prisma.problem.findMany({
    where: { conceptLessonId: lessonId, source: { startsWith: STUDY_SOURCE_PREFIX } },
    select: { id: true },
  });
  if (existing.length === 0) return 0;

  const ids = existing.map((problem) => problem.id);
  await prisma.attempt.deleteMany({ where: { problemId: { in: ids } } });
  await prisma.wrongNote.deleteMany({ where: { problemId: { in: ids } } }).catch(() => undefined);
  await prisma.recommendationLog.deleteMany({ where: { recommendedProblemId: { in: ids } } });
  const deleted = await prisma.problem.deleteMany({ where: { id: { in: ids } } });
  return deleted.count;
}

async function findMasteryProblemIds(chapter: NcertChapter, lesson: LessonRow): Promise<string[]> {
  const set = await prisma.lessonProblemSet.findUnique({
    where: {
      country_chapterCode_setType_version: {
        country: 'IN',
        chapterCode: chapter.chapterCode,
        setType: SetType.MASTERY_3STEP,
        version: 1,
      },
    },
    select: { problemIds: true },
  });
  if (set?.problemIds.length) return set.problemIds.slice(0, TARGET);

  const lessonWithIds = await prisma.conceptLesson.findUnique({
    where: { id: lesson.id },
    select: { masterySetProblemIds: true },
  });
  if (lessonWithIds?.masterySetProblemIds.length) {
    return lessonWithIds.masterySetProblemIds.slice(0, TARGET);
  }

  const generated = await prisma.problem.findMany({
    where: {
      conceptLessonId: lesson.id,
      source: { startsWith: MASTERY_SOURCE_PREFIX },
      steps: { some: { stepType: StepType.ANSWER } },
    },
    select: { id: true, source: true },
    orderBy: { source: 'asc' },
    take: TARGET,
  });
  return generated.map((problem) => problem.id);
}

async function fetchMasteryProblems(ids: string[]): Promise<MasteryProblem[]> {
  const rows = await prisma.problem.findMany({
    where: { id: { in: ids } },
    include: masteryProblemInclude,
  });
  return orderedByIds(ids, rows);
}

async function ensureChapter(chapter: NcertChapter, lesson: LessonRow) {
  if (refresh && !dryRun) {
    await deleteGeneratedRows(lesson.id);
  }

  const masteryIds = await findMasteryProblemIds(chapter, lesson);
  if (masteryIds.length < TARGET) {
    return {
      code: chapter.chapterCode,
      created: 0,
      reused: 0,
      status: `NEEDS_MASTERY_${masteryIds.length}/${TARGET}`,
    };
  }

  const masteryProblems = await fetchMasteryProblems(masteryIds.slice(0, TARGET));
  if (masteryProblems.length !== TARGET) {
    return {
      code: chapter.chapterCode,
      created: 0,
      reused: 0,
      status: `MISSING_MASTERY_ROWS_${masteryProblems.length}/${TARGET}`,
    };
  }

  const ids: string[] = [];
  let created = 0;
  let reused = 0;

  for (let slot = 0; slot < TARGET; slot++) {
    const source = `${STUDY_SOURCE_PREFIX} | ${chapter.chapterCode} | slot ${String(slot + 1).padStart(2, '0')}`;
    const found = await prisma.problem.findFirst({
      where: { conceptLessonId: lesson.id, source },
      select: { id: true },
    });
    if (found) {
      ids.push(found.id);
      reused++;
      continue;
    }

    const masteryProblem = masteryProblems[slot];
    const answerStep = answerStepFor(masteryProblem, chapter.chapterCode, slot + 1);
    const unitId = lesson.unitId ?? masteryProblem.unitId;

    if (!unitId) {
      return { code: chapter.chapterCode, created, reused, status: 'SKIPPED_NO_UNIT' };
    }

    if (dryRun) {
      ids.push(`dry-${chapter.chapterCode}-${slot + 1}`);
      created++;
      continue;
    }

    const problem = await prisma.problem.create({
      data: {
        source,
        unitId,
        ...(lesson.subUnitId ?? masteryProblem.subUnitId
          ? { subUnitId: lesson.subUnitId ?? masteryProblem.subUnitId ?? undefined }
          : {}),
        conceptLessonId: lesson.id,
        difficulty: masteryProblem.difficulty,
        difficultyLevel: masteryProblem.difficultyLevel,
        body: masteryProblem.body,
        formula: masteryProblem.formula,
        concept: masteryProblem.concept,
        answer: masteryProblem.answer,
        hint: masteryProblem.hint,
        requiredSkills: masteryProblem.requiredSkills,
        commonErrorCodes: masteryProblem.commonErrorCodes,
        expectedSolutionSteps: studyExpectedSolution(masteryProblem),
        expectedTimeSec: Math.max(60, Math.round((masteryProblem.expectedTimeSec ?? 180) / 2)),
        steps: {
          create: [{
            stepIndex: 1,
            stepType: StepType.ANSWER,
            prompt: answerStep.prompt || 'What is the final answer?',
            choices: {
              create: answerStep.choices.map((choice, idx) => {
                const rationale = polishedStudyRationale(choice, chapter.titleEn);
                return {
                  choiceIndex: idx + 1,
                  text: choice.text,
                  isCorrect: choice.isCorrect,
                  ...(choice.distractorType ? { distractorType: choice.distractorType } : {}),
                  ...(choice.distractorErrorCode ? { distractorErrorCode: choice.distractorErrorCode } : {}),
                  ...(rationale ? { rationale } : {}),
                };
              }),
            },
          }],
        },
      },
      select: { id: true },
    });
    ids.push(problem.id);
    created++;
  }

  if (ids.length !== TARGET) {
    throw new Error(`${chapter.chapterCode}: generated/reused ${ids.length}/${TARGET}`);
  }

  if (!dryRun) {
    await prisma.lessonProblemSet.upsert({
      where: {
        country_chapterCode_setType_version: {
          country: 'IN',
          chapterCode: chapter.chapterCode,
          setType: SetType.STUDY_1STEP,
          version: 1,
        },
      },
      update: {
        conceptLessonId: lesson.id,
        koreanConceptLessonId: null,
        problemIds: ids,
        status: SetStatus.READY,
        curatedAt: new Date(),
        retiredAt: null,
      },
      create: {
        country: 'IN',
        chapterCode: chapter.chapterCode,
        setType: SetType.STUDY_1STEP,
        version: 1,
        conceptLessonId: lesson.id,
        problemIds: ids,
        status: SetStatus.READY,
        curatedAt: new Date(),
      },
    });
  }

  return { code: chapter.chapterCode, created, reused, status: 'READY' };
}

async function main() {
  const chapters = onlyCode
    ? NCERT_CHAPTERS.filter((chapter) => chapter.chapterCode === onlyCode)
    : NCERT_CHAPTERS;
  if (onlyCode && chapters.length === 0) throw new Error(`Unknown chapterCode: ${onlyCode}`);

  console.log(`India Study formula seed: chapters=${chapters.length} target=${TARGET} refresh=${refresh} dryRun=${dryRun}`);
  console.log(`study source prefix: ${STUDY_SOURCE_PREFIX}`);
  console.log(`mastery source prefix: ${MASTERY_SOURCE_PREFIX}\n`);

  let totalCreated = 0;
  let totalReused = 0;
  let skipped = 0;

  for (const chapter of chapters) {
    const lesson = await prisma.conceptLesson.findUnique({
      where: { chapterCode: chapter.chapterCode },
      select: {
        id: true,
        unitId: true,
        subUnitId: true,
        chapterCode: true,
      },
    });
    if (!lesson) {
      skipped++;
      console.log(`[skip] ${chapter.chapterCode} no ConceptLesson`);
      continue;
    }

    const result = await ensureChapter(chapter, lesson);
    if (result.status !== 'READY') {
      skipped++;
      console.log(`[skip] ${result.code} ${result.status}`);
      continue;
    }
    totalCreated += result.created;
    totalReused += result.reused;
    console.log(`[ready] ${result.code} created=${result.created} reused=${result.reused}`);
  }

  console.log('');
  console.log(`Done. created=${totalCreated} reused=${totalReused} skipped=${skipped}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
