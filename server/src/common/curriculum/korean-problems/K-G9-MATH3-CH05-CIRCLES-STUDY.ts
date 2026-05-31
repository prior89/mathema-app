/**
 * K-G9-MATH3-CH05-CIRCLES — STUDY pool (single-step, 20문제).
 * 원의 성질 — 원주각·중심각·접선·내접 사각형·호의 길이.
 * Mastery 3-step과 별도 변형 문제. 중3 (G9).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5. LLM 미사용.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G9-MATH3-CH05-CIRCLES';
const SKILLS_INSCRIBED = ['inscribed_angle_theorem', 'central_to_inscribed'];
const SKILLS_INVERSE = ['inscribed_to_central'];
const SKILLS_SAMEARC = ['same_arc_inscribed_equal'];
const SKILLS_SEMI = ['semicircle_inscribed_90', 'diameter_subtend'];
const SKILLS_TANGENT = ['tangent_perpendicular_radius', 'two_tangent_lengths', 'tangent_chord_angle'];
const SKILLS_CHORD = ['perpendicular_bisector_chord', 'chord_passes_center'];
const SKILLS_QUAD = ['cyclic_quadrilateral', 'opposite_angles_sum'];
const SKILLS_ARC_LEN = ['arc_length_formula', 'central_angle_proportion'];
const SKILLS_DEF = ['circle_definition', 'arc_chord_distinction'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) 중심각 60° → 원주각
  { chapterCode: CODE, difficulty: 'easy', concept: '중심각 $60°$ → 원주각', requiredSkills: SKILLS_INSCRIBED,
    stem: '중심각 $60°$ 일 때 같은 호의 원주각은?',
    options: [
      { key: 'A', text: '$30°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$60°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '중심각 자체' },
      { key: 'C', text: '$120°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$2$배 (역방향)' },
      { key: 'D', text: '$90°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 비' },
      { key: 'E', text: '$15°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$/4$ 잘못' },
    ],
    solution: '원주각 $= $ 중심각 $/ 2 = 60 / 2 = 30°$.' },

  // S2 (쉬움) 중심각 90° → 원주각
  { chapterCode: CODE, difficulty: 'easy', concept: '중심각 $90°$ → 원주각', requiredSkills: SKILLS_INSCRIBED,
    stem: '중심각 $90°$ → 원주각?',
    options: [
      { key: 'A', text: '$45°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$90°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '중심각 그대로' },
      { key: 'C', text: '$180°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$2$배' },
      { key: 'D', text: '$30°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$/3$ 잘못' },
      { key: 'E', text: '$60°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 추측' },
    ],
    solution: '$90° / 2 = 45°$.' },

  // S3 (쉬움) 반원 원주각
  { chapterCode: CODE, difficulty: 'easy', concept: '반원(지름)의 원주각', requiredSkills: SKILLS_SEMI,
    stem: '반원(지름이 만드는 호)에 대한 원주각은?',
    options: [
      { key: 'A', text: '$90°$ (직각)', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$180°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '중심각 자체' },
      { key: 'C', text: '$60°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '특수각 잘못' },
      { key: 'D', text: '$45°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 식' },
      { key: 'E', text: '$120°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 값' },
    ],
    solution: '지름의 중심각 $= 180°$. 원주각 $= 180/2 = 90°$ (탈레스 정리).' },

  // S4 (쉬움) 현 수직이등분
  { chapterCode: CODE, difficulty: 'easy', concept: '현의 수직이등분선', requiredSkills: SKILLS_CHORD,
    stem: '원의 현의 수직이등분선은 어떤 점을 지나는가?',
    options: [
      { key: 'A', text: '원의 중심', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '현의 양 끝점', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '수직이등분선은 끝점에서 멀어짐' },
      { key: 'C', text: '원 위 다른 임의의 점', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '특정 점 (중심)' },
      { key: 'D', text: '접점', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '관련 없음' },
      { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '판별 가능' },
    ],
    solution: '현의 수직이등분선은 항상 원의 중심을 지남 (원의 성질).' },

  // S5 (쉬움) 원의 정의
  { chapterCode: CODE, difficulty: 'easy', concept: '원의 정의', requiredSkills: SKILLS_DEF,
    stem: '원은 어떻게 정의되는가?',
    options: [
      { key: 'A', text: '한 점에서 일정한 거리에 있는 점들의 모임', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '두 점에서 같은 거리에 있는 점들', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '수직이등분선' },
      { key: 'C', text: '세 점을 지나는 도형', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '세 점 원의 결정 조건과 혼동' },
      { key: 'D', text: '닫혀 있는 곡선', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '너무 광범위 (타원도 포함)' },
      { key: 'E', text: '반지름이 같은 두 도형', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '정의 아님' },
    ],
    solution: '원 = 중심에서 같은 거리(반지름)에 있는 점들의 집합.' },

  // S6 (쉬움) 호와 현
  { chapterCode: CODE, difficulty: 'easy', concept: '호 vs 현', requiredSkills: SKILLS_DEF,
    stem: '호와 현의 차이는?',
    options: [
      { key: 'A', text: '호는 원 위의 곡선 일부, 현은 두 점을 잇는 선분', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '같다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '다른 개념' },
      { key: 'C', text: '호는 직선, 현은 곡선', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '반대' },
      { key: 'D', text: '둘 다 반지름', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '반지름과 다름' },
      { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '명확히 구분' },
    ],
    solution: '호 — 원 위의 곡선 (arc). 현 — 두 점을 잇는 선분 (chord).' },

  // S7 (중) 원주각 30° → 중심각
  { chapterCode: CODE, difficulty: 'medium', concept: '원주각 $30°$ → 중심각', requiredSkills: SKILLS_INVERSE,
    stem: '원주각 $30°$ → 중심각?',
    options: [
      { key: 'A', text: '$60°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$15°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$/2$ 잘못된 방향' },
      { key: 'C', text: '$30°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원주각 그대로' },
      { key: 'D', text: '$90°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 비' },
      { key: 'E', text: '$120°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$4$ 배' },
    ],
    solution: '중심각 $= 2 \\times $ 원주각 $= 2 \\times 30 = 60°$.' },

  // S8 (중) 중심각 140° → 원주각
  { chapterCode: CODE, difficulty: 'medium', concept: '중심각 $140°$ → 원주각', requiredSkills: SKILLS_INSCRIBED,
    stem: '중심각 $140°$ → 원주각?',
    options: [
      { key: 'A', text: '$70°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$140°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '중심각 그대로' },
      { key: 'C', text: '$280°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$2$배 (역방향)' },
      { key: 'D', text: '$40°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 분수' },
      { key: 'E', text: '$50°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
    ],
    solution: '$140 / 2 = 70°$.' },

  // S9 (중) 같은 호 다른 점
  { chapterCode: CODE, difficulty: 'medium', concept: '같은 호 원주각 (다른 점)', requiredSkills: SKILLS_SAMEARC,
    stem: '점 $P$ 에서 호 $AB$ 에 대한 원주각이 $45°$. 다른 점 $Q$ 에서 같은 호 $AB$ 의 원주각은?',
    options: [
      { key: 'A', text: '$45°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$22.5°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$/2$ 잘못' },
      { key: 'C', text: '$90°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\times 2$ 잘못' },
      { key: 'D', text: '$135°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '보각 적용 잘못' },
      { key: 'E', text: '판별 불가 — 점 위치 필요', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '같은 호 → 항상 같음' },
    ],
    solution: '같은 호에 대한 원주각은 모두 같음 → $45°$.' },

  // S10 (중) 호 길이 → 중심각
  { chapterCode: CODE, difficulty: 'medium', concept: '호 길이와 중심각 관계', requiredSkills: SKILLS_INSCRIBED,
    stem: '같은 원의 두 호 길이가 같으면 그 두 호의 중심각은?',
    options: [
      { key: 'A', text: '같다', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '항상 다르다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '같음' },
      { key: 'C', text: '합이 $180°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '보각 관계 X' },
      { key: 'D', text: '두 배 관계', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 관계' },
      { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '판별 가능' },
    ],
    solution: '한 원에서 호 길이 ∝ 중심각 → 호 길이 같으면 중심각도 같음.' },

  // S11 (중) 외접 두 접선 길이
  { chapterCode: CODE, difficulty: 'medium', concept: '외접 두 접선 길이 같음', requiredSkills: SKILLS_TANGENT,
    stem: '원 밖의 한 점 $P$ 에서 원에 그은 두 접선의 접점이 $A, B$ 이고 $PA = 6$. $PB$ 의 길이는?',
    options: [
      { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$/2$ 잘못' },
      { key: 'C', text: '$12$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\times 2$ 잘못' },
      { key: 'D', text: '$\\sqrt{6}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '제곱근 잘못' },
      { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '관계 명확함' },
    ],
    solution: '한 점에서 그은 두 접선의 길이는 같음 ($PA = PB$). → $PB = 6$.' },

  // S12 (중) 내접 사각형 ∠A=80°
  { chapterCode: CODE, difficulty: 'medium', concept: '내접 사각형 대각합', requiredSkills: SKILLS_QUAD,
    stem: '원에 내접하는 사각형 $ABCD$ 에서 $\\angle A = 80°$. $\\angle C$ 는?',
    options: [
      { key: 'A', text: '$100°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$80°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '같다고 가정' },
      { key: 'C', text: '$260°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 합' },
      { key: 'D', text: '$10°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '여각 적용' },
      { key: 'E', text: '$90°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 차' },
    ],
    solution: '내접 사각형 대각의 합 $= 180°$. $\\angle C = 180 - 80 = 100°$.' },

  // S13 (중) 원주각 90° 호
  { chapterCode: CODE, difficulty: 'medium', concept: '원주각 $90°$ → 지름', requiredSkills: SKILLS_SEMI,
    stem: '원주의 어떤 점 $C$ 에서 호 $AB$ 의 원주각이 $90°$ 일 때 호 $AB$ 의 정체는?',
    options: [
      { key: 'A', text: '$AB$ 는 지름이다 (반원)', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$AB$ 는 한 점', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$AB$ 호 — 길이 있음' },
      { key: 'C', text: '$AB$ 는 원의 둘레 전체', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '둘레의 절반 (반원)' },
      { key: 'D', text: '$AB$ 는 반지름', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '반지름은 호 아님' },
      { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '명확' },
    ],
    solution: '원주각 $90°$ → 중심각 $180°$ → 호 $AB$ 는 반원 → $AB$ 는 지름.' },

  // S14 (중) 접선과 반지름
  { chapterCode: CODE, difficulty: 'medium', concept: '접선과 반지름 각', requiredSkills: SKILLS_TANGENT,
    stem: '원의 접선과 그 접점에서 그은 반지름이 이루는 각의 크기는?',
    options: [
      { key: 'A', text: '$90°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$45°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 추측' },
      { key: 'C', text: '$60°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 값' },
      { key: 'D', text: '$0°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평행 X' },
      { key: 'E', text: '$180°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '직선 X' },
    ],
    solution: '접선과 접점의 반지름은 항상 수직 ($90°$).' },

  // S15 (중) 두 현 만남
  { chapterCode: CODE, difficulty: 'medium', concept: '두 현 교점에서 정의', requiredSkills: SKILLS_CHORD,
    stem: '원의 두 현이 서로 수직이등분 할 때 두 현은 어떤 관계인가?',
    options: [
      { key: 'A', text: '두 현 모두 지름 (서로 수직인 지름)', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '두 현 모두 같은 길이', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '지름이라서 같지만 본질 X' },
      { key: 'C', text: '두 현 모두 반지름', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '현과 반지름 다름' },
      { key: 'D', text: '두 현은 평행', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '수직 ↔ 평행 모순' },
      { key: 'E', text: '두 현은 같음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '다른 두 현' },
    ],
    solution: '수직이등분선은 항상 중심을 지나므로 두 현 모두 중심을 통과 → 지름.' },

  // S16 (어려움) 중심각 → 원주각
  { chapterCode: CODE, difficulty: 'hard', concept: '$\\angle AOB$ → $\\angle APB$', requiredSkills: SKILLS_INSCRIBED,
    stem: '원의 중심 $O$ 에서 $\\angle AOB = 80°$. 원주의 한 점 $P$ 에서 호 $AB$ 의 원주각 $\\angle APB$ 는?',
    options: [
      { key: 'A', text: '$40°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$80°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '중심각 그대로' },
      { key: 'C', text: '$160°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\times 2$ 잘못' },
      { key: 'D', text: '$100°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '보각' },
      { key: 'E', text: '$20°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$/4$ 잘못' },
    ],
    solution: '원주각 $= $ 중심각 $/ 2 = 80 / 2 = 40°$.' },

  // S17 (어려움) P, Q 원주각
  { chapterCode: CODE, difficulty: 'hard', concept: '같은 호의 두 점 원주각', requiredSkills: SKILLS_SAMEARC,
    stem: '점 $P$ 에서 호 $AB$ 의 원주각 $\\angle APB = 50°$. 같은 호 $AB$ 의 다른 점 $Q$ 에서 $\\angle AQB$ 는?',
    options: [
      { key: 'A', text: '$50°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$25°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$/2$ 잘못' },
      { key: 'C', text: '$100°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\times 2$ 잘못' },
      { key: 'D', text: '$130°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '보각 적용 잘못' },
      { key: 'E', text: '$40°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 추정' },
    ],
    solution: '같은 호에 대한 원주각은 모두 같음 → $50°$.' },

  // S18 (어려움) 내접 사각형 ∠B=120°
  { chapterCode: CODE, difficulty: 'hard', concept: '내접 사각형 대각 ∠B=120° → ∠D', requiredSkills: SKILLS_QUAD,
    stem: '원에 내접하는 사각형 $ABCD$ 에서 $\\angle B = 120°$. $\\angle D$ 는?',
    options: [
      { key: 'A', text: '$60°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$120°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '같다고 가정' },
      { key: 'C', text: '$240°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 합' },
      { key: 'D', text: '$30°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 차' },
      { key: 'E', text: '$90°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 값' },
    ],
    solution: '내접 사각형 대각의 합 $= 180°$. $\\angle D = 180 - 120 = 60°$.' },

  // S19 (어려움) 접선현각
  { chapterCode: CODE, difficulty: 'hard', concept: '접선과 현이 이루는 각', requiredSkills: SKILLS_TANGENT,
    stem: '원의 점 $A$ 에서 접선과 현 $AB$ 가 이루는 각이 $60°$. 호 $AB$ 의 (반대편) 원주각은?',
    options: [
      { key: 'A', text: '$60°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$30°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$/2$ 잘못' },
      { key: 'C', text: '$120°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\times 2$ 잘못' },
      { key: 'D', text: '$90°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 추측' },
      { key: 'E', text: '$45°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 값' },
    ],
    solution: '접선현각 정리: 접선과 현이 이루는 각 = 그 현이 만드는 호의 원주각 → $60°$.' },

  // S20 (어려움) 호 길이
  { chapterCode: CODE, difficulty: 'hard', concept: '호의 길이 (반지름 $6$, 중심각 $120°$)', requiredSkills: SKILLS_ARC_LEN,
    stem: '반지름 $6$ 인 원에서 중심각 $120°$ 인 호의 길이는?',
    options: [
      { key: 'A', text: '$4\\pi$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$12\\pi$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '전체 둘레 ($2\\pi r$)' },
      { key: 'C', text: '$\\dfrac{\\pi}{3}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
      { key: 'D', text: '$8\\pi$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 비' },
      { key: 'E', text: '$\\dfrac{120}{360} \\cdot 6 = 2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$2\\pi r$ 미적용' },
    ],
    solution: '호 길이 $= 2\\pi r \\cdot \\dfrac{\\theta}{360} = 12\\pi \\cdot \\dfrac{120}{360} = 12\\pi \\cdot \\dfrac{1}{3} = 4\\pi$.' },
];

export const K_G9_MATH3_CH05_CIRCLES_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
