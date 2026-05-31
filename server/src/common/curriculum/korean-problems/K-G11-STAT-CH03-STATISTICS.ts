/**
 * K-G11-STAT-CH03-STATISTICS (통계 — 확률분포) — 20문제 3-step Mastery.
 * 고2 확률과 통계 — 이산확률변수 (기댓값 $E$ · 분산 $V$ · 표준편차 $\sigma$) →
 *   이항분포 $B(n, p)$ ($E = np, V = np(1-p)$) → 정규분포 $N(\mu, \sigma^2)$ →
 *   표준화 $Z = (X - \mu)/\sigma$ → 표본평균 분포 ($\bar{X} \sim N(\mu, \sigma^2/n)$).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 * 주요 errorCode:
 *   FORMULA_SELECTION_ERROR 8 / ARITHMETIC_ERROR 5
 *   CONCEPT_MISUNDERSTANDING 5 / SIGN_ERROR 2
 *
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G11-STAT-CH03-STATISTICS';
const SKILLS_E = ['expectation'];
const SKILLS_V = ['variance'];
const SKILLS_SD = ['standard_deviation'];
const SKILLS_BINOM = ['binomial_distribution'];
const SKILLS_NORMAL = ['normal_distribution'];
const SKILLS_Z = ['standardization'];
const SKILLS_SAMPLE = ['sample_mean_distribution'];

const problems: KoreanProblemSeed[] = [
  // Q1
  { chapterCode: CODE, difficulty: 'easy', concept: '$E(X)$ 정의', requiredSkills: SKILLS_E,
    stem: '이산확률변수의 기댓값 $E(X)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '값 × 확률 합', options: [
        { key: 'A', text: '$\\sum x_i p_i$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sum x_i$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '확률 누락' },
        { key: 'C', text: '$\\sum p_i$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$= 1$' },
        { key: 'D', text: '$\\sum x_i^2 p_i$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$E(X^2)$' },
        { key: 'E', text: '$\\max x_i$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '가중평균', options: [
        { key: 'A', text: '$\\sum x_i p_i$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sum x_i \\cdot \\sum p_i$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$n \\bar{x}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$\\sum x_i p_i$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sum x_i$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\sum p_i$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\sum x_i^2 p_i$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\max x_i$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$E(X) = \\sum x_i p_i$.' },

  // Q2
  { chapterCode: CODE, difficulty: 'easy', concept: '$V(X)$ 정의', requiredSkills: SKILLS_V,
    stem: '$V(X)$ 의 식?',
    steps: [
      { stepType: 'CONCEPT', prompt: '평균 - 평균 제곱', options: [
        { key: 'A', text: '$E(X^2) - (E(X))^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$E(X)^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$E(X) - X$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\sum p_i^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sqrt{E(X)}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '식', options: [
        { key: 'A', text: '$E(X^2) - (E(X))^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$E(X^2) + (E(X))^2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$(X - \\mu)^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$E$ 누락' },
        { key: 'D', text: '$(E(X))^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$E(X^2) - (E(X))^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$E(X^2) + (E(X))^2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$(E(X))^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$E(X)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$V(X) = E(X^2) - (E(X))^2$.' },

  // Q3
  { chapterCode: CODE, difficulty: 'easy', concept: '표준편차', requiredSkills: SKILLS_SD,
    stem: '표준편차 $\\sigma$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '분산의 제곱근', options: [
        { key: 'A', text: '$\\sqrt{V(X)}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$V(X)$ 자체', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱근' },
        { key: 'C', text: '$V(X)^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$E(X)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sum p_i$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\sigma = \\sqrt{V}$', options: [
        { key: 'A', text: '$\\sqrt{V}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$V$ 자체', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$V^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\sqrt{E(X)}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$E(X)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$\\sqrt{V(X)}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$V(X)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$V(X)^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\sqrt{E(X)}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$E(X)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\sigma = \\sqrt{V}$.' },

  // Q4
  { chapterCode: CODE, difficulty: 'easy', concept: '$B(n, p)$ 평균', requiredSkills: SKILLS_BINOM,
    stem: '이항분포 $B(n, p)$ 의 평균?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$E(X) = np$', options: [
        { key: 'A', text: '$np$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$n + p$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$np(1-p)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '분산' },
        { key: 'D', text: '$p$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$np$', options: [
        { key: 'A', text: '$np$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$np(1-p)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '분산' },
        { key: 'C', text: '$n - p$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$p/n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$n^p$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$np$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$np(1-p)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '분산' },
        { key: 'C', text: '$n + p$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$p$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$E = np$.' },

  // Q5
  { chapterCode: CODE, difficulty: 'easy', concept: '$N(0,1)$ 평균', requiredSkills: SKILLS_NORMAL,
    stem: '표준정규분포 $N(0, 1)$ 의 평균?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$N(\\mu, \\sigma^2)$ 에서 $\\mu$', options: [
        { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sigma$' },
        { key: 'C', text: '$1/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
        { key: 'E', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\mu = 0$', options: [
        { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$1/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$-1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$1/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$-1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\mu = 0$.' },

  // Q6
  { chapterCode: CODE, difficulty: 'easy', concept: '$N(0,1)$ 표준편차', requiredSkills: SKILLS_NORMAL,
    stem: '표준정규분포 $N(0, 1)$ 의 표준편차?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\sigma = \\sqrt{1}$', options: [
        { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평균' },
        { key: 'C', text: '$1/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\sigma^2 = 1, \\sigma = 1$', options: [
        { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$1/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$-1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$1/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$-1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\sigma = 1$.' },

  // Q7
  { chapterCode: CODE, difficulty: 'medium', concept: '$E(X)$ 계산', requiredSkills: SKILLS_E,
    stem: '$P(X=0) = 1/2, P(X=1) = 1/2$. $E(X)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$0 \\cdot 1/2 + 1 \\cdot 1/2$', options: [
        { key: 'A', text: '$1/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1/4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$0 + 1/2$', options: [
        { key: 'A', text: '$1/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1/4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$1/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1/4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$0 \\cdot 1/2 + 1 \\cdot 1/2 = 1/2$.' },

  // Q8
  { chapterCode: CODE, difficulty: 'medium', concept: '$E(X^2)$', requiredSkills: SKILLS_E,
    stem: '같은 분포의 $E(X^2)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\sum x_i^2 p_i$', options: [
        { key: 'A', text: '$0^2 \\cdot 1/2 + 1^2 \\cdot 1/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(E(X))^2 = 1/4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$E(X^2) \\neq (E(X))^2$' },
        { key: 'C', text: '$E(X) = 1/2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$0 + 1/2 = 1/2$', options: [
        { key: 'A', text: '$1/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$(E(X))^2$' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$1/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$E(X^2) = 0 + 1/2 = 1/2$.' },

  // Q9
  { chapterCode: CODE, difficulty: 'medium', concept: '$V(X)$ 계산', requiredSkills: SKILLS_V,
    stem: '같은 분포의 $V(X)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$E(X^2) - (E(X))^2 = 1/2 - 1/4$', options: [
        { key: 'A', text: '$1/4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$(E(X))^2$ 누락' },
        { key: 'C', text: '$3/4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$1/4$', options: [
        { key: 'A', text: '$1/4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$3/4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$1/4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$3/4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$V = 1/2 - 1/4 = 1/4$.' },

  // Q10
  { chapterCode: CODE, difficulty: 'medium', concept: '$B(10, 0.3)$ 평균', requiredSkills: SKILLS_BINOM,
    stem: '$X \\sim B(10, 0.3)$. $E(X)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$np$', options: [
        { key: 'A', text: '$10 \\cdot 0.3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$10 + 0.3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
        { key: 'C', text: '$10 \\cdot 0.3 \\cdot 0.7$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '분산' },
        { key: 'D', text: '$0.3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$10$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$3$', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2.1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '분산' },
        { key: 'C', text: '$10.3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
        { key: 'D', text: '$7$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0.3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2.1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '분산' },
        { key: 'C', text: '$10.3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$7$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0.3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$np = 3$.' },

  // Q11
  { chapterCode: CODE, difficulty: 'medium', concept: '$B(10, 0.3)$ 분산', requiredSkills: SKILLS_BINOM,
    stem: '같은 $X \\sim B(10, 0.3)$. $V(X)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$np(1-p)$', options: [
        { key: 'A', text: '$10 \\cdot 0.3 \\cdot 0.7$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$np$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '평균' },
        { key: 'C', text: '$n(1-p)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$np^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(np)^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$2.1$', options: [
        { key: 'A', text: '$2.1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$np$' },
        { key: 'C', text: '$0.21$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1.5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$7$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$2.1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$0.21$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1.5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$7$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$np(1-p) = 2.1$.' },

  // Q12
  { chapterCode: CODE, difficulty: 'medium', concept: '표준화', requiredSkills: SKILLS_Z,
    stem: '표준화 공식?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$Z = (X - \\mu)/\\sigma$', options: [
        { key: 'A', text: '$(X - \\mu)/\\sigma$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(X - \\sigma)/\\mu$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '바뀜' },
        { key: 'C', text: '$X - \\mu$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\sigma$ 누락' },
        { key: 'D', text: '$X/\\sigma$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$X \\cdot \\sigma + \\mu$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '역방향' },
      ] },
      { stepType: 'PROCESS', prompt: '$(X - \\mu)/\\sigma$', options: [
        { key: 'A', text: '$(X - \\mu)/\\sigma$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(X + \\mu)/\\sigma$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$X / \\sigma^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\mu/X$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$X - \\sigma$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$(X - \\mu)/\\sigma$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(X - \\sigma)/\\mu$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '바뀜' },
        { key: 'C', text: '$X - \\mu$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$X/\\sigma$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$X + \\mu$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$Z = (X - \\mu)/\\sigma$.' },

  // Q13
  { chapterCode: CODE, difficulty: 'medium', concept: '$Z$ 값 계산', requiredSkills: SKILLS_Z,
    stem: '$X \\sim N(50, 10^2)$. $X = 60$ 일 때 $Z$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\mu = 50, \\sigma = 10$', options: [
        { key: 'A', text: '$(60 - 50)/10$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(60 - 50)/100$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\sigma^2$' },
        { key: 'C', text: '$60/50$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$60 + 50$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$10/60$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$10/10 = 1$', options: [
        { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0.1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\sigma^2$' },
        { key: 'C', text: '$10$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$60$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0.1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$10$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$60$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$Z = 10/10 = 1$.' },

  // Q14
  { chapterCode: CODE, difficulty: 'medium', concept: '표본평균의 평균', requiredSkills: SKILLS_SAMPLE,
    stem: '$X \\sim N(\\mu, \\sigma^2)$. 표본평균 $\\bar{X}$ 의 평균?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$E(\\bar{X}) = \\mu$', options: [
        { key: 'A', text: '$\\mu$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\mu/n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$n \\mu$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sigma$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\mu$', options: [
        { key: 'A', text: '$\\mu$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\mu/n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$n \\mu$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sigma$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$\\mu$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\mu/n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$n \\mu$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sigma$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$E(\\bar{X}) = \\mu$.' },

  // Q15
  { chapterCode: CODE, difficulty: 'medium', concept: '표본평균의 분산', requiredSkills: SKILLS_SAMPLE,
    stem: '표본크기 $n$ 일 때 $\\bar{X}$ 의 분산?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$V(\\bar{X}) = \\sigma^2/n$', options: [
        { key: 'A', text: '$\\sigma^2 / n$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sigma^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '나누기 누락' },
        { key: 'C', text: '$n \\sigma^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\sigma / n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱 없음' },
        { key: 'E', text: '$\\sigma^2 / n^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\sigma^2 / n$', options: [
        { key: 'A', text: '$\\sigma^2 / n$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sigma/n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\sigma^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\sigma/\\sqrt{n}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '표준편차' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$\\sigma^2 / n$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sigma/n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\sigma^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\sigma/\\sqrt{n}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sigma^2 / n^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$V(\\bar{X}) = \\sigma^2/n$.' },

  // Q16 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '주사위 $E(X)$', requiredSkills: SKILLS_E,
    stem: '주사위 한 번 던질 때 $X$. $E(X)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$(1+2+3+4+5+6)/6$', options: [
        { key: 'A', text: '$21/6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1+6 = 7$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 누락' },
        { key: 'C', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$21/6 = 7/2$', options: [
        { key: 'A', text: '$7/2 = 3.5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$7$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 누락' },
        { key: 'D', text: '$21$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$3.5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$7$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$21$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$E(X) = 21/6 = 3.5$.' },

  // Q17 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '동전 4번 $E, V$', requiredSkills: SKILLS_BINOM,
    stem: '동전 $4$ 번 앞면 수 $X \\sim B(4, 0.5)$. $E(X), V(X)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$np, np(1-p)$', options: [
        { key: 'A', text: '$E = 2, V = 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$E = 4, V = 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$E = 0.5, V = 0.5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$n$ 누락' },
        { key: 'D', text: '$E = 2, V = 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$E = 1, V = 1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$4 \\cdot 0.5 = 2$, $4 \\cdot 0.5 \\cdot 0.5 = 1$', options: [
        { key: 'A', text: '$(2, 1)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(4, 2)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$(0.5, 0.5)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(2, 2)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(1, 4)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '바뀜' },
      ] },
      { stepType: 'ANSWER', prompt: '$(E, V)$?', options: [
        { key: 'A', text: '$(2, 1)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(4, 2)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$(0.5, 0.5)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(2, 2)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(1, 4)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$E = 2, V = 1$.' },

  // Q18 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '표준화 의의', requiredSkills: SKILLS_Z,
    stem: '$X \\sim N(\\mu, \\sigma^2)$ 를 표준화하면 $Z \\sim ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '표준정규분포로', options: [
        { key: 'A', text: '$N(0, 1)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$N(\\mu, 1)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$N(0, \\sigma^2)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$N(\\mu, \\sigma^2)$ 그대로', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$N(\\mu/\\sigma, 1)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '평균 $0$, 분산 $1$', options: [
        { key: 'A', text: '$N(0, 1)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$N(\\mu, 1)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$N(0, \\sigma^2)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$N(1, 0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$\\chi^2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$N(0, 1)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$N(\\mu, 1)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$N(0, \\sigma^2)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$N(\\mu, \\sigma^2)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$\\chi^2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$Z \\sim N(0, 1)$.' },

  // Q19 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '$Z$ 값 (분산 $25$)', requiredSkills: SKILLS_Z,
    stem: '$X \\sim N(100, 25)$. $X = 110$ 의 $Z$? (주의: $\\sigma^2 = 25$)',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\sigma = 5$', options: [
        { key: 'A', text: '$(110 - 100)/5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(110 - 100)/25$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\sigma$ 가 $\\sqrt{25}$' },
        { key: 'C', text: '$110/100$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$110$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$10/5$', options: [
        { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0.4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$/25$' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$10$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$50$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0.4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$10$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$50$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\sigma = \\sqrt{25} = 5$, $Z = (110-100)/5 = 2$.' },

  // Q20 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '표본평균 분포', requiredSkills: SKILLS_SAMPLE,
    stem: '$X \\sim N(\\mu, \\sigma^2)$, 표본크기 $n$. $\\bar{X}$ 의 분포?',
    steps: [
      { stepType: 'CONCEPT', prompt: '평균 동일, 분산 $1/n$', options: [
        { key: 'A', text: '$N(\\mu, \\sigma^2/n)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$N(\\mu, \\sigma^2)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '나누기 누락' },
        { key: 'C', text: '$N(\\mu/n, \\sigma^2)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '평균은 같음' },
        { key: 'D', text: '$N(n\\mu, n\\sigma^2)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$N(0, 1)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '표준화' },
      ] },
      { stepType: 'PROCESS', prompt: '표본표준편차 $= \\sigma/\\sqrt{n}$', options: [
        { key: 'A', text: '$N(\\mu, \\sigma^2/n)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$N(\\mu, \\sigma/\\sqrt{n})$ — 분산 표기 잘못', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\sigma$ vs $\\sigma^2$' },
        { key: 'C', text: '$N(\\mu, \\sigma^2)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$N(\\mu/n, \\sigma^2/n)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '평균' },
        { key: 'E', text: '$N(0, 1)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$N(\\mu, \\sigma^2/n)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$N(\\mu, \\sigma^2)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$N(\\mu/n, \\sigma^2)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$N(n\\mu, n\\sigma^2)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$N(0, 1)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\bar{X} \\sim N(\\mu, \\sigma^2/n)$.' },
];

export const K_G11_STAT_CH03_STATISTICS_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
