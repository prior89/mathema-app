/**
 * K-G10-CS1-CH01-POLYNOMIAL (다항식 — 나머지정리·인수정리·조립제법) — 20문제.
 * 고1 공통수학1.
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 * 주요 errorCode 분배:
 *   ALGEBRA_ERROR 6 (Q1,4,7,8,15,18) / ARITHMETIC_ERROR 4 (Q9,10,11,13)
 *   CONCEPT_MISUNDERSTANDING 4 (Q2,3,5,6) / SIGN_ERROR 2 (Q14,17)
 *   FORMULA_SELECTION_ERROR 2 (Q12,16) / CONDITION_MISSING 2 (Q19,20)
 *
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G10-CS1-CH01-POLYNOMIAL';
const SKILLS_VALUE = ['polynomial_value', 'substitution'];
const SKILLS_REM = ['remainder_theorem'];
const SKILLS_FACT = ['factor_theorem'];
const SKILLS_PARAM = ['parameter_from_zero'];
const SKILLS_SYNTH = ['synthetic_division'];
const SKILLS_LIN_REM = ['linear_remainder_two_conditions'];
const SKILLS_SUBST = ['substitution_of_polynomial'];

const problems: KoreanProblemSeed[] = [
  // Q1
  { chapterCode: CODE, difficulty: 'easy', concept: '다항식 값', requiredSkills: SKILLS_VALUE,
    stem: '$f(x) = x^2 + 3x - 4$ 일 때 $f(2)$ 의 값은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$f(2)$ 의 의미', options: [
        { key: 'A', text: '$x$ 자리에 $2$ 대입', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x$ 를 $2$ 로 곱함', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '대입 아님' },
        { key: 'C', text: '$f$ 와 $2$ 의 곱', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '잘못' },
        { key: 'D', text: '$f$ 의 두 번째 항', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$f$ 의 기울기', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$2^2 + 3 \\cdot 2 - 4$', options: [
        { key: 'A', text: '$4 + 6 - 4 = 6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4 + 6 + 4 = 14$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '부호 잘못' },
        { key: 'C', text: '$2 + 3 - 4 = 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '제곱 누락' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$f(2) = ?$', options: [
        { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$14$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '부호 잘못' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '제곱 누락' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$f(2) = 4 + 6 - 4 = 6$.' },

  // Q2
  { chapterCode: CODE, difficulty: 'easy', concept: '나머지정리', requiredSkills: SKILLS_REM,
    stem: '다항식 $f(x)$ 를 $x - a$ 로 나눈 나머지는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '나머지정리 핵심?', options: [
        { key: 'A', text: '나머지 = $f(a)$ ($x - a$ 의 영점에서 함숫값)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '나머지 = $f(-a)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부호 잘못' },
        { key: 'C', text: '나머지 = $f(0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '나머지 = $a$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '나머지 = $1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '왜 $a$ 인가?', options: [
        { key: 'A', text: '$x - a = 0$ 의 해가 $x = a$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = -a$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부호' },
        { key: 'C', text: '$x = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$x = 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$x = $ 어떤 값이든', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '특정' },
      ] },
      { stepType: 'ANSWER', prompt: '나머지?', options: [
        { key: 'A', text: '$f(a)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$f(-a)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부호' },
        { key: 'C', text: '$f(0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$a$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '나누어떨어진 경우' },
      ] },
    ], solution: '$x - a$ 로 나눈 나머지 = $f(a)$.' },

  // Q3
  { chapterCode: CODE, difficulty: 'easy', concept: '인수정리', requiredSkills: SKILLS_FACT,
    stem: '$f(a) = 0$ 이면 무엇이 $f(x)$ 의 인수인가?',
    steps: [
      { stepType: 'CONCEPT', prompt: '인수정리?', options: [
        { key: 'A', text: '$f(a) = 0 \\Leftrightarrow (x - a)$ 가 $f(x)$ 의 인수', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$f(a) = 0 \\Leftrightarrow (x + a)$ 가 인수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부호' },
        { key: 'C', text: '$f(a) = 0 \\Leftrightarrow a$ 가 인수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '상수' },
        { key: 'D', text: '$f(a) = 0 \\Leftrightarrow f(x) = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '한 점만' },
        { key: 'E', text: '관계 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '관계 있음' },
      ] },
      { stepType: 'PROCESS', prompt: '왜?', options: [
        { key: 'A', text: '나머지정리로 나머지 = $f(a) = 0$ → 나누어떨어짐', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$f(a)$ 와 인수가 무관', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '관계 있음' },
        { key: 'C', text: '$a$ 가 작아야 인수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '모든 다항식의 인수는 $x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
      { stepType: 'ANSWER', prompt: '인수?', options: [
        { key: 'A', text: '$x - a$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x + a$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부호' },
        { key: 'C', text: '$a$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '상수' },
        { key: 'D', text: '$x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '인수정리: $f(a) = 0 \\Leftrightarrow (x - a)$ 가 인수.' },

  // Q4
  { chapterCode: CODE, difficulty: 'easy', concept: '$f(2) = 0$ 확인', requiredSkills: SKILLS_VALUE,
    stem: '$f(x) = x^2 - 5x + 6$ 일 때 $f(2)$ 는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$x = 2$ 대입', options: [
        { key: 'A', text: '$4 - 10 + 6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2 - 5 + 6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '제곱 누락' },
        { key: 'C', text: '$4 + 10 + 6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '부호' },
        { key: 'D', text: '$2^2 - 5 \\cdot 2$ 만 ($+6$ 누락)', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '상수 누락' },
        { key: 'E', text: '$0$ (단정)', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '계산 필요' },
      ] },
      { stepType: 'PROCESS', prompt: '계산', options: [
        { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$20$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '부호' },
        { key: 'C', text: '$-6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$f(2)$?', options: [
        { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$20$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '부호 잘못' },
        { key: 'C', text: '$6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$-6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$f(2) = 4 - 10 + 6 = 0$ → $(x-2)$ 가 인수.' },

  // Q5
  { chapterCode: CODE, difficulty: 'easy', concept: '$x^3 - 1$ 에 $x=1$', requiredSkills: SKILLS_VALUE,
    stem: '$f(x) = x^3 - 1$ 일 때 $f(1)$ 은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$1^3 - 1$', options: [
        { key: 'A', text: '$1 - 1 = 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3 - 1 = 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$1^3 = 1$' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$-1$ 무시' },
        { key: 'D', text: '$-1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$1^3$ 무시' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$f(1) = 0$ 의미?', options: [
        { key: 'A', text: '$x = 1$ 이 영점, $(x - 1)$ 이 인수', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(x + 1)$ 이 인수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부호' },
        { key: 'C', text: '$f(x) = 0$ 모든 $x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '한 점만' },
        { key: 'D', text: '$f$ 가 상수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '관계 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '관계 있음' },
      ] },
      { stepType: 'ANSWER', prompt: '$f(1) = ?$', options: [
        { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$-1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$f(1) = 1 - 1 = 0$.' },

  // Q6
  { chapterCode: CODE, difficulty: 'easy', concept: '$x - 3$ 으로 나눈 나머지', requiredSkills: SKILLS_REM,
    stem: '$f(x)$ 를 $x - 3$ 으로 나눈 나머지는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '나머지정리: $x - a$ → $f(a)$', options: [
        { key: 'A', text: '$f(3)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$f(-3)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부호' },
        { key: 'C', text: '$f(0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$f(1)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '왜 $f(3)$?', options: [
        { key: 'A', text: '$x - 3 = 0 \\Rightarrow x = 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = -3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부호' },
        { key: 'C', text: '계수가 $3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '상수가 $3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '근거 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 있음' },
      ] },
      { stepType: 'ANSWER', prompt: '나머지?', options: [
        { key: 'A', text: '$f(3)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$f(-3)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부호' },
        { key: 'C', text: '$f(0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$3 f(0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$f(1)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$x - 3$ 의 영점 $x = 3$ → 나머지 $= f(3)$.' },

  // Q7
  { chapterCode: CODE, difficulty: 'medium', concept: '나머지 계산 (구체)', requiredSkills: SKILLS_REM,
    stem: '$f(x) = x^2 + 2x - 3$ 을 $x - 1$ 로 나눈 나머지?',
    steps: [
      { stepType: 'CONCEPT', prompt: '나머지정리 적용', options: [
        { key: 'A', text: '$f(1) = ?$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$f(-1) = ?$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '부호' },
        { key: 'C', text: '$f(0) = ?$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$f(2) = ?$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '직접 나누기', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '맞지만 비효율' },
      ] },
      { stepType: 'PROCESS', prompt: '$1 + 2 - 3$', options: [
        { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$-4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '나머지?', options: [
        { key: 'A', text: '$0$ (나누어떨어짐, $(x-1)$ 이 인수)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$-4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$f(1) = 1 + 2 - 3 = 0$. 나머지 $0$.' },

  // Q8
  { chapterCode: CODE, difficulty: 'medium', concept: '삼차 다항식 나머지', requiredSkills: SKILLS_REM,
    stem: '$f(x) = x^3 + 2x - 5$ 를 $x - 2$ 로 나눈 나머지?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$f(2)$', options: [
        { key: 'A', text: '$2^3 + 2 \\cdot 2 - 5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2 + 2 - 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '세제곱 누락' },
        { key: 'C', text: '$2^3 + 2 - 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '계수 잘못' },
        { key: 'D', text: '$f(-2)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '부호' },
        { key: 'E', text: '직접 나눗셈', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '비효율' },
      ] },
      { stepType: 'PROCESS', prompt: '$8 + 4 - 5$', options: [
        { key: 'A', text: '$7$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$4$ 누락' },
        { key: 'C', text: '$17$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$+5$' },
        { key: 'D', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '나머지?', options: [
        { key: 'A', text: '$7$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$4$ 누락' },
        { key: 'C', text: '$17$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '부호 잘못' },
        { key: 'D', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$f(2) = 8 + 4 - 5 = 7$.' },

  // Q9
  { chapterCode: CODE, difficulty: 'medium', concept: '나누어떨어짐 → 미지수 (x-2)', requiredSkills: SKILLS_PARAM,
    stem: '$f(x) = x^2 + ax + 6$ 이 $x - 2$ 로 나누어떨어질 때 $a$ 는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '나누어떨어진다 = ?', options: [
        { key: 'A', text: '$f(2) = 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$f(2) = 1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$f(-2) = 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'D', text: '$f(0) = 0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '결정 불가', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$4 + 2a + 6 = 0$', options: [
        { key: 'A', text: '$2a = -10 \\Rightarrow a = -5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2a = 10 \\Rightarrow a = 5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '이항' },
        { key: 'C', text: '$a = 10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 누락' },
        { key: 'D', text: '$a = -10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 누락' },
        { key: 'E', text: '$a = 0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$a$?', options: [
        { key: 'A', text: '$-5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 누락' },
        { key: 'D', text: '$-10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$f(2) = 4 + 2a + 6 = 0 \\Rightarrow a = -5$.' },

  // Q10
  { chapterCode: CODE, difficulty: 'medium', concept: '나누어떨어짐 → 미지수 (x+1)', requiredSkills: SKILLS_PARAM,
    stem: '$f(x) = x^2 + ax - 4$ 가 $x + 1$ 로 나누어떨어지면 $a$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$x + 1$ 의 영점은?', options: [
        { key: 'A', text: '$x = -1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$x = 0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x = -a$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x = -4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$f(-1) = 1 - a - 4 = 0$', options: [
        { key: 'A', text: '$-a = 3 \\Rightarrow a = -3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a = 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$a = -5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$a = 5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$a = 0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$a$?', options: [
        { key: 'A', text: '$-3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$-5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$f(-1) = 1 - a - 4 = 0 \\Rightarrow a = -3$.' },

  // Q11
  { chapterCode: CODE, difficulty: 'medium', concept: '인수 조건 미지수', requiredSkills: SKILLS_PARAM,
    stem: '$f(x) = x^2 - 3x + k$ 가 $x - 1$ 을 인수로 가지면 $k$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$f(1) = 0$', options: [
        { key: 'A', text: '$1 - 3 + k = 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1 + 3 + k = 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$k = 0$ 단정', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 필요' },
        { key: 'D', text: '$f(-1) = 0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '부호' },
        { key: 'E', text: '$f(3) = 0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$k = ?$', options: [
        { key: 'A', text: '$k = 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$k = -2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$k = 3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$k = -3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$k = 0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$k$?', options: [
        { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$-3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$1 - 3 + k = 0 \\Rightarrow k = 2$.' },

  // Q12
  { chapterCode: CODE, difficulty: 'medium', concept: '조립제법', requiredSkills: SKILLS_SYNTH,
    stem: '$f(x) = x^3 - 7x + 6$ 을 $x - 1$ 로 나눈 몫?',
    steps: [
      { stepType: 'CONCEPT', prompt: '조립제법 계수: $1, 0, -7, 6$ ($x^2$ 누락 0)', options: [
        { key: 'A', text: '계수 모두 (빠진 차수 0 포함)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1, -7, 6$ (0 무시)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '0 무시 안 됨' },
        { key: 'C', text: '$1, 7, 6$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '부호' },
        { key: 'D', text: '$0, -7, 6$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$x^3$ 무시' },
        { key: 'E', text: '$1, -7$ 만', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$1 | 1, 0, -7, 6$ → 내림·곱·더하기', options: [
        { key: 'A', text: '$1, 1, -6, 0$ (몫 $x^2 + x - 6$, 나머지 0)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1, -1, -6, 0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '부호 잘못' },
        { key: 'C', text: '$1, 1, -8, 12$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '계산 잘못' },
        { key: 'D', text: '$x - 7$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x^2 - 7x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '몫?', options: [
        { key: 'A', text: '$x^2 + x - 6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^2 - x - 6$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '부호' },
        { key: 'C', text: '$x^2 + x + 6$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '부호' },
        { key: 'D', text: '$x - 7$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x^3 - 7x + 6$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '나누기 안 함' },
      ] },
    ], solution: '조립제법: $1, 1, -6$ → 몫 $= x^2 + x - 6$, 나머지 $0$.' },

  // Q13
  { chapterCode: CODE, difficulty: 'medium', concept: '삼차방정식 인수분해 (3해)', requiredSkills: SKILLS_FACT,
    stem: '$x^3 - 7x + 6 = 0$ 의 모든 해는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '인수분해 시도: $f(1) = 0$', options: [
        { key: 'A', text: '$(x - 1)(x^2 + x - 6) = 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(x + 1)(x^2 - x - 6) = 0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '부호' },
        { key: 'C', text: '$(x - 6)(x^2 + 1) = 0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '인수분해 불가', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '가능' },
        { key: 'E', text: '$(x - 1)(x^2 + 7x + 6)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$x^2 + x - 6 = (x + 3)(x - 2)$', options: [
        { key: 'A', text: '$(x - 1)(x + 3)(x - 2) = 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(x - 1)(x - 3)(x + 2) = 0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '부호' },
        { key: 'C', text: '$(x - 1)^3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(x - 1)(x^2 + 1)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '인수분해 불가', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'ANSWER', prompt: '해?', options: [
        { key: 'A', text: '$x = 1, -3, 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = -1, 3, -2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '부호' },
        { key: 'C', text: '$x = 1$ 만', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '두 해' },
        { key: 'D', text: '$x = 1, 2, 3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x = 6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(x-1)(x+3)(x-2) = 0 \\Rightarrow x = 1, -3, 2$.' },

  // Q14
  { chapterCode: CODE, difficulty: 'medium', concept: '두 조건 일차 나머지', requiredSkills: SKILLS_LIN_REM,
    stem: '$f(x)$ 를 $x - 2$ 로 나눈 나머지 $5$, $x - 3$ 으로 나눈 나머지 $7$. $(x-2)(x-3)$ 으로 나눈 나머지?',
    steps: [
      { stepType: 'CONCEPT', prompt: '나머지의 형태?', options: [
        { key: 'A', text: '일차식 $ax + b$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '상수', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '나누는 식이 이차' },
        { key: 'C', text: '이차식', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '나머지는 더 낮은 차수' },
        { key: 'D', text: '삼차식', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$f(2) = 2a + b = 5$, $f(3) = 3a + b = 7$', options: [
        { key: 'A', text: '$a = 2, b = 1$ → 나머지 $2x + 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a = 1, b = 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '식 풀이 잘못' },
        { key: 'C', text: '$a = 3, b = -1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '식 풀이 잘못' },
        { key: 'D', text: '나머지 $5$ 또는 $7$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '두 값' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'ANSWER', prompt: '나머지?', options: [
        { key: 'A', text: '$2x + 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x + 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$3x - 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '한 값만' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$2a+b=5, 3a+b=7 \\Rightarrow a=2, b=1$. 나머지 $= 2x + 1$.' },

  // Q15
  { chapterCode: CODE, difficulty: 'medium', concept: '$x + 1$ 로 나눈 나머지', requiredSkills: SKILLS_REM,
    stem: '$f(x) = x^3 - x^2 + 2x - 3$ 을 $x + 1$ 로 나눈 나머지?',
    steps: [
      { stepType: 'CONCEPT', prompt: '영점?', options: [
        { key: 'A', text: '$x = -1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '부호' },
        { key: 'C', text: '$x = 0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x = -3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '결정 불가', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$f(-1) = -1 - 1 - 2 - 3$', options: [
        { key: 'A', text: '$-7$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '부호' },
        { key: 'D', text: '$-3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$-5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '계산 잘못' },
      ] },
      { stepType: 'ANSWER', prompt: '나머지?', options: [
        { key: 'A', text: '$-7$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$7$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '부호' },
        { key: 'C', text: '$-5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$-1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$-3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$f(-1) = -1 - 1 - 2 - 3 = -7$.' },

  // Q16 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '삼차식 완전 인수분해', requiredSkills: SKILLS_FACT,
    stem: '$f(x) = x^3 - 6x^2 + 11x - 6$ 를 인수분해.',
    steps: [
      { stepType: 'CONCEPT', prompt: '$f(1)$ 검산', options: [
        { key: 'A', text: '$1 - 6 + 11 - 6 = 0 \\Rightarrow (x-1)$ 인수', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$f(1) \\neq 0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$0$' },
        { key: 'C', text: '$f(2) = 0$ 만', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '셋 모두 영점' },
        { key: 'D', text: '$f(-1)$ 영점', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '부호' },
        { key: 'E', text: '인수분해 불가', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '조립제법 → 몫 $x^2 - 5x + 6 = (x-2)(x-3)$', options: [
        { key: 'A', text: '$(x-1)(x-2)(x-3)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(x-1)(x+2)(x+3)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '부호' },
        { key: 'C', text: '$(x-1)^3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(x-1)(x^2 - 5x + 6)$ 그대로', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '이차 인수분해 가능' },
        { key: 'E', text: '$(x-6)(x^2+1)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '인수분해?', options: [
        { key: 'A', text: '$(x-1)(x-2)(x-3)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(x+1)(x+2)(x+3)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '부호' },
        { key: 'C', text: '$(x-6)^3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(x-1)(x^2 - 5x + 6)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '추가 분해 가능' },
        { key: 'E', text: '인수분해 불가', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '가능' },
      ] },
    ], solution: '$(x-1)(x-2)(x-3)$. 검산: $1+2+3=6$, $1\\cdot2 + 2\\cdot3 + 1\\cdot3 = 11$ ✓.' },

  // Q17 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '두 인수로부터 미지수', requiredSkills: SKILLS_PARAM,
    stem: '$f(x) = x^3 + ax + b$ 가 $(x-1)(x-2)$ 로 나누어떨어지면 $a, b$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$f(1) = 0$, $f(2) = 0$', options: [
        { key: 'A', text: '$1 + a + b = 0$, $8 + 2a + b = 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1 + a + b = 0$ 만', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$f(2)$도' },
        { key: 'C', text: '$f(0) = 0, f(-1) = 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$a + b = 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '상수 누락' },
        { key: 'E', text: '조건 부족', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '충분' },
      ] },
      { stepType: 'PROCESS', prompt: '두 식 빼기: $7 + a = 0 \\Rightarrow a = -7$, $b = 6$', options: [
        { key: 'A', text: '$a = -7, b = 6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a = 7, b = -6$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$a = 1, b = 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$a = 0, b = 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$a = -3, b = 4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$(a, b)$?', options: [
        { key: 'A', text: '$(-7, 6)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(7, -6)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$(6, -7)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '바뀜' },
        { key: 'D', text: '$(1, 2)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(0, 0)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$f(1)=0, f(2)=0$ 연립 → $a=-7, b=6$.' },

  // Q18 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '$x + 2$ 로 나눈 나머지', requiredSkills: SKILLS_REM,
    stem: '$f(x) = x^3 - 2x + 1$ 을 $x + 2$ 로 나눈 나머지?',
    steps: [
      { stepType: 'CONCEPT', prompt: '영점?', options: [
        { key: 'A', text: '$x = -2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '부호' },
        { key: 'C', text: '$x = 0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x = -1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x = 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$f(-2) = -8 + 4 + 1$', options: [
        { key: 'A', text: '$-3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '부호' },
        { key: 'C', text: '$5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$-5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '나머지?', options: [
        { key: 'A', text: '$-3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '부호' },
        { key: 'C', text: '$5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$-5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$f(-2) = -8 + 4 + 1 = -3$.' },

  // Q19 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '$x^{2n} + 1$ 일반화', requiredSkills: SKILLS_REM,
    stem: '$n$ 이 자연수일 때 $x^{2n} + 1$ 을 $x - 1$ 로 나눈 나머지?',
    steps: [
      { stepType: 'CONCEPT', prompt: '나머지정리: $f(1)$', options: [
        { key: 'A', text: '$1^{2n} + 1 = 1 + 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2n + 1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$1^{2n} = 1$ ($n$ 무관)' },
        { key: 'C', text: '$2n$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'D', text: '판별 불가 ($n$ 미정)', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$1^{anything} = 1$' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$1 + 1 = ?$', options: [
        { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2n + 1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$1^{2n} = 1$' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'E', text: '$n$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '나머지?', options: [
        { key: 'A', text: '$2$ ($n$ 에 무관)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2n$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'C', text: '$2n + 1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'D', text: '$n$ 의 함수', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '상수 $2$' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
    ], solution: '$f(1) = 1^{2n} + 1 = 2$ ($n$ 자연수 무관).' },

  // Q20 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '$f(x+1)$ 으로 $f(x)$ 복원', requiredSkills: SKILLS_SUBST,
    stem: '$f(x + 1) = x^2 + 3x + 5$ 일 때 $f(x) = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '치환 변수', options: [
        { key: 'A', text: '$x + 1 = t \\Rightarrow x = t - 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x + 1 = t \\Rightarrow x = t + 1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '부호' },
        { key: 'C', text: '$f(x)$ 그대로 $= x^2 + 3x + 5$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '치환 필요' },
        { key: 'D', text: '$f(x) = f(x+1) - 1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '함수와 값 혼동' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$f(t) = (t-1)^2 + 3(t-1) + 5 = t^2 - 2t + 1 + 3t - 3 + 5$', options: [
        { key: 'A', text: '$f(t) = t^2 + t + 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$f(t) = t^2 + 3t + 5$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '치환 안 함' },
        { key: 'C', text: '$f(t) = t^2 - t + 3$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '부호' },
        { key: 'D', text: '$f(t) = t^2 + 2t + 4$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'E', text: '$f(t) = t + 1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$f(x) = ?$', options: [
        { key: 'A', text: '$x^2 + x + 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^2 + 3x + 5$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '치환 안 함' },
        { key: 'C', text: '$x^2 - x + 3$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '부호' },
        { key: 'D', text: '$x + 1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'E', text: '$x^2 + 2x + 4$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
    ], solution: '$x \\to t-1$ 치환: $f(t) = (t-1)^2 + 3(t-1) + 5 = t^2 + t + 3$. 따라서 $f(x) = x^2 + x + 3$.' },
];

export const K_G10_CS1_CH01_POLYNOMIAL_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
