export const MOCK_EXAM_SESSION_PREFIX = 'mathema.mock.';

const PROGRESS_VERSION = 2 as const;

export type MockExamProgressProblem = {
  id: string;
  steps: Array<{
    stepIndex: number;
    choices: Array<{ id: string }>;
  }>;
};

export type MockExamStepFeedback = {
  isCorrect: boolean;
  choice: {
    isCorrect: boolean;
    text: string;
    rationale: string | null;
    distractorType: string | null;
  } | null;
};

export type MockExamProgress = {
  version: typeof PROGRESS_VERSION;
  resultId: string;
  userId: string;
  problemIdx: number;
  stepIdx: number;
  problemId: string;
  stepIndex: number;
  pickedId: string | null;
  feedback: MockExamStepFeedback | null;
  updatedAt: number;
};

export function mockExamProgressKey(resultId: string): string {
  return `${MOCK_EXAM_SESSION_PREFIX}${resultId}.progress`;
}

export function isMockExamSessionForUser(
  value: unknown,
  resultId: string,
  userId: string,
): value is { resultId: string; userId: string } {
  return isRecord(value)
    && value.resultId === resultId
    && value.userId === userId;
}

export function clearMockExamResult(
  storage: Pick<Storage, 'removeItem'>,
  resultId: string,
): void {
  if (!resultId) return;
  storage.removeItem(`${MOCK_EXAM_SESSION_PREFIX}${resultId}`);
  storage.removeItem(mockExamProgressKey(resultId));
}

export function clearPendingMockExams(
  storage: Pick<Storage, 'length' | 'key' | 'removeItem'>,
): void {
  const keys: string[] = [];
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (key?.startsWith(MOCK_EXAM_SESSION_PREFIX)) keys.push(key);
  }
  keys.forEach((key) => storage.removeItem(key));
}

export function buildMockExamProgress(
  resultId: string,
  userId: string,
  problems: readonly MockExamProgressProblem[],
  problemIdx: number,
  stepIdx: number,
  pickedId: string | null,
  feedback: MockExamStepFeedback | null,
  updatedAt = Date.now(),
): MockExamProgress | null {
  if (!resultId || !userId || !Number.isInteger(problemIdx) || !Number.isInteger(stepIdx)) return null;

  const problem = problems[problemIdx];
  const step = problem?.steps[stepIdx];
  if (!problem || !step) return null;

  if (pickedId !== null && !step.choices.some((choice) => choice.id === pickedId)) return null;
  if (feedback !== null && (pickedId === null || !isStepFeedback(feedback))) return null;
  if (!Number.isFinite(updatedAt) || updatedAt < 0) return null;

  return {
    version: PROGRESS_VERSION,
    resultId,
    userId,
    problemIdx,
    stepIdx,
    problemId: problem.id,
    stepIndex: step.stepIndex,
    pickedId,
    feedback,
    updatedAt,
  };
}

export function parseMockExamProgress(
  raw: string | null,
  resultId: string,
  userId: string,
  problems: readonly MockExamProgressProblem[],
): MockExamProgress | null {
  if (!raw) return null;

  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!isRecord(value)
    || value.version !== PROGRESS_VERSION
    || value.resultId !== resultId
    || value.userId !== userId
    || !Number.isInteger(value.problemIdx)
    || !Number.isInteger(value.stepIdx)
    || typeof value.problemId !== 'string'
    || !Number.isInteger(value.stepIndex)
    || !(value.pickedId === null || typeof value.pickedId === 'string')
    || !(value.feedback === null || isStepFeedback(value.feedback))
    || typeof value.updatedAt !== 'number') {
    return null;
  }

  const progress = buildMockExamProgress(
    resultId,
    userId,
    problems,
    value.problemIdx as number,
    value.stepIdx as number,
    value.pickedId as string | null,
    value.feedback as MockExamStepFeedback | null,
    value.updatedAt,
  );

  if (!progress
    || progress.problemId !== value.problemId
    || progress.stepIndex !== value.stepIndex) {
    return null;
  }

  return progress;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStepFeedback(value: unknown): value is MockExamStepFeedback {
  if (!isRecord(value) || typeof value.isCorrect !== 'boolean') return false;
  if (value.choice === null) return true;
  if (!isRecord(value.choice)
    || typeof value.choice.isCorrect !== 'boolean'
    || typeof value.choice.text !== 'string'
    || !(value.choice.rationale === null || typeof value.choice.rationale === 'string')
    || !(value.choice.distractorType === null || typeof value.choice.distractorType === 'string')) {
    return false;
  }

  return value.choice.isCorrect === value.isCorrect;
}
