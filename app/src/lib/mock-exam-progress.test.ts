import { describe, expect, it } from 'vitest';
import {
  buildMockExamProgress,
  clearPendingMockExams,
  isMockExamSessionForUser,
  mockExamProgressKey,
  parseMockExamProgress,
  type MockExamProgressProblem,
  type MockExamStepFeedback,
} from './mock-exam-progress';

const problems: MockExamProgressProblem[] = [
  {
    id: 'problem-1',
    steps: [
      {
        stepIndex: 1,
        choices: [{ id: 'choice-1' }, { id: 'choice-2' }],
      },
      {
        stepIndex: 2,
        choices: [{ id: 'choice-3' }, { id: 'choice-4' }],
      },
    ],
  },
];

const feedback: MockExamStepFeedback = {
  isCorrect: false,
  choice: {
    isCorrect: false,
    text: '1',
    rationale: 'Subtract one from both sides.',
    distractorType: 'CALC_ERROR',
  },
};

describe('mock-exam progress checkpoint', () => {
  it('restores a submitted step with its exact result, position, choice, and feedback', () => {
    const checkpoint = buildMockExamProgress(
      'result-1',
      'student-1',
      problems,
      0,
      0,
      'choice-1',
      feedback,
      1234,
    );

    expect(parseMockExamProgress(JSON.stringify(checkpoint), 'result-1', 'student-1', problems)).toEqual(checkpoint);
    expect(mockExamProgressKey('result-1')).toBe('mathema.mock.result-1.progress');
  });

  it('restores an unsubmitted selection without manufacturing feedback', () => {
    const checkpoint = buildMockExamProgress(
      'result-1',
      'student-1',
      problems,
      0,
      1,
      'choice-3',
      null,
      1234,
    );

    expect(parseMockExamProgress(JSON.stringify(checkpoint), 'result-1', 'student-1', problems)).toMatchObject({
      problemIdx: 0,
      stepIdx: 1,
      problemId: 'problem-1',
      stepIndex: 2,
      pickedId: 'choice-3',
      feedback: null,
    });
  });

  it.each([
    ['another result', { resultId: 'result-2' }],
    ['another user', { userId: 'student-2' }],
    ['another problem identity', { problemId: 'problem-2' }],
    ['another backend step identity', { stepIndex: 99 }],
    ['out-of-range problem', { problemIdx: 1 }],
    ['choice outside the current step', { pickedId: 'choice-4' }],
    ['unknown schema version', { version: 99 }],
  ])('rejects a checkpoint for %s', (_label, override) => {
    const checkpoint = buildMockExamProgress(
      'result-1',
      'student-1',
      problems,
      0,
      0,
      'choice-1',
      feedback,
      1234,
    );

    expect(parseMockExamProgress(
      JSON.stringify({ ...checkpoint, ...override }),
      'result-1',
      'student-1',
      problems,
    )).toBeNull();
  });

  it('rejects corrupted JSON and feedback that disagrees with the server result', () => {
    expect(parseMockExamProgress('{broken', 'result-1', 'student-1', problems)).toBeNull();

    const checkpoint = buildMockExamProgress(
      'result-1',
      'student-1',
      problems,
      0,
      0,
      'choice-1',
      feedback,
      1234,
    );
    expect(parseMockExamProgress(JSON.stringify({
      ...checkpoint,
      feedback: { ...feedback, isCorrect: true },
    }), 'result-1', 'student-1', problems)).toBeNull();
  });

  it('rejects another account session and progress even when the result id matches', () => {
    expect(isMockExamSessionForUser(
      { resultId: 'result-1', userId: 'student-1' },
      'result-1',
      'student-2',
    )).toBe(false);

    const checkpoint = buildMockExamProgress(
      'result-1',
      'student-1',
      problems,
      0,
      0,
      'choice-1',
      feedback,
      1234,
    );
    expect(parseMockExamProgress(
      JSON.stringify(checkpoint),
      'result-1',
      'student-2',
      problems,
    )).toBeNull();
  });

  it('clears only mathema.mock snapshots and leaves unrelated app data untouched', () => {
    const values = new Map<string, string>([
      ['mathema.mock.result-1', 'session'],
      ['mathema.mock.result-1.progress', 'progress'],
      ['mathema.mock.result-2', 'session'],
      ['mathema.realexam.result-3', 'real-session'],
      ['mathema.access', 'token'],
      ['mathema.mockery.setting', 'unrelated'],
    ]);
    const storage = {
      get length() { return values.size; },
      key: (index: number) => [...values.keys()][index] ?? null,
      removeItem: (key: string) => { values.delete(key); },
    };

    clearPendingMockExams(storage);

    expect([...values.entries()]).toEqual([
      ['mathema.realexam.result-3', 'real-session'],
      ['mathema.access', 'token'],
      ['mathema.mockery.setting', 'unrelated'],
    ]);
  });
});
