/**
 * Shared sanitizer for Mathpix / Korean exam OCR that glues Korean prose into
 * LaTeX. Keep the Hangul ranges as unicode escapes so this file survives
 * Windows/editor encoding changes.
 */

const HANGUL_RANGE = '\\uAC00-\\uD7A3\\u3131-\\u318E\\u1100-\\u11FF';
const HANGUL_RE = /[\uAC00-\uD7A3\u3131-\u318E\u1100-\u11FF]/;
const DISPLAY_MATH_RE = /\\\[([\s\S]*?)\\\]/g;
const TEXT_STYLE_COMMAND_RE = /\\(?:text|mathrm|textrm|textbf|textit)\{([^{}]*)\}/g;
const TEXT_STYLE_PROTECTED_RE = /(\\(?:text|mathrm|textrm|textbf|textit)\{[^{}]*\})/g;
const TEXT_COMMAND_RE = /\\text\{([^{}]*)\}/g;
const SHORT_LABEL_RE = new RegExp(
  `^\\s*[(\\[]?\\s*(?:[${HANGUL_RANGE}]{1,2}|[0-9]{1,2}|[A-Za-z])\\s*[)\\].]?\\s*$`,
);
const BARE_HANGUL_AFTER_RELATION_RE = new RegExp(
  `^([\\s\\S]*?(?:=|\\\\approx|\\\\leq|\\\\geq)\\s*[^${HANGUL_RANGE}\\n]{0,100}?)(\\s+[${HANGUL_RANGE}][\\s\\S]*)$`,
);
const HANGUL_RUN_RE = new RegExp(
  `[${HANGUL_RANGE}][${HANGUL_RANGE}0-9\\s.,?!~:;'"()\\[\\]\\-\\/·]*`,
  'g',
);

function hasHangul(s: string): boolean {
  HANGUL_RE.lastIndex = 0;
  return HANGUL_RE.test(s);
}

function stripTextCommands(s: string): string {
  return s.replace(TEXT_STYLE_COMMAND_RE, '$1');
}

function unwrapTextCommands(s: string): string {
  return stripTextCommands(s)
    .replace(/\\(?:quad|qquad|,|;|!)/g, ' ')
    .replace(/\\ /g, ' ')
    .replace(/[{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function hasMathSignal(body: string): boolean {
  const noText = body.replace(TEXT_STYLE_COMMAND_RE, '');
  return /[=+\-*/^_∑∫√∞]|\\(?:frac|sum|lim|int|sqrt|partial|binom|cdot|times|leq|geq|approx)\b/.test(
    noText,
  );
}

/** True when a display-math body is actually a Korean title/instruction. */
function isKoreanOnlyMathBody(body: string): boolean {
  if (!hasHangul(body)) return false;
  return !hasMathSignal(body);
}

function isInstructionalKoreanText(inner: string): boolean {
  const t = inner.trim();
  if (!hasHangul(t)) return false;
  if (SHORT_LABEL_RE.test(t)) return false;

  return (
    /(?:\uAD6C\uD558|\uB2E4\uC74C|\uBB3C\uC74C|\uC77C\s*\uB54C|\uB300\uD558|\uC9C0\uAE08|\uC774\uBA74|\uB77C\uBA74|\uB54C|\uC911|\uB2F5\uD558|\uC120\uD0DD|\uC5B4\uB5A4|\uC5BC\uB9C8|\uC5D0\s*\uB300)/.test(
      t,
    ) || t.length >= 4
  );
}

/**
 * Demote pure-Korean display math and split instructional Korean out of
 * display formulas. The output still uses \[...\] for real math blocks.
 */
export function normalizeKoreanExamMath(src: string): string {
  if (!src || !hasHangul(src)) return src;

  return src.replace(DISPLAY_MATH_RE, (_full, body: string) => {
    if (isKoreanOnlyMathBody(body)) {
      return unwrapTextCommands(body);
    }

    const textCmdRe = new RegExp(TEXT_COMMAND_RE);
    let match: RegExpExecArray | null;
    const splits: Array<{ start: number; end: number; inner: string }> = [];
    while ((match = textCmdRe.exec(body)) !== null) {
      if (isInstructionalKoreanText(match[1])) {
        splits.push({
          start: match.index,
          end: match.index + match[0].length,
          inner: match[1],
        });
      }
    }

    if (splits.length > 0) {
      const pivot = splits[0];
      const before = body.slice(0, pivot.start).trim();
      const after = body.slice(pivot.end).trim();
      const prose = unwrapTextCommands(pivot.inner);
      const parts: string[] = [];
      if (before) parts.push(`\\[${before}\\]`);
      if (prose) parts.push(prose);
      if (after) parts.push(`\\[${after}\\]`);
      return parts.join('\n');
    }

    const bare = body.match(BARE_HANGUL_AFTER_RELATION_RE);
    if (bare && bare[1].trim().length > 8) {
      return `\\[${bare[1].trim()}\\]\n${bare[2].trim()}`;
    }

    return `\\[${body}\\]`;
  });
}

// Runs of 2+ consecutive multi-letter Latin words — English prose glued into a
// math body. Math mode eats the spaces between them ("if these exist" →
// "iftheseexist"), so they must be \text{}-wrapped like Hangul. Guards:
//  - each word needs ≥2 letters, so variables ("a", "b") and "let A" stay math;
//  - the run must contain a ≥3-letter word, so "dx dy"-style pairs stay math;
//  - a leading backslash (LaTeX command like \lim) never starts a run.
const ENGLISH_PROSE_RUN_RE = /(?<![\\A-Za-z])[A-Za-z]{2,}(?:[ ]+[A-Za-z]{2,})+/g;

/**
 * Wrap bare Korean runs — and glued English prose runs — inside a TeX body
 * with \text{...}. Existing text-style commands are preserved so we do not
 * double-wrap.
 */
export function wrapHangulInTex(tex: string): string {
  if (!tex) return tex;
  const parts = tex.split(TEXT_STYLE_PROTECTED_RE);
  return parts
    .map((part, i) => {
      if (i % 2 === 1) return part;
      let out = part;
      if (hasHangul(out)) {
        out = out.replace(HANGUL_RUN_RE, (match) => {
          const trailingSpace = /\s+$/.test(match) ? ' ' : '';
          return `\\text{${match.trim()}}${trailingSpace}`;
        });
      }
      out = out.replace(ENGLISH_PROSE_RUN_RE, (match) =>
        /[A-Za-z]{3,}/.test(match) ? `\\text{${match}}` : match,
      );
      return out;
    })
    .join('');
}
