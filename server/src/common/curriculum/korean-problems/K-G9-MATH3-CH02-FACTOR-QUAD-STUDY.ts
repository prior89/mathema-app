/**
 * K-G9-MATH3-CH02-FACTOR-QUAD — STUDY pool (single-step, 20문제).
 * 인수분해와 이차방정식.
 * Mastery 3-step과 별도 변형 문제. 중3 (G9).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5. LLM 미사용.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G9-MATH3-CH02-FACTOR-QUAD';
const SKILLS_DIFF_SQ = ['difference_of_squares', 'a2_minus_b2'];
const SKILLS_PERFECT = ['perfect_square_factor', 'a_plus_b_squared'];
const SKILLS_TRINOMIAL = ['quadratic_trinomial', 'find_two_numbers'];
const SKILLS_LEADING = ['leading_coefficient_not_one', 'cross_multiplication'];
const SKILLS_COMMON = ['common_factor', 'factor_out'];
const SKILLS_QUAD_BASIC = ['quadratic_equation', 'factoring_to_solve'];
const SKILLS_ZERO = ['zero_product_property', 'factor_zero'];
const SKILLS_FORMULA = ['quadratic_formula', 'discriminant'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) x²-16
  { chapterCode: CODE, difficulty: 'easy', concept: '합·차 인수분해 ($16$)', requiredSkills: SKILLS_DIFF_SQ,
    stem: '$x^2 - 16$ 를 인수분해하면?',
    options: [
      { key: 'A', text: '$(x + 4)(x - 4)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(x - 4)^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '완전제곱과 혼동' },
      { key: 'C', text: '$(x + 4)^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '완전제곱과 혼동' },
      { key: 'D', text: '$(x + 8)(x - 2)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 곱' },
      { key: 'E', text: '$(x - 16)(x + 1)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 인수' },
    ],
    solution: '$a^2 - b^2 = (a+b)(a-b)$. $x^2 - 16 = (x+4)(x-4)$.' },

  // S2 (쉬움) x²+8x+16
  { chapterCode: CODE, difficulty: 'easy', concept: '완전제곱식 $(a+b)^2$', requiredSkills: SKILLS_PERFECT,
    stem: '$x^2 + 8x + 16$ 를 인수분해하면?',
    options: [
      { key: 'A', text: '$(x + 4)^2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(x - 4)^2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '중간항 부호 잘못' },
      { key: 'C', text: '$(x + 4)(x - 4)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합·차 적용' },
      { key: 'D', text: '$(x + 8)^2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\sqrt{16} = 4$ 인데 $8$' },
      { key: 'E', text: '$(x + 2)(x + 8)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 인수' },
    ],
    solution: '$x^2 + 2 \\cdot 4 \\cdot x + 4^2 = (x + 4)^2$.' },

  // S3 (쉬움) x²-6x+9
  { chapterCode: CODE, difficulty: 'easy', concept: '완전제곱식 $(a-b)^2$', requiredSkills: SKILLS_PERFECT,
    stem: '$x^2 - 6x + 9$ 인수분해?',
    options: [
      { key: 'A', text: '$(x - 3)^2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(x + 3)^2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '중간항 부호 잘못' },
      { key: 'C', text: '$(x - 3)(x + 3)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합·차 적용' },
      { key: 'D', text: '$(x - 9)^2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\sqrt{9}=3$인데 $9$' },
      { key: 'E', text: '$(x - 6)(x - 1)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 인수' },
    ],
    solution: '$x^2 - 2 \\cdot 3 \\cdot x + 3^2 = (x - 3)^2$.' },

  // S4 (쉬움) x²+7x+10
  { chapterCode: CODE, difficulty: 'easy', concept: '삼항식 (양수)', requiredSkills: SKILLS_TRINOMIAL,
    stem: '$x^2 + 7x + 10$ 인수분해?',
    options: [
      { key: 'A', text: '$(x + 2)(x + 5)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(x + 1)(x + 10)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '곱은 $10$이지만 합 $\\neq 7$' },
      { key: 'C', text: '$(x - 2)(x - 5)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'D', text: '$(x + 3)(x + 4)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합 $7$이지만 곱 $\\neq 10$' },
      { key: 'E', text: '$(x - 2)(x + 5)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '곱 $-10$' },
    ],
    solution: '합 $7$, 곱 $10$ → $2, 5$. $(x+2)(x+5)$.' },

  // S5 (쉬움) x²-9x+20
  { chapterCode: CODE, difficulty: 'easy', concept: '삼항식 (음수)', requiredSkills: SKILLS_TRINOMIAL,
    stem: '$x^2 - 9x + 20$ 인수분해?',
    options: [
      { key: 'A', text: '$(x - 4)(x - 5)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(x + 4)(x + 5)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못 (중간항 음수 필요)' },
      { key: 'C', text: '$(x - 2)(x - 10)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합 $-12$ 잘못' },
      { key: 'D', text: '$(x - 1)(x - 20)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합 $-21$' },
      { key: 'E', text: '$(x + 4)(x - 5)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '곱 $-20$' },
    ],
    solution: '합 $-9$, 곱 $+20$ → $-4, -5$. $(x-4)(x-5)$.' },

  // S6 (쉬움) 공통인수
  { chapterCode: CODE, difficulty: 'easy', concept: '공통인수 추출', requiredSkills: SKILLS_COMMON,
    stem: '$3x^2 + 6x$ 를 인수분해하면?',
    options: [
      { key: 'A', text: '$3x(x + 2)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3(x^2 + 2x)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$x$ 추출 누락' },
      { key: 'C', text: '$x(3x + 6)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$3$ 추출 누락' },
      { key: 'D', text: '$3x(x + 6)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$6/3 = 2$인데 $6$' },
      { key: 'E', text: '$3x^2 + 6x$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '인수분해 안 함' },
    ],
    solution: '공통인수 $3x$. $3x^2 + 6x = 3x(x + 2)$.' },

  // S7 (중) x²+8x+15
  { chapterCode: CODE, difficulty: 'medium', concept: '삼항식 인수분해', requiredSkills: SKILLS_TRINOMIAL,
    stem: '$x^2 + 8x + 15$ 인수분해?',
    options: [
      { key: 'A', text: '$(x + 3)(x + 5)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(x + 1)(x + 15)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합 $16$' },
      { key: 'C', text: '$(x - 3)(x - 5)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'D', text: '$(x + 2)(x + 6)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '곱 $12$' },
      { key: 'E', text: '$(x + 4)(x + 4)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '곱 $16$' },
    ],
    solution: '합 $8$, 곱 $15$ → $3, 5$. $(x+3)(x+5)$.' },

  // S8 (중) 선행계수 ≠1
  { chapterCode: CODE, difficulty: 'medium', concept: '선행계수 $\\neq 1$ 인수분해', requiredSkills: SKILLS_LEADING,
    stem: '$2x^2 + 7x + 3$ 인수분해?',
    options: [
      { key: 'A', text: '$(2x + 1)(x + 3)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(2x + 3)(x + 1)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '중간항 $5x$로 잘못' },
      { key: 'C', text: '$2(x + 1)(x + 3)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$2$ 추출 잘못' },
      { key: 'D', text: '$(x + 1)(2x + 3)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '중간항 $5x$' },
      { key: 'E', text: '$(2x + 7)(x + 0)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
    ],
    solution: '$(2x + 1)(x + 3) = 2x^2 + 6x + x + 3 = 2x^2 + 7x + 3$.' },

  // S9 (중) x²=16
  { chapterCode: CODE, difficulty: 'medium', concept: '이차방정식 ($x^2 = 16$)', requiredSkills: SKILLS_QUAD_BASIC,
    stem: '$x^2 = 16$ 의 해는?',
    options: [
      { key: 'A', text: '$x = \\pm 4$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = 4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '음수 해 누락' },
      { key: 'C', text: '$x = 16$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '제곱근 안 풂' },
      { key: 'D', text: '$x = \\pm 8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$16/2$ 잘못' },
      { key: 'E', text: '$x = -4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '양수 해 누락' },
    ],
    solution: '$x = \\pm \\sqrt{16} = \\pm 4$.' },

  // S10 (중) 공통인수 이차방정식
  { chapterCode: CODE, difficulty: 'medium', concept: '공통인수 이차방정식', requiredSkills: SKILLS_ZERO,
    stem: '$x^2 - 9x = 0$ 의 해는?',
    options: [
      { key: 'A', text: '$x = 0$ 또는 $x = 9$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = 9$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$x = 0$ 누락' },
      { key: 'C', text: '$x = 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$x = 9$ 누락' },
      { key: 'D', text: '$x = \\pm 9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x^2 = 81$로 잘못' },
      { key: 'E', text: '$x = -9$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
    ],
    solution: '$x(x - 9) = 0 \\to x = 0$ 또는 $x = 9$.' },

  // S11 (중) 음수 곱 이차방정식
  { chapterCode: CODE, difficulty: 'medium', concept: '인수분해 풀이 (음수 곱)', requiredSkills: SKILLS_QUAD_BASIC,
    stem: '$x^2 - 3x - 10 = 0$ 의 해는?',
    options: [
      { key: 'A', text: '$x = 5$ 또는 $x = -2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = -5$ 또는 $x = 2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'C', text: '$x = 5$ 또는 $x = 2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '곱 $10$인데 부호 잘못' },
      { key: 'D', text: '$x = -5$ 또는 $x = -2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '둘 다 음수 잘못' },
      { key: 'E', text: '$x = \\pm 10$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '인수분해 미적용' },
    ],
    solution: '$(x - 5)(x + 2) = 0 \\to x = 5$ 또는 $x = -2$.' },

  // S12 (중) x²+x-12=0
  { chapterCode: CODE, difficulty: 'medium', concept: '인수분해 풀이 ($-12$ 곱)', requiredSkills: SKILLS_QUAD_BASIC,
    stem: '$x^2 + x - 12 = 0$ 의 해는?',
    options: [
      { key: 'A', text: '$x = 3$ 또는 $x = -4$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = -3$ 또는 $x = 4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'C', text: '$x = 6$ 또는 $x = -2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합 $4$인데 $1$ 필요' },
      { key: 'D', text: '$x = 2$ 또는 $x = -6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합 $-4$' },
      { key: 'E', text: '$x = \\pm 12$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '인수분해 미적용' },
    ],
    solution: '$(x + 4)(x - 3) = 0 \\to x = -4$ 또는 $x = 3$. (합 $1$, 곱 $-12$ → $4, -3$.)' },

  // S13 (중) 근의 공식
  { chapterCode: CODE, difficulty: 'medium', concept: '근의 공식 적용', requiredSkills: SKILLS_FORMULA,
    stem: '근의 공식으로 $x^2 - 3x - 4 = 0$ 의 해는?',
    options: [
      { key: 'A', text: '$x = 4$ 또는 $x = -1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = -4$ 또는 $x = 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'C', text: '$x = 2$ 또는 $x = 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
      { key: 'D', text: '$x = \\pm 4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 형식' },
      { key: 'E', text: '해 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '판별식 $> 0$' },
    ],
    solution: '$D = 9 + 16 = 25$. $x = \\dfrac{3 \\pm 5}{2}$ → $x = 4$ 또는 $-1$.' },

  // S14 (중) 3x²+5x-2=0
  { chapterCode: CODE, difficulty: 'medium', concept: '선행계수 분해 이차방정식', requiredSkills: SKILLS_LEADING,
    stem: '$3x^2 + 5x - 2 = 0$ 의 해는?',
    options: [
      { key: 'A', text: '$x = \\dfrac{1}{3}$ 또는 $x = -2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = -\\dfrac{1}{3}$ 또는 $x = 2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 모두 잘못' },
      { key: 'C', text: '$x = 1$ 또는 $x = -2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '계수 $3$ 나눗셈 누락' },
      { key: 'D', text: '$x = 3$ 또는 $x = -2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '계수 곱셈으로 잘못' },
      { key: 'E', text: '$x = \\pm 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 형식' },
    ],
    solution: '$(3x - 1)(x + 2) = 0 \\to x = 1/3$ 또는 $x = -2$.' },

  // S15 (중) 판별식 < 0
  { chapterCode: CODE, difficulty: 'medium', concept: '판별식 $< 0$ — 실근 없음', requiredSkills: SKILLS_FORMULA,
    stem: '판별식 $b^2 - 4ac < 0$ 이면 이차방정식의 해는?',
    options: [
      { key: 'A', text: '실근이 없다', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '서로 다른 두 실근', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$D > 0$ 일 때' },
      { key: 'C', text: '중근 (한 실근)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$D = 0$ 일 때' },
      { key: 'D', text: '항상 양수 해', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '판별식 부호와 무관' },
      { key: 'E', text: '실근이 $3$개', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '이차방정식은 최대 $2$ 실근' },
    ],
    solution: '$D < 0$ → 판별식 음수 → 제곱근 음수 → 실수 해 없음.' },

  // S16 (어려움) x²-8x+15=0
  { chapterCode: CODE, difficulty: 'hard', concept: '인수분해 이차방정식', requiredSkills: SKILLS_QUAD_BASIC,
    stem: '$x^2 - 8x + 15 = 0$ 의 해는?',
    options: [
      { key: 'A', text: '$x = 3$ 또는 $x = 5$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = -3$ 또는 $x = -5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'C', text: '$x = 1$ 또는 $x = 15$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합 $16$이 아닌 $8$' },
      { key: 'D', text: '$x = \\pm \\sqrt{15}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '인수분해 미적용' },
      { key: 'E', text: '$x = 4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '중근 가정' },
    ],
    solution: '$(x - 3)(x - 5) = 0$ → $x = 3$ 또는 $5$.' },

  // S17 (어려움) 중근
  { chapterCode: CODE, difficulty: 'hard', concept: '완전제곱식 중근', requiredSkills: SKILLS_FORMULA,
    stem: '$4x^2 - 4x + 1 = 0$ 의 해는?',
    options: [
      { key: 'A', text: '$x = \\dfrac{1}{2}$ (중근)', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = \\pm \\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '중근인데 두 해 답함' },
      { key: 'C', text: '$x = 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
      { key: 'D', text: '실근 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$D = 0$ → 중근' },
      { key: 'E', text: '$x = 1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 인수' },
    ],
    solution: '$(2x - 1)^2 = 0 \\to x = 1/2$ (중근). 또는 $D = 16 - 16 = 0$.' },

  // S18 (어려움) 2x²-x-3=0
  { chapterCode: CODE, difficulty: 'hard', concept: '선행계수 분해 (분수 해)', requiredSkills: SKILLS_LEADING,
    stem: '$2x^2 - x - 3 = 0$ 의 해는?',
    options: [
      { key: 'A', text: '$x = \\dfrac{3}{2}$ 또는 $x = -1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = -\\dfrac{3}{2}$ 또는 $x = 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'C', text: '$x = 3$ 또는 $x = -1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '계수 $2$ 나눗셈 누락' },
      { key: 'D', text: '$x = \\pm 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 형식' },
      { key: 'E', text: '$x = \\dfrac{1}{2}$ 또는 $x = 3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '인수 잘못' },
    ],
    solution: '$(2x - 3)(x + 1) = 0 \\to x = 3/2$ 또는 $x = -1$.' },

  // S19 (어려움) 근의 공식 (무리수)
  { chapterCode: CODE, difficulty: 'hard', concept: '근의 공식 (무리수 해)', requiredSkills: SKILLS_FORMULA,
    stem: '근의 공식으로 $x^2 - 4x + 1 = 0$ 의 해는?',
    options: [
      { key: 'A', text: '$x = 2 \\pm \\sqrt{3}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = -2 \\pm \\sqrt{3}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-b$ 부호 잘못' },
      { key: 'C', text: '$x = 2 \\pm \\sqrt{12}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\sqrt{12}/2 = \\sqrt{3}$ 누락' },
      { key: 'D', text: '$x = 4 \\pm \\sqrt{3}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$-b$ 그대로 $4$' },
      { key: 'E', text: '실근 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$D = 12 > 0$' },
    ],
    solution: '$D = 16 - 4 = 12$. $x = \\dfrac{4 \\pm \\sqrt{12}}{2} = \\dfrac{4 \\pm 2\\sqrt{3}}{2} = 2 \\pm \\sqrt{3}$.' },

  // S20 (어려움) 판별식으로 해 종류
  { chapterCode: CODE, difficulty: 'hard', concept: '판별식으로 해의 종류', requiredSkills: SKILLS_FORMULA,
    stem: '$2x^2 - 3x + 5 = 0$ 의 해의 종류는?',
    options: [
      { key: 'A', text: '실근이 없다 ($D < 0$)', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '서로 다른 두 실근', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$D = 9 - 40 = -31 < 0$' },
      { key: 'C', text: '중근', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$D = 0$ 아님' },
      { key: 'D', text: '항상 양수 해', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '실근 자체가 없음' },
      { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$D$로 판별 가능' },
    ],
    solution: '$D = (-3)^2 - 4 \\cdot 2 \\cdot 5 = 9 - 40 = -31 < 0$ → 실근 없음.' },
];

export const K_G9_MATH3_CH02_FACTOR_QUAD_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
