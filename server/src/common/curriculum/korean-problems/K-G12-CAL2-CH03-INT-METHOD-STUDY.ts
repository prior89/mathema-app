/**
 * K-G12-CAL2-CH03-INT-METHOD — STUDY pool (single-step, 20문제).
 * 여러 가지 적분법 — 삼각/지수/로그 적분, 치환적분, 부분적분, 정적분.
 * Mastery 3-step과 별도 변형 문제. 고3 미적분Ⅱ (G12).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5. LLM 미사용.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G12-CAL2-CH03-INT-METHOD';
const SKILLS_TRIG = ['trig_integral'];
const SKILLS_EXP = ['exponential_integral'];
const SKILLS_LOG = ['logarithm_integral'];
const SKILLS_POWER = ['power_integral'];
const SKILLS_SUB = ['substitution'];
const SKILLS_PARTS = ['integration_by_parts'];
const SKILLS_DEF = ['definite_integral'];
const SKILLS_CONST_OF_INT = ['constant_of_integration'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) ∫(-sin x)
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\int (-\\sin x)$', requiredSkills: SKILLS_TRIG,
    stem: '$\\int (-\\sin x) \\, dx = ?$',
    options: [
      { key: 'A', text: '$\\cos x + C$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$-\\cos x + C$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'C', text: '$\\sin x + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\int \\cos x$' },
      { key: 'D', text: '$-\\sin x + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원함수' },
      { key: 'E', text: '$-\\cos x$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$+ C$ 누락' },
    ],
    solution: '$\\int \\sin x = -\\cos x + C$. 부호 반전: $\\int (-\\sin x) = \\cos x + C$.' },

  // S2 (쉬움) ∫(2 cos x)
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\int (2 \\cos x)$', requiredSkills: SKILLS_TRIG,
    stem: '$\\int 2 \\cos x \\, dx = ?$',
    options: [
      { key: 'A', text: '$2 \\sin x + C$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\sin x + C$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$2$ 누락' },
      { key: 'C', text: '$-2 \\sin x + C$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'D', text: '$2 \\cos x + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원함수' },
      { key: 'E', text: '$-2 \\sin x$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$+ C$ 누락' },
    ],
    solution: '상수배: $2 \\sin x + C$.' },

  // S3 (쉬움) ∫3eˣ
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\int 3 e^x$', requiredSkills: SKILLS_EXP,
    stem: '$\\int 3 e^x \\, dx = ?$',
    options: [
      { key: 'A', text: '$3 e^x + C$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$e^x + C$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$3$ 누락' },
      { key: 'C', text: '$3 x e^x + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$\\dfrac{3 e^x}{x} + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$3 \\ln x + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$\\int e^x = e^x + C$. 상수배 그대로.' },

  // S4 (쉬움) ∫x^(-2)
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\int x^{-2}$', requiredSkills: SKILLS_POWER,
    stem: '$\\int x^{-2} \\, dx = ?$',
    options: [
      { key: 'A', text: '$-\\dfrac{1}{x} + C$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{1}{x} + C$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'C', text: '$\\dfrac{x^{-1}}{-1} = -\\dfrac{1}{x}$ 같은 표현 (미완)', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$+ C$ 누락' },
      { key: 'D', text: '$\\ln |x| + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\int 1/x$' },
      { key: 'E', text: '$-2 x^{-3} + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '미분' },
    ],
    solution: '$\\dfrac{x^{-1}}{-1} + C = -\\dfrac{1}{x} + C$. ($n = -2$ 거듭제곱 공식.)' },

  // S5 (쉬움) ∫1 dx
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\int 1 \\, dx$', requiredSkills: SKILLS_POWER,
    stem: '$\\int 1 \\, dx = ?$',
    options: [
      { key: 'A', text: '$x + C$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$1 + C$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$x$ 누락' },
      { key: 'C', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '미분' },
      { key: 'D', text: '$C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\int 0$' },
      { key: 'E', text: '$\\ln x + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$\\int 1 \\, dx = x + C$.' },

  // S6 (쉬움) +C 의미
  { chapterCode: CODE, difficulty: 'easy', concept: '$+ C$ 의미', requiredSkills: SKILLS_CONST_OF_INT,
    stem: '부정적분 결과에 $+ C$ 를 붙이는 이유?',
    options: [
      { key: 'A', text: '미분하면 같아지는 함수가 상수만큼 다를 수 있어서', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '관습적 표기일 뿐 의미는 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '의미 있음' },
      { key: 'C', text: '$C = 0$ 이 항상 옳음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '항상 $0$ 은 아님' },
      { key: 'D', text: '정적분에서도 항상 붙임', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부정적분만' },
      { key: 'E', text: '단위 변환을 위해', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '미분 결과가 같은 두 함수는 상수만큼 차이가 날 수 있음 → 적분 상수 $C$.' },

  // S7 (중) ∫sin 2x
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\int \\sin 2x$', requiredSkills: SKILLS_SUB,
    stem: '$\\int \\sin 2x \\, dx = ?$',
    options: [
      { key: 'A', text: '$-\\dfrac{1}{2} \\cos 2x + C$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{1}{2} \\cos 2x + C$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'C', text: '$-\\cos 2x + C$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$1/2$ 누락' },
      { key: 'D', text: '$-2 \\cos 2x + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$2$ 잘못' },
      { key: 'E', text: '$\\cos 2x + C$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
    ],
    solution: '$u = 2x$: $\\dfrac{-\\cos 2x}{2} + C$.' },

  // S8 (중) ∫e^(3x)
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\int e^{3x}$', requiredSkills: SKILLS_SUB,
    stem: '$\\int e^{3x} \\, dx = ?$',
    options: [
      { key: 'A', text: '$\\dfrac{1}{3} e^{3x} + C$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$e^{3x} + C$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$1/3$ 누락' },
      { key: 'C', text: '$3 e^{3x} + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '미분' },
      { key: 'D', text: '$\\dfrac{1}{3} e^{3x}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$+ C$ 누락' },
      { key: 'E', text: '$\\dfrac{e^{3x}}{x} + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$u = 3x$: $\\dfrac{e^{3x}}{3} + C$.' },

  // S9 (중) ∫3x² cos(x³)
  { chapterCode: CODE, difficulty: 'medium', concept: '치환 $u = x^3$', requiredSkills: SKILLS_SUB,
    stem: '$\\int 3 x^2 \\cos(x^3) \\, dx = ?$',
    options: [
      { key: 'A', text: '$\\sin(x^3) + C$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\sin(x^3) - C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$- C$ 도 부정 적분이지만 $+ C$ 표기 관례' },
      { key: 'C', text: '$3 \\sin(x^3) + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$3$ 잘못 곱' },
      { key: 'D', text: '$\\dfrac{\\sin(x^3)}{3} + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못 나눔' },
      { key: 'E', text: '$\\cos(x^3) + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원함수' },
    ],
    solution: '$u = x^3 \\to du = 3x^2 \\, dx$. $\\int \\cos u \\, du = \\sin u + C = \\sin(x^3) + C$.' },

  // S10 (중) ∫2x e^(x²)
  { chapterCode: CODE, difficulty: 'medium', concept: '치환 $u = x^2$', requiredSkills: SKILLS_SUB,
    stem: '$\\int 2 x e^{x^2} \\, dx = ?$',
    options: [
      { key: 'A', text: '$e^{x^2} + C$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{1}{2} e^{x^2} + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '보정 잘못' },
      { key: 'C', text: '$x^2 e^{x^2} + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$2 x e^{x^2} + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원함수' },
      { key: 'E', text: '$e^x + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$u = x^2 \\to du = 2x \\, dx$. $\\int e^u \\, du = e^u + C = e^{x^2} + C$.' },

  // S11 (중) ∫₀^(π/2) sin
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\int_0^{\\pi/2} \\sin x$', requiredSkills: SKILLS_DEF,
    stem: '$\\int_0^{\\pi/2} \\sin x \\, dx = ?$',
    options: [
      { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'C', text: '$-1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'D', text: '$\\dfrac{\\pi}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$[0, \\pi]$' },
    ],
    solution: '$\\left[ -\\cos x \\right]_0^{\\pi/2} = -0 - (-1) = 1$.' },

  // S12 (중) ∫₁² 1/x
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\int_1^2 \\dfrac{1}{x}$', requiredSkills: SKILLS_DEF,
    stem: '$\\int_1^2 \\dfrac{1}{x} \\, dx = ?$',
    options: [
      { key: 'A', text: '$\\ln 2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '구간 길이' },
      { key: 'C', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$f(2)$' },
      { key: 'D', text: '$\\ln 2 - \\ln 1 = \\ln 2$ 같은 답이지만 미완', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '단순화 안 함' },
      { key: 'E', text: '$\\ln \\dfrac{1}{2}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '뒤집음' },
    ],
    solution: '$\\left[ \\ln |x| \\right]_1^2 = \\ln 2 - \\ln 1 = \\ln 2$.' },

  // S13 (중) ∫1/(2x+3)
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\int \\dfrac{1}{2x + 3}$', requiredSkills: SKILLS_SUB,
    stem: '$\\int \\dfrac{1}{2x + 3} \\, dx = ?$',
    options: [
      { key: 'A', text: '$\\dfrac{1}{2} \\ln |2x + 3| + C$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\ln |2x + 3| + C$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$1/2$ 누락' },
      { key: 'C', text: '$\\dfrac{1}{(2x + 3)^2} + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$2 \\ln |2x + 3| + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$2$ 잘못 곱' },
      { key: 'E', text: '$\\ln |x| + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$u = 2x + 3 \\to du = 2 \\, dx$. $\\int \\dfrac{du}{2u} = \\dfrac{1}{2} \\ln |u| + C$.' },

  // S14 (중) ∫3x²/(x³+1)
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\int \\dfrac{3x^2}{x^3 + 1}$', requiredSkills: SKILLS_SUB,
    stem: '$\\int \\dfrac{3 x^2}{x^3 + 1} \\, dx = ?$',
    options: [
      { key: 'A', text: '$\\ln |x^3 + 1| + C$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3 \\ln |x^3 + 1| + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$3$ 곱 잘못' },
      { key: 'C', text: '$\\ln |x^2 + 1| + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$\\dfrac{1}{3} \\ln |x^3 + 1| + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '보정 불필요' },
      { key: 'E', text: '$\\dfrac{3x^2}{x^3 + 1} + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$u = x^3 + 1 \\to du = 3x^2 \\, dx$. $\\int \\dfrac{du}{u} = \\ln |u| + C$.' },

  // S15 (중) ∫₀¹ e^(2x)
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\int_0^1 e^{2x}$', requiredSkills: SKILLS_DEF,
    stem: '$\\int_0^1 e^{2x} \\, dx = ?$',
    options: [
      { key: 'A', text: '$\\dfrac{e^2 - 1}{2}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$e^2 - 1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$1/2$ 누락' },
      { key: 'C', text: '$\\dfrac{e^2}{2}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$F(0)$ 빼기 누락' },
      { key: 'D', text: '$e - 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\int e^x$' },
      { key: 'E', text: '$\\dfrac{e - 1}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$\\left[ \\dfrac{e^{2x}}{2} \\right]_0^1 = \\dfrac{e^2}{2} - \\dfrac{1}{2} = \\dfrac{e^2 - 1}{2}$.' },

  // S16 (어려움) ∫x sin x
  { chapterCode: CODE, difficulty: 'hard', concept: '부분적분 $\\int x \\sin x$', requiredSkills: SKILLS_PARTS,
    stem: '$\\int x \\sin x \\, dx = ?$',
    options: [
      { key: 'A', text: '$-x \\cos x + \\sin x + C$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x \\cos x - \\sin x + C$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'C', text: '$-x \\cos x - \\sin x + C$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '둘째 항 부호' },
      { key: 'D', text: '$\\dfrac{x^2}{2} \\cdot (-\\cos x) + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곱 따로 적분' },
      { key: 'E', text: '$x \\sin x + \\cos x + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$u = x, dv = \\sin x \\, dx$. $-x \\cos x + \\int \\cos x \\, dx = -x \\cos x + \\sin x + C$.' },

  // S17 (어려움) ∫x e^(-x)
  { chapterCode: CODE, difficulty: 'hard', concept: '부분적분 $\\int x e^{-x}$', requiredSkills: SKILLS_PARTS,
    stem: '$\\int x e^{-x} \\, dx = ?$',
    options: [
      { key: 'A', text: '$-(x + 1) e^{-x} + C$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(x + 1) e^{-x} + C$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'C', text: '$-x e^{-x} + C$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\int v \\, du$ 누락' },
      { key: 'D', text: '$(1 - x) e^{-x} + C$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'E', text: '$\\dfrac{x^2}{2} e^{-x} + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곱 따로' },
    ],
    solution: '$u = x, dv = e^{-x}$. $-x e^{-x} + \\int e^{-x} = -x e^{-x} - e^{-x} + C = -(x + 1) e^{-x} + C$.' },

  // S18 (어려움) ∫x ln x
  { chapterCode: CODE, difficulty: 'hard', concept: '부분적분 $\\int x \\ln x$', requiredSkills: SKILLS_PARTS,
    stem: '$\\int x \\ln x \\, dx = ?$ ($x > 0$)',
    options: [
      { key: 'A', text: '$\\dfrac{x^2}{2} \\ln x - \\dfrac{x^2}{4} + C$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{x^2}{2} \\ln x + \\dfrac{x^2}{4} + C$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'C', text: '$\\dfrac{x^2}{2} \\ln x - x + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\int v \\cdot \\dfrac{1}{x}$ 잘못' },
      { key: 'D', text: '$x \\ln x - x + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\int \\ln x$' },
      { key: 'E', text: '$\\dfrac{x^2 \\ln x}{2} + C$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\int v \\, du$ 누락' },
    ],
    solution: '$u = \\ln x, dv = x \\, dx$. $\\dfrac{x^2}{2} \\ln x - \\int \\dfrac{x^2}{2} \\cdot \\dfrac{1}{x} \\, dx = \\dfrac{x^2}{2} \\ln x - \\dfrac{x^2}{4} + C$.' },

  // S19 (어려움) ∫₀^π cos x
  { chapterCode: CODE, difficulty: 'hard', concept: '$\\int_0^\\pi \\cos x$', requiredSkills: SKILLS_DEF,
    stem: '$\\int_0^\\pi \\cos x \\, dx = ?$',
    options: [
      { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\int_0^\\pi \\sin x$' },
      { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$\\pi$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$-2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$\\left[ \\sin x \\right]_0^\\pi = 0 - 0 = 0$.' },

  // S20 (어려움) ∫(3x-1)⁴
  { chapterCode: CODE, difficulty: 'hard', concept: '치환 $(3x - 1)^4$', requiredSkills: SKILLS_SUB,
    stem: '$\\int (3x - 1)^4 \\, dx = ?$',
    options: [
      { key: 'A', text: '$\\dfrac{(3x - 1)^5}{15} + C$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{(3x - 1)^5}{5} + C$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$1/3$ 누락' },
      { key: 'C', text: '$\\dfrac{(3x - 1)^5}{3} + C$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '분모 잘못' },
      { key: 'D', text: '$5 (3x - 1)^4 + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '미분' },
      { key: 'E', text: '$\\dfrac{x^5 - x}{5} + C$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$u = 3x - 1 \\to du = 3 \\, dx$. $\\dfrac{u^5}{5 \\cdot 3} + C = \\dfrac{(3x - 1)^5}{15} + C$.' },
];

export const K_G12_CAL2_CH03_INT_METHOD_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
