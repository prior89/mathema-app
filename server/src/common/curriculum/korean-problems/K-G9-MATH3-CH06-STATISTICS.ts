/**
 * K-G9-MATH3-CH06-STATISTICS (분산·표준편차) — 20문제 3-step Mastery.
 * 중3 — 대푯값 → 편차 → 편차 합 = 0 → 분산 = 편차² 평균 →
 *        표준편차 = $\sqrt{분산}$ → 자료 변환 (덧셈/곱셈) → 비교.
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 * 주요 errorCode 분배:
 *   STATISTICS_INTERPRETATION_ERROR 8 (Q1,3,4,6,14,15,16,20)
 *   ARITHMETIC_ERROR 4 (Q7,9,11,17) / CONCEPT_MISUNDERSTANDING 3 (Q2,5,18)
 *   SIGN_ERROR 2 (Q8,12) / FORMULA_SELECTION_ERROR 2 (Q10,13) / ALGEBRA_ERROR 1 (Q19)
 *
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G9-MATH3-CH06-STATISTICS';
const SKILLS_DEV = ['deviation_definition'];
const SKILLS_VAR = ['variance_definition', 'variance_calc'];
const SKILLS_STD = ['standard_deviation', 'sqrt_variance'];
const SKILLS_MEAN = ['mean_calculation'];
const SKILLS_TRANSFORM = ['variance_invariance', 'variance_scaling'];
const SKILLS_COMPARE = ['variance_comparison'];

const problems: KoreanProblemSeed[] = [
  // Q1
  { chapterCode: CODE, difficulty: 'easy', concept: '편차 정의', requiredSkills: SKILLS_DEV,
    stem: '자료 $x_i$ 의 편차란?',
    steps: [
      { stepType: 'CONCEPT', prompt: '편차의 의미', options: [
        { key: 'A', text: '$x_i - \\bar{x}$ (자료 값에서 평균을 뺀 값)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x_i + \\bar{x}$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '합' },
        { key: 'C', text: '$\\bar{x} - x_i$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '뒤집힘' },
        { key: 'D', text: '$x_i \\cdot \\bar{x}$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '곱' },
        { key: 'E', text: '$x_i / \\bar{x}$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '나누기' },
      ] },
      { stepType: 'PROCESS', prompt: '예시: 평균 $5$, 값 $7$ 의 편차?', options: [
        { key: 'A', text: '$7 - 5 = 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5 - 7 = -2$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '뒤집힘' },
        { key: 'C', text: '$7 + 5 = 12$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '합' },
        { key: 'D', text: '$7 \\cdot 5 = 35$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '곱' },
        { key: 'E', text: '$7$ (값 그대로)', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '평균 무시' },
      ] },
      { stepType: 'ANSWER', prompt: '편차 = ?', options: [
        { key: 'A', text: '$x_i - \\bar{x}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\bar{x} - x_i$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '뒤집힘' },
        { key: 'C', text: '$x_i + \\bar{x}$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '합' },
        { key: 'D', text: '$|x_i - \\bar{x}|$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '절댓값 아님' },
        { key: 'E', text: '$(x_i - \\bar{x})^2$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '제곱은 분산' },
      ] },
    ], solution: '편차 $= x_i - \\bar{x}$.' },

  // Q2
  { chapterCode: CODE, difficulty: 'easy', concept: '편차의 합', requiredSkills: SKILLS_DEV,
    stem: '모든 편차의 합은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '왜 합이 일정?', options: [
        { key: 'A', text: '평균보다 큰 값과 작은 값이 상쇄', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '항상 양수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '자료마다 다름', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '항상 0' },
        { key: 'D', text: '평균과 같음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '개수와 같음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\sum (x_i - \\bar{x}) = \\sum x_i - n\\bar{x} = n\\bar{x} - n\\bar{x}$', options: [
        { key: 'A', text: '$= 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$= n$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$= \\bar{x}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\neq 0$ (일반)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '항상 0' },
        { key: 'E', text: '$> 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$0$' },
      ] },
      { stepType: 'ANSWER', prompt: '편차의 합?', options: [
        { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$n$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$\\bar{x}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '분산', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '편차 제곱 평균' },
        { key: 'E', text: '자료마다 다름', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '항상 0' },
      ] },
    ], solution: '편차의 합 = $0$ (양·음 상쇄).' },

  // Q3
  { chapterCode: CODE, difficulty: 'easy', concept: '분산 정의', requiredSkills: SKILLS_VAR,
    stem: '분산 $V$ 의 정의?',
    steps: [
      { stepType: 'CONCEPT', prompt: '편차의 평균은 0인데, 흩어짐을 어떻게 측정?', options: [
        { key: 'A', text: '편차의 제곱 평균', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '편차의 평균', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '항상 0' },
        { key: 'C', text: '편차의 합', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '항상 0' },
        { key: 'D', text: '평균의 제곱', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '편차의 절댓값 평균', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '평균편차 (다른 통계량)' },
      ] },
      { stepType: 'PROCESS', prompt: '식?', options: [
        { key: 'A', text: '$V = \\dfrac{1}{n}\\sum (x_i - \\bar{x})^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$V = \\dfrac{1}{n}\\sum (x_i - \\bar{x})$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '제곱 누락' },
        { key: 'C', text: '$V = \\sum (x_i - \\bar{x})^2$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '나누기 누락' },
        { key: 'D', text: '$V = \\dfrac{1}{n} \\sum x_i^2$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '편차 아님' },
        { key: 'E', text: '$V = (\\bar{x})^2$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$V = ?$', options: [
        { key: 'A', text: '편차 제곱의 평균', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '편차의 평균 ($= 0$)', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '제곱 누락' },
        { key: 'C', text: '편차의 합', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '$0$' },
        { key: 'D', text: '자료 제곱의 평균', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '편차 사용' },
        { key: 'E', text: '평균 자체', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$V = \\dfrac{1}{n}\\sum (x_i - \\bar{x})^2$ (편차 제곱의 평균).' },

  // Q4
  { chapterCode: CODE, difficulty: 'easy', concept: '표준편차 정의', requiredSkills: SKILLS_STD,
    stem: '표준편차 $\\sigma$ 의 정의?',
    steps: [
      { stepType: 'CONCEPT', prompt: '분산과 표준편차의 관계?', options: [
        { key: 'A', text: '$\\sigma = \\sqrt{V}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sigma = V$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '같음' },
        { key: 'C', text: '$\\sigma = V^2$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '제곱' },
        { key: 'D', text: '$\\sigma = 1/V$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '역수' },
        { key: 'E', text: '$\\sigma = V/n$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '왜 제곱근?', options: [
        { key: 'A', text: '분산은 제곱한 값이라 단위가 자료의 제곱 — 원래 단위로 환원', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '근거 없음', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '있음' },
        { key: 'C', text: '편의상', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '근거 있음' },
        { key: 'D', text: '계산 쉽게', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '단위 의미' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'ANSWER', prompt: '$\\sigma = ?$', options: [
        { key: 'A', text: '$\\sqrt{V}$ (분산의 제곱근)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$V$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '같음' },
        { key: 'C', text: '$V^2$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '제곱' },
        { key: 'D', text: '$V/n$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sum x_i / n$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '평균' },
      ] },
    ], solution: '$\\sigma = \\sqrt{V}$.' },

  // Q5
  { chapterCode: CODE, difficulty: 'easy', concept: '같은 값들의 분산', requiredSkills: SKILLS_VAR,
    stem: '자료 $[3, 3, 3]$ 의 분산은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '편차 계산', options: [
        { key: 'A', text: '평균 $= 3$, 모든 편차 $= 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '편차 $= 1, 1, 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평균과 같음' },
        { key: 'C', text: '편차 합 $= 9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평균이 합' },
        { key: 'D', text: '평균 $= 9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합' },
        { key: 'E', text: '편차 $= 3, 3, 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '값 자체' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\sum 0^2 / 3$', options: [
        { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sqrt{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '분산?', options: [
        { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
    ], solution: '모든 값이 같음 → 편차 모두 $0$ → 분산 $0$.' },

  // Q6
  { chapterCode: CODE, difficulty: 'easy', concept: '분산의 의미', requiredSkills: SKILLS_VAR,
    stem: '분산이 클수록 자료는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '분산의 직관적 의미?', options: [
        { key: 'A', text: '평균에서 멀리 흩어져 있음', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '평균 근처에 모임', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '반대 (분산 작을 때)' },
        { key: 'C', text: '모두 같은 값', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '분산 0' },
        { key: 'D', text: '평균이 큼', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '평균과 무관' },
        { key: 'E', text: '평균이 작음', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '평균과 무관' },
      ] },
      { stepType: 'PROCESS', prompt: '예시 비교', options: [
        { key: 'A', text: '[1,5,9] 분산이 [4,5,6] 분산보다 큼', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '평균이 같으면 분산도 같음', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '독립' },
        { key: 'C', text: '분산은 평균과 같음', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '다름' },
        { key: 'D', text: '분산은 항상 정수', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '분수 가능' },
        { key: 'E', text: '평균이 크면 분산도 큼', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '독립' },
      ] },
      { stepType: 'ANSWER', prompt: '분산 클수록?', options: [
        { key: 'A', text: '평균에서 흩어짐', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '평균 근처에 모임', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '반대' },
        { key: 'C', text: '평균이 큼', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '독립' },
        { key: 'D', text: '평균이 작음', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '독립' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '의미 있음' },
      ] },
    ], solution: '분산 클수록 자료가 평균에서 멀리 흩어져 있음.' },

  // Q7
  { chapterCode: CODE, difficulty: 'medium', concept: '평균 계산', requiredSkills: SKILLS_MEAN,
    stem: '자료 $[4, 6, 8]$ 의 평균은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '평균 = 합/개수', options: [
        { key: 'A', text: '$(4+6+8)/3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(4+6+8)/2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$n$ 잘못' },
        { key: 'C', text: '$(4 \\cdot 6 \\cdot 8)/3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '곱' },
        { key: 'D', text: '$4 + 6 + 8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 누락' },
        { key: 'E', text: '최댓값 $= 8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$18 / 3$', options: [
        { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$9$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$/2$' },
        { key: 'C', text: '$18$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 안 함' },
        { key: 'D', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '최대' },
      ] },
      { stepType: 'ANSWER', prompt: '평균?', options: [
        { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$9$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$/2$' },
        { key: 'C', text: '$18$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 누락' },
        { key: 'D', text: '$8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '최대' },
        { key: 'E', text: '$4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '최소' },
      ] },
    ], solution: '평균 $= 18/3 = 6$.' },

  // Q8
  { chapterCode: CODE, difficulty: 'medium', concept: '편차 계산', requiredSkills: SKILLS_DEV,
    stem: '자료 $[4, 6, 8]$ (평균 $6$) 의 편차들?',
    steps: [
      { stepType: 'CONCEPT', prompt: '각 $x_i - 6$', options: [
        { key: 'A', text: '$4-6, 6-6, 8-6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$6-4, 6-6, 6-8$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '뒤집힘' },
        { key: 'C', text: '$4+6, 6+6, 8+6$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '합' },
        { key: 'D', text: '$4, 6, 8$ 그대로', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '평균 빼야' },
        { key: 'E', text: '$|4-6|, |6-6|, |8-6|$ 절댓값', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '편차는 부호 포함' },
      ] },
      { stepType: 'PROCESS', prompt: '계산', options: [
        { key: 'A', text: '$-2, 0, 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2, 0, -2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '순서·부호' },
        { key: 'C', text: '$2, 0, 2$ (절댓값)', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 무시' },
        { key: 'D', text: '$10, 12, 14$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '합' },
        { key: 'E', text: '$4, 6, 8$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '평균 빼지 않음' },
      ] },
      { stepType: 'ANSWER', prompt: '편차들?', options: [
        { key: 'A', text: '$-2, 0, 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2, 0, -2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 뒤집힘' },
        { key: 'C', text: '$2, 0, 2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '절댓값' },
        { key: 'D', text: '$4, 6, 8$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '평균 안 뺌' },
        { key: 'E', text: '$10, 12, 14$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '합' },
      ] },
    ], solution: '$4-6=-2, 6-6=0, 8-6=2$.' },

  // Q9
  { chapterCode: CODE, difficulty: 'medium', concept: '분산 계산', requiredSkills: SKILLS_VAR,
    stem: '자료 $[4, 6, 8]$ 의 분산은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '편차 $(-2, 0, 2)$ 의 제곱합 / 개수', options: [
        { key: 'A', text: '$(4 + 0 + 4) / 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(-2 + 0 + 2) / 3 = 0$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '편차 합 (제곱 누락)' },
        { key: 'C', text: '$(2 + 0 + 2) / 3 = 4/3$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '절댓값' },
        { key: 'D', text: '$(4 + 0 + 4) / 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$n$ 잘못' },
        { key: 'E', text: '$4 + 0 + 4 = 8$ (나누기 누락)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 누락' },
      ] },
      { stepType: 'PROCESS', prompt: '$8 / 3$', options: [
        { key: 'A', text: '$\\dfrac{8}{3}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{4}{3}$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '절댓값 평균' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '편차 합' },
        { key: 'D', text: '$8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 누락' },
        { key: 'E', text: '$\\sqrt{8/3}$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '표준편차' },
      ] },
      { stepType: 'ANSWER', prompt: '분산?', options: [
        { key: 'A', text: '$\\dfrac{8}{3}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '편차 합' },
        { key: 'C', text: '$\\dfrac{4}{3}$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '절댓값' },
        { key: 'D', text: '$8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 누락' },
        { key: 'E', text: '$\\sqrt{8/3}$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '표준편차' },
      ] },
    ], solution: '분산 $= (4+0+4)/3 = 8/3$.' },

  // Q10
  { chapterCode: CODE, difficulty: 'medium', concept: '표준편차 계산', requiredSkills: SKILLS_STD,
    stem: '자료 $[4, 6, 8]$ (분산 $8/3$) 의 표준편차는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\sigma = \\sqrt{V}$', options: [
        { key: 'A', text: '$\\sqrt{8/3}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$8/3$ (그대로)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱근 누락' },
        { key: 'C', text: '$(8/3)^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱' },
        { key: 'D', text: '$\\sqrt{8}/3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '분모만' },
        { key: 'E', text: '$3/8$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '역수' },
      ] },
      { stepType: 'PROCESS', prompt: '간단히?', options: [
        { key: 'A', text: '$\\sqrt{8/3} = \\dfrac{2\\sqrt{2}}{\\sqrt{3}} = \\dfrac{2\\sqrt{6}}{3}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sqrt{8/3}$ 그대로 (간단히 안 함)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '맞지만 간단히 가능' },
        { key: 'C', text: '$2\\sqrt{2}/3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '분모 제곱근 무시' },
        { key: 'D', text: '$\\sqrt{8}/\\sqrt{3}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '맞지만 유리화 필요' },
        { key: 'E', text: '$8/3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱근 누락' },
      ] },
      { stepType: 'ANSWER', prompt: '표준편차?', options: [
        { key: 'A', text: '$\\sqrt{\\dfrac{8}{3}}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{8}{3}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '분산' },
        { key: 'C', text: '$(8/3)^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱' },
        { key: 'D', text: '$3/8$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '역수' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\sigma = \\sqrt{8/3}$.' },

  // Q11
  { chapterCode: CODE, difficulty: 'medium', concept: '4개 자료 평균', requiredSkills: SKILLS_MEAN,
    stem: '$[2, 4, 6, 8]$ 의 평균?',
    steps: [
      { stepType: 'CONCEPT', prompt: '합/$n$', options: [
        { key: 'A', text: '$(2+4+6+8)/4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(2+4+6+8)/3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$n$ 잘못' },
        { key: 'C', text: '$(2 \\cdot 4 \\cdot 6 \\cdot 8)/4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '곱' },
        { key: 'D', text: '최댓값 / 2', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '중앙값', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '다른 통계' },
      ] },
      { stepType: 'PROCESS', prompt: '$20 / 4$', options: [
        { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$20$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 누락' },
        { key: 'C', text: '$4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '개수' },
        { key: 'D', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '평균?', options: [
        { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$20$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 누락' },
        { key: 'D', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '최대' },
      ] },
    ], solution: '$20/4 = 5$.' },

  // Q12
  { chapterCode: CODE, difficulty: 'medium', concept: '4개 자료 분산', requiredSkills: SKILLS_VAR,
    stem: '$[2, 4, 6, 8]$ (평균 $5$) 의 분산?',
    steps: [
      { stepType: 'CONCEPT', prompt: '편차?', options: [
        { key: 'A', text: '$-3, -1, 1, 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3, 1, -1, -3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '뒤집힘' },
        { key: 'C', text: '$2, 4, 6, 8$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '평균 안 뺌' },
        { key: 'D', text: '$7, 9, 11, 13$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '합' },
        { key: 'E', text: '$3, 1, 1, 3$ (절댓값)', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 무시' },
      ] },
      { stepType: 'PROCESS', prompt: '제곱합 $/ 4$', options: [
        { key: 'A', text: '$(9+1+1+9)/4 = 20/4 = 5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(-3 - 1 + 1 + 3)/4 = 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '제곱 누락' },
        { key: 'C', text: '$(3+1+1+3)/4 = 2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '절댓값' },
        { key: 'D', text: '$20$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 누락' },
        { key: 'E', text: '$\\sqrt{5}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '표준편차' },
      ] },
      { stepType: 'ANSWER', prompt: '분산?', options: [
        { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '제곱 누락' },
        { key: 'C', text: '$2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '절댓값' },
        { key: 'D', text: '$20$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 누락' },
        { key: 'E', text: '$\\sqrt{5}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '표준편차' },
      ] },
    ], solution: '분산 $= (9+1+1+9)/4 = 5$.' },

  // Q13
  { chapterCode: CODE, difficulty: 'medium', concept: '4개 자료 표준편차', requiredSkills: SKILLS_STD,
    stem: '$[2, 4, 6, 8]$ (분산 $5$) 의 표준편차?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\sqrt{V}$', options: [
        { key: 'A', text: '$\\sqrt{5}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '분산 자체' },
        { key: 'C', text: '$25$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱' },
        { key: 'D', text: '$1/5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '역수' },
        { key: 'E', text: '$\\sqrt{20}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱합' },
      ] },
      { stepType: 'PROCESS', prompt: '근삿값?', options: [
        { key: 'A', text: '$\\sqrt{5} \\approx 2.24$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2$ (정수)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근삿값 잘못' },
        { key: 'C', text: '$5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '분산' },
        { key: 'D', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sqrt{20}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '나누기 누락' },
      ] },
      { stepType: 'ANSWER', prompt: '표준편차?', options: [
        { key: 'A', text: '$\\sqrt{5}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '분산' },
        { key: 'C', text: '$25$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱' },
        { key: 'D', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sqrt{20}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '나누기 누락' },
      ] },
    ], solution: '$\\sigma = \\sqrt{5}$.' },

  // Q14
  { chapterCode: CODE, difficulty: 'medium', concept: '$+c$ 변환', requiredSkills: SKILLS_TRANSFORM,
    stem: '모든 자료에 같은 수 $c$ 를 더하면 분산은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '평균 변화?', options: [
        { key: 'A', text: '평균도 $+c$ 만큼 증가 → 편차 그대로', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '평균 변화 없음', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '평균 $+c$' },
        { key: 'C', text: '평균 $\\times c$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '곱이 아니라 합' },
        { key: 'D', text: '평균 $0$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '편차 = $(x_i + c) - (\\bar{x} + c) = x_i - \\bar{x}$ 그대로', options: [
        { key: 'A', text: '편차 변화 없음 → 분산 변화 없음', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '분산 $+c$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '편차 그대로' },
        { key: 'C', text: '분산 $+c^2$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '분산 $0$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '분산 $\\times c$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '분산?', options: [
        { key: 'A', text: '변화 없음', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$+c$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '평균만 변함' },
        { key: 'C', text: '$+c^2$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\times c$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$ 으로', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '모든 자료 $+c$ → 평균 $+c$ → 편차 그대로 → 분산 변화 없음.' },

  // Q15
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\times c$ 변환', requiredSkills: SKILLS_TRANSFORM,
    stem: '모든 자료에 같은 수 $c$ 를 곱하면 분산은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '편차 변화?', options: [
        { key: 'A', text: '편차 $\\times c$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '편차 그대로', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '평균도 $\\times c$' },
        { key: 'C', text: '편차 $+c$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '곱셈인데 덧셈' },
        { key: 'D', text: '편차 $0$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '편차 $/c$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '나누기' },
      ] },
      { stepType: 'PROCESS', prompt: '분산 = 편차² 평균 = $c^2 \\times $ 원래 분산', options: [
        { key: 'A', text: '$\\times c^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\times c$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '제곱 누락' },
        { key: 'C', text: '변화 없음', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '$+c$ 와 혼동' },
        { key: 'D', text: '$+c^2$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '곱셈 아닌 덧셈' },
        { key: 'E', text: '$/c$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '분산?', options: [
        { key: 'A', text: '$c^2$ 배', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$c$ 배', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '제곱' },
        { key: 'C', text: '변화 없음', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '$\\times c$' },
        { key: 'D', text: '$+c$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1/c$ 배', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '역수' },
      ] },
    ], solution: '$\\times c$ → 편차 $\\times c$ → 편차² $\\times c^2$ → 분산 $\\times c^2$.' },

  // Q16 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '두 반 비교', requiredSkills: SKILLS_COMPARE,
    stem: '평균이 같은 두 반. 어느 반이 더 균등한 성적을 가졌는가?',
    steps: [
      { stepType: 'CONCEPT', prompt: '균등 = 평균 근처에 모임 = ?', options: [
        { key: 'A', text: '분산 작은 반', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '분산 큰 반', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '반대' },
        { key: 'C', text: '평균 큰 반', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '평균 같음' },
        { key: 'D', text: '평균 작은 반', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '평균 같음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '분산으로 가능' },
      ] },
      { stepType: 'PROCESS', prompt: '분산이 작으면?', options: [
        { key: 'A', text: '편차가 작음 → 평균 근처에 자료 집중', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '편차가 큼', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '반대' },
        { key: 'C', text: '편차 = 0', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '분산 0' },
        { key: 'D', text: '평균이 큼', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '독립' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'ANSWER', prompt: '균등 = ?', options: [
        { key: 'A', text: '분산 작은 반', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '분산 큰 반', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '반대' },
        { key: 'C', text: '판별 불가', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '가능' },
        { key: 'D', text: '평균이 큰 쪽', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '독립' },
        { key: 'E', text: '인원수 많은 쪽', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '인원수 무관' },
      ] },
    ], solution: '균등 = 평균 근처 집중 = 분산 작음.' },

  // Q17 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '5개 자료 분산', requiredSkills: SKILLS_VAR,
    stem: '$[1, 3, 5, 7, 9]$ 의 분산?',
    steps: [
      { stepType: 'CONCEPT', prompt: '평균?', options: [
        { key: 'A', text: '$25/5 = 5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$25/4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$n$ 잘못' },
        { key: 'C', text: '$10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$9$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '최대' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '최소' },
      ] },
      { stepType: 'PROCESS', prompt: '편차 $-4,-2,0,2,4$, 제곱합 $40$, $/5$', options: [
        { key: 'A', text: '$40/5 = 8$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$40$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 누락' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '편차 합' },
        { key: 'D', text: '$10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sqrt{8}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '표준편차' },
      ] },
      { stepType: 'ANSWER', prompt: '분산?', options: [
        { key: 'A', text: '$8$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$40$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 누락' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '편차 합' },
        { key: 'D', text: '$\\sqrt{8}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '표준편차' },
        { key: 'E', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '편차 $-4,-2,0,2,4$, 제곱합 $40$, 분산 $= 40/5 = 8$.' },

  // Q18 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '동일값 자료 표준편차', requiredSkills: SKILLS_STD,
    stem: '$[10, 10, 10, 10, 10]$ 의 표준편차?',
    steps: [
      { stepType: 'CONCEPT', prompt: '편차?', options: [
        { key: 'A', text: '모두 $0$ (평균과 같음)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$10, 10, 10, 10, 10$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '값 자체' },
        { key: 'C', text: '$50$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합' },
        { key: 'D', text: '$1, 1, 1, 1, 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '분산 = 0 → 표준편차?', options: [
        { key: 'A', text: '$\\sqrt{0} = 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sqrt{10}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$10$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '값 자체' },
        { key: 'E', text: '$\\sqrt{50}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '표준편차?', options: [
        { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$10$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '값 자체' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\sqrt{10}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$50$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합' },
      ] },
    ], solution: '모든 값 같음 → 편차 모두 0 → 분산 0 → 표준편차 0.' },

  // Q19 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '두 자료 표준편차 비교', requiredSkills: SKILLS_COMPARE,
    stem: '$A = [1, 3, 5]$, $B = [1, 5, 9]$. 어느 쪽 표준편차가 큰가?',
    steps: [
      { stepType: 'CONCEPT', prompt: '평균 계산?', options: [
        { key: 'A', text: 'A 평균 $3$, B 평균 $5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '둘 다 평균 $3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: 'B 다름' },
        { key: 'C', text: '평균 비교 안 됨', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '가능' },
        { key: 'D', text: 'A 평균 $9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '잘못' },
        { key: 'E', text: 'B 평균 $1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '잘못' },
      ] },
      { stepType: 'PROCESS', prompt: '분산?', options: [
        { key: 'A', text: 'A 분산 $8/3$, B 분산 $32/3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '두 자료 분산 같음', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '다름' },
        { key: 'C', text: 'A가 더 큼', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: 'B가 더 큼' },
        { key: 'D', text: 'A 분산 $0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '잘못' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'ANSWER', prompt: '큰 쪽?', options: [
        { key: 'A', text: 'B', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: 'A', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: 'B가 큼' },
        { key: 'C', text: '같음', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '다름' },
        { key: 'D', text: '판별 불가', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '가능' },
        { key: 'E', text: '평균이 작은 쪽', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '독립' },
      ] },
    ], solution: 'A 편차 $-2,0,2$, 제곱합 $8$, 분산 $8/3$. B 편차 $-4,0,4$, 제곱합 $32$, 분산 $32/3$. B가 더 큼.' },

  // Q20 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '$+c$ 변환 종합', requiredSkills: SKILLS_TRANSFORM,
    stem: '평균 $50$, 표준편차 $10$ 인 자료의 모든 값에 $5$ 를 더하면 새 평균과 표준편차?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$+5$ 변환', options: [
        { key: 'A', text: '평균 $+5$, 표준편차 변화 없음', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '평균 $+5$, 표준편차 $+5$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '표준편차 변화 없음' },
        { key: 'C', text: '평균 변화 없음, 표준편차 $+5$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '둘 다 잘못' },
        { key: 'D', text: '평균 $\\times 5$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '곱이 아닌 합' },
        { key: 'E', text: '둘 다 변화 없음', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '평균 변화' },
      ] },
      { stepType: 'PROCESS', prompt: '계산', options: [
        { key: 'A', text: '새 평균 $55$, 새 표준편차 $10$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '새 평균 $55$, 새 표준편차 $15$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '표준편차 변화' },
        { key: 'C', text: '새 평균 $50$, 새 표준편차 $15$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '잘못' },
        { key: 'D', text: '새 평균 $250$, 새 표준편차 $50$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '곱셈' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '평균 $55$, 표준편차 $10$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '평균 $55$, 표준편차 $15$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '표준편차 변화 없음' },
        { key: 'C', text: '평균 $50$, 표준편차 $10$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '평균 변화' },
        { key: 'D', text: '평균 $50$, 표준편차 $15$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '둘 다 잘못' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '가능' },
      ] },
    ], solution: '$+5$ → 평균 $+5 = 55$, 분산·표준편차 변화 없음 = $10$.' },
];

export const K_G9_MATH3_CH06_STATISTICS_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
