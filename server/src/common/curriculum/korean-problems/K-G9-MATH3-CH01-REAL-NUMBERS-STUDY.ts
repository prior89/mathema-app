/**
 * K-G9-MATH3-CH01-REAL-NUMBERS — STUDY pool (single-step, 20문제).
 * 실수와 그 연산 — 제곱근, 무리수, 근 사칙, 유리화.
 * Mastery 3-step과 별도 변형 문제. 중3 (G9).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5. LLM 미사용.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G9-MATH3-CH01-REAL-NUMBERS';
const SKILLS_BASIC = ['square_root_basic', 'perfect_square_root'];
const SKILLS_DEF = ['rational_irrational_definition', 'real_number_definition'];
const SKILLS_SIMPLIFY = ['radical_simplification', 'factor_out_perfect_square'];
const SKILLS_ARITH = ['radical_addition', 'like_radicals'];
const SKILLS_MULT = ['radical_multiplication', 'radical_division'];
const SKILLS_RATIONALIZE = ['rationalize_denominator', 'conjugate_multiplication'];
const SKILLS_FORMULA = ['binomial_with_radicals', 'difference_of_squares_radical'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) √25
  { chapterCode: CODE, difficulty: 'easy', concept: '제곱근 (제곱수)', requiredSkills: SKILLS_BASIC,
    stem: '$\\sqrt{25}$ 의 값은?',
    options: [
      { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\pm 5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '이는 SIGN_ERROR다. 학생은 $\\sqrt{ }$ 기호가 양의 제곱근만을 의미한다는 점을 놓치고 ±를 자동으로 붙였다. 제곱근 기호는 원리적으로 비음수(≥0) 결과를 내기 때문에 음수 답은 불가능하다. (exemplar: signError for roots)' },
      { key: 'C', text: '$25$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '이는 CONCEPT_MISUNDERSTANDING다. 학생은 제곱근을 적용하지 않고 원래 수를 그대로 답으로 선택했다. $\\sqrt{x}$ 는 x를 제곱해서 만드는 수의 역연산임을 잊었다. 다음에는 "이 수의 제곱이 25인가?"를 먼저 확인하자.' },
      { key: 'D', text: '$12.5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '이는 FORMULA_SELECTION_ERROR다. 학생은 제곱근을 "절반"으로 착각하고 /2 연산을 잘못 적용했다. 제곱근은 제곱의 역이므로 25의 제곱근은 5다.' },
      { key: 'E', text: '$-5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '이는 SIGN_ERROR다. 학생은 제곱근 결과에 음수 부호를 강제로 붙였다. 실제 $\\sqrt{25} = 5$ (양수)이고, $-\\sqrt{25} = -5$는 별도의 표현이다. 기호의 의미를 정확히 구분하자.' },
    ],
    solution: '$5^2 = 25$ → $\\sqrt{25} = 5$.' },

  // S2 (쉬움) √36
  { chapterCode: CODE, difficulty: 'easy', concept: '제곱근 ($36$)', requiredSkills: SKILLS_BASIC,
    stem: '$\\sqrt{36}$ 의 값은?',
    options: [
      { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$18$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '이는 FORMULA_SELECTION_ERROR다. 학생은 제곱근을 "반으로 나누기"로 착각했다. $\\sqrt{36} = 6$이지 18이 아니다. 제곱근은 제곱의 역연산임을 기억하자.' },
      { key: 'C', text: '$\\pm 6$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '이는 SIGN_ERROR다. 학생은 제곱근 기호에 ±를 자동으로 붙였다. $\\sqrt{ }$는 비음수 결과만을 의미한다. $-\\sqrt{36}$가 별도의 음수 표현이다.' },
      { key: 'D', text: '$36$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '이는 CONCEPT_MISUNDERSTANDING다. 학생은 제곱근을 적용하지 않고 원래 수를 답으로 골랐다. "제곱해서 36이 되는 수"를 찾는 문제임을 잊었다.' },
      { key: 'E', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '이는 ARITHMETIC_ERROR다. 학생은 $\\sqrt{25}=5$와 혼동했다. 36의 제곱근은 6이다. 완전제곱수 표를 외우거나 계산으로 확인하자.' },
    ],
    solution: '$6^2 = 36$ → $\\sqrt{36} = 6$.' },

  // S3 (쉬움) √100
  { chapterCode: CODE, difficulty: 'easy', concept: '제곱근 ($100$)', requiredSkills: SKILLS_BASIC,
    stem: '$\\sqrt{100}$ 의 값은?',
    options: [
      { key: 'A', text: '$10$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$50$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$/2$ 잘못' },
      { key: 'C', text: '$100$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '제곱근 미적용' },
      { key: 'D', text: '$\\sqrt{10}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '한 번만 적용' },
      { key: 'E', text: '$20$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 추측' },
    ],
    solution: '$10^2 = 100$ → $\\sqrt{100} = 10$.' },

  // S4 (쉬움) -√4
  { chapterCode: CODE, difficulty: 'easy', concept: '음의 제곱근', requiredSkills: SKILLS_BASIC,
    stem: '$-\\sqrt{4}$ 의 값은?',
    options: [
      { key: 'A', text: '$-2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '음수 부호 누락' },
      { key: 'C', text: '$\\pm 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$-\\sqrt{\\ }$는 음수 하나' },
      { key: 'D', text: '$-4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '제곱근 미적용' },
      { key: 'E', text: '$-\\sqrt{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sqrt{4}$ 단순화 안 함' },
    ],
    solution: '$\\sqrt{4} = 2$ → $-\\sqrt{4} = -2$.' },

  // S5 (쉬움) 유리수 식별
  { chapterCode: CODE, difficulty: 'easy', concept: '유리수 식별', requiredSkills: SKILLS_DEF,
    stem: '다음 중 유리수인 것은?',
    options: [
      { key: 'A', text: '$\\sqrt{9}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\sqrt{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '이는 CONCEPT_MISUNDERSTANDING다. 학생은 모든 제곱근이 유리수라고 착각했다. $\\sqrt{2}$는 순환하지 않는 무한소수로 무리수다. 완전제곱수(9,16,25...)의 제곱근만 유리수임을 구분하자.' },
      { key: 'C', text: '$\\sqrt{5}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '이는 CONCEPT_MISUNDERSTANDING다. $\\sqrt{5}$ 역시 무리수 (비완전제곱수). "제곱근 = 유리수"라는 과도한 일반화 오류다.' },
      { key: 'D', text: '$\\sqrt{7}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '이는 CONCEPT_MISUNDERSTANDING다. 무리수 제곱근을 유리수로 분류했다. 7은 완전제곱수가 아니다.' },
      { key: 'E', text: '$\\pi$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '이는 CONCEPT_MISUNDERSTANDING다. π는 무리수지만 "제곱근" 문제와 무관하다. 문제는 제곱근 중 유리수를 찾는 것이다.' },
    ],
    solution: '$\\sqrt{9} = 3$ (정수, 유리수). 나머지는 무리수.' },

  // S6 (쉬움) 0의 분류
  { chapterCode: CODE, difficulty: 'easy', concept: '$0$의 수 분류', requiredSkills: SKILLS_DEF,
    stem: '$0$ 은 어떤 수인가?',
    options: [
      { key: 'A', text: '유리수 (정수)', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '무리수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$0 = 0/1$ 분수 형태 → 유리수' },
      { key: 'C', text: '실수가 아님', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$0$도 실수' },
      { key: 'D', text: '자연수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '자연수는 $1$부터' },
      { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '명확히 유리수' },
    ],
    solution: '$0 = 0/1$ → 분수 형태 → 유리수 (정수).' },

  // S7 (중) √18 간단히
  { chapterCode: CODE, difficulty: 'medium', concept: '제곱근 간단히 ($18$)', requiredSkills: SKILLS_SIMPLIFY,
    stem: '$\\sqrt{18}$ 를 가장 간단한 꼴로?',
    options: [
      { key: 'A', text: '$3\\sqrt{2}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$2\\sqrt{3}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$18 = 4 \\times \\dots$ 잘못' },
      { key: 'C', text: '$\\sqrt{9} \\sqrt{2}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\sqrt{9}$ 단순화 안 함' },
      { key: 'D', text: '$9\\sqrt{2}$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$\\sqrt{9} = 3$ 인데 $9$' },
      { key: 'E', text: '$6\\sqrt{3}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 인수분해' },
    ],
    solution: '$18 = 9 \\times 2 = 3^2 \\times 2$. $\\sqrt{18} = 3\\sqrt{2}$.' },

  // S8 (중) √75 간단히
  { chapterCode: CODE, difficulty: 'medium', concept: '제곱근 간단히 ($75$)', requiredSkills: SKILLS_SIMPLIFY,
    stem: '$\\sqrt{75}$ 를 간단히 하면?',
    options: [
      { key: 'A', text: '$5\\sqrt{3}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3\\sqrt{5}$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '계수와 근 안 값 바꿈' },
      { key: 'C', text: '$25\\sqrt{3}$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$\\sqrt{25}$ 안 풂' },
      { key: 'D', text: '$15$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sqrt{75}$ 무리수 — 정수 아님' },
      { key: 'E', text: '$5\\sqrt{15}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 인수분해' },
    ],
    solution: '$75 = 25 \\times 3 = 5^2 \\times 3$. $\\sqrt{75} = 5\\sqrt{3}$.' },

  // S9 (중) 같은 근 차
  { chapterCode: CODE, difficulty: 'medium', concept: '같은 근의 뺄셈', requiredSkills: SKILLS_ARITH,
    stem: '$4\\sqrt{3} - \\sqrt{3} = ?$',
    options: [
      { key: 'A', text: '$3\\sqrt{3}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sqrt{3}$ 누락' },
      { key: 'C', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sqrt{3}$ 누락 + 계수 잘못' },
      { key: 'D', text: '$5\\sqrt{3}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '뺄셈인데 덧셈' },
      { key: 'E', text: '$4\\sqrt{3} - \\sqrt{3}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '정리 안 함' },
    ],
    solution: '같은 근 → 계수만 연산: $(4 - 1)\\sqrt{3} = 3\\sqrt{3}$.' },

  // S10 (중) 근 간단히 후 덧셈
  { chapterCode: CODE, difficulty: 'medium', concept: '근 간단히 후 덧셈', requiredSkills: SKILLS_ARITH,
    stem: '$\\sqrt{27} + \\sqrt{3} = ?$',
    options: [
      { key: 'A', text: '$4\\sqrt{3}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\sqrt{30}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근 안 더하지 못함' },
      { key: 'C', text: '$2\\sqrt{3}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3 + 1$이 아닌 $2$' },
      { key: 'D', text: '$\\sqrt{27} + \\sqrt{3}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '간단히 안 함' },
      { key: 'E', text: '$3\\sqrt{3} + \\sqrt{3}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '간단히만 하고 합 안 함' },
    ],
    solution: '$\\sqrt{27} = 3\\sqrt{3}$. $3\\sqrt{3} + \\sqrt{3} = 4\\sqrt{3}$.' },

  // S11 (중) 근 곱셈
  { chapterCode: CODE, difficulty: 'medium', concept: '근 곱셈', requiredSkills: SKILLS_MULT,
    stem: '$\\sqrt{6} \\times \\sqrt{2} = ?$',
    options: [
      { key: 'A', text: '$2\\sqrt{3}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\sqrt{12}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '간단히 안 함' },
      { key: 'C', text: '$\\sqrt{8}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$6 + 2$ 덧셈' },
      { key: 'D', text: '$\\sqrt{3}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나눗셈으로 잘못' },
      { key: 'E', text: '$12$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sqrt{12} \\neq 12$' },
    ],
    solution: '$\\sqrt{6} \\times \\sqrt{2} = \\sqrt{12} = \\sqrt{4 \\cdot 3} = 2\\sqrt{3}$.' },

  // S12 (중) 근 나눗셈
  { chapterCode: CODE, difficulty: 'medium', concept: '근 나눗셈', requiredSkills: SKILLS_MULT,
    stem: '$\\dfrac{\\sqrt{30}}{\\sqrt{6}} = ?$',
    options: [
      { key: 'A', text: '$\\sqrt{5}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sqrt{5} \\neq 5$' },
      { key: 'C', text: '$\\sqrt{24}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '뺄셈으로' },
      { key: 'D', text: '$\\sqrt{36}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '곱셈으로' },
      { key: 'E', text: '$\\dfrac{30}{6} = 5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근호 무시' },
    ],
    solution: '$\\dfrac{\\sqrt{30}}{\\sqrt{6}} = \\sqrt{30/6} = \\sqrt{5}$.' },

  // S13 (중) 분모 유리화 단일
  { chapterCode: CODE, difficulty: 'medium', concept: '분모 유리화 (단일 근)', requiredSkills: SKILLS_RATIONALIZE,
    stem: '$\\dfrac{3}{\\sqrt{3}}$ 의 분모를 유리화하면?',
    options: [
      { key: 'A', text: '$\\sqrt{3}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{3}{\\sqrt{3}}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '유리화 안 함' },
      { key: 'C', text: '$\\dfrac{3\\sqrt{3}}{3}$', isCorrect: false, errorCode: 'SIMPLIFICATION_ERROR', errorReason: '약분 미수행' },
      { key: 'D', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sqrt{3}$ 잘못 처리' },
      { key: 'E', text: '$\\dfrac{1}{\\sqrt{3}}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '분자 잘못' },
    ],
    solution: '분자분모 $\\times \\sqrt{3}$: $\\dfrac{3\\sqrt{3}}{3} = \\sqrt{3}$.' },

  // S14 (중) 분모 유리화 (켤레)
  { chapterCode: CODE, difficulty: 'medium', concept: '분모 유리화 (켤레)', requiredSkills: SKILLS_RATIONALIZE,
    stem: '$\\dfrac{1}{\\sqrt{5} - \\sqrt{3}}$ 의 분모를 유리화하면?',
    options: [
      { key: 'A', text: '$\\dfrac{\\sqrt{5} + \\sqrt{3}}{2}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{\\sqrt{5} - \\sqrt{3}}{2}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '켤레 부호 잘못' },
      { key: 'C', text: '$\\sqrt{5} + \\sqrt{3}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '분모 누락' },
      { key: 'D', text: '$\\dfrac{\\sqrt{5} + \\sqrt{3}}{8}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$5 + 3 = 8$ 잘못' },
      { key: 'E', text: '$\\dfrac{\\sqrt{2}}{2}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
    ],
    solution: '분자분모 $\\times (\\sqrt{5} + \\sqrt{3})$. 분모 $= 5 - 3 = 2$. $\\dfrac{\\sqrt{5} + \\sqrt{3}}{2}$.' },

  // S15 (중) (√2-1)²
  { chapterCode: CODE, difficulty: 'medium', concept: '$(\\sqrt{a}-b)^2$ 전개', requiredSkills: SKILLS_FORMULA,
    stem: '$(\\sqrt{2} - 1)^2 = ?$',
    options: [
      { key: 'A', text: '$3 - 2\\sqrt{2}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3 + 2\\sqrt{2}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '중간항 부호 잘못' },
      { key: 'C', text: '$2 - 1 = 1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱 분배 잘못' },
      { key: 'D', text: '$3$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '중간항 누락' },
      { key: 'E', text: '$2 - 2\\sqrt{2} + 1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '합 안 함' },
    ],
    solution: '$(\\sqrt{2})^2 - 2 \\cdot \\sqrt{2} \\cdot 1 + 1^2 = 2 - 2\\sqrt{2} + 1 = 3 - 2\\sqrt{2}$.' },

  // S16 (어려움) √(a²b)
  { chapterCode: CODE, difficulty: 'hard', concept: '$\\sqrt{a^2 b}$ 간단히 ($a = 3$)', requiredSkills: SKILLS_SIMPLIFY,
    stem: '$\\sqrt{3^2 \\cdot 5}$ 를 간단히?',
    options: [
      { key: 'A', text: '$3\\sqrt{5}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\sqrt{45}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '간단히 안 함' },
      { key: 'C', text: '$5\\sqrt{3}$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '계수/근 안 값 바꿈' },
      { key: 'D', text: '$9\\sqrt{5}$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$3^2$ 그대로' },
      { key: 'E', text: '$3 \\cdot 5 = 15$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '제곱근 무시' },
    ],
    solution: '$\\sqrt{a^2 b} = a\\sqrt{b}$ ($a > 0$). $\\sqrt{3^2 \\cdot 5} = 3\\sqrt{5}$.' },

  // S17 (어려움) 분모 유리화 (계수 있는 켤레)
  { chapterCode: CODE, difficulty: 'hard', concept: '분모 유리화 (1차+근)', requiredSkills: SKILLS_RATIONALIZE,
    stem: '$\\dfrac{1}{2 + \\sqrt{3}}$ 의 분모를 유리화하면?',
    options: [
      { key: 'A', text: '$2 - \\sqrt{3}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$2 + \\sqrt{3}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '켤레 부호 잘못' },
      { key: 'C', text: '$\\dfrac{2 - \\sqrt{3}}{4 - 3}$', isCorrect: false, errorCode: 'SIMPLIFICATION_ERROR', errorReason: '$4 - 3 = 1$ 약분 미수행' },
      { key: 'D', text: '$\\dfrac{1}{4 - 3} = 1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '분자 곱 누락' },
      { key: 'E', text: '$\\dfrac{2 + \\sqrt{3}}{7}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$4 + 3$ 잘못' },
    ],
    solution: '$\\dfrac{1 \\cdot (2 - \\sqrt{3})}{(2)^2 - (\\sqrt{3})^2} = \\dfrac{2 - \\sqrt{3}}{4 - 3} = 2 - \\sqrt{3}$.' },

  // S18 (어려움) 여러 근 사칙
  { chapterCode: CODE, difficulty: 'hard', concept: '여러 근 사칙 (간단히 후 정리)', requiredSkills: SKILLS_ARITH,
    stem: '$\\sqrt{8} + \\sqrt{18} - \\sqrt{32} = ?$',
    options: [
      { key: 'A', text: '$\\sqrt{2}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2 + 3 - 4 = 1$인데 $0$' },
      { key: 'C', text: '$5\\sqrt{2}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '뺄셈 부호 잘못' },
      { key: 'D', text: '$-\\sqrt{2}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'E', text: '$2\\sqrt{2}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2 + 3 - 4 - 1$ 잘못된 식' },
    ],
    solution: '$\\sqrt{8} = 2\\sqrt{2}, \\sqrt{18} = 3\\sqrt{2}, \\sqrt{32} = 4\\sqrt{2}$. $(2 + 3 - 4)\\sqrt{2} = \\sqrt{2}$.' },

  // S19 (어려움) 합·차 공식
  { chapterCode: CODE, difficulty: 'hard', concept: '합·차 공식 (근 두 개)', requiredSkills: SKILLS_FORMULA,
    stem: '$(\\sqrt{7} + \\sqrt{3})(\\sqrt{7} - \\sqrt{3}) = ?$',
    options: [
      { key: 'A', text: '$4$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\sqrt{21}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱셈으로 잘못' },
      { key: 'C', text: '$10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$7 + 3$ 합' },
      { key: 'D', text: '$2\\sqrt{21}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '중간항 미적용' },
      { key: 'E', text: '$\\sqrt{4} = 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '단순화 잘못' },
    ],
    solution: '$(a + b)(a - b) = a^2 - b^2 = 7 - 3 = 4$.' },

  // S20 (어려움) √(a²) when a<0
  { chapterCode: CODE, difficulty: 'hard', concept: '$\\sqrt{a^2}$ when $a < 0$', requiredSkills: SKILLS_DEF,
    stem: '$a < 0$ 일 때 $\\sqrt{a^2}$ 는?',
    options: [
      { key: 'A', text: '$-a$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$a$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$a > 0$ 가정 — 이 경우 $a < 0$이므로 결과 음수' },
      { key: 'C', text: '$\\pm a$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$\\sqrt{\\ }$는 양수만' },
      { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$a \\neq 0$ 가정' },
      { key: 'E', text: '$|a|$를 모름', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$|a|$ 정의 가능' },
    ],
    solution: '$\\sqrt{a^2} = |a|$. $a < 0$ 이면 $|a| = -a$ (양수).' },
];

export const K_G9_MATH3_CH01_REAL_NUMBERS_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
