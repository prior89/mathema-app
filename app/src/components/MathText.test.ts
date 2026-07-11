import { describe, expect, it } from 'vitest';
import { renderMathHtml } from './MathText';

/** The exact KR-exam OCR shape a user reported as "수식이 깨져요" — (가)/(나)
 *  display blocks with Korean labels, inline \( a, b \), a bare display block,
 *  Korean prose, and circled-number choices. */
const KR_EXAM_OCR = `\\[
\\text{(가) } \\lim_{x \\to 1} \\frac{f(x) - g(x)}{x - 1} = 5
\\]

\\[
\\text{(나) } \\lim_{x \\to 1} \\frac{f(x) + g(x) - 2f(1)}{x - 1} = 7
\\]

두 실수 \\( a, b \\)에 대하여

\\[\\lim_{x \\to 1} \\frac{f(x) - a}{x - 1} = b \\times g(1)\\]
일 때, ab의 값은? [4점]

① 4 ② 5 ③ 6 ④ 7 ⑤ 8`;

describe('renderMathHtml — KR exam OCR', () => {
  it('renders every math segment of the reported exam text (no errors, no raw TeX)', () => {
    const html = renderMathHtml(KR_EXAM_OCR);
    expect(html).not.toContain('katex-error');
    // 4 math segments: (가), (나), inline (a,b), final display block.
    expect((html.match(/class="katex/g) ?? []).length).toBeGreaterThanOrEqual(4);
    // No raw TeX source leaking into visible text.
    expect(html).not.toContain('\\lim');
    expect(html).not.toContain('\\frac');
    // Prose + choices stay as plain text.
    expect(html).toContain('두 실수');
    expect(html).toContain('① 4 ② 5 ③ 6 ④ 7 ⑤ 8');
  });

  it('rescues a display block whose closing \\] the OCR dropped', () => {
    // Without the rescue this whole chunk fell through tokenizing and showed
    // the raw "\[ \lim_{x \to 1} …" source — the reported breakage mode.
    const dropped = '\\[\n\\lim_{x \\to 1} \\frac{f(x)}{x - 1} = 5\n두 실수 a, b에 대하여';
    const html = renderMathHtml(dropped);
    expect(html).not.toContain('\\lim');
    expect(html).toContain('class="katex');
    expect(html).toContain('두 실수');
  });

  it('rescues bare TeX lines mixed into prose (no delimiters at all around them)', () => {
    const mixed = '다음을 구하시오.\n\\frac{1}{2} + \\frac{1}{3}\n답을 고르세요.';
    const html = renderMathHtml(mixed);
    expect(html).not.toContain('\\frac');
    expect(html).toContain('class="katex');
    expect(html).toContain('다음을 구하시오.');
  });

  it('keeps English prose readable inside a math block (math mode eats spaces)', () => {
    // A prod incident rendered "if these exist" as "iftheseexist" — English
    // prose glued into a \[...\] block loses all spacing in math mode unless
    // \text{}-wrapped like Hangul.
    const html = renderMathHtml('\\[a = f(1), then the limit equals f\'(1) = 6\\]');
    // KaTeX renders \text spaces as NBSP — normalize before asserting.
    const visible = html.replace(/<[^>]+>/g, '').replace(/ /g, ' ');
    expect(visible).toContain('then the limit equals');
    expect(visible).not.toContain('thenthelimitequals');
    expect(html).not.toContain('katex-error');
  });

  it('leaves pure prose (with markdown bold) untouched by the rescue', () => {
    const html = renderMathHtml('오늘의 **핵심** 개념을 확인하세요.\n내일 다시 봐요.');
    expect(html).toContain('<strong>핵심</strong>');
    expect(html).not.toContain('class="katex');
  });
});
