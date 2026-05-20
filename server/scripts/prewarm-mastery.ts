/**
 * prewarm-mastery — top up every Mastery chapter to the 20-problem
 * multi-step invariant via LLM generation. Run-once admin tool so the
 * next student never waits on the synchronous LLM fill at /concept-
 * lessons/:code/practice-problems.
 *
 * Usage:
 *   cd server
 *   # All under-stocked chapters (multi-step count < 20):
 *   npx ts-node scripts/prewarm-mastery.ts
 *   # A specific list:
 *   npx ts-node scripts/prewarm-mastery.ts C7-CH09-PERIMETER-AREA C7-CH13-SOLID-SHAPES
 *
 * Notes:
 *   • Uses NestFactory.createApplicationContext to load the full module
 *     graph (Prisma, AiModule, ContentIngestModule, ConceptLessonsModule).
 *   • Each chapter takes ~30-60s × (20 - existing)/5 — 5-way parallel
 *     chunks via BULK-LLM policy.
 *   • A failed problem (LLM rejected, JSON schema mismatch, FK error) is
 *     logged and skipped — partial top-up is acceptable. Re-run later
 *     until every chapter shows >= 20.
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ConceptLessonsService } from '../src/modules/concept-lessons/concept-lessons.service';
import { PrismaService } from '../src/infrastructure/prisma/prisma.service';

const TARGET = 20;

async function main(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  const prisma = app.get(PrismaService);
  const lessons = app.get(ConceptLessonsService);

  try {
    const arg = process.argv.slice(2);
    const targetChapters = arg.length > 0
      ? arg
      : await pickUnderstocked(prisma);

    if (targetChapters.length === 0) {
      console.log('Every chapter already has >= 20 multi-step problems. Nothing to do.');
      return;
    }

    console.log(`Prewarm queue: ${targetChapters.length} chapter(s)`);
    for (const code of targetChapters) console.log(`  - ${code}`);
    console.log('');

    let totalGenerated = 0;
    for (const code of targetChapters) {
      const t0 = Date.now();
      const before = await countMultiStep(prisma, code);
      const need = Math.max(0, TARGET - before);
      console.log(`[${code}] multi-step=${before}, need=${need}`);
      if (need === 0) { console.log('  ↳ already at target, skipping.'); continue; }

      try {
        const generated = await lessons.prewarmChapter(code, need);
        const after = await countMultiStep(prisma, code);
        const dtSec = ((Date.now() - t0) / 1000).toFixed(1);
        console.log(`  ↳ generated=${generated}, now multi-step=${after} (took ${dtSec}s)`);
        totalGenerated += generated;
      } catch (err) {
        console.error(`  ↳ FAILED: ${(err as Error).message}`);
      }
    }

    console.log(`\nDone. Total persisted: ${totalGenerated}.`);
  } finally {
    await app.close();
  }
}

/**
 * Count of multi-step problems mapped to this chapter — same definition
 * as ConceptLessonsService.practiceProblems pool filter
 * (ProblemStep at indices 1, 2 AND 3).
 */
async function countMultiStep(prisma: PrismaService, chapterCode: string): Promise<number> {
  const rows = await prisma.$queryRaw<Array<{ n: bigint }>>`
    SELECT COUNT(*)::bigint AS n
    FROM "Problem" p
    JOIN "ConceptLesson" cl ON cl.id = p."conceptLessonId"
    WHERE cl."chapterCode" = ${chapterCode}
      AND EXISTS (SELECT 1 FROM "ProblemStep" s WHERE s."problemId" = p.id AND s."stepIndex" = 1)
      AND EXISTS (SELECT 1 FROM "ProblemStep" s WHERE s."problemId" = p.id AND s."stepIndex" = 2)
      AND EXISTS (SELECT 1 FROM "ProblemStep" s WHERE s."problemId" = p.id AND s."stepIndex" = 3);
  `;
  return Number(rows[0]?.n ?? 0);
}

/**
 * Every chapter whose multi-step pool is currently < TARGET. Chapters
 * with no unitId are skipped (LLM persist requires unitId for FK).
 */
async function pickUnderstocked(prisma: PrismaService): Promise<string[]> {
  const rows = await prisma.$queryRaw<Array<{ chapterCode: string; multi: bigint }>>`
    SELECT cl."chapterCode" AS "chapterCode",
           (SELECT COUNT(*)
            FROM "Problem" p
            WHERE p."conceptLessonId" = cl.id
              AND EXISTS (SELECT 1 FROM "ProblemStep" s WHERE s."problemId" = p.id AND s."stepIndex" = 1)
              AND EXISTS (SELECT 1 FROM "ProblemStep" s WHERE s."problemId" = p.id AND s."stepIndex" = 2)
              AND EXISTS (SELECT 1 FROM "ProblemStep" s WHERE s."problemId" = p.id AND s."stepIndex" = 3)
           )::bigint AS multi
    FROM "ConceptLesson" cl
    WHERE cl."unitId" IS NOT NULL
    ORDER BY cl."ncertClass", cl."chapterNumber";
  `;
  return rows
    .filter((r) => Number(r.multi) < TARGET)
    .map((r) => r.chapterCode);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
