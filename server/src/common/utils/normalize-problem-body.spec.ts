import {
  normalizeProblemBody,
  problemBodyHash,
  MIN_HASHABLE_BODY_LEN,
} from './normalize-problem-body';

describe('normalize-problem-body (solve-cache dedup)', () => {
  it('collapses OCR/format noise so the SAME problem matches', () => {
    // whitespace + $ delimiters + case
    expect(normalizeProblemBody('Solve  $x^2 = 4$ '))
      .toBe(normalizeProblemBody('solve x^2=4'));
    // \frac vs / and \times vs *
    expect(normalizeProblemBody('\\frac{1}{2} + 3 \\times x'))
      .toBe(normalizeProblemBody('1/2+3*x'));
    // \( \) delimiters + \sqrt
    expect(normalizeProblemBody('Find \\(\\sqrt{16}\\)'))
      .toBe(normalizeProblemBody('find sqrt(16)'));
  });

  it('does NOT collide DIFFERENT problems (the dangerous failure mode)', () => {
    expect(problemBodyHash('Solve x^2 = 4 for x'))
      .not.toBe(problemBodyHash('Solve x^2 = 9 for x'));
    expect(problemBodyHash('Differentiate sin(x) with respect to x'))
      .not.toBe(problemBodyHash('Integrate sin(x) with respect to x'));
    expect(problemBodyHash('The area of a circle of radius 5'))
      .not.toBe(problemBodyHash('The area of a circle of radius 6'));
  });

  it('same problem → same hash; whitespace/latex variants included', () => {
    const a = problemBodyHash('Evaluate $\\frac{d}{dx}(x^3 + 2x)$');
    const b = problemBodyHash('Evaluate d/dx(x^3 + 2x)');
    expect(a).not.toBeNull();
    expect(a).toBe(b);
  });

  it('returns null for too-short / empty bodies (never dedup the generic)', () => {
    expect(problemBodyHash('')).toBeNull();
    expect(problemBodyHash('5+3')).toBeNull();          // shorter than MIN
    expect(problemBodyHash(null)).toBeNull();
    expect(problemBodyHash(undefined)).toBeNull();
    expect(normalizeProblemBody('x=1').length).toBeLessThan(MIN_HASHABLE_BODY_LEN);
  });

  it('hash is deterministic and hex', () => {
    const h = problemBodyHash('Solve the quadratic 2x^2 - 3x + 1 = 0');
    expect(h).toBe(problemBodyHash('Solve the quadratic 2x^2 - 3x + 1 = 0'));
    expect(h).toMatch(/^[0-9a-f]{64}$/);
  });
});
