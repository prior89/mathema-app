import { needsDiagramVision } from './ocr.service';

/**
 * Gate for the extra ~3–8s vision pass that re-reads a diagram. We can't unit-test
 * OCR accuracy, but we CAN pin the classifier's behavior: fire on real graph /
 * geometry problems, not on text-only algebra.
 */
describe('needsDiagramVision', () => {
  it('fires on genuine diagram/graph problems (KR and EN)', () => {
    for (const text of [
      '다음 그래프를 보고 물음에 답하시오.',
      '함수의 그래프를 그리시오.',
      '좌표평면 위의 두 점 사이의 거리를 구하시오.',
      '아래 도형의 넓이를 구하시오.',
      'The graph of the function is shown.',
      'coordinate geometry problem',
      'As shown in the figure below, find the area.',
      'graphs of two linear equations', // plural still matches
    ]) {
      expect(needsDiagramVision(text)).toBe(true);
    }
  });

  it('does NOT fire on text-only algebra — the false-positive fix', () => {
    for (const text of [
      'Find the axis of symmetry of y = x^2 - 4x + 1.', // "axis" no longer triggers
      '이차방정식의 근을 구하시오.',
      'Solve for x: 2x + 3 = 11.',
    ]) {
      expect(needsDiagramVision(text)).toBe(false);
    }
  });

  it('does NOT false-match English substrings (word boundaries)', () => {
    expect(needsDiagramVision('See the paragraph above.')).toBe(false); // not "graph"
    expect(needsDiagramVision('Configure the calculator.')).toBe(false); // not "figure"
  });
});
