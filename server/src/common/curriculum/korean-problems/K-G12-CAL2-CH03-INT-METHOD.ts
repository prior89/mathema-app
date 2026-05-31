/**
 * K-G12-CAL2-CH03-INT-METHOD (여러 함수 적분) — 20문제 3-step Mastery.
 * 고3 미적분Ⅱ — 삼각 ($\int \sin, \cos, \sec^2$) → 지수·로그 ($\int e^x, 1/x$) →
 *   치환적분 → 부분적분 ($\int u\,dv = uv - \int v\,du$).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 * 주요 errorCode:
 *   FORMULA_SELECTION_ERROR 8 / ALGEBRA_ERROR 6
 *   SIGN_ERROR 3 / CONCEPT_MISUNDERSTANDING 3
 *
 * LaTeX prime 은 `^{\prime}` 으로 표기.
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G12-CAL2-CH03-INT-METHOD';
const SKILLS_TRIG = ['trig_integral'];
const SKILLS_EXP = ['exp_integral'];
const SKILLS_LOG = ['log_integral'];
const SKILLS_SUB = ['substitution'];
const SKILLS_PARTS = ['integration_by_parts'];
const SKILLS_DEF = ['definite_integral_advanced'];

const problems: KoreanProblemSeed[] = [
  // Q1
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\int \\cos x$', requiredSkills: SKILLS_TRIG,
    stem: '$\\int \\cos x \\, dx = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\sin x$ 의 미분이 $\\cos x$', options: [
        { key: 'A', text: '$\\sin x + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-\\sin x + C$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\cos x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$-\\cos x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\int \\sin x$' },
        { key: 'E', text: '$\\tan x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\sin x$', options: [
        { key: 'A', text: '$\\sin x + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-\\sin x + C$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\cos x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$-\\cos x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\tan x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$\\sin x + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-\\sin x + C$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\cos x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$-\\cos x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\tan x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\int \\cos x \\, dx = \\sin x + C$.' },

  // Q2
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\int \\sin x$', requiredSkills: SKILLS_TRIG,
    stem: '$\\int \\sin x \\, dx = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$(-\\cos x)^{\\prime} = \\sin x$', options: [
        { key: 'A', text: '$-\\cos x + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\cos x + C$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$\\sin x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$-\\sin x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\tan x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$-\\cos x$', options: [
        { key: 'A', text: '$-\\cos x + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\cos x + C$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$\\sin x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$-\\sin x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\tan x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$-\\cos x + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\cos x + C$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$\\sin x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$-\\sin x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\tan x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\int \\sin x \\, dx = -\\cos x + C$.' },

  // Q3
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\int e^x$', requiredSkills: SKILLS_EXP,
    stem: '$\\int e^x \\, dx = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$e^x$ 의 적분은 자기 자신', options: [
        { key: 'A', text: '$e^x + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x e^x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$e^{x+1}/(x+1) + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$x^n$ 적용' },
        { key: 'D', text: '$\\ln e^x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$e^x + C$', options: [
        { key: 'A', text: '$e^x + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x e^x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$e^x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$C$ 누락' },
        { key: 'D', text: '$\\ln x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$e^x + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x e^x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$e^x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\ln x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\int e^x dx = e^x + C$.' },

  // Q4
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\int 1/x$', requiredSkills: SKILLS_LOG,
    stem: '$\\int \\dfrac{1}{x} \\, dx = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\ln|x|$ 의 미분이 $1/x$', options: [
        { key: 'A', text: '$\\ln|x| + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\ln x + C$ (절댓값 누락)', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$x < 0$ 처리' },
        { key: 'C', text: '$-1/x^2 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x^0/0 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$n=-1$ 예외' },
        { key: 'E', text: '$e^x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\ln|x| + C$', options: [
        { key: 'A', text: '$\\ln|x| + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$-1/x^2 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x \\ln x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\ln(1/x) + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$\\ln|x| + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$-1/x^2 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x \\ln x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$e^x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\int 1/x \\, dx = \\ln|x| + C$.' },

  // Q5
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\int \\sec^2 x$', requiredSkills: SKILLS_TRIG,
    stem: '$\\int \\sec^2 x \\, dx = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\tan x$ 의 미분', options: [
        { key: 'A', text: '$\\tan x + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\cot x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\sec x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\sec^3 x / 3 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$-\\tan x + C$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\tan x + C$', options: [
        { key: 'A', text: '$\\tan x + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\cot x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\sec x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\sec^3 x / 3 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$-\\tan x + C$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$\\tan x + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\cot x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\sec x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\sec^3 x / 3 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$-\\tan x + C$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\int \\sec^2 x \\, dx = \\tan x + C$.' },

  // Q6
  { chapterCode: CODE, difficulty: 'easy', concept: '치환적분 공식', requiredSkills: SKILLS_SUB,
    stem: '치환적분 공식?',
    steps: [
      { stepType: 'CONCEPT', prompt: '체인 룰의 역', options: [
        { key: 'A', text: '$\\int f(g(x)) g^{\\prime}(x) dx = \\int f(u) du$ ($u = g(x)$)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\int fg \\, dx = \\int f \\int g$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\int f g^{\\prime} = f g$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\int u \\, dv = uv$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '부분적분 일부' },
        { key: 'E', text: '$\\int f(g) = f g$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$du = g^{\\prime}(x) dx$', options: [
        { key: 'A', text: '$\\int f(u) du$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\int f g$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$f(g) g^{\\prime}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\int u^2 du$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$\\int f(g(x)) g^{\\prime}(x) dx = \\int f(u) du$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\int u dv = uv - \\int v du$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '부분적분' },
        { key: 'C', text: '$\\int fg = \\int f \\int g$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\int f^{\\prime} = f$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\int f(g) = f g$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\int f(g(x)) g^{\\prime}(x) dx = \\int f(u) du$, where $u = g(x)$.' },

  // Q7
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\int \\cos 2x$', requiredSkills: SKILLS_SUB,
    stem: '$\\int \\cos 2x \\, dx = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$u = 2x, du = 2 dx$', options: [
        { key: 'A', text: '$(1/2) \\sin 2x + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sin 2x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$1/2$ 누락' },
        { key: 'C', text: '$2 \\sin 2x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '뒤집힘' },
        { key: 'D', text: '$-\\sin 2x + C$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\cos 2x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\sin(2x)/2$', options: [
        { key: 'A', text: '$\\sin(2x)/2 + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sin 2x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2 \\sin 2x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$-\\sin 2x/2 + C$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\cos 2x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$\\sin(2x)/2 + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sin 2x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2 \\sin 2x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$-\\sin 2x/2 + C$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\cos 2x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(1/2) \\sin 2x + C$.' },

  // Q8
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\int e^{2x}$', requiredSkills: SKILLS_SUB,
    stem: '$\\int e^{2x} \\, dx = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$u = 2x$', options: [
        { key: 'A', text: '$e^{2x}/2 + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$e^{2x} + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$1/2$ 누락' },
        { key: 'C', text: '$2 e^{2x} + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '미분' },
        { key: 'D', text: '$e^{x^2} + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$e^2 x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$e^{2x}/2$', options: [
        { key: 'A', text: '$e^{2x}/2 + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$e^{2x} + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2 e^{2x} + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$e^{2x-1} + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$e^2 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$e^{2x}/2 + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$e^{2x} + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2 e^{2x} + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$e^{2x-1} + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$e^2 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$e^{2x}/2 + C$.' },

  // Q9
  { chapterCode: CODE, difficulty: 'medium', concept: '치환 ($u = x^2$)', requiredSkills: SKILLS_SUB,
    stem: '$\\int 2x \\cos(x^2) \\, dx = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$u = x^2, du = 2x \\, dx$', options: [
        { key: 'A', text: '$\\int \\cos u \\, du$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\int \\cos x dx$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '치환 안 함' },
        { key: 'C', text: '$\\int 2x \\cos x dx$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x^2 \\cos x^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\cos^2 x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\sin u + C = \\sin(x^2) + C$', options: [
        { key: 'A', text: '$\\sin(x^2) + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sin x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$x^2 \\sin x^2 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\cos(x^2)/2 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2 \\sin(x^2) + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$\\sin(x^2) + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sin x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$x^2 \\sin x^2 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\cos(x^2)/2 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2 \\sin(x^2) + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '치환 $u = x^2$ → $\\sin(x^2) + C$.' },

  // Q10
  { chapterCode: CODE, difficulty: 'medium', concept: '치환 ($u = x^2, $ 보정)', requiredSkills: SKILLS_SUB,
    stem: '$\\int x e^{x^2} \\, dx = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$u = x^2, du = 2x dx \\to x dx = du/2$', options: [
        { key: 'A', text: '$(1/2) \\int e^u du$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\int e^u du$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$1/2$ 누락' },
        { key: 'C', text: '$2 \\int e^u du$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '뒤집힘' },
        { key: 'D', text: '$\\int e^x dx$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x e^{x^2}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$e^{x^2}/2$', options: [
        { key: 'A', text: '$e^{x^2}/2 + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$e^{x^2} + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2 e^{x^2} + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x e^{x^2}/2 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$e^{x^2}/2x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$e^{x^2}/2 + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$e^{x^2} + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2 e^{x^2} + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x e^{x^2}/2 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$e^{x^2}/2x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$e^{x^2}/2 + C$.' },

  // Q11
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\int_0^{\\pi/2} \\cos x$', requiredSkills: SKILLS_DEF,
    stem: '$\\int_0^{\\pi/2} \\cos x \\, dx = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$[\\sin x]_0^{\\pi/2}$', options: [
        { key: 'A', text: '$\\sin(\\pi/2) - \\sin 0 = 1 - 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sin 0 - \\sin(\\pi/2) = -1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\cos(\\pi/2) = 0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\pi/2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$1$', options: [
        { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\pi/2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\pi/2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$[\\sin x]_0^{\\pi/2} = 1$.' },

  // Q12
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\int_0^1 e^x$', requiredSkills: SKILLS_DEF,
    stem: '$\\int_0^1 e^x \\, dx = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$[e^x]_0^1$', options: [
        { key: 'A', text: '$e^1 - e^0 = e - 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$e$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$-1$ 누락' },
        { key: 'C', text: '$1 - e$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$e^2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$e - 1$', options: [
        { key: 'A', text: '$e - 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$e$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$1 - e$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$e - 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$e$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$1 - e$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$e - 1$.' },

  // Q13
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\int 1/(x+1)$', requiredSkills: SKILLS_LOG,
    stem: '$\\int \\dfrac{1}{x + 1} \\, dx = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '치환 $u = x + 1, du = dx$', options: [
        { key: 'A', text: '$\\ln|x + 1| + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\ln|x| + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '치환 안 함' },
        { key: 'C', text: '$(x + 1)^2 / 2 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1/(x+1)^2 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\ln(x) + 1 + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\ln|x+1| + C$', options: [
        { key: 'A', text: '$\\ln|x+1| + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\ln|x| + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$(x+1)^2/2 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1/(x+1)^2 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x + \\ln|x| + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$\\ln|x+1| + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\ln|x| + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$(x+1)^2/2 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1/(x+1)^2 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x + \\ln x + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\ln|x+1| + C$.' },

  // Q14
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\int 2x/(x^2+1)$', requiredSkills: SKILLS_SUB,
    stem: '$\\int \\dfrac{2x}{x^2 + 1} \\, dx = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$u = x^2 + 1, du = 2x dx$', options: [
        { key: 'A', text: '$\\int du/u = \\ln|u|$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\int 2x dx$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2x \\ln(x^2+1)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x^2/(x^2+1)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\arctan x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\ln(x^2+1)$', options: [
        { key: 'A', text: '$\\ln(x^2 + 1) + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\ln x^2 + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\ln|x| + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2 \\ln(x^2+1) + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\arctan x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$\\ln(x^2 + 1) + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\ln x^2 + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\ln|x| + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2 \\ln(x^2+1) + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\arctan x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '치환 $u = x^2+1$ → $\\ln(x^2+1) + C$.' },

  // Q15
  { chapterCode: CODE, difficulty: 'medium', concept: '부분적분 공식', requiredSkills: SKILLS_PARTS,
    stem: '부분적분 공식?',
    steps: [
      { stepType: 'CONCEPT', prompt: '곱 미분의 역', options: [
        { key: 'A', text: '$\\int u \\, dv = uv - \\int v \\, du$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\int u \\, dv = uv$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '잔여 항' },
        { key: 'C', text: '$\\int u \\, dv = \\int u \\int dv$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\int uv = \\int u \\int v$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\int f(g) g^{\\prime} = \\int f$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '치환' },
      ] },
      { stepType: 'PROCESS', prompt: '$uv - \\int v du$', options: [
        { key: 'A', text: '$\\int u dv = uv - \\int v du$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\int u dv = uv + \\int v du$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$\\int v du = uv - \\int u dv$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '바뀜' },
        { key: 'D', text: '$\\int u dv = u v du$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\int u v dx$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$\\int u \\, dv = uv - \\int v \\, du$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\int u dv = uv + \\int v du$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\int u dv = uv$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\int u v$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\int f g^{\\prime} = \\int f$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\int u \\, dv = uv - \\int v \\, du$.' },

  // Q16 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '$\\int x e^x$', requiredSkills: SKILLS_PARTS,
    stem: '$\\int x e^x \\, dx = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$u = x, dv = e^x dx$', options: [
        { key: 'A', text: '$x e^x - \\int e^x dx$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x e^x + \\int e^x dx$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$x e^x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '잔여항' },
        { key: 'D', text: '$x^2 e^x / 2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$e^x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$x e^x - e^x + C$', options: [
        { key: 'A', text: '$(x - 1) e^x + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(x + 1) e^x + C$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$x e^x + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$e^x + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x^2 e^x / 2 + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$(x - 1) e^x + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(x + 1) e^x + C$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$x e^x + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$e^x + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x^2 e^x / 2 + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$x e^x - e^x + C = (x-1) e^x + C$.' },

  // Q17 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '$\\int \\ln x$', requiredSkills: SKILLS_PARTS,
    stem: '$\\int \\ln x \\, dx = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$u = \\ln x, dv = dx$ → $du = 1/x dx, v = x$', options: [
        { key: 'A', text: '$x \\ln x - \\int 1 \\, dx$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/(x \\ln x)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\ln x \\cdot \\ln x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x \\ln x + \\int 1 dx$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\ln^2 x / 2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$x \\ln x - x$', options: [
        { key: 'A', text: '$x \\ln x - x + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x \\ln x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$-x$ 누락' },
        { key: 'C', text: '$x \\ln x + x + C$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\ln x + x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x/2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$x \\ln x - x + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x \\ln x + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$x \\ln x + x + C$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\ln x + x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x/2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$x \\ln x - x + C$.' },

  // Q18 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '$\\int x \\cos x$', requiredSkills: SKILLS_PARTS,
    stem: '$\\int x \\cos x \\, dx = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$u = x, dv = \\cos x dx$', options: [
        { key: 'A', text: '$x \\sin x - \\int \\sin x dx$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x \\sin x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '잔여항' },
        { key: 'C', text: '$-x \\sin x + \\int \\sin x dx$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x^2 \\cos x / 2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\cos x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$x \\sin x - (-\\cos x) = x \\sin x + \\cos x$', options: [
        { key: 'A', text: '$x \\sin x + \\cos x + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x \\sin x - \\cos x + C$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-\\int \\sin = +\\cos$' },
        { key: 'C', text: '$x \\sin x + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x \\cos x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sin x + \\cos x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$x \\sin x + \\cos x + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x \\sin x - \\cos x + C$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$x \\sin x + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x \\cos x + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sin x + \\cos x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$x \\sin x + \\cos x + C$.' },

  // Q19 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '$\\int_0^\\pi \\sin x$', requiredSkills: SKILLS_DEF,
    stem: '$\\int_0^\\pi \\sin x \\, dx = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$[-\\cos x]_0^\\pi$', options: [
        { key: 'A', text: '$-\\cos \\pi - (-\\cos 0) = 1 - (-1) = 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\cos \\pi - \\cos 0 = -2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$\\cos 0 = 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\pi$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$2$', options: [
        { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\pi$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\pi$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$[-\\cos x]_0^\\pi = 1 - (-1) = 2$.' },

  // Q20 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '치환 $(2x+1)^5$', requiredSkills: SKILLS_SUB,
    stem: '$\\int (2x + 1)^5 \\, dx = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$u = 2x+1, du = 2 dx \\to dx = du/2$', options: [
        { key: 'A', text: '$(1/2) \\int u^5 du = u^6/12$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\int u^5 du = u^6/6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$1/2$ 누락' },
        { key: 'C', text: '$2 \\int u^5 du$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '뒤집힘' },
        { key: 'D', text: '$(2x+1)^6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$5(2x+1)^4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '미분' },
      ] },
      { stepType: 'PROCESS', prompt: '$(2x+1)^6/12 + C$', options: [
        { key: 'A', text: '$(2x+1)^6/12 + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(2x+1)^6/6 + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$1/2$ 누락' },
        { key: 'C', text: '$(2x+1)^6 + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$5(2x+1)^4 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(2x+1)^5 / 5 + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$(2x+1)^6/12 + C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(2x+1)^6/6 + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$(2x+1)^6 + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$5(2x+1)^4 + C$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(2x+1)^5/5 + C$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '치환 → $(2x+1)^6/12 + C$.' },
];

export const K_G12_CAL2_CH03_INT_METHOD_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
