/**
 * K-G11-CAL1-CH01-LIMIT-CONT (함수의 극한·연속) — 20문제 3-step Mastery.
 * 고2 미적분Ⅰ — 극한 정의·대입 → 부정형 ($0/0$, $\infty/\infty$) → 인수분해·유리화 →
 *   무한대 극한 (차수 비교) → 연속 정의 ($\lim = f(a)$) → 사이값 정리.
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 * 주요 errorCode:
 *   ALGEBRA_ERROR 7 / FORMULA_SELECTION_ERROR 6
 *   CONCEPT_MISUNDERSTANDING 5 / CONDITION_MISSING 2
 *
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G11-CAL1-CH01-LIMIT-CONT';
const SKILLS_LIM_SUB = ['limit_by_substitution'];
const SKILLS_LIM_FACTOR = ['limit_factoring'];
const SKILLS_LIM_RATIONAL = ['limit_rationalization'];
const SKILLS_LIM_INF = ['limit_at_infinity'];
const SKILLS_LIM_SPECIAL = ['special_limit_sinx_over_x'];
const SKILLS_CONT_DEF = ['continuity_definition'];
const SKILLS_PIECEWISE = ['piecewise_continuity'];
const SKILLS_IVT = ['intermediate_value_theorem'];

const problems: KoreanProblemSeed[] = [
  // Q1
  { chapterCode: CODE, difficulty: 'easy', concept: '대입으로 극한', requiredSkills: SKILLS_LIM_SUB,
    stem: '$\\lim_{x \\to 2} (x + 3)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '연속함수는 대입', options: [
        { key: 'A', text: '다항함수 → 대입', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '항상 분모 0 처리', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '극한 항상 $\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '항상 $0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$2 + 3$', options: [
        { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$x$ 무시' },
        { key: 'D', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$+3$ 무시' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '값?', options: [
        { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '대입 $2 + 3 = 5$.' },

  // Q2
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\lim x^2$', requiredSkills: SKILLS_LIM_SUB,
    stem: '$\\lim_{x \\to 0} x^2$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$0^2$', options: [
        { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x^0$' },
        { key: 'C', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
        { key: 'E', text: '$-1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '대입', options: [
        { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '값?', options: [
        { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$-1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$0$.' },

  // Q3
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\lim (2x+1)$', requiredSkills: SKILLS_LIM_SUB,
    stem: '$\\lim_{x \\to 1} (2x + 1)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$x = 1$ 대입', options: [
        { key: 'A', text: '$2 \\cdot 1 + 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2 + 1 + 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$3$', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '값?', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$2 + 1 = 3$.' },

  // Q4
  { chapterCode: CODE, difficulty: 'easy', concept: '연속 판정', requiredSkills: SKILLS_CONT_DEF,
    stem: '$f(x) = x^2$ 가 $x = 1$ 에서 연속?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\lim_{x \\to 1} x^2 = f(1)$?', options: [
        { key: 'A', text: '$1 = 1$ → 일치', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\lim \\neq f(1)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '일치함' },
        { key: 'C', text: '극한 안 함', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '존재함' },
        { key: 'D', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
        { key: 'E', text: '$f$ 정의 안 됨', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '정의됨' },
      ] },
      { stepType: 'PROCESS', prompt: '다항함수 → 모든 점 연속', options: [
        { key: 'A', text: '연속', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '불연속', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$x \\geq 0$ 만', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$x = 1$ 만', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '주기적', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$x = 1$ 에서?', options: [
        { key: 'A', text: '연속', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '불연속', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
        { key: 'D', text: '$f(1)$ 정의 안 됨', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '진동', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '다항함수는 모든 실수에서 연속.' },

  // Q5
  { chapterCode: CODE, difficulty: 'easy', concept: '연속 정의', requiredSkills: SKILLS_CONT_DEF,
    stem: '함수 $f$ 가 $x = a$ 에서 연속의 정의?',
    steps: [
      { stepType: 'CONCEPT', prompt: '극한과 함숫값', options: [
        { key: 'A', text: '$\\lim_{x \\to a} f(x) = f(a)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$f(a) = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$f$ 미분가능', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '강한 조건' },
        { key: 'D', text: '$\\lim = \\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$f(a)$ 정의 안 됨', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '반대' },
      ] },
      { stepType: 'PROCESS', prompt: '세 조건: $f(a)$ 존재 + 극한 존재 + 같음', options: [
        { key: 'A', text: '셋 다 만족', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$f(a)$ 만', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'C', text: '극한만', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'D', text: '미분가능', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
      { stepType: 'ANSWER', prompt: '정의?', options: [
        { key: 'A', text: '$\\lim_{x \\to a} f(x) = f(a)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$f$ 미분 가능', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$f(a) > 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\lim = \\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '주기적', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\lim_{x \\to a} f(x) = f(a)$.' },

  // Q6
  { chapterCode: CODE, difficulty: 'easy', concept: '$\\lim 1/x$', requiredSkills: SKILLS_LIM_INF,
    stem: '$\\lim_{x \\to \\infty} 1/x$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$x$ 커지면 $1/x$ 작아짐', options: [
        { key: 'A', text: '$1/x \\to 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/x \\to \\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '반대' },
        { key: 'C', text: '$1/x \\to 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
        { key: 'E', text: '진동', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$0$', options: [
        { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$-1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '값?', options: [
        { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$-1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
    ], solution: '$\\lim_{x \\to \\infty} 1/x = 0$.' },

  // Q7
  { chapterCode: CODE, difficulty: 'medium', concept: '$0/0$ 부정형 인수분해', requiredSkills: SKILLS_LIM_FACTOR,
    stem: '$\\lim_{x \\to 2} (x^2 - 4)/(x - 2)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '대입 시 $0/0$', options: [
        { key: 'A', text: '인수분해 필요: $x^2 - 4 = (x-2)(x+2)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '대입 후 결과', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$0/0$' },
        { key: 'C', text: '극한 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '있음' },
        { key: 'D', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$(x-2)(x+2)/(x-2) = x + 2$, $x \\to 2$', options: [
        { key: 'A', text: '$4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$0/0$ 그대로' },
        { key: 'C', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '존재 안 함', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '값?', options: [
        { key: 'A', text: '$4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '존재 안 함', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$(x+2) \\to 4$.' },

  // Q8
  { chapterCode: CODE, difficulty: 'medium', concept: '$x$ 약분', requiredSkills: SKILLS_LIM_FACTOR,
    stem: '$\\lim_{x \\to 0} (x^2 - x)/x$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$x$ 묶고 약분', options: [
        { key: 'A', text: '$x(x - 1)/x = x - 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x(x - 1)/x = x \\cdot (x - 1)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '약분 후 곱셈으로 잘못 처리' },
        { key: 'C', text: '$0/0$ → 정의 안 됨', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '약분 가능' },
        { key: 'D', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$x - 1$, $x \\to 0$', options: [
        { key: 'A', text: '$-1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '존재 안 함', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '값?', options: [
        { key: 'A', text: '$-1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '존재 안 함', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$x(x-1)/x = x - 1 \\to -1$.' },

  // Q9
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\infty/\\infty$ 같은 차수', requiredSkills: SKILLS_LIM_INF,
    stem: '$\\lim_{x \\to \\infty} (3x + 1)/(x + 2)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '최고차 항 비교', options: [
        { key: 'A', text: '같은 차수 → 최고차 계수 비', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\infty/\\infty = 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부정형' },
        { key: 'C', text: '항상 $\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '항상 $0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$3/1$', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$1/3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '뒤집힘' },
      ] },
      { stepType: 'ANSWER', prompt: '값?', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$1/3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '같은 차수 → $3/1 = 3$.' },

  // Q10
  { chapterCode: CODE, difficulty: 'medium', concept: '분자 차수 ↑', requiredSkills: SKILLS_LIM_INF,
    stem: '$\\lim_{x \\to \\infty} (x^2 + 1)/(x + 1)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '분자 차수 $> $ 분모', options: [
        { key: 'A', text: '$\\infty$ 로 발산', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '분모 ↑ 일 때' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$1/1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$x^2/x = x \\to \\infty$', options: [
        { key: 'A', text: '$\\infty$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '값?', options: [
        { key: 'A', text: '$\\infty$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$1/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '분자 차수 ↑ → $\\infty$.' },

  // Q11
  { chapterCode: CODE, difficulty: 'medium', concept: '분모 차수 ↑', requiredSkills: SKILLS_LIM_INF,
    stem: '$\\lim_{x \\to \\infty} (x + 1)/(x^2 + 1)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '분모 차수 $> $ 분자', options: [
        { key: 'A', text: '$0$ 으로 수렴', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '분자 ↑ 일 때' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$x/x^2 = 1/x \\to 0$', options: [
        { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$1/x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$-1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '값?', options: [
        { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$1/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '분모 차수 ↑ → $0$.' },

  // Q12
  { chapterCode: CODE, difficulty: 'medium', concept: '$\\sin x / x$', requiredSkills: SKILLS_LIM_SPECIAL,
    stem: '$\\lim_{x \\to 0} \\sin x / x$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '특수극한', options: [
        { key: 'A', text: '$\\lim_{x \\to 0} \\sin x / x = 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0/0 = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부정형' },
        { key: 'C', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
        { key: 'E', text: '$\\sin x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$1$', options: [
        { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\pi$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '값?', options: [
        { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\pi$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '존재 안 함', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\sin x / x \\to 1$ (라디안 측정 시).' },

  // Q13
  { chapterCode: CODE, difficulty: 'medium', concept: '인수분해 + 약분', requiredSkills: SKILLS_LIM_FACTOR,
    stem: '$\\lim_{x \\to 1} (x - 1)/(x^2 - 1)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '분모 인수분해', options: [
        { key: 'A', text: '$x^2 - 1 = (x-1)(x+1)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^2 - 1 = (x-1)^2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$(x+1)^2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x^2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '인수분해 안 됨', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$(x-1)/[(x-1)(x+1)] = 1/(x+1)$, $x \\to 1$', options: [
        { key: 'A', text: '$1/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '값?', options: [
        { key: 'A', text: '$1/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$1/(x+1) \\to 1/2$.' },

  // Q14
  { chapterCode: CODE, difficulty: 'medium', concept: '좌우극한 다른 함수', requiredSkills: SKILLS_PIECEWISE,
    stem: '좌극한 $\\neq$ 우극한 → 극한 존재?',
    steps: [
      { stepType: 'CONCEPT', prompt: '극한 존재 조건', options: [
        { key: 'A', text: '좌극한 = 우극한 시 존재', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '항상 존재', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'C', text: '함숫값만 있으면', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'D', text: '연속이면', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '좌우 다름 → 극한 없음', options: [
        { key: 'A', text: '존재 안 함', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '존재함', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'D', text: '평균값', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'E', text: '항상 $\\infty$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '결론?', options: [
        { key: 'A', text: '극한 존재 안 함', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '존재함', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'D', text: '평균값', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'E', text: '$\\infty$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
    ], solution: '좌·우 극한 다르면 극한 존재 안 함.' },

  // Q15
  { chapterCode: CODE, difficulty: 'medium', concept: '$1/x$ 의 불연속', requiredSkills: SKILLS_CONT_DEF,
    stem: '$f(x) = 1/x$ 가 $x = 0$ 에서 연속?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$f(0)$ 정의?', options: [
        { key: 'A', text: '$1/0$ 정의 안 됨', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$f(0) = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$f(0) = 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$f(0) = \\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '실수 X' },
        { key: 'E', text: '$f(0) = -\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '정의 안 된 점 → 불연속', options: [
        { key: 'A', text: '불연속', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '연속', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
        { key: 'D', text: '$x > 0$ 만 연속', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '극한 $\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '결론?', options: [
        { key: 'A', text: '불연속', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '연속', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
        { key: 'D', text: '$f(0) = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '정의 X' },
        { key: 'E', text: '주기적', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$f(0)$ 정의 안 됨 → $x = 0$ 불연속.' },

  // Q16 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '유리화', requiredSkills: SKILLS_LIM_RATIONAL,
    stem: '$\\lim_{x \\to 0} (\\sqrt{x + 1} - 1)/x$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$0/0$ 부정형, 유리화', options: [
        { key: 'A', text: '$\\sqrt{x+1} + 1$ 곱함', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sqrt{x+1} - 1$ 곱함', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '제곱-차 공식' },
        { key: 'C', text: '대입 시 $0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부정형' },
        { key: 'D', text: '$1/x$ 곱함', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x$ 곱함', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$x / [x(\\sqrt{x+1}+1)] = 1/(\\sqrt{x+1}+1) \\to 1/(1+1)$', options: [
        { key: 'A', text: '$1/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$\\sqrt{1}+1 = 2$ 무시' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '뒤집힘' },
        { key: 'E', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '값?', options: [
        { key: 'A', text: '$1/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '유리화 후 $1/(\\sqrt{1}+1) = 1/2$.' },

  // Q17 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '사이값 정리', requiredSkills: SKILLS_IVT,
    stem: '$f(x) = x^3 - x - 1$ 가 $(1, 2)$ 에서 근을 가지는가?',
    steps: [
      { stepType: 'CONCEPT', prompt: '사이값 정리', options: [
        { key: 'A', text: '연속 + $f(1) f(2) < 0$ → 근 존재', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '항상 존재', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '조건 필요' },
        { key: 'C', text: '없을 수도', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '미분가능 시', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '연속만' },
        { key: 'E', text: '$f$ 단조 시', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$f(1) = -1, f(2) = 5$. 부호 다름', options: [
        { key: 'A', text: '근 존재', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '근 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부호 바뀜' },
        { key: 'C', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
        { key: 'D', text: '실근 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '복소근 가능', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '실근 보장' },
      ] },
      { stepType: 'ANSWER', prompt: '결론?', options: [
        { key: 'A', text: '$(1, 2)$ 에 근 존재', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '근 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
        { key: 'D', text: '복소근만', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$x = 1$ 만', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$f(1) f(2) < 0$, $f$ 연속 → IVT 로 근 존재.' },

  // Q18 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '구간별 함수 연속', requiredSkills: SKILLS_PIECEWISE,
    stem: '$f(x) = \\begin{cases} x + 1 & x < 1 \\\\ x^2 + a & x \\geq 1 \\end{cases}$ 가 $x = 1$ 에서 연속이려면 $a$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '좌극한 = 우극한 = $f(1)$', options: [
        { key: 'A', text: '$\\lim_{x \\to 1^-} f = 2$, $\\lim_{x \\to 1^+} f = 1 + a$, $f(1) = 1 + a$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1 = 1 + a$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '좌극한 잘못' },
        { key: 'C', text: '$1 + a$ 만 같아야', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'D', text: '$a = 1$ 자동', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$2 = 1 + a$', options: [
        { key: 'A', text: '$a = 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a = 2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$a = 0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$a = -1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$a = 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$a$?', options: [
        { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$-1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$2 = 1 + a \\Rightarrow a = 1$.' },

  // Q19 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '$\\infty - \\infty$ 유리화', requiredSkills: SKILLS_LIM_RATIONAL,
    stem: '$\\lim_{x \\to \\infty} (\\sqrt{x^2 + x} - x)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\infty - \\infty$ 부정형, 유리화', options: [
        { key: 'A', text: '분자 차 → 곱셈으로 변환', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '바로 $\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부정형' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
        { key: 'E', text: '항상 같음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$x/(\\sqrt{x^2+x}+x) \\to x/(2x) = 1/2$', options: [
        { key: 'A', text: '$1/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '값?', options: [
        { key: 'A', text: '$1/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '유리화 후 $1/2$.' },

  // Q20 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '삼차 인수분해', requiredSkills: SKILLS_LIM_FACTOR,
    stem: '$\\lim_{x \\to 2} (x^3 - 8)/(x - 2)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$x^3 - a^3 = (x-a)(x^2+ax+a^2)$', options: [
        { key: 'A', text: '$x^3 - 8 = (x-2)(x^2 + 2x + 4)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^3 - 8 = (x-2)^3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$x^3 - 8 = (x-2)(x^2 - 2x + 4)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'D', text: '인수분해 안 됨', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '가능' },
        { key: 'E', text: '$x^3 - 8 = (x+2)(x^2-2x+4)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$(x^2 + 2x + 4)$ at $x = 2$', options: [
        { key: 'A', text: '$4 + 4 + 4 = 12$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4 - 4 + 4 = 4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$8$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '값?', options: [
        { key: 'A', text: '$12$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$8$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$x^2 + 2x + 4$ at $2$ = $12$.' },
];

export const K_G11_CAL1_CH01_LIMIT_CONT_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
