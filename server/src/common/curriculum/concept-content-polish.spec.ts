import { polishCorrectKo, polishWhyKo } from './concept-content-polish';

describe('concept-content-polish', () => {
  it('keeps Korean misconception rationales structured without awkward sentence joins', () => {
    const why = polishWhyKo(
      '부호를 반대로 보았습니다.',
      '음수 괄호를 먼저 풀고 같은 항끼리 계산합니다.',
      '부호 반대 선택',
    );

    expect(why).toContain('오답 이름:');
    expect(why).toContain('왜 실패하나:');
    expect(why).toContain('대신');
    expect(why).toContain('다음에는');
    expect(why).not.toContain('습니다 때문에');
    expect(why).not.toContain('합니다라는');
  });

  it('does not duplicate Korean predicate endings in correct-approach polish', () => {
    const correct = polishCorrectKo('음수 괄호를 먼저 풀고 같은 항끼리 계산합니다.');

    expect(correct).toContain('올바른 접근:');
    expect(correct).not.toContain('합니다입니다');
  });
});
