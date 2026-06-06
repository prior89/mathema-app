import { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * MathText — 문제 본문/개념/공식 텍스트에서 LaTeX 수식을 KaTeX 로 렌더링.
 *
 * 지원 문법:
 *   - $...$        인라인 수식 (TeX legacy)
 *   - $$...$$      디스플레이 수식 (TeX legacy)
 *   - \(...\)      인라인 수식 (MMD / NCERT 표준)
 *   - \[...\]      디스플레이 수식 (MMD / NCERT)
 *   - 그 외 일반 텍스트는 그대로 (개행은 <br/>)
 *
 * KaTeX 는 SSR-safe, throwOnError=false 로 잘못된 LaTeX 도 빨갛게 표시만 하고 중단 안함.
 */
export default function MathText({ text, className }: { text: string; className?: string }) {
  const html = useMemo(() => renderInline(text ?? ''), [text]);
  return (
    <span
      className={className}
      // KaTeX 가 만든 HTML 은 신뢰 가능 (라이브러리 sanitize). 사용자 입력은 split 단계에서 escape.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// Matches all four delimiter forms in one regex:
//   $$ ... $$   (display, TeX legacy)
//   $ ... $     (inline,  TeX legacy)
//   \[ ... \]   (display, MMD / NCERT)
//   \( ... \)   (inline,  MMD / NCERT)
// We capture the delimited chunks so split() keeps them as separate tokens.
const MATH_RE = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\))/g;

function classify(tk: string): { tex: string; display: boolean } | null {
  if (tk.startsWith('$$') && tk.endsWith('$$') && tk.length >= 4)
    return { tex: tk.slice(2, -2), display: true };
  if (tk.startsWith('$') && tk.endsWith('$') && tk.length >= 2 && !tk.startsWith('$$'))
    return { tex: tk.slice(1, -1), display: false };
  if (tk.startsWith('\\[') && tk.endsWith('\\]') && tk.length >= 4)
    return { tex: tk.slice(2, -2), display: true };
  if (tk.startsWith('\\(') && tk.endsWith('\\)') && tk.length >= 4)
    return { tex: tk.slice(2, -2), display: false };
  return null;
}

// IN-side problems often store body / option text as bare LaTeX without
// any of the four delimiters (`$..$`, `$$..$$`, `\(..\)`, `\[..\]`). Sample
// from prod C11-CH04-COMPLEX: `\left(\frac{1}{3}+3 i\right)^{3}`. Without a
// delimiter MathText escapes it and the student sees raw `\left(\frac{...}`.
//
// Heuristic: if the string contains a LaTeX command (`\letters`, `^{`, `_{`)
// AND none of the four delimiters fire on a global scan, wrap the whole
// thing in `\[..\]` so KaTeX renders it as display math. Mixed bodies (prose
// + `$...$` + `\[...\]`) keep working because MATH_RE.test() returns true
// and we fall through to the existing split-based path.
const LATEX_COMMAND_RE = /\\[a-zA-Z]+|\^{|_{|\\\\/;
function maybeWrapBareLatex(src: string): string {
  if (!src) return src;
  // Reset lastIndex — the global flag on MATH_RE remembers state across calls.
  MATH_RE.lastIndex = 0;
  if (MATH_RE.test(src)) return src;
  if (LATEX_COMMAND_RE.test(src)) return `\\[${src}\\]`;
  return src;
}

function renderInline(src: string): string {
  const tokens = maybeWrapBareLatex(src).split(MATH_RE);
  const parts: string[] = [];
  for (const tk of tokens) {
    if (!tk) continue;
    const cls = classify(tk);
    if (cls) {
      try {
        parts.push(
          katex.renderToString(cls.tex, {
            displayMode: cls.display,
            throwOnError: false,
            strict: 'ignore',
            // output='html' suppresses the parallel MathML span KaTeX
            // normally emits for screen readers. The MathML sibling caused
            // duplicated rendering ("a x a x") whenever the bundled
            // katex.min.css rule that hides .katex-mathml didn't apply
            // (Vite dev fast-refresh edge, CSS reorder, etc). We give up
            // a small accessibility win to remove the visual duplication.
            output: 'html',
          }),
        );
      } catch {
        parts.push(escapeHtml(tk));
      }
    } else {
      parts.push(renderTextPart(tk));
    }
  }
  return parts.join('');
}

// Plain-text segments between math tokens get HTML escaped, then a small
// allow-list of markdown emphasis is restored:
//   **bold** → <strong>bold</strong>
// Newlines become <br/>. Everything else stays escaped so we never inject
// raw HTML from user content.
function renderTextPart(s: string): string {
  let out = escapeHtml(s);
  // Markdown bold — escapeHtml leaves '*' untouched (it isn't HTML-special).
  // Use a non-greedy match that doesn't cross newlines so a forgotten close
  // marker can't gobble the whole document.
  out = out.replace(/\*\*([^*\n]+?)\*\*/g, '<strong>$1</strong>');
  return out.replace(/\n/g, '<br/>');
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
