/**
 * Delete every Problem row that has no ProblemStep with stepIndex=1.
 *
 * Rationale: such rows cannot be served to the UI (practiceProblems filters
 * on `steps.some({ stepIndex: 1 })`) yet still inflate chapter-progress
 * counts and can leak into recommendations. The dashboard SQL was patched
 * to ignore them (P19.1), but the underlying garbage should be removed too.
 *
 * Safety: a prior audit (check-unreachable-deps.ts) confirmed no Attempt /
 * WrongNote / RecommendationLog rows reference these problems. ProblemConcept
 * (the only join with hits) is cleaned up automatically via Cascade.
 *
 * The whole delete runs inside a transaction so a mid-run failure rolls back.
 *
 * Run:
 *   cd server
 *   npx ts-node scripts/cleanup-unreachable-problems.ts
 */
import { PrismaClient } from '@prisma/client';

async function main(): Promise<void> {
  const prisma = new PrismaClient();
  try {
    const before = await prisma.$queryRaw<Array<{ id: string; source: string; chapter_code: string }>>`
      SELECT p.id, p.source, cl."chapterCode" AS chapter_code
      FROM "Problem" p
      JOIN "ConceptLesson" cl ON cl.id = p."conceptLessonId"
      WHERE NOT EXISTS (
        SELECT 1 FROM "ProblemStep" ps
        WHERE ps."problemId" = p.id AND ps."stepIndex" = 1
      )
      ORDER BY cl."chapterCode", p."createdAt";
    `;

    console.log(`Unreachable Problem rows to delete: ${before.length}`);
    for (const r of before) {
      console.log(`  ${r.chapter_code.padEnd(28)}  ${r.id}  ${r.source}`);
    }
    if (before.length === 0) return;

    const ids = before.map((r) => r.id);

    const result = await prisma.$transaction(async (tx) => {
      const concepts = await tx.problemConcept.deleteMany({
        where: { problemId: { in: ids } },
      });
      const problems = await tx.problem.deleteMany({
        where: { id: { in: ids } },
      });
      return { concepts: concepts.count, problems: problems.count };
    });

    console.log(`\nDeleted ${result.problems} Problem rows, ${result.concepts} ProblemConcept rows.`);

    const stillBroken = await prisma.$queryRaw<Array<{ n: bigint }>>`
      SELECT COUNT(*)::bigint AS n
      FROM "Problem" p
      WHERE NOT EXISTS (
        SELECT 1 FROM "ProblemStep" ps
        WHERE ps."problemId" = p.id AND ps."stepIndex" = 1
      );
    `;
    console.log(`Remaining unreachable rows: ${stillBroken[0]?.n ?? 0n}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
