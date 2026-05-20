import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activity: ActivityService,
  ) {}

  async summary(userId: string) {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const todayAct = await this.prisma.dailyActivity.findUnique({
      where: { userId_date: { userId, date: today } },
    });

    const streak = await this.activity.streak(userId);

    // 이번 주 (D-7 ~ now) vs 지난 주 (D-14 ~ D-7) 정답률 비교
    const now = new Date();
    const w1Start = new Date(now); w1Start.setDate(w1Start.getDate() - 7);
    const w2Start = new Date(now); w2Start.setDate(w2Start.getDate() - 14);

    const [thisWeek, lastWeek] = await Promise.all([
      this.prisma.attempt.findMany({ where: { userId, createdAt: { gte: w1Start } } }),
      this.prisma.attempt.findMany({ where: { userId, createdAt: { gte: w2Start, lt: w1Start } } }),
    ]);
    const accuracy = (xs: { isCorrect: boolean }[]) =>
      xs.length === 0 ? 0 : Math.round((xs.filter((a) => a.isCorrect).length / xs.length) * 100);
    const weeklyAccuracy = accuracy(thisWeek);
    const lastWeeklyAccuracy = accuracy(lastWeek);
    const weeklyAccuracyDelta = lastWeek.length === 0 ? 0 : weeklyAccuracy - lastWeeklyAccuracy;

    // 예상 등급 — 모의고사 응시 0건이면 null (frontend 가 "—" 로 표시).
    // 이전엔 시험 안 본 신규 사용자에게도 fake "3등급" 이 보였음.
    // Exclude Study's chapter tests (MockExam.type === 'MINI') — they're a
    // learning tool, not exam scores, and would otherwise dominate the
    // "expected grade" signal for any user who has practiced more than
    // they've sat real mocks.
    const recentResults = await this.prisma.mockExamResult.findMany({
      where: { userId, mockExam: { type: { not: 'MINI' } } },
      orderBy: { takenAt: 'desc' },
      take: 2,
    });
    // Only show a "from → to" delta when there are at least 2 mock results.
    // Falling back to `expectedGrade` itself produced a flat "X → X" UI for
    // brand-new users with a single result — misleading and worse than "—".
    const expectedGrade: number | null = recentResults[0]?.grade ?? null;
    const expectedGradeFrom: number | null = recentResults[1]?.grade ?? null;

    return {
      todayMinutes: todayAct?.durationMin ?? 0,
      todayGoalMinutes: 180,
      streakDays: streak.days,
      weeklyAccuracy,
      weeklyAccuracyDelta,
      expectedGrade,
      expectedGradeFrom,
    };
  }

  /**
   * Per-chapter progress + accuracy for the current user.
   *
   * "progress" = problems attempted / total problems in the chapter (0-1).
   * "accuracy" = correct attempts / total attempts (0-1).
   *
   * Returns chapters where the user has at least one attempt, sorted by
   * recent activity descending. Capped at 10 rows so the Home dashboard
   * stays glanceable.
   */
  async chapterProgress(userId: string) {
    const rows = await this.prisma.$queryRawUnsafe<Array<{
      chapter_code: string;
      title_en: string;
      ncert_class: string;
      chapter_number: number;
      problems_total: bigint;
      problems_attempted: bigint;
      total_attempts: bigint;
      correct_attempts: bigint;
      last_attempt_at: Date | null;
      next_problem_id: string | null;
    }>>(
      // Only count problems that actually have a first ProblemStep — those are
      // the ones ConceptLessonsService.practiceProblems exposes to the UI.
      // Without this guard a problem can be mapped to a chapter (Problem.conceptLessonId)
      // yet be unreachable (no ProblemStep rows), making the card stick at e.g.
      // 6/7 = 86% forever while the student already solved every reachable one.
      //
      // Attempt counting is scoped to context IN ('STUDY', 'PRACTICE'): the
      // chapter card represents *learning* progress, not mock-exam or
      // diagnostic performance. An EXAM attempt on a chapter problem leaves
      // the chapter card untouched (next_problem_id still treats that
      // problem as un-tried so the user gets to "first-encounter" it in
      // the lesson flow), and the accuracy figure won't be diluted by a
      // diagnostic where the student was guessing.
      //
      // next_problem_id resolves to the first reachable problem in this chapter
      // that this user has never attempted in a learning context — used by
      // the Home → Chapter progress card to deep-link with ?problemId=<id>
      // straight into the next question instead of restarting from problem 1.
      // Returns NULL when every reachable problem has been attempted under
      // STUDY/PRACTICE (chapter is 100%).
      `SELECT cl."chapterCode"    AS chapter_code,
              cl."titleEn"        AS title_en,
              cl."ncertClass"     AS ncert_class,
              cl."chapterNumber"  AS chapter_number,
              COUNT(DISTINCT p.id)                                                AS problems_total,
              COUNT(DISTINCT CASE WHEN a.id IS NOT NULL THEN p.id END)            AS problems_attempted,
              COUNT(a.id)                                                         AS total_attempts,
              SUM(CASE WHEN a."isCorrect" THEN 1 ELSE 0 END)                      AS correct_attempts,
              MAX(a."createdAt")                                                  AS last_attempt_at,
              (
                SELECT p2.id FROM "Problem" p2
                WHERE p2."conceptLessonId" = cl.id
                  AND EXISTS (
                    SELECT 1 FROM "ProblemStep" ps2
                    WHERE ps2."problemId" = p2.id AND ps2."stepIndex" = 1
                  )
                  AND NOT EXISTS (
                    SELECT 1 FROM "Attempt" a2
                    WHERE a2."problemId" = p2.id
                      AND a2."userId" = $1
                      AND a2."context" IN ('STUDY', 'PRACTICE')
                  )
                ORDER BY p2.source ASC
                LIMIT 1
              )                                                                    AS next_problem_id
       FROM "ConceptLesson" cl
       LEFT JOIN "Problem"   p ON p."conceptLessonId" = cl.id
                              AND EXISTS (
                                SELECT 1 FROM "ProblemStep" ps
                                WHERE ps."problemId" = p.id AND ps."stepIndex" = 1
                              )
       LEFT JOIN "Attempt"   a ON a."problemId" = p.id
                              AND a."userId" = $1
                              AND a."context" IN ('STUDY', 'PRACTICE')
       GROUP BY cl.id, cl."chapterCode", cl."titleEn", cl."ncertClass", cl."chapterNumber"
       HAVING COUNT(a.id) > 0
       ORDER BY MAX(a."createdAt") DESC NULLS LAST
       LIMIT 10`,
      userId,
    );

    return rows.map((r) => {
      const problemsTotal = Number(r.problems_total);
      const problemsAttempted = Number(r.problems_attempted);
      const totalAttempts = Number(r.total_attempts);
      const correctAttempts = Number(r.correct_attempts);
      return {
        chapterCode: r.chapter_code,
        titleEn: r.title_en,
        ncertClass: r.ncert_class,
        chapterNumber: r.chapter_number,
        problemsTotal,
        problemsAttempted,
        totalAttempts,
        correctAttempts,
        progress: problemsTotal > 0 ? problemsAttempted / problemsTotal : 0,
        accuracy: totalAttempts > 0 ? correctAttempts / totalAttempts : 0,
        lastAttemptAt: r.last_attempt_at?.toISOString() ?? null,
        nextProblemId: r.next_problem_id,
      };
    });
  }
}
