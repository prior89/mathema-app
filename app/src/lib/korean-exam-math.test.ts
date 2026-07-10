import { describe, expect, it } from 'vitest';
import { normalizeKoreanExamMath, wrapHangulInTex } from './korean-exam-math';

describe('normalizeKoreanExamMath', () => {
  it('demotes Korean-only OCR title blocks out of display math', () => {
    expect(normalizeKoreanExamMath('\\[\\text{필수 예제 12.4}\\]')).toBe('필수 예제 12.4');
  });

  it('splits Korean instructions out of display formulas', () => {
    const input = '\\[(2)\\quad S_n \\text{에 대해 지금부터} S_n = 2n^3 - 6000\\]';

    expect(normalizeKoreanExamMath(input)).toBe(
      '\\[(2)\\quad S_n\\]\n에 대해 지금부터\n\\[S_n = 2n^3 - 6000\\]',
    );
  });

  it('keeps ordinary formulas as math', () => {
    const input = '\\[S_n = \\sum_{k=1}^{n} A_k = n^2 + 2n\\]';

    expect(normalizeKoreanExamMath(input)).toBe(input);
  });
});

describe('wrapHangulInTex', () => {
  it('wraps bare Korean runs without swallowing adjacent variables', () => {
    expect(wrapHangulInTex('S_n에 대해 S_n = 2n^3')).toBe(
      'S_n\\text{에 대해} S_n = 2n^3',
    );
  });

  it('does not double-wrap existing text commands', () => {
    expect(wrapHangulInTex('S_n \\text{에 대해} S_n = 2n^3')).toBe(
      'S_n \\text{에 대해} S_n = 2n^3',
    );
  });
});
