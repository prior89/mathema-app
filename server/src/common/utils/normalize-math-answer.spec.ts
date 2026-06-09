import {
  expandLatexTokens,
  mathAnswersEqual,
  normalizeMathAnswer,
  stripLatexDelimiters,
} from './normalize-math-answer';

describe('normalizeMathAnswer', () => {
  it('strips $ delimiters and whitespace', () => {
    expect(stripLatexDelimiters('$x+1$')).toBe('x+1');
    expect(normalizeMathAnswer('  $X + 1$  ')).toBe('x+1');
  });

  it('expands \\frac to slash form', () => {
    expect(expandLatexTokens('\\frac{1}{2}')).toBe('1/2');
    expect(normalizeMathAnswer('\\frac{1}{2}')).toBe('1/2');
  });

  it('treats \\frac{1}{2} and 0.5 as equivalent', () => {
    expect(mathAnswersEqual('0.5', '\\frac{1}{2}')).toBe(true);
    expect(mathAnswersEqual('1/2', '0.5')).toBe(true);
  });

  it('expands sqrt and pi tokens', () => {
    expect(normalizeMathAnswer('\\sqrt{2}')).toBe('sqrt(2)');
    expect(normalizeMathAnswer('\\pi')).toBe('pi');
  });

  it('returns false for empty expected', () => {
    expect(mathAnswersEqual(null, '1')).toBe(false);
    expect(mathAnswersEqual('', '1')).toBe(false);
  });
});