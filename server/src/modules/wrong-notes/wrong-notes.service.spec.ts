/**
 * WrongNotesService — unit tests for the review-queue + grading delegation.
 * Mocks every collaborator; verifies invariants the UI depends on:
 *   • review queue applies 3-day cooldown
 *   • problem.answer never leaks to the queue response
 *   • checkAnswer 404s for non-owner (no "exists" disclosure)
 *   • checkAnswer delegates grading to AttemptsService (single source of truth)
 *   • checkAnswer clamps durationSec to [1, 600]
 *   • masterByProblem idempotent (no event when 0 rows match)
 *   • SM-2 auto-MASTERED gate (EASY + reps ≥ 3 + interval ≥ 30)
 */
import { NotFoundException } from '@nestjs/common';
import { WrongNotesService } from './wrong-notes.service';

type AnyMock = { [k: string]: jest.Mock };

function mockPrisma(over: any = {}) {
  return {
    wrongNote: {
      findFirst: jest.fn().mockResolvedValue(null),
      findFirstOrThrow: jest.fn(),
      count: jest.fn().mockResolvedValue(0),
      updateMany: jest.fn().mockResolvedValue({ count: 0 }),
      ...over.wrongNote,
    },
    // 2026-05-27: getQueueNext now reads User.country to country-gate the
    // review queue (KR users see only KR notes, IN users see only NCERT).
    // Without this delegate the spec crashes with "Cannot read properties
    // of undefined (reading 'findUnique')" on every queue test.
    user: {
      findUnique: jest.fn().mockResolvedValue({ country: 'IN' }),
      ...over.user,
    },
    // Same era: queueNext also reads Attempt.count to drive the 3-wrong
    // hint reveal (Hint Lv1). Provide a zero-default so existing tests stay
    // green without needing per-spec wiring.
    attempt: {
      count: jest.fn().mockResolvedValue(0),
      ...over.attempt,
    },
  };
}
function mockAttempts(): AnyMock {
  return {
    create: jest.fn().mockResolvedValue({ id: 'att-1', isCorrect: true }),
  };
}
function mockSr(): AnyMock {
  return {
    apply: jest.fn(),
  };
}
function mockRepo(): AnyMock {
  return {
    aggregateStats: jest.fn(),
    findRecent: jest.fn(),
    list: jest.fn(),
    findDue: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    updateStatus: jest.fn(),
    applyReview: jest.fn(),
  };
}
function mockEvents(): AnyMock {
  return { emit: jest.fn() };
}
function mockScheduler(): AnyMock {
  return {
    getDueWrongNotes: jest.fn().mockResolvedValue([]),
    getNextEligibleAt: jest.fn().mockResolvedValue(null),
    countDueWrongNotes: jest.fn().mockResolvedValue(0),
  };
}
function mockPremiumAccess(): AnyMock {
  return {
    redactInsightJson: jest.fn().mockImplementation(async (_uid: string, note: unknown) => note),
  };
}

function build(over: any = {}) {
  const repo = over.repo ?? mockRepo();
  const ocr = over.ocr ?? {};
  const pdf = over.pdf ?? {};
  const similar = over.similar ?? { findSimilar: jest.fn().mockResolvedValue([]) };
  const sr = over.sr ?? mockSr();
  const attempts = over.attempts ?? mockAttempts();
  const prisma = over.prisma ?? mockPrisma();
  const events = over.events ?? mockEvents();
  const scheduler = over.scheduler ?? mockScheduler();
  const premiumAccess = over.premiumAccess ?? mockPremiumAccess();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const svc = new WrongNotesService(
    repo as any,
    ocr as any,
    pdf as any,
    similar as any,
    sr as any,
    attempts as any,
    prisma as any,
    events as any,
    scheduler as any,
    premiumAccess as any,
  );
  return { svc, repo, similar, sr, attempts, prisma, events, scheduler, premiumAccess };
}

const FOUR_DAYS_AGO = new Date(Date.now() - 4 * 24 * 3600 * 1000);
const ONE_DAY_AGO = new Date(Date.now() - 1 * 24 * 3600 * 1000);

