/**
 * Backfill nextReviewAt for legacy WrongNotes created before PR-02.
 *
 * Rule: nextReviewAt = createdAt + 3 days (matches WRONG_NOTE_INITIAL_COOLDOWN_DAYS).
 * Skips MASTERED notes and rows that already have nextReviewAt set.
 *
 * Usage:
 *   DATABASE_URL=... npx ts-node scripts/backfill-wrong-note-next-review.ts
 */
import { PrismaClient } from '@prisma/client';
import { initialWrongNoteNextReviewAt } from '../src/modules/wrong-notes/wrong-note-schedule.constants';

const prisma = new PrismaClient();

async function main() {
  const rows = await prisma.wrongNote.findMany({
    where: {
      nextReviewAt: null,
      status: { not: 'MASTERED' },
    },
    select: { id: true, createdAt: true },
  });

  let updated = 0;
  for (const row of rows) {
    await prisma.wrongNote.update({
      where: { id: row.id },
      data: {
        nextReviewAt: initialWrongNoteNextReviewAt(row.createdAt),
        intervalDays: 3,
      },
    });
    updated += 1;
  }

  console.log(`Backfill complete: ${updated} wrong notes updated (${rows.length} candidates).`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());