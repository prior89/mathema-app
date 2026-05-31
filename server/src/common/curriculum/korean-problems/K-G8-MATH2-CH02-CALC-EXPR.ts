/**
 * K-G8-MATH2-CH02-CALC-EXPR (지수법칙·다항식 계산) — 20문제 3-step Mastery.
 * 중2 — 지수법칙 ($a^m \cdot a^n$, $(a^m)^n$, $a^m / a^n$, $(ab)^n$) →
 *        단항식·다항식 전개 → 곱셈공식 ($(a+b)^2, (a-b)^2, (a+b)(a-b)$).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 * 주요 errorCode 분배:
 *   EXPONENT_ERROR 6 (Q1,2,3,4,7,18) / ALGEBRA_ERROR 5 (Q5,6,10,13,14)
 *   FORMULA_SELECTION_ERROR 4 (Q11,12,15,16) / SIGN_ERROR 2 (Q9,17)
 *   CONCEPT_MISUNDERSTANDING 2 (Q8,19) / CONDITION_MISSING 1 (Q20)
 *
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G8-MATH2-CH02-CALC-EXPR';
const SKILLS_EXP_MUL = ['exponent_multiplication', 'add_exponents'];
const SKILLS_EXP_POW = ['exponent_power', 'multiply_exponents'];
const SKILLS_EXP_DIST = ['exponent_distribution', 'product_power'];
const SKILLS_EXP_DIV = ['exponent_division', 'subtract_exponents'];
const SKILLS_MONO = ['monomial_multiplication', 'coefficient_product'];
const SKILLS_LIKE = ['like_terms', 'coefficient_combine'];
const SKILLS_DISTRIB = ['distributive_law', 'polynomial_subtraction'];
const SKILLS_FORMULA = ['multiplication_formula', 'binomial_square'];
const SKILLS_FOIL = ['foil_method', 'cross_multiplication'];

const problems: KoreanProblemSeed[] = [
  // Q1
  { chapterCode: CODE, difficulty: 'easy', concept: '지수법칙 (곱)', requiredSkills: SKILLS_EXP_MUL,
    stem: '$x^2 \\cdot x^3$ 을 간단히 하면?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$a^m \\cdot a^n = ?$', options: [
        { key: 'A', text: '$a^{m+n}$ (지수를 더함)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a^{mn}$ (지수를 곱함)', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$(a^m)^n$ 공식과 혼동' },
        { key: 'C', text: '$a^{m-n}$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '나눗셈 공식과 혼동' },
        { key: 'D', text: '$2a^{m+n}$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '근거 없는 계수' },
        { key: 'E', text: '$a^m + a^n$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '식 자체 잘못' },
      ] },
      { stepType: 'PROCESS', prompt: '지수 $2 + 3 = ?$', options: [
        { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$6$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '곱셈' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '차' },
        { key: 'D', text: '$2 \\cdot 3 = 6$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '곱' },
        { key: 'E', text: '$23$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '붙여 씀' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$x^5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^6$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '지수 곱' },
        { key: 'C', text: '$x^1$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '차' },
        { key: 'D', text: '$2x^5$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '근거 없는 계수' },
        { key: 'E', text: '$x^{23}$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '붙여 씀' },
      ] },
    ], solution: '$x^{2+3} = x^5$.' },

  // Q2
  { chapterCode: CODE, difficulty: 'easy', concept: '지수법칙 (거듭제곱의 거듭제곱)', requiredSkills: SKILLS_EXP_POW,
    stem: '$(x^3)^2$ 를 간단히 하면?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$(a^m)^n = ?$', options: [
        { key: 'A', text: '$a^{mn}$ (지수를 곱함)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a^{m+n}$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '곱셈과 혼동' },
        { key: 'C', text: '$a^{m-n}$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '나눗셈과 혼동' },
        { key: 'D', text: '$a^{m^n}$ (지수 제곱)', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '잘못' },
        { key: 'E', text: '$na^m$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$3 \\cdot 2 = ?$', options: [
        { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '합' },
        { key: 'C', text: '$9$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$3^2$' },
        { key: 'D', text: '$1$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '차' },
        { key: 'E', text: '$32$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '붙여 씀' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$x^6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^5$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '합' },
        { key: 'C', text: '$x^9$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$3^2$' },
        { key: 'D', text: '$2x^3$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x^1$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '차' },
      ] },
    ], solution: '$(x^3)^2 = x^{3 \\cdot 2} = x^6$.' },

  // Q3
  { chapterCode: CODE, difficulty: 'easy', concept: '곱의 거듭제곱', requiredSkills: SKILLS_EXP_DIST,
    stem: '$(xy)^3$ 을 전개하면?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$(ab)^n = ?$', options: [
        { key: 'A', text: '$a^n b^n$ (각각의 거듭제곱)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$ab^n$ ($b$ 만 거듭제곱)', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$a$ 빠뜨림' },
        { key: 'C', text: '$a^n + b^n$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '곱 → 합' },
        { key: 'D', text: '$(ab)^n$ 그대로', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '분배 안 함' },
        { key: 'E', text: '$a^{n+1} b^{n+1}$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$x$ 와 $y$ 에 각각 $3$ 제곱', options: [
        { key: 'A', text: '$x^3$ 과 $y^3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^3$ 과 $y$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$y$ 빠뜨림' },
        { key: 'C', text: '$x$ 와 $y^3$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$x$ 빠뜨림' },
        { key: 'D', text: '$3x$ 과 $3y$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '계수' },
        { key: 'E', text: '$x^4$ 과 $y^4$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$x^3 y^3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$xy^3$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$x$ 거듭제곱 빠짐' },
        { key: 'C', text: '$3xy$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '계수' },
        { key: 'D', text: '$x^3 + y^3$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '곱→합' },
        { key: 'E', text: '$(xy)^3$ 그대로', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '분배 안 함' },
      ] },
    ], solution: '$(xy)^3 = x^3 y^3$.' },

  // Q4
  { chapterCode: CODE, difficulty: 'easy', concept: '지수법칙 (나눗셈)', requiredSkills: SKILLS_EXP_DIV,
    stem: '$x^5 \\div x^2$ 를 간단히 하면? ($x \\neq 0$)',
    steps: [
      { stepType: 'CONCEPT', prompt: '$a^m \\div a^n = ?$ ($m > n$)', options: [
        { key: 'A', text: '$a^{m-n}$ (지수를 뺌)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a^{m+n}$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '곱셈 공식' },
        { key: 'C', text: '$a^{mn}$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '거듭제곱 공식' },
        { key: 'D', text: '$a^{n-m}$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '거꾸로' },
        { key: 'E', text: '$\\dfrac{1}{a^{n-m}}$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$m<n$ 경우' },
      ] },
      { stepType: 'PROCESS', prompt: '$5 - 2 = ?$', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$7$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '합' },
        { key: 'C', text: '$10$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '곱' },
        { key: 'D', text: '$-3$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '순서 잘못' },
        { key: 'E', text: '$25$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$x^3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^7$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '합' },
        { key: 'C', text: '$x^{10}$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '곱' },
        { key: 'D', text: '$\\dfrac{1}{x^3}$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '음의 지수' },
        { key: 'E', text: '$x^{-3}$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '거꾸로' },
      ] },
    ], solution: '$x^{5-2} = x^3$.' },

  // Q5
  { chapterCode: CODE, difficulty: 'easy', concept: '단항식 곱셈', requiredSkills: SKILLS_MONO,
    stem: '$3a \\cdot 4a$ 를 간단히 하면?',
    steps: [
      { stepType: 'CONCEPT', prompt: '계수와 문자를 따로 처리', options: [
        { key: 'A', text: '계수끼리 곱 + 문자끼리 곱 (지수 더함)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '계수 + 문자 따로 합', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '합으로' },
        { key: 'C', text: '계수만 곱', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '문자 누락' },
        { key: 'D', text: '문자만 곱', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '계수 누락' },
        { key: 'E', text: '$(3+a)(4+a)$ 처럼 분배', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '단항식 처리 잘못' },
      ] },
      { stepType: 'PROCESS', prompt: '$3 \\cdot 4 = 12$, $a \\cdot a = ?$', options: [
        { key: 'A', text: '$a^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2a$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '곱셈→덧셈' },
        { key: 'C', text: '$a$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '곱셈 무시' },
        { key: 'D', text: '$2a^2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$a^3$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '지수 잘못' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$12a^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$7a^2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '계수 합' },
        { key: 'C', text: '$12a$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '지수 누락' },
        { key: 'D', text: '$7a$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '둘 다 잘못' },
        { key: 'E', text: '$12a^3$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '지수 잘못' },
      ] },
    ], solution: '$3 \\cdot 4 = 12$, $a \\cdot a = a^2$. 결과 $12a^2$.' },

  // Q6
  { chapterCode: CODE, difficulty: 'easy', concept: '동류항 정리', requiredSkills: SKILLS_LIKE,
    stem: '$2x + 3y - x + 2y$ 를 간단히 하면?',
    steps: [
      { stepType: 'CONCEPT', prompt: '같은 문자끼리 정리', options: [
        { key: 'A', text: '$x$ 끼리, $y$ 끼리 묶어 계수 합', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x$ 와 $y$ 를 같이 더함', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '다른 문자 합치면 안 됨' },
        { key: 'C', text: '계수만 더하고 문자 무시', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '문자 누락' },
        { key: 'D', text: '$2x \\cdot 3y$ 처럼 곱', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '연산 잘못' },
        { key: 'E', text: '문자만 더하기', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$x$: $2 - 1 = 1$, $y$: $3 + 2 = 5$', options: [
        { key: 'A', text: '$x$ 계수 $1$, $y$ 계수 $5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x$ 계수 $3$, $y$ 계수 $5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-x$ 부호 무시' },
        { key: 'C', text: '$x$ 계수 $1$, $y$ 계수 $1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '계수 합 잘못' },
        { key: 'D', text: '$x$ 계수 $-1$, $y$ 계수 $5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
        { key: 'E', text: '$x$ 계수 $0$, $y$ 계수 $5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '계산 실수' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$x + 5y$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3x + 5y$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 누락' },
        { key: 'C', text: '$x + y$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$y$ 계수 잘못' },
        { key: 'D', text: '$6xy$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '곱으로' },
        { key: 'E', text: '$x \\cdot 5y$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '곱셈 잘못' },
      ] },
    ], solution: '$2x - x + 3y + 2y = x + 5y$.' },

  // Q7
  { chapterCode: CODE, difficulty: 'medium', concept: '단항식 거듭제곱', requiredSkills: SKILLS_EXP_DIST,
    stem: '$(2x^2)^3$ 을 간단히 하면?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$(2x^2)^3 = ?$ (계수와 문자 모두 거듭제곱)', options: [
        { key: 'A', text: '$2^3 \\cdot (x^2)^3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2 \\cdot x^6$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$2$ 거듭제곱 안 함' },
        { key: 'C', text: '$2 \\cdot x^2$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '거듭제곱 안 함' },
        { key: 'D', text: '$2x^5$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '지수 합' },
        { key: 'E', text: '$(2x)^6$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '식 잘못' },
      ] },
      { stepType: 'PROCESS', prompt: '$2^3 = 8$, $(x^2)^3 = x^6$', options: [
        { key: 'A', text: '$8 x^6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$6 x^5$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$2 \\cdot 3$ 와 $2+3$' },
        { key: 'C', text: '$8 x^5$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '지수 합' },
        { key: 'D', text: '$2 x^6$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$2$ 거듭제곱 안 함' },
        { key: 'E', text: '$6 x^6$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$2 \\cdot 3$ 적용' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$8x^6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2x^6$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$2^3$ 안 함' },
        { key: 'C', text: '$8x^5$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '지수 합' },
        { key: 'D', text: '$6x^6$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$2 \\cdot 3$' },
        { key: 'E', text: '$6x^5$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '둘 다 잘못' },
      ] },
    ], solution: '$(2x^2)^3 = 2^3 (x^2)^3 = 8 x^6$.' },

  // Q8
  { chapterCode: CODE, difficulty: 'medium', concept: '$a^0$ (같은 지수 나눗셈)', requiredSkills: SKILLS_EXP_DIV,
    stem: '$x^7 \\div x^7$ 의 값은? ($x \\neq 0$)',
    steps: [
      { stepType: 'CONCEPT', prompt: '지수가 같은 두 거듭제곱의 나눗셈은?', options: [
        { key: 'A', text: '$1$ ($a^{m-m} = a^0 = 1$)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$0^0$ 정의 안 되지만 $x \\neq 0$' },
        { key: 'D', text: '$x^0$ 정의 안 됨', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x \\neq 0$ 이면 정의' },
        { key: 'E', text: '$x^{14}$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '지수 합' },
      ] },
      { stepType: 'PROCESS', prompt: '$7 - 7 = ?$', options: [
        { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$14$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '합' },
        { key: 'C', text: '$49$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '곱' },
        { key: 'D', text: '$1$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '결과 자체' },
        { key: 'E', text: '$77$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '값은?', options: [
        { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '지수와 값 혼동' },
        { key: 'C', text: '$x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$x^{14}$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '합' },
        { key: 'E', text: '$\\dfrac{1}{x^{14}}$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$x^7 / x^7 = x^{7-7} = x^0 = 1$.' },

  // Q9
  { chapterCode: CODE, difficulty: 'medium', concept: '음수 단항식 곱셈', requiredSkills: SKILLS_MONO,
    stem: '$-2x \\cdot 3x^2$ 을 간단히 하면?',
    steps: [
      { stepType: 'CONCEPT', prompt: '계수 + 지수 + 부호 처리', options: [
        { key: 'A', text: '계수 $-2 \\cdot 3 = -6$, 지수 $1 + 2 = 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '계수 $2 \\cdot 3 = 6$ (부호 무시)', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '음수 부호 누락' },
        { key: 'C', text: '계수 $-2 + 3 = 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '합' },
        { key: 'D', text: '지수 $1 \\cdot 2 = 2$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '곱' },
        { key: 'E', text: '지수 $2 - 1 = 1$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '차' },
      ] },
      { stepType: 'PROCESS', prompt: '결과 식?', options: [
        { key: 'A', text: '$-6 x^3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$6 x^3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 누락' },
        { key: 'C', text: '$-6 x^2$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '지수 잘못' },
        { key: 'D', text: '$-5x^3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '계수 합' },
        { key: 'E', text: '$-6 x$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '지수 잘못' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$-6x^3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$6x^3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 누락' },
        { key: 'C', text: '$-5x^3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '계수 합' },
        { key: 'D', text: '$-6x^2$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '지수 잘못' },
        { key: 'E', text: '$-6x$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '지수 잘못' },
      ] },
    ], solution: '$(-2)(3) = -6$, $x^1 \\cdot x^2 = x^3$. $-6x^3$.' },

  // Q10
  { chapterCode: CODE, difficulty: 'medium', concept: '괄호 풀기 + 정리', requiredSkills: SKILLS_DISTRIB,
    stem: '$2(x + 3) - (2x + 1)$ 을 간단히 하면?',
    steps: [
      { stepType: 'CONCEPT', prompt: '두 괄호 전개?', options: [
        { key: 'A', text: '$2x + 6 - 2x - 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2x + 6 - 2x + 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '뺄셈 시 $+1$ 부호 안 바꿈' },
        { key: 'C', text: '$2x + 3 - 2x - 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$3$에 $2$ 곱 안 함' },
        { key: 'D', text: '$2x + 6 + 2x + 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '뺄셈 무시' },
        { key: 'E', text: '$x + 3 - 2x - 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$2$ 분배 잘못' },
      ] },
      { stepType: 'PROCESS', prompt: '$2x - 2x + 6 - 1$', options: [
        { key: 'A', text: '$0 + 5 = 5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4x + 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$x$ 합' },
        { key: 'C', text: '$0 + 7$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '상수 합 잘못' },
        { key: 'D', text: '$4x + 7$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '둘 다 잘못' },
        { key: 'E', text: '$5x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$5$ (상수)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4x + 5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-(2x)$ 안 됨' },
        { key: 'C', text: '$4x + 7$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '둘 다 잘못' },
        { key: 'D', text: '$5x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2x + 5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-2x$ 안 함' },
      ] },
    ], solution: '$2(x+3) - (2x+1) = 2x+6 - 2x - 1 = 5$.' },

  // Q11
  { chapterCode: CODE, difficulty: 'medium', concept: '곱셈공식 $(a+b)^2$', requiredSkills: SKILLS_FORMULA,
    stem: '$(a + b)^2$ 를 전개하면?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$(a+b)^2 = ?$', options: [
        { key: 'A', text: '$a^2 + 2ab + b^2$ (교차항 $2ab$ 포함)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a^2 + b^2$ (각 항 제곱)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '교차항 누락 (대표적 오개념)' },
        { key: 'C', text: '$a^2 - 2ab + b^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$(a-b)^2$ 와 혼동' },
        { key: 'D', text: '$a^2 + ab + b^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$2$ 누락' },
        { key: 'E', text: '$2a + 2b$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱 안 함' },
      ] },
      { stepType: 'PROCESS', prompt: '$(a+b)(a+b)$ FOIL 전개', options: [
        { key: 'A', text: '$a^2 + ab + ab + b^2 = a^2 + 2ab + b^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a^2 + ab + b^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '한 개 누락' },
        { key: 'C', text: '$a^2 + b^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '교차항 누락' },
        { key: 'D', text: '$a \\cdot b + a \\cdot b$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱항 누락' },
        { key: 'E', text: '$ab^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '잘못' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$a^2 + 2ab + b^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a^2 + b^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '교차항 누락' },
        { key: 'C', text: '$a^2 - 2ab + b^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '부호 잘못' },
        { key: 'D', text: '$2a^2 + 2b^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(a+b)(a+b)$ 그대로', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '전개 안 함' },
      ] },
    ], solution: '$(a+b)^2 = a^2 + 2ab + b^2$.' },

  // Q12
  { chapterCode: CODE, difficulty: 'medium', concept: '합·차 공식 $(a+b)(a-b)$', requiredSkills: SKILLS_FORMULA,
    stem: '$(x + 5)(x - 5)$ 를 전개하면?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$(a+b)(a-b) = ?$', options: [
        { key: 'A', text: '$a^2 - b^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a^2 + b^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '부호 잘못' },
        { key: 'C', text: '$a^2 - 2ab + b^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$(a-b)^2$' },
        { key: 'D', text: '$(a-b)^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '잘못' },
        { key: 'E', text: '$2ab$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$x^2 - 5^2$', options: [
        { key: 'A', text: '$x^2 - 25$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^2 - 10$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$5^2 = 10$ 잘못' },
        { key: 'C', text: '$x^2 + 25$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '부호 잘못' },
        { key: 'D', text: '$(x-5)^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '식 잘못' },
        { key: 'E', text: '$x^2 - 25x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '문자 잘못' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$x^2 - 25$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^2 + 25$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '부호 잘못' },
        { key: 'C', text: '$x^2 - 10$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$5^2$' },
        { key: 'D', text: '$(x-5)^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '식 자체' },
        { key: 'E', text: '$x^2 - 25x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '문자 잘못' },
      ] },
    ], solution: '$(x+5)(x-5) = x^2 - 25$.' },

  // Q13
  { chapterCode: CODE, difficulty: 'medium', concept: '$(x+a)(x+b)$ 전개', requiredSkills: SKILLS_FOIL,
    stem: '$(x + 2)(x + 3)$ 을 전개하면?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$(x+a)(x+b) = ?$', options: [
        { key: 'A', text: '$x^2 + (a+b)x + ab$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^2 + ab$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '교차항 누락' },
        { key: 'C', text: '$x^2 + a + b$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x^2 \\cdot ab$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '곱셈 잘못' },
        { key: 'E', text: '$(x + ab)^2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '잘못' },
      ] },
      { stepType: 'PROCESS', prompt: '$a+b = 5$, $ab = 6$', options: [
        { key: 'A', text: '$x^2 + 5x + 6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^2 + 6x + 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '계수 자리 바뀜' },
        { key: 'C', text: '$x^2 + 5x$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '상수항 누락' },
        { key: 'D', text: '$x^2 + 6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '교차항 누락' },
        { key: 'E', text: '$x^2 + 11x + 6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합 잘못' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$x^2 + 5x + 6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^2 + 6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '교차항' },
        { key: 'C', text: '$x^2 + 6x + 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '바뀜' },
        { key: 'D', text: '$2x + 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '전개 잘못' },
        { key: 'E', text: '$x^2 + 11x + 6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합 잘못' },
      ] },
    ], solution: '$(x+2)(x+3) = x^2 + (2+3)x + 6 = x^2 + 5x + 6$.' },

  // Q14
  { chapterCode: CODE, difficulty: 'medium', concept: '$(2x+1)(x-3)$ 전개', requiredSkills: SKILLS_FOIL,
    stem: '$(2x + 1)(x - 3)$ 을 전개하면?',
    steps: [
      { stepType: 'CONCEPT', prompt: 'FOIL 적용 (각 항 곱)', options: [
        { key: 'A', text: '$2x \\cdot x + 2x \\cdot (-3) + 1 \\cdot x + 1 \\cdot (-3)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2x \\cdot x + 1 \\cdot (-3)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '교차항 누락' },
        { key: 'C', text: '$2x \\cdot x - 1 \\cdot 3$ (부호 안 바꿈)', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-3$ 부호 처리' },
        { key: 'D', text: '$(2x + 1)(x + 3) - 6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '잘못' },
        { key: 'E', text: '$2x^2 - 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '교차항 누락' },
      ] },
      { stepType: 'PROCESS', prompt: '$2x^2 - 6x + x - 3$', options: [
        { key: 'A', text: '$2x^2 - 5x - 3$ (동류항 정리)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2x^2 + 5x - 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '교차항 부호 잘못' },
        { key: 'C', text: '$2x^2 - 7x - 3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$-6 - 1$' },
        { key: 'D', text: '$2x^2 - 6x - 3$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$+x$ 누락' },
        { key: 'E', text: '$2x^2 - 3$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '교차항 누락' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$2x^2 - 5x - 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2x^2 + 5x - 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '교차항 부호' },
        { key: 'C', text: '$2x^2 - 3$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '교차항' },
        { key: 'D', text: '$2x^2 - 7x - 3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
        { key: 'E', text: '$2x - 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '전개 잘못' },
      ] },
    ], solution: 'FOIL: $2x^2 + (-6x + x) - 3 = 2x^2 - 5x - 3$.' },

  // Q15
  { chapterCode: CODE, difficulty: 'medium', concept: '$(a-b)^2$ 공식', requiredSkills: SKILLS_FORMULA,
    stem: '$(a - b)^2$ 를 전개하면?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$(a-b)^2 = ?$', options: [
        { key: 'A', text: '$a^2 - 2ab + b^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a^2 - b^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합·차 공식과 혼동' },
        { key: 'C', text: '$a^2 + 2ab + b^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$(a+b)^2$' },
        { key: 'D', text: '$a^2 - ab + b^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$2$ 누락' },
        { key: 'E', text: '$a - b$ 그대로', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱 안 함' },
      ] },
      { stepType: 'PROCESS', prompt: '$(a-b)(a-b)$ FOIL', options: [
        { key: 'A', text: '$a^2 - ab - ab + b^2 = a^2 - 2ab + b^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a^2 - b^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '교차항 누락' },
        { key: 'C', text: '$a^2 + ab - ab + b^2$ (부호 잘못)', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '교차항 부호' },
        { key: 'D', text: '$a^2 - 2ab - b^2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$b^2$ 부호' },
        { key: 'E', text: '$(a-b)^2$ 그대로', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '전개 안 함' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$a^2 - 2ab + b^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a^2 - b^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '교차항 누락' },
        { key: 'C', text: '$a^2 + 2ab + b^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$(a+b)^2$' },
        { key: 'D', text: '$a^2 - 2ab - b^2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$b^2$ 부호' },
        { key: 'E', text: '$2a - 2b$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '잘못' },
      ] },
    ], solution: '$(a-b)^2 = a^2 - 2ab + b^2$.' },

  // Q16 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '$(x+y+z)^2$ 전개', requiredSkills: SKILLS_FORMULA,
    stem: '$(x + y + z)^2$ 를 전개하면?',
    steps: [
      { stepType: 'CONCEPT', prompt: '세 항 합의 제곱 공식?', options: [
        { key: 'A', text: '$x^2 + y^2 + z^2 + 2(xy + yz + zx)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^2 + y^2 + z^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '교차항 누락' },
        { key: 'C', text: '$(x+y+z)^2$ 그대로', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '전개 안 함' },
        { key: 'D', text: '$x^2 + y^2 + z^2 + xy + yz + zx$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$2$ 누락' },
        { key: 'E', text: '$3x^2 + 3y^2 + 3z^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$(x+y+z)(x+y+z)$ 전개?', options: [
        { key: 'A', text: '각 쌍을 곱하면 $3$ 개 제곱항 + $6$ 개 교차항 → $2(xy+yz+zx)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '제곱항만 살아남음', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '교차항 무시' },
        { key: 'C', text: '교차항이 $3$ 개', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$xy$ 두 번씩' },
        { key: 'D', text: '한 쌍씩 한 번만', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: 'FOIL 적용 안 함' },
        { key: 'E', text: '교차항 부호가 음수', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$x^2 + y^2 + z^2 + 2xy + 2yz + 2zx$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^2 + y^2 + z^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '교차항 누락' },
        { key: 'C', text: '$x^2 + y^2 + z^2 + xy + yz + zx$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$2$ 누락' },
        { key: 'D', text: '$3(x+y+z)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x^2 + y^2 + z^2 + 6xyz$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '각 쌍 ($xy$, $yz$, $zx$) 두 번씩 → $2$ 계수. 결과 $x^2 + y^2 + z^2 + 2xy + 2yz + 2zx$.' },

  // Q17 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '$(a+b)^2 - (a-b)^2$', requiredSkills: SKILLS_FORMULA,
    stem: '$(2x + 3)^2 - (2x - 3)^2$ 를 간단히 하면?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$(a+b)^2 - (a-b)^2 = ?$', options: [
        { key: 'A', text: '$4ab$ (교차항만 살아남음)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '식 다름' },
        { key: 'C', text: '$2b^2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$a^2 - b^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2a^2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$a = 2x, b = 3$ 대입: $4 \\cdot 2x \\cdot 3$', options: [
        { key: 'A', text: '$24x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$12x$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$4$ 누락' },
        { key: 'C', text: '$24x^2$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$6x$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$24x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$12x$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$4$ 누락' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$(a+b)^2 = (a-b)^2$ 잘못' },
        { key: 'D', text: '$24x^2$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$18$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(a+b)^2 - (a-b)^2 = 4ab$. $a=2x, b=3$ → $4 \\cdot 2x \\cdot 3 = 24x$.' },

  // Q18 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '복합 지수 계산', requiredSkills: SKILLS_EXP_DIV,
    stem: '$\\dfrac{x^8 \\cdot x^2}{x^5}$ 를 간단히 하면? ($x \\neq 0$)',
    steps: [
      { stepType: 'CONCEPT', prompt: '먼저 위 식 계산?', options: [
        { key: 'A', text: '$x^{8+2} = x^{10}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^{8 \\cdot 2} = x^{16}$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '곱' },
        { key: 'C', text: '$x^8 \\cdot x^2 = x^{82}$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '붙여 씀' },
        { key: 'D', text: '$x^{16}$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '곱' },
        { key: 'E', text: '$x^6$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '차' },
      ] },
      { stepType: 'PROCESS', prompt: '$x^{10} / x^5$', options: [
        { key: 'A', text: '$x^{10-5} = x^5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^{10+5} = x^{15}$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '합' },
        { key: 'C', text: '$x^{10 \\cdot 5} = x^{50}$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '곱' },
        { key: 'D', text: '$x^2$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$10/5$' },
        { key: 'E', text: '$x^{15}$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '합' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$x^5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^{15}$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '합' },
        { key: 'C', text: '$x^2$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '나누기 직접' },
        { key: 'D', text: '$x^{16}$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '곱' },
        { key: 'E', text: '$x$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '잘못' },
      ] },
    ], solution: '$x^{8+2-5} = x^5$.' },

  // Q19 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '$(x+2)^2$ 전개식 계수 합', requiredSkills: SKILLS_FORMULA,
    stem: '$(x + 2)^2$ 를 전개한 후 모든 항의 계수와 상수항의 합은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '전개식은?', options: [
        { key: 'A', text: '$x^2 + 4x + 4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^2 + 4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '교차항 누락' },
        { key: 'C', text: '$x^2 + 2x + 4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$2$ 누락' },
        { key: 'D', text: '$x^2 + 2x + 2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$b^2$ 잘못' },
        { key: 'E', text: '$2x^2 + 4x + 4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '계수 잘못' },
      ] },
      { stepType: 'PROCESS', prompt: '계수 + 상수: $1 + 4 + 4$', options: [
        { key: 'A', text: '$9$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$8$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x^2$ 계수 누락' },
        { key: 'C', text: '$5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '한 항만' },
        { key: 'D', text: '$4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
      ] },
      { stepType: 'ANSWER', prompt: '합은?', options: [
        { key: 'A', text: '$9$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$8$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x^2$ 계수 누락' },
        { key: 'C', text: '$5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$16$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '상수만' },
      ] },
    ], solution: '$(x+2)^2 = x^2 + 4x + 4$. 합 $= 1 + 4 + 4 = 9$.' },

  // Q20 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '지수법칙 연립', requiredSkills: SKILLS_EXP_MUL,
    stem: '$a^m \\cdot a^n = a^9$ 그리고 $a^m \\div a^n = a^3$ 일 때, $m, n$은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '두 조건을 지수에 대한 식으로?', options: [
        { key: 'A', text: '$m + n = 9$ 그리고 $m - n = 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$mn = 9$ 그리고 $m/n = 3$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '지수법칙 적용 잘못' },
        { key: 'C', text: '$m = 9, n = 3$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '식 적용 안 함' },
        { key: 'D', text: '$m^n = 9$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '잘못' },
        { key: 'E', text: '$m + n = 12$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '두 식 합' },
      ] },
      { stepType: 'PROCESS', prompt: '연립 풀기: 더하면 $2m = 12$', options: [
        { key: 'A', text: '$m = 6$, $n = 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$m = 3$, $n = 6$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '거꾸로' },
        { key: 'C', text: '$m = 9$, $n = 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '조건 안 맞음' },
        { key: 'D', text: '$m = 12$, $n = -3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 누락' },
        { key: 'E', text: '$m = 6$, $n = -3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$n$ 부호' },
      ] },
      { stepType: 'ANSWER', prompt: '$m, n$?', options: [
        { key: 'A', text: '$m = 6,\\ n = 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$m = 3,\\ n = 6$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '거꾸로' },
        { key: 'C', text: '$m = 9,\\ n = 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '조건 안 맞음' },
        { key: 'D', text: '$m = 5,\\ n = 4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$m = 12,\\ n = 3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$m + n = 9$, $m - n = 3$. 더하기 $\\Rightarrow 2m = 12 \\Rightarrow m = 6$, $n = 3$. 검산: $6+3=9$ ✓, $6-3=3$ ✓.' },
];

export const K_G8_MATH2_CH02_CALC_EXPR_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
