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
    // Country-aware: KR uses KoreanConceptLesson + Problem.koreanConceptLessonId,
    // IN/그외 uses NCERT ConceptLesson + Problem.conceptLessonId. KR side
    // packs Korean grade/subject into the same response shape (titleKo in
    // titleEn slot, KoreanSubject in ncertClass slot) so the frontend
    // ChapterProgressCard renders both curricula without a type switch.
    const me = await this.prisma.user.findUnique({
      where: { id: userId }, select: { country: true },
    });
    if (me?.country === 'KR') {
      return this.chapterProgressKorean(userId);
    }

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
      // Canonical-20 scoping: when ConceptLesson.masterySetProblemIds is the
      // frozen 20, BOTH the progress count AND the next-problem deep-link
      // must restrict to that exact set — otherwise a student who attempted
      // a non-canonical problem would inflate progress to 25/20, and the
      // Home card deep-link would land on a problem id the practiceProblems
      // endpoint never returns (causing a fallback to the concept walkthrough,
      // which felt like "starting from problem 1" per user-report 2026-05-23).
      // 2026-05-29 fix (mirrors KR fix below): problems_attempted +
      // next_problem_id require stepIndex=3 (ANSWER) attempt, matching
      // attempts.service.checkAndUnlockMastery's NCERT branch. Without this
      // a student who tapped only CONCEPT/PROCESS would have the chapter
      // show "20/20" but the Mastery-unlock signal never fired and the
      // deep-link still routed back to the first unfinished problem.
      `SELECT cl."chapterCode"    AS chapter_code,
              cl."titleEn"        AS title_en,
              cl."ncertClass"     AS ncert_class,
              cl."chapterNumber"  AS chapter_number,
              COUNT(DISTINCT p.id)                                                AS problems_total,
              COUNT(DISTINCT CASE WHEN a.id IS NOT NULL AND a."stepIndex" = 3 THEN p.id END) AS problems_attempted,
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
                  AND (
                    COALESCE(array_length(cl."masterySetProblemIds", 1), 0) <> 20
                    OR p2.id = ANY(cl."masterySetProblemIds")
                  )
                  AND NOT EXISTS (
                    SELECT 1 FROM "Attempt" a2
                    WHERE a2."problemId" = p2.id
                      AND a2."userId" = $1
                      AND a2."context" IN ('STUDY', 'PRACTICE')
                      AND a2."stepIndex" = 3
                  )
                ORDER BY
                  CASE WHEN COALESCE(array_length(cl."masterySetProblemIds", 1), 0) = 20
                       THEN array_position(cl."masterySetProblemIds", p2.id)
                       ELSE NULL END ASC NULLS LAST,
                  p2.source ASC
                LIMIT 1
              )                                                                    AS next_problem_id
       FROM "ConceptLesson" cl
       LEFT JOIN "Problem"   p ON p."conceptLessonId" = cl.id
                              AND EXISTS (
                                SELECT 1 FROM "ProblemStep" ps
                                WHERE ps."problemId" = p.id AND ps."stepIndex" = 1
                              )
                              AND (
                                COALESCE(array_length(cl."masterySetProblemIds", 1), 0) <> 20
                                OR p.id = ANY(cl."masterySetProblemIds")
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
      // Cap to the Mastery 20-problem invariant: the Home card now mirrors
      // what the student actually sees in Mastery (which always exposes
      // exactly MASTERY_TARGET problems, regardless of how many sit in the
      // underlying pool). Without the cap a chapter with 54 reachable
      // problems would show "1 / 54" on Home while Mastery shows 1/20 —
      // confusing, and not how progress is judged.
      const MASTERY_CAP = 20;
      const rawTotal = Number(r.problems_total);
      const rawAttempted = Number(r.problems_attempted);
      const problemsTotal = Math.min(rawTotal, MASTERY_CAP);
      const problemsAttempted = Math.min(rawAttempted, problemsTotal);
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

  /**
   * Korean curriculum chapter-progress (parallel to NCERT chapterProgress).
   * Same response shape — titleKo packed into titleEn slot, KoreanSubject
   * label into ncertClass slot, KR grade label ("중1" / "고2 대수") computed
   * client-side from card-renderer logic. Filters mirror NCERT version:
   *   - only problems with steps.length=3 (KR 3-step Mastery seed)
   *   - only Attempt rows with context IN ('STUDY','PRACTICE')
   *   - cap problemsTotal at 20 (Mastery canonical-set invariant)
   *   - chapters with zero attempts hidden (HAVING COUNT(a.id) > 0)
   */
  private async chapterProgressKorean(userId: string) {
    const rows = await this.prisma.$queryRawUnsafe<Array<{
      chapter_code: string;
      title_ko: string;
      korean_grade: string;
      chapter_number: number;
      problems_total: bigint;
      problems_attempted: bigint;
      total_attempts: bigint;
      correct_attempts: bigint;
      last_attempt_at: Date | null;
      next_problem_id: string | null;
    }>>(
      // 2026-05-29 fix: `problems_attempted` and `next_problem_id` now
      // both require an ANSWER-step (stepIndex=3) attempt — same gate as
      // KoreanConceptLessonsService.detail and attempts.service.unlockKorean.
      // Previously the dashboard counted any attempt (CONCEPT / PROCESS too)
      // and a chapter showed "20/20 100%" while the deep-link still routed
      // to a problem whose ANSWER step the student had not seen, because
      // unlockKorean and the deep-link both checked stepIndex=3 only. The
      // mismatch also blocked Study-tab unlock (KoreanConceptProgress flag).
      `SELECT kcl."chapterCode"        AS chapter_code,
              kcl."titleKo"             AS title_ko,
              kcl."koreanGrade"::text   AS korean_grade,
              kcl."chapterNumber"       AS chapter_number,
              COUNT(DISTINCT p.id)                                                AS problems_total,
              COUNT(DISTINCT CASE WHEN a.id IS NOT NULL AND a."stepIndex" = 3 THEN p.id END) AS problems_attempted,
              COUNT(a.id)                                                         AS total_attempts,
              SUM(CASE WHEN a."isCorrect" THEN 1 ELSE 0 END)                      AS correct_attempts,
              MAX(a."createdAt")                                                  AS last_attempt_at,
              (
                SELECT p2.id FROM "Problem" p2
                WHERE p2."koreanConceptLessonId" = kcl.id
                  AND (SELECT COUNT(*) FROM "ProblemStep" ps2 WHERE ps2."problemId" = p2.id) = 3
                  AND (
                    COALESCE(array_length(kcl."masterySetProblemIds", 1), 0) <> 20
                    OR p2.id = ANY(kcl."masterySetProblemIds")
                  )
                  AND NOT EXISTS (
                    SELECT 1 FROM "Attempt" a2
                    WHERE a2."problemId" = p2.id
                      AND a2."userId" = $1
                      AND a2."context" IN ('STUDY', 'PRACTICE')
                      AND a2."stepIndex" = 3
                  )
                ORDER BY
                  CASE WHEN COALESCE(array_length(kcl."masterySetProblemIds", 1), 0) = 20
                       THEN array_position(kcl."masterySetProblemIds", p2.id)
                       ELSE NULL END ASC NULLS LAST,
                  p2."source" ASC
                LIMIT 1
              )                                                                    AS next_problem_id
       FROM "KoreanConceptLesson" kcl
       LEFT JOIN "Problem"   p ON p."koreanConceptLessonId" = kcl.id
                              AND (SELECT COUNT(*) FROM "ProblemStep" ps WHERE ps."problemId" = p.id) = 3
                              AND (
                                COALESCE(array_length(kcl."masterySetProblemIds", 1), 0) <> 20
                                OR p.id = ANY(kcl."masterySetProblemIds")
                              )
       LEFT JOIN "Attempt"   a ON a."problemId" = p.id
                              AND a."userId" = $1
                              AND a."context" IN ('STUDY', 'PRACTICE')
       GROUP BY kcl.id, kcl."chapterCode", kcl."titleKo", kcl."koreanGrade", kcl."chapterNumber"
       HAVING COUNT(a.id) > 0
       ORDER BY MAX(a."createdAt") DESC NULLS LAST
       LIMIT 10`,
      userId,
    );

    return rows.map((r) => {
      const MASTERY_CAP = 20;
      const rawTotal = Number(r.problems_total);
      const rawAttempted = Number(r.problems_attempted);
      const problemsTotal = Math.min(rawTotal, MASTERY_CAP);
      const problemsAttempted = Math.min(rawAttempted, problemsTotal);
      const totalAttempts = Number(r.total_attempts);
      const correctAttempts = Number(r.correct_attempts);
      return {
        chapterCode: r.chapter_code,
        // Pack KR title into NCERT titleEn slot — same field name lets the
        // frontend ChapterProgressCard render without a country switch.
        titleEn: r.title_ko,
        // KoreanGrade ('MIDDLE_1' / 'HIGH_2' / ...) packed in ncertClass slot.
        // The ChapterProgressCard renderer's "CLASS_" replace is a no-op for
        // these strings (so the chip shows "MIDDLE_1 · CH 1" — readable
        // although not fully localized). UI polish is a follow-up.
        ncertClass: r.korean_grade,
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
