/**
 * K-G8-MATH2-CH07-PROBABILITY (확률) — 20문제 3-step Mastery.
 * 중2 — 확률 정의 → 동전·주사위 → 여사건 → 배반사건 → 곱의 법칙 (독립) →
 *        도박사의 오류 → 두 사건 합집합.
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 * 주요 errorCode 분배:
 *   PROBABILITY_COUNTING_ERROR 6 (Q4,5,8,9,10,16) / CONCEPT_MISUNDERSTANDING 4 (Q1,2,6,18)
 *   ARITHMETIC_ERROR 3 (Q3,7,11) / FORMULA_SELECTION_ERROR 3 (Q15,19,20)
 *   COMPLEMENT_ERROR 2 (Q13,14) / ALGEBRA_ERROR 1 (Q12) / DENOMINATOR_ERROR 1 (Q17)
 *
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G8-MATH2-CH07-PROBABILITY';
const SKILLS_DEF = ['probability_definition', 'sample_space'];
const SKILLS_RANGE = ['probability_range'];
const SKILLS_DICE = ['dice_outcomes', 'favorable_cases'];
const SKILLS_COIN = ['coin_independent', 'product_rule'];
const SKILLS_TWO_DICE = ['two_dice_36', 'sum_cases'];
const SKILLS_COMPLEMENT = ['complement_event'];
const SKILLS_MUTUAL = ['mutually_exclusive', 'union_addition'];
const SKILLS_GAMBLER = ['gamblers_fallacy', 'independent_trial'];

const problems: KoreanProblemSeed[] = [
  // Q1
  { chapterCode: CODE, difficulty: 'easy', concept: '확률 정의', requiredSkills: SKILLS_DEF,
    stem: '사건 $A$ 의 확률 $P(A)$ 는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '확률의 의미?', options: [
        { key: 'A', text: '사건이 일어날 가능성을 $0 \\sim 1$ 사이로 표현', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '경우의 수만', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '비율 아님' },
        { key: 'C', text: '항상 $0.5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '관측한 횟수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '실험 결과 ≠ 확률' },
        { key: 'E', text: '확률은 정의 안 됨', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '정의됨' },
      ] },
      { stepType: 'PROCESS', prompt: '공식?', options: [
        { key: 'A', text: '$P(A) = \\dfrac{\\text{사건 } A \\text{ 의 경우의 수}}{\\text{전체 경우의 수}}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$P(A) = $ 사건 경우의 수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '분모 누락' },
        { key: 'C', text: '$P(A) = $ 전체 / 사건', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '뒤집힘' },
        { key: 'D', text: '$P(A) = $ 사건 $\\cdot$ 전체', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곱셈' },
        { key: 'E', text: '$P(A) = $ 전체 $-$ 사건', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '뺄셈' },
      ] },
      { stepType: 'ANSWER', prompt: '$P(A) = ?$', options: [
        { key: 'A', text: '$\\dfrac{\\text{사건 경우의 수}}{\\text{전체 경우의 수}}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '사건 경우의 수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '분모 누락' },
        { key: 'C', text: '$\\dfrac{\\text{전체}}{\\text{사건}}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '뒤집힘' },
        { key: 'D', text: '사건 $-$ 전체', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '뺄셈' },
        { key: 'E', text: '항상 $\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$P(A) = \\dfrac{|A|}{|S|}$.' },

  // Q2
  { chapterCode: CODE, difficulty: 'easy', concept: '확률 범위', requiredSkills: SKILLS_RANGE,
    stem: '확률 값의 범위는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '최솟값?', options: [
        { key: 'A', text: '$0$ (사건이 절대 일어나지 않음)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '확률은 비음수' },
        { key: 'C', text: '$0.5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$-\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '확률 비음수' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '최댓값' },
      ] },
      { stepType: 'PROCESS', prompt: '최댓값?', options: [
        { key: 'A', text: '$1$ (반드시 일어남)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$100$ (백분율)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '백분율은 다른 표현' },
        { key: 'C', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '상한 있음' },
        { key: 'D', text: '$1000$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$0.5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '범위?', options: [
        { key: 'A', text: '$0 \\leq P(A) \\leq 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-1 \\leq P(A) \\leq 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '비음수' },
        { key: 'C', text: '$0 \\leq P(A) \\leq 100$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '백분율' },
        { key: 'D', text: '$P(A) > 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$0$도 가능' },
        { key: 'E', text: '$P(A) = 0$ 또는 $1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '중간값 가능' },
      ] },
    ], solution: '$0 \\leq P(A) \\leq 1$. $0$ = 불가능, $1$ = 확실.' },

  // Q3
  { chapterCode: CODE, difficulty: 'easy', concept: '동전 한 번', requiredSkills: SKILLS_COIN,
    stem: '동전을 한 번 던질 때 앞면이 나올 확률은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '전체 경우의 수?', options: [
        { key: 'A', text: '$2$ (앞, 뒤)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '두 가지' },
        { key: 'C', text: '$4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '주사위와 혼동' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '앞면 경우의 수 / 전체', options: [
        { key: 'A', text: '$1/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2/1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '뒤집힘' },
        { key: 'C', text: '$1/4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '두 번 던지기' },
        { key: 'D', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '확실' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '불가능' },
      ] },
      { stepType: 'ANSWER', prompt: '확률은?', options: [
        { key: 'A', text: '$\\dfrac{1}{2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{1}{4}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '두 번' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '확실 아님' },
        { key: 'D', text: '$\\dfrac{1}{6}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '주사위와 혼동' },
        { key: 'E', text: '$\\dfrac{2}{3}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$P(\\text{앞면}) = 1/2$.' },

  // Q4
  { chapterCode: CODE, difficulty: 'easy', concept: '주사위 짝수', requiredSkills: SKILLS_DICE,
    stem: '주사위 한 개를 던질 때 짝수가 나올 확률은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '주사위 짝수의 경우?', options: [
        { key: 'A', text: '$2, 4, 6$ — 세 가지', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1, 3, 5$ — 홀수', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '홀짝 혼동' },
        { key: 'C', text: '$2, 4$ — 두 가지', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '$6$ 빠뜨림' },
        { key: 'D', text: '한 가지', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '여섯 가지', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '전체' },
      ] },
      { stepType: 'PROCESS', prompt: '$3 / 6$', options: [
        { key: 'A', text: '$\\dfrac{1}{2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{1}{3}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\dfrac{3}{6}$ (약분 안 함)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '맞지만 약분 가능' },
        { key: 'D', text: '$\\dfrac{2}{3}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\dfrac{1}{6}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '한 가지로 오해' },
      ] },
      { stepType: 'ANSWER', prompt: '확률?', options: [
        { key: 'A', text: '$\\dfrac{1}{2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{1}{3}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\dfrac{2}{3}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\dfrac{1}{6}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '한 가지로' },
        { key: 'E', text: '$\\dfrac{5}{6}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '짝수 = $\\{2, 4, 6\\}$ → $P = 3/6 = 1/2$.' },

  // Q5
  { chapterCode: CODE, difficulty: 'easy', concept: '주사위 약수', requiredSkills: SKILLS_DICE,
    stem: '주사위에서 $6$ 의 약수가 나올 확률은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$6$ 의 약수?', options: [
        { key: 'A', text: '$1, 2, 3, 6$ — 네 가지', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2, 3$ — 두 가지', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '$1, 6$ 빠뜨림' },
        { key: 'C', text: '$1, 2, 3, 6, 6$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '중복' },
        { key: 'D', text: '$6$만', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '자신 외 약수' },
        { key: 'E', text: '$1, 6$만', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '$2, 3$ 빠뜨림' },
      ] },
      { stepType: 'PROCESS', prompt: '$4/6 = ?$', options: [
        { key: 'A', text: '$\\dfrac{2}{3}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{4}{6}$ (약분 안 함)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '약분 가능' },
        { key: 'C', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '경우 잘못' },
        { key: 'D', text: '$\\dfrac{3}{2}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '뒤집힘' },
        { key: 'E', text: '$\\dfrac{1}{3}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '확률?', options: [
        { key: 'A', text: '$\\dfrac{2}{3}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\dfrac{1}{3}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\dfrac{1}{6}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '한 가지로' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '확실 아님' },
      ] },
    ], solution: '$6$ 의 약수 $\\{1, 2, 3, 6\\}$ → $P = 4/6 = 2/3$.' },

  // Q6
  { chapterCode: CODE, difficulty: 'easy', concept: '확실한 사건', requiredSkills: SKILLS_RANGE,
    stem: '반드시 일어나는 사건의 확률은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '반드시 = 사건 경우의 수 = ?', options: [
        { key: 'A', text: '전체 경우의 수와 같음', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '불가능' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '"한 가지"와 혼동' },
        { key: 'D', text: '$1/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '명확함' },
      ] },
      { stepType: 'PROCESS', prompt: '$P = $ 전체/전체', options: [
        { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '불가능 사건' },
        { key: 'C', text: '$0.5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '확률 $\\leq 1$' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '확률 $\\leq 1$' },
      ] },
      { stepType: 'ANSWER', prompt: '확률?', options: [
        { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '불가능' },
        { key: 'C', text: '$0.5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '범위 초과' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '범위 초과' },
      ] },
    ], solution: '반드시 일어남 → $P = 1$.' },

  // Q7
  { chapterCode: CODE, difficulty: 'medium', concept: '주사위 두 개 전체 경우', requiredSkills: SKILLS_TWO_DICE,
    stem: '주사위 두 개를 던질 때 전체 경우의 수는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '곱의 법칙 적용?', options: [
        { key: 'A', text: '$6 \\times 6$ (각 주사위 독립)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$6 + 6 = 12$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합' },
        { key: 'C', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '한 개만' },
        { key: 'D', text: '$2^6 = 64$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$12!$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$6 \\times 6 = ?$', options: [
        { key: 'A', text: '$36$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$12$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합' },
        { key: 'C', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '한 개' },
        { key: 'D', text: '$64$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$30$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 잘못' },
      ] },
      { stepType: 'ANSWER', prompt: '경우의 수?', options: [
        { key: 'A', text: '$36$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$12$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합' },
        { key: 'C', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '한 개' },
        { key: 'D', text: '$72$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$21$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '곱의 법칙: $6 \\times 6 = 36$.' },

  // Q8
  { chapterCode: CODE, difficulty: 'medium', concept: '주사위 두 개 합 7', requiredSkills: SKILLS_TWO_DICE,
    stem: '주사위 두 개의 눈의 합이 $7$ 일 확률은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '합이 $7$ 인 경우 나열?', options: [
        { key: 'A', text: '$(1,6),(2,5),(3,4),(4,3),(5,2),(6,1)$ — $6$ 가지', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3$ 가지', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '순서쌍 절반만' },
        { key: 'C', text: '$1$ 가지', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$7$ 가지', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '합 자체와 혼동' },
        { key: 'E', text: '$12$ 가지', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$6 / 36$', options: [
        { key: 'A', text: '$\\dfrac{1}{6}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{1}{36}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '약분 잘못' },
        { key: 'C', text: '$\\dfrac{6}{36}$ (약분 안 함)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '맞지만 약분' },
        { key: 'D', text: '$\\dfrac{7}{36}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '합 자체' },
        { key: 'E', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '확률?', options: [
        { key: 'A', text: '$\\dfrac{1}{6}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{1}{36}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '경우 한 가지로 오해' },
        { key: 'C', text: '$\\dfrac{1}{12}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\dfrac{7}{36}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '합 7: 6가지 / 전체 36. $P = 6/36 = 1/6$.' },

  // Q9
  { chapterCode: CODE, difficulty: 'medium', concept: '주사위 두 개 합 2', requiredSkills: SKILLS_TWO_DICE,
    stem: '주사위 두 개의 눈의 합이 $2$ 일 확률은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '합이 $2$ 인 경우?', options: [
        { key: 'A', text: '$(1,1)$ 한 가지', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(1,1),(2,0)$ 두 가지', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '$0$ 없음' },
        { key: 'C', text: '$(1,1),(1,1)$ 두 가지', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '중복 셈' },
        { key: 'D', text: '$2$ 가지', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '없음', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '$(1,1)$ 가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$1/36$', options: [
        { key: 'A', text: '$\\dfrac{1}{36}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{2}{36}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '중복 셈' },
        { key: 'C', text: '$\\dfrac{1}{6}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '한 주사위만' },
        { key: 'D', text: '$\\dfrac{1}{12}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'ANSWER', prompt: '확률?', options: [
        { key: 'A', text: '$\\dfrac{1}{36}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{1}{18}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\dfrac{1}{6}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '한 개' },
        { key: 'D', text: '$\\dfrac{2}{36}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '중복' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '가능' },
      ] },
    ], solution: '합 2: $(1,1)$ 한 가지. $P = 1/36$.' },

  // Q10
  { chapterCode: CODE, difficulty: 'medium', concept: '주사위 두 개 같은 눈', requiredSkills: SKILLS_TWO_DICE,
    stem: '주사위 두 개를 던질 때 같은 눈이 나올 확률은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '같은 눈 경우 나열?', options: [
        { key: 'A', text: '$(1,1),(2,2),(3,3),(4,4),(5,5),(6,6)$ — $6$ 가지', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3$ 가지', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '절반' },
        { key: 'C', text: '$1$ 가지', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$12$ 가지', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '두 배' },
        { key: 'E', text: '$36$ 가지 모두', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '전체' },
      ] },
      { stepType: 'PROCESS', prompt: '$6/36$', options: [
        { key: 'A', text: '$\\dfrac{1}{6}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '경우 잘못' },
        { key: 'C', text: '$\\dfrac{1}{36}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '한 가지' },
        { key: 'D', text: '$\\dfrac{1}{12}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\dfrac{1}{3}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '확률?', options: [
        { key: 'A', text: '$\\dfrac{1}{6}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\dfrac{1}{36}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\dfrac{1}{12}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\dfrac{6}{12}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '분모 잘못' },
      ] },
    ], solution: '같은 눈 6가지 / 36 = $1/6$.' },

  // Q11
  { chapterCode: CODE, difficulty: 'medium', concept: '동전 두 번 둘 다 앞면', requiredSkills: SKILLS_COIN,
    stem: '동전을 두 번 던질 때 두 번 모두 앞면이 나올 확률은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '전체 경우의 수?', options: [
        { key: 'A', text: '$2 \\times 2 = 4$ (HH, HT, TH, TT)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2$ (앞, 뒤)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '한 번만' },
        { key: 'C', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '세 번' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: 'HH 의 경우 / 전체', options: [
        { key: 'A', text: '$1/4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '한 번 던지기' },
        { key: 'C', text: '$2/4 = 1/2$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '경우 두 개' },
        { key: 'D', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '확실 아님' },
        { key: 'E', text: '$1/8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '세 번' },
      ] },
      { stepType: 'ANSWER', prompt: '확률?', options: [
        { key: 'A', text: '$\\dfrac{1}{4}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '한 번' },
        { key: 'C', text: '$\\dfrac{1}{8}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '세 번' },
        { key: 'D', text: '$\\dfrac{2}{4}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '경우 두 개' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '확실 아님' },
      ] },
    ], solution: '$P(HH) = (1/2)(1/2) = 1/4$.' },

  // Q12
  { chapterCode: CODE, difficulty: 'medium', concept: '카드 소수 확률', requiredSkills: SKILLS_DICE,
    stem: '$1$ 부터 $10$ 까지의 카드 중 한 장을 뽑을 때 소수일 확률은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$1 \\sim 10$ 의 소수?', options: [
        { key: 'A', text: '$2, 3, 5, 7$ — 네 가지', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1, 2, 3, 5, 7$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$1$은 소수 아님' },
        { key: 'C', text: '$2, 3, 5, 7, 9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$9 = 3^2$' },
        { key: 'D', text: '$1, 3, 5, 7, 9$ (홀수)', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '홀수와 혼동' },
        { key: 'E', text: '$3, 5, 7$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$2$ 빠뜨림' },
      ] },
      { stepType: 'PROCESS', prompt: '$4/10$', options: [
        { key: 'A', text: '$\\dfrac{2}{5}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{4}{10}$ (약분 안 함)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '약분 가능' },
        { key: 'C', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '$5$ 개로 오해' },
        { key: 'D', text: '$\\dfrac{1}{4}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\dfrac{1}{5}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '확률?', options: [
        { key: 'A', text: '$\\dfrac{2}{5}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '$5$ 개로 오해' },
        { key: 'C', text: '$\\dfrac{1}{5}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\dfrac{3}{10}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\dfrac{5}{10}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$1$ 포함' },
      ] },
    ], solution: '소수 $2, 3, 5, 7$ → 4개 / 10 = $2/5$.' },

  // Q13
  { chapterCode: CODE, difficulty: 'medium', concept: '여사건 (P(A^c))', requiredSkills: SKILLS_COMPLEMENT,
    stem: '$P(A) = \\dfrac{1}{3}$ 일 때 $P(A^c)$ 는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '여사건 공식?', options: [
        { key: 'A', text: '$P(A^c) = 1 - P(A)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$P(A^c) = -P(A)$', isCorrect: false, errorCode: 'COMPLEMENT_ERROR', errorReason: '확률은 비음수' },
        { key: 'C', text: '$P(A^c) = P(A)$', isCorrect: false, errorCode: 'COMPLEMENT_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$P(A^c) = 1 + P(A)$', isCorrect: false, errorCode: 'COMPLEMENT_ERROR', errorReason: '$\\leq 1$' },
        { key: 'E', text: '$P(A^c) = P(A)^2$', isCorrect: false, errorCode: 'COMPLEMENT_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$1 - 1/3$', options: [
        { key: 'A', text: '$\\dfrac{2}{3}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{1}{3}$', isCorrect: false, errorCode: 'COMPLEMENT_ERROR', errorReason: '같음 잘못' },
        { key: 'C', text: '$\\dfrac{4}{3}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '뺄셈 잘못' },
        { key: 'D', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\dfrac{2}{6}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 잘못' },
      ] },
      { stepType: 'ANSWER', prompt: '$P(A^c) = ?$', options: [
        { key: 'A', text: '$\\dfrac{2}{3}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{1}{3}$', isCorrect: false, errorCode: 'COMPLEMENT_ERROR', errorReason: '같음 잘못' },
        { key: 'C', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\dfrac{4}{3}$', isCorrect: false, errorCode: 'COMPLEMENT_ERROR', errorReason: '범위 초과' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'COMPLEMENT_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$P(A^c) = 1 - 1/3 = 2/3$.' },

  // Q14
  { chapterCode: CODE, difficulty: 'medium', concept: '주사위 3보다 큰 수', requiredSkills: SKILLS_DICE,
    stem: '주사위 한 개에서 $3$ 보다 큰 수가 나올 확률은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$3$ 보다 큰 수?', options: [
        { key: 'A', text: '$4, 5, 6$ — 세 가지', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3, 4, 5, 6$ (3 포함)', isCorrect: false, errorCode: 'COMPLEMENT_ERROR', errorReason: '"보다 크다" = 초과' },
        { key: 'C', text: '$5, 6$', isCorrect: false, errorCode: 'COMPLEMENT_ERROR', errorReason: '$4$ 빠뜨림' },
        { key: 'D', text: '$4, 5$', isCorrect: false, errorCode: 'COMPLEMENT_ERROR', errorReason: '$6$ 빠뜨림' },
        { key: 'E', text: '한 가지', isCorrect: false, errorCode: 'COMPLEMENT_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$3/6$', options: [
        { key: 'A', text: '$\\dfrac{1}{2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{2}{3}$', isCorrect: false, errorCode: 'COMPLEMENT_ERROR', errorReason: '$3$ 포함' },
        { key: 'C', text: '$\\dfrac{1}{3}$', isCorrect: false, errorCode: 'COMPLEMENT_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\dfrac{1}{6}$', isCorrect: false, errorCode: 'COMPLEMENT_ERROR', errorReason: '한 가지' },
        { key: 'E', text: '$\\dfrac{3}{6}$ (약분 안 함)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '맞지만 약분' },
      ] },
      { stepType: 'ANSWER', prompt: '확률?', options: [
        { key: 'A', text: '$\\dfrac{1}{2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{2}{3}$', isCorrect: false, errorCode: 'COMPLEMENT_ERROR', errorReason: '$3$ 포함' },
        { key: 'C', text: '$\\dfrac{1}{3}$', isCorrect: false, errorCode: 'COMPLEMENT_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\dfrac{1}{6}$', isCorrect: false, errorCode: 'COMPLEMENT_ERROR', errorReason: '한 가지' },
        { key: 'E', text: '$\\dfrac{5}{6}$', isCorrect: false, errorCode: 'COMPLEMENT_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$3$ 초과 = $\\{4, 5, 6\\}$ → $P = 3/6 = 1/2$.' },

  // Q15
  { chapterCode: CODE, difficulty: 'medium', concept: '곱의 법칙 (독립 시행)', requiredSkills: SKILLS_COIN,
    stem: '동전을 세 번 던질 때 모두 앞면이 나올 확률은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '독립 시행 확률은?', options: [
        { key: 'A', text: '각 시행 확률의 곱', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '각 시행 확률의 합', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '독립이면 곱' },
        { key: 'C', text: '평균', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '한 번 확률 그대로', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '여러 번이면 곱' },
        { key: 'E', text: '최댓값', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$(1/2)^3$', options: [
        { key: 'A', text: '$1/8$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3/2$ (합)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
        { key: 'C', text: '$1/6$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1/2$ (한 번 그대로)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '세 번' },
        { key: 'E', text: '$1/4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '두 번' },
      ] },
      { stepType: 'ANSWER', prompt: '확률?', options: [
        { key: 'A', text: '$\\dfrac{1}{8}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '한 번만' },
        { key: 'C', text: '$\\dfrac{1}{4}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '두 번' },
        { key: 'D', text: '$\\dfrac{3}{2}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
        { key: 'E', text: '$\\dfrac{1}{6}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(1/2)^3 = 1/8$.' },

  // Q16 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '주사위 합 이하', requiredSkills: SKILLS_TWO_DICE,
    stem: '주사위 두 개의 합이 $4$ 이하일 확률은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '합 $\\leq 4$ 경우?', options: [
        { key: 'A', text: '$(1,1),(1,2),(1,3),(2,1),(2,2),(3,1)$ — $6$ 가지', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3$ 가지', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '절반' },
        { key: 'C', text: '$4$ 가지', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$10$ 가지', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$5$ 가지', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '하나 빠뜨림' },
      ] },
      { stepType: 'PROCESS', prompt: '$6/36$', options: [
        { key: 'A', text: '$\\dfrac{1}{6}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{1}{36}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '한 가지' },
        { key: 'C', text: '$\\dfrac{1}{12}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\dfrac{6}{36}$ (약분 안 함)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '맞지만 약분' },
        { key: 'E', text: '$\\dfrac{1}{4}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '확률?', options: [
        { key: 'A', text: '$\\dfrac{1}{6}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{1}{4}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\dfrac{1}{36}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '한 가지' },
        { key: 'D', text: '$\\dfrac{1}{12}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\dfrac{4}{36}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '합 자체' },
      ] },
    ], solution: '합 $\\leq 4$: 6가지. $P = 6/36 = 1/6$.' },

  // Q17 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '공 뽑기 확률', requiredSkills: SKILLS_DICE,
    stem: '빨강 $3$, 파랑 $5$, 흰색 $2$ 의 공이 있다. 하나를 뽑을 때 파랑 공일 확률은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '전체 공?', options: [
        { key: 'A', text: '$3 + 5 + 2 = 10$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3 \\cdot 5 \\cdot 2 = 30$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '곱' },
        { key: 'C', text: '$5$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '한 색만' },
        { key: 'D', text: '$3$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '한 색만' },
        { key: 'E', text: '$\\max = 5$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$5/10$', options: [
        { key: 'A', text: '$1/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5/10$ (약분 안 함)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '맞지만 약분' },
        { key: 'C', text: '$5$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '분모 누락' },
        { key: 'D', text: '$1/5$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '뒤집힘' },
        { key: 'E', text: '$5/30$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '전체 잘못' },
      ] },
      { stepType: 'ANSWER', prompt: '확률?', options: [
        { key: 'A', text: '$\\dfrac{1}{2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{1}{5}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '뒤집힘' },
        { key: 'C', text: '$5$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '경우 자체' },
        { key: 'D', text: '$\\dfrac{1}{10}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\dfrac{1}{6}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$P(\\text{파랑}) = 5/10 = 1/2$.' },

  // Q18 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '도박사의 오류', requiredSkills: SKILLS_GAMBLER,
    stem: '공정한 동전을 $5$번 연속 던져 모두 앞면이 나왔다. $6$번째 던질 때 앞면이 나올 확률은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '독립 시행의 성질?', options: [
        { key: 'A', text: '과거 결과가 미래 확률에 영향 X', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '앞면이 많이 나왔으니 다음엔 뒷면 확률 ↑', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '도박사의 오류' },
        { key: 'C', text: '앞면이 많이 나왔으니 다음에도 앞면 확률 ↑', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '확률이 점점 $0$ 으로 줄어듦', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '확률이 누적됨', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '독립이므로' },
      ] },
      { stepType: 'PROCESS', prompt: '$6$번째 앞면 확률?', options: [
        { key: 'A', text: '$1/2$ (변하지 않음)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0$ (이미 5번 연속이라 다음은 뒷면 확실)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '도박사의 오류' },
        { key: 'C', text: '$1/32$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$(1/2)^5$ 적용' },
        { key: 'D', text: '$1$ (계속 앞면)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$1/4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$6$번째 확률?', options: [
        { key: 'A', text: '$\\dfrac{1}{2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '뒷면 확률 ↑', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '도박사의 오류' },
        { key: 'C', text: '앞면 확률 ↑', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\dfrac{1}{32}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '독립' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '도박사의 오류' },
      ] },
    ], solution: '독립 시행 → 과거 결과 무관. $P = 1/2$. (도박사의 오류 — gamblers fallacy 주의)' },

  // Q19 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '배반사건 합', requiredSkills: SKILLS_MUTUAL,
    stem: '배반인 두 사건 $A, B$ 에 대해 $P(A) = 1/4$, $P(B) = 1/3$ 이다. $P(A \\cup B)$ 는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '배반사건 합집합 확률?', options: [
        { key: 'A', text: '$P(A \\cup B) = P(A) + P(B)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$P(A \\cup B) = P(A) \\cdot P(B)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '독립 곱셈' },
        { key: 'C', text: '$P(A \\cup B) = P(A) - P(B)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '차' },
        { key: 'D', text: '$P(A \\cup B) = \\max(P(A), P(B))$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$P(A \\cup B) = 1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '확실 아님' },
      ] },
      { stepType: 'PROCESS', prompt: '$1/4 + 1/3$', options: [
        { key: 'A', text: '$3/12 + 4/12 = 7/12$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/12$ (곱)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱셈' },
        { key: 'C', text: '$2/7$ (분자 합/분모 합)', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '잘못된 분수 합' },
        { key: 'D', text: '$1/7$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '확실 아님' },
      ] },
      { stepType: 'ANSWER', prompt: '$P(A \\cup B) = ?$', options: [
        { key: 'A', text: '$\\dfrac{7}{12}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{1}{12}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱' },
        { key: 'C', text: '$\\dfrac{2}{7}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '잘못' },
        { key: 'D', text: '$\\dfrac{1}{7}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\dfrac{7}{24}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '배반사건 → $P(A \\cup B) = 1/4 + 1/3 = 7/12$.' },

  // Q20 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '주사위 합 7 또는 11', requiredSkills: SKILLS_MUTUAL,
    stem: '주사위 두 개의 합이 $7$ 또는 $11$ 일 확률은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '두 사건은 배반 (합 7과 합 11 동시 불가)', options: [
        { key: 'A', text: '$P = P(\\text{합 7}) + P(\\text{합 11})$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$P = P(\\text{합 7}) \\cdot P(\\text{합 11})$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '독립 곱' },
        { key: 'C', text: '$P = P(\\text{합 18})$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합 잘못' },
        { key: 'D', text: '$P = 1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '확실 아님' },
        { key: 'E', text: '$P = 1/2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '합 7: 6가지, 합 11: (5,6)(6,5) = 2가지', options: [
        { key: 'A', text: '$6/36 + 2/36 = 8/36 = 2/9$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$6/36 + 11/36$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '합 11 = 11가지로 잘못' },
        { key: 'C', text: '$6/36 \\cdot 2/36$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱' },
        { key: 'D', text: '$8/36 = 4/18$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '약분 잘못' },
        { key: 'E', text: '$1/6$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '합 11 누락' },
      ] },
      { stepType: 'ANSWER', prompt: '확률?', options: [
        { key: 'A', text: '$\\dfrac{2}{9}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{1}{6}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '합 11 누락' },
        { key: 'C', text: '$\\dfrac{8}{18}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '약분 잘못' },
        { key: 'D', text: '$\\dfrac{12}{36}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\dfrac{1}{36}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '한 가지' },
      ] },
    ], solution: '합 7: 6, 합 11: 2 (5,6)(6,5). 배반 합 = $8/36 = 2/9$.' },
];

export const K_G8_MATH2_CH07_PROBABILITY_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
