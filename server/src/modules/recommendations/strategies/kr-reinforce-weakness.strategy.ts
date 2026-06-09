import { Injectable } from '@nestjs/common';
import { Lang } from '../../../common/i18n/current-lang.decorator';
import { KrChapterStatsService } from '../services/kr-chapter-stats.service';
import { buildKrCard, KrRecommendCard } from './kr-recommend-card.util';

/**
 * KR "약점 보강" — ANSWER-step 진도가 가장 낮은 활성 챕터 추천.
 */
@Injectable()
export class KrReinforceWeaknessStrategy {
  constructor(private readonly stats: KrChapterStatsService) {}

  async recommend(
    userId: string,
    excludeChapterCodes: string[] = [],
    lang: Lang = 'ko',
  ): Promise<KrRecommendCard | null> {
    const chapters = await this.stats.listActiveChapters(userId);
    const exclude = new Set(excludeChapterCodes);
    const candidates = chapters
      .filter((c) => !exclude.has(c.chapterCode))
      .sort((a, b) => a.progress - b.progress);

    const weakest = candidates[0];
    if (!weakest) return null;

    return buildKrCard(weakest, lang, 'reinforce', {
      progressPct: weakest.progressPct,
      gapPct: weakest.gapPct,
    });
  }
}