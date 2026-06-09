/**
 * Backfill WrongNote.insightJson from legacy `insight` text (PR-13).
 *
 * Rows with non-empty insight but null insightJson get a minimal structured
 * payload so WrongNoteDetailScreen can render InsightJsonPanel.
 *
 * Usage:
 *   DATABASE_URL=... npx ts-node scripts/backfill-insight-json.ts
 */
import { Prisma, PrismaClient } from '@prisma/client';
import { WrongNoteInsightJsonSchema } from '../src/modules/wrong-notes/wrong-note-insight.mapper';
import { WRONG_NOTE_INITIAL_COOLDOWN_DAYS } from '../src/modules/wrong-notes/wrong-note-schedule.constants';

const prisma = new PrismaClient();

async function main() {
  const rows = await prisma.wrongNote.findMany({
    where: {
      insightJson: { equals: Prisma.DbNull },
      insight: { not: '' },
    },
    select: { id: true, insight: true },
  });

  let updated = 0;
  for (const row of rows) {
    const text = row.insight.trim();
    if (!text) continue;
    const insightJson = WrongNoteInsightJsonSchema.parse({
      rootCause: text,
      correctConcept: 'Key concept',
      drillSteps: [text.slice(0, 200)],
      similarPatterns: [],
      confidenceCalibration: 'aligned',
      reviewIntervalDays: WRONG_NOTE_INITIAL_COOLDOWN_DAYS,
      lang: 'en',
    });
    await prisma.wrongNote.update({
      where: { id: row.id },
      data: { insightJson },
    });
    updated += 1;
  }

  console.log(`Backfill insightJson complete: ${updated} / ${rows.length} candidates.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());