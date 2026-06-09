import { StudentEfficacyService } from './student-efficacy.service';

describe('StudentEfficacyService', () => {
  const prisma = {
    user: { findUnique: jest.fn() },
    conceptProgress: { count: jest.fn() },
    koreanConceptProgress: { count: jest.fn() },
    wrongNote: { count: jest.fn() },
    errorPatternProfile: { count: jest.fn() },
  };
  const redis = { get: jest.fn(), set: jest.fn() };
  const activity = { streak: jest.fn() };
  const learningMetrics = { cohortNorthStar: jest.fn() };

  const svc = new StudentEfficacyService(
    prisma as never,
    redis as never,
    activity as never,
    learningMetrics as never,
  );

  beforeEach(() => jest.clearAllMocks());

  it('returns cached card when redis hit', async () => {
    const cached = {
      northStarPct: 42,
      cohortSize: 50,
      chaptersMastered: 2,
      wrongNotesMasteredPct: 60,
      errorPatternsImproving: 1,
      streakDays: 5,
      message: 'cached',
    };
    redis.get.mockResolvedValue(JSON.stringify(cached));

    const out = await svc.getCard('u1');
    expect(out).toEqual(cached);
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });

  it('computes card and caches for 1h when cohort is large enough', async () => {
    redis.get.mockResolvedValue(null);
    prisma.user.findUnique.mockResolvedValue({ country: 'KR' });
    prisma.conceptProgress.count.mockResolvedValue(2);
    prisma.koreanConceptProgress.count.mockResolvedValue(1);
    prisma.wrongNote.count.mockResolvedValueOnce(10).mockResolvedValueOnce(6);
    prisma.errorPatternProfile.count.mockResolvedValue(0);
    activity.streak.mockResolvedValue({ days: 4 });
    learningMetrics.cohortNorthStar.mockResolvedValue({ valuePct: 35.5, cohortSize: 40 });

    const out = await svc.getCard('u1');

    expect(out.northStarPct).toBe(35.5);
    expect(out.cohortSize).toBe(40);
    expect(out.chaptersMastered).toBe(3);
    expect(out.wrongNotesMasteredPct).toBe(60);
    expect(out.streakDays).toBe(4);
    expect(redis.set).toHaveBeenCalledWith(
      expect.stringMatching(/^efficacy:u1:\d{4}-\d{2}-\d{2}-\d{2}$/),
      expect.any(String),
      3600,
    );
  });

  it('hides northStarPct when cohort is below minimum', async () => {
    redis.get.mockResolvedValue(null);
    prisma.user.findUnique.mockResolvedValue({ country: 'IN' });
    prisma.conceptProgress.count.mockResolvedValue(0);
    prisma.koreanConceptProgress.count.mockResolvedValue(0);
    prisma.wrongNote.count.mockResolvedValue(0);
    prisma.errorPatternProfile.count.mockResolvedValue(0);
    activity.streak.mockResolvedValue({ days: 0 });
    learningMetrics.cohortNorthStar.mockResolvedValue({ valuePct: 10, cohortSize: 12 });

    const out = await svc.getCard('u1');

    expect(out.northStarPct).toBeNull();
    expect(out.cohortSize).toBe(0);
    expect(out.message).toContain('more learners');
  });
});