import { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { normalizeKoreanExamMath, wrapHangulInTex } from '../lib/korean-exam-math';

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
 * KR exam OCR: Hangul glued into math is sanitized via normalizeKoreanExamMath
 * before KaTeX (see korean-exam-math.ts).
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
// any of the four delimiters. Heuristic: if the string contains a LaTeX
// command AND none of the four delimiters fire, wrap in \[..\].
const LATEX_COMMAND_RE = /\\[a-zA-Z]+|\^{|_{|\\\\/;
function maybeWrapBareLatex(src: string): string {
  if (!src) return src;
  MATH_RE.lastIndex = 0;
  if (MATH_RE.test(src)) return src;
  if (LATEX_COMMAND_RE.test(src)) return `\\[${src}\\]`;
  return src;
}

function renderInline(src: string): string {
  // Order: KR-exam normalize first (rewrites \[…\] blocks), then bare-latex wrap.
  const prepared = maybeWrapBareLatex(normalizeKoreanExamMath(src));
  const tokens = prepared.split(MATH_RE);
  const parts: string[] = [];
  for (const tk of tokens) {
    if (!tk) continue;
    const cls = classify(tk);
    if (cls) {
      try {
        const tex = wrapHangulInTex(cls.tex);
        parts.push(
          katex.renderToString(tex, {
            displayMode: cls.display,
            throwOnError: false,
            strict: 'ignore',
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

function renderTextPart(s: string): string {
  let out = escapeHtml(s);
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
