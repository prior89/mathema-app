/**
 * K-G7-MATH1-CH02-INTEGERS (정수와 유리수) — 20문제 3-step Mastery pool.
 *
 * 2026-05-24 사용자 spec 적용:
 *   - 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 *   - 주요 errorCode 분배:
 *       SIGN_ERROR 5 (Q1,2,3,8,15) / ARITHMETIC_ERROR 4 (Q7,9,10,12)
 *       DENOMINATOR_ERROR 4 (Q4,11,14,18) / CONCEPT_MISUNDERSTANDING 3 (Q5,6,17)
 *       CONDITION_MISSING 2 (Q16,20) / ALGEBRA_ERROR 2 (Q13,19)
 *   - 각 문제 = 3 step (CONCEPT/PROCESS/ANSWER), 각 step = 5지선다
 *   - 정답 1개 + 오답 4개, 오답마다 errorCode + errorReason
 *   - 정답 검산 완료 (Claude+사용자 수동 검토 통과 2026-05-24)
 *
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G7-MATH1-CH02-INTEGERS';
const SKILLS_BASIC = ['integer_addition', 'integer_subtraction', 'sign_handling'];
const SKILLS_MULT = ['integer_multiplication', 'integer_division', 'sign_rules'];
const SKILLS_FRAC = ['rational_addition', 'common_denominator', 'fraction_arithmetic'];
const SKILLS_MIXED = ['order_of_operations', 'integer_arithmetic', 'sign_handling'];
const SKILLS_PARENS = ['order_of_operations', 'parentheses', 'integer_arithmetic'];
const SKILLS_POWER = ['integer_power', 'negative_base_power', 'sign_rules'];

const problems: KoreanProblemSeed[] = [
  // ────────── Q1 (쉬움) -3 + (-5) = -8  · SIGN_ERROR 주요 ──────────
  {
    chapterCode: CODE, difficulty: 'easy', concept: '음수의 덧셈', requiredSkills: SKILLS_BASIC,
    stem: '$-3 + (-5)$의 값은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '이 문제를 풀려면 어떤 개념이 필요한가?',
        options: [
          { key: 'A', text: '양수의 덧셈', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '두 수 모두 음수' },
          { key: 'B', text: '음수의 덧셈 (부호가 같은 두 수)', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'C', text: '부호가 다른 두 수의 덧셈', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '두 수 모두 음수임을 인지 못함' },
          { key: 'D', text: '정수의 뺄셈', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '덧셈을 뺄셈으로 오해' },
          { key: 'E', text: '절댓값 비교', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '계산이 아닌 비교로 오해' },
        ] },
      { stepType: 'PROCESS', prompt: '음수와 음수를 더할 때 어떻게 계산하는가?',
        options: [
          { key: 'A', text: '절댓값을 더하고 양수 부호', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '음수 부호를 빠뜨림' },
          { key: 'B', text: '절댓값을 더하고 음수 부호', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'C', text: '절댓값을 빼고 양수 부호', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '같은 부호인데 빼기로 처리' },
          { key: 'D', text: '큰 수에서 작은 수 빼기', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '뺄셈 규칙 적용' },
          { key: 'E', text: '둘 다 양수로 보고 더하기', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '음수 부호 무시' },
        ] },
      { stepType: 'ANSWER', prompt: '최종 값은?',
        options: [
          { key: 'A', text: '$8$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호를 빠뜨림' },
          { key: 'B', text: '$-8$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'C', text: '$-2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '빼기로 처리 (5-3)' },
          { key: 'D', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '뺀 후 부호도 잘못' },
          { key: 'E', text: '$-15$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '곱셈으로 오해' },
        ] },
    ],
    solution: '같은 부호 두 수의 덧셈: 절댓값을 더하고 공통 부호를 붙인다. $|-3|+|-5|=8$, 두 수 모두 음수이므로 $-3+(-5)=-8$.',
  },
  // ────────── Q2 (쉬움) 7 + (-3) = 4  · SIGN_ERROR 주요 ──────────
  {
    chapterCode: CODE, difficulty: 'easy', concept: '부호가 다른 두 수의 덧셈', requiredSkills: SKILLS_BASIC,
    stem: '$7 + (-3)$의 값은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '이 문제를 풀려면 어떤 개념이 필요한가?',
        options: [
          { key: 'A', text: '부호가 다른 두 수의 덧셈', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '음수의 덧셈', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '7은 양수' },
          { key: 'C', text: '자연수의 덧셈', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '-3은 음수' },
          { key: 'D', text: '절댓값의 합', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '단순 절댓값 합 아님' },
          { key: 'E', text: '분수의 덧셈', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '정수와 무관' },
        ] },
      { stepType: 'PROCESS', prompt: '부호가 다른 두 수의 덧셈 절차는?',
        options: [
          { key: 'A', text: '두 절댓값을 더한다', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '같은 부호 규칙 잘못 적용' },
          { key: 'B', text: '절댓값이 큰 쪽에서 작은 쪽을 빼고 큰 쪽 부호', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'C', text: '절댓값이 작은 쪽 부호', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 선택 잘못' },
          { key: 'D', text: '단순히 빼고 음수 부호', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '결과 부호 무조건 음수' },
          { key: 'E', text: '그냥 두 수를 더한다', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '음수 부호 무시한 단순 합' },
        ] },
      { stepType: 'ANSWER', prompt: '최종 값은?',
        options: [
          { key: 'A', text: '$4$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$-4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '결과 부호 잘못' },
          { key: 'C', text: '$10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '두 절댓값 단순 합' },
          { key: 'D', text: '$-10$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '합 후 부호도 잘못' },
          { key: 'E', text: '$21$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곱셈으로 오해' },
        ] },
    ],
    solution: '부호 다른 두 수 덧셈: $|7|=7$, $|-3|=3$. 큰 쪽 7에서 3 빼면 4, 큰 쪽 부호 +. $\\therefore 7+(-3)=4$.',
  },
  // ────────── Q3 (쉬움) (-4) × (-3) = 12  · SIGN_ERROR 주요 ──────────
  {
    chapterCode: CODE, difficulty: 'easy', concept: '음수와 음수의 곱셈', requiredSkills: SKILLS_MULT,
    stem: '$(-4) \\times (-3)$의 값은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '이 문제에 적용되는 부호 규칙은?',
        options: [
          { key: 'A', text: '음수 × 음수 = 양수', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '음수 × 음수 = 음수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부호 규칙 잘못 기억' },
          { key: 'C', text: '같은 부호이므로 음수', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '같은 부호=음수로 잘못' },
          { key: 'D', text: '절댓값만 곱하고 부호 무시', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 규칙 미적용' },
          { key: 'E', text: '곱셈은 부호와 무관', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부호 영향 부정' },
        ] },
      { stepType: 'PROCESS', prompt: '실제 계산은?',
        options: [
          { key: 'A', text: '두 절댓값을 곱하고 양수 부호', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '두 절댓값을 곱하고 음수 부호', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
          { key: 'C', text: '두 절댓값을 더하고 양수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '덧셈으로 오해' },
          { key: 'D', text: '두 절댓값을 빼고 양수', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '뺄셈으로 오해' },
          { key: 'E', text: '두 절댓값을 곱하고 0 부호', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 미적용' },
        ] },
      { stepType: 'ANSWER', prompt: '최종 값은?',
        options: [
          { key: 'A', text: '$12$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$-12$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '음수×음수=양수 누락' },
          { key: 'C', text: '$7$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '덧셈 결과 (4+3)' },
          { key: 'D', text: '$-7$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '덧셈+부호 둘 다 잘못' },
          { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '뺄셈으로 (4-3)' },
        ] },
    ],
    solution: '같은 부호 두 수의 곱은 양수. $|-4|\\times|-3|=12$, $(-4)\\times(-3)=+12$.',
  },
  // ────────── Q4 (중간) -1/2 + 1/3 = -1/6  · DENOMINATOR_ERROR 주요 ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '유리수의 덧셈 (통분)', requiredSkills: SKILLS_FRAC,
    stem: '$\\left(-\\dfrac{1}{2}\\right) + \\dfrac{1}{3}$의 값은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '이 문제는 어떤 개념을 사용하는가?',
        options: [
          { key: 'A', text: '부호가 다른 두 유리수의 덧셈 (통분 필요)', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '분자만 더하기', isCorrect: false, errorCode: 'ADD_NUMERATOR_ONLY', errorReason: '분모 처리 누락' },
          { key: 'C', text: '분수의 곱셈', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '연산 오해' },
          { key: 'D', text: '음수의 덧셈', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '두 번째 수 양수' },
          { key: 'E', text: '크기 비교', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '계산 아님' },
        ] },
      { stepType: 'PROCESS', prompt: '계산 절차는?',
        options: [
          { key: 'A', text: '분자와 분모를 각각 더한다', isCorrect: false, errorCode: 'ADD_NUMERATOR_ONLY', errorReason: '분수 덧셈 함정' },
          { key: 'B', text: '공통 분모로 통분 후 분자끼리 부호 처리 + 덧셈', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'C', text: '분자만 통분한다', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '통분 의미 잘못' },
          { key: 'D', text: '부호를 무시하고 더하기', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '음수 부호 누락' },
          { key: 'E', text: '분모×분모, 분자×분자', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곱셈으로 오해' },
        ] },
      { stepType: 'ANSWER', prompt: '최종 값은?',
        options: [
          { key: 'A', text: '$-\\dfrac{1}{6}$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$\\dfrac{1}{6}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '결과 부호 잘못' },
          { key: 'C', text: '$0$', isCorrect: false, errorCode: 'ADD_NUMERATOR_ONLY', errorReason: '분자합 -1+1=0만' },
          { key: 'D', text: '$-\\dfrac{5}{6}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '통분 후 분자 실수' },
          { key: 'E', text: '$-\\dfrac{1}{5}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '분모를 합 (2+3)' },
        ] },
    ],
    solution: '공통 분모 6: $-\\dfrac{1}{2}=-\\dfrac{3}{6}$, $\\dfrac{1}{3}=\\dfrac{2}{6}$. $-\\dfrac{3}{6}+\\dfrac{2}{6}=-\\dfrac{1}{6}$.',
  },
  // ────────── Q5 (중간) |-7|+|3|-|-5| = 5  · CONCEPT_MIS 주요 (절댓값) ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '절댓값과 정수 연산', requiredSkills: SKILLS_MIXED,
    stem: '$|-7| + |3| - |-5|$의 값은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '절댓값 기호 $|x|$의 의미는?',
        options: [
          { key: 'A', text: '항상 양수 또는 0', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '원래 부호 그대로 유지', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '절댓값 정의 잘못' },
          { key: 'C', text: '항상 음수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '정의 반대' },
          { key: 'D', text: '부호를 반대로', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부호 변경 규칙 오해' },
          { key: 'E', text: '0이거나 음수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '음수 가능성 오해' },
        ] },
      { stepType: 'PROCESS', prompt: '식 전체를 어떻게 계산하는가?',
        options: [
          { key: 'A', text: '각 절댓값을 먼저 풀고 + - 순서대로', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '절댓값 안의 부호를 그대로', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '절댓값 무시' },
          { key: 'C', text: '모든 항을 양수로 본 후 전부 더한다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '빼기 무시' },
          { key: 'D', text: '절댓값들을 곱한다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곱셈으로 오해' },
          { key: 'E', text: '절댓값 = 0', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '절댓값 정의 모름' },
        ] },
      { stepType: 'ANSWER', prompt: '최종 값은?',
        options: [
          { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$-5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '-7 그대로 사용' },
          { key: 'C', text: '$15$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '빼기 무시 7+3+5' },
          { key: 'D', text: '$-1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부분 부호 실수' },
          { key: 'E', text: '$9$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '단순 계산 실수' },
        ] },
    ],
    solution: '$|-7|=7$, $|3|=3$, $|-5|=5$. $7+3-5=5$.',
  },
  // ────────── Q6 (쉬움) 0 - 5 = -5  · CONCEPT_MIS 주요 ──────────
  {
    chapterCode: CODE, difficulty: 'easy', concept: '0과 정수의 뺄셈', requiredSkills: SKILLS_BASIC,
    stem: '$0 - 5$의 값은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '0에서 양수를 빼면 어떤 결과인가?',
        options: [
          { key: 'A', text: '자연수의 뺄셈', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '결과 음수 가능성 인지 X' },
          { key: 'B', text: '0에서 양수를 빼면 음수', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'C', text: '0의 곱셈', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '연산 오해' },
          { key: 'D', text: '절댓값 비교', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '비교로 오해' },
          { key: 'E', text: '부호 비교', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '뺄셈을 비교로 오해' },
        ] },
      { stepType: 'PROCESS', prompt: '어떻게 계산하는가?',
        options: [
          { key: 'A', text: '그냥 0', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '0에서 빼면 0이라고 잘못' },
          { key: 'B', text: '$0 + (-5) = -5$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'C', text: '빼는 수의 절댓값', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 빠뜨림' },
          { key: 'D', text: '큰 쪽에서 작은 쪽을 뺀다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '자연수 범위 한정' },
          { key: 'E', text: '부호를 무시', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 처리 X' },
        ] },
      { stepType: 'ANSWER', prompt: '최종 값은?',
        options: [
          { key: 'A', text: '$-5$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 빠뜨림' },
          { key: 'C', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '0에서 빼면 0' },
          { key: 'D', text: '$-50$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '0을 자리수로 오해' },
          { key: 'E', text: '$-1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '단순 계산 실수' },
        ] },
    ],
    solution: '$0$에서 양수 $5$ 빼기 = $0+(-5)=-5$.',
  },
  // ────────── Q7 (쉬움) 2/3 + 1/3 = 1  · ARITHMETIC_ERROR 주요 ──────────
  {
    chapterCode: CODE, difficulty: 'easy', concept: '같은 분모 분수의 덧셈', requiredSkills: SKILLS_FRAC,
    stem: '$\\dfrac{2}{3} + \\dfrac{1}{3}$의 값은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '같은 분모를 가진 분수를 어떻게 더하는가?',
        options: [
          { key: 'A', text: '통분이 필요하다', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '이미 같은 분모 인지 X' },
          { key: 'B', text: '분모가 같으므로 분자만 합', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'C', text: '분수의 곱셈', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '연산 오해' },
          { key: 'D', text: '분모도 함께 더한다', isCorrect: false, errorCode: 'ADD_NUMERATOR_ONLY', errorReason: '분수 합의 흔한 함정' },
          { key: 'E', text: '비교만 한다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '연산 아님' },
        ] },
      { stepType: 'PROCESS', prompt: '실제 계산 절차는?',
        options: [
          { key: 'A', text: '분자만 더하고 분모 유지', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '분자와 분모 둘 다 합', isCorrect: false, errorCode: 'ADD_NUMERATOR_ONLY', errorReason: '분모도 더하는 오해' },
          { key: 'C', text: '분모끼리 곱한다', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '곱셈 규칙 잘못' },
          { key: 'D', text: '분자만 빼기', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '연산 잘못' },
          { key: 'E', text: '절댓값들을 합', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 개념' },
        ] },
      { stepType: 'ANSWER', prompt: '최종 값은?',
        options: [
          { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$\\dfrac{3}{6}$', isCorrect: false, errorCode: 'ADD_NUMERATOR_ONLY', errorReason: '분모도 더함 (3+3)' },
          { key: 'C', text: '$\\dfrac{1}{3}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '분자 차 실수' },
          { key: 'D', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '분모 무시' },
          { key: 'E', text: '$\\dfrac{2}{9}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곱셈으로 오해' },
        ] },
    ],
    solution: '같은 분모: $\\dfrac{2}{3}+\\dfrac{1}{3}=\\dfrac{2+1}{3}=\\dfrac{3}{3}=1$.',
  },
  // ────────── Q8 (쉬움) (-2) × 4 = -8  · SIGN_ERROR 주요 ──────────
  {
    chapterCode: CODE, difficulty: 'easy', concept: '음수와 양수의 곱셈', requiredSkills: SKILLS_MULT,
    stem: '$(-2) \\times 4$의 값은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '음수와 양수를 곱하면 부호는?',
        options: [
          { key: 'A', text: '음수 × 음수 규칙', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '4가 양수' },
          { key: 'B', text: '음수 × 양수 = 음수', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'C', text: '같은 부호이므로 양수', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 판단 잘못' },
          { key: 'D', text: '절댓값만 곱하고 부호 무시', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부호 규칙 무시' },
          { key: 'E', text: '덧셈으로 처리', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '연산 오해' },
        ] },
      { stepType: 'PROCESS', prompt: '계산 절차는?',
        options: [
          { key: 'A', text: '절댓값을 곱하고 양수 부호', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
          { key: 'B', text: '절댓값을 곱하고 음수 부호', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'C', text: '절댓값을 빼고 부호 양수', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '뺄셈으로' },
          { key: 'D', text: '양수로 변환 후 곱', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '음수 부호 누락' },
          { key: 'E', text: '부호 0으로', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 개념 미적용' },
        ] },
      { stepType: 'ANSWER', prompt: '최종 값은?',
        options: [
          { key: 'A', text: '$-8$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$8$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '음수 부호 누락' },
          { key: 'C', text: '$-6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '뺄셈으로' },
          { key: 'D', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '뺄셈+부호 잘못' },
          { key: 'E', text: '$-4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '덧셈으로' },
        ] },
    ],
    solution: '부호 다른 두 수 곱 = 음수. $|-2|\\times|4|=8$, 부호 음수. $\\therefore -8$.',
  },
  // ────────── Q9 (중간) -6 ÷ (-2) = 3  · ARITHMETIC_ERROR 주요 ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '정수의 나눗셈 (같은 부호)', requiredSkills: SKILLS_MULT,
    stem: '$-6 \\div (-2)$의 값은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '같은 부호 두 수 나눗셈 결과의 부호는?',
        options: [
          { key: 'A', text: '음수 ÷ 음수 = 양수', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '음수 ÷ 음수 = 음수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부호 규칙 잘못' },
          { key: 'C', text: '같은 부호니까 음수', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '결과 부호 잘못' },
          { key: 'D', text: '절댓값만 보고 부호 무시', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 규칙 미적용' },
          { key: 'E', text: '곱셈으로 변환 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '역수 관계 미인지' },
        ] },
      { stepType: 'PROCESS', prompt: '계산 절차는?',
        options: [
          { key: 'A', text: '절댓값 나누고 양수 부호', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '절댓값 나누고 음수 부호', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
          { key: 'C', text: '절댓값 합', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '덧셈으로' },
          { key: 'D', text: '절댓값 차', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '뺄셈으로' },
          { key: 'E', text: '0 부호', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 미적용' },
        ] },
      { stepType: 'ANSWER', prompt: '최종 값은?',
        options: [
          { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$-3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
          { key: 'C', text: '$4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수 (6-2)' },
          { key: 'D', text: '$-4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '뺄셈+부호 잘못' },
          { key: 'E', text: '$8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '덧셈으로 (6+2)' },
        ] },
    ],
    solution: '같은 부호 나눗셈은 양수. $|-6|\\div|-2|=3$. $\\therefore -6\\div(-2)=3$.',
  },
  // ────────── Q10 (중간) -3 + 8 - 5 = 0  · ARITHMETIC_ERROR 주요 ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '정수의 덧셈·뺄셈 혼합', requiredSkills: SKILLS_MIXED,
    stem: '$-3 + 8 - 5$의 값은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '이 식은 어떤 종류인가?',
        options: [
          { key: 'A', text: '정수의 덧셈·뺄셈 혼합 (왼쪽부터)', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '절댓값만의 식', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 무시' },
          { key: 'C', text: '부호를 다 더하기만', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '뺄셈 무시' },
          { key: 'D', text: '곱셈이 우선', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곱셈 없음' },
          { key: 'E', text: '분배법칙 적용', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '괄호 없음' },
        ] },
      { stepType: 'PROCESS', prompt: '어떻게 진행하는가?',
        options: [
          { key: 'A', text: '$-3+8$ 무시', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '항 빠뜨림' },
          { key: 'B', text: '$-3+8=5$ → $5-5=0$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'C', text: '부호 무시: $3+8-5=6$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '음수 부호 누락' },
          { key: 'D', text: '$-3-8+5=-6$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못 적용' },
          { key: 'E', text: '곱셈으로 변환', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '식 종류 잘못' },
        ] },
      { stepType: 'ANSWER', prompt: '최종 값은?',
        options: [
          { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$-6$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '연산 부호 잘못' },
          { key: 'C', text: '$6$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '-3을 양수로' },
          { key: 'D', text: '$-16$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
          { key: 'E', text: '$10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
        ] },
    ],
    solution: '왼쪽부터: $-3+8=5$, $5-5=0$.',
  },
  // ────────── Q11 (중간) 1/2 - 3/4 = -1/4  · DENOMINATOR_ERROR 주요 ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '유리수의 뺄셈 (통분)', requiredSkills: SKILLS_FRAC,
    stem: '$\\dfrac{1}{2} - \\dfrac{3}{4}$의 값은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '이 문제의 핵심 개념은?',
        options: [
          { key: 'A', text: '분모 다른 유리수의 뺄셈 (통분 필요)', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '분자만 빼면 됨', isCorrect: false, errorCode: 'ADD_NUMERATOR_ONLY', errorReason: '분모 처리 누락' },
          { key: 'C', text: '분수의 곱셈', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '연산 오해' },
          { key: 'D', text: '분모끼리 빼면 됨', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '분수 뺄셈 규칙 잘못' },
          { key: 'E', text: '비교만 한다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '비교로 오해' },
        ] },
      { stepType: 'PROCESS', prompt: '계산 절차는?',
        options: [
          { key: 'A', text: '공통 분모 4 통분 후 분자 차', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '분자와 분모 각각 차', isCorrect: false, errorCode: 'ADD_NUMERATOR_ONLY', errorReason: '분모도 차하는 함정' },
          { key: 'C', text: '분모끼리 곱 후 분자 차', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '잘못된 통분' },
          { key: 'D', text: '부호 무시하고 차', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '결과 부호 누락' },
          { key: 'E', text: '약분만', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '연산 빠뜨림' },
        ] },
      { stepType: 'ANSWER', prompt: '최종 값은?',
        options: [
          { key: 'A', text: '$-\\dfrac{1}{4}$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$\\dfrac{1}{4}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '결과 부호 잘못' },
          { key: 'C', text: '$-\\dfrac{2}{2}$', isCorrect: false, errorCode: 'ADD_NUMERATOR_ONLY', errorReason: '분모도 차 (4-2)' },
          { key: 'D', text: '$-\\dfrac{1}{2}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '통분 안 함' },
          { key: 'E', text: '$-\\dfrac{1}{8}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '분모를 곱 (2×4)' },
        ] },
    ],
    solution: '공통 분모 4: $\\dfrac{1}{2}=\\dfrac{2}{4}$. $\\dfrac{2}{4}-\\dfrac{3}{4}=-\\dfrac{1}{4}$.',
  },
  // ────────── Q12 (중간) (-1)+(-2)+(-3)+6 = 0  · ARITHMETIC_ERROR 주요 ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '여러 정수의 합', requiredSkills: SKILLS_MIXED,
    stem: '$(-1) + (-2) + (-3) + 6$의 값은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '이 식의 구조는?',
        options: [
          { key: 'A', text: '음수 합 + 양수의 덧셈', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '절댓값만 합', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '음수 부호 무시' },
          { key: 'C', text: '곱셈식', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '연산 잘못' },
          { key: 'D', text: '절댓값 차', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '연산 잘못' },
          { key: 'E', text: '평균 계산', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '문제 종류 잘못' },
        ] },
      { stepType: 'PROCESS', prompt: '효율적인 계산 순서는?',
        options: [
          { key: 'A', text: '부호 무시: $1+2+3+6=12$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '음수 무시' },
          { key: 'B', text: '음수 합 $-6$ + $6$ = $0$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'C', text: '$-1-2-3-6=-12$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '+6을 -6으로' },
          { key: 'D', text: '음수 셋 빼고 6만', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '항 빠뜨림' },
          { key: 'E', text: '$6-(-1-2-3)=12$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '식 변형 잘못' },
        ] },
      { stepType: 'ANSWER', prompt: '최종 값은?',
        options: [
          { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$-12$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
          { key: 'C', text: '$12$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '모든 부호 무시' },
          { key: 'D', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '음수 셋 빠뜨림' },
          { key: 'E', text: '$-6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '+6 빠뜨림' },
        ] },
    ],
    solution: '음수 셋 합: $-1-2-3=-6$. $-6+6=0$.',
  },
  // ────────── Q13 (중간) (-2/5)×(-10/3) = 4/3  · ALGEBRA_ERROR 주요 ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '분수의 곱셈 + 약분', requiredSkills: SKILLS_FRAC,
    stem: '$\\left(-\\dfrac{2}{5}\\right) \\times \\left(-\\dfrac{10}{3}\\right)$의 값은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '이 문제의 핵심은?',
        options: [
          { key: 'A', text: '음수×음수=양수 + 분수의 곱셈', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '분자분모 따로 처리', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곱셈 규칙 오해' },
          { key: 'C', text: '음수×음수=음수', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 규칙 잘못' },
          { key: 'D', text: '통분 후 곱', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '곱셈에 통분 불필요' },
          { key: 'E', text: '약분 불가', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '약분 가능성 인지 X' },
        ] },
      { stepType: 'PROCESS', prompt: '실제 계산은?',
        options: [
          { key: 'A', text: '분모×분모, 분자+분자', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '분자만 덧셈 식 변형 오류' },
          { key: 'B', text: '분자×분자 / 분모×분모 후 약분', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'C', text: '통분 후 분자 곱', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '곱셈에 통분' },
          { key: 'D', text: '부호 음수', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
          { key: 'E', text: '역수의 곱', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '나눗셈 규칙 잘못 적용' },
        ] },
      { stepType: 'ANSWER', prompt: '최종 값은?',
        options: [
          { key: 'A', text: '$\\dfrac{4}{3}$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$-\\dfrac{4}{3}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '음수×음수=양수 누락' },
          { key: 'C', text: '$\\dfrac{20}{15}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '약분 안 함' },
          { key: 'D', text: '$\\dfrac{2}{3}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '약분 분자 잘못' },
          { key: 'E', text: '$\\dfrac{4}{15}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '약분 분모 잘못' },
        ] },
    ],
    solution: '$(-2/5)\\times(-10/3)=\\dfrac{(-2)(-10)}{5\\cdot 3}=\\dfrac{20}{15}=\\dfrac{4}{3}$.',
  },
  // ────────── Q14 (중간) 3/4 ÷ (-1/2) = -3/2  · DENOMINATOR_ERROR 주요 ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '분수의 나눗셈 (역수)', requiredSkills: SKILLS_FRAC,
    stem: '$\\dfrac{3}{4} \\div \\left(-\\dfrac{1}{2}\\right)$의 값은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '분수 나눗셈의 핵심 규칙은?',
        options: [
          { key: 'A', text: '나누는 수의 역수를 곱 + 부호 처리', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '분자분모 따로 나눔', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 규칙' },
          { key: 'C', text: '역수를 안 취해도 됨', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '핵심 규칙 누락' },
          { key: 'D', text: '통분 후 나눔', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '잘못된 절차' },
          { key: 'E', text: '같은 부호로 처리', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 판단 잘못' },
        ] },
      { stepType: 'PROCESS', prompt: '실제 계산은?',
        options: [
          { key: 'A', text: '나누는 수 역수를 곱 + 부호 처리', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '분자÷분자, 분모÷분모', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '잘못된 식 변형' },
          { key: 'C', text: '그냥 곱셈으로', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '역수 빠뜨림' },
          { key: 'D', text: '분모만 역수', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '역수를 부분 적용' },
          { key: 'E', text: '부호 양수', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
        ] },
      { stepType: 'ANSWER', prompt: '최종 값은?',
        options: [
          { key: 'A', text: '$-\\dfrac{3}{2}$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$\\dfrac{3}{2}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 양수로 잘못' },
          { key: 'C', text: '$-\\dfrac{3}{8}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '역수 안 취하고 곱셈' },
          { key: 'D', text: '$-\\dfrac{8}{3}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '결과 뒤집힘' },
          { key: 'E', text: '$-\\dfrac{6}{4}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '약분 안 함' },
        ] },
    ],
    solution: '$\\dfrac{3}{4}\\div\\left(-\\dfrac{1}{2}\\right)=\\dfrac{3}{4}\\times\\left(-\\dfrac{2}{1}\\right)=-\\dfrac{6}{4}=-\\dfrac{3}{2}$.',
  },
  // ────────── Q15 (중간) 5 - (-3) + (-7) = 1  · SIGN_ERROR 주요 ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '음의 음수 처리', requiredSkills: SKILLS_MIXED,
    stem: '$5 - (-3) + (-7)$의 값은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '이 문제의 핵심 개념은?',
        options: [
          { key: 'A', text: '뺄셈을 덧셈으로 + 음의 음수 = 양수', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '부호 그대로 두고 계산', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '음의 음수 처리 누락' },
          { key: 'C', text: '절댓값만 처리', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 무시' },
          { key: 'D', text: '곱셈 우선', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곱셈 없음' },
          { key: 'E', text: '부호 무관', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부호 영향 부정' },
        ] },
      { stepType: 'PROCESS', prompt: '구체적 계산 절차는?',
        options: [
          { key: 'A', text: '$5-3+(-7)=-5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-(-3)$을 $-3$으로 잘못' },
          { key: 'B', text: '$5+3-7=1$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'C', text: '$5-(-3)=2, 2-7=-5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '첫 변환 잘못' },
          { key: 'D', text: '$5+(-3)+(-7)=-5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-(-3)$=+3 못 봄' },
          { key: 'E', text: '절댓값 합', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 다 무시' },
        ] },
      { stepType: 'ANSWER', prompt: '최종 값은?',
        options: [
          { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$-5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '음의 음수 처리 X' },
          { key: 'C', text: '$15$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '모든 항 양수로 합' },
          { key: 'D', text: '$-1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 부분 잘못' },
          { key: 'E', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '단계 일부 누락' },
        ] },
    ],
    solution: '$-(-3)=+3$이므로 $5-(-3)+(-7)=5+3-7=1$.',
  },
  // ────────── Q16 (어려움) {-3+(-4)}×(-2) = 14  · CONDITION_MISSING 주요 ──────────
  {
    chapterCode: CODE, difficulty: 'hard', concept: '괄호 + 부호 + 곱셈', requiredSkills: SKILLS_PARENS,
    stem: '$\\{-3 + (-4)\\} \\times (-2)$의 값은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '이 문제의 핵심 절차는?',
        options: [
          { key: 'A', text: '괄호 안 먼저 + 음수×음수=양수', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '왼쪽부터 순차 계산', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '괄호 우선 규칙 놓침' },
          { key: 'C', text: '분배법칙만 사용', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '본 절차 대신 변형' },
          { key: 'D', text: '절댓값만 처리', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 무시' },
          { key: 'E', text: '음수×음수=음수', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 규칙 잘못' },
        ] },
      { stepType: 'PROCESS', prompt: '계산 순서는?',
        options: [
          { key: 'A', text: '$-3\\times(-2)-4=2$ (괄호 무시)', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '괄호 무시한 잘못된 계산' },
          { key: 'B', text: '괄호 안 $-7$ → $-7\\times(-2)=14$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'C', text: '$-3+(-4\\times(-2))=5$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '괄호 위치 무시' },
          { key: 'D', text: '절댓값 곱 후 음수: $-14$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
          { key: 'E', text: '$0\\times(-2)=0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '괄호 안 계산 실수' },
        ] },
      { stepType: 'ANSWER', prompt: '최종 값은?',
        options: [
          { key: 'A', text: '$14$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$-14$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '음수×음수 누락' },
          { key: 'C', text: '$2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '괄호 무시한 계산' },
          { key: 'D', text: '$5$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '괄호 무시 다른 패턴' },
          { key: 'E', text: '$-2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '괄호 무시 + 부호 잘못' },
        ] },
    ],
    solution: '괄호 안 먼저: $-3+(-4)=-7$. 그 다음 $-7\\times(-2)=14$ (음수×음수=양수).',
  },
  // ────────── Q17 (어려움) (-1)^5 - (-1)^4 = -2  · CONCEPT_MIS 주요 ──────────
  {
    chapterCode: CODE, difficulty: 'hard', concept: '음수의 거듭제곱', requiredSkills: SKILLS_POWER,
    stem: '$(-1)^5 - (-1)^4$의 값은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '음수의 거듭제곱 부호 규칙은?',
        options: [
          { key: 'A', text: '지수가 홀수면 음수, 짝수면 양수', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '항상 양수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '거듭제곱 부호 모름' },
          { key: 'C', text: '항상 음수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '거듭제곱 부호 모름' },
          { key: 'D', text: '부호 무관', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부호 영향 부정' },
          { key: 'E', text: '지수 = 곱셈 횟수만 의미', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부호 처리 미인지' },
        ] },
      { stepType: 'PROCESS', prompt: '각 항을 어떻게 계산하는가?',
        options: [
          { key: 'A', text: '$(-1)^5=-1$, $(-1)^4=1$ → $-1-1$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '둘 다 $1$: $1-1=0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부호 무시' },
          { key: 'C', text: '둘 다 $-1$: $-1-(-1)=0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '짝수 지수도 음수로' },
          { key: 'D', text: '$-1\\times 5=-5$, $-1\\times 4=-4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '거듭제곱을 곱셈으로' },
          { key: 'E', text: '지수만 빼기: $5-4=1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '식 해석 잘못' },
        ] },
      { stepType: 'ANSWER', prompt: '최종 값은?',
        options: [
          { key: 'A', text: '$-2$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '둘 다 1로 계산' },
          { key: 'C', text: '$2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '1-(-1) 같은 부호 잘못' },
          { key: 'D', text: '$-1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '단순 계산 실수' },
          { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '지수 차로 오해' },
        ] },
    ],
    solution: '$(-1)^5=-1$ (홀수 지수), $(-1)^4=1$ (짝수 지수). $-1-1=-2$.',
  },
  // ────────── Q18 (어려움) -3/4 - (-1/6) + (-5/12) = -1  · DENOMINATOR_ERROR 주요 ──────────
  {
    chapterCode: CODE, difficulty: 'hard', concept: '분수의 덧셈·뺄셈 혼합', requiredSkills: SKILLS_FRAC,
    stem: '$-\\dfrac{3}{4} - \\left(-\\dfrac{1}{6}\\right) + \\left(-\\dfrac{5}{12}\\right)$의 값은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '이 문제의 핵심은?',
        options: [
          { key: 'A', text: '분수 덧·뺄셈 + 음의 음수 + 통분', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '절댓값만 처리', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 무시' },
          { key: 'C', text: '분자분모 따로', isCorrect: false, errorCode: 'ADD_NUMERATOR_ONLY', errorReason: '분수 합 함정' },
          { key: 'D', text: '곱셈으로', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '연산 잘못' },
          { key: 'E', text: '순서 무관', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '순서 미인지' },
        ] },
      { stepType: 'PROCESS', prompt: '실제 계산 절차는?',
        options: [
          { key: 'A', text: '공통분모 $12$ 통분 + 부호 처리 + 분자 합', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '분모를 합', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '잘못된 통분' },
          { key: 'C', text: '통분 안 하고 분자 차', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '통분 누락' },
          { key: 'D', text: '음의 음수 미처리: $-3/4-1/6-5/12$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-(-1/6)$=+1/6 못 봄' },
          { key: 'E', text: '분자만 합', isCorrect: false, errorCode: 'ADD_NUMERATOR_ONLY', errorReason: '분모 무시' },
        ] },
      { stepType: 'ANSWER', prompt: '최종 값은?',
        options: [
          { key: 'A', text: '$-1$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$-\\dfrac{3}{2}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '통분/약분 실수' },
          { key: 'C', text: '$1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '결과 부호 잘못' },
          { key: 'D', text: '$-\\dfrac{7}{12}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '음의 음수 미처리' },
          { key: 'E', text: '$-\\dfrac{9}{12}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '마지막 항 무시' },
        ] },
    ],
    solution: '공통분모 12 통분: $-\\dfrac{9}{12}+\\dfrac{2}{12}-\\dfrac{5}{12}=-\\dfrac{12}{12}=-1$.',
  },
  // ────────── Q19 (어려움) {(-2)^2-(-3)^2}÷(-1) = 5  · ALGEBRA_ERROR 주요 ──────────
  {
    chapterCode: CODE, difficulty: 'hard', concept: '거듭제곱 + 괄호 + 나눗셈', requiredSkills: SKILLS_POWER,
    stem: '$\\{(-2)^2 - (-3)^2\\} \\div (-1)$의 값은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '계산 순서의 핵심은?',
        options: [
          { key: 'A', text: '괄호 → 거듭제곱 → 나눗셈, 짝수 지수는 양수', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '분배법칙으로 변형', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '본 절차 대신 식 변형' },
          { key: 'C', text: '$-2^2=-4$로 처리', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$(-2)^2$ vs $-2^2$ 혼동' },
          { key: 'D', text: '절댓값만', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 무시' },
          { key: 'E', text: '짝수 지수=음수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부호 규칙 잘못' },
        ] },
      { stepType: 'PROCESS', prompt: '계산 순서는?',
        options: [
          { key: 'A', text: '$(-2)^2=4$, $(-3)^2=9$ → $4-9=-5$ → $-5\\div(-1)=5$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$-2^2=-4$로 시작', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '괄호 거듭제곱 혼동' },
          { key: 'C', text: '$4-9=-5$, $-5\\div(-1)=-5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '나눗셈 부호 잘못' },
          { key: 'D', text: '분배: $(-2)^2\\div(-1) - (-3)^2\\div(-1)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '본 절차 대신 분배' },
          { key: 'E', text: '$4+9=13$ 후 $\\div(-1)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '뺄셈을 덧셈으로' },
        ] },
      { stepType: 'ANSWER', prompt: '최종 값은?',
        options: [
          { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$-5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '나눗셈 후 부호 잘못' },
          { key: 'C', text: '$-1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
          { key: 'D', text: '$13$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '뺄셈을 덧셈으로' },
          { key: 'E', text: '$-13$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '덧셈 + 부호 잘못' },
        ] },
    ],
    solution: '$(-2)^2=4$, $(-3)^2=9$. 괄호 안 $4-9=-5$. 나눗셈 $-5\\div(-1)=5$.',
  },
  // ────────── Q20 (어려움) 2/3 × {(-1/4)-1/6} = -5/18  · CONDITION_MISSING 주요 ──────────
  {
    chapterCode: CODE, difficulty: 'hard', concept: '괄호 + 분수 + 곱셈', requiredSkills: SKILLS_PARENS,
    stem: '$\\dfrac{2}{3} \\times \\left\\{\\left(-\\dfrac{1}{4}\\right) - \\dfrac{1}{6}\\right\\}$의 값은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '이 문제의 핵심 절차는?',
        options: [
          { key: 'A', text: '괄호 안 먼저 (통분 + 뺄셈) → 분수 곱셈', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '분배 후 곱', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '본 절차 대신 식 변형' },
          { key: 'C', text: '통분 무시', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '통분 미실시' },
          { key: 'D', text: '곱셈 우선', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '괄호 무시' },
          { key: 'E', text: '분자/분모 각각', isCorrect: false, errorCode: 'ADD_NUMERATOR_ONLY', errorReason: '분수 곱셈 규칙 잘못' },
        ] },
      { stepType: 'PROCESS', prompt: '실제 계산 절차는?',
        options: [
          { key: 'A', text: '괄호 안 $-\\dfrac{5}{12}$ → $\\dfrac{2}{3}\\times\\left(-\\dfrac{5}{12}\\right)$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '부호 무시: $\\dfrac{2}{3}\\times(\\dfrac{1}{4}-\\dfrac{1}{6})=\\dfrac{1}{18}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '음수 부호 누락' },
          { key: 'C', text: '통분 안 하고 분자 차', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '통분 미실시' },
          { key: 'D', text: '곱셈 우선: $\\dfrac{2}{3}\\times(-\\dfrac{1}{4})-\\dfrac{1}{6}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '괄호 무시' },
          { key: 'E', text: '약분 잘못 후 진행', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '식 변형 실수' },
        ] },
      { stepType: 'ANSWER', prompt: '최종 값은?',
        options: [
          { key: 'A', text: '$-\\dfrac{5}{18}$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$\\dfrac{5}{18}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
          { key: 'C', text: '$-\\dfrac{1}{12}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '곱셈 빠뜨림' },
          { key: 'D', text: '$-\\dfrac{1}{9}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '곱셈 우선으로 잘못' },
          { key: 'E', text: '$-\\dfrac{5}{12}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '마지막 곱셈 누락' },
        ] },
    ],
    solution: '괄호 안: $-\\dfrac{1}{4}-\\dfrac{1}{6}=-\\dfrac{3}{12}-\\dfrac{2}{12}=-\\dfrac{5}{12}$. 곱셈: $\\dfrac{2}{3}\\times\\left(-\\dfrac{5}{12}\\right)=-\\dfrac{10}{36}=-\\dfrac{5}{18}$.',
  },
];

export const K_G7_MATH1_CH02_INTEGERS_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
