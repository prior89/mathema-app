/**
 * K-G11-ALG-CH02-TRIG-FN — STUDY pool (single-step, 20문제).
 * 삼각함수 — 라디안, 특수각, 항등식, 주기, 사인·코사인 법칙.
 * Mastery 3-step과 별도 변형 문제. 고2 대수 (G11).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5. LLM 미사용.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G11-ALG-CH02-TRIG-FN';
const SKILLS_RAD = ['degree_radian_conversion'];
const SKILLS_SPECIAL = ['special_angle_sin_cos_tan'];
const SKILLS_IDENTITY = ['pythagorean_identity', 'tan_definition'];
const SKILLS_PARITY = ['odd_even_function'];
const SKILLS_ARC = ['arc_length_radian'];
const SKILLS_PERIOD = ['trig_function_period'];
const SKILLS_EQN = ['trig_equation'];
const SKILLS_LAW_COS = ['law_of_cosines'];
const SKILLS_LAW_SIN = ['law_of_sines'];
const SKILLS_AMP = ['amplitude_max_min'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) 360° = 2π
  { chapterCode: CODE, difficulty: 'easy', concept: '$360° = 2\\pi$', requiredSkills: SKILLS_RAD,
    stem: '$360°$ 를 라디안으로?',
    options: [
      { key: 'A', text: '$2\\pi$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\pi$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$180°$' },
      { key: 'C', text: '$360 \\pi$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 곱' },
      { key: 'D', text: '$4\\pi$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'E', text: '$\\pi/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$90°$' },
    ],
    solution: '$180° = \\pi$ → $360° = 2\\pi$.' },

  // S2 (쉬움) 45° = π/4
  { chapterCode: CODE, difficulty: 'easy', concept: '$45° = \\pi/4$', requiredSkills: SKILLS_RAD,
    stem: '$45°$ 를 라디안으로?',
    options: [
      { key: 'A', text: '$\\dfrac{\\pi}{4}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{\\pi}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$90°$' },
      { key: 'C', text: '$\\dfrac{\\pi}{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$60°$' },
      { key: 'D', text: '$\\dfrac{\\pi}{6}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$30°$' },
      { key: 'E', text: '$45\\pi$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 식' },
    ],
    solution: '$45° = \\dfrac{45\\pi}{180} = \\dfrac{\\pi}{4}$.' },

  // S3 (쉬움) sin45°
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\sin 45°$', requiredSkills: SKILLS_SPECIAL,
    stem: '$\\sin 45° = ?$',
    options: [
      { key: 'A', text: '$\\dfrac{\\sqrt{2}}{2}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin 30°$' },
      { key: 'C', text: '$\\dfrac{\\sqrt{3}}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin 60°$' },
      { key: 'D', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin 90°$' },
      { key: 'E', text: '$\\sqrt{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$\\sin 45° = \\dfrac{\\sqrt{2}}{2}$.' },

  // S4 (쉬움) cos45°
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\cos 45°$', requiredSkills: SKILLS_SPECIAL,
    stem: '$\\cos 45° = ?$',
    options: [
      { key: 'A', text: '$\\dfrac{\\sqrt{2}}{2}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{\\sqrt{3}}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\cos 30°$' },
      { key: 'C', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\cos 60°$' },
      { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\cos 90°$' },
      { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\cos 0°$' },
    ],
    solution: '$\\cos 45° = \\sin 45° = \\dfrac{\\sqrt{2}}{2}$.' },

  // S5 (쉬움) tan30°
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\tan 30°$', requiredSkills: SKILLS_SPECIAL,
    stem: '$\\tan 30° = ?$',
    options: [
      { key: 'A', text: '$\\dfrac{\\sqrt{3}}{3}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\sqrt{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\tan 60°$' },
      { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\tan 45°$' },
      { key: 'D', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin 30°$' },
      { key: 'E', text: '$\\dfrac{\\sqrt{3}}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\cos 30°$' },
    ],
    solution: '$\\tan 30° = \\dfrac{\\sin 30°}{\\cos 30°} = \\dfrac{1/2}{\\sqrt{3}/2} = \\dfrac{1}{\\sqrt{3}} = \\dfrac{\\sqrt{3}}{3}$.' },

  // S6 (쉬움) tan 정의
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\tan = \\sin/\\cos$', requiredSkills: SKILLS_IDENTITY,
    stem: '$\\dfrac{\\sin\\theta}{\\cos\\theta} = ?$',
    options: [
      { key: 'A', text: '$\\tan\\theta$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\cot\\theta$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '뒤집음' },
      { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '항상 $1$ 아님' },
      { key: 'D', text: '$\\sin\\theta \\cdot \\cos\\theta$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곱셈 잘못' },
      { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '정의: $\\tan\\theta = \\dfrac{\\sin\\theta}{\\cos\\theta}$.' },

  // S7 (중) 30° = π/6
  { chapterCode: CODE, difficulty: 'medium', concept: '$30° = \\pi/6$', requiredSkills: SKILLS_RAD,
    stem: '$30°$ 를 라디안으로?',
    options: [
      { key: 'A', text: '$\\dfrac{\\pi}{6}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{\\pi}{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$60°$' },
      { key: 'C', text: '$\\dfrac{\\pi}{4}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$45°$' },
      { key: 'D', text: '$\\dfrac{\\pi}{12}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$15°$' },
      { key: 'E', text: '$30\\pi$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 식' },
    ],
    solution: '$30° = \\dfrac{30\\pi}{180} = \\dfrac{\\pi}{6}$.' },

  // S8 (중) sin90°
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\sin 90°$', requiredSkills: SKILLS_SPECIAL,
    stem: '$\\sin 90° = ?$',
    options: [
      { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\cos 90°$' },
      { key: 'C', text: '$\\dfrac{\\sqrt{3}}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin 60°$' },
      { key: 'D', text: '$\\dfrac{\\sqrt{2}}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin 45°$' },
      { key: 'E', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\tan 90°$' },
    ],
    solution: '$\\sin 90° = 1$ (최댓값).' },

  // S9 (중) cos0°
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\cos 0°$', requiredSkills: SKILLS_SPECIAL,
    stem: '$\\cos 0° = ?$',
    options: [
      { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin 0°$' },
      { key: 'C', text: '$-1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\cos 180°$' },
      { key: 'D', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\cos 60°$' },
      { key: 'E', text: '정의 X', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '정의됨' },
    ],
    solution: '$\\cos 0° = 1$ (최댓값).' },

  // S10 (중) tan0°
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\tan 0°$', requiredSkills: SKILLS_SPECIAL,
    stem: '$\\tan 0° = ?$',
    options: [
      { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\cos 0°$' },
      { key: 'C', text: '정의 X', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\cos 0° \\neq 0$이므로 정의됨' },
      { key: 'D', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\tan 90°$' },
      { key: 'E', text: '$-1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '잘못' },
    ],
    solution: '$\\tan 0° = \\dfrac{\\sin 0°}{\\cos 0°} = \\dfrac{0}{1} = 0$.' },

  // S11 (중) sin(-45°)
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\sin$ 홀함수', requiredSkills: SKILLS_PARITY,
    stem: '$\\sin(-45°) = ?$',
    options: [
      { key: 'A', text: '$-\\dfrac{\\sqrt{2}}{2}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{\\sqrt{2}}{2}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$\\sin$은 홀함수 — 부호 바뀜' },
      { key: 'C', text: '$-\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '다른 각도' },
      { key: 'D', text: '$-1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin(-90°)$' },
      { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$\\sin(-\\theta) = -\\sin\\theta$. $\\sin(-45°) = -\\sin 45° = -\\dfrac{\\sqrt{2}}{2}$.' },

  // S12 (중) cos(-60°)
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\cos$ 짝함수', requiredSkills: SKILLS_PARITY,
    stem: '$\\cos(-60°) = ?$',
    options: [
      { key: 'A', text: '$\\dfrac{1}{2}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$-\\dfrac{1}{2}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$\\cos$은 짝함수 — 부호 그대로' },
      { key: 'C', text: '$\\dfrac{\\sqrt{3}}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\cos 30°$' },
      { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\cos 90°$' },
      { key: 'E', text: '$-\\dfrac{\\sqrt{3}}{2}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '잘못' },
    ],
    solution: '$\\cos(-\\theta) = \\cos\\theta$. $\\cos(-60°) = \\cos 60° = \\dfrac{1}{2}$.' },

  // S13 (중) 호 길이
  { chapterCode: CODE, difficulty: 'medium', concept: '호의 길이 ($r \\theta$)', requiredSkills: SKILLS_ARC,
    stem: '반지름 $4$, 중심각 $\\dfrac{\\pi}{2}$ 인 호의 길이?',
    options: [
      { key: 'A', text: '$2\\pi$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$4\\pi$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '전체 원주' },
      { key: 'C', text: '$\\pi$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
      { key: 'D', text: '$\\pi/2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$r$ 무시' },
      { key: 'E', text: '$8\\pi$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '호 길이 $= r\\theta = 4 \\cdot \\dfrac{\\pi}{2} = 2\\pi$.' },

  // S14 (중) cos 주기
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\cos$ 주기', requiredSkills: SKILLS_PERIOD,
    stem: '$y = \\cos x$ 의 주기?',
    options: [
      { key: 'A', text: '$2\\pi$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\pi$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\tan$ 주기' },
      { key: 'C', text: '$\\dfrac{\\pi}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$4\\pi$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'E', text: '$360$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$360°$ 라디안 아님' },
    ],
    solution: '$\\cos(x + 2\\pi) = \\cos x$ → 주기 $2\\pi$.' },

  // S15 (중) cot 주기
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\cot$ 주기', requiredSkills: SKILLS_PERIOD,
    stem: '$y = \\cot x$ 의 주기?',
    options: [
      { key: 'A', text: '$\\pi$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$2\\pi$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin, \\cos$ 주기' },
      { key: 'C', text: '$\\dfrac{\\pi}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '주기 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '주기 있음' },
      { key: 'E', text: '$4\\pi$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '$\\cot = 1/\\tan$ → $\\tan$과 같은 주기 $\\pi$.' },

  // S16 (어려움) cosθ=3/5 → sinθ
  { chapterCode: CODE, difficulty: 'hard', concept: '항등식 활용 ($\\cos \\to \\sin$)', requiredSkills: SKILLS_IDENTITY,
    stem: '$\\cos\\theta = \\dfrac{3}{5}$ 이고 $\\theta$ 가 제$1$사분면. $\\sin\\theta$?',
    options: [
      { key: 'A', text: '$\\dfrac{4}{5}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{3}{5}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\cos$ 그대로' },
      { key: 'C', text: '$-\\dfrac{4}{5}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '제1사분면 → 양수' },
      { key: 'D', text: '$\\dfrac{5}{4}$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '뒤집음' },
      { key: 'E', text: '$\\dfrac{4}{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\tan$' },
    ],
    solution: '$\\sin^2 = 1 - 9/25 = 16/25$. $\\sin = 4/5$ (1사분면 양수).' },

  // S17 (어려움) cosx = -1/2 해
  { chapterCode: CODE, difficulty: 'hard', concept: '삼각방정식', requiredSkills: SKILLS_EQN,
    stem: '$\\cos x = -\\dfrac{1}{2}$, $x \\in [0, 2\\pi)$ 의 해?',
    options: [
      { key: 'A', text: '$x = \\dfrac{2\\pi}{3}, \\dfrac{4\\pi}{3}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = \\dfrac{\\pi}{3}, \\dfrac{2\\pi}{3}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '양수 해' },
      { key: 'C', text: '$x = \\dfrac{\\pi}{6}, \\dfrac{5\\pi}{6}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin x = 1/2$' },
      { key: 'D', text: '$x = \\dfrac{\\pi}{2}, \\dfrac{3\\pi}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$x = \\pi$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '한 해만' },
    ],
    solution: '$\\cos x = -1/2$ → 제$2$, $3$ 사분면. $x = \\pi - \\pi/3 = 2\\pi/3$ 또는 $\\pi + \\pi/3 = 4\\pi/3$.' },

  // S18 (어려움) 코사인 법칙
  { chapterCode: CODE, difficulty: 'hard', concept: '코사인 법칙', requiredSkills: SKILLS_LAW_COS,
    stem: '$\\triangle ABC$에서 $a = 4$, $b = 3$, $C = 60°$. $c$?',
    options: [
      { key: 'A', text: '$\\sqrt{13}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\sqrt{25} = 5$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$- 2ab \\cos C$ 누락' },
      { key: 'C', text: '$\\sqrt{37}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$+ 2ab \\cos C$ 잘못' },
      { key: 'D', text: '$7$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$a + b$' },
      { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$b - a$' },
    ],
    solution: '$c^2 = a^2 + b^2 - 2ab \\cos C = 16 + 9 - 2 \\cdot 4 \\cdot 3 \\cdot 1/2 = 25 - 12 = 13$. $c = \\sqrt{13}$.' },

  // S19 (어려움) 사인 법칙
  { chapterCode: CODE, difficulty: 'hard', concept: '사인 법칙 (외접원)', requiredSkills: SKILLS_LAW_SIN,
    stem: '$\\sin A = \\dfrac{\\sqrt{3}}{2}, a = 6$. 외접원 지름 $2R$?',
    options: [
      { key: 'A', text: '$4\\sqrt{3}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3\\sqrt{3}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
      { key: 'C', text: '$6$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\sin A$ 무시' },
      { key: 'D', text: '$12$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'E', text: '$\\sqrt{12}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '$\\dfrac{a}{\\sin A} = 2R \\to 2R = \\dfrac{6}{\\sqrt{3}/2} = \\dfrac{12}{\\sqrt{3}} = 4\\sqrt{3}$.' },

  // S20 (어려움) 진폭
  { chapterCode: CODE, difficulty: 'hard', concept: '$y = a\\cos x$ 최댓값', requiredSkills: SKILLS_AMP,
    stem: '$y = 3 \\cos x$ 의 최댓값?',
    options: [
      { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\cos$ 자체 최댓값' },
      { key: 'C', text: '$\\dfrac{1}{3}$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '뒤집음' },
      { key: 'D', text: '$-3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '최솟값' },
      { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$\\cos x$ 최댓값 $1$. $3 \\cos x$ 최댓값 $= 3 \\cdot 1 = 3$.' },
];

export const K_G11_ALG_CH02_TRIG_FN_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
