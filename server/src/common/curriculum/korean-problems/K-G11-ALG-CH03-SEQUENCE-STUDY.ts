/**
 * K-G11-ALG-CH03-SEQUENCE — STUDY pool (single-step, 20문제).
 * 수열 — 등차·등비, 일반항, 합 공식, 시그마, 점화식.
 * Mastery 3-step과 별도 변형 문제. 고2 대수 (G11).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5. LLM 미사용.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G11-ALG-CH03-SEQUENCE';
const SKILLS_AP_D = ['arithmetic_common_difference'];
const SKILLS_AP_TERM = ['arithmetic_general_term'];
const SKILLS_AP_SUM = ['arithmetic_sum_formula'];
const SKILLS_GP_R = ['geometric_common_ratio'];
const SKILLS_GP_TERM = ['geometric_general_term'];
const SKILLS_GP_SUM = ['geometric_sum_formula'];
const SKILLS_SIGMA_K = ['sigma_k_formula'];
const SKILLS_SIGMA_K2 = ['sigma_k_squared_formula'];
const SKILLS_SIGMA_K3 = ['sigma_k_cubed_formula'];
const SKILLS_SIGMA = ['sigma_linearity'];
const SKILLS_SIGMA_CONST = ['sigma_constant'];
const SKILLS_RECURRENCE = ['recurrence_relation'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) 공차 음수
  { chapterCode: CODE, difficulty: 'easy', concept: '공차 (음수)', requiredSkills: SKILLS_AP_D,
    stem: '등차수열 $10, 7, 4, 1, \\ldots$ 의 공차 $d$?',
    options: [
      { key: 'A', text: '$-3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'C', text: '$7$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '둘째 항' },
      { key: 'D', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$-7$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 차' },
    ],
    solution: '$d = a_{n+1} - a_n = 7 - 10 = -3$.' },

  // S2 (쉬움) 일반항
  { chapterCode: CODE, difficulty: 'easy', concept: '등차 일반항 ($a_1=1, d=3$)', requiredSkills: SKILLS_AP_TERM,
    stem: '등차수열 $1, 4, 7, 10, \\ldots$ 의 일반항 $a_n$?',
    options: [
      { key: 'A', text: '$a_n = 3n - 2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$a_n = 3n$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$a_1 = 3$ 잘못' },
      { key: 'C', text: '$a_n = n + 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$d$ 잘못' },
      { key: 'D', text: '$a_n = 3n + 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '상수 부호 잘못' },
      { key: 'E', text: '$a_n = n + 1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '$a_n = a_1 + (n - 1)d = 1 + 3(n - 1) = 3n - 2$.' },

  // S3 (쉬움) 특정 항
  { chapterCode: CODE, difficulty: 'easy', concept: '$a_8$ (짝수열)', requiredSkills: SKILLS_AP_TERM,
    stem: '등차수열 $2, 4, 6, \\ldots$ 의 $a_8$?',
    options: [
      { key: 'A', text: '$16$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$14$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$a_7$' },
      { key: 'C', text: '$18$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$a_9$' },
      { key: 'D', text: '$8$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$n$ 자체' },
      { key: 'E', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$a_1$' },
    ],
    solution: '$a_n = 2n$. $a_8 = 16$.' },

  // S4 (쉬움) 공비
  { chapterCode: CODE, difficulty: 'easy', concept: '공비 ($r = 2$)', requiredSkills: SKILLS_GP_R,
    stem: '등비수열 $3, 6, 12, 24, \\ldots$ 의 공비 $r$?',
    options: [
      { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$a_1$' },
      { key: 'C', text: '$6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$a_2$' },
      { key: 'D', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '뒤집음' },
      { key: 'E', text: '$4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$6/3$ 잘못' },
    ],
    solution: '$r = a_{n+1} / a_n = 6/3 = 2$.' },

  // S5 (쉬움) ∑k 공식
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\sum k$ 공식', requiredSkills: SKILLS_SIGMA_K,
    stem: '$\\sum_{k=1}^{n} k = ?$',
    options: [
      { key: 'A', text: '$\\dfrac{n(n+1)}{2}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{n^2}{2}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$+1$ 누락' },
      { key: 'C', text: '$n^2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'D', text: '$n(n+1)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$/2$ 누락' },
      { key: 'E', text: '$\\dfrac{n(n+1)(2n+1)}{6}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sum k^2$' },
    ],
    solution: '가우스 공식: $\\sum_{k=1}^n k = \\dfrac{n(n+1)}{2}$.' },

  // S6 (쉬움) ∑k² 항 (계산)
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\sum k^2 (k=1, 2)$', requiredSkills: SKILLS_SIGMA_K2,
    stem: '$\\sum_{k=1}^{2} k^2 = ?$',
    options: [
      { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$k$ 자체 합' },
      { key: 'C', text: '$4$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$2^2$만' },
      { key: 'D', text: '$1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$1^2$만' },
      { key: 'E', text: '$9$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$(1+2)^2$' },
    ],
    solution: '$1^2 + 2^2 = 1 + 4 = 5$.' },

  // S7 (중) a₆
  { chapterCode: CODE, difficulty: 'medium', concept: '$a_6$ (5,8,11)', requiredSkills: SKILLS_AP_TERM,
    stem: '등차수열 $5, 8, 11, \\ldots$ 의 $a_6$?',
    options: [
      { key: 'A', text: '$20$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$17$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$a_5$' },
      { key: 'C', text: '$23$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$a_7$' },
      { key: 'D', text: '$18$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$a_1 + 5d$ 잘못' },
      { key: 'E', text: '$15$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$3 \\times 5$' },
    ],
    solution: '$a_n = 5 + 3(n-1) = 3n + 2$. $a_6 = 20$.' },

  // S8 (중) S₈
  { chapterCode: CODE, difficulty: 'medium', concept: '$S_8$ ($a_1=3, d=2$)', requiredSkills: SKILLS_AP_SUM,
    stem: '$a_1 = 3, d = 2$ 등차수열의 $S_8$?',
    options: [
      { key: 'A', text: '$80$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$72$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
      { key: 'C', text: '$60$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'D', text: '$120$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$/2$ 누락' },
      { key: 'E', text: '$48$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '$a_8 = 3 + 7 \\cdot 2 = 17$. $S_8 = 8(3 + 17)/2 = 80$.' },

  // S9 (중) 등비 a₄
  { chapterCode: CODE, difficulty: 'medium', concept: '등비 $a_4$ ($a_1=2, r=3$)', requiredSkills: SKILLS_GP_TERM,
    stem: '$a_1 = 2, r = 3$ 등비수열의 $a_4$?',
    options: [
      { key: 'A', text: '$54$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$18$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$a_3$' },
      { key: 'C', text: '$162$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$a_5$' },
      { key: 'D', text: '$24$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$a_1 \\cdot r \\cdot n$' },
      { key: 'E', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$a_2$' },
    ],
    solution: '$a_n = 2 \\cdot 3^{n-1}$. $a_4 = 2 \\cdot 27 = 54$.' },

  // S10 (중) 등비 합
  { chapterCode: CODE, difficulty: 'medium', concept: '$S_3$ ($a_1=2, r=3$)', requiredSkills: SKILLS_GP_SUM,
    stem: '$a_1 = 2, r = 3$ 등비수열의 $S_3$?',
    options: [
      { key: 'A', text: '$26$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$18$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$a_3$만' },
      { key: 'C', text: '$54$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$a_4$' },
      { key: 'D', text: '$8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'E', text: '$78$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3 \\cdot 26$' },
    ],
    solution: '$2 + 6 + 18 = 26$. 또는 $S_3 = 2 \\cdot (3^3 - 1)/(3 - 1) = 2 \\cdot 26/2 = 26$.' },

  // S11 (중) ∑k (1 to 20)
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\sum_{k=1}^{20} k$', requiredSkills: SKILLS_SIGMA_K,
    stem: '$\\sum_{k=1}^{20} k = ?$',
    options: [
      { key: 'A', text: '$210$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$200$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'C', text: '$220$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'D', text: '$110$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$1$에서 $10$' },
      { key: 'E', text: '$400$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$20^2$' },
    ],
    solution: '$20 \\cdot 21 / 2 = 210$.' },

  // S12 (중) ∑3k
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\sum 3k$', requiredSkills: SKILLS_SIGMA,
    stem: '$\\sum_{k=1}^{n} 3k = ?$',
    options: [
      { key: 'A', text: '$\\dfrac{3n(n+1)}{2}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3n$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '잘못' },
      { key: 'C', text: '$n(n+1)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\times 3$ 누락' },
      { key: 'D', text: '$\\dfrac{n(n+1)}{2}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\times 3$ 누락' },
      { key: 'E', text: '$3n^2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '$\\sum 3k = 3 \\sum k = 3 \\cdot \\dfrac{n(n+1)}{2}$.' },

  // S13 (중) ∑k³
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\sum k^3$ 공식', requiredSkills: SKILLS_SIGMA_K3,
    stem: '$\\sum_{k=1}^{n} k^3 = ?$',
    options: [
      { key: 'A', text: '$\\left[ \\dfrac{n(n+1)}{2} \\right]^2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{n^4}{4}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'C', text: '$\\dfrac{n(n+1)(2n+1)}{6}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sum k^2$' },
      { key: 'D', text: '$n(n+1)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$\\dfrac{n^2(n+1)}{2}$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '잘못된 식' },
    ],
    solution: '$\\sum k^3 = (\\sum k)^2 = \\left[ \\dfrac{n(n+1)}{2} \\right]^2$.' },

  // S14 (중) ∑k² (1 to 10)
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\sum k^2$ 계산', requiredSkills: SKILLS_SIGMA_K2,
    stem: '$\\sum_{k=1}^{10} k^2 = ?$',
    options: [
      { key: 'A', text: '$385$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$100$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$10^2$' },
      { key: 'C', text: '$55$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sum k$' },
      { key: 'D', text: '$1000$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$10^3$' },
      { key: 'E', text: '$210$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sum_{k=1}^{20} k$' },
    ],
    solution: '$\\dfrac{10 \\cdot 11 \\cdot 21}{6} = 385$.' },

  // S15 (중) ∑5
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\sum c$', requiredSkills: SKILLS_SIGMA_CONST,
    stem: '$\\sum_{k=1}^{n} 5 = ?$',
    options: [
      { key: 'A', text: '$5n$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$5$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$n$ 무시' },
      { key: 'C', text: '$\\dfrac{5n(n+1)}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sum 5k$' },
      { key: 'D', text: '$n$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$5$ 무시' },
      { key: 'E', text: '$5^n$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$\\sum_{k=1}^{n} c = cn$. → $5n$.' },

  // S16 (어려움) 연립 a₁, d
  { chapterCode: CODE, difficulty: 'hard', concept: '연립 → $a_1, d$', requiredSkills: SKILLS_AP_TERM,
    stem: '등차수열 $a_2 = 5, a_5 = 14$. $a_1, d$?',
    options: [
      { key: 'A', text: '$a_1 = 2, d = 3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$a_1 = 3, d = 2$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '바꿈' },
      { key: 'C', text: '$a_1 = 5, d = 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$a_2$ 자체' },
      { key: 'D', text: '$a_1 = 1, d = 4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'E', text: '$a_1 = 2, d = 4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '$a_5 - a_2 = 3d = 9 \\to d = 3$. $a_1 = a_2 - d = 2$.' },

  // S17 (어려움) S_n → d
  { chapterCode: CODE, difficulty: 'hard', concept: '$S_n$ 로 $d$', requiredSkills: SKILLS_AP_SUM,
    stem: '$a_1 = 2, S_5 = 40$ 등차수열. $d$?',
    options: [
      { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'C', text: '$4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'D', text: '$8$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$40/5$' },
      { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '$S_5 = 5(2a_1 + 4d)/2 = 5(2 + 2d) = 40 \\to 1 + d = 4 \\to d = 3$.' },

  // S18 (어려움) ∑(3k-1)
  { chapterCode: CODE, difficulty: 'hard', concept: '$\\sum (3k - 1)$', requiredSkills: SKILLS_SIGMA,
    stem: '$\\sum_{k=1}^{4} (3k - 1) = ?$',
    options: [
      { key: 'A', text: '$26$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$30$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '상수 누락' },
      { key: 'C', text: '$10$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\sum k$만' },
      { key: 'D', text: '$22$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'E', text: '$24$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '$2 + 5 + 8 + 11 = 26$. 또는 $3 \\sum k - \\sum 1 = 3 \\cdot 10 - 4 = 26$.' },

  // S19 (어려움) 점화식
  { chapterCode: CODE, difficulty: 'hard', concept: '점화식 등비', requiredSkills: SKILLS_RECURRENCE,
    stem: '$a_1 = 2, a_{n+1} = 2 a_n$. $a_5$?',
    options: [
      { key: 'A', text: '$32$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$16$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$a_4$' },
      { key: 'C', text: '$64$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$a_6$' },
      { key: 'D', text: '$10$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$2 \\cdot 5$' },
      { key: 'E', text: '$8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '$2, 4, 8, 16, 32$. $a_5 = 32$ (등비, $r = 2$).' },

  // S20 (어려움) 분수 등비 합
  { chapterCode: CODE, difficulty: 'hard', concept: '분수 등비 합', requiredSkills: SKILLS_GP_SUM,
    stem: '$a_1 = 1, r = \\dfrac{1}{3}$ 등비수열의 $S_3$?',
    options: [
      { key: 'A', text: '$\\dfrac{13}{9}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{1}{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '한 항' },
      { key: 'C', text: '$\\dfrac{4}{3}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$S_2$' },
      { key: 'D', text: '$\\dfrac{3}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '무한 등비 합' },
      { key: 'E', text: '$\\dfrac{27}{13}$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '뒤집음' },
    ],
    solution: '$1 + \\dfrac{1}{3} + \\dfrac{1}{9} = \\dfrac{9 + 3 + 1}{9} = \\dfrac{13}{9}$.' },
];

export const K_G11_ALG_CH03_SEQUENCE_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
