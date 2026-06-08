import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import {
  actorNotExcluded,
  resolveMetricsExcludedUserIds,
  sqlUserIdNotIn,
  userIdNotExcluded,
} from './metrics-test-user-filter';

/** Production learning-effectiveness metrics — turns existing DB signals
 *  into investor/operator-grade evidence without a separate warehouse. */
export interface LearningEffectivenessOverview {
  generatedAt: string;
  dataScope: 'real_learners_only';
  excludedTesterCount: number;
  northStar: {
    label: string;
    description: string;
    valuePct: number;
    numerator: number;
    denominator: number;
    windowDays: number;
  };
  retention: {
    cohortDays: number;
    cohortSize: number;
    d1Pct: number;
    d7Pct: number;
    d30Pct: number;
  };
  mastery: {
    learnersStarted: number;
    chaptersMastered: number;
    masteryRatePct: number;
    avgDaysToMastery: number | null;
  };
  errorPatterns: {
    total: number;
    active: number;
    improving: number;
    resolved: number;
    resolutionRatePct: number;
  };
  wrongNotes: {
    total: number;
    mastered: number;
    masteredPct: number;
    retryAccuracyPct: number;
  };
  aiSolver: {
    totalSolves: number;
    studentAnswered: number;
    studentCorrectPct: number | null;
    ocrEvents: number;
  };
  engagement: {
    activeUsers7d: number;
    avgProblemsPerActiveDay: number;
    avgMinutesPerActiveDay: number;
  };
  learningEvents7d: Array<{ eventType: string; count: number }>;
}

const NORTH_STAR_WINDOW_DAYS = 14;
const COHORT_LOOKBACK_DAYS = 90;

@Injectable()
export class LearningMetricsService {
  constructor(private readonly prisma: PrismaService) {}

  async overview(): Promise<LearningEffectivenessOverview> {
    const excludedIds = await resolveMetricsExcludedUserIds(this.prisma);

    const [
      northStar,
      retention,
      mastery,
      errorPatterns,
      wrongNotes,
      aiSolver,
      engagement,
      learningEvents7d,
    ] = await Promise.all([
      this.northStar(excludedIds),
      this.cohortRetention(excludedIds),
      this.masteryStats(excludedIds),
      this.errorPatternStats(excludedIds),
      this.wrongNoteStats(excludedIds),
      this.aiSolverStats(excludedIds),
      this.engagementStats(excludedIds),
      this.recentLearningEvents(excludedIds),
    ]);

    return {
      generatedAt: new Date().toISOString(),
      dataScope: 'real_learners_only',
      excludedTesterCount: excludedIds.length,
      northStar,
      retention,
      mastery,
      errorPatterns,
      wrongNotes,
      aiSolver,
      engagement,
      learningEvents7d,
    };
  }

  /** North Star: % of recent starters who master a chapter within 14 days. */
  private async northStar(excludedIds: string[]) {
    const since = daysAgo(COHORT_LOOKBACK_DAYS);
    const windowMs = NORTH_STAR_WINDOW_DAYS * 24 * 60 * 60 * 1000;
    const userFilter = userIdNotExcluded(excludedIds);

    const [inRows, krRows] = await Promise.all([
      this.prisma.conceptProgress.findMany({
        where: { startedAt: { gte: since }, ...userFilter },
        select: { userId: true, startedAt: true, masteredAt: true },
      }),
      this.prisma.koreanConceptProgress.findMany({
        where: { startedAt: { gte: since }, ...userFilter },
        select: { userId: true, startedAt: true, masteredAt: true },
      }),
    ]);

    const starters = new Set<string>();
    const masteredInWindow = new Set<string>();

    for (const row of [...inRows, ...krRows]) {
      starters.add(row.userId);
      if (!row.masteredAt) continue;
      const elapsed = row.masteredAt.getTime() - row.startedAt.getTime();
      if (elapsed >= 0 && elapsed <= windowMs) masteredInWindow.add(row.userId);
    }

    const denominator = starters.size;
    const numerator = masteredInWindow.size;
    const valuePct = denominator > 0 ? round1((numerator / denominator) * 100) : 0;

    return {
      label: '14일 내 챕터 마스터리',
      description:
        '최근 90일 안에 챕터를 시작한 학습자 중, 첫 학습 후 14일 이내에 마스터리를 달성한 비율입니다.',
      valuePct,
      numerator,
      denominator,
      windowDays: NORTH_STAR_WINDOW_DAYS,
    };
  }

