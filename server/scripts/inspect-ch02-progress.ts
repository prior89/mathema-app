/**
 * Diagnose: 사용자가 "20/20 다 푼 챕터"에서 단원학습 재진입 시 첫 문제가
 * 아니라 #3 문제로 떨어지는 현상.
 *
 * Hypothesis: nextProblemId 계산은 stepIndex=3 (ANSWER) attempt 기준인데
 * dashboard의 100% 표시는 unique problem.id 기준. 그 미스매치가 문제.
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const CHAPTER = 'K-G7-MATH1-CH02-INTEGERS';

async function main() {
  // 가장 최근 KR attempt 사용자.
  const recentAtt = await prisma.attempt.findFirst({
    where: { problem: { koreanConceptLesson: { chapterCode: CHAPTER } } },
    orderBy: { createdAt: 'desc' },
    select: { userId: true },
  });
  if (!recentAtt) {
    console.log('No KR attempts for this chapter yet.');
    return;
  }
  const userId = recentAtt.userId;
  console.log(`User: ${userId}\n`);

  const lesson = await prisma.koreanConceptLesson.findUnique({
    where: { chapterCode: CHAPTER },
    select: { id: true, masterySetProblemIds: true },
  });
  if (!lesson) { console.log('lesson missing'); return; }

  const problems = await prisma.problem.findMany({
    where: { koreanConceptLessonId: lesson.id },
    select: { id: true, source: true, _count: { select: { steps: true } } },
  });
  console.log(`Problems in chapter: ${problems.length}`);
  console.log(`masterySetProblemIds.length: ${lesson.masterySetProblemIds.length}`);

  const multiStep = problems.filter((p) => p._count.steps === 3);
  const singleStep = problems.filter((p) => p._count.steps === 1);
  console.log(`Multi-step (Mastery 3-step) problems: ${multiStep.length}`);
  console.log(`Single-step (Study) problems: ${singleStep.length}`);

  // 사용자의 attempts 전체 (KR + this chapter)
  const allAtt = await prisma.attempt.findMany({
    where: {
      userId,
      problem: { koreanConceptLessonId: lesson.id },
      context: { in: ['STUDY', 'PRACTICE'] },
    },
    select: {
      problemId: true, stepIndex: true, isCorrect: true,
      problem: { select: { source: true, _count: { select: { steps: true } } } },
    },
  });
  console.log(`\nUser attempts on this chapter: ${allAtt.length}`);

  // Group by problem.
  const byProblem = new Map<string, { source: string; steps: Set<number>; correct: Set<number> }>();
  for (const a of allAtt) {
    if (!byProblem.has(a.problemId)) {
      byProblem.set(a.problemId, {
        source: a.problem.source,
        steps: new Set(),
        correct: new Set(),
      });
    }
    const entry = byProblem.get(a.problemId)!;
    if (typeof a.stepIndex === 'number') entry.steps.add(a.stepIndex);
    if (a.isCorrect && typeof a.stepIndex === 'number') entry.correct.add(a.stepIndex);
  }

  // Multi-step problems coverage
  console.log(`\nMulti-step coverage (in masterySet order):`);
  const ordered = lesson.masterySetProblemIds.length === 20
    ? lesson.masterySetProblemIds
    : multiStep.map((p) => p.id);
  let fullyAnswered = 0;
  let answerStepMissing = 0;
  ordered.forEach((pid, i) => {
    const entry = byProblem.get(pid);
    if (!entry) {
      console.log(`  #${i + 1} ${pid.slice(0, 8)}… : NO attempts`);
      answerStepMissing++;
    } else {
      const stepsStr = [1, 2, 3].map((s) => entry.steps.has(s) ? '✓' : '·').join('');
      const hasAnswerStep = entry.steps.has(3);
      if (entry.steps.size === 3) fullyAnswered++;
      if (!hasAnswerStep) answerStepMissing++;
      const flag = hasAnswerStep ? '' : '  ← missing ANSWER step';
      console.log(`  #${i + 1} ${pid.slice(0, 8)}… steps=${stepsStr}${flag}`);
    }
  });
  console.log(`\nfullyAnswered (all 3 steps): ${fullyAnswered}/20`);
  console.log(`missing-ANSWER-step: ${answerStepMissing}/20`);
  console.log(`unique problems attempted: ${byProblem.size}/20`);

  // chapterProgressKorean SQL replays
  const rows = await prisma.$queryRawUnsafe<any[]>(
    `SELECT COUNT(DISTINCT p.id) AS problems_total,
            COUNT(DISTINCT CASE WHEN a.id IS NOT NULL THEN p.id END) AS problems_attempted,
            COUNT(a.id) AS total_attempts
     FROM "KoreanConceptLesson" kcl
     LEFT JOIN "Problem" p ON p."koreanConceptLessonId" = kcl.id
                          AND (SELECT COUNT(*) FROM "ProblemStep" ps WHERE ps."problemId" = p.id) = 3
                          AND (
                            COALESCE(array_length(kcl."masterySetProblemIds", 1), 0) <> 20
                            OR p.id = ANY(kcl."masterySetProblemIds")
                          )
     LEFT JOIN "Attempt" a ON a."problemId" = p.id
                          AND a."userId" = $1
                          AND a."context" IN ('STUDY', 'PRACTICE')
     WHERE kcl."chapterCode" = $2
     GROUP BY kcl.id`,
    userId, CHAPTER,
  );
  console.log(`\ndashboard chapterProgressKorean result:`);
  console.log(`  problems_total = ${rows[0]?.problems_total}`);
  console.log(`  problems_attempted = ${rows[0]?.problems_attempted}`);
  console.log(`  total_attempts = ${rows[0]?.total_attempts}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
