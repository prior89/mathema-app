/**
 * K-G7-MATH1-CH03-LETTERS-EQ (문자와 식 · 일차방정식) — 20문제 3-step Mastery.
 * 중학교 1학년 — 문자식 → 동류항 → 일차방정식 → 응용 (서술형).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 * 주요 errorCode 분배:
 *   ALGEBRA_ERROR 5 (Q4,6,7,10,19) / SIGN_ERROR 4 (Q2,5,9,11)
 *   ARITHMETIC_ERROR 3 (Q1,12,14) / CONCEPT_MISUNDERSTANDING 3 (Q3,15,16)
 *   DENOMINATOR_ERROR 2 (Q13,14) / CONDITION_MISSING 2 (Q17,18)
 *   FORMULA_SELECTION_ERROR 1 (Q20)
 *
 * 각 문제 = 3 step (CONCEPT/PROCESS/ANSWER), 각 step = 5지선다.
 * 정답 1개 + 오답 4개, 오답마다 errorCode + errorReason.
 *
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G7-MATH1-CH03-LETTERS-EQ';
const SKILLS_VALUE = ['variable_substitution', 'value_of_expression', 'sign_handling'];
const SKILLS_POWER = ['exponent_notation', 'repeated_multiplication'];
const SKILLS_LIKE = ['like_terms', 'coefficient_combine'];
const SKILLS_DISTRIB = ['distributive_law', 'sign_handling'];
const SKILLS_LINEAR = ['like_terms', 'distributive_law', 'linear_simplification'];
const SKILLS_EQ = ['equation_solving', 'transposition', 'inverse_operation'];
const SKILLS_FRAC_EQ = ['fraction_equation', 'common_denominator', 'equation_solving'];
const SKILLS_DEC_EQ = ['decimal_to_integer', 'equation_solving', 'transposition'];
const SKILLS_WORD = ['word_to_equation', 'condition_check', 'equation_solving'];
const SKILLS_RATIO = ['ratio_proportion', 'cross_multiplication', 'equation_solving'];

const problems: KoreanProblemSeed[] = [
  // ────────── Q1 (쉬움) x=2일 때 3x+1 · ARITHMETIC_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'easy', concept: '식의 값 (대입)', requiredSkills: SKILLS_VALUE,
    stem: '$x = 2$ 일 때 $3x + 1$ 의 값은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '"대입한다"의 의미는?',
        options: [
          { key: 'A', text: '문자가 있던 자리에 주어진 수를 대신 넣는다', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '문자를 그대로 두고 계산만 한다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '대입 자체를 안 함' },
          { key: 'C', text: '문자를 모두 0으로 본다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '주어진 값과 무관' },
          { key: 'D', text: '문자에 1을 더한다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없는 변환' },
          { key: 'E', text: '문자 앞 계수만 더한다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '계수 처리 잘못' },
        ] },
      { stepType: 'PROCESS', prompt: '$x = 2$ 를 대입한 식은?',
        options: [
          { key: 'A', text: '$3 \\times 2 + 1$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$3 + 2 + 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$3x$를 $3+x$로 오해' },
          { key: 'C', text: '$32 + 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$3$과 $2$를 붙여 씀' },
          { key: 'D', text: '$3 \\times 2 \\times 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '+를 ×로 잘못' },
          { key: 'E', text: '$2 \\times 3 + 1 \\times 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '상수 항에도 $3$ 곱함' },
        ] },
      { stepType: 'ANSWER', prompt: '계산 결과는?',
        options: [
          { key: 'A', text: '$7$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$+1$ 누락' },
          { key: 'C', text: '$8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3 \\times 2 = 8$로 오인' },
          { key: 'D', text: '$9$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3+2+1+3$로 오인' },
          { key: 'E', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3 \\times 2$ 대신 $2+3$으로 오인' },
        ] },
    ],
    solution: '$x = 2$를 대입: $3 \\times 2 + 1 = 6 + 1 = 7$.',
  },

  // ────────── Q2 (쉬움) a=-3일 때 5-a · SIGN_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'easy', concept: '음수 대입', requiredSkills: SKILLS_VALUE,
    stem: '$a = -3$ 일 때 $5 - a$ 의 값은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '음수를 대입할 때 주의점은?',
        options: [
          { key: 'A', text: '괄호로 묶어서 대입한다', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '부호를 무시하고 절댓값만 대입', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '음수 부호 무시' },
          { key: 'C', text: '부호를 양수로 바꿔 대입', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 임의 변경' },
          { key: 'D', text: '$-a$ 를 $a$로 본다', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '식 자체 변형' },
          { key: 'E', text: '아무 일도 안 한다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '괄호 처리 필요' },
        ] },
      { stepType: 'PROCESS', prompt: '$5 - a$ 에 $a = -3$ 대입한 식은?',
        options: [
          { key: 'A', text: '$5 - (-3)$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$5 - 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 누락' },
          { key: 'C', text: '$5 + 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '괄호 없이 빼기를 더하기로' },
          { key: 'D', text: '$-5 - 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$5$의 부호 변경' },
          { key: 'E', text: '$5 \\times (-3)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '빼기를 곱하기로' },
        ] },
      { stepType: 'ANSWER', prompt: '$5 - (-3) = ?$',
        options: [
          { key: 'A', text: '$8$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$5 - 3 = 2$로 오인 (음수 부호 누락)' },
          { key: 'C', text: '$-8$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '최종 부호 잘못' },
          { key: 'D', text: '$-2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 두 번 잘못' },
          { key: 'E', text: '$15$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$5 \\times 3$로 오해' },
        ] },
    ],
    solution: '$a$ 자리에 $(-3)$ 대입: $5 - (-3) = 5 + 3 = 8$.',
  },

  // ────────── Q3 (쉬움) x×x×x 거듭제곱 · CONCEPT_MISUNDERSTANDING ──────────
  {
    chapterCode: CODE, difficulty: 'easy', concept: '거듭제곱 표기 (문자)', requiredSkills: SKILLS_POWER,
    stem: '$x \\times x \\times x$ 를 거듭제곱으로 나타내면?',
    steps: [
      { stepType: 'CONCEPT', prompt: '같은 문자를 여러 번 곱할 때의 표기는?',
        options: [
          { key: 'A', text: '곱한 횟수를 지수로 적는다: $x^n$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '곱한 횟수를 계수로 적는다: $nx$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곱셈과 계수 혼동' },
          { key: 'C', text: '지수와 계수를 같이 적는다: $nx^n$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '중복 표기' },
          { key: 'D', text: '$\\sqrt{x}^n$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근호와 무관' },
          { key: 'E', text: '곱셈을 덧셈으로 본다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '연산 자체 변경' },
        ] },
      { stepType: 'PROCESS', prompt: '$x$ 가 몇 번 곱해졌는가?',
        options: [
          { key: 'A', text: '$3$번', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$2$번', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '횟수 셈 오류' },
          { key: 'C', text: '$1$번', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '횟수 셈 오류' },
          { key: 'D', text: '$4$번', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '횟수 셈 오류' },
          { key: 'E', text: '$0$번', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곱한 횟수가 있음' },
        ] },
      { stepType: 'ANSWER', prompt: '거듭제곱 표현은?',
        options: [
          { key: 'A', text: '$x^3$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$3x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '계수로 잘못 표기' },
          { key: 'C', text: '$x^2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '지수 오류' },
          { key: 'D', text: '$3x^3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '계수+지수 중복' },
          { key: 'E', text: '$x + x + x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곱셈 → 덧셈' },
        ] },
    ],
    solution: '같은 문자가 $n$번 곱해지면 $x^n$. $x \\times x \\times x = x^3$.',
  },

  // ────────── Q4 (쉬움) 5a + 3a · ALGEBRA_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'easy', concept: '동류항 정리', requiredSkills: SKILLS_LIKE,
    stem: '$5a + 3a$ 를 간단히 하면?',
    steps: [
      { stepType: 'CONCEPT', prompt: '동류항이란?',
        options: [
          { key: 'A', text: '문자 부분이 같은 항', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '계수가 같은 항', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '계수와 문자 혼동' },
          { key: 'C', text: '값이 같은 항', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '값과 무관' },
          { key: 'D', text: '문자 종류가 다른 항', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '반대' },
          { key: 'E', text: '지수가 다른 항', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '지수도 같아야 함' },
        ] },
      { stepType: 'PROCESS', prompt: '$5a + 3a$ 에서 계수 부분만 보면?',
        options: [
          { key: 'A', text: '$5 + 3$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$5 \\times 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '곱셈으로 오해' },
          { key: 'C', text: '$5 - 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '뺄셈으로 오해' },
          { key: 'D', text: '$5a + 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$a$ 한쪽만 분리' },
          { key: 'E', text: '$5 + 3a$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$a$ 한쪽만 분리' },
        ] },
      { stepType: 'ANSWER', prompt: '간단히 한 결과는?',
        options: [
          { key: 'A', text: '$8a$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$15a$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '계수끼리 곱함' },
          { key: 'C', text: '$8a^2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '문자도 곱함' },
          { key: 'D', text: '$15a^2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '계수+문자 모두 곱셈' },
          { key: 'E', text: '$8 + a$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '문자 분리' },
        ] },
    ],
    solution: '동류항: 문자 부분 $a$ 동일. 계수 합 $5 + 3 = 8$. $\\therefore 5a + 3a = 8a$.',
  },

  // ────────── Q5 (쉬움) 2(x+3) · SIGN_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'easy', concept: '분배법칙', requiredSkills: SKILLS_DISTRIB,
    stem: '$2(x + 3)$ 을 전개하면?',
    steps: [
      { stepType: 'CONCEPT', prompt: '분배법칙 $a(b+c)$ 는?',
        options: [
          { key: 'A', text: '$ab + ac$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$ab + c$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$c$에 $a$ 곱셈 누락' },
          { key: 'C', text: '$a + bc$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$a$가 곱이 아닌 합으로' },
          { key: 'D', text: '$abc$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합을 곱으로' },
          { key: 'E', text: '$a + b + c$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '연산 자체 변경' },
        ] },
      { stepType: 'PROCESS', prompt: '$2$ 를 $x$와 $3$ 각각에 곱하면?',
        options: [
          { key: 'A', text: '$2 \\times x = 2x,\\ 2 \\times 3 = 6$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$2 \\times x = 2x,\\ 2 + 3 = 5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$3$에 곱이 아닌 합 적용' },
          { key: 'C', text: '$2 \\times x = 2x$만 처리', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$3$ 누락' },
          { key: 'D', text: '$2 + x = 2 + x,\\ 2 \\times 3 = 6$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$x$ 쪽 곱셈 누락' },
          { key: 'E', text: '$2x \\times 3 = 6x$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '두 항을 같이 곱함' },
        ] },
      { stepType: 'ANSWER', prompt: '결과는?',
        options: [
          { key: 'A', text: '$2x + 6$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$2x + 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$3$에 $2$ 곱하지 않음' },
          { key: 'C', text: '$x + 6$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$x$에 $2$ 곱하지 않음' },
          { key: 'D', text: '$6x$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$2x \\times 3$으로 오해' },
          { key: 'E', text: '$2(x+6)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '전개 안 함' },
        ] },
    ],
    solution: '분배법칙: $2(x+3) = 2 \\times x + 2 \\times 3 = 2x + 6$.',
  },

  // ────────── Q6 (쉬움) 7x - 4x + 2 · ALGEBRA_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'easy', concept: '동류항 + 상수항', requiredSkills: SKILLS_LIKE,
    stem: '$7x - 4x + 2$ 를 간단히 하면?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$7x$ 와 $4x$ 는 동류항인가? $2$ 는?',
        options: [
          { key: 'A', text: '$7x, 4x$ 는 동류항. $2$ 는 상수항으로 분리', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '셋 다 동류항', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '상수항도 문자항과 합칠 수 없음' },
          { key: 'C', text: '동류항이 없다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$7x, 4x$ 동류' },
          { key: 'D', text: '$4x$ 와 $2$ 가 동류항', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '문자 유무 차이' },
          { key: 'E', text: '$7x$ 만 단독 항', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$4x$와 동류' },
        ] },
      { stepType: 'PROCESS', prompt: '$7x - 4x$ 의 계수 계산은?',
        options: [
          { key: 'A', text: '$7 - 4 = 3$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$7 + 4 = 11$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '뺄셈을 덧셈으로' },
          { key: 'C', text: '$7 \\times 4 = 28$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '곱셈으로 오해' },
          { key: 'D', text: '$4 - 7 = -3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '순서 뒤바뀜' },
          { key: 'E', text: '$7x \\div 4x = 1.75$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나눗셈 잘못' },
        ] },
      { stepType: 'ANSWER', prompt: '간단히 한 결과는?',
        options: [
          { key: 'A', text: '$3x + 2$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$5x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$2$를 $x$ 계수로 합산' },
          { key: 'C', text: '$3x - 2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$+2$의 부호 잘못' },
          { key: 'D', text: '$3 + 2x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$x$ 위치 잘못' },
          { key: 'E', text: '$11x + 2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '뺄셈을 덧셈으로' },
        ] },
    ],
    solution: '동류항 정리: $7x - 4x = 3x$. 상수항 $+2$ 는 그대로. $\\therefore 3x + 2$.',
  },

  // ────────── Q7 (중) 3(x-2) + 2(x+5) · ALGEBRA_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '분배법칙 + 동류항', requiredSkills: SKILLS_LINEAR,
    stem: '$3(x - 2) + 2(x + 5)$ 를 간단히 하면?',
    steps: [
      { stepType: 'CONCEPT', prompt: '먼저 해야 할 일은?',
        options: [
          { key: 'A', text: '각 괄호를 분배법칙으로 전개', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '두 괄호를 곱한다', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '연산 종류 오해' },
          { key: 'C', text: '괄호를 그냥 지운다', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '계수 곱셈 누락' },
          { key: 'D', text: '두 괄호를 더한다 (계수 무시)', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '분배 누락' },
          { key: 'E', text: '큰 괄호 안 작은 괄호부터', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '중첩 괄호 없음' },
        ] },
      { stepType: 'PROCESS', prompt: '각 괄호를 전개하면?',
        options: [
          { key: 'A', text: '$3x - 6$ 과 $2x + 10$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$3x - 2$ 과 $2x + 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '상수항에 계수 안 곱함' },
          { key: 'C', text: '$3x + 6$ 과 $2x + 10$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$3 \\times (-2)$를 $+6$으로' },
          { key: 'D', text: '$3x - 6$ 과 $2x - 10$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$2 \\times 5$ 부호 잘못' },
          { key: 'E', text: '$x - 6$ 과 $x + 10$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$x$ 계수 누락' },
        ] },
      { stepType: 'ANSWER', prompt: '동류항 정리한 결과는?',
        options: [
          { key: 'A', text: '$5x + 4$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$5x - 4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-6 + 10 = 4$인데 부호 잘못' },
          { key: 'C', text: '$5x + 16$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-6$을 $+6$으로 계산' },
          { key: 'D', text: '$x + 4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$3x - 2x$ 잘못' },
          { key: 'E', text: '$5x + 8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '상수항 합산 실수' },
        ] },
    ],
    solution: '$3(x-2) + 2(x+5) = (3x - 6) + (2x + 10) = (3+2)x + (-6+10) = 5x + 4$.',
  },

  // ────────── Q8 (중) x+5=12 · ALGEBRA_ERROR (이항 기초) ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '일차방정식 (이항)', requiredSkills: SKILLS_EQ,
    stem: '방정식 $x + 5 = 12$ 의 해는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '등식의 성질은?',
        options: [
          { key: 'A', text: '양변에 같은 수를 더하거나 빼도 등식이 성립한다', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '한쪽에만 수를 더해도 된다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '균형 깨짐' },
          { key: 'C', text: '양변에 0을 곱해도 된다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$0 = 0$만 됨' },
          { key: 'D', text: '$x$ 와 상수를 자유롭게 이동', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부호 변환 필요' },
          { key: 'E', text: '$x$ 를 양변에서 빼면 안 됨', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '같은 수 빼기 가능' },
        ] },
      { stepType: 'PROCESS', prompt: '양변에서 $5$ 를 빼면?',
        options: [
          { key: 'A', text: '$x = 12 - 5$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$x = 12 + 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '이항 시 부호 안 바꿈' },
          { key: 'C', text: '$x + 5 = 12 - 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '왼쪽만 적용' },
          { key: 'D', text: '$x = 5 - 12$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '순서 잘못' },
          { key: 'E', text: '$x - 5 = 12$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '엉뚱한 변형' },
        ] },
      { stepType: 'ANSWER', prompt: '$x$ 의 값은?',
        options: [
          { key: 'A', text: '$x = 7$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$x = 17$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$12 + 5$로 계산' },
          { key: 'C', text: '$x = -7$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$5 - 12$ 잘못 계산' },
          { key: 'D', text: '$x = 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$x$와 상수 혼동' },
          { key: 'E', text: '$x = 12$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$+5$ 무시' },
        ] },
    ],
    solution: '양변에서 $5$ 빼기: $x = 12 - 5 = 7$. 검산: $7 + 5 = 12$ ✓.',
  },

  // ────────── Q9 (중) 2x-3=11 · SIGN_ERROR + 나눗셈 ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '일차방정식 (이항+나눗셈)', requiredSkills: SKILLS_EQ,
    stem: '방정식 $2x - 3 = 11$ 의 해는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '두 단계로 푸는 순서는?',
        options: [
          { key: 'A', text: '먼저 상수를 이항한 뒤 계수로 나눈다', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '먼저 계수로 나눈 뒤 상수 이항', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '계수가 양변에 같이 적용 안 되어 어색해짐' },
          { key: 'C', text: '계수와 상수를 한꺼번에 이동', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '순서 무시' },
          { key: 'D', text: '$x$ 를 0으로 본다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
          { key: 'E', text: '양변을 제곱한다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '필요 없음' },
        ] },
      { stepType: 'PROCESS', prompt: '양변에 $3$ 을 더하면?',
        options: [
          { key: 'A', text: '$2x = 14$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$2x = 8$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$11 - 3$ 으로 잘못 (이항 부호 잘못)' },
          { key: 'C', text: '$2x - 6 = 11$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-3$ 자체에 더해버림' },
          { key: 'D', text: '$2x = 11$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$3$ 무시' },
          { key: 'E', text: '$x = 14$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '계수 $2$ 무시' },
        ] },
      { stepType: 'ANSWER', prompt: '양변을 $2$ 로 나누면 $x = ?$',
        options: [
          { key: 'A', text: '$x = 7$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$x = 14$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나눗셈 누락' },
          { key: 'C', text: '$x = 4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$8/2$ 로 잘못' },
          { key: 'D', text: '$x = 28$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나눗셈을 곱셈으로' },
          { key: 'E', text: '$x = 6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$12/2$ 로 잘못' },
        ] },
    ],
    solution: '$2x - 3 = 11 \\Rightarrow 2x = 14 \\Rightarrow x = 7$. 검산: $2(7) - 3 = 14 - 3 = 11$ ✓.',
  },

  // ────────── Q10 (중) 3x+4 = 2x+10 · ALGEBRA_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '문자도 이항', requiredSkills: SKILLS_EQ,
    stem: '방정식 $3x + 4 = 2x + 10$ 의 해는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '문자가 양쪽에 있을 때 어떻게 정리하는가?',
        options: [
          { key: 'A', text: '문자는 왼쪽으로, 상수는 오른쪽으로 모은다', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '왼쪽 식만 계산', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '오른쪽 문자 무시' },
          { key: 'C', text: '문자만 곱한다', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '연산 변경' },
          { key: 'D', text: '$x$ 를 양변에서 제거', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '같은 계수 아니면 안 됨' },
          { key: 'E', text: '양변을 $x$ 로 나눈다', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$x$ 값을 모름' },
        ] },
      { stepType: 'PROCESS', prompt: '$2x$ 를 왼쪽으로, $4$ 를 오른쪽으로 이항하면?',
        options: [
          { key: 'A', text: '$3x - 2x = 10 - 4$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$3x + 2x = 10 + 4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '이항 시 부호 안 바꿈' },
          { key: 'C', text: '$3x - 2x = 10 + 4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '상수 부호만 잘못' },
          { key: 'D', text: '$3x + 2x = 10 - 4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '문자 부호 잘못' },
          { key: 'E', text: '$3x - 2x = 10$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$4$ 누락' },
        ] },
      { stepType: 'ANSWER', prompt: '$x$ 의 값은?',
        options: [
          { key: 'A', text: '$x = 6$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$x = 14$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$10 + 4$ 적용' },
          { key: 'C', text: '$x = -6$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
          { key: 'D', text: '$x = 4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$10 - 6$ 잘못 계산' },
          { key: 'E', text: '$x = 2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '엉뚱한 결과' },
        ] },
    ],
    solution: '$3x + 4 = 2x + 10 \\Rightarrow 3x - 2x = 10 - 4 \\Rightarrow x = 6$. 검산: $3(6)+4=22$, $2(6)+10=22$ ✓.',
  },

  // ────────── Q11 (중) 5(x-1) = 2x+10 · SIGN_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '괄호 풀기 + 이항', requiredSkills: SKILLS_EQ,
    stem: '방정식 $5(x - 1) = 2x + 10$ 의 해는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '먼저 처리할 작업은?',
        options: [
          { key: 'A', text: '왼쪽 괄호 분배법칙', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$x$ 를 양변에서 빼기', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '괄호 풀기 먼저' },
          { key: 'C', text: '$5$ 를 양변에서 빼기', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$5$는 곱하기' },
          { key: 'D', text: '양변에 $5$ 곱하기', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '이미 곱해진 상태' },
          { key: 'E', text: '양변에 $1$ 더하기', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '괄호 그대로면 의미 없음' },
        ] },
      { stepType: 'PROCESS', prompt: '$5(x - 1)$ 을 전개하면?',
        options: [
          { key: 'A', text: '$5x - 5$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$5x + 5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-1$을 $+1$로' },
          { key: 'C', text: '$5x - 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$5$ 곱 누락' },
          { key: 'D', text: '$x - 5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$x$에 $5$ 곱 누락' },
          { key: 'E', text: '$5x \\times -5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '연산 잘못' },
        ] },
      { stepType: 'ANSWER', prompt: '$5x - 5 = 2x + 10$ 을 풀면?',
        options: [
          { key: 'A', text: '$x = 5$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$x = 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$10 - 5$ 계산 후 $3x$ 잘못 분리' },
          { key: 'C', text: '$x = 15$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$15/1$ 로 오해' },
          { key: 'D', text: '$x = -5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
          { key: 'E', text: '$x = 7$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
        ] },
    ],
    solution: '$5(x-1) = 2x + 10 \\Rightarrow 5x - 5 = 2x + 10 \\Rightarrow 3x = 15 \\Rightarrow x = 5$. 검산: $5(5-1)=20$, $2(5)+10=20$ ✓.',
  },

  // ────────── Q12 (중) x/3 + 2 = 5 · DENOMINATOR_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '분수 일차방정식', requiredSkills: SKILLS_FRAC_EQ,
    stem: '방정식 $\\dfrac{x}{3} + 2 = 5$ 의 해는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '분모를 없애는 방법은?',
        options: [
          { key: 'A', text: '양변에 분모를 곱한다', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '양변에서 분모를 뺀다', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '뺄셈으로 분모 없앨 수 없음' },
          { key: 'C', text: '양변을 분모로 나눈다', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '분모가 더 커짐' },
          { key: 'D', text: '분모를 무시한다', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '식 변경' },
          { key: 'E', text: '분자만 살리고 분모를 1로', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '근거 없음' },
        ] },
      { stepType: 'PROCESS', prompt: '먼저 $2$ 를 이항한 후 양변에 $3$ 을 곱하면?',
        options: [
          { key: 'A', text: '$\\dfrac{x}{3} = 3 \\Rightarrow x = 9$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$\\dfrac{x}{3} = 5 \\Rightarrow x = 15$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$2$ 이항 누락' },
          { key: 'C', text: '$x + 6 = 15$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '$\\dfrac{x}{3} \\times 3 = x$ 인데 양변 $\\times 3$ 후 $2 \\times 3$ 도 적용해야 일관' },
          { key: 'D', text: '$3x + 2 = 5$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '분모를 분자로' },
          { key: 'E', text: '$x = 3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
        ] },
      { stepType: 'ANSWER', prompt: '$x$ 의 값은?',
        options: [
          { key: 'A', text: '$x = 9$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$x = 3$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '$\\dfrac{x}{3}=3$에서 $x$를 $3$으로' },
          { key: 'C', text: '$x = 15$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$+2$ 이항 누락' },
          { key: 'D', text: '$x = 1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3/3$으로 계산' },
          { key: 'E', text: '$x = 21$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$7 \\times 3$ 잘못' },
        ] },
    ],
    solution: '$\\dfrac{x}{3} + 2 = 5 \\Rightarrow \\dfrac{x}{3} = 3 \\Rightarrow x = 9$. 검산: $9/3 + 2 = 5$ ✓.',
  },

  // ────────── Q13 (중) (2x+1)/3 = 5 · DENOMINATOR_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '분자가 일차식인 분수방정식', requiredSkills: SKILLS_FRAC_EQ,
    stem: '방정식 $\\dfrac{2x + 1}{3} = 5$ 의 해는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '분모 $3$ 을 없애려면?',
        options: [
          { key: 'A', text: '양변에 $3$ 을 곱한다 → $2x + 1 = 15$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '왼쪽 분모만 지운다 → $2x + 1 = 5$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '양변 모두 적용해야 함' },
          { key: 'C', text: '오른쪽에 $3$ 을 뺀다 → $\\dfrac{2x+1}{3} = 2$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '뺄셈으로 분모 안 사라짐' },
          { key: 'D', text: '양변을 $3$ 으로 나눈다', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '분모 더 커짐' },
          { key: 'E', text: '$2x$ 만 $3$ 으로 나눈다', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '$+1$ 부분 누락' },
        ] },
      { stepType: 'PROCESS', prompt: '$2x + 1 = 15$ 에서 $2x = ?$',
        options: [
          { key: 'A', text: '$2x = 14$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$2x = 16$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '이항 부호 잘못' },
          { key: 'C', text: '$2x = 15$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$+1$ 무시' },
          { key: 'D', text: '$x = 14$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '계수 $2$ 무시' },
          { key: 'E', text: '$2x = 5$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '왼쪽 분모만 지움' },
        ] },
      { stepType: 'ANSWER', prompt: '$x$ 의 값은?',
        options: [
          { key: 'A', text: '$x = 7$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$x = 8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$16/2$로 계산' },
          { key: 'C', text: '$x = 14$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나눗셈 누락' },
          { key: 'D', text: '$x = 4$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '오답 (위에 따라)' },
          { key: 'E', text: '$x = 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$5/2$ 계열 오류' },
        ] },
    ],
    solution: '$\\dfrac{2x+1}{3} = 5 \\Rightarrow 2x + 1 = 15 \\Rightarrow 2x = 14 \\Rightarrow x = 7$. 검산: $(2 \\cdot 7 + 1)/3 = 15/3 = 5$ ✓.',
  },

  // ────────── Q14 (중) 0.3x - 0.5 = 0.1x + 0.1 · ARITHMETIC_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '소수 일차방정식', requiredSkills: SKILLS_DEC_EQ,
    stem: '방정식 $0.3x - 0.5 = 0.1x + 0.1$ 의 해는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '소수를 정수로 만들려면?',
        options: [
          { key: 'A', text: '양변에 $10$ 을 곱해 정수로 바꾼다', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '소수점만 위로 올린다', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
          { key: 'C', text: '소수를 무시한다', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '식 자체 변경' },
          { key: 'D', text: '왼쪽만 $10$ 곱한다', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '균형 깨짐' },
          { key: 'E', text: '$0.3 \\to 0.03$ 으로', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '소수점 잘못' },
        ] },
      { stepType: 'PROCESS', prompt: '양변에 $10$ 을 곱하면?',
        options: [
          { key: 'A', text: '$3x - 5 = x + 1$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$3x - 0.5 = x + 0.1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '상수에 안 곱함' },
          { key: 'C', text: '$0.3x - 5 = 0.1x + 1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$x$ 계수에 안 곱함' },
          { key: 'D', text: '$3x - 50 = x + 10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '소수점 두 자리 오해' },
          { key: 'E', text: '$30x - 5 = 10x + 1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$10$을 두 번 곱함' },
        ] },
      { stepType: 'ANSWER', prompt: '$x$ 의 값은?',
        options: [
          { key: 'A', text: '$x = 3$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$x = -3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
          { key: 'C', text: '$x = 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$4/2$ 등 계산 실수' },
          { key: 'D', text: '$x = 6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2x = 12$ 잘못 도출' },
          { key: 'E', text: '$x = 0.3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '소수 그대로 답함' },
        ] },
    ],
    solution: '$\\times 10$: $3x - 5 = x + 1 \\Rightarrow 2x = 6 \\Rightarrow x = 3$. 검산: $0.3(3) - 0.5 = 0.4$, $0.1(3) + 0.1 = 0.4$ ✓.',
  },

  // ────────── Q15 (중) 어떤 수에 3 더해 2배하니 18 · CONCEPT_MISUNDERSTANDING ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '문장을 방정식으로', requiredSkills: SKILLS_WORD,
    stem: '어떤 수에 $3$ 을 더한 후 $2$ 배 하니 $18$ 이 되었다. 어떤 수는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '어떤 수를 $x$ 라 할 때, "3을 더한 후 2배"는?',
        options: [
          { key: 'A', text: '$2(x + 3)$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$2x + 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '순서 잘못 (2배 먼저 후 3 더함)' },
          { key: 'C', text: '$x + 3 + 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곱이 아니라 합' },
          { key: 'D', text: '$x + 3 \\times 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$3$에만 곱' },
          { key: 'E', text: '$2x \\times 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$3$도 곱셈으로' },
        ] },
      { stepType: 'PROCESS', prompt: '$2(x + 3) = 18$ 을 풀려면?',
        options: [
          { key: 'A', text: '양변을 $2$ 로 나눠 $x + 3 = 9$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$2x + 3 = 18$ 으로 전개', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$3$에 $2$ 곱 누락' },
          { key: 'C', text: '$x + 3 = 18$ 으로 $2$ 그냥 지움', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$2$ 무시' },
          { key: 'D', text: '$x = 18/2 = 9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$+3$ 누락' },
          { key: 'E', text: '$x = 18 - 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$\\times 2$ 무시' },
        ] },
      { stepType: 'ANSWER', prompt: '$x$ 의 값은?',
        options: [
          { key: 'A', text: '$x = 6$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$x = 12$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$2x+3=18$ 적용 결과' },
          { key: 'C', text: '$x = 9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$+3$ 누락' },
          { key: 'D', text: '$x = 15$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$18 - 3$' },
          { key: 'E', text: '$x = 3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$9/3$ 등 잘못' },
        ] },
    ],
    solution: '$2(x + 3) = 18 \\Rightarrow x + 3 = 9 \\Rightarrow x = 6$. 검산: $(6+3) \\times 2 = 18$ ✓.',
  },

  // ────────── Q16 (어려움) 연속 세 자연수 합 60 · CONCEPT_MISUNDERSTANDING ──────────
  {
    chapterCode: CODE, difficulty: 'hard', concept: '연속한 수 (서술형)', requiredSkills: SKILLS_WORD,
    stem: '연속한 세 자연수의 합이 $60$ 이다. 가장 작은 수는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '가장 작은 수를 $x$ 라 하면 나머지는?',
        options: [
          { key: 'A', text: '$x, x+1, x+2$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$x, x+2, x+4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '연속 = 1씩 증가, $+2$ 아님' },
          { key: 'C', text: '$x, 2x, 3x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '배수와 혼동' },
          { key: 'D', text: '$x-1, x, x+1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x$를 가운데로 잘못 정의' },
          { key: 'E', text: '$x, x, x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '같은 수 세 개' },
        ] },
      { stepType: 'PROCESS', prompt: '합 식은?',
        options: [
          { key: 'A', text: '$x + (x+1) + (x+2) = 60$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$3x = 60$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$+1, +2$ 누락' },
          { key: 'C', text: '$x + 60 = 0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '식 자체 잘못' },
          { key: 'D', text: '$x + x \\times 2 = 60$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '두 번째 항 잘못' },
          { key: 'E', text: '$x(x+1)(x+2) = 60$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곱으로 잘못' },
        ] },
      { stepType: 'ANSWER', prompt: '$3x + 3 = 60$ 을 풀면 $x = ?$',
        options: [
          { key: 'A', text: '$x = 19$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$x = 20$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$+3$ 누락' },
          { key: 'C', text: '$x = 21$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$x$를 가운데 수로' },
          { key: 'D', text: '$x = 57$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나눗셈 누락' },
          { key: 'E', text: '$x = 60$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x$ = 합' },
        ] },
    ],
    solution: '$x + (x+1) + (x+2) = 60 \\Rightarrow 3x + 3 = 60 \\Rightarrow x = 19$. 세 수: $19, 20, 21$. 합 $= 60$ ✓.',
  },

  // ────────── Q17 (어려움) 직사각형 둘레 30, 가로 = 세로+5 · CONDITION_MISSING ──────────
  {
    chapterCode: CODE, difficulty: 'hard', concept: '도형 둘레 (서술형)', requiredSkills: SKILLS_WORD,
    stem: '가로가 세로보다 $5\\text{cm}$ 긴 직사각형의 둘레가 $30\\text{cm}$ 이다. 세로의 길이는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '세로를 $x$ 라 하면 가로는? 둘레는?',
        options: [
          { key: 'A', text: '가로 $= x + 5$, 둘레 $= 2((x+5) + x)$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '가로 $= x - 5$, 둘레 $= 2(x-5+x)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '"길다"의 부호 잘못' },
          { key: 'C', text: '둘레 $= (x+5) + x$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\times 2$ 누락 (한 쌍만 셈)' },
          { key: 'D', text: '둘레 $= (x+5) \\times x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '넓이 공식 적용' },
          { key: 'E', text: '둘레 $= 4x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '정사각형 공식' },
        ] },
      { stepType: 'PROCESS', prompt: '$2((x+5) + x) = 30$ 을 전개하면?',
        options: [
          { key: 'A', text: '$2(2x + 5) = 30 \\Rightarrow 4x + 10 = 30$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$2x + 5 = 30$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$\\times 2$ 누락' },
          { key: 'C', text: '$2x + 5x = 30$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$x+5$를 $5x$로' },
          { key: 'D', text: '$4x + 5 = 30$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$5$에 $2$ 안 곱함' },
          { key: 'E', text: '$2(x+5) + x = 30$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '괄호 구조 잘못' },
        ] },
      { stepType: 'ANSWER', prompt: '$4x + 10 = 30$ 의 해는?',
        options: [
          { key: 'A', text: '$x = 5$ cm', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$x = 10$ cm', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$40/4$로 계산' },
          { key: 'C', text: '$x = 7.5$ cm', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$30/4$ 직접 계산' },
          { key: 'D', text: '$x = 4$ cm', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$20/5$로 잘못' },
          { key: 'E', text: '$x = 30$ cm', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '둘레 자체' },
        ] },
    ],
    solution: '세로 $x$, 가로 $x+5$. 둘레 $2(x + (x+5)) = 30 \\Rightarrow 4x + 10 = 30 \\Rightarrow x = 5$ cm. 검산: 가로 10, 세로 5, 둘레 $2(15) = 30$ ✓.',
  },

  // ────────── Q18 (어려움) 사탕 분배 · CONDITION_MISSING ──────────
  {
    chapterCode: CODE, difficulty: 'hard', concept: '나누어 주기 (서술형)', requiredSkills: SKILLS_WORD,
    stem: '학생 한 명에게 사탕을 $4$ 개씩 주면 $7$ 개가 남고, $5$ 개씩 주면 $3$ 개가 모자란다. 학생 수는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '학생 수를 $x$ 라 하면 사탕 총 개수를 두 가지 방식으로 표현하면?',
        options: [
          { key: 'A', text: '$4x + 7$ (남으면 +) 와 $5x - 3$ (모자라면 −)', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$4x - 7$ 과 $5x + 3$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '남음/모자람 부호 반대' },
          { key: 'C', text: '$4x + 7 = 5x + 3$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '"모자람" 빠뜨려 부호 잘못' },
          { key: 'D', text: '$4x = 5x$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '잔여 무시' },
          { key: 'E', text: '$4 + x = 5 - x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '의미 변형' },
        ] },
      { stepType: 'PROCESS', prompt: '두 식이 같은 사탕 총 개수이므로?',
        options: [
          { key: 'A', text: '$4x + 7 = 5x - 3$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$4x + 7 = 5x + 3$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '모자람 부호 잘못' },
          { key: 'C', text: '$4x - 7 = 5x - 3$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '남음 부호 잘못' },
          { key: 'D', text: '$4x + 7 + 5x - 3 = 0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '합이 아니라 같음' },
          { key: 'E', text: '$4x = 5x$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '상수항 누락' },
        ] },
      { stepType: 'ANSWER', prompt: '학생 수 $x$ 는?',
        options: [
          { key: 'A', text: '$x = 10$명', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$x = 4$명', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '계산 실수' },
          { key: 'C', text: '$x = 7$명', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$7$을 답으로' },
          { key: 'D', text: '$x = 3$명', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$3$을 답으로' },
          { key: 'E', text: '$x = 47$명', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '사탕 총 개수' },
        ] },
    ],
    solution: '$4x + 7 = 5x - 3 \\Rightarrow x = 10$. 검산: $4 \\times 10 + 7 = 47$, $5 \\times 10 - 3 = 47$ ✓.',
  },

  // ────────── Q19 (어려움) ax+3=9의 해 x=2일 때 a · ALGEBRA_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'hard', concept: '해 조건으로 미정계수 구하기', requiredSkills: SKILLS_EQ,
    stem: '일차방정식 $ax + 3 = 9$ 의 해가 $x = 2$ 일 때, $a$ 의 값은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '"해가 $x = 2$"의 의미는?',
        options: [
          { key: 'A', text: '$x$ 자리에 $2$ 를 넣으면 등식이 성립한다', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$x = 2$ 가 방정식의 $a$ 자리에 들어간다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x$와 $a$ 혼동' },
          { key: 'C', text: '$a = 2$ 라는 뜻', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '미지수 혼동' },
          { key: 'D', text: '방정식의 $3$ 자리에 $2$가 들어간다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '엉뚱한 자리' },
          { key: 'E', text: '결과 $9$ 가 $2$ 가 된다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '식 변형' },
        ] },
      { stepType: 'PROCESS', prompt: '$x = 2$ 를 대입한 식은?',
        options: [
          { key: 'A', text: '$2a + 3 = 9$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$a \\cdot 2 = 9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$+3$ 누락' },
          { key: 'C', text: '$2a + 3 = 2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$9$ 자리 잘못' },
          { key: 'D', text: '$a + 3 = 9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '계수 $a$ 와 $x$ 곱 누락' },
          { key: 'E', text: '$a = 9 - 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$x$ 처리 누락' },
        ] },
      { stepType: 'ANSWER', prompt: '$2a + 3 = 9$ 의 해는?',
        options: [
          { key: 'A', text: '$a = 3$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$a = 6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나눗셈 누락' },
          { key: 'C', text: '$a = 4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
          { key: 'D', text: '$a = -3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '이항 부호 잘못' },
          { key: 'E', text: '$a = 12$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$9 + 3$' },
        ] },
    ],
    solution: '$x=2$ 대입: $2a + 3 = 9 \\Rightarrow 2a = 6 \\Rightarrow a = 3$. 검산: $3 \\cdot 2 + 3 = 9$ ✓.',
  },

  // ────────── Q20 (어려움) 비례식 (x+1):4 = 3:2 · FORMULA_SELECTION_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'hard', concept: '비례식 → 일차방정식', requiredSkills: SKILLS_RATIO,
    stem: '비례식 $(x + 1) : 4 = 3 : 2$ 의 $x$ 값은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '비례식 $a : b = c : d$ 의 성질은?',
        options: [
          { key: 'A', text: '$a \\times d = b \\times c$ (외항의 곱 = 내항의 곱)', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$a = c$ 이고 $b = d$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '각 항 같다고 잘못' },
          { key: 'C', text: '$a + d = b + c$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱이 아니라 합' },
          { key: 'D', text: '$a - b = c - d$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '차로 오해' },
          { key: 'E', text: '$a / b = c \\times d$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '연산 혼합 잘못' },
        ] },
      { stepType: 'PROCESS', prompt: '$(x+1) \\times 2 = 4 \\times 3$ 을 풀면?',
        options: [
          { key: 'A', text: '$2(x+1) = 12 \\Rightarrow x+1 = 6$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$(x+1) \\times 4 = 2 \\times 3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '외/내 짝짓기 잘못' },
          { key: 'C', text: '$x + 2 = 12$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$2(x+1)$ 전개 잘못' },
          { key: 'D', text: '$x + 1 = 12$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나눗셈 누락' },
          { key: 'E', text: '$x \\times 2 = 12$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$+1$ 빠뜨림' },
        ] },
      { stepType: 'ANSWER', prompt: '$x$ 값은?',
        options: [
          { key: 'A', text: '$x = 5$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$x = 6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$+1$ 누락' },
          { key: 'C', text: '$x = 11$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나눗셈 누락' },
          { key: 'D', text: '$x = -5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
          { key: 'E', text: '$x = 4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
        ] },
    ],
    solution: '비례식 → $2(x+1) = 4 \\times 3 \\Rightarrow x + 1 = 6 \\Rightarrow x = 5$. 검산: $(5+1):4 = 6:4 = 3:2$ ✓.',
  },
];

export const K_G7_MATH1_CH03_LETTERS_EQ_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
