/**
 * K-G12-GEO-CH02-VECTOR-2D — STUDY pool (single-step, 20문제).
 * 평면벡터 — 성분, 크기, 합/차, 스칼라 곱, 내적, 수직/평행, 사이각.
 * Mastery 3-step과 별도 변형 문제. 고3 기하 (G12).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5. LLM 미사용.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G12-GEO-CH02-VECTOR-2D';
const SKILLS_MAG = ['vector_magnitude'];
const SKILLS_OP = ['vector_operations'];
const SKILLS_DOT = ['dot_product'];
const SKILLS_UNIT = ['unit_vector'];
const SKILLS_PERP = ['perpendicular_condition'];
const SKILLS_PAR = ['parallel_condition'];
const SKILLS_ANGLE = ['angle_between_vectors'];
const SKILLS_IDENT = ['vector_identity'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) (5,12) 크기
  { chapterCode: CODE, difficulty: 'easy', concept: '벡터 크기', requiredSkills: SKILLS_MAG,
    stem: '$\\vec{a} = (5, 12)$ 의 크기 $|\\vec{a}|$?',
    options: [
      { key: 'A', text: '$13$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$17$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$5 + 12$' },
      { key: 'C', text: '$169$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\sqrt{}$ 누락' },
      { key: 'D', text: '$\\sqrt{17}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$7$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$12 - 5$' },
    ],
    solution: '$|\\vec{a}| = \\sqrt{25 + 144} = \\sqrt{169} = 13$.' },

  // S2 (쉬움) 합 (2,1)+(1,3)
  { chapterCode: CODE, difficulty: 'easy', concept: '벡터 합', requiredSkills: SKILLS_OP,
    stem: '$\\vec{a} = (2, 1), \\vec{b} = (1, 3)$. $\\vec{a} + \\vec{b}$?',
    options: [
      { key: 'A', text: '$(3, 4)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(2, 3)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곱' },
      { key: 'C', text: '$(1, -2)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '차' },
      { key: 'D', text: '$(4, 3)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '성분 뒤바뀜' },
      { key: 'E', text: '$5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '크기로 더함' },
    ],
    solution: '$(2+1, 1+3) = (3, 4)$.' },

  // S3 (쉬움) 스칼라 곱
  { chapterCode: CODE, difficulty: 'easy', concept: '스칼라 곱', requiredSkills: SKILLS_OP,
    stem: '$\\vec{a} = (1, -2)$. $3 \\vec{a}$?',
    options: [
      { key: 'A', text: '$(3, -6)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(3, -2)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '둘째 성분 누락' },
      { key: 'C', text: '$(1, -6)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '첫째 성분 누락' },
      { key: 'D', text: '$(3, 6)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'E', text: '$(4, -2)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$(3 \\cdot 1, 3 \\cdot (-2)) = (3, -6)$.' },

  // S4 (쉬움) 벡터 합 정의
  { chapterCode: CODE, difficulty: 'easy', concept: '벡터 합 정의', requiredSkills: SKILLS_OP,
    stem: '두 벡터 $\\vec{a} = (a_1, a_2), \\vec{b} = (b_1, b_2)$. $\\vec{a} + \\vec{b}$ 의 정의?',
    options: [
      { key: 'A', text: '$(a_1 + b_1, a_2 + b_2)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(a_1 b_1, a_2 b_2)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곱' },
      { key: 'C', text: '$(a_1 + a_2, b_1 + b_2)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$(a_1 + b_2, a_2 + b_1)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '교차' },
      { key: 'E', text: '$a_1 b_1 + a_2 b_2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '내적' },
    ],
    solution: '벡터 합은 성분별 합.' },

  // S5 (쉬움) 수직 조건
  { chapterCode: CODE, difficulty: 'easy', concept: '수직 조건', requiredSkills: SKILLS_PERP,
    stem: '두 영 아닌 벡터 $\\vec{a}, \\vec{b}$ 가 수직일 필요충분조건?',
    options: [
      { key: 'A', text: '$\\vec{a} \\cdot \\vec{b} = 0$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\vec{a} + \\vec{b} = \\vec{0}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '반대 벡터' },
      { key: 'C', text: '$|\\vec{a}| = |\\vec{b}|$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '크기 같음' },
      { key: 'D', text: '$\\vec{a} \\cdot \\vec{b} = 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$\\vec{a} = \\vec{b}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '수직 ↔ 내적 $= 0$.' },

  // S6 (쉬움) (2,0)·(0,3)
  { chapterCode: CODE, difficulty: 'easy', concept: '수직 벡터 내적', requiredSkills: SKILLS_DOT,
    stem: '$\\vec{a} = (2, 0), \\vec{b} = (0, 3)$. $\\vec{a} \\cdot \\vec{b}$?',
    options: [
      { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곱 자체' },
      { key: 'C', text: '$5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합' },
      { key: 'D', text: '$(0, 0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '벡터로 잘못 표기' },
      { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$2 \\cdot 0 + 0 \\cdot 3 = 0$. ($x$, $y$ 축 수직.)' },

  // S7 (중) (5,12) 단위벡터
  { chapterCode: CODE, difficulty: 'medium', concept: '단위벡터', requiredSkills: SKILLS_UNIT,
    stem: '$\\vec{a} = (5, 12)$ 와 같은 방향 단위벡터?',
    options: [
      { key: 'A', text: '$\\left( \\dfrac{5}{13}, \\dfrac{12}{13} \\right)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\left( \\dfrac{5}{17}, \\dfrac{12}{17} \\right)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$|\\vec{a}|$ 잘못' },
      { key: 'C', text: '$(5, 12)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '나눔 누락' },
      { key: 'D', text: '$\\left( \\dfrac{1}{5}, \\dfrac{1}{12} \\right)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '역수' },
      { key: 'E', text: '$\\left( \\dfrac{13}{5}, \\dfrac{13}{12} \\right)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '뒤집음' },
    ],
    solution: '$|\\vec{a}| = 13$. 단위벡터 $= \\dfrac{\\vec{a}}{|\\vec{a}|} = \\left( \\dfrac{5}{13}, \\dfrac{12}{13} \\right)$.' },

  // S8 (중) 차
  { chapterCode: CODE, difficulty: 'medium', concept: '벡터 차', requiredSkills: SKILLS_OP,
    stem: '$\\vec{a} = (3, 1), \\vec{b} = (1, 4)$. $\\vec{a} - \\vec{b}$?',
    options: [
      { key: 'A', text: '$(2, -3)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(2, 3)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '둘째 성분 부호' },
      { key: 'C', text: '$(-2, 3)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$\\vec{b} - \\vec{a}$' },
      { key: 'D', text: '$(4, 5)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합' },
      { key: 'E', text: '$(3, -3)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '$(3 - 1, 1 - 4) = (2, -3)$.' },

  // S9 (중) 내적 계산
  { chapterCode: CODE, difficulty: 'medium', concept: '내적 ((1,2)·(3,4))', requiredSkills: SKILLS_DOT,
    stem: '$\\vec{a} = (1, 2), \\vec{b} = (3, 4)$. $\\vec{a} \\cdot \\vec{b}$?',
    options: [
      { key: 'A', text: '$11$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'C', text: '$5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$(3, 8)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '성분곱 (벡터 X)' },
      { key: 'E', text: '$24$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$1 \\cdot 3 + 2 \\cdot 4 = 3 + 8 = 11$.' },

  // S10 (중) 수직 (2,3)·(-3,2)
  { chapterCode: CODE, difficulty: 'medium', concept: '수직 판정', requiredSkills: SKILLS_DOT,
    stem: '$\\vec{a} = (2, 3), \\vec{b} = (-3, 2)$. 두 벡터의 관계?',
    options: [
      { key: 'A', text: '수직 (내적 $= 0$)', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '평행 (같은 방향)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'C', text: '같은 벡터', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '반대 방향', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '판정 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '판정 가능' },
    ],
    solution: '$\\vec{a} \\cdot \\vec{b} = -6 + 6 = 0$ → 수직.' },

  // S11 (중) 사이각 30° 내적
  { chapterCode: CODE, difficulty: 'medium', concept: '내적 (사이각 표현)', requiredSkills: SKILLS_DOT,
    stem: '$|\\vec{a}| = 4, |\\vec{b}| = 2$, 사이각 $30°$. $\\vec{a} \\cdot \\vec{b}$?',
    options: [
      { key: 'A', text: '$4 \\sqrt{3}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\cos 60°$' },
      { key: 'C', text: '$8$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\cos\\theta$ 누락' },
      { key: 'D', text: '$2 \\sqrt{3}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'E', text: '$\\dfrac{\\sqrt{3}}{2}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\cos$ 만' },
    ],
    solution: '$|\\vec{a}| |\\vec{b}| \\cos\\theta = 4 \\cdot 2 \\cdot \\dfrac{\\sqrt{3}}{2} = 4\\sqrt{3}$.' },

  // S12 (중) 평행 조건
  { chapterCode: CODE, difficulty: 'medium', concept: '평행 조건', requiredSkills: SKILLS_PAR,
    stem: '$\\vec{a} = (a_1, a_2), \\vec{b} = (b_1, b_2)$ (영 아님) 가 평행할 조건?',
    options: [
      { key: 'A', text: '$a_1 b_2 - a_2 b_1 = 0$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$a_1 b_1 + a_2 b_2 = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '수직' },
      { key: 'C', text: '$|\\vec{a}| = |\\vec{b}|$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '크기' },
      { key: 'D', text: '$\\vec{a} + \\vec{b} = \\vec{0}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '반대' },
      { key: 'E', text: '$a_1 + a_2 = b_1 + b_2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$\\vec{b} = k \\vec{a}$ ↔ $a_1 b_2 = a_2 b_1$.' },

  // S13 (중) 평행 판정 (2,3)(4,5)
  { chapterCode: CODE, difficulty: 'medium', concept: '평행 판정 (X)', requiredSkills: SKILLS_PAR,
    stem: '$\\vec{a} = (2, 3), \\vec{b} = (4, 5)$. 평행한가?',
    options: [
      { key: 'A', text: '평행 아님 ($2 \\cdot 5 \\neq 3 \\cdot 4$)', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '평행 ($\\vec{b} = 2 \\vec{a}$)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2 \\cdot 3 = 6 \\neq 5$' },
      { key: 'C', text: '수직', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '내적 $\\neq 0$' },
      { key: 'D', text: '같은 벡터', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '판정 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '판정 가능' },
    ],
    solution: '$2 \\cdot 5 - 3 \\cdot 4 = 10 - 12 = -2 \\neq 0$. 평행 X.' },

  // S14 (중) 사이각 45°
  { chapterCode: CODE, difficulty: 'medium', concept: '사이각 $45°$', requiredSkills: SKILLS_ANGLE,
    stem: '$\\vec{a} = (1, 1), \\vec{b} = (0, 1)$. 사이각 $\\theta$?',
    options: [
      { key: 'A', text: '$45°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$30°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\cos \\theta$ 잘못' },
      { key: 'C', text: '$60°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'D', text: '$90°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '내적 $\\neq 0$' },
      { key: 'E', text: '$0°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '같은 방향' },
    ],
    solution: '$\\cos\\theta = \\dfrac{1}{\\sqrt{2} \\cdot 1} = \\dfrac{1}{\\sqrt{2}}$ → $\\theta = 45°$.' },

  // S15 (중) |a-b|² 항등식
  { chapterCode: CODE, difficulty: 'medium', concept: '$|\\vec{a} - \\vec{b}|^2$', requiredSkills: SKILLS_IDENT,
    stem: '$|\\vec{a} - \\vec{b}|^2 = ?$',
    options: [
      { key: 'A', text: '$|\\vec{a}|^2 - 2 \\vec{a} \\cdot \\vec{b} + |\\vec{b}|^2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$|\\vec{a}|^2 + 2 \\vec{a} \\cdot \\vec{b} + |\\vec{b}|^2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$+$ 잘못 (합 공식)' },
      { key: 'C', text: '$|\\vec{a}|^2 - |\\vec{b}|^2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '교차항 누락' },
      { key: 'D', text: '$|\\vec{a} - \\vec{b}|$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '제곱 누락' },
      { key: 'E', text: '$|\\vec{a}|^2 + |\\vec{b}|^2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '교차항 누락' },
    ],
    solution: '$(\\vec{a} - \\vec{b}) \\cdot (\\vec{a} - \\vec{b}) = |\\vec{a}|^2 - 2 \\vec{a} \\cdot \\vec{b} + |\\vec{b}|^2$.' },

  // S16 (어려움) 수직 조건으로 k
  { chapterCode: CODE, difficulty: 'hard', concept: '수직 → $k$', requiredSkills: SKILLS_PERP,
    stem: '$\\vec{a} = (k, 3), \\vec{b} = (2, -1)$ 가 수직. $k$?',
    options: [
      { key: 'A', text: '$\\dfrac{3}{2}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$-\\dfrac{3}{2}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'C', text: '$3$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$2$ 나눔 누락' },
      { key: 'D', text: '$\\dfrac{2}{3}$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '뒤집음' },
      { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$\\vec{a} \\cdot \\vec{b} = 2k - 3 = 0 \\to k = \\dfrac{3}{2}$.' },

  // S17 (어려움) |AB|
  { chapterCode: CODE, difficulty: 'hard', concept: '$|\\vec{AB}|$ ($A(0,0), B(3,4)$)', requiredSkills: SKILLS_MAG,
    stem: '$A(0, 0), B(3, 4)$. $|\\vec{AB}|$?',
    options: [
      { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$7$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$3 + 4$' },
      { key: 'C', text: '$25$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\sqrt{}$ 누락' },
      { key: 'D', text: '$\\sqrt{7}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$12$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$\\vec{AB} = (3, 4), |\\vec{AB}| = \\sqrt{9 + 16} = 5$.' },

  // S18 (어려움) |(3,4)|²
  { chapterCode: CODE, difficulty: 'hard', concept: '$\\vec{a} \\cdot \\vec{a}$ ($(3,4)$)', requiredSkills: SKILLS_IDENT,
    stem: '$\\vec{a} = (3, 4)$. $\\vec{a} \\cdot \\vec{a}$?',
    options: [
      { key: 'A', text: '$25$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$|\\vec{a}|$ 자체' },
      { key: 'C', text: '$7$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합' },
      { key: 'D', text: '$12$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$3 \\cdot 4$' },
      { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$\\vec{a} \\cdot \\vec{a} = |\\vec{a}|^2 = 9 + 16 = 25$.' },

  // S19 (어려움) 수직 사이각
  { chapterCode: CODE, difficulty: 'hard', concept: '사이각 $90°$', requiredSkills: SKILLS_ANGLE,
    stem: '$\\vec{a} = (3, 4), \\vec{b} = (4, -3)$. 사이각 $\\theta$?',
    options: [
      { key: 'A', text: '$90°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$45°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'C', text: '$60°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'D', text: '$0°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$180°$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '잘못' },
    ],
    solution: '$\\vec{a} \\cdot \\vec{b} = 12 - 12 = 0$ → 수직 → $\\theta = 90°$.' },

  // S20 (어려움) (a+b)·(a-b)
  { chapterCode: CODE, difficulty: 'hard', concept: '$(\\vec{a} + \\vec{b}) \\cdot (\\vec{a} - \\vec{b})$', requiredSkills: SKILLS_IDENT,
    stem: '$(\\vec{a} + \\vec{b}) \\cdot (\\vec{a} - \\vec{b}) = ?$',
    options: [
      { key: 'A', text: '$|\\vec{a}|^2 - |\\vec{b}|^2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$|\\vec{a}|^2 + |\\vec{b}|^2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$+$ 잘못' },
      { key: 'C', text: '$|\\vec{a}|^2 \\cdot |\\vec{b}|^2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곱' },
      { key: 'D', text: '$2 \\vec{a} \\cdot \\vec{b}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$|\\vec{a}| = |\\vec{b}|$ 시에만' },
    ],
    solution: '$\\vec{a} \\cdot \\vec{a} - \\vec{b} \\cdot \\vec{b} = |\\vec{a}|^2 - |\\vec{b}|^2$ (교차항 상쇄).' },
];

export const K_G12_GEO_CH02_VECTOR_2D_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
