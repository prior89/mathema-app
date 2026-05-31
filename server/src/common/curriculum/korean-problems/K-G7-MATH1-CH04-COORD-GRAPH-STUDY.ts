/**
 * K-G7-MATH1-CH04-COORD-GRAPH — STUDY pool (single-step, 20문제).
 * 좌표평면과 그래프 — Mastery 3-step과 별도 변형 문제.
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5. LLM 미사용.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G7-MATH1-CH04-COORD-GRAPH';
const SKILLS_COORD = ['point_coordinate_reading', 'ordered_pair'];
const SKILLS_AXIS = ['axis_membership', 'origin_recognition'];
const SKILLS_QUAD = ['quadrant_identification', 'sign_to_quadrant'];
const SKILLS_DIST = ['distance_axis_parallel', 'coordinate_difference'];
const SKILLS_SYM = ['axis_reflection', 'origin_reflection'];
const SKILLS_GRAPH = ['graph_slope_speed', 'rate_calculation'];
const SKILLS_MIXED = ['quadrant_condition', 'axis_condition', 'inequality_solving'];
const SKILLS_AREA = ['triangle_area_coordinate', 'base_height_recognition'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) 좌표 읽기
  { chapterCode: CODE, difficulty: 'easy', concept: '점의 좌표 읽기 (음수 포함)', requiredSkills: SKILLS_COORD,
    stem: '점 $Q(-2, 5)$ 의 $x$좌표와 $y$좌표는?',
    options: [
      { key: 'A', text: '$x$좌표 $= -2,\\ y$좌표 $= 5$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x$좌표 $= 5,\\ y$좌표 $= -2$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$x, y$ 순서 바꿈' },
      { key: 'C', text: '$x$좌표 $= 2,\\ y$좌표 $= 5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '음수 부호 누락' },
      { key: 'D', text: '$x$좌표 $= -2,\\ y$좌표 $= -5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$y$ 부호 잘못' },
      { key: 'E', text: '$x$좌표 $= -5,\\ y$좌표 $= -2$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '순서+부호 모두 잘못' },
    ],
    solution: '순서쌍 $(x, y)$ 정의: 첫 항이 $x$, 둘째 항이 $y$. → $x = -2,\\ y = 5$.' },

  // S2 (쉬움) x축 위 점 조건
  { chapterCode: CODE, difficulty: 'easy', concept: '$x$축 위 점의 조건', requiredSkills: SKILLS_AXIS,
    stem: '점이 $x$축 위에 있을 조건은?',
    options: [
      { key: 'A', text: '$y$좌표 $= 0$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x$좌표 $= 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$y$축 조건 답함' },
      { key: 'C', text: '$x$좌표 $= y$좌표', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$y = x$ 직선 조건' },
      { key: 'D', text: '두 좌표 모두 $0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원점만의 조건' },
      { key: 'E', text: '두 좌표 모두 양수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$1$사분면 조건' },
    ],
    solution: '$x$축은 $y = 0$인 모든 점의 집합.' },

  // S3 (쉬움) y축 위 점
  { chapterCode: CODE, difficulty: 'easy', concept: '$y$축 위 점 식별', requiredSkills: SKILLS_AXIS,
    stem: '다음 중 $y$축 위에 있는 점은?',
    options: [
      { key: 'A', text: '$(0, 7)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(7, 0)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$x$축 위 점' },
      { key: 'C', text: '$(3, 5)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '제1사분면 내부 점' },
      { key: 'D', text: '$(7, 7)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$y = x$ 직선 위' },
      { key: 'E', text: '$(0, 0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원점은 두 축 교점 — 보통 별도로 답함' },
    ],
    solution: '$y$축 조건: $x$좌표 $= 0$. $(0, 7)$만 해당.' },

  // S4 (쉬움) 1사분면
  { chapterCode: CODE, difficulty: 'easy', concept: '1사분면 판별', requiredSkills: SKILLS_QUAD,
    stem: '점 $(4, 1)$ 은 몇 사분면에 있는가?',
    options: [
      { key: 'A', text: '제$1$사분면', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '제$2$사분면', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x$ 부호 잘못 인식' },
      { key: 'C', text: '제$3$사분면', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '두 부호 모두 잘못' },
      { key: 'D', text: '제$4$사분면', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$y$ 부호 잘못' },
      { key: 'E', text: '$x$축 위', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$y$좌표 $\\neq 0$' },
    ],
    solution: '$x = 4 > 0,\\ y = 1 > 0$ → 제$1$사분면.' },

  // S5 (쉬움) 2사분면
  { chapterCode: CODE, difficulty: 'easy', concept: '2사분면 판별', requiredSkills: SKILLS_QUAD,
    stem: '점 $(-5, 3)$ 은 몇 사분면에 있는가?',
    options: [
      { key: 'A', text: '제$2$사분면', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '제$1$사분면', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$x$ 음수 무시' },
      { key: 'C', text: '제$3$사분면', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$y$ 부호 잘못' },
      { key: 'D', text: '제$4$사분면', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '두 부호 모두 잘못' },
      { key: 'E', text: '$y$축 위', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x \\neq 0$' },
    ],
    solution: '$x = -5 < 0,\\ y = 3 > 0$ → 제$2$사분면.' },

  // S6 (쉬움) 4사분면
  { chapterCode: CODE, difficulty: 'easy', concept: '4사분면 판별', requiredSkills: SKILLS_QUAD,
    stem: '점 $(2, -6)$ 은 몇 사분면에 있는가?',
    options: [
      { key: 'A', text: '제$4$사분면', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '제$1$사분면', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$y$ 음수 무시' },
      { key: 'C', text: '제$2$사분면', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$x, y$ 부호 혼동' },
      { key: 'D', text: '제$3$사분면', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$x$ 부호 잘못' },
      { key: 'E', text: '$x$축 위', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$y \\neq 0$' },
    ],
    solution: '$x = 2 > 0,\\ y = -6 < 0$ → 제$4$사분면.' },

  // S7 (중) 3사분면
  { chapterCode: CODE, difficulty: 'medium', concept: '3사분면 판별', requiredSkills: SKILLS_QUAD,
    stem: '점 $(-4, -1)$ 은 몇 사분면에 있는가?',
    options: [
      { key: 'A', text: '제$3$사분면', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '제$1$사분면', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '음수 부호 모두 무시' },
      { key: 'C', text: '제$2$사분면', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$y$ 부호 잘못' },
      { key: 'D', text: '제$4$사분면', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$x$ 부호 잘못' },
      { key: 'E', text: '원점', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '두 좌표가 모두 $0$이 아님' },
    ],
    solution: '$x < 0$ 이고 $y < 0$ → 제$3$사분면.' },

  // S8 (중) 부호 역추적 (4사분면)
  { chapterCode: CODE, difficulty: 'medium', concept: '사분면 → 부호 역추적 (4사분면)', requiredSkills: SKILLS_QUAD,
    stem: '점 $P(a, b)$ 가 제$4$사분면 위에 있다. $a, b$ 의 부호는?',
    options: [
      { key: 'A', text: '$a > 0,\\ b < 0$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$a > 0,\\ b > 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$1$사분면' },
      { key: 'C', text: '$a < 0,\\ b < 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$3$사분면' },
      { key: 'D', text: '$a < 0,\\ b > 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$2$사분면' },
      { key: 'E', text: '$a = 0,\\ b < 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$y$축 음의 부분' },
    ],
    solution: '제$4$사분면: $x > 0$ 이고 $y < 0$ → $a > 0, b < 0$.' },

  // S9 (중) 거리 y축 평행
  { chapterCode: CODE, difficulty: 'medium', concept: '두 점 거리 ($y$축 평행)', requiredSkills: SKILLS_DIST,
    stem: '두 점 $A(-2, 3)$ 와 $B(-2, -4)$ 사이의 거리는?',
    options: [
      { key: 'A', text: '$7$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$3 + (-4) = -1$ 절댓값 또는 잘못된 식' },
      { key: 'C', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\sqrt{...}$ 공식 무관' },
      { key: 'D', text: '$-7$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '거리는 양수' },
      { key: 'E', text: '$12$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$|3| \\times |-4|$ 곱셈으로' },
    ],
    solution: '$x$좌표 같음 → $y$좌표 차의 절댓값. $|3 - (-4)| = |7| = 7$.' },

  // S10 (중) 거리 x축 평행
  { chapterCode: CODE, difficulty: 'medium', concept: '두 점 거리 ($x$축 평행)', requiredSkills: SKILLS_DIST,
    stem: '두 점 $A(1, 4)$ 와 $B(6, 4)$ 사이의 거리는?',
    options: [
      { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$7$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$1 + 6$ 합으로' },
      { key: 'C', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 차' },
      { key: 'D', text: '$8$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$y$ 좌표 포함해 계산 시도' },
      { key: 'E', text: '$4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$y$ 좌표 그대로 답함' },
    ],
    solution: '$y$좌표 같음 → $x$좌표 차의 절댓값. $|6 - 1| = 5$.' },

  // S11 (중) 축 위 이동
  { chapterCode: CODE, difficulty: 'medium', concept: '축 위 이동 판별', requiredSkills: SKILLS_AXIS,
    stem: '점 $(0, 3)$ 이 $(0, -2)$ 로 이동했다. 어느 축을 따라 이동했는가?',
    options: [
      { key: 'A', text: '$y$축', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x$축', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x$ 좌표 변화 없음 (둘 다 $0$)' },
      { key: 'C', text: '원점에서 이동 아님', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원점 의미와 혼동' },
      { key: 'D', text: '대각선 이동', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x$ 좌표 변화 없으니 대각선 아님' },
      { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$y$좌표 변화만 있어 명확' },
    ],
    solution: '$x$좌표 그대로, $y$좌표만 $3 \\to -2$로 변함 → $y$축 따라 이동.' },

  // S12 (중) x축 대칭
  { chapterCode: CODE, difficulty: 'medium', concept: '$x$축 대칭 (음수 좌표)', requiredSkills: SKILLS_SYM,
    stem: '점 $(5, -1)$ 의 $x$축에 대한 대칭점은?',
    options: [
      { key: 'A', text: '$(5, 1)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(-5, -1)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$y$축 대칭' },
      { key: 'C', text: '$(-5, 1)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원점 대칭' },
      { key: 'D', text: '$(5, -1)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$y$ 부호 안 바꿈' },
      { key: 'E', text: '$(-1, 5)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '좌표 순서 바꿈' },
    ],
    solution: '$x$축 대칭: $x$좌표 그대로, $y$좌표 부호 반대. $(5, -1) \\to (5, 1)$.' },

  // S13 (중) y축 대칭
  { chapterCode: CODE, difficulty: 'medium', concept: '$y$축 대칭', requiredSkills: SKILLS_SYM,
    stem: '점 $(4, 7)$ 의 $y$축에 대한 대칭점은?',
    options: [
      { key: 'A', text: '$(-4, 7)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(4, -7)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x$축 대칭' },
      { key: 'C', text: '$(-4, -7)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원점 대칭' },
      { key: 'D', text: '$(4, 7)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$x$ 부호 안 바꿈' },
      { key: 'E', text: '$(7, 4)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '좌표 순서 바꿈' },
    ],
    solution: '$y$축 대칭: $y$좌표 그대로, $x$좌표 부호 반대. $(4, 7) \\to (-4, 7)$.' },

  // S14 (중) 원점 대칭
  { chapterCode: CODE, difficulty: 'medium', concept: '원점 대칭', requiredSkills: SKILLS_SYM,
    stem: '점 $(-2, 5)$ 의 원점에 대한 대칭점은?',
    options: [
      { key: 'A', text: '$(2, -5)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(-2, -5)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x$축 대칭만' },
      { key: 'C', text: '$(2, 5)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$y$축 대칭만' },
      { key: 'D', text: '$(5, -2)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '좌표 순서 바꿈' },
      { key: 'E', text: '$(-2, 5)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '두 부호 모두 안 바꿈' },
    ],
    solution: '원점 대칭: 두 좌표 모두 부호 반대. $(-2, 5) \\to (2, -5)$.' },

  // S15 (중) 그래프 속력
  { chapterCode: CODE, difficulty: 'medium', concept: '시간-거리 그래프 → 속력', requiredSkills: SKILLS_GRAPH,
    stem: '시간-거리 그래프에서 원점에서 출발한 직선이 $4$ 시간 동안 $80\\text{km}$ 이동했다. 속력은?',
    options: [
      { key: 'A', text: '$20\\ \\text{km/h}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$80\\ \\text{km/h}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '거리 자체를 답함' },
      { key: 'C', text: '$4\\ \\text{km/h}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '시간을 답함' },
      { key: 'D', text: '$320\\ \\text{km/h}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '시간 × 거리 곱셈' },
      { key: 'E', text: '$\\dfrac{1}{20}\\ \\text{km/h}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\dfrac{시간}{거리}$ 뒤집힘' },
    ],
    solution: '속력 $= \\dfrac{거리}{시간} = \\dfrac{80}{4} = 20$ km/h.' },

  // S16 (어려움) 문자좌표 사분면 (조건)
  { chapterCode: CODE, difficulty: 'hard', concept: '문자좌표 사분면 부등식', requiredSkills: SKILLS_MIXED,
    stem: '점 $(a - 2,\\ 3 - a)$ 가 제$1$사분면 위에 있다. $a$ 의 값의 범위는?',
    options: [
      { key: 'A', text: '$2 < a < 3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$a > 2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$y > 0$ 조건 누락' },
      { key: 'C', text: '$a < 3$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$x > 0$ 조건 누락' },
      { key: 'D', text: '$a > 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$3 - a > 0 \\to a < 3$인데 부호 잘못' },
      { key: 'E', text: '모든 실수', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '두 부등식 미적용' },
    ],
    solution: '$x = a - 2 > 0 \\to a > 2$, $y = 3 - a > 0 \\to a < 3$. 공통 → $2 < a < 3$.' },

  // S17 (어려움) 축 위 조건 → 미정계수
  { chapterCode: CODE, difficulty: 'hard', concept: '$x$축 위 조건 → 미정계수', requiredSkills: SKILLS_MIXED,
    stem: '점 $(2a + 4,\\ a - 1)$ 이 $x$축 위에 있다. $a$ 의 값은?',
    options: [
      { key: 'A', text: '$a = 1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$a = -2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$y$축 조건 ($x = 0$) 적용' },
      { key: 'C', text: '$a = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원점 조건과 혼동' },
      { key: 'D', text: '$a = -4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$2a + 4 = 0$ 잘못 적용' },
      { key: 'E', text: '$a = -1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$a - 1 = 0$에서 부호 잘못' },
    ],
    solution: '$x$축 위 조건: $y = 0$. $a - 1 = 0 \\to a = 1$.' },

  // S18 (어려움) 직각삼각형 넓이
  { chapterCode: CODE, difficulty: 'hard', concept: '좌표평면 직각삼각형 넓이', requiredSkills: SKILLS_AREA,
    stem: '세 점 $(0, 0),\\ (6, 0),\\ (0, 4)$ 을 꼭짓점으로 하는 삼각형의 넓이는?',
    options: [
      { key: 'A', text: '$12$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$24$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\dfrac{1}{2}$ 누락 ($6 \\times 4$)' },
      { key: 'C', text: '$10$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$6 + 4$ 합산' },
      { key: 'D', text: '$5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$(6 + 4) / 2$ 평균' },
      { key: 'E', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '밑변 또는 높이만 답함' },
    ],
    solution: '$x$축 변($6$)을 밑변, $y$축 변($4$)을 높이. 넓이 $= \\dfrac{1}{2} \\times 6 \\times 4 = 12$.' },

  // S19 (어려움) 축 평행 변 삼각형
  { chapterCode: CODE, difficulty: 'hard', concept: '축 평행 두 변 삼각형 넓이', requiredSkills: SKILLS_AREA,
    stem: '세 점 $A(2, 1),\\ B(6, 1),\\ C(6, 5)$ 의 삼각형 넓이는?',
    options: [
      { key: 'A', text: '$8$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$16$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\dfrac{1}{2}$ 누락' },
      { key: 'C', text: '$24$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '꼭짓점 좌표 잘못 읽음' },
      { key: 'D', text: '$12$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$4 + 4 + 4$ 같은 잘못된 합' },
      { key: 'E', text: '$10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 밑변·높이' },
    ],
    solution: '$AB$ ($x$축 평행, 길이 $4$) 밑변, $BC$ ($y$축 평행, 길이 $4$) 높이. 넓이 $= \\dfrac{1}{2} \\times 4 \\times 4 = 8$.' },

  // S20 (어려움) 거리-시간 만남
  { chapterCode: CODE, difficulty: 'hard', concept: '거리-시간 그래프 (두 사람 만남)', requiredSkills: SKILLS_GRAPH,
    stem: 'A는 $t = 0$ 에 위치 $20\\text{m}$ 에서 출발해 매초 $-1\\text{m}$ 씩 이동 (원점 방향), B는 $t = 0$ 에 위치 $0\\text{m}$ 에서 출발해 매초 $+1\\text{m}$ 씩 이동한다. 두 사람이 만나는 시각은?',
    options: [
      { key: 'A', text: '$t = 10$초', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$t = 20$초', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: 'B 속력 무시 (A만으로 $20/1$)' },
      { key: 'C', text: '$t = 5$초', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$20/(1+1) = 10$인데 잘못 나눔' },
      { key: 'D', text: '$t = 0$초', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '시작 위치 다름' },
      { key: 'E', text: '$t = 2$초', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
    ],
    solution: '시각 $t$ 에 A 위치 $= 20 - t$, B 위치 $= t$. 같으려면 $20 - t = t \\to t = 10$초.' },
];

export const K_G7_MATH1_CH04_COORD_GRAPH_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
