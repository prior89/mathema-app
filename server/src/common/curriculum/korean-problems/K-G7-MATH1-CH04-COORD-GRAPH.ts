/**
 * K-G7-MATH1-CH04-COORD-GRAPH (좌표평면과 그래프) — 20문제 3-step Mastery.
 * 중1 — 순서쌍 → 좌표평면 → 사분면 → 거리/대칭 → 그래프 해석.
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 * 주요 errorCode 분배:
 *   COORDINATE_ERROR 5 (Q1,4,7,12,14) / CONCEPT_MISUNDERSTANDING 4 (Q3,8,11,16)
 *   SIGN_ERROR 4 (Q2,5,6,13) / ARITHMETIC_ERROR 3 (Q9,10,15)
 *   CONDITION_MISSING 2 (Q17,19) / FORMULA_SELECTION_ERROR 1 (Q18) / GRAPH_READING_ERROR 1 (Q20)
 *
 * 각 문제 = 3 step (CONCEPT/PROCESS/ANSWER), 각 step = 5지선다.
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G7-MATH1-CH04-COORD-GRAPH';
const SKILLS_COORD = ['ordered_pair', 'coordinate_reading', 'sign_of_coordinates'];
const SKILLS_QUAD = ['quadrant_identification', 'sign_combinations'];
const SKILLS_AXIS = ['axis_recognition', 'coordinate_on_axis'];
const SKILLS_DIST = ['distance_axis_parallel', 'absolute_value_difference'];
const SKILLS_SYM = ['reflection_axis', 'reflection_origin', 'sign_flip'];
const SKILLS_GRAPH = ['graph_interpretation', 'slope_as_rate'];
const SKILLS_AREA = ['triangle_area_coord', 'right_triangle_legs'];
const SKILLS_MIXED = ['condition_check', 'algebraic_substitution'];

const problems: KoreanProblemSeed[] = [
  // ────────── Q1 (쉬움) 점 (3,2)의 좌표 · COORDINATE_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'easy', concept: '점의 좌표 읽기', requiredSkills: SKILLS_COORD,
    stem: '점 $P(3, 2)$ 의 $x$좌표와 $y$좌표는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '순서쌍 $(a, b)$ 에서 앞은? 뒤는?',
        options: [
          { key: 'A', text: '앞 $a$ = $x$좌표, 뒤 $b$ = $y$좌표', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '앞 = $y$좌표, 뒤 = $x$좌표', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '순서 반대' },
          { key: 'C', text: '앞 뒤 둘 다 $x$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '한쪽만 인정' },
          { key: 'D', text: '앞 뒤 모두 $y$좌표', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '한쪽만 인정' },
          { key: 'E', text: '두 수의 합이 좌표', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        ] },
      { stepType: 'PROCESS', prompt: '$P(3, 2)$ 에서 $x$좌표를 떼면?',
        options: [
          { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$2$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$y$좌표를 $x$로' },
          { key: 'C', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '두 수 합으로' },
          { key: 'D', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '두 수 곱으로' },
          { key: 'E', text: '$P$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '이름 자체' },
        ] },
      { stepType: 'ANSWER', prompt: '$x$좌표, $y$좌표는 각각?',
        options: [
          { key: 'A', text: '$x = 3,\\ y = 2$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$x = 2,\\ y = 3$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '순서 뒤집힘' },
          { key: 'C', text: '$x = 3,\\ y = 3$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '한쪽 잘못' },
          { key: 'D', text: '$x = 2,\\ y = 2$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '한쪽 잘못' },
          { key: 'E', text: '$x = 5,\\ y = 0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '연산 잘못' },
        ] },
    ],
    solution: '$P(x, y) = P(3, 2)$ — 앞 $3$은 $x$좌표, 뒤 $2$는 $y$좌표.',
  },

  // ────────── Q2 (쉬움) (0,0)의 이름 · SIGN_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'easy', concept: '원점', requiredSkills: SKILLS_AXIS,
    stem: '좌표 $(0, 0)$ 인 점의 이름은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '좌표평면에서 $x$축과 $y$축이 만나는 점은?',
        options: [
          { key: 'A', text: '원점 (origin)', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '극점', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '극좌표계 용어' },
          { key: 'C', text: '단위점', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '존재하지 않는 용어' },
          { key: 'D', text: '중점', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '두 점의 가운데' },
          { key: 'E', text: '시작점', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '비공식 표현' },
        ] },
      { stepType: 'PROCESS', prompt: '$x = 0,\\ y = 0$ 이면 위치는?',
        options: [
          { key: 'A', text: '$x$축과 $y$축의 교차점', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$x$축 위 (오른쪽으로 무한)', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$x = 0$이라는 의미를 무시' },
          { key: 'C', text: '$y$축 위 (위로 무한)', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$y = 0$이라는 의미를 무시' },
          { key: 'D', text: '제$1$사분면 안쪽', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$(0,0)$은 사분면 어디에도 속하지 않음' },
          { key: 'E', text: '제$3$사분면 끝', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '사분면 외 위치' },
        ] },
      { stepType: 'ANSWER', prompt: '$(0, 0)$ 의 이름은?',
        options: [
          { key: 'A', text: '원점', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '극점', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '다른 좌표계 용어' },
          { key: 'C', text: '중심', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '비표준' },
          { key: 'D', text: '단위점', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '존재하지 않음' },
          { key: 'E', text: '시작점', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '비공식' },
        ] },
    ],
    solution: '$x$축과 $y$축이 만나는 점 $(0, 0)$ 의 이름은 원점 (origin), 기호 $O$.',
  },

  // ────────── Q3 (쉬움) (4,0)이 어느 축? · CONCEPT_MISUNDERSTANDING ──────────
  {
    chapterCode: CODE, difficulty: 'easy', concept: '축 위 점', requiredSkills: SKILLS_AXIS,
    stem: '점 $(4, 0)$ 은 어느 축 위에 있는가?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$x$축 위 점의 $y$좌표는?',
        options: [
          { key: 'A', text: '항상 $0$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '항상 $1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
          { key: 'C', text: '$x$좌표와 같음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '대각선 조건' },
          { key: 'D', text: '$x$좌표의 음수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
          { key: 'E', text: '항상 양수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$0$도 가능' },
        ] },
      { stepType: 'PROCESS', prompt: '$(4, 0)$ 에서 $y$좌표는?',
        options: [
          { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$4$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$x$좌표를 $y$로' },
          { key: 'C', text: '$-4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$y$좌표 부호 잘못' },
          { key: 'D', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
          { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        ] },
      { stepType: 'ANSWER', prompt: '어느 축 위?',
        options: [
          { key: 'A', text: '$x$축', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$y$축', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x$와 $y$ 혼동' },
          { key: 'C', text: '둘 다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원점만 둘 다' },
          { key: 'D', text: '제$1$사분면', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '축 위 = 사분면 외' },
          { key: 'E', text: '제$4$사분면', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '축 위 = 사분면 외' },
        ] },
    ],
    solution: '$y$좌표 $= 0$ 이면 $x$축 위. $(4, 0)$ 은 원점에서 $x$축을 따라 $4$만큼 오른쪽.',
  },

  // ────────── Q4 (쉬움) (3,2) 사분면 · COORDINATE_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'easy', concept: '사분면 (1사분면)', requiredSkills: SKILLS_QUAD,
    stem: '점 $(3, 2)$ 는 몇 사분면인가?',
    steps: [
      { stepType: 'CONCEPT', prompt: '제$1$사분면의 부호는?',
        options: [
          { key: 'A', text: '$x > 0,\\ y > 0$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$x > 0,\\ y < 0$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '제$4$사분면 부호' },
          { key: 'C', text: '$x < 0,\\ y > 0$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '제$2$사분면 부호' },
          { key: 'D', text: '$x < 0,\\ y < 0$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '제$3$사분면 부호' },
          { key: 'E', text: '$x = 0,\\ y = 0$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '원점' },
        ] },
      { stepType: 'PROCESS', prompt: '$(3, 2)$ 의 $x$, $y$ 부호는?',
        options: [
          { key: 'A', text: '$x > 0$ (양), $y > 0$ (양)', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$x < 0, y > 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$3$을 음수로 봄' },
          { key: 'C', text: '$x > 0, y < 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$2$를 음수로 봄' },
          { key: 'D', text: '$x = 0, y > 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$3 \\neq 0$' },
          { key: 'E', text: '둘 다 음', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '둘 다 양수' },
        ] },
      { stepType: 'ANSWER', prompt: '사분면은?',
        options: [
          { key: 'A', text: '제$1$사분면', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '제$2$사분면', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '부호 매칭 잘못' },
          { key: 'C', text: '제$3$사분면', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '부호 매칭 잘못' },
          { key: 'D', text: '제$4$사분면', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '부호 매칭 잘못' },
          { key: 'E', text: '축 위', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$0$ 없음' },
        ] },
    ],
    solution: '$x = 3 > 0,\\ y = 2 > 0$ → 제$1$사분면.',
  },

  // ────────── Q5 (쉬움) (-2, 5) 사분면 · SIGN_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'easy', concept: '사분면 (2사분면)', requiredSkills: SKILLS_QUAD,
    stem: '점 $(-2, 5)$ 는 몇 사분면인가?',
    steps: [
      { stepType: 'CONCEPT', prompt: '제$2$사분면의 부호는?',
        options: [
          { key: 'A', text: '$x < 0,\\ y > 0$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$x > 0,\\ y > 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '제1과 혼동' },
          { key: 'C', text: '$x < 0,\\ y < 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '제3과 혼동' },
          { key: 'D', text: '$x > 0,\\ y < 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '제4와 혼동' },
          { key: 'E', text: '$x$ 양, $y$ 어느 쪽이든', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$y$ 조건 모호' },
        ] },
      { stepType: 'PROCESS', prompt: '$(-2, 5)$ 의 부호는?',
        options: [
          { key: 'A', text: '$x = -2 < 0,\\ y = 5 > 0$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$x > 0,\\ y > 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-2$를 양수로' },
          { key: 'C', text: '$x > 0,\\ y < 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '둘 다 잘못' },
          { key: 'D', text: '$x < 0,\\ y < 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$5$를 음수로' },
          { key: 'E', text: '$x = 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-2 \\neq 0$' },
        ] },
      { stepType: 'ANSWER', prompt: '사분면은?',
        options: [
          { key: 'A', text: '제$2$사분면', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '제$1$사분면', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
          { key: 'C', text: '제$3$사분면', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
          { key: 'D', text: '제$4$사분면', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
          { key: 'E', text: '축 위', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$0$ 없음' },
        ] },
    ],
    solution: '$x < 0, y > 0$ → 제$2$사분면.',
  },

  // ────────── Q6 (쉬움) (-3,-4) 사분면 · SIGN_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'easy', concept: '사분면 (3사분면)', requiredSkills: SKILLS_QUAD,
    stem: '점 $(-3, -4)$ 는 몇 사분면인가?',
    steps: [
      { stepType: 'CONCEPT', prompt: '제$3$사분면의 부호는?',
        options: [
          { key: 'A', text: '$x < 0,\\ y < 0$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$x > 0,\\ y > 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '제1과 혼동' },
          { key: 'C', text: '$x < 0,\\ y > 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '제2와 혼동' },
          { key: 'D', text: '$x > 0,\\ y < 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '제4와 혼동' },
          { key: 'E', text: '둘 다 양', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '제1' },
        ] },
      { stepType: 'PROCESS', prompt: '두 좌표가 모두 음수이면?',
        options: [
          { key: 'A', text: '제$3$사분면', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$x$축 음의 부분', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$y \\neq 0$' },
          { key: 'C', text: '$y$축 음의 부분', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$x \\neq 0$' },
          { key: 'D', text: '원점', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$x, y \\neq 0$' },
          { key: 'E', text: '제$1$사분면', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 반대' },
        ] },
      { stepType: 'ANSWER', prompt: '사분면은?',
        options: [
          { key: 'A', text: '제$3$사분면', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '제$1$사분면', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
          { key: 'C', text: '제$2$사분면', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
          { key: 'D', text: '제$4$사분면', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
          { key: 'E', text: '$x$축 위', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$y = -4 \\neq 0$' },
        ] },
    ],
    solution: '$x = -3 < 0, y = -4 < 0$ → 제$3$사분면.',
  },

  // ────────── Q7 (중) (5,-2) 사분면 · COORDINATE_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '사분면 (4사분면)', requiredSkills: SKILLS_QUAD,
    stem: '점 $(5, -2)$ 는 몇 사분면인가?',
    steps: [
      { stepType: 'CONCEPT', prompt: '제$4$사분면의 부호는?',
        options: [
          { key: 'A', text: '$x > 0,\\ y < 0$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$x > 0,\\ y > 0$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '제1과 혼동' },
          { key: 'C', text: '$x < 0,\\ y > 0$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '제2와 혼동' },
          { key: 'D', text: '$x < 0,\\ y < 0$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '제3과 혼동' },
          { key: 'E', text: '$x = 0$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$y$축 위' },
        ] },
      { stepType: 'PROCESS', prompt: '$(5, -2)$ 의 부호는?',
        options: [
          { key: 'A', text: '$x > 0, y < 0$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '둘 다 양', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-2$ 부호 무시' },
          { key: 'C', text: '둘 다 음', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$5$를 음수로' },
          { key: 'D', text: '$x < 0, y > 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '둘 다 잘못' },
          { key: 'E', text: '$y = 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-2 \\neq 0$' },
        ] },
      { stepType: 'ANSWER', prompt: '사분면은?',
        options: [
          { key: 'A', text: '제$4$사분면', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '제$1$사분면', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '부호 매칭 잘못' },
          { key: 'C', text: '제$2$사분면', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '부호 매칭 잘못' },
          { key: 'D', text: '제$3$사분면', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '부호 매칭 잘못' },
          { key: 'E', text: '축 위', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$0$ 없음' },
        ] },
    ],
    solution: '$x > 0, y < 0$ → 제$4$사분면.',
  },

  // ────────── Q8 (중) (a,b)가 제2사분면, a, b 부호는? · CONCEPT_MISUNDERSTANDING ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '사분면 → 부호 역추적', requiredSkills: SKILLS_QUAD,
    stem: '점 $P(a, b)$ 가 제$2$사분면 위에 있다. $a, b$ 의 부호는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '제$2$사분면의 정의는?',
        options: [
          { key: 'A', text: '$x < 0$ 이고 $y > 0$ 인 영역', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$x > 0$ 이고 $y > 0$ 인 영역', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '제1' },
          { key: 'C', text: '$x < 0$ 이고 $y < 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '제3' },
          { key: 'D', text: '$x > 0$ 이고 $y < 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '제4' },
          { key: 'E', text: '$x \\geq 0,\\ y \\geq 0$ (축 포함)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '사분면은 축 미포함' },
        ] },
      { stepType: 'PROCESS', prompt: '$P(a, b)$ 가 제2사분면 ⟹ $x$좌표 = $a$, $y$좌표 = $b$. 부호는?',
        options: [
          { key: 'A', text: '$a < 0,\\ b > 0$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$a > 0,\\ b < 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부호 반대' },
          { key: 'C', text: '$a > 0,\\ b > 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '제1로 오해' },
          { key: 'D', text: '$a < 0,\\ b < 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '제3으로 오해' },
          { key: 'E', text: '$a = 0,\\ b > 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$y$축 위' },
        ] },
      { stepType: 'ANSWER', prompt: '결론은?',
        options: [
          { key: 'A', text: '$a < 0,\\ b > 0$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$a > 0,\\ b > 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '제1' },
          { key: 'C', text: '$a < 0,\\ b < 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '제3' },
          { key: 'D', text: '$a > 0,\\ b < 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '제4' },
          { key: 'E', text: '$a, b$ 둘 다 $0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원점' },
        ] },
    ],
    solution: '제$2$사분면: $x < 0, y > 0$. 따라서 $a < 0, b > 0$.',
  },

  // ────────── Q9 (중) A(1,4)와 B(1,-2) 거리 · ARITHMETIC_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '두 점 거리 (y축 평행)', requiredSkills: SKILLS_DIST,
    stem: '두 점 $A(1, 4)$ 와 $B(1, -2)$ 사이의 거리는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '두 점의 $x$좌표가 같으면 선분은?',
        options: [
          { key: 'A', text: '$y$축에 평행', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$x$축에 평행', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '축 혼동' },
          { key: 'C', text: '대각선', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x$ 같으면 수직선' },
          { key: 'D', text: '원의 일부', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '무관' },
          { key: 'E', text: '평행하지 않음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$y$축 평행' },
        ] },
      { stepType: 'PROCESS', prompt: '거리 공식: $|y_1 - y_2|$ 적용은?',
        options: [
          { key: 'A', text: '$|4 - (-2)| = |6| = 6$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$|4 + 2| = 6$ (이중 부호 무시)', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '맞지만 부호 처리 부정확 — 우연 정답이라도 부호 인식이 필요' },
          { key: 'C', text: '$|4 - 2| = 2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-2$의 음수 부호 누락' },
          { key: 'D', text: '$|1 - 1| = 0$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$x$좌표 차로 거리 계산' },
          { key: 'E', text: '$\\sqrt{4^2 + (-2)^2}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '일반 거리 공식 (필요 없음)' },
        ] },
      { stepType: 'ANSWER', prompt: '거리는?',
        options: [
          { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$|4-2|$ 으로' },
          { key: 'C', text: '$-6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '거리는 음수 불가' },
          { key: 'D', text: '$8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$4 + 4$ 등 계산 실수' },
          { key: 'E', text: '$\\sqrt{20}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '일반 공식 적용 결과' },
        ] },
    ],
    solution: '$x$좌표가 같으므로 $y$축 평행 선분. 거리 $= |y_A - y_B| = |4 - (-2)| = 6$.',
  },

  // ────────── Q10 (중) A(3,5)와 B(-2,5) 거리 · ARITHMETIC_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '두 점 거리 (x축 평행)', requiredSkills: SKILLS_DIST,
    stem: '두 점 $A(3, 5)$ 와 $B(-2, 5)$ 사이의 거리는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$y$좌표가 같은 두 점은?',
        options: [
          { key: 'A', text: '$x$축에 평행한 선분', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$y$축에 평행', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '축 혼동' },
          { key: 'C', text: '원의 호', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '무관' },
          { key: 'D', text: '겹쳐 있음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x$ 다르면 분리' },
          { key: 'E', text: '대각선', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$y$ 같으면 수평' },
        ] },
      { stepType: 'PROCESS', prompt: '거리 공식: $|x_1 - x_2|$',
        options: [
          { key: 'A', text: '$|3 - (-2)| = 5$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$|3 - 2| = 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-2$ 부호 무시' },
          { key: 'C', text: '$|3 + (-2)| = 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '뺄셈을 덧셈으로' },
          { key: 'D', text: '$|5 - 5| = 0$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$y$좌표 차로' },
          { key: 'E', text: '$\\sqrt{3^2 + (-2)^2}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '일반 거리' },
        ] },
      { stepType: 'ANSWER', prompt: '거리는?',
        options: [
          { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$|3-2|$' },
          { key: 'C', text: '$-5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '거리 음수 불가' },
          { key: 'D', text: '$10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$5 \\times 2$' },
          { key: 'E', text: '$0$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$y$좌표 차' },
        ] },
    ],
    solution: '$y$좌표 같음 → $x$축 평행. 거리 $= |3 - (-2)| = 5$.',
  },

  // ────────── Q11 (중) (3,0) → (-2,0) 이동: 어느 축? · CONCEPT_MISUNDERSTANDING ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '축 위 이동', requiredSkills: SKILLS_AXIS,
    stem: '점 $(3, 0)$ 이 $(-2, 0)$ 으로 이동했다. 어느 축을 따라 이동했는가?',
    steps: [
      { stepType: 'CONCEPT', prompt: '두 점 모두 $y = 0$ 이라는 의미는?',
        options: [
          { key: 'A', text: '두 점 모두 $x$축 위', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '두 점 모두 $y$축 위', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '축 혼동' },
          { key: 'C', text: '두 점 모두 원점', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x$ 다름' },
          { key: 'D', text: '두 점 모두 제$1$사분면', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '축 위 = 사분면 아님' },
          { key: 'E', text: '두 점 모두 제$2$사분면', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '동일 이유' },
        ] },
      { stepType: 'PROCESS', prompt: '$x$좌표만 변하고 $y$좌표 그대로 → 이동 방향은?',
        options: [
          { key: 'A', text: '$x$축을 따라', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$y$축을 따라', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '변하지 않는 축' },
          { key: 'C', text: '대각선', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '두 좌표 모두 변해야 함' },
          { key: 'D', text: '원의 둘레', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '무관' },
          { key: 'E', text: '제자리', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x$ 변함' },
        ] },
      { stepType: 'ANSWER', prompt: '어느 축?',
        options: [
          { key: 'A', text: '$x$축', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$y$축', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x$ vs $y$ 혼동' },
          { key: 'C', text: '$y = x$ 대각선', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
          { key: 'D', text: '원점 주위 원', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '직선 이동' },
          { key: 'E', text: '제$1$사분면 내부', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '축 위 이동' },
        ] },
    ],
    solution: '두 점 모두 $y = 0$ → $x$축 위. $x$좌표만 $3 \\to -2$ 로 변함 → $x$축을 따라 이동.',
  },

  // ────────── Q12 (중) x축 대칭 · COORDINATE_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '$x$축 대칭', requiredSkills: SKILLS_SYM,
    stem: '점 $(3, 4)$ 의 $x$축에 대한 대칭점은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$x$축 대칭 시 변하는 좌표는?',
        options: [
          { key: 'A', text: '$y$좌표의 부호만 반대', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$x$좌표의 부호만 반대', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$y$축 대칭과 혼동' },
          { key: 'C', text: '두 좌표 모두 부호 반대', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '원점 대칭과 혼동' },
          { key: 'D', text: '두 좌표 교환', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$y=x$ 대칭과 혼동' },
          { key: 'E', text: '변화 없음', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '대칭은 변화 발생' },
        ] },
      { stepType: 'PROCESS', prompt: '$(3, 4)$ 에 적용하면?',
        options: [
          { key: 'A', text: '$(3, -4)$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$(-3, 4)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$x$ 부호만 바꿈' },
          { key: 'C', text: '$(-3, -4)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '둘 다 부호' },
          { key: 'D', text: '$(4, 3)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '교환' },
          { key: 'E', text: '$(3, 4)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '변화 없음' },
        ] },
      { stepType: 'ANSWER', prompt: '대칭점은?',
        options: [
          { key: 'A', text: '$(3, -4)$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$(-3, 4)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$y$축 대칭' },
          { key: 'C', text: '$(-3, -4)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '원점 대칭' },
          { key: 'D', text: '$(4, -3)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '교환+부호' },
          { key: 'E', text: '$(0, 4)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '근거 없음' },
        ] },
    ],
    solution: '$x$축 대칭: $(x, y) \\to (x, -y)$. $(3, 4) \\to (3, -4)$.',
  },

  // ────────── Q13 (중) y축 대칭 · SIGN_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '$y$축 대칭', requiredSkills: SKILLS_SYM,
    stem: '점 $(-2, 5)$ 의 $y$축에 대한 대칭점은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$y$축 대칭 시 변하는 좌표는?',
        options: [
          { key: 'A', text: '$x$좌표의 부호만 반대', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$y$좌표의 부호만 반대', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$x$축 대칭' },
          { key: 'C', text: '둘 다 부호 반대', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '원점 대칭' },
          { key: 'D', text: '둘 다 교환', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$y=x$ 대칭' },
          { key: 'E', text: '변화 없음', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '대칭 발생' },
        ] },
      { stepType: 'PROCESS', prompt: '$(-2, 5)$ 에서 $x$좌표 부호 반대로 하면?',
        options: [
          { key: 'A', text: '$(2, 5)$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$(-2, -5)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$y$ 부호 잘못' },
          { key: 'C', text: '$(2, -5)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '둘 다 변경' },
          { key: 'D', text: '$(-2, 5)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '변화 없음' },
          { key: 'E', text: '$(5, -2)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '교환' },
        ] },
      { stepType: 'ANSWER', prompt: '대칭점은?',
        options: [
          { key: 'A', text: '$(2, 5)$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$(-2, -5)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$x$축 대칭' },
          { key: 'C', text: '$(2, -5)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '원점 대칭' },
          { key: 'D', text: '$(5, 2)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '교환' },
          { key: 'E', text: '$(0, 5)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$y$축 위로' },
        ] },
    ],
    solution: '$y$축 대칭: $(x, y) \\to (-x, y)$. $(-2, 5) \\to (2, 5)$.',
  },

  // ────────── Q14 (중) 원점 대칭 · COORDINATE_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '원점 대칭', requiredSkills: SKILLS_SYM,
    stem: '점 $(3, -2)$ 의 원점에 대한 대칭점은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '원점 대칭 시 변하는 좌표는?',
        options: [
          { key: 'A', text: '두 좌표 모두 부호 반대', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$x$ 만', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$y$축 대칭' },
          { key: 'C', text: '$y$ 만', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$x$축 대칭' },
          { key: 'D', text: '두 좌표 교환', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$y=x$ 대칭' },
          { key: 'E', text: '변화 없음', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '대칭 발생' },
        ] },
      { stepType: 'PROCESS', prompt: '$(3, -2)$ 에서 두 좌표 부호 모두 반대로 하면?',
        options: [
          { key: 'A', text: '$(-3, 2)$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$(-3, -2)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$x$만 변경' },
          { key: 'C', text: '$(3, 2)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$y$만 변경' },
          { key: 'D', text: '$(3, -2)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '변화 없음' },
          { key: 'E', text: '$(-2, 3)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '교환' },
        ] },
      { stepType: 'ANSWER', prompt: '대칭점은?',
        options: [
          { key: 'A', text: '$(-3, 2)$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$(3, 2)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$x$축 대칭' },
          { key: 'C', text: '$(-3, -2)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$y$축 대칭' },
          { key: 'D', text: '$(2, -3)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '교환' },
          { key: 'E', text: '$(0, 0)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '원점' },
        ] },
    ],
    solution: '원점 대칭: $(x, y) \\to (-x, -y)$. $(3, -2) \\to (-3, 2)$.',
  },

  // ────────── Q15 (중) 시간-거리 그래프 속력 · ARITHMETIC_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '그래프 해석 (속력)', requiredSkills: SKILLS_GRAPH,
    stem: '시간-거리 그래프에서 직선이 원점에서 출발해 $5$ 시간 동안 $100\\text{km}$ 이동했다. 속력은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '시간-거리 그래프에서 직선의 기울기 의미는?',
        options: [
          { key: 'A', text: '속력 (단위 시간당 거리)', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '가속도', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가속도는 속력 변화율' },
          { key: 'C', text: '총 거리', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '기울기는 비율' },
          { key: 'D', text: '총 시간', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '기울기는 비율' },
          { key: 'E', text: '거리 + 시간', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '비율 아님' },
        ] },
      { stepType: 'PROCESS', prompt: '속력 $=$ 거리 $\\div$ 시간 적용은?',
        options: [
          { key: 'A', text: '$100 \\div 5 = 20$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$100 \\times 5 = 500$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '곱셈으로' },
          { key: 'C', text: '$100 + 5 = 105$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '덧셈으로' },
          { key: 'D', text: '$100 - 5 = 95$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '뺄셈으로' },
          { key: 'E', text: '$5 \\div 100 = 0.05$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나눗셈 순서 잘못' },
        ] },
      { stepType: 'ANSWER', prompt: '속력은?',
        options: [
          { key: 'A', text: '$20\\text{km/h}$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$500\\text{km/h}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '곱셈' },
          { key: 'C', text: '$95\\text{km/h}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '뺄셈' },
          { key: 'D', text: '$5\\text{km/h}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '시간 자체' },
          { key: 'E', text: '$0.05\\text{km/h}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나눗셈 역' },
        ] },
    ],
    solution: '속력 $= \\dfrac{\\text{거리}}{\\text{시간}} = \\dfrac{100}{5} = 20$ km/h.',
  },

  // ────────── Q16 (어려움) (a, -a)가 제2사분면. a 범위? · CONCEPT_MISUNDERSTANDING ──────────
  {
    chapterCode: CODE, difficulty: 'hard', concept: '문자좌표 사분면 조건', requiredSkills: SKILLS_MIXED,
    stem: '점 $(a, -a)$ 가 제$2$사분면에 있다. $a$ 의 부호는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '제$2$사분면 조건은? ($x$, $y$ 부호)',
        options: [
          { key: 'A', text: '$x < 0$ 이고 $y > 0$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$x > 0$ 이고 $y > 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '제1' },
          { key: 'C', text: '$x < 0$ 이고 $y < 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '제3' },
          { key: 'D', text: '$x > 0$ 이고 $y < 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '제4' },
          { key: 'E', text: '$x = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$y$축' },
        ] },
      { stepType: 'PROCESS', prompt: '$x = a < 0$ 그리고 $y = -a > 0$ 두 조건을 풀면?',
        options: [
          { key: 'A', text: '$a < 0$ (두 조건 모두 같은 결론)', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$a > 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 반대' },
          { key: 'C', text: '$a = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x = 0$이면 축 위' },
          { key: 'D', text: '두 조건 모순', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$-a > 0 \\Leftrightarrow a < 0$ 일치' },
          { key: 'E', text: '$a > 0$ 이고 $a < 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부호 처리 잘못' },
        ] },
      { stepType: 'ANSWER', prompt: '$a$ 의 부호 결론은?',
        options: [
          { key: 'A', text: '$a < 0$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$a > 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '반대' },
          { key: 'C', text: '$a = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x=y=0$이면 원점' },
          { key: 'D', text: '$a$는 어느 값이나 OK', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '조건 무시' },
          { key: 'E', text: '$a$는 존재하지 않음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$a = -1$ 등 가능' },
        ] },
    ],
    solution: '$x = a < 0$ 그리고 $y = -a > 0 \\Leftrightarrow a < 0$. 두 조건 일치 → $a < 0$.',
  },

  // ────────── Q17 (어려움) (a-3, a+5)가 y축 위. a? · CONDITION_MISSING ──────────
  {
    chapterCode: CODE, difficulty: 'hard', concept: '축 위 조건 → 미정계수', requiredSkills: SKILLS_MIXED,
    stem: '점 $(a - 3,\\ a + 5)$ 가 $y$축 위에 있다. $a$ 의 값은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$y$축 위의 점 조건은?',
        options: [
          { key: 'A', text: '$x$좌표 $= 0$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$y$좌표 $= 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$x$축 조건' },
          { key: 'C', text: '$x = y$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$y=x$ 대각선' },
          { key: 'D', text: '$x = -y$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
          { key: 'E', text: '$x = 1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        ] },
      { stepType: 'PROCESS', prompt: '$x$좌표 $= a - 3 = 0$ 을 풀면?',
        options: [
          { key: 'A', text: '$a = 3$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$a = -3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '이항 부호 잘못' },
          { key: 'C', text: '$a = 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$-3$ 무시' },
          { key: 'D', text: '$a = 3$ 또는 $-5$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$y$좌표 조건까지 포함 (불필요)' },
          { key: 'E', text: '$a = -5$ ($a + 5 = 0$)', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$x$축 조건 적용' },
        ] },
      { stepType: 'ANSWER', prompt: '$a$ 값은?',
        options: [
          { key: 'A', text: '$a = 3$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$a = -3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
          { key: 'C', text: '$a = -5$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$x$축 조건' },
          { key: 'D', text: '$a = 5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
          { key: 'E', text: '$a = 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '대입해도 $x \\neq 0$' },
        ] },
    ],
    solution: '$y$축 위 ⟹ $x = 0 \\Rightarrow a - 3 = 0 \\Rightarrow a = 3$. 검산: 점 $(0, 8)$ 은 $y$축 위 ✓.',
  },

  // ────────── Q18 (어려움) 세 꼭짓점 (0,0)(4,0)(0,3) 삼각형 넓이 · FORMULA_SELECTION_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'hard', concept: '좌표평면 삼각형 넓이', requiredSkills: SKILLS_AREA,
    stem: '세 점 $(0, 0),\\ (4, 0),\\ (0, 3)$ 을 꼭짓점으로 하는 삼각형의 넓이는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '두 직각변이 축 위에 있을 때 넓이 공식은?',
        options: [
          { key: 'A', text: '$\\dfrac{1}{2} \\times \\text{밑변} \\times \\text{높이}$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '밑변 $\\times$ 높이', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '직사각형 공식' },
          { key: 'C', text: '두 변의 합', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
          { key: 'D', text: '$\\dfrac{1}{2} \\times$ 둘레', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '둘레 공식 아님' },
          { key: 'E', text: '세 변 합의 제곱', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        ] },
      { stepType: 'PROCESS', prompt: '밑변 (x축 위) = $4$, 높이 (y축 위) = $3$ 적용:',
        options: [
          { key: 'A', text: '$\\dfrac{1}{2} \\times 4 \\times 3$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$4 \\times 3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\dfrac{1}{2}$ 누락' },
          { key: 'C', text: '$\\dfrac{1}{2} \\times (4 + 3)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱이 아니라 합' },
          { key: 'D', text: '$4 + 3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '둘레 일부' },
          { key: 'E', text: '$\\dfrac{4}{3}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        ] },
      { stepType: 'ANSWER', prompt: '넓이는?',
        options: [
          { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$12$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\dfrac{1}{2}$ 누락' },
          { key: 'C', text: '$7$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$4 + 3$' },
          { key: 'D', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '한 변만' },
          { key: 'E', text: '$24$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$4 \\times 3 \\times 2$' },
        ] },
    ],
    solution: '직각삼각형: 밑변 $4$ (x축), 높이 $3$ (y축). 넓이 $= \\dfrac{1}{2} \\times 4 \\times 3 = 6$.',
  },

  // ────────── Q19 (어려움) 삼각형 ABC 넓이 (A(1,2), B(5,2), C(5,5)) · CONDITION_MISSING ──────────
  {
    chapterCode: CODE, difficulty: 'hard', concept: '축 평행 두 변 삼각형 넓이', requiredSkills: SKILLS_AREA,
    stem: '세 점 $A(1, 2),\\ B(5, 2),\\ C(5, 5)$ 의 삼각형 넓이는?',
    steps: [
      { stepType: 'CONCEPT', prompt: 'AB와 BC가 축 평행임을 확인하면?',
        options: [
          { key: 'A', text: 'AB는 $x$축 평행, BC는 $y$축 평행 → B 가 직각', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '세 변 모두 대각선', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: 'AB, BC 축 평행 확인 못함' },
          { key: 'C', text: 'A가 직각', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: 'B가 직각' },
          { key: 'D', text: 'AB와 BC가 같음', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '길이 비교' },
          { key: 'E', text: '정삼각형', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '서로 다른 길이' },
        ] },
      { stepType: 'PROCESS', prompt: 'AB 길이? BC 길이?',
        options: [
          { key: 'A', text: 'AB $= |5 - 1| = 4$, BC $= |5 - 2| = 3$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: 'AB $= 5$, BC $= 5$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '좌표 차 무시' },
          { key: 'C', text: 'AB $= 4$, BC $= 5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: 'BC 계산 실수' },
          { key: 'D', text: 'AB $= 3$, BC $= 4$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: 'AB와 BC 바꿔 적용' },
          { key: 'E', text: 'AB $= |1 - 5| + |2 - 2| = 4$, BC $= |5 - 5| + |5 - 2| = 3$ (맨해튼 거리)', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '우연 결과 — 단순 차로 충분' },
        ] },
      { stepType: 'ANSWER', prompt: '직각삼각형 넓이는?',
        options: [
          { key: 'A', text: '$\\dfrac{1}{2} \\times 4 \\times 3 = 6$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$4 \\times 3 = 12$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\dfrac{1}{2}$ 누락' },
          { key: 'C', text: '$\\dfrac{1}{2} \\times (4 + 3) = 3.5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합으로 잘못' },
          { key: 'D', text: '$4 + 3 = 7$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '둘레 일부' },
          { key: 'E', text: '$5 \\times 3 = 15$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: 'AB 길이 잘못' },
        ] },
    ],
    solution: 'AB: $y$ 같음 → $x$축 평행, 길이 $4$. BC: $x$ 같음 → $y$축 평행, 길이 $3$. B에서 직각. 넓이 $= \\dfrac{1}{2} \\times 4 \\times 3 = 6$.',
  },

  // ────────── Q20 (어려움) 만남 시점 · GRAPH_READING_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'hard', concept: '거리-시간 그래프 (만남)', requiredSkills: SKILLS_GRAPH,
    stem: 'A는 $t = 0$ 에 위치 $10$m 에서 출발해 매초 $2$m 씩 이동, B는 $t = 0$ 에 위치 $0$m 에서 출발해 매초 $4$m 씩 이동한다. 두 사람이 만나는 시각은?',
    steps: [
      { stepType: 'CONCEPT', prompt: 'A, B의 시각 $t$ 에서의 위치 식은?',
        options: [
          { key: 'A', text: 'A: $10 + 2t$, B: $4t$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: 'A: $2t$, B: $10 + 4t$', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '초기 위치 혼동' },
          { key: 'C', text: 'A: $10 - 2t$, B: $4t$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: 'A가 같은 방향 진행' },
          { key: 'D', text: 'A: $10 \\times 2t$, B: $4t$', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '곱셈으로' },
          { key: 'E', text: 'A: $10 + 2$, B: $4$', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '$t$ 빠뜨림' },
        ] },
      { stepType: 'PROCESS', prompt: '만남 조건 = 두 위치 같음:',
        options: [
          { key: 'A', text: '$10 + 2t = 4t$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$10 + 2t + 4t = 0$', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '합으로' },
          { key: 'C', text: '$10 - 2t = 4t$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: 'A 방향 잘못' },
          { key: 'D', text: '$10 = 2t + 4t$', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '식 정리 일부 잘못' },
          { key: 'E', text: '$2t = 4t$', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '초기 위치 누락' },
        ] },
      { stepType: 'ANSWER', prompt: '$t$ 는?',
        options: [
          { key: 'A', text: '$t = 5$초', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$t = 10$초', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$10/1$' },
          { key: 'C', text: '$t = 2.5$초', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$10/4$' },
          { key: 'D', text: '$t = 0$초', isCorrect: false, errorCode: 'GRAPH_READING_ERROR', errorReason: '$10$ 무시' },
          { key: 'E', text: '$t = -5$초', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
        ] },
    ],
    solution: '$10 + 2t = 4t \\Rightarrow 2t = 10 \\Rightarrow t = 5$ 초. 검산: A $= 10 + 10 = 20$, B $= 20$ ✓.',
  },
];

export const K_G7_MATH1_CH04_COORD_GRAPH_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
