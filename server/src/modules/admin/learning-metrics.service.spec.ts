import { LearningMetricsService } from './learning-metrics.service';

describe('LearningMetricsService', () => {
  const prisma = {
    conceptProgress: { findMany: jest.fn(), count: jest.fn() },
    koreanConceptProgress: { findMany: jest.fn(), count: jest.fn() },
    user: { findMany: jest.fn() },
    dailyActivity: { findMany: jest.fn() },
    errorPatternProfile: { groupBy: jest.fn() },
    wrongNote: { count: jest.fn() },
    solverAttempt: { count: jest.fn() },
    analyticsEvent: { count: jest.fn(), groupBy: jest.fn() },
    $queryRaw: jest.fn(),
  };

  const svc = new LearningMetricsService(prisma as any);

  beforeEach(() => jest.clearAllMocks());

  it('returns a structured overview with north star and retention', async () => {
    prisma.conceptProgress.findMany.mockResolvedValue([
      { userId: 'u1', startedAt: new Date('2026-05-01'), masteredAt: new Date('2026-05-10') },
      { userId: 'u2', startedAt: new Date('2026-05-02'), masteredAt: null },
    ]);
    prisma.koreanConceptProgress.findMany.mockResolvedValue([]);
    prisma.user.findMany
      .mockResolvedValueOnce([
        { id: 'u1', email: 'u1@student.test', role: 'STUDENT' },
        { id: 'u2', email: 'u2@student.test', role: 'STUDENT' },
      ])
      .mockResolvedValueOnce([
        { id: 'u1', createdAt: new Date('2026-05-01') },
        { id: 'u2', createdAt: new Date('2026-05-02') },
      ]);
    prisma.dailyActivity.findMany.mockResolvedValue([]);
    prisma.conceptProgress.count
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(2);
    prisma.koreanConceptProgress.count.mockResolvedValue(0);
    prisma.errorPatternProfile.groupBy.mockResolvedValue([
      { status: 'RESOLVED', _count: 2 },
      { status: 'ACTIVE', _count: 1 },
    ]);
    prisma.wrongNote.count.mockResolvedValueOnce(10).mockResolvedValueOnce(4);
    prisma.$queryRaw
      .mockResolvedValueOnce([{ avg_days: 9.5 }])
      .mockResolvedValueOnce([{ retry_accuracy: 62 }]);
    prisma.solverAttempt.count
      .mockResolvedValueOnce(20)
      .mockResolvedValueOnce(8)
      .mockResolvedValueOnce(5);
    prisma.analyticsEvent.count.mockResolvedValue(3);
    prisma.analyticsEvent.groupBy.mockResolvedValue([
      { eventType: 'study.problem.submit', _count: { _all: 12 } },
    ]);

    const out = await svc.overview();

    expect(out.dataScope).toBe('real_learners_only');
    expect(out.excludedTesterCount).toBe(0);
    expect(out.northStar.numerator).toBe(1);
    expect(out.northStar.denominator).toBe(2);
    expect(out.retention.cohortSize).toBe(2);
    expect(out.mastery.chaptersMastered).toBe(1);
    expect(out.wrongNotes.masteredPct).toBe(40);
    expect(out.learningEvents7d[0].eventType).toBe('study.problem.submit');
  });
});