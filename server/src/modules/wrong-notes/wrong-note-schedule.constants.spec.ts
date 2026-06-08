import {
  WRONG_NOTE_INITIAL_COOLDOWN_DAYS,
  initialWrongNoteNextReviewAt,
} from './wrong-note-schedule.constants';

describe('wrong-note-schedule.constants', () => {
  it('schedules initial review 3 days after anchor', () => {
    const base = new Date('2026-06-01T12:00:00Z');
    const next = initialWrongNoteNextReviewAt(base);
    expect(WRONG_NOTE_INITIAL_COOLDOWN_DAYS).toBe(3);
    expect(next.getTime() - base.getTime()).toBe(3 * 24 * 60 * 60 * 1000);
  });
});