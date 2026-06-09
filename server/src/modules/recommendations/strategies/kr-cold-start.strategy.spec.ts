import { KrColdStartStrategy } from './kr-cold-start.strategy';

function build() {
  const prisma = {
    user: { findUnique: jest.fn() },
    attempt: { count: jest.fn() },
    koreanConceptLesson: { findMany: jest.fn() },
  };
  return { svc: new KrColdStartStrategy(prisma as never), prisma };
}

describe('KrColdStartStrategy', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns grade-based static cards for KR user with no attempts', async () => {
    const { svc, prisma } = build();
    prisma.user.findUnique.mockResolvedValue({ country: 'KR', gradeLevel: 'CLASS_11' });
    prisma.attempt.count.mockResolvedValue(0);
    prisma.koreanConceptLesson.findMany.mockResolvedValue([
      { chapterCode: 'K-G11-COMMON1-CH01', titleKo: '다항식', titleEn: 'Polynomials' },
      { chapterCode: 'K-G11-COMMON1-CH02', titleKo: '방정식', titleEn: 'Equations' },
    ]);

    const cards = await svc.recommend('user-kr', 'ko');

    expect(cards).toHaveLength(2);
    expect(cards[0].chapterCode).toBe('K-G11-COMMON1-CH01');
    expect(cards[0].tag).toBe('시작하기');
    expect(cards[0].route).toBe('/app/learn/K-G11-COMMON1-CH01');
    expect(prisma.koreanConceptLesson.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { koreanGrade: 'HIGH_2' } }),
    );
  });

  it('returns [] for non-KR users', async () => {
    const { svc, prisma } = build();
    prisma.user.findUnique.mockResolvedValue({ country: 'IN', gradeLevel: 'CLASS_11' });

    const cards = await svc.recommend('user-in', 'en');

    expect(cards).toEqual([]);
    expect(prisma.attempt.count).not.toHaveBeenCalled();
  });

  it('returns [] when user already has attempts (not cold-start)', async () => {
    const { svc, prisma } = build();
    prisma.user.findUnique.mockResolvedValue({ country: 'KR', gradeLevel: 'CLASS_10' });
    prisma.attempt.count.mockResolvedValue(3);

    const cards = await svc.recommend('user-kr', 'ko');

    expect(cards).toEqual([]);
    expect(prisma.koreanConceptLesson.findMany).not.toHaveBeenCalled();
  });

  it('returns [] when no Korean lessons exist for grade', async () => {
    const { svc, prisma } = build();
    prisma.user.findUnique.mockResolvedValue({ country: 'KR', gradeLevel: 'CLASS_7' });
    prisma.attempt.count.mockResolvedValue(0);
    prisma.koreanConceptLesson.findMany.mockResolvedValue([]);

    const cards = await svc.recommend('user-kr', 'ko');

    expect(cards).toEqual([]);
  });
});