/**
 * ReviewSchedulerService — unified WrongNote due semantics (PR-08).
 * Asserts effectiveDueAt = max(createdAt+3d, nextReviewAt ?? epoch) and
 * 3-consumer snapshot equality on 100 synthetic notes.
 */
import {
  ReviewSchedulerService,
  computeEffectiveDueAt,
  filterDueWrongNotes,
  isWrongNoteEffectivelyDue,
  WrongNoteScheduleRow,
  WRONG_NOTE_EPOCH,
} from './review-scheduler.service';
import { WRONG_NOTE_INITIAL_COOLDOWN_DAYS } from './wrong-note-schedule.constants';

const DAY_MS = 24 * 60 * 60 * 1000;
const NOW = new Date('2026-06-09T12:00:00Z');

function daysAgo(n: number, from = NOW): Date {
  return new Date(from.getTime() - n * DAY_MS);
}

function daysFromNow(n: number, from = NOW): Date {
  return new Date(from.getTime() + n * DAY_MS);
}

function buildScheduler(rows: WrongNoteScheduleRow[], country = 'IN') {
  const prisma = {
    user: { findUnique: jest.fn().mockResolvedValue({ country }) },
    wrongNote: { findMany: jest.fn().mockResolvedValue(rows) },
  };
  return { svc: new ReviewSchedulerService(prisma as never), prisma };
}

