/**
 * Backfill Problem.bodyHash + normalizedBody for the solve-cache flywheel.
 * Idempotent. Run once per environment after the migration.
 *   npx ts-node --transpile-only scripts/backfill-problem-body-hash.ts
 */
import { PrismaClient } from '@prisma/client';
import { normalizeProblemBody, problemBodyHash } from '../src/common/utils/normalize-problem-body';

const prisma = new PrismaClient();

async function main() {
  const problems = await prisma.problem.findMany({ select: { id: true, body: true } });
  console.log(`problems: ${problems.length}`);
  let updated = 0;
  let skipped = 0;
  for (const p of problems) {
    const hash = problemBodyHash(p.body);
    if (!hash) { skipped++; continue; }
    await prisma.problem.update({
      where: { id: p.id },
      data: { bodyHash: hash, normalizedBody: normalizeProblemBody(p.body) },
    });
    updated++;
  }
  console.log(`updated=${updated}  skipped(too-short)=${skipped}`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