describe('WrongNotesService.getQueueNext', () => {
  it('returns the oldest scheduler-due wrong note', async () => {
    const scheduler = mockScheduler();
    scheduler.getDueWrongNotes.mockResolvedValue([
      { wrongNoteId: 'wn-1', effectiveDueAt: FOUR_DAYS_AGO, priorityScore: 0, reason: 'COOLDOWN_ELIGIBLE' },
    ]);
    const prisma = mockPrisma({
      wrongNote: {
        findFirst: jest.fn().mockResolvedValue({
          id: 'wn-1', problemId: 'p1', occurrences: 2,
          createdAt: FOUR_DAYS_AGO,
          problem: { id: 'p1', body: 'Solve X+1', source: 'matheo', answer: 'SECRET', conceptLessonId: 'cl-1', hint: 'try addition' },
        }),
      },
    });
    const { svc, scheduler: sched } = build({ prisma, scheduler });
    const r = await svc.getQueueNext('u1');
    expect(sched.getDueWrongNotes).toHaveBeenCalledWith('u1', expect.any(Date));
    expect(r.wrongNote?.wrongNoteId).toBe('wn-1');
    expect(r.totalEligible).toBe(1);
    // Invariant: answer must NEVER appear in the queue payload.
    expect(JSON.stringify(r.wrongNote)).not.toContain('SECRET');
  });

  it('returns wrongNote=null when scheduler has no due notes', async () => {
    const scheduler = mockScheduler();
    const nextUnlock = new Date(ONE_DAY_AGO.getTime() + 3 * 24 * 3600 * 1000);
    scheduler.getNextEligibleAt.mockResolvedValue(nextUnlock);
    const { svc } = build({ scheduler });
    const r = await svc.getQueueNext('u1');
    expect(r.wrongNote).toBeNull();
    expect(r.nextEligibleAt).toBe(nextUnlock.toISOString());
  });
});

describe('WrongNotesService.checkAnswer', () => {
  it('throws NotFoundException when the wrong note is not the caller\'s', async () => {
    const prisma = mockPrisma({ wrongNote: { findFirst: jest.fn().mockResolvedValue(null) } });
    const { svc } = build({ prisma });
    await expect(svc.checkAnswer('u1', 'wn-other', { answer: '1' })).rejects.toBeInstanceOf(NotFoundException);
  });

  it('delegates grading to attempts.create with PRACTICE context', async () => {
    const prisma = mockPrisma({
      wrongNote: {
        findFirst: jest.fn().mockResolvedValue({ id: 'wn-1', problem: { id: 'p1' } }),
      },
    });
    const scheduler = mockScheduler();
    scheduler.countDueWrongNotes.mockResolvedValue(0);
    const attempts = mockAttempts();
    attempts.create.mockResolvedValue({ id: 'att-7', isCorrect: false });
    const { svc } = build({ prisma, attempts, scheduler });
    const r = await svc.checkAnswer('u1', 'wn-1', { answer: '42', durationSec: 25 });
    expect(attempts.create).toHaveBeenCalledWith('u1', expect.objectContaining({
      problemId: 'p1', answer: '42', context: 'PRACTICE', durationSec: 25,
      suppressWrongNoteAutoMaster: true,
    }));
    expect(r).toEqual({ isCorrect: false, totalEligible: 0, attemptId: 'att-7', needsSm2Rating: false });
  });

  it('clamps durationSec to [1, 600]', async () => {
    const prisma = mockPrisma({
      wrongNote: {
        findFirst: jest.fn().mockResolvedValue({ id: 'wn-1', problem: { id: 'p1' } }),
      },
    });
    const attempts = mockAttempts();
    const { svc } = build({ prisma, attempts });
    await svc.checkAnswer('u1', 'wn-1', { answer: 'x', durationSec: 999_999 });
    expect(attempts.create).toHaveBeenCalledWith('u1', expect.objectContaining({ durationSec: 600 }));
    attempts.create.mockClear();
    await svc.checkAnswer('u1', 'wn-1', { answer: 'x', durationSec: -50 });
    expect(attempts.create).toHaveBeenCalledWith('u1', expect.objectContaining({ durationSec: 1 }));
  });
});

