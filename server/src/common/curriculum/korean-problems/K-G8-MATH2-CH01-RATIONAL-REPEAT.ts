/**
 * K-G8-MATH2-CH01-RATIONAL-REPEAT (유리수와 순환소수) — 20문제 3-step Mastery.
 * 중2 — 유한·순환소수 판별 → 순환소수 → 분수 변환 → 응용.
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 * 주요 errorCode 분배:
 *   CONCEPT_MISUNDERSTANDING 6 (Q1,2,5,6,11,17) / ARITHMETIC_ERROR 4 (Q3,4,7,8)
 *   FORMULA_SELECTION_ERROR 4 (Q10,12,15,19) / DENOMINATOR_ERROR 3 (Q9,13,14)
 *   ALGEBRA_ERROR 2 (Q18,20) / CONDITION_MISSING 1 (Q16)
 *
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G8-MATH2-CH01-RATIONAL-REPEAT';
const SKILLS_BASIC = ['fraction_to_decimal', 'decimal_classification'];
const SKILLS_FINITE = ['finite_decimal_condition', 'denominator_prime_factors'];
const SKILLS_REPEAT = ['repeating_decimal_to_fraction', 'cycle_length'];
const SKILLS_ARITH = ['repeating_decimal_arithmetic'];

const problems: KoreanProblemSeed[] = [
  // Q1 1/4 유한
  { chapterCode: CODE, difficulty: 'easy', concept: '분수→소수 (유한)', requiredSkills: SKILLS_BASIC,
    stem: '$\\dfrac{1}{4}$ 를 소수로 표현하면?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$1 \\div 4$ 계산 시작은?', options: [
        { key: 'A', text: '$1.00 \\div 4$ 처럼 0을 채워 나눈다', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4 \\div 1$ 로 뒤집어', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '분자분모 바꿔 나눔' },
        { key: 'C', text: '$1 + 4 = 5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합' },
        { key: 'D', text: '$1 - 4 = -3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '차' },
        { key: 'E', text: '나눗셈 안 함', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '분수→소수에는 나눗셈 필요' },
      ] },
      { stepType: 'PROCESS', prompt: '$100 \\div 4 = ?$', options: [
        { key: 'A', text: '$25$, 나머지 $0$ — 종료', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$40$, 나머지 $0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 잘못' },
        { key: 'C', text: '$25$, 나머지 $1$ — 무한 반복', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나머지 잘못' },
        { key: 'D', text: '$4$, 나머지 $84$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 분배' },
        { key: 'E', text: '$5$, 나머지 $80$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 잘못' },
      ] },
      { stepType: 'ANSWER', prompt: '$1/4$ 는?', options: [
        { key: 'A', text: '$0.25$ (유한소수)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0.4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 잘못' },
        { key: 'C', text: '$0.\\overline{25}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '유한인데 순환표기' },
        { key: 'D', text: '$4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '뒤집힘' },
        { key: 'E', text: '$2.5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '소수점 잘못' },
      ] },
    ], solution: '$1 \\div 4 = 0.25$. 분모 $4 = 2^2$ → 소인수 2뿐 → 유한소수.' },

  // Q2 1/3 순환
  { chapterCode: CODE, difficulty: 'easy', concept: '분수→소수 (순환)', requiredSkills: SKILLS_BASIC,
    stem: '$\\dfrac{1}{3}$ 를 소수로 표현하면?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$1 \\div 3$ 나머지 패턴은?', options: [
        { key: 'A', text: '나머지가 항상 $1$ → 몫 $3$ 무한 반복', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '나머지 $0$ 으로 끝', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$1/3$ 안 끝남' },
        { key: 'C', text: '$0.3$ 으로 정확히 끝', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근사' },
        { key: 'D', text: '$0.1$ 으로 끝', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '몫 잘못' },
        { key: 'E', text: '정의되지 않음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '순환소수로 정의됨' },
      ] },
      { stepType: 'PROCESS', prompt: '$0.333...$ 의 표기?', options: [
        { key: 'A', text: '$0.\\overline{3}$ (3 위에 바)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0.33$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근사값' },
        { key: 'C', text: '$0.3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '한 자리만' },
        { key: 'D', text: '$\\overline{0.3}$ (소수점 포함)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '순환마디만 표시' },
        { key: 'E', text: '$0.\\overline{1}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '몫 잘못' },
      ] },
      { stepType: 'ANSWER', prompt: '$1/3$ 은?', options: [
        { key: 'A', text: '$0.\\overline{3}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0.3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '유한으로 오해' },
        { key: 'C', text: '$0.33$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근사' },
        { key: 'D', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '뒤집힘' },
        { key: 'E', text: '$0.\\overline{1}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$1 / 3 = 0.\\overline{3}$ — 3 무한 반복.' },

  // Q3 3/20 유한 판별
  { chapterCode: CODE, difficulty: 'easy', concept: '유한·순환 판별 (3/20)', requiredSkills: SKILLS_FINITE,
    stem: '$\\dfrac{3}{20}$ 은 유한소수인가 순환소수인가?',
    steps: [
      { stepType: 'CONCEPT', prompt: '유한소수 조건은?', options: [
        { key: 'A', text: '기약분수 분모의 소인수가 $2$와 $5$ 뿐', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '분자가 짝수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '분자와 무관' },
        { key: 'C', text: '분모가 짝수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$1/6$은 짝수분모지만 순환' },
        { key: 'D', text: '분모가 $10$의 배수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$1/4$은 유한' },
        { key: 'E', text: '분자가 분모보다 작음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '관계없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$20$ 의 소인수분해?', options: [
        { key: 'A', text: '$20 = 2^2 \\times 5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$20 = 2 \\times 10$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$10$은 소수 아님' },
        { key: 'C', text: '$20 = 4 \\times 5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$4$는 소수 아님' },
        { key: 'D', text: '$20 = 2^2 \\times 3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3$이 들어가면 $20$ 아님' },
        { key: 'E', text: '$20 = 2 \\times 5^2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$50$임' },
      ] },
      { stepType: 'ANSWER', prompt: '판별 결과는?', options: [
        { key: 'A', text: '유한소수 ($0.15$)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '순환소수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$2, 5$ 만이므로 유한' },
        { key: 'C', text: '나누어지지 않음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '항상 나눠짐' },
        { key: 'D', text: '정수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '정수 아님' },
        { key: 'E', text: '유한이지만 $1.5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '소수점 위치' },
      ] },
    ], solution: '$20 = 2^2 \\cdot 5$ — 소인수 2,5뿐 → 유한소수. 실제 $3/20 = 0.15$.' },

  // Q4 5/12 순환 판별
  { chapterCode: CODE, difficulty: 'easy', concept: '유한·순환 판별 (5/12)', requiredSkills: SKILLS_FINITE,
    stem: '$\\dfrac{5}{12}$ 은 유한 / 순환?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$12$ 의 소인수분해?', options: [
        { key: 'A', text: '$12 = 2^2 \\times 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$12 = 4 \\times 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$4$ 소수 아님' },
        { key: 'C', text: '$12 = 2 \\times 6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$6$ 소수 아님' },
        { key: 'D', text: '$12 = 2 \\times 5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$10$' },
        { key: 'E', text: '$12 = 3^2 \\times 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$18$' },
      ] },
      { stepType: 'PROCESS', prompt: '소인수 $3$ 이 있으면?', options: [
        { key: 'A', text: '순환소수가 된다 (분모에 2,5 외 소인수)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '유한소수가 된다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '반대' },
        { key: 'C', text: '나누어지지 않음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '항상 나눠짐' },
        { key: 'D', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '명확함' },
        { key: 'E', text: '소수가 안 된다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$5/12$ 는?', options: [
        { key: 'A', text: '순환소수 ($0.41\\overline{6}$)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '유한소수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$3$ 있어서 순환' },
        { key: 'C', text: '정수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '정수 아님' },
        { key: 'D', text: '나누어지지 않음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '항상 나눠짐' },
        { key: 'E', text: '$0.5$ (유한)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 잘못' },
      ] },
    ], solution: '$12 = 2^2 \\cdot 3$ — 소인수 $3$ 있음 → 순환. 실제 $5/12 = 0.41\\overline{6}$.' },

  // Q5 0.3 → 분수
  { chapterCode: CODE, difficulty: 'easy', concept: '소수→분수 (기본)', requiredSkills: SKILLS_BASIC,
    stem: '$0.3$ 을 분수로 나타내면?',
    steps: [
      { stepType: 'CONCEPT', prompt: '소수점 한 자리는 분모가?', options: [
        { key: 'A', text: '$10$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$100$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '소수점 두 자리' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '정수' },
        { key: 'D', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '분자와 혼동' },
        { key: 'E', text: '$1000$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '소수점 세 자리' },
      ] },
      { stepType: 'PROCESS', prompt: '$0.3 = 3 / ?$', options: [
        { key: 'A', text: '$3 / 10$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3 / 100$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '분모 잘못' },
        { key: 'C', text: '$3 / 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '정수' },
        { key: 'D', text: '$10 / 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '뒤집힘' },
        { key: 'E', text: '$30 / 100$ (간단히 안 함)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '맞지만 기약 아님' },
      ] },
      { stepType: 'ANSWER', prompt: '기약분수는?', options: [
        { key: 'A', text: '$\\dfrac{3}{10}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{1}{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$\\dfrac{3}{100}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '분모 잘못' },
        { key: 'D', text: '$\\dfrac{3}{1}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '정수' },
        { key: 'E', text: '$\\dfrac{30}{100}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '기약 아님' },
      ] },
    ], solution: '$0.3 = 3/10$. 분자/분모 GCD $= 1$이므로 이미 기약.' },

  // Q6 0.25 → 분수
  { chapterCode: CODE, difficulty: 'easy', concept: '소수→분수 (약분)', requiredSkills: SKILLS_BASIC,
    stem: '$0.25$ 를 기약분수로?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$0.25 = 25 / ?$', options: [
        { key: 'A', text: '$25/100$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$25/10$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '소수점 두 자리 = $100$' },
        { key: 'C', text: '$25/1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '정수' },
        { key: 'D', text: '$25/1000$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '세 자리' },
        { key: 'E', text: '$0.25/1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '식 잘못' },
      ] },
      { stepType: 'PROCESS', prompt: '$25/100$ 을 기약으로?', options: [
        { key: 'A', text: 'GCD $= 25$ → $1/4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: 'GCD $= 5$ → $5/20$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '약분 더 가능' },
        { key: 'C', text: '$25/100$ 그대로', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '기약 아님' },
        { key: 'D', text: 'GCD $= 100$ → $0.25/1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
        { key: 'E', text: 'GCD $= 4$ → $6.25/25$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      ] },
      { stepType: 'ANSWER', prompt: '기약분수는?', options: [
        { key: 'A', text: '$\\dfrac{1}{4}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$0.5$' },
        { key: 'C', text: '$\\dfrac{25}{100}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '기약 아님' },
        { key: 'D', text: '$\\dfrac{5}{20}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '더 약분 가능' },
        { key: 'E', text: '$\\dfrac{2}{5}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$0.4$' },
      ] },
    ], solution: '$0.25 = 25/100 = 1/4$.' },

  // Q7 7/40 유한/순환
  { chapterCode: CODE, difficulty: 'medium', concept: '유한 판별 (40)', requiredSkills: SKILLS_FINITE,
    stem: '$\\dfrac{7}{40}$ 은 유한 / 순환?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$40$ 의 소인수분해?', options: [
        { key: 'A', text: '$40 = 2^3 \\times 5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$40 = 8 \\times 5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$8$ 소수 아님' },
        { key: 'C', text: '$40 = 4 \\times 10$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '둘 다 소수 아님' },
        { key: 'D', text: '$40 = 2^2 \\times 10$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$10$ 소수 아님' },
        { key: 'E', text: '$40 = 2 \\times 20$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$20$ 소수 아님' },
      ] },
      { stepType: 'PROCESS', prompt: '소인수 $2, 5$ 만 있는지 확인:', options: [
        { key: 'A', text: '$2$ 와 $5$ 만 있음 → 유한', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2, 5, 3$ 있음 → 순환', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3$ 없음' },
        { key: 'C', text: '소인수 $7$ → 순환', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '분자가 아니라 분모 봄' },
        { key: 'D', text: '판별 못함', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '쉽게 판별 가능' },
        { key: 'E', text: '항상 순환', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '결과는?', options: [
        { key: 'A', text: '유한소수 ($0.175$)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '순환소수', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '유한' },
        { key: 'C', text: '$0.7$ (한 자리만)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 잘못' },
        { key: 'D', text: '정수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '아님' },
        { key: 'E', text: '나누어지지 않음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '항상 나눠짐' },
      ] },
    ], solution: '$40 = 2^3 \\cdot 5$ — 소인수 $2,5$ 뿐 → 유한. $7/40 = 0.175$.' },

  // Q8 8/45 순환
  { chapterCode: CODE, difficulty: 'medium', concept: '유한 판별 (45)', requiredSkills: SKILLS_FINITE,
    stem: '$\\dfrac{8}{45}$ 은 유한 / 순환?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$45$ 의 소인수분해?', options: [
        { key: 'A', text: '$45 = 3^2 \\times 5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$45 = 9 \\times 5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$9$ 소수 아님' },
        { key: 'C', text: '$45 = 5 \\times 9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$9$ 소수 아님' },
        { key: 'D', text: '$45 = 3 \\times 15$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$15$ 소수 아님' },
        { key: 'E', text: '$45 = 2 \\times 3 \\times 5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$30$ 됨' },
      ] },
      { stepType: 'PROCESS', prompt: '소인수 $3$ 있으면?', options: [
        { key: 'A', text: '순환소수 (2,5 아닌 소인수가 있음)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '유한소수', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '반대' },
        { key: 'C', text: '판별 불가', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '명확함' },
        { key: 'D', text: '정수', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '나누어지지 않음', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나눠짐' },
      ] },
      { stepType: 'ANSWER', prompt: '결과는?', options: [
        { key: 'A', text: '순환소수', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '유한소수', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3$ 있어 순환' },
        { key: 'C', text: '$0.18$ (유한)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근사' },
        { key: 'D', text: '정수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '아님' },
        { key: 'E', text: '나누어지지 않음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '나눠짐' },
      ] },
    ], solution: '$45 = 3^2 \\cdot 5$ — $3$ 있음 → 순환.' },

  // Q9 11/250 유한
  { chapterCode: CODE, difficulty: 'medium', concept: '유한 판별 (250)', requiredSkills: SKILLS_FINITE,
    stem: '$\\dfrac{11}{250}$ 은 유한 / 순환?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$250$ 의 소인수분해?', options: [
        { key: 'A', text: '$250 = 2 \\times 5^3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$250 = 2 \\times 125$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '$125$ 소수 아님' },
        { key: 'C', text: '$250 = 10 \\times 25$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '둘 다 소수 아님' },
        { key: 'D', text: '$250 = 5 \\times 50$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '$50$ 소수 아님' },
        { key: 'E', text: '$250 = 2^2 \\times 5^2$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '$100$ 됨' },
      ] },
      { stepType: 'PROCESS', prompt: '소인수가 $2, 5$ 뿐?', options: [
        { key: 'A', text: '그렇다 → 유한', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$11$ 도 있다 → 순환', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '$11$은 분자' },
        { key: 'C', text: '$3$ 있다 → 순환', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '$3$ 없음' },
        { key: 'D', text: '판별 불가', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '쉽게 판별' },
        { key: 'E', text: '항상 순환', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '유한소수 ($0.044$)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '순환', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '유한' },
        { key: 'C', text: '$0.4$ (유한)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 잘못' },
        { key: 'D', text: '정수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '아님' },
        { key: 'E', text: '$0.\\overline{44}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '유한임' },
      ] },
    ], solution: '$250 = 2 \\cdot 5^3$ → 유한. $11/250 = 0.044$.' },

  // Q10 a/(2³·5²) 유한?
  { chapterCode: CODE, difficulty: 'medium', concept: '유한 판별 (지수형 분모)', requiredSkills: SKILLS_FINITE,
    stem: '$\\dfrac{a}{2^3 \\times 5^2}$ 는 ($a$ 가 자연수일 때) 유한소수인가?',
    steps: [
      { stepType: 'CONCEPT', prompt: '분모가 $2$ 와 $5$ 의 곱이면?', options: [
        { key: 'A', text: '항상 유한소수 (분자가 자연수면)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '항상 순환', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '반대' },
        { key: 'C', text: '$a$ 의 값에 따라 다름', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$a$ 자연수면 항상 유한 (기약화 후에도 분모는 2,5만)' },
        { key: 'D', text: '$a = 1$ 일 때만 유한', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '아무 자연수 OK' },
        { key: 'E', text: '$a$ 가 $10$ 의 배수일 때만 유한', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '왜?', options: [
        { key: 'A', text: '분자 약분 후에도 분모의 소인수는 $\\{2, 5\\}$ 의 부분집합', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '분자가 $\\infty$ 가 되므로', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '무의미' },
        { key: 'C', text: '$2$ 와 $5$ 의 곱은 항상 $10$ 의 거듭제곱', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '맞지만 부분적 설명' },
        { key: 'D', text: '$\\pi$ 와 무관하므로', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '관계 없음' },
        { key: 'E', text: '나누어지지 않으므로', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '잘못' },
      ] },
      { stepType: 'ANSWER', prompt: '유한 / 순환?', options: [
        { key: 'A', text: '유한 (분자 자연수면 항상)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '순환', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$2, 5$ 만이라 유한' },
        { key: 'C', text: '$a$ 가 $3$ 의 배수일 때만 순환', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '판별 불가', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '판별 가능' },
        { key: 'E', text: '$a$ 자체가 짝수일 때만 유한', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '분모가 $2^p \\cdot 5^q$ 형태 → 분자가 자연수면 무조건 유한.' },

  // Q11 0.5 (5순환) → 분수
  { chapterCode: CODE, difficulty: 'medium', concept: '순환소수→분수 (한 자리)', requiredSkills: SKILLS_REPEAT,
    stem: '$0.\\overline{5}$ 를 기약분수로?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$x = 0.\\overline{5}$ 변환 방법?', options: [
        { key: 'A', text: '$10x = 5.\\overline{5}$ 와 빼서 $9x = 5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$100x = 55.\\overline{5}$, $99x = 55$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '순환마디 1자리 → 10배' },
        { key: 'C', text: '$x = 5/10$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '유한처럼 봄' },
        { key: 'D', text: '$x = 5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$x = 0.5$ 그대로', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '순환 무시' },
      ] },
      { stepType: 'PROCESS', prompt: '$9x = 5$', options: [
        { key: 'A', text: '$x = 5/9$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 9/5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '뒤집힘' },
        { key: 'C', text: '$x = 1/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$x = 5/10$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '유한처럼' },
        { key: 'E', text: '$x = 5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '나누기 누락' },
      ] },
      { stepType: 'ANSWER', prompt: '$0.\\overline{5}$ = ?', options: [
        { key: 'A', text: '$\\dfrac{5}{9}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$0.5$ 유한과 혼동' },
        { key: 'C', text: '$\\dfrac{5}{10}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '유한처럼 봄' },
        { key: 'D', text: '$\\dfrac{9}{5}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '뒤집힘' },
        { key: 'E', text: '$\\dfrac{5}{100}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$10x - x = 5 \\Rightarrow 9x = 5 \\Rightarrow x = 5/9$.' },

  // Q12 0.27 → 분수
  { chapterCode: CODE, difficulty: 'medium', concept: '순환소수→분수 (두 자리)', requiredSkills: SKILLS_REPEAT,
    stem: '$0.\\overline{27}$ 를 기약분수로?',
    steps: [
      { stepType: 'CONCEPT', prompt: '순환마디 두 자리 → 곱하는 수?', options: [
        { key: 'A', text: '$100$ ($10^2$)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$10$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '한 자리용' },
        { key: 'C', text: '$27$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1000$ ($10^3$)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '세 자리용' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$100x - x = 27 \\Rightarrow 99x = 27$', options: [
        { key: 'A', text: '$x = 27/99 = 3/11$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 27/100$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$99$가 아님' },
        { key: 'C', text: '$x = 99/27$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '뒤집힘' },
        { key: 'D', text: '$x = 27/99 = 9/33$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '약분 부족' },
        { key: 'E', text: '$x = 27$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나눗셈 누락' },
      ] },
      { stepType: 'ANSWER', prompt: '기약은?', options: [
        { key: 'A', text: '$\\dfrac{3}{11}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{27}{99}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '기약 아님' },
        { key: 'C', text: '$\\dfrac{27}{100}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '분모 잘못' },
        { key: 'D', text: '$\\dfrac{9}{33}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '약분 부족' },
        { key: 'E', text: '$\\dfrac{27}{9}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$100x - x = 27 \\Rightarrow 99x = 27 \\Rightarrow x = 27/99 = 3/11$.' },

  // Q13 0.6 (6순환)
  { chapterCode: CODE, difficulty: 'medium', concept: '순환소수→분수 (0.6)', requiredSkills: SKILLS_REPEAT,
    stem: '$0.\\overline{6}$ 를 기약분수로?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$10x - x$ 식?', options: [
        { key: 'A', text: '$9x = 6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$10x - x = 60$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '뺀 결과 잘못' },
        { key: 'C', text: '$9x = 0.6$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '소수 그대로' },
        { key: 'D', text: '$99x = 6$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '두 자리 적용' },
        { key: 'E', text: '$x = 6$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '식 잘못' },
      ] },
      { stepType: 'PROCESS', prompt: '$x = 6/9 = ?$', options: [
        { key: 'A', text: '$2/3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$6/9$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '약분 안 함' },
        { key: 'C', text: '$3/2$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '뒤집힘' },
        { key: 'D', text: '$1/3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못 약분' },
        { key: 'E', text: '$6$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$0.\\overline{6}$ = ?', options: [
        { key: 'A', text: '$\\dfrac{2}{3}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{6}{9}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '기약 아님' },
        { key: 'C', text: '$\\dfrac{3}{5}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$0.6$ 유한과 혼동' },
        { key: 'D', text: '$\\dfrac{1}{3}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '잘못 약분' },
        { key: 'E', text: '$\\dfrac{6}{10}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '유한처럼' },
      ] },
    ], solution: '$9x = 6 \\Rightarrow x = 2/3$.' },

  // Q14 1.3 (3순환)
  { chapterCode: CODE, difficulty: 'medium', concept: '순환소수→분수 (정수+순환)', requiredSkills: SKILLS_REPEAT,
    stem: '$1.\\overline{3}$ 를 기약분수로?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$x = 1.\\overline{3}$ — $10x$?', options: [
        { key: 'A', text: '$10x = 13.\\overline{3}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$10x = 13$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '순환부 잘림' },
        { key: 'C', text: '$10x = 1.33$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '$10$ 안 곱함' },
        { key: 'D', text: '$10x = 130$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '정수처럼' },
        { key: 'E', text: '$10x = 13.3$ 만', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '순환 무시' },
      ] },
      { stepType: 'PROCESS', prompt: '$10x - x = 13.\\overline{3} - 1.\\overline{3}$', options: [
        { key: 'A', text: '$9x = 12 \\Rightarrow x = 4/3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$9x = 13 \\Rightarrow x = 13/9$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$1$ 안 뺌' },
        { key: 'C', text: '$10x - x = 12.\\overline{3}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '순환부 안 사라짐' },
        { key: 'D', text: '$x = 1$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '잘못' },
        { key: 'E', text: '$x = 1.3$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '식 변형 안 함' },
      ] },
      { stepType: 'ANSWER', prompt: '$1.\\overline{3}$ = ?', options: [
        { key: 'A', text: '$\\dfrac{4}{3}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{13}{9}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '정수부 처리 잘못' },
        { key: 'C', text: '$\\dfrac{12}{9}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '약분 안 함' },
        { key: 'D', text: '$\\dfrac{1}{3}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '정수부 누락' },
        { key: 'E', text: '$\\dfrac{3}{1}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '뒤집힘' },
      ] },
    ], solution: '$10x = 13.\\overline{3}$, $10x - x = 12$, $9x = 12 \\Rightarrow x = 4/3$.' },

  // Q15 0.123 (123 순환)
  { chapterCode: CODE, difficulty: 'medium', concept: '순환소수→분수 (세 자리)', requiredSkills: SKILLS_REPEAT,
    stem: '$0.\\overline{123}$ 를 기약분수로?',
    steps: [
      { stepType: 'CONCEPT', prompt: '순환마디 세 자리 → 곱하는 수?', options: [
        { key: 'A', text: '$1000$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$100$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '두 자리용' },
        { key: 'C', text: '$10000$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '네 자리' },
        { key: 'D', text: '$3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '자리수와 무관' },
        { key: 'E', text: '$10$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '한 자리용' },
      ] },
      { stepType: 'PROCESS', prompt: '$999x = 123$', options: [
        { key: 'A', text: '$x = 123/999 = 41/333$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 123/1000$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$999$가 아님' },
        { key: 'C', text: '$x = 123/100$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x = 123$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '나누기 누락' },
        { key: 'E', text: '$x = 123/9$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '한 자리 적용' },
      ] },
      { stepType: 'ANSWER', prompt: '기약은?', options: [
        { key: 'A', text: '$\\dfrac{41}{333}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{123}{999}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '기약 아님 (GCD=3)' },
        { key: 'C', text: '$\\dfrac{123}{1000}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '분모 잘못' },
        { key: 'D', text: '$\\dfrac{1}{8}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\dfrac{41}{111}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '약분 잘못' },
      ] },
    ], solution: '$999x = 123 \\Rightarrow x = 123/999$. GCD(123, 999)=3 → $41/333$.' },

  // Q16 (hard) 1/7 순환마디 길이
  { chapterCode: CODE, difficulty: 'hard', concept: '순환마디 길이', requiredSkills: SKILLS_REPEAT,
    stem: '$\\dfrac{1}{7} = 0.\\overline{142857}$ 이다. 순환마디의 길이는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '순환마디 정의?', options: [
        { key: 'A', text: '반복되는 한 단위의 숫자 묶음', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '전체 소수 자릿수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
        { key: 'C', text: '소수점 위치까지', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '첫 번째 숫자', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '한 자리 숫자만', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '여러 자리도 가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$142857$ 의 자릿수?', options: [
        { key: 'A', text: '$6$ 개', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5$ 개', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '자릿수 셈 잘못' },
        { key: 'C', text: '$7$ 개', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '잘못 셈' },
        { key: 'D', text: '$3$ 개', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'E', text: '무한', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '순환마디는 유한' },
      ] },
      { stepType: 'ANSWER', prompt: '길이는?', options: [
        { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$7$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '분모와 혼동' },
        { key: 'C', text: '$5$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'D', text: '$3$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'E', text: '무한', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '유한' },
      ] },
    ], solution: '$142857$ — 6자리 → 순환마디 길이 $6$.' },

  // Q17 (hard) a/12 유한 → 최소 a
  { chapterCode: CODE, difficulty: 'hard', concept: '유한이 되는 분자 조건', requiredSkills: SKILLS_FINITE,
    stem: '$\\dfrac{a}{12}$ 가 유한소수가 되도록 하는 가장 작은 자연수 $a$ 는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$12 = 2^2 \\cdot 3$. 유한이 되려면?', options: [
        { key: 'A', text: '분자 $a$ 가 $3$ 의 배수여야 분모의 $3$ 이 약분됨', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a$ 가 $2$ 의 배수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '분모의 $3$ 제거 못함' },
        { key: 'C', text: '$a$ 가 $12$ 의 배수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '필요 이상' },
        { key: 'D', text: '$a$ 가 $6$ 의 배수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '필요 이상 (최소 $3$ 면 OK)' },
        { key: 'E', text: '$a = 1$ 이면 됨', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$1/12$ 는 순환' },
      ] },
      { stepType: 'PROCESS', prompt: '$3$ 의 배수 중 가장 작은 자연수?', options: [
        { key: 'A', text: '$a = 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a = 6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '두 번째' },
        { key: 'C', text: '$a = 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '3의 배수 아님' },
        { key: 'D', text: '$a = 12$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '필요 이상' },
        { key: 'E', text: '$a = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '자연수 아님' },
      ] },
      { stepType: 'ANSWER', prompt: '$a = ?$', options: [
        { key: 'A', text: '$a = 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a = 6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '아니, 더 작은 값' },
        { key: 'C', text: '$a = 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$1/12$ 순환' },
        { key: 'D', text: '$a = 4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$4/12 = 1/3$ 순환' },
        { key: 'E', text: '$a = 12$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '필요 이상' },
      ] },
    ], solution: '$3/12 = 1/4 = 0.25$ (유한). $a$ 가 $3$ 의 배수일 때 분모의 $3$ 약분 → 유한.' },

  // Q18 (hard) 0.4 + 0.5 (순환)
  { chapterCode: CODE, difficulty: 'hard', concept: '순환소수 더하기', requiredSkills: SKILLS_ARITH,
    stem: '$0.\\overline{4} + 0.\\overline{5}$ 는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '각각 분수로?', options: [
        { key: 'A', text: '$\\dfrac{4}{9} + \\dfrac{5}{9}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{4}{10} + \\dfrac{5}{10}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '유한처럼' },
        { key: 'C', text: '$0.4 + 0.5 = 0.9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '순환 무시' },
        { key: 'D', text: '$4 + 5 = 9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '소수점 무시' },
        { key: 'E', text: '$\\dfrac{4}{9} \\cdot \\dfrac{5}{9}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '곱셈으로' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\dfrac{4}{9} + \\dfrac{5}{9}$', options: [
        { key: 'A', text: '$\\dfrac{9}{9} = 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{9}{18}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '분모 합' },
        { key: 'C', text: '$\\dfrac{20}{81}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '곱' },
        { key: 'D', text: '$\\dfrac{4 \\cdot 5}{9}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '잘못' },
        { key: 'E', text: '$0.9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '순환 무시한 결과' },
      ] },
      { stepType: 'ANSWER', prompt: '결과는?', options: [
        { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0.9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$0.\\overline{9} \\neq 0.9$' },
        { key: 'C', text: '$0.\\overline{9}$ ($\\neq 1$)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$0.\\overline{9} = 1$' },
        { key: 'D', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\dfrac{9}{18}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '분모 합' },
      ] },
    ], solution: '$\\dfrac{4}{9} + \\dfrac{5}{9} = 1$. ($0.\\overline{9} = 1$ 의 다른 표현)' },

  // Q19 (hard) 0.9 순환
  { chapterCode: CODE, difficulty: 'hard', concept: '$0.\\overline{9} = 1$', requiredSkills: SKILLS_REPEAT,
    stem: '$0.\\overline{9}$ 의 값은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '식 세우기: $x = 0.\\overline{9}$', options: [
        { key: 'A', text: '$10x - x = 9$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 0.999... < 1$ 직관', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '직관과 실제 값 다름' },
        { key: 'C', text: '$10x - x = 99$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '잘못' },
        { key: 'D', text: '$x = 9/10$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '유한 취급' },
        { key: 'E', text: '$x = 0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$9x = 9 \\Rightarrow x = ?$', options: [
        { key: 'A', text: '$x = 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나눗셈 누락' },
        { key: 'C', text: '$x = 0.9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '식 무시' },
        { key: 'D', text: '$x = 0.999...$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '맞지만 $= 1$' },
        { key: 'E', text: '$x = 1/9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '뒤집힘' },
      ] },
      { stepType: 'ANSWER', prompt: '$0.\\overline{9}$ = ?', options: [
        { key: 'A', text: '$1$ (정확히)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$ 보다 약간 작음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '엄밀히 같음' },
        { key: 'C', text: '$0.9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$9/10$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '유한처럼' },
        { key: 'E', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$10x - x = 9 \\Rightarrow 9x = 9 \\Rightarrow x = 1$. $0.\\overline{9} = 1$.' },

  // Q20 (hard) a/30 유한이려면
  { chapterCode: CODE, difficulty: 'hard', concept: '유한이 되는 분자 조건 (30)', requiredSkills: SKILLS_FINITE,
    stem: '$\\dfrac{a}{30}$ 가 유한소수이려면 자연수 $a$ 는 어떤 수의 배수여야 하는가?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$30$ 의 소인수분해?', options: [
        { key: 'A', text: '$30 = 2 \\times 3 \\times 5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$30 = 6 \\times 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$6$ 소수 아님' },
        { key: 'C', text: '$30 = 2 \\times 15$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$15$ 소수 아님' },
        { key: 'D', text: '$30 = 3 \\times 10$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$10$ 소수 아님' },
        { key: 'E', text: '$30 = 2^2 \\times 5$ (조금 잘못)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$20$ 됨' },
      ] },
      { stepType: 'PROCESS', prompt: '2,5 외 소인수는? 약분으로 없애려면 $a$ 가?', options: [
        { key: 'A', text: '$3$ 의 배수 (분모의 $3$ 제거)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2$ 의 배수', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$3$ 제거 못함' },
        { key: 'C', text: '$5$ 의 배수', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$3$ 제거 못함' },
        { key: 'D', text: '$6$ 의 배수', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '필요 이상' },
        { key: 'E', text: '$30$ 의 배수', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '필요 이상' },
      ] },
      { stepType: 'ANSWER', prompt: '결론은?', options: [
        { key: 'A', text: '$3$ 의 배수', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2$ 의 배수', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$3$ 안 약분' },
        { key: 'C', text: '$5$ 의 배수', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$3$ 안 약분' },
        { key: 'D', text: '$30$ 의 배수', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '필요 이상' },
        { key: 'E', text: '어떤 자연수든 OK', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$1/30$ 순환' },
      ] },
    ], solution: '$30 = 2 \\cdot 3 \\cdot 5$ — 2,5 외 $3$ 있음. 분자가 $3$ 의 배수면 약분으로 분모에 $2, 5$ 만 남음 → 유한.' },
];

export const K_G8_MATH2_CH01_RATIONAL_REPEAT_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
