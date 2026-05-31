/**
 * K-G11-STAT-CH03-STATISTICS — STUDY pool (single-step, 20문제).
 * 통계 — 이산확률변수, 기댓값/분산, 이항분포, 정규분포, 표준화, 표본평균.
 * Mastery 3-step과 별도 변형 문제. 고2 확률과 통계 (G11).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5. LLM 미사용.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G11-STAT-CH03-STATISTICS';
const SKILLS_E = ['expected_value'];
const SKILLS_V = ['variance'];
const SKILLS_SD = ['standard_deviation'];
const SKILLS_BINOM = ['binomial_distribution'];
const SKILLS_NORMAL = ['normal_distribution'];
const SKILLS_Z = ['standardization'];
const SKILLS_SAMPLE = ['sample_mean'];
const SKILLS_LINEAR = ['linear_transformation'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) E(X)의 의미
  { chapterCode: CODE, difficulty: 'easy', concept: '$E(X)$ 의미', requiredSkills: SKILLS_E,
    stem: '확률변수 $X$ 의 $E(X)$ 가 나타내는 것?',
    options: [
      { key: 'A', text: '$X$ 의 기댓값 (평균)', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$X$ 의 분산', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$V(X)$' },
      { key: 'C', text: '$X$ 의 표준편차', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sigma$' },
      { key: 'D', text: '$X$ 의 최댓값', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$X$ 의 확률', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$E(X) = \\sum x_i p_i$ — 확률변수의 기댓값(평균).' },

  // S2 (쉬움) V(X) 범위
  { chapterCode: CODE, difficulty: 'easy', concept: '$V(X)$ 부호', requiredSkills: SKILLS_V,
    stem: '$V(X)$ 의 값이 항상 만족하는 조건?',
    options: [
      { key: 'A', text: '$V(X) \\geq 0$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$V(X) > 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$= 0$ 가능' },
      { key: 'C', text: '$V(X) \\leq 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '확률 아님' },
      { key: 'D', text: '$V(X) < 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '음수 불가' },
      { key: 'E', text: '$V(X) = E(X)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '분산은 제곱 평균이므로 $V(X) \\geq 0$. (상수 변수면 $= 0$.)' },

  // S3 (쉬움) σ² = V(X)
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\sigma$ 와 $V$', requiredSkills: SKILLS_SD,
    stem: '$\\sigma$ 와 $V(X)$ 의 관계?',
    options: [
      { key: 'A', text: '$\\sigma^2 = V(X)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\sigma = V(X)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '제곱 누락' },
      { key: 'C', text: '$\\sigma = V(X)^2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '뒤집음' },
      { key: 'D', text: '$\\sigma = E(X)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$\\sigma + V = 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$\\sigma = \\sqrt{V(X)}$ 즉 $\\sigma^2 = V(X)$.' },

  // S4 (쉬움) B(n,p) 분산
  { chapterCode: CODE, difficulty: 'easy', concept: '$B(n, p)$ 분산', requiredSkills: SKILLS_BINOM,
    stem: '이항분포 $B(n, p)$ 의 분산?',
    options: [
      { key: 'A', text: '$np(1 - p)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$np$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평균' },
      { key: 'C', text: '$n(1 - p)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$p$ 누락' },
      { key: 'D', text: '$n^2 p$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$p(1 - p)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$n$ 누락' },
    ],
    solution: '$B(n, p)$ 의 분산은 $npq = np(1 - p)$.' },

  // S5 (쉬움) 표준정규 분산
  { chapterCode: CODE, difficulty: 'easy', concept: '$N(0, 1)$ 분산', requiredSkills: SKILLS_NORMAL,
    stem: '표준정규분포 $N(0, 1)$ 의 분산?',
    options: [
      { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평균' },
      { key: 'C', text: '$\\sqrt{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$\\pi$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$N(0, 1)$: 평균 $0$, 분산 $1$, 표준편차 $1$.' },

  // S6 (쉬움) N(μ, σ²) 평균
  { chapterCode: CODE, difficulty: 'easy', concept: '$N(\\mu, \\sigma^2)$ 평균', requiredSkills: SKILLS_NORMAL,
    stem: '$X \\sim N(\\mu, \\sigma^2)$ 의 평균?',
    options: [
      { key: 'A', text: '$\\mu$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\sigma$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '표준편차' },
      { key: 'C', text: '$\\sigma^2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '분산' },
      { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '표준정규' },
      { key: 'E', text: '$\\mu + \\sigma$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$N(\\mu, \\sigma^2)$ 의 평균은 $\\mu$.' },

  // S7 (중) E(X) 계산
  { chapterCode: CODE, difficulty: 'medium', concept: '$E(X)$ 계산', requiredSkills: SKILLS_E,
    stem: '$P(X = 1) = \\dfrac{1}{3}, P(X = 2) = \\dfrac{2}{3}$. $E(X) = ?$',
    options: [
      { key: 'A', text: '$\\dfrac{5}{3}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{3}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '단순 평균' },
      { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '최댓값' },
      { key: 'E', text: '$\\dfrac{2}{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '확률' },
    ],
    solution: '$E(X) = 1 \\cdot \\dfrac{1}{3} + 2 \\cdot \\dfrac{2}{3} = \\dfrac{1}{3} + \\dfrac{4}{3} = \\dfrac{5}{3}$.' },

  // S8 (중) E(X²)
  { chapterCode: CODE, difficulty: 'medium', concept: '$E(X^2)$ 계산', requiredSkills: SKILLS_E,
    stem: '같은 분포 ($P(X=1)=\\dfrac{1}{3}, P(X=2)=\\dfrac{2}{3}$) 의 $E(X^2) = ?$',
    options: [
      { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{25}{9}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$E(X)^2$' },
      { key: 'C', text: '$\\dfrac{5}{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$E(X)$' },
      { key: 'D', text: '$\\dfrac{5}{9}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'E', text: '$\\dfrac{9}{5}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '$E(X^2) = 1 \\cdot \\dfrac{1}{3} + 4 \\cdot \\dfrac{2}{3} = \\dfrac{1}{3} + \\dfrac{8}{3} = 3$.' },

  // S9 (중) V(X) 계산
  { chapterCode: CODE, difficulty: 'medium', concept: '$V(X)$ 계산', requiredSkills: SKILLS_V,
    stem: '같은 분포의 $V(X) = ?$ ($E(X) = \\dfrac{5}{3}, E(X^2) = 3$)',
    options: [
      { key: 'A', text: '$\\dfrac{2}{9}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{5}{9}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'C', text: '$3 - \\dfrac{5}{3} = \\dfrac{4}{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$E(X)$ 자체 뺌' },
      { key: 'D', text: '$\\dfrac{4}{9}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$V(X) = E(X^2) - E(X)^2 = 3 - \\dfrac{25}{9} = \\dfrac{27 - 25}{9} = \\dfrac{2}{9}$.' },

  // S10 (중) B(20, 0.4) E
  { chapterCode: CODE, difficulty: 'medium', concept: '$B(20, 0.4)$ 평균', requiredSkills: SKILLS_BINOM,
    stem: '$X \\sim B(20, 0.4)$. $E(X) = ?$',
    options: [
      { key: 'A', text: '$8$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$4.8$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '분산' },
      { key: 'C', text: '$0.4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$p$' },
      { key: 'D', text: '$12$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$n(1-p)$' },
      { key: 'E', text: '$20$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$p$ 누락' },
    ],
    solution: '$E(X) = np = 20 \\cdot 0.4 = 8$.' },

  // S11 (중) B(20, 0.4) V
  { chapterCode: CODE, difficulty: 'medium', concept: '$B(20, 0.4)$ 분산', requiredSkills: SKILLS_BINOM,
    stem: '같은 $X \\sim B(20, 0.4)$. $V(X) = ?$',
    options: [
      { key: 'A', text: '$4.8$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$8$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평균' },
      { key: 'C', text: '$3.2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'D', text: '$12$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$0.24$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$n$ 누락' },
    ],
    solution: '$V(X) = np(1 - p) = 20 \\cdot 0.4 \\cdot 0.6 = 4.8$.' },

  // S12 (중) Z=2
  { chapterCode: CODE, difficulty: 'medium', concept: '$Z$ 값 계산 ($\\sigma = 5$)', requiredSkills: SKILLS_Z,
    stem: '$X \\sim N(30, 5^2)$. $X = 40$ 일 때 $Z = ?$',
    options: [
      { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$10$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\sigma$ 나눔 누락' },
      { key: 'C', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '뒤집음' },
      { key: 'D', text: '$8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'E', text: '$0.4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$Z = \\dfrac{X - \\mu}{\\sigma} = \\dfrac{40 - 30}{5} = 2$.' },

  // S13 (중) Z=0
  { chapterCode: CODE, difficulty: 'medium', concept: '$X = \\mu$ 일 때 $Z$', requiredSkills: SKILLS_Z,
    stem: '$X \\sim N(\\mu, \\sigma^2)$ 에서 $X = \\mu$ 이면 $Z = ?$',
    options: [
      { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\mu$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$\\sigma$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '정의 X', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '정의됨' },
    ],
    solution: '$Z = \\dfrac{\\mu - \\mu}{\\sigma} = 0$.' },

  // S14 (중) E(aX+b)
  { chapterCode: CODE, difficulty: 'medium', concept: '$E(aX + b)$', requiredSkills: SKILLS_LINEAR,
    stem: '$E(aX + b) = ?$',
    options: [
      { key: 'A', text: '$aE(X) + b$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$aE(X)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$b$ 누락' },
      { key: 'C', text: '$E(X) + b$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$a$ 누락' },
      { key: 'D', text: '$a^2 E(X) + b$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$V$' },
      { key: 'E', text: '$aE(X) + b^2$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$b$ 잘못' },
    ],
    solution: '기댓값 선형성: $E(aX + b) = aE(X) + b$.' },

  // S15 (중) V(aX+b)
  { chapterCode: CODE, difficulty: 'medium', concept: '$V(aX + b)$', requiredSkills: SKILLS_LINEAR,
    stem: '$V(aX + b) = ?$',
    options: [
      { key: 'A', text: '$a^2 V(X)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$aV(X) + b$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$E$ 공식' },
      { key: 'C', text: '$aV(X)$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '제곱 누락' },
      { key: 'D', text: '$a^2 V(X) + b^2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$b^2$ 잘못' },
      { key: 'E', text: '$V(X)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$a$ 누락' },
    ],
    solution: '분산 변환: $V(aX + b) = a^2 V(X)$. 상수 $b$ 는 분산에 영향 X.' },

  // S16 (어려움) 두 주사위 합 E
  { chapterCode: CODE, difficulty: 'hard', concept: '두 주사위 합의 $E$', requiredSkills: SKILLS_E,
    stem: '주사위 두 개의 합 $X$. $E(X) = ?$',
    options: [
      { key: 'A', text: '$7$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3.5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '한 개 주사위' },
      { key: 'C', text: '$6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '최댓값/2' },
      { key: 'D', text: '$12$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '최댓값' },
      { key: 'E', text: '$4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '$E(X) = E(X_1) + E(X_2) = 3.5 + 3.5 = 7$.' },

  // S17 (어려움) B(100, 0.2) σ
  { chapterCode: CODE, difficulty: 'hard', concept: '$B(100, 0.2)$ 표준편차', requiredSkills: SKILLS_BINOM,
    stem: '$X \\sim B(100, 0.2)$. $\\sigma(X) = ?$',
    options: [
      { key: 'A', text: '$4$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$16$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$V$ 자체' },
      { key: 'C', text: '$20$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평균' },
      { key: 'D', text: '$\\sqrt{20}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '$V(X) = 100 \\cdot 0.2 \\cdot 0.8 = 16$. $\\sigma = \\sqrt{16} = 4$.' },

  // S18 (어려움) Z = -2
  { chapterCode: CODE, difficulty: 'hard', concept: '$Z$ 음수 (분산 $9$)', requiredSkills: SKILLS_Z,
    stem: '$X \\sim N(\\mu, 9)$, $X = \\mu - 6$. $Z = ?$',
    options: [
      { key: 'A', text: '$-2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'C', text: '$-6$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\sigma$ 나눔 누락' },
      { key: 'D', text: '$-\\dfrac{2}{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sigma^2 = 9$ 그대로' },
      { key: 'E', text: '$-3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '$\\sigma = \\sqrt{9} = 3$. $Z = \\dfrac{(\\mu - 6) - \\mu}{3} = -2$.' },

  // S19 (어려움) 표본평균 표준편차
  { chapterCode: CODE, difficulty: 'hard', concept: '$\\bar{X}$ 표준편차', requiredSkills: SKILLS_SAMPLE,
    stem: '$X \\sim N(\\mu, 10^2)$. 표본크기 $n = 4$. $\\bar{X}$ 의 표준편차?',
    options: [
      { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$10$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\sqrt{n}$ 나눔 누락' },
      { key: 'C', text: '$2.5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$n$ 으로 나눔' },
      { key: 'D', text: '$25$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sigma^2 / n$' },
      { key: 'E', text: '$\\sqrt{10}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$\\sigma(\\bar{X}) = \\dfrac{\\sigma}{\\sqrt{n}} = \\dfrac{10}{\\sqrt{4}} = 5$.' },

  // S20 (어려움) 표본평균 분포
  { chapterCode: CODE, difficulty: 'hard', concept: '$\\bar{X}$ 분포', requiredSkills: SKILLS_SAMPLE,
    stem: '$X \\sim N(\\mu, \\sigma^2)$, 표본크기 $n$. $\\bar{X}$ 의 분포?',
    options: [
      { key: 'A', text: '$N\\left(\\mu, \\dfrac{\\sigma^2}{n}\\right)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$N(\\mu, \\sigma^2)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$/n$ 누락' },
      { key: 'C', text: '$N\\left(\\dfrac{\\mu}{n}, \\sigma^2\\right)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평균 잘못' },
      { key: 'D', text: '$N\\left(\\mu, \\dfrac{\\sigma}{\\sqrt{n}}\\right)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '분산이 표준편차' },
      { key: 'E', text: '$N(0, 1)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '표준화 후' },
    ],
    solution: '$\\bar{X} \\sim N\\left(\\mu, \\dfrac{\\sigma^2}{n}\\right)$.' },
];

export const K_G11_STAT_CH03_STATISTICS_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
