/**
 * K-G10-CS1-CH03-COUNTING — STUDY pool (single-step, 20문제).
 * 경우의 수 — 합·곱의 법칙, 순열·조합, 원순열, 같은 것이 있는 순열.
 * Mastery 3-step과 별도 변형 문제. 고1 공통수학1 (G10).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5. LLM 미사용.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G10-CS1-CH03-COUNTING';
const SKILLS_FACT = ['factorial', 'n_factorial_compute'];
const SKILLS_PERM = ['permutation', 'nPr_formula'];
const SKILLS_COMB = ['combination', 'nCr_formula'];
const SKILLS_PROD = ['multiplication_principle'];
const SKILLS_SUM = ['addition_principle', 'mutually_exclusive'];
const SKILLS_COND = ['fixed_position_permutation', 'adjacent_grouping'];
const SKILLS_REPEAT = ['multinomial_arrangement', 'identical_letters'];
const SKILLS_CIRC = ['circular_permutation'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) 4!
  { chapterCode: CODE, difficulty: 'easy', concept: '$4!$', requiredSkills: SKILLS_FACT,
    stem: '$4! = ?$',
    options: [
      { key: 'A', text: '$24$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$12$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$4 \\times 3$만' },
      { key: 'C', text: '$10$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$4 + 3 + 2 + 1$ 합' },
      { key: 'D', text: '$16$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$4^2$ 잘못' },
      { key: 'E', text: '$4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$n$ 자체' },
    ],
    solution: '$4! = 4 \\times 3 \\times 2 \\times 1 = 24$.' },

  // S2 (쉬움) 6!
  { chapterCode: CODE, difficulty: 'easy', concept: '$6!$', requiredSkills: SKILLS_FACT,
    stem: '$6! = ?$',
    options: [
      { key: 'A', text: '$720$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$360$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$6!/2$ 잘못' },
      { key: 'C', text: '$120$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$5!$' },
      { key: 'D', text: '$36$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$6^2$' },
      { key: 'E', text: '$21$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$1+2+...+6$' },
    ],
    solution: '$6! = 6 \\times 120 = 720$.' },

  // S3 (쉬움) ₄P₂
  { chapterCode: CODE, difficulty: 'easy', concept: '$_4P_2$', requiredSkills: SKILLS_PERM,
    stem: '$_4P_2 = ?$',
    options: [
      { key: 'A', text: '$12$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$_4C_2$ 답함' },
      { key: 'C', text: '$8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$4 \\times 2$ 잘못' },
      { key: 'D', text: '$24$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$4!$' },
      { key: 'E', text: '$16$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$4^2$' },
    ],
    solution: '$_4P_2 = 4 \\times 3 = 12$.' },

  // S4 (쉬움) ₄C₂
  { chapterCode: CODE, difficulty: 'easy', concept: '$_4C_2$', requiredSkills: SKILLS_COMB,
    stem: '$_4C_2 = ?$',
    options: [
      { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$12$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$_4P_2$ 답함' },
      { key: 'C', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$r$ 자체' },
      { key: 'D', text: '$8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
      { key: 'E', text: '$24$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$4!$' },
    ],
    solution: '$_4C_2 = \\dfrac{4 \\times 3}{2 \\times 1} = 6$.' },

  // S5 (쉬움) 곱의 법칙
  { chapterCode: CODE, difficulty: 'easy', concept: '곱의 법칙 (옷·모자)', requiredSkills: SKILLS_PROD,
    stem: '옷 $4$ 종, 모자 $3$ 종. 한 벌의 옷과 한 모자 조합?',
    options: [
      { key: 'A', text: '$12$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$7$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합의 법칙 잘못 적용' },
      { key: 'C', text: '$4$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '모자 무시' },
      { key: 'D', text: '$24$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2 \\times 12$ 잘못' },
      { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '관련 없음' },
    ],
    solution: '동시에 → 곱의 법칙: $4 \\times 3 = 12$.' },

  // S6 (쉬움) 합의 법칙
  { chapterCode: CODE, difficulty: 'easy', concept: '합의 법칙 (배반)', requiredSkills: SKILLS_SUM,
    stem: '간식으로 사과 $5$ 종 또는 귤 $4$ 종 중 하나를 선택. 방법의 수?',
    options: [
      { key: 'A', text: '$9$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$20$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱의 법칙' },
      { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '관련 없음' },
      { key: 'D', text: '$5$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '귤 무시' },
      { key: 'E', text: '$4$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '사과 무시' },
    ],
    solution: '둘 중 하나 (배반) → 합의 법칙: $5 + 4 = 9$.' },

  // S7 (중) ₇P₃
  { chapterCode: CODE, difficulty: 'medium', concept: '$_7P_3$', requiredSkills: SKILLS_PERM,
    stem: '$_7P_3 = ?$',
    options: [
      { key: 'A', text: '$210$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$35$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$_7C_3$' },
      { key: 'C', text: '$21$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$7 \\times 3$' },
      { key: 'D', text: '$343$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$7^3$' },
      { key: 'E', text: '$5040$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$7!$' },
    ],
    solution: '$_7P_3 = 7 \\times 6 \\times 5 = 210$.' },

  // S8 (중) ₇C₃
  { chapterCode: CODE, difficulty: 'medium', concept: '$_7C_3$', requiredSkills: SKILLS_COMB,
    stem: '$_7C_3 = ?$',
    options: [
      { key: 'A', text: '$35$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$210$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$_7P_3$' },
      { key: 'C', text: '$21$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$7 \\times 3$' },
      { key: 'D', text: '$56$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
      { key: 'E', text: '$120$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 값' },
    ],
    solution: '$_7C_3 = \\dfrac{7!}{3! \\cdot 4!} = \\dfrac{210}{6} = 35$.' },

  // S9 (중) ₈C₂
  { chapterCode: CODE, difficulty: 'medium', concept: '$_8C_2$', requiredSkills: SKILLS_COMB,
    stem: '$_8C_2 = ?$',
    options: [
      { key: 'A', text: '$28$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$56$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$_8P_2$' },
      { key: 'C', text: '$16$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$8 \\times 2$' },
      { key: 'D', text: '$36$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
      { key: 'E', text: '$14$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
    ],
    solution: '$_8C_2 = \\dfrac{8 \\times 7}{2} = 28$.' },

  // S10 (중) 6명 일렬
  { chapterCode: CODE, difficulty: 'medium', concept: '$n!$ 줄세우기 (6명)', requiredSkills: SKILLS_FACT,
    stem: '$6$ 명을 일렬로 세우는 방법의 수?',
    options: [
      { key: 'A', text: '$720$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$120$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$5!$' },
      { key: 'C', text: '$36$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$6^2$' },
      { key: 'D', text: '$6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$n$' },
      { key: 'E', text: '$5040$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$7!$' },
    ],
    solution: '$6! = 720$.' },

  // S11 (중) 6명 중 3명 줄세우기
  { chapterCode: CODE, difficulty: 'medium', concept: '$_nP_r$ 응용', requiredSkills: SKILLS_PERM,
    stem: '$6$ 명 중 $3$ 명을 뽑아 일렬로 세우는 방법?',
    options: [
      { key: 'A', text: '$120$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$20$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$_6C_3$ 답함' },
      { key: 'C', text: '$216$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$6^3$' },
      { key: 'D', text: '$18$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$6 \\times 3$' },
      { key: 'E', text: '$720$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$6!$' },
    ],
    solution: '$_6P_3 = 6 \\times 5 \\times 4 = 120$.' },

  // S12 (중) 6명 중 3명 뽑기
  { chapterCode: CODE, difficulty: 'medium', concept: '$_nC_r$ 응용', requiredSkills: SKILLS_COMB,
    stem: '$6$ 명 중 $3$ 명을 뽑는 방법 (순서 무관)?',
    options: [
      { key: 'A', text: '$20$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$120$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$_6P_3$' },
      { key: 'C', text: '$18$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$6 \\times 3$' },
      { key: 'D', text: '$15$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
      { key: 'E', text: '$6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$n$' },
    ],
    solution: '$_6C_3 = \\dfrac{6 \\times 5 \\times 4}{3!} = 20$.' },

  // S13 (중) 양끝 A, B
  { chapterCode: CODE, difficulty: 'medium', concept: '양 끝 조건 (6명)', requiredSkills: SKILLS_COND,
    stem: 'A, B 를 포함한 $6$ 명을 일렬로 세울 때 A, B 를 양 끝에 두는 방법?',
    options: [
      { key: 'A', text: '$48$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$24$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: 'A, B 자리 바꿈 ($\\times 2!$) 누락' },
      { key: 'C', text: '$120$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$5!$ 그대로' },
      { key: 'D', text: '$240$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
      { key: 'E', text: '$720$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$6!$ 그대로' },
    ],
    solution: 'A, B 양끝 배치 $2!$ × 가운데 $4$명 배열 $4! = 2 \\times 24 = 48$.' },

  // S14 (중) AABBB 배열
  { chapterCode: CODE, difficulty: 'medium', concept: '같은 것이 있는 순열 ($2, 3$)', requiredSkills: SKILLS_REPEAT,
    stem: '문자열 AABBB 를 일렬로 배열하는 방법?',
    options: [
      { key: 'A', text: '$10$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$120$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '같은 문자 처리 누락 ($5!$)' },
      { key: 'C', text: '$20$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$5!/3!$ 만' },
      { key: 'D', text: '$60$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$5!/2!$ 만' },
      { key: 'E', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
    ],
    solution: '$\\dfrac{5!}{2! \\cdot 3!} = \\dfrac{120}{12} = 10$.' },

  // S15 (중) 동전 5번 H 3번
  { chapterCode: CODE, difficulty: 'medium', concept: '$_nC_r$ (동전)', requiredSkills: SKILLS_COMB,
    stem: '동전을 $5$ 번 던질 때 앞면 H 가 정확히 $3$ 번 나오는 경우의 수?',
    options: [
      { key: 'A', text: '$10$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$15$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
      { key: 'C', text: '$60$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$_5P_3$ 답함' },
      { key: 'D', text: '$32$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '전체 경우 $2^5$' },
      { key: 'E', text: '$5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$n$' },
    ],
    solution: '$5$ 번 중 H 위치 $3$ 개 선택 → $_5C_3 = 10$.' },

  // S16 (어려움) 원순열 4명
  { chapterCode: CODE, difficulty: 'hard', concept: '원순열 ($4$명)', requiredSkills: SKILLS_CIRC,
    stem: '$4$ 명을 원탁에 둘러앉히는 방법?',
    options: [
      { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$24$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$4!$ 그대로 (회전 동치 미고려)' },
      { key: 'C', text: '$12$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$4!/2$' },
      { key: 'D', text: '$4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$n$' },
      { key: 'E', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$(n-1)$' },
    ],
    solution: '원순열 = $(n - 1)! = 3! = 6$.' },

  // S17 (어려움) ₁₂C₉ = ₁₂C₃
  { chapterCode: CODE, difficulty: 'hard', concept: '$_nC_r = _nC_{n-r}$', requiredSkills: SKILLS_COMB,
    stem: '$_{12}C_9 = ?$',
    options: [
      { key: 'A', text: '$220$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$108$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$12 \\times 9$' },
      { key: 'C', text: '$1320$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$_{12}P_3$' },
      { key: 'D', text: '$36$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
      { key: 'E', text: '$165$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 값' },
    ],
    solution: '$_{12}C_9 = _{12}C_3 = \\dfrac{12 \\times 11 \\times 10}{6} = 220$.' },

  // S18 (어려움) 곱의 법칙 + 조합
  { chapterCode: CODE, difficulty: 'hard', concept: '곱의 법칙 + 조합 (남4 여3)', requiredSkills: SKILLS_COMB,
    stem: '남학생 $4$ 명, 여학생 $3$ 명 중 남 $2$ 명, 여 $2$ 명을 뽑는 방법?',
    options: [
      { key: 'A', text: '$18$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$12$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
      { key: 'C', text: '$24$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 계산' },
      { key: 'D', text: '$9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '한 가지만' },
      { key: 'E', text: '$10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 추정' },
    ],
    solution: '$_4C_2 \\times _3C_2 = 6 \\times 3 = 18$.' },

  // S19 (어려움) 이웃 6명
  { chapterCode: CODE, difficulty: 'hard', concept: '이웃 조건 묶음법 ($6$명)', requiredSkills: SKILLS_COND,
    stem: 'A, B 를 포함한 $6$ 명을 일렬로 세울 때 A, B 가 이웃하는 방법?',
    options: [
      { key: 'A', text: '$240$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$120$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: 'A, B 자리 바꿈 ($\\times 2$) 누락' },
      { key: 'C', text: '$720$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '제한 무시 ($6!$)' },
      { key: 'D', text: '$60$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
      { key: 'E', text: '$48$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 추정' },
    ],
    solution: 'A, B 묶음 → $5$ 묶음 일렬 $5!$, A, B 내부 $2! \\to 5! \\times 2! = 240$.' },

  // S20 (어려움) AABBCC
  { chapterCode: CODE, difficulty: 'hard', concept: '같은 것이 있는 순열 ($2, 2, 2$)', requiredSkills: SKILLS_REPEAT,
    stem: '문자열 AABBCC 를 일렬로 배열하는 방법?',
    options: [
      { key: 'A', text: '$90$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$720$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '같은 문자 처리 누락' },
      { key: 'C', text: '$120$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '한 번만 나눔' },
      { key: 'D', text: '$30$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$3$번 나눔 (잘못)' },
      { key: 'E', text: '$15$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
    ],
    solution: '$\\dfrac{6!}{2! \\cdot 2! \\cdot 2!} = \\dfrac{720}{8} = 90$.' },
];

export const K_G10_CS1_CH03_COUNTING_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
