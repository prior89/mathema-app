/**
 * K-G12-CAL2-CH02-DIFF-METHOD — STUDY pool (single-step, 20문제).
 * 여러 가지 미분법 — 삼각/지수/로그 미분, 체인룰, 곱·몫, 매개변수, 음함수, 역함수.
 * Mastery 3-step과 별도 변형 문제. 고3 미적분Ⅱ (G12).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5. LLM 미사용.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G12-CAL2-CH02-DIFF-METHOD';
const SKILLS_TRIG = ['trig_derivative'];
const SKILLS_EXP = ['exponential_derivative'];
const SKILLS_LOG = ['logarithm_derivative'];
const SKILLS_CHAIN = ['chain_rule'];
const SKILLS_PRODUCT = ['product_rule'];
const SKILLS_QUOTIENT = ['quotient_rule'];
const SKILLS_PARAM = ['parametric_derivative'];
const SKILLS_IMPLICIT = ['implicit_derivative'];
const SKILLS_INV = ['inverse_derivative'];
const SKILLS_CONST = ['constant_derivative'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) (-sin x)'
  { chapterCode: CODE, difficulty: 'easy', concept: '$(-\\sin x)^{\\prime}$', requiredSkills: SKILLS_TRIG,
    stem: '$(-\\sin x)^{\\prime} = ?$',
    options: [
      { key: 'A', text: '$-\\cos x$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\cos x$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'C', text: '$\\sin x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$(\\cos x)^{\\prime}$' },
      { key: 'D', text: '$-\\sin x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원함수' },
      { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$(\\sin x)^{\\prime} = \\cos x$. 부호 유지: $(-\\sin x)^{\\prime} = -\\cos x$.' },

  // S2 (쉬움) (5 sin x)'
  { chapterCode: CODE, difficulty: 'easy', concept: '$(5 \\sin x)^{\\prime}$', requiredSkills: SKILLS_TRIG,
    stem: '$(5 \\sin x)^{\\prime} = ?$',
    options: [
      { key: 'A', text: '$5 \\cos x$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\cos x$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$5$ 누락' },
      { key: 'C', text: '$5 \\sin x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원함수' },
      { key: 'D', text: '$-5 \\cos x$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'E', text: '$5 \\sin x \\cos x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곱 미분' },
    ],
    solution: '상수배 그대로: $5 \\cos x$.' },

  // S3 (쉬움) (2eˣ)'
  { chapterCode: CODE, difficulty: 'easy', concept: '$(2e^x)^{\\prime}$', requiredSkills: SKILLS_EXP,
    stem: '$(2 e^x)^{\\prime} = ?$',
    options: [
      { key: 'A', text: '$2 e^x$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$e^x$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$2$ 누락' },
      { key: 'C', text: '$2 x e^{x-1}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x^n$ 룰' },
      { key: 'D', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$e^x \\to 1$' },
      { key: 'E', text: '$2 \\ln x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$(e^x)^{\\prime} = e^x$. 상수배 그대로.' },

  // S4 (쉬움) (3 ln x)'
  { chapterCode: CODE, difficulty: 'easy', concept: '$(3 \\ln x)^{\\prime}$', requiredSkills: SKILLS_LOG,
    stem: '$(3 \\ln x)^{\\prime} = ?$',
    options: [
      { key: 'A', text: '$\\dfrac{3}{x}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{1}{x}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$3$ 누락' },
      { key: 'C', text: '$3 \\ln x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원함수' },
      { key: 'D', text: '$\\dfrac{3}{\\ln x}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$3 x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$(\\ln x)^{\\prime} = \\dfrac{1}{x}$. 상수배 → $\\dfrac{3}{x}$.' },

  // S5 (쉬움) (e²)' (상수)
  { chapterCode: CODE, difficulty: 'easy', concept: '$(e^2)^{\\prime}$', requiredSkills: SKILLS_CONST,
    stem: '$(e^2)^{\\prime} = ?$',
    options: [
      { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$e^2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$(e^x)^{\\prime}$ 와 혼동' },
      { key: 'C', text: '$2 e$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$(x^n)$ 룰' },
      { key: 'D', text: '$2 e^2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '정의 X', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '정의됨' },
    ],
    solution: '$e^2$ 는 상수. 상수 미분 = $0$.' },

  // S6 (쉬움) 체인룰 식
  { chapterCode: CODE, difficulty: 'easy', concept: '체인룰 공식', requiredSkills: SKILLS_CHAIN,
    stem: '$\\dfrac{d}{dx} f(g(x)) = ?$',
    options: [
      { key: 'A', text: '$f^{\\prime}(g(x)) \\cdot g^{\\prime}(x)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$f^{\\prime}(g(x))$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$g^{\\prime}$ 누락' },
      { key: 'C', text: '$f^{\\prime}(x) \\cdot g^{\\prime}(x)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곱 미분' },
      { key: 'D', text: '$f(g^{\\prime}(x))$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$g^{\\prime}(f(x)) \\cdot f^{\\prime}(x)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '순서 잘못' },
    ],
    solution: '체인룰: 바깥 미분 $\\times$ 안 미분.' },

  // S7 (중) (cos 3x)'
  { chapterCode: CODE, difficulty: 'medium', concept: '$(\\cos 3x)^{\\prime}$', requiredSkills: SKILLS_CHAIN,
    stem: '$(\\cos 3x)^{\\prime} = ?$',
    options: [
      { key: 'A', text: '$-3 \\sin 3x$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3 \\sin 3x$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'C', text: '$-\\sin 3x$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '체인 누락' },
      { key: 'D', text: '$-\\sin 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$3 \\cos 3x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$-\\sin 3x \\cdot 3 = -3 \\sin 3x$.' },

  // S8 (중) (e^(-x))'
  { chapterCode: CODE, difficulty: 'medium', concept: '$(e^{-x})^{\\prime}$', requiredSkills: SKILLS_CHAIN,
    stem: '$(e^{-x})^{\\prime} = ?$',
    options: [
      { key: 'A', text: '$-e^{-x}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$e^{-x}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'C', text: '$-x e^{-x-1}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x^n$ 룰' },
      { key: 'D', text: '$-e^x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$x e^{-x}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$e^{-x} \\cdot (-1) = -e^{-x}$.' },

  // S9 (중) (ln 3x)'
  { chapterCode: CODE, difficulty: 'medium', concept: '$(\\ln 3x)^{\\prime}$', requiredSkills: SKILLS_CHAIN,
    stem: '$(\\ln 3x)^{\\prime} = ?$',
    options: [
      { key: 'A', text: '$\\dfrac{1}{x}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{3}{x}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '체인 잘못' },
      { key: 'C', text: '$\\dfrac{1}{3x}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '체인 누락' },
      { key: 'D', text: '$3 \\ln x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$\\dfrac{1}{x} + \\ln 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\ln 3$ 는 상수, 더하지 X' },
    ],
    solution: '$\\dfrac{1}{3x} \\cdot 3 = \\dfrac{1}{x}$. (또는 $\\ln 3x = \\ln 3 + \\ln x$ 로 분리.)' },

  // S10 (중) (x sin x)'
  { chapterCode: CODE, difficulty: 'medium', concept: '$(x \\sin x)^{\\prime}$', requiredSkills: SKILLS_PRODUCT,
    stem: '$(x \\sin x)^{\\prime} = ?$',
    options: [
      { key: 'A', text: '$\\sin x + x \\cos x$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x \\cos x$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '첫 항 누락' },
      { key: 'C', text: '$\\sin x$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '둘째 항 누락' },
      { key: 'D', text: '$\\cos x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$\\sin x - x \\cos x$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
    ],
    solution: '곱 미분: $1 \\cdot \\sin x + x \\cdot \\cos x$.' },

  // S11 (중) (cos x / x)'
  { chapterCode: CODE, difficulty: 'medium', concept: '$(\\cos x / x)^{\\prime}$', requiredSkills: SKILLS_QUOTIENT,
    stem: '$\\left( \\dfrac{\\cos x}{x} \\right)^{\\prime} = ?$',
    options: [
      { key: 'A', text: '$\\dfrac{-x \\sin x - \\cos x}{x^2}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{-x \\sin x + \\cos x}{x^2}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '둘째 항 부호' },
      { key: 'C', text: '$\\dfrac{-\\sin x}{1}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '몫 미분 누락' },
      { key: 'D', text: '$\\dfrac{x \\sin x - \\cos x}{x^2}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '첫 항 부호' },
      { key: 'E', text: '$\\dfrac{-\\sin x}{x}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '몫 미분: $\\dfrac{(-\\sin x) \\cdot x - \\cos x \\cdot 1}{x^2} = \\dfrac{-x \\sin x - \\cos x}{x^2}$.' },

  // S12 (중) ((x-1)⁴)'
  { chapterCode: CODE, difficulty: 'medium', concept: '$((x - 1)^4)^{\\prime}$', requiredSkills: SKILLS_CHAIN,
    stem: '$((x - 1)^4)^{\\prime} = ?$',
    options: [
      { key: 'A', text: '$4 (x - 1)^3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(x - 1)^3$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '계수 누락' },
      { key: 'C', text: '$4 (x - 1)^4$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '지수 그대로' },
      { key: 'D', text: '$4 x^3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '체인 무시' },
      { key: 'E', text: '$4 (x - 1)^3 - 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$4(x - 1)^3 \\cdot 1 = 4(x - 1)^3$.' },

  // S13 (중) (cos²x)'
  { chapterCode: CODE, difficulty: 'medium', concept: '$(\\cos^2 x)^{\\prime}$', requiredSkills: SKILLS_CHAIN,
    stem: '$(\\cos^2 x)^{\\prime} = ?$',
    options: [
      { key: 'A', text: '$-2 \\sin x \\cos x$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$2 \\sin x \\cos x$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'C', text: '$2 \\cos x$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '안 미분 누락' },
      { key: 'D', text: '$-2 \\cos x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$-\\sin x \\cos x$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$2$ 누락' },
    ],
    solution: '$2 \\cos x \\cdot (-\\sin x) = -2 \\sin x \\cos x = -\\sin 2x$.' },

  // S14 (중) (e^(3x²))'
  { chapterCode: CODE, difficulty: 'medium', concept: '$(e^{3x^2})^{\\prime}$', requiredSkills: SKILLS_CHAIN,
    stem: '$(e^{3x^2})^{\\prime} = ?$',
    options: [
      { key: 'A', text: '$6 x e^{3x^2}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$e^{3x^2}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '체인 누락' },
      { key: 'C', text: '$6x$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$e$ 누락' },
      { key: 'D', text: '$3 x^2 e^{3x^2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '안 미분 잘못' },
      { key: 'E', text: '$2x e^{3x^2}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$3$ 누락' },
    ],
    solution: '$e^{3x^2} \\cdot (3x^2)^{\\prime} = e^{3x^2} \\cdot 6x$.' },

  // S15 (중) (ln(x³))'
  { chapterCode: CODE, difficulty: 'medium', concept: '$(\\ln x^3)^{\\prime}$', requiredSkills: SKILLS_CHAIN,
    stem: '$(\\ln (x^3))^{\\prime} = ?$ ($x > 0$)',
    options: [
      { key: 'A', text: '$\\dfrac{3}{x}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{1}{x^3}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '체인 누락' },
      { key: 'C', text: '$\\dfrac{3 x^2}{x^3}$ $= \\dfrac{3}{x}$ (같은 답)', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '미완 (단순화 X)' },
      { key: 'D', text: '$3 \\ln x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원함수 정리' },
      { key: 'E', text: '$\\dfrac{1}{3x}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$\\dfrac{1}{x^3} \\cdot 3x^2 = \\dfrac{3}{x}$. (또는 $\\ln x^3 = 3 \\ln x$ → $\\dfrac{3}{x}$.)' },

  // S16 (어려움) 매개변수 미분
  { chapterCode: CODE, difficulty: 'hard', concept: '매개변수 ($x = t^3, y = t^2$)', requiredSkills: SKILLS_PARAM,
    stem: '$x = t^3, y = t^2$. $\\dfrac{dy}{dx} = ?$',
    options: [
      { key: 'A', text: '$\\dfrac{2}{3t}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{3t}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '뒤집음' },
      { key: 'C', text: '$\\dfrac{2t}{3t^2}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '단순화 X' },
      { key: 'D', text: '$\\dfrac{2t}{3}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'E', text: '$\\dfrac{1}{t}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '$\\dfrac{dy/dt}{dx/dt} = \\dfrac{2t}{3t^2} = \\dfrac{2}{3t}$.' },

  // S17 (어려움) 음함수 미분
  { chapterCode: CODE, difficulty: 'hard', concept: '음함수 ($x^2 + y^2 = 4$)', requiredSkills: SKILLS_IMPLICIT,
    stem: '$x^2 + y^2 = 4$. $\\dfrac{dy}{dx} = ?$',
    options: [
      { key: 'A', text: '$-\\dfrac{x}{y}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{x}{y}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'C', text: '$-\\dfrac{2x}{2y}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '단순화 X' },
      { key: 'D', text: '$-x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$y$ 누락' },
      { key: 'E', text: '$\\dfrac{y}{x}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '뒤집음' },
    ],
    solution: '양변 $x$ 미분: $2x + 2y \\dfrac{dy}{dx} = 0$. $\\dfrac{dy}{dx} = -\\dfrac{x}{y}$.' },

  // S18 (어려움) 역함수 미분
  { chapterCode: CODE, difficulty: 'hard', concept: '역함수 ($f(x) = x^2$ at $4$)', requiredSkills: SKILLS_INV,
    stem: '$f(x) = x^2$ ($x > 0$). $(f^{-1})^{\\prime}(4) = ?$',
    options: [
      { key: 'A', text: '$\\dfrac{1}{4}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$f^{\\prime}(2)$' },
      { key: 'C', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'D', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$\\dfrac{1}{16}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '$f(2) = 4$. $f^{\\prime}(x) = 2x, f^{\\prime}(2) = 4$. $(f^{-1})^{\\prime}(4) = \\dfrac{1}{f^{\\prime}(2)} = \\dfrac{1}{4}$.' },

  // S19 (어려움) (sin(2x²))'
  { chapterCode: CODE, difficulty: 'hard', concept: '$(\\sin(2x^2))^{\\prime}$', requiredSkills: SKILLS_CHAIN,
    stem: '$(\\sin(2x^2))^{\\prime} = ?$',
    options: [
      { key: 'A', text: '$4 x \\cos(2x^2)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\cos(2x^2)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '체인 누락' },
      { key: 'C', text: '$4 x \\sin(2x^2)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '바깥 잘못' },
      { key: 'D', text: '$2 x \\cos(2x^2)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '안 미분 $4x$' },
      { key: 'E', text: '$\\cos(4x)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$\\cos(2x^2) \\cdot (2x^2)^{\\prime} = \\cos(2x^2) \\cdot 4x$.' },

  // S20 (어려움) (x²ln x)'
  { chapterCode: CODE, difficulty: 'hard', concept: '$(x^2 \\ln x)^{\\prime}$', requiredSkills: SKILLS_PRODUCT,
    stem: '$(x^2 \\ln x)^{\\prime} = ?$ ($x > 0$)',
    options: [
      { key: 'A', text: '$2 x \\ln x + x$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$2 x \\ln x$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '둘째 항 누락' },
      { key: 'C', text: '$x$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '첫째 항 누락' },
      { key: 'D', text: '$\\dfrac{2x}{x}$ $= 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '몫 미분 오용' },
      { key: 'E', text: '$2 x \\ln x + x^2 \\cdot x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$(\\ln x)^{\\prime} = 1/x$' },
    ],
    solution: '곱 미분: $2x \\cdot \\ln x + x^2 \\cdot \\dfrac{1}{x} = 2x \\ln x + x$.' },
];

export const K_G12_CAL2_CH02_DIFF_METHOD_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
