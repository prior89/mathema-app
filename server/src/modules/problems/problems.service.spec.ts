import { stripAnswerLeak } from './problems.service';

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
