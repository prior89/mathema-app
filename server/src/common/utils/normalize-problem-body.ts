import { createHash } from 'crypto';
import { expandLatexTokens } from './normalize-math-answer';

/**
 * Normalize a problem body for solve-cache dedup (the AI-solver "flywheel":
 * the same problem, re-uploaded or common across students, is solved once and
 * reused — cheaper, faster, and consistent).
 *
 * Design principle: false collisions are the DANGEROUS failure (serving the
 * wrong cached solution), so this is deliberately CONSERVATIVE — it only strips
 * what is genuinely OCR/format noise (LaTeX delimiters, whitespace, case) while
 * preserving the mathematical content (numbers, operators, variables). Two
 * uploads of the same problem collapse to one string; two different problems do
 * not. When in doubt it under-matches (a cache miss just re-solves — safe).
 */
export function normalizeProblemBody(raw: string | null | undefined): string {
  let t = String(raw ?? '');
  t = t.replace(/\$\$?/g, '');            // inline LaTeX $ / $$ delimiters
  t = t.replace(/\\[()[\]]/g, '');        // \( \) \[ \] delimiters
  t = expandLatexTokens(t);               // \frac{}{}→/, \sqrt{}→sqrt(), \times→*, drop braces
  t = t.toLowerCase();
  t = t.replace(/\s+/g, '');              // OCR whitespace is noise → remove entirely
  return t;
}

/** Minimum normalized length to be safe to dedup — below this, too generic. */
export const MIN_HASHABLE_BODY_LEN = 12;

/**
 * SHA-256 of the normalized body, or null when the body is too short/empty to
 * dedup safely (caller then always solves fresh).
 */
export function problemBodyHash(raw: string | null | undefined): string | null {
  const norm = normalizeProblemBody(raw);
  if (norm.length < MIN_HASHABLE_BODY_LEN) return null;
  return createHash('sha256').update(norm).digest('hex');
}
