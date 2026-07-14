import { describe, expect, it } from 'vitest';
import {
  findPendingRealExam,
  REAL_EXAM_PROGRESS_PREFIX,
  REAL_EXAM_SESSION_PREFIX,
} from './pending-real-exam';

function storage(entries: Record<string, unknown>) {
  const values = new Map(Object.entries(entries).map(([key, value]) => [key, JSON.stringify(value)]));
  return {
    get length() { return values.size; },
    key: (index: number) => [...values.keys()][index] ?? null,
    getItem: (key: string) => values.get(key) ?? null,
  };
}

describe('findPendingRealExam', () => {
  it('returns the newest locally preserved started session', () => {
    const saved = storage({
      [`${REAL_EXAM_SESSION_PREFIX}old`]: { resultId: 'old', name: 'Old paper', userId: 'student-1' },
      [`${REAL_EXAM_PROGRESS_PREFIX}old`]: { startedAt: 100 },
      [`${REAL_EXAM_SESSION_PREFIX}new`]: { resultId: 'new', name: 'New paper', userId: 'student-1' },
      [`${REAL_EXAM_PROGRESS_PREFIX}new`]: { startedAt: 200 },
    });

    expect(findPendingRealExam(saved, 'student-1')).toEqual({ resultId: 'new', name: 'New paper', startedAt: 200, userId: 'student-1' });
  });

  it('ignores corrupt and not-yet-started sessions', () => {
    const saved = storage({
      [`${REAL_EXAM_SESSION_PREFIX}draft`]: { resultId: 'draft', name: 'Draft', userId: 'student-1' },
      [`${REAL_EXAM_PROGRESS_PREFIX}draft`]: { startedAt: null },
    });

    expect(findPendingRealExam(saved, 'student-1')).toBeNull();
  });

  it('never exposes another account\'s saved answers', () => {
    const saved = storage({
      [`${REAL_EXAM_SESSION_PREFIX}paper`]: { resultId: 'paper', name: 'Paper', userId: 'student-1' },
      [`${REAL_EXAM_PROGRESS_PREFIX}paper`]: { startedAt: 100 },
    });

    expect(findPendingRealExam(saved, 'student-2')).toBeNull();
  });
});
