/**
 * K-G10-CS2-CH03-FUNCTION-GRAPH — STUDY pool (single-step, 20문제).
 * 함수와 그래프 — 함수 정의, 합성, 역함수, 유리·무리함수.
 * Mastery 3-step과 별도 변형 문제. 고1 공통수학2 (G10).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5. LLM 미사용.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G10-CS2-CH03-FUNCTION-GRAPH';
const SKILLS_FN = ['function_value', 'substitution'];
const SKILLS_DOMAIN = ['domain_constraint', 'rational_domain', 'sqrt_domain'];
const SKILLS_COMP = ['function_composition', 'fog_evaluation'];
const SKILLS_INV = ['inverse_function', 'inverse_composition'];
const SKILLS_INV_COND = ['one_to_one_condition', 'invertibility'];
const SKILLS_ASYMPTOTE = ['rational_asymptote', 'vertical_horizontal_asymptote'];
const SKILLS_IRRATIONAL = ['irrational_function_domain', 'irrational_range'];
const SKILLS_RATIONAL = ['rational_line_intersection'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) 함숫값 (2차)
  { chapterCode: CODE, difficulty: 'easy', concept: '함숫값 (2차)', requiredSkills: SKILLS_FN,
    stem: '$f(x) = x^2 + 1$ 일 때 $f(2)$?',
    options: [
      { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$4$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$+1$ 누락' },
      { key: 'C', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$2 + 1$ 일차로' },
      { key: 'D', text: '$9$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$(2+1)^2$' },
      { key: 'E', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x$ 값' },
    ],
    solution: '$f(2) = 2^2 + 1 = 5$.' },

  // S2 (쉬움) 함숫값 (1차)
  { chapterCode: CODE, difficulty: 'easy', concept: '함숫값 ($x = 0$)', requiredSkills: SKILLS_FN,
    stem: '$f(x) = 3x - 1$, $f(0)$?',
    options: [
      { key: 'A', text: '$-1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$-1$ 누락' },
      { key: 'C', text: '$1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-1$ 부호 잘못' },
      { key: 'D', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '기울기' },
      { key: 'E', text: '$-3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
    ],
    solution: '$f(0) = 3 \\cdot 0 - 1 = -1$.' },

  // S3 (쉬움) (g∘f)(1)
  { chapterCode: CODE, difficulty: 'easy', concept: '합성함수 값', requiredSkills: SKILLS_COMP,
    stem: '$f(x) = x + 1$, $g(x) = 2x$. $(g \\circ f)(1)$?',
    options: [
      { key: 'A', text: '$4$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$f$만' },
      { key: 'C', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$g$만' },
      { key: 'D', text: '$6$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$(f \\circ g)(1) = f(2) = 3$' },
      { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x$ 자체' },
    ],
    solution: '$(g \\circ f)(1) = g(f(1)) = g(2) = 4$.' },

  // S4 (쉬움) 역함수 기본
  { chapterCode: CODE, difficulty: 'easy', concept: '역함수 ($x - 5$)', requiredSkills: SKILLS_INV,
    stem: '$f(x) = x - 5$ 의 역함수?',
    options: [
      { key: 'A', text: '$f^{-1}(x) = x + 5$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$f^{-1}(x) = x - 5$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '원함수 그대로' },
      { key: 'C', text: '$f^{-1}(x) = 5 - x$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'D', text: '$f^{-1}(x) = 1/(x - 5)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '역수와 혼동' },
      { key: 'E', text: '$f^{-1}(x) = -x + 5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '잘못된 식' },
    ],
    solution: '$y = x - 5 \\to x = y + 5$. $f^{-1}(x) = x + 5$.' },

  // S5 (쉬움) 1/(x-3) 정의역
  { chapterCode: CODE, difficulty: 'easy', concept: '유리함수 정의역', requiredSkills: SKILLS_DOMAIN,
    stem: '$y = \\dfrac{1}{x - 3}$ 의 정의역?',
    options: [
      { key: 'A', text: '$x \\neq 3$ 인 모든 실수', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x \\neq 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '분모 위치 잘못' },
      { key: 'C', text: '$x \\geq 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '무리함수 조건' },
      { key: 'D', text: '모든 실수', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '분모 $0$ 가능성 무시' },
      { key: 'E', text: '$x = 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '제외 점만' },
    ],
    solution: '분모 $\\neq 0$: $x - 3 \\neq 0 \\to x \\neq 3$.' },

  // S6 (쉬움) √(x-1) 정의역
  { chapterCode: CODE, difficulty: 'easy', concept: '무리함수 정의역', requiredSkills: SKILLS_DOMAIN,
    stem: '$y = \\sqrt{x - 1}$ 의 정의역?',
    options: [
      { key: 'A', text: '$x \\geq 1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x \\geq 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sqrt{x}$ 조건' },
      { key: 'C', text: '$x > 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x = 1$ 포함 ($\\sqrt{0} = 0$)' },
      { key: 'D', text: '$x \\leq 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부등호 잘못' },
      { key: 'E', text: '모든 실수', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근호 안 음수 불가' },
    ],
    solution: '근호 안 $\\geq 0$: $x - 1 \\geq 0 \\to x \\geq 1$.' },

  // S7 (중) (f∘g)(x)
  { chapterCode: CODE, difficulty: 'medium', concept: '합성함수 식', requiredSkills: SKILLS_COMP,
    stem: '$f(x) = x + 1$, $g(x) = 2x$. $(f \\circ g)(x)$?',
    options: [
      { key: 'A', text: '$2x + 1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$2(x + 1) = 2x + 2$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$(g \\circ f)$' },
      { key: 'C', text: '$2x$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$+1$ 누락' },
      { key: 'D', text: '$x + 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
      { key: 'E', text: '$2x^2 + 1$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '제곱 잘못' },
    ],
    solution: '$(f \\circ g)(x) = f(g(x)) = f(2x) = 2x + 1$.' },

  // S8 (중) 1차 역함수
  { chapterCode: CODE, difficulty: 'medium', concept: '$2x + 4$ 역함수', requiredSkills: SKILLS_INV,
    stem: '$f(x) = 2x + 4$ 의 역함수?',
    options: [
      { key: 'A', text: '$f^{-1}(x) = \\dfrac{x - 4}{2}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$f^{-1}(x) = \\dfrac{x + 4}{2}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-4$ 이항 부호 잘못' },
      { key: 'C', text: '$f^{-1}(x) = 2x - 4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 식' },
      { key: 'D', text: '$f^{-1}(x) = \\dfrac{1}{2x + 4}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '역수' },
      { key: 'E', text: '$f^{-1}(x) = x - 4$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$2$ 나눗셈 누락' },
    ],
    solution: '$y = 2x + 4 \\to x = (y - 4)/2$. $f^{-1}(x) = (x - 4)/2$.' },

  // S9 (중) f⁻¹(10)
  { chapterCode: CODE, difficulty: 'medium', concept: '역함수 값', requiredSkills: SKILLS_INV,
    stem: '$f(x) = 2x$ 일 때 $f^{-1}(10)$?',
    options: [
      { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$20$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$f(10) = 20$ 답함' },
      { key: 'C', text: '$10$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x$ 자체' },
      { key: 'D', text: '$\\dfrac{1}{20}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '역수' },
      { key: 'E', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$2x = 10 \\to x = 5$.' },

  // S10 (중) (f∘f)(x)
  { chapterCode: CODE, difficulty: 'medium', concept: '자기 합성', requiredSkills: SKILLS_COMP,
    stem: '$f(x) = x + 1$. $(f \\circ f)(x)$?',
    options: [
      { key: 'A', text: '$x + 2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x + 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$f$만' },
      { key: 'C', text: '$(x + 1)^2$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '제곱 잘못' },
      { key: 'D', text: '$2x + 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
      { key: 'E', text: '$2x + 1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
    ],
    solution: '$f(f(x)) = f(x + 1) = (x + 1) + 1 = x + 2$.' },

  // S11 (중) 유리함수 점근선
  { chapterCode: CODE, difficulty: 'medium', concept: '점근선 (이동)', requiredSkills: SKILLS_ASYMPTOTE,
    stem: '$y = \\dfrac{3}{x + 1} - 2$ 의 점근선?',
    options: [
      { key: 'A', text: '$x = -1, y = -2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = 1, y = 2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '두 부호 잘못' },
      { key: 'C', text: '$x = -1, y = 2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$y$ 부호 잘못' },
      { key: 'D', text: '$x = 0, y = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$y = 3/x$ 점근선' },
      { key: 'E', text: '$x = 3, y = -2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '분자 잘못' },
    ],
    solution: '$x + 1 = 0 \\to x = -1$ (수직). $y = -2$ (수평).' },

  // S12 (중) 무리함수 정의역/치역
  { chapterCode: CODE, difficulty: 'medium', concept: '무리함수 정의역·치역', requiredSkills: SKILLS_IRRATIONAL,
    stem: '$y = \\sqrt{x + 1}$ 의 정의역과 치역?',
    options: [
      { key: 'A', text: '정의역 $x \\geq -1$, 치역 $y \\geq 0$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '정의역 $x \\geq 0$, 치역 $y \\geq 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '이동 무시' },
      { key: 'C', text: '정의역 $x \\geq 1$, 치역 $y \\geq 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-1$ 부호 잘못' },
      { key: 'D', text: '정의역 $x \\geq -1$, 치역 $y \\geq -1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '치역 잘못' },
      { key: 'E', text: '정의역 모든 실수', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근호 안 $\\geq 0$' },
    ],
    solution: '근호 안 $\\geq 0$: $x \\geq -1$. 결과는 $\\geq 0$.' },

  // S13 (중) 일대일함수 정의
  { chapterCode: CODE, difficulty: 'medium', concept: '역함수 존재 조건', requiredSkills: SKILLS_INV_COND,
    stem: '함수가 역함수를 가지려면?',
    options: [
      { key: 'A', text: '일대일대응 (일대일이면서 위로의 함수)', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '연속함수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '필요조건 아님' },
      { key: 'C', text: '미분가능', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '관련 없음' },
      { key: 'D', text: '치역이 정의역과 같음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '필요조건 아님' },
      { key: 'E', text: '항상 가능', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '조건 있음' },
    ],
    solution: '일대일대응 → 역함수 존재.' },

  // S14 (중) f∘f⁻¹(x)
  { chapterCode: CODE, difficulty: 'medium', concept: '$f \\circ f^{-1}(x)$', requiredSkills: SKILLS_INV,
    stem: '$f$ 가 역함수를 가지면 $f(f^{-1}(x)) = ?$ (치역 내)',
    options: [
      { key: 'A', text: '$x$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$f(x)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$f$ 자체' },
      { key: 'C', text: '$f^{-1}(x)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '역만' },
      { key: 'D', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '역함수 정의: $f \\circ f^{-1} = $ 항등함수 $\\to x$.' },

  // S15 (중) y=-1/x 점근선
  { chapterCode: CODE, difficulty: 'medium', concept: '$y = -1/x$ 점근선', requiredSkills: SKILLS_ASYMPTOTE,
    stem: '$y = -\\dfrac{1}{x}$ 의 점근선?',
    options: [
      { key: 'A', text: '$x = 0, y = 0$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = -1, y = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '음수 분자와 혼동' },
      { key: 'C', text: '$x = 0, y = -1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$x = 1, y = -1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '점근선 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '존재' },
    ],
    solution: '분모 $x = 0$, 분자 상수 → 수평 $y = 0$.' },

  // S16 (어려움) 연립 a, b
  { chapterCode: CODE, difficulty: 'hard', concept: '연립으로 $a, b$ 찾기', requiredSkills: SKILLS_FN,
    stem: '$f(x) = ax + b$. $f(0) = 1, f(2) = 5$. $a, b$?',
    options: [
      { key: 'A', text: '$a = 2, b = 1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$a = 1, b = 2$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '바꿈' },
      { key: 'C', text: '$a = 3, b = 1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 풀이' },
      { key: 'D', text: '$a = 2, b = -1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'E', text: '$a = 5, b = 0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
    ],
    solution: '$f(0) = b = 1$. $f(2) = 2a + 1 = 5 \\to a = 2$.' },

  // S17 (어려움) f 역으로 찾기
  { chapterCode: CODE, difficulty: 'hard', concept: '$(f \\circ g)$ 와 $g$ 로 $f$', requiredSkills: SKILLS_COMP,
    stem: '$(f \\circ g)(x) = 3x + 2$, $g(x) = x - 1$. $f(x)$?',
    options: [
      { key: 'A', text: '$f(x) = 3x + 5$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$f(x) = 3x + 2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$g$의 변환 무시' },
      { key: 'C', text: '$f(x) = 3x - 1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
      { key: 'D', text: '$f(x) = 3x + 3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
      { key: 'E', text: '$f(x) = x + 5$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '기울기 잘못' },
    ],
    solution: '$f(g(x)) = f(x - 1) = 3x + 2$. $t = x - 1$로 치환: $f(t) = 3(t + 1) + 2 = 3t + 5$.' },

  // S18 (어려움) 유리함수 역함수
  { chapterCode: CODE, difficulty: 'hard', concept: '$\\dfrac{2x + 1}{x}$ 역함수', requiredSkills: SKILLS_INV,
    stem: '$f(x) = \\dfrac{2x + 1}{x}$ ($x \\neq 0$). $f^{-1}(x)$?',
    options: [
      { key: 'A', text: '$f^{-1}(x) = \\dfrac{1}{x - 2}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$f^{-1}(x) = \\dfrac{x}{2x + 1}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '역수와 혼동' },
      { key: 'C', text: '$f^{-1}(x) = \\dfrac{1}{x + 2}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'D', text: '$f^{-1}(x) = \\dfrac{x + 1}{2}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
      { key: 'E', text: '$f^{-1}(x) = x - 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$y = \\dfrac{2x + 1}{x} = 2 + \\dfrac{1}{x}$. $y - 2 = 1/x \\to x = 1/(y - 2)$.' },

  // S19 (어려움) 교점 수
  { chapterCode: CODE, difficulty: 'hard', concept: '함수 교점 수', requiredSkills: SKILLS_RATIONAL,
    stem: '$y = x^2$ 와 $y = x + 2$ 의 교점 수?',
    options: [
      { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$D > 0$' },
      { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '중근' },
      { key: 'D', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '이차 최대 $2$' },
    ],
    solution: '$x^2 = x + 2 \\to x^2 - x - 2 = 0 \\to (x-2)(x+1) = 0$. 두 해 → 교점 $2$ 개.' },

  // S20 (어려움) 무리함수 정의역·치역 (이동)
  { chapterCode: CODE, difficulty: 'hard', concept: '$\\sqrt{x - 2} + 3$ 정의역·치역', requiredSkills: SKILLS_IRRATIONAL,
    stem: '$y = \\sqrt{x - 2} + 3$ 의 정의역과 치역?',
    options: [
      { key: 'A', text: '정의역 $x \\geq 2$, 치역 $y \\geq 3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '정의역 $x \\geq 0$, 치역 $y \\geq 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근호 이동 무시' },
      { key: 'C', text: '정의역 $x \\geq 2$, 치역 $y \\geq 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$+3$ 무시' },
      { key: 'D', text: '정의역 $x \\geq -2$, 치역 $y \\geq 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'E', text: '정의역 $x \\geq 2$, 치역 $y \\leq 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부등호 잘못' },
    ],
    solution: '$x - 2 \\geq 0 \\to x \\geq 2$. $\\sqrt{} \\geq 0$이므로 $y = \\sqrt{} + 3 \\geq 3$.' },
];

export const K_G10_CS2_CH03_FUNCTION_GRAPH_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
