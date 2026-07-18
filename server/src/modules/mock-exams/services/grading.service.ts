import { Injectable, NotFoundException } from '@nestjs/common';
import { MockExamType, Prisma, StepType } from '@prisma/client';
import { calcGrade, calcPercentile } from '../../../common/utils/grade-calculator.util';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';

/**
 * Single source of truth for mock-exam scoring. Used by:
 *   - POST /mock-exams/results/:id/submit   (legacy batch submit)
 *   - POST /mock-exams/results/:id/finalize (per-step submit then finalize)
 *
 * Scoring rules:
 *   - Staged exams grant credit only after every actual ProblemStep was
 *     submitted and every submitted row for those steps is correct.
 *   - REAL exams grade only the single canonical ANSWER ProblemStep.
 *   - score = round(correctProblems / totalProblems * 100); totalProblems
 *     uses the immutable MockExam.problemIds allowlist captured at start.
 *   - REAL exams use the configured full-paper marking rule: +4 per correct
 *     problem, -1 per wrong, 0 per unattempted. The stored score stays on
 *     the 0-100 scale (marks normalised against maxMarks, floored at 0) so
 *     grade/percentile tables and trajectory charts keep working unchanged.
 *   - grade + percentile come from grade-calculator's table — earlier inline
 *     thresholds in finalize() drifted out of sync (e.g. 96 vs 92 for grade 1).
 */
@Injectable()
export class GradingService {
  constructor(private readonly prisma: PrismaService) {}

  async grade(
    userId: string,
    resultId: string,
    _dto: any,
    tx?: Prisma.TransactionClient,
  ) {
    const db = tx ?? this.prisma;
    const result = await db.mockExamResult.findFirst({
      where: { id: resultId, userId },
      select: {
        mockExam: {
          select: { totalProblems: true, type: true, problemIds: true },
        },
      },
    });
    if (!result) throw new NotFoundException('Mock exam result not found');

    const offeredProblemIds = [...new Set(result.mockExam.problemIds)];
    const attempts = await db.attempt.findMany({
      where: {
        userId,
        mockExamResultId: resultId,
        ...(offeredProblemIds.length > 0
          ? { problemId: { in: offeredProblemIds } }
          : {}),
      },
    });

    // Empty allowlists only exist on already-closed legacy results. They can
    // still be replayed for a response, but a new/open result is rejected by
    // MockExamsService before grading.
    const scoredProblemIds = offeredProblemIds.length > 0
      ? offeredProblemIds
      : [...new Set(attempts.map((attempt) => attempt.problemId))];
    const requiredSteps = scoredProblemIds.length > 0
      ? await db.problemStep.findMany({
          where: { problemId: { in: scoredProblemIds } },
          select: { problemId: true, stepIndex: true, stepType: true },
        })
      : [];

    type StepOutcome = { submitted: boolean; allCorrect: boolean };
    const outcomeByProblem = new Map<string, Map<number, StepOutcome>>();
    for (const attempt of attempts) {
      if (attempt.stepIndex === null) continue;
      const problem = outcomeByProblem.get(attempt.problemId) ?? new Map<number, StepOutcome>();
      const step = problem.get(attempt.stepIndex) ?? { submitted: false, allCorrect: true };
      step.submitted = true;
      // Legacy duplicates are deliberately conservative: one wrong row keeps
      // the canonical step wrong even if a later duplicate is correct.
      step.allCorrect = step.allCorrect && attempt.isCorrect;
      problem.set(attempt.stepIndex, step);
      outcomeByProblem.set(attempt.problemId, problem);
    }

    const requiredByProblem = new Map<string, Array<{ stepIndex: number; stepType: StepType }>>();
    for (const step of requiredSteps) {
      const problem = requiredByProblem.get(step.problemId) ?? [];
      problem.push(step);
      requiredByProblem.set(step.problemId, problem);
    }

    let correctCount = 0;
    let attemptedTotal = 0;
    const isReal = result.mockExam.type === MockExamType.REAL;
    for (const problemId of scoredProblemIds) {
      const actualSteps = requiredByProblem.get(problemId) ?? [];
      const required = isReal
        ? actualSteps.filter((step) => step.stepType === StepType.ANSWER)
        : actualSteps;
      // REAL has exactly one canonical ANSWER step. Any malformed problem
      // (zero or multiple ANSWER steps) fails closed and cannot gain credit.
      if (required.length === 0 || (isReal && required.length !== 1)) continue;

      const submitted = outcomeByProblem.get(problemId);
      const hasRelevantAttempt = required.some((step) =>
        submitted?.get(step.stepIndex)?.submitted === true,
      );
      if (hasRelevantAttempt) attemptedTotal += 1;

      const completeAndCorrect = required.every((step) => {
        const outcome = submitted?.get(step.stepIndex);
        return outcome?.submitted === true && outcome.allCorrect;
      });
      if (completeAndCorrect) correctCount += 1;
    }

    const totalProblems = offeredProblemIds.length > 0
      ? offeredProblemIds.length
      : Math.max(result.mockExam.totalProblems, 1);
    const wrongCount = attemptedTotal - correctCount;
    const marks = isReal ? 4 * correctCount - wrongCount : null;
    const maxMarks = isReal ? 4 * totalProblems : null;

    const score = isReal
      ? Math.round((Math.max(0, marks!) / maxMarks!) * 100)
      : Math.round((correctCount / totalProblems) * 100);
    // Never trust dto.totalScore. Scores are derived exclusively from durable,
    // owner-scoped Attempt rows; an empty paper is a real zero.
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
      marks,
      maxMarks,
      wrongCount: isReal ? wrongCount : null,
      unattemptedCount: isReal ? totalProblems - attemptedTotal : null,
    };
  }
}
