/**
 * K-G9-MATH3-CH04-TRIG-RATIO — STUDY pool (single-step, 20문제).
 * 삼각비 — sin·cos·tan 정의, 특수각, 항등식, 응용.
 * Mastery 3-step과 별도 변형 문제. 중3 (G9).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5. LLM 미사용.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G9-MATH3-CH04-TRIG-RATIO';
const SKILLS_DEF = ['sine_definition', 'cosine_definition', 'tangent_definition'];
const SKILLS_TRIANGLE = ['hypotenuse', 'opposite_adjacent'];
const SKILLS_SPECIAL_30 = ['sin_30', 'cos_30'];
const SKILLS_SPECIAL_45 = ['sin_45', 'cos_45', 'tan_45'];
const SKILLS_SPECIAL_60 = ['sin_60', 'cos_60', 'tan_60'];
const SKILLS_IDENTITY = ['pythagorean_identity', 'tan_sin_cos'];
const SKILLS_VALUE = ['ratio_from_triangle', 'find_remaining_ratio'];
const SKILLS_APPLY = ['solve_triangle', 'word_problem_trig'];
const SKILLS_INVERSE = ['ratio_to_angle', 'inverse_trig_special'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) 빗변 정의
  { chapterCode: CODE, difficulty: 'easy', concept: '직각삼각형 빗변 정의', requiredSkills: SKILLS_TRIANGLE,
    stem: '직각삼각형에서 빗변(hypotenuse)은 어떤 변인가?',
    options: [
      { key: 'A', text: '직각의 맞은편 변 (가장 긴 변)', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '가장 짧은 변', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '빗변은 가장 긴 변' },
      { key: 'C', text: '아무 한 변', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '직각 맞은편으로 정해짐' },
      { key: 'D', text: '직각의 두 끼인 변', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '직각변(직각을 낀 변)' },
      { key: 'E', text: '중간 길이 변', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '길이로 정의 X' },
    ],
    solution: '빗변 = 직각의 대변 = 가장 긴 변. 삼각비는 빗변을 분모/분자로 사용.' },

  // S2 (쉬움) sin 60°
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\sin 60°$', requiredSkills: SKILLS_SPECIAL_60,
    stem: '$\\sin 60° = ?$',
    options: [
      { key: 'A', text: '$\\dfrac{\\sqrt{3}}{2}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin 30°$' },
      { key: 'C', text: '$\\dfrac{\\sqrt{2}}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin 45°$' },
      { key: 'D', text: '$\\sqrt{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\tan 60°$' },
      { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin 90°$ 또는 $\\tan 45°$' },
    ],
    solution: '$\\sin 60° = \\dfrac{\\sqrt{3}}{2}$ (특수각 값).' },

  // S3 (쉬움) cos 45°
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\cos 45°$', requiredSkills: SKILLS_SPECIAL_45,
    stem: '$\\cos 45° = ?$',
    options: [
      { key: 'A', text: '$\\dfrac{\\sqrt{2}}{2}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\cos 60°$' },
      { key: 'C', text: '$\\dfrac{\\sqrt{3}}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\cos 30°$' },
      { key: 'D', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\tan 45°$' },
      { key: 'E', text: '$\\sqrt{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 값' },
    ],
    solution: '$\\cos 45° = \\dfrac{\\sqrt{2}}{2}$ (= $\\sin 45°$).' },

  // S4 (쉬움) tan 60°
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\tan 60°$', requiredSkills: SKILLS_SPECIAL_60,
    stem: '$\\tan 60° = ?$',
    options: [
      { key: 'A', text: '$\\sqrt{3}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{\\sqrt{3}}{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\tan 30°$' },
      { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\tan 45°$' },
      { key: 'D', text: '$\\dfrac{\\sqrt{3}}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin 60°$' },
      { key: 'E', text: '$3$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$(\\sqrt{3})^2$ 잘못' },
    ],
    solution: '$\\tan 60° = \\dfrac{\\sin 60°}{\\cos 60°} = \\dfrac{\\sqrt{3}/2}{1/2} = \\sqrt{3}$.' },

  // S5 (쉬움) sin 30° + cos 60°
  { chapterCode: CODE, difficulty: 'easy', concept: '특수값 합 (정수 결과)', requiredSkills: SKILLS_SPECIAL_30,
    stem: '$\\sin 30° + \\cos 60° = ?$',
    options: [
      { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '한 항만' },
      { key: 'C', text: '$\\dfrac{1}{4}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱셈으로 잘못' },
      { key: 'D', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '두 배 잘못' },
      { key: 'E', text: '$\\sqrt{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '다른 특수값' },
    ],
    solution: '$\\sin 30° = 1/2$, $\\cos 60° = 1/2$. 합 $= 1$.' },

  // S6 (쉬움) 분수의 의미
  { chapterCode: CODE, difficulty: 'easy', concept: 'sin 정의 (분수 의미)', requiredSkills: SKILLS_DEF,
    stem: '직각삼각형 한 예각 $\\theta$ 에 대해 $\\sin\\theta$ 의 분모는?',
    options: [
      { key: 'A', text: '빗변', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\theta$ 의 인접변', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\cos$ 분모' },
      { key: 'C', text: '$\\theta$ 의 대변', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin$ 분자' },
      { key: 'D', text: '직각의 한 변', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '모호함' },
      { key: 'E', text: '없다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '분모 존재' },
    ],
    solution: '$\\sin\\theta = \\dfrac{\\text{대변}}{\\text{빗변}}$. 분모는 빗변.' },

  // S7 (중) cos 30° + sin 30°
  { chapterCode: CODE, difficulty: 'medium', concept: '특수값 합 (무리수)', requiredSkills: SKILLS_SPECIAL_30,
    stem: '$\\cos 30° + \\sin 30° = ?$',
    options: [
      { key: 'A', text: '$\\dfrac{\\sqrt{3} + 1}{2}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{\\sqrt{3}}{2}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\sin 30°$ 누락' },
      { key: 'C', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\cos 30°$ 누락' },
      { key: 'D', text: '$\\dfrac{\\sqrt{3} - 1}{2}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '뺄셈 잘못' },
      { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합 잘못' },
    ],
    solution: '$\\dfrac{\\sqrt{3}}{2} + \\dfrac{1}{2} = \\dfrac{\\sqrt{3} + 1}{2}$.' },

  // S8 (중) tan 30°
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\tan 30°$', requiredSkills: SKILLS_SPECIAL_30,
    stem: '$\\tan 30° = ?$',
    options: [
      { key: 'A', text: '$\\dfrac{\\sqrt{3}}{3}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\sqrt{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\tan 60°$' },
      { key: 'C', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin 30°$' },
      { key: 'D', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\tan 45°$' },
      { key: 'E', text: '$\\dfrac{\\sqrt{3}}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\cos 30°$' },
    ],
    solution: '$\\tan 30° = \\dfrac{\\sin 30°}{\\cos 30°} = \\dfrac{1/2}{\\sqrt{3}/2} = \\dfrac{1}{\\sqrt{3}} = \\dfrac{\\sqrt{3}}{3}$.' },

  // S9 (중) 1 - sin² = cos²
  { chapterCode: CODE, difficulty: 'medium', concept: '항등식 변형', requiredSkills: SKILLS_IDENTITY,
    stem: '$1 - \\sin^2\\theta = ?$',
    options: [
      { key: 'A', text: '$\\cos^2\\theta$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\tan^2\\theta$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 항등식' },
      { key: 'C', text: '$\\sin\\theta$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '지수 잘못' },
      { key: 'D', text: '$-\\cos^2\\theta$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'E', text: '$\\sin\\theta + \\cos\\theta$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '관련 없는 식' },
    ],
    solution: '$\\sin^2 + \\cos^2 = 1 \\to 1 - \\sin^2 = \\cos^2$.' },

  // S10 (중) tan = sin/cos
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\tan = \\sin / \\cos$', requiredSkills: SKILLS_IDENTITY,
    stem: '$\\dfrac{\\sin\\theta}{\\cos\\theta} = ?$',
    options: [
      { key: 'A', text: '$\\tan\\theta$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\sin^2\\theta$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 식' },
      { key: 'C', text: '$\\cos^2\\theta$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 식' },
      { key: 'D', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '항상 $1$ 아님' },
      { key: 'E', text: '$\\dfrac{1}{\\tan\\theta}$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '뒤집음' },
    ],
    solution: '$\\tan\\theta = \\dfrac{\\sin\\theta}{\\cos\\theta}$ (정의).' },

  // S11 (중) 5-12-13 sin
  { chapterCode: CODE, difficulty: 'medium', concept: '$5$-$12$-$13$ 삼각형 sin', requiredSkills: SKILLS_VALUE,
    stem: '직각삼각형 빗변 $13$, $\\theta$ 의 대변 $5$ 이면 $\\sin\\theta = ?$',
    options: [
      { key: 'A', text: '$\\dfrac{5}{13}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{13}{5}$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '뒤집음' },
      { key: 'C', text: '$\\dfrac{12}{13}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\cos$ 답함' },
      { key: 'D', text: '$\\dfrac{5}{12}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\tan$ 답함' },
      { key: 'E', text: '$\\dfrac{12}{5}$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$\\cot$ 등' },
    ],
    solution: '$\\sin\\theta = \\dfrac{\\text{대변}}{\\text{빗변}} = \\dfrac{5}{13}$.' },

  // S12 (중) cos=12/13 → sin
  { chapterCode: CODE, difficulty: 'medium', concept: '항등식으로 sin 구하기', requiredSkills: SKILLS_IDENTITY,
    stem: '$\\cos\\theta = \\dfrac{12}{13}$ (예각). $\\sin\\theta = ?$',
    options: [
      { key: 'A', text: '$\\dfrac{5}{13}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{1}{13}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 제곱근' },
      { key: 'C', text: '$\\dfrac{13}{12}$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '뒤집음' },
      { key: 'D', text: '$-\\dfrac{5}{13}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '예각 → 양수' },
      { key: 'E', text: '$\\dfrac{12}{13}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\cos$ 그대로' },
    ],
    solution: '$\\sin^2 = 1 - \\cos^2 = 1 - 144/169 = 25/169$. $\\sin = 5/13$ (예각 → 양수).' },

  // S13 (중) tan=3/4 → sin
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\tan$ 으로 $\\sin$ 구하기', requiredSkills: SKILLS_VALUE,
    stem: '$\\tan\\theta = \\dfrac{3}{4}$ (예각). $\\sin\\theta = ?$',
    options: [
      { key: 'A', text: '$\\dfrac{3}{5}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{4}{5}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\cos$ 답함' },
      { key: 'C', text: '$\\dfrac{3}{4}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\tan$ 그대로' },
      { key: 'D', text: '$\\dfrac{5}{3}$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '뒤집음' },
      { key: 'E', text: '$\\dfrac{4}{3}$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$\\tan$ 뒤집음' },
    ],
    solution: '$\\tan = 3/4$ → 대변 $3$, 인접변 $4$, 빗변 $\\sqrt{9+16} = 5$. $\\sin = 3/5$.' },

  // S14 (중) sin θ = 1
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\sin\\theta = 1$ 인 각', requiredSkills: SKILLS_INVERSE,
    stem: '$\\sin\\theta = 1$ 인 예각 $\\theta$ 는?',
    options: [
      { key: 'A', text: '$90°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin 0° = 0$' },
      { key: 'C', text: '$45°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin 45° = \\sqrt{2}/2$' },
      { key: 'D', text: '$60°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin 60° = \\sqrt{3}/2$' },
      { key: 'E', text: '존재 안 함', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$90°$ 존재' },
    ],
    solution: '$\\sin 90° = 1$ (특수값).' },

  // S15 (중) 빗변 8 30° 대변
  { chapterCode: CODE, difficulty: 'medium', concept: '특수각 길이 구하기', requiredSkills: SKILLS_APPLY,
    stem: '직각삼각형 빗변 $8$, 한 예각 $30°$. 그 예각의 대변 길이는?',
    options: [
      { key: 'A', text: '$4$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$4\\sqrt{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\cos 30°$ 사용 (인접변)' },
      { key: 'C', text: '$8\\sqrt{3}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
      { key: 'D', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 비' },
      { key: 'E', text: '$8$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '빗변 자체' },
    ],
    solution: '대변 $= 8 \\sin 30° = 8 \\cdot \\dfrac{1}{2} = 4$.' },

  // S16 (어려움) cos=8/17 → sin
  { chapterCode: CODE, difficulty: 'hard', concept: '8-15-17 삼각형', requiredSkills: SKILLS_IDENTITY,
    stem: '$\\cos\\theta = \\dfrac{8}{17}$ (예각). $\\sin\\theta = ?$',
    options: [
      { key: 'A', text: '$\\dfrac{15}{17}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{9}{17}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\sqrt{17^2 - 8^2}$ 계산 실수' },
      { key: 'C', text: '$\\dfrac{17}{8}$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '뒤집음' },
      { key: 'D', text: '$\\dfrac{8}{17}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\cos$ 그대로' },
      { key: 'E', text: '$\\dfrac{8}{15}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\tan$ 답함' },
    ],
    solution: '$\\sin^2 = 1 - 64/289 = 225/289$. $\\sin = 15/17$.' },

  // S17 (어려움) 빗변 6 45°
  { chapterCode: CODE, difficulty: 'hard', concept: '$45°$ 직각이등변 변', requiredSkills: SKILLS_APPLY,
    stem: '빗변이 $6$ 인 $45°$-$45°$-$90°$ 직각이등변삼각형의 직각변 길이는?',
    options: [
      { key: 'A', text: '$3\\sqrt{2}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\sin 45° = \\sqrt{2}/2$' },
      { key: 'C', text: '$6\\sqrt{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sqrt{2}$ 곱셈 잘못' },
      { key: 'D', text: '$3\\sqrt{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$30°$/$60°$ 공식 적용' },
      { key: 'E', text: '$2\\sqrt{3}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 값' },
    ],
    solution: '직각변 $= 6 \\sin 45° = 6 \\cdot \\dfrac{\\sqrt{2}}{2} = 3\\sqrt{2}$.' },

  // S18 (어려움) tan=√3
  { chapterCode: CODE, difficulty: 'hard', concept: '$\\tan = \\sqrt{3}$ 인 각', requiredSkills: SKILLS_INVERSE,
    stem: '$\\tan\\theta = \\sqrt{3}$ 인 예각 $\\theta$ 는?',
    options: [
      { key: 'A', text: '$60°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$30°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\tan 30° = \\sqrt{3}/3$' },
      { key: 'C', text: '$45°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\tan 45° = 1$' },
      { key: 'D', text: '$90°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\tan 90°$ 정의 X' },
      { key: 'E', text: '$120°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '예각 아님' },
    ],
    solution: '$\\tan 60° = \\sqrt{3}$ (특수값).' },

  // S19 (어려움) 사다리 응용
  { chapterCode: CODE, difficulty: 'hard', concept: '응용 (사다리)', requiredSkills: SKILLS_APPLY,
    stem: '길이 $6$ m 사다리가 벽에 $45°$ 로 기대어 있다. 사다리 위쪽 끝의 높이는?',
    options: [
      { key: 'A', text: '$3\\sqrt{2}$ m', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3$ m', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\sin 45°$ 적용 누락' },
      { key: 'C', text: '$6$ m', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '사다리 길이 그대로' },
      { key: 'D', text: '$\\sqrt{2}$ m', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '사다리 길이 무시' },
      { key: 'E', text: '$6\\sqrt{2}$ m', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sqrt{2}$ 곱셈 잘못' },
    ],
    solution: '높이 $= 6 \\sin 45° = 6 \\cdot \\dfrac{\\sqrt{2}}{2} = 3\\sqrt{2}$ m.' },

  // S20 (어려움) (sin30°+cos60°)²
  { chapterCode: CODE, difficulty: 'hard', concept: '특수값 응용', requiredSkills: SKILLS_SPECIAL_30,
    stem: '$(\\sin 30° + \\cos 60°)^2 + \\tan 45° = ?$',
    options: [
      { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\tan 45°$ 누락' },
      { key: 'C', text: '$\\dfrac{5}{4}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\tan 45°$ 잘못' },
      { key: 'D', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 계산' },
      { key: 'E', text: '$\\dfrac{3}{2}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
    ],
    solution: '$(1/2 + 1/2)^2 + 1 = 1 + 1 = 2$.' },
];

export const K_G9_MATH3_CH04_TRIG_RATIO_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
