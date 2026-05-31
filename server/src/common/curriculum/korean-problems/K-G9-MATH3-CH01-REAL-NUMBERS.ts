/**
 * K-G9-MATH3-CH01-REAL-NUMBERS (실수 — 제곱근과 무리수) — 20문제 3-step Mastery.
 * 중3 — 제곱근 정의 → 무리수 → 실수 정의 → 제곱근 간단히 → 사칙 → 분모 유리화.
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 * 주요 errorCode 분배:
 *   DENOMINATOR_ERROR 5 (Q13,14,15,17,19) / ARITHMETIC_ERROR 4 (Q1,3,9,18)
 *   ALGEBRA_ERROR 4 (Q7,8,10,11) / CONCEPT_MISUNDERSTANDING 3 (Q2,5,6)
 *   FORMULA_SELECTION_ERROR 2 (Q4,12) / SIMPLIFICATION_ERROR 1 (Q16) / CONDITION_MISSING 1 (Q20)
 *
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G9-MATH3-CH01-REAL-NUMBERS';
const SKILLS_DEF = ['square_root_definition', 'irrational_number'];
const SKILLS_BASIC = ['perfect_square_root', 'evaluate_root'];
const SKILLS_SIMPLIFY = ['root_simplification', 'factor_out_perfect_square'];
const SKILLS_ARITH = ['root_addition_subtraction', 'like_radicals'];
const SKILLS_MULT = ['root_multiplication_division'];
const SKILLS_RATIONALIZE = ['rationalize_denominator', 'conjugate'];
const SKILLS_FORMULA = ['multiplication_formula_with_roots'];

const problems: KoreanProblemSeed[] = [
  // Q1
  { chapterCode: CODE, difficulty: 'easy', concept: '제곱근 (제곱수)', requiredSkills: SKILLS_BASIC,
    stem: '$\\sqrt{9}$ 의 값은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\sqrt{a}$ 의 정의?', options: [
        { key: 'A', text: '제곱하면 $a$ 가 되는 음 아닌 수', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a$ 를 제곱한 값', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '거꾸로' },
        { key: 'C', text: '$a$ 의 반', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$a$ 의 절댓값', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$a$ 의 두 배', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$? ^ 2 = 9$', options: [
        { key: 'A', text: '$3$ (또는 $-3$이지만 양의 제곱근만)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4.5$ (반)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기' },
        { key: 'C', text: '$81$ (제곱)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '거꾸로' },
        { key: 'D', text: '$18$ (두 배)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sqrt{9}$ 그대로', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '계산 가능' },
      ] },
      { stepType: 'ANSWER', prompt: '$\\sqrt{9} = ?$', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\pm 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sqrt{\\cdot}$ 기호는 음 아닌 값' },
        { key: 'C', text: '$81$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '제곱' },
        { key: 'D', text: '$4.5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '변화 없음' },
      ] },
    ], solution: '$\\sqrt{9} = 3$ ($3^2 = 9$).' },

  // Q2
  { chapterCode: CODE, difficulty: 'easy', concept: '무리수 판별', requiredSkills: SKILLS_DEF,
    stem: '$\\sqrt{2}$ 는 유리수인가 무리수인가?',
    steps: [
      { stepType: 'CONCEPT', prompt: '무리수의 정의?', options: [
        { key: 'A', text: '분수로 표현할 수 없는 실수 (순환하지 않는 무한소수)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '정수가 아닌 모든 수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '분수도 정수 아니지만 유리수' },
        { key: 'C', text: '제곱근 기호가 있는 수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sqrt{9}=3$은 유리수' },
        { key: 'D', text: '음수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '소수 (decimal)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '유한·순환소수는 유리수' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\sqrt{2}$ 의 소수 표현?', options: [
        { key: 'A', text: '$1.41421356\\ldots$ — 순환하지 않는 무한소수', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1.5$ (유한)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근삿값' },
        { key: 'C', text: '$1.4$ (유한)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근삿값' },
        { key: 'D', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$\\sqrt{2}$ 는?', options: [
        { key: 'A', text: '무리수', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '유리수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '분수 표현 불가' },
        { key: 'C', text: '정수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '정수 아님' },
        { key: 'D', text: '자연수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '명확함' },
      ] },
    ], solution: '$\\sqrt{2}$ 는 분수로 표현 불가능 → 무리수.' },

  // Q3
  { chapterCode: CODE, difficulty: 'easy', concept: '제곱근 (16)', requiredSkills: SKILLS_BASIC,
    stem: '$\\sqrt{16} = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$?^2 = 16$', options: [
        { key: 'A', text: '$4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$8$ (반)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기' },
        { key: 'C', text: '$256$ (제곱)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '거꾸로' },
        { key: 'D', text: '$32$ (두 배)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$4^2 = 16$ 확인', options: [
        { key: 'A', text: '$4 \\times 4 = 16$ ✓', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4 + 4 = 8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합' },
        { key: 'C', text: '$4 \\cdot 4 = 8$ (잘못)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 잘못' },
        { key: 'D', text: '$4 / 2 = 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$4 \\div 4 = 1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$\\sqrt{16} = ?$', options: [
        { key: 'A', text: '$4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\pm 4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sqrt{}$ 기호는 음 아님' },
        { key: 'D', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$16$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '변화 없음' },
      ] },
    ], solution: '$\\sqrt{16} = 4$.' },

  // Q4
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\sqrt{a^2}$', requiredSkills: SKILLS_DEF,
    stem: '$a > 0$ 일 때 $\\sqrt{a^2}$ 는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\sqrt{a^2}$ 의 정의?', options: [
        { key: 'A', text: '$|a|$ (절댓값)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a$ 만 (부호 무시)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$a<0$이면 $-a$' },
        { key: 'C', text: '$a^2$ 그대로', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근 안 함' },
        { key: 'D', text: '$\\pm a$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sqrt{}$ 음 아님' },
        { key: 'E', text: '$2a$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$a > 0$ 이므로 $|a| = ?$', options: [
        { key: 'A', text: '$a$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-a$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '음수 가정' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$a^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근 적용 안 함' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$\\sqrt{a^2} = ?$', options: [
        { key: 'A', text: '$a$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\pm a$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sqrt{}$ 음 아님' },
        { key: 'C', text: '$-a$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$a>0$' },
        { key: 'D', text: '$a^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근 안 함' },
        { key: 'E', text: '$2a$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$a > 0$ 이므로 $\\sqrt{a^2} = |a| = a$.' },

  // Q5
  { chapterCode: CODE, difficulty: 'easy', concept: '무리수 식별', requiredSkills: SKILLS_DEF,
    stem: '다음 중 무리수인 것은? ① $\\sqrt{4}$ ② $\\sqrt{7}$ ③ $0.5$ ④ $\\dfrac{3}{4}$ ⑤ $-2$',
    steps: [
      { stepType: 'CONCEPT', prompt: '제곱수의 제곱근은?', options: [
        { key: 'A', text: '유리수 (예: $\\sqrt{4} = 2$)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '항상 무리수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sqrt{4}=2$ 유리수' },
        { key: 'C', text: '소수만', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '판별 가능' },
        { key: 'E', text: '항상 음수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '각각 분류?', options: [
        { key: 'A', text: '①$=2$ 유, ②무, ③유한소수 유, ④분수 유, ⑤정수 유 → ②만 무리수', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '①도 무리수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$=2$ 유리수' },
        { key: 'C', text: '③도 무리수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '유한소수' },
        { key: 'D', text: '⑤도 무리수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '정수' },
        { key: 'E', text: '모두 유리수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sqrt{7}$은 무리수' },
      ] },
      { stepType: 'ANSWER', prompt: '무리수는?', options: [
        { key: 'A', text: '② $\\sqrt{7}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '① $\\sqrt{4}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$=2$ 유리수' },
        { key: 'C', text: '③ $0.5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '유한소수' },
        { key: 'D', text: '④ $\\dfrac{3}{4}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '분수' },
        { key: 'E', text: '⑤ $-2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '정수' },
      ] },
    ], solution: '$\\sqrt{4} = 2$ (유리수), $\\sqrt{7}$ 만 무리수 (제곱수 아님).' },

  // Q6
  { chapterCode: CODE, difficulty: 'easy', concept: '실수 정의', requiredSkills: SKILLS_DEF,
    stem: '실수는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '실수의 구성?', options: [
        { key: 'A', text: '유리수와 무리수의 합', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '유리수만', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '무리수도 실수' },
        { key: 'C', text: '무리수만', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '유리수도 실수' },
        { key: 'D', text: '정수만', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '자연수만', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '수직선 위의 모든 점?', options: [
        { key: 'A', text: '실수와 일대일 대응', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '유리수만 대응', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '무리수도 점' },
        { key: 'C', text: '점이 듬성듬성', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '연속' },
        { key: 'D', text: '정수만 대응', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '복소수 포함', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '복소수는 수직선 밖' },
      ] },
      { stepType: 'ANSWER', prompt: '실수 = ?', options: [
        { key: 'A', text: '유리수 $\\cup$ 무리수', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '유리수 $\\cap$ 무리수 (공집합)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '교집합 잘못' },
        { key: 'C', text: '유리수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부분만' },
        { key: 'D', text: '무리수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부분만' },
        { key: 'E', text: '정수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '실수 = 유리수 $\\cup$ 무리수.' },

  // Q7
  { chapterCode: CODE, difficulty: 'medium', concept: '제곱근 간단히 (12)', requiredSkills: SKILLS_SIMPLIFY,
    stem: '$\\sqrt{12}$ 를 가장 간단한 꼴로?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$12$ 를 제곱수와의 곱으로?', options: [
        { key: 'A', text: '$12 = 4 \\cdot 3$ — $4$가 제곱수', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$12 = 2 \\cdot 6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '제곱수 없음' },
        { key: 'C', text: '$12 = 3 \\cdot 4$ — 같음 (순서)', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '맞지만 표현 어색' },
        { key: 'D', text: '$12$ 는 제곱수가 아니라서 더 간단히 안 됨', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '제곱수 $4$ 포함' },
        { key: 'E', text: '$12 = 9 + 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '합' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\sqrt{4 \\cdot 3} = \\sqrt{4} \\cdot \\sqrt{3}$', options: [
        { key: 'A', text: '$2\\sqrt{3}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2 + \\sqrt{3}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '합' },
        { key: 'C', text: '$4\\sqrt{3}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근 안 함' },
        { key: 'D', text: '$\\sqrt{12}$ 그대로', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '간단히 안 함' },
        { key: 'E', text: '$3\\sqrt{2}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$2\\sqrt{3}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3\\sqrt{2}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$4\\sqrt{3}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근 안 함' },
        { key: 'D', text: '$\\sqrt{12}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '간단히 안 함' },
        { key: 'E', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\sqrt{12} = \\sqrt{4 \\cdot 3} = 2\\sqrt{3}$.' },

  // Q8
  { chapterCode: CODE, difficulty: 'medium', concept: '제곱근 간단히 (50)', requiredSkills: SKILLS_SIMPLIFY,
    stem: '$\\sqrt{50}$ 를 간단히 하면?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$50 = ?$', options: [
        { key: 'A', text: '$25 \\cdot 2$ — $25$가 제곱수', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5 \\cdot 10$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '제곱수 없음' },
        { key: 'C', text: '$2 \\cdot 25$ (같음)', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '같음 (어순)' },
        { key: 'D', text: '$50$ 그대로 (간단히 안 됨)', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$25$ 있음' },
        { key: 'E', text: '$10 \\cdot 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '제곱수 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\sqrt{25 \\cdot 2}$', options: [
        { key: 'A', text: '$5\\sqrt{2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$25\\sqrt{2}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근 안 함' },
        { key: 'C', text: '$5 + \\sqrt{2}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '합' },
        { key: 'D', text: '$2\\sqrt{5}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sqrt{50}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '간단히 안 함' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$5\\sqrt{2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$25\\sqrt{2}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근 안 함' },
        { key: 'C', text: '$2\\sqrt{5}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\sqrt{50}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '간단히 안 함' },
        { key: 'E', text: '$10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\sqrt{50} = \\sqrt{25 \\cdot 2} = 5\\sqrt{2}$.' },

  // Q9
  { chapterCode: CODE, difficulty: 'medium', concept: '같은 근 덧셈', requiredSkills: SKILLS_ARITH,
    stem: '$3\\sqrt{2} + 5\\sqrt{2} = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '근호 부분 같으면?', options: [
        { key: 'A', text: '계수 부분만 합산 (동류 근호)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '근호 부분도 합산', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근호는 그대로' },
        { key: 'C', text: '곱셈', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '덧셈' },
        { key: 'D', text: '근호 무시', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '필요' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$3 + 5 = ?$', options: [
        { key: 'A', text: '$8$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$15$ (곱)', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '곱' },
        { key: 'C', text: '$2$ (차)', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '차' },
        { key: 'D', text: '$\\dfrac{3}{5}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$35$ (붙임)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$8\\sqrt{2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$15\\sqrt{2}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '곱' },
        { key: 'C', text: '$8\\sqrt{4}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근호 합' },
        { key: 'D', text: '$8 + \\sqrt{2}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '분리' },
        { key: 'E', text: '$\\sqrt{8}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '동류 근호: $3\\sqrt{2} + 5\\sqrt{2} = (3+5)\\sqrt{2} = 8\\sqrt{2}$.' },

  // Q10
  { chapterCode: CODE, difficulty: 'medium', concept: '근 간단히 후 덧셈', requiredSkills: SKILLS_ARITH,
    stem: '$\\sqrt{8} + \\sqrt{2} = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '먼저 $\\sqrt{8}$ 간단히?', options: [
        { key: 'A', text: '$\\sqrt{4 \\cdot 2} = 2\\sqrt{2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sqrt{8}$ 그대로', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '간단히 가능' },
        { key: 'C', text: '$8$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근 안 함' },
        { key: 'D', text: '$2\\sqrt{4}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '잘못' },
        { key: 'E', text: '$4\\sqrt{2}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근 안 함' },
      ] },
      { stepType: 'PROCESS', prompt: '$2\\sqrt{2} + \\sqrt{2}$', options: [
        { key: 'A', text: '$(2 + 1)\\sqrt{2} = 3\\sqrt{2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2\\sqrt{2 + 2} = 2\\sqrt{4} = 4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근호 합' },
        { key: 'C', text: '$3\\sqrt{4}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근호 합' },
        { key: 'D', text: '$\\sqrt{10}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '안 사이 합' },
        { key: 'E', text: '$2\\sqrt{4}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$3\\sqrt{2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sqrt{10}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근호 안 더함' },
        { key: 'C', text: '$2\\sqrt{2}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$\\sqrt{2}$ 누락' },
        { key: 'D', text: '$\\sqrt{8} + \\sqrt{2}$ 그대로', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '간단히 안 함' },
        { key: 'E', text: '$4\\sqrt{2}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '계산 잘못' },
      ] },
    ], solution: '$\\sqrt{8} + \\sqrt{2} = 2\\sqrt{2} + \\sqrt{2} = 3\\sqrt{2}$.' },

  // Q11
  { chapterCode: CODE, difficulty: 'medium', concept: '근 곱셈', requiredSkills: SKILLS_MULT,
    stem: '$\\sqrt{3} \\times \\sqrt{5} = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\sqrt{a} \\cdot \\sqrt{b}$?', options: [
        { key: 'A', text: '$\\sqrt{ab}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sqrt{a + b}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '합' },
        { key: 'C', text: '$ab$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근 안 함' },
        { key: 'D', text: '$\\sqrt{a} + \\sqrt{b}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '합' },
        { key: 'E', text: '$\\sqrt[2]{a/b}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\sqrt{3 \\cdot 5}$', options: [
        { key: 'A', text: '$\\sqrt{15}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sqrt{8}$ (합)', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '합' },
        { key: 'C', text: '$15$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근 안 함' },
        { key: 'D', text: '$3 + 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '합' },
        { key: 'E', text: '$\\sqrt{3} + \\sqrt{5}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '합' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$\\sqrt{15}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$15$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근 안 함' },
        { key: 'C', text: '$\\sqrt{8}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '합' },
        { key: 'D', text: '$\\sqrt{3} + \\sqrt{5}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$15\\sqrt{2}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\sqrt{3} \\times \\sqrt{5} = \\sqrt{15}$.' },

  // Q12
  { chapterCode: CODE, difficulty: 'medium', concept: '근 나눗셈', requiredSkills: SKILLS_MULT,
    stem: '$\\dfrac{\\sqrt{20}}{\\sqrt{5}} = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\dfrac{\\sqrt{a}}{\\sqrt{b}}$?', options: [
        { key: 'A', text: '$\\sqrt{\\dfrac{a}{b}}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{a}{b}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근 안 함' },
        { key: 'C', text: '$\\sqrt{a} - \\sqrt{b}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '뺄셈' },
        { key: 'D', text: '$\\sqrt{a-b}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '나눗셈 불가', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\sqrt{20/5}$', options: [
        { key: 'A', text: '$\\sqrt{4} = 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sqrt{15}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '차' },
        { key: 'C', text: '$\\sqrt{25}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '합' },
        { key: 'D', text: '$\\sqrt{100}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '곱' },
        { key: 'E', text: '$4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근 안 함' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sqrt{4}$ (간단히 안 함)', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '맞지만 = 2' },
        { key: 'C', text: '$4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근 안 함' },
        { key: 'D', text: '$\\sqrt{15}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '차' },
        { key: 'E', text: '$\\sqrt{100} = 10$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '곱' },
      ] },
    ], solution: '$\\sqrt{20}/\\sqrt{5} = \\sqrt{4} = 2$.' },

  // Q13
  { chapterCode: CODE, difficulty: 'medium', concept: '분모 유리화 (단일 근)', requiredSkills: SKILLS_RATIONALIZE,
    stem: '$\\dfrac{1}{\\sqrt{2}}$ 의 분모를 유리화하면?',
    steps: [
      { stepType: 'CONCEPT', prompt: '분모를 유리수로 만들려면?', options: [
        { key: 'A', text: '분자·분모에 같은 근을 곱하기', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '분모만 곱하기', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '균형 깨짐' },
        { key: 'C', text: '분자만 곱하기', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '분모 그대로' },
        { key: 'D', text: '분모를 빼기', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '분모 무시', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\dfrac{1}{\\sqrt{2}} \\times \\dfrac{\\sqrt{2}}{\\sqrt{2}}$', options: [
        { key: 'A', text: '$\\dfrac{\\sqrt{2}}{2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '분자에도 곱해야' },
        { key: 'C', text: '$\\dfrac{2}{\\sqrt{2}}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '뒤집힘' },
        { key: 'D', text: '$\\sqrt{2}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '분모 0 잘못' },
        { key: 'E', text: '$\\dfrac{\\sqrt{2}}{\\sqrt{2}} = 1$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$\\dfrac{\\sqrt{2}}{2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '분자 잘못' },
        { key: 'C', text: '$\\sqrt{2}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\dfrac{1}{\\sqrt{2}}$ 그대로', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '유리화 안 함' },
        { key: 'E', text: '$\\dfrac{2}{\\sqrt{2}}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '거꾸로' },
      ] },
    ], solution: '$\\dfrac{1}{\\sqrt{2}} = \\dfrac{\\sqrt{2}}{2}$.' },

  // Q14
  { chapterCode: CODE, difficulty: 'medium', concept: '분모 유리화 (켤레)', requiredSkills: SKILLS_RATIONALIZE,
    stem: '$\\dfrac{1}{\\sqrt{3} + 1}$ 의 분모를 유리화하면?',
    steps: [
      { stepType: 'CONCEPT', prompt: '켤레의 의미?', options: [
        { key: 'A', text: '부호만 반대인 짝 ($\\sqrt{3}-1$)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sqrt{3}+1$ 그대로', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '켤레 아님' },
        { key: 'C', text: '$-\\sqrt{3}-1$ (전체 부호)', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '전체 음수' },
        { key: 'D', text: '$1+\\sqrt{3}$ (순서 바꿈)', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '같은 식' },
        { key: 'E', text: '$\\sqrt{3}+1$ 의 역수', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '역수 다름' },
      ] },
      { stepType: 'PROCESS', prompt: '$(\\sqrt{3}+1)(\\sqrt{3}-1) = ?$', options: [
        { key: 'A', text: '$3 - 1 = 2$ (합·차 공식)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3 + 1 = 4$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '합' },
        { key: 'C', text: '$\\sqrt{3}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\sqrt{3} - 1$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(\\sqrt{3})^2 + 1^2 = 4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$(a+b)^2$ 잘못' },
      ] },
      { stepType: 'ANSWER', prompt: '$\\dfrac{\\sqrt{3}-1}{2}$', options: [
        { key: 'A', text: '$\\dfrac{\\sqrt{3}-1}{2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sqrt{3}-1$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '분모 무시' },
        { key: 'C', text: '$\\dfrac{1}{\\sqrt{3}+1}$ 그대로', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '유리화 안 함' },
        { key: 'D', text: '$\\dfrac{\\sqrt{3}+1}{2}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '부호 잘못' },
        { key: 'E', text: '$\\dfrac{\\sqrt{3}-1}{4}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '분모 잘못' },
      ] },
    ], solution: '켤레 곱: $(\\sqrt{3}+1)(\\sqrt{3}-1) = 2$. 결과 $\\dfrac{\\sqrt{3}-1}{2}$.' },

  // Q15
  { chapterCode: CODE, difficulty: 'medium', concept: '$(\\sqrt{a}+b)^2$ 전개', requiredSkills: SKILLS_FORMULA,
    stem: '$(\\sqrt{3} + 1)^2 = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$(a+b)^2 = ?$', options: [
        { key: 'A', text: '$a^2 + 2ab + b^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a^2 + b^2$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '교차항 누락' },
        { key: 'C', text: '$a^2 - 2ab + b^2$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '$(a-b)^2$' },
        { key: 'D', text: '$(a+b)$ 그대로', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '제곱 안 함' },
        { key: 'E', text: '$a^2 \\cdot b^2$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '곱' },
      ] },
      { stepType: 'PROCESS', prompt: '$a = \\sqrt{3}, b = 1$', options: [
        { key: 'A', text: '$3 + 2\\sqrt{3} + 1 = 4 + 2\\sqrt{3}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sqrt{3} + 1$ (제곱 안 함)', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '제곱 안 함' },
        { key: 'C', text: '$3 + 1 = 4$ (교차항 누락)', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '교차항' },
        { key: 'D', text: '$(\\sqrt{3})^2 + 1 = 4$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '교차항 누락' },
        { key: 'E', text: '$3 - 2\\sqrt{3} + 1$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '부호 잘못' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$4 + 2\\sqrt{3}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '교차항' },
        { key: 'C', text: '$4 - 2\\sqrt{3}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '부호' },
        { key: 'D', text: '$\\sqrt{3} + 1$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '제곱 안 함' },
        { key: 'E', text: '$2 + \\sqrt{3}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(\\sqrt{3}+1)^2 = 3 + 2\\sqrt{3} + 1 = 4 + 2\\sqrt{3}$.' },

  // Q16 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '$\\sqrt{a^2 b}$ 간단히', requiredSkills: SKILLS_SIMPLIFY,
    stem: '$\\sqrt{2^2 \\cdot 3}$ 를 간단히?',
    steps: [
      { stepType: 'CONCEPT', prompt: '제곱 부분 추출', options: [
        { key: 'A', text: '$\\sqrt{a^2 b} = a \\sqrt{b}$ ($a > 0$)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sqrt{a^2 + b}$', isCorrect: false, errorCode: 'SIMPLIFICATION_ERROR', errorReason: '합 잘못' },
        { key: 'C', text: '$a + \\sqrt{b}$', isCorrect: false, errorCode: 'SIMPLIFICATION_ERROR', errorReason: '합' },
        { key: 'D', text: '$a^2 \\sqrt{b}$', isCorrect: false, errorCode: 'SIMPLIFICATION_ERROR', errorReason: '근 처리 잘못' },
        { key: 'E', text: '$\\sqrt{ab}$', isCorrect: false, errorCode: 'SIMPLIFICATION_ERROR', errorReason: '제곱 무시' },
      ] },
      { stepType: 'PROCESS', prompt: '$a = 2, b = 3$ 대입', options: [
        { key: 'A', text: '$2 \\sqrt{3}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4 \\sqrt{3}$', isCorrect: false, errorCode: 'SIMPLIFICATION_ERROR', errorReason: '$a^2$ 추출' },
        { key: 'C', text: '$\\sqrt{12}$ (간단히 안 함)', isCorrect: false, errorCode: 'SIMPLIFICATION_ERROR', errorReason: '맞지만 추출 가능' },
        { key: 'D', text: '$2 + \\sqrt{3}$', isCorrect: false, errorCode: 'SIMPLIFICATION_ERROR', errorReason: '합' },
        { key: 'E', text: '$\\sqrt{2} + \\sqrt{3}$', isCorrect: false, errorCode: 'SIMPLIFICATION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$2\\sqrt{3}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4\\sqrt{3}$', isCorrect: false, errorCode: 'SIMPLIFICATION_ERROR', errorReason: '$a^2$ 추출 잘못' },
        { key: 'C', text: '$\\sqrt{12}$', isCorrect: false, errorCode: 'SIMPLIFICATION_ERROR', errorReason: '간단히 안 함' },
        { key: 'D', text: '$2 + \\sqrt{3}$', isCorrect: false, errorCode: 'SIMPLIFICATION_ERROR', errorReason: '합' },
        { key: 'E', text: '$\\sqrt{6}$', isCorrect: false, errorCode: 'SIMPLIFICATION_ERROR', errorReason: '곱 잘못' },
      ] },
    ], solution: '$\\sqrt{2^2 \\cdot 3} = 2\\sqrt{3}$.' },

  // Q17 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '분모 유리화 (계수 있는 켤레)', requiredSkills: SKILLS_RATIONALIZE,
    stem: '$\\dfrac{2}{\\sqrt{3} - 1}$ 의 분모를 유리화하면?',
    steps: [
      { stepType: 'CONCEPT', prompt: '켤레?', options: [
        { key: 'A', text: '$\\sqrt{3} + 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sqrt{3} - 1$ 그대로', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '같은 식' },
        { key: 'C', text: '$-\\sqrt{3} - 1$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1 - \\sqrt{3}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sqrt{3}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\dfrac{2(\\sqrt{3}+1)}{(\\sqrt{3}-1)(\\sqrt{3}+1)} = \\dfrac{2(\\sqrt{3}+1)}{2}$', options: [
        { key: 'A', text: '$\\sqrt{3} + 1$ (약분)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2\\sqrt{3} + 2$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '약분 안 함' },
        { key: 'C', text: '$\\dfrac{\\sqrt{3}+1}{2}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '$2$ 무시' },
        { key: 'D', text: '$\\dfrac{2}{\\sqrt{3}-1}$ 그대로', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '유리화 안 함' },
        { key: 'E', text: '$2\\sqrt{3} - 1$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$\\sqrt{3} + 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{\\sqrt{3}+1}{2}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '약분 잘못' },
        { key: 'C', text: '$2\\sqrt{3} + 2$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '약분 안 함' },
        { key: 'D', text: '$\\sqrt{3} - 1$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '부호 잘못' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\dfrac{2}{\\sqrt{3}-1} = \\dfrac{2(\\sqrt{3}+1)}{2} = \\sqrt{3} + 1$.' },

  // Q18 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '여러 근 사칙', requiredSkills: SKILLS_ARITH,
    stem: '$\\sqrt{45} - \\sqrt{20} + \\sqrt{5} = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '각각 간단히?', options: [
        { key: 'A', text: '$\\sqrt{45} = 3\\sqrt{5}$, $\\sqrt{20} = 2\\sqrt{5}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sqrt{45}, \\sqrt{20}$ 그대로', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '간단히 가능' },
        { key: 'C', text: '$\\sqrt{45} = 9\\sqrt{5}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근 안 함' },
        { key: 'D', text: '$\\sqrt{45} = 5\\sqrt{9} = 5 \\cdot 3 = 15$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못 분해' },
        { key: 'E', text: '$\\sqrt{45} = \\sqrt{5} + \\sqrt{40}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합' },
      ] },
      { stepType: 'PROCESS', prompt: '$3\\sqrt{5} - 2\\sqrt{5} + \\sqrt{5}$', options: [
        { key: 'A', text: '$(3 - 2 + 1)\\sqrt{5} = 2\\sqrt{5}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2\\sqrt{15}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근호 더함' },
        { key: 'C', text: '$\\sqrt{5}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계수 잘못' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$6\\sqrt{5}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$2\\sqrt{5}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sqrt{5}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계수 잘못' },
        { key: 'C', text: '$6\\sqrt{5}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합' },
        { key: 'D', text: '$2\\sqrt{15}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근호 합' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\sqrt{45} = 3\\sqrt{5}$, $\\sqrt{20} = 2\\sqrt{5}$. $(3 - 2 + 1)\\sqrt{5} = 2\\sqrt{5}$.' },

  // Q19 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '합·차 공식 적용', requiredSkills: SKILLS_FORMULA,
    stem: '$(\\sqrt{5} + \\sqrt{2})(\\sqrt{5} - \\sqrt{2}) = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$(a+b)(a-b) = ?$', options: [
        { key: 'A', text: '$a^2 - b^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a^2 + b^2$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '부호 잘못' },
        { key: 'C', text: '$(a-b)^2$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '다른 공식' },
        { key: 'D', text: '$a^2 + 2ab - b^2$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$a^2 b^2$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$(\\sqrt{5})^2 - (\\sqrt{2})^2$', options: [
        { key: 'A', text: '$5 - 2 = 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5 + 2 = 7$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '부호 잘못' },
        { key: 'C', text: '$\\sqrt{5} - \\sqrt{2}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '제곱 안 함' },
        { key: 'D', text: '$\\sqrt{3}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$25 - 4 = 21$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '제곱 잘못' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$7$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '부호 잘못' },
        { key: 'C', text: '$\\sqrt{3}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\sqrt{10}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$21$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '제곱 잘못' },
      ] },
    ], solution: '$(\\sqrt{5}+\\sqrt{2})(\\sqrt{5}-\\sqrt{2}) = 5 - 2 = 3$.' },

  // Q20 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '$\\sqrt{a}\\sqrt{b} = \\sqrt{ab}$ 조건', requiredSkills: SKILLS_MULT,
    stem: '$\\sqrt{a} \\cdot \\sqrt{b} = \\sqrt{ab}$ 가 항상 성립하는 조건은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '제곱근은 음수 정의?', options: [
        { key: 'A', text: '실수 범위에서 $a, b \\geq 0$ 일 때만', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '항상 성립', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '음수면 정의 어려움' },
        { key: 'C', text: '$a > b$ 일 때', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'D', text: '$a = b$ 일 때만', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'E', text: '$a, b$ 정수일 때만', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '실수 전체에서' },
      ] },
      { stepType: 'PROCESS', prompt: '$a = -1, b = -1$ 이면?', options: [
        { key: 'A', text: '$\\sqrt{-1} \\cdot \\sqrt{-1}$ 은 실수 범위 정의 안 됨 → 규칙 위배', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sqrt{1} = 1$ 그대로 성립', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '음수 제곱근 처리 잘못' },
        { key: 'C', text: '$-1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '복소수 결과' },
        { key: 'D', text: '$\\sqrt{2}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '조건은?', options: [
        { key: 'A', text: '$a \\geq 0$ 그리고 $b \\geq 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '항상 성립', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '음수에서 어김' },
        { key: 'C', text: '$a, b$ 정수', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'D', text: '$a = b$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'E', text: '$a > b$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
    ], solution: '실수 범위에서 제곱근 성질 $\\sqrt{a}\\sqrt{b} = \\sqrt{ab}$ 는 $a, b \\geq 0$ 일 때만 성립.' },
];

export const K_G9_MATH3_CH01_REAL_NUMBERS_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
