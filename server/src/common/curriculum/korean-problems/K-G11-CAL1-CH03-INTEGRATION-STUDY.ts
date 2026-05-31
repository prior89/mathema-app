/**
 * K-G11-CAL1-CH03-INTEGRATION — STUDY pool (single-step, 20문제).
 * 적분 — 부정적분, 거듭제곱 공식, 정적분, FTC, 넓이.
 * Mastery 3-step과 별도 변형 문제. 고2 미적분Ⅰ (G11).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5. LLM 미사용.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G11-CAL1-CH03-INTEGRATION';
const SKILLS_POWER_INT = ['power_rule_integral'];
const SKILLS_CONST_INT = ['constant_integral'];
const SKILLS_SUM_INT = ['sum_rule_integral'];
const SKILLS_DEF_INT = ['definite_integral'];
const SKILLS_FTC = ['fundamental_theorem'];
const SKILLS_INDEF = ['indefinite_integral_definition'];
const SKILLS_AREA = ['area_under_curve'];
const SKILLS_RECOVER = ['recover_f_from_integral'];
const SKILLS_PROP = ['integral_properties'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) ∫x⁴dx
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\int x^4 \\, dx$', requiredSkills: SKILLS_POWER_INT,
    stem: '$\\int x^4 \\, dx = ?$',
    options: [
      { key: 'A', text: '$\\dfrac{x^5}{5} + C$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{x^5}{4} + C$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$n$ 으로 나눔' },
      { key: 'C', text: '$4x^3 + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '미분' },
      { key: 'D', text: '$\\dfrac{x^4}{4} + C$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '지수 그대로' },
      { key: 'E', text: '$x^5 + C$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '분모 누락' },
    ],
    solution: '$\\int x^n \\, dx = \\dfrac{x^{n+1}}{n+1} + C$. $n = 4$ → $\\dfrac{x^5}{5} + C$.' },

  // S2 (쉬움) ∫x⁵dx
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\int x^5 \\, dx$', requiredSkills: SKILLS_POWER_INT,
    stem: '$\\int x^5 \\, dx = ?$',
    options: [
      { key: 'A', text: '$\\dfrac{x^6}{6} + C$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$5x^4 + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '미분' },
      { key: 'C', text: '$\\dfrac{x^5}{5} + C$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '지수 그대로' },
      { key: 'D', text: '$\\dfrac{x^6}{5} + C$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '분모 잘못' },
      { key: 'E', text: '$x^6 + C$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '분모 누락' },
    ],
    solution: '$\\dfrac{x^6}{6} + C$.' },

  // S3 (쉬움) ∫3dx
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\int 3 \\, dx$', requiredSkills: SKILLS_CONST_INT,
    stem: '$\\int 3 \\, dx = ?$',
    options: [
      { key: 'A', text: '$3x + C$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3 + C$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$x$ 누락' },
      { key: 'C', text: '$\\dfrac{3x^2}{2} + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$3x$ 적분' },
      { key: 'D', text: '$3$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '적분 안 함' },
      { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '미분' },
    ],
    solution: '$\\int c \\, dx = cx + C$.' },

  // S4 (쉬움) ∫(-2)dx
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\int (-2) \\, dx$', requiredSkills: SKILLS_CONST_INT,
    stem: '$\\int (-2) \\, dx = ?$',
    options: [
      { key: 'A', text: '$-2x + C$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$2x + C$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'C', text: '$-2 + C$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$x$ 누락' },
      { key: 'D', text: '$-x^2 + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$-2x$ 적분' },
      { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '미분' },
    ],
    solution: '$-2x + C$.' },

  // S5 (쉬움) ∫과 미분 관계
  { chapterCode: CODE, difficulty: 'easy', concept: '적분 ↔ 미분 관계', requiredSkills: SKILLS_INDEF,
    stem: '$\\dfrac{d}{dx} \\left( \\int f(x) \\, dx \\right) = ?$',
    options: [
      { key: 'A', text: '$f(x)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$f^{\\prime}(x)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'C', text: '$F(x) + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '적분 자체' },
      { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$F(x)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '적분 후 미분은 원함수. $\\dfrac{d}{dx} \\int f = f$.' },

  // S6 (쉬움) ∫0dx
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\int 0 \\, dx$', requiredSkills: SKILLS_CONST_INT,
    stem: '$\\int 0 \\, dx = ?$',
    options: [
      { key: 'A', text: '$C$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$C$ 누락' },
      { key: 'C', text: '$x + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\int 1$' },
      { key: 'D', text: '$1 + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '정의 X', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '정의됨' },
    ],
    solution: '상수 $0$ 적분은 $0 \\cdot x + C = C$.' },

  // S7 (중) ∫2xdx
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\int 2x \\, dx$', requiredSkills: SKILLS_POWER_INT,
    stem: '$\\int 2x \\, dx = ?$',
    options: [
      { key: 'A', text: '$x^2 + C$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$2x^2 + C$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '분모 누락' },
      { key: 'C', text: '$\\dfrac{x^2}{2} + C$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$2$ 곱 누락' },
      { key: 'D', text: '$2 + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '미분' },
      { key: 'E', text: '$x + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$\\int 2x \\, dx = 2 \\cdot \\dfrac{x^2}{2} + C = x^2 + C$.' },

  // S8 (중) ∫(x+1)dx
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\int (x + 1) \\, dx$', requiredSkills: SKILLS_SUM_INT,
    stem: '$\\int (x + 1) \\, dx = ?$',
    options: [
      { key: 'A', text: '$\\dfrac{x^2}{2} + x + C$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x^2 + x + C$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '분모 누락' },
      { key: 'C', text: '$\\dfrac{x^2}{2} + 1 + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '상수 잘못' },
      { key: 'D', text: '$1 + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '미분' },
      { key: 'E', text: '$\\dfrac{x^2 + x}{2} + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '분모 잘못' },
    ],
    solution: '$\\dfrac{x^2}{2} + x + C$.' },

  // S9 (중) ∫(2x²-x)dx
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\int (2x^2 - x) \\, dx$', requiredSkills: SKILLS_SUM_INT,
    stem: '$\\int (2x^2 - x) \\, dx = ?$',
    options: [
      { key: 'A', text: '$\\dfrac{2x^3}{3} - \\dfrac{x^2}{2} + C$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{2x^3}{3} + \\dfrac{x^2}{2} + C$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'C', text: '$2x^3 - x^2 + C$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '분모 누락' },
      { key: 'D', text: '$\\dfrac{x^3}{3} - \\dfrac{x^2}{2} + C$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$2$ 누락' },
      { key: 'E', text: '$4x - 1 + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '미분' },
    ],
    solution: '$2 \\cdot \\dfrac{x^3}{3} - \\dfrac{x^2}{2} + C$.' },

  // S10 (중) ∫₁²x²dx
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\int_1^2 x^2 \\, dx$', requiredSkills: SKILLS_DEF_INT,
    stem: '$\\int_1^2 x^2 \\, dx = ?$',
    options: [
      { key: 'A', text: '$\\dfrac{7}{3}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{8}{3}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$F(1)$ 빼기 누락' },
      { key: 'C', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$f(2) - f(1)$' },
      { key: 'D', text: '$\\dfrac{1}{3}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$F(2)$ 잘못' },
      { key: 'E', text: '$7$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '분모 누락' },
    ],
    solution: '$\\left[ \\dfrac{x^3}{3} \\right]_1^2 = \\dfrac{8}{3} - \\dfrac{1}{3} = \\dfrac{7}{3}$.' },

  // S11 (중) ∫₀³xdx
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\int_0^3 x \\, dx$', requiredSkills: SKILLS_DEF_INT,
    stem: '$\\int_0^3 x \\, dx = ?$',
    options: [
      { key: 'A', text: '$\\dfrac{9}{2}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$9$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '분모 누락' },
      { key: 'C', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$f(3)$' },
      { key: 'D', text: '$\\dfrac{3}{2}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'E', text: '$6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$\\left[ \\dfrac{x^2}{2} \\right]_0^3 = \\dfrac{9}{2}$.' },

  // S12 (중) ∫₀²3x²dx
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\int_0^2 3x^2 \\, dx$', requiredSkills: SKILLS_DEF_INT,
    stem: '$\\int_0^2 3x^2 \\, dx = ?$',
    options: [
      { key: 'A', text: '$8$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$12$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$f(2)$' },
      { key: 'C', text: '$\\dfrac{8}{3}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$3$ 곱 누락' },
      { key: 'D', text: '$24$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$\\left[ x^3 \\right]_0^2 = 8 - 0 = 8$.' },

  // S13 (중) ∫₁³2dx
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\int_1^3 2 \\, dx$', requiredSkills: SKILLS_DEF_INT,
    stem: '$\\int_1^3 2 \\, dx = ?$',
    options: [
      { key: 'A', text: '$4$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$f$ 자체' },
      { key: 'C', text: '$6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$2 \\cdot 3$' },
      { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2 \\cdot 4$' },
    ],
    solution: '$\\left[ 2x \\right]_1^3 = 6 - 2 = 4$. (직사각형 $2 \\times 2 = 4$.)' },

  // S14 (중) 구간 합성 성질
  { chapterCode: CODE, difficulty: 'medium', concept: '구간 분할 성질', requiredSkills: SKILLS_PROP,
    stem: '$\\int_a^b f + \\int_b^c f = ?$',
    options: [
      { key: 'A', text: '$\\int_a^c f$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\int_a^b f$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '한 구간만' },
      { key: 'C', text: '$\\int_c^a f$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '구간 뒤집' },
      { key: 'D', text: '$2 \\int_a^c f$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$\\int_b^c f$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '한 구간만' },
    ],
    solution: '정적분 구간 분할: $\\int_a^b + \\int_b^c = \\int_a^c$.' },

  // S15 (중) ∫구간 뒤집기
  { chapterCode: CODE, difficulty: 'medium', concept: '구간 뒤집기', requiredSkills: SKILLS_PROP,
    stem: '$\\int_b^a f(x) \\, dx = ?$',
    options: [
      { key: 'A', text: '$-\\int_a^b f(x) \\, dx$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\int_a^b f(x) \\, dx$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 누락' },
      { key: 'C', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$f(a) - f(b)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$\\dfrac{1}{\\int_a^b f}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$\\int_b^a f = -\\int_a^b f$ (구간 뒤집기 부호 바뀜).' },

  // S16 (어려움) ∫₀¹(2x+3)dx
  { chapterCode: CODE, difficulty: 'hard', concept: '$\\int_0^1 (2x + 3) \\, dx$', requiredSkills: SKILLS_DEF_INT,
    stem: '$\\int_0^1 (2x + 3) \\, dx = ?$',
    options: [
      { key: 'A', text: '$4$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$f(1)$' },
      { key: 'C', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$f(0)$' },
      { key: 'D', text: '$\\dfrac{7}{2}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$\\left[ x^2 + 3x \\right]_0^1 = (1 + 3) - 0 = 4$.' },

  // S17 (어려움) 넓이 ∫₀¹x²dx
  { chapterCode: CODE, difficulty: 'hard', concept: '$y = x^2$ 넓이 [0, 1]', requiredSkills: SKILLS_AREA,
    stem: '곡선 $y = x^2$ 와 $x = 0, x = 1$, $x$축 으로 둘러싸인 넓이?',
    options: [
      { key: 'A', text: '$\\dfrac{1}{3}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$f(1)$' },
      { key: 'C', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '삼각형' },
      { key: 'D', text: '$\\dfrac{2}{3}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'E', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '넓이 $= \\int_0^1 x^2 \\, dx = \\left[ \\dfrac{x^3}{3} \\right]_0^1 = \\dfrac{1}{3}$.' },

  // S18 (어려움) ∫₀²(x²-2x)dx
  { chapterCode: CODE, difficulty: 'hard', concept: '$\\int_0^2 (x^2 - 2x)$', requiredSkills: SKILLS_DEF_INT,
    stem: '$\\int_0^2 (x^2 - 2x) \\, dx = ?$',
    options: [
      { key: 'A', text: '$-\\dfrac{4}{3}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{4}{3}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'C', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$-4$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '분모 누락' },
      { key: 'E', text: '$-\\dfrac{8}{3}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '$\\left[ \\dfrac{x^3}{3} - x^2 \\right]_0^2 = \\dfrac{8}{3} - 4 = -\\dfrac{4}{3}$.' },

  // S19 (어려움) ∫f = x³+2x+C → f
  { chapterCode: CODE, difficulty: 'hard', concept: '부정적분에서 $f$ 복원', requiredSkills: SKILLS_RECOVER,
    stem: '$\\int f(x) \\, dx = x^3 + 2x + C$ 일 때 $f(x) = ?$',
    options: [
      { key: 'A', text: '$3x^2 + 2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x^3 + 2x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$F$ 자체' },
      { key: 'C', text: '$\\dfrac{x^4}{4} + x^2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '다시 적분' },
      { key: 'D', text: '$3x^2 + 2x$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$2x$ 잘못' },
      { key: 'E', text: '$3x + 2$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '지수 잘못' },
    ],
    solution: '$F(x) = x^3 + 2x + C$ 이면 $f(x) = F^{\\prime}(x) = 3x^2 + 2$.' },

  // S20 (어려움) 짝함수 대칭 ∫₋₂²x²dx
  { chapterCode: CODE, difficulty: 'hard', concept: '짝함수 대칭', requiredSkills: SKILLS_DEF_INT,
    stem: '$\\int_{-2}^2 x^2 \\, dx = ?$',
    options: [
      { key: 'A', text: '$\\dfrac{16}{3}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '홀함수와 혼동' },
      { key: 'C', text: '$\\dfrac{8}{3}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '대칭 활용 잘못' },
      { key: 'D', text: '$16$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '분모 누락' },
      { key: 'E', text: '$\\dfrac{4}{3}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '$x^2$ 는 짝함수. $\\int_{-2}^2 x^2 \\, dx = 2 \\int_0^2 x^2 \\, dx = 2 \\cdot \\dfrac{8}{3} = \\dfrac{16}{3}$.' },
];

export const K_G11_CAL1_CH03_INTEGRATION_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
