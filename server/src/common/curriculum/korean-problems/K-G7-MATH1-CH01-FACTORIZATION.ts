/**
 * K-G7-MATH1-CH01-FACTORIZATION (소인수분해 · 약수 · 배수 · GCD · LCM) —
 * 20문제 3-step Mastery pool. 중학교 1학년 첫 단원.
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 * 주요 errorCode 분배:
 *   EXPONENT_ERROR 5 (Q3,4,5,6,18) / CONCEPT_MISUNDERSTANDING 4 (Q1,2,9,11)
 *   ARITHMETIC_ERROR 4 (Q7,8,10,14) / FORMULA_SELECTION_ERROR 3 (Q15,16,19)
 *   CONDITION_MISSING 2 (Q17,20) / ALGEBRA_ERROR 2 (Q12,13)
 *
 * 각 문제 = 3 step (CONCEPT/PROCESS/ANSWER), 각 step = 5지선다.
 * 정답 1개 + 오답 4개, 오답마다 errorCode + errorReason.
 *
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G7-MATH1-CH01-FACTORIZATION';
const SKILLS_PRIME = ['prime_identification', 'composite_identification', 'divisor_basics'];
const SKILLS_FACTOR = ['prime_factorization', 'exponent_notation', 'tree_method'];
const SKILLS_DIVISORS = ['divisor_count_formula', 'prime_factorization', 'exponent_handling'];
const SKILLS_GCD = ['gcd_by_factorization', 'common_factor', 'exponent_min'];
const SKILLS_LCM = ['lcm_by_factorization', 'common_multiple', 'exponent_max'];
const SKILLS_WORD = ['gcd_lcm_application', 'word_problem_translation', 'condition_check'];
const SKILLS_MIXED = ['gcd_lcm_relation', 'product_of_two_numbers', 'algebraic_reasoning'];

const problems: KoreanProblemSeed[] = [
  // ────────── Q1 (쉬움) 다음 중 소수는? · CONCEPT_MISUNDERSTANDING ──────────
  {
    chapterCode: CODE, difficulty: 'easy', concept: '소수의 정의', requiredSkills: SKILLS_PRIME,
    stem: '다음 중 소수(prime number)인 것은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '소수의 정의는?',
        options: [
          { key: 'A', text: '1보다 큰 자연수 중 약수가 1과 자기 자신뿐인 수', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '1을 포함한 모든 자연수 중 약수가 2개인 수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '1도 소수로 잘못 포함' },
          { key: 'C', text: '자기 자신만 약수로 갖는 수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '1도 약수임을 누락' },
          { key: 'D', text: '홀수만 소수다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '2는 짝수이면서 소수' },
          { key: 'E', text: '짝수만 소수다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '소수는 대부분 홀수' },
        ] },
      { stepType: 'PROCESS', prompt: '$1, 9, 13, 15, 21$ 각각의 약수의 개수는?',
        options: [
          { key: 'A', text: '1→1개, 9→3개, 13→2개, 15→4개, 21→4개', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '1→2개 (1과 1)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '1의 약수는 자기 자신 하나뿐' },
          { key: 'C', text: '9의 약수는 1, 9 둘뿐', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '3도 9의 약수' },
          { key: 'D', text: '13의 약수는 1, 13, 2 세 개', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '13은 2로 나누어떨어지지 않음' },
          { key: 'E', text: '15의 약수는 1, 15 둘뿐', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '3, 5도 15의 약수' },
        ] },
      { stepType: 'ANSWER', prompt: '약수가 정확히 2개인 수는?',
        options: [
          { key: 'A', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '1은 소수가 아님' },
          { key: 'B', text: '$9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$9 = 3^2$ — 약수 3개' },
          { key: 'C', text: '$13$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'D', text: '$15$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$15 = 3 \\times 5$ — 합성수' },
          { key: 'E', text: '$21$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$21 = 3 \\times 7$ — 합성수' },
        ] },
    ],
    solution: '소수 = 1보다 크고 약수가 1과 자기 자신만인 수. 1은 제외. $13$은 $1, 13$만 약수이므로 소수. 나머지는 모두 합성수.',
  },

  // ────────── Q2 (쉬움) 다음 중 합성수는? · CONCEPT_MISUNDERSTANDING ──────────
  {
    chapterCode: CODE, difficulty: 'easy', concept: '합성수의 정의', requiredSkills: SKILLS_PRIME,
    stem: '다음 중 합성수(composite number)인 것은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '합성수의 정의는?',
        options: [
          { key: 'A', text: '소수의 곱으로 표현되는 1보다 큰 자연수 (약수 3개 이상)', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '두 자연수의 합', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합성=합이 아니라 곱' },
          { key: 'C', text: '소수와 1의 합', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '용어 오해' },
          { key: 'D', text: '약수가 2개인 수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '약수 2개는 소수' },
          { key: 'E', text: '모든 짝수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$2$는 소수' },
        ] },
      { stepType: 'PROCESS', prompt: '$11, 17, 23, 21, 29$ 의 약수의 개수는?',
        options: [
          { key: 'A', text: '11→2, 17→2, 23→2, 21→4, 29→2', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '21→2 (1, 21만)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$21 = 3 \\times 7$ — 1, 3, 7, 21 네 개' },
          { key: 'C', text: '23→3 (1, 2, 23)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '23은 2로 나누어지지 않음' },
          { key: 'D', text: '17→3 (1, 7, 17)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '17은 7로 나누어지지 않음' },
          { key: 'E', text: '29→4', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '29는 소수' },
        ] },
      { stepType: 'ANSWER', prompt: '약수가 3개 이상인 수는?',
        options: [
          { key: 'A', text: '$11$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '11은 소수' },
          { key: 'B', text: '$17$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '17은 소수' },
          { key: 'C', text: '$21$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'D', text: '$23$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '23은 소수' },
          { key: 'E', text: '$29$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '29는 소수' },
        ] },
    ],
    solution: '$21 = 3 \\times 7$ 로 소수의 곱이므로 합성수. 11, 17, 23, 29는 모두 소수.',
  },

  // ────────── Q3 (쉬움) 24의 소인수분해 · EXPONENT_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'easy', concept: '소인수분해 기초', requiredSkills: SKILLS_FACTOR,
    stem: '$24$를 소인수분해하면?',
    steps: [
      { stepType: 'CONCEPT', prompt: '소인수분해란?',
        options: [
          { key: 'A', text: '1보다 큰 자연수를 소수들의 곱으로 표현', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '자연수를 두 자연수의 곱으로만 표현', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '소수가 아니라 자연수로 끝나면 안 됨' },
          { key: 'C', text: '자연수를 약수들의 합으로 표현', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합이 아니라 곱' },
          { key: 'D', text: '자연수를 거듭제곱으로만 표현', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '거듭제곱 외 일반 소수 곱도 됨' },
          { key: 'E', text: '자연수를 홀수들의 곱으로 표현', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '2도 소수' },
        ] },
      { stepType: 'PROCESS', prompt: '$24$를 가장 작은 소수부터 차례로 나누면?',
        options: [
          { key: 'A', text: '$24 \\div 2 = 12,\\ 12 \\div 2 = 6,\\ 6 \\div 2 = 3$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$24 \\div 3 = 8,\\ 8 \\div 4 = 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '4는 소수가 아님' },
          { key: 'C', text: '$24 \\div 6 = 4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '6은 소수가 아님' },
          { key: 'D', text: '$24 \\div 24 = 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '소수로만 나눠야 함' },
          { key: 'E', text: '$24 \\div 8 = 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '8은 소수가 아님' },
        ] },
      { stepType: 'ANSWER', prompt: '$24$의 소인수분해 결과는?',
        options: [
          { key: 'A', text: '$2 \\times 2 \\times 2 \\times 3$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '맞지만 거듭제곱 표기 필요' },
          { key: 'B', text: '$2^3 \\times 3$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'C', text: '$2^2 \\times 3$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '2를 세 번이 아닌 두 번으로 셈' },
          { key: 'D', text: '$2 \\times 3^2$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '3의 지수를 잘못' },
          { key: 'E', text: '$2^3 \\times 3^2$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '3은 한 번만 나옴' },
        ] },
    ],
    solution: '$24 = 2 \\times 12 = 2 \\times 2 \\times 6 = 2 \\times 2 \\times 2 \\times 3 = 2^3 \\times 3$. 같은 소수가 반복되면 거듭제곱으로 묶어 쓴다.',
  },

  // ────────── Q4 (쉬움) 36의 소인수분해 · EXPONENT_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'easy', concept: '소인수분해 (제곱수)', requiredSkills: SKILLS_FACTOR,
    stem: '$36$을 소인수분해하면?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$36 = 6 \\times 6$ 이다. $6$을 더 쪼개야 하는 이유는?',
        options: [
          { key: 'A', text: '$6$은 소수가 아니라 $2 \\times 3$ 이므로', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$6$은 홀수가 아니므로', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '홀짝과 무관' },
          { key: 'C', text: '같은 수의 곱은 안 되므로', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '소인수분해는 같은 소수가 중복돼도 됨' },
          { key: 'D', text: '$36$이 짝수이므로', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '짝수라고 더 쪼개야 하는 건 아님' },
          { key: 'E', text: '6은 약수가 1개라서', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '6의 약수는 1, 2, 3, 6 (4개)' },
        ] },
      { stepType: 'PROCESS', prompt: '$36$을 소수로 끝까지 나누면?',
        options: [
          { key: 'A', text: '$36 \\div 2 = 18,\\ 18 \\div 2 = 9,\\ 9 \\div 3 = 3$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$36 \\div 2 = 18,\\ 18 \\div 3 = 6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '6은 소수가 아니므로 더 나눠야 함' },
          { key: 'C', text: '$36 \\div 4 = 9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '4는 소수가 아님' },
          { key: 'D', text: '$36 \\div 6 = 6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '6은 소수가 아님' },
          { key: 'E', text: '$36 \\div 9 = 4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '9도 소수 아님' },
        ] },
      { stepType: 'ANSWER', prompt: '$36$의 소인수분해 결과는?',
        options: [
          { key: 'A', text: '$2^2 \\times 3^2$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$2 \\times 3 \\times 6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '6은 소수 아님' },
          { key: 'C', text: '$4 \\times 9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '4와 9 모두 소수 아님' },
          { key: 'D', text: '$2^3 \\times 3$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$2^3 \\times 3 = 24 \\neq 36$' },
          { key: 'E', text: '$6^2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '6은 합성수라 소인수분해 미완료' },
        ] },
    ],
    solution: '$36 = 2 \\times 18 = 2 \\times 2 \\times 9 = 2 \\times 2 \\times 3 \\times 3 = 2^2 \\times 3^2$.',
  },

  // ────────── Q5 (쉬움) 100의 소인수분해 · EXPONENT_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'easy', concept: '소인수분해', requiredSkills: SKILLS_FACTOR,
    stem: '$100$을 소인수분해하면?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$100$은 어떤 두 수의 곱으로 시작할 수 있을까?',
        options: [
          { key: 'A', text: '$2 \\times 50$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$1 \\times 100$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '1은 소수 아니므로 시작점으로 부적합' },
          { key: 'C', text: '$10 \\times 10$ — 더 쪼갤 필요 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '10은 소수 아님 — 더 쪼개야 함' },
          { key: 'D', text: '$25 \\times 4$ — 더 쪼갤 필요 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '25, 4 모두 합성수' },
          { key: 'E', text: '$20 \\times 5$ — 더 쪼갤 필요 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '20이 합성수' },
        ] },
      { stepType: 'PROCESS', prompt: '소수로 끝까지 나누는 과정은?',
        options: [
          { key: 'A', text: '$100 \\div 2 = 50,\\ 50 \\div 2 = 25,\\ 25 \\div 5 = 5$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$100 \\div 4 = 25$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '4는 소수 아님' },
          { key: 'C', text: '$100 \\div 10 = 10$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '10은 소수 아님' },
          { key: 'D', text: '$100 \\div 2 = 50,\\ 50 \\div 5 = 10$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '10이 끝이 아님 — 더 분해' },
          { key: 'E', text: '$100 \\div 25 = 4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '25, 4 모두 소수 아님' },
        ] },
      { stepType: 'ANSWER', prompt: '$100$의 소인수분해 결과는?',
        options: [
          { key: 'A', text: '$2^2 \\times 5^2$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$2 \\times 5^3$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$2 \\times 5^3 = 250 \\neq 100$' },
          { key: 'C', text: '$2^3 \\times 5$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$2^3 \\times 5 = 40 \\neq 100$' },
          { key: 'D', text: '$2 \\times 5^2$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$2 \\times 5^2 = 50 \\neq 100$' },
          { key: 'E', text: '$10^2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '10이 합성수라 분해 미완료' },
        ] },
    ],
    solution: '$100 = 2 \\times 50 = 2 \\times 2 \\times 25 = 2 \\times 2 \\times 5 \\times 5 = 2^2 \\times 5^2$.',
  },

  // ────────── Q6 (쉬움) 거듭제곱 표기 · EXPONENT_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'easy', concept: '거듭제곱 표기', requiredSkills: SKILLS_FACTOR,
    stem: '$2 \\times 2 \\times 2 \\times 3 \\times 3$ 을 거듭제곱으로 표현하면?',
    steps: [
      { stepType: 'CONCEPT', prompt: '거듭제곱 $a^n$ 의 의미는?',
        options: [
          { key: 'A', text: '$a$를 $n$번 곱한 값', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$a$에 $n$을 더한 값', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곱이 아니라 합으로 오해' },
          { key: 'C', text: '$a$를 $n$으로 나눈 값', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '나눗셈으로 오해' },
          { key: 'D', text: '$a$와 $n$의 곱', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$a \\times n$ 과 혼동' },
          { key: 'E', text: '$n$을 $a$번 곱한 값', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '밑과 지수 역전' },
        ] },
      { stepType: 'PROCESS', prompt: '각 소수가 몇 번 나오는지 세면?',
        options: [
          { key: 'A', text: '2가 세 번, 3이 두 번', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '2가 두 번, 3이 세 번', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '2와 3 횟수 바꿔 셈' },
          { key: 'C', text: '2가 세 번, 3이 세 번', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '3을 한 번 더 계산' },
          { key: 'D', text: '2가 네 번, 3이 한 번', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '곱한 횟수 오인' },
          { key: 'E', text: '2가 한 번, 3이 한 번', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '중복 인식 못함' },
        ] },
      { stepType: 'ANSWER', prompt: '거듭제곱 표현은?',
        options: [
          { key: 'A', text: '$2^3 \\times 3^2$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$2^2 \\times 3^3$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '지수 위치 바뀜' },
          { key: 'C', text: '$2 \\times 3^5$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '지수 합으로 잘못' },
          { key: 'D', text: '$2^5 \\times 3^5$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '총 곱한 횟수 5번을 양쪽에 다 적음' },
          { key: 'E', text: '$6^5$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '밑이 다른 소수는 합쳐쓰면 안 됨' },
        ] },
    ],
    solution: '같은 소수의 곱은 거듭제곱으로 묶는다. $2$가 세 번 → $2^3$, $3$이 두 번 → $3^2$. 따라서 $2^3 \\times 3^2 = 8 \\times 9 = 72$.',
  },

  // ────────── Q7 (중) 72의 약수의 개수 · ARITHMETIC_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '약수의 개수 공식', requiredSkills: SKILLS_DIVISORS,
    stem: '$72$의 양의 약수의 개수는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '약수의 개수 공식은?',
        options: [
          { key: 'A', text: '$N = p^a \\times q^b$ 이면 약수의 수 $= (a+1)(b+1)$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '약수의 수 $= a \\times b$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '+1 누락' },
          { key: 'C', text: '약수의 수 $= a + b$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱이 아니라 합으로 오해' },
          { key: 'D', text: '약수의 수 $= a + b + 1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '공식 오인' },
          { key: 'E', text: '약수의 수 $= 2(a+b)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '공식 오인' },
        ] },
      { stepType: 'PROCESS', prompt: '$72$를 소인수분해하면?',
        options: [
          { key: 'A', text: '$2^3 \\times 3^2$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$2^2 \\times 3^3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2^2 \\times 3^3 = 108 \\neq 72$' },
          { key: 'C', text: '$2 \\times 3^3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2 \\times 27 = 54 \\neq 72$' },
          { key: 'D', text: '$2^3 \\times 3^3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$8 \\times 27 = 216 \\neq 72$' },
          { key: 'E', text: '$2^4 \\times 3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$16 \\times 3 = 48 \\neq 72$' },
        ] },
      { stepType: 'ANSWER', prompt: '약수의 개수는?',
        options: [
          { key: 'A', text: '$(3+1)(2+1) = 12$개', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$3 \\times 2 = 6$개', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '+1을 빠뜨림' },
          { key: 'C', text: '$3 + 2 = 5$개', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '곱이 아니라 합' },
          { key: 'D', text: '$(3+1) + (2+1) = 7$개', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합으로 오해' },
          { key: 'E', text: '$72 \\div 2 = 36$개', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '공식 무관' },
        ] },
    ],
    solution: '$72 = 2^3 \\times 3^2$. 약수의 개수 $= (3+1)(2+1) = 4 \\times 3 = 12$개. 직접 나열: 1, 2, 3, 4, 6, 8, 9, 12, 18, 24, 36, 72.',
  },

  // ────────── Q8 (중) 84의 약수의 개수 · ARITHMETIC_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '약수의 개수 공식 (세 소인수)', requiredSkills: SKILLS_DIVISORS,
    stem: '$84$의 양의 약수의 개수는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '소인수가 셋 이상이면 공식은?',
        options: [
          { key: 'A', text: '$N = p^a q^b r^c$ 이면 약수 수 $= (a+1)(b+1)(c+1)$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '세 번째 소인수는 무시', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '모든 소인수의 지수 포함 필요' },
          { key: 'C', text: '약수 수 $= a + b + c + 1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합 공식 오인' },
          { key: 'D', text: '두 소인수만 적용', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '모든 소인수 포함' },
          { key: 'E', text: '$abc + 1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '공식 오인' },
        ] },
      { stepType: 'PROCESS', prompt: '$84$의 소인수분해는?',
        options: [
          { key: 'A', text: '$2^2 \\times 3 \\times 7$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$2 \\times 3 \\times 14$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '14는 소수 아님' },
          { key: 'C', text: '$2^3 \\times 3 \\times 7$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$168 \\neq 84$' },
          { key: 'D', text: '$2^2 \\times 21$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '21은 합성수' },
          { key: 'E', text: '$4 \\times 21$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '둘 다 합성수' },
        ] },
      { stepType: 'ANSWER', prompt: '약수의 개수는?',
        options: [
          { key: 'A', text: '$(2+1)(1+1)(1+1) = 12$개', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$2 \\times 1 \\times 1 = 2$개', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '+1 빠뜨림' },
          { key: 'C', text: '$(2+1)(1+1) = 6$개', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '소인수 7을 빠뜨림' },
          { key: 'D', text: '$2 + 1 + 1 + 1 = 5$개', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합으로 오해' },
          { key: 'E', text: '$84 / 4 = 21$개', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '공식과 무관' },
        ] },
    ],
    solution: '$84 = 2^2 \\times 3 \\times 7$. 약수 개수 $= (2+1)(1+1)(1+1) = 3 \\times 2 \\times 2 = 12$개.',
  },

  // ────────── Q9 (중) 2³·3²·5 의 약수 개수 · CONCEPT_MISUNDERSTANDING ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '약수의 개수 (소인수분해 형태가 주어짐)', requiredSkills: SKILLS_DIVISORS,
    stem: '$N = 2^3 \\times 3^2 \\times 5$ 의 양의 약수의 개수는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$5 = 5^1$ 임을 인지하는 것이 왜 중요한가?',
        options: [
          { key: 'A', text: '지수가 표시되지 않은 소수는 지수 1로 취급해야 공식이 맞음', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$5^1$ 은 무시할 수 있다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '지수 1도 약수 개수에 영향' },
          { key: 'C', text: '$5$는 소수가 아니다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '5는 소수' },
          { key: 'D', text: '단일 $5$는 약수가 1개뿐', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$5$의 약수는 $1, 5$ 두 개' },
          { key: 'E', text: '$5^0 = 1$ 이므로 무시', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$5$는 $5^1$이지 $5^0$ 아님' },
        ] },
      { stepType: 'PROCESS', prompt: '각 소인수의 지수에 1을 더하면?',
        options: [
          { key: 'A', text: '$3+1, 2+1, 1+1 \\Rightarrow 4, 3, 2$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$3+1, 2+1 \\Rightarrow 4, 3$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '5 빠뜨림' },
          { key: 'C', text: '$3, 2, 1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '+1 빠뜨림' },
          { key: 'D', text: '$3, 2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '5 빠뜨림 + 1 빠뜨림' },
          { key: 'E', text: '$4, 3, 1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '5에 +1 안함' },
        ] },
      { stepType: 'ANSWER', prompt: '약수의 개수는?',
        options: [
          { key: 'A', text: '$4 \\times 3 \\times 2 = 24$개', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$4 \\times 3 = 12$개', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '5의 (1+1) 빠뜨림' },
          { key: 'C', text: '$3 \\times 2 \\times 1 = 6$개', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '+1 빠뜨림' },
          { key: 'D', text: '$4 + 3 + 2 = 9$개', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합으로 오해' },
          { key: 'E', text: '$8 \\times 9 \\times 5 = 360$개', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: 'N 값 자체로 오해' },
        ] },
    ],
    solution: '$N = 2^3 \\times 3^2 \\times 5^1$. 약수 개수 $= (3+1)(2+1)(1+1) = 4 \\times 3 \\times 2 = 24$개.',
  },

  // ────────── Q10 (중) 18의 약수의 합 · ARITHMETIC_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '약수의 합', requiredSkills: SKILLS_DIVISORS,
    stem: '$18$의 양의 약수의 합은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$18$의 약수를 모두 나열하면?',
        options: [
          { key: 'A', text: '$1, 2, 3, 6, 9, 18$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$2, 3, 6, 9, 18$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '1 빠뜨림' },
          { key: 'C', text: '$1, 2, 3, 9, 18$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '6 빠뜨림' },
          { key: 'D', text: '$1, 18$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '소수로 오해' },
          { key: 'E', text: '$1, 2, 3, 6, 9, 12, 18$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '12는 18의 약수 아님' },
        ] },
      { stepType: 'PROCESS', prompt: '소인수분해 + 약수의 합 공식: $18 = 2 \\times 3^2$ 이면?',
        options: [
          { key: 'A', text: '$(1+2)(1+3+9)$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$(1+2)(1+3)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$3^2$의 9 빠뜨림' },
          { key: 'C', text: '$(2)(3+9)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '1 빠뜨림 양쪽' },
          { key: 'D', text: '$2 \\times 3^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: 'N 자체로 오해' },
          { key: 'E', text: '$(1+2+4)(1+3+9)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$2^2$로 잘못 인식' },
        ] },
      { stepType: 'ANSWER', prompt: '약수의 합은?',
        options: [
          { key: 'A', text: '$39$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$36$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '단순 덧셈 실수' },
          { key: 'C', text: '$18$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: 'N 자체로 오해' },
          { key: 'D', text: '$21$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$1+2+3+6+9$ 만 더함 (18 누락)' },
          { key: 'E', text: '$45$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '6 두 번 더함' },
        ] },
    ],
    solution: '$18 = 2 \\times 3^2$. 약수의 합 $= (1+2)(1+3+9) = 3 \\times 13 = 39$. 직접 합: $1+2+3+6+9+18 = 39$.',
  },

  // ────────── Q11 (중) GCD(18,24) · CONCEPT_MISUNDERSTANDING ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '최대공약수 (소인수분해 이용)', requiredSkills: SKILLS_GCD,
    stem: '$18$과 $24$의 최대공약수는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '소인수분해 방식의 최대공약수 구하는 원리는?',
        options: [
          { key: 'A', text: '공통 소인수의 작은 쪽 지수를 택해 곱한다', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '두 수의 모든 소인수를 곱한다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '최소공배수와 혼동' },
          { key: 'C', text: '공통 소인수의 큰 쪽 지수를 택한다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '최소공배수 규칙을 최대공약수에 적용' },
          { key: 'D', text: '두 수의 합', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '약수와 무관' },
          { key: 'E', text: '두 수의 차', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '약수와 무관' },
        ] },
      { stepType: 'PROCESS', prompt: '$18$과 $24$의 소인수분해는?',
        options: [
          { key: 'A', text: '$18 = 2 \\times 3^2,\\ 24 = 2^3 \\times 3$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$18 = 2^2 \\times 3,\\ 24 = 2^3 \\times 3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$18 \\neq 12$' },
          { key: 'C', text: '$18 = 2 \\times 9,\\ 24 = 4 \\times 6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '9, 4, 6 모두 합성수' },
          { key: 'D', text: '$18 = 3 \\times 6,\\ 24 = 4 \\times 6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '소수까지 분해 안 됨' },
          { key: 'E', text: '$18 = 2^3 \\times 3,\\ 24 = 2 \\times 3^2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '두 수 바꿔 분해' },
        ] },
      { stepType: 'ANSWER', prompt: '최대공약수는?',
        options: [
          { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$3^1$ 공통분 빠뜨림' },
          { key: 'C', text: '$3$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$2^1$ 공통분 빠뜨림' },
          { key: 'D', text: '$72$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '최소공배수와 혼동' },
          { key: 'E', text: '$12$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '큰 쪽 지수를 잘못 적용' },
        ] },
    ],
    solution: '$18 = 2^1 \\times 3^2,\\ 24 = 2^3 \\times 3^1$. 공통 소인수의 작은 지수 곱: $2^1 \\times 3^1 = 6$.',
  },

  // ────────── Q12 (중) GCD(48,72) · ALGEBRA_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '최대공약수', requiredSkills: SKILLS_GCD,
    stem: '$48$과 $72$의 최대공약수는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '"작은 쪽 지수" 가 의미하는 것은?',
        options: [
          { key: 'A', text: '같은 소인수에 대해 두 수 중 더 작은 지수 (min)', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '두 지수의 평균', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '평균이 아님' },
          { key: 'C', text: '두 지수의 합', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '합이 아님' },
          { key: 'D', text: '두 지수의 차', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '차가 아님' },
          { key: 'E', text: '둘 중 큰 지수 (max)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '최소공배수 규칙' },
        ] },
      { stepType: 'PROCESS', prompt: '$48$과 $72$의 소인수분해는?',
        options: [
          { key: 'A', text: '$48 = 2^4 \\times 3,\\ 72 = 2^3 \\times 3^2$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$48 = 2^3 \\times 3^2,\\ 72 = 2^4 \\times 3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '바꿔 분해' },
          { key: 'C', text: '$48 = 2^4 \\times 3^2,\\ 72 = 2^3 \\times 3^2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$48 = 144$로 오해' },
          { key: 'D', text: '$48 = 6 \\times 8,\\ 72 = 8 \\times 9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '소수까지 분해 미완료' },
          { key: 'E', text: '$48 = 2^5,\\ 72 = 3^3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2^5=32, 3^3=27$로 잘못' },
        ] },
      { stepType: 'ANSWER', prompt: '각 소인수의 작은 지수: $\\min(4,3) = 3,\\ \\min(1,2) = 1$. 최대공약수는?',
        options: [
          { key: 'A', text: '$2^3 \\times 3 = 24$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$2^4 \\times 3^2 = 144$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '최소공배수 공식 적용' },
          { key: 'C', text: '$2^3 \\times 3^2 = 72$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '3의 큰 지수 사용' },
          { key: 'D', text: '$2^4 \\times 3 = 48$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '2의 큰 지수 사용' },
          { key: 'E', text: '$6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '지수 적용 잘못' },
        ] },
    ],
    solution: '$48 = 2^4 \\times 3^1,\\ 72 = 2^3 \\times 3^2$. 최대공약수 $= 2^{\\min(4,3)} \\times 3^{\\min(1,2)} = 2^3 \\times 3 = 24$.',
  },

  // ────────── Q13 (중) GCD with given factorizations · ALGEBRA_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '최대공약수 (소인수분해 직접 주어짐)', requiredSkills: SKILLS_GCD,
    stem: '$A = 2^2 \\times 3^2 \\times 5,\\ B = 2^3 \\times 3 \\times 7$ 일 때 $A$와 $B$의 최대공약수는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '공통 소인수만 골라야 하는 이유는?',
        options: [
          { key: 'A', text: '공약수는 두 수에 모두 들어 있어야 하므로 공통 소인수만 의미가 있다', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '공통이 아닌 소인수도 포함해야 한다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '최소공배수와 혼동' },
          { key: 'C', text: '공약수는 1이어야만 한다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '서로소 정의 잘못' },
          { key: 'D', text: '소인수분해는 약수와 무관', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '핵심 도구' },
          { key: 'E', text: 'A와 B의 합이 최대공약수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합과 무관' },
        ] },
      { stepType: 'PROCESS', prompt: '공통 소인수와 그 작은 지수는?',
        options: [
          { key: 'A', text: '공통: $2, 3$ — $\\min$: $2,1$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '공통: $2, 3, 5, 7$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '5는 B에 없고 7은 A에 없음' },
          { key: 'C', text: '공통: $5, 7$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '서로 다른 소인수만 적힘' },
          { key: 'D', text: '공통: $2$ — $\\min = 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: 'min이 아니라 max 사용' },
          { key: 'E', text: '공통: $3$ — $\\min = 2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: 'min이 아니라 max 사용' },
        ] },
      { stepType: 'ANSWER', prompt: '최대공약수 값은?',
        options: [
          { key: 'A', text: '$2^2 \\times 3 = 12$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$2^3 \\times 3^2 = 72$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '최댓값 지수 사용 (최소공배수 규칙)' },
          { key: 'C', text: '$2^2 \\times 3 \\times 5 \\times 7 = 420$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '5, 7 포함 (공통 아님)' },
          { key: 'D', text: '$2 \\times 3 = 6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$2$의 지수를 잘못 ($\\min(2,3)=2$)' },
          { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '서로소 아님 (공통분 존재)' },
        ] },
    ],
    solution: '공통 소인수 $2$의 $\\min(2,3)=2$, $3$의 $\\min(2,1)=1$. 최대공약수 $= 2^2 \\times 3 = 12$.',
  },

  // ────────── Q14 (중) LCM(12,18) · ARITHMETIC_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '최소공배수 (소인수분해)', requiredSkills: SKILLS_LCM,
    stem: '$12$와 $18$의 최소공배수는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '소인수분해 방식 최소공배수 구하는 원리는?',
        options: [
          { key: 'A', text: '모든 소인수를 모으되 각 소인수의 큰 지수(max)를 사용', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '공통 소인수의 작은 지수만', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '최대공약수 규칙' },
          { key: 'C', text: '두 수를 더한다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '배수와 무관' },
          { key: 'D', text: '두 수를 곱한다 (항상)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '두 수가 서로소일 때만 곱이 최소공배수' },
          { key: 'E', text: '큰 수 그대로', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '항상 성립 안 함' },
        ] },
      { stepType: 'PROCESS', prompt: '$12$와 $18$의 소인수분해는?',
        options: [
          { key: 'A', text: '$12 = 2^2 \\times 3,\\ 18 = 2 \\times 3^2$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$12 = 2 \\times 3^2,\\ 18 = 2^2 \\times 3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '두 수 바꿔 분해' },
          { key: 'C', text: '$12 = 3 \\times 4,\\ 18 = 2 \\times 9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '소수 아님' },
          { key: 'D', text: '$12 = 6 \\times 2,\\ 18 = 6 \\times 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '6 소수 아님' },
          { key: 'E', text: '$12 = 12,\\ 18 = 18$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '분해 안 됨' },
        ] },
      { stepType: 'ANSWER', prompt: '최소공배수 값은?',
        options: [
          { key: 'A', text: '$2^2 \\times 3^2 = 36$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$2 \\times 3 = 6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '최대공약수와 혼동' },
          { key: 'C', text: '$12 \\times 18 = 216$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '서로소일 때만 곱이 최소공배수' },
          { key: 'D', text: '$2^3 \\times 3^3 = 216$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '지수 합으로 오해' },
          { key: 'E', text: '$2 \\times 3^2 = 18$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '한쪽 지수만 사용' },
        ] },
    ],
    solution: '$12 = 2^2 \\times 3^1,\\ 18 = 2^1 \\times 3^2$. 최소공배수 $= 2^{\\max(2,1)} \\times 3^{\\max(1,2)} = 2^2 \\times 3^2 = 36$.',
  },

  // ────────── Q15 (중) LCM(2²·3, 2·3²·5) · FORMULA_SELECTION_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '최소공배수 (소인수분해 직접 주어짐, 비공통 소인수 포함)', requiredSkills: SKILLS_LCM,
    stem: '$A = 2^2 \\times 3,\\ B = 2 \\times 3^2 \\times 5$ 일 때 $A$와 $B$의 최소공배수는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '한쪽에만 있는 소인수($5$)는 어떻게 처리해야 하나?',
        options: [
          { key: 'A', text: '그대로 최소공배수에 포함시킨다 (지수 그대로)', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '제외한다', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '최소공배수는 모든 소인수 포함' },
          { key: 'C', text: '$0$제곱으로 처리', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '존재하므로 포함' },
          { key: 'D', text: '$1$로 처리', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '약수와 혼동' },
          { key: 'E', text: 'A 쪽에 없으므로 무시', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: 'B에 있으니 포함' },
        ] },
      { stepType: 'PROCESS', prompt: '각 소인수의 큰 지수: $2 \\to \\max(2,1),\\ 3 \\to \\max(1,2),\\ 5 \\to \\max(0,1)$',
        options: [
          { key: 'A', text: '$2, 2, 1$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$2, 2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '5 빠뜨림' },
          { key: 'C', text: '$1, 1, 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '최솟값 사용 (최대공약수 규칙)' },
          { key: 'D', text: '$3, 3, 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '지수 합 사용' },
          { key: 'E', text: '$2, 2, 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '5의 max가 1' },
        ] },
      { stepType: 'ANSWER', prompt: '최소공배수 값은?',
        options: [
          { key: 'A', text: '$2^2 \\times 3^2 \\times 5 = 180$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$2 \\times 3 = 6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '최대공약수' },
          { key: 'C', text: '$2^2 \\times 3^2 = 36$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '5 빠뜨림' },
          { key: 'D', text: '$2^3 \\times 3^3 \\times 5 = 1080$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '지수 합' },
          { key: 'E', text: '$A \\times B = 360$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '서로소 아니므로 곱이 최소공배수 아님' },
        ] },
    ],
    solution: '최소공배수는 모든 소인수의 최댓값 지수: $2^2 \\times 3^2 \\times 5^1 = 4 \\times 9 \\times 5 = 180$.',
  },

  // ────────── Q16 (어려움) a×b = GCD×LCM · FORMULA_SELECTION_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'hard', concept: '최대공약수 × 최소공배수 = 두 수의 곱', requiredSkills: SKILLS_MIXED,
    stem: '두 자연수 $a, b$ 의 최대공약수가 $4$, 최소공배수가 $24$ 일 때 $a \\times b = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '(최대공약수) $\\times$ (최소공배수) $= ?$',
        options: [
          { key: 'A', text: '$a \\times b$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$a + b$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱이 아니라 합으로 오해' },
          { key: 'C', text: '$a - b$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '차로 오해' },
          { key: 'D', text: '$a / b$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '비율로 오해' },
          { key: 'E', text: '$a^2 \\times b^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '지수 잘못' },
        ] },
      { stepType: 'PROCESS', prompt: '(최대공약수) $\\times$ (최소공배수) 를 계산하면?',
        options: [
          { key: 'A', text: '$4 \\times 24 = 96$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$4 + 24 = 28$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합 적용' },
          { key: 'C', text: '$24 / 4 = 6$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '나누기 적용' },
          { key: 'D', text: '$4^2 \\times 24 = 384$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
          { key: 'E', text: '$4 \\times 24^2 = 2304$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '제곱 잘못' },
        ] },
      { stepType: 'ANSWER', prompt: '$a \\times b$ 의 값은?',
        options: [
          { key: 'A', text: '$96$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$28$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합으로 오해' },
          { key: 'C', text: '$20$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '차로 오해' },
          { key: 'D', text: '$6$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '최소공배수/최대공약수로 오해' },
          { key: 'E', text: '$48$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '곱셈 실수' },
        ] },
    ],
    solution: '공식: $a \\times b = $ (최대공약수) $\\times$ (최소공배수). 따라서 $a \\times b = 4 \\times 24 = 96$.',
  },

  // ────────── Q17 (어려움) 사과 12, 귤 18 똑같이 나눠줄 학생 최대수 · CONDITION_MISSING ──────────
  {
    chapterCode: CODE, difficulty: 'hard', concept: '공약수 활용 (똑같이 나누기)', requiredSkills: SKILLS_WORD,
    stem: '사과 $12$개, 귤 $18$개를 남김없이 똑같이 나누어 줄 수 있는 학생의 최대 인원은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '"똑같이 나눈다" 가 의미하는 것은?',
        options: [
          { key: 'A', text: '학생 수가 두 수 모두의 약수여야 함 → 공약수', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '두 수의 합의 약수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합과 무관' },
          { key: 'C', text: '두 수의 차의 약수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '차와 무관' },
          { key: 'D', text: '두 수의 곱의 배수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '배수와 혼동' },
          { key: 'E', text: '두 수 중 작은 쪽의 약수', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '큰 쪽 조건 무시' },
        ] },
      { stepType: 'PROCESS', prompt: '"최대" 인원수 = $12$와 $18$의?',
        options: [
          { key: 'A', text: '최대공약수', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '최소공배수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '최대공약수와 최소공배수 혼동' },
          { key: 'C', text: '공약수 중 가장 작은 값', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '최대 조건 무시' },
          { key: 'D', text: '두 수의 차', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '조건 무관 계산' },
          { key: 'E', text: '두 수의 합', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '조건 무관' },
        ] },
      { stepType: 'ANSWER', prompt: '$12$와 $18$의 최대공약수는?',
        options: [
          { key: 'A', text: '$6$명', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$2$명', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '공통 소인수 $3$ 빠뜨림' },
          { key: 'C', text: '$3$명', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '공통 소인수 $2$ 빠뜨림' },
          { key: 'D', text: '$36$명', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '최소공배수 적용' },
          { key: 'E', text: '$12$명', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '귤 조건 무시' },
        ] },
    ],
    solution: '$12 = 2^2 \\times 3,\\ 18 = 2 \\times 3^2$. 최대공약수 $= 2 \\times 3 = 6$. 한 명이 사과 $2$개, 귤 $3$개씩 받는다.',
  },

  // ────────── Q18 (어려움) 1080을 곱해 제곱수 만들기 · EXPONENT_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'hard', concept: '제곱수 만들기 (지수 짝수화)', requiredSkills: SKILLS_FACTOR,
    stem: '$1080$에 어떤 자연수 $n$ 을 곱하여 그 결과가 제곱수가 되게 하려고 한다. 가장 작은 $n$ 은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '제곱수의 소인수분해 특징은?',
        options: [
          { key: 'A', text: '모든 소인수의 지수가 짝수', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '모든 소인수의 지수가 같음', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '동일과 짝수 혼동' },
          { key: 'C', text: '소인수가 $2$개 이하', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '개수와 무관' },
          { key: 'D', text: '지수가 모두 홀수', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '반대로 외움' },
          { key: 'E', text: '지수가 항상 $2$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$4^2 = 16 = 2^4$ 처럼 더 클 수 있음' },
        ] },
      { stepType: 'PROCESS', prompt: '$1080$의 소인수분해는?',
        options: [
          { key: 'A', text: '$2^3 \\times 3^3 \\times 5$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$2^2 \\times 3^3 \\times 5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2^2 \\times 27 \\times 5 = 540 \\neq 1080$' },
          { key: 'C', text: '$2^3 \\times 3^2 \\times 5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$8 \\times 9 \\times 5 = 360 \\neq 1080$' },
          { key: 'D', text: '$2^4 \\times 3^3 \\times 5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$16 \\times 27 \\times 5 = 2160 \\neq 1080$' },
          { key: 'E', text: '$2^3 \\times 3^3 \\times 5^2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$8 \\times 27 \\times 25 = 5400 \\neq 1080$' },
        ] },
      { stepType: 'ANSWER', prompt: '홀수 지수($2^3, 3^3, 5^1$)를 짝수로 만들려면 곱해야 할 최소 $n$은?',
        options: [
          { key: 'A', text: '$n = 2 \\times 3 \\times 5 = 30$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$n = 2 \\times 3 = 6$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$5^1$의 짝수화 빠뜨림' },
          { key: 'C', text: '$n = 5$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$2^3, 3^3$ 모두 빠뜨림' },
          { key: 'D', text: '$n = 2^2 \\times 3^2 \\times 5 = 180$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '필요 이상으로 곱함' },
          { key: 'E', text: '$n = 1080$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '자신을 곱하면 제곱수지만 최소 아님' },
        ] },
    ],
    solution: '$1080 = 2^3 \\times 3^3 \\times 5^1$. 각 지수를 짝수로 만들려면 $2, 3, 5$를 한 번씩 더 곱한다. 따라서 $n = 30$, 그 결과 $1080 \\times 30 = 32400 = 180^2$.',
  },

  // ────────── Q19 (어려움) ab=720, gcd=12, LCM=? · FORMULA_SELECTION_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'hard', concept: '최대공약수·최소공배수 관계식 응용', requiredSkills: SKILLS_MIXED,
    stem: '두 자연수 $a, b$ 의 곱이 $720$이고 최대공약수가 $12$ 일 때 최소공배수는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$a \\times b = $ (최대공약수) $\\times$ (최소공배수) 를 최소공배수에 대해 풀면?',
        options: [
          { key: 'A', text: '최소공배수 $= \\dfrac{a \\times b}{\\text{최대공약수}}$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '최소공배수 $= a \\times b - $ 최대공약수', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '차로 오해' },
          { key: 'C', text: '최소공배수 $= a \\times b + $ 최대공약수', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합으로 오해' },
          { key: 'D', text: '최소공배수 $= a \\times b \\times $ 최대공약수', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱셈 잘못' },
          { key: 'E', text: '최소공배수 $= (\\text{최대공약수})^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱으로 오해' },
        ] },
      { stepType: 'PROCESS', prompt: '값 대입: $a \\times b = 720$, 최대공약수 $= 12$',
        options: [
          { key: 'A', text: '최소공배수 $= 720 / 12$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '최소공배수 $= 720 \\times 12$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나눗셈 자리에 곱셈' },
          { key: 'C', text: '최소공배수 $= 12 / 720$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '분자분모 뒤집힘' },
          { key: 'D', text: '최소공배수 $= 720 - 12$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '뺄셈으로 오해' },
          { key: 'E', text: '최소공배수 $= 720 + 12$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '덧셈으로 오해' },
        ] },
      { stepType: 'ANSWER', prompt: '최소공배수 값은?',
        options: [
          { key: 'A', text: '$60$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$72$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$720/10$ 등 계산 실수' },
          { key: 'C', text: '$8640$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$720 \\times 12$' },
          { key: 'D', text: '$120$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$720/6$' },
          { key: 'E', text: '$30$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$720/24$' },
        ] },
    ],
    solution: '$a \\times b =$ (최대공약수) $\\times$ (최소공배수) 이므로 최소공배수 $= \\dfrac{720}{12} = 60$. 검증: $12 \\times 60 = 720 = a \\times b$ ✓.',
  },

  // ────────── Q20 (어려움) 직육면체 채우는 정육면체 최소 개수 · CONDITION_MISSING ──────────
  {
    chapterCode: CODE, difficulty: 'hard', concept: '최대공약수 활용 (직육면체 채우기)', requiredSkills: SKILLS_WORD,
    stem: '가로 $12$, 세로 $18$, 높이 $24$ 인 직육면체를 빈틈없이 채울 수 있는 정육면체의 최소 개수는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '"빈틈없이 채우는 가장 큰 정육면체"의 한 변의 길이는?',
        options: [
          { key: 'A', text: '$12, 18, 24$의 최대공약수', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$12, 18, 24$의 최소공배수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '최소공배수와 혼동' },
          { key: 'C', text: '세 수의 합 $\\div 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평균과 무관' },
          { key: 'D', text: '세 수 중 작은 값', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '나머지 두 변 조건 무시' },
          { key: 'E', text: '세 수의 차', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없는 계산' },
        ] },
      { stepType: 'PROCESS', prompt: '$12, 18, 24$의 최대공약수 계산은?',
        options: [
          { key: 'A', text: '$12 = 2^2 \\times 3,\\ 18 = 2 \\times 3^2,\\ 24 = 2^3 \\times 3 \\to$ 최대공약수 $= 2 \\times 3 = 6$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '최대공약수 $= 12$ (가장 작은 수)', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$12$가 $18$의 약수 아님' },
          { key: 'C', text: '최대공약수 $= 2$ ($2$만 공통)', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$3$도 공통' },
          { key: 'D', text: '최대공약수 $= 3$ ($3$만 공통)', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$2$도 공통' },
          { key: 'E', text: '최대공약수 $= 72$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '최소공배수 적용' },
        ] },
      { stepType: 'ANSWER', prompt: '정육면체 한 변 $6$ → 부피 $216$. 개수 $= \\dfrac{12 \\times 18 \\times 24}{216} = ?$',
        options: [
          { key: 'A', text: '$24$개', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$12$개', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '부피 계산 실수' },
          { key: 'C', text: '$5184$개', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '나누기 안함' },
          { key: 'D', text: '$1$개', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '정육면체 1개로 다 채워질 수 없음' },
          { key: 'E', text: '$72$개', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '최소공배수를 한 변으로 사용' },
        ] },
    ],
    solution: '한 변 $= $ $12, 18, 24$의 최대공약수 $= 6$. 정육면체 부피 $= 6^3 = 216$. 직육면체 부피 $= 12 \\times 18 \\times 24 = 5184$. 개수 $= 5184 / 216 = 24$ 개.',
  },
];

export const K_G7_MATH1_CH01_FACTORIZATION_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
