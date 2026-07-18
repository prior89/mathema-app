import { NotFoundException } from '@nestjs/common';
import { GradingService } from './grading.service';

function build(over: {
  attempts?: any[];
  result?: any;
  steps?: any[];
} = {}) {
  const prisma = {
    attempt: {
      findMany: jest.fn().mockResolvedValue(over.attempts ?? []),
    },
    mockExamResult: {
      findFirst: jest.fn().mockResolvedValue(
        over.result === undefined
          ? { mockExam: { totalProblems: 1, type: 'RECOMMENDED', problemIds: ['p-1'] } }
          : over.result,
      ),
    },
    problemStep: {
      findMany: jest.fn().mockResolvedValue(over.steps ?? [
        { problemId: 'p-1', stepIndex: 1, stepType: 'ANSWER' },
      ]),
    },
  };
  return { service: new GradingService(prisma as never), prisma };
}

describe('Mock-exam GradingService ownership and duplicate safety', () => {
  it('scopes both result and attempts to the authenticated owner', async () => {
    const { service, prisma } = build({
      attempts: [{ problemId: 'p-1', stepIndex: 1, isCorrect: true, durationSec: 10 }],
    });

    await service.grade('student-1', 'result-1', {});

    expect(prisma.attempt.findMany).toHaveBeenCalledWith({
      where: {
        userId: 'student-1',
        mockExamResultId: 'result-1',
        problemId: { in: ['p-1'] },
      },
    });
    expect(prisma.mockExamResult.findFirst).toHaveBeenCalledWith({
      where: { id: 'result-1', userId: 'student-1' },
      select: {
        mockExam: {
          select: { totalProblems: true, type: true, problemIds: true },
        },
      },
    });
  });

  it('does not let a duplicate correct row erase a wrong answer on the same step', async () => {
    const { service } = build({
      attempts: [
        { problemId: 'p-1', stepIndex: 1, isCorrect: false, durationSec: 10 },
        { problemId: 'p-1', stepIndex: 1, isCorrect: true, durationSec: 10 },
      ],
    });

    await expect(service.grade('student-1', 'result-1', {})).resolves.toMatchObject({
      score: 0,
      correctCount: 0,
      attemptedProblems: 1,
    });
  });

  it('ignores a caller-supplied totalScore when the paper has no attempts', async () => {
    const { service } = build({ attempts: [] });

    await expect(service.grade('student-1', 'result-1', { totalScore: 100 }))
      .resolves.toMatchObject({ score: 0, correctCount: 0 });
  });

  it('rejects grading when the result is not owned by the caller', async () => {
    const { service } = build({ result: null });

    await expect(service.grade('attacker', 'result-1', {}))
      .rejects.toBeInstanceOf(NotFoundException);
  });

  it('gives no staged-exam credit when only part of the required steps were submitted', async () => {
    const { service } = build({
      attempts: [
        { problemId: 'p-1', stepIndex: 1, isCorrect: true, durationSec: 10 },
        { problemId: 'p-1', stepIndex: 2, isCorrect: true, durationSec: 10 },
      ],
      steps: [
        { problemId: 'p-1', stepIndex: 1, stepType: 'CONCEPT' },
        { problemId: 'p-1', stepIndex: 2, stepType: 'PROCESS' },
        { problemId: 'p-1', stepIndex: 3, stepType: 'ANSWER' },
      ],
    });

    await expect(service.grade('student-1', 'result-1', {})).resolves.toMatchObject({
      score: 0,
      correctCount: 0,
      attemptedProblems: 1,
    });
  });

  it('credits a staged problem only after every actual step is correct', async () => {
    const steps = [
      { problemId: 'p-1', stepIndex: 1, stepType: 'CONCEPT' },
      { problemId: 'p-1', stepIndex: 2, stepType: 'PROCESS' },
      { problemId: 'p-1', stepIndex: 3, stepType: 'ANSWER' },
    ];
    const { service } = build({
      attempts: steps.map((step) => ({ ...step, isCorrect: true, durationSec: 10 })),
      steps,
    });

    await expect(service.grade('student-1', 'result-1', {})).resolves.toMatchObject({
      score: 100,
      correctCount: 1,
      attemptedProblems: 1,
    });
  });

  it('grades REAL exams using only the single canonical ANSWER step', async () => {
    const result = {
      mockExam: { totalProblems: 1, type: 'REAL', problemIds: ['p-1'] },
    };
    const steps = [
      { problemId: 'p-1', stepIndex: 1, stepType: 'CONCEPT' },
      { problemId: 'p-1', stepIndex: 3, stepType: 'ANSWER' },
    ];
    const nonAnswerOnly = build({
      result,
      steps,
      attempts: [{ problemId: 'p-1', stepIndex: 1, isCorrect: true, durationSec: 10 }],
    });
    await expect(nonAnswerOnly.service.grade('student-1', 'result-1', {}))
      .resolves.toMatchObject({
        score: 0,
        correctCount: 0,
        attemptedProblems: 0,
        unattemptedCount: 1,
      });

    const answer = build({
      result,
      steps,
      attempts: [{ problemId: 'p-1', stepIndex: 3, isCorrect: true, durationSec: 10 }],
    });
    await expect(answer.service.grade('student-1', 'result-1', {}))
      .resolves.toMatchObject({
        score: 100,
        correctCount: 1,
        attemptedProblems: 1,
        marks: 4,
      });
  });

  it('fails a malformed REAL problem closed when it has multiple ANSWER steps', async () => {
    const { service } = build({
      result: { mockExam: { totalProblems: 1, type: 'REAL', problemIds: ['p-1'] } },
      steps: [
        { problemId: 'p-1', stepIndex: 2, stepType: 'ANSWER' },
        { problemId: 'p-1', stepIndex: 3, stepType: 'ANSWER' },
      ],
      attempts: [
        { problemId: 'p-1', stepIndex: 2, isCorrect: true, durationSec: 10 },
        { problemId: 'p-1', stepIndex: 3, isCorrect: true, durationSec: 10 },
      ],
    });

    await expect(service.grade('student-1', 'result-1', {})).resolves.toMatchObject({
      score: 0,
      correctCount: 0,
      attemptedProblems: 0,
    });
  });
});
