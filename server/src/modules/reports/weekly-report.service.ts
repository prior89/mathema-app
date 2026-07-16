import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CountryCode, ErrorPatternStatus, SubscriptionStatus, UserRole } from '@prisma/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { getCurrentWeek } from '../../common/utils/iso-week.util';

interface ReportConceptName {
  name: string;
  nameKo?: string | null;
}

interface WeeklyMasteryEventEvidence {
  id: string;
  conceptId: string;
  masteryScore: number;
  delta: number;
  evidenceCount: number;
  createdAt: Date;
  concept: ReportConceptName;
}

interface WeeklyConceptMastery {
  conceptId: string;
  masteryScore: number;
  evidenceCount: number;
  netDelta: number;
  concept: ReportConceptName;
}

/**
 * WeeklyReportService — 명세서 §4 Flow 9.
 *
 *   매주 자동 생성. 입력:
 *     - 해당 주 Session / Attempt
 *     - MasteryTrajectory 변화 (MasteryEvent 시계열)
 *     - ErrorPatternProfile 변화
 *     - RecommendationLog 결과
 *     - Feedback (선택)
 *
 *   출력 3종:
 *     - studentSummary  : 긍정적 코칭, 잘한 점 + 다음 목표 1개
 *     - parentSummary   : 학습량 + 집중 시간 + 다음 주 관리 포인트
 *     - teacherSummary  : 진단 + 추천 보충 문제 + 개입 포인트 + 신뢰도
 *
 *   PoC 단계: 룰 기반 텍스트 생성 (LLM 미사용, 빠르고 결정론적).
 *   Phase 후속: LLM 으로 narrative tone 강화.
 *
 *   호출처: cron / 수동 API (POST /weekly-reports/generate).
 */

@Injectable()
export class WeeklyReportService {
  private readonly logger = new Logger(WeeklyReportService.name);
  private scheduledGenerationRunning = false;

  constructor(private readonly prisma: PrismaService) {}

