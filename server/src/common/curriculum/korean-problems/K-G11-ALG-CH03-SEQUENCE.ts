/**
 * K-G11-ALG-CH03-SEQUENCE (수열) — 20문제 3-step Mastery.
 * 고2 대수 — 등차수열 (공차·일반항·합) → 등비수열 (공비·일반항·합) →
 *   시그마 표기 → $\sum k, \sum k^2$ 공식 → 점화식 (recurrence).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 * 주요 errorCode:
 *   FORMULA_SELECTION_ERROR 8 (일반항/합·등차/등비 혼동)
 *   ALGEBRA_ERROR 6 / CONCEPT_MISUNDERSTANDING 5 / SIGN_ERROR 1
 *
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G11-ALG-CH03-SEQUENCE';
const SKILLS_AP_D = ['arithmetic_common_difference'];
const SKILLS_AP_TERM = ['arithmetic_general_term'];
const SKILLS_AP_SUM = ['arithmetic_sum'];
const SKILLS_GP_R = ['geometric_common_ratio'];
const SKILLS_GP_TERM = ['geometric_general_term'];
const SKILLS_GP_SUM = ['geometric_sum'];
const SKILLS_SIGMA = ['sigma_notation'];
const SKILLS_SIGMA_K = ['sum_of_k'];
const SKILLS_SIGMA_K2 = ['sum_of_k_squared'];
const SKILLS_SIGMA_CONST = ['sum_of_constant'];
const SKILLS_RECURRENCE = ['recurrence'];

const problems: KoreanProblemSeed[] = [
  // Q1
  { chapterCode: CODE, difficulty: 'easy', concept: '공차', requiredSkills: SKILLS_AP_D,
    stem: '등차수열 $1, 3, 5, 7, \\ldots$ 의 공차 $d$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '공차 $d$ 의미', options: [
        { key: 'A', text: '연속 두 항의 차 $a_{n+1} - a_n$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '연속 두 항의 비', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '공비' },
        { key: 'C', text: '첫 항', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '항의 곱', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '항의 합', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$3 - 1$', options: [
        { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$d$?', options: [
        { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '공차 $d = 3 - 1 = 2$.' },

  // Q2
  { chapterCode: CODE, difficulty: 'easy', concept: '등차 일반항', requiredSkills: SKILLS_AP_TERM,
    stem: '등차수열 $2, 5, 8, \\ldots$ 의 일반항 $a_n$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '일반항 공식', options: [
        { key: 'A', text: '$a_n = a_1 + (n-1)d$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a_n = a_1 \\cdot d^{n-1}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '등비' },
        { key: 'C', text: '$a_n = a_1 + nd$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$n-1$ 누락' },
        { key: 'D', text: '$a_n = nd$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$a_1$ 누락' },
        { key: 'E', text: '$a_n = (a_1)^n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$a_1 = 2, d = 3$', options: [
        { key: 'A', text: '$2 + 3(n-1) = 3n - 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2 + 3n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$n-1$' },
        { key: 'C', text: '$3n$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2 \\cdot 3^{n-1}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '등비' },
        { key: 'E', text: '$5n - 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$a_n$?', options: [
        { key: 'A', text: '$3n - 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3n + 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$3n$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2 + 3n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$n-1$' },
        { key: 'E', text: '$2 \\cdot 3^{n-1}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '등비' },
      ] },
    ], solution: '$a_n = 2 + 3(n-1) = 3n - 1$.' },

  // Q3
  { chapterCode: CODE, difficulty: 'easy', concept: '특정 항 값', requiredSkills: SKILLS_AP_TERM,
    stem: '등차수열 $1, 3, 5, \\ldots$ 의 $a_{10}$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$a_n = 1 + 2(n-1)$', options: [
        { key: 'A', text: '$1 + 2 \\cdot 9$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1 + 2 \\cdot 10$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$n-1$' },
        { key: 'C', text: '$1 + 10$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$d$ 누락' },
        { key: 'D', text: '$1 \\cdot 2^9$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '등비' },
        { key: 'E', text: '$10$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$1 + 18$', options: [
        { key: 'A', text: '$19$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$21$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$1 + 20$' },
        { key: 'C', text: '$20$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$11$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$a_{10}$?', options: [
        { key: 'A', text: '$19$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$21$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$n-1$ 무시' },
        { key: 'C', text: '$20$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$11$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$a_{10} = 1 + 2 \\cdot 9 = 19$.' },

  // Q4
  { chapterCode: CODE, difficulty: 'easy', concept: '공비', requiredSkills: SKILLS_GP_R,
    stem: '등비수열 $2, 6, 18, \\ldots$ 의 공비 $r$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '공비 정의', options: [
        { key: 'A', text: '$a_{n+1} / a_n$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a_{n+1} - a_n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '공차' },
        { key: 'C', text: '첫 항', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '항의 합', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sqrt{a_n a_{n+1}}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$6 / 2$', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '차' },
        { key: 'C', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '첫항' },
        { key: 'D', text: '$6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$r$?', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '차' },
        { key: 'C', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '첫항' },
        { key: 'D', text: '$6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$1/3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '뒤집힘' },
      ] },
    ], solution: '$r = 6/2 = 3$.' },

  // Q5
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\sum k$', requiredSkills: SKILLS_SIGMA_K,
    stem: '$\\sum_{k=1}^n k = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '가우스 합', options: [
        { key: 'A', text: '$n(n+1)/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$n^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$n!$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$n(n+1)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '나누기 누락' },
        { key: 'E', text: '$n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$1 + 2 + \\ldots + n$', options: [
        { key: 'A', text: '$n(n+1)/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$n(n-1)/2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$n^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sum k^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$n(n+1)/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$n^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$n(n-1)/2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$n(n+1)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\sum_{k=1}^n k = n(n+1)/2$.' },

  // Q6
  { chapterCode: CODE, difficulty: 'easy', concept: '등차합 공식', requiredSkills: SKILLS_AP_SUM,
    stem: '등차수열 합 $S_n$ 공식?',
    steps: [
      { stepType: 'CONCEPT', prompt: '첫항·끝항 평균 $\\times$ 항수', options: [
        { key: 'A', text: '$S_n = n(a_1 + a_n)/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$S_n = n \\cdot a_n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$S_n = a_1 + a_n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '항수 누락' },
        { key: 'D', text: '$S_n = a_1 \\cdot a_n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$S_n = n!$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '대안 형태', options: [
        { key: 'A', text: '$S_n = n[2a_1 + (n-1)d]/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$S_n = n^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$S_n = a_1 \\cdot r^{n}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '등비' },
        { key: 'D', text: '$S_n = n + a_1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$S_n = a_1^n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '공식?', options: [
        { key: 'A', text: '$n(a_1 + a_n)/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$n \\cdot a_n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$a_1 + a_n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$a_1 \\cdot a_n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$n^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$S_n = n(a_1 + a_n)/2$.' },

  // Q7
  { chapterCode: CODE, difficulty: 'medium', concept: '$a_5$', requiredSkills: SKILLS_AP_TERM,
    stem: '등차수열 $1, 4, 7, \\ldots$ 의 $a_5$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$a_1 = 1, d = 3$', options: [
        { key: 'A', text: '$a_5 = 1 + 3 \\cdot 4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a_5 = 1 + 3 \\cdot 5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$n-1$' },
        { key: 'C', text: '$a_5 = 1 \\cdot 3^4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '등비' },
        { key: 'D', text: '$a_5 = 5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$a_5 = 1 + 4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$d$ 누락' },
      ] },
      { stepType: 'PROCESS', prompt: '$1 + 12$', options: [
        { key: 'A', text: '$13$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$16$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$n$ 사용' },
        { key: 'C', text: '$15$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$81$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$3^4$' },
      ] },
      { stepType: 'ANSWER', prompt: '$a_5$?', options: [
        { key: 'A', text: '$13$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$16$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$15$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$81$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '등비' },
      ] },
    ], solution: '$a_5 = 1 + 3 \\cdot 4 = 13$.' },

  // Q8
  { chapterCode: CODE, difficulty: 'medium', concept: '$S_{10}$', requiredSkills: SKILLS_AP_SUM,
    stem: '$a_1 = 2, d = 3$ 등차수열의 $S_{10}$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$S_n = n[2a_1 + (n-1)d]/2$', options: [
        { key: 'A', text: '$10[4 + 27]/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$10[2 + 30]/2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$2a_1$ 무시' },
        { key: 'C', text: '$2 \\cdot 3 \\cdot 10$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$10 \\cdot 5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$10 \\cdot a_{10}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$10 \\cdot 31 / 2$', options: [
        { key: 'A', text: '$155$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$310$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나누기 누락' },
        { key: 'C', text: '$60$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$30$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$50$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$S_{10}$?', options: [
        { key: 'A', text: '$155$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$310$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나누기 누락' },
        { key: 'C', text: '$60$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$30$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$50$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$S_{10} = 10(2 \\cdot 2 + 9 \\cdot 3)/2 = 155$.' },

  // Q9
  { chapterCode: CODE, difficulty: 'medium', concept: '등비 일반항', requiredSkills: SKILLS_GP_TERM,
    stem: '$a_1 = 1, r = 2$ 등비수열의 $a_5$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$a_n = a_1 r^{n-1}$', options: [
        { key: 'A', text: '$1 \\cdot 2^4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1 \\cdot 2^5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$n-1$' },
        { key: 'C', text: '$1 + 2 \\cdot 4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '등차' },
        { key: 'D', text: '$1 \\cdot 2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$2^4$', options: [
        { key: 'A', text: '$16$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$32$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$2^5$' },
        { key: 'C', text: '$8$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$9$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '등차' },
        { key: 'E', text: '$10$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$a_5$?', options: [
        { key: 'A', text: '$16$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$32$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$2^5$' },
        { key: 'C', text: '$8$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$9$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '등차' },
        { key: 'E', text: '$10$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$a_5 = 2^4 = 16$.' },

  // Q10
  { chapterCode: CODE, difficulty: 'medium', concept: '등비 합', requiredSkills: SKILLS_GP_SUM,
    stem: '$a_1 = 1, r = 2$ 등비수열의 $S_5$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$S_n = a_1 (r^n - 1)/(r - 1)$', options: [
        { key: 'A', text: '$(2^5 - 1)/(2-1)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5 \\cdot (1 + 2^4)/2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '등차 합' },
        { key: 'C', text: '$2^5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$5 \\cdot 2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1 + 2 + 3 + 4 + 5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\sum k$' },
      ] },
      { stepType: 'PROCESS', prompt: '$32 - 1 = 31$', options: [
        { key: 'A', text: '$31$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$32$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$-1$ 누락' },
        { key: 'C', text: '$15$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$16$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$a_5$' },
        { key: 'E', text: '$10$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$S_5$?', options: [
        { key: 'A', text: '$31$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$32$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$15$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$16$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$10$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$S_5 = (2^5 - 1)/1 = 31$.' },

  // Q11
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\sum_{k=1}^{10} k$', requiredSkills: SKILLS_SIGMA_K,
    stem: '$\\sum_{k=1}^{10} k = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$n(n+1)/2$, $n=10$', options: [
        { key: 'A', text: '$10 \\cdot 11 / 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$10 \\cdot 9 / 2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$n+1$' },
        { key: 'C', text: '$10^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$10!$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$10$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$110/2$', options: [
        { key: 'A', text: '$55$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$110$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나누기 누락' },
        { key: 'C', text: '$100$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$50$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$45$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$n-1$' },
      ] },
      { stepType: 'ANSWER', prompt: '값?', options: [
        { key: 'A', text: '$55$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$110$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$100$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$50$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$45$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$10 \\cdot 11 / 2 = 55$.' },

  // Q12
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\sum 2k$', requiredSkills: SKILLS_SIGMA,
    stem: '$\\sum_{k=1}^{10} 2k = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '상수 밖으로', options: [
        { key: 'A', text: '$2 \\sum_{k=1}^{10} k$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sum 2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2 + \\sum k$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\sum k^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2 \\cdot 10$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$2 \\cdot 55$', options: [
        { key: 'A', text: '$110$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$55$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱 누락' },
        { key: 'C', text: '$220$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$20$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$100$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '값?', options: [
        { key: 'A', text: '$110$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$55$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$220$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$20$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$100$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$2 \\sum k = 2 \\cdot 55 = 110$.' },

  // Q13
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\sum k^2$ 공식', requiredSkills: SKILLS_SIGMA_K2,
    stem: '$\\sum_{k=1}^n k^2 = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '공식 암기', options: [
        { key: 'A', text: '$n(n+1)(2n+1)/6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(n(n+1)/2)^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\sum k^3$' },
        { key: 'C', text: '$n(n+1)/2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\sum k$' },
        { key: 'D', text: '$n^3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2n + 1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '공식', options: [
        { key: 'A', text: '$n(n+1)(2n+1)/6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$n(n-1)(2n-1)/6$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$n(n+1)/3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\sum k$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$n^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$n(n+1)(2n+1)/6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(n(n+1)/2)^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\sum k^3$' },
        { key: 'C', text: '$n(n+1)/2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\sum k$' },
        { key: 'D', text: '$n^3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2n+1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\sum_{k=1}^n k^2 = n(n+1)(2n+1)/6$.' },

  // Q14
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\sum_{k=1}^{5} k^2$', requiredSkills: SKILLS_SIGMA_K2,
    stem: '$\\sum_{k=1}^{5} k^2 = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$5 \\cdot 6 \\cdot 11 / 6$', options: [
        { key: 'A', text: '$330/6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5 \\cdot 6 \\cdot 10/6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$2n+1 = 11$' },
        { key: 'C', text: '$5(5+1)/2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\sum k$' },
        { key: 'D', text: '$5^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$5!$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$330/6 = 55$', options: [
        { key: 'A', text: '$55$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$25$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$5^2$' },
        { key: 'C', text: '$15$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\sum k$' },
        { key: 'D', text: '$30$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '값?', options: [
        { key: 'A', text: '$55$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$25$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$15$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\sum k$' },
        { key: 'D', text: '$30$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$5 \\cdot 6 \\cdot 11 / 6 = 55$.' },

  // Q15
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\sum$ 상수', requiredSkills: SKILLS_SIGMA_CONST,
    stem: '$\\sum_{k=1}^n c$ ($c$ 는 상수)?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$c$ 를 $n$ 번 더함', options: [
        { key: 'A', text: '$cn$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$c$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '한 번만' },
        { key: 'C', text: '$c^n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$c + n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '예: $c = 3, n = 5$ → $15$', options: [
        { key: 'A', text: '$cn$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$c$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$c^n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$cn$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$c$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$c^n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$c + n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\sum_{k=1}^n c = cn$.' },

  // Q16 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '연립으로 $a_1, d$', requiredSkills: SKILLS_AP_TERM,
    stem: '등차수열 $a_3 = 7, a_7 = 15$. $a_1, d$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$a_n = a_1 + (n-1)d$', options: [
        { key: 'A', text: '$a_1 + 2d = 7$, $a_1 + 6d = 15$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a_1 + 3d = 7$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$n - 1$' },
        { key: 'C', text: '$a_3 = 3 + d$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$a_1 = 3, d = 7$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$a_3 \\cdot a_7 = 105$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '뺄셈 → $4d = 8 \\to d = 2$, $a_1 = 7 - 4 = 3$', options: [
        { key: 'A', text: '$a_1 = 3, d = 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a_1 = 1, d = 2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$a_1 = 3, d = 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$a_1 = 7, d = 2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$a_3$ 자체' },
        { key: 'E', text: '$a_1 = 0, d = 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$(a_1, d)$?', options: [
        { key: 'A', text: '$(3, 2)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(1, 2)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$(3, 1)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(7, 2)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(0, 3)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(a_7 - a_3) = 4d = 8 \\to d = 2$, $a_1 = 7 - 2 \\cdot 2 = 3$.' },

  // Q17 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '$S_n$ 로부터 $d$', requiredSkills: SKILLS_AP_SUM,
    stem: '$a_1 = 1, S_{10} = 100$ 등차수열. $d$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$S_n = n[2a_1 + (n-1)d]/2$', options: [
        { key: 'A', text: '$100 = 10[2 + 9d]/2 = 5(2 + 9d)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$100 = 10 \\cdot d$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$100 = a_1 + a_{10}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$100 = 10 \\cdot a_5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$100 = 10 + 45d \\to 90 = 45d$', options: [
        { key: 'A', text: '$d = 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$d = 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$d = 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$d = 10$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$d = 0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$d$?', options: [
        { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$10$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$5(2 + 9d) = 100 \\to d = 2$.' },

  // Q18 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '$\\sum (2k+1)$', requiredSkills: SKILLS_SIGMA,
    stem: '$\\sum_{k=1}^{5} (2k + 1) = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '분배', options: [
        { key: 'A', text: '$2 \\sum k + \\sum 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sum 2k \\cdot \\sum 1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱 아님' },
        { key: 'C', text: '$2 \\sum k + 1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\sum 1 = n$' },
        { key: 'D', text: '$(2 \\sum k)^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$2 \\cdot 15 + 5 = 30 + 5$', options: [
        { key: 'A', text: '$35$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$30$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$+5$ 누락' },
        { key: 'C', text: '$31$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\sum 1 = 1$' },
        { key: 'D', text: '$25$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$20$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '값?', options: [
        { key: 'A', text: '$35$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$30$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$31$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$25$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$20$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$2 \\cdot 15 + 5 = 35$. (검증: $3+5+7+9+11=35$.)' },

  // Q19 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '점화식', requiredSkills: SKILLS_RECURRENCE,
    stem: '$a_1 = 1, a_{n+1} = a_n + 2$. $a_5$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '점화식 의미', options: [
        { key: 'A', text: '각 항 = 직전 항 + $2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '각 항 = $2 \\times$ 직전', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '등비' },
        { key: 'C', text: '$a_n = n + 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$a_n = 2n$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$1, 3, 5, 7, 9$', options: [
        { key: 'A', text: '$a_5 = 9$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a_5 = 11$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$a_6$' },
        { key: 'C', text: '$a_5 = 10$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$a_5 = 32$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '등비' },
        { key: 'E', text: '$a_5 = 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$a_5$?', options: [
        { key: 'A', text: '$9$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$11$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$10$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$32$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$1 \\to 3 \\to 5 \\to 7 \\to 9$. (등차 $d = 2$).' },

  // Q20 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '분수 등비 합', requiredSkills: SKILLS_GP_SUM,
    stem: '$a_1 = 1, r = 1/2$ 등비수열의 $S_4$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$S_n = a_1 (1 - r^n)/(1 - r)$ ($r < 1$ 형태)', options: [
        { key: 'A', text: '$(1 - (1/2)^4)/(1 - 1/2)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4 \\cdot 1/2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$1 + 1/2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(1/2)^4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$(15/16) / (1/2) = 15/8$', options: [
        { key: 'A', text: '$15/8$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$15/16$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나누기 누락' },
        { key: 'C', text: '$1/8$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1/2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$S_4$?', options: [
        { key: 'A', text: '$15/8$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$15/16$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$1/8$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1/2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$S_4 = 1 + 1/2 + 1/4 + 1/8 = 15/8$.' },
];

export const K_G11_ALG_CH03_SEQUENCE_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
