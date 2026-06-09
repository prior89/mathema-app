/**
 * PR-00 — Assert IN/KR onboarding grades each have ≥ MIN_READY DIAGNOSTIC sets.
 *
 * Usage:
 *   DATABASE_URL=... npx ts-node scripts/verify-diagnostic-pools.ts
 *   npm run verify:diagnostic-pools --workspace=server
 *
 * Exit 0 = gate passed (adaptive diagnostic may be enabled).
 * Exit 1 = one or more grades below threshold — run backfill-lesson-problem-set.ts.
 */
import { PrismaClient } from '@prisma/client';
import {
  evaluateDiagnosticPoolGate,
  formatDiagnosticPoolGateReport,
} from '../src/modules/diagnostic/diagnostic-pool-gate';

async function main() {
  const prisma = new PrismaClient();
  try {
    const result = await evaluateDiagnosticPoolGate(prisma);
    console.log(formatDiagnosticPoolGateReport(result));
    if (!result.ok) process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});