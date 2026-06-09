/** Minimum cooldown before a wrong note enters the review queue (FIFO gate). */
export const WRONG_NOTE_INITIAL_COOLDOWN_DAYS = 3;

export function initialWrongNoteNextReviewAt(from = new Date()): Date {
  const d = new Date(from);
  d.setDate(d.getDate() + WRONG_NOTE_INITIAL_COOLDOWN_DAYS);
  return d;
}