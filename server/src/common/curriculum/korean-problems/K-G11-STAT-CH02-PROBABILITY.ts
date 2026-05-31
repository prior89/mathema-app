/**
 * K-G11-STAT-CH02-PROBABILITY (확률) — 20문제 3-step Mastery.
 * 고2 확률과 통계 — 확률 정의 ($P(A) = n(A)/n(S)$) → 여사건·합사건·배반 →
 *   조건부확률 → 곱셈정리 → 독립.
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 * 주요 errorCode:
 *   FORMULA_SELECTION_ERROR 7 / ARITHMETIC_ERROR 6
 *   CONCEPT_MISUNDERSTANDING 5 / CONDITION_MISSING 2
 *
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G11-STAT-CH02-PROBABILITY';
const SKILLS_DEF = ['probability_definition'];
const SKILLS_RANGE = ['probability_range'];
const SKILLS_COMP = ['complementary_event'];
const SKILLS_UNION = ['union_probability'];
const SKILLS_MUTEX = ['mutually_exclusive'];
const SKILLS_COND = ['conditional_probability'];
const SKILLS_INDEP = ['independence'];
const SKILLS_MULT = ['multiplication_rule'];

const problems: KoreanProblemSeed[] = [
  // Q1
  { chapterCode: CODE, difficulty: 'easy', concept: '동전 앞면', requiredSkills: SKILLS_DEF,
    stem: '동전 1번 던질 때 앞면이 나올 확률?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$P(A) = n(A)/n(S)$', options: [
        { key: 'A', text: '$1/2$ (앞 $1$, 전체 $2$)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$1/2$', options: [
        { key: 'A', text: '$1/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$1/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$1/2$.' },

  // Q2
  { chapterCode: CODE, difficulty: 'easy', concept: '주사위', requiredSkills: SKILLS_DEF,
    stem: '주사위 던져 $3$ 이 나올 확률?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$1$ 가지 / $6$ 가지', options: [
        { key: 'A', text: '$1/6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$3/6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$1/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$1/6$', options: [
        { key: 'A', text: '$1/6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$3/6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$1/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$1/6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$3/6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$1/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$1/6$.' },

  // Q3
  { chapterCode: CODE, difficulty: 'easy', concept: '$P(\\emptyset)$', requiredSkills: SKILLS_RANGE,
    stem: '$P(\\emptyset) = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '공집합 사건', options: [
        { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$P(S)$' },
        { key: 'C', text: '$1/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
        { key: 'E', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '발생하지 않음', options: [
        { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$0.5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$-1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$0.5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$-1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
    ], solution: '$P(\\emptyset) = 0$.' },

  // Q4
  { chapterCode: CODE, difficulty: 'easy', concept: '$P(S)$', requiredSkills: SKILLS_RANGE,
    stem: '$P(S) = ?$ (전체 표본공간)',
    steps: [
      { stepType: 'CONCEPT', prompt: '확실히 발생', options: [
        { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$1/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$n$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$n(S)/n(S) = 1$', options: [
        { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$n$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$1/n$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$1/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$n$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$P(S) = 1$.' },

  // Q5
  { chapterCode: CODE, difficulty: 'easy', concept: '여사건', requiredSkills: SKILLS_COMP,
    stem: '$P(A) = 0.3$ 일 때 $P(A^c)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$P(A^c) = 1 - P(A)$', options: [
        { key: 'A', text: '$1 - 0.3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1 + 0.3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$-0.3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0.3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$0.7$', options: [
        { key: 'A', text: '$0.7$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1.3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$-0.3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0.3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$0.7$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1.3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$-0.3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0.3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$1 - 0.3 = 0.7$.' },

  // Q6
  { chapterCode: CODE, difficulty: 'easy', concept: '확률 범위', requiredSkills: SKILLS_RANGE,
    stem: '확률 $P(A)$ 의 범위?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$0 \\leq P(A) \\leq 1$', options: [
        { key: 'A', text: '$0 \\leq P(A) \\leq 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-1 \\leq P \\leq 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$0 \\leq P \\leq 100$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '백분율' },
        { key: 'D', text: '모든 실수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$P > 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$0$ 포함' },
      ] },
      { stepType: 'PROCESS', prompt: '$[0, 1]$', options: [
        { key: 'A', text: '$0 \\leq P \\leq 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0 < P < 1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$0, 1$ 포함' },
        { key: 'C', text: '$P \\geq 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '상한 누락' },
        { key: 'D', text: '$P \\leq 1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '하한 누락' },
        { key: 'E', text: '$P = 1/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$0 \\leq P \\leq 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0 < P < 1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'C', text: '$P \\geq 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'D', text: '$P \\leq 1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'E', text: '모든 실수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$0 \\leq P(A) \\leq 1$.' },

  // Q7
  { chapterCode: CODE, difficulty: 'medium', concept: '주사위 짝수', requiredSkills: SKILLS_DEF,
    stem: '주사위 던져 짝수가 나올 확률?',
    steps: [
      { stepType: 'CONCEPT', prompt: '짝수: $2, 4, 6$', options: [
        { key: 'A', text: '$3$ 가지 / $6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2$ 가지', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$4$ 가지', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$6$ 가지', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '전체' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$3/6 = 1/2$', options: [
        { key: 'A', text: '$1/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2/3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1/6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$1/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2/3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1/6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$3/6 = 1/2$.' },

  // Q8
  { chapterCode: CODE, difficulty: 'medium', concept: '카드 하트', requiredSkills: SKILLS_DEF,
    stem: '$52$ 장 카드 중 한 장 뽑기. 하트일 확률?',
    steps: [
      { stepType: 'CONCEPT', prompt: '하트 $13$ 장', options: [
        { key: 'A', text: '$13/52$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$13/4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '바뀜' },
        { key: 'C', text: '$26/52$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1/13$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$13$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$13/52 = 1/4$', options: [
        { key: 'A', text: '$1/4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/13$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$1/2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$13/4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$13$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$1/4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/13$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$1/2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$13/4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$13$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$13/52 = 1/4$.' },

  // Q9
  { chapterCode: CODE, difficulty: 'medium', concept: '두 주사위 합 7', requiredSkills: SKILLS_DEF,
    stem: '주사위 두 개 던질 때 합이 $7$ 일 확률?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$36$ 가지 중 합 $7$ 인 경우', options: [
        { key: 'A', text: '$(1,6),(2,5),(3,4),(4,3),(5,2),(6,1)$ → $6$ 가지', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5$ 가지', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'C', text: '$7$ 가지', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$3$ 가지', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '순서 무시' },
        { key: 'E', text: '$11$ 가지', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$6/36 = 1/6$', options: [
        { key: 'A', text: '$1/6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/12$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$5/36$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'D', text: '$7/36$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1/36$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$1/6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/12$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$5/36$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'D', text: '$7/36$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1/36$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$6/36 = 1/6$.' },

  // Q10
  { chapterCode: CODE, difficulty: 'medium', concept: '합사건 공식', requiredSkills: SKILLS_UNION,
    stem: '$P(A) = 0.4, P(B) = 0.3, P(A \\cap B) = 0.1$. $P(A \\cup B)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '포함배제', options: [
        { key: 'A', text: '$P(A) + P(B) - P(A \\cap B)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$P(A) + P(B)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '중복 안 뺌' },
        { key: 'C', text: '$P(A) P(B)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '독립' },
        { key: 'D', text: '$P(A) - P(B)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$P(A \\cap B)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$0.4 + 0.3 - 0.1$', options: [
        { key: 'A', text: '$0.6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0.7$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '중복 안 뺌' },
        { key: 'C', text: '$0.5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0.12$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱' },
        { key: 'E', text: '$0.8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$0.6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0.7$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$0.5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0.12$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0.8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$0.4 + 0.3 - 0.1 = 0.6$.' },

  // Q11
  { chapterCode: CODE, difficulty: 'medium', concept: '배반사건', requiredSkills: SKILLS_MUTEX,
    stem: '$P(A) = 0.4, P(B) = 0.3$, $A, B$ 배반. $P(A \\cup B)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '배반 → $P(A \\cap B) = 0$', options: [
        { key: 'A', text: '$P(A) + P(B)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$P(A) \\cdot P(B)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '독립' },
        { key: 'C', text: '$P(A) - P(B)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1 - P(A \\cup B)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$P(A) + P(B) - 1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$0.4 + 0.3$', options: [
        { key: 'A', text: '$0.7$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0.6$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$0.12$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱' },
        { key: 'D', text: '$0.1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$0.7$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0.6$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$0.12$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0.1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '배반 → $0.4 + 0.3 = 0.7$.' },

  // Q12
  { chapterCode: CODE, difficulty: 'medium', concept: '조건부확률', requiredSkills: SKILLS_COND,
    stem: '$P(A) = 0.5, P(A \\cap B) = 0.2$. $P(B|A)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$P(B|A) = P(A \\cap B)/P(A)$', options: [
        { key: 'A', text: '$0.2 / 0.5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0.5 / 0.2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '뒤집힘' },
        { key: 'C', text: '$0.2 \\cdot 0.5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱' },
        { key: 'D', text: '$0.2 + 0.5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
        { key: 'E', text: '$0.2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$0.4$', options: [
        { key: 'A', text: '$0.4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0.1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱' },
        { key: 'C', text: '$2.5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '뒤집힘' },
        { key: 'D', text: '$0.7$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
        { key: 'E', text: '$0.2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$0.4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0.1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2.5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0.7$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0.2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$P(B|A) = 0.2/0.5 = 0.4$.' },

  // Q13
  { chapterCode: CODE, difficulty: 'medium', concept: '독립 정의', requiredSkills: SKILLS_INDEP,
    stem: '두 사건 $A, B$ 가 독립의 정의?',
    steps: [
      { stepType: 'CONCEPT', prompt: '독립 ↔ 곱셈', options: [
        { key: 'A', text: '$P(A \\cap B) = P(A) P(B)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$P(A \\cap B) = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '배반' },
        { key: 'C', text: '$P(A \\cup B) = 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$P(A) = P(B)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$P(A) + P(B) = 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '동치 형태: $P(B|A) = P(B)$', options: [
        { key: 'A', text: '$P(A \\cap B) = P(A) P(B)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$P(A) + P(B)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$P(A) - P(B)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$P(A) \\cdot P(B) = 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$P(A \\cap B) = 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$P(A \\cap B) = P(A) P(B)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$P(A \\cap B) = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '배반' },
        { key: 'C', text: '$P(A) = P(B)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$P(A \\cup B) = 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$P(A) + P(B) = 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '독립: $P(A \\cap B) = P(A) P(B)$.' },

  // Q14
  { chapterCode: CODE, difficulty: 'medium', concept: '독립 곱', requiredSkills: SKILLS_INDEP,
    stem: '$P(A) = 0.5, P(B) = 0.4$, $A, B$ 독립. $P(A \\cap B)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '독립이면 곱', options: [
        { key: 'A', text: '$P(A) P(B) = 0.5 \\cdot 0.4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$P(A) + P(B) = 0.9$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '배반 아님' },
        { key: 'D', text: '$P(A) - P(B)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\min(P(A), P(B))$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$0.2$', options: [
        { key: 'A', text: '$0.2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0.9$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0.1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$0.2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0.9$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0.1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$0.5 \\cdot 0.4 = 0.2$.' },

  // Q15
  { chapterCode: CODE, difficulty: 'medium', concept: '곱셈정리', requiredSkills: SKILLS_MULT,
    stem: '$P(A \\cap B) = ?$ (조건부확률 이용)',
    steps: [
      { stepType: 'CONCEPT', prompt: '곱셈정리', options: [
        { key: 'A', text: '$P(A) P(B|A)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$P(A) + P(B|A)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
        { key: 'C', text: '$P(A) P(B)$ — 독립일 때만', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '일반 상황 아님' },
        { key: 'D', text: '$P(A|B)$ 만', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$P(B)$ 누락' },
        { key: 'E', text: '$P(A) - P(B)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$P(A) \\cdot P(B|A)$', options: [
        { key: 'A', text: '$P(A) P(B|A)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$P(A) + P(B|A)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$P(A|B)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$P(B|A)$ 만', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$P(A)$ 누락' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$P(A) P(B|A)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$P(A) + P(B|A)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$P(A) - P(B)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$P(A|B)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$P(A) P(B)$ (독립만)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '일반 X' },
      ] },
    ], solution: '$P(A \\cap B) = P(A) P(B|A)$ (곱셈정리).' },

  // Q16 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '비복원 추출 (빨강 두 번)', requiredSkills: SKILLS_MULT,
    stem: '항아리에 빨강 $3$, 파랑 $2$. 비복원으로 $2$ 개 추출. 둘 다 빨강?',
    steps: [
      { stepType: 'CONCEPT', prompt: '두 단계 곱', options: [
        { key: 'A', text: '$3/5 \\cdot 2/4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3/5 \\cdot 3/5$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '복원 아님' },
        { key: 'C', text: '$3/5 + 2/4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
        { key: 'D', text: '$3/5 \\cdot 1/4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2/5$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$6/20 = 3/10$', options: [
        { key: 'A', text: '$3/10$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$9/25$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '복원' },
        { key: 'C', text: '$3/5$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'D', text: '$1/2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$3/20$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$3/10$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$9/25$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'C', text: '$3/5$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'D', text: '$1/2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$3/20$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$3/5 \\cdot 2/4 = 3/10$.' },

  // Q17 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '동전 3번 앞면 2번', requiredSkills: SKILLS_DEF,
    stem: '동전 $3$ 번 던질 때 앞면이 정확히 $2$ 번?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$_3C_2 / 2^3$', options: [
        { key: 'A', text: '$_3C_2 / 8 = 3/8$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2/3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$1/4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1/2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1/8$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$_3C_2$ 누락' },
      ] },
      { stepType: 'PROCESS', prompt: '$3/8$', options: [
        { key: 'A', text: '$3/8$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$1/8$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'D', text: '$2/3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$1/2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$3/8$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$1/8$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'D', text: '$2/3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$1/2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$_3C_2 / 8 = 3/8$.' },

  // Q18 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '독립 판정', requiredSkills: SKILLS_INDEP,
    stem: '$P(A) = 0.3, P(B) = 0.4, P(A \\cap B) = 0.12$. $A, B$ 독립?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$P(A) P(B) = ?$', options: [
        { key: 'A', text: '$0.3 \\cdot 0.4 = 0.12$ → 일치', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0.7$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
        { key: 'C', text: '$0.12$ 항상 독립', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '곱과 $P(A \\cap B)$ 비교', options: [
        { key: 'A', text: '$0.12 = 0.12$ → 독립', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '독립 아님', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '일치하므로 독립' },
        { key: 'C', text: '$P(A|B) > P(A)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '배반', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$P \\cap > 0$' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
      { stepType: 'ANSWER', prompt: '결론?', options: [
        { key: 'A', text: '독립', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '종속', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '배반', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
        { key: 'E', text: '모순', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$P(A) P(B) = 0.12 = P(A \\cap B)$ → 독립.' },

  // Q19 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '여사건 활용', requiredSkills: SKILLS_COMP,
    stem: '동전 $3$ 번 던질 때 앞면이 적어도 $1$ 번 나올 확률?',
    steps: [
      { stepType: 'CONCEPT', prompt: '여사건: 모두 뒤', options: [
        { key: 'A', text: '$1 - P(\\text{모두 뒤})$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$P(\\text{앞 1번}) + P(\\text{앞 2번})$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '앞 3번 누락' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$1/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$1 - 1/8$', options: [
        { key: 'A', text: '$7/8$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/8$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '여사건 자체' },
        { key: 'C', text: '$1/2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$3/8$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$1$번만' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$7/8$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/8$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$1/2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$3/8$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '여사건 $1 - 1/8 = 7/8$.' },

  // Q20 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '비복원·둘 다 흰', requiredSkills: SKILLS_MULT,
    stem: '주머니에 흰 $4$, 검 $6$. 비복원 $2$ 개 추출. 둘 다 흰?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$4/10 \\cdot 3/9$', options: [
        { key: 'A', text: '$4/10 \\cdot 3/9$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4/10 \\cdot 4/10$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '복원' },
        { key: 'C', text: '$4/10 + 3/9$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
        { key: 'D', text: '$4/10 \\cdot 1/9$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1/2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$12/90 = 2/15$', options: [
        { key: 'A', text: '$2/15$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4/25$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '복원' },
        { key: 'C', text: '$2/5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1/3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1/2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$2/15$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4/25$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'C', text: '$2/5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1/3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1/2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$4/10 \\cdot 3/9 = 12/90 = 2/15$.' },
];

export const K_G11_STAT_CH02_PROBABILITY_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
