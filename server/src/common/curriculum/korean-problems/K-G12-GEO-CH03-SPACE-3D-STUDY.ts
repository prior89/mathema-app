/**
 * K-G12-GEO-CH03-SPACE-3D — STUDY pool (single-step, 20문제).
 * 공간도형과 공간벡터 — 좌표/거리, 구, 공간벡터, 평면, 점-평면 거리.
 * Mastery 3-step과 별도 변형 문제. 고3 기하 (G12).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5. LLM 미사용.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G12-GEO-CH03-SPACE-3D';
const SKILLS_DIST = ['space_distance'];
const SKILLS_SPHERE = ['sphere_equation'];
const SKILLS_VEC_MAG = ['space_vector_magnitude'];
const SKILLS_VEC_OP = ['space_vector_ops'];
const SKILLS_DOT = ['space_dot_product'];
const SKILLS_MID = ['midpoint_3d'];
const SKILLS_NORMAL = ['plane_normal_vector'];
const SKILLS_PLANE = ['plane_equation'];
const SKILLS_PAR_PERP = ['parallel_perpendicular'];
const SKILLS_PT_PLANE = ['point_plane_distance'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) A(0,0,0) B(2,3,6) 거리
  { chapterCode: CODE, difficulty: 'easy', concept: '공간 거리 ($O$-$B$)', requiredSkills: SKILLS_DIST,
    stem: '$A(0, 0, 0), B(2, 3, 6)$ 사이 거리?',
    options: [
      { key: 'A', text: '$7$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$11$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$2 + 3 + 6$' },
      { key: 'C', text: '$49$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\sqrt{}$ 누락' },
      { key: 'D', text: '$\\sqrt{11}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$\\sqrt{4 + 9 + 36} = \\sqrt{49} = 7$.' },

  // S2 (쉬움) 원점 (3,4,12) 거리
  { chapterCode: CODE, difficulty: 'easy', concept: '원점 거리 ($3, 4, 12$)', requiredSkills: SKILLS_DIST,
    stem: '원점과 $(3, 4, 12)$ 사이 거리?',
    options: [
      { key: 'A', text: '$13$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$19$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합' },
      { key: 'C', text: '$169$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\sqrt{}$ 누락' },
      { key: 'D', text: '$5$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$z$ 누락' },
      { key: 'E', text: '$12$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$\\sqrt{9 + 16 + 144} = \\sqrt{169} = 13$.' },

  // S3 (쉬움) 구 중심
  { chapterCode: CODE, difficulty: 'easy', concept: '구 중심', requiredSkills: SKILLS_SPHERE,
    stem: '$(x + 1)^2 + y^2 + (z - 2)^2 = 4$ 의 중심?',
    options: [
      { key: 'A', text: '$(-1, 0, 2)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(1, 0, -2)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'C', text: '$(1, 0, 2)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$x$ 부호' },
      { key: 'D', text: '$(-1, 0, -2)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$z$ 부호' },
      { key: 'E', text: '$(0, 0, 0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원점' },
    ],
    solution: '$(x - h)^2 + ...$ 표준형. $h = -1, k = 0, l = 2$ → $(-1, 0, 2)$.' },

  // S4 (쉬움) 구 반지름 (r²=4)
  { chapterCode: CODE, difficulty: 'easy', concept: '구 반지름', requiredSkills: SKILLS_SPHERE,
    stem: '같은 구 ($r^2 = 4$) 의 반지름?',
    options: [
      { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$4$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\sqrt{}$ 누락' },
      { key: 'C', text: '$16$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$\\sqrt{2}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'E', text: '$8$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$r = \\sqrt{4} = 2$.' },

  // S5 (쉬움) (2,3,6) 크기
  { chapterCode: CODE, difficulty: 'easy', concept: '공간벡터 크기', requiredSkills: SKILLS_VEC_MAG,
    stem: '$\\vec{a} = (2, 3, 6)$ 의 크기?',
    options: [
      { key: 'A', text: '$7$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$11$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합' },
      { key: 'C', text: '$\\sqrt{11}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$49$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\sqrt{}$ 누락' },
      { key: 'E', text: '$6$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '최댓값만' },
    ],
    solution: '$\\sqrt{4 + 9 + 36} = 7$.' },

  // S6 (쉬움) (1,1,1) (3,3,3) 중점
  { chapterCode: CODE, difficulty: 'easy', concept: '중점', requiredSkills: SKILLS_MID,
    stem: '두 점 $(1, 1, 1), (3, 3, 3)$ 의 중점?',
    options: [
      { key: 'A', text: '$(2, 2, 2)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(4, 4, 4)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$2$ 나눔 누락' },
      { key: 'C', text: '$(1, 1, 1)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$(3, 3, 3)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$(2, 3, 2)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '잘못' },
    ],
    solution: '$\\left( \\dfrac{1+3}{2}, \\dfrac{1+3}{2}, \\dfrac{1+3}{2} \\right) = (2, 2, 2)$.' },

  // S7 (중) (1,1,1)·(2,3,4)
  { chapterCode: CODE, difficulty: 'medium', concept: '공간 내적', requiredSkills: SKILLS_DOT,
    stem: '$\\vec{a} = (1, 1, 1), \\vec{b} = (2, 3, 4)$. $\\vec{a} \\cdot \\vec{b}$?',
    options: [
      { key: 'A', text: '$9$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$12$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'C', text: '$(2, 3, 4)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '성분곱 (벡터 X)' },
      { key: 'D', text: '$24$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$2 \\cdot 3 \\cdot 4$' },
      { key: 'E', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '$1 \\cdot 2 + 1 \\cdot 3 + 1 \\cdot 4 = 9$.' },

  // S8 (중) (1,1,1) + (2,3,4)
  { chapterCode: CODE, difficulty: 'medium', concept: '공간 벡터 합', requiredSkills: SKILLS_VEC_OP,
    stem: '같은 $\\vec{a}, \\vec{b}$. $\\vec{a} + \\vec{b}$?',
    options: [
      { key: 'A', text: '$(3, 4, 5)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(2, 3, 4)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\vec{b}$ 자체' },
      { key: 'C', text: '$9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '내적' },
      { key: 'D', text: '$(2, 3, 4) + 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$(3, 4, 4)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '한 성분 누락' },
    ],
    solution: '$(1+2, 1+3, 1+4) = (3, 4, 5)$.' },

  // S9 (중) (3,4,12) 크기
  { chapterCode: CODE, difficulty: 'medium', concept: '벡터 크기 ($3, 4, 12$)', requiredSkills: SKILLS_VEC_MAG,
    stem: '$\\vec{a} = (3, 4, 12)$ 의 크기?',
    options: [
      { key: 'A', text: '$13$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$5$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$z$ 누락' },
      { key: 'C', text: '$169$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\sqrt{}$ 누락' },
      { key: 'D', text: '$19$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합' },
      { key: 'E', text: '$12$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '최댓값' },
    ],
    solution: '$\\sqrt{9 + 16 + 144} = \\sqrt{169} = 13$.' },

  // S10 (중) 법선벡터
  { chapterCode: CODE, difficulty: 'medium', concept: '평면 법선벡터', requiredSkills: SKILLS_NORMAL,
    stem: '평면 $2x - y + z = 5$ 의 법선벡터?',
    options: [
      { key: 'A', text: '$(2, -1, 1)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(2, 1, 1)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'C', text: '$(-2, 1, -1)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '잘못' },
      { key: 'D', text: '$(2, -1, 5)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '상수항 포함' },
      { key: 'E', text: '$(5, 5, 5)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$ax + by + cz = d$ 의 법선 $= (a, b, c) = (2, -1, 1)$.' },

  // S11 (중) 평면 방정식 (원점 통과)
  { chapterCode: CODE, difficulty: 'medium', concept: '평면 방정식 (원점)', requiredSkills: SKILLS_PLANE,
    stem: '원점을 지나고 법선 $(2, 3, 4)$ 인 평면의 방정식?',
    options: [
      { key: 'A', text: '$2x + 3y + 4z = 0$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$2x + 3y + 4z = 9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$d$ 잘못' },
      { key: 'C', text: '$x + y + z = 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '계수 누락' },
      { key: 'D', text: '$2x - 3y + 4z = 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'E', text: '$\\sqrt{29} = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '평면 $a(x - x_0) + b(y - y_0) + c(z - z_0) = 0$. 원점 → $ax + by + cz = 0$.' },

  // S12 (중) 평행 조건
  { chapterCode: CODE, difficulty: 'medium', concept: '평행 조건', requiredSkills: SKILLS_PAR_PERP,
    stem: '두 공간 벡터 $\\vec{a}, \\vec{b}$ (영 아님) 평행 조건?',
    options: [
      { key: 'A', text: '$\\vec{b} = k \\vec{a}$ 인 실수 $k$ 존재', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\vec{a} \\cdot \\vec{b} = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '수직' },
      { key: 'C', text: '$|\\vec{a}| = |\\vec{b}|$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '크기' },
      { key: 'D', text: '$\\vec{a} + \\vec{b} = \\vec{0}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$\\vec{a} \\cdot \\vec{b} = 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '평행 ↔ 한 벡터가 다른 벡터의 스칼라배.' },

  // S13 (중) 구 반지름
  { chapterCode: CODE, difficulty: 'medium', concept: '$x^2 + y^2 + z^2 = 100$ 반지름', requiredSkills: SKILLS_SPHERE,
    stem: '$x^2 + y^2 + z^2 = 100$ 의 반지름?',
    options: [
      { key: 'A', text: '$10$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$100$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\sqrt{}$ 누락' },
      { key: 'C', text: '$50$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$\\sqrt{10}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'E', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '$r = \\sqrt{100} = 10$.' },

  // S14 (중) (2,4,6) (4,6,8) 중점
  { chapterCode: CODE, difficulty: 'medium', concept: '중점 (일반)', requiredSkills: SKILLS_MID,
    stem: '$A(2, 4, 6), B(4, 6, 8)$ 의 중점?',
    options: [
      { key: 'A', text: '$(3, 5, 7)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(6, 10, 14)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$2$ 나눔 누락' },
      { key: 'C', text: '$(2, 2, 2)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$B - A$' },
      { key: 'D', text: '$(1, 1, 1)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$(3, 5, 6)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$z$ 잘못' },
    ],
    solution: '$\\left( \\dfrac{2+4}{2}, \\dfrac{4+6}{2}, \\dfrac{6+8}{2} \\right) = (3, 5, 7)$.' },

  // S15 (중) 평면 위 점
  { chapterCode: CODE, difficulty: 'medium', concept: '점이 평면 위', requiredSkills: SKILLS_PLANE,
    stem: '점 $(2, 1, 3)$ 이 평면 $x + y + z = 6$ 위에 있는가?',
    options: [
      { key: 'A', text: '있다 ($2 + 1 + 3 = 6$)', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '없다 ($2 + 1 + 3 = 5$)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합 잘못' },
      { key: 'C', text: '없다 ($x \\neq y$)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '판정 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '판정 가능' },
      { key: 'E', text: '두 점에서 만남', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '평면 방정식에 대입: $2 + 1 + 3 = 6$ ○.' },

  // S16 (어려움) 점-평면 거리
  { chapterCode: CODE, difficulty: 'hard', concept: '점-평면 거리', requiredSkills: SKILLS_PT_PLANE,
    stem: '원점 $O$ 와 평면 $x + 2y + 2z - 9 = 0$ 의 거리?',
    options: [
      { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$9$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '분모 누락' },
      { key: 'C', text: '$\\dfrac{9}{\\sqrt{5}}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '법선 크기 잘못' },
      { key: 'D', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'E', text: '$\\sqrt{9}$ $= 3$ (미완)', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '단순화 X' },
    ],
    solution: '$d = \\dfrac{|0 + 0 + 0 - 9|}{\\sqrt{1 + 4 + 4}} = \\dfrac{9}{3} = 3$.' },

  // S17 (어려움) 두 평면 사이 각 cos
  { chapterCode: CODE, difficulty: 'hard', concept: '두 평면 사이 각', requiredSkills: SKILLS_PLANE,
    stem: '두 평면 $x + y = 1, x + y + z = 2$ 사이 각의 $\\cos$?',
    options: [
      { key: 'A', text: '$\\dfrac{\\sqrt{6}}{3}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{2}{3}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\sqrt{6}$ 잘못' },
      { key: 'C', text: '$\\dfrac{1}{\\sqrt{6}}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '내적 잘못' },
      { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '수직 아님' },
      { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '법선 $\\vec{n_1} = (1, 1, 0), \\vec{n_2} = (1, 1, 1)$. $\\cos\\theta = \\dfrac{2}{\\sqrt{2} \\cdot \\sqrt{3}} = \\dfrac{2}{\\sqrt{6}} = \\dfrac{\\sqrt{6}}{3}$.' },

  // S18 (어려움) |AB| 3D
  { chapterCode: CODE, difficulty: 'hard', concept: '$|\\vec{AB}|$ ($O$-$(2,3,6)$)', requiredSkills: SKILLS_VEC_MAG,
    stem: '$A(0, 0, 0), B(2, 3, 6)$. $|\\vec{AB}|$?',
    options: [
      { key: 'A', text: '$7$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$11$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합' },
      { key: 'C', text: '$49$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\sqrt{}$ 누락' },
      { key: 'D', text: '$\\sqrt{45}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '한 성분 누락' },
      { key: 'E', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '$\\vec{AB} = (2, 3, 6), |\\vec{AB}| = \\sqrt{4 + 9 + 36} = 7$.' },

  // S19 (어려움) 구의 방정식 (원점, r=5)
  { chapterCode: CODE, difficulty: 'hard', concept: '구의 방정식 (원점)', requiredSkills: SKILLS_SPHERE,
    stem: '중심이 원점, 반지름 $5$ 인 구의 방정식?',
    options: [
      { key: 'A', text: '$x^2 + y^2 + z^2 = 25$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x^2 + y^2 + z^2 = 5$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$r$ 제곱 누락' },
      { key: 'C', text: '$(x - 5)^2 + y^2 + z^2 = 25$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '중심 잘못' },
      { key: 'D', text: '$x + y + z = 5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평면' },
      { key: 'E', text: '$x^2 + y^2 + z^2 = 125$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$5^3$' },
    ],
    solution: '$(x - 0)^2 + (y - 0)^2 + (z - 0)^2 = 5^2 = 25$.' },

  // S20 (어려움) 평행 판정
  { chapterCode: CODE, difficulty: 'hard', concept: '평행 판정 ($\\vec{b} = 3 \\vec{a}$)', requiredSkills: SKILLS_PAR_PERP,
    stem: '$\\vec{a} = (1, 2, 3), \\vec{b} = (3, 6, 9)$. 두 벡터 관계?',
    options: [
      { key: 'A', text: '평행 ($\\vec{b} = 3 \\vec{a}$)', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '수직 (내적 $= 0$)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '내적 $\\neq 0$' },
      { key: 'C', text: '같은 벡터', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '관계 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평행' },
      { key: 'E', text: '판정 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '판정 가능' },
    ],
    solution: '$\\vec{b} = 3 \\vec{a}$ → 평행 (같은 방향).' },
];

export const K_G12_GEO_CH03_SPACE_3D_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
