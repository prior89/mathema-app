/**
 * K-G9-MATH3-CH03-QUAD-FN — STUDY pool (single-step, 20문제).
 * 이차함수 — 꼭짓점, 대칭축, 최댓·최솟값, 절편, 일반형 ↔ 표준형.
 * Mastery 3-step과 별도 변형 문제. 중3 (G9).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5. LLM 미사용.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G9-MATH3-CH03-QUAD-FN';
const SKILLS_BASIC = ['vertex_origin', 'parabola_basic'];
const SKILLS_SHIFT = ['vertical_shift', 'horizontal_shift', 'vertex_form'];
const SKILLS_OPENING = ['opening_direction', 'positive_negative_a'];
const SKILLS_MAXMIN = ['max_min_value', 'vertex_y_coordinate'];
const SKILLS_COMPLETE = ['complete_square', 'general_to_vertex'];
const SKILLS_AXIS = ['axis_of_symmetry', 'vertex_x_coordinate'];
const SKILLS_INTERCEPT = ['x_intercept', 'y_intercept'];
const SKILLS_FIT = ['find_quadratic_from_vertex_point', 'unknown_coefficient'];
const SKILLS_REFLECTION = ['reflection_across_x_axis', 'a_sign_change'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) y=-x² 꼭짓점
  { chapterCode: CODE, difficulty: 'easy', concept: '$y = -x^2$ 꼭짓점', requiredSkills: SKILLS_BASIC,
    stem: '$y = -x^2$ 의 꼭짓점은?',
    options: [
      { key: 'A', text: '$(0, 0)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(1, 0)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '잘못된 좌표' },
      { key: 'C', text: '$(0, -1)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '잘못된 좌표' },
      { key: 'D', text: '$(-1, 0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$-$ 부호와 혼동' },
      { key: 'E', text: '꼭짓점 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '모든 이차함수는 꼭짓점 존재' },
    ],
    solution: '$y = ax^2$ 꼭짓점은 원점 $(0, 0)$. (위 아래 볼록 무관.)' },

  // S2 (쉬움) y=x²-3
  { chapterCode: CODE, difficulty: 'easy', concept: '$y = x^2 + q$ 꼭짓점 (음수)', requiredSkills: SKILLS_SHIFT,
    stem: '$y = x^2 - 3$ 의 꼭짓점은?',
    options: [
      { key: 'A', text: '$(0, -3)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(0, 3)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$y$ 부호 잘못' },
      { key: 'C', text: '$(-3, 0)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$x, y$ 바꿈' },
      { key: 'D', text: '$(3, 0)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '좌표 잘못' },
      { key: 'E', text: '$(0, 0)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$-3$ 무시' },
    ],
    solution: '$y = x^2 + q$ 꼭짓점은 $(0, q)$. $q = -3$ → $(0, -3)$.' },

  // S3 (쉬움) y=(x+2)²
  { chapterCode: CODE, difficulty: 'easy', concept: '$y = (x-p)^2$ 꼭짓점 ($p < 0$)', requiredSkills: SKILLS_SHIFT,
    stem: '$y = (x + 2)^2$ 의 꼭짓점은?',
    options: [
      { key: 'A', text: '$(-2, 0)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(2, 0)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$x + 2 = 0 \\to x = -2$인데 부호 잘못' },
      { key: 'C', text: '$(0, -2)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '좌표 바꿈' },
      { key: 'D', text: '$(0, 2)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '좌표 잘못' },
      { key: 'E', text: '$(2, 2)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '두 좌표 모두 잘못' },
    ],
    solution: '$(x - p)^2$ 꼴: $p$ 가 꼭짓점 $x$. $(x + 2)^2 = (x - (-2))^2$ → $p = -2$, 꼭짓점 $(-2, 0)$.' },

  // S4 (쉬움) y=(x+1)²-4
  { chapterCode: CODE, difficulty: 'easy', concept: '$y = (x-p)^2 + q$ 꼭짓점', requiredSkills: SKILLS_SHIFT,
    stem: '$y = (x + 1)^2 - 4$ 의 꼭짓점은?',
    options: [
      { key: 'A', text: '$(-1, -4)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(1, -4)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$x$ 부호 잘못' },
      { key: 'C', text: '$(-1, 4)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$y$ 부호 잘못' },
      { key: 'D', text: '$(1, 4)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '두 부호 모두 잘못' },
      { key: 'E', text: '$(-4, -1)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '좌표 바꿈' },
    ],
    solution: '$y = (x - p)^2 + q$ → 꼭짓점 $(p, q)$. $p = -1$, $q = -4$ → $(-1, -4)$.' },

  // S5 (쉬움) y=3x² 좁음
  { chapterCode: CODE, difficulty: 'easy', concept: '$|a|$ 와 그래프 폭', requiredSkills: SKILLS_OPENING,
    stem: '$y = 3x^2$ 그래프는 $y = x^2$ 그래프에 비해 어떠한가?',
    options: [
      { key: 'A', text: '폭이 더 좁다 (가파르다)', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '폭이 더 넓다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$|a|$ 클수록 좁음 (반대)' },
      { key: 'C', text: '같다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$a$가 다르면 폭 다름' },
      { key: 'D', text: '아래로 볼록', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$a > 0$ → 둘 다 위로 볼록' },
      { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '판별 가능' },
    ],
    solution: '$|a|$ 가 클수록 $y$ 값 빨리 증가 → 좁고 가파른 그래프.' },

  // S6 (쉬움) y=-2x² 아래 볼록
  { chapterCode: CODE, difficulty: 'easy', concept: '$a < 0$ 아래 볼록', requiredSkills: SKILLS_OPENING,
    stem: '$y = -2x^2$ 의 그래프는 어느 방향으로 볼록한가?',
    options: [
      { key: 'A', text: '아래로 볼록 (위로 열림 X)', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '위로 볼록', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$a < 0$인데 부호 무시' },
      { key: 'C', text: '왼쪽으로 열림', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '이차함수는 위/아래 방향만' },
      { key: 'D', text: '오른쪽으로 열림', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '이차함수 아님' },
      { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '판별 가능' },
    ],
    solution: '$a < 0$ → 그래프가 위쪽에서 시작해 아래로 열림 (아래로 볼록).' },

  // S7 (중) 최솟값
  { chapterCode: CODE, difficulty: 'medium', concept: '최솟값 ($a > 0$)', requiredSkills: SKILLS_MAXMIN,
    stem: '$y = (x + 3)^2 - 1$ 의 최솟값은?',
    options: [
      { key: 'A', text: '$-1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$-3$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$x$ 좌표 답함' },
      { key: 'C', text: '$1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$y$ 부호 잘못' },
      { key: 'D', text: '$3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '잘못된 식' },
      { key: 'E', text: '최솟값 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$a > 0$ → 최솟값 존재' },
    ],
    solution: '꼭짓점 $(-3, -1)$. $a = 1 > 0$ → 위로 볼록 → 최솟값 $= -1$.' },

  // S8 (중) 최댓값
  { chapterCode: CODE, difficulty: 'medium', concept: '최댓값 ($a < 0$)', requiredSkills: SKILLS_MAXMIN,
    stem: '$y = -(x - 2)^2 + 4$ 의 최댓값은?',
    options: [
      { key: 'A', text: '$4$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$2$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$x$ 좌표 답함' },
      { key: 'C', text: '$-4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$y$ 부호 잘못' },
      { key: 'D', text: '$-2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '잘못된 식' },
      { key: 'E', text: '최댓값 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$a < 0$ → 최댓값 존재' },
    ],
    solution: '꼭짓점 $(2, 4)$. $a = -1 < 0$ → 아래로 볼록 → 최댓값 $= 4$.' },

  // S9 (중) 완전제곱 변환
  { chapterCode: CODE, difficulty: 'medium', concept: '일반형 → 표준형 변환', requiredSkills: SKILLS_COMPLETE,
    stem: '$y = x^2 + 6x + 5$ 를 $y = (x - p)^2 + q$ 꼴로 바꾸면?',
    options: [
      { key: 'A', text: '$y = (x + 3)^2 - 4$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$y = (x + 3)^2 + 4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$5 - 9 = -4$인데 $+4$' },
      { key: 'C', text: '$y = (x - 3)^2 - 4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$p$ 부호 잘못' },
      { key: 'D', text: '$y = (x + 6)^2 - 31$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$6/2 = 3$인데 $6$' },
      { key: 'E', text: '$y = (x + 3)^2 + 5$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$-9$ 누락' },
    ],
    solution: '$x^2 + 6x + 5 = (x + 3)^2 - 9 + 5 = (x + 3)^2 - 4$.' },

  // S10 (중) 완전제곱 꼭짓점
  { chapterCode: CODE, difficulty: 'medium', concept: '완전제곱 → 꼭짓점 ($x^2 + 4x - 1$)', requiredSkills: SKILLS_COMPLETE,
    stem: '$y = x^2 + 4x - 1$ 의 꼭짓점은?',
    options: [
      { key: 'A', text: '$(-2, -5)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(2, -5)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$x$ 부호 잘못' },
      { key: 'C', text: '$(-2, 5)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$y$ 부호 잘못' },
      { key: 'D', text: '$(-4, -1)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$b$ 자체 사용' },
      { key: 'E', text: '$(0, -1)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$y$절편을 꼭짓점으로' },
    ],
    solution: '$x^2 + 4x - 1 = (x + 2)^2 - 4 - 1 = (x + 2)^2 - 5$. 꼭짓점 $(-2, -5)$.' },

  // S11 (중) x²-2x-3
  { chapterCode: CODE, difficulty: 'medium', concept: '완전제곱 ($x^2 - 2x - 3$)', requiredSkills: SKILLS_COMPLETE,
    stem: '$y = x^2 - 2x - 3$ 의 꼭짓점은?',
    options: [
      { key: 'A', text: '$(1, -4)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(-1, -4)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$x$ 부호 잘못' },
      { key: 'C', text: '$(1, 4)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$y$ 부호 잘못' },
      { key: 'D', text: '$(2, -3)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 식' },
      { key: 'E', text: '$(-2, -3)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 추측' },
    ],
    solution: '$x^2 - 2x - 3 = (x - 1)^2 - 1 - 3 = (x - 1)^2 - 4$. 꼭짓점 $(1, -4)$.' },

  // S12 (중) 대칭축
  { chapterCode: CODE, difficulty: 'medium', concept: '대칭축', requiredSkills: SKILLS_AXIS,
    stem: '$y = 3(x + 1)^2 + 2$ 의 대칭축은?',
    options: [
      { key: 'A', text: '$x = -1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$x + 1 = 0 \\to x = -1$ 부호 잘못' },
      { key: 'C', text: '$x = 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$y$ 좌표 답함' },
      { key: 'D', text: '$y = -1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '대칭축은 $x = $ 형태 (수직)' },
      { key: 'E', text: '$y = 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '꼭짓점 $y$ 좌표' },
    ],
    solution: '대칭축 = 꼭짓점 $x$ 좌표를 지나는 수직선 = $x = -1$.' },

  // S13 (중) (x+1)(x-3) x절편
  { chapterCode: CODE, difficulty: 'medium', concept: '인수분해 형태 $x$절편', requiredSkills: SKILLS_INTERCEPT,
    stem: '$y = (x + 1)(x - 3)$ 의 $x$절편은?',
    options: [
      { key: 'A', text: '$x = -1$ 또는 $x = 3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = 1$ 또는 $x = -3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '두 부호 모두 잘못' },
      { key: 'C', text: '$x = -1$ 또는 $x = -3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$x - 3$ 부호 잘못' },
      { key: 'D', text: '$x = 1$ 또는 $x = 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$x + 1$ 부호 잘못' },
      { key: 'E', text: '$x = -3$ (대칭축)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '한 절편만' },
    ],
    solution: '$y = 0$ → $x + 1 = 0$ 또는 $x - 3 = 0$ → $x = -1, 3$.' },

  // S14 (중) y절편
  { chapterCode: CODE, difficulty: 'medium', concept: '$y$절편 ($y = ax^2 + bx + c$)', requiredSkills: SKILLS_INTERCEPT,
    stem: '$y = x^2 + 4x + 3$ 의 $y$절편은?',
    options: [
      { key: 'A', text: '$(0, 3)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(3, 0)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$x$절편으로' },
      { key: 'C', text: '$(0, 4)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$b$ 답함' },
      { key: 'D', text: '$(0, -3)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$c = 3$ 부호 잘못' },
      { key: 'E', text: '$(0, 0)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$c \\neq 0$' },
    ],
    solution: '$y$절편: $x = 0$ 대입 → $y = c = 3$ → $(0, 3)$.' },

  // S15 (중) x²-3x x절편
  { chapterCode: CODE, difficulty: 'medium', concept: '공통인수 $x$절편', requiredSkills: SKILLS_INTERCEPT,
    stem: '$y = x^2 - 3x$ 의 $x$절편은?',
    options: [
      { key: 'A', text: '$x = 0$ 또는 $x = 3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = 3$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$x = 0$ 누락' },
      { key: 'C', text: '$x = -3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'D', text: '$x = \\pm 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 형식' },
      { key: 'E', text: '$x$절편 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '실근 있음' },
    ],
    solution: '$x(x - 3) = 0$ → $x = 0$ 또는 $x = 3$.' },

  // S16 (어려움) a≠1 완전제곱
  { chapterCode: CODE, difficulty: 'hard', concept: '$a \\neq 1$ 완전제곱 (꼭짓점·최솟값)', requiredSkills: SKILLS_COMPLETE,
    stem: '$y = 2x^2 - 8x + 5$ 의 꼭짓점과 최솟값은?',
    options: [
      { key: 'A', text: '$(2, -3)$, 최솟값 $-3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(2, 5)$, 최솟값 $5$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$y$절편 답함' },
      { key: 'C', text: '$(-2, -3)$, 최솟값 $-3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$x$ 부호 잘못' },
      { key: 'D', text: '$(2, 3)$, 최솟값 $3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$y$ 부호 잘못' },
      { key: 'E', text: '$(4, 5)$, 최솟값 $5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
    ],
    solution: '$2x^2 - 8x + 5 = 2(x^2 - 4x) + 5 = 2(x - 2)^2 - 8 + 5 = 2(x - 2)^2 - 3$. 꼭짓점 $(2, -3)$, 최솟값 $-3$.' },

  // S17 (어려움) 꼭짓점과 한 점
  { chapterCode: CODE, difficulty: 'hard', concept: '꼭짓점과 한 점으로 식 찾기', requiredSkills: SKILLS_FIT,
    stem: '꼭짓점이 $(1, 2)$ 이고 점 $(3, 10)$ 을 지나는 이차함수는?',
    options: [
      { key: 'A', text: '$y = 2(x - 1)^2 + 2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$y = (x - 1)^2 + 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$a = 1$ 추정 (실제 $2$ 필요)' },
      { key: 'C', text: '$y = 2(x + 1)^2 + 2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$p$ 부호 잘못' },
      { key: 'D', text: '$y = 2(x - 1)^2 - 2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$q$ 부호 잘못' },
      { key: 'E', text: '$y = 8(x - 1)^2 + 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$a$ 잘못 계산' },
    ],
    solution: '$y = a(x - 1)^2 + 2$. $(3, 10)$: $10 = a \\cdot 4 + 2 \\to a = 2$. → $y = 2(x - 1)^2 + 2$.' },

  // S18 (어려움) 해 조건 미정계수
  { chapterCode: CODE, difficulty: 'hard', concept: '해 조건 → 미정계수', requiredSkills: SKILLS_FIT,
    stem: '$y = x^2 + kx + 9$ 가 $x = 3$ 을 한 해로 가질 때 $k$ 는?',
    options: [
      { key: 'A', text: '$-6$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$6$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$3k = -18 \\to k = -6$ 부호 잘못' },
      { key: 'C', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '해 값 그대로' },
      { key: 'D', text: '$9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$c$ 값' },
      { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
    ],
    solution: '$x = 3$ 대입: $9 + 3k + 9 = 0 \\to 3k = -18 \\to k = -6$.' },

  // S19 (어려움) x축 대칭 관계
  { chapterCode: CODE, difficulty: 'hard', concept: '$y = ax^2$ 와 $y = -ax^2$ 관계', requiredSkills: SKILLS_REFLECTION,
    stem: '$y = 2x^2$ 와 $y = -2x^2$ 의 그래프 관계는?',
    options: [
      { key: 'A', text: '$x$축에 대해 대칭', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$y$축에 대해 대칭', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$y$축 대칭은 $x \\to -x$' },
      { key: 'C', text: '원점에 대해 대칭', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원점 대칭은 $(x, y) \\to (-x, -y)$' },
      { key: 'D', text: '같은 그래프', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$a$ 부호 다름' },
      { key: 'E', text: '관계 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '대칭 관계 존재' },
    ],
    solution: '$a \\to -a$ → 위 볼록 ↔ 아래 볼록. $y$ 부호가 반대 → $x$축 대칭.' },

  // S20 (어려움) 꼭짓점 x축 위
  { chapterCode: CODE, difficulty: 'hard', concept: '꼭짓점이 $x$축 위 (중근)', requiredSkills: SKILLS_INTERCEPT,
    stem: '$y = x^2 - 4x + 4$ 의 꼭짓점은 $x$축 위에 있는가?',
    options: [
      { key: 'A', text: '예 — 꼭짓점 $(2, 0)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '아니오 — 꼭짓점 $y > 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$(x-2)^2$ → $y = 0$' },
      { key: 'C', text: '꼭짓점 $(2, 4)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$y$절편을 꼭짓점으로' },
      { key: 'D', text: '꼭짓점 $(-2, 0)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$x$ 부호 잘못' },
      { key: 'E', text: '꼭짓점이 두 개', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '이차함수는 꼭짓점 하나' },
    ],
    solution: '$x^2 - 4x + 4 = (x - 2)^2$. 꼭짓점 $(2, 0)$. $y = 0$이므로 $x$축 위.' },
];

export const K_G9_MATH3_CH03_QUAD_FN_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
