import { AiRecommendExamService } from './ai-recommend-exam.service';

function build() {
  const prisma = {
    user: { findUnique: jest.fn() },
    problem: { findMany: jest.fn() },
    masterySnapshot: { findMany: jest.fn().mockResolvedValue([]) },
    userPlacementProfile: { findUnique: jest.fn().mockResolvedValue(null) },
    recommendationLog: { findMany: jest.fn().mockResolvedValue([]) },
    attempt: { findMany: jest.fn().mockResolvedValue([]) },
  };
  const wrongNotes = { findDue: jest.fn() };
  return {
    service: new AiRecommendExamService(
      {} as never,
      prisma as never,
      wrongNotes as never,
    ),
    prisma,
  };
}

describe('AiRecommendExamService real exam grade filtering', () => {
  beforeEach(() => jest.clearAllMocks());

  it('maps a Korean student grade to the matching Korean curriculum grade', async () => {
    const { service, prisma } = build();
    prisma.user.findUnique.mockResolvedValue({
      country: 'KR',
      gradeLevel: 'CLASS_11',
    });
    prisma.problem.findMany.mockResolvedValue([
      { id: 'kr-high2', source: 'seed', difficulty: 'MEDIUM' },
    ]);

    const result = await service.composeTyped('student-kr', 'real');

    expect(prisma.problem.findMany).toHaveBeenCalledWith({
      where: {
        koreanConceptLesson: { koreanGrade: 'HIGH_2' },
        steps: { some: { choices: { some: {} } } },
      },
      orderBy: { source: 'asc' },
    });
    expect(result.problems).toEqual([
      { id: 'kr-high2', source: 'seed', difficulty: 'MEDIUM' },
    ]);
  });

  it('filters an Indian student paper to the matching NCERT class', async () => {
    const { service, prisma } = build();
    prisma.user.findUnique.mockResolvedValue({
      country: 'IN',
      gradeLevel: 'CLASS_9',
    });
    prisma.problem.findMany.mockResolvedValue([
      { id: 'in-class9', source: 'seed', difficulty: 'EASY' },
    ]);

    const result = await service.composeTyped('student-in', 'real');

    expect(prisma.problem.findMany).toHaveBeenCalledWith({
      where: {
        conceptLesson: { ncertClass: 'CLASS_9' },
        steps: { some: { choices: { some: {} } } },
      },
      orderBy: { source: 'asc' },
    });
    expect(result.problems).toEqual([
      { id: 'in-class9', source: 'seed', difficulty: 'EASY' },
    ]);
  });

  it('returns an empty paper instead of mixing other grades when the grade pool is empty', async () => {
    const { service, prisma } = build();
    prisma.user.findUnique.mockResolvedValue({
      country: 'KR',
      gradeLevel: 'CLASS_7',
    });
    prisma.problem.findMany.mockResolvedValue([]);

    const result = await service.composeTyped('student-empty', 'real');

    expect(result).toEqual({
      kind: 'real',
      fallbackReason: 'no-grade-problems',
      problems: [],
    });
    expect(prisma.problem.findMany).toHaveBeenCalledTimes(1);
  });

  it('does not query an unscoped problem pool when the profile has no grade', async () => {
    const { service, prisma } = build();
    prisma.user.findUnique.mockResolvedValue({
      country: 'IN',
      gradeLevel: null,
    });

    const result = await service.composeTyped('student-no-grade', 'real');

    expect(result.problems).toEqual([]);
    expect(prisma.problem.findMany).not.toHaveBeenCalled();
  });
});

describe('AiRecommendExamService weakness retest selection', () => {
  beforeEach(() => jest.clearAllMocks());

  it('excludes recently offered and attempted problems and requires playable choices', async () => {
    const { service, prisma } = build();
    prisma.user.findUnique.mockResolvedValue({ country: 'KR' });
    prisma.recommendationLog.findMany.mockResolvedValue([{ recommendedProblemId: 'recent-session' }]);
    prisma.attempt.findMany.mockResolvedValue([{ problemId: 'recent-attempt' }]);
    prisma.problem.findMany.mockResolvedValue([
      { id: 'fresh', source: 'seed', difficulty: 'MEDIUM' },
    ]);

    const result = await service.compose('student-1');

    expect(result.problems).toEqual([{ id: 'fresh', source: 'seed', difficulty: 'MEDIUM' }]);
    expect(prisma.problem.findMany).toHaveBeenCalledWith({
      where: {
        koreanConceptLessonId: { not: null },
        steps: { some: { choices: { some: {} } } },
        id: { notIn: ['recent-session', 'recent-attempt'] },
      },
      take: 10,
      orderBy: { createdAt: 'desc' },
    });
    expect(prisma.recommendationLog.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        userId: 'student-1',
        recommendationType: 'REVIEW_PROBLEM',
        sessionId: { not: null },
      }),
    }));
  });

  it('allows recent repeats only when the unseen playable pool is exhausted', async () => {
    const { service, prisma } = build();
    prisma.user.findUnique.mockResolvedValue({ country: 'IN' });
    prisma.recommendationLog.findMany.mockResolvedValue([{ recommendedProblemId: 'only-playable' }]);
    prisma.problem.findMany
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ id: 'only-playable', source: 'seed', difficulty: 'EASY' }]);

    const result = await service.compose('student-1');

    expect(result).toEqual({
      problems: [{ id: 'only-playable', source: 'seed', difficulty: 'EASY' }],
      fallbackReason: 'recent-playable-pool-exhausted',
    });
    expect(prisma.problem.findMany).toHaveBeenNthCalledWith(1, expect.objectContaining({
      where: expect.objectContaining({ id: { notIn: ['only-playable'] } }),
    }));
    expect(prisma.problem.findMany).toHaveBeenNthCalledWith(2, expect.objectContaining({
      where: expect.not.objectContaining({ id: expect.anything() }),
    }));
  });
});
