import { Injectable } from '@nestjs/common';
import { ErrorPatternStatus } from '@prisma/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RedisService } from '../../infrastructure/redis/redis.service';
import { ActivityService } from '../activity/activity.service';
import { EFFICACY_MIN_COHORT, LearningMetricsService } from '../admin/learning-metrics.service';

export interface StudentEfficacyCard {
  northStarPct: number | null;
  cohortSize: number;
  chaptersMastered: number;
  wrongNotesMasteredPct: number;
  errorPatternsImproving: number;
  streakDays: number;
  message: string;
}

const CACHE_TTL_SEC = 3600;

@Injectable()
export class StudentEfficacyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly activity: ActivityService,
    private readonly learningMetrics: LearningMetricsService,
  ) {}

  async getCard(userId: string): Promise<StudentEfficacyCard> {
    const cacheKey = this.cacheKey(userId);
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached) as StudentEfficacyCard;

    const card = await this.compute(userId);
    await this.redis.set(cacheKey, JSON.stringify(card), CACHE_TTL_SEC);
    return card;
  }

  private cacheKey(userId: string): string {
    const hour = new Date().toISOString().slice(0, 13).replace('T', '-');
    return `efficacy:${userId}:${hour}`;
  }

  private async compute(userId: string): Promise<StudentEfficacyCard> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { country: true },
    });
    const isKr = user?.country === 'KR';

    const [
      inMastered,
      krMastered,
      wnTotal,
      wnMastered,
      errorPatternsImproving,
      streak,
      cohort,
    ] = await Promise.all([
      this.prisma.conceptProgress.count({
        where: { userId, masteredAt: { not: null } },
      }),
      this.prisma.koreanConceptProgress.count({
        where: { userId, masteredAt: { not: null } },
      }),
      this.prisma.wrongNote.count({ where: { userId } }),
      this.prisma.wrongNote.count({ where: { userId, status: 'MASTERED' } }),
      this.prisma.errorPatternProfile.count({
        where: { userId, status: ErrorPatternStatus.IMPROVING },
      }),
      this.activity.streak(userId),
      this.learningMetrics.cohortNorthStar(),
    ]);

    const chaptersMastered = inMastered + krMastered;
    const wrongNotesMasteredPct = wnTotal > 0
      ? Math.round((wnMastered / wnTotal) * 1000) / 10
      : 0;

    const cohortLargeEnough = cohort.cohortSize >= EFFICACY_MIN_COHORT;
    const northStarPct = cohortLargeEnough ? cohort.valuePct : null;
    const cohortSize = cohortLargeEnough ? cohort.cohortSize : 0;

    const message = this.buildMessage({
      isKr,
      northStarPct,
      chaptersMastered,
      wrongNotesMasteredPct,
      errorPatternsImproving,
      streakDays: streak.days,
    });

    return {
      northStarPct,
      cohortSize,
      chaptersMastered,
      wrongNotesMasteredPct,
      errorPatternsImproving,
      streakDays: streak.days,
      message,
    };
  }

  private buildMessage(input: {
    isKr: boolean;
    northStarPct: number | null;
    chaptersMastered: number;
    wrongNotesMasteredPct: number;
    errorPatternsImproving: number;
    streakDays: number;
  }): string {
    if (input.northStarPct == null) {
      return input.isKr
        ? '더 많은 학습자가 모이면 비교 통계가 표시됩니다'
        : 'Comparison stats will appear once more learners join.';
    }

    if (input.chaptersMastered > 0 && input.streakDays >= 3) {
      return input.isKr
        ? `챕터 ${input.chaptersMastered}개 마스터 · ${input.streakDays}일 연속 학습 중이에요.`
        : `${input.chaptersMastered} chapter${input.chaptersMastered > 1 ? 's' : ''} mastered · ${input.streakDays}-day streak.`;
    }

    if (input.errorPatternsImproving > 0) {
      return input.isKr
        ? `오답 패턴 ${input.errorPatternsImproving}개가 개선 중이에요.`
        : `${input.errorPatternsImproving} error pattern${input.errorPatternsImproving > 1 ? 's are' : ' is'} improving.`;
    }

    if (input.wrongNotesMasteredPct >= 50) {
      return input.isKr
        ? `오답노트 ${input.wrongNotesMasteredPct}%를 마스터했어요.`
        : `You've mastered ${input.wrongNotesMasteredPct}% of your wrong notes.`;
    }

    return input.isKr
      ? `비슷한 학습자의 ${input.northStarPct}%가 14일 안에 챕터를 마스터해요.`
      : `${input.northStarPct}% of learners like you master a chapter within 14 days.`;
  }
}