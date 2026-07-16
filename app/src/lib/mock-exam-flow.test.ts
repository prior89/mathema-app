import { describe, expect, it } from 'vitest';
import type { ExamPackage } from './mutations';
import { buildRecommendedExamLaunch } from './mock-exam-flow';

const playable: ExamPackage = {
  resultId: 'result/with space',
  name: 'AI-tailored Mock',
  type: 'RECOMMENDED',
  totalMinutes: 50,
  problems: [
    {
      id: 'problem-1',
      source: 'KR',
      difficulty: 'MEDIUM',
      body: '2 + 2 = ?',
      formula: null,
      hint: null,
      imageUrl: null,
      steps: [
        {
          id: 'step-1',
          stepIndex: 1,
          stepType: 'ANSWER',
          prompt: 'Choose the answer.',
          choices: [
            { id: 'choice-1', choiceIndex: 0, text: '4' },
            { id: 'choice-2', choiceIndex: 1, text: '5' },
          ],
        },
      ],
    },
  ],
};

describe('buildRecommendedExamLaunch', () => {
  it('routes a playable backend package into the Test-origin mock player', () => {
    expect(buildRecommendedExamLaunch(playable)).toEqual({
      path: '/app/mocks/play/result%2Fwith%20space',
      state: {
        resultId: 'result/with space',
        name: 'AI-tailored Mock',
        totalMinutes: 50,
        problems: playable.problems,
        origin: 'test',
        examKind: 'recommended',
      },
    });
  });

  it('does not open the player when the backend cannot create a result', () => {
    expect(buildRecommendedExamLaunch({ ...playable, resultId: null })).toBeNull();
  });

  it('does not open an empty exam', () => {
    expect(buildRecommendedExamLaunch({ ...playable, problems: [] })).toBeNull();
  });

  it.each([
    ['missing steps', undefined],
    ['empty steps', []],
  ])('does not open an exam with %s', (_label, steps) => {
    expect(buildRecommendedExamLaunch({
      ...playable,
      problems: [{ ...playable.problems[0], steps }],
    })).toBeNull();
  });

  it('does not open an exam when any step has no choices', () => {
    const steps = playable.problems[0].steps!;
    expect(buildRecommendedExamLaunch({
      ...playable,
      problems: [{
        ...playable.problems[0],
        steps: [{ ...steps[0], choices: [] }],
      }],
    })).toBeNull();
  });

  it('rejects the whole server session when only one problem is unplayable', () => {
    expect(buildRecommendedExamLaunch({
      ...playable,
      problems: [
        playable.problems[0],
        { ...playable.problems[0], id: 'problem-2', steps: [] },
      ],
    })).toBeNull();
  });
});
