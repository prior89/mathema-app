/**
 * K-G12-GEO-CH03-SPACE-3D (공간도형) — 20문제 3-step Mastery.
 * 고3 기하 — 공간좌표 (거리·중점) → 구의 방정식 → 공간벡터 (크기·합·내적) →
 *   평면의 방정식 ($ax + by + cz = d$, 법선벡터 $(a,b,c)$) → 점-평면 거리.
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 * 주요 errorCode:
 *   FORMULA_SELECTION_ERROR 8 / ALGEBRA_ERROR 6
 *   CONCEPT_MISUNDERSTANDING 4 / SIGN_ERROR 2
 *
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G12-GEO-CH03-SPACE-3D';
const SKILLS_DIST = ['space_distance'];
const SKILLS_MID = ['space_midpoint'];
const SKILLS_SPHERE = ['sphere_equation'];
const SKILLS_VEC_MAG = ['space_vector_magnitude'];
const SKILLS_VEC_OP = ['space_vector_operations'];
const SKILLS_DOT = ['space_dot_product'];
const SKILLS_PLANE = ['plane_equation'];
const SKILLS_NORMAL = ['plane_normal'];
const SKILLS_PT_PLANE = ['point_plane_distance'];
const SKILLS_PAR_PERP = ['vector_parallel_perpendicular'];

const problems: KoreanProblemSeed[] = [
  // Q1
  { chapterCode: CODE, difficulty: 'easy', concept: '공간거리', requiredSkills: SKILLS_DIST,
    stem: '$A(1, 2, 3), B(4, 6, 3)$ 사이 거리?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\sqrt{\\Delta x^2 + \\Delta y^2 + \\Delta z^2}$', options: [
        { key: 'A', text: '$\\sqrt{9 + 16 + 0}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sqrt{9 + 16}$ (z 무시)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\Delta z = 0$ 자체는 포함' },
        { key: 'C', text: '$3 + 4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\sqrt{3 + 4 + 0}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱 누락' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\sqrt{25}$', options: [
        { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$25$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '제곱근 누락' },
        { key: 'C', text: '$7$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
        { key: 'D', text: '$3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$25$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$7$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\sqrt{(4-1)^2 + (6-2)^2 + 0} = 5$.' },

  // Q2
  { chapterCode: CODE, difficulty: 'easy', concept: '원점 거리', requiredSkills: SKILLS_DIST,
    stem: '원점과 $(1, 2, 2)$ 의 거리?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\sqrt{1 + 4 + 4}$', options: [
        { key: 'A', text: '$\\sqrt{9}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1 + 2 + 2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
        { key: 'C', text: '$\\sqrt{1+2+2}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱 누락' },
        { key: 'D', text: '$4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\sqrt{9}$', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '제곱근' },
        { key: 'C', text: '$5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
        { key: 'D', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\sqrt{1+4+4} = 3$.' },

  // Q3
  { chapterCode: CODE, difficulty: 'easy', concept: '구 중심', requiredSkills: SKILLS_SPHERE,
    stem: '$(x-1)^2 + (y-2)^2 + (z-3)^2 = 9$ 의 중심?',
    steps: [
      { stepType: 'CONCEPT', prompt: '표준형', options: [
        { key: 'A', text: '$(1, 2, 3)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(-1, -2, -3)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$(x-a)$' },
        { key: 'C', text: '$(9, 9, 9)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$r^2$' },
        { key: 'D', text: '$(0, 0, 0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$(3, 2, 1)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '바뀜' },
      ] },
      { stepType: 'PROCESS', prompt: '$(1, 2, 3)$', options: [
        { key: 'A', text: '$(1, 2, 3)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(-1, -2, -3)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$(9, 9, 9)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$(0, 0, 0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$(3, 2, 1)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$(1, 2, 3)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(-1, -2, -3)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$(9, 9, 9)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$(0, 0, 0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$(3, 2, 1)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '중심 $(1, 2, 3)$.' },

  // Q4
  { chapterCode: CODE, difficulty: 'easy', concept: '구 반지름', requiredSkills: SKILLS_SPHERE,
    stem: '같은 구 ($r^2 = 9$) 의 반지름?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$r = \\sqrt{9}$', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '제곱근' },
        { key: 'C', text: '$81$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sqrt{9}$ 그대로', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '계산' },
      ] },
      { stepType: 'PROCESS', prompt: '$3$', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$81$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1/3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$81$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1/3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$r = 3$.' },

  // Q5
  { chapterCode: CODE, difficulty: 'easy', concept: '공간벡터 크기', requiredSkills: SKILLS_VEC_MAG,
    stem: '$\\vec{a} = (1, 2, 3)$ 의 크기?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\sqrt{a_1^2 + a_2^2 + a_3^2}$', options: [
        { key: 'A', text: '$\\sqrt{1 + 4 + 9}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1 + 2 + 3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
        { key: 'C', text: '$\\sqrt{6}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱 안 함' },
        { key: 'D', text: '$\\sqrt{1 \\cdot 2 \\cdot 3}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱' },
        { key: 'E', text: '$6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\sqrt{14}$', options: [
        { key: 'A', text: '$\\sqrt{14}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$14$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '제곱근' },
        { key: 'C', text: '$6$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
        { key: 'D', text: '$\\sqrt{6}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$\\sqrt{14}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$14$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$6$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\sqrt{6}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\sqrt{1+4+9} = \\sqrt{14}$.' },

  // Q6
  { chapterCode: CODE, difficulty: 'easy', concept: '공간 중점', requiredSkills: SKILLS_MID,
    stem: '두 점 $(0,0,0), (2, 4, 6)$ 의 중점?',
    steps: [
      { stepType: 'CONCEPT', prompt: '성분별 평균', options: [
        { key: 'A', text: '$(1, 2, 3)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(2, 4, 6)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '나누기 누락' },
        { key: 'C', text: '$(0, 0, 0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$(1, 1, 1)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(3, 6, 9)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$(1, 2, 3)$', options: [
        { key: 'A', text: '$(1, 2, 3)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(2, 4, 6)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$(0, 0, 0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$(1, 1, 1)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(3, 6, 9)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$(1, 2, 3)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(2, 4, 6)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$(0, 0, 0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$(1, 1, 1)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(3, 6, 9)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(1, 2, 3)$.' },

  // Q7
  { chapterCode: CODE, difficulty: 'medium', concept: '공간 내적', requiredSkills: SKILLS_DOT,
    stem: '$\\vec{a} = (1, 2, 3), \\vec{b} = (2, 0, 1)$. $\\vec{a} \\cdot \\vec{b}$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$a_1 b_1 + a_2 b_2 + a_3 b_3$', options: [
        { key: 'A', text: '$1 \\cdot 2 + 2 \\cdot 0 + 3 \\cdot 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1 + 2 + 3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱 아님' },
        { key: 'C', text: '$1 \\cdot 2 \\cdot 3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(1+2)(2+0)(3+1)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sqrt{14} \\cdot \\sqrt{5}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\cos$ 누락' },
      ] },
      { stepType: 'PROCESS', prompt: '$2 + 0 + 3$', options: [
        { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$11$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$11$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$2 + 0 + 3 = 5$.' },

  // Q8
  { chapterCode: CODE, difficulty: 'medium', concept: '공간 벡터 합', requiredSkills: SKILLS_VEC_OP,
    stem: '같은 $\\vec{a}, \\vec{b}$. $\\vec{a} + \\vec{b}$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '성분별 합', options: [
        { key: 'A', text: '$(1+2, 2+0, 3+1)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(1 \\cdot 2, 2 \\cdot 0, 3 \\cdot 1)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱' },
        { key: 'C', text: '$6 = 1+2+3+0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(2, 0, 1)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '한쪽만' },
        { key: 'E', text: '$\\sqrt{14}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '크기' },
      ] },
      { stepType: 'PROCESS', prompt: '$(3, 2, 4)$', options: [
        { key: 'A', text: '$(3, 2, 4)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(2, 0, 3)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱' },
        { key: 'C', text: '$(3, 4, 5)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(-1, 2, 2)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$\\vec{a}-\\vec{b}$' },
        { key: 'E', text: '$9$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$(3, 2, 4)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(2, 0, 3)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$(3, 4, 5)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(-1, 2, 2)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$9$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(3, 2, 4)$.' },

  // Q9
  { chapterCode: CODE, difficulty: 'medium', concept: '벡터 크기 ($1,2,2$)', requiredSkills: SKILLS_VEC_MAG,
    stem: '$\\vec{a} = (1, 2, 2)$ 의 크기?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\sqrt{1 + 4 + 4}$', options: [
        { key: 'A', text: '$\\sqrt{9}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1 + 2 + 2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
        { key: 'C', text: '$\\sqrt{5}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\sqrt{1+2+2}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱 누락' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$3$', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\sqrt{5}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\sqrt{5}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\sqrt{1+4+4} = 3$.' },

  // Q10
  { chapterCode: CODE, difficulty: 'medium', concept: '평면 법선벡터', requiredSkills: SKILLS_NORMAL,
    stem: '평면 $x + 2y + 3z = 6$ 의 법선벡터?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$ax+by+cz=d$ → 법선 $(a,b,c)$', options: [
        { key: 'A', text: '$(1, 2, 3)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(6, 6, 6)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$d$ 자체' },
        { key: 'C', text: '$(-1, -2, -3)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(1, 1, 1)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$(0, 0, 6)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$(1, 2, 3)$', options: [
        { key: 'A', text: '$(1, 2, 3)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(6, 6, 6)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$(-1, -2, -3)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(1, 1, 1)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$(0, 0, 6)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$(1, 2, 3)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(6, 6, 6)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$(-1, -2, -3)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(1, 1, 1)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$(0, 0, 6)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$x+2y+3z = d$ 의 법선벡터는 $(1, 2, 3)$.' },

  // Q11
  { chapterCode: CODE, difficulty: 'medium', concept: '평면 방정식 구성', requiredSkills: SKILLS_PLANE,
    stem: '점 $(1, 0, 0)$ 을 지나고 법선 $(1, 1, 1)$ 인 평면?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$a(x-x_0) + b(y-y_0) + c(z-z_0) = 0$', options: [
        { key: 'A', text: '$(x-1) + y + z = 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x + y + z = 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '점 무시' },
        { key: 'C', text: '$x - y - z = 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x = 1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$y + z = 1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$x + y + z = 1$', options: [
        { key: 'A', text: '$x + y + z = 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x + y + z = 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '점 미반영' },
        { key: 'C', text: '$x = 1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x + y + z = 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$y + z = 0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$x + y + z = 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x + y + z = 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'C', text: '$x = 1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x + y + z = 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$y + z = 0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(x-1) + y + z = 0 \\Rightarrow x + y + z = 1$.' },

  // Q12
  { chapterCode: CODE, difficulty: 'medium', concept: '수직 조건', requiredSkills: SKILLS_PAR_PERP,
    stem: '공간 벡터 $\\vec{a}, \\vec{b}$ 수직 조건?',
    steps: [
      { stepType: 'CONCEPT', prompt: '내적 $0$', options: [
        { key: 'A', text: '$\\vec{a} \\cdot \\vec{b} = 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$|\\vec{a}| = |\\vec{b}|$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$\\vec{a} = \\vec{b}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\vec{a} + \\vec{b} = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$\\vec{a} \\cdot \\vec{b} = 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\vec{a} \\cdot \\vec{b} = 0$', options: [
        { key: 'A', text: '$\\vec{a} \\cdot \\vec{b} = 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\vec{a} \\cdot \\vec{b} = 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$\\vec{a} + \\vec{b} = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\vec{a} = -\\vec{b}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$\\vec{a} \\cdot \\vec{b} = 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\vec{a} \\cdot \\vec{b} = 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$\\vec{a} + \\vec{b} = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$|\\vec{a}| = |\\vec{b}|$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$\\vec{a} = \\vec{b}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\vec{a} \\cdot \\vec{b} = 0$ (2D 와 동일).' },

  // Q13
  { chapterCode: CODE, difficulty: 'medium', concept: '원점 구 반지름', requiredSkills: SKILLS_SPHERE,
    stem: '$x^2 + y^2 + z^2 = 25$ 의 반지름?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$r^2 = 25$', options: [
        { key: 'A', text: '$r = 5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$r = 25$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '제곱근' },
        { key: 'C', text: '$r = 12.5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$/2$' },
        { key: 'D', text: '$r = \\sqrt{5}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$r = 0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$5$', options: [
        { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$25$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$12.5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\sqrt{5}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$25$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$12.5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\sqrt{5}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$r = 5$.' },

  // Q14
  { chapterCode: CODE, difficulty: 'medium', concept: '공간 중점 (일반)', requiredSkills: SKILLS_MID,
    stem: '$A(1,2,3), B(3,4,5)$ 중점?',
    steps: [
      { stepType: 'CONCEPT', prompt: '성분별 평균', options: [
        { key: 'A', text: '$((1+3)/2, (2+4)/2, (3+5)/2)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(1+3, 2+4, 3+5)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '나누기 누락' },
        { key: 'C', text: '$(3-1, 4-2, 5-3)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '차' },
        { key: 'D', text: '$(1 \\cdot 3, 2 \\cdot 4, 3 \\cdot 5)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱' },
        { key: 'E', text: '$(2, 4, 6)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$(2, 3, 4)$', options: [
        { key: 'A', text: '$(2, 3, 4)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(4, 6, 8)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
        { key: 'C', text: '$(2, 2, 2)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '차' },
        { key: 'D', text: '$(3, 8, 15)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(1, 1, 1)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$(2, 3, 4)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(4, 6, 8)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$(2, 2, 2)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(3, 8, 15)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(1, 1, 1)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(2, 3, 4)$.' },

  // Q15
  { chapterCode: CODE, difficulty: 'medium', concept: '점이 평면 위', requiredSkills: SKILLS_PLANE,
    stem: '점 $(1, 1, 1)$ 이 평면 $x + y + z = 3$ 위에 있는가?',
    steps: [
      { stepType: 'CONCEPT', prompt: '대입 검증', options: [
        { key: 'A', text: '$1 + 1 + 1 = 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1 \\cdot 1 \\cdot 1 = 1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱' },
        { key: 'C', text: '대입 안 함', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$1^2 + 1^2 + 1^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$3 = 3$', options: [
        { key: 'A', text: '평면 위', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '평면 위 아님', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
        { key: 'D', text: '평행', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '원점', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '평면 위', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '평면 위 아님', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
        { key: 'D', text: '평행', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '원점', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$1+1+1 = 3$ → 평면 위.' },

  // Q16 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '점-평면 거리', requiredSkills: SKILLS_PT_PLANE,
    stem: '점 $(2, 1, 3)$ 과 평면 $2x - y + 2z - 4 = 0$ 의 거리?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$|a x_0 + b y_0 + c z_0 + d|/\\sqrt{a^2+b^2+c^2}$', options: [
        { key: 'A', text: '$|4 - 1 + 6 - 4|/\\sqrt{4+1+4}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$|4 + 1 + 6|/3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2 - 1 + 3 - 4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '대입 잘못' },
        { key: 'D', text: '$\\sqrt{(2)^2 + 1^2 + 3^2}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '원점거리' },
        { key: 'E', text: '$|d|/\\sqrt{a^2+b^2}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '2D' },
      ] },
      { stepType: 'PROCESS', prompt: '$|5|/3$', options: [
        { key: 'A', text: '$5/3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5/9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '제곱근 누락' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$3/5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '뒤집힘' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$5/3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5/9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$3/5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$|2 \\cdot 2 - 1 + 2 \\cdot 3 - 4|/3 = 5/3$.' },

  // Q17 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '두 평면 사이 각', requiredSkills: SKILLS_PLANE,
    stem: '두 평면 $x + y + z = 1, x - y + z = 1$ 사이 각의 $\\cos$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '법선벡터 사이 각', options: [
        { key: 'A', text: '$\\vec{n_1} = (1,1,1), \\vec{n_2} = (1,-1,1)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '평면 그대로 사용', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '법선 사용' },
        { key: 'C', text: '$\\vec{n} = (1, 0, 0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\vec{n_1} \\cdot \\vec{n_2} = 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$1-1+1=1$' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\vec{n_1} \\cdot \\vec{n_2} = 1$, $|\\vec{n_1}| = |\\vec{n_2}| = \\sqrt{3}$', options: [
        { key: 'A', text: '$1/(\\sqrt{3} \\sqrt{3}) = 1/3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3/3 = 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1/\\sqrt{3}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sqrt{3}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$1/3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1/\\sqrt{3}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sqrt{3}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\cos\\theta = 1/3$.' },

  // Q18 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '$\\vec{AB}$ 크기 (3D)', requiredSkills: SKILLS_VEC_MAG,
    stem: '$A(1,2,3), B(4, 6, 7)$. $|\\vec{AB}|$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\vec{AB} = (3, 4, 4)$', options: [
        { key: 'A', text: '$\\sqrt{9 + 16 + 16}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3 + 4 + 4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
        { key: 'C', text: '$\\sqrt{3+4+4}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱 누락' },
        { key: 'D', text: '$3 \\cdot 4 \\cdot 4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱' },
        { key: 'E', text: '$|A| + |B|$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\sqrt{41}$', options: [
        { key: 'A', text: '$\\sqrt{41}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$41$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '제곱근 누락' },
        { key: 'C', text: '$11$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
        { key: 'D', text: '$\\sqrt{11}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$48$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$\\sqrt{41}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$41$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$11$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\sqrt{11}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$48$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\sqrt{9+16+16} = \\sqrt{41}$.' },

  // Q19 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '구의 방정식 구성', requiredSkills: SKILLS_SPHERE,
    stem: '중심 $(1, 2, 3)$, 반지름 $4$ 인 구의 방정식?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$(x-a)^2 + (y-b)^2 + (z-c)^2 = r^2$', options: [
        { key: 'A', text: '$(x-1)^2 + (y-2)^2 + (z-3)^2 = 16$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(x-1)^2 + (y-2)^2 + (z-3)^2 = 4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$r^2$ 누락' },
        { key: 'C', text: '$(x+1)^2 + (y+2)^2 + (z+3)^2 = 16$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'D', text: '$x^2 + y^2 + z^2 = 16$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원점' },
        { key: 'E', text: '$x + y + z = 4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '평면' },
      ] },
      { stepType: 'PROCESS', prompt: '$r^2 = 16$', options: [
        { key: 'A', text: '$(x-1)^2 + (y-2)^2 + (z-3)^2 = 16$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(x-1)^2 + (y-2)^2 + (z-3)^2 = 4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$(x+1)^2 + (y+2)^2 + (z+3)^2 = 16$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x^2 + y^2 + z^2 = 16$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$x + y + z = 4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$(x-1)^2 + (y-2)^2 + (z-3)^2 = 16$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(x-1)^2 + (y-2)^2 + (z-3)^2 = 4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$(x+1)^2 + (y+2)^2 + (z+3)^2 = 16$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x^2 + y^2 + z^2 = 16$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$x + y + z = 4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(x-1)^2 + (y-2)^2 + (z-3)^2 = 16$.' },

  // Q20 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '공간 벡터 평행', requiredSkills: SKILLS_PAR_PERP,
    stem: '$\\vec{a} = (1, 2, 3), \\vec{b} = (2, 4, 6)$. 평행?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\vec{b} = k \\vec{a}$?', options: [
        { key: 'A', text: '$\\vec{b} = 2 \\vec{a}$ → 평행', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '수직 (내적)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '비례' },
        { key: 'C', text: '평행 아님', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '비례' },
        { key: 'D', text: '같은 벡터', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$k = 2$ 존재', options: [
        { key: 'A', text: '평행', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '수직', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '같음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '반대', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '평행', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '수직', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '같음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '반대', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\vec{b} = 2 \\vec{a}$ → 평행.' },
];

export const K_G12_GEO_CH03_SPACE_3D_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
