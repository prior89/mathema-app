import { stripAnswerLeak, ProblemsService } from './problems.service';

describe('ProblemsService.report → flywheel cache invalidation', () => {
  function build(problem: any) {
    const prisma = {
      problem: {
        findUnique: jest.fn().mockResolvedValue(problem),
        update: jest.fn().mockResolvedValue({}),
      },
    };
    const redis = { del: jest.fn().mockResolvedValue(undefined) };
    const svc = new ProblemsService({} as any, prisma as any, redis as any);
    return { svc, redis, prisma };
  }

  it('purges the solve-cache for a disputed problem that has a bodyHash', async () => {
    const { svc, redis } = build({
      id: 'p1', qualityStatus: 'USABLE', qualityCriticalFlags: [], bodyHash: 'abc123',
    });
    await svc.report('u1', 'p1', 'wrong answer');
    expect(redis.del).toHaveBeenCalledWith('solve:abc123');
  });

  it('does not touch the cache when the problem has no bodyHash', async () => {
    const { svc, redis } = build({
      id: 'p1', qualityStatus: 'USABLE', qualityCriticalFlags: [], bodyHash: null,
    });
    await svc.report('u1', 'p1', null);
    expect(redis.del).not.toHaveBeenCalled();
  });

  it('still records the report even if cache del fails (best-effort)', async () => {
    const { svc, redis, prisma } = build({
      id: 'p1', qualityStatus: 'USABLE', qualityCriticalFlags: [], bodyHash: 'h',
    });
    redis.del.mockRejectedValueOnce(new Error('redis down'));
    const res = await svc.report('u1', 'p1', 'x');
    expect(prisma.problem.update).toHaveBeenCalled();
    expect(res).toEqual({ ok: true, duplicate: false });
  });
});

describe('stripAnswerLeak', () => {
  it('drops steps that state a numeric final answer', () => {
    const steps = [
      'Use $|A \\cup B| = |A| + |B| - |A \\cap B|$.',
      'Substitute the given values: $25 + 25 - 10$.',
      'Thus, $|A \\cup B| = 40$.',
    ];
    expect(stripAnswerLeak(steps, '40')).toEqual(steps.slice(0, 2));
  });

  it('does not false-match the answer inside a larger number', () => {
    const steps = ['Note that $140 / 2$ appears here.', 'So the result is $40$.'];
    expect(stripAnswerLeak(steps, '40')).toEqual([steps[0]]);
  });

  it('ignores whitespace and LaTeX delimiters when matching', () => {
    const steps = ['Solve to get $x = 2$.'];
    expect(stripAnswerLeak(steps, 'x=2')).toEqual([]);
  });

  it('handles negative numeric answers', () => {
    const steps = ['Setup: $x + 40 = 0$.', 'Hence $x = -40$.'];
    expect(stripAnswerLeak(steps, '-40')).toEqual([steps[0]]);
  });

  it('returns steps unchanged when answer is null or empty', () => {
    const steps = ['Step one.', 'Step two.'];
    expect(stripAnswerLeak(steps, null)).toEqual(steps);
    expect(stripAnswerLeak(steps, '  ')).toEqual(steps);
  });
});
