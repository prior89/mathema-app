/**
 * K-G11-CAL1-CH02-DIFFERENTIATION — STUDY pool (single-step, 20문제).
 * 미분 — 평균변화율, 도함수, 미분 법칙, 접선의 방정식.
 * Mastery 3-step과 별도 변형 문제. 고2 미적분Ⅰ (G11).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5. LLM 미사용.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G11-CAL1-CH02-DIFFERENTIATION';
const SKILLS_AVG = ['average_rate_of_change'];
const SKILLS_POWER = ['power_rule'];
const SKILLS_CONST = ['constant_derivative'];
const SKILLS_SUM = ['sum_rule'];
const SKILLS_VALUE = ['derivative_at_point'];
const SKILLS_DEF = ['derivative_definition'];
const SKILLS_PRODUCT = ['product_expansion'];
const SKILLS_TANGENT = ['tangent_line_slope', 'tangent_line_equation'];
const SKILLS_GEO = ['derivative_geometric_meaning'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) 평균변화율 공식
  { chapterCode: CODE, difficulty: 'easy', concept: '평균변화율 공식', requiredSkills: SKILLS_AVG,
    stem: '구간 $[a, b]$ ($a \\neq b$) 에서 함수 $f$ 의 평균변화율?',
    options: [
      { key: 'A', text: '$\\dfrac{f(b) - f(a)}{b - a}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{b - a}{f(b) - f(a)}$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '뒤집음' },
      { key: 'C', text: '$f(b) - f(a)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '분모 누락' },
      { key: 'D', text: '$\\dfrac{f(a + b)}{a + b}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$\\dfrac{f(b) + f(a)}{b + a}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '평균변화율 $= \\dfrac{\\Delta y}{\\Delta x} = \\dfrac{f(b) - f(a)}{b - a}$.' },

  // S2 (쉬움) 평균변화율 계산
  { chapterCode: CODE, difficulty: 'easy', concept: '평균변화율 ($x^2$, [2, 4])', requiredSkills: SKILLS_AVG,
    stem: '$f(x) = x^2$ 의 $[2, 4]$ 에서 평균변화율?',
    options: [
      { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$f^{\\prime}(2)$' },
      { key: 'C', text: '$8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$f^{\\prime}(4)$' },
      { key: 'D', text: '$12$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '분모 누락' },
      { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '$\\dfrac{16 - 4}{4 - 2} = \\dfrac{12}{2} = 6$.' },

  // S3 (쉬움) (x⁴)'
  { chapterCode: CODE, difficulty: 'easy', concept: '$(x^4)^{\\prime}$', requiredSkills: SKILLS_POWER,
    stem: '$(x^4)^{\\prime} = ?$',
    options: [
      { key: 'A', text: '$4x^3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x^3$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '계수 누락' },
      { key: 'C', text: '$4x^4$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '지수 그대로' },
      { key: 'D', text: '$x^5$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$+1$ 잘못' },
      { key: 'E', text: '$4$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$x^3$ 누락' },
    ],
    solution: '$(x^n)^{\\prime} = nx^{n-1}$. $(x^4)^{\\prime} = 4x^3$.' },

  // S4 (쉬움) (x⁵)'
  { chapterCode: CODE, difficulty: 'easy', concept: '$(x^5)^{\\prime}$', requiredSkills: SKILLS_POWER,
    stem: '$(x^5)^{\\prime} = ?$',
    options: [
      { key: 'A', text: '$5x^4$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$5x^5$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '지수 그대로' },
      { key: 'C', text: '$x^4$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '계수 누락' },
      { key: 'D', text: '$5x^6$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$+1$' },
      { key: 'E', text: '$5$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$x^4$ 누락' },
    ],
    solution: '$(x^5)^{\\prime} = 5x^4$.' },

  // S5 (쉬움) (-3)'
  { chapterCode: CODE, difficulty: 'easy', concept: '상수 미분', requiredSkills: SKILLS_CONST,
    stem: '$(-3)^{\\prime} = ?$',
    options: [
      { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$-3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '상수 자체' },
      { key: 'C', text: '$3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'D', text: '$-1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '정의 X', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '정의됨' },
    ],
    solution: '상수의 미분은 $0$.' },

  // S6 (쉬움) 도함수 의미
  { chapterCode: CODE, difficulty: 'easy', concept: '도함수 정의', requiredSkills: SKILLS_GEO,
    stem: '$f(x)$ 의 도함수 $f^{\\prime}(x)$ 의 기하학적 의미?',
    options: [
      { key: 'A', text: '각 $x$ 에서 접선의 기울기', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '함수의 평균값', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'C', text: '함수의 적분', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '반대 연산' },
      { key: 'D', text: '함수의 최댓값', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '함수 그 자체', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$f^{\\prime}(x)$ = 점 $(x, f(x))$ 에서 접선의 기울기.' },

  // S7 (중) (3x²)'
  { chapterCode: CODE, difficulty: 'medium', concept: '상수배 + power rule', requiredSkills: SKILLS_POWER,
    stem: '$f(x) = 3x^2$ → $f^{\\prime}(x) = ?$',
    options: [
      { key: 'A', text: '$6x$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3x$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '지수 곱 누락' },
      { key: 'C', text: '$6x^2$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '지수 그대로' },
      { key: 'D', text: '$3$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$x$ 누락' },
      { key: 'E', text: '$3x^2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원함수' },
    ],
    solution: '$(c \\cdot x^n)^{\\prime} = c n x^{n-1}$. $(3x^2)^{\\prime} = 6x$.' },

  // S8 (중) (x³+2x²)'
  { chapterCode: CODE, difficulty: 'medium', concept: '합 미분', requiredSkills: SKILLS_SUM,
    stem: '$f(x) = x^3 + 2x^2$ → $f^{\\prime}(x) = ?$',
    options: [
      { key: 'A', text: '$3x^2 + 4x$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3x^2 + 2x$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '계수 곱 누락' },
      { key: 'C', text: '$x^2 + 4x$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$3$ 누락' },
      { key: 'D', text: '$3x^3 + 4x^2$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '지수 그대로' },
      { key: 'E', text: '$3x + 4$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '지수 한 단계 더' },
    ],
    solution: '$(x^3)^{\\prime} + (2x^2)^{\\prime} = 3x^2 + 4x$.' },

  // S9 (중) (2x⁴-x²+5)'
  { chapterCode: CODE, difficulty: 'medium', concept: '다항식 미분', requiredSkills: SKILLS_SUM,
    stem: '$f(x) = 2x^4 - x^2 + 5$ → $f^{\\prime}(x) = ?$',
    options: [
      { key: 'A', text: '$8x^3 - 2x$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$8x^3 - 2x + 5$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '상수 미분 $\\neq 5$' },
      { key: 'C', text: '$8x^4 - 2x^2$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '지수 그대로' },
      { key: 'D', text: '$2x^3 - x$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '계수 곱 누락' },
      { key: 'E', text: '$8x^3 + 2x$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
    ],
    solution: '$8x^3 - 2x + 0$.' },

  // S10 (중) f'(1) = 3
  { chapterCode: CODE, difficulty: 'medium', concept: '$f^{\\prime}(1)$', requiredSkills: SKILLS_VALUE,
    stem: '$f(x) = x^2 + x$ → $f^{\\prime}(1) = ?$',
    options: [
      { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'C', text: '$2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '한 항만' },
      { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '$f^{\\prime}(x) = 2x + 1$. $f^{\\prime}(1) = 3$.' },

  // S11 (중) f'(3) = 12
  { chapterCode: CODE, difficulty: 'medium', concept: '$f^{\\prime}(3)$', requiredSkills: SKILLS_VALUE,
    stem: '$f(x) = 2x^2$ → $f^{\\prime}(3) = ?$',
    options: [
      { key: 'A', text: '$12$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$18$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$f(3)$' },
      { key: 'C', text: '$6$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$2$ 누락' },
      { key: 'D', text: '$4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$f^{\\prime}(1)$' },
      { key: 'E', text: '$9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$f^{\\prime}(x) = 4x$. $f^{\\prime}(3) = 12$.' },

  // S12 (중) 미분계수 정의식 (분수)
  { chapterCode: CODE, difficulty: 'medium', concept: '미분계수 정의식', requiredSkills: SKILLS_DEF,
    stem: '$f^{\\prime}(a)$ 의 정의 (h-극한)?',
    options: [
      { key: 'A', text: '$\\lim_{h \\to 0} \\dfrac{f(a + h) - f(a)}{h}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\lim_{h \\to 0} \\dfrac{f(a) - f(a + h)}{h}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'C', text: '$\\dfrac{f(a + h) - f(a)}{h}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '극한 누락' },
      { key: 'D', text: '$f(a)$ 자체', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '함숫값' },
      { key: 'E', text: '$\\lim_{h \\to \\infty} \\dfrac{f(a + h) - f(a)}{h}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$h \\to 0$' },
    ],
    solution: '$f^{\\prime}(a) = \\lim_{h \\to 0} \\dfrac{f(a + h) - f(a)}{h}$.' },

  // S13 (중) 곱의 전개 후 미분
  { chapterCode: CODE, difficulty: 'medium', concept: '$(x-1)(x+2)$ 미분', requiredSkills: SKILLS_PRODUCT,
    stem: '$f(x) = (x - 1)(x + 2)$ → $f^{\\prime}(x) = ?$',
    options: [
      { key: 'A', text: '$2x + 1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$2x - 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '전개 잘못' },
      { key: 'C', text: '$2x - 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'D', text: '$x^2 + x - 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원 함수' },
      { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$f(x) = x^2 + x - 2$. $f^{\\prime}(x) = 2x + 1$.' },

  // S14 (중) 접선 기울기 (x=2)
  { chapterCode: CODE, difficulty: 'medium', concept: '접선 기울기 ($f^{\\prime}(2)$)', requiredSkills: SKILLS_TANGENT,
    stem: '$f(x) = x^2$ 의 $x = 2$ 에서 접선 기울기?',
    options: [
      { key: 'A', text: '$4$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$2x$만' },
      { key: 'C', text: '$8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'D', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '잘못' },
    ],
    solution: '$f^{\\prime}(x) = 2x$. $f^{\\prime}(2) = 4$.' },

  // S15 (중) f'(0) = 1
  { chapterCode: CODE, difficulty: 'medium', concept: '$f^{\\prime}(0)$', requiredSkills: SKILLS_VALUE,
    stem: '$f(x) = x^3 + x$ → $f^{\\prime}(0) = ?$',
    options: [
      { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$x$ 항만 보고' },
      { key: 'C', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$3x^2 + 1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$0$ 대입 안 함' },
      { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '$f^{\\prime}(x) = 3x^2 + 1$. $f^{\\prime}(0) = 1$.' },

  // S16 (어려움) 접선 방정식
  { chapterCode: CODE, difficulty: 'hard', concept: '접선 방정식 ($x = 2$)', requiredSkills: SKILLS_TANGENT,
    stem: '$f(x) = x^2$ 의 $x = 2$ 에서 접선의 방정식?',
    options: [
      { key: 'A', text: '$y = 4x - 4$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$y = 4x + 4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$y$절편 부호 잘못' },
      { key: 'C', text: '$y = 4x$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$y$절편 누락' },
      { key: 'D', text: '$y = 2x - 4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '기울기 잘못' },
      { key: 'E', text: '$y = 4x - 8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '$f^{\\prime}(2) = 4$, 접점 $(2, 4)$. $y - 4 = 4(x - 2) \\to y = 4x - 4$.' },

  // S17 (어려움) 미분계수 → b
  { chapterCode: CODE, difficulty: 'hard', concept: '$f^{\\prime}(2) = 5$ → $b$', requiredSkills: SKILLS_VALUE,
    stem: '$f(x) = x^2 + bx + 1$ 이 $f^{\\prime}(2) = 5$. $b$?',
    options: [
      { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$-1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'C', text: '$5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '주어진 값' },
      { key: 'D', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '$f^{\\prime}(x) = 2x + b$. $f^{\\prime}(2) = 4 + b = 5 \\to b = 1$.' },

  // S18 (어려움) 정의로 미분계수
  { chapterCode: CODE, difficulty: 'hard', concept: '정의로 $f^{\\prime}(3)$', requiredSkills: SKILLS_DEF,
    stem: '$f(x) = x^2$ 의 $x = 3$ 에서 미분계수를 정의로 구하면?',
    options: [
      { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$f(3)$' },
      { key: 'C', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$\\lim_{h \\to 0} \\dfrac{(3+h)^2 - 9}{h} = \\lim \\dfrac{6h + h^2}{h} = 6$.' },

  // S19 (어려움) 곱 미분 (전개)
  { chapterCode: CODE, difficulty: 'hard', concept: '$x(x^2 + 1)$ 미분', requiredSkills: SKILLS_PRODUCT,
    stem: '$f(x) = x(x^2 + 1)$ → $f^{\\prime}(x) = ?$',
    options: [
      { key: 'A', text: '$3x^2 + 1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x^2 + 1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$x$ 미분 누락' },
      { key: 'C', text: '$3x^2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$+ 1$ 누락' },
      { key: 'D', text: '$2x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$x^3 + x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원 함수' },
    ],
    solution: '$f(x) = x^3 + x$. $f^{\\prime}(x) = 3x^2 + 1$.' },

  // S20 (어려움) 수평 접선
  { chapterCode: CODE, difficulty: 'hard', concept: '수평 접선 조건', requiredSkills: SKILLS_VALUE,
    stem: '$f(x) = x^3 - 12x$ 의 $x = 2$ 에서 접선의 기울기?',
    options: [
      { key: 'A', text: '$0$ (수평 접선)', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$12$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$3x^2$ 만' },
      { key: 'C', text: '$-8$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$f(2)$' },
      { key: 'D', text: '$24$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$-12$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$3x^2$ 누락' },
    ],
    solution: '$f^{\\prime}(x) = 3x^2 - 12$. $f^{\\prime}(2) = 12 - 12 = 0$.' },
];

export const K_G11_CAL1_CH02_DIFFERENTIATION_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
