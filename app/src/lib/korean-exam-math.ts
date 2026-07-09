/**
 * Shared sanitizer for Mathpix / Korean exam OCR that glues Hangul into LaTeX.
 * Used by MathText (client render) and kept in sync with server OCR normalize.
 *
 * Patterns handled:
 *  1. \[ \text{필수 예제 12.4} \]  → plain Korean title (not display math)
 *  2. \[ … \text{ 일 때, } ab의 값은? \]  → pure math + prose after
 *  3. \[ (2) S_n \text{에 대해, 지금 } S_n = … \]  → split mid-block Korean
 *  4. Bare Hangul inside math without \text  → wrap with \text{…}
 */

const DISPLAY_MATH_RE = /\\\[([\s\S]*?)\\\]/g;

/** True when a display-math body is only Korean labels (no real formula). */
function isKoreanOnlyMathBody(body: string): boolean {
  // Strip \text{…} and common spacing commands; if nothing math-like remains, demote.
  const stripped = body
    .replace(/\\text\{[^}]*\}/g, '')
    .replace(/\\(?:quad|qquad| |,|;|!)/g, ' ')
    .replace(/[{}]/g, '')
    .trim();
  if (!/[가-힣]/.test(body)) return false;
  // Remaining tokens should not look like algebra (letters used as variables, =, sum, etc.)
  if (/[=+\-*/^_∑∫√∞]|\\(?:frac|sum|lim|int|sqrt|partial)/.test(body.replace(/\\text\{[^}]*\}/g, ''))) {
    return false;
  }
  // Pure title / instruction block
  return stripped.length === 0 || !/[A-Za-z0-9]/.test(stripped);
}

function unwrapTextCommands(s: string): string {
  return s
    .replace(/\\text\{([^}]*)\}/g, '$1')
    .replace(/\\(?:quad|qquad)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Korean instructional phrase inside \text{…} that should leave math mode.
 * Labels like \text{(가) } stay inside math.
 */
function isInstructionalKoreanText(inner: string): boolean {
  const t = inner.trim();
  if (!/[가-힣]/.test(t)) return false;
  // Keep short part labels: (가), (나), (1)
  if (/^[\s(（]*[가-힣0-9]{1,2}[)）\s.．]*$/.test(t)) return false;
  if (/^(가|나|다|라|마)\s*$/.test(t)) return false;
  // Instructional / question glue
  return (
    /일\s*때|값은|구하여|구하라|에\s*대해|대하여|다음|물음|일\s*때|지금|이면|이고|이고|부터|까지|중의|중에서/.test(
      t,
    ) || t.length >= 4
  );
}

/**
 * Demote pure-Korean display math and split instructional Korean out of formulas.
 */
export function normalizeKoreanExamMath(src: string): string {
  if (!src || !/[가-힣]/.test(src)) return src;

  return src.replace(DISPLAY_MATH_RE, (_full, body: string) => {
    // 1) Title-only blocks: \[ \text{필수 예제 12.4} \]
    if (isKoreanOnlyMathBody(body)) {
      return unwrapTextCommands(body);
    }

    // 2) Explicit \text{ 일 때 … } tail (previous fix)
    const ilTtae = body.search(/\\text\{\s*일\s*때/);
    if (ilTtae > 0) {
      const math = body.slice(0, ilTtae).trim();
      const prose = unwrapTextCommands(body.slice(ilTtae));
      return math ? `\\[${math}\\]\n${prose}` : prose;
    }

    // 3) Mid-block instructional \text{에 대해…} / \text{…구하여…}
    //    Split into: leading math | prose | trailing math
    const textCmdRe = /\\text\{([^}]*)\}/g;
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
      // Use the first instructional span as the prose pivot
      const pivot = splits[0];
      const before = body.slice(0, pivot.start).trim();
      const after = body.slice(pivot.end).trim();
      const prose = unwrapTextCommands(pivot.inner);
      const parts: string[] = [];
      if (before) {
        // Keep part labels like (2)\quad with following math if any
        parts.push(`\\[${before}\\]`);
      }
      parts.push(prose);
      if (after) {
        // Trailing pure math (e.g. S_n = 2n^3 - 6000)
        parts.push(`\\[${after}\\]`);
      }
      return parts.join('\n');
    }

    // 4) Bare Hangul after a relation (no \text wrapper)
    const bare = body.match(
      /^([\s\S]*?(?:=|\\approx|\\leq|\\geq)\s*[^가-힣\n]{0,100}?)(\s+[가-힣][\s\S]*)$/,
    );
    if (bare && bare[1].trim().length > 8) {
      return `\\[${bare[1].trim()}\\]\n${bare[2].trim()}`;
    }

    return `\\[${body}\\]`;
  });
}

/**
 * Wrap bare Hangul runs inside a TeX body with \text{…}.
 * Preserves existing \text/\mathrm/\textrm spans.
 */
export function wrapHangulInTex(tex: string): string {
  if (!tex || !/[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(tex)) return tex;
  const protectedChunks =
    /(\\(?:text|mathrm|textrm|textbf|textit)\{[^}]*\})/g;
  const parts = tex.split(protectedChunks);
  return parts
    .map((part, i) => {
      if (i % 2 === 1) return part;
      return part.replace(
        /[A-Za-z0-9]*[가-힣ㄱ-ㅎㅏ-ㅣ][가-힣ㄱ-ㅎㅏ-ㅣA-Za-z0-9\s?？!！,，.。:：;；'"‘’“”\[\]()（）0-9]*/g,
        (m) => `\\text{${m}}`,
      );
    })
    .join('');
}
