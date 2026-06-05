import { WeeklyStatsService } from './weekly-stats.service';

describe('WeeklyStatsService', () => {
  function build() {
    const prisma = {
      user: { findUnique: jest.fn().mockResolvedValue({ country: 'IN' }) },
      attempt: { findMany: jest.fn().mockResolvedValue([]) },
      studySession: { findMany: jest.fn().mockResolvedValue([]) },
      masterySnapshot: { findMany: jest.fn().mockResolvedValue([]) },
      mockExamResult: { findFirst: jest.fn().mockResolvedValue(null) },
    };
    const svc = new WeeklyStatsService(prisma as any);
    return { svc, prisma };
  }

  it('empty week — hasData false, all counters 0, mastery null', async () => {
    const { svc } = build();
    const out = await svc.computeCurrent('user-1');
    expect(out.hasData).toBe(false);
    expect(out.attemptCount).toBe(0);
    expect(out.masterySampleCount).toBe(0);
    expect(out.problemsSolved).toBe(0);
    expect(out.accuracyPct).toBe(0);
    expect(out.weakestUnit).toBeNull();
    expect(out.strongestUnit).toBeNull();
    expect(out.topPercentile).toBeNull();
  });

  it('2 attempts, 1 correct — hasData true, 50 percent accuracy', async () => {
    const { svc, prisma } = build();
    prisma.attempt.findMany.mockResolvedValue([
      { id: 'a1', isCorrect: true, durationSec: 60 },
      { id: 'a2', isCorrect: false, durationSec: 120 },
    ]);
    const out = await svc.computeCurrent('user-1');
    expect(out.hasData).toBe(true);
    expect(out.attemptCount).toBe(2);
    expect(out.correctCount).toBe(1);
    expect(out.accuracyPct).toBe(50);
  });

  it('mastery present but no attempts — hides mastery as supporting data', async () => {
    // The service still returns weakest/strongest (the helper is honest about
    // what exists), but it also returns hasData=false. The contract with the
    // mentor card is that it checks hasData first and refuses to surface
    // strength/nextGoal when attempts are 0.
    const { svc, prisma } = build();
    prisma.masterySnapshot.findMany.mockResolvedValue([
      { score: 30, samples: 5, unit: { name: 'Algebra' } },
      { score: 80, samples: 5, unit: { name: 'Trigonometry' } },
    ]);
    const out = await svc.computeCurrent('user-1');
    expect(out.hasData).toBe(false);
    expect(out.attemptCount).toBe(0);
    expect(out.masterySampleCount).toBe(2);
    expect(out.weakestUnit).toEqual({ name: 'Algebra', score: 30 });
    expect(out.strongestUnit).toEqual({ name: 'Trigonometry', score: 80 });
  });

  it('topPercentile is null until a mock exam is taken', async () => {
    const { svc, prisma } = build();
    prisma.mockExamResult.findFirst.mockResolvedValue(null);
    const out = await svc.computeCurrent('user-1');
    expect(out.topPercentile).toBeNull();
  });

  it('topPercentile inverts the latest mock percentile (90 → top 10%)', async () => {
    const { svc, prisma } = build();
    prisma.mockExamResult.findFirst.mockResolvedValue({
      takenAt: new Date('2026-06-03T10:00:00Z'),
      percentile: 90,
    });
    const out = await svc.computeCurrent('user-1');
    expect(out.topPercentile).toBe(10);
  });

  it('queries Attempt with the current ISO-week range from getCurrentWeek', async () => {
    const { svc, prisma } = build();
    await svc.computeCurrent('user-1');
    const args = prisma.attempt.findMany.mock.calls[0][0];
    expect(args.where.userId).toBe('user-1');
    // The window must be a half-open interval, not gte+lte. Otherwise the
    // first attempt of the next week (Monday 00:00) would leak into both
    // weeks and double-count.
    expect(args.where.createdAt.gte).toBeInstanceOf(Date);
    expect(args.where.createdAt.lt).toBeInstanceOf(Date);
    expect(args.where.createdAt.lt.getTime() - args.where.createdAt.gte.getTime())
      .toBe(7 * 24 * 60 * 60 * 1000);
  });

  it('falls back to IN timezone when user.country is null', async () => {
    const { svc, prisma } = build();
    prisma.user.findUnique.mockResolvedValue({ country: null });
    const out = await svc.computeCurrent('user-1');
    expect(out.timezone).toBe('Asia/Kolkata');
  });

  it('uses Asia/Seoul boundaries for a KR user', async () => {
    const { svc, prisma } = build();
    prisma.user.findUnique.mockResolvedValue({ country: 'KR' });
    const out = await svc.computeCurrent('user-1');
    expect(out.timezone).toBe('Asia/Seoul');
  });
});
