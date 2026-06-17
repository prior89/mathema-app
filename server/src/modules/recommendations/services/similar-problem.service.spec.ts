import { SimilarProblemService } from './similar-problem.service';

function build() {
  const prisma = {
    attempt: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    problem: {
      findMany: jest.fn(),
    },
    recommendationLog: {
      create: jest.fn(),
    },
  };
  return {
    service: new SimilarProblemService(prisma as never),
    prisma,
  };
}

const baseAttempt = {
  id: 'attempt-1',
  problemId: 'source-problem',
  tenantId: null,
  studySessionId: null,
  errorCodes: ['SIGN_ERROR'],
  problem: {
    difficultyLevel: 3,
    conceptLessonId: null,
    koreanConceptLessonId: null,
    concepts: [{ conceptId: 'concept-1', weight: 1 }],
  },
};

const candidate = {
  id: 'candidate-1',
  difficultyLevel: 3,
  commonErrorCodes: ['SIGN_ERROR'],
  concepts: [{ conceptId: 'concept-1', weight: 1 }],
};

describe('SimilarProblemService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('scopes Korean similar-problem candidates to the same Korean lesson', async () => {
    const { service, prisma } = build();
    prisma.attempt.findUnique.mockResolvedValue({
      ...baseAttempt,
      problem: {
        ...baseAttempt.problem,
        koreanConceptLessonId: 'kr-lesson-1',
      },
    });
    prisma.attempt.findMany.mockResolvedValue([]);
    prisma.problem.findMany.mockResolvedValue([candidate]);
    prisma.recommendationLog.create.mockResolvedValue({ id: 'log-1', reason: 'same' });

    await service.getSimilar('user-1', 'attempt-1');

    expect(prisma.problem.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          koreanConceptLessonId: 'kr-lesson-1',
          concepts: { some: { conceptId: { in: ['concept-1'] } } },
        }),
      }),
    );
  });

  it('scopes NCERT similar-problem candidates to the same NCERT lesson', async () => {
    const { service, prisma } = build();
    prisma.attempt.findUnique.mockResolvedValue({
      ...baseAttempt,
      problem: {
        ...baseAttempt.problem,
        conceptLessonId: 'ncert-lesson-1',
      },
    });
    prisma.attempt.findMany.mockResolvedValue([]);
    prisma.problem.findMany.mockResolvedValue([candidate]);
    prisma.recommendationLog.create.mockResolvedValue({ id: 'log-1', reason: 'same' });

    await service.getSimilar('user-1', 'attempt-1');

    expect(prisma.problem.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          conceptLessonId: 'ncert-lesson-1',
          concepts: { some: { conceptId: { in: ['concept-1'] } } },
        }),
      }),
    );
  });
});
