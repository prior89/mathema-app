/**
 * K-G10-CS1-CH04-MATRIX — STUDY pool (single-step, 20문제).
 * 행렬 — 정의, 합/차/곱, 스칼라곱, 단위행렬, 거듭제곱.
 * Mastery 3-step과 별도 변형 문제. 고1 공통수학1 (G10).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5. LLM 미사용.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G10-CS1-CH04-MATRIX';
const SKILLS_SHAPE = ['matrix_dimensions', 'rows_columns'];
const SKILLS_ENTRY = ['matrix_entry', 'i_j_position'];
const SKILLS_ADD = ['matrix_addition'];
const SKILLS_SUB = ['matrix_subtraction', 'inverse_addition'];
const SKILLS_SCALAR = ['scalar_multiplication'];
const SKILLS_ZERO = ['zero_matrix', 'additive_identity'];
const SKILLS_IDENTITY = ['identity_matrix', 'multiplicative_identity'];
const SKILLS_MUL = ['matrix_multiplication', 'compatible_sizes'];
const SKILLS_POWER = ['matrix_power', 'idempotent_nilpotent'];
const SKILLS_NONCOMM = ['noncommutative', 'AB_vs_BA'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) 행렬 크기 (2x3)
  { chapterCode: CODE, difficulty: 'easy', concept: '행렬 크기 (직사각)', requiredSkills: SKILLS_SHAPE,
    stem: '행렬 $A = \\begin{pmatrix}1 & 2 & 3 \\\\ 4 & 5 & 6\\end{pmatrix}$ 의 크기?',
    options: [
      { key: 'A', text: '$2 \\times 3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3 \\times 2$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '행과 열 바꿈' },
      { key: 'C', text: '$6 \\times 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '성분 수 셈' },
      { key: 'D', text: '$2 \\times 2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '한 열 무시' },
      { key: 'E', text: '$3 \\times 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '정사각으로 잘못' },
    ],
    solution: '행 수 $\\times$ 열 수 $= 2 \\times 3$.' },

  // S2 (쉬움) (2,1) 성분
  { chapterCode: CODE, difficulty: 'easy', concept: '$(i, j)$ 성분 (행 $2$, 열 $1$)', requiredSkills: SKILLS_ENTRY,
    stem: '$A = \\begin{pmatrix}1 & 2 & 3 \\\\ 4 & 5 & 6\\end{pmatrix}$. $(2, 1)$ 성분?',
    options: [
      { key: 'A', text: '$4$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$2$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$(1, 2)$ 성분' },
      { key: 'C', text: '$1$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$(1, 1)$' },
      { key: 'D', text: '$5$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$(2, 2)$' },
      { key: 'E', text: '$6$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$(2, 3)$' },
    ],
    solution: '$(i, j) = (2, 1)$: 두 번째 행 첫 번째 열 $= 4$.' },

  // S3 (쉬움) 행렬 합 (다른 수)
  { chapterCode: CODE, difficulty: 'easy', concept: '행렬 합', requiredSkills: SKILLS_ADD,
    stem: '$\\begin{pmatrix}2 & 3 \\\\ 1 & 0\\end{pmatrix} + \\begin{pmatrix}4 & 1 \\\\ 5 & 2\\end{pmatrix} = ?$',
    options: [
      { key: 'A', text: '$\\begin{pmatrix}6 & 4 \\\\ 6 & 2\\end{pmatrix}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\begin{pmatrix}6 & 4 \\\\ 6 & 2\\end{pmatrix}$ 가 아닌 곱셈', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱셈과 혼동' },
      { key: 'C', text: '$\\begin{pmatrix}8 & 3 \\\\ 5 & 0\\end{pmatrix}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '일부 성분만 더함' },
      { key: 'D', text: '$\\begin{pmatrix}6 & 6 \\\\ 4 & 2\\end{pmatrix}$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '위치 바꿈' },
      { key: 'E', text: '$\\begin{pmatrix}-2 & -2 \\\\ 4 & -2\\end{pmatrix}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '뺄셈으로' },
    ],
    solution: '대응 성분끼리 더함: $(2+4, 3+1; 1+5, 0+2)$.' },

  // S4 (쉬움) 스칼라 곱 ×3
  { chapterCode: CODE, difficulty: 'easy', concept: '스칼라 곱 ($3$)', requiredSkills: SKILLS_SCALAR,
    stem: '$3 \\cdot \\begin{pmatrix}2 & 1 \\\\ 0 & 4\\end{pmatrix} = ?$',
    options: [
      { key: 'A', text: '$\\begin{pmatrix}6 & 3 \\\\ 0 & 12\\end{pmatrix}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\begin{pmatrix}5 & 4 \\\\ 3 & 7\\end{pmatrix}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '덧셈으로 ($+3$)' },
      { key: 'C', text: '$\\begin{pmatrix}6 & 1 \\\\ 0 & 4\\end{pmatrix}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '일부 성분만 곱함' },
      { key: 'D', text: '$\\begin{pmatrix}2 & 1 \\\\ 0 & 4\\end{pmatrix}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '스칼라 무시' },
      { key: 'E', text: '$\\begin{pmatrix}6 & 3 \\\\ 3 & 12\\end{pmatrix}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$0 \\times 3 = 0$인데 $3$' },
    ],
    solution: '모든 성분에 $3$ 곱.' },

  // S5 (쉬움) 영행렬
  { chapterCode: CODE, difficulty: 'easy', concept: '영행렬과 덧셈', requiredSkills: SKILLS_ZERO,
    stem: '행렬 $A$ 에 영행렬 $O$ 를 더하면?',
    options: [
      { key: 'A', text: '$A$ (그대로)', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$O$ (영행렬)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곱셈과 혼동' },
      { key: 'C', text: '$2A$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '덧셈 두 배 잘못' },
      { key: 'D', text: '$-A$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$O$는 덧셈 항등원' },
    ],
    solution: '영행렬은 덧셈 항등원: $A + O = A$.' },

  // S6 (쉬움) 3x3 단위행렬
  { chapterCode: CODE, difficulty: 'easy', concept: '$3 \\times 3$ 단위행렬', requiredSkills: SKILLS_IDENTITY,
    stem: '$3 \\times 3$ 단위행렬 $E$?',
    options: [
      { key: 'A', text: '$\\begin{pmatrix}1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1\\end{pmatrix}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\begin{pmatrix}1 & 1 & 1 \\\\ 1 & 1 & 1 \\\\ 1 & 1 & 1\\end{pmatrix}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '모두 $1$ 잘못' },
      { key: 'C', text: '$\\begin{pmatrix}0 & 0 & 0 \\\\ 0 & 0 & 0 \\\\ 0 & 0 & 0\\end{pmatrix}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '영행렬' },
      { key: 'D', text: '$\\begin{pmatrix}1 & 1 & 1 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1\\end{pmatrix}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '대각선 외 $0$ 필요' },
      { key: 'E', text: '$\\begin{pmatrix}3 & 0 & 0 \\\\ 0 & 3 & 0 \\\\ 0 & 0 & 3\\end{pmatrix}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$3E$ 잘못' },
    ],
    solution: '단위행렬: 대각 $1$, 나머지 $0$.' },

  // S7 (중) 행렬 차
  { chapterCode: CODE, difficulty: 'medium', concept: '행렬 차', requiredSkills: SKILLS_SUB,
    stem: '$\\begin{pmatrix}5 & 7 \\\\ 2 & 3\\end{pmatrix} - \\begin{pmatrix}2 & 1 \\\\ 4 & 3\\end{pmatrix} = ?$',
    options: [
      { key: 'A', text: '$\\begin{pmatrix}3 & 6 \\\\ -2 & 0\\end{pmatrix}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\begin{pmatrix}7 & 8 \\\\ 6 & 6\\end{pmatrix}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '덧셈으로' },
      { key: 'C', text: '$\\begin{pmatrix}3 & 6 \\\\ 2 & 0\\end{pmatrix}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$(2,1)$ 부호 잘못' },
      { key: 'D', text: '$\\begin{pmatrix}-3 & -6 \\\\ 2 & 0\\end{pmatrix}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '전체 부호 잘못' },
      { key: 'E', text: '$\\begin{pmatrix}3 & 6 \\\\ -2 & 6\\end{pmatrix}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$(2,2)$ 잘못' },
    ],
    solution: '대응 성분: $(5-2, 7-1; 2-4, 3-3)$.' },

  // S8 (중) AB (1,1)
  { chapterCode: CODE, difficulty: 'medium', concept: '행렬 곱 $(1, 1)$ 성분', requiredSkills: SKILLS_MUL,
    stem: '$A = \\begin{pmatrix}2 & 1 \\\\ 3 & 0\\end{pmatrix}$, $B = \\begin{pmatrix}1 & 4 \\\\ 2 & 5\\end{pmatrix}$. $AB$ 의 $(1, 1)$?',
    options: [
      { key: 'A', text: '$4$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '한 항만 ($2 \\times 1$)' },
      { key: 'C', text: '$3$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '잘못된 합' },
      { key: 'D', text: '$8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2 \\times 4$ 잘못된 위치' },
      { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$B$의 $(1,1)$' },
    ],
    solution: '$(1, 1) = $ 1행과 1열 내적 $= 2 \\cdot 1 + 1 \\cdot 2 = 4$.' },

  // S9 (중) AB (1,2)
  { chapterCode: CODE, difficulty: 'medium', concept: '행렬 곱 $(1, 2)$ 성분', requiredSkills: SKILLS_MUL,
    stem: '위 $A, B$ 에 대해 $AB$ 의 $(1, 2)$?',
    options: [
      { key: 'A', text: '$13$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$8$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$2 \\cdot 4$만' },
      { key: 'C', text: '$5$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$B$의 $(2,2)$' },
      { key: 'D', text: '$9$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
      { key: 'E', text: '$11$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
    ],
    solution: '1행 × 2열 = $2 \\cdot 4 + 1 \\cdot 5 = 13$.' },

  // S10 (중) AB (2,1)
  { chapterCode: CODE, difficulty: 'medium', concept: '행렬 곱 $(2, 1)$', requiredSkills: SKILLS_MUL,
    stem: '위 $A, B$ 에 대해 $AB$ 의 $(2, 1)$?',
    options: [
      { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '두 번째 항만' },
      { key: 'C', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 추정' },
      { key: 'D', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
      { key: 'E', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
    ],
    solution: '2행 × 1열 = $3 \\cdot 1 + 0 \\cdot 2 = 3$.' },

  // S11 (중) AB (2,2)
  { chapterCode: CODE, difficulty: 'medium', concept: '행렬 곱 $(2, 2)$', requiredSkills: SKILLS_MUL,
    stem: '위 $A, B$ 에 대해 $AB$ 의 $(2, 2)$?',
    options: [
      { key: 'A', text: '$12$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '두 번째 항만' },
      { key: 'C', text: '$15$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$5 \\times 3$ 잘못' },
      { key: 'D', text: '$5$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$0$ 무시' },
      { key: 'E', text: '$8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
    ],
    solution: '2행 × 2열 = $3 \\cdot 4 + 0 \\cdot 5 = 12$.' },

  // S12 (중) 곱 크기
  { chapterCode: CODE, difficulty: 'medium', concept: '$3 \\times 4 \\cdot 4 \\times 3$ 크기', requiredSkills: SKILLS_MUL,
    stem: '$A$ 가 $3 \\times 4$, $B$ 가 $4 \\times 3$ 일 때 $AB$ 의 크기?',
    options: [
      { key: 'A', text: '$3 \\times 3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$4 \\times 4$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '바깥 차원 잘못' },
      { key: 'C', text: '$3 \\times 4$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$A$ 그대로' },
      { key: 'D', text: '$4 \\times 3$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$B$ 그대로' },
      { key: 'E', text: '정의 안 됨', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$4 = 4$ 일치 → 정의됨' },
    ],
    solution: '$(m \\times k)(k \\times n) = (m \\times n) = 3 \\times 3$.' },

  // S13 (중) 곱 정의 조건
  { chapterCode: CODE, difficulty: 'medium', concept: '곱 정의 조건', requiredSkills: SKILLS_MUL,
    stem: '$AB$ 가 정의되려면?',
    options: [
      { key: 'A', text: '$A$ 의 열 수 = $B$ 의 행 수', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$A, B$ 가 같은 크기', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '덧셈 조건' },
      { key: 'C', text: '$A$ 의 행 수 = $B$ 의 열 수', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '행·열 바꿈' },
      { key: 'D', text: '둘 다 정사각', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '필요 조건 아님' },
      { key: 'E', text: '항상 정의됨', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '조건 있음' },
    ],
    solution: '$(m \\times k)(k \\times n)$ — 가운데 차원 일치.' },

  // S14 (중) EA = A
  { chapterCode: CODE, difficulty: 'medium', concept: '$EA = A$ (왼쪽 단위)', requiredSkills: SKILLS_IDENTITY,
    stem: '$A$ 가 $2 \\times 2$ 행렬, $E$ 는 $2 \\times 2$ 단위행렬. $EA$?',
    options: [
      { key: 'A', text: '$A$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$E$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '단위행렬 답함' },
      { key: 'C', text: '$O$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '영행렬' },
      { key: 'D', text: '$2A$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '스칼라 두 배 잘못' },
      { key: 'E', text: '$A^2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '제곱 잘못' },
    ],
    solution: '단위행렬 $E$ 는 곱셈 항등원: $EA = AE = A$.' },

  // S15 (중) AO = O
  { chapterCode: CODE, difficulty: 'medium', concept: '$AO = O$', requiredSkills: SKILLS_ZERO,
    stem: '$A$ 가 행렬, $O$ 가 (크기 적합한) 영행렬일 때 $AO$?',
    options: [
      { key: 'A', text: '$O$ (영행렬)', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$A$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '덧셈 항등원과 혼동' },
      { key: 'C', text: '$E$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '관련 없음' },
      { key: 'D', text: '$-A$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '관련 없음' },
      { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '명확' },
    ],
    solution: '영행렬과의 곱은 항상 영행렬.' },

  // S16 (어려움) (1 0;0 0)²
  { chapterCode: CODE, difficulty: 'hard', concept: '멱등행렬 $A^2 = A$', requiredSkills: SKILLS_POWER,
    stem: '$A = \\begin{pmatrix}1 & 0 \\\\ 0 & 0\\end{pmatrix}$. $A^2$?',
    options: [
      { key: 'A', text: '$\\begin{pmatrix}1 & 0 \\\\ 0 & 0\\end{pmatrix}$ (즉 $A$)', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\begin{pmatrix}0 & 0 \\\\ 0 & 0\\end{pmatrix}$ (영행렬)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '멱영 잘못' },
      { key: 'C', text: '$\\begin{pmatrix}1 & 0 \\\\ 0 & 1\\end{pmatrix}$ ($E$)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '단위행렬 X' },
      { key: 'D', text: '$\\begin{pmatrix}2 & 0 \\\\ 0 & 0\\end{pmatrix}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$2A$ 잘못' },
      { key: 'E', text: '계산 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '정사각이라 가능' },
    ],
    solution: '$A^2 = A \\cdot A$. 대각만 살아남음. $(1,1) = 1 \\cdot 1 + 0 = 1$, 나머지 $0$ → $A$ 그대로 (멱등).' },

  // S17 (어려움) AB vs BA
  { chapterCode: CODE, difficulty: 'hard', concept: '교환법칙 미성립', requiredSkills: SKILLS_NONCOMM,
    stem: '$A = \\begin{pmatrix}0 & 1 \\\\ 0 & 0\\end{pmatrix}$, $B = \\begin{pmatrix}0 & 0 \\\\ 1 & 0\\end{pmatrix}$. $AB$ 와 $BA$ 의 관계?',
    options: [
      { key: 'A', text: '$AB \\neq BA$ (다르다)', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$AB = BA$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '행렬 곱은 일반적으로 교환법칙 X' },
      { key: 'C', text: '$AB$ 정의 안 됨', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '두 $2 \\times 2$ — 정의됨' },
      { key: 'D', text: '$BA$ 정의 안 됨', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '정의됨' },
      { key: 'E', text: '둘 다 $O$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 결과 다름' },
    ],
    solution: '$AB = \\begin{pmatrix}1 & 0 \\\\ 0 & 0\\end{pmatrix}$, $BA = \\begin{pmatrix}0 & 0 \\\\ 0 & 1\\end{pmatrix}$. 다름.' },

  // S18 (어려움) A^3 (삼각)
  { chapterCode: CODE, difficulty: 'hard', concept: '거듭제곱 패턴 (상삼각)', requiredSkills: SKILLS_POWER,
    stem: '$A = \\begin{pmatrix}1 & 1 \\\\ 0 & 1\\end{pmatrix}$. $A^3$?',
    options: [
      { key: 'A', text: '$\\begin{pmatrix}1 & 3 \\\\ 0 & 1\\end{pmatrix}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\begin{pmatrix}1 & 1 \\\\ 0 & 1\\end{pmatrix}$ ($A$)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$A^3$ 미계산' },
      { key: 'C', text: '$\\begin{pmatrix}3 & 3 \\\\ 0 & 3\\end{pmatrix}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$3A$ 잘못' },
      { key: 'D', text: '$\\begin{pmatrix}1 & 2 \\\\ 0 & 1\\end{pmatrix}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$A^2$' },
      { key: 'E', text: '$\\begin{pmatrix}1 & 6 \\\\ 0 & 1\\end{pmatrix}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3!$ 잘못' },
    ],
    solution: '$A^n = \\begin{pmatrix}1 & n \\\\ 0 & 1\\end{pmatrix}$. $A^3 = \\begin{pmatrix}1 & 3 \\\\ 0 & 1\\end{pmatrix}$.' },

  // S19 (어려움) 2A - B = C → B
  { chapterCode: CODE, difficulty: 'hard', concept: '$2A - B = C$ 풀이', requiredSkills: SKILLS_SUB,
    stem: '$2A - B = C$, $A = \\begin{pmatrix}1 & 0 \\\\ 2 & 1\\end{pmatrix}$, $C = \\begin{pmatrix}0 & 1 \\\\ 3 & 0\\end{pmatrix}$. $B$?',
    options: [
      { key: 'A', text: '$\\begin{pmatrix}2 & -1 \\\\ 1 & 2\\end{pmatrix}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\begin{pmatrix}1 & 1 \\\\ 1 & 1\\end{pmatrix}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
      { key: 'C', text: '$\\begin{pmatrix}-2 & 1 \\\\ -1 & -2\\end{pmatrix}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '전체 부호 잘못' },
      { key: 'D', text: '$\\begin{pmatrix}2 & 1 \\\\ 1 & 2\\end{pmatrix}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$(1,2)$ 부호' },
      { key: 'E', text: '$\\begin{pmatrix}-2 & -1 \\\\ -1 & -2\\end{pmatrix}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '잘못된 부호' },
    ],
    solution: '$B = 2A - C$. $2A = \\begin{pmatrix}2 & 0 \\\\ 4 & 2\\end{pmatrix}$. $2A - C = \\begin{pmatrix}2 & -1 \\\\ 1 & 2\\end{pmatrix}$.' },

  // S20 (어려움) 스칼라+행렬 미지수
  { chapterCode: CODE, difficulty: 'hard', concept: '스칼라 + 행렬 ($A + 3B = C$)', requiredSkills: SKILLS_SCALAR,
    stem: '$A + 3B = \\begin{pmatrix}7 & 4 \\\\ 9 & 10\\end{pmatrix}$, $A = \\begin{pmatrix}1 & 1 \\\\ 0 & 1\\end{pmatrix}$. $B$?',
    options: [
      { key: 'A', text: '$\\begin{pmatrix}2 & 1 \\\\ 3 & 3\\end{pmatrix}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\begin{pmatrix}6 & 3 \\\\ 9 & 9\\end{pmatrix}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$3B$ 그대로' },
      { key: 'C', text: '$\\begin{pmatrix}3 & 2 \\\\ 3 & 4\\end{pmatrix}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 계산' },
      { key: 'D', text: '$\\begin{pmatrix}6 & 3 \\\\ 9 & 9\\end{pmatrix} / 1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$3$ 나눗셈 누락' },
      { key: 'E', text: '$\\begin{pmatrix}8 & 5 \\\\ 9 & 11\\end{pmatrix}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 식' },
    ],
    solution: '$3B = C - A = \\begin{pmatrix}6 & 3 \\\\ 9 & 9\\end{pmatrix}$. $B = \\begin{pmatrix}2 & 1 \\\\ 3 & 3\\end{pmatrix}$.' },
];

export const K_G10_CS1_CH04_MATRIX_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
