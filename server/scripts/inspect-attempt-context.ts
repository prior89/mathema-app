import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
(async () => {
  const a = await prisma.attempt.findUnique({
    where: { id: 'fe102cec-64c9-4690-9e27-ebe6c0272bb7' },
    select: {
      context: true,
      stepIndex: true,
      problemId: true,
      isCorrect: true,
      createdAt: true,
      problem: {
        select: {
          koreanConceptLessonId: true,
          koreanConceptLesson: {
            select: {
              chapterCode: true,
              masterySetProblemIds: true,
            },
          },
        },
      },
    },
  });
  console.log('attempt.context:', a?.context);
  console.log('attempt.stepIndex:', a?.stepIndex);
  console.log('attempt.isCorrect:', a?.isCorrect);
  console.log('attempt.createdAt:', a?.createdAt);
  console.log('lesson.chapterCode:', a?.problem?.koreanConceptLesson?.chapterCode);
  console.log(
    'lesson.masterySetProblemIds.length:',
    a?.problem?.koreanConceptLesson?.masterySetProblemIds?.length,
  );
  console.log(
    'this problem in masterySet?:',
    a?.problem?.koreanConceptLesson?.masterySetProblemIds?.includes(a!.problemId),
  );
  const stepCount = await prisma.problemStep.count({ where: { problemId: a!.problemId } });
  console.log('problem.steps count:', stepCount);

  // Run the exact dashboard query for this user
  const userId = (
    await prisma.attempt.findUnique({
      where: { id: 'fe102cec-64c9-4690-9e27-ebe6c0272bb7' },
      select: { userId: true },
    })
  )?.userId;
  console.log('userId:', userId);

  const rows = await prisma.$queryRawUnsafe<any[]>(
    `SELECT kcl."chapterCode" AS chapter_code,
            COUNT(DISTINCT p.id) AS problems_total,
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
     GROUP BY kcl.id, kcl."chapterCode"
     HAVING COUNT(a.id) > 0
     ORDER BY MAX(a."createdAt") DESC NULLS LAST
     LIMIT 10`,
    userId,
  );
  console.log('\ndashboard.chapterProgressKorean rows:');
  for (const r of rows) {
    console.log(
      `  ${r.chapter_code}  total=${r.problems_total}  attempted=${r.problems_attempted}  attempts=${r.total_attempts}`,
    );
  }

  await prisma.$disconnect();
})();
