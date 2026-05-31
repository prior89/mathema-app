import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
(async () => {
  const userId = 'ad7947cb-549b-4e7a-9c08-73648eb362b5';
  const rows = await prisma.$queryRawUnsafe<any[]>(
    `SELECT COUNT(DISTINCT pp.id) AS problems_total,
            COUNT(DISTINCT CASE WHEN a.id IS NOT NULL AND a."stepIndex" = 3 THEN pp.id END) AS problems_attempted_step3,
            COUNT(a.id) AS total_attempts
     FROM "KoreanConceptLesson" kcl
     LEFT JOIN "Problem" pp ON pp."koreanConceptLessonId" = kcl.id
                          AND (SELECT COUNT(*) FROM "ProblemStep" ps WHERE ps."problemId" = pp.id) = 3
                          AND (
                            COALESCE(array_length(kcl."masterySetProblemIds", 1), 0) <> 20
                            OR pp.id = ANY(kcl."masterySetProblemIds")
                          )
     LEFT JOIN "Attempt" a ON a."problemId" = pp.id
                          AND a."userId" = $1
                          AND a."context" IN ('STUDY', 'PRACTICE')
     WHERE kcl."chapterCode" = $2
     GROUP BY kcl.id`,
    userId, 'K-G7-MATH1-CH02-INTEGERS',
  );
  console.log('After fix:');
  console.log('  problems_total =', rows[0]?.problems_total);
  console.log('  problems_attempted_step3 =', rows[0]?.problems_attempted_step3);
  console.log('  total_attempts =', rows[0]?.total_attempts);
  await prisma.$disconnect();
})();
