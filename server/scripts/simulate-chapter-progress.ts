/**
 * Run the chapterProgressKorean SQL for a given user and show what the
 * /dashboard/chapter-progress endpoint would return.
 */
import { PrismaClient } from '@prisma/client';

(async () => {
  const email = process.argv[2] ?? 'polopot3@gmail.com';
  const p = new PrismaClient();
  const user = await p.user.findUnique({ where: { email }, select: { id: true, country: true } });
  if (!user) { console.error('no user'); process.exit(1); }
  console.log(`User ${email}  id=${user.id}  country=${user.country}\n`);

  // Match the exact SQL from dashboard.service.ts:chapterProgressKorean
  const rows = await p.$queryRawUnsafe<Array<any>>(
    `SELECT kcl."chapterCode"        AS chapter_code,
            kcl."titleKo"             AS title_ko,
            kcl."koreanGrade"::text   AS korean_grade,
            kcl."chapterNumber"       AS chapter_number,
            COUNT(DISTINCT p.id)                                                AS problems_total,
            COUNT(DISTINCT CASE WHEN a.id IS NOT NULL THEN p.id END)            AS problems_attempted,
            COUNT(a.id)                                                         AS total_attempts,
            SUM(CASE WHEN a."isCorrect" THEN 1 ELSE 0 END)                      AS correct_attempts,
            MAX(a."createdAt")                                                  AS last_attempt_at
     FROM "KoreanConceptLesson" kcl
     LEFT JOIN "Problem"   p ON p."koreanConceptLessonId" = kcl.id
                            AND (SELECT COUNT(*) FROM "ProblemStep" ps WHERE ps."problemId" = p.id) = 3
                            AND (
                              COALESCE(array_length(kcl."masterySetProblemIds", 1), 0) <> 20
                              OR p.id = ANY(kcl."masterySetProblemIds")
                            )
     LEFT JOIN "Attempt"   a ON a."problemId" = p.id
                            AND a."userId" = $1
                            AND a."context" IN ('STUDY', 'PRACTICE')
     GROUP BY kcl.id, kcl."chapterCode", kcl."titleKo", kcl."koreanGrade", kcl."chapterNumber"
     HAVING COUNT(a.id) > 0
     ORDER BY MAX(a."createdAt") DESC NULLS LAST
     LIMIT 10`,
    user.id,
  );

  console.log(`chapterProgressKorean SQL result: ${rows.length} rows`);
  for (const r of rows) {
    const total = Number(r.problems_total);
    const attempted = Number(r.problems_attempted);
    const progress = total === 0 ? 0 : attempted / Math.min(total, 20);
    console.log(`  ${r.chapter_code.padEnd(36)}  total=${total}  attempted=${attempted}  attempts=${r.total_attempts}  progress=${(progress * 100).toFixed(1)}%`);
  }

  if (rows.length === 0) {
    console.log('\nNo rows. Checking why...');
    const anyAttempt = await p.attempt.count({
      where: { userId: user.id, context: { in: ['STUDY', 'PRACTICE'] } },
    });
    console.log(`  total attempts for user (any context STUDY/PRACTICE): ${anyAttempt}`);
    const krAttempt = await p.attempt.count({
      where: {
        userId: user.id,
        context: { in: ['STUDY', 'PRACTICE'] },
        problem: { koreanConceptLessonId: { not: null } },
      },
    });
    console.log(`  KR attempts (Problem.koreanConceptLessonId != null): ${krAttempt}`);
  }
  await p.$disconnect();
})();
