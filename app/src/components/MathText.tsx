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
  const html = useMemo(() => renderMathHtml(text ?? ''), [text]);
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

// Signals that a chunk is really TeX even though no delimiter pair fired —
// either bare LaTeX (IN-side problem bodies) or an OCR-dropped closing
// delimiter. Handled per line by renderTextOrRescue below; the old
// whole-string \[..\] wrap pushed prose INTO the math and rendered stray
// delimiter fragments as red errors.
const LATEX_COMMAND_RE = /\\[a-zA-Z]+|\^{|_{|\\\\/;

/** Exported for unit tests — the component is a thin wrapper around this. */
export function renderMathHtml(src: string): string {
  const prepared = normalizeKoreanExamMath(src);
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
      parts.push(renderTextOrRescue(tk));
    }
  }
  // Bold spans can contain inline math, for example
  // `**denominator $q$ has only 2 and 5 as prime factors**`. Math tokenizing
  // splits that into three chunks, so renderTextPart cannot close the marker
  // inside either prose chunk. Resolve the remaining marker pair after the
  // safe text and KaTeX HTML have been assembled (KaTeX output contains no `**`).
  return parts.join('').replace(/\*\*([\s\S]+?)\*\*/g, '<strong>$1</strong>');
}

/** OCR frequently drops a closing delimiter (\] or a paired $), so a chunk
 *  that is really TeX falls through tokenizing and used to show as raw LaTeX
 *  source — the classic "수식이 깨져요" report. Rescue per line: lines that
 *  still smell like TeX render as display math (stray delimiter fragments
 *  stripped); prose lines stay text. */
function renderTextOrRescue(s: string): string {
  if (!LATEX_COMMAND_RE.test(s)) return renderTextPart(s);
  const out: string[] = [];
  for (const rawLine of s.split('\n')) {
    // Stray delimiter fragments (the orphaned half of a dropped pair) would
    // render as literal "\[" — drop them before classifying the line.
    const line = rawLine.replace(/\\[[\]()]/g, ' ');
    if (LATEX_COMMAND_RE.test(line)) {
      try {
        out.push(
          katex.renderToString(wrapHangulInTex(line.trim()), {
            displayMode: true,
            throwOnError: false,
            strict: 'ignore',
            output: 'html',
          }),
        );
      } catch {
        out.push(renderTextPart(rawLine) + '<br/>');
      }
    } else if (line.trim()) {
      out.push(renderTextPart(line.trim()) + '<br/>');
    }
    // blank lines dropped — display blocks carry their own vertical margins.
  }
  return out.join('').replace(/<br\/>$/, '');
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
