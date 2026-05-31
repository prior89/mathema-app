/**
 * K-G11-CAL1-CH02-DIFFERENTIATION (미분) — 20문제 3-step Mastery.
 * 고2 미적분Ⅰ — 평균변화율 → 미분계수 (정의·극한) → 도함수 → 다항함수 미분 공식
 *   ($(x^n)^{\prime} = nx^{n-1}$) → 상수배·합·곱 → 접선의 방정식.
 *   (CAL1: 다항함수만; 삼각·지수·로그·합성은 CAL2.)
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 * 주요 errorCode:
 *   FORMULA_SELECTION_ERROR 6 / ALGEBRA_ERROR 7
 *   CONCEPT_MISUNDERSTANDING 5 / ARITHMETIC_ERROR 2
 *
 * Note: LaTeX prime 은 `^{\prime}` 으로 표기 (string literal 단일따옴표 충돌 회피).
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G11-CAL1-CH02-DIFFERENTIATION';
const SKILLS_AVG = ['average_rate_of_change'];
const SKILLS_DEF = ['derivative_definition'];
const SKILLS_POWER = ['power_rule'];
const SKILLS_CONST = ['constant_derivative'];
const SKILLS_GEO = ['tangent_slope_meaning'];
const SKILLS_SUM = ['sum_rule_derivative'];
const SKILLS_PRODUCT = ['product_rule_derivative'];
const SKILLS_TANGENT = ['tangent_line_equation'];
const SKILLS_VALUE = ['derivative_value_at_point'];

const problems: KoreanProblemSeed[] = [
  // Q1
  { chapterCode: CODE, difficulty: 'easy', concept: '평균변화율 정의', requiredSkills: SKILLS_AVG,
    stem: '구간 $[a, b]$ 에서 $f$ 의 평균변화율?',
    steps: [
      { stepType: 'CONCEPT', prompt: '평균변화율 의미', options: [
        { key: 'A', text: '$\\Delta y / \\Delta x = (f(b) - f(a))/(b - a)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(f(b) + f(a))/2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '평균' },
        { key: 'C', text: '$f(b) - f(a)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '나누기 누락' },
        { key: 'D', text: '$f^{\\prime}(a)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '미분계수' },
        { key: 'E', text: '$(b - a)/2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\Delta y / \\Delta x$', options: [
        { key: 'A', text: '$(f(b) - f(a))/(b - a)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$f(b) f(a)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$f(b - a)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$f^{\\prime}(b - a)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$(f(b) - f(a))/(b - a)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(f(b) + f(a))/2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '평균' },
        { key: 'C', text: '$f(b) - f(a)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$f^{\\prime}(a)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '미분계수' },
        { key: 'E', text: '$(b - a)/2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\Delta y / \\Delta x = (f(b) - f(a))/(b - a)$.' },

  // Q2
  { chapterCode: CODE, difficulty: 'easy', concept: '평균변화율 계산', requiredSkills: SKILLS_AVG,
    stem: '$f(x) = x^2$ 의 $[1, 3]$ 에서 평균변화율?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$f(1), f(3)$', options: [
        { key: 'A', text: '$f(1) = 1, f(3) = 9$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$f(1) = 2, f(3) = 6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$2x$' },
        { key: 'C', text: '$f(1) = 1, f(3) = 6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$f(1) = 1, f(3) = 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$(9 - 1)/(3 - 1) = 8/2$', options: [
        { key: 'A', text: '$4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$8$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나누기 누락' },
        { key: 'C', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$10$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '값?', options: [
        { key: 'A', text: '$4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$8$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나누기 누락' },
        { key: 'C', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$10$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(9 - 1)/(3 - 1) = 4$.' },

  // Q3
  { chapterCode: CODE, difficulty: 'easy', concept: 'power rule $x^2$', requiredSkills: SKILLS_POWER,
    stem: '$(x^2)^{\\prime} = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '거듭제곱 공식 $(x^n)^{\\prime} = nx^{n-1}$', options: [
        { key: 'A', text: '$2x^{2-1}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^2$ 그대로', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2x^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$-1$ 누락' },
        { key: 'D', text: '$x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$2x$', options: [
        { key: 'A', text: '$2x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2x^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$(x^2)^{\\prime}$?', options: [
        { key: 'A', text: '$2x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2x^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(x^2)^{\\prime} = 2x$.' },

  // Q4
  { chapterCode: CODE, difficulty: 'easy', concept: 'power rule $x^3$', requiredSkills: SKILLS_POWER,
    stem: '$(x^3)^{\\prime} = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$nx^{n-1}$, $n = 3$', options: [
        { key: 'A', text: '$3x^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3x^3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$-1$ 누락' },
        { key: 'C', text: '$x^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$n$ 누락' },
        { key: 'D', text: '$x^3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$3x^2$', options: [
        { key: 'A', text: '$3x^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$3x^3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$6x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x^3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$(x^3)^{\\prime}$?', options: [
        { key: 'A', text: '$3x^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$3x^3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$6x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x^3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(x^3)^{\\prime} = 3x^2$.' },

  // Q5
  { chapterCode: CODE, difficulty: 'easy', concept: '상수 미분', requiredSkills: SKILLS_CONST,
    stem: '$(5)^{\\prime} = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '상수의 미분', options: [
        { key: 'A', text: '$0$ (변화 없음)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5$ 그대로', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$5x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$x$ 가 변해도 $5$ 는 그대로 → 변화율 $0$', options: [
        { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
        { key: 'E', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$5x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
    ], solution: '상수 미분 $= 0$.' },

  // Q6
  { chapterCode: CODE, difficulty: 'easy', concept: '$f^{prime}(a)$ 기하학적 의미', requiredSkills: SKILLS_GEO,
    stem: '$f^{\\prime}(a)$ 의 기하학적 의미?',
    steps: [
      { stepType: 'CONCEPT', prompt: '접선', options: [
        { key: 'A', text: '$x = a$ 에서 접선의 기울기', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '함숫값 $f(a)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '구간 평균', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평균변화율' },
        { key: 'D', text: '면적', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '적분' },
        { key: 'E', text: '극값', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '순간변화율', options: [
        { key: 'A', text: '접선 기울기 = 순간변화율', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '곡선 아래 넓이', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '적분' },
        { key: 'C', text: '$f(a)$ 값', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '극값', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
      { stepType: 'ANSWER', prompt: '의미?', options: [
        { key: 'A', text: '접선의 기울기', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$f(a)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '면적', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '평균값', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '극값', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$f^{\\prime}(a)$ = $x = a$ 에서 접선의 기울기.' },

  // Q7
  { chapterCode: CODE, difficulty: 'medium', concept: '상수배', requiredSkills: SKILLS_POWER,
    stem: '$f(x) = 2x^3$ → $f^{\\prime}(x)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$(cf)^{\\prime} = c f^{\\prime}$', options: [
        { key: 'A', text: '$2 \\cdot (x^3)^{\\prime} = 2 \\cdot 3x^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2x^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$2$ 누락' },
        { key: 'C', text: '$(2x)^3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2 \\cdot 3 \\cdot x^3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$6x^2$', options: [
        { key: 'A', text: '$6x^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2x^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$2$ 누락' },
        { key: 'C', text: '$3x^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$6x^3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2x^3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$f^{\\prime}(x)$?', options: [
        { key: 'A', text: '$6x^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2x^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$3x^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$6x^3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2x^3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$f^{\\prime}(x) = 2 \\cdot 3x^2 = 6x^2$.' },

  // Q8
  { chapterCode: CODE, difficulty: 'medium', concept: '합 미분', requiredSkills: SKILLS_SUM,
    stem: '$f(x) = x^2 + 3x$ → $f^{\\prime}(x)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '각각 미분 후 더함', options: [
        { key: 'A', text: '$(x^2)^{\\prime} + (3x)^{\\prime} = 2x + 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2x + 3x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$3x$ 미분 잘못' },
        { key: 'C', text: '$x + 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x^2 + 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$x^2$ 미분 안 함' },
        { key: 'E', text: '$2x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$3x$ 누락' },
      ] },
      { stepType: 'PROCESS', prompt: '$2x + 3$', options: [
        { key: 'A', text: '$2x + 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x + 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2x^2 + 3x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$f^{\\prime}(x)$?', options: [
        { key: 'A', text: '$2x + 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$x + 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2x + 3x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$f^{\\prime}(x) = 2x + 3$.' },

  // Q9
  { chapterCode: CODE, difficulty: 'medium', concept: '다항 미분', requiredSkills: SKILLS_SUM,
    stem: '$f(x) = x^3 - 2x^2 + x$ → $f^{\\prime}(x)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '각 항 미분', options: [
        { key: 'A', text: '$3x^2 - 4x + 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3x^2 - 4x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$+1$ 누락' },
        { key: 'C', text: '$3x^2 - 2x + 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$-2x^2$ 미분' },
        { key: 'D', text: '$3x^2 + 4x + 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'E', text: '$x^2 - 2x + 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$3x^2 - 4x + 1$', options: [
        { key: 'A', text: '$3x^2 - 4x + 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3x^2 - 4x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$3x^2 - 2x + 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$3x^2 + 4x + 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$3x^2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$f^{\\prime}(x)$?', options: [
        { key: 'A', text: '$3x^2 - 4x + 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3x^2 - 4x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$3x^2 + 4x + 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$3x^2 - 2x + 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x^2 - 2x + 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$f^{\\prime}(x) = 3x^2 - 4x + 1$.' },

  // Q10
  { chapterCode: CODE, difficulty: 'medium', concept: '$f^{prime}(a)$ 값', requiredSkills: SKILLS_VALUE,
    stem: '$f(x) = x^2 + 1$ → $f^{\\prime}(2)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$f^{\\prime} = 2x$', options: [
        { key: 'A', text: '$f^{\\prime}(x) = 2x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$f^{\\prime}(x) = 2x + 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '상수 무시' },
        { key: 'C', text: '$f^{\\prime}(x) = x^2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$f^{\\prime}(x) = 2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$f^{\\prime}(x) = x + 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$x = 2$ 대입', options: [
        { key: 'A', text: '$4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$f(2)$' },
        { key: 'C', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$8$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$f^{\\prime}(2)$?', options: [
        { key: 'A', text: '$4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$f(2)$' },
        { key: 'C', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$8$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$f^{\\prime}(2) = 2 \\cdot 2 = 4$.' },

  // Q11
  { chapterCode: CODE, difficulty: 'medium', concept: '$f^{prime}(1)$', requiredSkills: SKILLS_VALUE,
    stem: '$f(x) = x^3$ → $f^{\\prime}(1)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$f^{\\prime}(x) = 3x^2$', options: [
        { key: 'A', text: '$3x^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$3x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$3 \\cdot 1$', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$f(1)$' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$f^{\\prime}(1)$?', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$f^{\\prime}(1) = 3$.' },

  // Q12
  { chapterCode: CODE, difficulty: 'medium', concept: '미분계수 정의식', requiredSkills: SKILLS_DEF,
    stem: '$f^{\\prime}(a)$ 의 정의식?',
    steps: [
      { stepType: 'CONCEPT', prompt: '극한으로 정의', options: [
        { key: 'A', text: '$\\lim_{h \\to 0} (f(a+h) - f(a))/h$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(f(b) - f(a))/(b - a)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '평균변화율' },
        { key: 'C', text: '$f(a) / a$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$f(a) \\cdot a$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$f(a + 1) - f(a)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$h \\to 0$ 극한', options: [
        { key: 'A', text: '$\\lim_{h \\to 0} (f(a+h) - f(a))/h$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$f(0)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$f(a) - f(0)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\sum f$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$f(a) + h$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '정의식?', options: [
        { key: 'A', text: '$\\lim_{h \\to 0} (f(a+h) - f(a))/h$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(f(b) - f(a))/(b-a)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '평균변화율' },
        { key: 'C', text: '$f(a)/a$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$f(a) \\cdot a$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sum f$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$f^{\\prime}(a) = \\lim_{h \\to 0} (f(a+h) - f(a))/h$.' },

  // Q13
  { chapterCode: CODE, difficulty: 'medium', concept: '곱의 전개 후 미분', requiredSkills: SKILLS_PRODUCT,
    stem: '$f(x) = (x + 1)(x - 2)$ → $f^{\\prime}(x)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '전개 또는 곱 규칙', options: [
        { key: 'A', text: '전개 $x^2 - x - 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(x+1)^{\\prime} (x-2)^{\\prime}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱 규칙 잘못' },
        { key: 'C', text: '$(x+1) + (x-2)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$(x^2 - x - 2)^{\\prime}$', options: [
        { key: 'A', text: '$2x - 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2x + 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$2x - 2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$-2$ 미분' },
        { key: 'D', text: '$x - 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$f^{\\prime}(x)$?', options: [
        { key: 'A', text: '$2x - 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2x + 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x - 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '전개 $x^2 - x - 2 \\to 2x - 1$.' },

  // Q14
  { chapterCode: CODE, difficulty: 'medium', concept: '접선 기울기', requiredSkills: SKILLS_TANGENT,
    stem: '곡선 $y = f(x)$ 의 $x = a$ 에서 접선 기울기?',
    steps: [
      { stepType: 'CONCEPT', prompt: '미분계수와 동일', options: [
        { key: 'A', text: '$f^{\\prime}(a)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$f(a)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '함숫값' },
        { key: 'C', text: '평균변화율', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$f^{\\prime}(a) \\cdot a$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '미분계수', options: [
        { key: 'A', text: '$f^{\\prime}(a)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$f(a)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$1/f^{\\prime}(a)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$-f^{\\prime}(a)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$f^{\\prime}(0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$f^{\\prime}(a)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$f(a)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$f^{\\prime}(0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '평균변화율', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$1/f^{\\prime}(a)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$f^{\\prime}(a)$.' },

  // Q15
  { chapterCode: CODE, difficulty: 'medium', concept: '$x^2$ 접선 기울기', requiredSkills: SKILLS_TANGENT,
    stem: '$f(x) = x^2$ 의 $x = 1$ 에서 접선의 기울기?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$f^{\\prime}(x) = 2x$', options: [
        { key: 'A', text: '$2x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '미분 안 함' },
        { key: 'C', text: '$x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$f^{\\prime}(1) = 2$', options: [
        { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '기울기?', options: [
        { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$f^{\\prime}(1) = 2 \\cdot 1 = 2$.' },

  // Q16 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '접선의 방정식', requiredSkills: SKILLS_TANGENT,
    stem: '$f(x) = x^2$ 의 $x = 1$ 에서 접선의 방정식?',
    steps: [
      { stepType: 'CONCEPT', prompt: '점 $(1, f(1)) = (1, 1)$, 기울기 $f^{\\prime}(1) = 2$', options: [
        { key: 'A', text: '$y - 1 = 2(x - 1)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = 2x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$(1,1)$ 무시' },
        { key: 'C', text: '$y - 1 = 1(x - 1)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '기울기 잘못' },
        { key: 'D', text: '$y = x + 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$y - 2 = (x - 1)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$y = 2x - 1$', options: [
        { key: 'A', text: '$y = 2x - 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = 2x + 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$y = 2x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$y = x - 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$y = x + 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '접선?', options: [
        { key: 'A', text: '$y = 2x - 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = 2x + 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$y = 2x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$y = x - 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$y = x + 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$y - 1 = 2(x - 1) \\Rightarrow y = 2x - 1$.' },

  // Q17 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '미분계수 조건으로 미지수', requiredSkills: SKILLS_VALUE,
    stem: '$f(x) = x^3 + ax + 1$ 이 $f^{\\prime}(1) = 5$. $a$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$f^{\\prime}(x) = 3x^2 + a$', options: [
        { key: 'A', text: '$f^{\\prime}(1) = 3 + a$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$f^{\\prime}(1) = 3 + a + 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$+1$ 미분' },
        { key: 'C', text: '$f^{\\prime}(1) = a$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$3x^2$ 누락' },
        { key: 'D', text: '$f^{\\prime}(1) = 1 + a$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$f^{\\prime}(1) = 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$a$ 누락' },
      ] },
      { stepType: 'PROCESS', prompt: '$3 + a = 5$', options: [
        { key: 'A', text: '$a = 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a = 8$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$a = -2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$a = 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$a = 0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$a$?', options: [
        { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$8$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$3 + a = 5 \\Rightarrow a = 2$.' },

  // Q18 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '정의로 미분계수', requiredSkills: SKILLS_DEF,
    stem: '$f(x) = x^3$ 의 $x = 2$ 에서 미분계수를 정의로 구하면?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\lim_{h \\to 0} ((2+h)^3 - 8)/h$', options: [
        { key: 'A', text: '$(2+h)^3 = 8 + 12h + 6h^2 + h^3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(2+h)^3 = 8 + h^3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '이항정리 누락' },
        { key: 'C', text: '$(2+h)^3 = 8h$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2^3 + h^3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(2 + h)^3 = 2 \\cdot 3 \\cdot h$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\lim (12h + 6h^2 + h^3)/h = \\lim (12 + 6h + h^2)$', options: [
        { key: 'A', text: '$12$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$8$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$f^{\\prime}(2)$?', options: [
        { key: 'A', text: '$12$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$8$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\lim (12 + 6h + h^2) = 12$. (공식 $3x^2$ at $x=2$ 와 일치.)' },

  // Q19 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '곱 미분', requiredSkills: SKILLS_PRODUCT,
    stem: '$f(x) = x^2 (x + 1)$ → $f^{\\prime}(x)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '전개 또는 곱 규칙', options: [
        { key: 'A', text: '전개 $x^3 + x^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^2 \\cdot 1 = x^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$(x^2)^{\\prime} \\cdot (x+1)^{\\prime}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱 규칙 잘못' },
        { key: 'D', text: '$2x \\cdot (x+1)$ 만', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '한 항만' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$(x^3 + x^2)^{\\prime} = 3x^2 + 2x$', options: [
        { key: 'A', text: '$3x^2 + 2x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3x^2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$2x$ 누락' },
        { key: 'C', text: '$2x^2 + x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x^3 + x^2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '미분 안 함' },
        { key: 'E', text: '$3x^2 + 2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$f^{\\prime}(x)$?', options: [
        { key: 'A', text: '$3x^2 + 2x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3x^2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2x^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x^3 + x^2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$3x^2 + 2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$x^2(x+1) = x^3 + x^2 \\to 3x^2 + 2x$.' },

  // Q20 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '수평 접선', requiredSkills: SKILLS_VALUE,
    stem: '$f(x) = x^3 - 3x$ 의 $x = 1$ 에서 접선 기울기?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$f^{\\prime}(x) = 3x^2 - 3$', options: [
        { key: 'A', text: '$3x^2 - 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3x^2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$-3$ 미분' },
        { key: 'C', text: '$x^3 - 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$3x - 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$f^{\\prime}(1) = 3 - 3 = 0$', options: [
        { key: 'A', text: '$0$ (수평 접선)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$-3$ 누락' },
        { key: 'C', text: '$-3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$-2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '기울기?', options: [
        { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$-3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$-2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$f^{\\prime}(1) = 3 - 3 = 0$ → 수평 접선.' },
];

export const K_G11_CAL1_CH02_DIFFERENTIATION_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
