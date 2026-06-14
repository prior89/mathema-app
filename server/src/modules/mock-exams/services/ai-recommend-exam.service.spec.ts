import { AiRecommendExamService } from './ai-recommend-exam.service';

function build() {
  const prisma = {
    user: { findUnique: jest.fn() },
    problem: { findMany: jest.fn() },
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
        steps: { some: { stepIndex: 1 } },
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
        steps: { some: { stepIndex: 1 } },
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
