/**
 * K-G11-STAT-CH01-COUNTING-ADV — STUDY pool (single-step, 20문제).
 * 경우의 수 심화 — 중복순열/중복조합, 이항정리, 파스칼 항등식.
 * Mastery 3-step과 별도 변형 문제. 고2 확률과 통계 (G11).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5. LLM 미사용.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G11-STAT-CH01-COUNTING-ADV';
const SKILLS_PERM_REP = ['permutation_with_repetition'];
const SKILLS_COMB_REP = ['combination_with_repetition'];
const SKILLS_BINOMIAL = ['binomial_expansion'];
const SKILLS_BINOM_COEF = ['binomial_coefficient'];
const SKILLS_PASCAL = ['pascal_identity'];
const SKILLS_INT_SOL = ['nonneg_integer_solutions'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) 중복순열 의미
  { chapterCode: CODE, difficulty: 'easy', concept: '$_n\\Pi_r$ 의미', requiredSkills: SKILLS_PERM_REP,
    stem: '중복순열 $_n\\Pi_r$ 이 세는 것?',
    options: [
      { key: 'A', text: '$n$ 개에서 $r$ 개 (중복 허용, 순서 구분)', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$n$ 개에서 $r$ 개 (중복 불허, 순서 구분)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '일반 순열' },
      { key: 'C', text: '$n$ 개에서 $r$ 개 (중복 허용, 순서 무관)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '중복조합' },
      { key: 'D', text: '$n$ 개에서 $r$ 개 (중복 불허, 순서 무관)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '일반 조합' },
      { key: 'E', text: '$n$ 개를 모두 배열', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '중복순열 = 중복 허용 + 순서 구분. $_n\\Pi_r = n^r$.' },

  // S2 (쉬움) ₃Π₂
  { chapterCode: CODE, difficulty: 'easy', concept: '$_3\\Pi_2$', requiredSkills: SKILLS_PERM_REP,
    stem: '$_3\\Pi_2 = ?$',
    options: [
      { key: 'A', text: '$9$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$_3P_2$' },
      { key: 'C', text: '$8$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$2^3$' },
      { key: 'D', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$_3C_1$' },
      { key: 'E', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$n + r$' },
    ],
    solution: '$_3\\Pi_2 = 3^2 = 9$.' },

  // S3 (쉬움) ₙHᵣ 의미
  { chapterCode: CODE, difficulty: 'easy', concept: '$_nH_r$ 의미', requiredSkills: SKILLS_COMB_REP,
    stem: '중복조합 $_nH_r$ 이 세는 것?',
    options: [
      { key: 'A', text: '$n$ 개에서 $r$ 개 (중복 허용, 순서 무관)', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$n$ 개에서 $r$ 개 (중복 불허, 순서 구분)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '일반 순열' },
      { key: 'C', text: '$n$ 개에서 $r$ 개 (중복 허용, 순서 구분)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '중복순열' },
      { key: 'D', text: '$n$ 개에서 $r$ 개 (중복 불허, 순서 무관)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '일반 조합' },
      { key: 'E', text: '$n + r$ 개 배열', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '중복조합 = 중복 허용 + 순서 무관. $_nH_r = {}_{n+r-1}C_r$.' },

  // S4 (쉬움) (a-b)²
  { chapterCode: CODE, difficulty: 'easy', concept: '$(a - b)^2$', requiredSkills: SKILLS_BINOMIAL,
    stem: '$(a - b)^2 = ?$',
    options: [
      { key: 'A', text: '$a^2 - 2ab + b^2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$a^2 + 2ab + b^2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'C', text: '$a^2 - b^2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$(a-b)(a+b)$' },
      { key: 'D', text: '$a^2 - 2ab - b^2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$b^2$ 부호' },
      { key: 'E', text: '$a^2 + b^2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '중간항 누락' },
    ],
    solution: '$(a - b)^2 = a^2 - 2ab + b^2$.' },

  // S5 (쉬움) (a+b)² ab 계수
  { chapterCode: CODE, difficulty: 'easy', concept: '$(a + b)^2$ 의 $ab$ 계수', requiredSkills: SKILLS_BINOM_COEF,
    stem: '$(a + b)^2$ 전개에서 $ab$ 의 계수?',
    options: [
      { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$_2C_0$' },
      { key: 'C', text: '$4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'D', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$(a+b)^3$' },
      { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$(a + b)^2 = a^2 + 2ab + b^2$. $ab$ 계수 $= _2C_1 = 2$.' },

  // S6 (쉬움) ₄C₂
  { chapterCode: CODE, difficulty: 'easy', concept: '$_4C_2$', requiredSkills: SKILLS_BINOM_COEF,
    stem: '$_4C_2 = ?$',
    options: [
      { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$8$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$2^3$' },
      { key: 'C', text: '$12$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$_4P_2$' },
      { key: 'D', text: '$4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'E', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$_4C_2 = \\dfrac{4!}{2! \\cdot 2!} = \\dfrac{24}{4} = 6$.' },

  // S7 (중) 주사위 3번
  { chapterCode: CODE, difficulty: 'medium', concept: '주사위 3번 경우의 수', requiredSkills: SKILLS_PERM_REP,
    stem: '주사위를 $3$ 번 던질 때 경우의 수?',
    options: [
      { key: 'A', text: '$216$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$18$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$6 \\cdot 3$' },
      { key: 'C', text: '$120$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$_6P_3$' },
      { key: 'D', text: '$8$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '동전' },
      { key: 'E', text: '$729$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3^6$' },
    ],
    solution: '$_6\\Pi_3 = 6^3 = 216$.' },

  // S8 (중) ₂H₃
  { chapterCode: CODE, difficulty: 'medium', concept: '$_2H_3$', requiredSkills: SKILLS_COMB_REP,
    stem: '$2$ 종 사탕에서 $3$ 개 선택 (중복 허용)?',
    options: [
      { key: 'A', text: '$4$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'C', text: '$8$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$_2\\Pi_3$' },
      { key: 'D', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$n$' },
      { key: 'E', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$_2H_3 = {}_4C_3 = 4$. (구성: 3,0/2,1/1,2/0,3 → 4가지)' },

  // S9 (중) (x+1)⁵ x² 계수
  { chapterCode: CODE, difficulty: 'medium', concept: '$(x + 1)^5$ 의 $x^2$ 계수', requiredSkills: SKILLS_BINOM_COEF,
    stem: '$(x + 1)^5$ 의 $x^2$ 계수?',
    options: [
      { key: 'A', text: '$10$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$_5C_1$' },
      { key: 'C', text: '$20$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$_6C_3$' },
      { key: 'D', text: '$15$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'E', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$_5C_2 = 10$.' },

  // S10 (중) (3x+1)² x 계수
  { chapterCode: CODE, difficulty: 'medium', concept: '$(3x + 1)^2$ 의 $x$ 계수', requiredSkills: SKILLS_BINOM_COEF,
    stem: '$(3x + 1)^2$ 의 $x$ 계수?',
    options: [
      { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$_2C_1$ 누락' },
      { key: 'C', text: '$2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$3$ 누락' },
      { key: 'D', text: '$9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x^2$ 계수' },
      { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$_2C_1 \\cdot 3^1 \\cdot 1^1 = 2 \\cdot 3 = 6$.' },

  // S11 (중) (a+b)ⁿ 항의 수
  { chapterCode: CODE, difficulty: 'medium', concept: '$(a + b)^n$ 항의 수', requiredSkills: SKILLS_BINOMIAL,
    stem: '$(a + b)^n$ ($n \\geq 1$) 전개의 항의 수?',
    options: [
      { key: 'A', text: '$n + 1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$n$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$+ 1$ 누락' },
      { key: 'C', text: '$2n$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$2^n$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '계수 합' },
      { key: 'E', text: '$n^2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '항은 $a^{n-k} b^k$ ($k = 0, 1, ..., n$) → 총 $n + 1$ 개.' },

  // S12 (중) {1,2,3} 3자리
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\{1, 2, 3\\}$ 세 자리 (중복 허용)', requiredSkills: SKILLS_PERM_REP,
    stem: '$\\{1, 2, 3\\}$ 로 만드는 세 자리 자연수의 수 (중복 허용)?',
    options: [
      { key: 'A', text: '$27$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$_3P_3$' },
      { key: 'C', text: '$9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '두 자리' },
      { key: 'D', text: '$10$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$_3H_3$' },
      { key: 'E', text: '$18$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '첫째 0 제외 (해당없음)' },
    ],
    solution: '$_3\\Pi_3 = 3^3 = 27$. ($0$ 미포함이므로 첫 자리 제한 없음.)' },

  // S13 (중) 사과 4개 2명 분배
  { chapterCode: CODE, difficulty: 'medium', concept: '같은 물건 분배', requiredSkills: SKILLS_COMB_REP,
    stem: '같은 사과 $4$ 개를 두 사람에게 분배 (각 $0 \\sim 4$)?',
    options: [
      { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$10$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$_2H_4$ 잘못' },
      { key: 'C', text: '$4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$16$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$2^4$' },
      { key: 'E', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '$_2H_4 = {}_5C_4 = 5$. ($0|4, 1|3, 2|2, 3|1, 4|0$ → 5가지)' },

  // S14 (중) ₃Π₂ vs ₃P₂ vs ₃H₂
  { chapterCode: CODE, difficulty: 'medium', concept: '$_3\\Pi_2$ vs 비교', requiredSkills: SKILLS_PERM_REP,
    stem: '$_3\\Pi_2 = 9$. 같은 상황에서 중복 불허 순서구분 $_3P_2 = ?$',
    options: [
      { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '같은 값' },
      { key: 'C', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$_3C_2$' },
      { key: 'D', text: '$12$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'E', text: '$4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$_3P_2 = 3 \\cdot 2 = 6$.' },

  // S15 (중) 파스칼 ₅C₂ + ₅C₃
  { chapterCode: CODE, difficulty: 'medium', concept: '파스칼 항등식', requiredSkills: SKILLS_PASCAL,
    stem: '$_5C_2 + _5C_3 = ?$',
    options: [
      { key: 'A', text: '$_6C_3 = 20$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$_5C_5 = 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '지수 합' },
      { key: 'C', text: '$_{10}C_5 = 252$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$n$ 합' },
      { key: 'D', text: '$_6C_2 = 15$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$r$ 잘못' },
      { key: 'E', text: '$_5C_6 = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '파스칼: $_nC_r + _nC_{r+1} = _{n+1}C_{r+1}$. $_5C_2 + _5C_3 = _6C_3 = 20$.' },

  // S16 (어려움) (x+y)⁶ x²y⁴ 계수
  { chapterCode: CODE, difficulty: 'hard', concept: '$(x + y)^6$ 의 $x^2 y^4$ 계수', requiredSkills: SKILLS_BINOM_COEF,
    stem: '$(x + y)^6$ 의 $x^2 y^4$ 계수?',
    options: [
      { key: 'A', text: '$15$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$20$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$_6C_3$' },
      { key: 'C', text: '$6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$_6C_1$' },
      { key: 'D', text: '$30$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'E', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$_6C_2 = _6C_4 = 15$. (지수 합 $= 6$).' },

  // S17 (어려움) 조건부 선택+배열
  { chapterCode: CODE, difficulty: 'hard', concept: '모음 정확 1개', requiredSkills: SKILLS_COMB_REP,
    stem: '모음 $\\{A, E\\}$ 와 자음 $\\{B, C, D\\}$ 에서 $3$ 개를 골라 일렬 배열. 모음이 정확히 $1$ 개?',
    options: [
      { key: 'A', text: '$36$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$12$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '배열 누락' },
      { key: 'C', text: '$60$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$_5P_3$' },
      { key: 'D', text: '$6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$18$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '선택: $_2C_1 \\cdot _3C_2 = 2 \\cdot 3 = 6$. 배열: $3! = 6$. 합: $36$.' },

  // S18 (어려움) (1+x)⁸ x² 계수
  { chapterCode: CODE, difficulty: 'hard', concept: '$(1 + x)^8$ 의 $x^2$ 계수', requiredSkills: SKILLS_BINOM_COEF,
    stem: '$(1 + x)^8$ 의 $x^2$ 계수?',
    options: [
      { key: 'A', text: '$28$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$8$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$_8C_1$' },
      { key: 'C', text: '$56$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$_8C_3$' },
      { key: 'D', text: '$16$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'E', text: '$70$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$_8C_4$' },
    ],
    solution: '$_8C_2 = \\dfrac{8 \\cdot 7}{2} = 28$.' },

  // S19 (어려움) 사탕 5개 3명
  { chapterCode: CODE, difficulty: 'hard', concept: '사탕 분배 (3명)', requiredSkills: SKILLS_COMB_REP,
    stem: '같은 사탕 $5$ 개를 $3$ 명에 나눠줌 (각 $0 \\sim 5$)?',
    options: [
      { key: 'A', text: '$21$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$15$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$_3H_4$' },
      { key: 'C', text: '$125$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$5^3$' },
      { key: 'D', text: '$10$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$_5C_3$' },
      { key: 'E', text: '$35$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$_7C_4$' },
    ],
    solution: '$_3H_5 = {}_7C_5 = 21$.' },

  // S20 (어려움) x₁+x₂+x₃=4 정수해
  { chapterCode: CODE, difficulty: 'hard', concept: '음 아닌 정수해', requiredSkills: SKILLS_INT_SOL,
    stem: '$x_1 + x_2 + x_3 = 4$ ($x_i \\geq 0$ 정수) 의 해 개수?',
    options: [
      { key: 'A', text: '$15$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$10$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$_3H_4$ 잘못' },
      { key: 'C', text: '$21$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$_3H_5$' },
      { key: 'D', text: '$12$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'E', text: '$6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$_4C_2$' },
    ],
    solution: '$_3H_4 = {}_6C_4 = 15$.' },
];

export const K_G11_STAT_CH01_COUNTING_ADV_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
