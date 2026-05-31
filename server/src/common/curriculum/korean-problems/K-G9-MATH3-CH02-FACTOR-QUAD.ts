/**
 * K-G9-MATH3-CH02-FACTOR-QUAD (인수분해 · 이차방정식) — 20문제 3-step Mastery.
 * 중3 — 인수분해 공식 ($(a \pm b)^2$, $a^2-b^2$, $x^2+(p+q)x+pq$) →
 *        이차방정식 인수분해 풀이 → 근의 공식 → 판별식.
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 * 주요 errorCode 분배:
 *   ALGEBRA_ERROR 6 (Q4,5,6,7,8,11) / FORMULA_SELECTION_ERROR 4 (Q1,2,3,13)
 *   ARITHMETIC_ERROR 3 (Q12,14,19) / SIGN_ERROR 3 (Q9,10,16)
 *   CONCEPT_MISUNDERSTANDING 2 (Q15,18) / DENOMINATOR_ERROR 1 (Q20) / CONDITION_MISSING 1 (Q17)
 *
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G9-MATH3-CH02-FACTOR-QUAD';
const SKILLS_DIFF_SQ = ['difference_of_squares', 'a2_minus_b2'];
const SKILLS_PERFECT = ['perfect_square_trinomial'];
const SKILLS_TRINOMIAL = ['trinomial_factoring', 'sum_product_method'];
const SKILLS_LEADING = ['leading_coefficient_factoring'];
const SKILLS_ZERO = ['zero_product_property'];
const SKILLS_QUAD_BASIC = ['quadratic_by_factoring'];
const SKILLS_FORMULA = ['quadratic_formula', 'discriminant'];

const problems: KoreanProblemSeed[] = [
  // Q1
  { chapterCode: CODE, difficulty: 'easy', concept: '합·차 인수분해', requiredSkills: SKILLS_DIFF_SQ,
    stem: '$x^2 - 9$ 를 인수분해하면?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$a^2 - b^2 = ?$', options: [
        { key: 'A', text: '$(a+b)(a-b)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(a-b)^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '완전제곱식' },
        { key: 'C', text: '$(a+b)^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '완전제곱식' },
        { key: 'D', text: '$a^2 + b^2$ (인수분해 안 됨)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '잘못' },
        { key: 'E', text: '$a^2 - b^2$ 그대로', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '인수분해 가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$x^2 - 3^2$', options: [
        { key: 'A', text: '$(x+3)(x-3)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(x-3)^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '완전제곱식' },
        { key: 'C', text: '$(x+3)^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '완전제곱식' },
        { key: 'D', text: '$(x-9)(x+1)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x(x-9)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$(x+3)(x-3)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(x-3)^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '완전제곱식' },
        { key: 'C', text: '$(x+3)^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '완전제곱식' },
        { key: 'D', text: '$x(x-9)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '인수분해 불가', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '가능' },
      ] },
    ], solution: '$x^2 - 9 = x^2 - 3^2 = (x+3)(x-3)$.' },

  // Q2
  { chapterCode: CODE, difficulty: 'easy', concept: '완전제곱식 $(a+b)^2$', requiredSkills: SKILLS_PERFECT,
    stem: '$x^2 + 6x + 9$ 를 인수분해하면?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$a^2 + 2ab + b^2 = ?$', options: [
        { key: 'A', text: '$(a+b)^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(a-b)^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '음 부호' },
        { key: 'C', text: '$(a+b)(a-b)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합·차 공식' },
        { key: 'D', text: '$a^2 + b^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '교차항 누락' },
        { key: 'E', text: '$a^2 \\cdot b^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$x^2 + 2 \\cdot x \\cdot 3 + 3^2 = ?$', options: [
        { key: 'A', text: '$(x+3)^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(x-3)^2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$(x+3)(x-3)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합·차 식' },
        { key: 'D', text: '$(x+9)(x+1)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x^2 + 6x + 9$ 그대로', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '인수분해 가능' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$(x+3)^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(x-3)^2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$(x+3)(x-3)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합·차' },
        { key: 'D', text: '$(x+9)(x+1)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(x+6)(x+3)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$x^2 + 6x + 9 = (x+3)^2$.' },

  // Q3
  { chapterCode: CODE, difficulty: 'easy', concept: '완전제곱식 $(a-b)^2$', requiredSkills: SKILLS_PERFECT,
    stem: '$x^2 - 4x + 4$ 를 인수분해?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$a^2 - 2ab + b^2 = ?$', options: [
        { key: 'A', text: '$(a-b)^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(a+b)^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '양 부호' },
        { key: 'C', text: '$(a-b)(a+b)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합·차' },
        { key: 'D', text: '$a^2 - b^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '교차항 무시' },
        { key: 'E', text: '$a - b$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱 누락' },
      ] },
      { stepType: 'PROCESS', prompt: '$x^2 - 2 \\cdot x \\cdot 2 + 2^2$', options: [
        { key: 'A', text: '$(x-2)^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(x+2)^2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
        { key: 'C', text: '$(x-2)(x+2)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합·차' },
        { key: 'D', text: '$(x-4)(x-1)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x^2 - 4x + 4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '인수분해 안 함' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$(x-2)^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(x+2)^2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$(x-2)(x+2)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합·차' },
        { key: 'D', text: '$(x-4)(x-1)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(x-1)(x-4)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$x^2 - 4x + 4 = (x-2)^2$.' },

  // Q4
  { chapterCode: CODE, difficulty: 'easy', concept: '삼항식 (양수 양수)', requiredSkills: SKILLS_TRINOMIAL,
    stem: '$x^2 + 5x + 6$ 인수분해?',
    steps: [
      { stepType: 'CONCEPT', prompt: '두 수의 합 $= 5$, 곱 $= 6$', options: [
        { key: 'A', text: '$2$ 와 $3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$ 과 $5$ (합 6 잘못)', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '합 잘못' },
        { key: 'C', text: '$6$ 과 $-1$ (곱 $-6$)', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '곱 부호 잘못' },
        { key: 'D', text: '$3$ 과 $-3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '합 0' },
        { key: 'E', text: '$1$ 과 $6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '합 7' },
      ] },
      { stepType: 'PROCESS', prompt: '$(x + 2)(x + 3)$ 확인', options: [
        { key: 'A', text: '$x^2 + 3x + 2x + 6 = x^2 + 5x + 6$ ✓', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^2 + 6x + 6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '교차항 합 잘못' },
        { key: 'C', text: '$x^2 + 5x$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '상수 무시' },
        { key: 'D', text: '$x^2 + 6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '교차항 무시' },
        { key: 'E', text: '$2x + 6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '제곱 누락' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$(x+2)(x+3)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(x+1)(x+6)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '합 7' },
        { key: 'C', text: '$(x-2)(x-3)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'D', text: '$(x+5)(x+1)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(x+6)^2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$2+3=5, 2 \\cdot 3 = 6$ → $(x+2)(x+3)$.' },

  // Q5
  { chapterCode: CODE, difficulty: 'easy', concept: '삼항식 (음수 양수)', requiredSkills: SKILLS_TRINOMIAL,
    stem: '$x^2 - 5x + 6$ 인수분해?',
    steps: [
      { stepType: 'CONCEPT', prompt: '합 $-5$, 곱 $+6$ → 두 수 부호?', options: [
        { key: 'A', text: '둘 다 음수 ($-2, -3$)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '둘 다 양수', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '합 음수' },
        { key: 'C', text: '하나는 양수, 하나는 음수 (곱 음수)', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '곱 양수면 같은 부호' },
        { key: 'D', text: '하나는 $0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '곱 $\\neq 0$' },
        { key: 'E', text: '없음', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '존재' },
      ] },
      { stepType: 'PROCESS', prompt: '두 음수 곱 $6$, 합 $-5$', options: [
        { key: 'A', text: '$-2$ 와 $-3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-1$ 과 $-6$ (합 $-7$)', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '합 잘못' },
        { key: 'C', text: '$2$ 와 $3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'D', text: '$-1$ 과 $6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '곱 음수' },
        { key: 'E', text: '$5$ 와 $1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$(x-2)(x-3)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(x+2)(x+3)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$(x-1)(x-6)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(x-5)(x-1)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(x-6)(x+1)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(x-2)(x-3)$.' },

  // Q6
  { chapterCode: CODE, difficulty: 'easy', concept: '삼항식 (음수 곱)', requiredSkills: SKILLS_TRINOMIAL,
    stem: '$x^2 - 5x - 6$ 인수분해?',
    steps: [
      { stepType: 'CONCEPT', prompt: '곱 $-6$, 합 $-5$ → 부호?', options: [
        { key: 'A', text: '서로 다른 부호 (양수와 음수)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '둘 다 양', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '곱 음수' },
        { key: 'C', text: '둘 다 음', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '곱 음수' },
        { key: 'D', text: '한쪽은 0', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '곱 $-6$, 합 $-5$ 인 두 정수?', options: [
        { key: 'A', text: '$-6$ 과 $1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$6$ 과 $-1$ (합 $5$)', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '합 양수' },
        { key: 'C', text: '$-3$ 과 $2$ (합 $-1$)', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '합 잘못' },
        { key: 'D', text: '$-2$ 와 $3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '합 1' },
        { key: 'E', text: '$6$ 과 $1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '곱 양수' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$(x-6)(x+1)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(x+6)(x-1)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$(x-3)(x+2)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(x-2)(x+3)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(x-5)(x-1)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '곱 $-6$ + 합 $-5$ → $-6$ 과 $1$. $(x-6)(x+1)$.' },

  // Q7
  { chapterCode: CODE, difficulty: 'medium', concept: '삼항식 (큰 수)', requiredSkills: SKILLS_TRINOMIAL,
    stem: '$x^2 + 7x + 12$ 인수분해?',
    steps: [
      { stepType: 'CONCEPT', prompt: '합 $7$, 곱 $12$ 두 양수?', options: [
        { key: 'A', text: '$3$ 과 $4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2$ 와 $5$ (합 $7$, 곱 $10$)', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '곱 잘못' },
        { key: 'C', text: '$6$ 과 $1$ (곱 $6$)', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '곱 잘못' },
        { key: 'D', text: '$2$ 와 $6$ (합 $8$)', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '합 잘못' },
        { key: 'E', text: '$12$ 와 $1$ (합 $13$)', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '합 잘못' },
      ] },
      { stepType: 'PROCESS', prompt: '$(x+3)(x+4)$ 검산', options: [
        { key: 'A', text: '$x^2 + 4x + 3x + 12 = x^2 + 7x + 12$ ✓', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^2 + 12x + 12$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계수 잘못' },
        { key: 'C', text: '$x^2 + 12$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '교차항 없음' },
        { key: 'D', text: '$x^2 + 7x$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '상수 누락' },
        { key: 'E', text: '$2x + 12$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$(x+3)(x+4)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(x+2)(x+6)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '합 8' },
        { key: 'C', text: '$(x+1)(x+12)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '합 13' },
        { key: 'D', text: '$(x-3)(x-4)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'E', text: '$(x+7)(x+12)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$3+4=7, 3 \\cdot 4 = 12$ → $(x+3)(x+4)$.' },

  // Q8
  { chapterCode: CODE, difficulty: 'medium', concept: '선행계수 $\\neq 1$', requiredSkills: SKILLS_LEADING,
    stem: '$2x^2 + 5x + 3$ 인수분해?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$(2x + p)(x + q)$ 형태로?', options: [
        { key: 'A', text: '$2q + p = 5, pq = 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$p + q = 5, pq = 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '선행계수 무시' },
        { key: 'C', text: '$p \\cdot q = 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '잘못' },
        { key: 'D', text: '$p + q = 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '잘못' },
        { key: 'E', text: '분해 불가', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$p = 3, q = 1$ 시도', options: [
        { key: 'A', text: '$(2x+3)(x+1) = 2x^2 + 2x + 3x + 3 = 2x^2 + 5x + 3$ ✓', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(2x+1)(x+3) = 2x^2 + 6x + x + 3 = 2x^2 + 7x + 3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '교차항 7 — 잘못' },
        { key: 'C', text: '$(2x+5)(x+1)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '잘못' },
        { key: 'D', text: '$(2x+3)(x-1)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'E', text: '$2(x+3)(x+1)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$(2x+3)(x+1)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(2x+1)(x+3)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '교차항 7' },
        { key: 'C', text: '$2(x+1)(x+3)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(x+3)(x+1)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$2x^2$ 누락' },
        { key: 'E', text: '$(2x-3)(x-1)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
      ] },
    ], solution: '$(2x+3)(x+1)$. 검산: 전개하면 $2x^2 + 5x + 3$ ✓.' },

  // Q9
  { chapterCode: CODE, difficulty: 'medium', concept: '이차방정식 $x^2 = 9$', requiredSkills: SKILLS_QUAD_BASIC,
    stem: '$x^2 = 9$ 의 해는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$x^2 = k$ ($k > 0$) 의 해?', options: [
        { key: 'A', text: '$x = \\pm \\sqrt{k}$ (두 개)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = \\sqrt{k}$ 만', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '음수 해 누락' },
        { key: 'C', text: '$x = k$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근 안 함' },
        { key: 'D', text: '$x = k/2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '해 없음', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '존재' },
      ] },
      { stepType: 'PROCESS', prompt: '$x = \\pm\\sqrt{9}$', options: [
        { key: 'A', text: '$x = \\pm 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 3$ 만', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-3$ 누락' },
        { key: 'C', text: '$x = 9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근 안 함' },
        { key: 'D', text: '$x = 4.5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나누기' },
        { key: 'E', text: '$x = 81$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '제곱' },
      ] },
      { stepType: 'ANSWER', prompt: '해?', options: [
        { key: 'A', text: '$x = 3$ 또는 $x = -3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '음수 해 누락' },
        { key: 'C', text: '$x = -3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '양수 해 누락' },
        { key: 'D', text: '$x = 9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근 안 함' },
        { key: 'E', text: '해 없음', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '있음' },
      ] },
    ], solution: '$x^2 = 9 \\Rightarrow x = \\pm 3$.' },

  // Q10
  { chapterCode: CODE, difficulty: 'medium', concept: '인수분해로 이차방정식 (공통인수)', requiredSkills: SKILLS_ZERO,
    stem: '$x^2 - 4x = 0$ 의 해는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '공통인수 추출?', options: [
        { key: 'A', text: '$x(x - 4) = 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^2 = 4x$ → $x = 4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '나누기로 $x=0$ 해 누락' },
        { key: 'C', text: '$x(x + 4) = 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'D', text: '$(x-2)^2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '해 없음', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '있음' },
      ] },
      { stepType: 'PROCESS', prompt: '$x \\cdot (x-4) = 0$', options: [
        { key: 'A', text: '$x = 0$ 또는 $x - 4 = 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 4$ 만', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$x=0$ 누락' },
        { key: 'C', text: '$x = 0$ 만', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$x=4$ 누락' },
        { key: 'D', text: '$x = 4 \\cdot 0 = 0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '잘못' },
        { key: 'E', text: '$x = -4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
      ] },
      { stepType: 'ANSWER', prompt: '해?', options: [
        { key: 'A', text: '$x = 0$ 또는 $x = 4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$x=0$ 누락' },
        { key: 'C', text: '$x = 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$x=4$ 누락' },
        { key: 'D', text: '$x = \\pm 2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x = -4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
      ] },
    ], solution: '$x(x-4)=0 \\Rightarrow x = 0$ 또는 $x = 4$.' },

  // Q11
  { chapterCode: CODE, difficulty: 'medium', concept: '인수분해 풀이 (음수 해)', requiredSkills: SKILLS_QUAD_BASIC,
    stem: '$x^2 + 5x + 6 = 0$ 의 해는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '인수분해 → 두 인수의 곱 = 0', options: [
        { key: 'A', text: '$(x+2)(x+3) = 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(x-2)(x-3) = 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$x^2 = -5x - 6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '식 변형만' },
        { key: 'D', text: '$(x+5)(x+1) = 0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(x+6)(x-1) = 0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$x + 2 = 0$ 또는 $x + 3 = 0$', options: [
        { key: 'A', text: '$x = -2$ 또는 $x = -3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 2$ 또는 $x = 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 누락' },
        { key: 'C', text: '$x = -2 \\cdot -3 = 6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '곱' },
        { key: 'D', text: '$x = -5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '해 없음', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '있음' },
      ] },
      { stepType: 'ANSWER', prompt: '해?', options: [
        { key: 'A', text: '$x = -2,\\ -3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 2,\\ 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
        { key: 'C', text: '$x = -2,\\ 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x = 6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x = -5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(x+2)(x+3)=0 \\Rightarrow x = -2, -3$.' },

  // Q12
  { chapterCode: CODE, difficulty: 'medium', concept: '인수분해 풀이 (양수 해)', requiredSkills: SKILLS_QUAD_BASIC,
    stem: '$x^2 - 7x + 12 = 0$ 의 해는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '합 $-7$, 곱 $12$ → 두 음수?', options: [
        { key: 'A', text: '$-3$ 과 $-4$ → $(x-3)(x-4)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3$ 과 $4$ → $(x+3)(x+4)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$-6$ 과 $-2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합 $-8$' },
        { key: 'D', text: '$-1$ 과 $-12$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합 $-13$' },
        { key: 'E', text: '$-2$ 와 $6$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '곱 음수' },
      ] },
      { stepType: 'PROCESS', prompt: '$(x-3)(x-4) = 0$', options: [
        { key: 'A', text: '$x = 3$ 또는 $x = 4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = -3$ 또는 $x = -4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 반대' },
        { key: 'C', text: '$x = 7$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x = 12$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x = 3 \\cdot 4 = 12$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '곱' },
      ] },
      { stepType: 'ANSWER', prompt: '해?', options: [
        { key: 'A', text: '$x = 3,\\ 4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = -3,\\ -4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$x = 7$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x = 12$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x = \\pm 12$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(x-3)(x-4)=0 \\Rightarrow x = 3, 4$.' },

  // Q13
  { chapterCode: CODE, difficulty: 'medium', concept: '근의 공식 적용', requiredSkills: SKILLS_FORMULA,
    stem: '근의 공식으로 $x^2 + 3x - 4 = 0$ 풀기',
    steps: [
      { stepType: 'CONCEPT', prompt: '근의 공식?', options: [
        { key: 'A', text: '$x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = \\dfrac{b \\pm \\sqrt{b^2 - 4ac}}{2a}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$-b$ 잘못' },
        { key: 'C', text: '$x = \\dfrac{-b \\pm \\sqrt{b^2 + 4ac}}{2a}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$-4ac$' },
        { key: 'D', text: '$x = -b \\pm \\sqrt{b^2 - 4ac}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$2a$ 누락' },
        { key: 'E', text: '$x = \\dfrac{b^2 - 4ac}{2a}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '잘못' },
      ] },
      { stepType: 'PROCESS', prompt: '$a=1, b=3, c=-4$. $b^2 - 4ac$?', options: [
        { key: 'A', text: '$9 - 4(1)(-4) = 9 + 16 = 25$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$9 - 16 = -7$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-4(-4) = +16$' },
        { key: 'C', text: '$25$ 음수', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '판별식 양수' },
        { key: 'D', text: '$3^2 - 4 = 5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$ac$ 무시' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$x = (-3 \\pm 5)/2$', options: [
        { key: 'A', text: '$x = 1$ 또는 $x = -4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = -1$ 또는 $x = 4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$x = 1$ 만', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '두 해' },
        { key: 'D', text: '$x = -4$ 만', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '두 해' },
        { key: 'E', text: '$x = 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '판별식 $25$, $x = (-3 \\pm 5)/2 = 1$ 또는 $-4$.' },

  // Q14
  { chapterCode: CODE, difficulty: 'medium', concept: '근의 공식 ($a \\neq 1$)', requiredSkills: SKILLS_FORMULA,
    stem: '$2x^2 - 5x + 3 = 0$ 의 해는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$a=2, b=-5, c=3$. 판별식?', options: [
        { key: 'A', text: '$(-5)^2 - 4(2)(3) = 25 - 24 = 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$25 + 24 = 49$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-4ac$ 부호' },
        { key: 'C', text: '$-5^2 - 24 = -49$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$(-5)^2 = 25$' },
        { key: 'D', text: '$25 - 12 = 13$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$4ac$ 잘못' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$x = (5 \\pm 1)/4$', options: [
        { key: 'A', text: '$x = 6/4 = 3/2$ 또는 $x = 4/4 = 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = -5 \\pm 1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$-b = 5$ 잘못 처리' },
        { key: 'C', text: '$x = 5 \\pm 1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2a=4$ 분모 누락' },
        { key: 'D', text: '$x = 3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '한 해만' },
        { key: 'E', text: '$x = 1, -1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '해?', options: [
        { key: 'A', text: '$x = 1$ 또는 $x = \\dfrac{3}{2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 1$ 만', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '두 해' },
        { key: 'C', text: '$x = -1, -3/2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'D', text: '$x = 2, 3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x = 3$ 만', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$2x^2 - 5x + 3 = 0 \\Rightarrow x = (5 \\pm 1)/4 = 1$ 또는 $3/2$.' },

  // Q15
  { chapterCode: CODE, difficulty: 'medium', concept: '판별식의 의미', requiredSkills: SKILLS_FORMULA,
    stem: '판별식 $b^2 - 4ac > 0$ 이면 이차방정식의 해는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '판별식이 양수면 $\\sqrt{}$ 안?', options: [
        { key: 'A', text: '양수 → $\\pm$ 두 값 → 서로 다른 두 실근', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '한 실근', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '판별식 $0$' },
        { key: 'C', text: '허근', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '판별식 음수' },
        { key: 'D', text: '해 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '있음' },
        { key: 'E', text: '$0$이 해', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '판별식 $0$ 이면?', options: [
        { key: 'A', text: '중근 (한 실근)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '서로 다른 두 실근', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '양수' },
        { key: 'C', text: '해 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '있음' },
        { key: 'D', text: '$0$이 해', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
      { stepType: 'ANSWER', prompt: '$D > 0$ 일 때?', options: [
        { key: 'A', text: '서로 다른 두 실근', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '중근', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$D=0$' },
        { key: 'C', text: '실근 없음 (허근)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$D<0$' },
        { key: 'D', text: '해 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '있음' },
        { key: 'E', text: '하나의 양수 해', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$D > 0$ → 서로 다른 두 실근. $D = 0$ → 중근. $D < 0$ → 허근.' },

  // Q16 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '음수 곱 이차방정식', requiredSkills: SKILLS_QUAD_BASIC,
    stem: '$x^2 + 6x - 7 = 0$ 의 해는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '합 $6$, 곱 $-7$ → 두 정수 부호?', options: [
        { key: 'A', text: '서로 다른 부호 (곱 음수)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '둘 다 양', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '곱 음수' },
        { key: 'C', text: '둘 다 음', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '곱 양수' },
        { key: 'D', text: '한쪽 $0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '존재 안 함', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '존재' },
      ] },
      { stepType: 'PROCESS', prompt: '$7$ 과 $-1$ → $(x+7)(x-1) = 0$', options: [
        { key: 'A', text: '$x = -7$ 또는 $x = 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 7, -1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$x = -7, -1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'D', text: '$x = 6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x = 7, 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
      ] },
      { stepType: 'ANSWER', prompt: '해?', options: [
        { key: 'A', text: '$x = -7,\\ 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 7,\\ -1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$x = -7,\\ -1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'D', text: '$x = 7,\\ 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'E', text: '$x = 6$ 만', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(x+7)(x-1) = 0 \\Rightarrow x = -7, 1$.' },

  // Q17 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '선행계수 분해 이차방정식', requiredSkills: SKILLS_LEADING,
    stem: '$3x^2 - 5x - 2 = 0$ 의 해는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$(3x + p)(x + q)$ 시도', options: [
        { key: 'A', text: '$3q + p = -5, pq = -2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$p + q = -5, pq = -2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '선행계수 무시' },
        { key: 'C', text: '$p \\cdot q = -5$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'D', text: '$3p + q = -2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'E', text: '분해 불가', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$p=1, q=-2$ → $(3x+1)(x-2)$', options: [
        { key: 'A', text: '검산: $3x^2 - 6x + x - 2 = 3x^2 - 5x - 2$ ✓', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(3x-1)(x+2)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '교차항 잘못' },
        { key: 'C', text: '$(3x-2)(x+1)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '교차항 잘못' },
        { key: 'D', text: '$(3x+2)(x-1)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '교차항 잘못' },
        { key: 'E', text: '$3(x-1)(x+2)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '해?', options: [
        { key: 'A', text: '$x = -\\dfrac{1}{3}$ 또는 $x = 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = \\dfrac{1}{3}, -2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$x = 1, -\\dfrac{2}{3}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x = 2$ 만', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '두 해' },
        { key: 'E', text: '$x = -\\dfrac{1}{3}$ 만', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '두 해' },
      ] },
    ], solution: '$(3x+1)(x-2)=0 \\Rightarrow x = -1/3, 2$.' },

  // Q18 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '중근 (판별식 0)', requiredSkills: SKILLS_FORMULA,
    stem: '$x^2 + 4x + 4 = 0$ 의 해는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '판별식 계산?', options: [
        { key: 'A', text: '$b^2 - 4ac = 16 - 16 = 0$ → 중근', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$16 + 16 = 32$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$-4ac$' },
        { key: 'C', text: '$-16$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '계산 잘못' },
        { key: 'D', text: '$4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$(x+2)^2 = 0$', options: [
        { key: 'A', text: '$x + 2 = 0 \\Rightarrow x = -2$ (중근)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$x = \\pm 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '중근이라 한 값' },
        { key: 'D', text: '해 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '있음' },
        { key: 'E', text: '$x = 4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '해?', options: [
        { key: 'A', text: '$x = -2$ (중근)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$x = \\pm 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '중근' },
        { key: 'D', text: '해 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '있음' },
        { key: 'E', text: '$x = 4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(x+2)^2 = 0 \\Rightarrow x = -2$ 중근. $D = 0$.' },

  // Q19 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '선행계수 분해 (분수 해)', requiredSkills: SKILLS_LEADING,
    stem: '$2x^2 + x - 6 = 0$ 의 해는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$(2x + p)(x + q)$ 형태', options: [
        { key: 'A', text: '$2q + p = 1, pq = -6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$p + q = 1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '선행계수 무시' },
        { key: 'C', text: '$pq = 6$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '곱 음수' },
        { key: 'D', text: '$p \\cdot q = 1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '분해 불가', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$p = -3, q = 2$: $(2x-3)(x+2)$ 검산', options: [
        { key: 'A', text: '$2x^2 + 4x - 3x - 6 = 2x^2 + x - 6$ ✓', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(2x+3)(x-2)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '교차항 잘못' },
        { key: 'C', text: '$(2x-2)(x+3)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '교차항 잘못' },
        { key: 'D', text: '$(2x+1)(x-6)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2(x-2)(x+3)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '해?', options: [
        { key: 'A', text: '$x = \\dfrac{3}{2}$ 또는 $x = -2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = -\\dfrac{3}{2}, 2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$x = 2, 3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x = \\dfrac{3}{2}$ 만', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '두 해' },
        { key: 'E', text: '$x = -2$ 만', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '두 해' },
      ] },
    ], solution: '$(2x-3)(x+2)=0 \\Rightarrow x = 3/2$ 또는 $-2$.' },

  // Q20 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '근의 공식 (무리수 해)', requiredSkills: SKILLS_FORMULA,
    stem: '근의 공식으로 $x^2 - 2x - 1 = 0$ 풀기',
    steps: [
      { stepType: 'CONCEPT', prompt: '$a=1, b=-2, c=-1$. 판별식?', options: [
        { key: 'A', text: '$4 - 4(1)(-1) = 4 + 4 = 8$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4 - 4 = 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-4(-1) = +4$' },
        { key: 'C', text: '$-4 - 4 = -8$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$b^2 = 4$' },
        { key: 'D', text: '$2^2 - 1 = 3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$x = (2 \\pm \\sqrt{8})/2$', options: [
        { key: 'A', text: '$x = (2 \\pm 2\\sqrt{2})/2 = 1 \\pm \\sqrt{2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = (2 \\pm \\sqrt{8})/2$ 그대로', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '간단히 가능' },
        { key: 'C', text: '$x = 2 \\pm 2\\sqrt{2}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '나누기 누락' },
        { key: 'D', text: '$x = 1 \\pm 2\\sqrt{2}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2$ 누락 잘못' },
        { key: 'E', text: '$x = 2 \\pm \\sqrt{8}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '나누기 누락' },
      ] },
      { stepType: 'ANSWER', prompt: '해?', options: [
        { key: 'A', text: '$x = 1 + \\sqrt{2}$ 또는 $x = 1 - \\sqrt{2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 1 \\pm 2\\sqrt{2}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '간단히 잘못' },
        { key: 'C', text: '$x = 2 \\pm \\sqrt{8}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '나누기 누락' },
        { key: 'D', text: '$x = \\pm \\sqrt{2}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$1$ 누락' },
        { key: 'E', text: '실근 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$D=8>0$' },
      ] },
    ], solution: '$x = (2 \\pm \\sqrt{8})/2 = (2 \\pm 2\\sqrt{2})/2 = 1 \\pm \\sqrt{2}$.' },
];

export const K_G9_MATH3_CH02_FACTOR_QUAD_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
