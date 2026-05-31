/**
 * K-G11-STAT-CH01-COUNTING-ADV (경우의 수 심화) — 20문제 3-step Mastery.
 * 고2 확률과 통계 — 중복순열 ($_n\Pi_r = n^r$) → 중복조합 ($_nH_r = _{n+r-1}C_r$) →
 *   이항정리 → 이항계수 → 파스칼 삼각형 → 정수해 개수.
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 * 주요 errorCode:
 *   FORMULA_SELECTION_ERROR 8 (공식 혼동)
 *   ALGEBRA_ERROR 5 / ARITHMETIC_ERROR 4 / CONDITION_MISSING 2
 *
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G11-STAT-CH01-COUNTING-ADV';
const SKILLS_PERM_REP = ['perm_with_repetition_nPi_r'];
const SKILLS_COMB_REP = ['combination_with_repetition_nH_r'];
const SKILLS_BINOMIAL = ['binomial_theorem'];
const SKILLS_BINOM_COEF = ['binomial_coefficient'];
const SKILLS_PASCAL = ['pascal_identity'];
const SKILLS_INT_SOL = ['integer_solutions'];

const problems: KoreanProblemSeed[] = [
  // Q1
  { chapterCode: CODE, difficulty: 'easy', concept: '$_n\\Pi_r$ 공식', requiredSkills: SKILLS_PERM_REP,
    stem: '중복순열 $_n\\Pi_r$ 의 공식?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$r$ 번 추출, 매번 $n$ 가지', options: [
        { key: 'A', text: '$n^r$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$n!$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$_nP_r$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '비중복' },
        { key: 'D', text: '$_nC_r$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$r^n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '바뀜' },
      ] },
      { stepType: 'PROCESS', prompt: '곱의 법칙', options: [
        { key: 'A', text: '$\\underbrace{n \\cdot n \\cdots n}_{r} = n^r$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$n + r$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
        { key: 'C', text: '$n \\cdot r$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$r!$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$n!/r!$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$n^r$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$r^n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '바뀜' },
        { key: 'C', text: '$_nP_r$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '비중복' },
        { key: 'D', text: '$n!$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$_nC_r$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$_n\\Pi_r = n^r$.' },

  // Q2
  { chapterCode: CODE, difficulty: 'easy', concept: '$_2\\Pi_3$', requiredSkills: SKILLS_PERM_REP,
    stem: '$_2\\Pi_3 = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$2^3$', options: [
        { key: 'A', text: '$2 \\cdot 2 \\cdot 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2 \\cdot 3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$3^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '바뀜' },
        { key: 'D', text: '$2!$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$_2P_3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '정의 안 됨' },
      ] },
      { stepType: 'PROCESS', prompt: '$8$', options: [
        { key: 'A', text: '$8$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$6$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱' },
        { key: 'C', text: '$9$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$3^2$' },
        { key: 'D', text: '$2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '값?', options: [
        { key: 'A', text: '$8$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$9$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$6$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$2^3 = 8$.' },

  // Q3
  { chapterCode: CODE, difficulty: 'easy', concept: '$_nH_r$ 공식', requiredSkills: SKILLS_COMB_REP,
    stem: '중복조합 $_nH_r$ 의 공식?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$n$ 종류 중 $r$ 개 (중복 허용·순서 무관)', options: [
        { key: 'A', text: '$_{n+r-1}C_r$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$_{n-r+1}C_r$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$_nC_r$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '비중복' },
        { key: 'D', text: '$n^r$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '중복순열' },
        { key: 'E', text: '$n! / r!$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$_nH_r = _{n+r-1}C_r$', options: [
        { key: 'A', text: '$_{n+r-1}C_r$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$_{n+r-1}P_r$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '순열' },
        { key: 'C', text: '$_n C_{r-1}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$_n\\Pi_r$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\binom{n}{r}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$_nC_r$' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$_{n+r-1}C_r$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$_nC_r$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '비중복' },
        { key: 'C', text: '$n^r$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '중복순열' },
        { key: 'D', text: '$_{n-r+1}C_r$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$n!/r!$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$_nH_r = _{n+r-1}C_r$.' },

  // Q4
  { chapterCode: CODE, difficulty: 'easy', concept: '$(a+b)^2$', requiredSkills: SKILLS_BINOMIAL,
    stem: '$(a + b)^2 = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '곱셈공식', options: [
        { key: 'A', text: '$a^2 + 2ab + b^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a^2 + b^2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '교차항 누락' },
        { key: 'C', text: '$a^2 - 2ab + b^2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(ab)^2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2(a + b)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$a^2 + 2ab + b^2$', options: [
        { key: 'A', text: '$a^2 + 2ab + b^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a^2 + b^2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$a^2 - 2ab + b^2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$ab + 2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2ab$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$a^2 + 2ab + b^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a^2 + b^2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$a^2 - 2ab + b^2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(ab)^2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2(a + b)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$a^2 + 2ab + b^2$.' },

  // Q5
  { chapterCode: CODE, difficulty: 'easy', concept: '$(a+b)^3$', requiredSkills: SKILLS_BINOMIAL,
    stem: '$(a + b)^3 = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '이항정리 + 파스칼 (1, 3, 3, 1)', options: [
        { key: 'A', text: '$a^3 + 3a^2 b + 3a b^2 + b^3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a^3 + b^3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '교차항 누락' },
        { key: 'C', text: '$(a + b) \\cdot 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$a^3 + 3ab + b^3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$a^3 - 3a^2 b + 3a b^2 - b^3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$(a-b)^3$' },
      ] },
      { stepType: 'PROCESS', prompt: '계수 1, 3, 3, 1', options: [
        { key: 'A', text: '$a^3 + 3a^2 b + 3a b^2 + b^3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a^3 + 2a^2 b + 2a b^2 + b^3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$a^3 + b^3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$3(a + b)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$3a^2 b^2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$a^3 + 3a^2 b + 3a b^2 + b^3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a^3 + b^3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$a^3 - 3a^2 b + 3a b^2 - b^3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$a^3 + 3ab + b^3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$3(a+b)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$a^3 + 3a^2 b + 3a b^2 + b^3$.' },

  // Q6
  { chapterCode: CODE, difficulty: 'easy', concept: '$_3C_1$', requiredSkills: SKILLS_BINOM_COEF,
    stem: '$_3C_1 = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$3$ 중 $1$', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3!$' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$9$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$3$', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$9$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$_3C_1$?', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$9$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$_3C_1 = 3$.' },

  // Q7
  { chapterCode: CODE, difficulty: 'medium', concept: '동전 5번', requiredSkills: SKILLS_PERM_REP,
    stem: '동전 $5$ 번 던지기 경우의 수?',
    steps: [
      { stepType: 'CONCEPT', prompt: '각 번 앞/뒤 2가지', options: [
        { key: 'A', text: '$_2\\Pi_5 = 2^5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '바뀜' },
        { key: 'C', text: '$_5C_2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2 \\cdot 5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$5!$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$32$', options: [
        { key: 'A', text: '$32$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$25$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$5^2$' },
        { key: 'C', text: '$10$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$_5C_2$' },
        { key: 'D', text: '$10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$120$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$5!$' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$32$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$25$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$10$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$120$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$2^5 = 32$.' },

  // Q8
  { chapterCode: CODE, difficulty: 'medium', concept: '$_3H_2$', requiredSkills: SKILLS_COMB_REP,
    stem: '$3$ 종 사탕에서 $2$ 개 선택 (중복 허용)?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$_3H_2 = _{3+2-1}C_2 = _4C_2$', options: [
        { key: 'A', text: '$_4C_2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$_3C_2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '비중복' },
        { key: 'C', text: '$3^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '중복순열' },
        { key: 'D', text: '$3 + 2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$3 \\cdot 2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$6$', options: [
        { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$_3C_2$' },
        { key: 'C', text: '$9$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$3^2$' },
        { key: 'D', text: '$5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$9$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$_3H_2 = _4C_2 = 6$.' },

  // Q9
  { chapterCode: CODE, difficulty: 'medium', concept: '$x^2$ 계수', requiredSkills: SKILLS_BINOM_COEF,
    stem: '$(x + 1)^4$ 의 $x^2$ 계수?',
    steps: [
      { stepType: 'CONCEPT', prompt: '이항정리: $_4C_k x^k$', options: [
        { key: 'A', text: '$_4C_2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$_4C_3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$k$ 잘못' },
        { key: 'C', text: '$_4P_2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '순열' },
        { key: 'D', text: '$_4C_0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$1$' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$6$', options: [
        { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$12$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '순열' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '계수?', options: [
        { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$12$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '순열' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$_4C_2 = 6$.' },

  // Q10
  { chapterCode: CODE, difficulty: 'medium', concept: '$(2x+1)^3$ $x$ 계수', requiredSkills: SKILLS_BINOM_COEF,
    stem: '$(2x + 1)^3$ 의 $x$ 계수?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$_3C_1 (2x)^1 (1)^2$', options: [
        { key: 'A', text: '$3 \\cdot 2x \\cdot 1 = 6x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3 \\cdot x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$2$ 무시' },
        { key: 'C', text: '$_3C_1 x = 3x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$_3C_2 \\cdot (2x)^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$x^2$ 항' },
        { key: 'E', text: '$2x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '계수 $= 6$', options: [
        { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$2$ 누락' },
        { key: 'C', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$12$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$x$ 계수?', options: [
        { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$12$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$_3C_1 \\cdot 2 = 6$.' },

  // Q11
  { chapterCode: CODE, difficulty: 'medium', concept: '항의 수', requiredSkills: SKILLS_BINOMIAL,
    stem: '$(a + b)^4$ 의 항의 수?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$(a+b)^n$ → $n+1$ 개 항', options: [
        { key: 'A', text: '$n + 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$n$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$2n$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$n^2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$2^n$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$5$', options: [
        { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$8$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$16$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$2^4$' },
        { key: 'E', text: '$24$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$4!$' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$8$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$16$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$24$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$(a+b)^n$ 은 $n+1$ 항 → $5$.' },

  // Q12
  { chapterCode: CODE, difficulty: 'medium', concept: '세 자리 수 만들기', requiredSkills: SKILLS_PERM_REP,
    stem: '$\\{0, 1, 2\\}$ 로 만드는 세 자리 수 (중복 허용)?',
    steps: [
      { stepType: 'CONCEPT', prompt: '첫째 자리 $\\neq 0$', options: [
        { key: 'A', text: '백 $2$ × 십 $3$ × 일 $3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3^3 = 27$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '첫째 $0$ 가능' },
        { key: 'C', text: '$3!$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '중복 허용' },
        { key: 'D', text: '$3 \\cdot 2 \\cdot 1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '비중복' },
        { key: 'E', text: '$3$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$2 \\cdot 3 \\cdot 3$', options: [
        { key: 'A', text: '$18$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$27$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '첫째 $0$ 제외 안 함' },
        { key: 'C', text: '$6$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '비중복' },
        { key: 'D', text: '$9$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'E', text: '$24$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$18$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$27$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'C', text: '$6$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'D', text: '$9$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'E', text: '$24$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
    ], solution: '$2 \\cdot 3 \\cdot 3 = 18$.' },

  // Q13
  { chapterCode: CODE, difficulty: 'medium', concept: '책 분배', requiredSkills: SKILLS_COMB_REP,
    stem: '같은 책 $5$ 권을 $2$ 명에게 분배 (각 $0$~$5$)?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$_nH_r$ ($n$ = 사람 수, $r$ = 책 수)', options: [
        { key: 'A', text: '$_2H_5 = _6C_5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$_5H_2 = _6C_2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$n, r$ 바뀜' },
        { key: 'C', text: '$2^5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '중복순열' },
        { key: 'D', text: '$5!$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$5/2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$_6C_5 = 6$', options: [
        { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$15$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$_6C_2$' },
        { key: 'C', text: '$32$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$2^5$' },
        { key: 'D', text: '$120$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$15$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$32$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$120$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$_2H_5 = _6C_5 = 6$.' },

  // Q14
  { chapterCode: CODE, difficulty: 'medium', concept: '$_5\\Pi_2$', requiredSkills: SKILLS_PERM_REP,
    stem: '$_5\\Pi_2 = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$5^2$', options: [
        { key: 'A', text: '$5 \\cdot 5 = 25$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5 \\cdot 4 = 20$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$_5P_2$' },
        { key: 'C', text: '$2^5 = 32$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '바뀜' },
        { key: 'D', text: '$10$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$_5C_2$' },
        { key: 'E', text: '$7$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
      ] },
      { stepType: 'PROCESS', prompt: '$25$', options: [
        { key: 'A', text: '$25$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$20$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$_5P_2$' },
        { key: 'C', text: '$32$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$2^5$' },
        { key: 'D', text: '$10$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$_5C_2$' },
        { key: 'E', text: '$7$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$25$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$20$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$32$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$10$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$7$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$5^2 = 25$.' },

  // Q15
  { chapterCode: CODE, difficulty: 'medium', concept: '파스칼 항등식', requiredSkills: SKILLS_PASCAL,
    stem: '$_4C_2 + _4C_3 = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '파스칼: $_nC_r + _nC_{r+1} = _{n+1}C_{r+1}$', options: [
        { key: 'A', text: '$_5C_3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$_5C_5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$_8C_5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$_4C_5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$_4C_2 \\cdot _4C_3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱' },
      ] },
      { stepType: 'PROCESS', prompt: '$_5C_3 = 10$', options: [
        { key: 'A', text: '$10$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$_4C_1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$20$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$24$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱' },
        { key: 'E', text: '$5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$10$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$20$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$24$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱' },
        { key: 'D', text: '$5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$15$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '파스칼 → $_5C_3 = 10$. ($6 + 4 = 10$ 도 가능.)' },

  // Q16 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '$x^2 y^3$ 계수', requiredSkills: SKILLS_BINOM_COEF,
    stem: '$(x + y)^5$ 의 $x^2 y^3$ 계수?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$_5C_3$ ($y$ 지수)', options: [
        { key: 'A', text: '$_5C_3 = _5C_2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$_5C_5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$_5P_3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '순열' },
        { key: 'D', text: '$5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$_5C_3 = 10$', options: [
        { key: 'A', text: '$10$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$15$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$60$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$_5P_3$' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '계수?', options: [
        { key: 'A', text: '$10$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$15$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$60$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$_5C_3 = 10$.' },

  // Q17 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '조건부 선택+배열', requiredSkills: SKILLS_COMB_REP,
    stem: '모음 $\\{A, E, I\\}$ 와 자음 $\\{B, C, D\\}$ 에서 $3$ 개를 골라 일렬 배열. 모음이 정확히 $2$ 개?',
    steps: [
      { stepType: 'CONCEPT', prompt: '선택 × 배열', options: [
        { key: 'A', text: '$_3C_2 \\cdot _3C_1 \\cdot 3!$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$_3C_2$ 만', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '자음·배열 누락' },
        { key: 'C', text: '$_3C_2 + _3C_1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '곱 아님' },
        { key: 'D', text: '$3!$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '선택 누락' },
        { key: 'E', text: '$_6C_3$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '모음 제약 무시' },
      ] },
      { stepType: 'PROCESS', prompt: '$3 \\cdot 3 \\cdot 6$', options: [
        { key: 'A', text: '$54$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$9$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '배열 누락' },
        { key: 'C', text: '$18$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'D', text: '$36$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$72$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$54$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$9$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'C', text: '$18$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'D', text: '$36$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$72$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$_3C_2 \\cdot _3C_1 \\cdot 3! = 3 \\cdot 3 \\cdot 6 = 54$.' },

  // Q18 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '$x^3$ 계수', requiredSkills: SKILLS_BINOM_COEF,
    stem: '$(1 + x)^{10}$ 의 $x^3$ 계수?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$_{10}C_3$', options: [
        { key: 'A', text: '$_{10}C_3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$_{10}P_3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '순열' },
        { key: 'C', text: '$_{10}C_4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$10$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$3^{10}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$10 \\cdot 9 \\cdot 8 / 6$', options: [
        { key: 'A', text: '$120$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$720$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$_{10}P_3$' },
        { key: 'C', text: '$30$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$60$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '계수?', options: [
        { key: 'A', text: '$120$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$720$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$30$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$60$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$_{10}C_3 = 120$.' },

  // Q19 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '사탕 분배', requiredSkills: SKILLS_COMB_REP,
    stem: '같은 사탕 $4$ 개를 $3$ 명에 나눠줌 (각 $0$~$4$)?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$_3H_4 = _6C_4$', options: [
        { key: 'A', text: '$_3H_4 = _6C_4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$_4H_3 = _6C_3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$n, r$ 바뀜' },
        { key: 'C', text: '$3^4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '중복순열' },
        { key: 'D', text: '$4!$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$_3C_4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '정의 안 됨' },
      ] },
      { stepType: 'PROCESS', prompt: '$_6C_4 = 15$', options: [
        { key: 'A', text: '$15$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$20$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$_6C_3$' },
        { key: 'C', text: '$81$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$3^4$' },
        { key: 'D', text: '$24$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$4!$' },
        { key: 'E', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$15$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$20$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$81$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$24$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$_3H_4 = _6C_4 = 15$.' },

  // Q20 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '음 아닌 정수해', requiredSkills: SKILLS_INT_SOL,
    stem: '$x_1 + x_2 + x_3 = 5$ ($x_i \\geq 0$ 정수) 의 해 개수?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$_3H_5$ 또는 별과 막대', options: [
        { key: 'A', text: '$_3H_5 = _7C_5 = _7C_2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5^3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$3 \\cdot 5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$_5C_3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '비중복' },
        { key: 'E', text: '$3!$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$_7C_2 = 21$', options: [
        { key: 'A', text: '$21$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$15$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$125$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$5^3$' },
        { key: 'D', text: '$10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$_5C_3$' },
        { key: 'E', text: '$35$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$21$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$15$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$125$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$35$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$_3H_5 = _7C_2 = 21$.' },
];

export const K_G11_STAT_CH01_COUNTING_ADV_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
