/**
 * K-G9-MATH3-CH04-TRIG-RATIO (삼각비) — 20문제 3-step Mastery.
 * 중3 — 직각삼각형 sin/cos/tan 정의 → 특수각 (30°, 45°, 60°) →
 *        항등식 ($\sin^2 + \cos^2 = 1$, $\tan = \sin/\cos$) → 측량 응용.
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 * 주요 errorCode 분배:
 *   FORMULA_SELECTION_ERROR 6 (Q1,2,3,12,13,19) / CONCEPT_MISUNDERSTANDING 5 (Q4,5,6,7,11)
 *   ALGEBRA_ERROR 4 (Q15,16,17,20) / ARITHMETIC_ERROR 2 (Q8,9)
 *   DENOMINATOR_ERROR 2 (Q10,18) / CONDITION_MISSING 1 (Q14)
 *
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G9-MATH3-CH04-TRIG-RATIO';
const SKILLS_DEF = ['trig_definition', 'sin_cos_tan'];
const SKILLS_SPECIAL_30 = ['sin_30_cos_60', 'special_angle_30'];
const SKILLS_SPECIAL_45 = ['sin_45_cos_45'];
const SKILLS_SPECIAL_60 = ['sin_60_cos_30', 'tan_60'];
const SKILLS_TAN_30 = ['tan_30'];
const SKILLS_IDENTITY = ['pythagorean_identity', 'tan_sin_cos'];
const SKILLS_VALUE = ['trig_ratio_from_sides'];
const SKILLS_INVERSE = ['inverse_trig_ratio'];
const SKILLS_APPLY = ['trig_measurement', 'height_distance'];

const problems: KoreanProblemSeed[] = [
  // Q1
  { chapterCode: CODE, difficulty: 'easy', concept: 'sin 정의', requiredSkills: SKILLS_DEF,
    stem: '직각삼각형의 한 예각 $\\theta$ 에 대해 $\\sin\\theta = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '예각 $\\theta$ 와 각 변의 관계?', options: [
        { key: 'A', text: '대변 (마주보는 변), 인접변 (붙은 변), 빗변 (직각의 반대)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '빗변이 가장 짧음', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '빗변이 가장 김' },
        { key: 'C', text: '대변 = 인접변', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '다른 변' },
        { key: 'D', text: '$\\theta$ 와 무관', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '관계 있음' },
        { key: 'E', text: '모두 같은 변', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '다름' },
      ] },
      { stepType: 'PROCESS', prompt: 'sin = ?', options: [
        { key: 'A', text: '대변 / 빗변', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '인접변 / 빗변', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: 'cos 정의' },
        { key: 'C', text: '대변 / 인접변', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: 'tan 정의' },
        { key: 'D', text: '빗변 / 대변', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '뒤집힘' },
        { key: 'E', text: '인접변 / 대변', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$\\sin\\theta = ?$', options: [
        { key: 'A', text: '$\\dfrac{\\text{대변}}{\\text{빗변}}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{\\text{인접변}}{\\text{빗변}}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: 'cos' },
        { key: 'C', text: '$\\dfrac{\\text{대변}}{\\text{인접변}}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: 'tan' },
        { key: 'D', text: '$\\dfrac{\\text{빗변}}{\\text{대변}}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '뒤집힘' },
        { key: 'E', text: '대변 $-$ 빗변', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '차' },
      ] },
    ], solution: '$\\sin\\theta = \\dfrac{\\text{대변}}{\\text{빗변}}$.' },

  // Q2
  { chapterCode: CODE, difficulty: 'easy', concept: 'cos 정의', requiredSkills: SKILLS_DEF,
    stem: '$\\cos\\theta = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: 'cos 와 인접변·빗변의 관계?', options: [
        { key: 'A', text: '인접변 / 빗변', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '대변 / 빗변', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: 'sin' },
        { key: 'C', text: '대변 / 인접변', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: 'tan' },
        { key: 'D', text: '빗변 / 인접변', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '뒤집힘' },
        { key: 'E', text: '인접변 / 대변', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\cos\\theta$ 의 분자·분모는?', options: [
        { key: 'A', text: '분자 인접변, 분모 빗변', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '분자 빗변, 분모 인접변', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '뒤집힘' },
        { key: 'C', text: '분자 대변, 분모 빗변', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: 'sin' },
        { key: 'D', text: '분자 대변, 분모 인접변', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: 'tan' },
        { key: 'E', text: '분자 빗변, 분모 대변', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$\\cos\\theta = ?$', options: [
        { key: 'A', text: '$\\dfrac{\\text{인접변}}{\\text{빗변}}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{\\text{대변}}{\\text{빗변}}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: 'sin' },
        { key: 'C', text: '$\\dfrac{\\text{대변}}{\\text{인접변}}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: 'tan' },
        { key: 'D', text: '$\\dfrac{\\text{빗변}}{\\text{인접변}}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '뒤집힘' },
        { key: 'E', text: '대변 $-$ 빗변', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\cos\\theta = \\dfrac{\\text{인접변}}{\\text{빗변}}$.' },

  // Q3
  { chapterCode: CODE, difficulty: 'easy', concept: 'tan 정의', requiredSkills: SKILLS_DEF,
    stem: '$\\tan\\theta = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: 'tan은 어떤 비?', options: [
        { key: 'A', text: '대변 / 인접변', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '대변 / 빗변', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: 'sin' },
        { key: 'C', text: '인접변 / 빗변', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: 'cos' },
        { key: 'D', text: '인접변 / 대변', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '뒤집힘' },
        { key: 'E', text: '빗변 / 인접변', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: 'tan은 sin과 cos 관계?', options: [
        { key: 'A', text: '$\\tan = \\dfrac{\\sin}{\\cos}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\tan = \\sin \\cdot \\cos$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱' },
        { key: 'C', text: '$\\tan = \\sin + \\cos$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
        { key: 'D', text: '$\\tan = \\cos / \\sin$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '뒤집힘' },
        { key: 'E', text: '$\\tan = \\sin - \\cos$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '차' },
      ] },
      { stepType: 'ANSWER', prompt: '$\\tan\\theta = ?$', options: [
        { key: 'A', text: '$\\dfrac{\\text{대변}}{\\text{인접변}}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{\\text{대변}}{\\text{빗변}}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: 'sin' },
        { key: 'C', text: '$\\dfrac{\\text{인접변}}{\\text{빗변}}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: 'cos' },
        { key: 'D', text: '$\\dfrac{\\text{인접변}}{\\text{대변}}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '뒤집힘' },
        { key: 'E', text: '$\\sin\\theta \\cdot \\cos\\theta$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱' },
      ] },
    ], solution: '$\\tan\\theta = \\dfrac{\\text{대변}}{\\text{인접변}} = \\dfrac{\\sin\\theta}{\\cos\\theta}$.' },

  // Q4
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\sin 30°$', requiredSkills: SKILLS_SPECIAL_30,
    stem: '$\\sin 30°$ 의 값은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$30°$-$60°$-$90°$ 직각삼각형 비율?', options: [
        { key: 'A', text: '$1 : \\sqrt{3} : 2$ (대변 : 인접변 : 빗변, $\\theta=30°$ 기준)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1 : 1 : \\sqrt{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$45°$-$45°$-$90°$' },
        { key: 'C', text: '$1 : 2 : \\sqrt{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '순서 잘못' },
        { key: 'D', text: '$3 : 4 : 5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '다른 삼각형' },
        { key: 'E', text: '$1 : 2 : 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\sin 30° = $ 대변/빗변', options: [
        { key: 'A', text: '$\\dfrac{1}{2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{\\sqrt{3}}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\cos 30°$' },
        { key: 'C', text: '$\\dfrac{\\sqrt{2}}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin 45°$' },
        { key: 'D', text: '$\\dfrac{1}{\\sqrt{3}}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\tan 30°$' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\tan 45°$' },
      ] },
      { stepType: 'ANSWER', prompt: '$\\sin 30° = ?$', options: [
        { key: 'A', text: '$\\dfrac{1}{2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{\\sqrt{3}}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\cos 30°$' },
        { key: 'C', text: '$\\dfrac{\\sqrt{2}}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin 45°$' },
        { key: 'D', text: '$\\dfrac{1}{\\sqrt{3}}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\tan 30°$' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\sin 30° = 1/2$.' },

  // Q5
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\cos 60°$', requiredSkills: SKILLS_SPECIAL_30,
    stem: '$\\cos 60° = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\cos 60° = \\sin 30°$ (여각 관계)', options: [
        { key: 'A', text: '여각: $\\sin(90° - \\theta) = \\cos\\theta$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\cos 60° = \\sin 60°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '여각 잘못' },
        { key: 'C', text: '$\\cos 60° = -\\sin 60°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '음수' },
        { key: 'D', text: '관계 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '관계 있음' },
        { key: 'E', text: '$\\cos 60° = 60°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\cos 60° = \\sin 30° = 1/2$', options: [
        { key: 'A', text: '$\\dfrac{1}{2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{\\sqrt{3}}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin 60°$' },
        { key: 'C', text: '$\\dfrac{\\sqrt{2}}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$45°$' },
        { key: 'D', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sqrt{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\tan 60°$' },
      ] },
      { stepType: 'ANSWER', prompt: '$\\cos 60° = ?$', options: [
        { key: 'A', text: '$\\dfrac{1}{2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{\\sqrt{3}}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin 60°$' },
        { key: 'C', text: '$\\dfrac{\\sqrt{2}}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$45°$' },
        { key: 'D', text: '$\\sqrt{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\tan 60°$' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\cos 60° = 1/2$ (= $\\sin 30°$, 여각 관계).' },

  // Q6
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\tan 45°$', requiredSkills: SKILLS_SPECIAL_45,
    stem: '$\\tan 45° = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$45°$-$45°$-$90°$ 직각이등변삼각형. 두 대변과 인접변 같다.', options: [
        { key: 'A', text: '대변 $=$ 인접변 → 비율 $1 : 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '대변 $= 2 \\times$ 인접변', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
        { key: 'C', text: '대변 $=$ 빗변', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
        { key: 'D', text: '대변 $= \\sqrt{2} \\times$ 인접변', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '빗변 관계' },
        { key: 'E', text: '관계 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '있음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\tan 45° = $ 대변/인접변 $= 1/1$', options: [
        { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sqrt{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$\\dfrac{\\sqrt{2}}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin 45°$' },
        { key: 'D', text: '$\\dfrac{1}{\\sqrt{2}}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$45°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$\\tan 45° = ?$', options: [
        { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{\\sqrt{2}}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin 45°$' },
        { key: 'C', text: '$\\sqrt{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin 30°$' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$45°$ 직각이등변 → 대변 $=$ 인접변 → $\\tan 45° = 1$.' },

  // Q7
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\sin 45°$', requiredSkills: SKILLS_SPECIAL_45,
    stem: '$\\sin 45° = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$45°$ 비율?', options: [
        { key: 'A', text: '대변 $=$ 인접변 $= 1$, 빗변 $= \\sqrt{2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1 : \\sqrt{3} : 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$30°$' },
        { key: 'C', text: '$3 : 4 : 5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$1 : 1 : 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '빗변 잘못' },
        { key: 'E', text: '$1 : 2 : \\sqrt{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\sin 45° = 1/\\sqrt{2}$ 분모 유리화', options: [
        { key: 'A', text: '$\\dfrac{\\sqrt{2}}{2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin 30°$' },
        { key: 'C', text: '$\\dfrac{\\sqrt{3}}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin 60°$' },
        { key: 'D', text: '$\\dfrac{1}{\\sqrt{2}}$ (유리화 안 함)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '맞지만 유리화' },
        { key: 'E', text: '$\\sqrt{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$\\sin 45° = ?$', options: [
        { key: 'A', text: '$\\dfrac{\\sqrt{2}}{2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin 30°$' },
        { key: 'C', text: '$\\dfrac{\\sqrt{3}}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin 60°$' },
        { key: 'D', text: '$\\sqrt{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\sin 45° = \\cos 45° = \\dfrac{\\sqrt{2}}{2}$.' },

  // Q8
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\cos 30°$', requiredSkills: SKILLS_SPECIAL_60,
    stem: '$\\cos 30° = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\theta = 30°$ 기준 인접변 / 빗변', options: [
        { key: 'A', text: '$\\sqrt{3} / 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/2$ (= $\\sin 30°$)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: 'sin 과 혼동' },
        { key: 'C', text: '$\\sqrt{2}/2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$45°$' },
        { key: 'D', text: '$1/\\sqrt{3}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\tan 30°$' },
        { key: 'E', text: '$\\sqrt{3}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\tan 60°$' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\cos 30° = \\sin 60°$ (여각 관계)', options: [
        { key: 'A', text: '맞음 → $\\sqrt{3}/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\cos 30° = \\cos 60°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
        { key: 'C', text: '$\\cos 30° = -\\cos 60°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '음수' },
        { key: 'D', text: '관계 없음', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '여각' },
        { key: 'E', text: '$\\cos 30° = 30°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$\\cos 30° = ?$', options: [
        { key: 'A', text: '$\\dfrac{\\sqrt{3}}{2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\sin 30°$' },
        { key: 'C', text: '$\\dfrac{\\sqrt{2}}{2}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$45°$' },
        { key: 'D', text: '$\\sqrt{3}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\tan 60°$' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\cos 30° = \\dfrac{\\sqrt{3}}{2}$.' },

  // Q9
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\sin 60°$', requiredSkills: SKILLS_SPECIAL_60,
    stem: '$\\sin 60° = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\sin 60° = \\cos 30°$ (여각)', options: [
        { key: 'A', text: '맞음 → $\\sqrt{3}/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sin 60° = \\sin 30°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
        { key: 'C', text: '$\\sin 60° = 1/2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\sin 30°$' },
        { key: 'D', text: '관계 없음', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '여각' },
        { key: 'E', text: '$\\sin 60° = 60°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$30°$ 직각삼각형에서 $60°$ 기준 대변', options: [
        { key: 'A', text: '$\\sqrt{3}/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\cos 60°$' },
        { key: 'C', text: '$\\sqrt{2}/2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$45°$' },
        { key: 'D', text: '$\\sqrt{3}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\tan 60°$' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$\\sin 60°$?', options: [
        { key: 'A', text: '$\\dfrac{\\sqrt{3}}{2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\cos 60°$' },
        { key: 'C', text: '$\\dfrac{\\sqrt{2}}{2}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$45°$' },
        { key: 'D', text: '$\\sqrt{3}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\tan 60°$' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\sin 60° = \\cos 30° = \\dfrac{\\sqrt{3}}{2}$.' },

  // Q10
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\tan 30°$', requiredSkills: SKILLS_TAN_30,
    stem: '$\\tan 30° = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\tan 30° = \\sin 30°/\\cos 30°$', options: [
        { key: 'A', text: '$\\dfrac{1/2}{\\sqrt{3}/2} = \\dfrac{1}{\\sqrt{3}}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/2$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '$\\sin 30°$ 만' },
        { key: 'C', text: '$\\sqrt{3}/2$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '$\\cos 30°$ 만' },
        { key: 'D', text: '$\\sqrt{3}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '$\\tan 60°$' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$1/\\sqrt{3}$ 유리화', options: [
        { key: 'A', text: '$\\dfrac{\\sqrt{3}}{3}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{1}{\\sqrt{3}}$ (유리화 안 함)', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '맞지만 유리화' },
        { key: 'C', text: '$\\dfrac{\\sqrt{3}}{2}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\dfrac{3}{\\sqrt{3}}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '뒤집힘' },
        { key: 'E', text: '$\\sqrt{3}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$\\tan 30°$?', options: [
        { key: 'A', text: '$\\dfrac{\\sqrt{3}}{3}$ (= $\\dfrac{1}{\\sqrt{3}}$)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sqrt{3}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '$\\tan 60°$' },
        { key: 'C', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '$\\tan 45°$' },
        { key: 'E', text: '$\\dfrac{\\sqrt{2}}{2}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\tan 30° = \\dfrac{\\sqrt{3}}{3}$.' },

  // Q11
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\tan 60°$', requiredSkills: SKILLS_SPECIAL_60,
    stem: '$\\tan 60° = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$60°$ 기준 대변/인접변', options: [
        { key: 'A', text: '$\\sqrt{3}/1 = \\sqrt{3}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/\\sqrt{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\tan 30°$' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\tan 45°$' },
        { key: 'D', text: '$\\dfrac{\\sqrt{3}}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin 60°$' },
        { key: 'E', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\cos 60°$' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\tan 60° = \\sin 60°/\\cos 60° = (\\sqrt{3}/2)/(1/2) = \\sqrt{3}$', options: [
        { key: 'A', text: '$\\sqrt{3}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sqrt{3}/3$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '$\\tan 30°$' },
        { key: 'C', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\tan 45°$' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$\\tan 60°$?', options: [
        { key: 'A', text: '$\\sqrt{3}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{\\sqrt{3}}{3}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '$\\tan 30°$' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\tan 45°$' },
        { key: 'D', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\tan 60° = \\sqrt{3}$.' },

  // Q12
  { chapterCode: CODE, difficulty: 'medium', concept: '항등식 $\\sin^2 + \\cos^2 = 1$', requiredSkills: SKILLS_IDENTITY,
    stem: '$\\sin^2\\theta + \\cos^2\\theta = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '피타고라스 정리에서 유도', options: [
        { key: 'A', text: '대변$^2$ + 인접변$^2$ = 빗변$^2$, 양변을 빗변$^2$ 로 나누면', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sin + \\cos = 1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱 누락' },
        { key: 'C', text: '$\\sin = \\cos$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$45°$ 일 때만' },
        { key: 'D', text: '$\\sin \\cdot \\cos = 1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sin^2 - \\cos^2 = 1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '차' },
      ] },
      { stepType: 'PROCESS', prompt: '계산', options: [
        { key: 'A', text: '$\\dfrac{\\text{대변}^2 + \\text{인접변}^2}{\\text{빗변}^2} = \\dfrac{\\text{빗변}^2}{\\text{빗변}^2} = 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\sin\\theta$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\cos\\theta$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\tan\\theta$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '값?', options: [
        { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\sin\\theta$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\tan\\theta$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '피타고라스 항등식: $\\sin^2\\theta + \\cos^2\\theta = 1$.' },

  // Q13
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\tan = \\sin / \\cos$', requiredSkills: SKILLS_IDENTITY,
    stem: '$\\tan\\theta = \\dfrac{\\sin\\theta}{?}$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\tan = $ 대변/인접변 $= \\sin / \\cos$', options: [
        { key: 'A', text: '$\\cos\\theta$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sin\\theta$ (같은)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$1$ 됨' },
        { key: 'C', text: '$\\tan\\theta$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '순환' },
        { key: 'D', text: '$1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\sin$ 만 됨' },
        { key: 'E', text: '$\\sec\\theta$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '안 배움' },
      ] },
      { stepType: 'PROCESS', prompt: '대변/빗변 ÷ 인접변/빗변 = ?', options: [
        { key: 'A', text: '대변/인접변 = $\\tan\\theta$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '빗변/빗변 = $1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '잘못' },
        { key: 'D', text: '대변/빗변', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\sin$' },
        { key: 'E', text: '인접/빗변', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\cos$' },
      ] },
      { stepType: 'ANSWER', prompt: '분모는?', options: [
        { key: 'A', text: '$\\cos\\theta$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sin\\theta$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '동일 분자' },
        { key: 'C', text: '$\\tan\\theta$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '순환' },
        { key: 'D', text: '$1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\cos\\theta + 1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\tan\\theta = \\dfrac{\\sin\\theta}{\\cos\\theta}$.' },

  // Q14
  { chapterCode: CODE, difficulty: 'medium', concept: '직접 비율 (3-4-5 삼각형)', requiredSkills: SKILLS_VALUE,
    stem: '직각삼각형 빗변 $5$, $\\theta$ 의 대변 $3$ 이면 $\\sin\\theta = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\sin = $ 대변/빗변', options: [
        { key: 'A', text: '$3/5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5/3$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '뒤집힘' },
        { key: 'C', text: '$3/4$ (대변/인접변)', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\tan$' },
        { key: 'D', text: '$4/5$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\cos$' },
        { key: 'E', text: '$3 + 5 = 8$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '합' },
      ] },
      { stepType: 'PROCESS', prompt: '값 대입', options: [
        { key: 'A', text: '$\\dfrac{3}{5}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{5}{3}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '뒤집힘' },
        { key: 'C', text: '$\\dfrac{4}{5}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\cos$' },
        { key: 'D', text: '$\\dfrac{3}{4}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\tan$' },
        { key: 'E', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$\\sin\\theta$?', options: [
        { key: 'A', text: '$\\dfrac{3}{5}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{4}{5}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\cos$' },
        { key: 'C', text: '$\\dfrac{3}{4}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\tan$' },
        { key: 'D', text: '$\\dfrac{5}{3}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '뒤집힘' },
        { key: 'E', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\sin\\theta = 3/5$.' },

  // Q15
  { chapterCode: CODE, difficulty: 'medium', concept: '항등식으로 $\\cos$ 구하기', requiredSkills: SKILLS_IDENTITY,
    stem: '$\\sin\\theta = \\dfrac{3}{5}$ (예각). $\\cos\\theta = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\cos^2 = 1 - \\sin^2$', options: [
        { key: 'A', text: '$\\cos^2\\theta = 1 - 9/25 = 16/25$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\cos\\theta = 1 - 3/5 = 2/5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '제곱 누락' },
        { key: 'C', text: '$\\cos\\theta = 3/5$ (같음)', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '잘못' },
        { key: 'D', text: '$\\cos\\theta = 5/3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '뒤집힘' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\cos\\theta = \\sqrt{16/25}$', options: [
        { key: 'A', text: '$\\cos\\theta = 4/5$ (예각이므로 양수)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\cos\\theta = -4/5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '예각이라 양수' },
        { key: 'C', text: '$\\cos\\theta = 16/25$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '제곱근 누락' },
        { key: 'D', text: '$\\cos\\theta = 4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '분수 누락' },
        { key: 'E', text: '$\\cos\\theta = 8/10$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '간단히 안 함' },
      ] },
      { stepType: 'ANSWER', prompt: '$\\cos\\theta$?', options: [
        { key: 'A', text: '$\\dfrac{4}{5}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-\\dfrac{4}{5}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '예각 양수' },
        { key: 'C', text: '$\\dfrac{16}{25}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '제곱근 누락' },
        { key: 'D', text: '$\\dfrac{3}{5}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$\\sin$ 같음' },
        { key: 'E', text: '$\\dfrac{2}{5}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '제곱 누락' },
      ] },
    ], solution: '$\\cos\\theta = \\sqrt{1 - 9/25} = 4/5$ (예각).' },

  // Q16 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '항등식으로 $\\tan$ 구하기', requiredSkills: SKILLS_IDENTITY,
    stem: '$\\sin\\theta = \\dfrac{4}{5}$ (예각). $\\tan\\theta = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\cos\\theta$ 먼저', options: [
        { key: 'A', text: '$\\cos^2 = 1 - 16/25 = 9/25 \\to \\cos = 3/5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\cos = 4/5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '잘못' },
        { key: 'C', text: '$\\cos = -3/5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '예각 양수' },
        { key: 'D', text: '$\\cos = 9/25$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '제곱근 누락' },
        { key: 'E', text: '$\\cos = 1/5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '계산 잘못' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\tan = \\sin/\\cos$', options: [
        { key: 'A', text: '$(4/5)/(3/5) = 4/3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3/4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '뒤집힘' },
        { key: 'C', text: '$4/5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$\\sin$ 자체' },
        { key: 'D', text: '$3/5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$\\cos$' },
        { key: 'E', text: '$12/25$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '곱셈' },
      ] },
      { stepType: 'ANSWER', prompt: '$\\tan\\theta$?', options: [
        { key: 'A', text: '$\\dfrac{4}{3}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{3}{4}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '뒤집힘' },
        { key: 'C', text: '$\\dfrac{4}{5}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$\\sin$' },
        { key: 'D', text: '$\\dfrac{3}{5}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$\\cos$' },
        { key: 'E', text: '$\\dfrac{12}{25}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '곱' },
      ] },
    ], solution: '$\\cos = 3/5$, $\\tan = (4/5)/(3/5) = 4/3$.' },

  // Q17 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '특수각으로 길이 구하기', requiredSkills: SKILLS_APPLY,
    stem: '직각삼각형 빗변 $10$, 한 예각 $30°$. 그 예각의 대변 길이?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\sin 30° = $ 대변/빗변', options: [
        { key: 'A', text: '대변 = 빗변 $\\times \\sin 30°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '대변 = 빗변 / $\\sin 30°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '식 뒤집힘' },
        { key: 'C', text: '대변 = 빗변 $+ \\sin 30°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '합' },
        { key: 'D', text: '대변 = 빗변 $- \\sin 30°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '차' },
        { key: 'E', text: '대변 = $\\sin 30°$ 만', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '빗변 무시' },
      ] },
      { stepType: 'PROCESS', prompt: '$10 \\times 1/2$', options: [
        { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$20$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$10/(1/2)$' },
        { key: 'C', text: '$10$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1/2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '빗변 무시' },
      ] },
      { stepType: 'ANSWER', prompt: '대변?', options: [
        { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$10$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$20$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나누기 잘못' },
        { key: 'D', text: '$5\\sqrt{3}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '인접변' },
        { key: 'E', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '빗변 무시' },
      ] },
    ], solution: '대변 $= 10 \\cdot \\sin 30° = 10 \\cdot 1/2 = 5$.' },

  // Q18 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '인접변→빗변 (cos 역사용)', requiredSkills: SKILLS_APPLY,
    stem: '직각삼각형 한 예각 $60°$, 그 예각의 인접변 $4$. 빗변?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\cos 60° = $ 인접/빗변 → 빗변 = ?', options: [
        { key: 'A', text: '빗변 = 인접 / $\\cos 60°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '빗변 = 인접 $\\times \\cos 60°$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '식 뒤집힘' },
        { key: 'C', text: '빗변 = 인접 + $\\cos 60°$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '합' },
        { key: 'D', text: '빗변 = $\\cos 60° / $ 인접', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '뒤집힘' },
        { key: 'E', text: '빗변 = $4$ 자체', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$4 / (1/2)$', options: [
        { key: 'A', text: '$8$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$4 \\times 1/2$' },
        { key: 'C', text: '$4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1/8$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '뒤집힘' },
        { key: 'E', text: '$4\\sqrt{3}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '빗변?', options: [
        { key: 'A', text: '$8$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$4\\sqrt{3}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '빗변 $= 4 / \\cos 60° = 4 / (1/2) = 8$.' },

  // Q19 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '역 (값→각)', requiredSkills: SKILLS_INVERSE,
    stem: '$\\sin\\theta = \\dfrac{1}{2}$ 인 예각 $\\theta$ 는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '특수각 표에서 $\\sin = 1/2$ 인 각?', options: [
        { key: 'A', text: '$30°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$45°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\sin = \\sqrt{2}/2$' },
        { key: 'C', text: '$60°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\sin = \\sqrt{3}/2$' },
        { key: 'D', text: '$90°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\sin = 1$' },
        { key: 'E', text: '$0°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\sin = 0$' },
      ] },
      { stepType: 'PROCESS', prompt: '검산: $\\sin 30° = 1/2$ ✓', options: [
        { key: 'A', text: '$\\theta = 30°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\theta = 60°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\cos 60° = 1/2$' },
        { key: 'C', text: '$\\theta = 45°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\theta = 90°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '예각 X' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'ANSWER', prompt: '$\\theta$?', options: [
        { key: 'A', text: '$30°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$60°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\cos 60° = 1/2$' },
        { key: 'C', text: '$45°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$90°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '예각 X' },
        { key: 'E', text: '$0°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\sin 0 = 0$' },
      ] },
    ], solution: '$\\sin 30° = 1/2$ → $\\theta = 30°$.' },

  // Q20 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '측량 응용 (나무 높이)', requiredSkills: SKILLS_APPLY,
    stem: '나무에서 $5$m 떨어진 곳에서 꼭대기를 올려본 각이 $60°$. 나무 높이?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\tan 60° = $ 높이 / 떨어진 거리', options: [
        { key: 'A', text: '높이 = 거리 $\\times \\tan 60°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '높이 = 거리 / $\\tan 60°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '뒤집힘' },
        { key: 'C', text: '높이 = 거리 + $\\tan 60°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '합' },
        { key: 'D', text: '높이 = $\\tan 60°$ 만', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '거리 무시' },
        { key: 'E', text: '높이 = 거리 $- \\tan 60°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '차' },
      ] },
      { stepType: 'PROCESS', prompt: '$5 \\times \\sqrt{3}$', options: [
        { key: 'A', text: '$5\\sqrt{3}$ m', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5/\\sqrt{3}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '뒤집힘' },
        { key: 'C', text: '$\\sqrt{3}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '거리 무시' },
        { key: 'D', text: '$5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$\\tan$ 무시' },
        { key: 'E', text: '$15$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '나무 높이?', options: [
        { key: 'A', text: '$5\\sqrt{3}$ m', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5$ m', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '거리 자체' },
        { key: 'C', text: '$10$ m', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\sqrt{3}$ m', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '거리 무시' },
        { key: 'E', text: '$\\dfrac{5}{\\sqrt{3}}$ m', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '뒤집힘' },
      ] },
    ], solution: '높이 $= 5 \\cdot \\tan 60° = 5\\sqrt{3}$ m.' },
];

export const K_G9_MATH3_CH04_TRIG_RATIO_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
