/**
 * K-G7-MATH1-CH05-BASIC-FIGURES — STUDY pool (single-step, 20문제).
 * 기본 도형: 점·선·면 / 각의 분류 / 보각·여각 / 맞꼭지각 / 평행선의 동위각·엇각.
 * Mastery 3-step과 별도 변형 문제 (다른 숫자·응용).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5. LLM 미사용.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G7-MATH1-CH05-BASIC-FIGURES';
const SKILLS_BASIC = ['point_line_definition', 'line_segment_classification'];
const SKILLS_ANGLE_TYPE = ['acute_right_obtuse', 'angle_classification'];
const SKILLS_COMP_SUPP = ['complementary_angle', 'supplementary_angle'];
const SKILLS_VERTICAL = ['vertical_angle', 'adjacent_angle'];
const SKILLS_STRAIGHT = ['straight_angle', 'angle_sum_180'];
const SKILLS_ADJACENT = ['ray_inside_angle', 'angle_sum_decomposition'];
const SKILLS_PARALLEL = ['parallel_corresponding', 'parallel_alternate'];
const SKILLS_EQ_FIG = ['angle_equation', 'linear_solve_geometry'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) 같은 직선 위 세 점 → 직선 개수
  { chapterCode: CODE, difficulty: 'easy', concept: '한 직선 위 세 점과 직선', requiredSkills: SKILLS_BASIC,
    stem: '한 직선 위에 있는 서로 다른 세 점을 지나는 직선은 모두 몇 개인가?',
    options: [
      { key: 'A', text: '$1$개', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3$개', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '한 직선 위 조건 무시 (각 쌍마다 직선 셈)' },
      { key: 'C', text: '$2$개', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '두 점씩 그룹 잘못' },
      { key: 'D', text: '무수히 많다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '한 점만 있을 때의 경우와 혼동' },
      { key: 'E', text: '$6$개', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$_{3}P_{2}$ 같은 순열로 오해' },
    ],
    solution: '세 점이 한 직선 위에 있으면 모두 한 직선 위 → 직선은 $1$개.' },

  // S2 (쉬움) 반직선의 정의
  { chapterCode: CODE, difficulty: 'easy', concept: '반직선의 정의', requiredSkills: SKILLS_BASIC,
    stem: '한쪽 끝이 있고 다른 쪽으로는 한없이 뻗어가는 도형은?',
    options: [
      { key: 'A', text: '반직선', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '직선', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '직선은 양쪽 모두 한없이' },
      { key: 'C', text: '선분', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '선분은 양 끝이 있음' },
      { key: 'D', text: '꺾인선', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '여러 선분의 연결' },
      { key: 'E', text: '곡선', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곡선은 직선 분류와 별개' },
    ],
    solution: '반직선 — 한 점에서 시작해 한 방향으로 뻗어감.' },

  // S3 (쉬움) 예각
  { chapterCode: CODE, difficulty: 'easy', concept: '각의 분류 — 예각', requiredSkills: SKILLS_ANGLE_TYPE,
    stem: '크기가 $45°$ 인 각의 이름은?',
    options: [
      { key: 'A', text: '예각', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '직각', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '직각은 정확히 $90°$' },
      { key: 'C', text: '둔각', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '둔각은 $90°$ 보다 큼' },
      { key: 'D', text: '평각', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평각은 $180°$' },
      { key: 'E', text: '반각', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '교과서 용어 아님' },
    ],
    solution: '$0° <$ 예각 $< 90°$. $45°$는 이 범위 → 예각.' },

  // S4 (쉬움) 둔각
  { chapterCode: CODE, difficulty: 'easy', concept: '각의 분류 — 둔각', requiredSkills: SKILLS_ANGLE_TYPE,
    stem: '크기가 $110°$ 인 각의 이름은?',
    options: [
      { key: 'A', text: '둔각', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '예각', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '예각은 $90°$ 미만' },
      { key: 'C', text: '직각', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '직각은 정확히 $90°$' },
      { key: 'D', text: '평각', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평각은 $180°$' },
      { key: 'E', text: '맞꼭지각', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '맞꼭지각은 위치 관계, 크기 분류 아님' },
    ],
    solution: '$90° <$ 둔각 $< 180°$. $110°$는 이 범위 → 둔각.' },

  // S5 (쉬움) 보각
  { chapterCode: CODE, difficulty: 'easy', concept: '보각 (합 180°)', requiredSkills: SKILLS_COMP_SUPP,
    stem: '$72°$ 의 보각은?',
    options: [
      { key: 'A', text: '$108°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$18°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '여각을 답함 ($90 - 72$)' },
      { key: 'C', text: '$28°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$100 - 72$ 잘못된 기준' },
      { key: 'D', text: '$288°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$360 - 72$ 한 바퀴 기준' },
      { key: 'E', text: '$72°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '보각 정의 미적용' },
    ],
    solution: '보각: 합이 $180°$. $180 - 72 = 108°$.' },

  // S6 (쉬움) 여각
  { chapterCode: CODE, difficulty: 'easy', concept: '여각 (합 90°)', requiredSkills: SKILLS_COMP_SUPP,
    stem: '$28°$ 의 여각은?',
    options: [
      { key: 'A', text: '$62°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$152°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '보각 ($180 - 28$)' },
      { key: 'C', text: '$72°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$100 - 28$ 잘못된 기준' },
      { key: 'D', text: '$332°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$360 - 28$ 한 바퀴 기준' },
      { key: 'E', text: '$28°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '여각 정의 미적용' },
    ],
    solution: '여각: 합이 $90°$. $90 - 28 = 62°$.' },

  // S7 (중) 맞꼭지각 (135°)
  { chapterCode: CODE, difficulty: 'medium', concept: '맞꼭지각의 크기', requiredSkills: SKILLS_VERTICAL,
    stem: '두 직선이 한 점에서 만난다. 한 각의 크기가 $135°$ 일 때, 그 맞꼭지각의 크기는?',
    options: [
      { key: 'A', text: '$135°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$45°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '이웃한 각 (보각)을 답함' },
      { key: 'C', text: '$180°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평각 자체' },
      { key: 'D', text: '$225°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$135 + 90$ 등 잘못된 합' },
      { key: 'E', text: '$270°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$135 \\times 2$ 등' },
    ],
    solution: '맞꼭지각의 크기는 항상 같다 → $135°$.' },

  // S8 (중) 이웃한 각 (45°)
  { chapterCode: CODE, difficulty: 'medium', concept: '이웃한 각 (보각)', requiredSkills: SKILLS_VERTICAL,
    stem: '두 직선이 한 점에서 만난다. 한 각의 크기가 $45°$ 일 때, 그 이웃한 각의 크기는?',
    options: [
      { key: 'A', text: '$135°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$45°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '맞꼭지각을 답함' },
      { key: 'C', text: '$90°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '직각으로 오해' },
      { key: 'D', text: '$315°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$360 - 45$ 한 바퀴 기준' },
      { key: 'E', text: '$55°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$100 - 45$ 잘못된 기준' },
    ],
    solution: '이웃한 두 각의 합은 평각($180°$) → $180 - 45 = 135°$.' },

  // S9 (중) 직각
  { chapterCode: CODE, difficulty: 'medium', concept: '평각의 절반', requiredSkills: SKILLS_STRAIGHT,
    stem: '평각의 절반인 각의 크기는?',
    options: [
      { key: 'A', text: '$90°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$180°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평각 자체' },
      { key: 'C', text: '$45°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$90$의 절반' },
      { key: 'D', text: '$60°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 분수' },
      { key: 'E', text: '$120°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '평각의 $2/3$' },
    ],
    solution: '평각 $= 180°$, 절반 $= 90°$ (직각).' },

  // S10 (중) 4각 합
  { chapterCode: CODE, difficulty: 'medium', concept: '한 점 둘레 4각 합', requiredSkills: SKILLS_VERTICAL,
    stem: '두 직선이 한 점에서 만날 때 만들어지는 $4$개 각의 합은?',
    options: [
      { key: 'A', text: '$360°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$180°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평각 한 쪽만' },
      { key: 'C', text: '$90°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '직각만' },
      { key: 'D', text: '$720°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$360 \\times 2$' },
      { key: 'E', text: '$540°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '오각형 내각 합과 혼동' },
    ],
    solution: '한 점 주위 모든 각의 합 = $360°$.' },

  // S11 (중) 각의 합 (내부 반직선)
  { chapterCode: CODE, difficulty: 'medium', concept: '각의 합 분해', requiredSkills: SKILLS_ADJACENT,
    stem: '한 점 $O$ 에서 세 반직선 $OA, OB, OC$ 가 있다. $\\angle AOB = 70°$, $\\angle BOC = 40°$ 이고 $B$ 는 $\\angle AOC$ 의 내부에 있다. $\\angle AOC$ 의 크기는?',
    options: [
      { key: 'A', text: '$110°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$30°$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$70 - 40$ 차로 처리' },
      { key: 'C', text: '$2800°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$70 \\times 40$' },
      { key: 'D', text: '$90°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '직각으로 추측' },
      { key: 'E', text: '$180°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평각으로 추측' },
    ],
    solution: '$B$ 내부 → $\\angle AOC = \\angle AOB + \\angle BOC = 70° + 40° = 110°$.' },

  // S12 (중) 보각·여각 관계식
  { chapterCode: CODE, difficulty: 'medium', concept: '보각 = 여각의 세 배', requiredSkills: SKILLS_COMP_SUPP,
    stem: '어떤 각의 보각이 그 여각의 $3$ 배이다. 그 각의 크기는?',
    options: [
      { key: 'A', text: '$45°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$30°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$180 - x = 3(90-x)$에서 $x = 45$인데 잘못 계산' },
      { key: 'C', text: '$60°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '보각과 여각 혼동' },
      { key: 'D', text: '$15°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 계수' },
      { key: 'E', text: '$22.5°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 분모' },
    ],
    solution: '각 $= x$. 보각 $= 180 - x$, 여각 $= 90 - x$. $180 - x = 3(90 - x) \\to 180 - x = 270 - 3x \\to 2x = 90 \\to x = 45°$.' },

  // S13 (중) 평행선 동위각 = 130°
  { chapterCode: CODE, difficulty: 'medium', concept: '평행선 동위각 크기 일치', requiredSkills: SKILLS_PARALLEL,
    stem: '$l \\parallel m$ 이고 횡단선이 $l$ 과 만나 만드는 한 동위각이 $130°$ 이다. $m$ 과 만나서 만드는 같은 위치의 동위각은?',
    options: [
      { key: 'A', text: '$130°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$50°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '보각 적용' },
      { key: 'C', text: '$180°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평각으로' },
      { key: 'D', text: '$90°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '직각으로 추측' },
      { key: 'E', text: '$260°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2 \\times 130$' },
    ],
    solution: '평행선에서 동위각은 크기가 같다 → $130°$.' },

  // S14 (중) 평행선 엇각 = 75°
  { chapterCode: CODE, difficulty: 'medium', concept: '평행선 엇각 크기 일치', requiredSkills: SKILLS_PARALLEL,
    stem: '$l \\parallel m$ 이고 횡단선이 $l$ 과 만나는 각 중 하나가 $75°$ 일 때, $m$ 과 만나서 만드는 엇각은?',
    options: [
      { key: 'A', text: '$75°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$105°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '동측내각 (보각)' },
      { key: 'C', text: '$15°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '여각 ($90 - 75$)' },
      { key: 'D', text: '$285°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$360 - 75$' },
      { key: 'E', text: '$180°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평각' },
    ],
    solution: '평행선에서 엇각은 크기가 같다 → $75°$.' },

  // S15 (중) 평행선 동위각 → 보각
  { chapterCode: CODE, difficulty: 'medium', concept: '평행선 + 보각 활용', requiredSkills: SKILLS_PARALLEL,
    stem: '$l \\parallel m$ 일 때 $l$ 과 횡단선이 이루는 한 각이 $60°$ 이다. 같은 횡단선이 $m$ 과 만나서 만드는 동측내각(같은 쪽 내각)은?',
    options: [
      { key: 'A', text: '$120°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$60°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '동위각·엇각과 혼동' },
      { key: 'C', text: '$30°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '여각 ($90 - 60$)' },
      { key: 'D', text: '$180°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평각으로' },
      { key: 'E', text: '$300°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$360 - 60$' },
    ],
    solution: '동측내각의 합 $= 180°$ (평행 조건). $180 - 60 = 120°$.' },

  // S16 (어려움) 동위각 미정
  { chapterCode: CODE, difficulty: 'hard', concept: '평행선 동위각 미정값', requiredSkills: SKILLS_EQ_FIG,
    stem: '$l \\parallel m$ 일 때 횡단선이 만드는 동위각이 $(2x + 20)°$ 와 $(4x - 10)°$ 이다. $x$ 는?',
    options: [
      { key: 'A', text: '$x = 15$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = 5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$2x - 20 = 4x + 10$ 부호 잘못' },
      { key: 'C', text: '$x = 30$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$6x = 30$ 잘못된 합' },
      { key: 'D', text: '$x = 10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 이항' },
      { key: 'E', text: '$x = 25$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '보각 적용 ($2x+20+4x-10=180$)' },
    ],
    solution: '동위각 크기 같음: $2x + 20 = 4x - 10 \\to 30 = 2x \\to x = 15$.' },

  // S17 (어려움) 맞꼭지각 미정
  { chapterCode: CODE, difficulty: 'hard', concept: '맞꼭지각 미정값', requiredSkills: SKILLS_EQ_FIG,
    stem: '두 직선이 만난 점에서 한 각 $(5x - 20)°$ 와 그 맞꼭지각 $(3x + 10)°$ 이 있다. $x$ 는?',
    options: [
      { key: 'A', text: '$x = 15$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = 5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$5x + 20 = 3x - 10$ 부호 잘못' },
      { key: 'C', text: '$x = -5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$5x - 20 = -(3x + 10)$ 부호 잘못' },
      { key: 'D', text: '$x = 25$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '보각 적용 ($5x-20+3x+10=180$)' },
      { key: 'E', text: '$x = 30$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$8x = 30$ 잘못된 합' },
    ],
    solution: '맞꼭지각 크기 같음: $5x - 20 = 3x + 10 \\to 2x = 30 \\to x = 15$.' },

  // S18 (어려움) 평각 위 세 각
  { chapterCode: CODE, difficulty: 'hard', concept: '평각 위 세 각의 합 미정값', requiredSkills: SKILLS_STRAIGHT,
    stem: '한 직선 위에 세 각 $x°$, $(2x + 30)°$, $(x - 10)°$ 이 차례로 있다. $x$ 는?',
    options: [
      { key: 'A', text: '$x = 40$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = 50$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$4x + 20 = 180$, $4x = 160$인데 잘못' },
      { key: 'C', text: '$x = 90$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평각 = $360°$로 오해 ($4x + 20 = 360$)' },
      { key: 'D', text: '$x = 35$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 합' },
      { key: 'E', text: '$x = 45$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$4x = 180$ 상수항 무시' },
    ],
    solution: '평각 합 $= 180°$. $x + (2x + 30) + (x - 10) = 180 \\to 4x + 20 = 180 \\to x = 40$.' },

  // S19 (어려움) 수직 + 내부 반직선
  { chapterCode: CODE, difficulty: 'hard', concept: '수직 + 내부 반직선 각 분해', requiredSkills: SKILLS_ADJACENT,
    stem: '$\\overrightarrow{OA} \\perp \\overrightarrow{OB}$ 이고 반직선 $\\overrightarrow{OC}$ 가 $\\angle AOB$ 의 내부에 있다. $\\angle AOC = 25°$ 일 때 $\\angle BOC$ 는?',
    options: [
      { key: 'A', text: '$65°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$25°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\angle AOC$ 와 같다고 가정' },
      { key: 'C', text: '$155°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\angle AOB$를 $180°$로 오해' },
      { key: 'D', text: '$90°$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\angle AOC$ 차감 누락' },
      { key: 'E', text: '$115°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$90 + 25$ 합으로' },
    ],
    solution: '수직 → $\\angle AOB = 90°$. $\\angle BOC = 90 - 25 = 65°$.' },

  // S20 (어려움) 평행선 엇각 미정값
  { chapterCode: CODE, difficulty: 'hard', concept: '평행선 엇각 미정값', requiredSkills: SKILLS_EQ_FIG,
    stem: '$l \\parallel m$ 일 때 횡단선이 만드는 엇각이 $(2x + 15)°$ 와 $(4x - 25)°$ 이다. $x$ 는?',
    options: [
      { key: 'A', text: '$x = 20$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = 5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$2x - 15 = 4x + 25$ 부호 잘못' },
      { key: 'C', text: '$x = 10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$6x = 60$ 등 잘못된 합' },
      { key: 'D', text: '$x = 30$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 이항' },
      { key: 'E', text: '$x = 32$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '보각 적용 ($2x+15+4x-25=180$)' },
    ],
    solution: '엇각 크기 같음: $2x + 15 = 4x - 25 \\to 40 = 2x \\to x = 20$.' },
];

export const K_G7_MATH1_CH05_BASIC_FIGURES_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
