/**
 * K-G10-CS1-CH04-MATRIX (행렬) — 20문제 3-step Mastery.
 * 고1 — 행렬 정의 → 성분 → 합·차·스칼라 곱 → 곱 (2x2) → 영행렬/단위행렬 →
 *        교환법칙 미성립 → 거듭제곱 → 미지 행렬 풀이.
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 * 주요 errorCode:
 *   ARITHMETIC_ERROR 7 (성분 곱합 실수)
 *   FORMULA_SELECTION_ERROR 6 (성분별 곱 / 곱 정의 영역 혼동)
 *   CONCEPT_MISUNDERSTANDING 5 / CONDITION_MISSING 2
 *
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G10-CS1-CH04-MATRIX';
const SKILLS_SHAPE = ['matrix_dimensions'];
const SKILLS_ENTRY = ['matrix_entry'];
const SKILLS_ADD = ['matrix_addition'];
const SKILLS_SUB = ['matrix_subtraction'];
const SKILLS_SCALAR = ['scalar_multiplication'];
const SKILLS_MUL = ['matrix_multiplication'];
const SKILLS_ZERO = ['zero_matrix'];
const SKILLS_IDENTITY = ['identity_matrix'];
const SKILLS_NONCOMM = ['matrix_noncommutativity'];
const SKILLS_POWER = ['matrix_power'];

const problems: KoreanProblemSeed[] = [
  // Q1
  { chapterCode: CODE, difficulty: 'easy', concept: '행렬 크기', requiredSkills: SKILLS_SHAPE,
    stem: '행렬 $A = \\begin{pmatrix}1 & 2 \\\\ 3 & 4\\end{pmatrix}$ 의 크기?',
    steps: [
      { stepType: 'CONCEPT', prompt: '행렬 크기 표기?', options: [
        { key: 'A', text: '(행의 수) × (열의 수)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '(열의 수) × (행의 수)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '바뀜' },
        { key: 'C', text: '전체 성분 수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곱 아님' },
        { key: 'D', text: '행 수만', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '대각선 길이', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$A$ 의 행/열', options: [
        { key: 'A', text: '행 $2$, 열 $2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '행 $4$, 열 $1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '행 $1$, 열 $4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '행 $2$, 열 $3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
      { stepType: 'ANSWER', prompt: '크기?', options: [
        { key: 'A', text: '$2 \\times 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4 \\times 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$1 \\times 4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$2 \\times 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$3 \\times 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$2$ 행 $2$ 열 → $2 \\times 2$.' },

  // Q2
  { chapterCode: CODE, difficulty: 'easy', concept: '(i, j) 성분', requiredSkills: SKILLS_ENTRY,
    stem: '$A = \\begin{pmatrix}1 & 2 & 3 \\\\ 4 & 5 & 6\\end{pmatrix}$. $(2, 3)$ 성분?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$(i, j)$ 표기', options: [
        { key: 'A', text: '$i$ 행 $j$ 열의 성분', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$j$ 행 $i$ 열', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '바뀜' },
        { key: 'C', text: '$i + j$ 번째', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$i \\cdot j$ 번째', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '대각 성분', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$2$ 행 $3$ 열', options: [
        { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$1$행 $3$열' },
        { key: 'C', text: '$5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$2$행 $2$열' },
        { key: 'D', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$2$행 $1$열' },
      ] },
      { stepType: 'ANSWER', prompt: '$(2,3)$ 성분', options: [
        { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$(1,3)$' },
        { key: 'C', text: '$5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$(2,2)$' },
        { key: 'D', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$(2,1)$' },
      ] },
    ], solution: '$(2, 3) = 6$.' },

  // Q3
  { chapterCode: CODE, difficulty: 'easy', concept: '행렬 합', requiredSkills: SKILLS_ADD,
    stem: '$A = \\begin{pmatrix}1 & 2 \\\\ 3 & 4\\end{pmatrix}$, $B = \\begin{pmatrix}5 & 6 \\\\ 7 & 8\\end{pmatrix}$. $A + B$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '행렬 합?', options: [
        { key: 'A', text: '같은 위치 성분 끼리 더함', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '모든 성분 한꺼번에', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '대각만', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '곱처럼', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '정의 안 됨', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '같은 크기면 가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$(1,1)=1+5=6$ 등', options: [
        { key: 'A', text: '$\\begin{pmatrix}6 & 8 \\\\ 10 & 12\\end{pmatrix}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\begin{pmatrix}5 & 12 \\\\ 21 & 32\\end{pmatrix}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱' },
        { key: 'C', text: '$\\begin{pmatrix}6 & 8 \\\\ 12 & 10\\end{pmatrix}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3+7$/$4+8$ 바뀜' },
        { key: 'D', text: '$\\begin{pmatrix}1 & 2 \\\\ 3 & 4\\end{pmatrix}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\begin{pmatrix}-4 & -4 \\\\ -4 & -4\\end{pmatrix}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$A-B$' },
      ] },
      { stepType: 'ANSWER', prompt: '$A+B$?', options: [
        { key: 'A', text: '$\\begin{pmatrix}6 & 8 \\\\ 10 & 12\\end{pmatrix}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\begin{pmatrix}5 & 12 \\\\ 21 & 32\\end{pmatrix}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱' },
        { key: 'C', text: '$\\begin{pmatrix}-4 & -4 \\\\ -4 & -4\\end{pmatrix}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$A-B$' },
        { key: 'D', text: '$\\begin{pmatrix}6 & 8 \\\\ 12 & 10\\end{pmatrix}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '바뀜' },
        { key: 'E', text: '$30$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\begin{pmatrix}6 & 8 \\\\ 10 & 12\\end{pmatrix}$.' },

  // Q4
  { chapterCode: CODE, difficulty: 'easy', concept: '스칼라 곱', requiredSkills: SKILLS_SCALAR,
    stem: '$2 \\cdot \\begin{pmatrix}1 & 2 \\\\ 3 & 4\\end{pmatrix} = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '스칼라 곱?', options: [
        { key: 'A', text: '모든 성분에 스칼라 곱', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '대각만 곱', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '전체' },
        { key: 'C', text: '첫 성분만', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '행렬 곱', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '아님' },
        { key: 'E', text: '정의 안 됨', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '정의됨' },
      ] },
      { stepType: 'PROCESS', prompt: '모든 성분 $\\times 2$', options: [
        { key: 'A', text: '$\\begin{pmatrix}2 & 4 \\\\ 6 & 8\\end{pmatrix}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\begin{pmatrix}2 & 2 \\\\ 3 & 4\\end{pmatrix}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$(1,1)$ 만' },
        { key: 'C', text: '$\\begin{pmatrix}2 & 4 \\\\ 3 & 4\\end{pmatrix}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$1$행만' },
        { key: 'D', text: '$\\begin{pmatrix}1 & 2 \\\\ 3 & 4\\end{pmatrix}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '$\\begin{pmatrix}2 & 4 \\\\ 6 & 8\\end{pmatrix}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\begin{pmatrix}1 & 2 \\\\ 3 & 4\\end{pmatrix}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\begin{pmatrix}2 & 2 \\\\ 3 & 4\\end{pmatrix}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\begin{pmatrix}4 & 8 \\\\ 12 & 16\\end{pmatrix}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\times 4$' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\begin{pmatrix}2 & 4 \\\\ 6 & 8\\end{pmatrix}$.' },

  // Q5
  { chapterCode: CODE, difficulty: 'easy', concept: '영행렬', requiredSkills: SKILLS_ZERO,
    stem: '영행렬 $O$ 의 모든 성분?',
    steps: [
      { stepType: 'CONCEPT', prompt: '영행렬 정의?', options: [
        { key: 'A', text: '모든 성분이 $0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '대각만 $0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '대각만 $1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '단위행렬' },
        { key: 'D', text: '모두 $1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '대각 외 $0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '대각 포함' },
      ] },
      { stepType: 'PROCESS', prompt: '$A + O = A$ 성질', options: [
        { key: 'A', text: '합의 항등원', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '곱의 항등원', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '단위행렬' },
        { key: 'C', text: '역원', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '항상 같음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '관계 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '있음' },
      ] },
      { stepType: 'ANSWER', prompt: '모든 성분?', options: [
        { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '단위행렬' },
        { key: 'C', text: '대각만 $0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$-1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '관계 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '있음' },
      ] },
    ], solution: '영행렬: 모든 성분이 $0$.' },

  // Q6
  { chapterCode: CODE, difficulty: 'easy', concept: '단위행렬', requiredSkills: SKILLS_IDENTITY,
    stem: '$2 \\times 2$ 단위행렬 $E$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '단위행렬 정의?', options: [
        { key: 'A', text: '대각 $1$, 나머지 $0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '모두 $1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '모두 $0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '영행렬' },
        { key: 'D', text: '대각 $0$, 나머지 $1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '반대' },
        { key: 'E', text: '대각만 $2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$2 \\times 2$ 형태', options: [
        { key: 'A', text: '$\\begin{pmatrix}1 & 0 \\\\ 0 & 1\\end{pmatrix}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\begin{pmatrix}0 & 1 \\\\ 1 & 0\\end{pmatrix}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '대각 반대' },
        { key: 'C', text: '$\\begin{pmatrix}1 & 1 \\\\ 1 & 1\\end{pmatrix}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\begin{pmatrix}0 & 0 \\\\ 0 & 0\\end{pmatrix}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '영행렬' },
        { key: 'E', text: '$\\begin{pmatrix}2 & 0 \\\\ 0 & 2\\end{pmatrix}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$E$?', options: [
        { key: 'A', text: '$\\begin{pmatrix}1 & 0 \\\\ 0 & 1\\end{pmatrix}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\begin{pmatrix}0 & 1 \\\\ 1 & 0\\end{pmatrix}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$\\begin{pmatrix}1 & 1 \\\\ 1 & 1\\end{pmatrix}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\begin{pmatrix}0 & 0 \\\\ 0 & 0\\end{pmatrix}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '영행렬' },
        { key: 'E', text: '$\\begin{pmatrix}2 & 0 \\\\ 0 & 2\\end{pmatrix}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$E = \\begin{pmatrix}1 & 0 \\\\ 0 & 1\\end{pmatrix}$.' },

  // Q7
  { chapterCode: CODE, difficulty: 'medium', concept: '행렬 차', requiredSkills: SKILLS_SUB,
    stem: '$A = \\begin{pmatrix}1 & 2 \\\\ 3 & 4\\end{pmatrix}$, $B = \\begin{pmatrix}5 & 6 \\\\ 7 & 8\\end{pmatrix}$. $A - B$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '같은 위치 차', options: [
        { key: 'A', text: '$(1-5, 2-6, 3-7, 4-8)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(5-1, 6-2, 7-3, 8-4)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$B - A$' },
        { key: 'C', text: '대각만', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '곱 후 차', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '정의 안 됨', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '정의됨' },
      ] },
      { stepType: 'PROCESS', prompt: '계산', options: [
        { key: 'A', text: '$\\begin{pmatrix}-4 & -4 \\\\ -4 & -4\\end{pmatrix}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\begin{pmatrix}4 & 4 \\\\ 4 & 4\\end{pmatrix}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$B-A$' },
        { key: 'C', text: '$\\begin{pmatrix}6 & 8 \\\\ 10 & 12\\end{pmatrix}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$A+B$' },
        { key: 'D', text: '$\\begin{pmatrix}-4 & 4 \\\\ -4 & 4\\end{pmatrix}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '부호 섞임' },
        { key: 'E', text: '$\\begin{pmatrix}0 & 0 \\\\ 0 & 0\\end{pmatrix}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$A - B$?', options: [
        { key: 'A', text: '$\\begin{pmatrix}-4 & -4 \\\\ -4 & -4\\end{pmatrix}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\begin{pmatrix}4 & 4 \\\\ 4 & 4\\end{pmatrix}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$B-A$' },
        { key: 'C', text: '$\\begin{pmatrix}6 & 8 \\\\ 10 & 12\\end{pmatrix}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$A+B$' },
        { key: 'D', text: '$\\begin{pmatrix}-4 & 4 \\\\ -4 & 4\\end{pmatrix}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '부호 섞임' },
        { key: 'E', text: '$\\begin{pmatrix}0 & 0 \\\\ 0 & 0\\end{pmatrix}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$A - B = \\begin{pmatrix}-4 & -4 \\\\ -4 & -4\\end{pmatrix}$.' },

  // Q8
  { chapterCode: CODE, difficulty: 'medium', concept: '행렬 곱 (1,1) 성분', requiredSkills: SKILLS_MUL,
    stem: '$A = \\begin{pmatrix}1 & 2 \\\\ 3 & 4\\end{pmatrix}$, $B = \\begin{pmatrix}5 & 6 \\\\ 7 & 8\\end{pmatrix}$. $AB$ 의 $(1, 1)$ 성분?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$(AB)_{1,1}$ 공식', options: [
        { key: 'A', text: '$A$ 의 $1$행과 $B$ 의 $1$열의 곱합', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$A_{1,1} \\cdot B_{1,1}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '성분별 곱 아님' },
        { key: 'C', text: '$A$ 의 $1$열과 $B$ 의 $1$행', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '바뀜' },
        { key: 'D', text: '$1$행 모두 합', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '정의 안 됨', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$1 \\cdot 5 + 2 \\cdot 7$', options: [
        { key: 'A', text: '$5 + 14 = 19$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1 \\cdot 5 = 5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$A_{1,1} B_{1,1}$ 만' },
        { key: 'C', text: '$12$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$22$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$(1,2)$' },
        { key: 'E', text: '$43$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$(2,1)$' },
      ] },
      { stepType: 'ANSWER', prompt: '$(AB)_{1,1}$', options: [
        { key: 'A', text: '$19$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '성분별 곱' },
        { key: 'C', text: '$22$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$(1,2)$' },
        { key: 'D', text: '$43$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$(2,1)$' },
        { key: 'E', text: '$50$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$(2,2)$' },
      ] },
    ], solution: '$(AB)_{1,1} = 1 \\cdot 5 + 2 \\cdot 7 = 19$.' },

  // Q9
  { chapterCode: CODE, difficulty: 'medium', concept: '행렬 곱 (1,2) 성분', requiredSkills: SKILLS_MUL,
    stem: '위 $A, B$ 에 대해 $AB$ 의 $(1, 2)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$A$ 의 $1$행 · $B$ 의 $2$열', options: [
        { key: 'A', text: '$1 \\cdot 6 + 2 \\cdot 8$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1 \\cdot 5 + 2 \\cdot 7$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$(1,1)$ 식' },
        { key: 'C', text: '$3 \\cdot 6 + 4 \\cdot 8$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$(2,2)$ 식' },
        { key: 'D', text: '$1 \\cdot 2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$6 + 8$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '계수 무시' },
      ] },
      { stepType: 'PROCESS', prompt: '$6 + 16$', options: [
        { key: 'A', text: '$22$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$19$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$(1,1)$' },
        { key: 'C', text: '$14$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$6 + 8$' },
        { key: 'D', text: '$50$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$(2,2)$' },
        { key: 'E', text: '$48$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$(AB)_{1,2}$', options: [
        { key: 'A', text: '$22$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$19$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$(1,1)$' },
        { key: 'C', text: '$43$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$(2,1)$' },
        { key: 'D', text: '$50$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$(2,2)$' },
        { key: 'E', text: '$14$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(AB)_{1,2} = 6 + 16 = 22$.' },

  // Q10
  { chapterCode: CODE, difficulty: 'medium', concept: '행렬 곱 (2,1) 성분', requiredSkills: SKILLS_MUL,
    stem: '위 $A, B$ 에 대해 $AB$ 의 $(2, 1)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$A$ 의 $2$행 · $B$ 의 $1$열', options: [
        { key: 'A', text: '$3 \\cdot 5 + 4 \\cdot 7$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3 \\cdot 6 + 4 \\cdot 8$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$(2,2)$' },
        { key: 'C', text: '$1 \\cdot 5 + 2 \\cdot 7$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$(1,1)$' },
        { key: 'D', text: '$3 \\cdot 5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '첫 항만' },
        { key: 'E', text: '$3 \\cdot 1 + 4 \\cdot 3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$B$ 잘못' },
      ] },
      { stepType: 'PROCESS', prompt: '$15 + 28$', options: [
        { key: 'A', text: '$43$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$22$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$(1,2)$' },
        { key: 'C', text: '$19$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$(1,1)$' },
        { key: 'D', text: '$50$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$(2,2)$' },
        { key: 'E', text: '$35$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$(AB)_{2,1}$', options: [
        { key: 'A', text: '$43$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$22$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$(1,2)$' },
        { key: 'C', text: '$19$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$(1,1)$' },
        { key: 'D', text: '$50$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$(2,2)$' },
        { key: 'E', text: '$35$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(AB)_{2,1} = 15 + 28 = 43$.' },

  // Q11
  { chapterCode: CODE, difficulty: 'medium', concept: '행렬 곱 (2,2) 성분', requiredSkills: SKILLS_MUL,
    stem: '위 $A, B$ 에 대해 $AB$ 의 $(2, 2)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$A$ 의 $2$행 · $B$ 의 $2$열', options: [
        { key: 'A', text: '$3 \\cdot 6 + 4 \\cdot 8$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3 \\cdot 5 + 4 \\cdot 7$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$(2,1)$' },
        { key: 'C', text: '$1 \\cdot 6 + 2 \\cdot 8$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$(1,2)$' },
        { key: 'D', text: '$4 \\cdot 8$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '첫 항 누락' },
        { key: 'E', text: '$3 \\cdot 4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$18 + 32$', options: [
        { key: 'A', text: '$50$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$43$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$(2,1)$' },
        { key: 'C', text: '$22$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$(1,2)$' },
        { key: 'D', text: '$32$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '첫 항 누락' },
        { key: 'E', text: '$48$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$(AB)_{2,2}$', options: [
        { key: 'A', text: '$50$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$43$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$(2,1)$' },
        { key: 'C', text: '$22$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$(1,2)$' },
        { key: 'D', text: '$32$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '첫 항 누락' },
        { key: 'E', text: '$48$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(AB)_{2,2} = 18 + 32 = 50$.' },

  // Q12
  { chapterCode: CODE, difficulty: 'medium', concept: '곱의 크기', requiredSkills: SKILLS_MUL,
    stem: '$A$ 가 $2 \\times 3$, $B$ 가 $3 \\times 2$ 일 때 $AB$ 의 크기?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$(m \\times n)(n \\times p)$ → ?', options: [
        { key: 'A', text: '$m \\times p$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$n \\times n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '중간 사용' },
        { key: 'C', text: '$p \\times m$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '바뀜' },
        { key: 'D', text: '$m \\times n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$A$ 크기' },
        { key: 'E', text: '정의 안 됨', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$m=2, p=2$', options: [
        { key: 'A', text: '$2 \\times 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3 \\times 3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$BA$' },
        { key: 'C', text: '$2 \\times 3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$A$' },
        { key: 'D', text: '$3 \\times 2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$B$' },
        { key: 'E', text: '정의 안 됨', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$AB$ 크기', options: [
        { key: 'A', text: '$2 \\times 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3 \\times 3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$BA$' },
        { key: 'C', text: '$2 \\times 3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$3 \\times 2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$6 \\times 6$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(2 \\times 3)(3 \\times 2) \\to 2 \\times 2$.' },

  // Q13
  { chapterCode: CODE, difficulty: 'medium', concept: '곱 정의 조건', requiredSkills: SKILLS_MUL,
    stem: '$AB$ 가 정의되려면?',
    steps: [
      { stepType: 'CONCEPT', prompt: '맞물림', options: [
        { key: 'A', text: '$A$ 의 열 수 = $B$ 의 행 수', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '같은 크기', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '합·차 조건' },
        { key: 'C', text: '$A$ 의 행 수 = $B$ 의 열 수', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '바뀜' },
        { key: 'D', text: '$A$ 가 정사각', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'E', text: '아무 조건 없음', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '있음' },
      ] },
      { stepType: 'PROCESS', prompt: '예: $(2\\times3)(3\\times4)$', options: [
        { key: 'A', text: '정의됨', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '안 됨', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$3 = 3$' },
        { key: 'C', text: '$BA$ 만', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'D', text: '경우에 따라', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '규칙적' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '가능' },
      ] },
      { stepType: 'ANSWER', prompt: '조건?', options: [
        { key: 'A', text: '$A$ 열 = $B$ 행', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '같은 크기', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '합·차' },
        { key: 'C', text: '$A$ 행 = $B$ 열', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '바뀜' },
        { key: 'D', text: '정사각', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'E', text: '아무 조건 없음', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '있음' },
      ] },
    ], solution: '$A$ 의 열 수 = $B$ 의 행 수 이면 정의됨.' },

  // Q14
  { chapterCode: CODE, difficulty: 'medium', concept: '$AE = A$', requiredSkills: SKILLS_IDENTITY,
    stem: '$A$ 가 $2\\times 2$ 행렬일 때 $AE$? ($E$ 는 $2\\times 2$ 단위행렬)',
    steps: [
      { stepType: 'CONCEPT', prompt: '$E$ 의 역할?', options: [
        { key: 'A', text: '곱의 항등원', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '합의 항등원', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '영행렬' },
        { key: 'C', text: '역행렬', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '관계 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '있음' },
        { key: 'E', text: '영행렬', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$AE = ?$', options: [
        { key: 'A', text: '$A$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$E$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$O$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$A + E$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$A^2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$AE$?', options: [
        { key: 'A', text: '$A$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$E$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$O$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$2A$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$A^2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$AE = EA = A$.' },

  // Q15
  { chapterCode: CODE, difficulty: 'medium', concept: '$E^2 = E$', requiredSkills: SKILLS_POWER,
    stem: '$E^2 = ?$ ($E$ 는 $2 \\times 2$ 단위행렬)',
    steps: [
      { stepType: 'CONCEPT', prompt: '$E \\cdot E$', options: [
        { key: 'A', text: '$EE = E$ (항등원 성질)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2E$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곱 아님' },
        { key: 'C', text: '$O$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '정의 안 됨', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '정의됨' },
        { key: 'E', text: '$E + E$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$EA = A$ 에 $A = E$', options: [
        { key: 'A', text: '$E^2 = E$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$E^2 = 2E$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$E^2 = O$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$E^2 = 4E$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$E^2 = E^{-1}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$E^2$', options: [
        { key: 'A', text: '$E$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2E$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$O$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$E + E$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$E^{-1}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$E^2 = E$.' },

  // Q16 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '멱영행렬', requiredSkills: SKILLS_POWER,
    stem: '$A = \\begin{pmatrix}0 & 1 \\\\ 0 & 0\\end{pmatrix}$. $A^2$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$AA$ 의 각 성분', options: [
        { key: 'A', text: '$1$행 · 열들 / $2$행 · 열들', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '성분별 제곱', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '대각만 제곱', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$A + A$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합 아님' },
        { key: 'E', text: '$2A$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$(1,1)=0,(1,2)=0,(2,1)=0,(2,2)=0$', options: [
        { key: 'A', text: '$\\begin{pmatrix}0 & 0 \\\\ 0 & 0\\end{pmatrix} = O$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\begin{pmatrix}0 & 1 \\\\ 0 & 0\\end{pmatrix}$ 그대로', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$A$' },
        { key: 'C', text: '$E$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\begin{pmatrix}0 & 1 \\\\ 0 & 1\\end{pmatrix}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2A$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$A^2$?', options: [
        { key: 'A', text: '$O$ (영행렬)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$A$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$E$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2A$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$-A$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$A^2 = O$ (영행렬 아닌데 제곱이 $O$ — 멱영).' },

  // Q17 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '교환법칙 미성립', requiredSkills: SKILLS_NONCOMM,
    stem: '$A = \\begin{pmatrix}1 & 2 \\\\ 0 & 1\\end{pmatrix}$, $B = \\begin{pmatrix}1 & 0 \\\\ 3 & 1\\end{pmatrix}$. $AB$ 의 $(1,1)$ 과 $BA$ 의 $(1,1)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$(AB)_{1,1} = 1 \\cdot 1 + 2 \\cdot 3$', options: [
        { key: 'A', text: '$1 + 6 = 7$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1 + 2 = 3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '계수' },
        { key: 'C', text: '$1 \\cdot 1 = 1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '한 항만' },
        { key: 'D', text: '$2 \\cdot 3 = 6$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '한 항만' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$(BA)_{1,1} = 1 \\cdot 1 + 0 \\cdot 0$', options: [
        { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$7$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$AB$ 와 같다고 가정' },
        { key: 'C', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '두 값 비교 → 결론?', options: [
        { key: 'A', text: '$7 \\neq 1$ → $AB \\neq BA$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$AB = BA$ 항상', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '교환법칙 X' },
        { key: 'C', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
        { key: 'D', text: '$AB = O$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$AB = E$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$(AB)_{1,1} = 7$, $(BA)_{1,1} = 1$ → 일반적으로 $AB \\neq BA$ (행렬 곱 교환법칙 미성립).' },

  // Q18 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '거듭제곱 패턴', requiredSkills: SKILLS_POWER,
    stem: '$A = \\begin{pmatrix}1 & 1 \\\\ 0 & 1\\end{pmatrix}$. $A^3$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$A^2$ 부터', options: [
        { key: 'A', text: '$A^2 = \\begin{pmatrix}1 & 2 \\\\ 0 & 1\\end{pmatrix}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$A^2 = A$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '제곱 X' },
        { key: 'C', text: '$A^2 = E$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$A^2 = 2A$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$A^2 = O$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$A^3 = A^2 \\cdot A$ 의 $(1,2)$', options: [
        { key: 'A', text: '$1 \\cdot 1 + 2 \\cdot 1 = 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$A^2$' },
        { key: 'C', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$A$' },
        { key: 'D', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$A^3$?', options: [
        { key: 'A', text: '$\\begin{pmatrix}1 & 3 \\\\ 0 & 1\\end{pmatrix}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\begin{pmatrix}1 & 1 \\\\ 0 & 1\\end{pmatrix}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$A$' },
        { key: 'C', text: '$\\begin{pmatrix}1 & 2 \\\\ 0 & 1\\end{pmatrix}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$A^2$' },
        { key: 'D', text: '$\\begin{pmatrix}3 & 3 \\\\ 0 & 3\\end{pmatrix}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3A$' },
        { key: 'E', text: '$E$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$A^n = \\begin{pmatrix}1 & n \\\\ 0 & 1\\end{pmatrix}$ 패턴 → $A^3 = \\begin{pmatrix}1 & 3 \\\\ 0 & 1\\end{pmatrix}$.' },

  // Q19 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '$B = C - A$ 풀이', requiredSkills: SKILLS_SUB,
    stem: '$A + B = C$, $A = \\begin{pmatrix}1 & 2 \\\\ 3 & 4\\end{pmatrix}$, $C = \\begin{pmatrix}3 & 5 \\\\ 6 & 8\\end{pmatrix}$. $B$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$B = ?$', options: [
        { key: 'A', text: '$C - A$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$A - C$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '부호' },
        { key: 'C', text: '$A + C$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$C / A$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 X' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '성분별 차', options: [
        { key: 'A', text: '$(3-1, 5-2, 6-3, 8-4) = (2, 3, 3, 4)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(1-3, 2-5, 3-6, 4-8)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$A - C$' },
        { key: 'C', text: '$(4, 7, 9, 12)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합' },
        { key: 'D', text: '$(1, 1, 1, 1)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(2, 5, 3, 8)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$B$?', options: [
        { key: 'A', text: '$\\begin{pmatrix}2 & 3 \\\\ 3 & 4\\end{pmatrix}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\begin{pmatrix}-2 & -3 \\\\ -3 & -4\\end{pmatrix}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '부호' },
        { key: 'C', text: '$\\begin{pmatrix}4 & 7 \\\\ 9 & 12\\end{pmatrix}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합' },
        { key: 'D', text: '$\\begin{pmatrix}1 & 1 \\\\ 1 & 1\\end{pmatrix}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\begin{pmatrix}3 & 5 \\\\ 6 & 8\\end{pmatrix}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$C$' },
      ] },
    ], solution: '$B = C - A = \\begin{pmatrix}2 & 3 \\\\ 3 & 4\\end{pmatrix}$.' },

  // Q20 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '스칼라+행렬 미지수', requiredSkills: SKILLS_SCALAR,
    stem: '$A + 2B = \\begin{pmatrix}5 & 6 \\\\ 7 & 8\\end{pmatrix}$, $A = \\begin{pmatrix}1 & 2 \\\\ 3 & 4\\end{pmatrix}$. $B$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$2B = ?$', options: [
        { key: 'A', text: '$\\begin{pmatrix}5 & 6 \\\\ 7 & 8\\end{pmatrix} - A$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\begin{pmatrix}5 & 6 \\\\ 7 & 8\\end{pmatrix} + A$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '부호' },
        { key: 'C', text: '$A - \\begin{pmatrix}5 & 6 \\\\ 7 & 8\\end{pmatrix}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '뒤집힘' },
        { key: 'D', text: '$\\begin{pmatrix}5 & 6 \\\\ 7 & 8\\end{pmatrix}$ 그대로', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$A$ 누락' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$2B = \\begin{pmatrix}4 & 4 \\\\ 4 & 4\\end{pmatrix}$, $B = ?$', options: [
        { key: 'A', text: '$B = \\begin{pmatrix}2 & 2 \\\\ 2 & 2\\end{pmatrix}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$B = \\begin{pmatrix}4 & 4 \\\\ 4 & 4\\end{pmatrix}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2B$ 그대로' },
        { key: 'C', text: '$B = \\begin{pmatrix}8 & 8 \\\\ 8 & 8\\end{pmatrix}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\times 2$' },
        { key: 'D', text: '$B = \\begin{pmatrix}1 & 1 \\\\ 1 & 1\\end{pmatrix}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$/4$' },
        { key: 'E', text: '$B = O$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$B$?', options: [
        { key: 'A', text: '$\\begin{pmatrix}2 & 2 \\\\ 2 & 2\\end{pmatrix}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\begin{pmatrix}4 & 4 \\\\ 4 & 4\\end{pmatrix}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 누락' },
        { key: 'C', text: '$\\begin{pmatrix}1 & 1 \\\\ 1 & 1\\end{pmatrix}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\begin{pmatrix}5 & 6 \\\\ 7 & 8\\end{pmatrix}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$A+2B$' },
        { key: 'E', text: '$O$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$2B = \\begin{pmatrix}4 & 4 \\\\ 4 & 4\\end{pmatrix}$, $B = \\begin{pmatrix}2 & 2 \\\\ 2 & 2\\end{pmatrix}$.' },
];

export const K_G10_CS1_CH04_MATRIX_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
