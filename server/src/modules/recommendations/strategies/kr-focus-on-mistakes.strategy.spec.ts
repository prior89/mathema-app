import { KrFocusOnMistakesStrategy } from './kr-focus-on-mistakes.strategy';

function build() {
  const prisma = { wrongNote: { findMany: jest.fn() } };
  return { svc: new KrFocusOnMistakesStrategy(prisma as never), prisma };
}

describe('KrFocusOnMistakesStrategy', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns chapter card for KR wrong-note bucket with most occurrences', async () => {
    const { svc, prisma } = build();
    prisma.wrongNote.findMany.mockResolvedValue([
      {
        occurrences: 3,
        problem: {
          koreanConceptLesson: { chapterCode: 'K-G11-COMMON1-CH01', titleKo: '다항식', titleEn: 'Polynomials' },
        },
      },
      {
        occurrences: 1,
        problem: {
          koreanConceptLesson: { chapterCode: 'K-G11-COMMON1-CH02', titleKo: '방정식', titleEn: 'Equations' },
        },
      },
    ]);

    const card = await svc.recommend('user-kr', 'ko');

    expect(card?.chapterCode).toBe('K-G11-COMMON1-CH01');
    expect(card?.tag).toBe('오답 집중');
    expect(card?.route).toBe('/app/learn/K-G11-COMMON1-CH01');
  });

  it('returns null when no KR wrong notes exist', async () => {
    const { svc, prisma } = build();
    prisma.wrongNote.findMany.mockResolvedValue([]);

    expect(await svc.recommend('user-kr', 'ko')).toBeNull();
  });
});