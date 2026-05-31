/**
 * K-G8-MATH2-CH02-CALC-EXPR — STUDY pool (single-step, 20문제).
 * 식의 계산 — 지수법칙, 단항·다항식 곱셈, 곱셈공식, 전개.
 * Mastery 3-step과 별도 변형 문제. 중2 (G8).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5. LLM 미사용.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G8-MATH2-CH02-CALC-EXPR';
const SKILLS_EXP_MUL = ['exponent_product_rule', 'add_exponents'];
const SKILLS_EXP_POW = ['power_of_power', 'multiply_exponents'];
const SKILLS_EXP_DIST = ['power_of_product', 'distribute_exponent'];
const SKILLS_EXP_DIV = ['exponent_quotient_rule', 'subtract_exponents'];
const SKILLS_MONO = ['monomial_multiplication', 'coefficient_combine'];
const SKILLS_LIKE = ['like_terms', 'polynomial_simplify'];
const SKILLS_DISTRIB = ['distributive_law', 'sign_handling'];
const SKILLS_FORMULA = ['square_formula', 'difference_squares'];
const SKILLS_FOIL = ['binomial_product', 'foil_method'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) 지수법칙 곱
  { chapterCode: CODE, difficulty: 'easy', concept: '지수법칙 — 곱셈', requiredSkills: SKILLS_EXP_MUL,
    stem: '$x^4 \\cdot x^2$ 을 간단히 하면?',
    options: [
      { key: 'A', text: '$x^6$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x^8$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '지수 곱셈으로 ($4 \\times 2$)' },
      { key: 'C', text: '$x^2$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '지수 뺄셈 ($4 - 2$)' },
      { key: 'D', text: '$2x^6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '계수 추가 잘못' },
      { key: 'E', text: '$x^{4 \\cdot 2}$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '곱셈 표기 그대로' },
    ],
    solution: '같은 밑 곱셈 — 지수 덧셈: $x^4 \\cdot x^2 = x^{4+2} = x^6$.' },

  // S2 (쉬움) 거듭제곱의 거듭제곱
  { chapterCode: CODE, difficulty: 'easy', concept: '지수법칙 — 거듭제곱의 거듭제곱', requiredSkills: SKILLS_EXP_POW,
    stem: '$(y^2)^3$ 을 간단히 하면?',
    options: [
      { key: 'A', text: '$y^6$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$y^5$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '지수 덧셈 ($2 + 3$)' },
      { key: 'C', text: '$y^9$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$2^{\\text{지수}} = 9$ 등 잘못' },
      { key: 'D', text: '$3y^2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '지수를 계수로 뺌' },
      { key: 'E', text: '$y^8$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '잘못된 곱' },
    ],
    solution: '$(y^a)^b = y^{ab}$. $(y^2)^3 = y^{2 \\times 3} = y^6$.' },

  // S3 (쉬움) 곱의 거듭제곱
  { chapterCode: CODE, difficulty: 'easy', concept: '곱의 거듭제곱 (계수 포함)', requiredSkills: SKILLS_EXP_DIST,
    stem: '$(2x)^2$ 을 전개하면?',
    options: [
      { key: 'A', text: '$4x^2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$2x^2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '계수 $2$를 제곱 안 함' },
      { key: 'C', text: '$2x^4$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '계수 제곱은 안 하고 지수만 잘못' },
      { key: 'D', text: '$4x$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '문자 제곱 누락' },
      { key: 'E', text: '$2x$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '제곱 처리 안 함' },
    ],
    solution: '$(ab)^n = a^n b^n$. $(2x)^2 = 2^2 \\cdot x^2 = 4x^2$.' },

  // S4 (쉬움) 지수법칙 나눗셈
  { chapterCode: CODE, difficulty: 'easy', concept: '지수법칙 — 나눗셈', requiredSkills: SKILLS_EXP_DIV,
    stem: '$x^9 \\div x^3$ 를 간단히 하면? ($x \\neq 0$)',
    options: [
      { key: 'A', text: '$x^6$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x^3$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$9/3$ 같은 잘못된 식' },
      { key: 'C', text: '$x^{12}$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '지수 덧셈 (곱셈 규칙)' },
      { key: 'D', text: '$x^{27}$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$9 \\times 3$ 곱셈' },
      { key: 'E', text: '$\\dfrac{1}{x^6}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '지수 뺄셈 방향 잘못' },
    ],
    solution: '$x^a \\div x^b = x^{a-b}$. $x^9 \\div x^3 = x^{9-3} = x^6$.' },

  // S5 (쉬움) 단항식 곱셈
  { chapterCode: CODE, difficulty: 'easy', concept: '서로 다른 문자 단항식 곱', requiredSkills: SKILLS_MONO,
    stem: '$5a \\cdot 2b$ 를 간단히 하면?',
    options: [
      { key: 'A', text: '$10ab$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$7ab$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$5 + 2$ 덧셈' },
      { key: 'C', text: '$10a + 10b$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곱이 아닌 합으로 분배' },
      { key: 'D', text: '$10a^2 b$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '다른 문자에 지수 잘못' },
      { key: 'E', text: '$10(a + b)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '인수분해 형태' },
    ],
    solution: '계수 곱 $5 \\times 2 = 10$, 문자 곱 $a \\cdot b = ab$ → $10ab$.' },

  // S6 (쉬움) 동류항 정리
  { chapterCode: CODE, difficulty: 'easy', concept: '두 문자 동류항 정리', requiredSkills: SKILLS_LIKE,
    stem: '$3x + 4y + x - 2y$ 를 간단히 하면?',
    options: [
      { key: 'A', text: '$4x + 2y$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$4x + 6y$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-2y$ 부호 잘못' },
      { key: 'C', text: '$2x + 2y$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$x$ 동류항 계산 잘못' },
      { key: 'D', text: '$6xy$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '다른 문자 합쳐 곱으로' },
      { key: 'E', text: '$3x + 2y$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$x$ 계수 안 더함' },
    ],
    solution: '$x$ 동류항: $3x + x = 4x$. $y$ 동류항: $4y - 2y = 2y$. → $4x + 2y$.' },

  // S7 (중) 단항식 거듭제곱
  { chapterCode: CODE, difficulty: 'medium', concept: '계수와 문자가 있는 거듭제곱', requiredSkills: SKILLS_EXP_DIST,
    stem: '$(3a^2)^3$ 을 간단히 하면?',
    options: [
      { key: 'A', text: '$27a^6$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$9a^6$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$3^2 = 9$ 계수 지수 잘못' },
      { key: 'C', text: '$27a^5$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$2 + 3$ 지수 덧셈' },
      { key: 'D', text: '$3a^6$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '계수 거듭제곱 안 함' },
      { key: 'E', text: '$27a^8$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$2 \\times 4$ 등 잘못' },
    ],
    solution: '$(3a^2)^3 = 3^3 \\cdot (a^2)^3 = 27 \\cdot a^6 = 27a^6$.' },

  // S8 (중) x^0 = 1
  { chapterCode: CODE, difficulty: 'medium', concept: '같은 지수 나눗셈 ($x^0$)', requiredSkills: SKILLS_EXP_DIV,
    stem: '$x^5 \\div x^5$ 의 값은? ($x \\neq 0$)',
    options: [
      { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '지수 차 $0$을 값 자체로' },
      { key: 'C', text: '$x$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$x^1$로 잘못' },
      { key: 'D', text: '$x^0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '식 그대로 (값으로 환원 안 함)' },
      { key: 'E', text: '$x^{10}$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '지수 덧셈' },
    ],
    solution: '$x^a \\div x^a = x^{a-a} = x^0 = 1$.' },

  // S9 (중) 음수 단항식 곱
  { chapterCode: CODE, difficulty: 'medium', concept: '음수 단항식 곱셈', requiredSkills: SKILLS_MONO,
    stem: '$(-4x^2) \\cdot (2x^3)$ 을 간단히 하면?',
    options: [
      { key: 'A', text: '$-8x^5$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$8x^5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-$ 부호 누락' },
      { key: 'C', text: '$-8x^6$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '지수 곱셈 ($2 \\times 3$)' },
      { key: 'D', text: '$-6x^5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$-4 + 2 = -2$ 같은 합' },
      { key: 'E', text: '$-2x^5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계수 잘못된 합' },
    ],
    solution: '계수: $-4 \\times 2 = -8$. 문자: $x^2 \\cdot x^3 = x^5$. → $-8x^5$.' },

  // S10 (중) 괄호 풀기
  { chapterCode: CODE, difficulty: 'medium', concept: '괄호 풀기 + 동류항', requiredSkills: SKILLS_DISTRIB,
    stem: '$3(2x - 1) - (x - 4)$ 를 간단히 하면?',
    options: [
      { key: 'A', text: '$5x + 1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$5x - 7$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-(-4) = +4$ 잘못' },
      { key: 'C', text: '$7x - 7$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-x$ 부호 잘못' },
      { key: 'D', text: '$5x - 5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$-3 + 4 = 1$인데 $-5$' },
      { key: 'E', text: '$5x + 5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$-3 + 4 \\neq 5$' },
    ],
    solution: '$3(2x - 1) = 6x - 3$. $-(x - 4) = -x + 4$. 합 $= 6x - 3 - x + 4 = 5x + 1$.' },

  // S11 (중) (x-3)² 공식
  { chapterCode: CODE, difficulty: 'medium', concept: '$(a-b)^2$ 곱셈공식', requiredSkills: SKILLS_FORMULA,
    stem: '$(x - 3)^2$ 을 전개하면?',
    options: [
      { key: 'A', text: '$x^2 - 6x + 9$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x^2 + 9$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '중간항 $-2 \\times 3 \\times x = -6x$ 누락' },
      { key: 'C', text: '$x^2 - 9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$(x+3)(x-3)$ 답함 (합·차)' },
      { key: 'D', text: '$x^2 - 6x - 9$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$(-3)^2 = 9$ (양수)인데 잘못' },
      { key: 'E', text: '$x^2 + 6x + 9$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$+6x$로 부호 잘못' },
    ],
    solution: '$(a-b)^2 = a^2 - 2ab + b^2$. $(x-3)^2 = x^2 - 6x + 9$.' },

  // S12 (중) 합·차 공식
  { chapterCode: CODE, difficulty: 'medium', concept: '합·차 공식', requiredSkills: SKILLS_FORMULA,
    stem: '$(a - 4)(a + 4)$ 를 전개하면?',
    options: [
      { key: 'A', text: '$a^2 - 16$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$a^2 + 16$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$(-4) \\times 4 = -16$ 잘못' },
      { key: 'C', text: '$a^2 - 8a - 16$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '중간항 ($+4a - 4a = 0$) 잘못 처리' },
      { key: 'D', text: '$a^2 - 8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$4 \\times 4 = 16$인데 $8$' },
      { key: 'E', text: '$(a - 4)(a + 4)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '전개 안 함' },
    ],
    solution: '$(a-b)(a+b) = a^2 - b^2$. $(a-4)(a+4) = a^2 - 16$.' },

  // S13 (중) (x+a)(x+b)
  { chapterCode: CODE, difficulty: 'medium', concept: '$(x+a)(x+b)$ FOIL', requiredSkills: SKILLS_FOIL,
    stem: '$(x + 5)(x - 2)$ 를 전개하면?',
    options: [
      { key: 'A', text: '$x^2 + 3x - 10$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x^2 + 7x - 10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$5 + (-2) = 3$인데 $7$' },
      { key: 'C', text: '$x^2 + 3x + 10$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$5 \\times (-2) = -10$인데 부호 잘못' },
      { key: 'D', text: '$x^2 - 3x - 10$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '중간항 부호 잘못' },
      { key: 'E', text: '$x^2 - 10$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '중간항 누락 (합·차로 오해)' },
    ],
    solution: '$(x+a)(x+b) = x^2 + (a+b)x + ab$. $(x+5)(x-2) = x^2 + 3x - 10$.' },

  // S14 (중) (3x-2)(2x+1)
  { chapterCode: CODE, difficulty: 'medium', concept: '계수 있는 이항식 곱', requiredSkills: SKILLS_FOIL,
    stem: '$(3x - 2)(2x + 1)$ 을 전개하면?',
    options: [
      { key: 'A', text: '$6x^2 - x - 2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$6x^2 + x - 2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$3x - 4x = -x$ 부호 잘못' },
      { key: 'C', text: '$6x^2 - 2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '중간항 누락' },
      { key: 'D', text: '$5x^2 - x - 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3 \\times 2 = 6$인데 $5$' },
      { key: 'E', text: '$6x^2 - x + 2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-2 \\times 1 = -2$ 부호 잘못' },
    ],
    solution: 'FOIL: $3x \\cdot 2x + 3x \\cdot 1 + (-2) \\cdot 2x + (-2) \\cdot 1 = 6x^2 + 3x - 4x - 2 = 6x^2 - x - 2$.' },

  // S15 (중) (2a+5)² 완전제곱
  { chapterCode: CODE, difficulty: 'medium', concept: '계수 있는 완전제곱', requiredSkills: SKILLS_FORMULA,
    stem: '$(2a + 5)^2$ 을 전개하면?',
    options: [
      { key: 'A', text: '$4a^2 + 20a + 25$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$4a^2 + 10a + 25$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '중간항 $2 \\times 2a \\times 5 = 20a$인데 $10a$' },
      { key: 'C', text: '$2a^2 + 20a + 25$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$(2a)^2 = 4a^2$인데 $2a^2$' },
      { key: 'D', text: '$4a^2 + 25$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '중간항 누락' },
      { key: 'E', text: '$4a^2 + 20a + 10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$5^2 = 25$인데 $10$' },
    ],
    solution: '$(2a + 5)^2 = (2a)^2 + 2 \\cdot 2a \\cdot 5 + 5^2 = 4a^2 + 20a + 25$.' },

  // S16 (어려움) (a-b+c)² 전개
  { chapterCode: CODE, difficulty: 'hard', concept: '세 항 제곱', requiredSkills: SKILLS_FORMULA,
    stem: '$(a - b + c)^2$ 를 전개하면?',
    options: [
      { key: 'A', text: '$a^2 + b^2 + c^2 - 2ab + 2ac - 2bc$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$a^2 + b^2 + c^2 - 2ab - 2ac - 2bc$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$+2ac$ 부호 잘못' },
      { key: 'C', text: '$a^2 - b^2 + c^2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '교차항 누락' },
      { key: 'D', text: '$a^2 + b^2 + c^2 + 2ab - 2ac - 2bc$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-2ab$ 부호 잘못' },
      { key: 'E', text: '$a^2 - b^2 + c^2 - 2ab + 2ac - 2bc$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$b^2$ 부호 잘못 ($(-b)^2 = b^2$)' },
    ],
    solution: '$(a + (-b) + c)^2 = a^2 + b^2 + c^2 + 2 \\cdot a \\cdot (-b) + 2 \\cdot a \\cdot c + 2 \\cdot (-b) \\cdot c = a^2 + b^2 + c^2 - 2ab + 2ac - 2bc$.' },

  // S17 (어려움) (3x+1)² - (3x-1)²
  { chapterCode: CODE, difficulty: 'hard', concept: '제곱의 차 단순화', requiredSkills: SKILLS_FORMULA,
    stem: '$(3x + 1)^2 - (3x - 1)^2$ 를 간단히 하면?',
    options: [
      { key: 'A', text: '$12x$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '같은 식인 줄 오해' },
      { key: 'C', text: '$6x$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$(a+b)^2 - (a-b)^2 = 4ab$, 여기 $4 \\times 3x \\times 1 = 12x$인데 잘못' },
      { key: 'D', text: '$2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '문자항 누락' },
      { key: 'E', text: '$18x^2 + 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 전개' },
    ],
    solution: '$(a+b)^2 - (a-b)^2 = 4ab$. 여기서 $a = 3x$, $b = 1$. $4 \\cdot 3x \\cdot 1 = 12x$.' },

  // S18 (어려움) 복합 지수
  { chapterCode: CODE, difficulty: 'hard', concept: '복합 지수 (곱·나눗셈)', requiredSkills: SKILLS_EXP_DIV,
    stem: '$\\dfrac{x^6 \\cdot x^3}{x^4}$ 를 간단히 하면? ($x \\neq 0$)',
    options: [
      { key: 'A', text: '$x^5$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x^7$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$6 + 3 - 2$ 등 잘못된 식' },
      { key: 'C', text: '$x^9$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '나눗셈 누락 (분자만)' },
      { key: 'D', text: '$x^{13}$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '모든 지수 더함' },
      { key: 'E', text: '$x^3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$6 - 3$ 같은 잘못된 식' },
    ],
    solution: '분자: $x^6 \\cdot x^3 = x^9$. $x^9 / x^4 = x^{9-4} = x^5$.' },

  // S19 (어려움) (x+3)² 계수 합
  { chapterCode: CODE, difficulty: 'hard', concept: '전개 후 계수 합', requiredSkills: SKILLS_FORMULA,
    stem: '$(x + 3)^2$ 을 전개한 후 모든 항의 계수와 상수항의 합은?',
    options: [
      { key: 'A', text: '$16$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$9$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '상수항만 답함' },
      { key: 'C', text: '$10$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$1 + 9$만 (중간항 누락)' },
      { key: 'D', text: '$7$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$1 + 6$ 잘못' },
      { key: 'E', text: '$15$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$6 + 9$만' },
    ],
    solution: '$(x+3)^2 = x^2 + 6x + 9$. 계수와 상수항 합 $= 1 + 6 + 9 = 16$. (= $x = 1$ 대입한 값)' },

  // S20 (어려움) 지수 연립
  { chapterCode: CODE, difficulty: 'hard', concept: '지수 연립방정식 (덧셈·뺄셈)', requiredSkills: SKILLS_EXP_MUL,
    stem: '$a^m \\cdot a^n = a^{10}$ 이고 $a^m \\div a^n = a^4$ 일 때, $m, n$ 의 값은?',
    options: [
      { key: 'A', text: '$m = 7, n = 3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$m = 3, n = 7$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$m, n$ 바꿈 ($m - n > 0$이어야)' },
      { key: 'C', text: '$m = 6, n = 4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$m - n = 2$ 잘못' },
      { key: 'D', text: '$m = 10, n = 4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '두 값을 그대로' },
      { key: 'E', text: '$m = 5, n = 5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$m + n = 10$만 만족, $m - n = 0$' },
    ],
    solution: '$m + n = 10$, $m - n = 4$. 더하면 $2m = 14 \\to m = 7$. $n = 10 - 7 = 3$.' },
];

export const K_G8_MATH2_CH02_CALC_EXPR_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
