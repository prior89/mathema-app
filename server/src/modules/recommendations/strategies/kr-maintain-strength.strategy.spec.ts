import { KrMaintainStrengthStrategy } from './kr-maintain-strength.strategy';
import { KrChapterStatsService } from '../services/kr-chapter-stats.service';

function build() {
  const stats = { listActiveChapters: jest.fn() };
  const svc = new KrMaintainStrengthStrategy(stats as unknown as KrChapterStatsService);
  return { svc, stats };
}

describe('KrMaintainStrengthStrategy', () => {
  beforeEach(() => jest.clearAllMocks());

  it('recommends highest-progress chapter at or above 70%', async () => {
    const { svc, stats } = build();
    stats.listActiveChapters.mockResolvedValue([
      { chapterCode: 'K-G11-COMMON1-CH01', titleKo: '다항식', titleEn: 'Polynomials', progress: 0.75, progressPct: 75, gapPct: -4, accuracy: 0.8, lastAttemptAt: new Date() },
      { chapterCode: 'K-G11-COMMON1-CH02', titleKo: '방정식', titleEn: 'Equations', progress: 0.9, progressPct: 90, gapPct: -19, accuracy: 0.9, lastAttemptAt: new Date() },
    ]);

    const card = await svc.recommend('user-kr', [], 'ko');

    expect(card?.chapterCode).toBe('K-G11-COMMON1-CH02');
    expect(card?.tag).toBe('강점 유지');
  });

  it('returns null when no chapter reaches 70% progress', async () => {
    const { svc, stats } = build();
    stats.listActiveChapters.mockResolvedValue([
      { chapterCode: 'K-G11-COMMON1-CH01', titleKo: '다항식', titleEn: 'Polynomials', progress: 0.5, progressPct: 50, gapPct: 21, accuracy: 0.5, lastAttemptAt: new Date() },
    ]);

    expect(await svc.recommend('user-kr', [], 'ko')).toBeNull();
  });
});