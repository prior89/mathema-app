/**
 * seed-korean-study-problems.ts — Study (single-step) pool 시드.
 *
 * Mastery 3-step pool과 별도. KoreanConceptLesson.id를 koreanConceptLessonId
 * FK로 사용하되 ProblemStep 1개 (stepType=ANSWER) — Mastery 풀과 구분.
 * Mastery filter (steps.length=3) 가 Study problem을 제외함.
 *
 * Idempotent: 같은 chapter 의 single-step Problem rows 만 청소 (3-step Mastery
 * rows 는 보존). Attempt FK cascade 처리.
 */
import { PrismaClient, Difficulty, StepType } from '@prisma/client';
import { KOREAN_STUDY_PROBLEMS, KoreanStudyProblemSeed } from '../src/common/curriculum/korean-problems';

const args = process.argv.slice(2);
const codeIdx = args.indexOf('--code');
const specificCode = codeIdx >= 0 ? args[codeIdx + 1] : null;

const DIFFICULTY_MAP: Record<KoreanStudyProblemSeed['difficulty'], Difficulty> = {
  easy: 'MIDDLE', medium: 'UPPER_MIDDLE', hard: 'SEMI_KILLER',
};
const DIFFICULTY_LEVEL: Record<KoreanStudyProblemSeed['difficulty'], number> = {
  easy: 2, medium: 3, hard: 4,
};

async function main() {
  const prisma = new PrismaClient();
  const codes = specificCode ? [specificCode] : Object.keys(KOREAN_STUDY_PROBLEMS);
  console.log(`Seeding KR Study (single-step) for ${codes.length} chapter(s)...\n`);

  let created = 0;
  for (const code of codes) {
    const chapter = KOREAN_STUDY_PROBLEMS[code];
    if (!chapter) { console.log(`[skip] ${code} — no STUDY entry`); continue; }
    const lesson = await prisma.koreanConceptLesson.findUnique({ where: { chapterCode: code } });
    if (!lesson) { console.log(`[skip] ${code} — no KoreanConceptLesson`); continue; }
    const fallbackUnit = await prisma.unit.findFirst({ orderBy: { order: 'asc' }, select: { id: true } });
    if (!fallbackUnit) { console.log(`[skip] ${code} — no Unit fallback`); continue; }

    // Idempotent: wipe ONLY single-step KR Study problems for this lesson.
    // Mastery 3-step rows (steps.length=3) 는 보존 — 같은 koreanConceptLessonId
    // 사용하지만 별도 풀로 식별.
    const existingSingles = await prisma.problem.findMany({
      where: {
        koreanConceptLessonId: lesson.id,
        steps: { every: { stepType: 'ANSWER' } }, // single-step only
      },
      include: { steps: true },
    });
    const singleIds = existingSingles
      .filter((p) => p.steps.length === 1)
      .map((p) => p.id);
    if (singleIds.length > 0) {
      await prisma.attempt.deleteMany({ where: { problemId: { in: singleIds } } });
      await prisma.wrongNote.deleteMany({ where: { problemId: { in: singleIds } } });
      await prisma.problem.deleteMany({ where: { id: { in: singleIds } } });
    }

    for (const p of chapter.problems) {
      const answerText = p.options.find((o) => o.isCorrect)?.text ?? '';
      await prisma.problem.create({
        data: {
          source: 'Matheo KR (2022 개정) · Study · 자체 제작',
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
            create: [{
              stepIndex: 1,
              stepType: StepType.ANSWER as any,
              prompt: p.stem,
              choices: {
                create: p.options.map((o, i) => ({
                  choiceIndex: i + 1,
                  text: o.text,
                  isCorrect: o.isCorrect,
                  distractorErrorCode: o.errorCode,
                  rationale: o.errorReason,
                })),
              },
            }],
          },
        },
      });
      created += 1;
    }
    console.log(`[ok]   ${code}  ${chapter.problems.length} STUDY problems seeded`);
  }
  console.log(`\nDone. STUDY problems=${created}`);
  await prisma.$disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
