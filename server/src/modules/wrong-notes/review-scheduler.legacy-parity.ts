import { WRONG_NOTE_INITIAL_COOLDOWN_DAYS } from './wrong-note-schedule.constants';
import { filterDueWrongNotes, WrongNoteScheduleRow } from './review-scheduler.service';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Legacy getQueueNext eligible pool (pre-PR-09): createdAt ≤ now−3d only. */
export function legacyQueueEligibleIds(
  rows: WrongNoteScheduleRow[],
  isKR: boolean,
  now: Date,
): string[] {
  const threshold = new Date(now.getTime() - WRONG_NOTE_INITIAL_COOLDOWN_DAYS * DAY_MS);
  return rows
    .filter((r) => r.status !== 'MASTERED')
    .filter((r) => (isKR ? r.problem.koreanConceptLessonId != null : r.problem.conceptLessonId != null))
    .filter((r) => r.createdAt.getTime() <= threshold.getTime())
    .map((r) => r.id)
    .sort();
}

/** Legacy FCM cron (pre-PR-10): nextReviewAt ≤ now only. */
export function legacyFcmDueIds(rows: WrongNoteScheduleRow[], now: Date): string[] {
  return rows
    .filter((r) => r.status !== 'MASTERED')
    .filter((r) => r.nextReviewAt != null && r.nextReviewAt.getTime() <= now.getTime())
    .map((r) => r.id)
    .sort();
}

/** Legacy findDue (pre-PR-09): nextReviewAt null OR ≤ now. */
export function legacyFindDueIds(rows: WrongNoteScheduleRow[], now: Date): string[] {
  return rows
    .filter((r) => r.status !== 'MASTERED')
    .filter((r) => r.nextReviewAt == null || r.nextReviewAt.getTime() <= now.getTime())
    .map((r) => r.id)
    .sort();
}

/** Returns true when any legacy consumer projection diverges from the unified scheduler set. */
export function hasLegacyConsumerMismatch(
  rows: WrongNoteScheduleRow[],
  isKR: boolean,
  now: Date,
): boolean {
  const unified = filterDueWrongNotes(rows, { isKR, now }).map((c) => c.wrongNoteId).sort();
  const legacySets = [
    legacyQueueEligibleIds(rows, isKR, now),
    legacyFcmDueIds(rows, now),
    legacyFindDueIds(rows, now),
  ];
  return legacySets.some((set) => JSON.stringify(set) !== JSON.stringify(unified));
}