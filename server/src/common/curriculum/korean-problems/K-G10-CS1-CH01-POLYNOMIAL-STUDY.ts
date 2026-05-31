/**
 * K-G10-CS1-CH01-POLYNOMIAL — STUDY pool (single-step, 20문제).
 * 다항식의 연산 — 나머지정리, 인수정리, 조립제법.
 * Mastery 3-step과 별도 변형 문제. 고1 공통수학1 (G10).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5. LLM 미사용.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G10-CS1-CH01-POLYNOMIAL';
const SKILLS_VALUE = ['polynomial_value', 'substitution'];
const SKILLS_DEGREE = ['polynomial_degree', 'leading_term'];
const SKILLS_REM = ['remainder_theorem', 'evaluate_at_root'];
const SKILLS_FACT = ['factor_theorem', 'identify_factor'];
const SKILLS_PARAM = ['unknown_from_factor', 'unknown_from_remainder'];
const SKILLS_SYNTH = ['synthetic_division', 'quotient_polynomial'];
const SKILLS_LIN_REM = ['two_remainders_linear', 'simultaneous_remainder'];
const SKILLS_SUBST = ['function_composition_recover', 'substitution_recover'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) f(x)=2x²-x, f(3)
  { chapterCode: CODE, difficulty: 'easy', concept: '다항식 값 ($2$차)', requiredSkills: SKILLS_VALUE,
    stem: '$f(x) = 2x^2 - x$ 일 때 $f(3)$ 의 값은?',
    options: [
      { key: 'A', text: '$15$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$18$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$-x$ 누락 ($2 \\cdot 9$)' },
      { key: 'C', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$x = 3$ 자체' },
      { key: 'D', text: '$21$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$2 \\cdot 9 + 3$' },
      { key: 'E', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
    ],
    solution: '$f(3) = 2 \\cdot 9 - 3 = 18 - 3 = 15$.' },

  // S2 (쉬움) f(x)=x³+x, f(-1)
  { chapterCode: CODE, difficulty: 'easy', concept: '다항식 값 (음수 대입)', requiredSkills: SKILLS_VALUE,
    stem: '$f(x) = x^3 + x$ 일 때 $f(-1)$ 의 값은?',
    options: [
      { key: 'A', text: '$-2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$(-1)^3 = -1$인데 $+1$로 잘못' },
      { key: 'C', text: '$2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-(-1)^3 - (-1)$ 잘못' },
      { key: 'D', text: '$-1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '한 항만' },
      { key: 'E', text: '$1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '잘못된 식' },
    ],
    solution: '$f(-1) = (-1)^3 + (-1) = -1 - 1 = -2$.' },

  // S3 (쉬움) 차수
  { chapterCode: CODE, difficulty: 'easy', concept: '다항식의 차수', requiredSkills: SKILLS_DEGREE,
    stem: '다항식 $f(x) = 5x^3 - 2x^2 + x + 7$ 의 차수는?',
    options: [
      { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '계수와 혼동' },
      { key: 'C', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '항 수 잘못' },
      { key: 'D', text: '$7$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '상수항' },
      { key: 'E', text: '$4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '항 개수' },
    ],
    solution: '최고차항 $x^3$ → 차수 $= 3$.' },

  // S4 (쉬움) x+2 인수 조건
  { chapterCode: CODE, difficulty: 'easy', concept: '인수정리 (음수 a)', requiredSkills: SKILLS_FACT,
    stem: '$(x + 2)$ 가 $f(x)$ 의 인수가 될 조건은?',
    options: [
      { key: 'A', text: '$f(-2) = 0$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$f(2) = 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못 ($x + 2 = 0 \\to x = -2$)' },
      { key: 'C', text: '$f(0) = 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 식' },
      { key: 'D', text: '$f(-2) = 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '인수정리는 $f(a) = 0$' },
      { key: 'E', text: '$f(2) = -2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 식' },
    ],
    solution: '인수정리: $(x - a)$ 인수 ↔ $f(a) = 0$. $(x + 2) = (x - (-2))$ → $f(-2) = 0$.' },

  // S5 (쉬움) f(x)=x²-5x+6, f(3)
  { chapterCode: CODE, difficulty: 'easy', concept: '인수 확인 (다른 해)', requiredSkills: SKILLS_VALUE,
    stem: '$f(x) = x^2 - 5x + 6$ 일 때 $f(3)$ 은?',
    options: [
      { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$30$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
      { key: 'C', text: '$9$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$-5x$ 누락' },
      { key: 'D', text: '$-6$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '상수항만' },
      { key: 'E', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
    ],
    solution: '$f(3) = 9 - 15 + 6 = 0$. 즉 $(x - 3)$ 이 인수.' },

  // S6 (쉬움) 나머지정리 의미
  { chapterCode: CODE, difficulty: 'easy', concept: '나머지정리 의미', requiredSkills: SKILLS_REM,
    stem: '$f(a)$ 는 어떤 나눗셈의 나머지인가?',
    options: [
      { key: 'A', text: '$f(x) \\div (x - a)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$f(x) \\div x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 나누는 식' },
      { key: 'C', text: '$f(x) \\div a$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$a$는 상수' },
      { key: 'D', text: '$f(x) \\div (x + a)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'E', text: '$f(x) \\div a^2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 식' },
    ],
    solution: '나머지정리: $f(x) \\div (x - a)$ 의 나머지 $= f(a)$.' },

  // S7 (중) f(-1) 나머지
  { chapterCode: CODE, difficulty: 'medium', concept: '나머지 계산 (x+1)', requiredSkills: SKILLS_REM,
    stem: '$f(x) = x^2 + x - 2$ 를 $x + 1$ 로 나눈 나머지는?',
    options: [
      { key: 'A', text: '$-2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 계산' },
      { key: 'C', text: '$2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$f(1)$ 답함' },
      { key: 'D', text: '$-4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
      { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
    ],
    solution: '$f(-1) = 1 - 1 - 2 = -2$.' },

  // S8 (중) x-2 나머지
  { chapterCode: CODE, difficulty: 'medium', concept: '삼차 다항식 나머지 ($x = 2$)', requiredSkills: SKILLS_REM,
    stem: '$f(x) = x^3 - x^2 + 1$ 을 $x - 2$ 로 나눈 나머지?',
    options: [
      { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '상수항만' },
      { key: 'C', text: '$4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 계산' },
      { key: 'D', text: '$13$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$+x^2$ 잘못' },
      { key: 'E', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 합' },
    ],
    solution: '$f(2) = 8 - 4 + 1 = 5$.' },

  // S9 (중) k 미지수
  { chapterCode: CODE, difficulty: 'medium', concept: '인수 조건 → 미지수 ($x - 3$)', requiredSkills: SKILLS_PARAM,
    stem: '$f(x) = x^2 + kx + 3$ 이 $x - 3$ 을 인수로 가지면 $k$ 는?',
    options: [
      { key: 'A', text: '$-4$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$9 + 3k + 3 = 0 \\to k = -4$ 부호 잘못' },
      { key: 'C', text: '$-3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 식' },
      { key: 'D', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 식' },
      { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '나누어떨어짐 조건 누락' },
    ],
    solution: '$f(3) = 9 + 3k + 3 = 0 \\to k = -4$.' },

  // S10 (중) k 미지수 (x+2)
  { chapterCode: CODE, difficulty: 'medium', concept: '인수 조건 → 미지수 ($x + 2$)', requiredSkills: SKILLS_PARAM,
    stem: '$f(x) = x^2 - x + k$ 가 $x + 2$ 를 인수로 가지면 $k$?',
    options: [
      { key: 'A', text: '$-6$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$6$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'C', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x$ 값으로' },
      { key: 'D', text: '$-2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
      { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '인수 조건 미적용' },
    ],
    solution: '$f(-2) = 4 + 2 + k = 6 + k = 0 \\to k = -6$.' },

  // S11 (중) a 미지수
  { chapterCode: CODE, difficulty: 'medium', concept: '삼차 인수 → 미지수', requiredSkills: SKILLS_PARAM,
    stem: '$f(x) = x^3 + x^2 - 4x + a$ 가 $x - 1$ 로 나누어떨어지면 $a$?',
    options: [
      { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$-2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$1 + 1 - 4 + a = 0 \\to a = 2$' },
      { key: 'C', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
      { key: 'D', text: '$4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
      { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
    ],
    solution: '$f(1) = 1 + 1 - 4 + a = -2 + a = 0 \\to a = 2$.' },

  // S12 (중) 조립제법 몫
  { chapterCode: CODE, difficulty: 'medium', concept: '조립제법 (몫)', requiredSkills: SKILLS_SYNTH,
    stem: '$f(x) = x^3 + 2x^2 - x - 2$ 를 $x - 1$ 로 나눈 몫은?',
    options: [
      { key: 'A', text: '$x^2 + 3x + 2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x^2 + 2x - 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '조립제법 계산 잘못' },
      { key: 'C', text: '$x^2 + x - 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 계수' },
      { key: 'D', text: '$x^3 + 3x^2 + 2$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '차수 잘못' },
      { key: 'E', text: '$x^2 + 2x + 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
    ],
    solution: '조립제법: $1 | 1, 2, -1, -2 \\to 1, 3, 2 \\to$ 몫 $x^2 + 3x + 2$.' },

  // S13 (중) 삼차방정식 해
  { chapterCode: CODE, difficulty: 'medium', concept: '삼차방정식 모든 해', requiredSkills: SKILLS_FACT,
    stem: '$x^3 + 2x^2 - x - 2 = 0$ 의 모든 해는?',
    options: [
      { key: 'A', text: '$x = 1, -1, -2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = 1, -1, 2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-2$가 해 (인수 $x + 2$)' },
      { key: 'C', text: '$x = -1, -2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '한 해 누락' },
      { key: 'D', text: '$x = 0, 1, -2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 해' },
      { key: 'E', text: '$x = \\pm 1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$x = -2$ 누락' },
    ],
    solution: '$x^3 + 2x^2 - x - 2 = (x - 1)(x + 1)(x + 2) = 0$.' },

  // S14 (중) 두 조건 일차 나머지
  { chapterCode: CODE, difficulty: 'medium', concept: '두 나머지로 일차 나머지', requiredSkills: SKILLS_LIN_REM,
    stem: '$f(x)$ 를 $x - 1$ 로 나눈 나머지 $3$, $x - 2$ 로 나눈 나머지 $5$. $(x-1)(x-2)$ 로 나눈 나머지?',
    options: [
      { key: 'A', text: '$2x + 1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x + 3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
      { key: 'C', text: '$3x + 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 계산' },
      { key: 'D', text: '$5x + 1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
      { key: 'E', text: '$x - 2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '잘못된 차' },
    ],
    solution: '나머지 $ax + b$. $a + b = 3$, $2a + b = 5$. $a = 2, b = 1$ → $2x + 1$.' },

  // S15 (중) f(x)=x³+x²-2 ÷ x+1
  { chapterCode: CODE, difficulty: 'medium', concept: '나머지 ($f(-1)$ 큰 값)', requiredSkills: SKILLS_REM,
    stem: '$f(x) = x^3 + x^2 - 2$ 를 $x + 1$ 로 나눈 나머지?',
    options: [
      { key: 'A', text: '$-2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$-1 + 1 - 2 = -2$ 잘못' },
      { key: 'C', text: '$2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'D', text: '$-4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 계산' },
      { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
    ],
    solution: '$f(-1) = -1 + 1 - 2 = -2$.' },

  // S16 (어려움) 삼차식 완전 인수분해
  { chapterCode: CODE, difficulty: 'hard', concept: '삼차식 완전 인수분해', requiredSkills: SKILLS_FACT,
    stem: '$f(x) = x^3 + 6x^2 + 11x + 6$ 을 인수분해하면?',
    options: [
      { key: 'A', text: '$(x + 1)(x + 2)(x + 3)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(x - 1)(x - 2)(x - 3)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'C', text: '$(x + 1)(x^2 + 5x + 6)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '2차식 인수분해 누락' },
      { key: 'D', text: '$(x + 6)(x^2 + 1)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 인수' },
      { key: 'E', text: '$x(x + 2)(x + 3)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$f(0) = 6 \\neq 0$' },
    ],
    solution: '$f(-1) = -1 + 6 - 11 + 6 = 0$. $(x + 1)$ 인수. 조립제법 후 $(x + 2)(x + 3)$.' },

  // S17 (어려움) 두 인수 미지수
  { chapterCode: CODE, difficulty: 'hard', concept: '두 인수 → $a, b$', requiredSkills: SKILLS_PARAM,
    stem: '$f(x) = x^3 + ax + b$ 가 $(x + 1)(x - 2)$ 로 나누어떨어지면 $a, b$ 는?',
    options: [
      { key: 'A', text: '$a = -3, b = -2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$a = 3, b = 2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '두 부호 잘못' },
      { key: 'C', text: '$a = -7, b = 6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$(x-1)(x-2)$ 조건과 혼동' },
      { key: 'D', text: '$a = -1, b = -2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 연립' },
      { key: 'E', text: '$a = 0, b = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '조건 부족' },
    ],
    solution: '$f(-1) = -1 - a + b = 0$, $f(2) = 8 + 2a + b = 0$. 풀면 $a = -3, b = -2$.' },

  // S18 (어려움) x⁴+1 ÷ x-1
  { chapterCode: CODE, difficulty: 'hard', concept: '$x^4 + 1$ 나머지', requiredSkills: SKILLS_REM,
    stem: '$f(x) = x^4 + 1$ 을 $x - 1$ 로 나눈 나머지는?',
    options: [
      { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x - 1$ 인수 X' },
      { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '상수항만' },
      { key: 'D', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 계산' },
      { key: 'E', text: '$4$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$1^4 = 1$ 잘못' },
    ],
    solution: '$f(1) = 1 + 1 = 2$.' },

  // S19 (어려움) f(x-2)로 f(x) 복원
  { chapterCode: CODE, difficulty: 'hard', concept: '$f(x - 2)$ 로 $f(x)$ 복원', requiredSkills: SKILLS_SUBST,
    stem: '$f(x - 2) = x^2 - 3x + 5$ 일 때 $f(x) = ?$',
    options: [
      { key: 'A', text: '$x^2 + x + 3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x^2 - 3x + 5$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '치환 없이 그대로' },
      { key: 'C', text: '$x^2 + 3x + 5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '잘못된 식' },
      { key: 'D', text: '$x^2 - x + 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '잘못된 계수' },
      { key: 'E', text: '$(x + 2)^2 - 3$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '전개 안 함' },
    ],
    solution: '$y = x - 2 \\to x = y + 2$. $f(y) = (y+2)^2 - 3(y+2) + 5 = y^2 + 4y + 4 - 3y - 6 + 5 = y^2 + y + 3$. → $f(x) = x^2 + x + 3$.' },

  // S20 (어려움) x^n ÷ x-1
  { chapterCode: CODE, difficulty: 'hard', concept: '$x^n$ 나머지 일반화', requiredSkills: SKILLS_REM,
    stem: '$n$ 이 자연수일 때 $x^n$ 을 $x - 1$ 로 나눈 나머지는?',
    options: [
      { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x - 1$ 인수 아님 ($n \\geq 1$)' },
      { key: 'C', text: '$n$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$f(1) = 1$이지 $n$ 아님' },
      { key: 'D', text: '$x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '상수 나머지' },
      { key: 'E', text: '$-1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '잘못된 부호' },
    ],
    solution: '$f(x) = x^n$. $f(1) = 1^n = 1$ → 나머지 $1$.' },
];

export const K_G10_CS1_CH01_POLYNOMIAL_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
