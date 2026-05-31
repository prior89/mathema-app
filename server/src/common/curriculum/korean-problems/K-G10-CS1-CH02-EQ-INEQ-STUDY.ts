/**
 * K-G10-CS1-CH02-EQ-INEQ — STUDY pool (single-step, 20문제).
 * 방정식과 부등식 — 복소수, 이차방정식 (허근/판별식/근과 계수).
 * Mastery 3-step과 별도 변형 문제. 고1 공통수학1 (G10).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5. LLM 미사용.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G10-CS1-CH02-EQ-INEQ';
const SKILLS_I = ['imaginary_unit', 'i_power_cycle'];
const SKILLS_SQRT = ['sqrt_negative', 'imaginary_simplify'];
const SKILLS_PARTS = ['real_part', 'imaginary_part'];
const SKILLS_DEF = ['complex_number_definition'];
const SKILLS_OPS = ['complex_multiplication', 'complex_addition'];
const SKILLS_ABS = ['complex_absolute_value', 'modulus'];
const SKILLS_QUAD_C = ['quadratic_complex_roots', 'imaginary_solution'];
const SKILLS_DISC = ['discriminant', 'discriminant_sign'];
const SKILLS_CONJ = ['complex_conjugate', 'z_zbar_modulus_squared'];
const SKILLS_VIETA = ['vieta_formulas', 'sum_product_roots'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) i⁵
  { chapterCode: CODE, difficulty: 'easy', concept: '$i^5$', requiredSkills: SKILLS_I,
    stem: '$i^5 = ?$',
    options: [
      { key: 'A', text: '$i$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$-i$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$i^3$과 혼동' },
      { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$i^4$' },
      { key: 'D', text: '$-1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$i^2$' },
      { key: 'E', text: '$5i$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '지수를 계수로' },
    ],
    solution: '$i^5 = i^4 \\cdot i = 1 \\cdot i = i$.' },

  // S2 (쉬움) i⁶
  { chapterCode: CODE, difficulty: 'easy', concept: '$i^6$', requiredSkills: SKILLS_I,
    stem: '$i^6 = ?$',
    options: [
      { key: 'A', text: '$-1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$i^4$' },
      { key: 'C', text: '$i$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$i^5$' },
      { key: 'D', text: '$-i$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$i^3$' },
      { key: 'E', text: '$6i$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '계수 잘못' },
    ],
    solution: '$i^6 = i^4 \\cdot i^2 = 1 \\cdot (-1) = -1$.' },

  // S3 (쉬움) √-9
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\sqrt{-9}$', requiredSkills: SKILLS_SQRT,
    stem: '$\\sqrt{-9} = ?$',
    options: [
      { key: 'A', text: '$3i$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$-3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '음수 제곱근 실수로 잘못' },
      { key: 'C', text: '$9i$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '제곱근 미적용' },
      { key: 'D', text: '$\\pm 3i$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sqrt{\\ }$는 양의 (정해진) 제곱근' },
      { key: 'E', text: '$-3i$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
    ],
    solution: '$\\sqrt{-9} = \\sqrt{9} \\cdot i = 3i$.' },

  // S4 (쉬움) 실수부
  { chapterCode: CODE, difficulty: 'easy', concept: '복소수 실수부 (음수)', requiredSkills: SKILLS_PARTS,
    stem: '복소수 $-1 + 5i$ 의 실수부?',
    options: [
      { key: 'A', text: '$-1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 누락' },
      { key: 'C', text: '$5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '허수부 답함' },
      { key: 'D', text: '$5i$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '허수부 ($i$ 포함)' },
      { key: 'E', text: '$-1 + 5i$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '복소수 자체' },
    ],
    solution: '$a + bi$ 형식에서 실수부 $= a = -1$.' },

  // S5 (쉬움) 허수부
  { chapterCode: CODE, difficulty: 'easy', concept: '복소수 허수부 (실수)', requiredSkills: SKILLS_PARTS,
    stem: '$-1 + 5i$ 의 허수부?',
    options: [
      { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$5i$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '허수부는 실수 ($i$ 빼고)' },
      { key: 'C', text: '$-1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '실수부' },
      { key: 'D', text: '$-5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 추정' },
    ],
    solution: '$a + bi$ 에서 허수부 $= b = 5$ (실수).' },

  // S6 (쉬움) 복소수 정의
  { chapterCode: CODE, difficulty: 'easy', concept: '복소수 표준형', requiredSkills: SKILLS_DEF,
    stem: '복소수의 표준 형태는?',
    options: [
      { key: 'A', text: '$a + bi$ ($a, b$ 는 실수)', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$a + b$ ($a, b$ 는 실수)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$i$ 누락' },
      { key: 'C', text: '$a \\cdot b \\cdot i$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곱셈 형태 잘못' },
      { key: 'D', text: '$ai + bi$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '두 허수 합 잘못' },
      { key: 'E', text: '$i^a + i^b$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '지수 형태 잘못' },
    ],
    solution: '복소수 $z = a + bi$ ($a, b \\in \\mathbb{R}$).' },

  // S7 (중) 복소수 곱셈
  { chapterCode: CODE, difficulty: 'medium', concept: '복소수 곱셈 ($1+2i$, $3-i$)', requiredSkills: SKILLS_OPS,
    stem: '$(1 + 2i)(3 - i) = ?$',
    options: [
      { key: 'A', text: '$5 + 5i$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3 - 2i^2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$i^2$ 미적용' },
      { key: 'C', text: '$1 + 6i$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '실수부 잘못' },
      { key: 'D', text: '$5 - 5i$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '허수부 부호 잘못' },
      { key: 'E', text: '$3 + 5i$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$-2i^2 = 2$ 누락' },
    ],
    solution: '$3 - i + 6i - 2i^2 = 3 + 5i + 2 = 5 + 5i$.' },

  // S8 (중) 복소수 뺄셈
  { chapterCode: CODE, difficulty: 'medium', concept: '복소수 뺄셈', requiredSkills: SKILLS_OPS,
    stem: '$(4 + i) - (2 + 3i) = ?$',
    options: [
      { key: 'A', text: '$2 - 2i$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$2 + 2i$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '허수부 부호 잘못' },
      { key: 'C', text: '$6 + 4i$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '덧셈으로' },
      { key: 'D', text: '$2 - 4i$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$1 - 3 = -2$ 잘못' },
      { key: 'E', text: '$2 + 4i$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '잘못된 식' },
    ],
    solution: '$(4 - 2) + (1 - 3)i = 2 - 2i$.' },

  // S9 (중) 절댓값 |5+12i|
  { chapterCode: CODE, difficulty: 'medium', concept: '복소수 절댓값', requiredSkills: SKILLS_ABS,
    stem: '$|5 + 12i| = ?$',
    options: [
      { key: 'A', text: '$13$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$17$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$5 + 12$ 합' },
      { key: 'C', text: '$169$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '제곱근 누락' },
      { key: 'D', text: '$\\sqrt{17}$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '제곱 안 함' },
      { key: 'E', text: '$5 + 12i$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '복소수 자체' },
    ],
    solution: '$|a + bi| = \\sqrt{a^2 + b^2} = \\sqrt{25 + 144} = \\sqrt{169} = 13$.' },

  // S10 (중) x²+9=0
  { chapterCode: CODE, difficulty: 'medium', concept: '$x^2 + 9 = 0$ 허근', requiredSkills: SKILLS_QUAD_C,
    stem: '$x^2 + 9 = 0$ 의 해?',
    options: [
      { key: 'A', text: '$x = \\pm 3i$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = \\pm 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '실수만 (음수 제곱근 무시)' },
      { key: 'C', text: '실수 해 없음', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '복소수 범위에서는 해 있음' },
      { key: 'D', text: '$x = 9i$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '제곱근 미적용' },
      { key: 'E', text: '$x = \\pm \\sqrt{-9}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$i$ 단순화 안 함' },
    ],
    solution: '$x^2 = -9 \\to x = \\pm \\sqrt{-9} = \\pm 3i$.' },

  // S11 (중) x²+16=0
  { chapterCode: CODE, difficulty: 'medium', concept: '$x^2 + 16 = 0$ 허근', requiredSkills: SKILLS_QUAD_C,
    stem: '$x^2 + 16 = 0$ 의 해?',
    options: [
      { key: 'A', text: '$x = \\pm 4i$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = \\pm 4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '실수만' },
      { key: 'C', text: '$x = \\pm 16i$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '제곱근 미적용' },
      { key: 'D', text: '$x = 4i$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\pm$ 누락' },
      { key: 'E', text: '실수 해 없음', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '복소수 해 있음' },
    ],
    solution: '$x = \\pm \\sqrt{-16} = \\pm 4i$.' },

  // S12 (중) 판별식 음수
  { chapterCode: CODE, difficulty: 'medium', concept: '판별식 계산 (음수)', requiredSkills: SKILLS_DISC,
    stem: '$x^2 + 4x + 13 = 0$ 의 판별식 $D$?',
    options: [
      { key: 'A', text: '$-36$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$36$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$16 - 52 = -36$ 부호 잘못' },
      { key: 'C', text: '$68$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$16 + 52$' },
      { key: 'D', text: '$-68$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
    ],
    solution: '$D = b^2 - 4ac = 16 - 4 \\cdot 1 \\cdot 13 = 16 - 52 = -36$.' },

  // S13 (중) D=0 → 중근
  { chapterCode: CODE, difficulty: 'medium', concept: '판별식 $= 0$ → 중근', requiredSkills: SKILLS_DISC,
    stem: '판별식 $D = 0$ 일 때 이차방정식의 해는?',
    options: [
      { key: 'A', text: '실근 한 개 (중근)', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '실근 두 개', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$D > 0$' },
      { key: 'C', text: '허근 두 개', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$D < 0$' },
      { key: 'D', text: '실근과 허근', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 분류' },
      { key: 'E', text: '해 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$D = 0$ → 중근 존재' },
    ],
    solution: '$D = 0$ → 중근 (실근 한 개, 두 번 셈).' },

  // S14 (중) 허근 풀이
  { chapterCode: CODE, difficulty: 'medium', concept: '근의 공식 (허근)', requiredSkills: SKILLS_QUAD_C,
    stem: '$x^2 + 4x + 13 = 0$ 의 해는?',
    options: [
      { key: 'A', text: '$x = -2 \\pm 3i$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = 2 \\pm 3i$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-b$ 부호 잘못' },
      { key: 'C', text: '$x = -2 \\pm 6i$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\sqrt{D}/2$ 잘못' },
      { key: 'D', text: '실근 없음', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '복소수 해 있음' },
      { key: 'E', text: '$x = -2 \\pm \\sqrt{-36}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$i$ 단순화 안 함' },
    ],
    solution: '$D = -36$. $x = \\dfrac{-4 \\pm \\sqrt{-36}}{2} = \\dfrac{-4 \\pm 6i}{2} = -2 \\pm 3i$.' },

  // S15 (중) √-16·√-25
  { chapterCode: CODE, difficulty: 'medium', concept: '음수 제곱근 곱셈', requiredSkills: SKILLS_SQRT,
    stem: '$\\sqrt{-16} \\cdot \\sqrt{-25} = ?$',
    options: [
      { key: 'A', text: '$-20$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$20$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$\\sqrt{ab}$ 잘못 적용 ($\\sqrt{(-16)(-25)} = 20$ 함정)' },
      { key: 'C', text: '$20i$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$i$ 잘못 남김' },
      { key: 'D', text: '$-20i$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 식' },
      { key: 'E', text: '$400$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\sqrt{ } \\cdot \\sqrt{ }$ 미적용' },
    ],
    solution: '먼저 $i$로 변환: $4i \\cdot 5i = 20 i^2 = -20$. ($\\sqrt{(-16)(-25)} = 20$ 은 함정 — 음수 제곱근 곱은 $i$로 먼저.)' },

  // S16 (어려움) 켤레복소수
  { chapterCode: CODE, difficulty: 'hard', concept: '켤레복소수', requiredSkills: SKILLS_CONJ,
    stem: '$z = 2 + 3i$ 의 켤레는?',
    options: [
      { key: 'A', text: '$2 - 3i$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$-2 + 3i$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '실수부 부호 잘못' },
      { key: 'C', text: '$-2 - 3i$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '음수 (원점 대칭)' },
      { key: 'D', text: '$2 + 3i$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$z$ 자체' },
      { key: 'E', text: '$3 + 2i$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '실수·허수 바꿈' },
    ],
    solution: '$\\overline{a + bi} = a - bi$. $\\bar{z} = 2 - 3i$.' },

  // S17 (어려움) z·z̄ = |z|²
  { chapterCode: CODE, difficulty: 'hard', concept: '$z \\bar{z} = |z|^2$', requiredSkills: SKILLS_CONJ,
    stem: '$z = 1 + 2i$ 일 때 $z \\bar{z}$ 의 값?',
    options: [
      { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\sqrt{5}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$|z|$ 자체' },
      { key: 'C', text: '$1 - 4i^2 = 5$? 인접', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '답은 같지만 추론 미완성' },
      { key: 'D', text: '$1 + 4i$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 곱' },
      { key: 'E', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
    ],
    solution: '$z \\bar{z} = (1 + 2i)(1 - 2i) = 1 - 4i^2 = 1 + 4 = 5 = |z|^2$.' },

  // S18 (어려움) 두 근 합 -2 곱 -8
  { chapterCode: CODE, difficulty: 'hard', concept: '근으로 이차방정식', requiredSkills: SKILLS_VIETA,
    stem: '두 근의 합 $= -2$, 곱 $= -8$ 인 이차방정식 (선행계수 $1$)?',
    options: [
      { key: 'A', text: '$x^2 + 2x - 8 = 0$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x^2 - 2x - 8 = 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '합 부호 잘못 ($-($합$)$)' },
      { key: 'C', text: '$x^2 + 2x + 8 = 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '곱 부호 잘못' },
      { key: 'D', text: '$x^2 - 2x + 8 = 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '두 부호 모두 잘못' },
      { key: 'E', text: '$2x^2 + 8 = 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '잘못된 형식' },
    ],
    solution: '$x^2 - (\\text{합})x + (\\text{곱}) = x^2 - (-2)x + (-8) = x^2 + 2x - 8$.' },

  // S19 (어려움) 근 -1, 4 → 식
  { chapterCode: CODE, difficulty: 'hard', concept: '두 근으로부터 식', requiredSkills: SKILLS_VIETA,
    stem: '두 근이 $-1$ 과 $4$ 인 이차방정식 (선행계수 $1$)?',
    options: [
      { key: 'A', text: '$x^2 - 3x - 4 = 0$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x^2 + 3x - 4 = 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '합 $= -1 + 4 = 3$인데 $-($합$) = -3$' },
      { key: 'C', text: '$x^2 - 5x + 4 = 0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 합' },
      { key: 'D', text: '$x^2 - 3x + 4 = 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '곱 부호 잘못' },
      { key: 'E', text: '$(x + 1)(x - 4)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '전개 안 함 (사실은 답)' },
    ],
    solution: '합 $= 3$, 곱 $= -4$. $x^2 - 3x - 4 = (x + 1)(x - 4)$.' },

  // S20 (어려움) 중근 조건 k=±6
  { chapterCode: CODE, difficulty: 'hard', concept: '중근 조건 (두 해)', requiredSkills: SKILLS_DISC,
    stem: '$x^2 + kx + 9 = 0$ 이 중근을 가지면 $k$ 의 값은?',
    options: [
      { key: 'A', text: '$k = \\pm 6$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$k = 6$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '음수 해 누락' },
      { key: 'C', text: '$k = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '중근 조건 미적용' },
      { key: 'D', text: '$k = 36$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$k^2$ 답함' },
      { key: 'E', text: '$k = -6$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '양수 해 누락' },
    ],
    solution: '$D = k^2 - 36 = 0 \\to k^2 = 36 \\to k = \\pm 6$.' },
];

export const K_G10_CS1_CH02_EQ_INEQ_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
