import type { ExamPackage, ExamProblem } from './mutations';

/** Navigation payload shared by every Test-tab entry into the step-by-step
 * mock player. Keeping this conversion in one place prevents a successful
 * backend session from opening the player without the `origin: test` back
 * route or without refresh-persisted problem data. */
export type RecommendedExamLaunch = {
  path: string;
  state: {
    resultId: string;
    userId: string;
    name: string;
    totalMinutes: number;
    problems: ExamProblem[];
    origin: 'test';
    examKind: 'recommended';
  };
};

/** The step-by-step player cannot advance through a problem without at least
 * one step and at least one selectable choice in every step. Rejecting the
 * whole package is intentional: filtering client-side would leave unanswered
 * problems in the server-owned result and make the final score misleading. */
export function isPlayableExamProblem(problem: ExamProblem): boolean {
  return Array.isArray(problem.steps)
    && problem.steps.length > 0
    && problem.steps.every(
      (step) => Array.isArray(step.choices) && step.choices.length > 0,
    );
}

export function buildRecommendedExamLaunch(
  exam: ExamPackage,
  userId: string,
): RecommendedExamLaunch | null {
  if (
    !exam.resultId?.trim()
    || !userId.trim()
    || !Array.isArray(exam.problems)
    || exam.problems.length === 0
    || !exam.problems.every(isPlayableExamProblem)
  ) {
    return null;
  }

  return {
    path: `/app/mocks/play/${encodeURIComponent(exam.resultId)}`,
    state: {
      resultId: exam.resultId,
      userId,
      name: exam.name,
      totalMinutes: exam.totalMinutes,
      problems: exam.problems,
      origin: 'test',
      examKind: 'recommended',
    },
  };
}
