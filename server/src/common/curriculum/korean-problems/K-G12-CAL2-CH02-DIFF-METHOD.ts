/**
 * K-G12-CAL2-CH02-DIFF-METHOD (여러 함수 미분) — 20문제 3-step Mastery.
 * 고3 미적분Ⅱ — 삼각함수 미분 ($\sin, \cos, \tan$) → 지수·로그 ($e^x, \ln x$) →
 *   합성함수 (Chain rule $f^{\prime}(g) g^{\prime}$) → 곱·몫 미분 →
 *   매개변수 미분 → 음함수 미분 → 역함수 미분.
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 * 주요 errorCode:
 *   FORMULA_SELECTION_ERROR 8 / ALGEBRA_ERROR 6
 *   CONCEPT_MISUNDERSTANDING 4 / SIGN_ERROR 2
 *
 * LaTeX prime 은 `^{\prime}` 으로 표기.
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G12-CAL2-CH02-DIFF-METHOD';
const SKILLS_TRIG = ['trig_derivative'];
const SKILLS_EXP = ['exponential_derivative'];
const SKILLS_LOG = ['logarithm_derivative'];
const SKILLS_CHAIN = ['chain_rule'];
const SKILLS_PRODUCT = ['product_rule'];
const SKILLS_QUOTIENT = ['quotient_rule'];
const SKILLS_PARAM = ['parametric_derivative'];
const SKILLS_IMPLICIT = ['implicit_derivative'];
const SKILLS_INV = ['inverse_function_derivative'];

const problems: KoreanProblemSeed[] = [
  // Q1
  { chapterCode: CODE, difficulty: 'easy', concept: '$(\\sin x)^{\\prime}$', requiredSkills: SKILLS_TRIG,
    stem: '$(\\sin x)^{\\prime} = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: 'sin 미분', options: [
        { key: 'A', text: '$\\cos x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-\\cos x$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$-\\sin x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$(\\cos x)^{\\prime}$' },
        { key: 'D', text: '$\\sin x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\tan x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\cos x$', options: [
        { key: 'A', text: '$\\cos x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-\\cos x$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$-\\sin x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\sin x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\tan x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$\\cos x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-\\cos x$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$-\\sin x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\sin x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\tan x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(\\sin x)^{\\prime} = \\cos x$.' },

  // Q2
  { chapterCode: CODE, difficulty: 'easy', concept: '$(\\cos x)^{\\prime}$', requiredSkills: SKILLS_TRIG,
    stem: '$(\\cos x)^{\\prime} = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: 'cos 미분 (부호 주의)', options: [
        { key: 'A', text: '$-\\sin x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sin x$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$\\cos x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$-\\cos x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\tan x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$-\\sin x$', options: [
        { key: 'A', text: '$-\\sin x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sin x$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$\\cos x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$-\\cos x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\tan x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$-\\sin x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sin x$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$\\cos x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$-\\cos x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\tan x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(\\cos x)^{\\prime} = -\\sin x$.' },

  // Q3
  { chapterCode: CODE, difficulty: 'easy', concept: '$(e^x)^{\\prime}$', requiredSkills: SKILLS_EXP,
    stem: '$(e^x)^{\\prime} = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '자연지수 미분 특별', options: [
        { key: 'A', text: '$e^x$ (자기 자신)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x e^{x-1}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$x^n$ 적용' },
        { key: 'C', text: '$e^{x-1}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$e^x$', options: [
        { key: 'A', text: '$e^x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x e^{x-1}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$e^{x-1}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$e^x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x e^{x-1}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$e^{x-1}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(e^x)^{\\prime} = e^x$.' },

  // Q4
  { chapterCode: CODE, difficulty: 'easy', concept: '$(\\ln x)^{\\prime}$', requiredSkills: SKILLS_LOG,
    stem: '$(\\ln x)^{\\prime} = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '자연로그 미분', options: [
        { key: 'A', text: '$1/x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\ln x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$1/(x \\ln a)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\log_a$' },
        { key: 'D', text: '$x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$e^x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$1/x$', options: [
        { key: 'A', text: '$1/x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\ln x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$1/(x \\ln a)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$e^x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$1/x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\ln x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$1/(x \\ln a)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$e^x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(\\ln x)^{\\prime} = 1/x$.' },

  // Q5
  { chapterCode: CODE, difficulty: 'easy', concept: '$(\\tan x)^{\\prime}$', requiredSkills: SKILLS_TRIG,
    stem: '$(\\tan x)^{\\prime} = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\sin/\\cos$ 의 몫', options: [
        { key: 'A', text: '$\\sec^2 x = 1/\\cos^2 x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sin x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\cos x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$-\\cot x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sin^2 x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\sec^2 x$', options: [
        { key: 'A', text: '$\\sec^2 x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sin x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\cos x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1/\\sin x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\tan x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$\\sec^2 x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sin x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\cos x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\tan x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$-\\csc^2 x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(\\tan x)^{\\prime} = \\sec^2 x$.' },

  // Q6
  { chapterCode: CODE, difficulty: 'easy', concept: '체인 룰', requiredSkills: SKILLS_CHAIN,
    stem: '합성함수 미분 공식?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$(f \\circ g)^{\\prime}$', options: [
        { key: 'A', text: '$f^{\\prime}(g(x)) \\cdot g^{\\prime}(x)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$f^{\\prime}(x) g^{\\prime}(x)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱 미분' },
        { key: 'C', text: '$f^{\\prime}(g(x))$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$g^{\\prime}$ 누락' },
        { key: 'D', text: '$f(g^{\\prime}(x))$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$f^{\\prime}(x) + g^{\\prime}(x)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합 미분' },
      ] },
      { stepType: 'PROCESS', prompt: '$f^{\\prime}(g(x)) g^{\\prime}(x)$', options: [
        { key: 'A', text: '$f^{\\prime}(g(x)) g^{\\prime}(x)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$f^{\\prime}(x) g(x)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$f(x) g^{\\prime}(x)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$f(g(x))$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$f^{\\prime}(g(x))$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$f^{\\prime}(g(x)) g^{\\prime}(x)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$f^{\\prime}(x) g^{\\prime}(x)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$f^{\\prime}(g(x))$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$f^{\\prime}(x) + g^{\\prime}(x)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$f(g^{\\prime}(x))$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(f \\circ g)^{\\prime} = f^{\\prime}(g(x)) g^{\\prime}(x)$.' },

  // Q7
  { chapterCode: CODE, difficulty: 'medium', concept: '$(\\sin 2x)^{\\prime}$', requiredSkills: SKILLS_CHAIN,
    stem: '$(\\sin 2x)^{\\prime} = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '체인: $\\cos(2x) \\cdot (2x)^{\\prime}$', options: [
        { key: 'A', text: '$2 \\cos 2x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\cos 2x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '체인 안 함' },
        { key: 'C', text: '$-2 \\sin 2x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2 \\sin 2x$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sin 2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\cos 2x \\cdot 2$', options: [
        { key: 'A', text: '$2 \\cos 2x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\cos 2x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\cos 2 \\cdot x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2x \\cos 2x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$-\\sin 2x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$2 \\cos 2x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\cos 2x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$-2 \\sin 2x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2x \\cos 2x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\cos 2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\cos(2x) \\cdot 2 = 2 \\cos 2x$.' },

  // Q8
  { chapterCode: CODE, difficulty: 'medium', concept: '$(e^{2x})^{\\prime}$', requiredSkills: SKILLS_CHAIN,
    stem: '$(e^{2x})^{\\prime} = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '체인: $e^{2x} \\cdot (2x)^{\\prime}$', options: [
        { key: 'A', text: '$2 e^{2x}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$e^{2x}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '체인 안 함' },
        { key: 'C', text: '$2x e^{2x}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$e^{2x-1}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$e^{2x} \\cdot 2$', options: [
        { key: 'A', text: '$2 e^{2x}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$e^{2x}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2x e^{2x}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$e^{2x-1}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$2 e^{2x}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$e^{2x}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2x e^{2x}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$e^{2x-1}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$2 e^{2x}$.' },

  // Q9
  { chapterCode: CODE, difficulty: 'medium', concept: '$(\\ln 2x)^{\\prime}$', requiredSkills: SKILLS_CHAIN,
    stem: '$(\\ln 2x)^{\\prime} = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '체인: $(1/(2x)) \\cdot 2$', options: [
        { key: 'A', text: '$2/(2x) = 1/x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/(2x)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '체인 안 함' },
        { key: 'C', text: '$2/x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\ln 2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$1/x$', options: [
        { key: 'A', text: '$1/x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/(2x)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2/x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\ln 2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$1/x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/(2x)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2/x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\ln 2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(1/(2x)) \\cdot 2 = 1/x$.' },

  // Q10
  { chapterCode: CODE, difficulty: 'medium', concept: '$(x^2 \\sin x)^{\\prime}$', requiredSkills: SKILLS_PRODUCT,
    stem: '$(x^2 \\sin x)^{\\prime} = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '곱 미분: $(fg)^{\\prime} = f^{\\prime} g + f g^{\\prime}$', options: [
        { key: 'A', text: '$2x \\sin x + x^2 \\cos x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2x \\cos x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '한쪽만' },
        { key: 'C', text: '$x^2 \\cos x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(x^2)^{\\prime} (\\sin x)^{\\prime}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱 규칙 잘못' },
        { key: 'E', text: '$2x \\sin x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$2x \\sin x + x^2 \\cos x$', options: [
        { key: 'A', text: '$2x \\sin x + x^2 \\cos x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2x \\cos x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$x^2 \\cos x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2x \\sin x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x \\cos x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$2x \\sin x + x^2 \\cos x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2x \\cos x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$x^2 \\cos x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2x \\sin x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x \\cos x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(fg)^{\\prime} = f^{\\prime} g + f g^{\\prime} = 2x \\sin x + x^2 \\cos x$.' },

  // Q11
  { chapterCode: CODE, difficulty: 'medium', concept: '$(\\sin x / x)^{\\prime}$', requiredSkills: SKILLS_QUOTIENT,
    stem: '$(\\sin x / x)^{\\prime} = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '몫 미분: $(f/g)^{\\prime} = (f^{\\prime} g - f g^{\\prime})/g^2$', options: [
        { key: 'A', text: '$(x \\cos x - \\sin x)/x^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\cos x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$(\\cos x)/x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(\\sin x - x \\cos x)/x^2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'E', text: '$\\cos x / x^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$(x \\cos x - \\sin x)/x^2$', options: [
        { key: 'A', text: '$(x \\cos x - \\sin x)/x^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\cos x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\cos x / x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(\\sin x - x \\cos x)/x^2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\cos x / x^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$(x \\cos x - \\sin x)/x^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\cos x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\cos x / x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(\\sin x - x \\cos x)/x^2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\cos x / x^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(f/g)^{\\prime} = (f^{\\prime} g - f g^{\\prime})/g^2$.' },

  // Q12
  { chapterCode: CODE, difficulty: 'medium', concept: '$((x+1)^3)^{\\prime}$', requiredSkills: SKILLS_CHAIN,
    stem: '$((x + 1)^3)^{\\prime} = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '체인: $3(x+1)^2 \\cdot 1$', options: [
        { key: 'A', text: '$3(x+1)^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(x+1)^2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$3(x+1)^3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$3x^2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '체인 무시' },
        { key: 'E', text: '$x^3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$3(x+1)^2$', options: [
        { key: 'A', text: '$3(x+1)^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(x+1)^2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$3(x+1)^3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$3x^2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x^3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$3(x+1)^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(x+1)^2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$3(x+1)^3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$3x^2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x^3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$3(x+1)^2$.' },

  // Q13
  { chapterCode: CODE, difficulty: 'medium', concept: '$(\\sin^2 x)^{\\prime}$', requiredSkills: SKILLS_CHAIN,
    stem: '$(\\sin^2 x)^{\\prime} = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$2 \\sin x \\cdot (\\sin x)^{\\prime}$', options: [
        { key: 'A', text: '$2 \\sin x \\cos x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2 \\sin x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '체인' },
        { key: 'C', text: '$\\cos^2 x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2 \\cos x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sin x \\cos x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$2$ 누락' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\sin 2x$ (이중각)', options: [
        { key: 'A', text: '$2 \\sin x \\cos x = \\sin 2x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2 \\sin x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\cos^2 x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2 \\cos x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$-\\sin 2x$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$2 \\sin x \\cos x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2 \\sin x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\cos^2 x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2 \\cos x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$-\\sin 2x$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$2 \\sin x \\cos x = \\sin 2x$.' },

  // Q14
  { chapterCode: CODE, difficulty: 'medium', concept: '$(e^{x^2})^{\\prime}$', requiredSkills: SKILLS_CHAIN,
    stem: '$(e^{x^2})^{\\prime} = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$e^{x^2} \\cdot (x^2)^{\\prime}$', options: [
        { key: 'A', text: '$2x \\cdot e^{x^2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$e^{x^2}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '체인 안 함' },
        { key: 'C', text: '$x^2 e^{x^2 - 1}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2 e^{x^2}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$e^{2x}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$2x e^{x^2}$', options: [
        { key: 'A', text: '$2x e^{x^2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$e^{x^2}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2 e^{x^2}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x^2 e^{x^2-1}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$e^{2x}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$2x e^{x^2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$e^{x^2}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2 e^{x^2}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x^2 e^{x^2-1}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$e^{2x}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$2x e^{x^2}$.' },

  // Q15
  { chapterCode: CODE, difficulty: 'medium', concept: '$(\\ln(x^2+1))^{\\prime}$', requiredSkills: SKILLS_CHAIN,
    stem: '$(\\ln(x^2 + 1))^{\\prime} = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$(1/(x^2+1)) \\cdot (x^2+1)^{\\prime}$', options: [
        { key: 'A', text: '$2x / (x^2 + 1)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/(x^2+1)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '체인 안 함' },
        { key: 'C', text: '$2x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\ln(2x)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1/(2x)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$2x/(x^2+1)$', options: [
        { key: 'A', text: '$2x/(x^2+1)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/(x^2+1)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\ln(2x)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1/(2x)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$2x/(x^2+1)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/(x^2+1)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\ln(2x)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1/(2x)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$2x/(x^2+1)$.' },

  // Q16 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '매개변수 미분', requiredSkills: SKILLS_PARAM,
    stem: '$x = t^2, y = t^3$. $dy/dx$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$(dy/dt)/(dx/dt)$', options: [
        { key: 'A', text: '$3t^2 / 2t$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2t / 3t^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '뒤집힘' },
        { key: 'C', text: '$3t^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$t^3/t^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '미분 안 함' },
        { key: 'E', text: '$3t$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$3t^2/(2t) = 3t/2$', options: [
        { key: 'A', text: '$3t/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3t^2/(2t)$ (단순화 전)', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '단순화 안 함' },
        { key: 'C', text: '$3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$t$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2/3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$3t/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2t/3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$t$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$3t^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$dy/dx = (3t^2)/(2t) = 3t/2$.' },

  // Q17 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '음함수 미분', requiredSkills: SKILLS_IMPLICIT,
    stem: '$x^2 + y^2 = 1$. $dy/dx$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '양변 미분', options: [
        { key: 'A', text: '$2x + 2y (dy/dx) = 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2x + 2y = 0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$y$ 함수 처리' },
        { key: 'C', text: '$x^2 + y^2$ 그대로', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '미분 안 함' },
        { key: 'D', text: '$0 = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$x = y$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$dy/dx = -x/y$', options: [
        { key: 'A', text: '$-x/y$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x/y$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$-y/x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '뒤집힘' },
        { key: 'D', text: '$x^2/y^2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$-2x/2y$ 단순화 안 함', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$-x/y$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x/y$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$-y/x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x^2/y^2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$2x + 2y y^{\\prime} = 0 \\Rightarrow y^{\\prime} = -x/y$.' },

  // Q18 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '역함수 미분', requiredSkills: SKILLS_INV,
    stem: '$f(x) = x^3$. $(f^{-1})^{\\prime}(8) = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$(f^{-1})^{\\prime}(b) = 1/f^{\\prime}(a)$ where $f(a) = b$', options: [
        { key: 'A', text: '$f^{-1}(8) = 2$, $f^{\\prime}(2) = 12$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$f^{\\prime}(8) = 192$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$f^{\\prime}$ 자체' },
        { key: 'C', text: '$f^{-1}(8)$ 만 구함', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$8$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$1/12$', options: [
        { key: 'A', text: '$1/12$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$12$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '역수 누락' },
        { key: 'C', text: '$1/3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$f^{-1}(8)$' },
        { key: 'E', text: '$1/192$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$1/12$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$12$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$1/3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$1/192$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$f^{-1}(8) = 2, f^{\\prime}(2) = 12 \\Rightarrow (f^{-1})^{\\prime}(8) = 1/12$.' },

  // Q19 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '$\\sin(\\cos x)$', requiredSkills: SKILLS_CHAIN,
    stem: '$(\\sin(\\cos x))^{\\prime} = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '체인 두 번', options: [
        { key: 'A', text: '$\\cos(\\cos x) \\cdot (-\\sin x)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\cos(\\sin x)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\sin(-\\sin x)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\cos(\\cos x)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '체인 안 함' },
        { key: 'E', text: '$-\\sin x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$-\\sin x \\cdot \\cos(\\cos x)$', options: [
        { key: 'A', text: '$-\\sin x \\cos(\\cos x)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sin x \\cos(\\cos x)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\cos(\\cos x)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$-\\sin(\\cos x) \\sin x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '외 미분 잘못' },
        { key: 'E', text: '$\\cos x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$-\\sin x \\cos(\\cos x)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sin x \\cos(\\cos x)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\cos(\\cos x)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$-\\sin(\\cos x) \\sin x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\cos x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\cos(\\cos x) \\cdot (-\\sin x) = -\\sin x \\cos(\\cos x)$.' },

  // Q20 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '$(x \\ln x)^{\\prime}$', requiredSkills: SKILLS_PRODUCT,
    stem: '$(x \\ln x)^{\\prime} = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '곱 미분', options: [
        { key: 'A', text: '$\\ln x + x \\cdot 1/x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1 \\cdot 1/x = 1/x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱 규칙 잘못' },
        { key: 'C', text: '$\\ln x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '한쪽만' },
        { key: 'D', text: '$x \\cdot 1/x = 1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '한쪽만' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\ln x + 1$', options: [
        { key: 'A', text: '$\\ln x + 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\ln x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$1/x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x \\ln x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$\\ln x + 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\ln x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$1/x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x \\ln x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$1 \\cdot \\ln x + x \\cdot 1/x = \\ln x + 1$.' },
];

export const K_G12_CAL2_CH02_DIFF_METHOD_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
