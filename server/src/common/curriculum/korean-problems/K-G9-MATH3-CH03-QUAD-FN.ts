/**
 * K-G9-MATH3-CH03-QUAD-FN (이차함수) — 20문제 3-step Mastery.
 * 중3 — $y = ax^2 + bx + c$ → $a(x-p)^2 + q$ 변환 → 꼭짓점 $(p, q)$ →
 *        $a > 0$ 최솟값 / $a < 0$ 최댓값 → 절편 → 응용.
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 * 주요 errorCode 분배:
 *   CONCEPT_MISUNDERSTANDING 6 (Q1,2,3,5,6,19) / FORMULA_SELECTION_ERROR 4 (Q7,8,12,15)
 *   ALGEBRA_ERROR 4 (Q9,10,11,16) / ARITHMETIC_ERROR 3 (Q4,14,17)
 *   SIGN_ERROR 2 (Q13,18) / CONDITION_MISSING 1 (Q20)
 *
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G9-MATH3-CH03-QUAD-FN';
const SKILLS_BASIC = ['quadratic_vertex_basic', 'parabola_vertex'];
const SKILLS_SHIFT = ['vertical_shift', 'horizontal_shift'];
const SKILLS_OPENING = ['concave_up_down', 'a_sign'];
const SKILLS_MAXMIN = ['maximum_minimum_value'];
const SKILLS_COMPLETE = ['complete_the_square'];
const SKILLS_AXIS = ['axis_of_symmetry'];
const SKILLS_INTERCEPT = ['x_intercept_quadratic', 'y_intercept'];
const SKILLS_FIT = ['fit_quadratic', 'point_substitution'];

const problems: KoreanProblemSeed[] = [
  // Q1
  { chapterCode: CODE, difficulty: 'easy', concept: '$y = x^2$ 꼭짓점', requiredSkills: SKILLS_BASIC,
    stem: '$y = x^2$ 의 꼭짓점은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$y = x^2$ 의 최솟값을 갖는 점?', options: [
        { key: 'A', text: '$x = 0$ 일 때 $y = 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 1$ 일 때 $y = 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '최솟값 아님' },
        { key: 'C', text: '$x = -1$ 일 때 $y = 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '최솟값 아님' },
        { key: 'D', text: '꼭짓점 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '존재' },
        { key: 'E', text: '$x = \\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$y = x^2$ 에 $x = 0$ 대입 → $y = 0$', options: [
        { key: 'A', text: '$(0, 0)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(1, 0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$(0, 1)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$(2, 4)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$(-1, 1)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '꼭짓점?', options: [
        { key: 'A', text: '$(0, 0)$ (원점)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(1, 1)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$(0, 1)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '꼭짓점 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '존재' },
        { key: 'E', text: '$(2, 4)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$y = x^2$ 의 꼭짓점은 원점 $(0, 0)$.' },

  // Q2
  { chapterCode: CODE, difficulty: 'easy', concept: '$y = x^2 + q$ 꼭짓점', requiredSkills: SKILLS_SHIFT,
    stem: '$y = x^2 + 2$ 의 꼭짓점은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$y = x^2$ 에서 $+2$ 만 추가 → 어떻게 평행이동?', options: [
        { key: 'A', text: '$y$축 방향으로 $+2$ 평행이동', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x$축 방향으로 $+2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x$ 변화 아님' },
        { key: 'C', text: '확대', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '변화 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '변화 있음' },
        { key: 'E', text: '$x$축 대칭', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '꼭짓점 $(0, 0) + (0, 2)$', options: [
        { key: 'A', text: '$(0, 2)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(2, 0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x$ 이동 잘못' },
        { key: 'C', text: '$(2, 2)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$(0, 0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$+2$ 무시' },
        { key: 'E', text: '$(0, -2)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
      ] },
      { stepType: 'ANSWER', prompt: '꼭짓점?', options: [
        { key: 'A', text: '$(0, 2)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(2, 0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x$/$y$ 혼동' },
        { key: 'C', text: '$(0, 0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '이동 무시' },
        { key: 'D', text: '$(0, -2)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'E', text: '$(2, 2)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$y = x^2 + 2$ 꼭짓점 = $(0, 2)$.' },

  // Q3
  { chapterCode: CODE, difficulty: 'easy', concept: '$y = (x-p)^2$ 꼭짓점', requiredSkills: SKILLS_SHIFT,
    stem: '$y = (x - 3)^2$ 의 꼭짓점은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$y$ 가 최솟값 $0$ 이려면?', options: [
        { key: 'A', text: '$x - 3 = 0 \\Rightarrow x = 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '식 안 풂' },
        { key: 'C', text: '$x = -3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
        { key: 'D', text: '$x = 3^2 = 9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '제곱' },
        { key: 'E', text: '$x$ 모든 값', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '유일' },
      ] },
      { stepType: 'PROCESS', prompt: '$x = 3, y = 0$', options: [
        { key: 'A', text: '$(3, 0)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(-3, 0)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$(0, 3)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x, y$ 바뀜' },
        { key: 'D', text: '$(0, 0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '이동 무시' },
        { key: 'E', text: '$(3, 3)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '꼭짓점?', options: [
        { key: 'A', text: '$(3, 0)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(-3, 0)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$(x-p) = 0$ 부호' },
        { key: 'C', text: '$(0, 3)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x, y$ 바뀜' },
        { key: 'D', text: '$(0, 0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '이동 무시' },
        { key: 'E', text: '$(3, 9)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$y = (x-3)^2$ 꼭짓점 = $(3, 0)$. ($x$ 방향으로 $+3$ 평행이동)' },

  // Q4
  { chapterCode: CODE, difficulty: 'easy', concept: '$y = (x-p)^2 + q$ 꼭짓점', requiredSkills: SKILLS_SHIFT,
    stem: '$y = (x - 3)^2 + 2$ 의 꼭짓점은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '꼭짓점식 $y = a(x-p)^2 + q$ 의 꼭짓점?', options: [
        { key: 'A', text: '$(p, q)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(-p, q)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$p$ 부호 잘못' },
        { key: 'C', text: '$(p, -q)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$q$ 부호 잘못' },
        { key: 'D', text: '$(0, q)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$p$ 무시' },
        { key: 'E', text: '$(p, 0)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$q$ 무시' },
      ] },
      { stepType: 'PROCESS', prompt: '$p = 3, q = 2$', options: [
        { key: 'A', text: '$(3, 2)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(-3, 2)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$p$ 부호' },
        { key: 'C', text: '$(3, -2)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$q$ 부호' },
        { key: 'D', text: '$(2, 3)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$p, q$ 바뀜' },
        { key: 'E', text: '$(0, 2)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$p$ 무시' },
      ] },
      { stepType: 'ANSWER', prompt: '꼭짓점?', options: [
        { key: 'A', text: '$(3, 2)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(-3, 2)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$(2, 3)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '바뀜' },
        { key: 'D', text: '$(3, -2)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'E', text: '$(0, 5)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '꼭짓점식 $(p, q) = (3, 2)$.' },

  // Q5
  { chapterCode: CODE, difficulty: 'easy', concept: '$a > 0$ 볼록 방향', requiredSkills: SKILLS_OPENING,
    stem: '$y = 2x^2$ 의 그래프는 어느 방향으로 볼록?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$a$ 부호가 모양 결정?', options: [
        { key: 'A', text: '$a > 0$ → 아래로 볼록 (위로 열림, 최솟값)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a > 0$ → 위로 볼록', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '반대' },
        { key: 'C', text: '$a$ 와 모양 무관', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '관계 있음' },
        { key: 'D', text: '$a > 0$ → 양쪽 직선', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$a > 0$ → 원', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$a = 2 > 0$ 이므로?', options: [
        { key: 'A', text: '아래로 볼록 — 위로 열림', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '위로 볼록', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '반대' },
        { key: 'C', text: '직선', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '이차' },
        { key: 'D', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
        { key: 'E', text: '원', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '아래로 볼록 (최솟값 존재)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '위로 볼록', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '반대' },
        { key: 'C', text: '직선', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$x$축 대칭', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
    ], solution: '$a > 0$ → 아래로 볼록 (U자), 최솟값 존재.' },

  // Q6
  { chapterCode: CODE, difficulty: 'easy', concept: '$a < 0$ 볼록 방향', requiredSkills: SKILLS_OPENING,
    stem: '$y = -x^2$ 의 그래프는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$a < 0$ 이면?', options: [
        { key: 'A', text: '위로 볼록 (아래로 열림, 최댓값)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '아래로 볼록', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '반대' },
        { key: 'C', text: '$a$ 무관', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '관계 있음' },
        { key: 'D', text: '직선', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '원', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$a = -1 < 0$ → ?', options: [
        { key: 'A', text: '위로 볼록 — 아래로 열림', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '아래로 볼록', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '반대' },
        { key: 'C', text: '직선', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$x$축 대칭', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$y$축 대칭', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '대칭축이지만 모양 아님' },
      ] },
      { stepType: 'ANSWER', prompt: '그래프?', options: [
        { key: 'A', text: '위로 볼록 (최댓값 존재)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '아래로 볼록', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '반대' },
        { key: 'C', text: '직선', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '원', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '결정 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
    ], solution: '$a < 0$ → 위로 볼록, 최댓값 존재.' },

  // Q7
  { chapterCode: CODE, difficulty: 'medium', concept: '최솟값 ($a > 0$)', requiredSkills: SKILLS_MAXMIN,
    stem: '$y = (x - 2)^2 + 3$ 의 최솟값은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '꼭짓점식 → 최솟값?', options: [
        { key: 'A', text: '꼭짓점 $y$좌표 = $q$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '꼭짓점 $x$좌표 = $p$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$x$ 와 $y$ 혼동' },
        { key: 'C', text: '$y$절편', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x$절편', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '계수 $a$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$q = 3$', options: [
        { key: 'A', text: '최솟값 = $3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '최솟값 = $2$ ($p$)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$p$ 와 혼동' },
        { key: 'C', text: '최솟값 = $0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '최솟값 = $-3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'E', text: '최솟값 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$a > 0$ → 최솟값 있음' },
      ] },
      { stepType: 'ANSWER', prompt: '최솟값?', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$p$' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$-3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'E', text: '최솟값 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '있음' },
      ] },
    ], solution: '꼭짓점 $(2, 3)$, $a = 1 > 0$ → 최솟값 $= 3$ ($x = 2$ 일 때).' },

  // Q8
  { chapterCode: CODE, difficulty: 'medium', concept: '최댓값 ($a < 0$)', requiredSkills: SKILLS_MAXMIN,
    stem: '$y = -(x + 1)^2 + 5$ 의 최댓값은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$a < 0$ → 최댓값 = ?', options: [
        { key: 'A', text: '꼭짓점 $y$좌표 = $q$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '꼭짓점 $x$좌표', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$x$ 와 혼동' },
        { key: 'C', text: '최댓값 없음 (직선)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$a<0$이면 있음' },
        { key: 'D', text: '계수 $a$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '꼭짓점 좌표?', options: [
        { key: 'A', text: '$(-1, 5)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(1, 5)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$p$ 부호' },
        { key: 'C', text: '$(-1, -5)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$q$ 부호' },
        { key: 'D', text: '$(5, -1)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '바뀜' },
        { key: 'E', text: '$(0, 5)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$p$ 무시' },
      ] },
      { stepType: 'ANSWER', prompt: '최댓값?', options: [
        { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$p$' },
        { key: 'C', text: '$-5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '최댓값 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$a<0$ → 있음' },
      ] },
    ], solution: '꼭짓점 $(-1, 5)$, $a = -1 < 0$ → 최댓값 $= 5$.' },

  // Q9
  { chapterCode: CODE, difficulty: 'medium', concept: '완전제곱 변환', requiredSkills: SKILLS_COMPLETE,
    stem: '$y = x^2 - 4x + 3$ 을 $y = (x - p)^2 + q$ 꼴로 바꾸면?',
    steps: [
      { stepType: 'CONCEPT', prompt: '완전제곱: $(x - p)^2 = x^2 - 2px + p^2$', options: [
        { key: 'A', text: '$-4x$ 의 $-4$ 가 $-2p \\to p = 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$p = -4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$-2p$ 잘못 처리' },
        { key: 'C', text: '$p = 4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$p = -2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'E', text: '$p = 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$x^2 - 4x + 4 - 4 + 3 = (x-2)^2 - 1$', options: [
        { key: 'A', text: '$(x - 2)^2 - 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(x - 2)^2 + 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$-4$ 빼지 않음' },
        { key: 'C', text: '$(x + 2)^2 - 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'D', text: '$(x - 4)^2 - 13$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(x - 2)^2 - 7$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 잘못' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$(x - 2)^2 - 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(x + 2)^2 - 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$(x - 2)^2 + 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '상수 빼기 누락' },
        { key: 'D', text: '$(x - 4)^2 + 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(x - 1)^2 - 2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$x^2 - 4x + 3 = (x-2)^2 - 4 + 3 = (x-2)^2 - 1$.' },

  // Q10
  { chapterCode: CODE, difficulty: 'medium', concept: '완전제곱 → 꼭짓점', requiredSkills: SKILLS_COMPLETE,
    stem: '$y = x^2 - 4x + 3$ 의 꼭짓점은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '완전제곱 변환', options: [
        { key: 'A', text: '$y = (x-2)^2 - 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = (x-2)^2 + 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '상수 처리 잘못' },
        { key: 'C', text: '$y = (x+2)^2 - 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'D', text: '$y = (x-4)^2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$y = x^2 - 4x + 3$ 그대로', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '변환 안 함' },
      ] },
      { stepType: 'PROCESS', prompt: '$(p, q) = ?$', options: [
        { key: 'A', text: '$(2, -1)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(-2, -1)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$p$ 부호' },
        { key: 'C', text: '$(2, 1)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$q$ 부호' },
        { key: 'D', text: '$(0, 3)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$y$ 절편' },
        { key: 'E', text: '$(4, 3)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '꼭짓점?', options: [
        { key: 'A', text: '$(2, -1)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(-2, -1)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$(2, 1)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'D', text: '$(0, 3)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$y$절편' },
        { key: 'E', text: '$(4, 3)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(x-2)^2 - 1$ → 꼭짓점 $(2, -1)$.' },

  // Q11
  { chapterCode: CODE, difficulty: 'medium', concept: '완전제곱 (-6x)', requiredSkills: SKILLS_COMPLETE,
    stem: '$y = x^2 - 6x + 5$ 의 꼭짓점은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$-6x$ 의 $-6/2 = -3$. $(x - 3)^2$', options: [
        { key: 'A', text: '$p = 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$p = -3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$p = 6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$-2p$ 무시' },
        { key: 'D', text: '$p = -6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$p = 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$x^2 - 6x + 9 - 9 + 5 = (x-3)^2 - 4$', options: [
        { key: 'A', text: '$(x-3)^2 - 4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(x-3)^2 + 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$-9$ 누락' },
        { key: 'C', text: '$(x+3)^2 - 4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'D', text: '$(x-3)^2 + 4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'E', text: '$(x-6)^2 - 31$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '꼭짓점?', options: [
        { key: 'A', text: '$(3, -4)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(-3, -4)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$(3, 4)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'D', text: '$(0, 5)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$y$절편' },
        { key: 'E', text: '$(6, 5)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(x-3)^2 - 4$ → 꼭짓점 $(3, -4)$.' },

  // Q12
  { chapterCode: CODE, difficulty: 'medium', concept: '대칭축', requiredSkills: SKILLS_AXIS,
    stem: '$y = 2(x - 1)^2 + 3$ 의 대칭축은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '꼭짓점식 $a(x-p)^2 + q$ 의 대칭축?', options: [
        { key: 'A', text: '$x = p$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = q$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$q$ 와 혼동' },
        { key: 'C', text: '$y = p$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '축 종류 잘못' },
        { key: 'D', text: '$y = q$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x = a$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$p = 1$', options: [
        { key: 'A', text: '$x = 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = -1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$x = 3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$q$' },
        { key: 'D', text: '$x = 2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$y = 1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '축 종류' },
      ] },
      { stepType: 'ANSWER', prompt: '대칭축?', options: [
        { key: 'A', text: '$x = 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = -1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$x = 3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$q$' },
        { key: 'D', text: '$y = 3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '축 종류' },
        { key: 'E', text: '$x = 2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$y = 2(x-1)^2 + 3$ 의 대칭축 $x = 1$.' },

  // Q13
  { chapterCode: CODE, difficulty: 'medium', concept: '$x$절편 (중근)', requiredSkills: SKILLS_INTERCEPT,
    stem: '$y = (x - 2)^2$ 의 $x$절편은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$y = 0$ 대입', options: [
        { key: 'A', text: '$(x - 2)^2 = 0 \\Rightarrow x = 2$ (중근)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = \\pm 2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '제곱 = 0 → 한 값' },
        { key: 'C', text: '$x = 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x = -2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'E', text: '$x$절편 없음', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '있음' },
      ] },
      { stepType: 'PROCESS', prompt: '$x = 2$ 한 점에서 $x$축 접함', options: [
        { key: 'A', text: '접점 (중근)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '교차점 두 개', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '중근이라 한 점' },
        { key: 'C', text: '$x$축 안 만남', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '만남' },
        { key: 'D', text: '$y$축과 만남', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '결정 불가', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'ANSWER', prompt: '$x$절편?', options: [
        { key: 'A', text: '$x = 2$ (중근)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = \\pm 2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '중근' },
        { key: 'C', text: '$x = -2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'D', text: '$x = 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x$절편 없음', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '있음' },
      ] },
    ], solution: '$(x-2)^2 = 0 \\Rightarrow x = 2$ (중근, $x$축에 접함).' },

  // Q14
  { chapterCode: CODE, difficulty: 'medium', concept: '$x$절편 (두 해)', requiredSkills: SKILLS_INTERCEPT,
    stem: '$y = x^2 - 5x + 6$ 의 $x$절편은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$y = 0$ → $x^2 - 5x + 6 = 0$ 풀이', options: [
        { key: 'A', text: '인수분해 $(x-2)(x-3) = 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(x+2)(x+3) = 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$(x-6)(x+1) = 0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x = 5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '해 없음', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '있음' },
      ] },
      { stepType: 'PROCESS', prompt: '$x = ?$', options: [
        { key: 'A', text: '$x = 2$ 또는 $x = 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = -2, -3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$x = 5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x = 6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x = 2$ 만', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '두 해' },
      ] },
      { stepType: 'ANSWER', prompt: '$x$절편?', options: [
        { key: 'A', text: '$x = 2, 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = -2, -3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$x = 5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x = 6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: 'x절편 없음', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '있음' },
      ] },
    ], solution: '$y = 0 \\Rightarrow (x-2)(x-3) = 0 \\Rightarrow x = 2, 3$.' },

  // Q15
  { chapterCode: CODE, difficulty: 'medium', concept: '$y$절편', requiredSkills: SKILLS_INTERCEPT,
    stem: '$y = ax^2 + bx + c$ 의 $y$절편은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$y$절편 = $x = 0$ 일 때 $y$ 값', options: [
        { key: 'A', text: '$y = a(0)^2 + b(0) + c = c$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = a$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$x = 0$ 대입 다른 값' },
        { key: 'C', text: '$y = b$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$y = a + b$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$y = 0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$c$ 무시' },
      ] },
      { stepType: 'PROCESS', prompt: '계산', options: [
        { key: 'A', text: '$y = c$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = a$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '잘못' },
        { key: 'C', text: '$y = a + b + c$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$x=1$ 의 결과' },
        { key: 'D', text: '$y = ac$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱' },
        { key: 'E', text: '$y = b^2 - 4ac$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '판별식' },
      ] },
      { stepType: 'ANSWER', prompt: '$y$절편?', options: [
        { key: 'A', text: '$c$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$b$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$a + c$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$-c$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
      ] },
    ], solution: '$x = 0$ 대입 → $y = c$.' },

  // Q16 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '$a \\neq 1$ 완전제곱', requiredSkills: SKILLS_COMPLETE,
    stem: '$y = -2x^2 + 8x - 3$ 의 꼭짓점과 최댓값은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$a$ 묶기 후 완전제곱', options: [
        { key: 'A', text: '$y = -2(x^2 - 4x) - 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = -2(x^2 + 4x) - 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$y = 2(x^2 - 4x) - 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$a$ 부호' },
        { key: 'D', text: '$y = -2x^2 + 8x - 3$ 그대로', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '변환 안 함' },
        { key: 'E', text: '$y = (x^2 - 4x) - 3$ ($a$ 무시)', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$a$ 빼야 함' },
      ] },
      { stepType: 'PROCESS', prompt: '$-2(x^2 - 4x + 4 - 4) - 3 = -2(x-2)^2 + 8 - 3$', options: [
        { key: 'A', text: '$y = -2(x-2)^2 + 5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = -2(x-2)^2 - 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$+8$ 누락' },
        { key: 'C', text: '$y = -2(x-2)^2 - 11$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$+8$ 부호' },
        { key: 'D', text: '$y = -2(x+2)^2 + 5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'E', text: '$y = -(x-2)^2 + 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$a$ 잘못' },
      ] },
      { stepType: 'ANSWER', prompt: '꼭짓점, 최댓값?', options: [
        { key: 'A', text: '꼭짓점 $(2, 5)$, 최댓값 $5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '꼭짓점 $(2, -5)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$q$ 부호' },
        { key: 'C', text: '꼭짓점 $(-2, 5)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$p$ 부호' },
        { key: 'D', text: '최솟값 $5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$a < 0$ → 최댓값' },
        { key: 'E', text: '꼭짓점 $(2, 0)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$-2(x-2)^2 + 5$. 꼭짓점 $(2, 5)$, $a < 0$ → 최댓값 $5$.' },

  // Q17 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '꼭짓점과 한 점으로 식 찾기', requiredSkills: SKILLS_FIT,
    stem: '꼭짓점이 $(3, -2)$ 이고 점 $(4, 0)$ 을 지나는 이차함수는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '꼭짓점 알면 식 형태?', options: [
        { key: 'A', text: '$y = a(x - 3)^2 - 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = a(x + 3)^2 - 2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$p$ 부호' },
        { key: 'C', text: '$y = a(x - 3)^2 + 2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$q$ 부호' },
        { key: 'D', text: '$y = ax^2 + 3x - 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$y = (x - 3)^2 - 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$a$ 미정' },
      ] },
      { stepType: 'PROCESS', prompt: '$(4, 0)$ 대입 → $a$', options: [
        { key: 'A', text: '$0 = a(1)^2 - 2 \\Rightarrow a = 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a = -2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$a = 1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$a = 0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '이차함수 아님' },
        { key: 'E', text: '$a = 4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '식?', options: [
        { key: 'A', text: '$y = 2(x - 3)^2 - 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = -2(x - 3)^2 - 2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$a$ 부호' },
        { key: 'C', text: '$y = (x - 3)^2 - 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$a = 1$' },
        { key: 'D', text: '$y = 2(x + 3)^2 - 2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$p$ 부호' },
        { key: 'E', text: '$y = 2(x - 3)^2 + 2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$q$ 부호' },
      ] },
    ], solution: '$y = 2(x-3)^2 - 2$. 검산: $(4, 0)$ → $2(1) - 2 = 0$ ✓.' },

  // Q18 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '해 조건으로 미정계수', requiredSkills: SKILLS_FIT,
    stem: '$y = x^2 - 6x + k$ 가 $x = 1$ 을 해로 가질 때 $k$ 는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$x = 1$ 일 때 $y = 0$', options: [
        { key: 'A', text: '$1 - 6 + k = 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1 + 6 + k = 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-6x$ 부호' },
        { key: 'C', text: '$k = 1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '식 안 풂' },
        { key: 'D', text: '$k = 0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$y = 1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$y = 0$' },
      ] },
      { stepType: 'PROCESS', prompt: '$k = ?$', options: [
        { key: 'A', text: '$k = 5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$k = -5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$k = 7$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '식 잘못' },
        { key: 'D', text: '$k = 6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$k = 1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$k$?', options: [
        { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$7$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$1 - 6 + k = 0 \\Rightarrow k = 5$.' },

  // Q19 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '$y = x^2$ 과 $y = -x^2$ 관계', requiredSkills: SKILLS_OPENING,
    stem: '$y = x^2$ 과 $y = -x^2$ 의 그래프 관계는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '두 함수의 차이?', options: [
        { key: 'A', text: '같은 $x$ 에서 $y$ 가 부호 반대', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '같은 함수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부호 다름' },
        { key: 'C', text: '$x$축 방향 평행이동', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$y$축 방향 평행이동', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '확대·축소', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$y$ 부호 반대 = ?', options: [
        { key: 'A', text: '$x$축 대칭', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y$축 대칭', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x$ 부호 변함' },
        { key: 'C', text: '원점 대칭', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '두 좌표 모두' },
        { key: 'D', text: '$y = x$ 대칭', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '같은 그래프', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '다름' },
      ] },
      { stepType: 'ANSWER', prompt: '관계?', options: [
        { key: 'A', text: '$x$축에 대해 대칭', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y$축 대칭', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x$ 부호 변함' },
        { key: 'C', text: '원점 대칭', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '두 좌표' },
        { key: 'D', text: '같은 그래프', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '다름' },
        { key: 'E', text: '$y = x$ 대칭', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$y = -f(x)$ 관계 → $x$축 대칭. $y = x^2$ 과 $y = -x^2$ 은 $x$축 대칭.' },

  // Q20 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '꼭짓점이 $x$축 위 (중근)', requiredSkills: SKILLS_INTERCEPT,
    stem: '$y = x^2 + 2x + 1$ 의 꼭짓점은 $x$축 위에 있는가?',
    steps: [
      { stepType: 'CONCEPT', prompt: '완전제곱 변환', options: [
        { key: 'A', text: '$y = (x + 1)^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = (x - 1)^2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$y = (x + 1)^2 - 1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '상수' },
        { key: 'D', text: '$y = x^2 + 1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '교차항 누락' },
        { key: 'E', text: '$y = (x+2)^2 - 3$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '꼭짓점 $(?, ?)$', options: [
        { key: 'A', text: '$(-1, 0)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(1, 0)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$(0, 1)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$y$절편' },
        { key: 'D', text: '$(1, 1)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'E', text: '$(0, 0)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '꼭짓점 $y$좌표 = $0$ → $x$축 위?', options: [
        { key: 'A', text: '$x$축 위 ($y = 0$)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y$축 위', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$x \\neq 0$' },
        { key: 'C', text: '원점', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$x = -1$' },
        { key: 'D', text: '제 1사분면', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '축 위' },
        { key: 'E', text: '꼭짓점 없음', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '있음' },
      ] },
    ], solution: '$(x+1)^2$ 의 꼭짓점 $(-1, 0)$ — $x$축 위 (중근 = $x$축에 접함).' },
];

export const K_G9_MATH3_CH03_QUAD_FN_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
