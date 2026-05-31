/**
 * K-G11-CAL1-CH01-LIMIT-CONT — STUDY pool (single-step, 20문제).
 * 함수의 극한과 연속 — 대입·인수분해·유리화·∞ 극한, 연속 정의, IVT.
 * Mastery 3-step과 별도 변형 문제. 고2 미적분Ⅰ (G11).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5. LLM 미사용.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G11-CAL1-CH01-LIMIT-CONT';
const SKILLS_LIM_SUB = ['limit_direct_substitution'];
const SKILLS_LIM_FACTOR = ['limit_factor_cancel', 'indeterminate_zero_zero'];
const SKILLS_LIM_INF = ['limit_at_infinity', 'leading_coefficient_ratio'];
const SKILLS_LIM_SPECIAL = ['sin_x_over_x'];
const SKILLS_LIM_RATIONAL = ['rationalize_conjugate', 'infinity_minus_infinity'];
const SKILLS_CONT_DEF = ['continuity_definition', 'discontinuity'];
const SKILLS_PIECEWISE = ['one_sided_limit', 'piecewise_continuity'];
const SKILLS_IVT = ['intermediate_value_theorem'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) 대입 극한
  { chapterCode: CODE, difficulty: 'easy', concept: '대입 극한 ($x = 3$)', requiredSkills: SKILLS_LIM_SUB,
    stem: '$\\lim_{x \\to 3} (x - 1) = ?$',
    options: [
      { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x$ 자체' },
      { key: 'C', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'D', text: '$4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$3 + 1$' },
      { key: 'E', text: '$-1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$x$ 무시' },
    ],
    solution: '연속함수 → 대입: $3 - 1 = 2$.' },

  // S2 (쉬움) lim x³
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\lim x^3$ ($x \\to 1$)', requiredSkills: SKILLS_LIM_SUB,
    stem: '$\\lim_{x \\to 1} x^3 = ?$',
    options: [
      { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '지수 곱셈' },
      { key: 'C', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$3x^2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '도함수' },
    ],
    solution: '$1^3 = 1$.' },

  // S3 (쉬움) lim(3x²+2)
  { chapterCode: CODE, difficulty: 'easy', concept: '다항식 극한 ($x = 0$)', requiredSkills: SKILLS_LIM_SUB,
    stem: '$\\lim_{x \\to 0} (3x^2 + 2) = ?$',
    options: [
      { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$+2$ 누락' },
      { key: 'C', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '계수' },
      { key: 'D', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
      { key: 'E', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$x = 0$ 대입: $0 + 2 = 2$.' },

  // S4 (쉬움) 다항함수 연속
  { chapterCode: CODE, difficulty: 'easy', concept: '다항함수 연속성', requiredSkills: SKILLS_CONT_DEF,
    stem: '다항함수 $f(x)$ 는 어디에서 연속인가?',
    options: [
      { key: 'A', text: '모든 실수에서 연속', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x \\geq 0$ 에서만', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'C', text: '$x \\neq 0$ 에서만', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '유리함수와 혼동' },
      { key: 'D', text: '특정 점에서만', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '연속 안 함', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '항상 연속' },
    ],
    solution: '다항함수는 모든 실수에서 연속.' },

  // S5 (쉬움) 우극한 의미
  { chapterCode: CODE, difficulty: 'easy', concept: '우극한', requiredSkills: SKILLS_PIECEWISE,
    stem: '$\\lim_{x \\to a^+} f(x)$ 의 의미는?',
    options: [
      { key: 'A', text: '$x$ 가 $a$ 보다 큰 값에서 $a$ 에 접근', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x$ 가 $a$ 보다 작은 값에서 접근', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '좌극한' },
      { key: 'C', text: '$x$ 가 $a$ 와 같음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '함숫값' },
      { key: 'D', text: '$x \\to \\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '무한대 극한' },
      { key: 'E', text: '$x = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '우극한: $x > a$ 이면서 $x \\to a$. ($a^+$).' },

  // S6 (쉬움) 1/x² ∞
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\lim 1/x^2$ ($x \\to \\infty$)', requiredSkills: SKILLS_LIM_INF,
    stem: '$\\lim_{x \\to \\infty} \\dfrac{1}{x^2} = ?$',
    options: [
      { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '지수' },
      { key: 'E', text: '$1/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$x \\to \\infty$ → $1/x^2 \\to 0$.' },

  // S7 (중) 0/0 인수분해
  { chapterCode: CODE, difficulty: 'medium', concept: '$0/0$ 인수분해 ($x \\to 3$)', requiredSkills: SKILLS_LIM_FACTOR,
    stem: '$\\lim_{x \\to 3} \\dfrac{x^2 - 9}{x - 3} = ?$',
    options: [
      { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '대입 잘못 ($0/0$)' },
      { key: 'C', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x$ 답함' },
      { key: 'D', text: '$9$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'E', text: '정의 X', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '극한 존재' },
    ],
    solution: '$\\dfrac{(x-3)(x+3)}{x-3} = x + 3 \\to 6$.' },

  // S8 (중) x 약분
  { chapterCode: CODE, difficulty: 'medium', concept: '$x$ 약분', requiredSkills: SKILLS_LIM_FACTOR,
    stem: '$\\lim_{x \\to 0} \\dfrac{2x^2 + x}{x} = ?$',
    options: [
      { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '대입 잘못' },
      { key: 'C', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '계수' },
      { key: 'D', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2 + 1$' },
      { key: 'E', text: '정의 X', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '존재' },
    ],
    solution: '$\\dfrac{x(2x + 1)}{x} = 2x + 1 \\to 1$.' },

  // S9 (중) ∞/∞ 같은 차수
  { chapterCode: CODE, difficulty: 'medium', concept: '같은 차수 ∞ 극한', requiredSkills: SKILLS_LIM_INF,
    stem: '$\\lim_{x \\to \\infty} \\dfrac{2x + 1}{3x - 1} = ?$',
    options: [
      { key: 'A', text: '$\\dfrac{2}{3}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$\\dfrac{3}{2}$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '뒤집음' },
    ],
    solution: '최고차 계수 비: $2/3$.' },

  // S10 (중) 분자 차수 ↑
  { chapterCode: CODE, difficulty: 'medium', concept: '분자 차수 ↑ → ∞', requiredSkills: SKILLS_LIM_INF,
    stem: '$\\lim_{x \\to \\infty} \\dfrac{x^3}{x^2 + 1} = ?$',
    options: [
      { key: 'A', text: '$\\infty$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '분모 차수 ↑ 인 경우' },
      { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '같은 차수 X' },
      { key: 'D', text: '$x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '값 X' },
      { key: 'E', text: '정의 X', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$+\\infty$' },
    ],
    solution: '분자 차수 > 분모 차수 → $\\infty$.' },

  // S11 (중) 분모 차수 ↑
  { chapterCode: CODE, difficulty: 'medium', concept: '분모 차수 ↑ → 0', requiredSkills: SKILLS_LIM_INF,
    stem: '$\\lim_{x \\to \\infty} \\dfrac{x^2 + 1}{x^3} = ?$',
    options: [
      { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\infty$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '뒤바뀐 경우' },
      { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$1/x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '값으로 잘못' },
      { key: 'E', text: '$1/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '분모 차수 > 분자 차수 → $0$.' },

  // S12 (중) sin 2x / x
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\sin(ax)/x$', requiredSkills: SKILLS_LIM_SPECIAL,
    stem: '$\\lim_{x \\to 0} \\dfrac{\\sin 2x}{x} = ?$',
    options: [
      { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\sin x/x$ 형태로 잘못 처리' },
      { key: 'C', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$1/2$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '뒤집음' },
      { key: 'E', text: '정의 X', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '존재' },
    ],
    solution: '$\\dfrac{\\sin 2x}{x} = 2 \\cdot \\dfrac{\\sin 2x}{2x} \\to 2 \\cdot 1 = 2$.' },

  // S13 (중) (x²-1)/(x-1)
  { chapterCode: CODE, difficulty: 'medium', concept: '인수분해 ($x \\to 1$)', requiredSkills: SKILLS_LIM_FACTOR,
    stem: '$\\lim_{x \\to 1} \\dfrac{x^2 - 1}{x - 1} = ?$',
    options: [
      { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$0/0$' },
      { key: 'C', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'D', text: '$-1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '잘못' },
      { key: 'E', text: '정의 X', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '존재' },
    ],
    solution: '$\\dfrac{(x-1)(x+1)}{x-1} = x + 1 \\to 2$.' },

  // S14 (중) 극한 존재 조건
  { chapterCode: CODE, difficulty: 'medium', concept: '극한 존재 조건', requiredSkills: SKILLS_PIECEWISE,
    stem: '$\\lim_{x \\to a} f(x)$ 가 존재할 조건은?',
    options: [
      { key: 'A', text: '좌극한 $=$ 우극한 (값 일치)', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$f(a)$ 가 정의됨', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '연속 조건' },
      { key: 'C', text: '$f$ 가 다항식', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '필요조건 아님' },
      { key: 'D', text: '$f$ 가 모든 곳에서 연속', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '필요조건 아님' },
      { key: 'E', text: '$a$ 가 정의역 내', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '필요조건 아님' },
    ],
    solution: '극한 존재 ↔ 좌극한 $=$ 우극한 (값 같음).' },

  // S15 (중) x²/(x-1) 불연속
  { chapterCode: CODE, difficulty: 'medium', concept: '유리함수 불연속점', requiredSkills: SKILLS_CONT_DEF,
    stem: '$f(x) = \\dfrac{x^2}{x - 1}$ 가 불연속인 점?',
    options: [
      { key: 'A', text: '$x = 1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '분자 위치' },
      { key: 'C', text: '$x = -1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'D', text: '모든 $x$ 에서 연속', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x = 1$ 분모 $0$' },
      { key: 'E', text: '$x = 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '분모 $= 0$인 곳에서 정의 X → 불연속. $x = 1$.' },

  // S16 (어려움) 유리화
  { chapterCode: CODE, difficulty: 'hard', concept: '유리화 ($\\sqrt{x + 4} - 2$)', requiredSkills: SKILLS_LIM_RATIONAL,
    stem: '$\\lim_{x \\to 0} \\dfrac{\\sqrt{x + 4} - 2}{x} = ?$',
    options: [
      { key: 'A', text: '$\\dfrac{1}{4}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'C', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$0/0$' },
      { key: 'D', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '정의 X', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '존재' },
    ],
    solution: '유리화: $\\dfrac{x + 4 - 4}{x(\\sqrt{x + 4} + 2)} = \\dfrac{1}{\\sqrt{x + 4} + 2} \\to \\dfrac{1}{4}$.' },

  // S17 (어려움) IVT
  { chapterCode: CODE, difficulty: 'hard', concept: '사이값 정리', requiredSkills: SKILLS_IVT,
    stem: '$f(x) = x^3 - 2$ 가 $[1, 2]$ 에서 근을 가지는가?',
    options: [
      { key: 'A', text: '예 ($f(1) = -1 < 0$, $f(2) = 6 > 0$)', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '아니오', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부호 다름 → 근 존재' },
      { key: 'C', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: 'IVT로 판별' },
      { key: 'D', text: '두 개', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: 'IVT는 적어도 한 개' },
      { key: 'E', text: '경계점만', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '연속 + $f(1) f(2) < 0$ → 사이값 정리로 근 존재.' },

  // S18 (어려움) 구간별 연속
  { chapterCode: CODE, difficulty: 'hard', concept: '구간별 함수 연속', requiredSkills: SKILLS_PIECEWISE,
    stem: '$f(x) = \\begin{cases} x + a & x < 2 \\\\ 3x - 1 & x \\geq 2 \\end{cases}$. $f$ 가 $x = 2$에서 연속이려면 $a$?',
    options: [
      { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'C', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'D', text: '$-3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '좌극한 $= 2 + a$, 우극한 $= 5$. $2 + a = 5 \\to a = 3$.' },

  // S19 (어려움) ∞-∞ 유리화
  { chapterCode: CODE, difficulty: 'hard', concept: '$\\infty - \\infty$ 유리화', requiredSkills: SKILLS_LIM_RATIONAL,
    stem: '$\\lim_{x \\to \\infty} (\\sqrt{x^2 + 2x} - x) = ?$',
    options: [
      { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\infty - \\infty$ 부정형' },
      { key: 'C', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'E', text: '$1/2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '유리화: $\\dfrac{2x}{\\sqrt{x^2 + 2x} + x} = \\dfrac{2}{\\sqrt{1 + 2/x} + 1} \\to \\dfrac{2}{2} = 1$.' },

  // S20 (어려움) 삼차 인수분해
  { chapterCode: CODE, difficulty: 'hard', concept: '삼차 인수분해 ($x \\to 1$)', requiredSkills: SKILLS_LIM_FACTOR,
    stem: '$\\lim_{x \\to 1} \\dfrac{x^3 - 1}{x - 1} = ?$',
    options: [
      { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$0/0$' },
      { key: 'C', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'D', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '존재' },
      { key: 'E', text: '$x^2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '값 X' },
    ],
    solution: '$x^3 - 1 = (x - 1)(x^2 + x + 1)$. 약분 후 $x^2 + x + 1 \\to 3$.' },
];

export const K_G11_CAL1_CH01_LIMIT_CONT_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
