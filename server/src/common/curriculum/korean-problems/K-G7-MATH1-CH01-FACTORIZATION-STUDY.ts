/**
 * K-G7-MATH1-CH01-FACTORIZATION — STUDY pool (single-step, 20문제).
 *
 * Mastery 3-step pool과 별도. 사용자가 Mastery에서 마스터한 챕터를 Study 탭에서
 * 선택하면 이 풀에서 single-step 문제 풀이 (body + 연습장 + 5지선다).
 *
 * 2026-05-28 사용자 spec:
 *   - 난이도: 쉬움 6 / 중간 9 / 어려움 5
 *   - 각 문제 5지선다, 오답 4개에 errorCode + rationale
 *   - Mastery와 다른 식·숫자 (Study는 Mastery 클리어 후 변형 문제 풀이)
 *   - LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G7-MATH1-CH01-FACTORIZATION';
const SKILLS_FACTOR = ['prime_factorization', 'composite_decomposition'];
const SKILLS_DIVISORS = ['divisor_counting_formula', 'exponent_plus_one'];
const SKILLS_PRIME = ['prime_detection', 'prime_definition'];
const SKILLS_GCD = ['gcd_via_factorization', 'common_factor_minimum'];
const SKILLS_LCM = ['lcm_via_factorization', 'common_multiple_maximum'];
const SKILLS_APPLY = ['gcd_application', 'lcm_application', 'word_problem'];
const SKILLS_SQUARE = ['perfect_square', 'exponent_parity'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) 99의 소인수분해
  { chapterCode: CODE, difficulty: 'easy', concept: '두 자리 수의 소인수분해', requiredSkills: SKILLS_FACTOR,
    stem: '$99$를 소인수분해하면?',
    options: [
      { key: 'A', text: '$3^2 \\times 11$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$9 \\times 11$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$9$는 소수가 아님' },
      { key: 'C', text: '$3 \\times 33$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$33$은 합성수' },
      { key: 'D', text: '$3 \\times 11$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3 \\times 11 = 33 \\neq 99$' },
      { key: 'E', text: '$3^3 \\times 11$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$27 \\times 11 = 297$' },
    ],
    solution: '$99 = 9 \\times 11 = 3^2 \\times 11$.' },

  // S2 (쉬움) 144의 소인수분해
  { chapterCode: CODE, difficulty: 'easy', concept: '소인수분해 - 거듭제곱 표기', requiredSkills: SKILLS_FACTOR,
    stem: '$144$를 소인수분해하면?',
    options: [
      { key: 'A', text: '$2^4 \\times 3^2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$2^3 \\times 3^2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$8 \\times 9 = 72 \\neq 144$' },
      { key: 'C', text: '$2^4 \\times 3^3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$16 \\times 27 = 432$' },
      { key: 'D', text: '$12^2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$12$는 소수 아님 — 소인수분해 형태 아님' },
      { key: 'E', text: '$2^5 \\times 3$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$32 \\times 3 = 96$' },
    ],
    solution: '$144 = 12^2 = (2^2 \\times 3)^2 = 2^4 \\times 3^2$.' },

  // S3 (쉬움) 소수 판별
  { chapterCode: CODE, difficulty: 'easy', concept: '소수 판별', requiredSkills: SKILLS_PRIME,
    stem: '다음 중 소수인 것은?',
    options: [
      { key: 'A', text: '$19$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$21$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$21 = 3 \\times 7$' },
      { key: 'C', text: '$25$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$25 = 5^2$' },
      { key: 'D', text: '$27$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$27 = 3^3$' },
      { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$1$은 소수에서 제외됨' },
    ],
    solution: '$19$는 $1$과 자기 자신 외 약수가 없는 소수.' },

  // S4 (쉬움) 50의 약수의 개수
  { chapterCode: CODE, difficulty: 'easy', concept: '약수의 개수 공식 적용', requiredSkills: SKILLS_DIVISORS,
    stem: '$50$의 양의 약수의 개수는?',
    options: [
      { key: 'A', text: '$6$개', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$4$개', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$50 = 2 \\times 5^2$, $(1+1)(2+1)=6$' },
      { key: 'C', text: '$5$개', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$1 + 2 + 2 = 5$로 합산' },
      { key: 'D', text: '$3$개', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$2$의 지수 누락' },
      { key: 'E', text: '$25$개', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$50 / 2$로 오해' },
    ],
    solution: '$50 = 2 \\times 5^2$. 약수 개수 $= (1+1)(2+1) = 6$. 약수: $1,2,5,10,25,50$.' },

  // S5 (쉬움) 합성수 판별
  { chapterCode: CODE, difficulty: 'easy', concept: '합성수 판별', requiredSkills: SKILLS_PRIME,
    stem: '다음 중 합성수가 아닌 것은?',
    options: [
      { key: 'A', text: '$23$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$33$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$33 = 3 \\times 11$' },
      { key: 'C', text: '$35$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$35 = 5 \\times 7$' },
      { key: 'D', text: '$49$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$49 = 7^2$' },
      { key: 'E', text: '$51$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$51 = 3 \\times 17$' },
    ],
    solution: '$23$만 소수 (약수 $1, 23$ 뿐). 나머지는 모두 두 개 이상의 소수의 곱.' },

  // S6 (쉬움) 78의 소인수분해
  { chapterCode: CODE, difficulty: 'easy', concept: '서로 다른 세 소인수', requiredSkills: SKILLS_FACTOR,
    stem: '$78$을 소인수분해하면?',
    options: [
      { key: 'A', text: '$2 \\times 3 \\times 13$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$2 \\times 39$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$39$는 합성수' },
      { key: 'C', text: '$6 \\times 13$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$6$은 소수 아님' },
      { key: 'D', text: '$3 \\times 26$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$26$은 합성수' },
      { key: 'E', text: '$2 \\times 3 \\times 11$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2 \\times 3 \\times 11 = 66 \\neq 78$' },
    ],
    solution: '$78 = 2 \\times 39 = 2 \\times 3 \\times 13$.' },

  // S7 (중) 200의 약수의 개수
  { chapterCode: CODE, difficulty: 'medium', concept: '약수의 개수 (지수 + 1 곱셈)', requiredSkills: SKILLS_DIVISORS,
    stem: '$200$의 양의 약수의 개수는?',
    options: [
      { key: 'A', text: '$12$개', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$6$개', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3+2+1=6$ 합으로 처리' },
      { key: 'C', text: '$10$개', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$(3)(2)+1+1$ 등 잘못된 조합' },
      { key: 'D', text: '$24$개', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$4 \\times 3 \\times 2 = 24$ — 지수 잘못' },
      { key: 'E', text: '$8$개', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$5^2$ 지수 누락' },
    ],
    solution: '$200 = 2^3 \\times 5^2$. 약수 $= (3+1)(2+1) = 4 \\times 3 = 12$개.' },

  // S8 (중) 96의 소인수분해
  { chapterCode: CODE, difficulty: 'medium', concept: '큰 지수 소인수분해', requiredSkills: SKILLS_FACTOR,
    stem: '$96$을 소인수분해하면?',
    options: [
      { key: 'A', text: '$2^5 \\times 3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$2^4 \\times 6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$6$은 합성수' },
      { key: 'C', text: '$2^4 \\times 3^2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$16 \\times 9 = 144 \\neq 96$' },
      { key: 'D', text: '$2^6 \\times 3$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$64 \\times 3 = 192$' },
      { key: 'E', text: '$2^3 \\times 12$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$12$는 합성수' },
    ],
    solution: '$96 = 2 \\times 48 = 2^2 \\times 24 = ... = 2^5 \\times 3$. 검산: $32 \\times 3 = 96$.' },

  // S9 (중) GCD(20, 30)
  { chapterCode: CODE, difficulty: 'medium', concept: '최대공약수 (소인수분해 이용)', requiredSkills: SKILLS_GCD,
    stem: '$20$과 $30$의 최대공약수는?',
    options: [
      { key: 'A', text: '$10$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$5$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$2$ 공통 인수 누락' },
      { key: 'C', text: '$2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$5$ 공통 인수 누락' },
      { key: 'D', text: '$60$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '최소공배수를 답함' },
      { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '서로소가 아님' },
    ],
    solution: '$20 = 2^2 \\times 5,\\ 30 = 2 \\times 3 \\times 5$. 공통 소인수 작은 지수 → $2 \\times 5 = 10$.' },

  // S10 (중) LCM(8, 12)
  { chapterCode: CODE, difficulty: 'medium', concept: '최소공배수 (소인수분해 이용)', requiredSkills: SKILLS_LCM,
    stem: '$8$과 $12$의 최소공배수는?',
    options: [
      { key: 'A', text: '$24$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$96$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$8 \\times 12 = 96$ (최소공배수 ≠ 두 수의 곱)' },
      { key: 'C', text: '$4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '최대공약수를 답함' },
      { key: 'D', text: '$48$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$2^4 \\times 3$ — 지수 잘못' },
      { key: 'E', text: '$12$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$8$이 $12$의 배수가 아님' },
    ],
    solution: '$8 = 2^3,\\ 12 = 2^2 \\times 3$. 공통+비공통 큰 지수 → $2^3 \\times 3 = 24$.' },

  // S11 (중) 약수 개수 (세 소인수)
  { chapterCode: CODE, difficulty: 'medium', concept: '약수 개수 (세 소인수)', requiredSkills: SKILLS_DIVISORS,
    stem: '$N = 2^4 \\times 3 \\times 7$의 양의 약수의 개수는?',
    options: [
      { key: 'A', text: '$20$개', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$12$개', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$7$ 지수 처리 누락' },
      { key: 'C', text: '$6$개', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$4+1+1 = 6$ 합으로 처리' },
      { key: 'D', text: '$4$개', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '소인수 개수만' },
      { key: 'E', text: '$8$개', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2^3$의 약수 개수만' },
    ],
    solution: '$(4+1)(1+1)(1+1) = 5 \\times 2 \\times 2 = 20$개.' },

  // S12 (중) GCD(40, 56)
  { chapterCode: CODE, difficulty: 'medium', concept: '최대공약수 (공통 소인수)', requiredSkills: SKILLS_GCD,
    stem: '$40$과 $56$의 최대공약수는?',
    options: [
      { key: 'A', text: '$8$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$2^3$ 지수까지 안 봄' },
      { key: 'C', text: '$4$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$2^2$만 — 지수 1 부족' },
      { key: 'D', text: '$280$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '최소공배수를 답함' },
      { key: 'E', text: '$16$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$2^4$ — $40$에 없음' },
    ],
    solution: '$40 = 2^3 \\times 5,\\ 56 = 2^3 \\times 7$. 공통 → $2^3 = 8$.' },

  // S13 (중) LCM(9, 12)
  { chapterCode: CODE, difficulty: 'medium', concept: '최소공배수 (다른 소인수)', requiredSkills: SKILLS_LCM,
    stem: '$9$와 $12$의 최소공배수는?',
    options: [
      { key: 'A', text: '$36$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '최대공약수를 답함' },
      { key: 'C', text: '$108$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$9 \\times 12 = 108$ (최소공배수 ≠ 곱)' },
      { key: 'D', text: '$72$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$2^3 \\times 3^2$ — 지수 잘못' },
      { key: 'E', text: '$18$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$2 \\times 3^2$ — $2$ 지수 부족' },
    ],
    solution: '$9 = 3^2,\\ 12 = 2^2 \\times 3$. 큰 지수 → $2^2 \\times 3^2 = 36$.' },

  // S14 (중) 공약수 개수
  { chapterCode: CODE, difficulty: 'medium', concept: '공약수의 개수 = 최대공약수의 약수 개수', requiredSkills: SKILLS_GCD,
    stem: '$24$와 $36$의 공약수의 개수는?',
    options: [
      { key: 'A', text: '$6$개', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$1$개', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '최대공약수 값 자체를 개수로 오해' },
      { key: 'C', text: '$12$개', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '최대공약수를 답함' },
      { key: 'D', text: '$4$개', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '최대공약수의 약수 일부만 셈' },
      { key: 'E', text: '$8$개', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$24$의 약수 개수로 오해' },
    ],
    solution: '공약수 $=$ 최대공약수의 약수. $24$와 $36$의 최대공약수 $= 12 = 2^2 \\times 3$. 약수 $= (2+1)(1+1)=6$개 ($1,2,3,4,6,12$).' },

  // S15 (중) GCD × LCM = a × b
  { chapterCode: CODE, difficulty: 'medium', concept: '최대공약수·최소공배수 관계식 (곱셈 방향)', requiredSkills: SKILLS_GCD,
    stem: '두 자연수 $a, b$의 최대공약수가 $4$, 최소공배수가 $24$일 때 $a \\times b$의 값은?',
    options: [
      { key: 'A', text: '$96$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$28$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$4 + 24 = 28$ 합으로 처리' },
      { key: 'C', text: '$20$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$24 - 4$로 처리' },
      { key: 'D', text: '$6$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$24 \\div 4 = 6$ — 잘못된 관계' },
      { key: 'E', text: '$48$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$4 \\times 12$ 같은 잘못된 곱' },
    ],
    solution: '관계식 $a \\times b = (\\text{최대공약수}) \\times (\\text{최소공배수}) = 4 \\times 24 = 96$.' },

  // S16 (어려움) GCD/LCM 한 수 찾기
  { chapterCode: CODE, difficulty: 'hard', concept: '최대공약수·최소공배수 관계식 응용', requiredSkills: SKILLS_GCD,
    stem: '두 자연수의 최대공약수가 $8$, 최소공배수가 $120$이고 한 수가 $24$일 때, 다른 한 수는?',
    options: [
      { key: 'A', text: '$40$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$48$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$24 \\times 2$ 등 잘못' },
      { key: 'C', text: '$15$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$120 / 8 = 15$ — 다른 수가 아님' },
      { key: 'D', text: '$32$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$24 + 8$ 같은 합' },
      { key: 'E', text: '$960$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$8 \\times 120$ — 다른 수가 아니라 곱' },
    ],
    solution: '$a \\times b = (\\text{최대공약수}) \\times (\\text{최소공배수}) = 8 \\times 120 = 960$. 다른 수 $= 960 / 24 = 40$. 검산: $24$와 $40$의 최대공약수 $=8$, 최소공배수 $=120$.' },

  // S17 (어려움) 제곱수 만들기
  { chapterCode: CODE, difficulty: 'hard', concept: '제곱수 만들기 (지수 짝수화)', requiredSkills: SKILLS_SQUARE,
    stem: '$24$에 어떤 자연수 $n$을 곱하여 제곱수가 되게 하려고 한다. 가장 작은 $n$은?',
    options: [
      { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$3$의 짝수화 누락' },
      { key: 'C', text: '$3$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$2^3$의 짝수화 누락' },
      { key: 'D', text: '$24$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '자기 자신을 곱하면 제곱수이지만 최소 아님' },
      { key: 'E', text: '$12$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$24 \\times 12 = 288 = 2^5 \\times 3^2$ — $2$ 지수 홀수' },
    ],
    solution: '$24 = 2^3 \\times 3^1$. 모든 지수를 짝수로 만들려면 $2 \\times 3 = 6$을 곱해 $2^4 \\times 3^2 = 144 = 12^2$.' },

  // S18 (어려움) 세 수의 GCD 활용
  { chapterCode: CODE, difficulty: 'hard', concept: '최대공약수 활용 (세 수 똑같이 나누기)', requiredSkills: SKILLS_APPLY,
    stem: '사과 $30$개, 귤 $45$개, 키위 $60$개를 남김없이 똑같이 나누어 줄 수 있는 학생의 최대 인원은?',
    options: [
      { key: 'A', text: '$15$명', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$5$명', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$3$ 공통 인수 누락' },
      { key: 'C', text: '$30$명', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가장 작은 수' },
      { key: 'D', text: '$3$명', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$5$ 공통 인수 누락' },
      { key: 'E', text: '$180$명', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '최소공배수($=180$)를 답함' },
    ],
    solution: '$30 = 2 \\times 3 \\times 5,\\ 45 = 3^2 \\times 5,\\ 60 = 2^2 \\times 3 \\times 5$. 공통 → $3 \\times 5 = 15$명.' },

  // S19 (어려움) 톱니바퀴 LCM
  { chapterCode: CODE, difficulty: 'hard', concept: '최소공배수 활용 (회전 주기)', requiredSkills: SKILLS_APPLY,
    stem: '톱니가 각각 $15$개, $20$개인 두 톱니바퀴 $A, B$가 맞물려 돌고 있다. 처음 맞물렸던 톱니가 다시 같은 자리에서 맞물리려면 $A$는 최소 몇 바퀴 돌아야 하는가?',
    options: [
      { key: 'A', text: '$4$바퀴', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3$바퀴', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$B$의 회전수 ($60/20=3$)' },
      { key: 'C', text: '$5$바퀴', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '최대공약수($=5$) 사용' },
      { key: 'D', text: '$60$바퀴', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '최소공배수를 회전수로 직접 답함' },
      { key: 'E', text: '$300$바퀴', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$15 \\times 20 = 300$ (최소공배수 ≠ 곱)' },
    ],
    solution: '맞물린 톱니 수 $=$ $15$와 $20$의 최소공배수 $= 60$. $A$의 회전수 $= 60 / 15 = 4$바퀴.' },

  // S20 (어려움) 나머지가 있는 GCD
  { chapterCode: CODE, difficulty: 'hard', concept: '최대공약수 활용 (나머지 처리)', requiredSkills: SKILLS_APPLY,
    stem: '어떤 자연수로 $75$를 나누면 $3$이 남고, $100$을 나누면 $4$가 남는다. 이런 자연수 중 가장 큰 수는?',
    options: [
      { key: 'A', text: '$24$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$25$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$75$만 보고 최대공약수 계산' },
      { key: 'C', text: '$7$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$3 + 4 = 7$ 같은 무관한 합' },
      { key: 'D', text: '$72$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$75 - 3 = 72$만 봄' },
      { key: 'E', text: '$96$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$100 - 4 = 96$만 봄' },
    ],
    solution: '$75$를 나누면 $3$ 남음 → $75 - 3 = 72$를 나누어떨어지게 함. $100 - 4 = 96$도 마찬가지. 답 $=$ $72$와 $96$의 최대공약수 $= 24$ (단, 나머지보다 커야 하므로 $> 4$, $24$ 적합).' },
];

export const K_G7_MATH1_CH01_FACTORIZATION_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