  /** Cohort retention for users who signed up in the last 90 days. */
  private async cohortRetention(excludedIds: string[]) {
    const since = daysAgo(COHORT_LOOKBACK_DAYS);
    const users = await this.prisma.user.findMany({
      where: {
        deletedAt: null,
        createdAt: { gte: since },
        role: 'STUDENT',
        ...(excludedIds.length > 0 ? { id: { notIn: excludedIds } } : {}),
      },
      select: { id: true, createdAt: true },
    });
    if (users.length === 0) {
      return { cohortDays: COHORT_LOOKBACK_DAYS, cohortSize: 0, d1Pct: 0, d7Pct: 0, d30Pct: 0 };
    }

    const ids = users.map((u) => u.id);
    const acts = await this.prisma.dailyActivity.findMany({
      where: { userId: { in: ids }, intensity: { gt: 0 } },
      select: { userId: true, date: true },
    });
    const activeDays = new Map<string, Set<string>>();
    for (const a of acts) {
      const key = a.date.toISOString().slice(0, 10);
      if (!activeDays.has(a.userId)) activeDays.set(a.userId, new Set());
      activeDays.get(a.userId)!.add(key);
    }

    let d1 = 0;
    let d7 = 0;
    let d30 = 0;
    for (const u of users) {
      const signup = startOfDay(u.createdAt);
      const days = activeDays.get(u.id);
      if (!days) continue;
      if (days.has(dayOffset(signup, 1))) d1 += 1;
      if (hasReturnWithin(days, signup, 7)) d7 += 1;
      if (hasReturnWithin(days, signup, 30)) d30 += 1;
    }

    const n = users.length;
    return {
      cohortDays: COHORT_LOOKBACK_DAYS,
      cohortSize: n,
      d1Pct: round1((d1 / n) * 100),
      d7Pct: round1((d7 / n) * 100),
      d30Pct: round1((d30 / n) * 100),
    };
  }

  private async masteryStats(excludedIds: string[]) {
    const userFilter = userIdNotExcluded(excludedIds);
    const [inMastered, krMastered, inStarted, krStarted] = await Promise.all([
      this.prisma.conceptProgress.count({
        where: { masteredAt: { not: null }, ...userFilter },
      }),
      this.prisma.koreanConceptProgress.count({
        where: { masteredAt: { not: null }, ...userFilter },
      }),
      this.prisma.conceptProgress.count({ where: userFilter }),
      this.prisma.koreanConceptProgress.count({ where: userFilter }),
    ]);

    const chaptersMastered = inMastered + krMastered;
    const learnersStarted = inStarted + krStarted;
    const masteryRatePct = learnersStarted > 0
      ? round1((chaptersMastered / learnersStarted) * 100)
      : 0;

    const userSql = sqlUserIdNotIn(excludedIds);
    const avgRows = await this.prisma.$queryRaw<Array<{ avg_days: number | null }>>`
      SELECT AVG(days)::float AS avg_days FROM (
        SELECT EXTRACT(EPOCH FROM ("masteredAt" - "startedAt")) / 86400.0 AS days
        FROM "ConceptProgress"
        WHERE "masteredAt" IS NOT NULL ${userSql}
        UNION ALL
        SELECT EXTRACT(EPOCH FROM ("masteredAt" - "startedAt")) / 86400.0 AS days
        FROM "KoreanConceptProgress"
        WHERE "masteredAt" IS NOT NULL ${userSql}
      ) t
    `;
    const avgDaysToMastery = avgRows[0]?.avg_days != null
      ? round1(Number(avgRows[0].avg_days))
      : null;

    return { learnersStarted, chaptersMastered, masteryRatePct, avgDaysToMastery };
  }

  private async errorPatternStats(excludedIds: string[]) {
    const grouped = await this.prisma.errorPatternProfile.groupBy({
      by: ['status'],
      where: userIdNotExcluded(excludedIds),
      _count: true,
    });
    const byStatus = Object.fromEntries(grouped.map((g) => [g.status, g._count]));
    const total = grouped.reduce((s, g) => s + g._count, 0);
    const resolved = byStatus['RESOLVED'] ?? 0;
    const active = byStatus['ACTIVE'] ?? 0;
    const improving = byStatus['IMPROVING'] ?? 0;
    const resolutionRatePct = total > 0 ? round1((resolved / total) * 100) : 0;
    return { total, active, improving, resolved, resolutionRatePct };
  }

