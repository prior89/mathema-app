/**
 * K-G11-CAL1-CH03-INTEGRATION (적분) — 20문제 3-step Mastery.
 * 고2 미적분Ⅰ — 부정적분 ($F^{\prime} = f \Leftrightarrow \int f dx = F + C$) →
 *   거듭제곱 공식 ($\int x^n dx = x^{n+1}/(n+1) + C$) → 상수배·합 →
 *   정적분 ($\int_a^b = F(b) - F(a)$) → 미적분 기본정리 → 넓이.
 *   (CAL1: 다항함수만; 삼각·지수·로그·치환·부분은 CAL2.)
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 * 주요 errorCode:
 *   FORMULA_SELECTION_ERROR 7 / ALGEBRA_ERROR 6
 *   CONCEPT_MISUNDERSTANDING 5 / ARITHMETIC_ERROR 2
 *
 * Note: LaTeX prime 은 `^{\prime}` 으로 표기 (string 따옴표 충돌 회피).
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G11-CAL1-CH03-INTEGRATION';
const SKILLS_INDEF = ['indefinite_integral'];
const SKILLS_POWER_INT = ['integral_power_rule'];
const SKILLS_CONST_INT = ['integral_of_constant'];
const SKILLS_SUM_INT = ['integral_sum_rule'];
const SKILLS_DEF_INT = ['definite_integral'];
const SKILLS_FTC = ['fundamental_theorem_calculus'];
const SKILLS_AREA = ['area_under_curve'];
const SKILLS_RECOVER = ['recover_integrand_by_diff'];

const problems: KoreanProblemSeed[] = [
  // Q1
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\int x^2 dx$', requiredSkills: SKILLS_POWER_INT,
    stem: '$\\int x^2 \\, dx = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '거듭제곱 공식 $\\int x^n dx = x^{n+1}/(n+1) + C$', options: [
        { key: 'A', text: '$x^3 / 3 + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^3 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '나누기 누락' },
        { key: 'C', text: '$2x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '미분' },
        { key: 'D', text: '$x^2 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x^3/2 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$n = 2 \\to n+1 = 3$', options: [
        { key: 'A', text: '$x^3/3 + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$C$ 누락' },
        { key: 'C', text: '$3x^2 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '미분' },
        { key: 'D', text: '$x^2 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$x^3/3 + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '미분' },
        { key: 'C', text: '$x^3 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '나누기 누락' },
        { key: 'D', text: '$x^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$3x^2 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\int x^2 dx = x^3/3 + C$.' },

  // Q2
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\int x^3 dx$', requiredSkills: SKILLS_POWER_INT,
    stem: '$\\int x^3 \\, dx = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$n = 3$', options: [
        { key: 'A', text: '$x^4/4 + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^4 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '나누기 누락' },
        { key: 'C', text: '$3x^2 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '미분' },
        { key: 'D', text: '$x^3/3 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x^4/3 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$x^4/4$', options: [
        { key: 'A', text: '$x^4/4 + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^4 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '나누기 누락' },
        { key: 'C', text: '$3x^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x^3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$4x^3 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$x^4/4 + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^4 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$3x^2 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '미분' },
        { key: 'D', text: '$x^3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x^4/3 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$x^4/4 + C$.' },

  // Q3
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\int 1 dx$', requiredSkills: SKILLS_CONST_INT,
    stem: '$\\int 1 \\, dx = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '상수의 부정적분', options: [
        { key: 'A', text: '$x + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$0 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '미분 아님' },
        { key: 'D', text: '$x^2/2 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\ln x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$1 = x^0$, $n = 0 \\to x^1/1$', options: [
        { key: 'A', text: '$x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x^2/2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\ln x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$x + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x^2/2 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\ln x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\int 1 dx = x + C$.' },

  // Q4
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\int c dx$', requiredSkills: SKILLS_CONST_INT,
    stem: '$\\int 2 \\, dx = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '상수 $c$ 의 부정적분', options: [
        { key: 'A', text: '$cx + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$c + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '미분 아님' },
        { key: 'D', text: '$c^2 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$c$ 누락' },
      ] },
      { stepType: 'PROCESS', prompt: '$2 \\cdot x$', options: [
        { key: 'A', text: '$2x + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$x^2 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$2x + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$x^2 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\int 2 dx = 2x + C$.' },

  // Q5
  { chapterCode: CODE, difficulty: 'easy', concept: '거듭제곱 공식', requiredSkills: SKILLS_POWER_INT,
    stem: '$\\int x^n \\, dx$ ($n \\neq -1$)?',
    steps: [
      { stepType: 'CONCEPT', prompt: '지수 +1, 그 값으로 나눔', options: [
        { key: 'A', text: '$x^{n+1}/(n+1) + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^{n-1}/(n-1) + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '미분 형태' },
        { key: 'C', text: '$n x^{n-1} + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '미분 공식' },
        { key: 'D', text: '$x^n + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\ln x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$n = -1$ 만' },
      ] },
      { stepType: 'PROCESS', prompt: '$x^{n+1}/(n+1)$', options: [
        { key: 'A', text: '$x^{n+1}/(n+1) + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$n x^{n-1}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '미분' },
        { key: 'C', text: '$x^n / n + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x^{n+1}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x \\cdot n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$x^{n+1}/(n+1) + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$n x^{n-1} + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '미분 공식' },
        { key: 'C', text: '$x^n + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\ln x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x^{n+1}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\int x^n dx = x^{n+1}/(n+1) + C$ ($n \\neq -1$).' },

  // Q6
  { chapterCode: CODE, difficulty: 'easy', concept: '부정적분 정의', requiredSkills: SKILLS_INDEF,
    stem: '$F^{\\prime}(x) = f(x)$ 이면 $\\int f(x) dx = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '역연산 정의', options: [
        { key: 'A', text: '$F(x) + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$F(x)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$C$ 누락' },
        { key: 'C', text: '$f(x)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$F^{\\prime}(x)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$C$ 는 적분상수', options: [
        { key: 'A', text: '$F(x) + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$F(x) + x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$F(x) \\cdot C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$F(x)/C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$F(x)^C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$F(x) + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$F(x)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$C$ 누락' },
        { key: 'C', text: '$f(x)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$F^{\\prime}(x)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\int f dx = F(x) + C$.' },

  // Q7
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\int x dx$', requiredSkills: SKILLS_POWER_INT,
    stem: '$\\int x \\, dx = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$x = x^1$, $n + 1 = 2$', options: [
        { key: 'A', text: '$x^2/2 + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^2 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '나누기 누락' },
        { key: 'C', text: '$1 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '미분' },
        { key: 'D', text: '$x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$x^2/2$', options: [
        { key: 'A', text: '$x^2/2 + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^2 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$x^2/2 + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^2 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\int x dx = x^2/2 + C$.' },

  // Q8
  { chapterCode: CODE, difficulty: 'medium', concept: '합 적분', requiredSkills: SKILLS_SUM_INT,
    stem: '$\\int (2x + 3) \\, dx = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '각 항 적분', options: [
        { key: 'A', text: '$\\int 2x dx + \\int 3 dx$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(2x + 3)^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$(2x)(3)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2 + 3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$x^2 + 3x$', options: [
        { key: 'A', text: '$x^2 + 3x + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^2 + 3 + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$3$ 적분 잘못' },
        { key: 'C', text: '$2x + 3 + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '미분' },
        { key: 'D', text: '$x^2 + 3x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$C$ 누락' },
        { key: 'E', text: '$x^2 / 2 + 3x + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$2x$ 잘못' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$x^2 + 3x + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^2 + 3 + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2x + 3 + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '미분' },
        { key: 'D', text: '$x^2 + 3x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$C$ 누락' },
        { key: 'E', text: '$2x^2 + 3x + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$2x$ 잘못' },
      ] },
    ], solution: '$\\int (2x + 3) dx = x^2 + 3x + C$.' },

  // Q9
  { chapterCode: CODE, difficulty: 'medium', concept: '다항 적분', requiredSkills: SKILLS_SUM_INT,
    stem: '$\\int (3x^2 + 1) \\, dx = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '항별 적분', options: [
        { key: 'A', text: '$3 \\cdot x^3/3 + x + C = x^3 + x + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3x^2 + 1 + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '적분 안 함' },
        { key: 'C', text: '$x^3 + 1 + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$1$ 적분 잘못' },
        { key: 'D', text: '$6x + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '미분' },
        { key: 'E', text: '$x^3/3 + x + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$3$ 곱 누락' },
      ] },
      { stepType: 'PROCESS', prompt: '$x^3 + x$', options: [
        { key: 'A', text: '$x^3 + x + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^3 + 1 + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$1$ 적분' },
        { key: 'C', text: '$3x^2 + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$1$ 누락' },
        { key: 'D', text: '$x^3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$3x + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$x^3 + x + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^3 + 1 + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$3x^2 + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x^3/3 + x + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$3$ 곱 누락' },
        { key: 'E', text: '$6x + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '미분' },
      ] },
    ], solution: '$x^3 + x + C$.' },

  // Q10
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\int_0^1 x^2$', requiredSkills: SKILLS_DEF_INT,
    stem: '$\\int_0^1 x^2 \\, dx = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$F(x) = x^3/3$, $F(1) - F(0)$', options: [
        { key: 'A', text: '$1/3 - 0 = 1/3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1 - 0 = 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1/2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$1/3$', options: [
        { key: 'A', text: '$1/3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$1/2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$1/3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$1/2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$[x^3/3]_0^1 = 1/3$.' },

  // Q11
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\int_0^2 x$', requiredSkills: SKILLS_DEF_INT,
    stem: '$\\int_0^2 x \\, dx = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$F(x) = x^2/2$', options: [
        { key: 'A', text: '$F(2) - F(0) = 2 - 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$F(2) = 4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나누기 누락' },
        { key: 'C', text: '$2 \\cdot 2 = 4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$2$', options: [
        { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나누기 누락' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1/2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1/2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$[x^2/2]_0^2 = 2$.' },

  // Q12
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\int_1^2 2x$', requiredSkills: SKILLS_DEF_INT,
    stem: '$\\int_1^2 2x \\, dx = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$F(x) = x^2$', options: [
        { key: 'A', text: '$F(2) - F(1) = 4 - 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$F(2) - F(0)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '하한 잘못' },
        { key: 'C', text: '$2 \\cdot 2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$F(1)$ 만', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$3$', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '하한 무시' },
        { key: 'C', text: '$5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '하한 무시' },
        { key: 'C', text: '$5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$[x^2]_1^2 = 4 - 1 = 3$.' },

  // Q13
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\int_0^1 1$', requiredSkills: SKILLS_DEF_INT,
    stem: '$\\int_0^1 1 \\, dx = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$F(x) = x$', options: [
        { key: 'A', text: '$F(1) - F(0) = 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$1/2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$1$', options: [
        { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$1/2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$1/2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$[x]_0^1 = 1$.' },

  // Q14
  { chapterCode: CODE, difficulty: 'medium', concept: '정적분 정의 (FTC)', requiredSkills: SKILLS_FTC,
    stem: '$\\int_a^b f(x) dx$ 의 값은? ($F^{\\prime} = f$)',
    steps: [
      { stepType: 'CONCEPT', prompt: '미적분 기본정리', options: [
        { key: 'A', text: '$F(b) - F(a)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$F(a) - F(b)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$F(a) + F(b)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$F(b) F(a)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$F(b - a)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$[F(x)]_a^b$', options: [
        { key: 'A', text: '$F(b) - F(a)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$F(a) - F(b)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$F(a + b)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$f(b) - f(a)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$F(b) - F(a)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$F(a) - F(b)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$F(a) + F(b)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$F(b - a)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\int_a^b f dx = F(b) - F(a)$.' },

  // Q15
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\int_a^a$', requiredSkills: SKILLS_DEF_INT,
    stem: '$\\int_a^a f(x) dx = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$F(a) - F(a)$', options: [
        { key: 'A', text: '$0$ (자기 자신 빼기)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2 F(a)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$F(a)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$f(a)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$0$', options: [
        { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$F(a)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$f(a)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$2a$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$F(a)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$f(a)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$a$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$F(a) - F(a) = 0$.' },

  // Q16 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '$\\int (x^2 + 1)$', requiredSkills: SKILLS_DEF_INT,
    stem: '$\\int_0^2 (x^2 + 1) \\, dx = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$F(x) = x^3/3 + x$', options: [
        { key: 'A', text: '$F(2) - F(0) = (8/3 + 2) - 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$F(2) = 8/3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$+x$ 누락' },
        { key: 'C', text: '$F(2) = 2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$F(0) - F(2)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$8/3 + 2 = 8/3 + 6/3$', options: [
        { key: 'A', text: '$14/3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$10/3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$8/3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$2$ 누락' },
        { key: 'D', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$14/3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$10/3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$8/3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$[x^3/3 + x]_0^2 = 8/3 + 2 = 14/3$.' },

  // Q17 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '넓이', requiredSkills: SKILLS_AREA,
    stem: '곡선 $y = x^2$ 와 $x = 1, x = 2$, $x$축 으로 둘러싸인 넓이?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\int_1^2 x^2 dx$', options: [
        { key: 'A', text: '$\\int_1^2 x^2 dx$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\int_0^2 x^2 dx$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '하한' },
        { key: 'C', text: '$x^2$ 자체', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$2 \\cdot 1 = 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$\\int 2x dx$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '미분' },
      ] },
      { stepType: 'PROCESS', prompt: '$[x^3/3]_1^2 = 8/3 - 1/3$', options: [
        { key: 'A', text: '$7/3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$8/3$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '하한 무시' },
        { key: 'C', text: '$9/3 = 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1/3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '넓이?', options: [
        { key: 'A', text: '$7/3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$8/3$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'C', text: '$3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1/3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\int_1^2 x^2 dx = 7/3$.' },

  // Q18 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '$\\int (x^2 - x)$', requiredSkills: SKILLS_DEF_INT,
    stem: '$\\int_0^3 (x^2 - x) \\, dx = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$F(x) = x^3/3 - x^2/2$', options: [
        { key: 'A', text: '$F(3) - F(0) = (27/3 - 9/2) - 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$F(3) = 27 - 9 = 18$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나누기 누락' },
        { key: 'C', text: '$F(3) = 0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$3 \\cdot 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$9 - 9/2 = 18/2 - 9/2$', options: [
        { key: 'A', text: '$9/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$x^2/2$ 무시' },
        { key: 'C', text: '$18$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$3/2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$9/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$18$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$3/2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$[x^3/3 - x^2/2]_0^3 = 9 - 9/2 = 9/2$.' },

  // Q19 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '$f$ 복원', requiredSkills: SKILLS_RECOVER,
    stem: '$\\int f(x) dx = x^2 + 3x + C$ 일 때 $f(x)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$f = F^{\\prime}$', options: [
        { key: 'A', text: '$F^{\\prime} = (x^2 + 3x)^{\\prime}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$F$ 자체', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$\\int F dx$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '미분 $\\to 2x + 3$', options: [
        { key: 'A', text: '$2x + 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^2 + 3x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '미분 안 함' },
        { key: 'C', text: '$x^2 + 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$+3$ 누락' },
        { key: 'E', text: '$3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$f(x)$?', options: [
        { key: 'A', text: '$2x + 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^2 + 3x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$x^2 + 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$f = F^{\\prime} = 2x + 3$.' },

  // Q20 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '홀함수 대칭구간', requiredSkills: SKILLS_DEF_INT,
    stem: '$\\int_{-1}^1 x^3 \\, dx = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$F(x) = x^4/4$', options: [
        { key: 'A', text: '$F(1) - F(-1) = 1/4 - 1/4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$F(1)$ 만 = $1/4$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '하한' },
        { key: 'C', text: '$x^4 / 4 |_{-1}^1 = 2 \\cdot 1/4 = 1/2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$(-1)^4 = 1$ 처리 잘못' },
        { key: 'D', text: '$F(-1) - F(1)$ 순서', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '상한·하한 바뀜' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$(-1)^4 = 1$', options: [
        { key: 'A', text: '$1/4 - 1/4 = 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1/4$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'E', text: '$-1/4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1/4$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'E', text: '$-1/4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$x^3$ 홀함수, 대칭구간 → $0$. ($F(1) - F(-1) = 1/4 - 1/4 = 0$.)' },
];

export const K_G11_CAL1_CH03_INTEGRATION_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
