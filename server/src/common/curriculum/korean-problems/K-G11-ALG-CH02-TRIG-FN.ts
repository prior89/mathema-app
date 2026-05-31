/**
 * K-G11-ALG-CH02-TRIG (삼각함수) — 20문제 3-step Mastery.
 * 고2 대수 — 호도법 ($\pi = 180°$) → 특수각 ($30/45/60°$) →
 *   항등식 ($\sin^2+\cos^2=1$) → 홀/짝 함수 (부호) → 그래프 주기 →
 *   삼각방정식 → 사인·코사인 법칙.
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 * 주요 errorCode:
 *   CONCEPT_MISUNDERSTANDING 8 / FORMULA_SELECTION_ERROR 5
 *   ARITHMETIC_ERROR 4 / SIGN_ERROR 3
 *
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G11-ALG-CH02-TRIG-FN';
const SKILLS_RAD = ['radian_conversion'];
const SKILLS_SPECIAL = ['special_angle_values'];
const SKILLS_IDENTITY = ['sin2_cos2_identity'];
const SKILLS_PARITY = ['odd_even_function'];
const SKILLS_ARC = ['arc_length'];
const SKILLS_PERIOD = ['trig_period'];
const SKILLS_AMP = ['trig_amplitude'];
const SKILLS_EQN = ['trig_equation'];
const SKILLS_LAW_SIN = ['law_of_sines'];
const SKILLS_LAW_COS = ['law_of_cosines'];
const SKILLS_QUADRANT = ['quadrant_sign'];

const problems: KoreanProblemSeed[] = [
  // Q1
  { chapterCode: CODE, difficulty: 'easy', concept: '$180° = \\pi$', requiredSkills: SKILLS_RAD,
    stem: '$180°$ 를 라디안으로?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\pi$ 라디안 = ?', options: [
        { key: 'A', text: '$180°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$360°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$2\\pi$' },
        { key: 'C', text: '$90°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\pi/2$' },
        { key: 'D', text: '$60°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\pi/3$' },
        { key: 'E', text: '$45°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\pi/4$' },
      ] },
      { stepType: 'PROCESS', prompt: '$180° \\to \\pi$', options: [
        { key: 'A', text: '$\\pi$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2\\pi$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$360°$' },
        { key: 'C', text: '$\\pi/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$90°$' },
        { key: 'D', text: '$\\pi/3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$60°$' },
        { key: 'E', text: '$180$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '단위' },
      ] },
      { stepType: 'ANSWER', prompt: '라디안 값?', options: [
        { key: 'A', text: '$\\pi$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2\\pi$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$\\pi/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$180$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '단위' },
        { key: 'E', text: '$\\pi/3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$180° = \\pi$ 라디안.' },

  // Q2
  { chapterCode: CODE, difficulty: 'easy', concept: '$90° = \\pi/2$', requiredSkills: SKILLS_RAD,
    stem: '$90°$ 를 라디안으로?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$180°$ 의 절반', options: [
        { key: 'A', text: '$\\pi / 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\pi$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$180°$' },
        { key: 'C', text: '$2\\pi$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\pi/4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$45°$' },
        { key: 'E', text: '$90$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '단위' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\pi / 2$', options: [
        { key: 'A', text: '$\\pi / 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\pi$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$\\pi/4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$90$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '단위' },
        { key: 'E', text: '$2\\pi$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '값?', options: [
        { key: 'A', text: '$\\pi / 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\pi$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$\\pi/4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$90$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '단위' },
        { key: 'E', text: '$2\\pi$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$90° = \\pi/2$.' },

  // Q3
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\sin 30°$', requiredSkills: SKILLS_SPECIAL,
    stem: '$\\sin 30° = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '특수각 표', options: [
        { key: 'A', text: '$1/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sqrt{3}/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\cos 30°$' },
        { key: 'C', text: '$\\sqrt{2}/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin 45°$' },
        { key: 'D', text: '$1/\\sqrt{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\tan 30°$' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '30-60-90 삼각형 비율', options: [
        { key: 'A', text: '대변/빗변 = $1/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sqrt{3}/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$\\sin 30°$?', options: [
        { key: 'A', text: '$1/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sqrt{3}/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\cos 30°$' },
        { key: 'C', text: '$\\sqrt{2}/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$1/\\sqrt{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\tan 30°$' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\sin 30° = 1/2$.' },

  // Q4
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\cos 60°$', requiredSkills: SKILLS_SPECIAL,
    stem: '$\\cos 60° = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\sin 30°$ 과 같음', options: [
        { key: 'A', text: '$\\cos 60° = \\sin 30° = 1/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sqrt{3}/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin 60°$' },
        { key: 'C', text: '$\\sqrt{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\tan 60°$' },
        { key: 'D', text: '$\\sqrt{2}/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\cos(90° - 30°)$', options: [
        { key: 'A', text: '$1/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sqrt{3}/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$\\sqrt{2}/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\sqrt{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$\\cos 60°$?', options: [
        { key: 'A', text: '$1/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sqrt{3}/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin 60°$' },
        { key: 'C', text: '$\\sqrt{2}/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\sqrt{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\tan 60°$' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\cos 60° = 1/2$.' },

  // Q5
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\tan 45°$', requiredSkills: SKILLS_SPECIAL,
    stem: '$\\tan 45° = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\sin 45° / \\cos 45°$', options: [
        { key: 'A', text: '$(\\sqrt{2}/2)/(\\sqrt{2}/2) = 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sqrt{2}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$1/\\sqrt{2}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sqrt{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$1$', options: [
        { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sqrt{2}/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin 45°$' },
        { key: 'C', text: '$\\sqrt{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$45$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$\\tan 45°$?', options: [
        { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sqrt{2}/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$\\sqrt{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sqrt{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\tan 60°$' },
      ] },
    ], solution: '$\\tan 45° = 1$.' },

  // Q6
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\sin^2 + \\cos^2 = 1$', requiredSkills: SKILLS_IDENTITY,
    stem: '$\\sin^2 \\theta + \\cos^2 \\theta = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '단위원 위', options: [
        { key: 'A', text: '$(\\cos\\theta, \\sin\\theta)$ 가 단위원 → $x^2 + y^2 = 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$\\theta$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\tan\\theta$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '항등식', options: [
        { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$\\sin 2\\theta$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$2 \\sin\\theta \\cos\\theta$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin 2\\theta$' },
        { key: 'E', text: '$\\theta^2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$\\sin 2\\theta$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\theta^2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\sin^2 + \\cos^2 = 1$ (피타고라스 항등식).' },

  // Q7
  { chapterCode: CODE, difficulty: 'medium', concept: '$60° = \\pi/3$', requiredSkills: SKILLS_RAD,
    stem: '$60°$ 를 라디안으로?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$180° = \\pi$ 이용', options: [
        { key: 'A', text: '$60° = (60/180)\\pi = \\pi/3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\pi/6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$30°$' },
        { key: 'C', text: '$\\pi/4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$45°$' },
        { key: 'D', text: '$2\\pi/3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$120°$' },
        { key: 'E', text: '$60\\pi$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\pi/3$', options: [
        { key: 'A', text: '$\\pi/3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\pi/6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\pi/4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2\\pi/3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\pi$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '값?', options: [
        { key: 'A', text: '$\\pi/3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\pi/6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\pi/4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2\\pi/3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$60\\pi$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$60° = \\pi/3$.' },

  // Q8
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\sin 60°$', requiredSkills: SKILLS_SPECIAL,
    stem: '$\\sin 60° = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\cos 30°$ 과 같음', options: [
        { key: 'A', text: '$\\sin 60° = \\cos 30°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sin 30°$ 과 같음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '항상 $0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\tan 60°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$\\cos 60°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\sqrt{3}/2$', options: [
        { key: 'A', text: '$\\sqrt{3}/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin 30°$' },
        { key: 'C', text: '$\\sqrt{2}/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\sqrt{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '값?', options: [
        { key: 'A', text: '$\\sqrt{3}/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$\\sqrt{2}/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\sqrt{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\sin 60° = \\sqrt{3}/2$.' },

  // Q9
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\cos 30°$', requiredSkills: SKILLS_SPECIAL,
    stem: '$\\cos 30° = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\sin 60°$ 와 같음', options: [
        { key: 'A', text: '$\\sqrt{3}/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin 30°$' },
        { key: 'C', text: '$\\sqrt{2}/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\sqrt{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '특수각 표', options: [
        { key: 'A', text: '$\\sqrt{3}/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/\\sqrt{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\tan 30°$' },
        { key: 'C', text: '$1/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\sqrt{2}/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$\\cos 30°$?', options: [
        { key: 'A', text: '$\\sqrt{3}/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$\\sqrt{2}/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\sqrt{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\cos 30° = \\sqrt{3}/2$.' },

  // Q10
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\tan 60°$', requiredSkills: SKILLS_SPECIAL,
    stem: '$\\tan 60° = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\sin 60° / \\cos 60°$', options: [
        { key: 'A', text: '$(\\sqrt{3}/2)/(1/2) = \\sqrt{3}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/\\sqrt{3}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$\\tan 30°$' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\tan 45°$' },
        { key: 'D', text: '$\\sqrt{3}/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\sqrt{3}$', options: [
        { key: 'A', text: '$\\sqrt{3}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/\\sqrt{3}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '뒤집힘' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\sqrt{3}/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$\\tan 60°$?', options: [
        { key: 'A', text: '$\\sqrt{3}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/\\sqrt{3}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$\\tan 30°$' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\sqrt{3}/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\tan 60° = \\sqrt{3}$.' },

  // Q11
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\sin(-\\theta)$', requiredSkills: SKILLS_PARITY,
    stem: '$\\sin(-30°)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: 'sin 의 홀/짝성', options: [
        { key: 'A', text: '홀함수: $\\sin(-x) = -\\sin x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '짝함수: $\\sin(-x) = \\sin x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: 'cos 가 짝' },
        { key: 'C', text: '$\\sin$ 정의 안 됨', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$|\\sin x|$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$-\\sin 30°$', options: [
        { key: 'A', text: '$-1/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$-\\sqrt{3}/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '값?', options: [
        { key: 'A', text: '$-1/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$-\\sqrt{3}/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '정의 안 됨', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\sin(-30°) = -\\sin 30° = -1/2$.' },

  // Q12
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\cos(-\\theta)$', requiredSkills: SKILLS_PARITY,
    stem: '$\\cos(-30°)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: 'cos 의 홀/짝성', options: [
        { key: 'A', text: '짝함수: $\\cos(-x) = \\cos x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '홀함수: $-\\cos x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: 'sin 이 홀' },
        { key: 'C', text: '정의 안 됨', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$|\\cos x|$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\cos 30°$', options: [
        { key: 'A', text: '$\\sqrt{3}/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-\\sqrt{3}/2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$1/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sqrt{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '값?', options: [
        { key: 'A', text: '$\\sqrt{3}/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-\\sqrt{3}/2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$1/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sqrt{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\cos(-30°) = \\cos 30° = \\sqrt{3}/2$.' },

  // Q13
  { chapterCode: CODE, difficulty: 'medium', concept: '호의 길이', requiredSkills: SKILLS_ARC,
    stem: '반지름 $6$, 중심각 $\\pi/3$ 호의 길이?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$l = r\\theta$', options: [
        { key: 'A', text: '$l = r\\theta$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$l = r + \\theta$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합 아님' },
        { key: 'C', text: '$l = r^2 \\theta$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '넓이' },
        { key: 'D', text: '$l = r/\\theta$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$l = 2 \\pi r$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '둘레' },
      ] },
      { stepType: 'PROCESS', prompt: '$6 \\cdot \\pi/3$', options: [
        { key: 'A', text: '$2\\pi$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\pi/2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$6\\pi$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\theta$ 곱 X' },
        { key: 'D', text: '$\\pi/6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$18\\pi$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$l$?', options: [
        { key: 'A', text: '$2\\pi$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\pi/2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$6\\pi$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\pi/6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$18\\pi$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$l = r\\theta = 6 \\cdot \\pi/3 = 2\\pi$.' },

  // Q14
  { chapterCode: CODE, difficulty: 'medium', concept: 'sin 주기', requiredSkills: SKILLS_PERIOD,
    stem: '$y = \\sin x$ 의 주기?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\sin(x + T) = \\sin x$ 인 $T$', options: [
        { key: 'A', text: '$T = 2\\pi$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$T = \\pi$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\tan$ 주기' },
        { key: 'C', text: '$T = \\pi/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$T = 4\\pi$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '주기 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '있음' },
      ] },
      { stepType: 'PROCESS', prompt: '단위원 한 바퀴', options: [
        { key: 'A', text: '$2\\pi$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\pi$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$\\pi/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$4\\pi$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$2\\pi/3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '주기?', options: [
        { key: 'A', text: '$2\\pi$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\pi$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: 'tan' },
        { key: 'C', text: '$\\pi/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$4\\pi$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '주기 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$y = \\sin x$ 주기 $2\\pi$.' },

  // Q15
  { chapterCode: CODE, difficulty: 'medium', concept: 'tan 주기', requiredSkills: SKILLS_PERIOD,
    stem: '$y = \\tan x$ 의 주기?',
    steps: [
      { stepType: 'CONCEPT', prompt: 'tan 의 특성', options: [
        { key: 'A', text: '$\\pi$ 마다 반복', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2\\pi$ 마다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: 'sin/cos 주기' },
        { key: 'C', text: '$\\pi/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$4\\pi$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '주기 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '있음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\pi$', options: [
        { key: 'A', text: '$\\pi$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2\\pi$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$\\pi/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$4\\pi$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '주기?', options: [
        { key: 'A', text: '$\\pi$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2\\pi$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: 'sin' },
        { key: 'C', text: '$\\pi/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$4\\pi$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '주기 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$y = \\tan x$ 주기 $\\pi$.' },

  // Q16 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '$\\sin → \\cos$', requiredSkills: SKILLS_IDENTITY,
    stem: '$\\sin\\theta = 3/5$, $\\theta$ 가 제1사분면. $\\cos\\theta$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\sin^2 + \\cos^2 = 1$', options: [
        { key: 'A', text: '$\\cos^2 = 1 - 9/25$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\cos = 1 - 3/5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱 안 했음' },
        { key: 'C', text: '$\\cos = \\sin$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\cos = 3/5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\cos^2 = 16/25$, 제1사분면 → 양수', options: [
        { key: 'A', text: '$4/5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-4/5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '제1사분면' },
        { key: 'C', text: '$16/25$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '제곱 그대로' },
        { key: 'D', text: '$\\sqrt{16}/25$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$3/5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin$' },
      ] },
      { stepType: 'ANSWER', prompt: '$\\cos\\theta$?', options: [
        { key: 'A', text: '$4/5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-4/5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '제1사분면 양수' },
        { key: 'C', text: '$16/25$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '제곱' },
        { key: 'D', text: '$3/5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$5/4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\cos^2 = 1 - 9/25 = 16/25, \\cos = 4/5$ (1사분면 양수).' },

  // Q17 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '삼각방정식', requiredSkills: SKILLS_EQN,
    stem: '$\\sin x = 1/2$, $x \\in [0, 2\\pi)$. 해?',
    steps: [
      { stepType: 'CONCEPT', prompt: 'sin 값 = 1/2 위치', options: [
        { key: 'A', text: '$\\pi/6$ 와 $\\pi - \\pi/6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\pi/6$ 만', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '2개' },
        { key: 'C', text: '$\\pi/3$ 와 $2\\pi/3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin = \\sqrt{3}/2$' },
        { key: 'D', text: '$\\pi/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin = 1$' },
        { key: 'E', text: '해 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '있음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\pi/6, 5\\pi/6$', options: [
        { key: 'A', text: '$\\pi/6, 5\\pi/6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\pi/6$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'C', text: '$\\pi/3, 2\\pi/3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\pi/2, 3\\pi/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$7\\pi/6, 11\\pi/6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '음수 sin' },
      ] },
      { stepType: 'ANSWER', prompt: '해?', options: [
        { key: 'A', text: '$x = \\pi/6, 5\\pi/6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = \\pi/6$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '2개' },
        { key: 'C', text: '$x = \\pi/3, 2\\pi/3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$x = \\pi/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '해 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$x = \\pi/6, 5\\pi/6$.' },

  // Q18 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '코사인 법칙', requiredSkills: SKILLS_LAW_COS,
    stem: '$a = 7, b = 5, C = 60°$. $c$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '코사인 법칙', options: [
        { key: 'A', text: '$c^2 = a^2 + b^2 - 2ab \\cos C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$c^2 = a^2 + b^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '피타고라스 ($C = 90°$ 만)' },
        { key: 'C', text: '$c = a + b$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$c = a \\sin C + b$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$c^2 = a^2 + b^2 + 2ab \\cos C$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
      ] },
      { stepType: 'PROCESS', prompt: '$49 + 25 - 70 \\cdot 1/2$', options: [
        { key: 'A', text: '$c^2 = 39, c = \\sqrt{39}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$c^2 = 109, c = \\sqrt{109}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$+$' },
        { key: 'C', text: '$c^2 = 74$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2ab\\cos$ 누락' },
        { key: 'D', text: '$c = 12$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$c = 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$c$?', options: [
        { key: 'A', text: '$\\sqrt{39}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sqrt{109}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\sqrt{74}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$12$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$c^2 = 49 + 25 - 70 \\cdot \\cos 60° = 39, c = \\sqrt{39}$.' },

  // Q19 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '사인 법칙', requiredSkills: SKILLS_LAW_SIN,
    stem: '$\\sin A = 1/2, a = 5$. 외접원 지름 $2R$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '사인 법칙', options: [
        { key: 'A', text: '$a / \\sin A = 2R$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a \\cdot \\sin A = R$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$a + \\sin A = 2R$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합 아님' },
        { key: 'D', text: '$\\sin A / a = R$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '뒤집힘' },
        { key: 'E', text: '$a^2 = 2R \\sin A$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$5 / (1/2) = 10$', options: [
        { key: 'A', text: '$10$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2.5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$5 \\cdot 1/2$' },
        { key: 'C', text: '$5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$25$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$2R$?', options: [
        { key: 'A', text: '$10$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2.5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$25$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$2R = a / \\sin A = 5 / (1/2) = 10$.' },

  // Q20 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '진폭', requiredSkills: SKILLS_AMP,
    stem: '$y = 2\\sin x$ 의 최댓값?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\sin x$ 의 범위', options: [
        { key: 'A', text: '$-1 \\leq \\sin x \\leq 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0 \\leq \\sin x \\leq 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '모든 실수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$0$ 만', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sin x \\geq 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$2 \\cdot 1$', options: [
        { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sin$ 만' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '최댓값?', options: [
        { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\sin x$ 최댓값 $1$, $y = 2 \\cdot 1 = 2$.' },
];

export const K_G11_ALG_CH02_TRIG_FN_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
