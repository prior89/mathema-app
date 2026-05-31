/**
 * K-G7-MATH1-CH06-PLANE-FIG (평면도형) — 20문제 3-step Mastery.
 * 중1 — 삼각형 내각합 → 다각형 내각합/외각합 → 정n각형 한 내각·외각 → 합동조건.
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 * 주요 errorCode 분배:
 *   FORMULA_SELECTION_ERROR 5 (Q1,3,4,12,13) / GEOMETRY_PROPERTY_ERROR 5 (Q5,6,7,8,18)
 *   ARITHMETIC_ERROR 4 (Q2,9,10,11) / ALGEBRA_ERROR 3 (Q14,15,17)
 *   CONDITION_MISSING 2 (Q16,20) / CONCEPT_MISUNDERSTANDING 1 (Q19)
 *
 * 각 문제 = 3 step (CONCEPT/PROCESS/ANSWER), 각 step = 5지선다.
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G7-MATH1-CH06-PLANE-FIG';
const SKILLS_TRI = ['triangle_angle_sum', 'angle_arithmetic'];
const SKILLS_POLY = ['polygon_interior_sum', 'n_minus_2_times_180'];
const SKILLS_REG = ['regular_polygon_interior', 'regular_polygon_exterior'];
const SKILLS_EXT = ['exterior_angle_sum', 'exterior_per_vertex'];
const SKILLS_INV = ['inverse_polygon', 'algebraic_inversion'];
const SKILLS_CONG = ['congruence_conditions', 'sss_sas_asa'];
const SKILLS_WORD = ['polygon_word_problem', 'condition_combination'];

const problems: KoreanProblemSeed[] = [
  // ────────── Q1 (쉬움) 삼각형 내각 합 · FORMULA_SELECTION_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'easy', concept: '삼각형 내각 합', requiredSkills: SKILLS_TRI,
    stem: '삼각형 세 내각의 합은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$n$각형 내각의 합 공식은?',
        options: [
          { key: 'A', text: '$(n - 2) \\times 180°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$n \\times 180°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$n-2$ 누락' },
          { key: 'C', text: '$(n + 2) \\times 180°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '부호 잘못' },
          { key: 'D', text: '$n \\times 90°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
          { key: 'E', text: '$360° / n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '외각 공식' },
        ] },
      { stepType: 'PROCESS', prompt: '$n = 3$ 대입:',
        options: [
          { key: 'A', text: '$(3 - 2) \\times 180° = 180°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$(3 + 2) \\times 180° = 900°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$+2$ 잘못' },
          { key: 'C', text: '$3 \\times 180° = 540°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$n-2$ 누락' },
          { key: 'D', text: '$3 \\times 90° = 270°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
          { key: 'E', text: '$360° / 3 = 120°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '외각 공식' },
        ] },
      { stepType: 'ANSWER', prompt: '삼각형 내각 합은?',
        options: [
          { key: 'A', text: '$180°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$360°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '사각형 합' },
          { key: 'C', text: '$540°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '오각형 합' },
          { key: 'D', text: '$90°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '직각' },
          { key: 'E', text: '$270°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        ] },
    ],
    solution: '삼각형 내각 합 $= (3 - 2) \\times 180° = 180°$.',
  },

  // ────────── Q2 (쉬움) 두 각 50°, 70° → 나머지 · ARITHMETIC_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'easy', concept: '삼각형 나머지 각', requiredSkills: SKILLS_TRI,
    stem: '$\\triangle ABC$ 에서 $\\angle A = 50°$, $\\angle B = 70°$ 일 때 $\\angle C$ 는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '나머지 각 계산식은?',
        options: [
          { key: 'A', text: '$\\angle C = 180° - \\angle A - \\angle B$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$\\angle C = \\angle A + \\angle B$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합으로' },
          { key: 'C', text: '$\\angle C = 360° - \\angle A - \\angle B$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '사각형' },
          { key: 'D', text: '$\\angle C = \\angle A - \\angle B$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '차로' },
          { key: 'E', text: '$\\angle C = 90° - \\angle A - \\angle B$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        ] },
      { stepType: 'PROCESS', prompt: '$180° - 50° - 70° = ?$',
        options: [
          { key: 'A', text: '$60°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$120°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$50 + 70$' },
          { key: 'C', text: '$50°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
          { key: 'D', text: '$80°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
          { key: 'E', text: '$200°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '더하기' },
        ] },
      { stepType: 'ANSWER', prompt: '$\\angle C$ 는?',
        options: [
          { key: 'A', text: '$60°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$120°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '두 각 합' },
          { key: 'C', text: '$50°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
          { key: 'D', text: '$80°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
          { key: 'E', text: '$90°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        ] },
    ],
    solution: '$\\angle C = 180° - 50° - 70° = 60°$.',
  },

  // ────────── Q3 (쉬움) 사각형 내각 합 · FORMULA_SELECTION_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'easy', concept: '사각형 내각 합', requiredSkills: SKILLS_POLY,
    stem: '사각형 네 내각의 합은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$n = 4$ 대입 공식은?',
        options: [
          { key: 'A', text: '$(4 - 2) \\times 180°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$4 \\times 90°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '특수 경우 (정사각형)만' },
          { key: 'C', text: '$4 \\times 180°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$n-2$ 누락' },
          { key: 'D', text: '$(4 + 2) \\times 180°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '부호 잘못' },
          { key: 'E', text: '$180°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '삼각형' },
        ] },
      { stepType: 'PROCESS', prompt: '계산:',
        options: [
          { key: 'A', text: '$2 \\times 180° = 360°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$4 \\times 180° = 720°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$n-2$ 누락' },
          { key: 'C', text: '$2 \\times 90° = 180°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 잘못' },
          { key: 'D', text: '$6 \\times 180° = 1080°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '잘못된 공식' },
          { key: 'E', text: '$360 \\times 4 = 1440°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        ] },
      { stepType: 'ANSWER', prompt: '사각형 내각 합은?',
        options: [
          { key: 'A', text: '$360°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$180°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '삼각형' },
          { key: 'C', text: '$540°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '오각형' },
          { key: 'D', text: '$720°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '육각형' },
          { key: 'E', text: '$90°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '한 직각' },
        ] },
    ],
    solution: '사각형 내각 합 $= (4 - 2) \\times 180° = 360°$.',
  },

  // ────────── Q4 (쉬움) 오각형 내각 합 · FORMULA_SELECTION_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'easy', concept: '오각형 내각 합', requiredSkills: SKILLS_POLY,
    stem: '오각형 다섯 내각의 합은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$n = 5$ 적용:',
        options: [
          { key: 'A', text: '$(5 - 2) \\times 180° = 3 \\times 180°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$5 \\times 180°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$n-2$ 누락' },
          { key: 'C', text: '$(5 + 2) \\times 180°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '부호 잘못' },
          { key: 'D', text: '$5 \\times 90°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
          { key: 'E', text: '$360°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '사각형' },
        ] },
      { stepType: 'PROCESS', prompt: '$3 \\times 180° = ?$',
        options: [
          { key: 'A', text: '$540°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$360°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2 \\times 180$' },
          { key: 'C', text: '$720°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$4 \\times 180$' },
          { key: 'D', text: '$450°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
          { key: 'E', text: '$900°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$5 \\times 180$' },
        ] },
      { stepType: 'ANSWER', prompt: '오각형 내각 합은?',
        options: [
          { key: 'A', text: '$540°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$360°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '사각형' },
          { key: 'C', text: '$720°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '육각형' },
          { key: 'D', text: '$900°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '잘못된 공식' },
          { key: 'E', text: '$180°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '삼각형' },
        ] },
    ],
    solution: '오각형 내각 합 $= (5 - 2) \\times 180° = 540°$.',
  },

  // ────────── Q5 (쉬움) 정삼각형 한 내각 · GEOMETRY_PROPERTY_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'easy', concept: '정삼각형 한 내각', requiredSkills: SKILLS_REG,
    stem: '정삼각형 한 내각의 크기는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '정다각형의 모든 내각은?',
        options: [
          { key: 'A', text: '모두 크기가 같다', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '모두 다르다', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '정다각형 정의' },
          { key: 'C', text: '두 개만 같다', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
          { key: 'D', text: '항상 직각', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '정사각형만' },
          { key: 'E', text: '항상 $60°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '정삼각형만' },
        ] },
      { stepType: 'PROCESS', prompt: '$180° \\div 3 = ?$',
        options: [
          { key: 'A', text: '$60°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$90°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
          { key: 'C', text: '$45°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
          { key: 'D', text: '$120°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
          { key: 'E', text: '$30°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
        ] },
      { stepType: 'ANSWER', prompt: '정삼각형 한 내각은?',
        options: [
          { key: 'A', text: '$60°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$90°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '정사각형' },
          { key: 'C', text: '$45°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
          { key: 'D', text: '$120°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '정육각형' },
          { key: 'E', text: '$180°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '내각 합' },
        ] },
    ],
    solution: '정삼각형 → 세 내각 모두 같음 → $180° / 3 = 60°$.',
  },

  // ────────── Q6 (쉬움) 정사각형 한 내각 · GEOMETRY_PROPERTY_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'easy', concept: '정사각형 한 내각', requiredSkills: SKILLS_REG,
    stem: '정사각형 한 내각의 크기는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '정사각형 내각 합 ÷ 4',
        options: [
          { key: 'A', text: '$360° / 4$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$180° / 4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '내각 합 잘못' },
          { key: 'C', text: '$540° / 4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '오각형 합' },
          { key: 'D', text: '$720° / 4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '육각형 합' },
          { key: 'E', text: '$90° \\times 4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱셈' },
        ] },
      { stepType: 'PROCESS', prompt: '$360° / 4 = ?$',
        options: [
          { key: 'A', text: '$90°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$45°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$360/8$' },
          { key: 'C', text: '$60°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
          { key: 'D', text: '$120°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
          { key: 'E', text: '$180°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        ] },
      { stepType: 'ANSWER', prompt: '정사각형 한 내각은?',
        options: [
          { key: 'A', text: '$90°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$60°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '정삼각형' },
          { key: 'C', text: '$120°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '정육각형' },
          { key: 'D', text: '$45°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
          { key: 'E', text: '$180°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '평각' },
        ] },
    ],
    solution: '정사각형 한 내각 $= 360° / 4 = 90°$.',
  },

  // ────────── Q7 (중) 정육각형 한 내각 · GEOMETRY_PROPERTY_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '정육각형 한 내각', requiredSkills: SKILLS_REG,
    stem: '정육각형 한 내각의 크기는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '정$n$각형 한 내각 공식은?',
        options: [
          { key: 'A', text: '$\\dfrac{(n - 2) \\times 180°}{n}$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$(n - 2) \\times 180°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '내각 합' },
          { key: 'C', text: '$\\dfrac{360°}{n}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '한 외각' },
          { key: 'D', text: '$\\dfrac{180°}{n}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
          { key: 'E', text: '$n \\times 180°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        ] },
      { stepType: 'PROCESS', prompt: '$n = 6$: $(6 - 2) \\times 180° / 6 = ?$',
        options: [
          { key: 'A', text: '$720° / 6 = 120°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$1080° / 6 = 180°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$6 \\times 180$ 잘못' },
          { key: 'C', text: '$540° / 6 = 90°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3 \\times 180$ 잘못' },
          { key: 'D', text: '$360° / 6 = 60°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '한 외각' },
          { key: 'E', text: '$720°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 누락' },
        ] },
      { stepType: 'ANSWER', prompt: '정육각형 한 내각은?',
        options: [
          { key: 'A', text: '$120°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$60°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '한 외각' },
          { key: 'C', text: '$90°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '정사각형' },
          { key: 'D', text: '$135°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '정팔각형' },
          { key: 'E', text: '$144°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '정십각형' },
        ] },
    ],
    solution: '$(6 - 2) \\times 180° / 6 = 720° / 6 = 120°$.',
  },

  // ────────── Q8 (중) 정팔각형 한 내각 · GEOMETRY_PROPERTY_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '정팔각형 한 내각', requiredSkills: SKILLS_REG,
    stem: '정팔각형 한 내각의 크기는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$n = 8$: 공식 적용',
        options: [
          { key: 'A', text: '$\\dfrac{(8 - 2) \\times 180°}{8} = \\dfrac{1080°}{8}$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$8 \\times 180° / 8 = 180°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$n-2$ 누락' },
          { key: 'C', text: '$(8 + 2) \\times 180° / 8$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '부호 잘못' },
          { key: 'D', text: '$8 \\times 90° = 720°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
          { key: 'E', text: '$360° / 8 = 45°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '외각' },
        ] },
      { stepType: 'PROCESS', prompt: '$1080° / 8 = ?$',
        options: [
          { key: 'A', text: '$135°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$120°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '정육각형' },
          { key: 'C', text: '$144°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '정십각형' },
          { key: 'D', text: '$108°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
          { key: 'E', text: '$150°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
        ] },
      { stepType: 'ANSWER', prompt: '정팔각형 한 내각은?',
        options: [
          { key: 'A', text: '$135°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$120°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '정육각형' },
          { key: 'C', text: '$144°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '정십각형' },
          { key: 'D', text: '$108°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
          { key: 'E', text: '$45°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '한 외각' },
        ] },
    ],
    solution: '$1080° / 8 = 135°$.',
  },

  // ────────── Q9 (중) 정십각형 한 내각 · ARITHMETIC_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '정십각형 한 내각', requiredSkills: SKILLS_REG,
    stem: '정십각형 한 내각의 크기는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$n = 10$ 적용',
        options: [
          { key: 'A', text: '$\\dfrac{(10 - 2) \\times 180°}{10} = \\dfrac{1440°}{10}$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$\\dfrac{10 \\times 180°}{10}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$n-2$ 누락' },
          { key: 'C', text: '$\\dfrac{(10 + 2) \\times 180°}{10}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '부호' },
          { key: 'D', text: '$360° / 10$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '외각' },
          { key: 'E', text: '$180° / 10$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        ] },
      { stepType: 'PROCESS', prompt: '$1440 / 10 = ?$',
        options: [
          { key: 'A', text: '$144°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$140°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
          { key: 'C', text: '$150°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
          { key: 'D', text: '$120°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '정육각형' },
          { key: 'E', text: '$108°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        ] },
      { stepType: 'ANSWER', prompt: '정십각형 한 내각은?',
        options: [
          { key: 'A', text: '$144°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$135°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '정팔각형' },
          { key: 'C', text: '$120°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '정육각형' },
          { key: 'D', text: '$108°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
          { key: 'E', text: '$36°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '한 외각' },
        ] },
    ],
    solution: '$(10 - 2) \\times 180° / 10 = 1440° / 10 = 144°$.',
  },

  // ────────── Q10 (중) 정육각형 한 외각 · ARITHMETIC_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '정육각형 한 외각', requiredSkills: SKILLS_EXT,
    stem: '정육각형 한 외각의 크기는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '정$n$각형 한 외각 공식은?',
        options: [
          { key: 'A', text: '$360° / n$ (외각 합 = $360°$)', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$(n - 2) \\times 180° / n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '한 내각' },
          { key: 'C', text: '$180° / n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
          { key: 'D', text: '$n \\times 360°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱셈' },
          { key: 'E', text: '$180° - 한 내각$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '맞지만 우회' },
        ] },
      { stepType: 'PROCESS', prompt: '$360° / 6 = ?$',
        options: [
          { key: 'A', text: '$60°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$90°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$360/4$' },
          { key: 'C', text: '$120°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '한 내각' },
          { key: 'D', text: '$72°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$360/5$' },
          { key: 'E', text: '$45°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '정팔각형 외각' },
        ] },
      { stepType: 'ANSWER', prompt: '정육각형 한 외각은?',
        options: [
          { key: 'A', text: '$60°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$120°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '한 내각' },
          { key: 'C', text: '$90°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '정사각형' },
          { key: 'D', text: '$45°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '정팔각형' },
          { key: 'E', text: '$30°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        ] },
    ],
    solution: '$360° / 6 = 60°$. 검산: 한 내각 $120°$ + 한 외각 $60°$ = $180°$ ✓.',
  },

  // ────────── Q11 (중) 정팔각형 한 외각 · ARITHMETIC_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '정팔각형 한 외각', requiredSkills: SKILLS_EXT,
    stem: '정팔각형 한 외각의 크기는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$n = 8$',
        options: [
          { key: 'A', text: '$360° / 8$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$180° / 8$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
          { key: 'C', text: '$(8 - 2) \\times 180° / 8$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '한 내각' },
          { key: 'D', text: '$8 \\times 45°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱셈' },
          { key: 'E', text: '$360°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '나누기 누락' },
        ] },
      { stepType: 'PROCESS', prompt: '$360° / 8 = ?$',
        options: [
          { key: 'A', text: '$45°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$60°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$360/6$' },
          { key: 'C', text: '$36°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$360/10$' },
          { key: 'D', text: '$90°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
          { key: 'E', text: '$72°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$360/5$' },
        ] },
      { stepType: 'ANSWER', prompt: '정팔각형 한 외각은?',
        options: [
          { key: 'A', text: '$45°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$135°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '한 내각' },
          { key: 'C', text: '$60°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '정육각형' },
          { key: 'D', text: '$36°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '정십각형' },
          { key: 'E', text: '$90°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '직각' },
        ] },
    ],
    solution: '$360° / 8 = 45°$.',
  },

  // ────────── Q12 (중) 다각형 외각 합 · FORMULA_SELECTION_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '다각형 외각의 합', requiredSkills: SKILLS_EXT,
    stem: '$n$각형의 외각의 합은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '외각의 합 정리는?',
        options: [
          { key: 'A', text: '$n$에 관계없이 항상 $360°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$(n - 2) \\times 180°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '내각 합' },
          { key: 'C', text: '$n \\times 180°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
          { key: 'D', text: '$n \\times 360°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱셈' },
          { key: 'E', text: '$n$에 따라 변함', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '상수 $360°$' },
        ] },
      { stepType: 'PROCESS', prompt: '왜 항상 $360°$ 인가?',
        options: [
          { key: 'A', text: '각 꼭짓점에서 내각 + 외각 = $180°$ 이므로 외각 합 $= n \\cdot 180 - $ 내각 합 $= n \\cdot 180 - (n-2) \\cdot 180 = 360$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$n$이 작아지면 변함', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '상수' },
          { key: 'C', text: '정$n$각형만 $360°$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '모든 다각형' },
          { key: 'D', text: '$n$이 많을수록 큼', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '상수' },
          { key: 'E', text: '$180°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '잘못된 값' },
        ] },
      { stepType: 'ANSWER', prompt: '$n$각형 외각의 합은?',
        options: [
          { key: 'A', text: '$360°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$180°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '삼각형 내각 합' },
          { key: 'C', text: '$(n - 2) \\times 180°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '내각 합' },
          { key: 'D', text: '$n \\times 180°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
          { key: 'E', text: '$540°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '오각형 내각 합' },
        ] },
    ],
    solution: '다각형 외각의 합 = $360°$ (모든 $n$에 대해).',
  },

  // ────────── Q13 (중) 내각 합 1080° → n? · FORMULA_SELECTION_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '내각 합 → n 역추적', requiredSkills: SKILLS_INV,
    stem: '내각의 합이 $1080°$ 인 다각형은 몇 각형인가?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$(n - 2) \\times 180° = 1080°$ 의 $n$ 을 구하려면?',
        options: [
          { key: 'A', text: '양변을 $180°$ 로 나누고 $+2$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '양변에 $-2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나눗셈 누락' },
          { key: 'C', text: '$1080 / 180 = n$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$+2$ 누락' },
          { key: 'D', text: '$1080$ 그대로 = $n$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '식 변형 안 함' },
          { key: 'E', text: '$1080 \\times 180$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '곱셈' },
        ] },
      { stepType: 'PROCESS', prompt: '$1080 / 180 = 6$, $6 + 2 = ?$',
        options: [
          { key: 'A', text: '$n = 8$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$n = 6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$+2$ 누락' },
          { key: 'C', text: '$n = 4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$-2$ 적용' },
          { key: 'D', text: '$n = 10$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '계산 잘못' },
          { key: 'E', text: '$n = 12$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        ] },
      { stepType: 'ANSWER', prompt: '몇 각형?',
        options: [
          { key: 'A', text: '팔각형', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '육각형', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$+2$ 누락' },
          { key: 'C', text: '십각형', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
          { key: 'D', text: '사각형', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$-2$' },
          { key: 'E', text: '십이각형', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        ] },
    ],
    solution: '$(n - 2) \\times 180° = 1080° \\Rightarrow n - 2 = 6 \\Rightarrow n = 8$. 팔각형.',
  },

  // ────────── Q14 (중) 한 내각 144° → 정n각형 · ALGEBRA_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '한 내각 → 정n각형 역추적', requiredSkills: SKILLS_INV,
    stem: '한 내각이 $144°$ 인 정$n$각형. $n$ 은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '식 세우기: $\\dfrac{(n-2) \\times 180°}{n} = 144°$',
        options: [
          { key: 'A', text: '양변에 $n$ 곱: $(n-2) \\times 180 = 144n$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$(n - 2) = 144$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나눗셈 제거 잘못' },
          { key: 'C', text: '$n \\times 144 = 180$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '식 잘못' },
          { key: 'D', text: '$n + 2 = 144 / 180$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '식 잘못' },
          { key: 'E', text: '$\\dfrac{(n-2) \\times 180°}{144°} = n$ — 그냥', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '맞지만 계산 어려움' },
        ] },
      { stepType: 'PROCESS', prompt: '$180n - 360 = 144n \\Rightarrow 36n = 360$',
        options: [
          { key: 'A', text: '$n = 10$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$n = 5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$360/72$ 등 잘못' },
          { key: 'C', text: '$n = 12$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
          { key: 'D', text: '$n = 8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
          { key: 'E', text: '$n = 6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        ] },
      { stepType: 'ANSWER', prompt: '정$n$각형은?',
        options: [
          { key: 'A', text: '정십각형', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '정팔각형', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '$135°$' },
          { key: 'C', text: '정육각형', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '$120°$' },
          { key: 'D', text: '정십이각형', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '$150°$' },
          { key: 'E', text: '정오각형', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '$108°$' },
        ] },
    ],
    solution: '$(n-2) \\times 180 = 144n \\Rightarrow 180n - 144n = 360 \\Rightarrow 36n = 360 \\Rightarrow n = 10$.',
  },

  // ────────── Q15 (중) 한 외각 60° → 정n각형 · ALGEBRA_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'medium', concept: '한 외각 → 정n각형', requiredSkills: SKILLS_INV,
    stem: '한 외각이 $60°$ 인 정$n$각형은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '식: $360° / n = 60°$',
        options: [
          { key: 'A', text: '$n = 360 / 60$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$n = 360 \\times 60$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '곱셈' },
          { key: 'C', text: '$n = 60 / 360$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '분모분자 뒤집힘' },
          { key: 'D', text: '$n = 60$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나누기 누락' },
          { key: 'E', text: '$n = 360 - 60$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '뺄셈' },
        ] },
      { stepType: 'PROCESS', prompt: '$360 / 60 = ?$',
        options: [
          { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
          { key: 'C', text: '$7$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
          { key: 'D', text: '$60$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나눗셈 누락' },
          { key: 'E', text: '$420$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '더한 결과' },
        ] },
      { stepType: 'ANSWER', prompt: '정$n$각형은?',
        options: [
          { key: 'A', text: '정육각형', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '정사각형', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
          { key: 'C', text: '정오각형', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '$72°$' },
          { key: 'D', text: '정팔각형', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '$45°$' },
          { key: 'E', text: '정십각형', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '$36°$' },
        ] },
    ],
    solution: '$n = 360 / 60 = 6$. 정육각형.',
  },

  // ────────── Q16 (어려움) ∠A=80, ∠B=3∠C · CONDITION_MISSING ──────────
  {
    chapterCode: CODE, difficulty: 'hard', concept: '삼각형 + 조건 (각 관계식)', requiredSkills: SKILLS_TRI,
    stem: '$\\triangle ABC$ 에서 $\\angle A = 80°$, $\\angle B$ 가 $\\angle C$ 의 $3$배이다. $\\angle C$ 는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '내각 합 + 관계식을 동시에 세우려면?',
        options: [
          { key: 'A', text: '$\\angle B = 3\\angle C$ 그리고 $\\angle A + \\angle B + \\angle C = 180°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$\\angle B = 3\\angle C$만', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '내각 합 조건 누락' },
          { key: 'C', text: '$\\angle A + \\angle B = 180°$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '삼각형 합 잘못' },
          { key: 'D', text: '$\\angle A = \\angle B = \\angle C$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '정삼각형 가정' },
          { key: 'E', text: '$\\angle A + \\angle C = 80°$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        ] },
      { stepType: 'PROCESS', prompt: '$80 + 3\\angle C + \\angle C = 180$',
        options: [
          { key: 'A', text: '$4\\angle C = 100 \\Rightarrow \\angle C = 25°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$3\\angle C = 100 \\Rightarrow \\angle C \\approx 33°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$\\angle C$ 한 번만 더함' },
          { key: 'C', text: '$\\angle C = 80°$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
          { key: 'D', text: '$4\\angle C = 180 \\Rightarrow \\angle C = 45°$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\angle A = 80$ 누락' },
          { key: 'E', text: '$2\\angle C = 100 \\Rightarrow \\angle C = 50°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '계수 잘못' },
        ] },
      { stepType: 'ANSWER', prompt: '$\\angle C$ 는?',
        options: [
          { key: 'A', text: '$25°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$33°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '계산 잘못' },
          { key: 'C', text: '$45°$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
          { key: 'D', text: '$50°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
          { key: 'E', text: '$75°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$\\angle B$ 값' },
        ] },
    ],
    solution: '$80 + 3\\angle C + \\angle C = 180 \\Rightarrow 4\\angle C = 100 \\Rightarrow \\angle C = 25°$. 검산: $\\angle B = 75°$, 합 $80 + 75 + 25 = 180$ ✓.',
  },

  // ────────── Q17 (어려움) 한 외각이 한 내각의 1/3 · ALGEBRA_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'hard', concept: '내·외각 비율 → 정n각형', requiredSkills: SKILLS_INV,
    stem: '정$n$각형의 한 외각이 한 내각의 $\\dfrac{1}{3}$ 이다. $n$ 은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '한 외각 $e$, 한 내각 $= 180 - e$. 조건은?',
        options: [
          { key: 'A', text: '$e = \\dfrac{180 - e}{3}$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$e = 3(180 - e)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '비율 거꾸로' },
          { key: 'C', text: '$e + (180 - e) = 1/3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '식 잘못' },
          { key: 'D', text: '$e = 1/3 \\times 180$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '내각이 $180°$ 가정' },
          { key: 'E', text: '$e = 1/3 \\cdot e$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '내각=외각으로' },
        ] },
      { stepType: 'PROCESS', prompt: '$3e = 180 - e \\Rightarrow 4e = 180$',
        options: [
          { key: 'A', text: '$e = 45°$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$e = 60°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '계산 잘못' },
          { key: 'C', text: '$e = 90°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
          { key: 'D', text: '$e = 36°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
          { key: 'E', text: '$e = 30°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        ] },
      { stepType: 'ANSWER', prompt: '$n = 360 / e = ?$',
        options: [
          { key: 'A', text: '$n = 8$ (정팔각형)', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$n = 6$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '$360/60$' },
          { key: 'C', text: '$n = 10$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
          { key: 'D', text: '$n = 12$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '$360/30$' },
          { key: 'E', text: '$n = 4$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '정사각형' },
        ] },
    ],
    solution: '$e = (180-e)/3 \\Rightarrow 4e = 180 \\Rightarrow e = 45°$. $n = 360/45 = 8$. 정팔각형 (한 외각 $45°$, 한 내각 $135°$, $45 = 135/3$ ✓).',
  },

  // ────────── Q18 (어려움) 삼각형 합동조건 · GEOMETRY_PROPERTY_ERROR ──────────
  {
    chapterCode: CODE, difficulty: 'hard', concept: '삼각형 합동조건', requiredSkills: SKILLS_CONG,
    stem: '두 삼각형이 합동이 되기에 충분한 조건이 아닌 것은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '합동조건 세 가지는?',
        options: [
          { key: 'A', text: 'SSS (세 변), SAS (두 변과 끼인 각), ASA (두 각과 끼인 변)', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: 'SSS, SAS, AAA', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: 'AAA는 닮음만 의미' },
          { key: 'C', text: 'SSA, SAS, ASA', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: 'SSA는 합동 보장 안 함' },
          { key: 'D', text: 'SSS, AAA, ASA', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: 'AAA 잘못 포함' },
          { key: 'E', text: 'AAA만', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '닮음 조건' },
        ] },
      { stepType: 'PROCESS', prompt: '"세 각이 같음" (AAA)는?',
        options: [
          { key: 'A', text: '닮음 (크기 자유) — 합동 보장 X', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '항상 합동', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '크기 다를 수 있음' },
          { key: 'C', text: '한 변이 같으면 합동', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '문제 조건은 세 각만' },
          { key: 'D', text: '두 각이 직각이면 합동', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '직각도 닮음일 뿐' },
          { key: 'E', text: '예각삼각형이면 합동', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        ] },
      { stepType: 'ANSWER', prompt: '합동조건이 아닌 것은?',
        options: [
          { key: 'A', text: 'AAA (세 각이 같음)', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: 'SSS', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '유효 합동조건' },
          { key: 'C', text: 'SAS', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '유효 합동조건' },
          { key: 'D', text: 'ASA', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '유효 합동조건' },
          { key: 'E', text: 'AAS (두 각과 다른 한 변)', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: 'ASA 변형 — 유효함' },
        ] },
    ],
    solution: 'AAA는 닮음만 보장하고 합동을 보장하지 않음. 유효 합동조건: SSS, SAS, ASA (와 동치인 AAS).',
  },

  // ────────── Q19 (어려움) 내각 합 1620° → n? · CONCEPT_MISUNDERSTANDING ──────────
  {
    chapterCode: CODE, difficulty: 'hard', concept: '내각 합 → n 큰 값', requiredSkills: SKILLS_INV,
    stem: '내각의 합이 $1620°$ 인 다각형은 몇 각형?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$(n - 2) \\times 180° = 1620°$',
        options: [
          { key: 'A', text: '$n - 2 = 1620 / 180$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$n = 1620$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '식 변형 안 함' },
          { key: 'C', text: '$n = 1620 \\times 180$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곱셈' },
          { key: 'D', text: '$n = 1620 / 360$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
          { key: 'E', text: '$n - 2 = 1620$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '나눗셈 누락' },
        ] },
      { stepType: 'PROCESS', prompt: '$1620 / 180 = 9$, $9 + 2 = ?$',
        options: [
          { key: 'A', text: '$n = 11$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$n = 9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$+2$ 누락' },
          { key: 'C', text: '$n = 7$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$-2$' },
          { key: 'D', text: '$n = 10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
          { key: 'E', text: '$n = 12$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        ] },
      { stepType: 'ANSWER', prompt: '몇 각형?',
        options: [
          { key: 'A', text: '십일각형', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '구각형', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$+2$ 누락' },
          { key: 'C', text: '십각형', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
          { key: 'D', text: '십이각형', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
          { key: 'E', text: '팔각형', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '내각 합 $1080°$' },
        ] },
    ],
    solution: '$(n-2) \\times 180 = 1620 \\Rightarrow n - 2 = 9 \\Rightarrow n = 11$. 십일각형.',
  },

  // ────────── Q20 (어려움) 두 다각형 내각 합 차이 360° → 변 수 차이? · CONDITION_MISSING ──────────
  {
    chapterCode: CODE, difficulty: 'hard', concept: '내각 합 차이 → 변 수 차이', requiredSkills: SKILLS_WORD,
    stem: '두 다각형의 내각 합 차이가 $360°$ 이다. 두 다각형의 변의 개수 차이는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$n$각형과 $m$각형 내각 합 차이는?',
        options: [
          { key: 'A', text: '$(n - 2) \\times 180° - (m - 2) \\times 180° = 180°(n - m)$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$n - m$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$180°$ 누락' },
          { key: 'C', text: '$(n - m) \\times 360°$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\times 180°$이지 $360°$ 아님' },
          { key: 'D', text: '$n \\times m \\times 180°$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '곱' },
          { key: 'E', text: '$n + m - 4$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        ] },
      { stepType: 'PROCESS', prompt: '$180° (n - m) = 360°$',
        options: [
          { key: 'A', text: '$n - m = 2$', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$n - m = 360°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나눗셈 누락' },
          { key: 'C', text: '$n - m = 180°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '잘못 나눔' },
          { key: 'D', text: '$n - m = 1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
          { key: 'E', text: '$n - m = 4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        ] },
      { stepType: 'ANSWER', prompt: '변 수 차이는?',
        options: [
          { key: 'A', text: '$2$개', isCorrect: true, errorCode: null, errorReason: null },
          { key: 'B', text: '$1$개', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
          { key: 'C', text: '$4$개', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
          { key: 'D', text: '$360$개', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
          { key: 'E', text: '$180$개', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        ] },
    ],
    solution: '$180°(n - m) = 360° \\Rightarrow n - m = 2$. 변 수 차이 $2$개. 예: 사각형 $360°$ vs 육각형 $720°$, 차이 $360°$, 변 수 차이 $2$ ✓.',
  },
];

export const K_G7_MATH1_CH06_PLANE_FIG_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
