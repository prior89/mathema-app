import { KrReinforceWeaknessStrategy } from './kr-reinforce-weakness.strategy';
import { KrChapterStatsService } from '../services/kr-chapter-stats.service';

function build() {
  const stats = { listActiveChapters: jest.fn() };
  const svc = new KrReinforceWeaknessStrategy(stats as unknown as KrChapterStatsService);
  return { svc, stats };
}

describe('KrReinforceWeaknessStrategy', () => {
  beforeEach(() => jest.clearAllMocks());

  it('recommends lowest-progress chapter', async () => {
    const { svc, stats } = build();
    stats.listActiveChapters.mockResolvedValue([
      { chapterCode: 'K-G11-COMMON1-CH02', titleKo: '방정식', titleEn: 'Equations', progress: 0.5, progressPct: 50, gapPct: 21, accuracy: 0.6, lastAttemptAt: new Date() },
      { chapterCode: 'K-G11-COMMON1-CH01', titleKo: '다항식', titleEn: 'Polynomials', progress: 0.2, progressPct: 20, gapPct: 51, accuracy: 0.4, lastAttemptAt: new Date() },
    ]);

    const card = await svc.recommend('user-kr', [], 'ko');

    expect(card?.chapterCode).toBe('K-G11-COMMON1-CH01');
    expect(card?.tag).toBe('약점 보강');
  });

  it('skips excluded chapter codes', async () => {
    const { svc, stats } = build();
    stats.listActiveChapters.mockResolvedValue([
      { chapterCode: 'K-G11-COMMON1-CH01', titleKo: '다항식', titleEn: 'Polynomials', progress: 0.2, progressPct: 20, gapPct: 51, accuracy: 0.4, lastAttemptAt: new Date() },
      { chapterCode: 'K-G11-COMMON1-CH02', titleKo: '방정식', titleEn: 'Equations', progress: 0.5, progressPct: 50, gapPct: 21, accuracy: 0.6, lastAttemptAt: new Date() },
    ]);

    const card = await svc.recommend('user-kr', ['K-G11-COMMON1-CH01'], 'ko');

    expect(card?.chapterCode).toBe('K-G11-COMMON1-CH02');
  });
});