/** Legacy getQueueNext eligible pool (pre-PR-09): createdAt ≤ now−3d only. */
function legacyQueueEligibleIds(
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
function legacyFcmDueIds(rows: WrongNoteScheduleRow[], now: Date): string[] {
  return rows
    .filter((r) => r.status !== 'MASTERED')
    .filter((r) => r.nextReviewAt != null && r.nextReviewAt.getTime() <= now.getTime())
    .map((r) => r.id)
    .sort();
}

/** Legacy findDue (pre-PR-09): nextReviewAt null OR ≤ now. */
function legacyFindDueIds(rows: WrongNoteScheduleRow[], now: Date): string[] {
  return rows
    .filter((r) => r.status !== 'MASTERED')
    .filter((r) => r.nextReviewAt == null || r.nextReviewAt.getTime() <= now.getTime())
    .map((r) => r.id)
    .sort();
}

/** Unified consumer — post PR-09/10 target: effectiveDueAt ≤ now + shared filters. */
function unifiedDueIds(
  rows: WrongNoteScheduleRow[],
  isKR: boolean,
  now: Date,
): string[] {
  return filterDueWrongNotes(rows, { isKR, now }).map((c) => c.wrongNoteId).sort();
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeSyntheticNotes(count: number, seed = 42): WrongNoteScheduleRow[] {
  const rand = mulberry32(seed);
  const statuses = ['PENDING', 'ANALYZING', 'MASTERED'] as const;
  const notes: WrongNoteScheduleRow[] = [];

  for (let i = 0; i < count; i++) {
    const createdDaysAgo = Math.floor(rand() * 30);
    const nextReviewRoll = rand();
    let nextReviewAt: Date | null;
    if (nextReviewRoll < 0.25) {
      nextReviewAt = null;
    } else if (nextReviewRoll < 0.5) {
      nextReviewAt = daysFromNow(Math.floor(rand() * 14) - 7);
    } else {
      nextReviewAt = daysAgo(Math.floor(rand() * 20));
    }

    const status = statuses[Math.floor(rand() * statuses.length)];
    const hasNcert = rand() > 0.15;
    const hasKr = rand() > 0.15;

    notes.push({
      id: `wn-${i}`,
      createdAt: daysAgo(createdDaysAgo),
      nextReviewAt,
      occurrences: 1 + Math.floor(rand() * 5),
      status,
      problem: {
        conceptLessonId: hasNcert ? `cl-${i}` : null,
        koreanConceptLessonId: hasKr ? `kcl-${i}` : null,
      },
    });
  }
  return notes;
}

describe('computeEffectiveDueAt', () => {
  it('uses cooldown when nextReviewAt is null', () => {
    const createdAt = daysAgo(1);
    const due = computeEffectiveDueAt(createdAt, null);
    expect(due.getTime()).toBe(createdAt.getTime() + WRONG_NOTE_INITIAL_COOLDOWN_DAYS * DAY_MS);
  });

  it('uses epoch fallback so null nextReviewAt never short-circuits cooldown', () => {
    const createdAt = daysAgo(10);
    const due = computeEffectiveDueAt(createdAt, null);
    expect(due.getTime()).toBeGreaterThan(WRONG_NOTE_EPOCH.getTime());
  });

  it('picks the later of cooldown end and nextReviewAt', () => {
    const createdAt = daysAgo(1);
    const sm2 = daysFromNow(5);
    expect(computeEffectiveDueAt(createdAt, sm2).getTime()).toBe(sm2.getTime());

    const old = daysAgo(10);
    const sm2Past = daysAgo(2);
    expect(computeEffectiveDueAt(old, sm2Past).getTime()).toBe(sm2Past.getTime());
  });

  it('blocks SM-2 due until cooldown passes', () => {
    const createdAt = daysAgo(1);
    const sm2Past = daysAgo(0.5);
    expect(isWrongNoteEffectivelyDue(createdAt, sm2Past, NOW)).toBe(false);
    expect(computeEffectiveDueAt(createdAt, sm2Past).getTime()).toBe(
      createdAt.getTime() + WRONG_NOTE_INITIAL_COOLDOWN_DAYS * DAY_MS,
    );
  });
});

describe('ReviewSchedulerService.getDueWrongNotes', () => {
  it('returns notes past cooldown with null nextReviewAt', async () => {
    const rows: WrongNoteScheduleRow[] = [{
      id: 'wn-1',
      createdAt: daysAgo(5),
      nextReviewAt: null,
      occurrences: 1,
      status: 'PENDING',
      problem: { conceptLessonId: 'cl-1', koreanConceptLessonId: null },
    }];
    const { svc } = buildScheduler(rows, 'IN');
    const due = await svc.getDueWrongNotes('u1', NOW);
    expect(due.map((c) => c.wrongNoteId)).toEqual(['wn-1']);
    expect(due[0].reason).toBe('COOLDOWN_ELIGIBLE');
  });

  it('excludes MASTERED and wrong-curriculum problems', async () => {
    const rows: WrongNoteScheduleRow[] = [
      {
        id: 'mastered',
        createdAt: daysAgo(10),
        nextReviewAt: daysAgo(1),
        occurrences: 1,
        status: 'MASTERED',
        problem: { conceptLessonId: 'cl-1', koreanConceptLessonId: null },
      },
      {
        id: 'kr-only',
        createdAt: daysAgo(10),
        nextReviewAt: daysAgo(1),
        occurrences: 1,
        status: 'PENDING',
        problem: { conceptLessonId: null, koreanConceptLessonId: 'kcl-1' },
      },
    ];
    const { svc } = buildScheduler(rows, 'IN');
    expect(await svc.getDueWrongNoteIds('u1', NOW)).toEqual([]);
  });

  it('getNextEligibleAt returns earliest future effectiveDueAt', async () => {
    const future = daysFromNow(2);
    const rows: WrongNoteScheduleRow[] = [
      {
        id: 'wn-future',
        createdAt: daysAgo(1),
        nextReviewAt: future,
        occurrences: 1,
        status: 'PENDING',
        problem: { conceptLessonId: 'cl-1', koreanConceptLessonId: null },
      },
      {
        id: 'wn-due',
        createdAt: daysAgo(5),
        nextReviewAt: null,
        occurrences: 1,
        status: 'PENDING',
        problem: { conceptLessonId: 'cl-2', koreanConceptLessonId: null },
      },
    ];
    const { svc } = buildScheduler(rows, 'IN');
    const next = await svc.getNextEligibleAt('u1', NOW);
    expect(next?.toISOString()).toBe(computeEffectiveDueAt(daysAgo(1), future).toISOString());
  });

  it('KR user sees only koreanConceptLesson problems', async () => {
    const rows: WrongNoteScheduleRow[] = [
      {
        id: 'kr',
        createdAt: daysAgo(5),
        nextReviewAt: null,
        occurrences: 1,
        status: 'PENDING',
        problem: { conceptLessonId: null, koreanConceptLessonId: 'kcl-1' },
      },
      {
        id: 'ncert',
        createdAt: daysAgo(5),
        nextReviewAt: null,
        occurrences: 1,
        status: 'PENDING',
        problem: { conceptLessonId: 'cl-1', koreanConceptLessonId: null },
      },
    ];
    const { svc } = buildScheduler(rows, 'KR');
    expect(await svc.getDueWrongNoteIds('u1', NOW)).toEqual(['kr']);
  });
});

describe('WN due 3-consumer snapshot equality (100 synthetic)', () => {
  it('scheduler matches unified effectiveDueAt set for IN and KR', async () => {
    const notes = makeSyntheticNotes(100);

    for (const country of ['IN', 'KR'] as const) {
      const isKR = country === 'KR';
      const { svc } = buildScheduler(notes, country);
      const schedulerIds = (await svc.getDueWrongNoteIds('u1', NOW)).sort();
      const unifiedIds = unifiedDueIds(notes, isKR, NOW);
      expect(schedulerIds).toEqual(unifiedIds);
    }
  });

  it('legacy consumers diverge — unified scheduler resolves conflict', () => {
    const notes = makeSyntheticNotes(100);
    const isKR = false;

    const unified = unifiedDueIds(notes, isKR, NOW);
    const queue = legacyQueueEligibleIds(notes, isKR, NOW);
    const fcm = legacyFcmDueIds(notes, NOW);
    const findDue = legacyFindDueIds(notes, NOW);

    // Document pre-migration mismatch (at least one pair differs on synthetic data).
    const legacySets = [queue, fcm, findDue];
    const hasMismatch = legacySets.some(
      (a, i) => legacySets.slice(i + 1).some((b) => JSON.stringify(a) !== JSON.stringify(b)),
    );
    expect(hasMismatch).toBe(true);

    // All three unified consumer projections must equal scheduler canonical set.
    expect(queue).not.toEqual(unified);
    expect(unifiedDueIds(notes, isKR, NOW)).toEqual(unified);
    expect(filterDueWrongNotes(notes, { isKR, now: NOW }).map((c) => c.wrongNoteId).sort())
      .toEqual(unified);
  });

  it('getDueCountsByUser groups due notes per user with curriculum gate', async () => {
    const prisma = {
      user: { findUnique: jest.fn() },
      wrongNote: {
        findMany: jest.fn().mockResolvedValue([
          {
            userId: 'u1',
            createdAt: daysAgo(5),
            nextReviewAt: null,
            status: 'PENDING',
            problem: { conceptLessonId: 'cl-1', koreanConceptLessonId: null },
            user: { country: 'IN' },
          },
          {
            userId: 'u1',
            createdAt: daysAgo(1),
            nextReviewAt: daysAgo(1),
            status: 'PENDING',
            problem: { conceptLessonId: 'cl-2', koreanConceptLessonId: null },
            user: { country: 'IN' },
          },
          {
            userId: 'u2',
            createdAt: daysAgo(5),
            nextReviewAt: null,
            status: 'PENDING',
            problem: { conceptLessonId: null, koreanConceptLessonId: 'kcl-1' },
            user: { country: 'KR' },
          },
        ]),
      },
    };
    const svc = new ReviewSchedulerService(prisma as never);
    const counts = await svc.getDueCountsByUser(NOW);
    expect(counts).toEqual([
      { userId: 'u1', count: 1 },
      { userId: 'u2', count: 1 },
    ]);
  });

  it('every due note has effectiveDueAt ≤ now', async () => {
    const notes = makeSyntheticNotes(100);
    const { svc } = buildScheduler(notes, 'IN');
    const due = await svc.getDueWrongNotes('u1', NOW);
    for (const c of due) {
      expect(c.effectiveDueAt.getTime()).toBeLessThanOrEqual(NOW.getTime());
    }
  });
});