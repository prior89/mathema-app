/**
 * K-G11-ALG-CH01-EXP-LOG (지수·로그) — 20문제 3-step Mastery.
 * 고2 대수 — 지수법칙 ($a^m a^n, (a^m)^n, a^{-n}, a^{m/n}$) → 거듭제곱근 →
 *   로그 정의 ($a^x = N \iff x = \log_a N$) → 로그 법칙 (곱·몫·지수) →
 *   밑 변환 → 지수·로그 방정식 → 상용로그.
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 * 주요 errorCode:
 *   FORMULA_SELECTION_ERROR 8 (지수·로그 법칙 혼동)
 *   ALGEBRA_ERROR 5 / CONCEPT_MISUNDERSTANDING 5 / CONDITION_MISSING 2
 *
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G11-ALG-CH01-EXP-LOG';
const SKILLS_EXP_LAW = ['exponent_laws'];
const SKILLS_NEG_EXP = ['negative_exponent'];
const SKILLS_FRAC_EXP = ['fractional_exponent'];
const SKILLS_NTH_ROOT = ['nth_root'];
const SKILLS_LOG_DEF = ['logarithm_definition'];
const SKILLS_LOG_LAW = ['logarithm_laws'];
const SKILLS_LOG_CHANGE = ['log_change_of_base'];
const SKILLS_EXP_EQ = ['exponential_equation'];
const SKILLS_LOG_EQ = ['logarithmic_equation'];
const SKILLS_COMMON_LOG = ['common_logarithm'];

const problems: KoreanProblemSeed[] = [
  // Q1
  { chapterCode: CODE, difficulty: 'easy', concept: '$a^m a^n = a^{m+n}$', requiredSkills: SKILLS_EXP_LAW,
    stem: '$2^3 \\cdot 2^4 = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '지수법칙', options: [
        { key: 'A', text: '$a^m a^n = a^{m+n}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a^m a^n = a^{mn}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$(a^m)^n$' },
        { key: 'C', text: '$a^m a^n = a^{m-n}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '몫' },
        { key: 'D', text: '$a^m a^n = 2 a^{m+n}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$a^m + a^n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$2^{3+4} = 2^7$', options: [
        { key: 'A', text: '$128$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2^{12}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱했음' },
        { key: 'C', text: '$56$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$64$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$2^6$' },
        { key: 'E', text: '$256$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$2^8$' },
      ] },
      { stepType: 'ANSWER', prompt: '값?', options: [
        { key: 'A', text: '$128$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4096$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$2^{12}$' },
        { key: 'C', text: '$56$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$64$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$256$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$2^{3+4} = 2^7 = 128$.' },

  // Q2
  { chapterCode: CODE, difficulty: 'easy', concept: '$(a^m)^n = a^{mn}$', requiredSkills: SKILLS_EXP_LAW,
    stem: '$(3^2)^3 = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '거듭제곱의 거듭제곱', options: [
        { key: 'A', text: '$(a^m)^n = a^{mn}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(a^m)^n = a^{m+n}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱 법칙' },
        { key: 'C', text: '$(a^m)^n = a^{m^n}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(a^m)^n = a m n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(a^m)^n = m^n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$3^{2 \\cdot 3} = 3^6$', options: [
        { key: 'A', text: '$729$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$243$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$3^5$' },
        { key: 'C', text: '$125$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$216$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$3^5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
      ] },
      { stepType: 'ANSWER', prompt: '값?', options: [
        { key: 'A', text: '$729$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$243$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$125$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$3^{2 + 3} = 243$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
        { key: 'E', text: '$6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$3^{2 \\cdot 3} = 3^6 = 729$.' },

  // Q3
  { chapterCode: CODE, difficulty: 'easy', concept: '$a^0 = 1$', requiredSkills: SKILLS_EXP_LAW,
    stem: '$2^0 = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$a \\neq 0$ 일 때 $a^0$', options: [
        { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$0$ 곱 아님' },
        { key: 'C', text: '$a$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '정의 안 됨', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '정의됨' },
        { key: 'E', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$2^n / 2^n = 2^0 = 1$', options: [
        { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
        { key: 'E', text: '$-1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$2^0$?', options: [
        { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '정의 안 됨', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$-1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$a \\neq 0$ 일 때 $a^0 = 1$. ($2^0 = 1$.)' },

  // Q4
  { chapterCode: CODE, difficulty: 'easy', concept: '음수 지수', requiredSkills: SKILLS_NEG_EXP,
    stem: '$2^{-2} = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$a^{-n}$ 정의', options: [
        { key: 'A', text: '$1 / a^n$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-a^n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$-1/a^n$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$a^n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$1/2^2 = 1/4$', options: [
        { key: 'A', text: '$1/4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$1/2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$-1/4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '값?', options: [
        { key: 'A', text: '$1/4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$-1/4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1/2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$2^{-2} = 1/4$.' },

  // Q5
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\log_2 8$', requiredSkills: SKILLS_LOG_DEF,
    stem: '$\\log_2 8 = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '로그 정의', options: [
        { key: 'A', text: '$2^x = 8$ 인 $x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$8^x = 2$ 인 $x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '바뀜' },
        { key: 'C', text: '$2 + 8$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$8 / 2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$8 - 2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$2^3 = 8$', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$2^4 = 16$' },
        { key: 'C', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$8$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$\\log_2 8$?', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$8$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$2^3 = 8$ → $\\log_2 8 = 3$.' },

  // Q6
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\log_a 1$', requiredSkills: SKILLS_LOG_DEF,
    stem: '$\\log_3 1 = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$a^x = 1$ 인 $x$', options: [
        { key: 'A', text: '$x = 0$ ($a^0 = 1$)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$a^1 = a$' },
        { key: 'C', text: '$x = a$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$x = -1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '정의 안 됨', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '정의됨' },
      ] },
      { stepType: 'PROCESS', prompt: '$3^0 = 1$', options: [
        { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\log_a a$' },
        { key: 'C', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$-1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$1/3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$\\log_3 1$?', options: [
        { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$-1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '정의 안 됨', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\log_a 1 = 0$ (모든 $a$).' },

  // Q7
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\sqrt[3]{27}$', requiredSkills: SKILLS_NTH_ROOT,
    stem: '$\\sqrt[3]{27} = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\sqrt[3]{a} = a^{1/3}$', options: [
        { key: 'A', text: '세제곱이 $27$ 인 수', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$27 / 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '제곱이 $27$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '제곱근 아님' },
        { key: 'D', text: '$\\sqrt{27}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$3^3 = 27$', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$27$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\sqrt{27}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$1/3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$\\sqrt[3]{27}$?', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$27$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\sqrt{27}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$3^3 = 27 \\Rightarrow \\sqrt[3]{27} = 3$.' },

  // Q8
  { chapterCode: CODE, difficulty: 'medium', concept: '$a^{1/2}$', requiredSkills: SKILLS_FRAC_EXP,
    stem: '$4^{1/2} = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$a^{1/n} = \\sqrt[n]{a}$', options: [
        { key: 'A', text: '$\\sqrt{4}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4 \\cdot 1/2 = 2$ (우연)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱 아님' },
        { key: 'C', text: '$1/4 \\cdot 1/2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$4^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '뒤집힘' },
        { key: 'E', text: '$1/16$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\sqrt{4}$', options: [
        { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$16$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$4^2$' },
        { key: 'E', text: '$\\sqrt{2}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '값?', options: [
        { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$16$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sqrt{2}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$4^{1/2} = \\sqrt{4} = 2$.' },

  // Q9
  { chapterCode: CODE, difficulty: 'medium', concept: '$8^{2/3}$', requiredSkills: SKILLS_FRAC_EXP,
    stem: '$8^{2/3} = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$a^{m/n} = (\\sqrt[n]{a})^m$', options: [
        { key: 'A', text: '$(\\sqrt[3]{8})^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$8 \\cdot 2/3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱 아님' },
        { key: 'C', text: '$\\sqrt{8/3}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$8^{3/2}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '뒤집힘' },
        { key: 'E', text: '$2/3 \\cdot 8$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\sqrt[3]{8} = 2, 2^2 = 4$', options: [
        { key: 'A', text: '$4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$8$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$16/3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$64$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$8^{2/3}$?', options: [
        { key: 'A', text: '$4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$8$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$16/3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱' },
        { key: 'E', text: '$64$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$8^{2/3} = (8^{1/3})^2 = 2^2 = 4$.' },

  // Q10
  { chapterCode: CODE, difficulty: 'medium', concept: '$a^m / a^n$', requiredSkills: SKILLS_EXP_LAW,
    stem: '$2^5 / 2^2 = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '몫의 지수 법칙', options: [
        { key: 'A', text: '$a^{m-n}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a^{m+n}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱' },
        { key: 'C', text: '$a^{m/n}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$a^{m \\cdot n}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$m - n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$2^{5-2} = 2^3$', options: [
        { key: 'A', text: '$8$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$32$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$2^2$' },
        { key: 'D', text: '$16$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$2^4$' },
        { key: 'E', text: '$5/2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '값?', options: [
        { key: 'A', text: '$8$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$32$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$16$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$5/2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$2^{5-2} = 8$.' },

  // Q11
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\log_2 16$', requiredSkills: SKILLS_LOG_DEF,
    stem: '$\\log_2 16 = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$2^x = 16$', options: [
        { key: 'A', text: '$2^4 = 16$ → $x = 4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2^3 = 8$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2^{16}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$2^2 = 4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2^{-4}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$x = 4$', options: [
        { key: 'A', text: '$4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$8$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$16$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '값?', options: [
        { key: 'A', text: '$4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$8$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$16$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$2^4 = 16$ → $\\log_2 16 = 4$.' },

  // Q12
  { chapterCode: CODE, difficulty: 'medium', concept: '상용로그', requiredSkills: SKILLS_COMMON_LOG,
    stem: '$\\log_{10} 1000 = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$10^x = 1000$', options: [
        { key: 'A', text: '$10^3 = 1000$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$10^4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$10^2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$10^1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$10^{1000}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$x = 3$', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1000$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$10$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '값?', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1000$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$10$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$10^3 = 1000$ → $3$.' },

  // Q13
  { chapterCode: CODE, difficulty: 'medium', concept: '로그 곱 법칙', requiredSkills: SKILLS_LOG_LAW,
    stem: '$\\log_a M + \\log_a N = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '곱 법칙', options: [
        { key: 'A', text: '$\\log_a (MN)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\log_a (M + N)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합 아님' },
        { key: 'C', text: '$\\log_a (M / N)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '몫 법칙' },
        { key: 'D', text: '$(\\log_a M)(\\log_a N)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱 X' },
        { key: 'E', text: '$M + N$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\log_a M N$', options: [
        { key: 'A', text: '$\\log_a (MN)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\log_a (M+N)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\log_a (M-N)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2 \\log_a M$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\log_a M^N$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$\\log_a (MN)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\log_a (M+N)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\log_a (M/N)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '몫' },
        { key: 'D', text: '$\\log_a M \\cdot \\log_a N$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\log_a M^N$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\log_a (MN)$.' },

  // Q14
  { chapterCode: CODE, difficulty: 'medium', concept: '로그 몫 법칙', requiredSkills: SKILLS_LOG_LAW,
    stem: '$\\log_2 6 - \\log_2 3 = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '몫 법칙', options: [
        { key: 'A', text: '$\\log_a M - \\log_a N = \\log_a (M/N)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\log_a (M - N)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\log_a (MN)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱' },
        { key: 'D', text: '$M / N$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(\\log M)/(\\log N)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\log_2 (6/3) = \\log_2 2$', options: [
        { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$\\log_2 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '값?', options: [
        { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$\\log_2 3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\log_2 9$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱' },
      ] },
    ], solution: '$\\log_2 (6/3) = \\log_2 2 = 1$.' },

  // Q15
  { chapterCode: CODE, difficulty: 'medium', concept: '로그 지수 법칙', requiredSkills: SKILLS_LOG_LAW,
    stem: '$\\log_3 9^2 = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\log_a M^k = k \\log_a M$', options: [
        { key: 'A', text: '$2 \\log_3 9$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(\\log_3 9)^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$(\\cdot)^2$ 아님' },
        { key: 'C', text: '$\\log_9 3^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\log_3 9 + 2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\log_3 18$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$2 \\cdot 2 = 4$ ($\\log_3 9 = 2$)', options: [
        { key: 'A', text: '$4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '제곱 무시' },
        { key: 'C', text: '$9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$81$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '값?', options: [
        { key: 'A', text: '$4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$81$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\log_3 9^2 = 2 \\log_3 9 = 2 \\cdot 2 = 4$.' },

  // Q16 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '체인 법칙', requiredSkills: SKILLS_LOG_CHANGE,
    stem: '$\\log_2 3 \\cdot \\log_3 8 = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '체인 (밑 변환)', options: [
        { key: 'A', text: '$\\log_2 3 \\cdot \\log_3 8 = \\log_2 8$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\log_2 8 / \\log_3 8$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\log_6 24$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\log_2 11$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합 아님' },
        { key: 'E', text: '$\\log_5 24$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\log_2 8 = 3$', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$8$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\log_2 24$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '값?', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$8$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$24$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$3 \\cdot 8$' },
        { key: 'E', text: '$11$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\log_2 3 \\cdot \\log_3 8 = \\log_2 8 = 3$ (체인).' },

  // Q17 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '지수방정식', requiredSkills: SKILLS_EXP_EQ,
    stem: '$2^x = 8$ → $x$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '같은 밑으로', options: [
        { key: 'A', text: '$8 = 2^3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$8 = 2 \\cdot 4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$\\log_8 2$ 사용', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '뒤집힘' },
        { key: 'D', text: '$x = 8 - 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$x = 8/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '지수 비교', options: [
        { key: 'A', text: '$x = 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$x = 8$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$x = 2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x = 6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$8-2$' },
      ] },
      { stepType: 'ANSWER', prompt: '$x$?', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$8$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$2^x = 2^3 \\Rightarrow x = 3$.' },

  // Q18 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '로그방정식', requiredSkills: SKILLS_LOG_EQ,
    stem: '$\\log_2 (x - 1) = 3$ → $x$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '지수형 변환', options: [
        { key: 'A', text: '$x - 1 = 2^3 = 8$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x - 1 = 3 \\cdot 2 = 6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곱 아님' },
        { key: 'C', text: '$x - 1 = 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$2$ 사용 안 함' },
        { key: 'D', text: '$x - 1 = \\log_2 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '뒤집힘' },
        { key: 'E', text: '$x = 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$x = 9$', options: [
        { key: 'A', text: '$x = 9$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 7$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$+1$ 누락' },
        { key: 'C', text: '$x = 8$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$+1$ 누락' },
        { key: 'D', text: '$x = 6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$x = 4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$x$?', options: [
        { key: 'A', text: '$9$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$8$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$+1$ 누락' },
        { key: 'C', text: '$7$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$x - 1 = 8 \\Rightarrow x = 9$.' },

  // Q19 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '진수 조건 동반 로그방정식', requiredSkills: SKILLS_LOG_EQ,
    stem: '$\\log_2 x + \\log_2 (x - 3) = 2$. $x$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '곱 법칙', options: [
        { key: 'A', text: '$\\log_2 [x(x-3)] = 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\log_2 (x + x - 3) = 2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합 아님' },
        { key: 'C', text: '$\\log_2 (2x - 3) = 2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2 \\log_2 x = 2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\log_2 (x / (x-3))$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '몫' },
      ] },
      { stepType: 'PROCESS', prompt: '$x(x-3) = 4$, $x^2 - 3x - 4 = 0$, $(x-4)(x+1) = 0$. 진수 조건 $x > 3$', options: [
        { key: 'A', text: '$x = 4$ (만 만족)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = -1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '진수 조건 위반' },
        { key: 'C', text: '$x = 4, -1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$-1$ 진수 X' },
        { key: 'D', text: '해 없음', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$x = 4$ 있음' },
        { key: 'E', text: '$x = 3$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$x = 3$ 시 $\\log_2 0$' },
      ] },
      { stepType: 'ANSWER', prompt: '$x$?', options: [
        { key: 'A', text: '$4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '진수 X' },
        { key: 'C', text: '$4, -1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$-1$ 진수 X' },
        { key: 'D', text: '$3$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '진수 $0$ 안 됨' },
        { key: 'E', text: '해 없음', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '있음' },
      ] },
    ], solution: '$x(x-3) = 4 \\to x = 4$ (진수 조건 $x > 3$ 으로 $x = -1$ 제외).' },

  // Q20 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '상용로그 분해', requiredSkills: SKILLS_COMMON_LOG,
    stem: '$\\log_{10} 2 = 0.301$ 일 때 $\\log_{10} 20$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$20 = 10 \\cdot 2$', options: [
        { key: 'A', text: '$\\log_{10} 20 = \\log_{10} 10 + \\log_{10} 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\log_{10} 20 = 2 \\log_{10} 2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\log_{10} 20 = \\log_{10} 2 / \\log_{10} 10$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$20 \\cdot \\log_{10} 2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$10 + 2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$1 + 0.301$', options: [
        { key: 'A', text: '$1.301$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0.602$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$2 \\log 2$' },
        { key: 'C', text: '$0.301$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$\\log 2$' },
        { key: 'D', text: '$2.301$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$3.010$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$\\log_{10} 20$?', options: [
        { key: 'A', text: '$1.301$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0.602$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$0.301$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2.301$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$3.010$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\log 20 = \\log 10 + \\log 2 = 1 + 0.301 = 1.301$.' },
];

export const K_G11_ALG_CH01_EXP_LOG_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