describe('WrongNotesService.masterByProblem', () => {
  it('emits wrong-note.mastered only when at least one row was graduated', async () => {
    const prisma = mockPrisma({
      wrongNote: { updateMany: jest.fn().mockResolvedValue({ count: 2 }) },
    });
    const events = mockEvents();
    const { svc } = build({ prisma, events });
    const r = await svc.masterByProblem('u1', 'p1');
    expect(r).toEqual({ ok: true, mastered: 2 });
    expect(events.emit).toHaveBeenCalledWith('wrong-note.mastered', { userId: 'u1', problemId: 'p1' });
  });

  it('is a no-op (idempotent, no event) when nothing matches', async () => {
    const prisma = mockPrisma({
      wrongNote: { updateMany: jest.fn().mockResolvedValue({ count: 0 }) },
    });
    const events = mockEvents();
    const { svc } = build({ prisma, events });
    const r = await svc.masterByProblem('u1', 'p1');
    expect(r.mastered).toBe(0);
    expect(events.emit).not.toHaveBeenCalled();
  });
});

describe('WrongNotesService.review (SM-2)', () => {
  function reviewSetup(updated: { repetitionCount: number; intervalDays: number }) {
    const prisma = mockPrisma();
    prisma.wrongNote.findFirstOrThrow = jest.fn().mockResolvedValue({
      id: 'wn-1', easinessFactor: 2.5, repetitionCount: 2, intervalDays: 10, problemId: 'p1',
    });
    const sr = mockSr();
    sr.apply.mockReturnValue({
      easinessFactor: 2.7, repetitionCount: updated.repetitionCount,
      intervalDays: updated.intervalDays, nextReviewAt: new Date(), lapsed: false,
    });
    const repo = mockRepo();
    repo.applyReview = jest.fn().mockResolvedValue({
      id: 'wn-1', problemId: 'p1', easinessFactor: 2.7,
      repetitionCount: updated.repetitionCount, intervalDays: updated.intervalDays,
      nextReviewAt: new Date(),
    });
    repo.updateStatus = jest.fn();
    const events = mockEvents();
    return build({ prisma, sr, repo, events });
  }

  // Patch parseQuality so we can drive q=5 directly without re-implementing the mapping.
  const PARSE_QUALITY_SPY = jest.spyOn(
    require('./services/spaced-repetition.service').SpacedRepetitionService,
    'parseQuality',
  );
  afterAll(() => PARSE_QUALITY_SPY.mockRestore());

  it('auto-MASTERED when quality=EASY, reps>=3, interval>=30', async () => {
    PARSE_QUALITY_SPY.mockReturnValue(5);
    const { svc, repo, events } = reviewSetup({ repetitionCount: 3, intervalDays: 35 });
    const r = await svc.review('u1', 'wn-1', { quality: 'EASY' } as any);
    expect(repo.updateStatus).toHaveBeenCalledWith('u1', 'wn-1', 'MASTERED');
    expect(events.emit).toHaveBeenCalledWith('wrong-note.mastered', { userId: 'u1', problemId: 'p1' });
    expect(r.autoMastered).toBe(true);
  });

  it('does NOT auto-MASTERED when interval still < 30', async () => {
    PARSE_QUALITY_SPY.mockReturnValue(5);
    const { svc, repo, events } = reviewSetup({ repetitionCount: 3, intervalDays: 20 });
    const r = await svc.review('u1', 'wn-1', { quality: 'EASY' } as any);
    expect(repo.updateStatus).not.toHaveBeenCalled();
    expect(events.emit).not.toHaveBeenCalled();
    expect(r.autoMastered).toBe(false);
  });

  it('does NOT auto-MASTERED when quality < EASY (e.g. GOOD=4)', async () => {
    PARSE_QUALITY_SPY.mockReturnValue(4);
    const { svc, repo } = reviewSetup({ repetitionCount: 5, intervalDays: 60 });
    const r = await svc.review('u1', 'wn-1', { quality: 'GOOD' } as any);
    expect(repo.updateStatus).not.toHaveBeenCalled();
    expect(r.autoMastered).toBe(false);
  });
});
