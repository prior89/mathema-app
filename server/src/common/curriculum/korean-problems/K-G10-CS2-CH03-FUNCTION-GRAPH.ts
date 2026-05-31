/**
 * K-G10-CS2-CH03-FUNCTION-GRAPH (함수·합성·역함수·유리·무리) — 20문제 3-step Mastery.
 * 고1 — 함숫값 → 합성함수 → 역함수 (존재 조건·풀이) → 유리함수 (점근선) →
 *        무리함수 (정의역·치역).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 * 주요 errorCode:
 *   FORMULA_SELECTION_ERROR 6 (합성·역 순서) / ALGEBRA_ERROR 6
 *   CONCEPT_MISUNDERSTANDING 5 / CONDITION_MISSING 3
 *
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G10-CS2-CH03-FUNCTION-GRAPH';
const SKILLS_FN = ['function_value'];
const SKILLS_COMP = ['function_composition'];
const SKILLS_INV = ['inverse_function'];
const SKILLS_INV_COND = ['inverse_existence_one_to_one'];
const SKILLS_RATIONAL = ['rational_function'];
const SKILLS_ASYMPTOTE = ['asymptote'];
const SKILLS_IRRATIONAL = ['irrational_function'];
const SKILLS_DOMAIN = ['domain_range'];

const problems: KoreanProblemSeed[] = [
  // Q1
  { chapterCode: CODE, difficulty: 'easy', concept: '함숫값', requiredSkills: SKILLS_FN,
    stem: '$f(x) = 2x + 1$ 일 때 $f(3)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$f(3)$ 의미', options: [
        { key: 'A', text: '$x$ 자리에 $3$ 대입', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$f \\cdot 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곱 아님' },
        { key: 'C', text: '$x + 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$f$ 의 미분', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$3$ 그대로', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$2 \\cdot 3 + 1$', options: [
        { key: 'A', text: '$7$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$+1$ 누락' },
        { key: 'C', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$f(3)$?', options: [
        { key: 'A', text: '$7$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$f(3) = 2 \\cdot 3 + 1 = 7$.' },

  // Q2
  { chapterCode: CODE, difficulty: 'easy', concept: '제곱 함숫값', requiredSkills: SKILLS_FN,
    stem: '$f(x) = x^2$, $f(-2)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$(-2)^2$', options: [
        { key: 'A', text: '$(-2) \\cdot (-2)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-2 \\cdot 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$-2^2 = -4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '괄호 무시' },
        { key: 'D', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$4$', options: [
        { key: 'A', text: '$4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '제곱은 양수' },
        { key: 'C', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$-2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$f(-2)$?', options: [
        { key: 'A', text: '$4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '괄호' },
        { key: 'C', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$-2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$(-2)^2 = 4$.' },

  // Q3
  { chapterCode: CODE, difficulty: 'easy', concept: '$f \\circ g$ 값', requiredSkills: SKILLS_COMP,
    stem: '$f(x) = 2x + 1$, $g(x) = x^2$. $(f \\circ g)(2)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '합성함수 정의', options: [
        { key: 'A', text: '$f(g(2))$ — $g$ 먼저', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$g(f(2))$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '순서' },
        { key: 'C', text: '$f(2) \\cdot g(2)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱 아님' },
        { key: 'D', text: '$f(2) + g(2)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합 아님' },
        { key: 'E', text: '정의 안 됨', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '정의됨' },
      ] },
      { stepType: 'PROCESS', prompt: '$g(2) = 4$, $f(4) = 9$', options: [
        { key: 'A', text: '$9$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$f(2) = 5$' },
        { key: 'C', text: '$25$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$f(2)^2$' },
        { key: 'D', text: '$13$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$20$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$f(2) g(2)$' },
      ] },
      { stepType: 'ANSWER', prompt: '값?', options: [
        { key: 'A', text: '$9$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$25$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '순서 바뀜' },
        { key: 'C', text: '$5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$20$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱' },
        { key: 'E', text: '$13$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$g(2) = 4$, $f(4) = 9$.' },

  // Q4
  { chapterCode: CODE, difficulty: 'easy', concept: '역함수 기본', requiredSkills: SKILLS_INV,
    stem: '$f(x) = x + 3$ 의 역함수?',
    steps: [
      { stepType: 'CONCEPT', prompt: '역함수 정의', options: [
        { key: 'A', text: '$y = x + 3$ → $x = y - 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = -(x+3)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$y = 1/(x+3)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$y = x + 3$ 그대로', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$y = 3 - x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$x, y$ 바꿈', options: [
        { key: 'A', text: '$y = x - 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = -x - 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$y = 3 - x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$y = 1/(x+3)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$y = x + 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$f^{-1}(x)$?', options: [
        { key: 'A', text: '$x - 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3 - x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$1/(x+3)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$-x - 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x + 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$y = x + 3 \\Rightarrow x = y - 3 \\Rightarrow f^{-1}(x) = x - 3$.' },

  // Q5
  { chapterCode: CODE, difficulty: 'easy', concept: '$1/x$ 정의역', requiredSkills: SKILLS_DOMAIN,
    stem: '$y = 1/x$ 의 정의역?',
    steps: [
      { stepType: 'CONCEPT', prompt: '분모 $\\neq 0$', options: [
        { key: 'A', text: '$x \\neq 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x > 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '음수 가능' },
        { key: 'C', text: '$x \\geq 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$0$ 제외' },
        { key: 'D', text: '모든 실수', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$0$ 안 됨' },
        { key: 'E', text: '$x = 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$1/0$ 정의 안 됨', options: [
        { key: 'A', text: '$0$ 제외', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0$ 포함', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'C', text: '음수 제외', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'D', text: '양수 제외', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'E', text: '정수만', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '정의역?', options: [
        { key: 'A', text: '$x \\neq 0$ 인 모든 실수', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x > 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'C', text: '$x \\geq 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'D', text: '모든 실수', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$0$ 제외' },
        { key: 'E', text: '$x \\in \\mathbb{Z}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
    ], solution: '분모 $\\neq 0$ → $x \\neq 0$.' },

  // Q6
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\sqrt{x}$ 정의역', requiredSkills: SKILLS_DOMAIN,
    stem: '$y = \\sqrt{x}$ 의 정의역?',
    steps: [
      { stepType: 'CONCEPT', prompt: '근호 안 $\\geq 0$', options: [
        { key: 'A', text: '$x \\geq 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x > 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$0$ 포함' },
        { key: 'C', text: '$x \\neq 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'D', text: '모든 실수', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '음수 안 됨' },
        { key: 'E', text: '$x < 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\sqrt{0} = 0$ 가능', options: [
        { key: 'A', text: '$0$ 포함', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0$ 제외', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'C', text: '$\\sqrt{0}$ 미정', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$0$' },
        { key: 'D', text: '정수만', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '가능' },
      ] },
      { stepType: 'ANSWER', prompt: '정의역?', options: [
        { key: 'A', text: '$x \\geq 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x > 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$0$ 포함' },
        { key: 'C', text: '$x \\neq 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'D', text: '모든 실수', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '음수 안 됨' },
        { key: 'E', text: '$x \\leq 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
    ], solution: '근호 안 $\\geq 0$ → $x \\geq 0$.' },

  // Q7
  { chapterCode: CODE, difficulty: 'medium', concept: '$g \\circ f$ 식', requiredSkills: SKILLS_COMP,
    stem: '$f(x) = 2x + 1$, $g(x) = x - 3$. $(g \\circ f)(x)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$g(f(x))$', options: [
        { key: 'A', text: '$f(x) = 2x + 1$ 을 $g$ 에 대입', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$g(x)$ 를 $f$ 에 대입', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '순서' },
        { key: 'C', text: '$f(x) \\cdot g(x)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱' },
        { key: 'D', text: '$f(x) + g(x)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
        { key: 'E', text: '$f - g$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$(2x + 1) - 3$', options: [
        { key: 'A', text: '$2x - 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2x + 4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-3$ 부호' },
        { key: 'C', text: '$2x - 4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2x + 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2x - 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$+1$ 누락' },
      ] },
      { stepType: 'ANSWER', prompt: '$(g \\circ f)(x)$?', options: [
        { key: 'A', text: '$2x - 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2x + 4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2x - 4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2x - 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(2x+1)(x-3)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱' },
      ] },
    ], solution: '$g(f(x)) = (2x+1) - 3 = 2x - 2$.' },

  // Q8
  { chapterCode: CODE, difficulty: 'medium', concept: '역함수 풀이', requiredSkills: SKILLS_INV,
    stem: '$f(x) = 3x - 2$ 의 역함수?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$y = 3x - 2$ 를 $x$ 에 대해', options: [
        { key: 'A', text: '$x = (y + 2)/3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = (y - 2)/3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$+2$' },
        { key: 'C', text: '$x = 3(y + 2)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나누기 자리' },
        { key: 'D', text: '$x = y + 2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$/3$ 누락' },
        { key: 'E', text: '$x = (y + 2)/(3y)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$x, y$ 바꾸기', options: [
        { key: 'A', text: '$y = (x + 2)/3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = (x - 2)/3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$y = 3x + 2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$y = 3x - 2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$f$ 자체' },
        { key: 'E', text: '$y = 3(x + 2)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$f^{-1}(x)$?', options: [
        { key: 'A', text: '$(x + 2)/3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(x - 2)/3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$3x + 2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$3x - 2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$f$' },
        { key: 'E', text: '$3(x + 2)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$y = 3x - 2 \\Rightarrow x = (y+2)/3 \\Rightarrow f^{-1}(x) = (x+2)/3$.' },

  // Q9
  { chapterCode: CODE, difficulty: 'medium', concept: '$f^{-1}$ 함숫값', requiredSkills: SKILLS_INV,
    stem: '$f(x) = 2x$ 일 때 $f^{-1}(8)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$f^{-1}(8)$ 의미', options: [
        { key: 'A', text: '$f(x) = 8$ 이 되는 $x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$f(8)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$f$ 아님' },
        { key: 'C', text: '$8 / f$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$-f(8)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '항상 $0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$2x = 8$', options: [
        { key: 'A', text: '$x = 4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 16$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '곱했음' },
        { key: 'C', text: '$x = 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x = 8$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$x = 0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$f^{-1}(8)$?', options: [
        { key: 'A', text: '$4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$16$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$f(8)$' },
        { key: 'C', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$8$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$2x = 8 \\Rightarrow x = 4$.' },

  // Q10
  { chapterCode: CODE, difficulty: 'medium', concept: '$f \\circ f$', requiredSkills: SKILLS_COMP,
    stem: '$f(x) = 2x + 1$. $(f \\circ f)(x)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$f(f(x))$', options: [
        { key: 'A', text: '$f(x)$ 를 $f$ 의 $x$ 자리에', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$f(x)^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱 아님' },
        { key: 'C', text: '$2 f(x)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$f + f$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
        { key: 'E', text: '$f^{-1}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '역' },
      ] },
      { stepType: 'PROCESS', prompt: '$2(2x+1) + 1$', options: [
        { key: 'A', text: '$4x + 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4x + 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$2 + 1$' },
        { key: 'C', text: '$4x + 2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2x + 2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(2x+1)^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱' },
      ] },
      { stepType: 'ANSWER', prompt: '$(f \\circ f)(x)$?', options: [
        { key: 'A', text: '$4x + 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4x + 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2(2x+1)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$+1$ 누락' },
        { key: 'D', text: '$(2x+1)^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱' },
        { key: 'E', text: '$2x + 2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$f(2x+1) = 2(2x+1) + 1 = 4x + 3$.' },

  // Q11
  { chapterCode: CODE, difficulty: 'medium', concept: '유리함수 점근선', requiredSkills: SKILLS_ASYMPTOTE,
    stem: '$y = 1/(x - 2) + 3$ 의 점근선?',
    steps: [
      { stepType: 'CONCEPT', prompt: '평행이동한 $1/x$', options: [
        { key: 'A', text: '$x = 2$ (수직), $y = 3$ (수평)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = -2, y = -3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$x = 0, y = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$1/x$' },
        { key: 'D', text: '$x = 3, y = 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '바뀜' },
        { key: 'E', text: '없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$y = 1/(x-a) + b$ → $x = a, y = b$', options: [
        { key: 'A', text: '$x = 2, y = 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = -2, y = -3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$x = 0, y = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$x = 3, y = 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '바뀜' },
        { key: 'E', text: '$y = 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '점근선?', options: [
        { key: 'A', text: '$x = 2, y = 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = -2, y = -3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$x = 0, y = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$x = 3, y = 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '바뀜' },
        { key: 'E', text: '없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '평행이동: $x = 2, y = 3$.' },

  // Q12
  { chapterCode: CODE, difficulty: 'medium', concept: '무리함수 정의역·치역', requiredSkills: SKILLS_IRRATIONAL,
    stem: '$y = \\sqrt{x - 2} + 1$ 의 정의역, 치역?',
    steps: [
      { stepType: 'CONCEPT', prompt: '근호 안 $\\geq 0$', options: [
        { key: 'A', text: '$x - 2 \\geq 0$, $\\sqrt{\\cdot} \\geq 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x > 2$, $y > 1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$=$ 포함' },
        { key: 'C', text: '모든 실수', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'D', text: '$x \\leq 2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'E', text: '$x \\neq 2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$x \\geq 2$, $y \\geq 1$', options: [
        { key: 'A', text: '$x \\geq 2$, $y \\geq 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x \\geq 2$, $y \\geq 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$+1$ 누락' },
        { key: 'C', text: '$x \\geq 0$, $y \\geq 1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$-2$ 무시' },
        { key: 'D', text: '$x \\geq 2$, $y \\geq 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '모든 실수', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '정의역, 치역?', options: [
        { key: 'A', text: '$x \\geq 2, y \\geq 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x \\geq 2, y \\geq 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'C', text: '$x \\geq 0, y \\geq 1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'D', text: '$x > 2, y > 1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$=$ 포함' },
        { key: 'E', text: '모든 실수', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
    ], solution: '정의역 $x \\geq 2$, 치역 $y \\geq 1$.' },

  // Q13
  { chapterCode: CODE, difficulty: 'medium', concept: '역함수 존재 조건', requiredSkills: SKILLS_INV_COND,
    stem: '함수가 역함수를 가지려면?',
    steps: [
      { stepType: 'CONCEPT', prompt: '입력과 출력 관계', options: [
        { key: 'A', text: '일대일대응 (bijection)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '연속함수만', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '미분가능', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '양의 함수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '주기함수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$y = x^2$ 의 역함수?', options: [
        { key: 'A', text: '$x \\geq 0$ 으로 제한해야 일대일', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '항상 존재', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\pm$ 모호' },
        { key: 'C', text: '없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '제한 시 있음' },
        { key: 'D', text: '$y = x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
      { stepType: 'ANSWER', prompt: '조건?', options: [
        { key: 'A', text: '일대일대응', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '연속', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '미분가능', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '양의 함수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '주기적', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '일대일대응 (one-to-one onto).' },

  // Q14
  { chapterCode: CODE, difficulty: 'medium', concept: '$f^{-1}(f(x))$', requiredSkills: SKILLS_INV,
    stem: '$f^{-1}(f(x)) = ?$ (정의역 내)',
    steps: [
      { stepType: 'CONCEPT', prompt: '역함수의 역', options: [
        { key: 'A', text: '입력으로 되돌아옴', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0$ 됨', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$f^2(x)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$x^2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '항상 $1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$f^{-1} \\circ f$ = 항등', options: [
        { key: 'A', text: '$x$ (항등함수)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$f(x)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$f^{-1}(x)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$f^{-1}(f(x))$?', options: [
        { key: 'A', text: '$x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$f(x)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$f^2(x)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$f^{-1} \\circ f = $ 항등 → $x$.' },

  // Q15
  { chapterCode: CODE, difficulty: 'medium', concept: '$2/x$ 점근선', requiredSkills: SKILLS_ASYMPTOTE,
    stem: '$y = 2/x$ 의 점근선?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$1/x$ 와 같은 점근선', options: [
        { key: 'A', text: '$x = 0, y = 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 2, y = 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$y = 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '있음' },
        { key: 'E', text: '$x = 1, y = 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '계수 $k$ 가 위치 안 바꿈', options: [
        { key: 'A', text: '원점이 점근 중심', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(2, 2)$ 가 중심', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$y = 2$ 만', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '점근선 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '있음' },
        { key: 'E', text: '$(1, 1)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '점근선?', options: [
        { key: 'A', text: '$x = 0, y = 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 2, y = 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$y = 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '있음' },
        { key: 'E', text: '$x = 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$y = k/x$ 형태 → $x$ 축, $y$ 축이 점근선.' },

  // Q16 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '연립으로 $a, b$', requiredSkills: SKILLS_FN,
    stem: '$f(x) = ax + b$. $f(1) = 3, f(2) = 5$. $a, b$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '연립방정식 세움', options: [
        { key: 'A', text: '$a + b = 3$, $2a + b = 5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a + b = 5, 2a + b = 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '바뀜' },
        { key: 'C', text: '$ab = 3, 2ab = 5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$a - b = 3, 2a - b = 5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$a = 3, b = 5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '뺄셈 → $a = 2, b = 1$', options: [
        { key: 'A', text: '$a = 2, b = 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a = 1, b = 2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '바뀜' },
        { key: 'C', text: '$a = 3, b = 0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$a = 0, b = 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$a = 2, b = 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$(a, b)$?', options: [
        { key: 'A', text: '$(2, 1)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(1, 2)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '바뀜' },
        { key: 'C', text: '$(3, 0)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(2, 3)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(0, 3)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$a + b = 3, 2a + b = 5$ → $a = 2, b = 1$.' },

  // Q17 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '$f$ 역으로 찾기', requiredSkills: SKILLS_COMP,
    stem: '$(f \\circ g)(x) = 2x + 5$, $g(x) = x + 2$. $f(x)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$f(g(x)) = f(x + 2) = 2x + 5$', options: [
        { key: 'A', text: '$f(t) = 2(t - 2) + 5$ ($t = x + 2$)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$f(t) = 2t + 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$g$ 미반영' },
        { key: 'C', text: '$f(t) = t + 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$f(t) = 2t - 5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$f(t) = t^2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$2t - 4 + 5 = 2t + 1$', options: [
        { key: 'A', text: '$f(x) = 2x + 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$f(x) = 2x + 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$-4$ 누락' },
        { key: 'C', text: '$f(x) = 2x - 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$f(x) = x + 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$f(x) = 2(x + 2) + 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$f(x)$?', options: [
        { key: 'A', text: '$2x + 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2x + 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$x + 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2x - 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2(x+2) + 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$x + 2 = t$ 치환 → $f(t) = 2(t-2)+5 = 2t+1$. 따라서 $f(x) = 2x + 1$.' },

  // Q18 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '유리함수 역함수', requiredSkills: SKILLS_INV,
    stem: '$f(x) = (x + 1)/(x - 1)$. $f^{-1}(x)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$y = (x+1)/(x-1)$ 에서 $x$ 풀기', options: [
        { key: 'A', text: '$y(x - 1) = x + 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = x - 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$y + 1 = x - 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$y = x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$y - 1 = 0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$yx - y = x + 1 \\to x(y - 1) = y + 1$', options: [
        { key: 'A', text: '$x = (y + 1)/(y - 1)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = (y - 1)/(y + 1)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '뒤집힘' },
        { key: 'C', text: '$x = y + 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x = y - 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x = y$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$f^{-1}(x)$?', options: [
        { key: 'A', text: '$(x + 1)/(x - 1)$ (자기 자신)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(x - 1)/(x + 1)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '뒤집힘' },
        { key: 'C', text: '$x + 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x - 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1/x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$x(y-1) = y+1 \\to x = (y+1)/(y-1)$. $f^{-1}(x) = (x+1)/(x-1) = f(x)$ — 자기역.' },

  // Q19 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '유리·직선 교점 수', requiredSkills: SKILLS_RATIONAL,
    stem: '$y = 1/(x - 2) + 3$ 과 $y = x$ 의 교점 수?',
    steps: [
      { stepType: 'CONCEPT', prompt: '연립', options: [
        { key: 'A', text: '$1/(x-2) + 3 = x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/(x-2) = 0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$x = 2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x = 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$y = 0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$1 = (x-3)(x-2) \\to x^2 - 5x + 5 = 0$, $D = 25 - 20 = 5 > 0$', options: [
        { key: 'A', text: '서로 다른 두 실근 → 교점 $2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '중근 → $1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$D > 0$' },
        { key: 'C', text: '실근 없음 → $0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '무한대', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '교점 수?', options: [
        { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '중근 아님' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\infty$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$x^2 - 5x + 5 = 0$, $D = 5 > 0$ → 두 점.' },

  // Q20 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '무리함수 정의역·치역', requiredSkills: SKILLS_IRRATIONAL,
    stem: '$y = \\sqrt{x + 3} - 1$ 의 정의역·치역?',
    steps: [
      { stepType: 'CONCEPT', prompt: '근호 안 $\\geq 0$', options: [
        { key: 'A', text: '$x + 3 \\geq 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x \\geq 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$+3$ 무시' },
        { key: 'C', text: '$x \\geq 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '모든 실수', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'E', text: '$x \\leq -3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\sqrt{x+3} \\geq 0 \\to y \\geq -1$', options: [
        { key: 'A', text: '$x \\geq -3, y \\geq -1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x \\geq -3, y \\geq 0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$-1$ 누락' },
        { key: 'C', text: '$x \\geq 3, y \\geq 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x \\geq 0, y \\geq -1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'E', text: '모든 실수, $y \\geq -1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '정의역·치역?', options: [
        { key: 'A', text: '$x \\geq -3, y \\geq -1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x \\geq -3, y \\geq 0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$-1$ 누락' },
        { key: 'C', text: '$x \\geq 3, y \\geq -1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x \\geq 0, y \\geq -1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'E', text: '모든 실수', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
    ], solution: '$x \\geq -3, y \\geq -1$.' },
];

export const K_G10_CS2_CH03_FUNCTION_GRAPH_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
