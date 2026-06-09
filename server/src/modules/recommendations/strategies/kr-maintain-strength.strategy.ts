import { Injectable } from '@nestjs/common';
import { Lang } from '../../../common/i18n/current-lang.decorator';
import { KrChapterStatsService } from '../services/kr-chapter-stats.service';
import { buildKrCard, KrRecommendCard } from './kr-recommend-card.util';

const MIN_PROGRESS = 0.7;

/**
 * KR "강점 유지" — 진도 70% 이상 최상위 챕터 추천.
 */
@Injectable()
export class KrMaintainStrengthStrategy {
  constructor(private readonly stats: KrChapterStatsService) {}

  async recommend(
    userId: string,
    excludeChapterCodes: string[] = [],
    lang: Lang = 'ko',
  ): Promise<KrRecommendCard | null> {
    const chapters = await this.stats.listActiveChapters(userId);
    const exclude = new Set(excludeChapterCodes);
    const candidates = chapters
      .filter((c) => !exclude.has(c.chapterCode) && c.progress >= MIN_PROGRESS)
      .sort((a, b) => b.progress - a.progress);

    const top = candidates[0];
    if (!top) return null;

    return buildKrCard(top, lang, 'maintain', { progressPct: top.progressPct });
  }
}