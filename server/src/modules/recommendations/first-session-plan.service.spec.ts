import { FirstSessionPlanService } from './first-session-plan.service';

function build() {
  const prisma = {
    user: { findUnique: jest.fn() },
    conceptLesson: { findUnique: jest.fn(), findMany: jest.fn() },
    koreanConceptLesson: { findUnique: jest.fn(), findMany: jest.fn() },
    firstSessionPlan: {
      findUnique: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({}),
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
  };
  return { svc: new FirstSessionPlanService(prisma as never), prisma };
}

const cards = [
  { chapterCode: 'C11-CH01-SETS', label: 'Sets', route: '/app/learn/C11-CH01-SETS', priority: 1 },
  {
    chapterCode: 'C11-CH02-RELATIONS-FUNCTIONS',
    label: 'Relations',
    route: '/app/learn/C11-CH02-RELATIONS-FUNCTIONS',
    priority: 2,
  },
];

describe('FirstSessionPlanService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('seeds 2 cards from recommended chapter codes (IN)', async () => {
    const { svc, prisma } = build();
    prisma.user.findUnique.mockResolvedValue({ country: 'IN', gradeLevel: 'CLASS_11' });
    prisma.conceptLesson.findUnique
      .mockResolvedValueOnce({ titleEn: 'Sets', titleKo: '집합' })
      .mockResolvedValueOnce({ titleEn: 'Relations', titleKo: '관계' });

    const result = await svc.ensureFirstSession('user-1', {
      recommendedChapterCodes: ['C11-CH01-SETS', 'C11-CH02-RELATIONS-FUNCTIONS'],
    });

    expect(result).toHaveLength(2);
    expect(result[0].route).toBe('/app/learn/C11-CH01-SETS');
    expect(prisma.firstSessionPlan.create).toHaveBeenCalledWith({
      data: { userId: 'user-1', cards: result },
    });
  });

  it('returns empty when no chapters resolve', async () => {
    const { svc, prisma } = build();
    prisma.user.findUnique.mockResolvedValue({ country: 'IN', gradeLevel: 'CLASS_11' });
    prisma.conceptLesson.findUnique.mockResolvedValue(null);
    prisma.conceptLesson.findMany.mockResolvedValue([]);

    const result = await svc.ensureFirstSession('user-1', {
      recommendedChapterCodes: ['MISSING'],
    });

    expect(result).toHaveLength(0);
    expect(prisma.firstSessionPlan.create).not.toHaveBeenCalled();
    expect(prisma.firstSessionPlan.updateMany).not.toHaveBeenCalled();
  });

  it('keeps a completed plan immutable', async () => {
    const { svc, prisma } = build();
    prisma.firstSessionPlan.findUnique.mockResolvedValue({
      id: 'plan-1',
      cards,
      seededAt: new Date('2026-07-16T00:00:00Z'),
      completedAt: new Date('2026-07-17T00:00:00Z'),
    });

    const result = await svc.ensureFirstSession('user-1', {
      recommendedChapterCodes: ['C11-CH03-TRIGONOMETRY'],
    });

    expect(result).toEqual([]);
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(prisma.firstSessionPlan.create).not.toHaveBeenCalled();
    expect(prisma.firstSessionPlan.updateMany).not.toHaveBeenCalled();
  });

  it('returns an already complete active plan without overwriting it', async () => {
    const { svc, prisma } = build();
    prisma.firstSessionPlan.findUnique.mockResolvedValue({
      id: 'plan-1',
      cards,
      seededAt: new Date('2026-07-16T00:00:00Z'),
      completedAt: null,
    });

    const result = await svc.ensureFirstSession('user-1', {
      recommendedChapterCodes: ['C11-CH03-TRIGONOMETRY'],
    });

    expect(result).toEqual(cards);
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(prisma.firstSessionPlan.updateMany).not.toHaveBeenCalled();
  });

  it('deterministically repairs an incomplete active plan without clearing completedAt', async () => {
    const { svc, prisma } = build();
    const seededAt = new Date('2026-07-16T00:00:00Z');
    prisma.firstSessionPlan.findUnique.mockResolvedValue({
      id: 'plan-1',
      cards: [cards[0]],
      seededAt,
      completedAt: null,
    });
    prisma.user.findUnique.mockResolvedValue({ country: 'IN', gradeLevel: 'CLASS_11' });
    prisma.conceptLesson.findUnique
      .mockResolvedValueOnce({ titleEn: 'Sets', titleKo: '집합' })
      .mockResolvedValueOnce({ titleEn: 'Relations', titleKo: '관계' });

    const result = await svc.ensureFirstSession('user-1', {
      recommendedChapterCodes: ['C11-CH01-SETS', 'C11-CH02-RELATIONS-FUNCTIONS'],
    });

    expect(result).toEqual(cards);
    expect(prisma.firstSessionPlan.updateMany).toHaveBeenCalledTimes(1);
    const write = prisma.firstSessionPlan.updateMany.mock.calls[0][0];
    expect(write.where).toEqual({ id: 'plan-1', completedAt: null, seededAt });
    expect(write.data.cards).toEqual(cards);
    expect(write.data).not.toHaveProperty('completedAt');
  });

  it('does not overwrite a plan completed during recovery', async () => {
    const { svc, prisma } = build();
    const seededAt = new Date('2026-07-16T00:00:00Z');
    prisma.firstSessionPlan.findUnique
      .mockResolvedValueOnce({
        id: 'plan-1', cards: [cards[0]], seededAt, completedAt: null,
      })
      .mockResolvedValueOnce({
        id: 'plan-1', cards: [cards[0]], seededAt, completedAt: new Date('2026-07-17T00:00:00Z'),
      });
    prisma.user.findUnique.mockResolvedValue({ country: 'IN', gradeLevel: 'CLASS_11' });
    prisma.conceptLesson.findUnique
      .mockResolvedValueOnce({ titleEn: 'Sets', titleKo: '집합' })
      .mockResolvedValueOnce({ titleEn: 'Relations', titleKo: '관계' });
    prisma.firstSessionPlan.updateMany.mockResolvedValue({ count: 0 });

    const result = await svc.ensureFirstSession('user-1', {
      recommendedChapterCodes: ['C11-CH01-SETS', 'C11-CH02-RELATIONS-FUNCTIONS'],
    });

    expect(result).toEqual([]);
    expect(prisma.firstSessionPlan.updateMany).toHaveBeenCalledTimes(1);
    expect(prisma.firstSessionPlan.create).not.toHaveBeenCalled();
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
