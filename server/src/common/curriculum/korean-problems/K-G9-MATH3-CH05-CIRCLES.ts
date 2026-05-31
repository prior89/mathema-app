/**
 * K-G9-MATH3-CH05-CIRCLES (원의 성질) — 20문제 3-step Mastery.
 * 중3 — 원주각 정리 (중심각의 1/2) → 같은 호 원주각 같음 → 접선 ⊥ 반지름 →
 *        현의 수직이등분 → 내접 사각형 대각합 180° → 호의 길이.
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 * 주요 errorCode 분배:
 *   GEOMETRY_PROPERTY_ERROR 7 (Q1,4,5,11,12,15,19) / ARITHMETIC_ERROR 5 (Q2,3,7,8,9)
 *   CONCEPT_MISUNDERSTANDING 3 (Q6,13,14) / FORMULA_SELECTION_ERROR 2 (Q10,20)
 *   ALGEBRA_ERROR 2 (Q16,18) / CONDITION_MISSING 1 (Q17)
 *
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G9-MATH3-CH05-CIRCLES';
const SKILLS_INSCRIBED = ['inscribed_angle_theorem', 'central_to_inscribed'];
const SKILLS_INVERSE = ['inscribed_to_central'];
const SKILLS_TANGENT = ['tangent_perpendicular_radius', 'tangent_chord'];
const SKILLS_SAMEARC = ['same_arc_same_angle'];
const SKILLS_SEMI = ['semicircle_right_angle'];
const SKILLS_CHORD = ['chord_perpendicular_bisector'];
const SKILLS_QUAD = ['cyclic_quadrilateral_opposite_180'];
const SKILLS_ARC_LEN = ['arc_length'];

const problems: KoreanProblemSeed[] = [
  // Q1
  { chapterCode: CODE, difficulty: 'easy', concept: '원주각 정리', requiredSkills: SKILLS_INSCRIBED,
    stem: '한 호에 대한 원주각은 그 호에 대한 중심각의 몇 배인가?',
    steps: [
      { stepType: 'CONCEPT', prompt: '원주각 정리', options: [
        { key: 'A', text: '$\\dfrac{1}{2}$ 배 (중심각의 절반)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2$ 배 (중심각의 두 배)', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '거꾸로' },
        { key: 'C', text: '같음', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\dfrac{1}{3}$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '관계 없음', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '관계 있음' },
      ] },
      { stepType: 'PROCESS', prompt: '원주각이 더 작은가 큰가?', options: [
        { key: 'A', text: '항상 작음 (중심각의 반)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '항상 큼', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '작음' },
        { key: 'C', text: '같음', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '다름' },
        { key: 'D', text: '경우마다 다름', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '항상 반' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'ANSWER', prompt: '관계?', options: [
        { key: 'A', text: '원주각 = 중심각 $\\times \\dfrac{1}{2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '원주각 = 중심각 $\\times 2$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '거꾸로' },
        { key: 'C', text: '같음', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '원주각 $= 360°$ - 중심각', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '관계 없음', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '관계 있음' },
      ] },
    ], solution: '원주각 = 중심각 / 2.' },

  // Q2
  { chapterCode: CODE, difficulty: 'easy', concept: '중심각 → 원주각 (80°)', requiredSkills: SKILLS_INSCRIBED,
    stem: '중심각 $80°$ 일 때 같은 호의 원주각은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '원주각 = 중심각 / 2', options: [
        { key: 'A', text: '$80° / 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$80° \\times 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '곱' },
        { key: 'C', text: '$80°$ 그대로', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$180° - 80°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$360° - 80°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$80 / 2 = ?$', options: [
        { key: 'A', text: '$40$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$160$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '곱' },
        { key: 'C', text: '$80$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 안 함' },
        { key: 'D', text: '$20$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '원주각?', options: [
        { key: 'A', text: '$40°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$160°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '곱' },
        { key: 'C', text: '$80°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 안 함' },
        { key: 'D', text: '$100°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$180-80$' },
        { key: 'E', text: '$280°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '원주각 $= 80°/2 = 40°$.' },

  // Q3
  { chapterCode: CODE, difficulty: 'easy', concept: '중심각 → 원주각 (120°)', requiredSkills: SKILLS_INSCRIBED,
    stem: '중심각 $120°$ → 원주각?',
    steps: [
      { stepType: 'CONCEPT', prompt: '공식', options: [
        { key: 'A', text: '$120 / 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$120 \\times 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '곱' },
        { key: 'C', text: '$180 - 120$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$120$ 그대로', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$360 / 120$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$120/2 = ?$', options: [
        { key: 'A', text: '$60$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$240$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '곱' },
        { key: 'C', text: '$120$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 안 함' },
        { key: 'D', text: '$30$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$40$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '원주각?', options: [
        { key: 'A', text: '$60°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$240°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '곱' },
        { key: 'C', text: '$120°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$30°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$180°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '원주각 $= 120°/2 = 60°$.' },

  // Q4
  { chapterCode: CODE, difficulty: 'easy', concept: '접선과 반지름', requiredSkills: SKILLS_TANGENT,
    stem: '원의 접선과 그 접점에서 그은 반지름은 어떤 각을 이루는가?',
    steps: [
      { stepType: 'CONCEPT', prompt: '접선의 성질?', options: [
        { key: 'A', text: '접선 $\\perp$ 반지름 (직각)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '접선 = 반지름', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$45°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$60°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '결정 불가', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '항상 직각' },
      ] },
      { stepType: 'PROCESS', prompt: '직각의 의미', options: [
        { key: 'A', text: '$90°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$180°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '평각' },
        { key: 'C', text: '$45°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$60°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '각?', options: [
        { key: 'A', text: '$90°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$180°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '평각' },
        { key: 'C', text: '$45°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$60°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$30°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '접선 ⊥ 반지름 = $90°$.' },

  // Q5
  { chapterCode: CODE, difficulty: 'easy', concept: '같은 호의 원주각', requiredSkills: SKILLS_SAMEARC,
    stem: '같은 호에 대해 원주의 다른 점들에서 본 원주각들의 관계는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '원주각 정리의 따름?', options: [
        { key: 'A', text: '모두 같다 (= 중심각/2 동일)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '모두 다르다', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '같음' },
        { key: 'C', text: '경우마다 다름', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '항상 같음' },
        { key: 'D', text: '점의 위치마다 변함', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '합이 $180°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '왜?', options: [
        { key: 'A', text: '모두 중심각의 $1/2$ 이므로', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '점이 같아서', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '다름' },
        { key: 'C', text: '호가 달라서', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '같은 호' },
        { key: 'D', text: '평행이라서', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'ANSWER', prompt: '관계?', options: [
        { key: 'A', text: '모두 같음', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '합 $180°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '서로 다름', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '같음' },
        { key: 'D', text: '하나만 직각', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '가능' },
      ] },
    ], solution: '같은 호의 원주각은 모두 같다.' },

  // Q6
  { chapterCode: CODE, difficulty: 'easy', concept: '반원의 원주각', requiredSkills: SKILLS_SEMI,
    stem: '반원 (지름)에 대한 원주각은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '반원의 중심각?', options: [
        { key: 'A', text: '$180°$ (평각, 지름)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$360°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원 전체' },
        { key: 'C', text: '$90°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '직각' },
        { key: 'D', text: '$60°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$45°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '원주각 = $180/2$', options: [
        { key: 'A', text: '$90°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$180°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '나누기 안 함' },
        { key: 'C', text: '$45°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$60°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$120°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '반원의 원주각?', options: [
        { key: 'A', text: '$90°$ (직각)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$180°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평각' },
        { key: 'C', text: '$45°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$60°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$120°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '반원 중심각 $180°$ → 원주각 $90°$ (탈레스 정리).' },

  // Q7
  { chapterCode: CODE, difficulty: 'medium', concept: '원주각 → 중심각 (역)', requiredSkills: SKILLS_INVERSE,
    stem: '원주각 $40°$ → 중심각?',
    steps: [
      { stepType: 'CONCEPT', prompt: '역방향 공식', options: [
        { key: 'A', text: '중심각 = 원주각 $\\times 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '중심각 = 원주각 / 2', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '거꾸로' },
        { key: 'C', text: '중심각 = 원주각', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '중심각 = $180° - $ 원주각', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '중심각 = $360° - $ 원주각', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$40 \\times 2$', options: [
        { key: 'A', text: '$80$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$20$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기' },
        { key: 'C', text: '$40$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$140$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$160$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '중심각?', options: [
        { key: 'A', text: '$80°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$20°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기' },
        { key: 'C', text: '$40°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$140°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$160°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '중심각 $= 40° \\times 2 = 80°$.' },

  // Q8
  { chapterCode: CODE, difficulty: 'medium', concept: '원주각 60° → 중심각', requiredSkills: SKILLS_INVERSE,
    stem: '원주각 $60°$ → 중심각?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\times 2$', options: [
        { key: 'A', text: '$60 \\times 2 = 120$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$60 / 2 = 30$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기' },
        { key: 'C', text: '$60$ 그대로', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$60 + 60 = 120$ (맞지만 곱과 동일)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '맞지만 표현 우회' },
        { key: 'E', text: '$180 - 60 = 120$ (우연 일치)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '식 의미 다름' },
      ] },
      { stepType: 'PROCESS', prompt: '$120°$', options: [
        { key: 'A', text: '$120°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$30°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기' },
        { key: 'C', text: '$60°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$240°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$300°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '중심각?', options: [
        { key: 'A', text: '$120°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$30°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기' },
        { key: 'C', text: '$60°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$240°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$300°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '중심각 $= 60 \\times 2 = 120°$.' },

  // Q9
  { chapterCode: CODE, difficulty: 'medium', concept: '중심각 100° → 원주각', requiredSkills: SKILLS_INSCRIBED,
    stem: '중심각 $100°$ → 원주각?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$/2$', options: [
        { key: 'A', text: '$50°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$200°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '곱' },
        { key: 'C', text: '$100°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 안 함' },
        { key: 'D', text: '$80°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$25°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$/4$' },
      ] },
      { stepType: 'PROCESS', prompt: '확인', options: [
        { key: 'A', text: '$50 \\times 2 = 100$ ✓', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$200 / 2 = 100$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '값 잘못' },
        { key: 'C', text: '검산 불가', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '가능' },
        { key: 'D', text: '$80 \\times 1.25 = 100$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$25 \\times 4 = 100$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '원주각?', options: [
        { key: 'A', text: '$50°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$100°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$200°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '곱' },
        { key: 'D', text: '$80°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$25°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$/4$' },
      ] },
    ], solution: '원주각 $= 100° / 2 = 50°$.' },

  // Q10
  { chapterCode: CODE, difficulty: 'medium', concept: '다른 점에서 같은 호의 원주각', requiredSkills: SKILLS_SAMEARC,
    stem: '점 $P$ 에서 호 $AB$ 에 대한 원주각이 $35°$. 다른 점 $Q$ 에서 같은 호 $AB$ 의 원주각은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '같은 호의 원주각?', options: [
        { key: 'A', text: '모두 같음', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$P$ 와 다름', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '같음' },
        { key: 'C', text: '$P$ 와 보각 ($180° - 35°$)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$P$ 의 두 배', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '중심각' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: 'P, Q 모두 같은 호 → 같은 원주각', options: [
        { key: 'A', text: '$Q$ 에서도 $35°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$Q$ 에서 $70°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '두 배' },
        { key: 'C', text: '$Q$ 에서 $145°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '보각' },
        { key: 'D', text: '$Q$ 에서 $17.5°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '반' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'ANSWER', prompt: '$Q$ 에서?', options: [
        { key: 'A', text: '$35°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$70°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '중심각' },
        { key: 'C', text: '$145°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '보각' },
        { key: 'D', text: '$17.5°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '반' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '가능' },
      ] },
    ], solution: '같은 호 → 모든 원주각 같음 = $35°$.' },

  // Q11
  { chapterCode: CODE, difficulty: 'medium', concept: '접선과 반지름 각', requiredSkills: SKILLS_TANGENT,
    stem: '원에 외접하는 직선이 한 점에서 원과 만나면, 그 접점에서 그은 반지름과 직선이 이루는 각은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '접선의 핵심 성질', options: [
        { key: 'A', text: '접선 ⊥ 반지름 (접점에서)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '접선 = 반지름', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '접선 ∥ 반지름', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '접선과 반지름 각 $60°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '관계 없음', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '있음' },
      ] },
      { stepType: 'PROCESS', prompt: '⊥의 의미', options: [
        { key: 'A', text: '$90°$ (직각)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0°$ (평행)', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$45°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$60°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$180°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '평각' },
      ] },
      { stepType: 'ANSWER', prompt: '각?', options: [
        { key: 'A', text: '$90°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$45°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$60°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$30°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$180°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '평각' },
      ] },
    ], solution: '접선 ⊥ 반지름 = $90°$.' },

  // Q12
  { chapterCode: CODE, difficulty: 'medium', concept: '현의 수직이등분', requiredSkills: SKILLS_CHORD,
    stem: '원의 현의 수직이등분선은 어디를 지나는가?',
    steps: [
      { stepType: 'CONCEPT', prompt: '현 = 원 위 두 점을 잇는 선분. 수직이등분선?', options: [
        { key: 'A', text: '원의 중심을 지남', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '한 점에서 끝남', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '원과 무관', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 있음' },
        { key: 'D', text: '접선이 됨', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '다른 현과 평행', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '이 성질을 활용하면?', options: [
        { key: 'A', text: '두 현의 수직이등분선 교점 = 원의 중심', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '아무 정보 못 얻음', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '유용' },
        { key: 'C', text: '반지름 결정', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '원주율 결정', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '면적 결정', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '어디를 지나?', options: [
        { key: 'A', text: '원의 중심', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '원의 한 점', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '중심' },
        { key: 'C', text: '접점', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '대칭축', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '아무 곳', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '현의 수직이등분선은 항상 원의 중심을 지난다.' },

  // Q13
  { chapterCode: CODE, difficulty: 'medium', concept: '지름에 대한 원주각', requiredSkills: SKILLS_SEMI,
    stem: '$AB$ 가 원의 지름이고 $C$ 가 원주 위에 있을 때, $\\angle ACB$ 의 크기는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '지름 = 반원의 호 → 중심각?', options: [
        { key: 'A', text: '$180°$ (평각)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$360°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원 전체' },
        { key: 'C', text: '$90°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$60°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$45°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '원주각 = $180/2$', options: [
        { key: 'A', text: '$90°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$180°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '나누기 안 함' },
        { key: 'C', text: '$45°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$60°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$30°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$\\angle ACB$?', options: [
        { key: 'A', text: '$90°$ (직각)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$180°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평각' },
        { key: 'C', text: '$45°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$60°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$30°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '지름에 대한 원주각 = $90°$ (탈레스 정리).' },

  // Q14
  { chapterCode: CODE, difficulty: 'medium', concept: '내접 사각형 대각합', requiredSkills: SKILLS_QUAD,
    stem: '원에 내접하는 사각형 $ABCD$ 에서 $\\angle A + \\angle C = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '내접 사각형 정리?', options: [
        { key: 'A', text: '대각의 합 = $180°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '대각의 합 = $360°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '내각 전체 합' },
        { key: 'C', text: '대각이 같음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
        { key: 'D', text: '대각의 합 = $90°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '관계 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '관계 있음' },
      ] },
      { stepType: 'PROCESS', prompt: '왜?', options: [
        { key: 'A', text: '$\\angle A$ 와 $\\angle C$ 는 각각 두 반대 호의 원주각 → 두 호 합 $= 360°$, 원주각 합 $= 180°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '평행사변형 성질', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '근거 없음 (단순 외움)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 있음' },
        { key: 'D', text: '대각선 길이 같음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '회전 대칭', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$\\angle A + \\angle C = ?$', options: [
        { key: 'A', text: '$180°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$360°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '내각 전체' },
        { key: 'C', text: '$90°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$60°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
    ], solution: '내접 사각형 대각합 = $180°$.' },

  // Q15
  { chapterCode: CODE, difficulty: 'medium', concept: '외접 두 접선의 길이', requiredSkills: SKILLS_TANGENT,
    stem: '원 밖의 한 점 $P$ 에서 그은 두 접선 $PA, PB$ (접점 $A, B$). $PA$ 와 $PB$ 의 관계?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\triangle OAP \\equiv \\triangle OBP$ 증명?', options: [
        { key: 'A', text: 'RHS 합동 (직각 + 빗변 $OP$ + 변 $OA = OB$ = 반지름)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: 'AAA 합동', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: 'AAA는 닮음만' },
        { key: 'C', text: '$PA \\neq PB$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '같음' },
        { key: 'D', text: 'SSS 가능', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '맞지만 다른 증명' },
        { key: 'E', text: '증명 불가', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '대응변', options: [
        { key: 'A', text: '$PA = PB$ (합동 대응변)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$PA = 2PB$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$PA = PB/2$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$PA \\perp PB$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '관계 없음', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '있음' },
      ] },
      { stepType: 'ANSWER', prompt: '관계?', options: [
        { key: 'A', text: '$PA = PB$ (같음)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$PA = 2PB$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '직각', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$PA = PB = r$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '반지름과 무관' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '가능' },
      ] },
    ], solution: '한 점에서 그은 두 접선 길이는 같다 ($PA = PB$).' },

  // Q16 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '∠AOB=60° → 원주각', requiredSkills: SKILLS_INSCRIBED,
    stem: '원의 중심 $O$ 에서 $\\angle AOB = 60°$. 원주의 한 점 $P$ 에서 호 $AB$ 의 원주각 $\\angle APB$ 는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '원주각 정리 적용', options: [
        { key: 'A', text: '원주각 = 중심각 / 2', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '원주각 = 중심각 × 2', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '거꾸로' },
        { key: 'C', text: '원주각 = $180°$ - 중심각', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '원주각 = 중심각', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '관계 없음', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '있음' },
      ] },
      { stepType: 'PROCESS', prompt: '$60 / 2$', options: [
        { key: 'A', text: '$30°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$120°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '곱' },
        { key: 'C', text: '$60°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나누기 안 함' },
        { key: 'D', text: '$15°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$/4$' },
        { key: 'E', text: '$45°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$\\angle APB$?', options: [
        { key: 'A', text: '$30°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$60°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 안 함' },
        { key: 'C', text: '$120°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '곱' },
        { key: 'D', text: '$15°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$45°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\angle APB = 60°/2 = 30°$.' },

  // Q17 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '두 점 P, Q 같은 호의 원주각', requiredSkills: SKILLS_SAMEARC,
    stem: '점 $P$ 에서 호 $AB$ 의 원주각 $\\angle APB = 25°$. 같은 호 $AB$ 의 다른 점 $Q$ 에서 $\\angle AQB$ 는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '두 원주각의 관계', options: [
        { key: 'A', text: '같은 호 → 같은 원주각', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '다른 점 → 다른 원주각', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '같은 호면 같음' },
        { key: 'C', text: '합 $180°$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'D', text: '두 배 관계', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$P, Q$ 둘 다 같은 호의 원주각', options: [
        { key: 'A', text: '$\\angle AQB = 25°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$50°$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '두 배' },
        { key: 'C', text: '$12.5°$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '반' },
        { key: 'D', text: '$155°$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '보각' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '가능' },
      ] },
      { stepType: 'ANSWER', prompt: '$\\angle AQB$?', options: [
        { key: 'A', text: '$25°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$50°$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'C', text: '$155°$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '보각' },
        { key: 'D', text: '$12.5°$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '반' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '가능' },
      ] },
    ], solution: '같은 호 → 같은 원주각 = $25°$.' },

  // Q18 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '내접 사각형 ∠A = 75°', requiredSkills: SKILLS_QUAD,
    stem: '원에 내접하는 사각형 $ABCD$ 에서 $\\angle A = 75°$. $\\angle C$ 는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '대각합 = $180°$', options: [
        { key: 'A', text: '$\\angle A + \\angle C = 180°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\angle A = \\angle C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '같음 잘못' },
        { key: 'C', text: '$\\angle A + \\angle C = 90°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\angle A + \\angle C = 360°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '관계 없음', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '있음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\angle C = 180 - 75$', options: [
        { key: 'A', text: '$105°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$75°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '같음' },
        { key: 'C', text: '$255°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$95°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 잘못' },
        { key: 'E', text: '$15°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$\\angle C$?', options: [
        { key: 'A', text: '$105°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$75°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '같음 잘못' },
        { key: 'C', text: '$95°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$15°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '여각' },
        { key: 'E', text: '$285°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\angle A + \\angle C = 180° \\Rightarrow \\angle C = 105°$.' },

  // Q19 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '접선과 현이 이루는 각', requiredSkills: SKILLS_TANGENT,
    stem: '원의 점 $A$ 에서 접선과 현 $AB$ 가 이루는 각이 $40°$. 호 $AB$ 의 원주각은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '접선과 현이 이루는 각 = ?', options: [
        { key: 'A', text: '그 현에 대한 원주각', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '그 현에 대한 중심각', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '원주각이지 중심각 아님' },
        { key: 'C', text: '반지름과의 각', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$90°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '관계 없음', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '있음' },
      ] },
      { stepType: 'PROCESS', prompt: '$40°$ = ?', options: [
        { key: 'A', text: '$\\angle ABP$ (현 $AB$ 에 대한 원주각, $P$ 는 다른 점)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '중심각의 절반의 절반', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '두 배의 원주각', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '같음' },
        { key: 'D', text: '$90°$ - 원주각', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '결정 불가', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'ANSWER', prompt: '원주각?', options: [
        { key: 'A', text: '$40°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$80°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '중심각으로 오해' },
        { key: 'C', text: '$20°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '반' },
        { key: 'D', text: '$50°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '여각' },
        { key: 'E', text: '$140°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '보각' },
      ] },
    ], solution: '접선과 현이 이루는 각 = 그 현에 대한 원주각 = $40°$.' },

  // Q20 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '호의 길이', requiredSkills: SKILLS_ARC_LEN,
    stem: '반지름 $5$ 인 원에서 중심각 $90°$ 인 호의 길이는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '호의 길이 공식?', options: [
        { key: 'A', text: '$\\ell = 2\\pi r \\cdot \\dfrac{\\text{중심각}}{360°}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\ell = 2\\pi r$ (전체 둘레)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '중심각 비율 누락' },
        { key: 'C', text: '$\\ell = \\pi r^2$ (넓이)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '넓이' },
        { key: 'D', text: '$\\ell = r$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\ell = $ 중심각', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$2\\pi(5) \\cdot 90/360 = 10\\pi \\cdot 1/4$', options: [
        { key: 'A', text: '$\\dfrac{5\\pi}{2}$ (또는 $2.5\\pi$)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$10\\pi$ (전체 둘레)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '비율 누락' },
        { key: 'C', text: '$5\\pi$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$1/2$ 적용' },
        { key: 'D', text: '$\\dfrac{\\pi}{4}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '반지름 무시' },
        { key: 'E', text: '$25\\pi$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '넓이' },
      ] },
      { stepType: 'ANSWER', prompt: '호 길이?', options: [
        { key: 'A', text: '$\\dfrac{5\\pi}{2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$10\\pi$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '전체 둘레' },
        { key: 'C', text: '$5\\pi$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$25\\pi$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '넓이' },
        { key: 'E', text: '$\\dfrac{\\pi}{4}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\ell = 2\\pi \\cdot 5 \\cdot \\dfrac{90}{360} = \\dfrac{5\\pi}{2}$.' },
];

export const K_G9_MATH3_CH05_CIRCLES_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