  /**
   * 한 사용자의 한 주 리포트 upsert (멱등). week='2026-W19' 형식.
   * 명시되지 않으면 이번 주 (월요일 시작).
   */
  async generate(userId: string, opts: { weekStart?: Date } = {}) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { tenantId: true, country: true },
    });
    if (!user) throw new Error(`user not found: ${userId}`);

    const { weekStart, weekEnd, calendarWeekStart, calendarWeekEnd, isoWeek } = getCurrentWeek(
      user.country,
      opts.weekStart ?? new Date(),
    );

    const [attempts, sessions, masteryEvents, errorPatterns, recommendations] = await Promise.all([
      this.prisma.attempt.findMany({
        where: { userId, createdAt: { gte: weekStart, lt: weekEnd } },
        include: { problem: { select: { difficultyLevel: true, source: true } } },
      }),
      this.prisma.studySession.findMany({
        where: { userId, startedAt: { gte: weekStart, lt: weekEnd } },
      }),
      this.prisma.masteryEvent.findMany({
        where: { userId, createdAt: { gte: weekStart, lt: weekEnd } },
        select: {
          id: true,
          conceptId: true,
          masteryScore: true,
          delta: true,
          evidenceCount: true,
          createdAt: true,
          concept: { select: { name: true, nameKo: true } },
        },
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      }),
      this.prisma.errorPatternProfile.findMany({
        where: { userId, updatedAt: { gte: weekStart, lt: weekEnd } },
        include: { concept: { select: { id: true, name: true, nameKo: true } } },
        orderBy: { recentFrequency: 'desc' },
      }),
      this.prisma.recommendationLog.findMany({
        where: { userId, createdAt: { gte: weekStart, lt: weekEnd } },
      }),
    ]);

    // 통계 집계
    const totalAttempts = attempts.length;
    const correctCount = attempts.filter((a) => a.isCorrect).length;
    const averageAccuracyPct =
      totalAttempts === 0 ? 0 : Math.round((correctCount / totalAttempts) * 100);
    const totalDurationSec = sessions.reduce((s, x) => s + (x.durationSec ?? 0), 0);
    const averageStudyDurationSec =
      sessions.length === 0 ? 0 : Math.round(totalDurationSec / sessions.length);
    const totalHours = Math.round((totalDurationSec / 3600) * 10) / 10;

    // Use only immutable events from the report week. Reading the current
    // MasteryTrajectory here would let a retry for last week absorb this
    // week's attempts and silently rewrite the historical report.
    const weeklyMastery = this.summarizeWeeklyMasteryEvents(masteryEvents);
    const topImprovedConcepts: string[] = weeklyMastery
      .filter((m) => m.netDelta > 3)
      .sort(
        (a, b) =>
          b.netDelta - a.netDelta ||
          b.masteryScore - a.masteryScore ||
          a.conceptId.localeCompare(b.conceptId),
      )
      .slice(0, 3)
      .map((m) => m.conceptId);
    const weakConcepts: string[] = weeklyMastery
      .filter((m) => m.masteryScore < 60 && m.evidenceCount >= 3)
      .sort((a, b) => a.masteryScore - b.masteryScore || a.conceptId.localeCompare(b.conceptId))
      .slice(0, 3)
      .map((m) => m.conceptId);
    const repeatedErrorPatterns: string[] = errorPatterns
      .filter((e) => e.status === ErrorPatternStatus.ACTIVE)
      .slice(0, 5)
      .map((e) => e.id);

    // 추천 효과
    const accepted = recommendations.filter((r) => r.accepted).length;
    const solved = recommendations.filter((r) => r.solved).length;
    const recommendationAcceptRate =
      recommendations.length === 0 ? 0 : Math.round((accepted / recommendations.length) * 100);

    // 다음 주 목표 — 가장 약한 1~3 concept + ACTIVE error pattern 1개.
    const recommendedNextGoals = this.buildNextGoals(weeklyMastery, errorPatterns, user.country);

    // 3종 summary (룰 기반)
    const conceptNameMap = new Map(
      weeklyMastery.map((m) => [m.conceptId, this.localizeConceptName(m.concept, user.country)]),
    );
    const studentSummary = this.buildStudentSummary(
      {
        totalAttempts,
        averageAccuracyPct,
        improvedNames: topImprovedConcepts.map((id) => conceptNameMap.get(id) ?? ''),
        weakNames: weakConcepts.map((id) => conceptNameMap.get(id) ?? ''),
        nextGoal: recommendedNextGoals[0] ?? null,
      },
      user.country,
    );
    const parentSummary = this.buildParentSummary(
      {
        totalSessions: sessions.length,
        averageStudyDurationSec,
        totalAttempts,
        averageAccuracyPct,
        weakNames: weakConcepts.map((id) => conceptNameMap.get(id) ?? ''),
        repeatedPatternCount: repeatedErrorPatterns.length,
      },
      user.country,
    );
    const teacherSummary = this.buildTeacherSummary(
      {
        totalAttempts,
        averageAccuracyPct,
        weakConcepts: weakConcepts.map((id) => ({ id, name: conceptNameMap.get(id) ?? '' })),
        activeErrorPatterns: errorPatterns
          .filter((e) => e.status === ErrorPatternStatus.ACTIVE)
          .map((e) => ({
            errorCode: e.errorCode,
            conceptName: this.localizeConceptName(e.concept, user.country),
            severity: e.severity,
          })),
        recommendations: {
          total: recommendations.length,
          accepted,
          solved,
          acceptRate: recommendationAcceptRate,
        },
      },
      user.country,
    );

    return this.prisma.weeklyReport.upsert({
      where: { userId_isoWeek: { userId, isoWeek } },
      update: {
        weekStart: calendarWeekStart,
        weekEnd: calendarWeekEnd,
        totalHours,
        problemsSolved: totalAttempts,
        accuracyPct: averageAccuracyPct,
        aiScore: this.computeAiScore({
          totalAttempts,
          averageAccuracyPct,
          sessions: sessions.length,
        }),
        mentorMessage: studentSummary,
        studentSummary,
        parentSummary,
        teacherSummary,
        topImprovedConcepts,
        weakConcepts,
        repeatedErrorPatterns,
        totalSessions: sessions.length,
        totalAttempts,
        averageStudyDurationSec,
        recommendedNextGoals,
        generatedAt: new Date(),
        tenantId: user.tenantId,
      },
      create: {
        userId,
        tenantId: user.tenantId,
        isoWeek,
        weekStart: calendarWeekStart,
        weekEnd: calendarWeekEnd,
        totalHours,
        problemsSolved: totalAttempts,
        accuracyPct: averageAccuracyPct,
        aiScore: this.computeAiScore({
          totalAttempts,
          averageAccuracyPct,
          sessions: sessions.length,
        }),
        mentorMessage: studentSummary,
        studentSummary,
        parentSummary,
        teacherSummary,
        topImprovedConcepts,
        weakConcepts,
        repeatedErrorPatterns,
        totalSessions: sessions.length,
        totalAttempts,
        averageStudyDurationSec,
        recommendedNextGoals,
      },
    });
  }

  /**
   * Materialise the last completed week for active students.
   *
   * This runs daily so a transient failure is retried for the rest of the
   * week. Reports generated during the week are refreshed once the week has
   * ended; only a report generated at or after the local week end is treated
   * as final. The unique (userId, isoWeek) key and generate() upsert are the
   * final concurrency/idempotency backstop across multiple app replicas.
   */
  @Cron('0 30 1 * * *', {
    name: 'weekly-report-generation',
    timeZone: 'Asia/Kolkata',
  })
  async generateCompletedWeekReports(now: Date = new Date()): Promise<{
    skipped: boolean;
    candidates: number;
    generated: number;
    failed: number;
  }> {
    if (this.scheduledGenerationRunning) {
      return { skipped: true, candidates: 0, generated: 0, failed: 0 };
    }

    this.scheduledGenerationRunning = true;
    let candidates = 0;
    let generated = 0;
    let failed = 0;
    // 01:30 India time is 05:00 Korea time. Seven days ago is therefore
    // inside the last fully-completed local ISO week for both launch markets.
    const previousWeekReference = new Date(now.getTime() - 7 * 86_400_000);

    try {
      for (const country of Object.values(CountryCode)) {
        const week = getCurrentWeek(country, previousWeekReference);
        const users = await this.prisma.user.findMany({
          where: {
            country,
            role: UserRole.STUDENT,
            deletedAt: null,
            weeklyReports: {
              none: {
                isoWeek: week.isoWeek,
                generatedAt: { gte: week.weekEnd },
              },
            },
            OR: [
              { attempts: { some: { createdAt: { gte: week.weekStart, lt: week.weekEnd } } } },
              { studySessions: { some: { startedAt: { gte: week.weekStart, lt: week.weekEnd } } } },
              {
                weeklyReports: {
                  some: {
                    isoWeek: week.isoWeek,
                    generatedAt: { lt: week.weekEnd },
                  },
                },
              },
              {
                subscription: {
                  is: {
                    status: {
                      in: [
                        SubscriptionStatus.ACTIVE,
                        SubscriptionStatus.GRACE,
                        SubscriptionStatus.CANCELED,
                      ],
                    },
                    expiryTime: { gt: now },
                  },
                },
              },
            ],
          },
          select: { id: true },
        });

        candidates += users.length;
        for (const user of users) {
          try {
            await this.generate(user.id, { weekStart: previousWeekReference });
            generated++;
          } catch (error) {
            failed++;
            this.logger.warn(
              `Weekly report generation failed for ${user.id} (${week.isoWeek}): ${(error as Error).message}`,
            );
          }
        }
      }

      if (candidates > 0 || failed > 0) {
        this.logger.log(
          `Weekly report generation: ${generated}/${candidates} generated, ${failed} failed`,
        );
      }
      return { skipped: false, candidates, generated, failed };
    } finally {
      this.scheduledGenerationRunning = false;
    }
  }

  private computeAiScore(s: {
    totalAttempts: number;
    averageAccuracyPct: number;
    sessions: number;
  }): number {
    if (s.totalAttempts === 0) return 0;
    const baseAccuracy = s.averageAccuracyPct / 10; // 0~10
    const volumeBonus = Math.min(2, s.totalAttempts / 30); // 30+ 문제 = +2
    const consistencyBonus = Math.min(1, s.sessions / 5); // 5+ 세션 = +1
    // The public contract is /10. Bonuses may improve a low-volume score but
    // must never produce impossible values such as 11.7/10.
    return Math.min(10, Math.round((baseAccuracy + volumeBonus + consistencyBonus) * 10) / 10);
  }

  private summarizeWeeklyMasteryEvents(
    events: WeeklyMasteryEventEvidence[],
  ): WeeklyConceptMastery[] {
    const byConcept = new Map<string, WeeklyConceptMastery>();
    const orderedEvents = [...events].sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime() || a.id.localeCompare(b.id),
    );

    for (const event of orderedEvents) {
      const existing = byConcept.get(event.conceptId);
      if (existing) {
        existing.masteryScore = event.masteryScore;
        existing.evidenceCount = event.evidenceCount;
        existing.netDelta += event.delta;
        existing.concept = event.concept;
      } else {
        byConcept.set(event.conceptId, {
          conceptId: event.conceptId,
          masteryScore: event.masteryScore,
          evidenceCount: event.evidenceCount,
          netDelta: event.delta,
          concept: event.concept,
        });
      }
    }

    return [...byConcept.values()];
  }

  private localizeConceptName(concept: ReportConceptName, country: CountryCode): string {
    if (country === CountryCode.KR && concept.nameKo?.trim()) {
      return concept.nameKo.trim();
    }
    return concept.name;
  }

  private buildNextGoals(
    mastery: WeeklyConceptMastery[],
    patterns: Array<{
      status: ErrorPatternStatus;
      concept: { name: string; nameKo?: string | null };
      errorCode: string;
    }>,
    country: CountryCode,
  ): string[] {
    const goals: string[] = [];
    const weakest = mastery
      .filter((m) => m.evidenceCount >= 3)
      .sort((a, b) => a.masteryScore - b.masteryScore || a.conceptId.localeCompare(b.conceptId))[0];
    if (weakest) {
      const conceptName = this.localizeConceptName(weakest.concept, country);
      const currentScore = Math.round(weakest.masteryScore);
      const targetScore = Math.min(100, currentScore + 10);
      goals.push(
        country === CountryCode.KR
          ? `${conceptName} 숙련도를 ${currentScore}%에서 다음 주 목표 ${targetScore}%까지 높여 보세요.`
          : `Raise ${conceptName} mastery from ${currentScore}% to ${targetScore}% next week.`,
      );
    }
    const activePattern = patterns.find((p) => p.status === ErrorPatternStatus.ACTIVE);
    if (activePattern) {
      const conceptName = this.localizeConceptName(activePattern.concept, country);
      goals.push(
        country === CountryCode.KR
          ? `${conceptName}에서 ${activePattern.errorCode} 유형 실수를 줄여 보세요. 풀이 과정을 한 단계씩 적어 보세요.`
          : `Reduce ${activePattern.errorCode} errors in ${conceptName} by writing out each solution step.`,
      );
    }
    return goals.slice(0, 3);
  }

  private buildStudentSummary(
    s: {
      totalAttempts: number;
      averageAccuracyPct: number;
      improvedNames: string[];
      weakNames: string[];
      nextGoal: string | null;
    },
    country: CountryCode,
  ): string {
    if (country === CountryCode.KR) {
      if (s.totalAttempts === 0) {
        return '이번 주 학습 기록이 아직 없어요. 문제 한 개부터 가볍게 시작해 보세요.';
      }
      const parts: string[] = [
        `이번 주에는 문제를 ${s.totalAttempts}개 풀었고 정답률은 ${s.averageAccuracyPct}%예요.`,
      ];
      if (s.improvedNames.length > 0) {
        parts.push(`${s.improvedNames[0]} 개념이 눈에 띄게 안정됐어요.`);
      }
      if (s.nextGoal) {
        parts.push(`다음 목표: ${s.nextGoal}`);
      } else if (s.weakNames.length > 0) {
        parts.push(`다음 주에는 ${s.weakNames[0]} 개념을 조금 더 연습해 보세요.`);
      }
      return parts.join(' ');
    }

    if (s.totalAttempts === 0) {
      return "No study data for this week yet. Let's start with one problem.";
    }
    const parts: string[] = [];
    const problemLabel = s.totalAttempts === 1 ? 'problem' : 'problems';
    parts.push(
      `This week, you solved ${s.totalAttempts} ${problemLabel} with ${s.averageAccuracyPct}% accuracy.`,
    );
    if (s.improvedNames.length > 0) {
      parts.push(`Your understanding of ${s.improvedNames[0]} became noticeably more stable.`);
    }
    if (s.nextGoal) {
      parts.push(`Next goal: ${s.nextGoal}`);
    } else if (s.weakNames.length > 0) {
      parts.push(`Next week: spend more time on ${s.weakNames[0]}.`);
    }
    return parts.join(' ');
  }

  private buildParentSummary(
    s: {
      totalSessions: number;
      averageStudyDurationSec: number;
      totalAttempts: number;
      averageAccuracyPct: number;
      weakNames: string[];
      repeatedPatternCount: number;
    },
    country: CountryCode,
  ): string {
    const minPerSession = Math.round(s.averageStudyDurationSec / 60);
    if (country === CountryCode.KR) {
      const parts: string[] = [
        `이번 주 학습 세션은 ${s.totalSessions}회, 세션당 평균 ${minPerSession}분입니다.`,
        `총 ${s.totalAttempts}문제를 풀었고 정답률은 ${s.averageAccuracyPct}%입니다.`,
      ];
      if (s.weakNames.length > 0) {
        parts.push(`주요 보완 개념: ${s.weakNames.join(', ')}.`);
      }
      if (s.repeatedPatternCount > 0) {
        parts.push(`현재 반복 실수 패턴 ${s.repeatedPatternCount}개가 확인됩니다.`);
      }
      return parts.join(' ');
    }

    const sessionLabel = s.totalSessions === 1 ? 'session' : 'sessions';
    const problemLabel = s.totalAttempts === 1 ? 'problem' : 'problems';
    const parts: string[] = [
      `This week: ${s.totalSessions} study ${sessionLabel}, averaging ${minPerSession} minutes each.`,
      `You solved ${s.totalAttempts} ${problemLabel} with ${s.averageAccuracyPct}% accuracy.`,
    ];
    if (s.weakNames.length > 0) {
      parts.push(`Concepts to strengthen: ${s.weakNames.join(', ')}.`);
    }
    if (s.repeatedPatternCount > 0) {
      const patternLabel = s.repeatedPatternCount === 1 ? 'pattern is' : 'patterns are';
      parts.push(`${s.repeatedPatternCount} recurring mistake ${patternLabel} currently active.`);
    }
    return parts.join(' ');
  }

  private buildTeacherSummary(
    s: {
      totalAttempts: number;
      averageAccuracyPct: number;
      weakConcepts: Array<{ id: string; name: string }>;
      activeErrorPatterns: Array<{ errorCode: string; conceptName: string; severity: string }>;
      recommendations: { total: number; accepted: number; solved: number; acceptRate: number };
    },
    country: CountryCode,
  ): string {
    if (country === CountryCode.KR) {
      const parts: string[] = [
        `이번 주 학생 정답률은 ${s.averageAccuracyPct}%입니다(총 ${s.totalAttempts}문제).`,
      ];
      if (s.weakConcepts.length > 0) {
        parts.push(`보완이 필요한 개념: ${s.weakConcepts.map((c) => c.name).join(', ')}.`);
      }
      if (s.activeErrorPatterns.length > 0) {
        const top = s.activeErrorPatterns[0];
        parts.push(`주요 오류 패턴: ${top.conceptName}의 ${top.errorCode} (${top.severity}).`);
      }
      parts.push(
        `AI 추천 ${s.recommendations.total}건(수락률 ${s.recommendations.acceptRate}%, 해결 ${s.recommendations.solved}건).`,
      );
      parts.push('오류 패턴의 심각도와 추천 수락률을 함께 확인한 뒤 교사 수정을 적용하세요.');
      return parts.join(' ');
    }

    const problemLabel = s.totalAttempts === 1 ? 'problem' : 'problems';
    const parts: string[] = [
      `Weekly accuracy: ${s.averageAccuracyPct}% across ${s.totalAttempts} ${problemLabel}.`,
    ];
    if (s.weakConcepts.length > 0) {
      parts.push(`Concepts to strengthen: ${s.weakConcepts.map((c) => c.name).join(', ')}.`);
    }
    if (s.activeErrorPatterns.length > 0) {
      const top = s.activeErrorPatterns[0];
      parts.push(
        `Primary error pattern: ${top.errorCode} in ${top.conceptName} (${top.severity}).`,
      );
    }
    parts.push(
      `AI recommendations: ${s.recommendations.total}; acceptance rate ${s.recommendations.acceptRate}%; solved ${s.recommendations.solved}.`,
    );
    parts.push(
      'Review error-pattern severity together with the recommendation acceptance rate before applying a teacher override.',
    );
    return parts.join(' ');
  }
}
