/**
 * Shared math-answer normalization for text grading (PR-19a).
 *
 * Used by attempts.repository (single source of truth) so ReviewQueue,
 * SoloProblem, and any future MathKeyboard flow agree on equivalence.
 */

export function stripLatexDelimiters(raw: string): string {
  const t = raw.trim();
  if (t.startsWith('$$') && t.endsWith('$$') && t.length >= 4) {
    return t.slice(2, -2).trim();
  }
  if (t.startsWith('$') && t.endsWith('$') && t.length >= 2 && !t.startsWith('$$')) {
    return t.slice(1, -1).trim();
  }
  if (t.startsWith('\\(') && t.endsWith('\\)')) {
    return t.slice(2, -2).trim();
  }
  if (t.startsWith('\\[') && t.endsWith('\\]')) {
    return t.slice(2, -2).trim();
  }
  return t;
}

/** Expand common LaTeX tokens to plain math strings before trim/compare. */
export function expandLatexTokens(raw: string): string {
  let t = raw;
  let prev = '';
  while (prev !== t) {
    prev = t;
    t = t.replace(/\\frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, '$1/$2');
  }
  t = t.replace(/\\sqrt\s*\{([^{}]*)\}/g, 'sqrt($1)');
  t = t.replace(/\\pi\b/g, 'pi');
  t = t.replace(/\\times\b/g, '*');
  t = t.replace(/\\cdot\b/g, '*');
  t = t.replace(/\\pm\b/g, 'pm');
  t = t.replace(/\\left\b/g, '').replace(/\\right\b/g, '');
  // Drop empty braces left from keyboard templates (^{}, _{}).
  t = t.replace(/\{\}/g, '');
  t = t.replace(/[{}]/g, '');
  return t;
}

export function normalizeMathAnswer(value: string | null | undefined): string {
  let t = stripLatexDelimiters(String(value ?? ''));
  t = expandLatexTokens(t);
  return t.trim().toLowerCase().replace(/\s+/g, '');
}

function parseNumericValue(normalized: string): number | null {
  if (!normalized) return null;
  if (normalized.includes('/')) {
    const [numRaw, denRaw] = normalized.split('/');
    const num = Number(numRaw);
    const den = Number(denRaw);
    if (Number.isFinite(num) && Number.isFinite(den) && den !== 0) {
      return num / den;
    }
    return null;
  }
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

/** True when normalized strings match, including numeric 1/2 ↔ 0.5. */
export function mathAnswersEqual(
  expected: string | null | undefined,
  given: string | null | undefined,
): boolean {
  const e = normalizeMathAnswer(expected);
  const g = normalizeMathAnswer(given);
  if (!e.length) return false;
  if (e === g) return true;

  const en = parseNumericValue(e);
  const gn = parseNumericValue(g);
  if (en !== null && gn !== null) {
    return Math.abs(en - gn) < 1e-9;
  }
  return false;
}