import { Injectable } from '@nestjs/common';
import { calcGrade, calcPercentile } from '../../../common/utils/grade-calculator.util';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';

/**
 * Single source of truth for mock-exam scoring. Used by:
 *   - POST /mock-exams/results/:id/submit   (legacy batch submit)
 *   - POST /mock-exams/results/:id/finalize (per-step submit then finalize)
 *
 * Scoring rules:
 *   - Problem-level credit: a problem counts as correct iff every answered
 *     step on it was correct. A 3-step MC problem with steps 1+2 right and 3
 *     wrong scores zero, matching how real exams grade.
 *   - Single-answer (no-step) attempts count their own isCorrect directly.
 *   - score = round(correctProblems / totalProblems * 100); totalProblems
 *     prefers MockExam.totalProblems (intent at session start) but never goes
 *     below the count of distinct attempted problems, so partial sessions
 *     don't divide by a stale planned total.
 *   - grade + percentile come from grade-calculator's table — earlier inline
 *     thresholds in finalize() drifted out of sync (e.g. 96 vs 92 for grade 1).
 */
@Injectable()
export class GradingService {
  constructor(private readonly prisma: PrismaService) {}

  async grade(_userId: string, resultId: string, dto: any) {
    const [attempts, result] = await Promise.all([
      this.prisma.attempt.findMany({ where: { mockExamResultId: resultId } }),
      this.prisma.mockExamResult.findUnique({
        where: { id: resultId },
        select: { mockExam: { select: { totalProblems: true } } },
      }),
    ]);

    // Group by problemId — per-step or single-shot per problem.
    type ProblemAcc = { correctSteps: Set<number | string>; totalSteps: Set<number | string> };
    const byProblem = new Map<string, ProblemAcc>();
    for (const a of attempts) {
      const cur = byProblem.get(a.problemId) ?? { correctSteps: new Set(), totalSteps: new Set() };
      // Use stepIndex when present, a stable sentinel ('_') when single-shot,
      // so the all-steps-correct rule covers both shapes uniformly.
      const key = a.stepIndex ?? '_';
      cur.totalSteps.add(key);
      if (a.isCorrect) cur.correctSteps.add(key);
      byProblem.set(a.problemId, cur);
    }

    let correctCount = 0;
    for (const [, v] of byProblem) {
      if (v.totalSteps.size > 0 && v.correctSteps.size === v.totalSteps.size) correctCount += 1;
    }
    const attemptedTotal = byProblem.size;
    const intendedTotal = result?.mockExam?.totalProblems ?? 0;
    const totalProblems = Math.max(intendedTotal, attemptedTotal, 1);

    let score = Math.round((correctCount / totalProblems) * 100);
    // Compat: when no attempts exist (the caller is the legacy batch /submit
    // and chose to pre-compute totalScore in the dto), fall back to it.
    if (attempts.length === 0 && typeof dto?.totalScore === 'number') {
      score = dto.totalScore;
    }
    const durationMin = attempts.length > 0
      ? Math.max(1, Math.round(attempts.reduce((s, a) => s + (a.durationSec ?? 0), 0) / 60))
      : 0;

    return {
      score,
      grade: calcGrade(score),
      percentile: calcPercentile(score),
      durationMin,
      correctCount,
      totalProblems,
      attemptedProblems: attemptedTotal,
    };
  }
}
