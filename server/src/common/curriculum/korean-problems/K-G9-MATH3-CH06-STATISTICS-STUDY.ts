/**
 * K-G9-MATH3-CH06-STATISTICS — STUDY pool (single-step, 20문제).
 * 통계 — 대푯값(평균), 산포도(편차·분산·표준편차).
 * Mastery 3-step과 별도 변형 문제. 중3 (G9).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5. LLM 미사용.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G9-MATH3-CH06-STATISTICS';
const SKILLS_MEAN = ['arithmetic_mean', 'sum_over_n'];
const SKILLS_DEV = ['deviation_definition', 'sum_of_deviations'];
const SKILLS_VAR = ['variance_definition', 'variance_zero'];
const SKILLS_STD = ['standard_deviation', 'sqrt_variance'];
const SKILLS_TRANSFORM = ['add_constant_invariance', 'multiply_constant_squared'];
const SKILLS_COMPARE = ['compare_spread', 'mean_vs_variance'];
const SKILLS_DEF = ['dispersion_definition', 'unit_of_std'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) 평균 정의
  { chapterCode: CODE, difficulty: 'easy', concept: '평균의 정의', requiredSkills: SKILLS_MEAN,
    stem: '자료 $n$ 개의 평균은?',
    options: [
      { key: 'A', text: '$\\dfrac{\\text{자료의 합}}{n}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{n}{\\text{자료의 합}}$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '분자분모 바꿈' },
      { key: 'C', text: '$\\text{자료의 합} \\times n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱셈 잘못' },
      { key: 'D', text: '가장 큰 값', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '최댓값과 혼동' },
      { key: 'E', text: '중간값', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '중앙값과 혼동' },
    ],
    solution: '평균 $= \\dfrac{\\sum x_i}{n}$.' },

  // S2 (쉬움) 산포도 정의
  { chapterCode: CODE, difficulty: 'easy', concept: '산포도의 의미', requiredSkills: SKILLS_DEF,
    stem: '"산포도"란 무엇을 나타내는가?',
    options: [
      { key: 'A', text: '자료가 평균 주위에 흩어진 정도', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '자료의 평균', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평균은 대푯값' },
      { key: 'C', text: '자료의 최댓값', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '최댓값은 한 값' },
      { key: 'D', text: '자료의 개수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '개수와 무관' },
      { key: 'E', text: '자료의 합', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합과 무관' },
    ],
    solution: '산포도 = 자료가 흩어진 정도. 분산·표준편차로 측정.' },

  // S3 (쉬움) 편차 정의
  { chapterCode: CODE, difficulty: 'easy', concept: '편차 정의', requiredSkills: SKILLS_DEV,
    stem: '자료 $x_i$ 의 편차는?',
    options: [
      { key: 'A', text: '$x_i - \\bar{x}$ (자료 $-$ 평균)', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\bar{x} - x_i$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'C', text: '$x_i \\times \\bar{x}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곱셈 잘못' },
      { key: 'D', text: '$x_i^2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '제곱 잘못' },
      { key: 'E', text: '$|x_i|$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '절댓값 잘못' },
    ],
    solution: '편차 = 변량 $-$ 평균 = $x_i - \\bar{x}$.' },

  // S4 (쉬움) [5,5,5,5] 분산
  { chapterCode: CODE, difficulty: 'easy', concept: '같은 값들의 분산', requiredSkills: SKILLS_VAR,
    stem: '자료 $[5, 5, 5, 5]$ 의 분산은?',
    options: [
      { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평균을 답함' },
      { key: 'C', text: '$25$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$5^2$ 잘못' },
      { key: 'D', text: '$20$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합 자체' },
      { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
    ],
    solution: '모두 같은 값 → 편차 모두 $0$ → 분산 $= 0$.' },

  // S5 (쉬움) 표준편차 단위
  { chapterCode: CODE, difficulty: 'easy', concept: '표준편차의 단위', requiredSkills: SKILLS_STD,
    stem: '자료의 단위가 cm 일 때 분산과 표준편차의 단위는?',
    options: [
      { key: 'A', text: '분산: cm², 표준편차: cm', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '분산: cm, 표준편차: cm', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '분산은 편차의 제곱' },
      { key: 'C', text: '분산: cm², 표준편차: cm²', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '표준편차는 제곱근' },
      { key: 'D', text: '둘 다 단위 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '단위 가짐' },
      { key: 'E', text: '분산: cm³, 표준편차: cm', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '세제곱 잘못' },
    ],
    solution: '분산 = $(편차)^2$ 평균 → cm². 표준편차 = $\\sqrt{분산}$ → cm.' },

  // S6 (쉬움) 분산 ≥ 0
  { chapterCode: CODE, difficulty: 'easy', concept: '분산의 범위', requiredSkills: SKILLS_VAR,
    stem: '분산 $V$ 의 부호는?',
    options: [
      { key: 'A', text: '항상 $V \\geq 0$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '항상 양수 ($V > 0$)', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$V = 0$ 가능 (모두 같은 값)' },
      { key: 'C', text: '항상 음수 가능', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '편차² 합 → 항상 $\\geq 0$' },
      { key: 'D', text: '$0$ 또는 음수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '항상 $\\geq 0$' },
      { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '판별 가능' },
    ],
    solution: '분산 = $\\overline{(편차)^2}$. 제곱은 $\\geq 0$이므로 분산 $\\geq 0$.' },

  // S7 (중) [10,20,30] 평균
  { chapterCode: CODE, difficulty: 'medium', concept: '평균 계산 (3개)', requiredSkills: SKILLS_MEAN,
    stem: '자료 $[10, 20, 30]$ 의 평균은?',
    options: [
      { key: 'A', text: '$20$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$15$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 나눗셈' },
      { key: 'C', text: '$60$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '합 자체' },
      { key: 'D', text: '$30$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '최댓값' },
      { key: 'E', text: '$10$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '최솟값' },
    ],
    solution: '평균 $= 60 / 3 = 20$.' },

  // S8 (중) [10,20,30] 편차
  { chapterCode: CODE, difficulty: 'medium', concept: '편차 계산 (평균 $20$)', requiredSkills: SKILLS_DEV,
    stem: '자료 $[10, 20, 30]$ (평균 $20$) 의 편차들?',
    options: [
      { key: 'A', text: '$-10, 0, 10$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$10, 0, -10$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$x_i - \\bar{x}$ 부호 잘못' },
      { key: 'C', text: '$10, 20, 30$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '자료 자체' },
      { key: 'D', text: '$0, 0, 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '편차 합 $= 0$과 혼동' },
      { key: 'E', text: '$-30, -20, -10$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$\\bar{x} - x_i$ 음수' },
    ],
    solution: '$x_i - \\bar{x}$: $10-20=-10$, $20-20=0$, $30-20=10$.' },

  // S9 (중) [10,20,30] 분산
  { chapterCode: CODE, difficulty: 'medium', concept: '분산 계산', requiredSkills: SKILLS_VAR,
    stem: '자료 $[10, 20, 30]$ 의 분산은?',
    options: [
      { key: 'A', text: '$\\dfrac{200}{3}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$200$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$/n$ 누락' },
      { key: 'C', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '편차 합과 혼동' },
      { key: 'D', text: '$\\dfrac{100}{3}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 분자' },
      { key: 'E', text: '$20$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평균 답함' },
    ],
    solution: '편차$^2$: $100, 0, 100$. 평균 $= 200/3$.' },

  // S10 (중) 표준편차
  { chapterCode: CODE, difficulty: 'medium', concept: '표준편차 계산 ($\\sqrt{200/3}$)', requiredSkills: SKILLS_STD,
    stem: '자료 $[10, 20, 30]$ (분산 $200/3$) 의 표준편차는?',
    options: [
      { key: 'A', text: '$\\sqrt{\\dfrac{200}{3}}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{200}{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '분산 그대로' },
      { key: 'C', text: '$\\dfrac{200^2}{9}$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '제곱 적용' },
      { key: 'D', text: '$\\dfrac{\\sqrt{200}}{3}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '분모는 $\\sqrt{3}$' },
      { key: 'E', text: '$\\dfrac{200}{3^2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 식' },
    ],
    solution: '표준편차 $= \\sqrt{분산} = \\sqrt{200/3}$.' },

  // S11 (중) [1,2,3,4,5] 평균
  { chapterCode: CODE, difficulty: 'medium', concept: '5개 등차 평균', requiredSkills: SKILLS_MEAN,
    stem: '$[1, 2, 3, 4, 5]$ 의 평균?',
    options: [
      { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$2.5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$5/2$ 잘못' },
      { key: 'C', text: '$15$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '합 자체' },
      { key: 'D', text: '$5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '최댓값' },
      { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '최솟값' },
    ],
    solution: '합 $= 15$. 평균 $= 15/5 = 3$ (= 중앙값).' },

  // S12 (중) [1,2,3,4,5] 분산
  { chapterCode: CODE, difficulty: 'medium', concept: '5개 자료 분산', requiredSkills: SKILLS_VAR,
    stem: '$[1, 2, 3, 4, 5]$ (평균 $3$) 의 분산?',
    options: [
      { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$10$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$/n$ 누락' },
      { key: 'C', text: '$5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 식' },
      { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '편차 합과 혼동' },
      { key: 'E', text: '$\\sqrt{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '표준편차' },
    ],
    solution: '편차$^2$: $4, 1, 0, 1, 4$. 평균 $= 10/5 = 2$.' },

  // S13 (중) 표준편차 √2
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\sqrt{2}$ 표준편차', requiredSkills: SKILLS_STD,
    stem: '$[1, 2, 3, 4, 5]$ (분산 $2$) 의 표준편차?',
    options: [
      { key: 'A', text: '$\\sqrt{2}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '분산 그대로' },
      { key: 'C', text: '$4$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '분산 제곱' },
      { key: 'D', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 계산' },
      { key: 'E', text: '$\\dfrac{1}{\\sqrt{2}}$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '뒤집음' },
    ],
    solution: '표준편차 $= \\sqrt{2}$.' },

  // S14 (중) -c 변환
  { chapterCode: CODE, difficulty: 'medium', concept: '$-c$ 변환', requiredSkills: SKILLS_TRANSFORM,
    stem: '모든 자료에서 같은 수 $c$ 를 빼면 분산은?',
    options: [
      { key: 'A', text: '그대로 (변하지 않음)', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$-c$ 만큼 감소', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평균만 변함' },
      { key: 'C', text: '$+c$ 만큼 증가', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '잘못된 변화' },
      { key: 'D', text: '$c^2$ 만큼 감소', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\times$ 변환과 혼동' },
      { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '명확함' },
    ],
    solution: '편차 $(x_i - c) - (\\bar{x} - c) = x_i - \\bar{x}$ → 같음. 분산 불변.' },

  // S15 (중) ÷c 변환
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\div c$ 변환', requiredSkills: SKILLS_TRANSFORM,
    stem: '모든 자료를 같은 양수 $c$ 로 나누면 분산은?',
    options: [
      { key: 'A', text: '$\\div c^2$ (원래의 $1/c^2$)', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\div c$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '한 번만 나눔' },
      { key: 'C', text: '그대로', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\div$ 변환은 분산 영향' },
      { key: 'D', text: '$\\times c$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '방향 잘못' },
      { key: 'E', text: '$\\div c^3$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '잘못된 지수' },
    ],
    solution: '편차 $(x_i/c - \\bar{x}/c)^2 = (x_i - \\bar{x})^2 / c^2$ → 분산 $/ c^2$.' },

  // S16 (어려움) 5개 등차 분산
  { chapterCode: CODE, difficulty: 'hard', concept: '$[2, 4, 6, 8, 10]$ 분산', requiredSkills: SKILLS_VAR,
    stem: '$[2, 4, 6, 8, 10]$ 의 분산?',
    options: [
      { key: 'A', text: '$8$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평균 답함' },
      { key: 'C', text: '$40$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$/n$ 누락' },
      { key: 'D', text: '$10$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 추정' },
      { key: 'E', text: '$2\\sqrt{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '표준편차' },
    ],
    solution: '평균 $= 6$. 편차$^2$: $16, 4, 0, 4, 16 = 40$. 분산 $= 40/5 = 8$.' },

  // S17 (어려움) 모든 같은 값 표준편차
  { chapterCode: CODE, difficulty: 'hard', concept: '모두 동일 값 → 표준편차', requiredSkills: SKILLS_STD,
    stem: '자료 $[a, a, a, a]$ 의 표준편차는?',
    options: [
      { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$a$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평균' },
      { key: 'C', text: '$a^2$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '제곱' },
      { key: 'D', text: '$\\sqrt{a}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '관련 없음' },
      { key: 'E', text: '$4a$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합 자체' },
    ],
    solution: '편차 모두 $0$ → 분산 $0$ → 표준편차 $= \\sqrt{0} = 0$.' },

  // S18 (어려움) 두 자료 표준편차 비교
  { chapterCode: CODE, difficulty: 'hard', concept: '두 자료 표준편차 비교', requiredSkills: SKILLS_COMPARE,
    stem: '$A = [10, 20, 30]$, $B = [15, 20, 25]$. 어느 쪽 표준편차가 큰가?',
    options: [
      { key: 'A', text: '$A$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$B$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$B$는 흩어짐 작음' },
      { key: 'C', text: '같다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평균 같지만 분산 다름' },
      { key: 'D', text: '$A$의 평균이 다르므로 비교 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '두 평균 모두 $20$' },
      { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '판별 가능' },
    ],
    solution: '$A$ 편차 $\\pm 10, 0$ → 분산 $200/3$. $B$ 편차 $\\pm 5, 0$ → 분산 $50/3$. $A$ 분산·표준편차 큼.' },

  // S19 (어려움) 모든 값 ×2
  { chapterCode: CODE, difficulty: 'hard', concept: '모든 값 $\\times 2$', requiredSkills: SKILLS_TRANSFORM,
    stem: '평균 $60$, 표준편차 $5$ 인 자료의 모든 값에 $2$ 를 곱하면 새 평균과 표준편차는?',
    options: [
      { key: 'A', text: '평균 $120$, 표준편차 $10$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '평균 $120$, 표준편차 $5$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '표준편차도 $\\times 2$' },
      { key: 'C', text: '평균 $60$, 표준편차 $10$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '평균도 $\\times 2$' },
      { key: 'D', text: '평균 $120$, 표준편차 $20$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$\\times c^2$ 잘못 적용 (분산 X 표준편차)' },
      { key: 'E', text: '평균 $62$, 표준편차 $7$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$+c$ 변환과 혼동' },
    ],
    solution: '모든 값 $\\times c$: 평균 $\\times c$, 분산 $\\times c^2$, 표준편차 $\\times c$. → $120, 10$.' },

  // S20 (어려움) 한 명 추가 평균
  { chapterCode: CODE, difficulty: 'hard', concept: '평균 변동 (한 명 추가)', requiredSkills: SKILLS_MEAN,
    stem: '$10$ 명의 평균이 $80$ 점. 한 명을 더해서 $11$ 명의 평균이 $79$ 점이 되었다. 추가된 점수는?',
    options: [
      { key: 'A', text: '$69$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$79$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '새 평균' },
      { key: 'C', text: '$80$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원래 평균' },
      { key: 'D', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평균 차만' },
      { key: 'E', text: '$70$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
    ],
    solution: '$11 \\times 79 - 10 \\times 80 = 869 - 800 = 69$.' },
];

export const K_G9_MATH3_CH06_STATISTICS_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
