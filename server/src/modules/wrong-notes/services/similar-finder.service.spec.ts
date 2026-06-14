import { SimilarFinderService } from './similar-finder.service';

function build() {
  const prisma = {
    problem: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  };
  return {
    service: new SimilarFinderService(prisma as never),
    prisma,
  };
}

const candidate = {
  id: 'candidate-1',
  source: 'Matheo KR (2022 개정) · Study · admin-authored',
  body: '좌표평면에서 두 점 사이의 거리를 구하여라.',
  difficulty: 'MIDDLE',
  unit: { name: '정수' },
  conceptLesson: null,
  koreanConceptLesson: {
    titleKo: '좌표평면과 그래프',
    titleEn: 'Coordinate Plane and Graphs',
  },
};

describe('SimilarFinderService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('uses the Korean lesson id instead of the shared fallback unit id', async () => {
    const { service, prisma } = build();
    prisma.problem.findUnique.mockResolvedValue({
      unitId: 'fallback-integers-unit',
      subUnitId: null,
      conceptLessonId: null,
      koreanConceptLessonId: 'kr-coordinate-chapter',
      difficulty: 'MIDDLE',
    });
    prisma.problem.findMany
      .mockResolvedValueOnce([candidate])
      .mockResolvedValueOnce([]);

    const result = await service.findSimilar('source-problem', 5, 'ko');

    expect(prisma.problem.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          koreanConceptLessonId: 'kr-coordinate-chapter',
          difficulty: 'MIDDLE',
        }),
      }),
    );
    expect(result[0]).toMatchObject({
      chapter: '좌표평면과 그래프',
      difficulty: '쉬움',
    });
  });

  it('uses the NCERT lesson id for Indian chapter suggestions', async () => {
    const { service, prisma } = build();
    prisma.problem.findUnique.mockResolvedValue({
      unitId: 'broad-algebra-unit',
      subUnitId: 'sub-1',
      conceptLessonId: 'ncert-linear-equations',
      koreanConceptLessonId: null,
      difficulty: 'MEDIUM',
    });
    prisma.problem.findMany.mockResolvedValueOnce([]);
    prisma.problem.findMany.mockResolvedValueOnce([]);

    await service.findSimilar('source-problem', 5, 'en');

    expect(prisma.problem.findMany).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        where: expect.objectContaining({
          conceptLessonId: 'ncert-linear-equations',
          difficulty: 'MEDIUM',
        }),
      }),
    );
    expect(prisma.problem.findMany).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        where: expect.objectContaining({
          conceptLessonId: 'ncert-linear-equations',
          difficulty: { not: 'MEDIUM' },
        }),
      }),
    );
  });

  it('falls back to sub-unit scope only for legacy problems without lesson links', async () => {
    const { service, prisma } = build();
    prisma.problem.findUnique.mockResolvedValue({
      unitId: 'unit-1',
      subUnitId: 'sub-legacy',
      conceptLessonId: null,
      koreanConceptLessonId: null,
      difficulty: 'HARD',
    });
    prisma.problem.findMany.mockResolvedValueOnce([]);
    prisma.problem.findMany.mockResolvedValueOnce([]);

    await service.findSimilar('legacy-problem', 5, 'ko');

    expect(prisma.problem.findMany).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        where: expect.objectContaining({ subUnitId: 'sub-legacy' }),
      }),
    );
  });
});
