/**
 * K-G10-CS2-CH01-COORD-FIG — STUDY pool (single-step, 20문제).
 * 평면좌표와 도형의 방정식 — 거리·중점, 직선, 원.
 * Mastery 3-step과 별도 변형 문제. 고1 공통수학2 (G10).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5. LLM 미사용.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G10-CS2-CH01-COORD-FIG';
const SKILLS_DIST = ['distance_formula'];
const SKILLS_MID = ['midpoint_formula'];
const SKILLS_INT = ['internal_division'];
const SKILLS_EXT = ['external_division'];
const SKILLS_SLOPE = ['slope_two_points'];
const SKILLS_LINE_PT = ['line_point_slope', 'line_two_points'];
const SKILLS_PAR = ['parallel_lines_slope'];
const SKILLS_PERP = ['perpendicular_slope_product'];
const SKILLS_CIRCLE_EQ = ['circle_center_radius', 'circle_equation_from_form'];
const SKILLS_PT_LINE = ['point_line_distance'];
const SKILLS_CIRCLE_LINE = ['circle_tangent_condition'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) 거리 (3,4)
  { chapterCode: CODE, difficulty: 'easy', concept: '두 점 거리', requiredSkills: SKILLS_DIST,
    stem: '$A(1, 3)$, $B(4, 7)$ 사이의 거리?',
    options: [
      { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\sqrt{7}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3 + 4$ 합' },
      { key: 'C', text: '$7$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$|3-1| + |7-3|$' },
      { key: 'D', text: '$\\sqrt{25}$ 그대로', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '단순화 안 함' },
      { key: 'E', text: '$25$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '제곱근 누락' },
    ],
    solution: '$d = \\sqrt{(4-1)^2 + (7-3)^2} = \\sqrt{9 + 16} = 5$.' },

  // S2 (쉬움) 중점 (0,0)
  { chapterCode: CODE, difficulty: 'easy', concept: '중점 (원점 포함)', requiredSkills: SKILLS_MID,
    stem: '$A(0, 0)$, $B(6, 8)$ 의 중점?',
    options: [
      { key: 'A', text: '$(3, 4)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(6, 8)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$B$ 그대로' },
      { key: 'C', text: '$(4, 3)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '좌표 바꿈' },
      { key: 'D', text: '$(0, 0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$A$ 자체' },
      { key: 'E', text: '$(12, 16)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$/2$ 누락' },
    ],
    solution: '중점 $= \\left( \\dfrac{0+6}{2}, \\dfrac{0+8}{2} \\right) = (3, 4)$.' },

  // S3 (쉬움) 원점 거리
  { chapterCode: CODE, difficulty: 'easy', concept: '원점과 점 거리 (음수)', requiredSkills: SKILLS_DIST,
    stem: '$P(-3, 4)$ 와 원점 사이의 거리?',
    options: [
      { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\sqrt{7}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-3 + 4 = 1$ 잘못' },
      { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 식' },
      { key: 'D', text: '$-5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '거리는 양수' },
      { key: 'E', text: '$25$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '제곱근 누락' },
    ],
    solution: '$\\sqrt{(-3)^2 + 4^2} = \\sqrt{9 + 16} = 5$.' },

  // S4 (쉬움) 수평 중점
  { chapterCode: CODE, difficulty: 'easy', concept: '수평선 위 중점', requiredSkills: SKILLS_MID,
    stem: '$A(2, 5)$, $B(8, 5)$ 의 중점?',
    options: [
      { key: 'A', text: '$(5, 5)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(5, 10)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$y$ 더함' },
      { key: 'C', text: '$(10, 5)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$x$ 합' },
      { key: 'D', text: '$(3, 5)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$8 - 2$ 차' },
      { key: 'E', text: '$(5, 0)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$y$ 누락' },
    ],
    solution: '$\\left( \\dfrac{2 + 8}{2}, \\dfrac{5 + 5}{2} \\right) = (5, 5)$.' },

  // S5 (쉬움) (x+1)²+(y-2)²=9 중심
  { chapterCode: CODE, difficulty: 'easy', concept: '원 중심 (음수 $p$)', requiredSkills: SKILLS_CIRCLE_EQ,
    stem: '$(x + 1)^2 + (y - 2)^2 = 9$ 의 중심?',
    options: [
      { key: 'A', text: '$(-1, 2)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(1, -2)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '두 부호 모두 잘못' },
      { key: 'C', text: '$(1, 2)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$x$ 부호 잘못' },
      { key: 'D', text: '$(-1, -2)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$y$ 부호 잘못' },
      { key: 'E', text: '$(0, 0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원점 가정' },
    ],
    solution: '$(x - p)^2 + (y - q)^2 = r^2$ 꼴: $p = -1$, $q = 2$ → 중심 $(-1, 2)$.' },

  // S6 (쉬움) 반지름
  { chapterCode: CODE, difficulty: 'easy', concept: '원 반지름 ($r^2 = 9$)', requiredSkills: SKILLS_CIRCLE_EQ,
    stem: '$(x + 1)^2 + (y - 2)^2 = 9$ 의 반지름?',
    options: [
      { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$9$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$r^2$ 자체' },
      { key: 'C', text: '$\\sqrt{9}$ 그대로', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '단순화 안 함' },
      { key: 'D', text: '$81$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$r^2$ 또 제곱' },
      { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 값' },
    ],
    solution: '$r^2 = 9 \\to r = 3$.' },

  // S7 (중) 1:2 내분
  { chapterCode: CODE, difficulty: 'medium', concept: '내분점 ($1:2$)', requiredSkills: SKILLS_INT,
    stem: '$A(2, 0)$, $B(8, 0)$ 을 $1:2$ 로 내분한 점?',
    options: [
      { key: 'A', text: '$(4, 0)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(6, 0)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$2:1$로 적용' },
      { key: 'C', text: '$(5, 0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '중점' },
      { key: 'D', text: '$(3, 0)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
      { key: 'E', text: '$(10, 0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$A + B$ 합' },
    ],
    solution: '내분 $m:n = 1:2$: $\\dfrac{1 \\cdot 8 + 2 \\cdot 2}{1 + 2} = \\dfrac{12}{3} = 4$. → $(4, 0)$.' },

  // S8 (중) 기울기
  { chapterCode: CODE, difficulty: 'medium', concept: '두 점 → 기울기 ($2$)', requiredSkills: SKILLS_SLOPE,
    stem: '두 점 $(2, 3)$, $(6, 11)$ 을 지나는 직선의 기울기?',
    options: [
      { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '뒤집음' },
      { key: 'C', text: '$8$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\Delta y$만' },
      { key: 'D', text: '$4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\Delta x$ 잘못' },
      { key: 'E', text: '$-2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
    ],
    solution: '$\\dfrac{11 - 3}{6 - 2} = \\dfrac{8}{4} = 2$.' },

  // S9 (중) 점-기울기 식
  { chapterCode: CODE, difficulty: 'medium', concept: '점-기울기 식', requiredSkills: SKILLS_LINE_PT,
    stem: '기울기 $-1$, 점 $(2, 5)$ 를 지나는 직선의 방정식?',
    options: [
      { key: 'A', text: '$y = -x + 7$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$y = -x + 5$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$y$절편 계산 누락' },
      { key: 'C', text: '$y = x + 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '기울기 부호 잘못' },
      { key: 'D', text: '$y = -x - 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$y$절편 부호 잘못' },
      { key: 'E', text: '$y = -x + 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$x$ 좌표 그대로' },
    ],
    solution: '$y - 5 = -1 \\cdot (x - 2) \\to y = -x + 7$.' },

  // S10 (중) 두 점 직선
  { chapterCode: CODE, difficulty: 'medium', concept: '두 점 → 직선식', requiredSkills: SKILLS_LINE_PT,
    stem: '두 점 $(1, 3)$, $(4, 9)$ 를 지나는 직선?',
    options: [
      { key: 'A', text: '$y = 2x + 1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$y = 2x - 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$y$절편 부호 잘못' },
      { key: 'C', text: '$y = \\dfrac{1}{2} x + 3$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '기울기 뒤집음' },
      { key: 'D', text: '$y = 3x$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
      { key: 'E', text: '$y = -2x + 5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '기울기 부호 잘못' },
    ],
    solution: '기울기 $= 6/3 = 2$. $y = 2x + b$, $(1, 3)$ 대입: $b = 1$. → $y = 2x + 1$.' },

  // S11 (중) 평행
  { chapterCode: CODE, difficulty: 'medium', concept: '평행 (다른 $y$절편)', requiredSkills: SKILLS_PAR,
    stem: '$y = 3x - 2$ 와 평행하고 $(0, 5)$ 를 지나는 직선?',
    options: [
      { key: 'A', text: '$y = 3x + 5$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$y = 3x - 5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$y$절편 부호 잘못' },
      { key: 'C', text: '$y = -3x + 5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '기울기 부호 잘못' },
      { key: 'D', text: '$y = -\\dfrac{1}{3} x + 5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '수직 기울기' },
      { key: 'E', text: '$y = 5x + 3$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '기울기와 $y$절편 바꿈' },
    ],
    solution: '평행 → 기울기 같음 ($3$). $y$절편 $5$ → $y = 3x + 5$.' },

  // S12 (중) 수직
  { chapterCode: CODE, difficulty: 'medium', concept: '수직 조건 (원점 지남)', requiredSkills: SKILLS_PERP,
    stem: '$y = 3x - 2$ 와 수직하고 원점을 지나는 직선?',
    options: [
      { key: 'A', text: '$y = -\\dfrac{1}{3} x$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$y = \\dfrac{1}{3} x$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '음수 누락' },
      { key: 'C', text: '$y = -3x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부호만 바꿈' },
      { key: 'D', text: '$y = 3x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평행으로 잘못' },
      { key: 'E', text: '$y = -\\dfrac{1}{3} x + 1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '원점 통과 (y절편 0)' },
    ],
    solution: '수직 → 기울기 곱 $= -1$. $3 \\cdot m = -1 \\to m = -1/3$. 원점 → $y$절편 $0$.' },

  // S13 (중) x²+y²=49
  { chapterCode: CODE, difficulty: 'medium', concept: '원점 원', requiredSkills: SKILLS_CIRCLE_EQ,
    stem: '$x^2 + y^2 = 49$ 의 중심과 반지름?',
    options: [
      { key: 'A', text: '중심 $(0, 0)$, 반지름 $7$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '중심 $(0, 0)$, 반지름 $49$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$r^2$ 그대로' },
      { key: 'C', text: '중심 $(7, 7)$, 반지름 $7$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 중심' },
      { key: 'D', text: '중심 $(0, 0)$, 반지름 $\\sqrt{49}$ 그대로', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '단순화 안 함' },
      { key: 'E', text: '중심 $(0, 0)$, 반지름 $14$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2 \\times 7$ 잘못' },
    ],
    solution: '$x^2 + y^2 = r^2$ → 중심 $(0, 0)$, $r = \\sqrt{49} = 7$.' },

  // S14 (중) (-5,0) 위?
  { chapterCode: CODE, difficulty: 'medium', concept: '점이 원 위 (음수 좌표)', requiredSkills: SKILLS_CIRCLE_EQ,
    stem: '$P(-5, 0)$ 가 원 $x^2 + y^2 = 25$ 위에 있는가?',
    options: [
      { key: 'A', text: '예 (식 만족)', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '아니오', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$(-5)^2 = 25$ 미적용' },
      { key: 'C', text: '원 안에 있음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '위에 있음' },
      { key: 'D', text: '원 밖에 있음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '위에 있음' },
      { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '명확' },
    ],
    solution: '$(-5)^2 + 0^2 = 25 = r^2$ → 원 위 점.' },

  // S15 (중) 원점-직선 거리
  { chapterCode: CODE, difficulty: 'medium', concept: '원점과 직선 거리', requiredSkills: SKILLS_PT_LINE,
    stem: '원점과 직선 $5x + 12y - 26 = 0$ 의 거리?',
    options: [
      { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$26$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '분모 누락' },
      { key: 'C', text: '$\\dfrac{26}{17}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$|a| + |b|$ 분모' },
      { key: 'D', text: '$13$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\sqrt{a^2 + b^2}$ 잘못' },
      { key: 'E', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '뒤집음' },
    ],
    solution: '$d = \\dfrac{|5 \\cdot 0 + 12 \\cdot 0 - 26|}{\\sqrt{25 + 144}} = \\dfrac{26}{13} = 2$.' },

  // S16 (어려움) 외분
  { chapterCode: CODE, difficulty: 'hard', concept: '외분점 ($1:2$)', requiredSkills: SKILLS_EXT,
    stem: '$A(0, 0)$, $B(6, 12)$ 를 $1 : 2$ 로 외분?',
    options: [
      { key: 'A', text: '$(-6, -12)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(6, 12)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '내분으로 잘못' },
      { key: 'C', text: '$(2, 4)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '내분 1:2' },
      { key: 'D', text: '$(-3, -6)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
      { key: 'E', text: '$(3, 6)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '중점' },
    ],
    solution: '외분 $m:n$: $\\dfrac{mB - nA}{m - n}$. $x = \\dfrac{1 \\cdot 6 - 2 \\cdot 0}{1 - 2} = -6$. $y = -12$.' },

  // S17 (어려움) 수직 조건 m
  { chapterCode: CODE, difficulty: 'hard', concept: '수직 조건 → $m$', requiredSkills: SKILLS_PERP,
    stem: '두 직선 $y = 3x + 1$ 과 $y = mx - 2$ 가 수직일 때 $m$?',
    options: [
      { key: 'A', text: '$-\\dfrac{1}{3}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{1}{3}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '음수 누락' },
      { key: 'C', text: '$-3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부호만 바꿈' },
      { key: 'D', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평행 조건' },
      { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '관련 없음' },
    ],
    solution: '$3 \\cdot m = -1 \\to m = -1/3$.' },

  // S18 (어려움) 점-직선 거리
  { chapterCode: CODE, difficulty: 'hard', concept: '일반 점-직선 거리', requiredSkills: SKILLS_PT_LINE,
    stem: '점 $(2, 3)$ 과 직선 $4x - 3y + 5 = 0$ 의 거리?',
    options: [
      { key: 'A', text: '$\\dfrac{4}{5}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{4}{\\sqrt{7}}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\sqrt{16 + 9} = 5$인데 잘못' },
      { key: 'C', text: '$4$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '분모 누락' },
      { key: 'D', text: '$\\dfrac{4}{\\sqrt{25}}$ 그대로', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '단순화 안 함' },
      { key: 'E', text: '$\\dfrac{14}{5}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$|8 - 9 + 5| = 4$인데 $|8 + 9 - 3|$' },
    ],
    solution: '$d = \\dfrac{|4 \\cdot 2 - 3 \\cdot 3 + 5|}{\\sqrt{16 + 9}} = \\dfrac{|8 - 9 + 5|}{5} = \\dfrac{4}{5}$.' },

  // S19 (어려움) 원과 직선 접
  { chapterCode: CODE, difficulty: 'hard', concept: '원과 직선 접 조건', requiredSkills: SKILLS_CIRCLE_LINE,
    stem: '원 $x^2 + y^2 = 4$ 와 직선 $y = x + k$ 가 접하기 위한 $k$?',
    options: [
      { key: 'A', text: '$k = \\pm 2\\sqrt{2}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$k = 2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\sqrt{2}$ 누락' },
      { key: 'C', text: '$k = \\pm 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$r = 2$ 자체' },
      { key: 'D', text: '$k = \\pm 4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\sqrt{2}$ 누락 + $2$배' },
      { key: 'E', text: '$k = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원점 통과 (직선이 원 자름)' },
    ],
    solution: '원점과 $x - y + k = 0$ 거리 $= r$: $\\dfrac{|k|}{\\sqrt{2}} = 2 \\to |k| = 2\\sqrt{2}$.' },

  // S20 (어려움) 중심·반지름 → 식
  { chapterCode: CODE, difficulty: 'hard', concept: '중심·반지름 → 원 식', requiredSkills: SKILLS_CIRCLE_EQ,
    stem: '중심 $(-1, 2)$, 반지름 $3$ 인 원의 방정식?',
    options: [
      { key: 'A', text: '$(x + 1)^2 + (y - 2)^2 = 9$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(x - 1)^2 + (y + 2)^2 = 9$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '두 부호 잘못' },
      { key: 'C', text: '$(x + 1)^2 + (y - 2)^2 = 3$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$r$ 그대로 (제곱 X)' },
      { key: 'D', text: '$(x - 1)^2 + (y - 2)^2 = 9$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$x$ 부호 잘못' },
      { key: 'E', text: '$x^2 + y^2 = 9$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '중심 이동 누락' },
    ],
    solution: '$(x - (-1))^2 + (y - 2)^2 = 3^2 \\to (x + 1)^2 + (y - 2)^2 = 9$.' },
];

export const K_G10_CS2_CH01_COORD_FIG_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
