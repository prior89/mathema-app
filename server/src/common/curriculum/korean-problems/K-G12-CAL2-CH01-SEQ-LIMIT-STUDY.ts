/**
 * K-G12-CAL2-CH01-SEQ-LIMIT — STUDY pool (single-step, 20문제).
 * 수열의 극한 — 기본 극한, 유리식, 기하수열, 무한급수, 유리화.
 * Mastery 3-step과 별도 변형 문제. 고3 미적분Ⅱ (G12).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5. LLM 미사용.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G12-CAL2-CH01-SEQ-LIMIT';
const SKILLS_BASIC = ['basic_sequence_limit'];
const SKILLS_GEOMETRIC = ['geometric_limit'];
const SKILLS_RATIONAL = ['rational_sequence_limit'];
const SKILLS_SERIES = ['infinite_series_convergence'];
const SKILLS_GEO_SUM = ['geometric_series_sum'];
const SKILLS_RATIONALIZE = ['rationalize_limit'];
const SKILLS_OSCILLATE = ['oscillating_sequence'];
const SKILLS_RIEMANN = ['riemann_like_sum'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) 3/n
  { chapterCode: CODE, difficulty: 'easy', concept: '$3/n$', requiredSkills: SKILLS_BASIC,
    stem: '$\\lim_{n \\to \\infty} \\dfrac{3}{n} = ?$',
    options: [
      { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '분자 자체' },
      { key: 'C', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$\\dfrac{1}{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$\\lim \\dfrac{c}{n} = 0$ (상수 / 무한대).' },

  // S2 (쉬움) 1/n³
  { chapterCode: CODE, difficulty: 'easy', concept: '$1/n^3$', requiredSkills: SKILLS_BASIC,
    stem: '$\\lim_{n \\to \\infty} \\dfrac{1}{n^3} = ?$',
    options: [
      { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{1}{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'C', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$\\dfrac{1}{n^3} \\to 0$.' },

  // S3 (쉬움) (1/3)ⁿ
  { chapterCode: CODE, difficulty: 'easy', concept: '$(1/3)^n$', requiredSkills: SKILLS_GEOMETRIC,
    stem: '$\\lim_{n \\to \\infty} \\left( \\dfrac{1}{3} \\right)^n = ?$',
    options: [
      { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{1}{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$n = 1$' },
      { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '뒤집음' },
    ],
    solution: '$|r| < 1$ 이므로 $r^n \\to 0$.' },

  // S4 (쉬움) n²
  { chapterCode: CODE, difficulty: 'easy', concept: '$n^2$', requiredSkills: SKILLS_BASIC,
    stem: '$\\lim_{n \\to \\infty} n^2 = ?$',
    options: [
      { key: 'A', text: '$\\infty$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$-\\infty$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
    ],
    solution: '$n^2 \\to \\infty$ (양의 무한대).' },

  // S5 (쉬움) 2 - 1/n
  { chapterCode: CODE, difficulty: 'easy', concept: '$2 - 1/n$', requiredSkills: SKILLS_BASIC,
    stem: '$\\lim_{n \\to \\infty} \\left( 2 - \\dfrac{1}{n} \\right) = ?$',
    options: [
      { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'C', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$1/n$ 만' },
      { key: 'D', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '$2 - 0 = 2$.' },

  // S6 (쉬움) (-1)ⁿ 진동
  { chapterCode: CODE, difficulty: 'easy', concept: '$(-1)^n$ 진동', requiredSkills: SKILLS_OSCILLATE,
    stem: '$\\lim_{n \\to \\infty} (-1)^n$ 은?',
    options: [
      { key: 'A', text: '진동 (수렴하지 않음)', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '짝수만 봄' },
      { key: 'D', text: '$-1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '홀수만 봄' },
      { key: 'E', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$(-1)^n$ 은 $1, -1, 1, -1, ...$ 진동. 수렴 X.' },

  // S7 (중) (3n-1)/(n+2)
  { chapterCode: CODE, difficulty: 'medium', concept: '$(3n - 1)/(n + 2)$', requiredSkills: SKILLS_RATIONAL,
    stem: '$\\lim_{n \\to \\infty} \\dfrac{3n - 1}{n + 2} = ?$',
    options: [
      { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '같은 차수 잘못' },
      { key: 'C', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '같은 차수' },
      { key: 'E', text: '$-1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '잘못' },
    ],
    solution: '분자·분모 차수 같음. 최고차항 계수 비 $\\dfrac{3}{1} = 3$.' },

  // S8 (중) n/(n³+1)
  { chapterCode: CODE, difficulty: 'medium', concept: '$n/(n^3 + 1)$', requiredSkills: SKILLS_RATIONAL,
    stem: '$\\lim_{n \\to \\infty} \\dfrac{n}{n^3 + 1} = ?$',
    options: [
      { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'C', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$\\dfrac{1}{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '분모 차수가 높음 → $0$.' },

  // S9 (중) n³/(n²-1)
  { chapterCode: CODE, difficulty: 'medium', concept: '$n^3/(n^2 - 1)$', requiredSkills: SKILLS_RATIONAL,
    stem: '$\\lim_{n \\to \\infty} \\dfrac{n^3}{n^2 - 1} = ?$',
    options: [
      { key: 'A', text: '$\\infty$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '분자 차수가 높음 → $\\infty$.' },

  // S10 (중) (2n²-n)/(3n²+1)
  { chapterCode: CODE, difficulty: 'medium', concept: '$(2n^2 - n)/(3n^2 + 1)$', requiredSkills: SKILLS_RATIONAL,
    stem: '$\\lim_{n \\to \\infty} \\dfrac{2n^2 - n}{3n^2 + 1} = ?$',
    options: [
      { key: 'A', text: '$\\dfrac{2}{3}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{3}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '뒤집음' },
      { key: 'C', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '최고차 계수 비 $= \\dfrac{2}{3}$.' },

  // S11 (중) 3 + 2/n
  { chapterCode: CODE, difficulty: 'medium', concept: '$3 + 2/n$', requiredSkills: SKILLS_BASIC,
    stem: '$\\lim_{n \\to \\infty} \\left( 3 + \\dfrac{2}{n} \\right) = ?$',
    options: [
      { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'C', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$2/n$ 만' },
      { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$3 + 0 = 3$.' },

  // S12 (중) Σ (1/4)ⁿ
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\sum (1/4)^n$', requiredSkills: SKILLS_GEO_SUM,
    stem: '$\\sum_{n=1}^{\\infty} \\left( \\dfrac{1}{4} \\right)^n = ?$',
    options: [
      { key: 'A', text: '$\\dfrac{1}{3}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{1}{4}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '첫 항' },
      { key: 'C', text: '$\\dfrac{4}{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$n=0$ 부터' },
      { key: 'D', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$\\dfrac{3}{4}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$\\dfrac{a_1}{1 - r} = \\dfrac{1/4}{1 - 1/4} = \\dfrac{1/4}{3/4} = \\dfrac{1}{3}$.' },

  // S13 (중) Σ (1/2)ⁿ
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\sum (1/2)^n$', requiredSkills: SKILLS_GEO_SUM,
    stem: '$\\sum_{n=1}^{\\infty} \\left( \\dfrac{1}{2} \\right)^n = ?$',
    options: [
      { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$n=0$ 부터' },
      { key: 'C', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '첫 항' },
      { key: 'D', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$\\dfrac{3}{2}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '$\\dfrac{1/2}{1 - 1/2} = 1$.' },

  // S14 (중) 3ⁿ
  { chapterCode: CODE, difficulty: 'medium', concept: '$3^n$', requiredSkills: SKILLS_GEOMETRIC,
    stem: '$\\lim_{n \\to \\infty} 3^n = ?$',
    options: [
      { key: 'A', text: '$\\infty$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'C', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$n = 1$' },
      { key: 'D', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '진동', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '양수 발산' },
    ],
    solution: '$|r| > 1, r > 0$ → $r^n \\to \\infty$.' },

  // S15 (중) (-1/2)ⁿ
  { chapterCode: CODE, difficulty: 'medium', concept: '$(-1/2)^n$', requiredSkills: SKILLS_GEOMETRIC,
    stem: '$\\lim_{n \\to \\infty} \\left( -\\dfrac{1}{2} \\right)^n = ?$',
    options: [
      { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '진동', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$|r| < 1$ 이라 진동 X' },
      { key: 'C', text: '$-\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$n = 1$' },
      { key: 'D', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '잘못' },
      { key: 'E', text: '$-1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$|-1/2| < 1$ 이므로 $r^n \\to 0$. (부호 진동하지만 절댓값 $\\to 0$).' },

  // S16 (어려움) (2n³-n)/(n³+4)
  { chapterCode: CODE, difficulty: 'hard', concept: '$(2n^3 - n)/(n^3 + 4)$', requiredSkills: SKILLS_RATIONAL,
    stem: '$\\lim_{n \\to \\infty} \\dfrac{2n^3 - n}{n^3 + 4} = ?$',
    options: [
      { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '뒤집음' },
      { key: 'C', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$\\dfrac{2}{4}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '상수항 비교' },
    ],
    solution: '같은 차수 → 최고차 계수 비 $= \\dfrac{2}{1} = 2$.' },

  // S17 (어려움) Σ 3(1/2)^(n-1)
  { chapterCode: CODE, difficulty: 'hard', concept: '$\\sum 3 (1/2)^{n-1}$', requiredSkills: SKILLS_GEO_SUM,
    stem: '$\\sum_{n=1}^{\\infty} 3 \\cdot \\left( \\dfrac{1}{2} \\right)^{n-1} = ?$',
    options: [
      { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '첫 항' },
      { key: 'C', text: '$\\dfrac{3}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$|r| < 1$' },
      { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '$\\dfrac{a_1}{1 - r} = \\dfrac{3}{1 - 1/2} = \\dfrac{3}{1/2} = 6$.' },

  // S18 (어려움) √(n+2) - √n
  { chapterCode: CODE, difficulty: 'hard', concept: '$\\sqrt{n + 2} - \\sqrt{n}$', requiredSkills: SKILLS_RATIONALIZE,
    stem: '$\\lim_{n \\to \\infty} (\\sqrt{n + 2} - \\sqrt{n}) = ?$',
    options: [
      { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\sqrt{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'C', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '차이' },
      { key: 'D', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '유리화: $\\dfrac{2}{\\sqrt{n+2} + \\sqrt{n}} \\to 0$.' },

  // S19 (어려움) √(n²+2n) - n
  { chapterCode: CODE, difficulty: 'hard', concept: '$\\sqrt{n^2 + 2n} - n$', requiredSkills: SKILLS_RATIONALIZE,
    stem: '$\\lim_{n \\to \\infty} (\\sqrt{n^2 + 2n} - n) = ?$',
    options: [
      { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'C', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sqrt{n^2+n}$' },
      { key: 'D', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '유리화: $\\dfrac{2n}{\\sqrt{n^2 + 2n} + n} \\to \\dfrac{2}{1 + 1} = 1$.' },

  // S20 (어려움) (1²+2²+...+n²)/n³
  { chapterCode: CODE, difficulty: 'hard', concept: '제곱합 / $n^3$', requiredSkills: SKILLS_RIEMANN,
    stem: '$\\lim_{n \\to \\infty} \\dfrac{1^2 + 2^2 + \\ldots + n^2}{n^3} = ?$',
    options: [
      { key: 'A', text: '$\\dfrac{1}{3}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sum k$ 와 혼동' },
      { key: 'C', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$\\dfrac{1}{6}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '공식 잘못' },
    ],
    solution: '$\\sum_{k=1}^n k^2 = \\dfrac{n(n+1)(2n+1)}{6}$. $\\dfrac{n(n+1)(2n+1)}{6n^3} \\to \\dfrac{2}{6} = \\dfrac{1}{3}$.' },
];

export const K_G12_CAL2_CH01_SEQ_LIMIT_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
