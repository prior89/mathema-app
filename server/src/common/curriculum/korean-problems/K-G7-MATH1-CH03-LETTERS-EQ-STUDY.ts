/**
 * K-G7-MATH1-CH03-LETTERS-EQ — STUDY pool (single-step, 20문제).
 * 문자와 식 · 일차방정식 — Mastery 3-step과 별도 변형 문제.
 *
 * 2026-05-28 사용자 spec:
 *   - 난이도: 쉬움 6 / 중간 9 / 어려움 5
 *   - 각 문제 5지선다, 오답 4개에 errorCode + rationale
 *   - Mastery와 다른 식·숫자 (변형 문제)
 *   - LLM-generated 아님.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G7-MATH1-CH03-LETTERS-EQ';
const SKILLS_VALUE = ['variable_substitution', 'value_of_expression'];
const SKILLS_NOTATION = ['multiplication_symbol_omit', 'coefficient_arrangement'];
const SKILLS_LIKE = ['like_terms', 'coefficient_combine'];
const SKILLS_DISTRIB = ['distributive_law', 'sign_handling'];
const SKILLS_DEGREE = ['polynomial_degree', 'term_count'];
const SKILLS_LINEAR = ['like_terms', 'distributive_law'];
const SKILLS_EQ = ['equation_solving', 'transposition'];
const SKILLS_FRAC_EQ = ['fraction_equation', 'common_denominator'];
const SKILLS_DEC_EQ = ['decimal_to_integer', 'equation_solving'];
const SKILLS_WORD = ['word_to_equation', 'equation_solving'];
const SKILLS_RATIO = ['ratio_proportion', 'cross_multiplication'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) 식의 값
  { chapterCode: CODE, difficulty: 'easy', concept: '식의 값 (양수 대입)', requiredSkills: SKILLS_VALUE,
    stem: '$x = 4$ 일 때, $2x - 1$ 의 값은?',
    options: [
      { key: 'A', text: '$7$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$-1$ 누락 ($2 \\times 4 = 8$)' },
      { key: 'C', text: '$9$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2 \\times 4 + 1$ 부호 잘못' },
      { key: 'D', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2 \\times 4 / 2 - 1$ 잘못된 연산' },
      { key: 'E', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2 + 4$로 처리' },
    ],
    solution: '$2x - 1 = 2 \\times 4 - 1 = 8 - 1 = 7$.' },

  // S2 (쉬움) 음수 대입
  { chapterCode: CODE, difficulty: 'easy', concept: '음수 대입', requiredSkills: SKILLS_VALUE,
    stem: '$a = -2$ 일 때, $3a + 5$ 의 값은?',
    options: [
      { key: 'A', text: '$-1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$11$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-2$ 부호 누락 ($3 \\times 2 + 5$)' },
      { key: 'C', text: '$-11$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-(3 \\times 2 + 5)$ 잘못' },
      { key: 'D', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$-3 \\times 2 + 5 = -1$이 아니라 $-6+5=-1$이지만 절댓값 처리 실수' },
      { key: 'E', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$-2 + 5$ 잘못된 분배' },
    ],
    solution: '$3a + 5 = 3 \\times (-2) + 5 = -6 + 5 = -1$.' },

  // S3 (쉬움) 곱셈 기호 생략
  { chapterCode: CODE, difficulty: 'easy', concept: '곱셈 기호 생략 규칙', requiredSkills: SKILLS_NOTATION,
    stem: '$a \\times 5 \\times b$ 를 간단히 나타내면?',
    options: [
      { key: 'A', text: '$5ab$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$ab5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '숫자는 문자 앞에 와야 함' },
      { key: 'C', text: '$a5b$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '숫자는 맨 앞' },
      { key: 'D', text: '$5(a+b)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곱셈을 덧셈으로 오해' },
      { key: 'E', text: '$5a + b$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곱셈 일부만 처리' },
    ],
    solution: '곱셈 기호 생략 규칙: 숫자 앞, 문자 알파벳 순서 → $5ab$.' },

  // S4 (쉬움) 동류항 차
  { chapterCode: CODE, difficulty: 'easy', concept: '동류항 차', requiredSkills: SKILLS_LIKE,
    stem: '$8x - 3x$ 를 간단히 하면?',
    options: [
      { key: 'A', text: '$5x$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '문자 $x$ 누락' },
      { key: 'C', text: '$11x$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '뺄셈을 덧셈으로' },
      { key: 'D', text: '$5x^2$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '계수만 빼고 지수는 그대로 유지해야 함' },
      { key: 'E', text: '$-5x$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '큰 수에서 작은 수 뺀 부호 잘못' },
    ],
    solution: '동류항은 계수만 연산: $(8-3)x = 5x$.' },

  // S5 (쉬움) 분배법칙 (음수 계수)
  { chapterCode: CODE, difficulty: 'easy', concept: '음수 계수 분배법칙', requiredSkills: SKILLS_DISTRIB,
    stem: '$-3(2x - 4)$ 를 전개하면?',
    options: [
      { key: 'A', text: '$-6x + 12$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$-6x - 12$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-3 \\times (-4) = +12$인데 부호 잘못' },
      { key: 'C', text: '$6x - 12$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-3 \\times 2x = -6x$인데 부호 잘못' },
      { key: 'D', text: '$-6x + 4$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$-3$을 둘째 항에 안 곱함' },
      { key: 'E', text: '$-3 \\cdot 2x - 4$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '분배 미완성' },
    ],
    solution: '$-3 \\times 2x + (-3) \\times (-4) = -6x + 12$.' },

  // S6 (쉬움) 차수와 항
  { chapterCode: CODE, difficulty: 'easy', concept: '다항식의 차수', requiredSkills: SKILLS_DEGREE,
    stem: '다항식 $2x^2 + 3x - 5$ 의 차수는?',
    options: [
      { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$3x$ 항만 봄' },
      { key: 'C', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '항의 개수와 혼동' },
      { key: 'D', text: '$5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '상수항을 차수로 오해' },
      { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '상수 다항식과 혼동' },
    ],
    solution: '다항식의 차수 = 가장 높은 차수의 항 차수. $2x^2$ 의 차수가 $2$이므로 다항식 차수 = $2$.' },

  // S7 (중) 분배 + 동류항
  { chapterCode: CODE, difficulty: 'medium', concept: '분배법칙 + 동류항 정리', requiredSkills: SKILLS_LINEAR,
    stem: '$2(3x + 1) - 3(x - 2)$ 를 간단히 하면?',
    options: [
      { key: 'A', text: '$3x + 8$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3x + 4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-3 \\times (-2) = +6$인데 $-3 \\times (-2) = -6$으로 잘못' },
      { key: 'C', text: '$9x + 8$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$6x + 3x = 9x$로 덧셈 (실제는 $-3x$ 빼야)' },
      { key: 'D', text: '$3x - 4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '두 상수항 부호 모두 잘못' },
      { key: 'E', text: '$3x - 8$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$+2 + 6 = +8$인데 부호 잘못' },
    ],
    solution: '$2(3x+1)-3(x-2) = 6x + 2 - 3x + 6 = 3x + 8$.' },

  // S8 (중) 이항 (뺄셈)
  { chapterCode: CODE, difficulty: 'medium', concept: '일차방정식 이항 (뺄셈→덧셈)', requiredSkills: SKILLS_EQ,
    stem: '방정식 $x - 7 = 4$ 의 해는?',
    options: [
      { key: 'A', text: '$x = 11$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = -3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '이항 시 부호 안 바꿈 ($4 - 7$)' },
      { key: 'C', text: '$x = 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$7 - 4$ 방향 잘못' },
      { key: 'D', text: '$x = -11$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 전체 잘못' },
      { key: 'E', text: '$x = 28$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$7 \\times 4$ 곱셈으로' },
    ],
    solution: '$-7$을 우변으로 이항 → 부호 바뀌어 $+7$. $x = 4 + 7 = 11$.' },

  // S9 (중) 이항 + 나눗셈
  { chapterCode: CODE, difficulty: 'medium', concept: '계수 나눗셈으로 해 구하기', requiredSkills: SKILLS_EQ,
    stem: '방정식 $3x + 5 = 14$ 의 해는?',
    options: [
      { key: 'A', text: '$x = 3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = 9$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '계수 $3$ 나눗셈 안 함 ($14-5=9$ 그대로)' },
      { key: 'C', text: '$x = 19/3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$+5$ 이항 부호 잘못' },
      { key: 'D', text: '$x = 4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$(14-5)/3 = 3$인데 계산 실수' },
      { key: 'E', text: '$x = 6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$14/3 + 5/3$ 등 잘못된 순서' },
    ],
    solution: '$3x = 14 - 5 = 9$. $x = 9 / 3 = 3$.' },

  // S10 (중) 양변 문자항
  { chapterCode: CODE, difficulty: 'medium', concept: '양변 문자항 이항', requiredSkills: SKILLS_EQ,
    stem: '방정식 $5x - 3 = 2x + 9$ 의 해는?',
    options: [
      { key: 'A', text: '$x = 4$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = 6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3x = 12$ 까지 맞지만 $12/2$로 잘못 나눔' },
      { key: 'C', text: '$x = 12$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '계수 $3$ 나눗셈 누락' },
      { key: 'D', text: '$x = 2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$2x$ 이항 부호 잘못' },
      { key: 'E', text: '$x = -4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '전체 부호 잘못' },
    ],
    solution: '$5x - 2x = 9 + 3 \\to 3x = 12 \\to x = 4$.' },

  // S11 (중) 괄호 + 이항
  { chapterCode: CODE, difficulty: 'medium', concept: '괄호 풀기 후 이항', requiredSkills: SKILLS_EQ,
    stem: '방정식 $3(x - 1) = x + 5$ 의 해는?',
    options: [
      { key: 'A', text: '$x = 4$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = 2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-3$을 $+3$으로 이항 잘못' },
      { key: 'C', text: '$x = 8$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$-3$을 $-1$만 분배' },
      { key: 'D', text: '$x = 3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2x = 8$인데 $8/2 \\neq 3$' },
      { key: 'E', text: '$x = 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '괄호 안 풀고 처리' },
    ],
    solution: '$3x - 3 = x + 5 \\to 2x = 8 \\to x = 4$.' },

  // S12 (중) 분수 일차방정식
  { chapterCode: CODE, difficulty: 'medium', concept: '단순 분수 방정식', requiredSkills: SKILLS_FRAC_EQ,
    stem: '방정식 $\\dfrac{x}{2} - 1 = 3$ 의 해는?',
    options: [
      { key: 'A', text: '$x = 8$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = 4$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '$\\dfrac{x}{2} = 4$에서 곱셈 누락' },
      { key: 'C', text: '$x = 2$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '분모 $2$를 무시' },
      { key: 'D', text: '$x = 7$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3 + 1 = 4$인데 $\\times 2$ 안 함' },
      { key: 'E', text: '$x = -8$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
    ],
    solution: '$\\dfrac{x}{2} = 3 + 1 = 4$. 양변 $\\times 2$ → $x = 8$.' },

  // S13 (중) 분자 일차식
  { chapterCode: CODE, difficulty: 'medium', concept: '분자가 일차식인 방정식', requiredSkills: SKILLS_FRAC_EQ,
    stem: '방정식 $\\dfrac{x - 3}{4} = 2$ 의 해는?',
    options: [
      { key: 'A', text: '$x = 11$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = 5$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '분모 $4$ 곱셈 누락 ($x - 3 = 2$)' },
      { key: 'C', text: '$x = 8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$x - 3 = 8$인데 $-3$ 이항 누락' },
      { key: 'D', text: '$x = -11$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 전체 잘못' },
      { key: 'E', text: '$x = 2$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '$x - 3 = 2 \\times 4$ 곱셈 후 $-3$ 처리 안 함' },
    ],
    solution: '양변 $\\times 4$ → $x - 3 = 8 \\to x = 11$.' },

  // S14 (중) 소수 방정식
  { chapterCode: CODE, difficulty: 'medium', concept: '소수 일차방정식', requiredSkills: SKILLS_DEC_EQ,
    stem: '방정식 $0.2x + 0.4 = 1.2$ 의 해는?',
    options: [
      { key: 'A', text: '$x = 4$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = 0.4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$0.8 / 0.2$ 잘못된 나눗셈' },
      { key: 'C', text: '$x = 8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$0.8 / 0.1$로 계산' },
      { key: 'D', text: '$x = 2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$1.2 - 0.4 = 0.8$, $0.8/0.4$로 잘못된 분모' },
      { key: 'E', text: '$x = 0.8$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$0.2$ 나눗셈 누락' },
    ],
    solution: '양변 $\\times 10$: $2x + 4 = 12 \\to 2x = 8 \\to x = 4$.' },

  // S15 (중) 문장 → 방정식
  { chapterCode: CODE, difficulty: 'medium', concept: '문장을 일차방정식으로', requiredSkills: SKILLS_WORD,
    stem: '어떤 수의 $3$ 배에서 $4$ 를 뺀 값이 $14$ 일 때, 어떤 수는?',
    options: [
      { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$10$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$3x = 14$로 식 잘못 세움' },
      { key: 'C', text: '$\\dfrac{10}{3}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3x = 10$ 그대로 두고 나눔' },
      { key: 'D', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3x = 14 + 4 = 18$, $18/3 = 6$인데 계산 실수' },
      { key: 'E', text: '$8$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-4$를 $+4$로 식 세움' },
    ],
    solution: '$3x - 4 = 14 \\to 3x = 18 \\to x = 6$.' },

  // S16 (어려움) 연속 짝수
  { chapterCode: CODE, difficulty: 'hard', concept: '연속한 짝수의 합 (서술형)', requiredSkills: SKILLS_WORD,
    stem: '연속한 세 짝수의 합이 $36$ 이다. 가장 작은 수는?',
    options: [
      { key: 'A', text: '$10$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$11$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '연속 자연수로 풀어 ($11+12+13$)' },
      { key: 'C', text: '$12$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평균 (가운데 수) 답함' },
      { key: 'D', text: '$8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$x + (x+1) + (x+2)$ 잘못된 식' },
      { key: 'E', text: '$14$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가장 큰 수 답함' },
    ],
    solution: '연속한 짝수: $x, x+2, x+4$. $3x + 6 = 36 \\to x = 10$. (10, 12, 14)' },

  // S17 (어려움) 직사각형 비례
  { chapterCode: CODE, difficulty: 'hard', concept: '비율 도형 (서술형)', requiredSkills: SKILLS_WORD,
    stem: '가로가 세로의 $2$ 배인 직사각형의 둘레가 $30\\text{cm}$ 이다. 세로의 길이는?',
    options: [
      { key: 'A', text: '$5\\text{cm}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$10\\text{cm}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가로 답함' },
      { key: 'C', text: '$7.5\\text{cm}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '둘레 / 4로 처리 (정사각형 가정)' },
      { key: 'D', text: '$15\\text{cm}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '둘레 / 2로 처리 (한 쌍만)' },
      { key: 'E', text: '$3\\text{cm}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$6x = 30, x = 5$인데 잘못 계산' },
    ],
    solution: '세로 $= x$, 가로 $= 2x$. 둘레 $= 2(x + 2x) = 6x = 30 \\to x = 5$ cm.' },

  // S18 (어려움) 사탕 나누기
  { chapterCode: CODE, difficulty: 'hard', concept: '나머지/부족 균형식 (서술형)', requiredSkills: SKILLS_WORD,
    stem: '학생 한 명에게 사탕을 $3$ 개씩 주면 $4$ 개가 남고, $4$ 개씩 주면 $1$ 개가 모자란다. 학생 수는?',
    options: [
      { key: 'A', text: '$5$명', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3$명', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3x + 4 = 4x - 1$에서 $x = 5$인데 잘못 계산' },
      { key: 'C', text: '$4$명', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '부족 조건 누락' },
      { key: 'D', text: '$7$명', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$3x + 4 = 4x + 1$로 부호 잘못' },
      { key: 'E', text: '$6$명', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3 + 4 - (-1) = 8$ 등 잘못된 식' },
    ],
    solution: '학생 $x$명. 사탕 수 $= 3x + 4 = 4x - 1$. $x = 5$명. 사탕 $= 19$개.' },

  // S19 (어려움) 미정계수
  { chapterCode: CODE, difficulty: 'hard', concept: '해 조건으로 미정계수 구하기', requiredSkills: SKILLS_EQ,
    stem: '일차방정식 $5x + a = 12$ 의 해가 $x = 2$ 일 때, $a$ 의 값은?',
    options: [
      { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$-2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$10 + a = 12, a = 2$인데 부호 잘못' },
      { key: 'C', text: '$22$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$10 + a = 12$가 아닌 $5 \\cdot 2 + 12 = a$ 식 세움' },
      { key: 'D', text: '$5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '계수와 혼동' },
      { key: 'E', text: '$10$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$5 \\times 2$ 자체를 답함' },
    ],
    solution: '$x = 2$ 대입: $5 \\times 2 + a = 12 \\to 10 + a = 12 \\to a = 2$.' },

  // S20 (어려움) 비례식
  { chapterCode: CODE, difficulty: 'hard', concept: '비례식 → 일차방정식', requiredSkills: SKILLS_RATIO,
    stem: '비례식 $(2x - 1) : 3 = 5 : 1$ 의 $x$ 값은?',
    options: [
      { key: 'A', text: '$x = 8$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = 3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '외항/내항 잘못 ($1 \\cdot (2x-1) = 3 \\cdot 5$ 미적용)' },
      { key: 'C', text: '$x = 7$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2x - 1 = 15$에서 $2x = 16$인데 잘못 나눔' },
      { key: 'D', text: '$x = 16$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '계수 $2$ 나눗셈 누락' },
      { key: 'E', text: '$x = \\dfrac{16}{3}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$2x - 1 = 5/3$ 잘못된 외항·내항' },
    ],
    solution: '외항 곱 = 내항 곱: $(2x - 1) \\times 1 = 3 \\times 5 \\to 2x - 1 = 15 \\to x = 8$.' },
];

export const K_G7_MATH1_CH03_LETTERS_EQ_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
