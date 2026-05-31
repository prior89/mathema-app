/**
 * K-G11-ALG-CH01-EXP-LOG — STUDY pool (single-step, 20문제).
 * 지수와 로그 — 지수 법칙, n제곱근, 분수 지수, 로그 정의·법칙.
 * Mastery 3-step과 별도 변형 문제. 고2 대수 (G11).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5. LLM 미사용.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G11-ALG-CH01-EXP-LOG';
const SKILLS_EXP_LAW = ['exponent_law_product', 'exponent_law_power'];
const SKILLS_NEG_EXP = ['negative_exponent', 'reciprocal'];
const SKILLS_NTH_ROOT = ['nth_root_evaluation'];
const SKILLS_FRAC_EXP = ['fractional_exponent', 'root_as_power'];
const SKILLS_LOG_DEF = ['log_definition'];
const SKILLS_COMMON_LOG = ['common_log_base_10'];
const SKILLS_LOG_LAW = ['log_product_law', 'log_quotient_law', 'log_power_law'];
const SKILLS_LOG_CHANGE = ['change_of_base'];
const SKILLS_EXP_EQ = ['exponential_equation'];
const SKILLS_LOG_EQ = ['logarithmic_equation', 'domain_constraint'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) 3²·3³
  { chapterCode: CODE, difficulty: 'easy', concept: '$a^m \\cdot a^n$', requiredSkills: SKILLS_EXP_LAW,
    stem: '$3^2 \\cdot 3^3 = ?$',
    options: [
      { key: 'A', text: '$243$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3^6$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$2 \\times 3$ 곱셈' },
      { key: 'C', text: '$9^5 = 59049$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '밑도 곱함' },
      { key: 'D', text: '$15$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$9 + 6$ 합' },
      { key: 'E', text: '$729$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$3^6$' },
    ],
    solution: '$3^2 \\cdot 3^3 = 3^{2+3} = 3^5 = 243$.' },

  // S2 (쉬움) (5²)²
  { chapterCode: CODE, difficulty: 'easy', concept: '$(a^m)^n$', requiredSkills: SKILLS_EXP_LAW,
    stem: '$(5^2)^2 = ?$',
    options: [
      { key: 'A', text: '$625$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$5^4 = 625$ 그대로', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '계산 안 함' },
      { key: 'C', text: '$25$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$5^2$만' },
      { key: 'D', text: '$5^6$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$2 + 2$ 잘못 곱' },
      { key: 'E', text: '$125$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$5^3$' },
    ],
    solution: '$(5^2)^2 = 5^{2 \\times 2} = 5^4 = 625$.' },

  // S3 (쉬움) 5⁰
  { chapterCode: CODE, difficulty: 'easy', concept: '$a^0 = 1$', requiredSkills: SKILLS_EXP_LAW,
    stem: '$5^0 = ?$',
    options: [
      { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$0 \\times 5$ 잘못' },
      { key: 'C', text: '$5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '밑 자체' },
      { key: 'D', text: '정의 안 됨', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$a \\neq 0$ 이면 정의됨' },
      { key: 'E', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$a \\neq 0$ 일 때 $a^0 = 1$.' },

  // S4 (쉬움) 3⁻¹
  { chapterCode: CODE, difficulty: 'easy', concept: '음수 지수', requiredSkills: SKILLS_NEG_EXP,
    stem: '$3^{-1} = ?$',
    options: [
      { key: 'A', text: '$\\dfrac{1}{3}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$-3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부호 분리' },
      { key: 'C', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$0$으로 잘못' },
      { key: 'D', text: '$3$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '음수 무시' },
      { key: 'E', text: '$\\dfrac{-1}{3}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '잘못된 부호' },
    ],
    solution: '$a^{-n} = \\dfrac{1}{a^n}$. $3^{-1} = \\dfrac{1}{3}$.' },

  // S5 (쉬움) log₃9
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\log_3 9$', requiredSkills: SKILLS_LOG_DEF,
    stem: '$\\log_3 9 = ?$',
    options: [
      { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '밑 자체' },
      { key: 'C', text: '$9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '진수' },
      { key: 'D', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '뒤집음' },
      { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\log 1$' },
    ],
    solution: '$3^2 = 9$ → $\\log_3 9 = 2$.' },

  // S6 (쉬움) log₅5
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\log_a a = 1$', requiredSkills: SKILLS_LOG_DEF,
    stem: '$\\log_5 5 = ?$',
    options: [
      { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '밑 자체' },
      { key: 'C', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\log 1$ 답함' },
      { key: 'D', text: '$25$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$\\dfrac{1}{5}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$5^1 = 5$ → $\\log_5 5 = 1$.' },

  // S7 (중) ∛64
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\sqrt[3]{64}$', requiredSkills: SKILLS_NTH_ROOT,
    stem: '$\\sqrt[3]{64} = ?$',
    options: [
      { key: 'A', text: '$4$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$8$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sqrt{64}$ 답함' },
      { key: 'C', text: '$16$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 값' },
      { key: 'D', text: '$64$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근호 미적용' },
      { key: 'E', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$4^3 = 64$ → $\\sqrt[3]{64} = 4$.' },

  // S8 (중) 9^(1/2)
  { chapterCode: CODE, difficulty: 'medium', concept: '분수 지수 ($1/2$)', requiredSkills: SKILLS_FRAC_EXP,
    stem: '$9^{1/2} = ?$',
    options: [
      { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{9}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$9/2$ 곱셈으로' },
      { key: 'C', text: '$4.5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '같은 잘못' },
      { key: 'D', text: '$81$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$9^2$' },
      { key: 'E', text: '$\\dfrac{1}{3}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '음수 지수와 혼동' },
    ],
    solution: '$a^{1/2} = \\sqrt{a}$. $9^{1/2} = 3$.' },

  // S9 (중) 27^(1/3)
  { chapterCode: CODE, difficulty: 'medium', concept: '분수 지수 ($1/3$)', requiredSkills: SKILLS_FRAC_EXP,
    stem: '$27^{1/3} = ?$',
    options: [
      { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sqrt{27}$ 비슷' },
      { key: 'C', text: '$\\dfrac{27}{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '나눗셈' },
      { key: 'D', text: '$\\dfrac{1}{3}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '음수 지수와 혼동' },
      { key: 'E', text: '$81$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$27^3$' },
    ],
    solution: '$a^{1/3} = \\sqrt[3]{a}$. $27^{1/3} = 3$.' },

  // S10 (중) 5⁴/5²
  { chapterCode: CODE, difficulty: 'medium', concept: '지수 나눗셈', requiredSkills: SKILLS_EXP_LAW,
    stem: '$\\dfrac{5^4}{5^2} = ?$',
    options: [
      { key: 'A', text: '$25$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$5^6$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '곱셈으로' },
      { key: 'C', text: '$5^2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '계산 안 함' },
      { key: 'D', text: '$5^8$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$4 \\times 2$' },
      { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$5^0$' },
    ],
    solution: '$5^{4-2} = 5^2 = 25$.' },

  // S11 (중) log₂32
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\log_2 32$', requiredSkills: SKILLS_LOG_DEF,
    stem: '$\\log_2 32 = ?$',
    options: [
      { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\log_2 16$' },
      { key: 'C', text: '$32$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '진수 그대로' },
      { key: 'D', text: '$16$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 값' },
      { key: 'E', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\log_2 64$' },
    ],
    solution: '$2^5 = 32$ → $\\log_2 32 = 5$.' },

  // S12 (중) log10⁵
  { chapterCode: CODE, difficulty: 'medium', concept: '상용로그', requiredSkills: SKILLS_COMMON_LOG,
    stem: '$\\log_{10} 10^5 = ?$',
    options: [
      { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$10$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '밑' },
      { key: 'C', text: '$50$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 곱' },
      { key: 'D', text: '$10^5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '진수' },
      { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\log_a a$' },
    ],
    solution: '$\\log_a a^n = n$. → $5$.' },

  // S13 (중) 로그 몫 법칙
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\log M - \\log N$', requiredSkills: SKILLS_LOG_LAW,
    stem: '$\\log_a M - \\log_a N = ?$',
    options: [
      { key: 'A', text: '$\\log_a \\dfrac{M}{N}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\log_a (M - N)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '뺄셈으로 잘못' },
      { key: 'C', text: '$\\log_a MN$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곱셈 법칙' },
      { key: 'D', text: '$\\dfrac{\\log_a M}{\\log_a N}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 분수' },
      { key: 'E', text: '$\\log_a M^N$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '지수 법칙' },
    ],
    solution: '로그 몫 법칙.' },

  // S14 (중) log₃15 - log₃5
  { chapterCode: CODE, difficulty: 'medium', concept: '로그 몫 적용', requiredSkills: SKILLS_LOG_LAW,
    stem: '$\\log_3 15 - \\log_3 5 = ?$',
    options: [
      { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '밑' },
      { key: 'C', text: '$10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$15 - 5$' },
      { key: 'D', text: '$\\log_3 10$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '뺄셈 잘못' },
      { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$\\log_3 (15/5) = \\log_3 3 = 1$.' },

  // S15 (중) log₂8³
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\log_a M^k$', requiredSkills: SKILLS_LOG_LAW,
    stem: '$\\log_2 8^3 = ?$',
    options: [
      { key: 'A', text: '$9$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '지수 무시 ($\\log_2 8$)' },
      { key: 'C', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'D', text: '$8^3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '진수 그대로' },
      { key: 'E', text: '$24$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3 \\times 8$' },
    ],
    solution: '$\\log_2 8^3 = 3 \\log_2 8 = 3 \\times 3 = 9$.' },

  // S16 (어려움) 체인 법칙
  { chapterCode: CODE, difficulty: 'hard', concept: '체인 법칙', requiredSkills: SKILLS_LOG_CHANGE,
    stem: '$\\log_a b \\cdot \\log_b c = ?$',
    options: [
      { key: 'A', text: '$\\log_a c$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\log_a b + \\log_b c$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '덧셈 잘못' },
      { key: 'C', text: '$\\log_{bc} a$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 식' },
      { key: 'D', text: '$\\log_c a$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '뒤집음' },
      { key: 'E', text: '$abc$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$\\log_a b \\cdot \\log_b c = \\dfrac{\\log b}{\\log a} \\cdot \\dfrac{\\log c}{\\log b} = \\dfrac{\\log c}{\\log a} = \\log_a c$.' },

  // S17 (어려움) 지수방정식
  { chapterCode: CODE, difficulty: 'hard', concept: '지수방정식', requiredSkills: SKILLS_EXP_EQ,
    stem: '$3^x = 81$ 의 해는?',
    options: [
      { key: 'A', text: '$x = 4$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = 3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3^3 = 27$' },
      { key: 'C', text: '$x = 27$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$81/3$' },
      { key: 'D', text: '$x = 9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$81/3 - $ 잘못' },
      { key: 'E', text: '$x = 5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3^5 = 243$' },
    ],
    solution: '$81 = 3^4$. $3^x = 3^4 \\to x = 4$.' },

  // S18 (어려움) 로그방정식
  { chapterCode: CODE, difficulty: 'hard', concept: '로그방정식', requiredSkills: SKILLS_LOG_EQ,
    stem: '$\\log_3 (x + 1) = 2$ 의 해는?',
    options: [
      { key: 'A', text: '$x = 8$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = 9$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$-1$ 누락' },
      { key: 'C', text: '$x = 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 식' },
      { key: 'D', text: '$x = 6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'E', text: '$x = 5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '$x + 1 = 3^2 = 9 \\to x = 8$.' },

  // S19 (어려움) 진수 조건 로그방정식
  { chapterCode: CODE, difficulty: 'hard', concept: '진수 조건 로그방정식', requiredSkills: SKILLS_LOG_EQ,
    stem: '$\\log_2 x + \\log_2 (x + 2) = 3$. $x$?',
    options: [
      { key: 'A', text: '$x = 2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = -4$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '진수 $> 0$ 조건 위반' },
      { key: 'C', text: '$x = 4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'D', text: '$x = 8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'E', text: '$x = 1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '$\\log_2 x(x+2) = 3 \\to x(x+2) = 8 \\to x^2 + 2x - 8 = 0 \\to (x-2)(x+4)=0$. $x > 0$ → $x = 2$.' },

  // S20 (어려움) 상용로그 분해
  { chapterCode: CODE, difficulty: 'hard', concept: '상용로그 분해', requiredSkills: SKILLS_COMMON_LOG,
    stem: '$\\log_{10} 3 = 0.477$ 일 때 $\\log_{10} 30$?',
    options: [
      { key: 'A', text: '$1.477$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0.477$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\log 10$ 누락' },
      { key: 'C', text: '$4.77$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\times 10$' },
      { key: 'D', text: '$0.0477$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$/10$' },
      { key: 'E', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$\\log 30 = \\log (3 \\times 10) = \\log 3 + \\log 10 = 0.477 + 1 = 1.477$.' },
];

export const K_G11_ALG_CH01_EXP_LOG_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
