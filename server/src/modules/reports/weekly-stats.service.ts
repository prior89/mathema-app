import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { getCurrentWeek, WeekBoundaries } from '../../common/utils/iso-week.util';

export interface WeeklyStats {
  // Week boundaries (UTC instants + ISO label + IANA timezone).
  weekStart: Date;
  weekEnd: Date;
  isoWeek: string;
  timezone: string;
  // Trust signals — frontend decides what to render based on these.
  hasData: boolean;
  attemptCount: number;
  masterySampleCount: number;
  // Aggregates over the current ISO week only.
  problemsSolved: number;
  correctCount: number;
  accuracyPct: number; // 0..100, rounded
  totalSessions: number;
  totalMinutes: number;
  totalHours: number; // totalMinutes / 60, rounded
  problemsPerDay: number; // problemsSolved / 7, rounded
  // Mastery (cross-week, used as supporting context only — never invented).
  avgMasteryScore: number; // 0..100, 0 when no samples
  weakestUnit: { name: string; score: number } | null;
  strongestUnit: { name: string; score: number } | null;
  // Most recent mock exam (cross-week, may be null).
  topPercentile: number | null; // 100 - latest mock percentile, null when no mock
  latestMockTakenAt: Date | null;
}

/**
 * Single source of truth for "this week" stats.
 *
 * Both ReportsService.current() and AiCoachService.mentorMessage() must call
 * this so the mentor card can never claim 50% accuracy on a page that shows
 * 0% in the stats grid. Pure aggregation: no LLM, no formatting, no language
 * branches. Callers wrap the numbers into UI strings.
 */
@Injectable()
export class WeeklyStatsService {
  constructor(private readonly prisma: PrismaService) {}

  async computeCurrent(userId: string): Promise<WeeklyStats> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { country: true },
    });
    return this.computeForWeek(userId, user?.country ?? null);
  }

  private async computeForWeek(
    userId: string,
    country: string | null,
    boundaries?: WeekBoundaries,
  ): Promise<WeeklyStats> {
    const week = boundaries ?? getCurrentWeek(country);
    const range = { gte: week.weekStart, lt: week.weekEnd };

    const [attempts, studySessions, masterySnapshots, latestMock] = await Promise.all([
      this.prisma.attempt.findMany({
        where: { userId, createdAt: range },
        select: { id: true, isCorrect: true, durationSec: true },
      }),
      this.prisma.studySession.findMany({
        where: { userId, startedAt: range },
        select: { id: true, durationSec: true },
      }),
      this.prisma.masterySnapshot.findMany({
        where: { userId, samples: { gte: 3 } },
        include: { unit: { select: { name: true } } },
        orderBy: { score: 'asc' },
      }),
      this.prisma.mockExamResult.findFirst({
        where: { userId },
        orderBy: { takenAt: 'desc' },
        select: { takenAt: true, percentile: true },
      }),
    ]);

    const attemptCount = attempts.length;
    const correctCount = attempts.filter((a) => a.isCorrect).length;
    const accuracyPct = attemptCount > 0
      ? Math.round((correctCount / attemptCount) * 100)
      : 0;

    // Time spent — sum study session durations. Falls back to attempt
    // durations when sessions didn't capture (older clients).
    const sessionSec = studySessions.reduce((s, x) => s + (x.durationSec ?? 0), 0);
    const attemptSec = attempts.reduce((s, x) => s + (x.durationSec ?? 0), 0);
    const totalSec = sessionSec > 0 ? sessionSec : attemptSec;
    const totalMinutes = Math.round(totalSec / 60);
    // One decimal place so a 20-min study session shows as 0.3h instead of
    // disappearing into a rounded-to-zero "0h" and making the user think the
    // app didn't count their work.
    const totalHours = Math.round(totalSec / 360) / 10;

    const avgMasteryScore = masterySnapshots.length > 0
      ? Math.round(
          masterySnapshots.reduce((s, m) => s + m.score, 0) / masterySnapshots.length,
        )
      : 0;
    const weakest = masterySnapshots[0] ?? null;
    const strongest = masterySnapshots[masterySnapshots.length - 1] ?? null;

    const topPercentile = latestMock
      ? Math.max(1, 100 - latestMock.percentile)
      : null;

    return {
      weekStart: week.weekStart,
      weekEnd: week.weekEnd,
      isoWeek: week.isoWeek,
      timezone: week.timezone,
      hasData: attemptCount > 0,
      attemptCount,
      masterySampleCount: masterySnapshots.length,
      problemsSolved: attemptCount,
      correctCount,
      accuracyPct,
      totalSessions: studySessions.length,
      totalMinutes,
      totalHours,
      problemsPerDay: Math.round(attemptCount / 7),
      avgMasteryScore,
      weakestUnit: weakest ? { name: weakest.unit.name, score: weakest.score } : null,
      strongestUnit: strongest ? { name: strongest.unit.name, score: strongest.score } : null,
      topPercentile,
      latestMockTakenAt: latestMock?.takenAt ?? null,
    };
  }
}
