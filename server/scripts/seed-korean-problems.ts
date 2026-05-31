/**
 * seed-korean-problems.ts — KOREAN_PROBLEMS 를 읽어 Problem +
 * ProblemStep + ProblemChoice rows 를 생성.
 *
 * 2026-05-24 사용자 spec 적용:
 *   - 각 문제 = 3-step (CONCEPT / PROCESS / ANSWER)
 *   - 각 step = 5지선다 (1 정답 + 4 오답)
 *   - 오답마다 distractorErrorCode + rationale
 *   - Problem.koreanConceptLessonId = KoreanConceptLesson.id
 *   - Problem.source = "Matheo KR (2022 개정) · 자체 제작"
 *   - KoreanConceptLesson.masterySetProblemIds = 시드된 20문제 id (정확히 20개일 때만)
 *
 * Idempotent: 같은 chapter 의 기존 Problem rows 모두 지우고 새로 삽입.
 * masterySetProblemIds 와 masterySetCuratedAt 도 함께 갱신.
 *
 * Usage:
 *   npx ts-node scripts/seed-korean-problems.ts
 *   npx ts-node scripts/seed-korean-problems.ts --code K-G7-MATH1-CH02-INTEGERS
 */

import { PrismaClient, Difficulty, StepType } from '@prisma/client';
import { KOREAN_PROBLEMS, KoreanProblemSeed } from '../src/common/curriculum/korean-problems';

const args = process.argv.slice(2);
const codeIdx = args.indexOf('--code');
const specificCode = codeIdx >= 0 ? args[codeIdx + 1] : null;

const DIFFICULTY_MAP: Record<KoreanProblemSeed['difficulty'], Difficulty> = {
  easy: 'MIDDLE',
  medium: 'UPPER_MIDDLE',
  hard: 'SEMI_KILLER',
};
const DIFFICULTY_LEVEL: Record<KoreanProblemSeed['difficulty'], number> = {
  easy: 2, medium: 3, hard: 4,
};

const STEP_TYPE_MAP: Record<'CONCEPT' | 'PROCESS' | 'ANSWER', StepType> = {
  CONCEPT: StepType.CONCEPT,
  PROCESS: StepType.PROCESS,
  ANSWER: StepType.ANSWER,
};

async function main() {
  const prisma = new PrismaClient();
  const codes = specificCode ? [specificCode] : Object.keys(KOREAN_PROBLEMS);
  console.log(`Seeding Korean problems for ${codes.length} chapter(s)...\n`);

  let problemsCreated = 0;
  let chaptersSkipped = 0;

  for (const code of codes) {
    const chapter = KOREAN_PROBLEMS[code];
    if (!chapter) {
      chaptersSkipped += 1;
      console.log(`[skip] ${code} — no entry in KOREAN_PROBLEMS`);
      continue;
    }
    const lesson = await prisma.koreanConceptLesson.findUnique({ where: { chapterCode: code } });
    if (!lesson) {
      chaptersSkipped += 1;
      console.log(`[skip] ${code} — no KoreanConceptLesson row`);
      continue;
    }

    // Fetch a fallback Unit (Korean problems don't map to an NCERT unit, but
    // the Problem schema still requires unitId NOT NULL). Use the first unit
    // available; the koreanConceptLessonId is the real curriculum link.
    const fallbackUnit = await prisma.unit.findFirst({
      orderBy: { order: 'asc' },
      select: { id: true },
    });
    if (!fallbackUnit) {
      console.log(`[skip] ${code} — no Unit row to act as Problem.unitId fallback`);
      chaptersSkipped += 1;
      continue;
    }

    // Idempotent: wipe existing Korean problems + their dependents for this chapter.
    // Attempt has FK to Problem without cascade, so we must delete Attempts first;
    // WrongNote → Attempt cascades via WrongNote_problemId_fkey if present.
    const existing = await prisma.problem.findMany({
      where: { koreanConceptLessonId: lesson.id },
      select: { id: true },
    });
    if (existing.length > 0) {
      const ids = existing.map((p) => p.id);
      // Dependents that don't cascade — manual delete.
      await prisma.attempt.deleteMany({ where: { problemId: { in: ids } } });
      await prisma.wrongNote.deleteMany({ where: { problemId: { in: ids } } }).catch(() => {});
      // Steps + Choices cascade via Problem.onDelete=Cascade chain.
      await prisma.problem.deleteMany({ where: { id: { in: ids } } });
    }
    // Also clear stale masterySetProblemIds on the lesson before re-seeding.
    await prisma.koreanConceptLesson.update({
      where: { id: lesson.id },
      data: { masterySetProblemIds: [], masterySetCuratedAt: null },
    });

    const createdProblemIds: string[] = [];
    for (const p of chapter.problems) {
      // ANSWER step 의 정답 텍스트를 Problem.answer 로 (legacy compatibility).
      const answerStep = p.steps.find((s) => s.stepType === 'ANSWER');
      const answerText = answerStep?.options.find((o) => o.isCorrect)?.text ?? '';
      const problem = await prisma.problem.create({
        data: {
          source: 'Matheo KR (2022 개정) · 자체 제작',
          unitId: fallbackUnit.id,
          koreanConceptLessonId: lesson.id,
          difficulty: DIFFICULTY_MAP[p.difficulty],
          body: p.stem,
          concept: p.concept,
          answer: answerText,
          requiredSkills: p.requiredSkills,
          difficultyLevel: DIFFICULTY_LEVEL[p.difficulty],
          expectedSolutionSteps: { explanation: p.solution } as any,
          steps: {
            create: p.steps.map((step, sIdx) => ({
              stepIndex: sIdx + 1,
              stepType: STEP_TYPE_MAP[step.stepType] as any,
              prompt: step.prompt,
              choices: {
                create: step.options.map((o, cIdx) => ({
                  choiceIndex: cIdx + 1,
                  text: o.text,
                  isCorrect: o.isCorrect,
                  distractorErrorCode: o.errorCode,
                  rationale: o.errorReason,
                })),
              },
            })),
          },
        },
        select: { id: true },
      });
      createdProblemIds.push(problem.id);
      problemsCreated += 1;
    }

    // Mastery 20-set 자동 동결: 정확히 20문제일 때만 채움. 시드 순서 그대로
    // (사용자 spec의 난이도 분배 순서 = Q1 쉬움 → Q20 어려움) 유지.
    if (createdProblemIds.length === 20) {
      await prisma.koreanConceptLesson.update({
        where: { id: lesson.id },
        data: {
          masterySetProblemIds: createdProblemIds,
          masterySetCuratedAt: new Date(),
        },
      });
    }
    console.log(`[ok]   ${code}  ${chapter.problems.length} problems${createdProblemIds.length === 20 ? '  (masterySet 20 frozen)' : ''}`);
  }

  console.log(`\nDone. problems=${problemsCreated} chaptersSkipped=${chaptersSkipped}`);

  // Coverage summary
  const counts = await prisma.koreanConceptLesson.findMany({
    select: {
      chapterCode: true,
      titleKo: true,
      _count: { select: { problems: true } },
    },
    orderBy: [{ koreanGrade: 'asc' }, { koreanSubject: 'asc' }, { chapterNumber: 'asc' }],
  });
  const withProblems = counts.filter((c) => c._count.problems > 0).length;
  console.log(`Coverage: ${withProblems}/${counts.length} chapters have problems.`);

  await prisma.$disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
