/**
 * K-G10-CS1-CH03-COUNTING (경우의 수·순열·조합) — 20문제 3-step Mastery.
 * 고1 — 합/곱의 법칙 → 순열 $_nP_r$ → 조합 $_nC_r$ → 같은 것이 있는 순열 →
 *        원순열 → 조합의 성질 → 조건부 (이웃·양 끝).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 * 주요 errorCode:
 *   FORMULA_SELECTION_ERROR 7 (순열/조합 혼동·합/곱 혼동)
 *   ARITHMETIC_ERROR 6 (factorial 실수)
 *   CONCEPT_MISUNDERSTANDING 4 / CONDITION_MISSING 3
 *
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G10-CS1-CH03-COUNTING';
const SKILLS_FACT = ['factorial'];
const SKILLS_PERM = ['permutation_npr'];
const SKILLS_COMB = ['combination_ncr'];
const SKILLS_PROD = ['product_rule'];
const SKILLS_SUM = ['sum_rule'];
const SKILLS_REPEAT = ['perm_with_repetition'];
const SKILLS_CIRC = ['circular_permutation'];
const SKILLS_COND = ['adjacency_endpoints_condition'];

const problems: KoreanProblemSeed[] = [
  // Q1
  { chapterCode: CODE, difficulty: 'easy', concept: '$5!$', requiredSkills: SKILLS_FACT,
    stem: '$5! = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$n! = n \\cdot (n-1) \\cdots 2 \\cdot 1$', options: [
        { key: 'A', text: '$5 \\cdot 4 \\cdot 3 \\cdot 2 \\cdot 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5 + 4 + 3 + 2 + 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합 아님' },
        { key: 'C', text: '$5 \\cdot 5 \\cdot 5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '제곱 아님' },
        { key: 'D', text: '$5^2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$5 + 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '계산', options: [
        { key: 'A', text: '$120$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$15$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합' },
        { key: 'C', text: '$25$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$5^2$' },
        { key: 'D', text: '$24$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$4!$' },
        { key: 'E', text: '$60$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$5!$', options: [
        { key: 'A', text: '$120$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$24$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$4!$' },
        { key: 'C', text: '$15$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합' },
        { key: 'D', text: '$25$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$60$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$5! = 5 \\cdot 4 \\cdot 3 \\cdot 2 \\cdot 1 = 120$.' },

  // Q2
  { chapterCode: CODE, difficulty: 'easy', concept: '$3!$', requiredSkills: SKILLS_FACT,
    stem: '$3! = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$3!$ 정의', options: [
        { key: 'A', text: '$3 \\cdot 2 \\cdot 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3 + 2 + 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곱 아님' },
        { key: 'C', text: '$3^3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$3 \\cdot 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '계산', options: [
        { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$3^2$' },
        { key: 'C', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$27$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$3^3$' },
      ] },
      { stepType: 'ANSWER', prompt: '$3!$', options: [
        { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$3^2$' },
        { key: 'C', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$27$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$3! = 6$.' },

  // Q3
  { chapterCode: CODE, difficulty: 'easy', concept: '$_5P_2$', requiredSkills: SKILLS_PERM,
    stem: '$_5P_2 = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$_nP_r$ 공식', options: [
        { key: 'A', text: '$n(n-1) \\cdots (n-r+1)$ — $r$ 개 곱', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$n + r$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합 아님' },
        { key: 'C', text: '$n!/r!$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '분모 잘못' },
        { key: 'D', text: '$_nC_r$ 와 같음', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '순서 고려 다름' },
        { key: 'E', text: '$n^r$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '중복순열' },
      ] },
      { stepType: 'PROCESS', prompt: '$5 \\cdot 4$', options: [
        { key: 'A', text: '$20$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$10$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$_5C_2$' },
        { key: 'C', text: '$25$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$5^2$' },
        { key: 'D', text: '$120$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$5!$' },
        { key: 'E', text: '$7$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합' },
      ] },
      { stepType: 'ANSWER', prompt: '$_5P_2$', options: [
        { key: 'A', text: '$20$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$10$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '조합 혼동' },
        { key: 'C', text: '$25$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$120$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$5!$' },
        { key: 'E', text: '$7$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합' },
      ] },
    ], solution: '$_5P_2 = 5 \\cdot 4 = 20$.' },

  // Q4
  { chapterCode: CODE, difficulty: 'easy', concept: '$_5C_2$', requiredSkills: SKILLS_COMB,
    stem: '$_5C_2 = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$_nC_r$ 공식', options: [
        { key: 'A', text: '$_nP_r / r!$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$_nP_r$ 와 같음', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '순서 무시' },
        { key: 'C', text: '$n!$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$n + r$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
        { key: 'E', text: '$n^r$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$20 / 2$', options: [
        { key: 'A', text: '$10$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$20$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$_5P_2$' },
        { key: 'C', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$25$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$15$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$_5C_2$', options: [
        { key: 'A', text: '$10$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$20$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '순열' },
        { key: 'C', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$25$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$15$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$_5C_2 = (5 \\cdot 4) / (2 \\cdot 1) = 10$.' },

  // Q5
  { chapterCode: CODE, difficulty: 'easy', concept: '곱의 법칙', requiredSkills: SKILLS_PROD,
    stem: '셔츠 $3$ 종, 바지 $2$ 종. 한 벌 조합?',
    steps: [
      { stepType: 'CONCEPT', prompt: '동시 선택?', options: [
        { key: 'A', text: '단계별 선택 → 곱의 법칙', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '둘 중 하나 → 합의 법칙', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '둘 다 필요' },
        { key: 'C', text: '나눗셈', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '뺄셈', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '제곱', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$3 \\times 2$', options: [
        { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$9$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '한 벌 경우의 수?', options: [
        { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합 혼동' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$9$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '셔츠·바지 둘 다 — 곱의 법칙 $3 \\times 2 = 6$.' },

  // Q6
  { chapterCode: CODE, difficulty: 'easy', concept: '합의 법칙', requiredSkills: SKILLS_SUM,
    stem: '버스 $3$ 종 또는 지하철 $2$ 종 중 하나로 등교. 방법의 수? (배반)',
    steps: [
      { stepType: 'CONCEPT', prompt: '동시 X, 둘 중 하나만', options: [
        { key: 'A', text: '배반 — 합의 법칙', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '곱의 법칙', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '동시 아님' },
        { key: 'C', text: '나눗셈', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '뺄셈', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '제곱', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$3 + 2$', options: [
        { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$6$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '방법의 수?', options: [
        { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$6$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱 혼동' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '배반 → 합의 법칙 $3 + 2 = 5$.' },

  // Q7
  { chapterCode: CODE, difficulty: 'medium', concept: '$_6P_3$', requiredSkills: SKILLS_PERM,
    stem: '$_6P_3 = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$_6P_3 = 6 \\cdot 5 \\cdot 4$', options: [
        { key: 'A', text: '$6 \\cdot 5 \\cdot 4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$6 \\cdot 5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$_6P_2$' },
        { key: 'C', text: '$6!$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '전체 순열' },
        { key: 'D', text: '$6 \\cdot 5 \\cdot 4 / 6$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$_6C_3$' },
        { key: 'E', text: '$6^3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '중복순열' },
      ] },
      { stepType: 'PROCESS', prompt: '계산', options: [
        { key: 'A', text: '$120$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$30$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$_6P_2$' },
        { key: 'C', text: '$20$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$_6C_3$' },
        { key: 'D', text: '$720$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$6!$' },
        { key: 'E', text: '$216$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$6^3$' },
      ] },
      { stepType: 'ANSWER', prompt: '$_6P_3$', options: [
        { key: 'A', text: '$120$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$20$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '조합' },
        { key: 'C', text: '$30$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$_6P_2$' },
        { key: 'D', text: '$720$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$6!$' },
        { key: 'E', text: '$216$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '중복순열' },
      ] },
    ], solution: '$_6P_3 = 6 \\cdot 5 \\cdot 4 = 120$.' },

  // Q8
  { chapterCode: CODE, difficulty: 'medium', concept: '$_6C_3$', requiredSkills: SKILLS_COMB,
    stem: '$_6C_3 = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$_6P_3 / 3!$', options: [
        { key: 'A', text: '$120 / 6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$120$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '나누기 누락' },
        { key: 'C', text: '$120 / 3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$3!$ 아닌 $3$' },
        { key: 'D', text: '$_6P_2 / 2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$6!$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '계산', options: [
        { key: 'A', text: '$20$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$40$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$120/3$' },
        { key: 'C', text: '$120$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '순열' },
        { key: 'D', text: '$60$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$_6C_3$', options: [
        { key: 'A', text: '$20$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$120$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '순열' },
        { key: 'C', text: '$40$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$60$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$_6C_3 = 120/6 = 20$.' },

  // Q9
  { chapterCode: CODE, difficulty: 'medium', concept: '$_7C_2$', requiredSkills: SKILLS_COMB,
    stem: '$_7C_2 = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$(7 \\cdot 6) / (2 \\cdot 1)$', options: [
        { key: 'A', text: '$42 / 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$7 \\cdot 6$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '순열' },
        { key: 'C', text: '$7 + 6$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
        { key: 'D', text: '$7^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$7!$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '계산', options: [
        { key: 'A', text: '$21$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$42$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '순열' },
        { key: 'C', text: '$13$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합' },
        { key: 'D', text: '$49$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$7^2$' },
        { key: 'E', text: '$14$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$_7C_2$', options: [
        { key: 'A', text: '$21$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$42$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$_7P_2$' },
        { key: 'C', text: '$13$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합' },
        { key: 'D', text: '$49$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$14$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$_7C_2 = 42/2 = 21$.' },

  // Q10
  { chapterCode: CODE, difficulty: 'medium', concept: '$n!$ 줄세우기', requiredSkills: SKILLS_FACT,
    stem: 'A, B, C, D, E $5$ 명 일렬 배열의 수?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$n$ 명 줄세우기', options: [
        { key: 'A', text: '$n!$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$n^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$_nC_n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$1$' },
        { key: 'D', text: '$n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$5!$', options: [
        { key: 'A', text: '$120$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$25$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$5^2$' },
        { key: 'C', text: '$24$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$4!$' },
        { key: 'D', text: '$60$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '경우의 수?', options: [
        { key: 'A', text: '$120$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$24$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$4!$' },
        { key: 'C', text: '$25$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$60$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$5! = 120$.' },

  // Q11
  { chapterCode: CODE, difficulty: 'medium', concept: '순열 (뽑아서 줄세우기)', requiredSkills: SKILLS_PERM,
    stem: '$5$ 명 중 $2$ 명을 뽑아 줄세우는 방법?',
    steps: [
      { stepType: 'CONCEPT', prompt: '순서 있음 → 순열', options: [
        { key: 'A', text: '$_5P_2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$_5C_2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '순서 있음' },
        { key: 'C', text: '$5!$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '전체' },
        { key: 'D', text: '$5 + 2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$5^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '중복순열' },
      ] },
      { stepType: 'PROCESS', prompt: '$5 \\cdot 4$', options: [
        { key: 'A', text: '$20$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$10$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '조합' },
        { key: 'C', text: '$120$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$5!$' },
        { key: 'D', text: '$25$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$7$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합' },
      ] },
      { stepType: 'ANSWER', prompt: '방법?', options: [
        { key: 'A', text: '$20$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$10$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '조합 혼동' },
        { key: 'C', text: '$120$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$25$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$7$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합' },
      ] },
    ], solution: '$_5P_2 = 20$.' },

  // Q12
  { chapterCode: CODE, difficulty: 'medium', concept: '조합 (순서 무관)', requiredSkills: SKILLS_COMB,
    stem: '$5$ 명 중 $2$ 명 뽑기 (순서 무관)?',
    steps: [
      { stepType: 'CONCEPT', prompt: '순서 무관 → 조합', options: [
        { key: 'A', text: '$_5C_2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$_5P_2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '순서 무관' },
        { key: 'C', text: '$5!$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$5 \\cdot 2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$5^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$20 / 2$', options: [
        { key: 'A', text: '$10$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$20$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '순열' },
        { key: 'C', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$25$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$15$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '방법?', options: [
        { key: 'A', text: '$10$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$20$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '순열' },
        { key: 'C', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$25$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$15$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$_5C_2 = 10$.' },

  // Q13
  { chapterCode: CODE, difficulty: 'medium', concept: '양 끝 조건 (순열)', requiredSkills: SKILLS_COND,
    stem: 'A, B를 포함한 $5$ 명을 일렬로 세울 때 A, B를 양 끝에 두는 방법?',
    steps: [
      { stepType: 'CONCEPT', prompt: '양 끝 배치 → 나머지 가운데', options: [
        { key: 'A', text: '양 끝 (A, B 순서 $2$ 가지) × 가운데 $3!$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5!$ 전부', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '제약 무시' },
        { key: 'C', text: '$2$ 가지만', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '가운데 누락' },
        { key: 'D', text: '$3! = 6$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '양 끝 누락' },
        { key: 'E', text: '$5 \\cdot 2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$2 \\cdot 3!$', options: [
        { key: 'A', text: '$2 \\cdot 6 = 12$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$6$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\times 2$ 누락' },
        { key: 'C', text: '$24$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$120$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$5!$' },
        { key: 'E', text: '$10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '경우?', options: [
        { key: 'A', text: '$12$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$6$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '양 끝 순서 누락' },
        { key: 'C', text: '$24$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$120$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$5!$' },
        { key: 'E', text: '$48$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '이웃 공식' },
      ] },
    ], solution: '양 끝 (A, B 순서) $2$ × 가운데 $3! = 6$ → $12$.' },

  // Q14
  { chapterCode: CODE, difficulty: 'medium', concept: '같은 것이 있는 순열', requiredSkills: SKILLS_REPEAT,
    stem: '문자열 AAAB 를 일렬로 배열하는 방법?',
    steps: [
      { stepType: 'CONCEPT', prompt: '같은 것 $p$, $q$ 개 → $n! / (p! q!)$', options: [
        { key: 'A', text: '$4! / 3!$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4!$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '동일 처리 누락' },
        { key: 'C', text: '$3!$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'D', text: '$4!/2!$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: 'A 가 3개' },
        { key: 'E', text: '$4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$24 / 6$', options: [
        { key: 'A', text: '$4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$24$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '나누기 누락' },
        { key: 'C', text: '$8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$12$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '방법?', options: [
        { key: 'A', text: '$4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$24$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$4!$' },
        { key: 'C', text: '$12$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$4!/2!$' },
        { key: 'D', text: '$8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$4!/3! = 4$. (A의 위치 4가지)' },

  // Q15
  { chapterCode: CODE, difficulty: 'medium', concept: '동전 H 정확히 2번', requiredSkills: SKILLS_COMB,
    stem: '동전을 $4$ 번 던질 때 앞면 H 가 정확히 $2$ 번 나오는 경우의 수?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$4$ 자리 중 H 위치 선택', options: [
        { key: 'A', text: '$_4C_2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$_4P_2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '순서 무관 (위치만)' },
        { key: 'C', text: '$2^4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '전체' },
        { key: 'D', text: '$4!$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2 \\cdot 4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$6$', options: [
        { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$12$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$_4P_2$' },
        { key: 'C', text: '$16$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$2^4$' },
        { key: 'D', text: '$24$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$4!$' },
        { key: 'E', text: '$8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '경우?', options: [
        { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$12$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '순열' },
        { key: 'C', text: '$16$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '전체' },
        { key: 'D', text: '$24$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$_4C_2 = 6$.' },

  // Q16 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '원순열', requiredSkills: SKILLS_CIRC,
    stem: '$5$ 명을 원탁에 둘러앉히는 방법?',
    steps: [
      { stepType: 'CONCEPT', prompt: '원순열 공식', options: [
        { key: 'A', text: '$(n-1)!$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$n!$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '회전 동치 무시' },
        { key: 'C', text: '$n!/n$ — 맞지만 표준 표현은 $(n-1)!$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '동등하지만 표현 다름' },
        { key: 'D', text: '$_nC_n$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$1$' },
        { key: 'E', text: '$n$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$(5-1)! = 4!$', options: [
        { key: 'A', text: '$24$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$120$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$5!$' },
        { key: 'C', text: '$60$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$25$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '경우?', options: [
        { key: 'A', text: '$24$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$120$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$5!$' },
        { key: 'C', text: '$60$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$25$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(5-1)! = 4! = 24$.' },

  // Q17 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '$_nC_r = _nC_{n-r}$', requiredSkills: SKILLS_COMB,
    stem: '$_{10}C_7$ 의 값?',
    steps: [
      { stepType: 'CONCEPT', prompt: '대칭 성질 사용', options: [
        { key: 'A', text: '$_{10}C_7 = _{10}C_3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$_{10}C_7 = _{10}C_2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$n-r = 3$' },
        { key: 'C', text: '$_{10}C_7$ 계산 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
        { key: 'D', text: '$_{10}P_7$ 와 같음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$7$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$_{10}C_3 = (10 \\cdot 9 \\cdot 8)/(3!)$', options: [
        { key: 'A', text: '$720/6 = 120$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$720$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 누락' },
        { key: 'C', text: '$240$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$/3$' },
        { key: 'D', text: '$30$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$60$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$_{10}C_7$', options: [
        { key: 'A', text: '$120$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$720$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$_{10}P_3$' },
        { key: 'C', text: '$240$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$30$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$60$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$_{10}C_7 = _{10}C_3 = 120$.' },

  // Q18 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '곱의 법칙 + 조합', requiredSkills: SKILLS_COMB,
    stem: '남학생 $3$, 여학생 $2$ 중 남 $2$, 여 $1$ 을 뽑는 방법?',
    steps: [
      { stepType: 'CONCEPT', prompt: '각각 조합 후 곱', options: [
        { key: 'A', text: '$_3C_2 \\cdot _2C_1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$_3C_2 + _2C_1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '동시 → 곱' },
        { key: 'C', text: '$_5C_3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '성별 무시' },
        { key: 'D', text: '$_3P_2 \\cdot _2P_1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '순서 무관' },
        { key: 'E', text: '$3 + 2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$3 \\cdot 2$', options: [
        { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
        { key: 'C', text: '$10$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$_5C_3$' },
        { key: 'D', text: '$12$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '순열' },
        { key: 'E', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '방법?', options: [
        { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합 혼동' },
        { key: 'C', text: '$10$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$_5C_3$' },
        { key: 'D', text: '$12$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$_3C_2 \\cdot _2C_1 = 3 \\cdot 2 = 6$.' },

  // Q19 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '이웃 조건 (묶음법)', requiredSkills: SKILLS_COND,
    stem: 'A, B 를 포함한 $5$ 명을 일렬로 세울 때 A, B 가 이웃하는 방법?',
    steps: [
      { stepType: 'CONCEPT', prompt: 'A·B 를 한 묶음', options: [
        { key: 'A', text: '$4$ 개를 줄세움 ($4!$) × A·B 내부 순서 ($2!$)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5!$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '이웃 조건 무시' },
        { key: 'C', text: '$4!$ 만', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: 'A·B 순서 누락' },
        { key: 'D', text: '$2!$ 만', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'E', text: '$5 \\cdot 2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$4! \\cdot 2!$', options: [
        { key: 'A', text: '$24 \\cdot 2 = 48$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$24$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\times 2$ 누락' },
        { key: 'C', text: '$120$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$5!$' },
        { key: 'D', text: '$12$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '양 끝 공식' },
        { key: 'E', text: '$60$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '방법?', options: [
        { key: 'A', text: '$48$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$24$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\times 2$ 누락' },
        { key: 'C', text: '$120$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '전체' },
        { key: 'D', text: '$12$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '양 끝 공식' },
        { key: 'E', text: '$60$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: 'A, B 묶음 $4! \\cdot 2! = 48$.' },

  // Q20 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '같은 것이 있는 순열 (다중)', requiredSkills: SKILLS_REPEAT,
    stem: '문자열 BANANA 의 서로 다른 배열의 수?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$6$ 글자, A $3$, N $2$, B $1$', options: [
        { key: 'A', text: '$6! / (3! \\cdot 2!)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$6!$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '동일 처리 누락' },
        { key: 'C', text: '$6! / 3!$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: 'N 누락' },
        { key: 'D', text: '$6! / 2!$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: 'A 누락' },
        { key: 'E', text: '$6! / (3! \\cdot 2! \\cdot 1!)$ 와 다름', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$1!=1$ 동일' },
      ] },
      { stepType: 'PROCESS', prompt: '$720 / (6 \\cdot 2) = 720/12$', options: [
        { key: 'A', text: '$60$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$120$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$720/6$' },
        { key: 'C', text: '$360$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$720/2$' },
        { key: 'D', text: '$720$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '동일 무시' },
        { key: 'E', text: '$30$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '배열의 수?', options: [
        { key: 'A', text: '$60$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$120$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: 'N 처리 누락' },
        { key: 'C', text: '$360$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: 'A 처리 누락' },
        { key: 'D', text: '$720$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '동일 무시' },
        { key: 'E', text: '$30$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$6!/(3! \\cdot 2!) = 720/12 = 60$.' },
];

export const K_G10_CS1_CH03_COUNTING_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
