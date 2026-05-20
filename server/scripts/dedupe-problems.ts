/**
 * dedupe-problems — drop exact-body duplicate Problems within each chapter.
 *
 * The prewarm-mastery script generates 5-way parallel LLM calls, and the
 * model often returns near-identical questions across that batch
 * (e.g. "cube side 5 cm — total surface area" appearing twice in a row).
 * Once those collide on the pool they make Study / Mastery feel repetitive.
 *
 * Strategy (per chapter × body):
 *   1. Find groups of Problem rows that share (conceptLessonId, body).
 *   2. Within each group, rank by:
 *        (a) attempts count (DESC) — never delete one a student has touched;
 *        (b) createdAt (ASC) — keep the original, drop the copies.
 *   3. Keep the top-ranked row, delete the rest in a single transaction.
 *
 * Schema gives us cascade for ProblemStep / ProblemChoice / ProblemConcept /
 * Attempt / WrongNote (relations declared with onDelete: Cascade), so the
 * Problem delete cleans up its children automatically.
 *
 * Usage:
 *   cd server
 *   npx ts-node scripts/dedupe-problems.ts            # all chapters
 *   npx ts-node scripts/dedupe-problems.ts --dry-run  # report only, no delete
 */
import { PrismaClient } from '@prisma/client';

async function main(): Promise<void> {
  const dryRun = process.argv.includes('--dry-run');
  const prisma = new PrismaClient();

  try {
    // Pull every (chapter, body) group with more than one row.
    type Row = { conceptLessonId: string | null; body: string; n: bigint };
    const dupGroups = await prisma.$queryRaw<Row[]>`
      SELECT p."conceptLessonId", p.body, COUNT(*)::bigint AS n
      FROM "Problem" p
      WHERE p."conceptLessonId" IS NOT NULL
      GROUP BY p."conceptLessonId", p.body
      HAVING COUNT(*) > 1
      ORDER BY n DESC;
    `;
    console.log(`Duplicate (chapter × body) groups: ${dupGroups.length}`);
    if (dupGroups.length === 0) {
      console.log('Nothing to clean.');
      return;
    }

    let totalDelete = 0;
    let totalProtected = 0;
    const deletePerChapter = new Map<string, number>();

    for (const g of dupGroups) {
      if (!g.conceptLessonId) continue;

      // Rank rows in the group. Attempted ones are protected; among the
      // rest the oldest is kept (most likely the seeded canonical), newer
      // dupes drop.
      const ranked = await prisma.$queryRaw<Array<{ id: string; attempts: bigint; created: Date }>>`
        SELECT p.id,
               (SELECT COUNT(*) FROM "Attempt" a WHERE a."problemId" = p.id)::bigint AS attempts,
               p."createdAt" AS created
        FROM "Problem" p
        WHERE p."conceptLessonId" = ${g.conceptLessonId}
          AND p.body = ${g.body}
        ORDER BY (SELECT COUNT(*) FROM "Attempt" a WHERE a."problemId" = p.id) DESC,
                 p."createdAt" ASC;
      `;
      // Survivor: ranked[0].  If that row is "protected" (any attempt) AND
      // there's another protected row too, drop only the unprotected copies.
      const protectedIds = ranked.filter((r) => Number(r.attempts) > 0).map((r) => r.id);
      const candidatesForDelete = ranked
        .slice(1)
        .filter((r) => Number(r.attempts) === 0)
        .map((r) => r.id);

      // Edge case: every duplicate has attempts. Keep all, log.
      if (candidatesForDelete.length === 0) {
        totalProtected += ranked.length;
        continue;
      }

      const tally = deletePerChapter.get(g.conceptLessonId) ?? 0;
      deletePerChapter.set(g.conceptLessonId, tally + candidatesForDelete.length);
      totalDelete += candidatesForDelete.length;
      totalProtected += protectedIds.length;

      if (!dryRun) {
        await prisma.problem.deleteMany({ where: { id: { in: candidatesForDelete } } });
      }
    }

    // Map conceptLessonId → chapterCode for the report.
    const ids = Array.from(deletePerChapter.keys());
    const lessons = ids.length
      ? await prisma.conceptLesson.findMany({
          where: { id: { in: ids } },
          select: { id: true, chapterCode: true },
        })
      : [];
    const codeById = new Map(lessons.map((l) => [l.id, l.chapterCode]));

    console.log('\nDeletions by chapter:');
    const entries = Array.from(deletePerChapter.entries()).sort(([, a], [, b]) => b - a);
    for (const [lessonId, count] of entries) {
      console.log(`  ${codeById.get(lessonId) ?? lessonId.slice(0, 8)}  -${count}`);
    }
    console.log(`\nTotal Problems ${dryRun ? 'to delete' : 'deleted'}: ${totalDelete}`);
    console.log(`Protected (had student attempts): ${totalProtected}`);
    if (dryRun) console.log('\nDRY RUN — no changes written. Re-run without --dry-run to apply.');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
