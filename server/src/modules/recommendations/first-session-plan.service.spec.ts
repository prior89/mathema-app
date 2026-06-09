import { FirstSessionPlanService } from './first-session-plan.service';

function build() {
  const prisma = {
    user: { findUnique: jest.fn() },
    conceptLesson: { findUnique: jest.fn(), findMany: jest.fn() },
    koreanConceptLesson: { findUnique: jest.fn(), findMany: jest.fn() },
    firstSessionPlan: { upsert: jest.fn().mockResolvedValue({}) },
  };
  return { svc: new FirstSessionPlanService(prisma as never), prisma };
}

describe('FirstSessionPlanService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('seeds 2 cards from recommended chapter codes (IN)', async () => {
    const { svc, prisma } = build();
    prisma.user.findUnique.mockResolvedValue({ country: 'IN', gradeLevel: 'CLASS_11' });
    prisma.conceptLesson.findUnique
      .mockResolvedValueOnce({ titleEn: 'Sets', titleKo: '집합' })
      .mockResolvedValueOnce({ titleEn: 'Relations', titleKo: '관계' });

    const cards = await svc.seedFirstSession('user-1', {
      recommendedChapterCodes: ['C11-CH01-SETS', 'C11-CH02-RELATIONS-FUNCTIONS'],
    });

    expect(cards).toHaveLength(2);
    expect(cards[0].route).toBe('/app/learn/C11-CH01-SETS');
    expect(prisma.firstSessionPlan.upsert).toHaveBeenCalled();
  });

  it('returns empty when no chapters resolve', async () => {
    const { svc, prisma } = build();
    prisma.user.findUnique.mockResolvedValue({ country: 'IN', gradeLevel: 'CLASS_11' });
    prisma.conceptLesson.findUnique.mockResolvedValue(null);
    prisma.conceptLesson.findMany.mockResolvedValue([]);

    const cards = await svc.seedFirstSession('user-1', {
      recommendedChapterCodes: ['MISSING'],
    });

    expect(cards).toHaveLength(0);
    expect(prisma.firstSessionPlan.upsert).not.toHaveBeenCalled();
  });

  it('maps stored cards to RecommendCard shape with chapterCode', () => {
    const { svc } = build();
    const out = svc.toRecommendCards([
      { chapterCode: 'C11-CH01-SETS', label: 'Sets', route: '/app/learn/C11-CH01-SETS', priority: 1 },
    ], 'en');
    expect(out[0].chapterCode).toBe('C11-CH01-SETS');
    expect(out[0].tag).toBe('Start here');
  });
});