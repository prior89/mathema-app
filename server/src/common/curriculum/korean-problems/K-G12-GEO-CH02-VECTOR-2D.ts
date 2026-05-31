/**
 * K-G12-GEO-CH02-VECTOR-2D (평면 벡터) — 20문제 3-step Mastery.
 * 고3 기하 — 벡터 (크기·방향) → 합·차·스칼라 곱 → 단위벡터 →
 *   내적 ($\vec{a} \cdot \vec{b} = a_1 b_1 + a_2 b_2 = |\vec{a}||\vec{b}|\cos\theta$) →
 *   수직 ($\cdot = 0$) / 평행 ($\vec{b} = k\vec{a}$) 조건.
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 * 주요 errorCode:
 *   FORMULA_SELECTION_ERROR 8 / ALGEBRA_ERROR 6
 *   CONCEPT_MISUNDERSTANDING 4 / SIGN_ERROR 2
 *
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G12-GEO-CH02-VECTOR-2D';
const SKILLS_MAG = ['vector_magnitude'];
const SKILLS_OP = ['vector_operations'];
const SKILLS_UNIT = ['unit_vector'];
const SKILLS_DOT = ['dot_product'];
const SKILLS_PERP = ['perpendicular_condition'];
const SKILLS_PAR = ['parallel_condition'];
const SKILLS_ANGLE = ['angle_between_vectors'];
const SKILLS_IDENT = ['vector_identity'];

const problems: KoreanProblemSeed[] = [
  // Q1
  { chapterCode: CODE, difficulty: 'easy', concept: '벡터 크기', requiredSkills: SKILLS_MAG,
    stem: '$\\vec{a} = (3, 4)$ 의 크기 $|\\vec{a}|$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$|\\vec{a}| = \\sqrt{a_1^2 + a_2^2}$', options: [
        { key: 'A', text: '$\\sqrt{9 + 16}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3 + 4 = 7$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
        { key: 'C', text: '$3 \\cdot 4 = 12$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱' },
        { key: 'D', text: '$\\sqrt{3 + 4}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱 누락' },
        { key: 'E', text: '$3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\sqrt{25}$', options: [
        { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$25$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '제곱근 누락' },
        { key: 'C', text: '$7$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
        { key: 'D', text: '$12$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱' },
        { key: 'E', text: '$3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$25$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$7$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$12$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\sqrt{9 + 16} = 5$.' },

  // Q2
  { chapterCode: CODE, difficulty: 'easy', concept: '벡터 합', requiredSkills: SKILLS_OP,
    stem: '$\\vec{a} = (1, 2), \\vec{b} = (3, 4)$. $\\vec{a} + \\vec{b}$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '성분별 합', options: [
        { key: 'A', text: '$(1+3, 2+4)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(1 \\cdot 3, 2 \\cdot 4)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱' },
        { key: 'C', text: '$(3 - 1, 4 - 2)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '차' },
        { key: 'D', text: '$1 + 3 + 2 + 4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(1, 4)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$(4, 6)$', options: [
        { key: 'A', text: '$(4, 6)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(3, 8)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱' },
        { key: 'C', text: '$(2, 2)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '차' },
        { key: 'D', text: '$10$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(4, 4)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$(4, 6)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(3, 8)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$(2, 2)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$10$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(4, 4)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(4, 6)$.' },

  // Q3
  { chapterCode: CODE, difficulty: 'easy', concept: '스칼라 곱', requiredSkills: SKILLS_OP,
    stem: '$\\vec{a} = (1, 2)$. $2 \\vec{a}$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '모든 성분 × 2', options: [
        { key: 'A', text: '$(2 \\cdot 1, 2 \\cdot 2)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(2, 2)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '한쪽만' },
        { key: 'C', text: '$2 + (1, 2)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
        { key: 'D', text: '$(1, 2)^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sqrt{5}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$(2, 4)$', options: [
        { key: 'A', text: '$(2, 4)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(2, 2)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$(3, 4)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(1, 4)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(4, 8)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$\\times 4$' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$(2, 4)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(2, 2)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$(3, 4)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(1, 4)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(4, 8)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(2, 4)$.' },

  // Q4
  { chapterCode: CODE, difficulty: 'easy', concept: '내적 공식', requiredSkills: SKILLS_DOT,
    stem: '$\\vec{a} \\cdot \\vec{b}$ 의 성분 표현?',
    steps: [
      { stepType: 'CONCEPT', prompt: '성분 곱의 합', options: [
        { key: 'A', text: '$a_1 b_1 + a_2 b_2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a_1 b_2 + a_2 b_1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '바뀜' },
        { key: 'C', text: '$a_1 a_2 + b_1 b_2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(a_1 + a_2)(b_1 + b_2)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$|a||b|$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\cos$ 누락' },
      ] },
      { stepType: 'PROCESS', prompt: '$a_1 b_1 + a_2 b_2$', options: [
        { key: 'A', text: '$a_1 b_1 + a_2 b_2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a_1 b_2 + a_2 b_1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$|a||b|$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(a_1 b_1)(a_2 b_2)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$a_1 + b_1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$a_1 b_1 + a_2 b_2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a_1 b_2 + a_2 b_1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$|a||b|$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(a_1 + a_2)(b_1 + b_2)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$a_1 - b_1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\vec{a} \\cdot \\vec{b} = a_1 b_1 + a_2 b_2$.' },

  // Q5
  { chapterCode: CODE, difficulty: 'easy', concept: '수직 조건', requiredSkills: SKILLS_PERP,
    stem: '두 영 아닌 벡터가 수직일 조건?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\cos 90° = 0$', options: [
        { key: 'A', text: '$\\vec{a} \\cdot \\vec{b} = 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$|\\vec{a}| = |\\vec{b}|$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$\\vec{a} = \\vec{b}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\vec{a} + \\vec{b} = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$\\vec{a} \\cdot \\vec{b} = 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\vec{a} \\cdot \\vec{b} = 0$', options: [
        { key: 'A', text: '$\\vec{a} \\cdot \\vec{b} = 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\vec{a} \\cdot \\vec{b} = 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$\\vec{a} = \\vec{b}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\vec{a} = -\\vec{b}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$|\\vec{a}| = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$\\vec{a} \\cdot \\vec{b} = 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\vec{a} \\cdot \\vec{b} = 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$\\vec{a} = \\vec{b}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\vec{a} = -\\vec{b}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$|\\vec{a}| = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\vec{a} \\cdot \\vec{b} = 0$.' },

  // Q6
  { chapterCode: CODE, difficulty: 'easy', concept: '기저벡터 내적', requiredSkills: SKILLS_DOT,
    stem: '$\\vec{a} = (1, 0), \\vec{b} = (0, 1)$. $\\vec{a} \\cdot \\vec{b}$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$1 \\cdot 0 + 0 \\cdot 1$', options: [
        { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$-1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$0$ (수직)', options: [
        { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$-1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sqrt{2}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$-1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sqrt{2}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$x$축과 $y$축 단위벡터 → 수직 → 내적 $0$.' },

  // Q7
  { chapterCode: CODE, difficulty: 'medium', concept: '단위벡터', requiredSkills: SKILLS_UNIT,
    stem: '$\\vec{a} = (3, 4)$ 의 단위벡터?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\vec{a}/|\\vec{a}|, |\\vec{a}| = 5$', options: [
        { key: 'A', text: '$(3/5, 4/5)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(3, 4)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '나누기 누락' },
        { key: 'C', text: '$(5/3, 5/4)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '뒤집힘' },
        { key: 'D', text: '$(1, 1)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(3, 4)$ 그대로', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$(3/5, 4/5)$', options: [
        { key: 'A', text: '$(3/5, 4/5)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(3, 4)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$(5/3, 5/4)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(1, 1)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(3/25, 4/25)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$|a|^2$' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$(3/5, 4/5)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(3, 4)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$(5/3, 5/4)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(1, 1)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(3/25, 4/25)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\vec{a}/|\\vec{a}| = (3/5, 4/5)$.' },

  // Q8
  { chapterCode: CODE, difficulty: 'medium', concept: '벡터 차', requiredSkills: SKILLS_OP,
    stem: '$\\vec{a} = (1, 2), \\vec{b} = (3, 1)$. $\\vec{a} - \\vec{b}$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '성분별 차', options: [
        { key: 'A', text: '$(1-3, 2-1)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(3-1, 1-2)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$\\vec{b}-\\vec{a}$' },
        { key: 'C', text: '$(1+3, 2+1)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '합' },
        { key: 'D', text: '$|\\vec{a}-\\vec{b}|$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '크기 아님' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$(-2, 1)$', options: [
        { key: 'A', text: '$(-2, 1)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(2, -1)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$(4, 3)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '합' },
        { key: 'D', text: '$(-2, -1)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(2, 1)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$(-2, 1)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(2, -1)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$(4, 3)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(-2, -1)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(2, 1)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(-2, 1)$.' },

  // Q9
  { chapterCode: CODE, difficulty: 'medium', concept: '내적 계산', requiredSkills: SKILLS_DOT,
    stem: '$\\vec{a} = (2, 3), \\vec{b} = (4, 1)$. $\\vec{a} \\cdot \\vec{b}$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$2 \\cdot 4 + 3 \\cdot 1$', options: [
        { key: 'A', text: '$8 + 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2 \\cdot 1 + 3 \\cdot 4 = 14$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '바뀜' },
        { key: 'C', text: '$(2+3)(4+1) = 25$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$8 \\cdot 3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2 + 4 + 3 + 1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$11$', options: [
        { key: 'A', text: '$11$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$14$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$25$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$24$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱' },
        { key: 'E', text: '$10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$11$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$14$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$25$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$24$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$2 \\cdot 4 + 3 \\cdot 1 = 11$.' },

  // Q10
  { chapterCode: CODE, difficulty: 'medium', concept: '수직 내적', requiredSkills: SKILLS_DOT,
    stem: '$\\vec{a} = (1, 1), \\vec{b} = (1, -1)$. 내적 및 관계?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$1 + (-1)$', options: [
        { key: 'A', text: '$0$ → 수직', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$-2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '평행', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$0$', options: [
        { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$-2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sqrt{2}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '크기' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$0$, 수직', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$-2$, 반평행', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '평행', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$1 + (-1) = 0$ → 수직.' },

  // Q11
  { chapterCode: CODE, difficulty: 'medium', concept: '내적 각도 표현', requiredSkills: SKILLS_DOT,
    stem: '$|\\vec{a}| = 2, |\\vec{b}| = 3$, 사이각 $60°$. $\\vec{a} \\cdot \\vec{b}$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$|\\vec{a}||\\vec{b}|\\cos\\theta$', options: [
        { key: 'A', text: '$2 \\cdot 3 \\cdot \\cos 60°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2 \\cdot 3 \\cdot \\sin 60°$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\sin$ 아님' },
        { key: 'C', text: '$2 + 3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2 \\cdot 3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\cos$ 누락' },
        { key: 'E', text: '$\\cos 60°$ 만', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$2 \\cdot 3 \\cdot 1/2$', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$\\cos$ 무시' },
        { key: 'C', text: '$\\sqrt{3} \\cdot 3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\sin 60°$' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1/2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$3\\sqrt{3}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1/2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$2 \\cdot 3 \\cdot 1/2 = 3$.' },

  // Q12
  { chapterCode: CODE, difficulty: 'medium', concept: '평행 조건', requiredSkills: SKILLS_PAR,
    stem: '두 영 아닌 벡터의 평행 조건?',
    steps: [
      { stepType: 'CONCEPT', prompt: '한 벡터가 다른 것의 스칼라 배', options: [
        { key: 'A', text: '$\\vec{b} = k \\vec{a}$ ($k \\neq 0$)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\vec{a} \\cdot \\vec{b} = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '수직' },
        { key: 'C', text: '$|\\vec{a}| = |\\vec{b}|$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\vec{a} + \\vec{b} = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$\\vec{a} = \\vec{b}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '동일' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\vec{b} = k \\vec{a}$', options: [
        { key: 'A', text: '$\\vec{b} = k \\vec{a}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\vec{a} \\cdot \\vec{b} = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$|\\vec{a}| = |\\vec{b}|$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\vec{a} - \\vec{b} = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '같은 방향', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$\\vec{b} = k \\vec{a}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\vec{a} \\cdot \\vec{b} = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$|\\vec{a}| = |\\vec{b}|$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\vec{a} - \\vec{b} = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$\\vec{a} = \\vec{b}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\vec{b} = k \\vec{a}$.' },

  // Q13
  { chapterCode: CODE, difficulty: 'medium', concept: '평행 판정', requiredSkills: SKILLS_PAR,
    stem: '$\\vec{a} = (1, 2), \\vec{b} = (2, 4)$. 평행?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\vec{b} = 2 \\vec{a}$?', options: [
        { key: 'A', text: '예, $k = 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '아니오', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\vec{b}=2\\vec{a}$' },
        { key: 'C', text: '수직 (내적 $0$)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
        { key: 'E', text: '같은 벡터', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '평행', options: [
        { key: 'A', text: '평행', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '수직', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '같음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '반대', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '평행', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '수직', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '같음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '반대', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
    ], solution: '$\\vec{b} = 2 \\vec{a}$ → 평행.' },

  // Q14
  { chapterCode: CODE, difficulty: 'medium', concept: '사이각 ($45°$)', requiredSkills: SKILLS_ANGLE,
    stem: '$\\vec{a} = (1, 0), \\vec{b} = (1, 1)$. 사이각?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\cos\\theta = (\\vec{a} \\cdot \\vec{b})/(|\\vec{a}||\\vec{b}|)$', options: [
        { key: 'A', text: '$1/(1 \\cdot \\sqrt{2}) = 1/\\sqrt{2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\vec{a} \\cdot \\vec{b} = 1$ 만', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '나누기 누락' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '수직 아님' },
        { key: 'D', text: '$\\sqrt{2}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '뒤집힘' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\cos^{-1}(1/\\sqrt{2})$', options: [
        { key: 'A', text: '$45°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$30°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$60°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$90°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$45°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$30°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$60°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$90°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\cos\\theta = 1/\\sqrt{2}$ → $45°$.' },

  // Q15
  { chapterCode: CODE, difficulty: 'medium', concept: '$|\\vec{a}+\\vec{b}|^2$', requiredSkills: SKILLS_IDENT,
    stem: '$|\\vec{a} + \\vec{b}|^2 = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$(\\vec{a}+\\vec{b}) \\cdot (\\vec{a}+\\vec{b})$', options: [
        { key: 'A', text: '$|\\vec{a}|^2 + 2 \\vec{a} \\cdot \\vec{b} + |\\vec{b}|^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$|\\vec{a}|^2 + |\\vec{b}|^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '교차항 누락' },
        { key: 'C', text: '$(|\\vec{a}| + |\\vec{b}|)^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$|\\vec{a}|^2 - 2 \\vec{a} \\cdot \\vec{b} + |\\vec{b}|^2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$|\\vec{a}-\\vec{b}|^2$' },
        { key: 'E', text: '$\\vec{a} \\cdot \\vec{b}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$|\\vec{a}|^2 + 2 \\vec{a} \\cdot \\vec{b} + |\\vec{b}|^2$', options: [
        { key: 'A', text: '$|\\vec{a}|^2 + 2 \\vec{a} \\cdot \\vec{b} + |\\vec{b}|^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$|\\vec{a}|^2 + |\\vec{b}|^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$(|\\vec{a}| + |\\vec{b}|)^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$|\\vec{a}|^2 - |\\vec{b}|^2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\vec{a} + \\vec{b}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$|\\vec{a}|^2 + 2 \\vec{a} \\cdot \\vec{b} + |\\vec{b}|^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$|\\vec{a}|^2 + |\\vec{b}|^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$(|\\vec{a}| + |\\vec{b}|)^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$|\\vec{a}|^2 - 2 \\vec{a} \\cdot \\vec{b} + |\\vec{b}|^2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\vec{a} \\cdot \\vec{b}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(\\vec{a}+\\vec{b}) \\cdot (\\vec{a}+\\vec{b}) = |\\vec{a}|^2 + 2 \\vec{a} \\cdot \\vec{b} + |\\vec{b}|^2$.' },

  // Q16 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '수직 조건으로 $k$', requiredSkills: SKILLS_PERP,
    stem: '$\\vec{a} = (k, 2), \\vec{b} = (3, 1)$ 수직. $k$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\vec{a} \\cdot \\vec{b} = 0$', options: [
        { key: 'A', text: '$3k + 2 = 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3k - 2 = 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$k + 2 \\cdot 3 = 0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$k \\cdot 3 \\cdot 2 \\cdot 1 = 0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$k = 3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$k = -2/3$', options: [
        { key: 'A', text: '$-2/3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2/3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$-3/2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '뒤집힘' },
        { key: 'D', text: '$3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$-2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$-2/3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2/3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$-3/2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$-2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$3k + 2 = 0 \\Rightarrow k = -2/3$.' },

  // Q17 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '$\\vec{AB}$ 크기', requiredSkills: SKILLS_MAG,
    stem: '$A(1, 2), B(4, 6)$. $|\\vec{AB}|$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\vec{AB} = B - A = (3, 4)$', options: [
        { key: 'A', text: '$\\sqrt{3^2 + 4^2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3 + 4 = 7$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
        { key: 'C', text: '$3 \\cdot 4 = 12$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱' },
        { key: 'D', text: '$A + B = (5, 8)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합' },
        { key: 'E', text: '$\\vec{AB}$ 자체', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\sqrt{25}$', options: [
        { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$25$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$7$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$12$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sqrt{5}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$25$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$7$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$12$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sqrt{5}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\vec{AB} = (3, 4), |\\vec{AB}| = 5$.' },

  // Q18 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '$\\vec{a} \\cdot \\vec{a}$', requiredSkills: SKILLS_IDENT,
    stem: '$\\vec{a} \\cdot \\vec{a} = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '$|\\vec{a}||\\vec{a}|\\cos 0$', options: [
        { key: 'A', text: '$|\\vec{a}|^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$|\\vec{a}|$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2 \\vec{a}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '수직 아님' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$|\\vec{a}|^2$', options: [
        { key: 'A', text: '$|\\vec{a}|^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$|\\vec{a}|$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2 |\\vec{a}|$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$|\\vec{a}|^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$|\\vec{a}|$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2 \\vec{a}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\vec{a} \\cdot \\vec{a} = |\\vec{a}|^2$.' },

  // Q19 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '사이각 $\\cos$ 계산', requiredSkills: SKILLS_ANGLE,
    stem: '$\\vec{a} = (2, 1), \\vec{b} = (1, 3)$. 사이각 $\\theta$ 의 $\\cos\\theta$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '내적·크기', options: [
        { key: 'A', text: '$\\vec{a} \\cdot \\vec{b} = 5, |\\vec{a}| = \\sqrt{5}, |\\vec{b}| = \\sqrt{10}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\vec{a} \\cdot \\vec{b} = 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$2 + 3 = 5$' },
        { key: 'C', text: '$|\\vec{a}| = 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$|\\vec{b}| = 4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$5/(\\sqrt{5}\\sqrt{10}) = 5/\\sqrt{50} = 1/\\sqrt{2}$', options: [
        { key: 'A', text: '$1/\\sqrt{2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\sqrt{2}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '뒤집힘' },
        { key: 'D', text: '$1/5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$\\cos\\theta$?', options: [
        { key: 'A', text: '$1/\\sqrt{2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\sqrt{2}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1/5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\cos\\theta = 5/\\sqrt{50} = 1/\\sqrt{2}$ ($\\theta = 45°$).' },

  // Q20 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '$\\vec{a}+\\vec{b}$ 와 $\\vec{a}-\\vec{b}$ 수직', requiredSkills: SKILLS_IDENT,
    stem: '$\\vec{a} + \\vec{b}$ 와 $\\vec{a} - \\vec{b}$ 가 수직일 조건?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$(\\vec{a}+\\vec{b}) \\cdot (\\vec{a}-\\vec{b}) = 0$', options: [
        { key: 'A', text: '$|\\vec{a}|^2 - |\\vec{b}|^2 = 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\vec{a} \\cdot \\vec{b} = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$\\vec{a} = \\vec{b}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$|\\vec{a}| + |\\vec{b}| = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$\\vec{a} + \\vec{b} = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$|\\vec{a}| = |\\vec{b}|$', options: [
        { key: 'A', text: '$|\\vec{a}| = |\\vec{b}|$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\vec{a} = \\vec{b}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '크기만' },
        { key: 'C', text: '$\\vec{a} \\cdot \\vec{b} = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\vec{a} = -\\vec{b}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$|\\vec{a}| + |\\vec{b}| = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$|\\vec{a}| = |\\vec{b}|$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\vec{a} = \\vec{b}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$\\vec{a} \\cdot \\vec{b} = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\vec{a} = -\\vec{b}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$\\vec{a} + \\vec{b} = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$(\\vec{a}+\\vec{b}) \\cdot (\\vec{a}-\\vec{b}) = |\\vec{a}|^2 - |\\vec{b}|^2 = 0 \\Rightarrow |\\vec{a}| = |\\vec{b}|$.' },
];

export const K_G12_GEO_CH02_VECTOR_2D_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
