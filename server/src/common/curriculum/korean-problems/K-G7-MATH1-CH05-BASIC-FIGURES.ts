/**
 * K-G7-MATH1-CH05-BASIC-FIGURES (기본 도형) — 20문제 3-step Mastery.
 * 중1 — 점/선/면 → 각의 종류 → 보각/여각 → 맞꼭지각 → 평행선의 성질 (동위각/엇각).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 * 주요 errorCode 분배:
 *   GEOMETRY_PROPERTY_ERROR 6 (Q1,3,7,11,12,19) / CONCEPT_MISUNDERSTANDING 4 (Q2,4,9,15)
 *   ARITHMETIC_ERROR 3 (Q5,6,8) / ALGEBRA_ERROR 3 (Q16,17,20)
 *   CONDITION_MISSING 2 (Q13,14) / FORMULA_SELECTION_ERROR 2 (Q10,18)
 *
 * 각 문제 = 3 step (CONCEPT/PROCESS/ANSWER), 각 step = 5지선다.
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G7-MATH1-CH05-BASIC-FIGURES';
const SKILLS_BASIC = ['point_line_plane', 'line_segment_ray_distinction'];
const SKILLS_ANGLE_TYPE = ['angle_classification', 'right_acute_obtuse_straight'];
const SKILLS_COMP_SUPP = ['complementary_angle', 'supplementary_angle'];
const SKILLS_VERTICAL = ['vertical_angle', 'angles_meeting_point'];
const SKILLS_ADJACENT = ['adjacent_angle_addition', 'angle_partition'];
const SKILLS_PARALLEL = ['corresponding_angle', 'alternate_angle', 'parallel_line_property'];
const SKILLS_EQ_FIG = ['algebra_in_figure', 'equation_from_angle_relation'];
const SKILLS_STRAIGHT = ['straight_angle_180', 'angle_sum_on_line'];

const problems: KoreanProblemSeed[] = [
  // ────────── Q1 (쉬움) 두 점을 지나는 직선의 개수 · GEOMETRY_PROPERTY_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'easy', concept: '두 점과 직선', requiredSkills: SKILLS_BASIC,
    stem: '서로 다른 두 점을 지나는 직선은 몇 개인가?',
    steps: [
      { stepType: 'CONCEPT', prompt: '직선의 결정 조건은?',
        options: [
          { key: 'A', text: '서로 다른 두 점이 직선 하나를 결정한다', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '한 점만 있어도 직선이 결정된다', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '방향 결정 못함' },
          { key: 'C', text: '세 점이 필요하다', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '두 점이면 충분' },
          { key: 'D', text: '두 점은 무한히 많은 직선 결정', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '하나만 가능' },
          { key: 'E', text: '두 점이 같아야 한다', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '같은 점은 무한 직선' },
        ] },
      { stepType: 'PROCESS', prompt: '두 점을 지나는 직선을 그릴 수 있는 방법은?',
        options: [
          { key: 'A', text: '두 점을 자로 연결해 양쪽으로 연장 — 단 한 가지', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '두 점 사이에 곡선 그리기', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '직선은 곡선이 아님' },
          { key: 'C', text: '두 점을 다른 점으로 연장', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '추가 점 불필요' },
          { key: 'D', text: '점 하나만으로 그릴 수 있다', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '두 점 필요' },
          { key: 'E', text: '여러 방향으로 무한히 가능', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '두 점이 방향 고정' },
        ] },
      { stepType: 'ANSWER', prompt: '몇 개?',
        options: [
          { key: 'A', text: '$1$개', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$2$개', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '한쪽씩 방향 분리로 오해' },
          { key: 'C', text: '$3$개', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
          { key: 'D', text: '무수히 많다', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '같은 두 점일 때만 무한' },
          { key: 'E', text: '$0$개', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '항상 1개 존재' },
        ] },
    ],
    solution: '두 점이 결정하는 직선은 단 하나. 직선 결정 공리.',
  },

  // ────────── Q2 (쉬움) 직선·반직선·선분 구별 · CONCEPT_MISUNDERSTANDING ──────────
  {
    chapterCode: CODE, difficulty: 'easy', concept: '직선·반직선·선분', requiredSkills: SKILLS_BASIC,
    stem: '양 끝이 있고 일정한 길이를 가진 도형은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '직선·반직선·선분 차이?',
        options: [
          { key: 'A', text: '직선: 양쪽 무한 / 반직선: 한쪽만 무한 / 선분: 양 끝 있음', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '선분이 가장 김', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '직선이 가장 김' },
          { key: 'C', text: '직선이 가장 짧음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '반대' },
          { key: 'D', text: '셋 모두 같음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '구별 있음' },
          { key: 'E', text: '직선이 곡선 포함', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곡선 무관' },
        ] },
      { stepType: 'PROCESS', prompt: '"양 끝이 있다"는?',
        options: [
          { key: 'A', text: '시작점과 끝점 모두 정의됨', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '한쪽 끝만 있음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '반직선' },
          { key: 'C', text: '양쪽 무한히 뻗음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '직선' },
          { key: 'D', text: '끝점이 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '직선' },
          { key: 'E', text: '구부러져 있음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곡선 아님' },
        ] },
      { stepType: 'ANSWER', prompt: '해당 도형은?',
        options: [
          { key: 'A', text: '선분', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '직선', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '양쪽 무한' },
          { key: 'C', text: '반직선', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '한쪽만 무한' },
          { key: 'D', text: '원', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곡선' },
          { key: 'E', text: '평면', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '2차원' },
        ] },
    ],
    solution: '선분: 두 끝점 사이 부분, 일정한 길이를 가짐. 직선은 양쪽 무한, 반직선은 한쪽 무한.',
  },

  // ────────── Q3 (쉬움) 한 각 90° · GEOMETRY_PROPERTY_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'easy', concept: '각의 분류 — 직각', requiredSkills: SKILLS_ANGLE_TYPE,
    stem: '크기가 정확히 $90°$ 인 각의 이름은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '각의 분류 기준은?',
        options: [
          { key: 'A', text: '예각 ($0° < \\theta < 90°$) / 직각 ($90°$) / 둔각 ($90° < \\theta < 180°$) / 평각 ($180°$)', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '모든 각이 같은 종류', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '분류 있음' },
          { key: 'C', text: '둔각만 따로', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '네 가지 모두' },
          { key: 'D', text: '평각만 따로', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '네 가지 모두' },
          { key: 'E', text: '예각과 둔각만', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '직각·평각 누락' },
        ] },
      { stepType: 'PROCESS', prompt: '$90°$ 는 어디에 속하는가?',
        options: [
          { key: 'A', text: '직각 (오른각)', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '예각', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '$90°$는 예각 미만 아님' },
          { key: 'C', text: '둔각', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '$90°$ 초과 아님' },
          { key: 'D', text: '평각', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '평각 = $180°$' },
          { key: 'E', text: '반각', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '존재하지 않는 분류명' },
        ] },
      { stepType: 'ANSWER', prompt: '$90°$ 의 이름은?',
        options: [
          { key: 'A', text: '직각', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '예각', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '$< 90°$' },
          { key: 'C', text: '둔각', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '$> 90°$' },
          { key: 'D', text: '평각', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '$= 180°$' },
          { key: 'E', text: '0각', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '존재하지 않음' },
        ] },
    ],
    solution: '정확히 $90°$ → 직각 (right angle).',
  },

  // ────────── Q4 (쉬움) 한 각 130° · CONCEPT_MISUNDERSTANDING ──────────
  {
    chapterCode: CODE, difficulty: 'easy', concept: '각의 분류 — 둔각', requiredSkills: SKILLS_ANGLE_TYPE,
    stem: '크기가 $130°$ 인 각의 이름은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '둔각의 정의는?',
        options: [
          { key: 'A', text: '$90° < \\theta < 180°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$\\theta > 180°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평각 초과는 우각 (반사각)' },
          { key: 'C', text: '$\\theta = 90°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '직각' },
          { key: 'D', text: '$0° < \\theta < 90°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '예각' },
          { key: 'E', text: '$\\theta = 180°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평각' },
        ] },
      { stepType: 'PROCESS', prompt: '$130°$ 는 $90°$ 보다 크고 $180°$ 보다 작음을 확인:',
        options: [
          { key: 'A', text: '$90 < 130 < 180$ — 둔각 범위', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$130 < 90$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '크기 비교 잘못' },
          { key: 'C', text: '$130 = 180$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '같지 않음' },
          { key: 'D', text: '$130 > 180$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '크기 비교 잘못' },
          { key: 'E', text: '$130 = 90$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '같지 않음' },
        ] },
      { stepType: 'ANSWER', prompt: '이름은?',
        options: [
          { key: 'A', text: '둔각', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '예각', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$< 90°$' },
          { key: 'C', text: '직각', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$= 90°$' },
          { key: 'D', text: '평각', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$= 180°$' },
          { key: 'E', text: '반각', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '없는 분류' },
        ] },
    ],
    solution: '$90° < 130° < 180°$ → 둔각.',
  },

  // ────────── Q5 (쉬움) 35°의 보각 · ARITHMETIC_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'easy', concept: '보각', requiredSkills: SKILLS_COMP_SUPP,
    stem: '$35°$ 의 보각은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '보각의 정의는?',
        options: [
          { key: 'A', text: '두 각의 합이 $180°$ 인 두 각', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '합이 $90°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '여각 정의' },
          { key: 'C', text: '합이 $360°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '한 점 주변' },
          { key: 'D', text: '두 각이 같음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '맞꼭지각 등' },
          { key: 'E', text: '두 각이 반대', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '의미 모호' },
        ] },
      { stepType: 'PROCESS', prompt: '$180° - 35° = ?$',
        options: [
          { key: 'A', text: '$145°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$155°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
          { key: 'C', text: '$165°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
          { key: 'D', text: '$55°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '여각 ($90 - 35$)' },
          { key: 'E', text: '$215°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '더하기로' },
        ] },
      { stepType: 'ANSWER', prompt: '보각은?',
        options: [
          { key: 'A', text: '$145°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$155°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '뺄셈 실수' },
          { key: 'C', text: '$55°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '여각' },
          { key: 'D', text: '$35°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '같은 각' },
          { key: 'E', text: '$90°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        ] },
    ],
    solution: '보각 = $180° - 35° = 145°$.',
  },

  // ────────── Q6 (쉬움) 50°의 여각 · ARITHMETIC_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'easy', concept: '여각', requiredSkills: SKILLS_COMP_SUPP,
    stem: '$50°$ 의 여각은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '여각의 정의는?',
        options: [
          { key: 'A', text: '두 각의 합이 $90°$ 인 두 각', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '합이 $180°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '보각' },
          { key: 'C', text: '합이 $360°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '한 점 주변' },
          { key: 'D', text: '두 각이 같음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '맞꼭지각' },
          { key: 'E', text: '두 각이 직각', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '여각은 합이 $90°$' },
        ] },
      { stepType: 'PROCESS', prompt: '$90° - 50° = ?$',
        options: [
          { key: 'A', text: '$40°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$30°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
          { key: 'C', text: '$130°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '보각' },
          { key: 'D', text: '$140°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '더한 후 보각' },
          { key: 'E', text: '$50°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '같은 각' },
        ] },
      { stepType: 'ANSWER', prompt: '여각은?',
        options: [
          { key: 'A', text: '$40°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$130°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '보각' },
          { key: 'C', text: '$30°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 잘못' },
          { key: 'D', text: '$140°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 잘못' },
          { key: 'E', text: '$90°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '둘 다 0이어야' },
        ] },
    ],
    solution: '여각 = $90° - 50° = 40°$.',
  },

  // ────────── Q7 (중) 맞꼭지각 60° · GEOMETRY_PROPERTY_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '맞꼭지각', requiredSkills: SKILLS_VERTICAL,
    stem: '두 직선이 한 점에서 만난다. 한 각의 크기가 $60°$ 일 때, 그 맞꼭지각의 크기는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '맞꼭지각의 성질은?',
        options: [
          { key: 'A', text: '맞꼭지각의 크기는 서로 같다', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '맞꼭지각의 합은 $180°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '이웃한 각의 성질' },
          { key: 'C', text: '맞꼭지각은 항상 직각', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
          { key: 'D', text: '맞꼭지각은 합이 $90°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '여각과 무관' },
          { key: 'E', text: '맞꼭지각은 합이 $360°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '네 각 전체 합' },
        ] },
      { stepType: 'PROCESS', prompt: '한 각이 $60°$ 이면 맞꼭지각은?',
        options: [
          { key: 'A', text: '같은 $60°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$120°$ (이웃)', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '이웃과 혼동' },
          { key: 'C', text: '$30°$ (여각)', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '여각과 혼동' },
          { key: 'D', text: '$300°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
          { key: 'E', text: '$90°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        ] },
      { stepType: 'ANSWER', prompt: '맞꼭지각의 크기는?',
        options: [
          { key: 'A', text: '$60°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$120°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '이웃' },
          { key: 'C', text: '$30°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '여각' },
          { key: 'D', text: '$180°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '평각' },
          { key: 'E', text: '$240°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        ] },
    ],
    solution: '맞꼭지각은 항상 같다. $60°$의 맞꼭지각 = $60°$.',
  },

  // ────────── Q8 (중) 이웃한 각 60° · ARITHMETIC_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '이웃한 각', requiredSkills: SKILLS_VERTICAL,
    stem: '두 직선이 한 점에서 만난다. 한 각의 크기가 $60°$ 일 때, 그 이웃한 각의 크기는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '직선 위에서 이웃한 두 각의 합은?',
        options: [
          { key: 'A', text: '$180°$ (평각)', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$90°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '여각 정의' },
          { key: 'C', text: '$360°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '한 점 주변 합' },
          { key: 'D', text: '서로 같음', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '맞꼭지각 성질' },
          { key: 'E', text: '$120°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '구체 값과 무관' },
        ] },
      { stepType: 'PROCESS', prompt: '$180° - 60° = ?$',
        options: [
          { key: 'A', text: '$120°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$30°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$90 - 60$' },
          { key: 'C', text: '$60°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '맞꼭지각' },
          { key: 'D', text: '$240°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '더한 결과' },
          { key: 'E', text: '$300°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        ] },
      { stepType: 'ANSWER', prompt: '이웃한 각은?',
        options: [
          { key: 'A', text: '$120°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$60°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '맞꼭지각' },
          { key: 'C', text: '$30°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '여각' },
          { key: 'D', text: '$90°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
          { key: 'E', text: '$180°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '평각 자체' },
        ] },
    ],
    solution: '이웃한 두 각의 합 = $180°$. $180° - 60° = 120°$.',
  },

  // ────────── Q9 (중) 평각의 크기 · CONCEPT_MISUNDERSTANDING ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '평각', requiredSkills: SKILLS_STRAIGHT,
    stem: '평각의 크기는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '평각은 어떤 각인가?',
        options: [
          { key: 'A', text: '두 반직선이 같은 직선을 이루는 각', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '두 반직선이 직각을 이루는 각', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '직각의 정의' },
          { key: 'C', text: '두 각이 같은 크기일 때', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '맞꼭지각' },
          { key: 'D', text: '한 점에서 만나는 모든 각의 합', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$360°$' },
          { key: 'E', text: '둔각보다 작은 각', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '오히려 큼' },
        ] },
      { stepType: 'PROCESS', prompt: '한 직선 위 두 반직선이 만드는 각의 크기는?',
        options: [
          { key: 'A', text: '$180°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$90°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '직각' },
          { key: 'C', text: '$360°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '한 점 주변' },
          { key: 'D', text: '$0°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '같은 방향일 때' },
          { key: 'E', text: '$45°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        ] },
      { stepType: 'ANSWER', prompt: '평각 = ?',
        options: [
          { key: 'A', text: '$180°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$90°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '직각' },
          { key: 'C', text: '$360°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '주변각' },
          { key: 'D', text: '$45°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
          { key: 'E', text: '$270°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        ] },
    ],
    solution: '평각 = $180°$. 한 직선이 만드는 각.',
  },

  // ────────── Q10 (중) 한 점에서 만나는 4각의 합 · FORMULA_SELECTION_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '한 점에서 만나는 두 직선 4각의 합', requiredSkills: SKILLS_VERTICAL,
    stem: '두 직선이 한 점에서 만날 때 만들어지는 $4$개 각의 합은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '한 점 주변 모든 각의 합은?',
        options: [
          { key: 'A', text: '$360°$ (한 바퀴)', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$180°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '평각만' },
          { key: 'C', text: '$90°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '직각만' },
          { key: 'D', text: '$720°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '두 바퀴' },
          { key: 'E', text: '$540°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        ] },
      { stepType: 'PROCESS', prompt: '두 직선이 만들면? 각 두 쌍 (평각 × 2)',
        options: [
          { key: 'A', text: '$180° + 180° = 360°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$180° \\div 2 = 90°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '나눗셈' },
          { key: 'C', text: '$90° \\times 4 = 360°$ (단, 모두 직각일 때만)', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '특수 경우만 가정' },
          { key: 'D', text: '$180°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '한 쌍만' },
          { key: 'E', text: '$720°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '두 바퀴' },
        ] },
      { stepType: 'ANSWER', prompt: '4각의 합은?',
        options: [
          { key: 'A', text: '$360°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$180°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '평각' },
          { key: 'C', text: '$90°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '직각' },
          { key: 'D', text: '$720°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '두 바퀴' },
          { key: 'E', text: '두 각의 합이 같지 않음', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '항상 같음' },
        ] },
    ],
    solution: '한 점 주변의 모든 각의 합 = $360°$.',
  },

  // ────────── Q11 (중) ∠AOB 계산 · GEOMETRY_PROPERTY_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '각의 합 (내부 반직선)', requiredSkills: SKILLS_ADJACENT,
    stem: '한 점 $O$ 에서 세 반직선 $OA, OB, OC$ 가 있다. $\\angle AOC = 80°$, $\\angle BOC = 30°$ 이고 $B$ 는 $\\angle AOC$ 의 내부에 있다. $\\angle AOB$ 의 크기는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$B$ 가 $\\angle AOC$ 의 내부에 있다는 의미는?',
        options: [
          { key: 'A', text: '$\\angle AOC = \\angle AOB + \\angle BOC$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$\\angle AOC = \\angle AOB - \\angle BOC$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '뺄셈 잘못' },
          { key: 'C', text: '$\\angle AOC = \\angle AOB \\times \\angle BOC$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '곱셈 잘못' },
          { key: 'D', text: '$\\angle AOB = \\angle BOC$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '같다는 보장 없음' },
          { key: 'E', text: '$\\angle AOB = \\angle AOC$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '$B \\neq C$' },
        ] },
      { stepType: 'PROCESS', prompt: '$\\angle AOB = \\angle AOC - \\angle BOC = ?$',
        options: [
          { key: 'A', text: '$80° - 30° = 50°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$80° + 30° = 110°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '합' },
          { key: 'C', text: '$30° - 80° = -50°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '순서 잘못' },
          { key: 'D', text: '$30°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '$\\angle BOC$ 그대로' },
          { key: 'E', text: '$80°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '$\\angle AOC$ 그대로' },
        ] },
      { stepType: 'ANSWER', prompt: '$\\angle AOB$ 는?',
        options: [
          { key: 'A', text: '$50°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$110°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '합' },
          { key: 'C', text: '$30°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '$\\angle BOC$' },
          { key: 'D', text: '$80°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '$\\angle AOC$' },
          { key: 'E', text: '$25°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$50/2$' },
        ] },
    ],
    solution: '$B$가 $\\angle AOC$ 내부 → $\\angle AOC = \\angle AOB + \\angle BOC$. $\\angle AOB = 80° - 30° = 50°$.',
  },

  // ────────── Q12 (중) 보각 = 여각의 2배 + 30 · GEOMETRY_PROPERTY_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '보각·여각 관계식', requiredSkills: SKILLS_COMP_SUPP,
    stem: '어떤 각의 보각이 그 여각의 $2$ 배보다 $30°$ 크다. 그 각의 크기는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '각을 $x$ 라 할 때 보각·여각 식은?',
        options: [
          { key: 'A', text: '보각 $= 180 - x$, 여각 $= 90 - x$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '보각 $= 90 - x$, 여각 $= 180 - x$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '정의 바꿔 적용' },
          { key: 'C', text: '보각 $= x + 180$, 여각 $= x + 90$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '덧셈으로' },
          { key: 'D', text: '보각 $= 2x$, 여각 $= x/2$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
          { key: 'E', text: '보각 $=$ 여각 $\\times 2$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '특수 경우만' },
        ] },
      { stepType: 'PROCESS', prompt: '"보각 = 여각의 2배 + 30" 을 식으로:',
        options: [
          { key: 'A', text: '$180 - x = 2(90 - x) + 30$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$180 - x = 2(90 - x) - 30$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '"크다" 방향 잘못' },
          { key: 'C', text: '$180 - x + 30 = 2(90 - x)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$30$ 위치 잘못' },
          { key: 'D', text: '$180 + x = 2(90 + x) + 30$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '식 잘못' },
          { key: 'E', text: '$180 - x = (90 - x) + 30$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$\\times 2$ 누락' },
        ] },
      { stepType: 'ANSWER', prompt: '식을 풀면 $x = ?$',
        options: [
          { key: 'A', text: '$x = 30°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$x = 60°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '계산 실수' },
          { key: 'C', text: '$x = 45°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
          { key: 'D', text: '$x = 50°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
          { key: 'E', text: '$x = 150°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '보각 자체' },
        ] },
    ],
    solution: '$180 - x = 2(90 - x) + 30 \\Rightarrow 180 - x = 210 - 2x \\Rightarrow x = 30°$. 검산: 보각 $150°$, 여각 $60°$, $60 \\times 2 + 30 = 150$ ✓.',
  },

  // ────────── Q13 (중) 동위각 정의 · CONDITION_MISSING ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '평행선의 동위각', requiredSkills: SKILLS_PARALLEL,
    stem: '평행한 두 직선이 한 직선에 의해 잘릴 때, 동위각의 크기는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '동위각 (corresponding angle)이란?',
        options: [
          { key: 'A', text: '횡단선의 같은 쪽 + 두 직선에 대해 같은 위치의 두 각', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '횡단선의 반대 쪽 두 각', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '엇각 정의' },
          { key: 'C', text: '같은 직선 위 두 이웃 각', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '이웃각 정의' },
          { key: 'D', text: '한 점에서 만나는 두 각', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '맞꼭지각' },
          { key: 'E', text: '두 직선이 만나서 생기는 모든 각', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '특정 위치만' },
        ] },
      { stepType: 'PROCESS', prompt: '평행 조건이면 동위각은?',
        options: [
          { key: 'A', text: '서로 같다', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '합이 $180°$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '동측내각' },
          { key: 'C', text: '서로 직각 차이', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
          { key: 'D', text: '한쪽이 두 배', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
          { key: 'E', text: '항상 직각', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '특정 경우만' },
        ] },
      { stepType: 'ANSWER', prompt: '동위각의 관계는?',
        options: [
          { key: 'A', text: '같다 (등호)', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '합 $180°$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '동측내각' },
          { key: 'C', text: '하나는 다른 하나의 보각', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '같지 않은 관계' },
          { key: 'D', text: '90° 차이', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
          { key: 'E', text: '관계 없음', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '평행이면 관계 있음' },
        ] },
    ],
    solution: '평행한 두 직선과 횡단선 → 동위각은 같다.',
  },

  // ────────── Q14 (중) 엇각 · CONDITION_MISSING ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '평행선의 엇각', requiredSkills: SKILLS_PARALLEL,
    stem: '평행한 두 직선이 한 직선에 의해 잘릴 때, 엇각(alternate angle)의 크기는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '엇각이란?',
        options: [
          { key: 'A', text: '횡단선의 반대편 + 두 직선 사이 (또는 바깥)에 있는 두 각', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '횡단선의 같은 편 두 각', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '동위각' },
          { key: 'C', text: '같은 직선 위 이웃 각', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '이웃각' },
          { key: 'D', text: '맞꼭지 위치', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '맞꼭지각' },
          { key: 'E', text: '횡단선 자체의 각', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '관련 없음' },
        ] },
      { stepType: 'PROCESS', prompt: '평행 조건이면 엇각은?',
        options: [
          { key: 'A', text: '서로 같다', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '합 $180°$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '다른 관계' },
          { key: 'C', text: '차이 $90°$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
          { key: 'D', text: '두 배', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
          { key: 'E', text: '한쪽이 직각', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        ] },
      { stepType: 'ANSWER', prompt: '엇각의 관계는?',
        options: [
          { key: 'A', text: '같다 (등호)', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '합 $180°$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '동측내각' },
          { key: 'C', text: '보각 관계', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
          { key: 'D', text: '$90°$ 차이', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
          { key: 'E', text: '항상 직각', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '특정 경우만' },
        ] },
    ],
    solution: '평행한 두 직선의 엇각은 같다.',
  },

  // ────────── Q15 (중) 동위각 50° → 엇각 · CONCEPT_MISUNDERSTANDING ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '평행선 각도 적용', requiredSkills: SKILLS_PARALLEL,
    stem: '$l \\parallel m$ 이고 횡단선이 $l$ 과 이루는 동위각이 $50°$ 이다. $m$ 과 이루는 엇각은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '"$l$과 동위각" + "$m$과 엇각" 둘 다 평행선 정리에서 같음을 인정',
        options: [
          { key: 'A', text: '동위각과 엇각은 둘 다 평행선이면 같으므로 모두 $50°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '동위각만 같다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '엇각도 같음' },
          { key: 'C', text: '엇각만 같다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '동위각도 같음' },
          { key: 'D', text: '둘 다 다르다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평행이면 둘 다 같음' },
          { key: 'E', text: '엇각은 보각', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '동측내각이 보각' },
        ] },
      { stepType: 'PROCESS', prompt: '$50°$ 의 위치와 무관하게 평행선의 모든 동위각·엇각은?',
        options: [
          { key: 'A', text: '모두 $50°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$130°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '보각' },
          { key: 'C', text: '$40°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '여각' },
          { key: 'D', text: '$25°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
          { key: 'E', text: '$100°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '두 배' },
        ] },
      { stepType: 'ANSWER', prompt: '엇각은?',
        options: [
          { key: 'A', text: '$50°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$130°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '보각' },
          { key: 'C', text: '$40°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '여각' },
          { key: 'D', text: '$90°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
          { key: 'E', text: '$180°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평각' },
        ] },
    ],
    solution: '평행선 → 동위각과 엇각 모두 같음. 따라서 엇각 = $50°$.',
  },

  // ────────── Q16 (어려움) 동위각 (3x+10)°=(2x+30)° · ALGEBRA_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'hard', concept: '동위각 미정값', requiredSkills: SKILLS_EQ_FIG,
    stem: '$l \\parallel m$ 일 때 횡단선이 만드는 동위각이 $(3x + 10)°$ 와 $(2x + 30)°$ 이다. $x$ 는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '동위각이 평행선이면?',
        options: [
          { key: 'A', text: '서로 같으므로 두 식이 같다는 방정식을 세운다', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '합이 $180°$ 라는 식', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '동측내각' },
          { key: 'C', text: '차이가 $90°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
          { key: 'D', text: '곱이 $360°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
          { key: 'E', text: '두 식이 비례', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '같다는 등호' },
        ] },
      { stepType: 'PROCESS', prompt: '$3x + 10 = 2x + 30$ 을 풀면?',
        options: [
          { key: 'A', text: '$3x - 2x = 30 - 10 \\Rightarrow x = 20$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$3x + 2x = 30 + 10 \\Rightarrow 5x = 40 \\Rightarrow x = 8$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '이항 시 부호 안 바꿈' },
          { key: 'C', text: '$3x - 2x = 30 + 10 \\Rightarrow x = 40$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '한쪽 부호 잘못' },
          { key: 'D', text: '$x = 10 + 30 = 40$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '계수 무시' },
          { key: 'E', text: '$x = 10 - 30 = -20$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        ] },
      { stepType: 'ANSWER', prompt: '$x = ?$',
        options: [
          { key: 'A', text: '$x = 20$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$x = 8$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '부호 잘못' },
          { key: 'C', text: '$x = 40$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '계산 잘못' },
          { key: 'D', text: '$x = 10$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
          { key: 'E', text: '$x = 30$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        ] },
    ],
    solution: '동위각 같음 → $3x + 10 = 2x + 30 \\Rightarrow x = 20$. 검산: $3(20)+10 = 70$, $2(20)+30 = 70$ ✓.',
  },

  // ────────── Q17 (어려움) 맞꼭지각 (4x-10)=(2x+50) · ALGEBRA_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'hard', concept: '맞꼭지각 미정값', requiredSkills: SKILLS_EQ_FIG,
    stem: '두 직선이 만난 점에서 한 각 $(4x - 10)°$ 와 그 맞꼭지각 $(2x + 50)°$ 이 있다. $x$ 는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '맞꼭지각의 성질로 식을 세우면?',
        options: [
          { key: 'A', text: '두 각이 같으므로 등식', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '합이 $180°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '이웃각' },
          { key: 'C', text: '차이가 $90°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
          { key: 'D', text: '곱이 $360°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
          { key: 'E', text: '하나가 다른 하나의 보각', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '이웃각' },
        ] },
      { stepType: 'PROCESS', prompt: '$4x - 10 = 2x + 50$',
        options: [
          { key: 'A', text: '$2x = 60 \\Rightarrow x = 30$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$4x + 2x = 50 - 10 \\Rightarrow x = 20/6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '이항 부호 잘못' },
          { key: 'C', text: '$4x - 2x = 50 + 10 \\Rightarrow 2x = 60 \\Rightarrow x = 30$ (우연 같지만 부호 처리 잘못)', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$-10$ 이항을 $+10$ 안 함 — 우연 동일값' },
          { key: 'D', text: '$x = 40$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
          { key: 'E', text: '$x = 50$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        ] },
      { stepType: 'ANSWER', prompt: '$x$ 는?',
        options: [
          { key: 'A', text: '$x = 30$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$x = 20$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
          { key: 'C', text: '$x = 40$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
          { key: 'D', text: '$x = 10$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
          { key: 'E', text: '$x = 25$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        ] },
    ],
    solution: '맞꼭지각 같음 → $4x - 10 = 2x + 50 \\Rightarrow 2x = 60 \\Rightarrow x = 30$. 검산: $4(30)-10=110$, $2(30)+50=110$ ✓.',
  },

  // ────────── Q18 (어려움) 평각 위 세 각 합 180° · FORMULA_SELECTION_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'hard', concept: '평각 위 각들의 합', requiredSkills: SKILLS_STRAIGHT,
    stem: '한 직선 위에 세 각 $(x + 20)°$, $(2x - 10)°$, $(x + 30)°$ 이 차례로 있다. $x$ 는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '한 직선 위 세 각의 합 식은?',
        options: [
          { key: 'A', text: '$(x+20) + (2x-10) + (x+30) = 180$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '합이 $360°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '한 점 주변 (직선 양쪽)' },
          { key: 'C', text: '합이 $90°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '직각' },
          { key: 'D', text: '곱이 $180°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
          { key: 'E', text: '$x + 20 = 180 - (2x - 10)$ (두 항만)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '세 번째 누락' },
        ] },
      { stepType: 'PROCESS', prompt: '왼쪽 식 정리:',
        options: [
          { key: 'A', text: '$4x + 40 = 180$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$4x + 60 = 180$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '상수 합 잘못' },
          { key: 'C', text: '$4x - 40 = 180$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-10$ 합산 잘못' },
          { key: 'D', text: '$2x + 40 = 180$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '계수 합 잘못' },
          { key: 'E', text: '$4x = 180$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '상수 누락' },
        ] },
      { stepType: 'ANSWER', prompt: '$x = ?$',
        options: [
          { key: 'A', text: '$x = 35$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$x = 30$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
          { key: 'C', text: '$x = 40$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
          { key: 'D', text: '$x = 45$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
          { key: 'E', text: '$x = 25$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        ] },
    ],
    solution: '세 각 합 = $180°$. $4x + 40 = 180 \\Rightarrow 4x = 140 \\Rightarrow x = 35$. 검산: $55 + 60 + 65 = 180$ ✓.',
  },

  // ────────── Q19 (어려움) ∠AOB=90, ∠AOC=30 · GEOMETRY_PROPERTY_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'hard', concept: '수직 + 내부 반직선', requiredSkills: SKILLS_ADJACENT,
    stem: '$\\overrightarrow{OA} \\perp \\overrightarrow{OB}$ 이고 반직선 $\\overrightarrow{OC}$ 가 $\\angle AOB$ 의 내부에 있다. $\\angle AOC = 30°$ 일 때 $\\angle BOC$ 는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\overrightarrow{OA} \\perp \\overrightarrow{OB}$ 의 의미는?',
        options: [
          { key: 'A', text: '$\\angle AOB = 90°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$\\angle AOB = 180°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '평행/평각' },
          { key: 'C', text: '$\\angle AOB = 0°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '같은 방향' },
          { key: 'D', text: '$\\angle AOB = 45°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
          { key: 'E', text: '$\\angle AOB$ 정해지지 않음', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '$90°$로 정해짐' },
        ] },
      { stepType: 'PROCESS', prompt: '$\\angle AOB = \\angle AOC + \\angle BOC$ 적용:',
        options: [
          { key: 'A', text: '$90° = 30° + \\angle BOC \\Rightarrow \\angle BOC = 60°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$\\angle BOC = 90° + 30° = 120°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '덧셈' },
          { key: 'C', text: '$\\angle BOC = 30°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '$\\angle AOC$ 그대로' },
          { key: 'D', text: '$\\angle BOC = 90°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '$\\angle AOB$ 그대로' },
          { key: 'E', text: '$\\angle BOC = 30 \\times 3 = 90°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '곱셈' },
        ] },
      { stepType: 'ANSWER', prompt: '$\\angle BOC = ?$',
        options: [
          { key: 'A', text: '$60°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$120°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '덧셈' },
          { key: 'C', text: '$30°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '$\\angle AOC$ 그대로' },
          { key: 'D', text: '$90°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '$\\angle AOB$ 그대로' },
          { key: 'E', text: '$45°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$90/2$' },
        ] },
    ],
    solution: '$\\angle AOB = 90°$ (수직). $\\angle BOC = 90° - 30° = 60°$.',
  },

  // ────────── Q20 (어려움) 평행선 동위각 (3x+5)=(x+45) · ALGEBRA_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'hard', concept: '평행선 동위각 미정값', requiredSkills: SKILLS_EQ_FIG,
    stem: '$l \\parallel m$ 일 때 동위각이 $(3x + 5)°$ 와 $(x + 45)°$ 이다. $x$ 는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '동위각이 같으므로 식은?',
        options: [
          { key: 'A', text: '$3x + 5 = x + 45$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$3x + 5 + x + 45 = 180$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '동측내각 식' },
          { key: 'C', text: '$3x + 5 = 180 - (x + 45)$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '보각식' },
          { key: 'D', text: '$3x + 5 + x + 45 = 360$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
          { key: 'E', text: '$3x \\times 5 = x \\times 45$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '곱셈으로' },
        ] },
      { stepType: 'PROCESS', prompt: '$2x = 40$',
        options: [
          { key: 'A', text: '$x = 20$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$x = 22.5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$45/2$' },
          { key: 'C', text: '$x = 10$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
          { key: 'D', text: '$x = 25$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
          { key: 'E', text: '$x = 40$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나눗셈 누락' },
        ] },
      { stepType: 'ANSWER', prompt: '$x$ 는?',
        options: [
          { key: 'A', text: '$x = 20$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$x = 25$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
          { key: 'C', text: '$x = 40$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나눗셈 누락' },
          { key: 'D', text: '$x = 22.5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
          { key: 'E', text: '$x = 10$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        ] },
    ],
    solution: '동위각 같음 → $3x + 5 = x + 45 \\Rightarrow 2x = 40 \\Rightarrow x = 20$. 검산: $3(20)+5=65$, $20+45=65$ ✓.',
  },
];

export const K_G7_MATH1_CH05_BASIC_FIGURES_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
