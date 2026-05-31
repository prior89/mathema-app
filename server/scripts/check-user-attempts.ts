/**
 * Check a user's Attempt count per Korean chapter. Used to diagnose why
 * Home tab chapter-progress shows no rows — the SQL filters HAVING COUNT(a.id) > 0
 * so chapters without any Attempt row are dropped.
 *
 * Usage: npx ts-node --transpile-only scripts/check-user-attempts.ts <email>
 */
import { PrismaClient } from '@prisma/client';

async function main() {
  const email = process.argv[2] ?? 'polopot123@gmail.com';
  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, country: true, gradeLevel: true },
  });
  if (!user) { console.error(`no user: ${email}`); process.exit(1); }
  console.log(`User: ${user.id}  ${user.name}  country=${user.country}  grade=${user.gradeLevel}\n`);

  // KR chapter attempt counts
  const rows = await prisma.$queryRawUnsafe<Array<{
    chapter_code: string;
    title_ko: string;
    distinct_problems: bigint;
    total_attempts: bigint;
    latest_at: Date | null;
  }>>(
    `SELECT kcl."chapterCode" AS chapter_code,
            kcl."titleKo"      AS title_ko,
            COUNT(DISTINCT a."problemId") AS distinct_problems,
            COUNT(a.id)                   AS total_attempts,
            MAX(a."createdAt")            AS latest_at
     FROM "Attempt" a
     JOIN "Problem" p           ON p.id = a."problemId"
     JOIN "KoreanConceptLesson" kcl ON kcl.id = p."koreanConceptLessonId"
     WHERE a."userId" = $1
       AND a."context" IN ('STUDY', 'PRACTICE')
     GROUP BY kcl."chapterCode", kcl."titleKo"
     ORDER BY MAX(a."createdAt") DESC NULLS LAST`,
    user.id,
  );
  if (rows.length === 0) {
    console.log('No Attempt rows for any KR chapter.');
  } else {
    console.log('KR chapters with Attempts:');
    for (const r of rows) {
      console.log(`  ${r.chapter_code.padEnd(36)}  problems=${r.distinct_problems}  attempts=${r.total_attempts}  last=${r.latest_at?.toISOString() ?? '-'}`);
    }
  }
  await prisma.$disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