  private async wrongNoteStats(excludedIds: string[]) {
    const userFilter = userIdNotExcluded(excludedIds);
    const userSql = sqlUserIdNotIn(excludedIds);
    const [total, mastered, retries] = await Promise.all([
      this.prisma.wrongNote.count({ where: userFilter }),
      this.prisma.wrongNote.count({ where: { status: 'MASTERED', ...userFilter } }),
      this.prisma.$queryRaw<Array<{ retry_accuracy: number | null }>>`
        WITH first_attempt AS (
          SELECT "userId", "problemId", MIN("createdAt") AS first_at
          FROM "Attempt"
          WHERE 1=1 ${userSql}
          GROUP BY 1, 2
        ),
        retry AS (
          SELECT a."isCorrect"
          FROM "Attempt" a
          JOIN first_attempt f
            ON f."userId" = a."userId" AND f."problemId" = a."problemId"
          WHERE a."createdAt" > f.first_at ${userSql}
        )
        SELECT
          CASE WHEN COUNT(*) = 0 THEN NULL
               ELSE ROUND(100.0 * SUM(CASE WHEN "isCorrect" THEN 1 ELSE 0 END) / COUNT(*), 1)
          END AS retry_accuracy
        FROM retry
      `,
    ]);
    const masteredPct = total > 0 ? round1((mastered / total) * 100) : 0;
    const retryAccuracyPct = retries[0]?.retry_accuracy != null
      ? Number(retries[0].retry_accuracy)
      : 0;
    return { total, mastered, masteredPct, retryAccuracyPct };
  }

  private async aiSolverStats(excludedIds: string[]) {
    const actorFilter = actorNotExcluded(excludedIds);
    const [totalSolves, studentAnswered, studentCorrect, ocrEvents] = await Promise.all([
      this.prisma.solverAttempt.count({ where: actorFilter }),
      this.prisma.solverAttempt.count({
        where: { studentCorrect: { not: null }, ...actorFilter },
      }),
      this.prisma.solverAttempt.count({
        where: { studentCorrect: true, ...actorFilter },
      }),
      this.prisma.analyticsEvent.count({
        where: {
          eventType: { startsWith: 'solver.ocr' },
          createdAt: { gte: daysAgo(30) },
          ...actorFilter,
        },
      }),
    ]);
    const studentCorrectPct = studentAnswered > 0
      ? round1((studentCorrect / studentAnswered) * 100)
      : null;
    return { totalSolves, studentAnswered, studentCorrectPct, ocrEvents };
  }

  private async engagementStats(excludedIds: string[]) {
    const since7 = daysAgo(7);
    const acts = await this.prisma.dailyActivity.findMany({
      where: { date: { gte: since7 }, intensity: { gt: 0 }, ...userIdNotExcluded(excludedIds) },
    });
    const activeUsers = new Set(acts.map((a) => a.userId)).size;
    const totalProblems = acts.reduce((s, a) => s + a.problemsSolved, 0);
    const totalMinutes = acts.reduce((s, a) => s + a.durationMin, 0);
    const activeDays = acts.length || 1;
    return {
      activeUsers7d: activeUsers,
      avgProblemsPerActiveDay: round1(totalProblems / activeDays),
      avgMinutesPerActiveDay: round1(totalMinutes / activeDays),
    };
  }

  private async recentLearningEvents(excludedIds: string[]) {
    const since = daysAgo(7);
    const eventTypeFilter = {
      OR: [
        { eventType: { startsWith: 'study.' } },
        { eventType: { startsWith: 'review.' } },
        { eventType: { startsWith: 'solver.' } },
        { eventType: { startsWith: 'chapter.' } },
        { eventType: { startsWith: 'notes.' } },
      ],
    };
    const actorFilter = actorNotExcluded(excludedIds);
    const rows = await this.prisma.analyticsEvent.groupBy({
      by: ['eventType'],
      where: {
        createdAt: { gte: since },
        AND: [
          eventTypeFilter,
          ...(Object.keys(actorFilter).length > 0 ? [actorFilter] : []),
        ],
      },
      _count: { _all: true },
      orderBy: { _count: { eventType: 'desc' } },
    });
    return rows
      .map((r) => ({ eventType: r.eventType, count: r._count._all }))
      .slice(0, 20);
  }
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return d;
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function dayOffset(base: Date, offset: number): string {
  const d = new Date(base);
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

function hasReturnWithin(days: Set<string>, signup: Date, within: number): boolean {
  for (let i = 1; i <= within; i += 1) {
    if (days.has(dayOffset(signup, i))) return true;
  }
  return false;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}