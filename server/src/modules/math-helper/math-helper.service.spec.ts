import { MathHelperService } from './math-helper.service';

function buildService() {
  const attempts = {
    create: jest.fn().mockResolvedValue({ id: 'attempt-1' }),
  };
  const redis = { get: jest.fn().mockResolvedValue(null), set: jest.fn().mockResolvedValue(undefined) };
  const service = new MathHelperService(
    {} as any,
    {} as any,
    attempts as any,
    {} as any,
    {} as any,
    redis as any,
  );
  (service as any).createPracticeProblem = jest.fn().mockResolvedValue('problem-1');
  return { service: service as any, attempts };
}

describe('MathHelperService.stripControlChars', () => {
  it('removes NUL runs the LLM leaks into step strings (prod repro 2026-07-13)', () => {
    const { service } = buildService();

    const poisoned = {
      answer: '6',
      steps: ['(가)에서 \u0000\u0000\u0000x\\to1일 때 분모가 0으로 갑니다.'],
      stepRationales: ['이유\u0000'],
      detected: { chapter: 'Limits\u0001' },
    };

    const clean = service.stripControlChars(poisoned);

    expect(clean.steps[0]).toBe('(가)에서 x\\to1일 때 분모가 0으로 갑니다.');
    expect(clean.stepRationales[0]).toBe('이유');
    expect(clean.detected.chapter).toBe('Limits');
  });

  it('keeps \\n and \\t and leaves non-string values untouched', () => {
    const { service } = buildService();

    const clean = service.stripControlChars({
      explanation: 'line1\nline2\tend',
      isStudentCorrect: null,
      verification: { confidence: 0.9, issues: [] },
    });

    expect(clean.explanation).toBe('line1\nline2\tend');
    expect(clean.isStudentCorrect).toBeNull();
    expect(clean.verification.confidence).toBe(0.9);
    expect(clean.verification.issues).toEqual([]);
  });
});

describe('MathHelperService.recordSolveAttempt', () => {
  it('creates a practice Problem but no Attempt when the student did not submit an answer', async () => {
    const { service, attempts } = buildService();

    const problemId = await service.recordSolveAttempt(
      'user-1',
      { question: '2 + 2 = ?' },
      { answer: '4' },
      7,
    );

    expect(problemId).toBe('problem-1');
    expect(service.createPracticeProblem).toHaveBeenCalledWith('user-1', '2 + 2 = ?', { answer: '4' }, 7);
    expect(attempts.create).not.toHaveBeenCalled();
  });

  it('treats whitespace-only student answers as solver views, not student attempts', async () => {
    const { service, attempts } = buildService();

    const problemId = await service.recordSolveAttempt(
      'user-1',
      { question: 'x + 1 = 3', studentAnswer: '   ' },
      { answer: '2' },
      8,
    );

    expect(problemId).toBe('problem-1');
    expect(attempts.create).not.toHaveBeenCalled();
  });

  it('creates an Attempt only when the student submitted a non-empty answer', async () => {
    const { service, attempts } = buildService();

    const problemId = await service.recordSolveAttempt(
      'user-1',
      { question: 'x + 1 = 3', studentAnswer: ' 2 ', durationSec: 37 },
      { answer: '2' },
      8,
    );

    expect(problemId).toBe('problem-1');
    expect(attempts.create).toHaveBeenCalledWith('user-1', {
      problemId: 'problem-1',
      answer: '2',
      durationSec: 37,
      context: 'PRACTICE',
    });
  });

  it('does not persist anything when the solver response has no answer', async () => {
    const { service, attempts } = buildService();

    const problemId = await service.recordSolveAttempt(
      'user-1',
      { question: '2 + 2 = ?' },
      {},
      7,
    );

    expect(problemId).toBeNull();
    expect(service.createPracticeProblem).not.toHaveBeenCalled();
    expect(attempts.create).not.toHaveBeenCalled();
  });
});
