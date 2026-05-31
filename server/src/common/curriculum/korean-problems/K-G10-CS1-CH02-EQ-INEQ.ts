/**
 * K-G10-CS1-CH02-EQ-INEQ (복소수·이차방정식) — 20문제 3-step Mastery.
 * 고1 — $i^2 = -1$ → 복소수 사칙 → 켤레·절댓값 → 판별식 ($D = b^2 - 4ac$) →
 *        허근 (근의 공식 + $i$) → 근과 계수의 관계.
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 * 주요 errorCode 분배:
 *   ALGEBRA_ERROR 5 (Q7,14,15,17,18) / CONCEPT_MISUNDERSTANDING 5 (Q1,2,3,5,6)
 *   SIGN_ERROR 4 (Q4,10,11,13) / FORMULA_SELECTION_ERROR 3 (Q9,12,19)
 *   ARITHMETIC_ERROR 2 (Q8,16) / CONDITION_MISSING 1 (Q20)
 *
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G10-CS1-CH02-EQ-INEQ';
const SKILLS_I = ['imaginary_unit', 'i_powers'];
const SKILLS_PARTS = ['complex_real_imag'];
const SKILLS_OPS = ['complex_arithmetic'];
const SKILLS_ABS = ['complex_modulus'];
const SKILLS_SQRT = ['negative_sqrt_to_i'];
const SKILLS_QUAD_C = ['complex_quadratic_solution'];
const SKILLS_DISC = ['discriminant_meaning'];
const SKILLS_CONJ = ['conjugate'];
const SKILLS_VIETA = ['vieta_formulas', 'sum_product_roots'];

const problems: KoreanProblemSeed[] = [
  // Q1
  { chapterCode: CODE, difficulty: 'easy', concept: '$i^2$', requiredSkills: SKILLS_I,
    stem: '허수단위 $i$ 의 정의에서 $i^2 = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$i$ 도입 이유?', options: [
        { key: 'A', text: '$x^2 = -1$ 의 해를 만들기 위해', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^2 = 1$ 해', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '실수' },
        { key: 'C', text: '$0$ 의 다른 표현', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '근거 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '있음' },
        { key: 'E', text: '큰 수 표현', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$i \\cdot i = ?$', options: [
        { key: 'A', text: '$-1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '실수 곱' },
        { key: 'C', text: '$i$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$-i$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$i^2 = ?$', options: [
        { key: 'A', text: '$-1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$i$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$-i$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$i$ 정의: $i^2 = -1$.' },

  // Q2
  { chapterCode: CODE, difficulty: 'easy', concept: '$i^3$', requiredSkills: SKILLS_I,
    stem: '$i^3 = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$i^3 = i \\cdot i^2$', options: [
        { key: 'A', text: '$i \\cdot (-1) = -i$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$i \\cdot 1 = i$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$i^2 = -1$' },
        { key: 'C', text: '$-1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$i^2$' },
        { key: 'D', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '결과', options: [
        { key: 'A', text: '$-i$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$i$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부호' },
        { key: 'C', text: '$-1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$i^2$' },
        { key: 'D', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$i^3$ 그대로', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '계산 가능' },
      ] },
      { stepType: 'ANSWER', prompt: '$i^3 = ?$', options: [
        { key: 'A', text: '$-i$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$i$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부호' },
        { key: 'C', text: '$-1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$i^2$' },
        { key: 'D', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$i^3 = i \\cdot i^2 = -i$.' },

  // Q3
  { chapterCode: CODE, difficulty: 'easy', concept: '$i^4$', requiredSkills: SKILLS_I,
    stem: '$i^4 = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$i^4 = (i^2)^2$', options: [
        { key: 'A', text: '$(-1)^2 = 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(i^2)^2 = i^4$ 순환', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '계산 가능' },
        { key: 'C', text: '$-1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$i^2$ 값' },
        { key: 'D', text: '$i$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$-i$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$i^3$' },
      ] },
      { stepType: 'PROCESS', prompt: '$(-1)^2$', options: [
        { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '제곱은 양수' },
        { key: 'C', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$i$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$i^4 = ?$', options: [
        { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$i^2$' },
        { key: 'C', text: '$i$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$-i$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$i^4 = (i^2)^2 = (-1)^2 = 1$. ($i$ 의 거듭제곱은 4주기 순환).' },

  // Q4
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\sqrt{-4}$', requiredSkills: SKILLS_SQRT,
    stem: '$\\sqrt{-4} = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '음수의 제곱근?', options: [
        { key: 'A', text: '$\\sqrt{-a} = \\sqrt{a} \\cdot i$ ($a > 0$)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '음수 제곱근 불가', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '복소수에서 가능' },
        { key: 'C', text: '$\\sqrt{-a} = -\\sqrt{a}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '실수 만들기 불가' },
        { key: 'D', text: '$\\sqrt{-a}$ 그대로', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '간단히' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\sqrt{4} \\cdot i$', options: [
        { key: 'A', text: '$2i$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$i$ 누락' },
        { key: 'C', text: '$2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$-2i$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '주값 양' },
        { key: 'E', text: '$4i$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$\\sqrt{-4} = ?$', options: [
        { key: 'A', text: '$2i$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '실수' },
        { key: 'C', text: '$2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$-2i$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '주값' },
        { key: 'E', text: '정의 안 됨', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '정의됨' },
      ] },
    ], solution: '$\\sqrt{-4} = 2i$.' },

  // Q5
  { chapterCode: CODE, difficulty: 'easy', concept: '복소수 실수부', requiredSkills: SKILLS_PARTS,
    stem: '복소수 $3 + 2i$ 의 실수부?',
    steps: [
      { stepType: 'CONCEPT', prompt: '복소수 $a + bi$ 표기?', options: [
        { key: 'A', text: '$a$ 가 실수부, $b$ 가 허수부', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a$ 가 허수부, $b$ 가 실수부', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '바뀜' },
        { key: 'C', text: '$a$ 가 분자, $b$ 가 분모', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$a + b$ 가 실수부', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '둘 다 실수부', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '구별' },
      ] },
      { stepType: 'PROCESS', prompt: '$3 + 2i$ 의 분리?', options: [
        { key: 'A', text: '실수부 $3$, 허수부 $2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '실수부 $2$, 허수부 $3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '바뀜' },
        { key: 'C', text: '실수부 $2i$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '허수' },
        { key: 'D', text: '실수부 $3 + 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '실수부 $5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '실수부?', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '허수부' },
        { key: 'C', text: '$2i$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '허수항' },
        { key: 'D', text: '$5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$3 + 2i$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '전체' },
      ] },
    ], solution: '$3 + 2i$ → 실수부 $3$.' },

  // Q6
  { chapterCode: CODE, difficulty: 'easy', concept: '복소수 허수부', requiredSkills: SKILLS_PARTS,
    stem: '$3 + 2i$ 의 허수부?',
    steps: [
      { stepType: 'CONCEPT', prompt: '허수부의 정의?', options: [
        { key: 'A', text: '$i$ 의 계수 (실수)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$bi$ 자체', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '계수만' },
        { key: 'C', text: '$a + b$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '복소수 전체', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$3 + 2i$ 의 $i$ 계수', options: [
        { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2i$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '계수만' },
        { key: 'C', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '실수부' },
        { key: 'D', text: '$5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '허수부?', options: [
        { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2i$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '계수만 (관습)' },
        { key: 'C', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '실수부' },
        { key: 'D', text: '$3 + 2i$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '전체' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '허수부 = $i$ 의 계수 = $2$.' },

  // Q7
  { chapterCode: CODE, difficulty: 'medium', concept: '복소수 곱셈', requiredSkills: SKILLS_OPS,
    stem: '$(2 + 3i)(1 - i) = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: 'FOIL 적용', options: [
        { key: 'A', text: '$2 \\cdot 1 + 2 \\cdot (-i) + 3i \\cdot 1 + 3i \\cdot (-i)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2 + (-i) + 3i + (-i)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '계수 누락' },
        { key: 'C', text: '$2 - 3i^2$ 만', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '교차항 누락' },
        { key: 'D', text: '$2 \\cdot 1 = 2$ 만', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '단순 합 $2 + 3i + 1 - i$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '곱이지 합 아님' },
      ] },
      { stepType: 'PROCESS', prompt: '$2 - 2i + 3i - 3i^2 = 2 + i + 3$', options: [
        { key: 'A', text: '$5 + i$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5 - i$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$3i - 2i = i$' },
        { key: 'C', text: '$-1 + i$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$-3i^2 = +3$ 잘못' },
        { key: 'D', text: '$2 + i$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$-3i^2$ 누락' },
        { key: 'E', text: '$2 - 3i^2 + i$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$i^2 = -1$ 적용 안 함' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$5 + i$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5 - i$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '교차항 부호' },
        { key: 'C', text: '$-1 + i$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$i^2 = -1$ 처리 잘못' },
        { key: 'D', text: '$2 + i$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '교차항 누락' },
        { key: 'E', text: '$5 + 5i$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(2+3i)(1-i) = 2 - 2i + 3i - 3i^2 = 5 + i$.' },

  // Q8
  { chapterCode: CODE, difficulty: 'medium', concept: '복소수 덧셈', requiredSkills: SKILLS_OPS,
    stem: '$(3 + i) + (1 - 2i) = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '실수부·허수부 각각 더하기', options: [
        { key: 'A', text: '실수부 $3 + 1$, 허수부 $1 - 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3 + 1 + 2 = 6$ (모두 합)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '실수·허수 따로' },
        { key: 'C', text: '실수부와 허수부 곱', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '덧셈' },
        { key: 'D', text: '한쪽만', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '둘 다' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$4 + (-1)i$', options: [
        { key: 'A', text: '$4 - i$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4 + i$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$4 + 3i$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$+2i$ 가정' },
        { key: 'D', text: '$2 - i$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3+1 \\neq 2$' },
        { key: 'E', text: '$3 + i + 1 - 2i$ 그대로', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 안 함' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$4 - i$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4 + i$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$2 - i$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$4 + 3i$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$4i$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(3+1) + (1-2)i = 4 - i$.' },

  // Q9
  { chapterCode: CODE, difficulty: 'medium', concept: '복소수 절댓값', requiredSkills: SKILLS_ABS,
    stem: '$|3 + 4i|$ 의 값?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$|a + bi|$ 공식', options: [
        { key: 'A', text: '$\\sqrt{a^2 + b^2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a + b$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
        { key: 'C', text: '$\\sqrt{ab}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱' },
        { key: 'D', text: '$a^2 + b^2$ (제곱근 누락)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱근 누락' },
        { key: 'E', text: '$|a| + |b|$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\sqrt{9 + 16}$', options: [
        { key: 'A', text: '$\\sqrt{25} = 5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sqrt{7}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3 + 4$' },
        { key: 'C', text: '$25$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱근 누락' },
        { key: 'D', text: '$\\sqrt{12}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3 \\cdot 4$' },
        { key: 'E', text: '$7$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3 + 4$' },
      ] },
      { stepType: 'ANSWER', prompt: '$|3+4i|$?', options: [
        { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$25$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱근 누락' },
        { key: 'C', text: '$7$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$a + b$' },
        { key: 'D', text: '$12$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sqrt{12}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$|3+4i| = \\sqrt{9+16} = 5$.' },

  // Q10
  { chapterCode: CODE, difficulty: 'medium', concept: '$x^2 + 1 = 0$', requiredSkills: SKILLS_QUAD_C,
    stem: '$x^2 + 1 = 0$ 의 해는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$x^2 = -1$ 의 해?', options: [
        { key: 'A', text: '$x = \\pm i$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = \\pm 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '실수만 고려' },
        { key: 'C', text: '실근 없음 (실수범위)', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '복소수에선 존재' },
        { key: 'D', text: '$x = 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x = i$ 만', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '두 해' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\pm \\sqrt{-1}$', options: [
        { key: 'A', text: '$\\pm i$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\pm 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '실수' },
        { key: 'C', text: '$i$ 만', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '두 해' },
        { key: 'D', text: '$-i$ 만', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '두 해' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '해?', options: [
        { key: 'A', text: '$x = \\pm i$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = i$ 만', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '두 해' },
        { key: 'C', text: '$x = \\pm 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '실수' },
        { key: 'D', text: '실근 없음', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '복소수' },
        { key: 'E', text: '$x = 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$x^2 = -1 \\Rightarrow x = \\pm i$.' },

  // Q11
  { chapterCode: CODE, difficulty: 'medium', concept: '$x^2 + 4 = 0$', requiredSkills: SKILLS_QUAD_C,
    stem: '$x^2 + 4 = 0$ 의 해?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$x^2 = -4$', options: [
        { key: 'A', text: '$x = \\pm \\sqrt{-4} = \\pm 2i$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = \\pm 2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '실수만' },
        { key: 'C', text: '$x = 4i$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '제곱근 누락' },
        { key: 'D', text: '$x = i$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '해 없음', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '복소수' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\sqrt{-4} = 2i$', options: [
        { key: 'A', text: '$\\pm 2i$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2i$ 만', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '두 해' },
        { key: 'C', text: '$\\pm 4i$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\pm \\sqrt{4}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '실수' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '해?', options: [
        { key: 'A', text: '$x = \\pm 2i$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 2i$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '두 해' },
        { key: 'C', text: '$x = \\pm 2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '실수' },
        { key: 'D', text: '$x = 4i$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '해 없음', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '있음' },
      ] },
    ], solution: '$x = \\pm 2i$.' },

  // Q12
  { chapterCode: CODE, difficulty: 'medium', concept: '판별식', requiredSkills: SKILLS_DISC,
    stem: '$x^2 - 2x + 5 = 0$ 의 판별식 $D$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$D = b^2 - 4ac$', options: [
        { key: 'A', text: '$a=1, b=-2, c=5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a=1, b=2, c=5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$b$ 부호' },
        { key: 'C', text: '$a=-2, b=1, c=5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '바뀜' },
        { key: 'D', text: '판별 불가', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '가능' },
        { key: 'E', text: '$a=5, b=-2, c=1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '바뀜' },
      ] },
      { stepType: 'PROCESS', prompt: '$(-2)^2 - 4(1)(5)$', options: [
        { key: 'A', text: '$4 - 20 = -16$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-4 - 20 = -24$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$(-2)^2 = 4$' },
        { key: 'C', text: '$4 + 20 = 24$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-4ac$ 부호' },
        { key: 'D', text: '$-16$ 잘못', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '맞지만 우회' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$D$?', options: [
        { key: 'A', text: '$-16$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$16$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$-24$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$24$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$D = 4 - 20 = -16$.' },

  // Q13
  { chapterCode: CODE, difficulty: 'medium', concept: '$D < 0$ 의미', requiredSkills: SKILLS_DISC,
    stem: '판별식 $D < 0$ 일 때 이차방정식의 해는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\sqrt{D}$ 가 허수', options: [
        { key: 'A', text: '근의 공식에서 $\\sqrt{D}$ 가 허수 → 허근', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '실근 두 개', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$D>0$' },
        { key: 'C', text: '중근', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$D=0$' },
        { key: 'D', text: '해 없음', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '복소수에선 있음' },
        { key: 'E', text: '하나의 실근', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '서로 다른 두 허근', options: [
        { key: 'A', text: '서로 켤레 (실수계수 시)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '같은 두 해', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '다름' },
        { key: 'C', text: '하나만', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '두 해' },
        { key: 'D', text: '실근 + 허근 혼합', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '둘 다 허근' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'ANSWER', prompt: '해의 종류?', options: [
        { key: 'A', text: '서로 다른 두 허근', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '서로 다른 두 실근', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$D>0$' },
        { key: 'C', text: '중근 (실근)', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$D=0$' },
        { key: 'D', text: '실근 + 허근', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '해 없음', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '있음' },
      ] },
    ], solution: '$D < 0$ → 서로 다른 두 허근 (실수계수 시 켤레).' },

  // Q14
  { chapterCode: CODE, difficulty: 'medium', concept: '허근 풀이 (근의 공식)', requiredSkills: SKILLS_QUAD_C,
    stem: '$x^2 - 2x + 5 = 0$ 의 해?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$D = -16$, 근의 공식', options: [
        { key: 'A', text: '$x = (2 \\pm \\sqrt{-16})/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = (-2 \\pm \\sqrt{-16})/2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$-b = 2$' },
        { key: 'C', text: '$x = \\pm \\sqrt{-16}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나누기 누락' },
        { key: 'D', text: '실근 없음', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '복소근 있음' },
        { key: 'E', text: '$x = 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\sqrt{-16} = 4i$', options: [
        { key: 'A', text: '$x = (2 \\pm 4i)/2 = 1 \\pm 2i$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 2 \\pm 4i$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나누기 누락' },
        { key: 'C', text: '$x = 1 \\pm 4i$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$4i/2 = 2i$' },
        { key: 'D', text: '$x = (2 \\pm 4)/2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$i$ 누락' },
        { key: 'E', text: '$x = -1 \\pm 2i$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$-b/2a$ 부호' },
      ] },
      { stepType: 'ANSWER', prompt: '해?', options: [
        { key: 'A', text: '$x = 1 \\pm 2i$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 2 \\pm 4i$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나누기 누락' },
        { key: 'C', text: '$x = 1 \\pm 4i$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '계산 잘못' },
        { key: 'D', text: '실근 없음', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '허근 존재' },
        { key: 'E', text: '$x = \\pm 2i$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$x = (2 \\pm 4i)/2 = 1 \\pm 2i$.' },

  // Q15
  { chapterCode: CODE, difficulty: 'medium', concept: '음수 제곱근 곱 ($i$ 변환 먼저)', requiredSkills: SKILLS_SQRT,
    stem: '$\\sqrt{-9} \\cdot \\sqrt{-4} = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '먼저 $i$ 로 변환?', options: [
        { key: 'A', text: '$\\sqrt{-9} = 3i$, $\\sqrt{-4} = 2i$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sqrt{-9} \\cdot \\sqrt{-4} = \\sqrt{36} = 6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '음수 제곱근 일반 규칙 적용 잘못' },
        { key: 'C', text: '곱셈 불가', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '가능' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$6i$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$i^2$ 처리 누락' },
      ] },
      { stepType: 'PROCESS', prompt: '$3i \\cdot 2i = 6i^2 = -6$', options: [
        { key: 'A', text: '$-6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '대표적 오개념' },
        { key: 'C', text: '$6i$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$i^2 = -1$ 미적용' },
        { key: 'D', text: '$-6i$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sqrt{36}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '잘못된 곱셈' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$-6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '대표적 오개념 ($\\sqrt{ab}$ 규칙)' },
        { key: 'C', text: '$6i$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$i^2 = -1$' },
        { key: 'D', text: '$\\sqrt{36}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '잘못' },
        { key: 'E', text: '$-6i$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\sqrt{-9} \\cdot \\sqrt{-4} = 3i \\cdot 2i = 6i^2 = -6$. (음수 제곱근은 $i$ 로 변환 먼저)' },

  // Q16 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '켤레복소수', requiredSkills: SKILLS_CONJ,
    stem: '$z = 1 + i$ 의 켤레?',
    steps: [
      { stepType: 'CONCEPT', prompt: '켤레의 정의?', options: [
        { key: 'A', text: '허수부 부호 반대 ($\\bar{z} = a - bi$)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '실수부 부호 반대 ($-a + bi$)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '부호 위치' },
        { key: 'C', text: '둘 다 부호 반대', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$-z$' },
        { key: 'D', text: '변화 없음', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '같음 (실수만)' },
        { key: 'E', text: '$1/z$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '역수' },
      ] },
      { stepType: 'PROCESS', prompt: '$z = 1 + i$ → $\\bar{z}$', options: [
        { key: 'A', text: '$1 - i$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-1 + i$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '실수부 부호' },
        { key: 'C', text: '$-1 - i$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '둘 다 부호' },
        { key: 'D', text: '$1 + i$ 그대로', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '같음' },
        { key: 'E', text: '$i$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$\\bar{z}$?', options: [
        { key: 'A', text: '$1 - i$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-1 + i$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '부호 위치' },
        { key: 'C', text: '$-1 - i$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1 + i$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '같음' },
        { key: 'E', text: '$i - 1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\bar{z} = 1 - i$.' },

  // Q17 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '$z \\bar{z} = |z|^2$', requiredSkills: SKILLS_CONJ,
    stem: '$z = 3 + 4i$ 일 때 $z \\bar{z}$ 의 값?',
    steps: [
      { stepType: 'CONCEPT', prompt: '항등식?', options: [
        { key: 'A', text: '$z \\bar{z} = |z|^2 = a^2 + b^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$z \\bar{z} = z^2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$z \\bar{z} = a^2 - b^2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '부호' },
        { key: 'D', text: '$z \\bar{z} = $ 항상 $0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$(3+4i)(3-4i) = 9 - 16i^2$', options: [
        { key: 'A', text: '$9 + 16 = 25$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$9 - 16 = -7$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$i^2 = -1$ 적용 안 함' },
        { key: 'C', text: '$25i$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$7$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$z \\bar{z}$?', options: [
        { key: 'A', text: '$25$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-7$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$i^2$ 잘못' },
        { key: 'C', text: '$25i$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$7$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$|z|$' },
      ] },
    ], solution: '$z \\bar{z} = |z|^2 = 3^2 + 4^2 = 25$.' },

  // Q18 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '근과 계수 (양방향)', requiredSkills: SKILLS_VIETA,
    stem: '$x^2 + px + q = 0$ 의 두 근의 합 $= 3$, 곱 $= 2$. $p, q$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '근과 계수의 관계 ($ax^2 + bx + c$)', options: [
        { key: 'A', text: '합 $= -b/a$, 곱 $= c/a$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '합 $= b/a$, 곱 $= c/a$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '부호' },
        { key: 'C', text: '합 $= a/b$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '뒤집힘' },
        { key: 'D', text: '합 $= -c/a$, 곱 $= -b/a$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '바뀜' },
        { key: 'E', text: '관계 없음', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '있음' },
      ] },
      { stepType: 'PROCESS', prompt: '$a = 1$. $-p = 3, q = 2$', options: [
        { key: 'A', text: '$p = -3, q = 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$p = 3, q = 2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$p = -3, q = -2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '곱 부호' },
        { key: 'D', text: '$p = 2, q = 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '바뀜' },
        { key: 'E', text: '$p = 0, q = 6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$(p, q)$?', options: [
        { key: 'A', text: '$(-3, 2)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(3, 2)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$(-3, -2)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '곱 부호' },
        { key: 'D', text: '$(2, 3)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '바뀜' },
        { key: 'E', text: '$(3, -2)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '합 $= -p = 3 \\Rightarrow p = -3$. 곱 $= q = 2$.' },

  // Q19 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '근으로부터 식 구성', requiredSkills: SKILLS_VIETA,
    stem: '두 근의 합 $5$, 곱 $6$ 인 이차방정식 (선행계수 $1$)?',
    steps: [
      { stepType: 'CONCEPT', prompt: '식 형태?', options: [
        { key: 'A', text: '$x^2 - (\\text{합}) x + \\text{곱} = 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^2 + (\\text{합}) x + \\text{곱} = 0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '부호' },
        { key: 'C', text: '$x^2 - \\text{곱} \\cdot x + \\text{합} = 0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '바뀜' },
        { key: 'D', text: '$x^2 = $ 합 $\\times$ 곱', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '잘못' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '대입', options: [
        { key: 'A', text: '$x^2 - 5x + 6 = 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^2 + 5x + 6 = 0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '부호' },
        { key: 'C', text: '$x^2 - 6x + 5 = 0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '바뀜' },
        { key: 'D', text: '$x^2 = 30$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x^2 - 5x - 6 = 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '곱 부호' },
      ] },
      { stepType: 'ANSWER', prompt: '식?', options: [
        { key: 'A', text: '$x^2 - 5x + 6 = 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^2 + 5x + 6 = 0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '부호' },
        { key: 'C', text: '$x^2 - 6x + 5 = 0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '바뀜' },
        { key: 'D', text: '$x^2 - 5x - 6 = 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '곱 부호' },
        { key: 'E', text: '$x^2 = 30$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$x^2 - (\\text{합}) x + \\text{곱} = x^2 - 5x + 6 = 0$.' },

  // Q20 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '중근 조건', requiredSkills: SKILLS_DISC,
    stem: '$x^2 + 2x + k = 0$ 이 중근을 가지면 $k$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '중근 조건?', options: [
        { key: 'A', text: '$D = b^2 - 4ac = 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$D > 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '두 실근' },
        { key: 'C', text: '$D < 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '허근' },
        { key: 'D', text: '$a = 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '이차 아님' },
        { key: 'E', text: '$c = 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$4 - 4k = 0$', options: [
        { key: 'A', text: '$k = 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$k = -1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$k = 4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$k = 0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$k = 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$k$?', options: [
        { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$D = 4 - 4k = 0 \\Rightarrow k = 1$.' },
];

export const K_G10_CS1_CH02_EQ_INEQ_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
