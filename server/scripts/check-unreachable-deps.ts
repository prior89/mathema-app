/**
 * Read-only: before deleting the 12 unreachable Problem rows, surface every
 * dependent row across all relations so we can spot lost user data. If any
 * relation other than ProblemStep / ProblemChoice has hits, we abort and
 * decide what to do per-relation.
 *
 * Relations to check come from schema.prisma's Problem block: attempts,
 * concepts, mockExamProblems, mockExamAttemptProblems, recommendationLogs,
 * wrongNotes, anything else that references a Problem id.
 *
 * Run:
 *   cd server
 *   npx ts-node scripts/check-unreachable-deps.ts
 */
import { PrismaClient } from '@prisma/client';

async function main(): Promise<void> {
  const prisma = new PrismaClient();
  try {
    const unreachable = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT p.id
      FROM "Problem" p
      WHERE NOT EXISTS (
        SELECT 1 FROM "ProblemStep" ps
        WHERE ps."problemId" = p.id AND ps."stepIndex" = 1
      );
    `;
    const ids = unreachable.map((r) => r.id);
    console.log(`Unreachable Problem ids: ${ids.length}`);
    if (ids.length === 0) return;

    const relations = await prisma.$queryRaw<
      Array<{ table_name: string; column_name: string }>
    >`
      SELECT tc.table_name, kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
       AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage ccu
        ON ccu.constraint_name = tc.constraint_name
       AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND ccu.table_name = 'Problem'
        AND ccu.column_name = 'id'
        AND tc.table_schema = 'public'
      ORDER BY tc.table_name;
    `;
    console.log(`\nForeign-key relations pointing at Problem.id:`);
    for (const r of relations) console.log(`  ${r.table_name}.${r.column_name}`);

    console.log('\n=== Per-relation row counts referencing the 12 unreachable Problems ===');
    for (const r of relations) {
      const { table_name, column_name } = r;
      const rows = await prisma.$queryRawUnsafe<Array<{ n: bigint }>>(
        `SELECT COUNT(*)::bigint AS n FROM "${table_name}" WHERE "${column_name}" = ANY($1::text[]);`,
        ids,
      );
      const n = rows[0]?.n ?? 0n;
      const marker = n > 0n ? '!' : ' ';
      console.log(`${marker} ${table_name}.${column_name}  →  ${n}`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
