/**
 * K-G8-MATH2-CH04-LINEAR-FN (일차함수) — 20문제 3-step Mastery.
 * 중2 — $y = ax + b$ 정의 → 기울기·y절편·x절편 → 두 점으로 직선 →
 *        평행/일치/교차 → 가파름 (기울기의 절댓값) → 도형 넓이.
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 * 주요 errorCode 분배:
 *   SLOPE_INTERCEPT_CONFUSION 6 (Q1,2,3,5,7,9) / GRAPH_READING_ERROR 4 (Q14,18,19,20)
 *   ALGEBRA_ERROR 4 (Q4,10,11,17) / FORMULA_SELECTION_ERROR 3 (Q6,12,13)
 *   ARITHMETIC_ERROR 2 (Q8,15) / SIGN_ERROR 1 (Q16)
 *
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G8-MATH2-CH04-LINEAR-FN';
const SKILLS_DEF = ['linear_function_form', 'slope_intercept_form'];
const SKILLS_SLOPE = ['slope_calculation', 'two_point_slope'];
const SKILLS_INTERCEPT = ['x_intercept', 'y_intercept'];
const SKILLS_LINE = ['point_slope_form', 'line_equation'];
const SKILLS_RELATION = ['parallel_lines', 'coincident_lines', 'intersection'];
const SKILLS_GRAPH = ['graph_quadrants', 'graph_steepness'];
const SKILLS_AREA = ['line_axis_triangle', 'intercept_area'];

const problems: KoreanProblemSeed[] = [
  // Q1
  { chapterCode: CODE, difficulty: 'easy', concept: '기울기 식별', requiredSkills: SKILLS_DEF,
    stem: '일차함수 $y = 2x + 1$ 의 기울기는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$y = ax + b$ 에서 $a$ 의 의미?', options: [
        { key: 'A', text: '기울기 (변화율)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y$절편', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '$a$ 와 $b$ 혼동' },
        { key: 'C', text: '$x$절편', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '근거 없음' },
        { key: 'D', text: '함숫값', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '근거 없음' },
        { key: 'E', text: '$x$ 값', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '변수와 혼동' },
      ] },
      { stepType: 'PROCESS', prompt: '$y = 2x + 1$ 에서 $a = ?$', options: [
        { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '$y$절편을 기울기로' },
        { key: 'C', text: '$x$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '변수' },
        { key: 'D', text: '$2x$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '계수만이 아니라 항 전체' },
        { key: 'E', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합' },
      ] },
      { stepType: 'ANSWER', prompt: '기울기는?', options: [
        { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '$y$절편' },
        { key: 'C', text: '$2x$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '항으로' },
        { key: 'D', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '근거 없음' },
      ] },
    ], solution: '$y = ax + b$ 에서 $a$ 가 기울기. $a = 2$.' },

  // Q2
  { chapterCode: CODE, difficulty: 'easy', concept: 'y절편 식별', requiredSkills: SKILLS_DEF,
    stem: '일차함수 $y = 2x + 1$ 의 $y$절편은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$y$절편의 정의?', options: [
        { key: 'A', text: '$x = 0$ 일 때 $y$의 값 (= $b$)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = 0$ 일 때 $x$의 값', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '$x$절편 정의' },
        { key: 'C', text: '기울기', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '$a$' },
        { key: 'D', text: '$x$ 값', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '변수' },
        { key: 'E', text: '원점', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$x = 0$ 대입: $y = 2 \\cdot 0 + 1 = ?$', options: [
        { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '기울기' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$+1$ 누락' },
        { key: 'D', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합' },
        { key: 'E', text: '$2x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '대입 안 함' },
      ] },
      { stepType: 'ANSWER', prompt: '$y$절편?', options: [
        { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '기울기와 혼동' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$-1/2$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '$x$절편' },
        { key: 'E', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합' },
      ] },
    ], solution: '$x = 0$ 대입 $\\Rightarrow y = 1$.' },

  // Q3
  { chapterCode: CODE, difficulty: 'easy', concept: '함숫값 (대입)', requiredSkills: SKILLS_DEF,
    stem: '$y = -3x + 5$ 에서 $x = 0$ 일 때 $y$ 의 값은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$x = 0$ 대입은?', options: [
        { key: 'A', text: '$-3 \\cdot 0 + 5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-3x + 5$ 그대로', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '대입 안 함' },
        { key: 'C', text: '$-3 + 5$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '$0$ 곱 누락' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$+5$ 누락' },
        { key: 'E', text: '$3 \\cdot 0 + 5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
      ] },
      { stepType: 'PROCESS', prompt: '$-3 \\cdot 0 = 0$, $0 + 5 = ?$', options: [
        { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
        { key: 'C', text: '$3$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '기울기' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$+5$ 누락' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$y = ?$', options: [
        { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-3$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '기울기' },
        { key: 'C', text: '$-5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$x = 0 \\Rightarrow y = 5$ ($y$ 절편).' },

  // Q4
  { chapterCode: CODE, difficulty: 'easy', concept: 'x절편 계산', requiredSkills: SKILLS_INTERCEPT,
    stem: '$y = 2x - 4$ 의 $x$절편은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$x$절편 = ?', options: [
        { key: 'A', text: '$y = 0$ 일 때 $x$ 의 값', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 0$ 일 때 $y$ 의 값', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '$y$절편' },
        { key: 'C', text: '기울기', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '$a$' },
        { key: 'D', text: '$y$ 값', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '근거 없음' },
        { key: 'E', text: '원점에서 거리', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$y = 0$ 대입: $0 = 2x - 4$', options: [
        { key: 'A', text: '$2x = 4 \\Rightarrow x = 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2x = -4 \\Rightarrow x = -2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '이항 부호' },
        { key: 'C', text: '$x = 0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '대입 잘못' },
        { key: 'D', text: '$x = 4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나누기 누락' },
        { key: 'E', text: '$x = -4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
      ] },
      { stepType: 'ANSWER', prompt: '$x$절편은?', options: [
        { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-4$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '$y$절편' },
        { key: 'C', text: '$-2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '부호' },
        { key: 'D', text: '$4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나누기 누락' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$0 = 2x - 4 \\Rightarrow x = 2$.' },

  // Q5
  { chapterCode: CODE, difficulty: 'easy', concept: 'y절편 (계수가 -1)', requiredSkills: SKILLS_INTERCEPT,
    stem: '$y = -x + 3$ 의 $y$절편은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$y = ax + b$ 에서 $b$ 가 $y$절편', options: [
        { key: 'A', text: '$b = 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$b = -1$ (기울기와 혼동)', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '$a$ 와 $b$ 혼동' },
        { key: 'C', text: '$b = -x$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '항으로' },
        { key: 'D', text: '$b = 0$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '근거 없음' },
        { key: 'E', text: '$b = -3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
      ] },
      { stepType: 'PROCESS', prompt: '$x = 0$ 대입 → $y = -0 + 3 = ?$', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$-1$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '기울기' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$+3$ 누락' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$y$절편?', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-1$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '기울기' },
        { key: 'C', text: '$-3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$y = -x + 3$ 의 $y$절편 = $3$.' },

  // Q6
  { chapterCode: CODE, difficulty: 'easy', concept: '일차함수 형태', requiredSkills: SKILLS_DEF,
    stem: '일차함수의 일반 형태는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '"일차" 의 의미?', options: [
        { key: 'A', text: '$x$ 의 최고 차수가 $1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x$ 의 최고 차수가 $2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '이차함수' },
        { key: 'C', text: '$x$ 의 계수가 $1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '계수와 무관' },
        { key: 'D', text: '상수항이 $1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$y$ 값이 $1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$a, b$ 조건?', options: [
        { key: 'A', text: '$y = ax + b$ ($a \\neq 0$)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = ax + b$ ($a, b$ 임의)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$a = 0$이면 상수함수' },
        { key: 'C', text: '$y = ax^2 + bx + c$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '이차' },
        { key: 'D', text: '$y = a/x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '반비례' },
        { key: 'E', text: '$y = a^x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '지수함수' },
      ] },
      { stepType: 'ANSWER', prompt: '형태는?', options: [
        { key: 'A', text: '$y = ax + b$ ($a \\neq 0$)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = ax^2 + b$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '이차' },
        { key: 'C', text: '$y = a/x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '반비례' },
        { key: 'D', text: '$y = b$ (상수)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '상수함수' },
        { key: 'E', text: '$y = a + b$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '일차함수: $y = ax + b$, $a \\neq 0$.' },

  // Q7
  { chapterCode: CODE, difficulty: 'medium', concept: '두 점 → 기울기', requiredSkills: SKILLS_SLOPE,
    stem: '두 점 $(1, 3)$ 과 $(4, 9)$ 를 지나는 직선의 기울기는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '기울기 공식?', options: [
        { key: 'A', text: '$\\dfrac{y_2 - y_1}{x_2 - x_1}$ ($\\Delta y / \\Delta x$)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{x_2 - x_1}{y_2 - y_1}$ (뒤집힘)', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '$\\Delta x / \\Delta y$' },
        { key: 'C', text: '$y_2 + y_1$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '합' },
        { key: 'D', text: '$y_2 \\cdot x_1$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '근거 없음' },
        { key: 'E', text: '$y_1 - y_2$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '$x$ 변화 누락' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\dfrac{9 - 3}{4 - 1}$', options: [
        { key: 'A', text: '$\\dfrac{6}{3} = 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{3}{6} = \\dfrac{1}{2}$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '뒤집힘' },
        { key: 'C', text: '$\\dfrac{12}{5} = 2.4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합' },
        { key: 'D', text: '$\\dfrac{-6}{3} = -2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'E', text: '$\\dfrac{6}{4} = 1.5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$x$ 차 잘못' },
      ] },
      { stepType: 'ANSWER', prompt: '기울기?', options: [
        { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '뒤집힘' },
        { key: 'C', text: '$-2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'D', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 누락' },
        { key: 'E', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '기울기 $= (9-3)/(4-1) = 6/3 = 2$.' },

  // Q8
  { chapterCode: CODE, difficulty: 'medium', concept: '두 점 → 기울기 (원점 포함)', requiredSkills: SKILLS_SLOPE,
    stem: '두 점 $(0, 1)$ 과 $(2, 7)$ 을 지나는 직선의 기울기는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\Delta y / \\Delta x$ 적용', options: [
        { key: 'A', text: '$(7 - 1) / (2 - 0)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(2 - 0) / (7 - 1)$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '뒤집힘' },
        { key: 'C', text: '$7 + 1 = 8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합' },
        { key: 'D', text: '$7 - 1 = 6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 누락' },
        { key: 'E', text: '$2 - 7$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      ] },
      { stepType: 'PROCESS', prompt: '$6/2$', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
        { key: 'C', text: '$4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
        { key: 'D', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\dfrac{1}{3}$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '뒤집힘' },
      ] },
      { stepType: 'ANSWER', prompt: '기울기?', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$-3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'D', text: '$\\dfrac{1}{3}$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '뒤집힘' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '$y$절편' },
      ] },
    ], solution: '$(7-1)/(2-0) = 6/2 = 3$.' },

  // Q9
  { chapterCode: CODE, difficulty: 'medium', concept: '기울기·y절편으로 식 세우기', requiredSkills: SKILLS_LINE,
    stem: '기울기가 $2$, $y$절편이 $-3$ 인 직선의 방정식은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$y = ax + b$ 에 $a, b$ 대입', options: [
        { key: 'A', text: '$a = 2$, $b = -3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a = -3$, $b = 2$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '$a, b$ 바뀜' },
        { key: 'C', text: '$a = 2$, $b = 3$ (부호 무시)', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$y$절편 부호' },
        { key: 'D', text: '$a = 0$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '근거 없음' },
        { key: 'E', text: '$b = 0$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '식 작성', options: [
        { key: 'A', text: '$y = 2x - 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = -3x + 2$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '$a, b$ 바뀜' },
        { key: 'C', text: '$y = 2x + 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'D', text: '$y = 2x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$y$절편 누락' },
        { key: 'E', text: '$y = -3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '기울기 누락' },
      ] },
      { stepType: 'ANSWER', prompt: '방정식?', options: [
        { key: 'A', text: '$y = 2x - 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = -3x + 2$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '바뀜' },
        { key: 'C', text: '$y = 2x + 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'D', text: '$y = -2x - 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '기울기 부호' },
        { key: 'E', text: '$y = 2 - 3x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '잘못' },
      ] },
    ], solution: '$y = 2x - 3$.' },

  // Q10
  { chapterCode: CODE, difficulty: 'medium', concept: 'x절편 (음수 기울기)', requiredSkills: SKILLS_INTERCEPT,
    stem: '$y = -3x + 6$ 의 $x$절편은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$y = 0$ 대입', options: [
        { key: 'A', text: '$0 = -3x + 6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = 0 \\cdot x + 6 = 6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$y = 0$ 잘못 적용' },
        { key: 'C', text: '$x = 0$ 대입', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '$y$절편' },
        { key: 'D', text: '$x = 6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '식 풀이 안 함' },
        { key: 'E', text: '$x = -3$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '기울기' },
      ] },
      { stepType: 'PROCESS', prompt: '$3x = 6$', options: [
        { key: 'A', text: '$x = 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = -2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$x = 6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나누기 누락' },
        { key: 'D', text: '$x = 18$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '곱' },
        { key: 'E', text: '$x = 3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$x$절편?', options: [
        { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$6$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '$y$절편' },
        { key: 'C', text: '$-3$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '기울기' },
        { key: 'D', text: '$-2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$0 = -3x + 6 \\Rightarrow x = 2$.' },

  // Q11
  { chapterCode: CODE, difficulty: 'medium', concept: '점-기울기 형식', requiredSkills: SKILLS_LINE,
    stem: '점 $(1, 5)$ 를 지나고 기울기가 $2$ 인 직선의 방정식은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '점-기울기 공식?', options: [
        { key: 'A', text: '$y - y_1 = a(x - x_1)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = ax$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$y$절편 누락' },
        { key: 'C', text: '$y + y_1 = a(x + x_1)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '부호 잘못' },
        { key: 'D', text: '$y_1 - y = a(x_1 - x)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '순서 잘못 (맞지만 결과 동일)' },
        { key: 'E', text: '$y = a$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '상수' },
      ] },
      { stepType: 'PROCESS', prompt: '$y - 5 = 2(x - 1)$ 정리', options: [
        { key: 'A', text: '$y = 2x - 2 + 5 = 2x + 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = 2x + 4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$-2 + 5 = 3$' },
        { key: 'C', text: '$y = 2x + 6$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'D', text: '$y = 2x - 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$+5$ 누락' },
        { key: 'E', text: '$y = -2x + 7$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '기울기 부호' },
      ] },
      { stepType: 'ANSWER', prompt: '방정식?', options: [
        { key: 'A', text: '$y = 2x + 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = 2x + 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$y$절편 잘못' },
        { key: 'C', text: '$y = 2x + 4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '계산 잘못' },
        { key: 'D', text: '$y = 2x - 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'E', text: '$y = 2x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$y - 5 = 2(x - 1) \\Rightarrow y = 2x + 3$. 검산: $x=1$ → $y = 5$ ✓.' },

  // Q12
  { chapterCode: CODE, difficulty: 'medium', concept: '평행 조건', requiredSkills: SKILLS_RELATION,
    stem: '$y = 4x + 7$ 과 $y = 4x - 2$ 의 관계는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '두 직선의 기울기와 $y$절편 비교?', options: [
        { key: 'A', text: '기울기 같음 ($4$), $y$절편 다름 ($7, -2$)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '기울기 다름', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '둘 다 $4$' },
        { key: 'C', text: '$y$절편 같음', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$7 \\neq -2$' },
        { key: 'D', text: '모두 같음 (일치)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$y$절편 다름' },
        { key: 'E', text: '모두 다름', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '기울기 같음' },
      ] },
      { stepType: 'PROCESS', prompt: '기울기 같고 $y$절편 다르면?', options: [
        { key: 'A', text: '평행 (만나지 않음)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '일치', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$y$절편 달라서 다른 직선' },
        { key: 'C', text: '한 점에서 만남', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '평행하면 안 만남' },
        { key: 'D', text: '수직', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '기울기 곱이 $-1$이어야' },
        { key: 'E', text: '같은 직선', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '다름' },
      ] },
      { stepType: 'ANSWER', prompt: '관계?', options: [
        { key: 'A', text: '평행', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '일치', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$y$절편 다름' },
        { key: 'C', text: '한 점에서 만남', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '평행' },
        { key: 'D', text: '수직', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '직각으로 교차', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '기울기 같음 + $y$절편 다름 → 평행.' },

  // Q13
  { chapterCode: CODE, difficulty: 'medium', concept: '교점 (같은 y절편)', requiredSkills: SKILLS_RELATION,
    stem: '$y = 2x + 1$ 과 $y = -3x + 1$ 의 교점은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$y$절편이 같다는 의미?', options: [
        { key: 'A', text: '$x = 0$ 일 때 두 식 모두 $y = 1$ → $(0, 1)$ 에서 만남', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '평행', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '기울기 다르므로 평행 아님' },
        { key: 'C', text: '만나지 않음', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '교차' },
        { key: 'D', text: '여러 점에서 만남', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '두 직선은 1점에서만' },
        { key: 'E', text: '일치', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '기울기 다름' },
      ] },
      { stepType: 'PROCESS', prompt: '연립: $2x + 1 = -3x + 1$', options: [
        { key: 'A', text: '$5x = 0 \\Rightarrow x = 0$, $y = 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5x = 2 \\Rightarrow x = 2/5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산' },
        { key: 'C', text: '교점 없음', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '교차' },
        { key: 'D', text: '$x = 1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x = -1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '교점?', options: [
        { key: 'A', text: '$(0, 1)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(1, 0)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '뒤집힘' },
        { key: 'C', text: '$(0, 0)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(1, 1)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '없음', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$y$절편 같으면 만남' },
      ] },
    ], solution: '$2x + 1 = -3x + 1 \\Rightarrow x = 0$, $y = 1$. 교점 $(0, 1)$.' },

  // Q14
  { chapterCode: CODE, difficulty: 'medium', concept: '기울기 절댓값으로 가파름', requiredSkills: SKILLS_GRAPH,
    stem: '직선 $y = \\dfrac{1}{2} x + 1$ 과 $y = -2x + 6$ 중 더 가파른 직선은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '가파름의 기준은?', options: [
        { key: 'A', text: '기울기의 절댓값', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '기울기의 부호', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '부호와 무관' },
        { key: 'C', text: '$y$절편의 크기', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '$y$절편과 무관' },
        { key: 'D', text: '$x$절편의 크기', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '무관' },
        { key: 'E', text: '$y$절편 양수만 가파름', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$|\\frac{1}{2}|$ vs $|-2|$', options: [
        { key: 'A', text: '$|1/2| = 0.5 < 2 = |-2|$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/2 > -2$ 이므로 첫 번째가 가파름', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '절댓값 아닌 부호 비교' },
        { key: 'C', text: '$-2 < 1/2$ 이므로 둘째가 작음', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '부호 비교' },
        { key: 'D', text: '둘 다 같음', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$0.5 \\neq 2$' },
        { key: 'E', text: '비교 불가', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '비교 가능' },
      ] },
      { stepType: 'ANSWER', prompt: '더 가파른 것?', options: [
        { key: 'A', text: '$y = -2x + 6$ (기울기 절댓값 $2$ 가 더 큼)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = (1/2)x + 1$', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '절댓값 작음' },
        { key: 'C', text: '둘 다 같음', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '다름' },
        { key: 'D', text: '$y$절편이 큰 것 = $y = -2x + 6$', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '맞지만 이유 잘못' },
        { key: 'E', text: '$y$절편이 작은 것 = $y = (1/2)x + 1$', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '가파름 = $|기울기|$. $|-2| = 2 > |1/2| = 0.5$. $y = -2x + 6$ 가 더 가파름.' },

  // Q15
  { chapterCode: CODE, difficulty: 'medium', concept: '점 대입 → 기울기 찾기', requiredSkills: SKILLS_LINE,
    stem: '$y = ax - 4$ 가 점 $(3, 5)$ 를 지날 때 $a$ 는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '대입 의미?', options: [
        { key: 'A', text: '$x = 3, y = 5$ 대입 → 식 만족', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a = 3$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '$x$ 와 $a$ 혼동' },
        { key: 'C', text: '$a = 5$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '$y$ 와 $a$ 혼동' },
        { key: 'D', text: '$a = -4$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '$y$절편' },
        { key: 'E', text: '풀 수 없음', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '풀이 가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$5 = 3a - 4 \\Rightarrow 3a = 9$', options: [
        { key: 'A', text: '$a = 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a = 9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나누기 누락' },
        { key: 'C', text: '$a = -3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'D', text: '$a = 1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$a = -9$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$a = ?$', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나누기 누락' },
        { key: 'C', text: '$5$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '$y$ 자체' },
        { key: 'D', text: '$-3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'E', text: '$-4$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '$y$절편' },
      ] },
    ], solution: '$(3, 5)$ 대입 → $5 = 3a - 4 \\Rightarrow a = 3$.' },

  // Q16 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '두 점 → 직선식 (음수 기울기)', requiredSkills: SKILLS_LINE,
    stem: '두 점 $(-2, 4)$ 와 $(3, -6)$ 을 지나는 직선의 방정식은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '먼저 기울기?', options: [
        { key: 'A', text: '$(-6 - 4) / (3 - (-2)) = -10/5 = -2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(4 - (-6)) / (-2 - 3) = 10 / -5 = -2$ (맞지만 부호 처리 다름)', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '맞는 답이지만 부호 다루기 어려움' },
        { key: 'C', text: '$10/5 = 2$ (부호 무시)', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 누락' },
        { key: 'D', text: '$-10/-5 = 2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$x$ 차 부호 잘못' },
        { key: 'E', text: '$-6 + 4 = -2$ (분모 무시)', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '분모 무시' },
      ] },
      { stepType: 'PROCESS', prompt: '점-기울기: $y - 4 = -2(x - (-2)) = -2(x + 2)$', options: [
        { key: 'A', text: '$y = -2x - 4 + 4 = -2x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = -2x + 4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$-4 + 4 = 0$' },
        { key: 'C', text: '$y = -2x - 4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$+4$ 누락' },
        { key: 'D', text: '$y = 2x$ (부호 잘못)', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '기울기 부호' },
        { key: 'E', text: '$y - 4 = -2x + 2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '분배 잘못' },
      ] },
      { stepType: 'ANSWER', prompt: '방정식?', options: [
        { key: 'A', text: '$y = -2x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = -2x + 4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '상수 계산 잘못' },
        { key: 'C', text: '$y = 2x$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '기울기 부호' },
        { key: 'D', text: '$y = -2x - 4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$+4$ 누락' },
        { key: 'E', text: '$y = 2x + 4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '잘못' },
      ] },
    ], solution: '기울기 $-2$, $(-2, 4)$ 대입: $y - 4 = -2(x + 2) \\Rightarrow y = -2x$. 검산: $(3, -6)$ → $-2 \\cdot 3 = -6$ ✓.' },

  // Q17 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: 'x절편 조건으로 y절편', requiredSkills: SKILLS_INTERCEPT,
    stem: '$y = 2x + b$ 가 $x$절편 $-3$ 을 가질 때 $b$ 는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$x$절편 $-3$ 의 의미?', options: [
        { key: 'A', text: '점 $(-3, 0)$ 을 지남', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '점 $(0, -3)$ 을 지남', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '$y$절편' },
        { key: 'C', text: '점 $(-3, -3)$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '근거 없음' },
        { key: 'D', text: '원점에서 $-3$ 떨어짐', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '거리 아님' },
        { key: 'E', text: '$b = -3$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '바로 $b$로 보면 잘못' },
      ] },
      { stepType: 'PROCESS', prompt: '$(-3, 0)$ 대입: $0 = 2(-3) + b$', options: [
        { key: 'A', text: '$b = 6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$b = -6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '이항 부호' },
        { key: 'C', text: '$b = 0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$b = -3$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '$x$절편 자체' },
        { key: 'E', text: '$b = 3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 잘못' },
      ] },
      { stepType: 'ANSWER', prompt: '$b = ?$', options: [
        { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '이항 부호' },
        { key: 'C', text: '$-3$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '$x$절편 자체' },
        { key: 'D', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(-3, 0)$ 대입: $0 = -6 + b \\Rightarrow b = 6$.' },

  // Q18 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '일치 조건', requiredSkills: SKILLS_RELATION,
    stem: '$y = ax + 2$ 와 $y = 3x + b$ 가 같은 직선이려면 $a, b$ 는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '두 직선이 일치할 조건?', options: [
        { key: 'A', text: '기울기와 $y$절편 모두 같음', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '기울기만 같음', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '평행' },
        { key: 'C', text: '$y$절편만 같음', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '교점만 같음' },
        { key: 'D', text: '$x$절편만 같음', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '한 점을 같이 지나면 됨', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '교차하는 두 직선도 한 점' },
      ] },
      { stepType: 'PROCESS', prompt: '$a = 3, b = ?$', options: [
        { key: 'A', text: '$a = 3, b = 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a = 3, b = 3$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '기울기 = $y$절편으로 잘못' },
        { key: 'C', text: '$a = 2, b = 3$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '바뀜' },
        { key: 'D', text: '$a = b = 3$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '근거 없음' },
        { key: 'E', text: '값 없음', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '존재함' },
      ] },
      { stepType: 'ANSWER', prompt: '$a, b$?', options: [
        { key: 'A', text: '$a = 3,\\ b = 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a = 2,\\ b = 3$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '바뀜' },
        { key: 'C', text: '$a = 3,\\ b = 3$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '근거 없음' },
        { key: 'D', text: '존재하지 않음', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '존재' },
        { key: 'E', text: '무수히 많음', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '유일' },
      ] },
    ], solution: '일치 = 기울기 같음 + $y$절편 같음. $a = 3$, $b = 2$.' },

  // Q19 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '직선이 지나지 않는 사분면', requiredSkills: SKILLS_GRAPH,
    stem: '$y = -x + 4$ 의 그래프가 지나지 않는 사분면은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '두 절편 찾기?', options: [
        { key: 'A', text: '$y$절편 $(0, 4)$, $x$절편 $(4, 0)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y$절편 $4$, $x$절편 $-4$', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '$x$절편 부호' },
        { key: 'C', text: '$y$절편 $-1$ (기울기 자체)', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '기울기' },
        { key: 'D', text: '$x$절편 $0$', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '잘못' },
        { key: 'E', text: '$y$절편 $0$', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '잘못' },
      ] },
      { stepType: 'PROCESS', prompt: '$(0,4)$ 와 $(4,0)$ 잇는 직선 → 어느 사분면 통과?', options: [
        { key: 'A', text: '제$1$, 제$2$, 제$4$사분면 통과 (제$3$ 안 지남)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '제$1$, 제$3$', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '잘못' },
        { key: 'C', text: '제$2$, 제$4$만', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '제$1$도 지남' },
        { key: 'D', text: '모든 사분면', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '제$3$ 안 지남' },
        { key: 'E', text: '제$3$만', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '반대' },
      ] },
      { stepType: 'ANSWER', prompt: '지나지 않는 사분면?', options: [
        { key: 'A', text: '제$3$사분면', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '제$1$사분면', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '지남' },
        { key: 'C', text: '제$2$사분면', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '지남' },
        { key: 'D', text: '제$4$사분면', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '지남' },
        { key: 'E', text: '없음 (모두 지남)', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '제$3$ 안 지남' },
      ] },
    ], solution: '$y$절편 $4$ (제2/1 경계), $x$절편 $4$ (제1/4 경계). 직선이 제2 → 제1 → 제4 통과, 제3 안 지남.' },

  // Q20 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '직선과 두 축이 둘러싼 삼각형', requiredSkills: SKILLS_AREA,
    stem: '$y = 2x - 6$ 의 그래프와 $x$축, $y$축으로 둘러싸인 삼각형의 넓이는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '두 절편?', options: [
        { key: 'A', text: '$x$절편 $3$, $y$절편 $-6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x$절편 $-3$, $y$절편 $6$', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '부호' },
        { key: 'C', text: '$x$절편 $2$, $y$절편 $-6$', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '$x$절편 계산' },
        { key: 'D', text: '둘 다 $6$', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '잘못' },
        { key: 'E', text: '$y$절편 $2$', isCorrect: false, errorCode: 'SLOPE_INTERCEPT_CONFUSION', errorReason: '기울기' },
      ] },
      { stepType: 'PROCESS', prompt: '꼭짓점 $(0, 0), (3, 0), (0, -6)$. 밑변, 높이?', options: [
        { key: 'A', text: '밑변 $3$, 높이 $6$ (절댓값)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '밑변 $3$, 높이 $-6$ (부호 포함)', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '길이는 양수' },
        { key: 'C', text: '밑변 $6$, 높이 $3$', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '바뀜' },
        { key: 'D', text: '밑변 $9$ (합)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합' },
        { key: 'E', text: '밑변 $-3$', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '음수 길이' },
      ] },
      { stepType: 'ANSWER', prompt: '넓이 $= \\frac{1}{2} \\cdot 3 \\cdot 6 = ?$', options: [
        { key: 'A', text: '$9$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$18$', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '$1/2$ 누락' },
        { key: 'C', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$-9$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '넓이 음수 불가' },
        { key: 'E', text: '$6$', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$x$절편 $3$, $y$절편 $-6$. 넓이 $= \\frac{1}{2} \\cdot 3 \\cdot 6 = 9$.' },
];

export const K_G8_MATH2_CH04_LINEAR_FN_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
