/**
 * K-G8-MATH2-CH04-LINEAR-FN — STUDY pool (single-step, 20문제).
 * 일차함수 — 기울기·절편·그래프·관계.
 * Mastery 3-step과 별도 변형 문제. 중2 (G8).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5. LLM 미사용.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G8-MATH2-CH04-LINEAR-FN';
const SKILLS_DEF = ['slope_identification', 'y_intercept_identification', 'value_evaluation'];
const SKILLS_INTERCEPT = ['x_intercept_calc', 'y_intercept_calc'];
const SKILLS_SLOPE = ['slope_from_two_points', 'rise_over_run'];
const SKILLS_LINE = ['line_from_slope_intercept', 'line_from_point_slope', 'line_from_two_points'];
const SKILLS_RELATION = ['parallel_lines', 'intersection_point', 'coincident_lines'];
const SKILLS_GRAPH = ['quadrant_passage', 'graph_steepness'];
const SKILLS_AREA = ['triangle_with_axes', 'intercept_triangle'];
const SKILLS_CONCEPT = ['rate_of_change', 'linear_function_definition'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) 기울기 (음수)
  { chapterCode: CODE, difficulty: 'easy', concept: '기울기 식별 (음수)', requiredSkills: SKILLS_DEF,
    stem: '일차함수 $y = -x + 5$ 의 기울기는?',
    options: [
      { key: 'A', text: '$-1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '음수 부호 누락' },
      { key: 'C', text: '$5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$y$절편을 답함' },
      { key: 'D', text: '$-5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$y$절편 부호도 잘못' },
      { key: 'E', text: '$x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '문자 그대로' },
    ],
    solution: '$y = ax + b$ 에서 $a$ 가 기울기. $-x = (-1) \\cdot x$ → 기울기 $= -1$.' },

  // S2 (쉬움) y절편 (음수)
  { chapterCode: CODE, difficulty: 'easy', concept: '$y$절편 식별 (음수)', requiredSkills: SKILLS_DEF,
    stem: '일차함수 $y = 3x - 7$ 의 $y$절편은?',
    options: [
      { key: 'A', text: '$-7$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$7$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '음수 부호 누락' },
      { key: 'C', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '기울기 답함' },
      { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원점 통과로 잘못 가정' },
      { key: 'E', text: '$\\dfrac{7}{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x$절편 답함' },
    ],
    solution: '$y = ax + b$ 에서 $b$ 가 $y$절편. 여기서 $b = -7$.' },

  // S3 (쉬움) 함숫값 (대입)
  { chapterCode: CODE, difficulty: 'easy', concept: '함숫값 (양수 대입)', requiredSkills: SKILLS_DEF,
    stem: '$y = 4x - 2$ 에서 $x = 2$ 일 때 $y$ 의 값은?',
    options: [
      { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$8$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$-2$ 누락 ($4 \\times 2$만)' },
      { key: 'C', text: '$10$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$4 \\times 2 + 2$' },
      { key: 'D', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$4 - 2 = 2$ 잘못된 식' },
      { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$y$절편으로 잘못' },
    ],
    solution: '$y = 4 \\times 2 - 2 = 8 - 2 = 6$.' },

  // S4 (쉬움) x절편 계산
  { chapterCode: CODE, difficulty: 'easy', concept: '$x$절편 ($y = 0$ 대입)', requiredSkills: SKILLS_INTERCEPT,
    stem: '$y = x + 5$ 의 $x$절편은?',
    options: [
      { key: 'A', text: '$-5$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$y$절편 그대로' },
      { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '기울기' },
      { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$y$절편이 $0$이 아님' },
      { key: 'E', text: '$\\dfrac{1}{5}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '잘못된 식' },
    ],
    solution: '$x$절편: $y = 0$ 대입. $0 = x + 5 \\to x = -5$.' },

  // S5 (쉬움) y절편 = 0
  { chapterCode: CODE, difficulty: 'easy', concept: '원점 통과 직선', requiredSkills: SKILLS_INTERCEPT,
    stem: '$y = 2x$ 의 $y$절편은?',
    options: [
      { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '기울기' },
      { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 추측' },
      { key: 'D', text: '존재하지 않음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$y$축 통과 → $y$절편 존재 ($0$)' },
      { key: 'E', text: '$2x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '식 자체' },
    ],
    solution: '$y = 2x + 0$. $y$절편 $= 0$ (원점 지남).' },

  // S6 (쉬움) 기울기 정의
  { chapterCode: CODE, difficulty: 'easy', concept: '기울기의 의미', requiredSkills: SKILLS_CONCEPT,
    stem: '일차함수 $y = ax + b$ 에서 기울기 $a$ 가 나타내는 것은?',
    options: [
      { key: 'A', text: '$x$가 $1$ 증가할 때 $y$의 변화량', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$y$축과 만나는 점의 $y$좌표', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$y$절편 의미' },
      { key: 'C', text: '$x$축과 만나는 점의 $x$좌표', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x$절편 의미' },
      { key: 'D', text: '$y$의 평균값', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '관련 없음' },
      { key: 'E', text: '직선의 길이', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '직선은 무한' },
    ],
    solution: '기울기 $a = \\dfrac{\\Delta y}{\\Delta x}$ — $x$ 증가에 대한 $y$ 변화율.' },

  // S7 (중) 두 점 → 기울기 (양수)
  { chapterCode: CODE, difficulty: 'medium', concept: '두 점 → 기울기 (양수)', requiredSkills: SKILLS_SLOPE,
    stem: '두 점 $(2, 5)$ 와 $(4, 11)$ 을 지나는 직선의 기울기는?',
    options: [
      { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{1}{3}$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '분자분모 바꿈' },
      { key: 'C', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\Delta x = 2$ 답함' },
      { key: 'D', text: '$6$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\Delta y$만 답함' },
      { key: 'E', text: '$-3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$y$ 차 부호 잘못' },
    ],
    solution: '기울기 $= \\dfrac{11 - 5}{4 - 2} = \\dfrac{6}{2} = 3$.' },

  // S8 (중) 두 점 → 기울기 (다른 좌표)
  { chapterCode: CODE, difficulty: 'medium', concept: '두 점 → 기울기 (원점 포함)', requiredSkills: SKILLS_SLOPE,
    stem: '두 점 $(0, -1)$ 과 $(3, 5)$ 를 지나는 직선의 기울기는?',
    options: [
      { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '분자분모 바꿈' },
      { key: 'C', text: '$6$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\Delta y$만 답함' },
      { key: 'D', text: '$-2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'E', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\Delta x$만' },
    ],
    solution: '기울기 $= \\dfrac{5 - (-1)}{3 - 0} = \\dfrac{6}{3} = 2$.' },

  // S9 (중) 기울기·y절편 → 식
  { chapterCode: CODE, difficulty: 'medium', concept: '기울기·$y$절편으로 식 (음수)', requiredSkills: SKILLS_LINE,
    stem: '기울기가 $-2$, $y$절편이 $4$ 인 직선의 방정식은?',
    options: [
      { key: 'A', text: '$y = -2x + 4$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$y = 2x - 4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '두 부호 모두 잘못' },
      { key: 'C', text: '$y = 4x - 2$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '기울기와 $y$절편 바꿈' },
      { key: 'D', text: '$y = -2x - 4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$y$절편 부호 잘못' },
      { key: 'E', text: '$y = 2x + 4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '기울기 부호 잘못' },
    ],
    solution: '$y = ax + b$ 형식: $a = -2$, $b = 4$ → $y = -2x + 4$.' },

  // S10 (중) x절편 (양수 기울기)
  { chapterCode: CODE, difficulty: 'medium', concept: '$x$절편 (이항 필요)', requiredSkills: SKILLS_INTERCEPT,
    stem: '$y = 2x + 8$ 의 $x$절편은?',
    options: [
      { key: 'A', text: '$-4$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$0 = 2x + 8$ 이항 부호 잘못' },
      { key: 'C', text: '$8$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$y$절편을 답함' },
      { key: 'D', text: '$-8$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '계수 $2$ 나눗셈 누락' },
      { key: 'E', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '기울기' },
    ],
    solution: '$y = 0$ → $0 = 2x + 8 \\to 2x = -8 \\to x = -4$.' },

  // S11 (중) 점-기울기 형식
  { chapterCode: CODE, difficulty: 'medium', concept: '점-기울기 형식', requiredSkills: SKILLS_LINE,
    stem: '점 $(-2, 3)$ 을 지나고 기울기가 $-1$ 인 직선의 방정식은?',
    options: [
      { key: 'A', text: '$y = -x + 1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$y = -x + 3$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$y$절편 계산 누락' },
      { key: 'C', text: '$y = -x - 2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$y$절편 잘못' },
      { key: 'D', text: '$y = x + 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '기울기 부호 잘못' },
      { key: 'E', text: '$y = -x + 5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$y$절편 계산 부호 잘못' },
    ],
    solution: '$y - 3 = -1 \\cdot (x + 2) \\to y = -x - 2 + 3 = -x + 1$.' },

  // S12 (중) 평행
  { chapterCode: CODE, difficulty: 'medium', concept: '평행 조건', requiredSkills: SKILLS_RELATION,
    stem: '$y = 3x - 5$ 와 $y = 3x + 1$ 의 관계는?',
    options: [
      { key: 'A', text: '평행', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '교차', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '같은 기울기 → 평행 (교차 X)' },
      { key: 'C', text: '일치', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$y$절편 다름 → 일치 X' },
      { key: 'D', text: '수직', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '수직은 기울기 곱 $= -1$' },
      { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '명확히 판별 가능' },
    ],
    solution: '두 직선 기울기 모두 $3$, $y$절편 다름 ($-5 \\neq 1$) → 평행.' },

  // S13 (중) 교점 (y절편 같음)
  { chapterCode: CODE, difficulty: 'medium', concept: '두 직선 교점 ($y$절편 같음)', requiredSkills: SKILLS_RELATION,
    stem: '$y = x + 2$ 와 $y = -x + 2$ 의 교점은?',
    options: [
      { key: 'A', text: '$(0, 2)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(2, 0)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '좌표 순서 바꿈' },
      { key: 'C', text: '$(0, 0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원점으로 잘못' },
      { key: 'D', text: '$(2, 2)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 풀이' },
      { key: 'E', text: '$(-2, 0)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$x$절편 잘못' },
    ],
    solution: '연립: $x + 2 = -x + 2 \\to 2x = 0 \\to x = 0$, $y = 2$. 교점 $(0, 2)$.' },

  // S14 (중) 가파른 직선 비교
  { chapterCode: CODE, difficulty: 'medium', concept: '기울기 절댓값 비교', requiredSkills: SKILLS_GRAPH,
    stem: '직선 $y = 3x$ 와 $y = \\dfrac{1}{2} x$ 중 더 가파른 직선은?',
    options: [
      { key: 'A', text: '$y = 3x$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$y = \\dfrac{1}{2} x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '기울기 작음' },
      { key: 'C', text: '같음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '두 기울기 다름' },
      { key: 'D', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '판별 가능' },
      { key: 'E', text: '둘 다 가파름 같음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '명확히 다름' },
    ],
    solution: '기울기 절댓값이 클수록 가파름. $|3| > |1/2|$ → $y = 3x$가 더 가파름.' },

  // S15 (중) 점 대입 → 기울기
  { chapterCode: CODE, difficulty: 'medium', concept: '점 대입 → 미지수', requiredSkills: SKILLS_LINE,
    stem: '$y = ax + 1$ 이 점 $(2, 5)$ 를 지날 때 $a$ 는?',
    options: [
      { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$5 = 2a + 1 \\to a = 2$인데 잘못' },
      { key: 'C', text: '$5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$y$ 값을 답함' },
      { key: 'D', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '분자분모 바꿈' },
      { key: 'E', text: '$-2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
    ],
    solution: '$5 = a \\cdot 2 + 1 \\to 2a = 4 \\to a = 2$.' },

  // S16 (어려움) 두 점 → 식
  { chapterCode: CODE, difficulty: 'hard', concept: '두 점 → 직선식 (양수 기울기)', requiredSkills: SKILLS_LINE,
    stem: '두 점 $(1, -2)$ 와 $(4, 7)$ 을 지나는 직선의 방정식은?',
    options: [
      { key: 'A', text: '$y = 3x - 5$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$y = 3x + 5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$y$절편 부호 잘못' },
      { key: 'C', text: '$y = -3x + 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '기울기 부호 잘못' },
      { key: 'D', text: '$y = \\dfrac{1}{3} x - 2$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '기울기 분자분모 바꿈' },
      { key: 'E', text: '$y = 3x - 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '점 대입 잘못' },
    ],
    solution: '기울기 $= (7 - (-2))/(4 - 1) = 9/3 = 3$. $y = 3x + b$, $(1, -2)$ 대입: $-2 = 3 + b \\to b = -5$. → $y = 3x - 5$.' },

  // S17 (어려움) x절편 → 미지수
  { chapterCode: CODE, difficulty: 'hard', concept: '$x$절편 조건으로 $y$절편', requiredSkills: SKILLS_INTERCEPT,
    stem: '$y = 3x + b$ 가 $x$절편 $2$ 를 가질 때 $b$ 는?',
    options: [
      { key: 'A', text: '$-6$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$6$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$0 = 3 \\cdot 2 + b$ 부호 잘못' },
      { key: 'C', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x$절편 값 그대로' },
      { key: 'D', text: '$-2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '계수 $3$ 곱셈 누락' },
      { key: 'E', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '기울기 값' },
    ],
    solution: '$x = 2, y = 0$ 대입: $0 = 6 + b \\to b = -6$.' },

  // S18 (어려움) 일치 조건
  { chapterCode: CODE, difficulty: 'hard', concept: '두 직선 일치 조건', requiredSkills: SKILLS_RELATION,
    stem: '$y = 2x + a$ 와 $y = bx - 3$ 이 같은 직선이려면 $a, b$ 는?',
    options: [
      { key: 'A', text: '$a = -3,\\ b = 2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$a = 2,\\ b = -3$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$a, b$ 바꿈' },
      { key: 'C', text: '$a = 3,\\ b = 2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$a$ 부호 잘못' },
      { key: 'D', text: '$a = -3,\\ b = -2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$b$ 부호 잘못' },
      { key: 'E', text: '$a = 0,\\ b = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '판별 무시' },
    ],
    solution: '일치 = 기울기·$y$절편 모두 같음. $b = 2$ (기울기), $a = -3$ ($y$절편).' },

  // S19 (어려움) 지나지 않는 사분면
  { chapterCode: CODE, difficulty: 'hard', concept: '직선이 지나지 않는 사분면', requiredSkills: SKILLS_GRAPH,
    stem: '$y = 2x - 5$ 의 그래프가 지나지 않는 사분면은?',
    options: [
      { key: 'A', text: '제$2$사분면', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '제$1$사분면', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x = 5$일 때 $y = 5 > 0$ → 제1사분면 지남' },
      { key: 'C', text: '제$3$사분면', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x = -1$일 때 $y = -7$ → 제3사분면 지남' },
      { key: 'D', text: '제$4$사분면', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$y$절편 $-5$ → 제4사분면 지남' },
      { key: 'E', text: '모든 사분면을 지남', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '직선은 항상 한 사분면 제외 가능' },
    ],
    solution: '기울기 $> 0$, $y$절편 $< 0$ → 제2사분면을 지나지 않음. 1, 3, 4사분면만 지남.' },

  // S20 (어려움) 축 삼각형 넓이
  { chapterCode: CODE, difficulty: 'hard', concept: '직선과 두 축의 삼각형 넓이', requiredSkills: SKILLS_AREA,
    stem: '$y = -x + 4$ 의 그래프와 $x$축, $y$축으로 둘러싸인 삼각형의 넓이는?',
    options: [
      { key: 'A', text: '$8$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$16$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\dfrac{1}{2}$ 누락 ($4 \\times 4$)' },
      { key: 'C', text: '$4$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$x$절편 또는 $y$절편 한 변만' },
      { key: 'D', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$4/2$ 잘못된 식' },
      { key: 'E', text: '$12$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 계산' },
    ],
    solution: '$x$절편 $= 4$ ($y = 0$), $y$절편 $= 4$. 직각삼각형 넓이 $= \\dfrac{1}{2} \\cdot 4 \\cdot 4 = 8$.' },
];

export const K_G8_MATH2_CH04_LINEAR_FN_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
