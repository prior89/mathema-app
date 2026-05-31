/**
 * K-G7-MATH1-CH07-SOLID-FIG — STUDY pool (single-step, 20문제).
 * 입체도형: 정육면체/직육면체/원기둥/원뿔/구 · 부피·겉넓이·회전체·닮음비.
 * Mastery 3-step과 별도 변형 문제.
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5. LLM 미사용.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G7-MATH1-CH07-SOLID-FIG';
const SKILLS_CUBE = ['cube_volume', 'cube_surface'];
const SKILLS_BOX = ['rect_box_volume', 'rect_box_surface'];
const SKILLS_CYL = ['cylinder_volume', 'cylinder_surface'];
const SKILLS_CONE = ['cone_volume', 'cone_surface'];
const SKILLS_SPHERE = ['sphere_volume', 'sphere_surface'];
const SKILLS_INV = ['inverse_dimension', 'volume_to_radius'];
const SKILLS_ROTATE = ['rotation_solid', 'axis_rotation'];
const SKILLS_RATIO = ['similar_volume_ratio', 'similar_area_ratio'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) 정육면체 부피 (모서리 3)
  { chapterCode: CODE, difficulty: 'easy', concept: '정육면체 부피 (작은 수)', requiredSkills: SKILLS_CUBE,
    stem: '한 모서리의 길이가 $3$ cm 인 정육면체의 부피는?',
    options: [
      { key: 'A', text: '$27$ cm³', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$9$ cm³', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$3^2$만 — 넓이 공식' },
      { key: 'C', text: '$54$ cm³', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '겉넓이 $6 \\times 9$' },
      { key: 'D', text: '$12$ cm³', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$4 \\times 3$ 잘못된 식' },
      { key: 'E', text: '$6$ cm³', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '한 면의 둘레만' },
    ],
    solution: '정육면체 부피 $= (모서리)^3 = 3^3 = 27$ cm³.' },

  // S2 (쉬움) 정육면체 겉넓이 (모서리 4)
  { chapterCode: CODE, difficulty: 'easy', concept: '정육면체 겉넓이', requiredSkills: SKILLS_CUBE,
    stem: '한 모서리 $4$ cm 정육면체의 겉넓이는?',
    options: [
      { key: 'A', text: '$96$ cm²', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$16$ cm²', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '한 면 넓이만' },
      { key: 'C', text: '$64$ cm²', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부피 공식 적용' },
      { key: 'D', text: '$24$ cm²', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$6 \\times 4$ — 한 면 면적 누락' },
      { key: 'E', text: '$48$ cm²', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3 \\times 16$ 면 개수 잘못' },
    ],
    solution: '겉넓이 $= 6 \\times (모서리)^2 = 6 \\times 16 = 96$ cm².' },

  // S3 (쉬움) 직육면체 부피
  { chapterCode: CODE, difficulty: 'easy', concept: '직육면체 부피 (작은 수)', requiredSkills: SKILLS_BOX,
    stem: '가로 $2$, 세로 $3$, 높이 $6$ 인 직육면체의 부피는? (단위 cm)',
    options: [
      { key: 'A', text: '$36$ cm³', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$11$ cm³', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$2 + 3 + 6$ 합' },
      { key: 'C', text: '$22$ cm³', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$(2+3+6) \\times 2$ 잘못' },
      { key: 'D', text: '$6$ cm³', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$2 \\times 3$만' },
      { key: 'E', text: '$72$ cm³', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2 \\times 36$ 잘못' },
    ],
    solution: '부피 $= 2 \\times 3 \\times 6 = 36$ cm³.' },

  // S4 (쉬움) 직육면체 겉넓이
  { chapterCode: CODE, difficulty: 'easy', concept: '직육면체 겉넓이', requiredSkills: SKILLS_BOX,
    stem: '가로 $2$, 세로 $3$, 높이 $4$ 인 직육면체의 겉넓이는?',
    options: [
      { key: 'A', text: '$52$ cm²', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$24$ cm²', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부피 자체' },
      { key: 'C', text: '$26$ cm²', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '세 다른 면 넓이 합만 (한쪽씩만)' },
      { key: 'D', text: '$48$ cm²', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 곱' },
      { key: 'E', text: '$72$ cm²', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3 \\times 24$ 잘못된 식' },
    ],
    solution: '겉넓이 $= 2(가\\cdot세 + 세\\cdot높 + 높\\cdot가) = 2(6 + 12 + 8) = 2 \\times 26 = 52$ cm².' },

  // S5 (쉬움) 원기둥 부피
  { chapterCode: CODE, difficulty: 'easy', concept: '원기둥 부피', requiredSkills: SKILLS_CYL,
    stem: '반지름 $3$ cm, 높이 $4$ cm 원기둥의 부피는? ($\\pi$ 그대로)',
    options: [
      { key: 'A', text: '$36\\pi$ cm³', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$12\\pi$ cm³', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$r$ 제곱 누락 ($\\pi r h$)' },
      { key: 'C', text: '$24\\pi$ cm³', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2\\pi r h$ 옆넓이 공식 적용' },
      { key: 'D', text: '$48\\pi$ cm³', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원기둥 겉넓이 $r=4, h=2$ 같이 잘못' },
      { key: 'E', text: '$9\\pi$ cm³', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '높이 미곱셈 (밑면 넓이만)' },
    ],
    solution: '$V = \\pi r^2 h = \\pi \\times 9 \\times 4 = 36\\pi$ cm³.' },

  // S6 (쉬움) 구 부피
  { chapterCode: CODE, difficulty: 'easy', concept: '구 부피', requiredSkills: SKILLS_SPHERE,
    stem: '반지름 $2$ cm 구의 부피는?',
    options: [
      { key: 'A', text: '$\\dfrac{32}{3}\\pi$ cm³', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$16\\pi$ cm³', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '구 겉넓이 $4\\pi r^2$ 답함' },
      { key: 'C', text: '$8\\pi$ cm³', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\dfrac{4}{3}$ 누락 ($\\pi r^3$ 만)' },
      { key: 'D', text: '$\\dfrac{8}{3}\\pi$ cm³', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\dfrac{1}{3} \\pi r^3$ 잘못된 계수' },
      { key: 'E', text: '$32\\pi$ cm³', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\dfrac{1}{3}$ 누락' },
    ],
    solution: '$V = \\dfrac{4}{3}\\pi r^3 = \\dfrac{4}{3}\\pi \\times 8 = \\dfrac{32}{3}\\pi$ cm³.' },

  // S7 (중) 원뿔 부피
  { chapterCode: CODE, difficulty: 'medium', concept: '원뿔 부피', requiredSkills: SKILLS_CONE,
    stem: '반지름 $3$ cm, 높이 $5$ cm 원뿔의 부피는?',
    options: [
      { key: 'A', text: '$15\\pi$ cm³', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$45\\pi$ cm³', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\dfrac{1}{3}$ 누락 (원기둥 부피)' },
      { key: 'C', text: '$5\\pi$ cm³', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$r$ 제곱 누락' },
      { key: 'D', text: '$30\\pi$ cm³', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\dfrac{2}{3}$ 잘못된 계수' },
      { key: 'E', text: '$9\\pi$ cm³', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$h = 3$으로 잘못 대입' },
    ],
    solution: '$V = \\dfrac{1}{3}\\pi r^2 h = \\dfrac{1}{3}\\pi \\times 9 \\times 5 = 15\\pi$ cm³.' },

  // S8 (중) 원기둥 부피 → 반지름
  { chapterCode: CODE, difficulty: 'medium', concept: '원기둥 부피로 반지름 역추적', requiredSkills: SKILLS_INV,
    stem: '높이 $4$ cm 인 원기둥의 부피가 $64\\pi$ cm³ 일 때 반지름은?',
    options: [
      { key: 'A', text: '$4$ cm', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$8$ cm', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$r^2$를 제곱근 없이 답함' },
      { key: 'C', text: '$2$ cm', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$64\\pi / 16$ 잘못' },
      { key: 'D', text: '$16$ cm', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$r^2$ 값을 답함' },
      { key: 'E', text: '$\\sqrt{16}$ cm', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\sqrt{16} = 4$ 단순화 안 함' },
    ],
    solution: '$\\pi r^2 \\times 4 = 64\\pi \\to r^2 = 16 \\to r = 4$ cm.' },

  // S9 (중) 구 부피 → r
  { chapterCode: CODE, difficulty: 'medium', concept: '구 부피로 반지름 역추적', requiredSkills: SKILLS_INV,
    stem: '구의 부피가 $288\\pi$ cm³ 이다. 반지름은?',
    options: [
      { key: 'A', text: '$6$ cm', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$4$ cm', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$r^3 = 64$로 잘못 계산' },
      { key: 'C', text: '$8$ cm', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$r^3 = 512$로 오류' },
      { key: 'D', text: '$216$ cm', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$r^3$ 값을 답함' },
      { key: 'E', text: '$12$ cm', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\sqrt[3]{288 \\cdot 3/4}$ 잘못 계산' },
    ],
    solution: '$\\dfrac{4}{3}\\pi r^3 = 288\\pi \\to r^3 = 216 \\to r = 6$ cm.' },

  // S10 (중) 원기둥 겉넓이
  { chapterCode: CODE, difficulty: 'medium', concept: '원기둥 겉넓이', requiredSkills: SKILLS_CYL,
    stem: '반지름 $2$ cm, 높이 $5$ cm 원기둥의 겉넓이는?',
    options: [
      { key: 'A', text: '$28\\pi$ cm²', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$20\\pi$ cm²', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '두 밑면 넓이 누락 (옆넓이만 $2\\pi r h$)' },
      { key: 'C', text: '$24\\pi$ cm²', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '밑면 한 개만 더함' },
      { key: 'D', text: '$36\\pi$ cm²', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 합' },
      { key: 'E', text: '$8\\pi$ cm²', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '두 밑면만 ($2\\pi r^2$)' },
    ],
    solution: '겉넓이 $= 2\\pi r^2 + 2\\pi r h = 2\\pi(4 + 10) = 28\\pi$ cm².' },

  // S11 (중) 정육면체 겉넓이 → 모서리
  { chapterCode: CODE, difficulty: 'medium', concept: '겉넓이로 모서리 역추적', requiredSkills: SKILLS_INV,
    stem: '정육면체의 겉넓이가 $216$ cm² 이다. 한 모서리는?',
    options: [
      { key: 'A', text: '$6$ cm', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$36$ cm', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '한 면 넓이 답함' },
      { key: 'C', text: '$8$ cm', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\sqrt[3]{216} = 6$인데 잘못' },
      { key: 'D', text: '$216$ cm', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '겉넓이 값 자체' },
      { key: 'E', text: '$12$ cm', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 제곱근' },
    ],
    solution: '$6a^2 = 216 \\to a^2 = 36 \\to a = 6$ cm.' },

  // S12 (중) 회전체 (직사각형 가로 축)
  { chapterCode: CODE, difficulty: 'medium', concept: '직사각형 회전 → 원기둥', requiredSkills: SKILLS_ROTATE,
    stem: '가로 $5$, 세로 $3$ 인 직사각형을 가로(길이 $5$)를 축으로 한 바퀴 회전시킨 입체와 부피는?',
    options: [
      { key: 'A', text: '원기둥, $45\\pi$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '원기둥, $75\\pi$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$r = 5, h = 3$ 잘못 (축 길이가 높이)' },
      { key: 'C', text: '원뿔, $15\\pi$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '직사각형 회전은 원기둥, 원뿔 X' },
      { key: 'D', text: '구, $45\\pi$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '직사각형 회전 → 구 아님' },
      { key: 'E', text: '원기둥, $30\\pi$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\pi \\times 6 \\times 5$ 등 잘못' },
    ],
    solution: '축에 수직인 변($3$)이 반지름, 축 길이($5$)가 높이. $V = \\pi r^2 h = \\pi \\times 9 \\times 5 = 45\\pi$.' },

  // S13 (중) 회전체 반원 (r=4)
  { chapterCode: CODE, difficulty: 'medium', concept: '반원 회전 → 구', requiredSkills: SKILLS_ROTATE,
    stem: '반지름 $4$ 인 반원을 지름을 축으로 회전시킨 입체와 부피는?',
    options: [
      { key: 'A', text: '구, $\\dfrac{256}{3}\\pi$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '구, $64\\pi$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\dfrac{4}{3}$ 누락' },
      { key: 'C', text: '원기둥, $64\\pi$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '반원 회전은 구' },
      { key: 'D', text: '반구, $\\dfrac{128}{3}\\pi$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '반원의 한 바퀴 = 완전한 구' },
      { key: 'E', text: '구, $\\dfrac{64}{3}\\pi$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계수 잘못 ($r^3 = 64$인데 $\\dfrac{1}{3}$만)' },
    ],
    solution: '반원 한 바퀴 → 구. $V = \\dfrac{4}{3}\\pi \\times 64 = \\dfrac{256}{3}\\pi$.' },

  // S14 (중) 원뿔 겉넓이
  { chapterCode: CODE, difficulty: 'medium', concept: '원뿔 겉넓이', requiredSkills: SKILLS_CONE,
    stem: '밑면 반지름 $4$, 모선 길이 $6$ 인 원뿔의 겉넓이는?',
    options: [
      { key: 'A', text: '$40\\pi$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$24\\pi$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '밑면 누락 (옆넓이 $\\pi r l$만)' },
      { key: 'C', text: '$16\\pi$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '옆넓이 누락 (밑면 $\\pi r^2$만)' },
      { key: 'D', text: '$48\\pi$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2\\pi r l = 48\\pi$ 두 배로' },
      { key: 'E', text: '$8\\pi$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
    ],
    solution: '겉넓이 $= \\pi r^2 + \\pi r l = 16\\pi + 24\\pi = 40\\pi$.' },

  // S15 (중) 원기둥 : 원뿔 부피비 (변형 — 같은 r, h 비)
  { chapterCode: CODE, difficulty: 'medium', concept: '같은 밑면·높이 원기둥 vs 원뿔', requiredSkills: SKILLS_CONE,
    stem: '같은 밑면 반지름과 같은 높이를 가진 원뿔과 원기둥의 부피비 (원뿔 : 원기둥)는?',
    options: [
      { key: 'A', text: '$1 : 3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3 : 1$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '비의 방향 바꿈 (원기둥 : 원뿔)' },
      { key: 'C', text: '$1 : 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '구 : 원기둥 비와 혼동' },
      { key: 'D', text: '$2 : 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '구 : 원기둥 (h=2r) 비' },
      { key: 'E', text: '$1 : 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '비례 무시' },
    ],
    solution: '원뿔 $= \\dfrac{1}{3}\\pi r^2 h$, 원기둥 $= \\pi r^2 h$. 원뿔 : 원기둥 $= 1 : 3$.' },

  // S16 (어려움) 구 부피 = 원기둥의 2/3 (h=2r)
  { chapterCode: CODE, difficulty: 'hard', concept: '구 vs 원기둥 (h=2r) 부피 비', requiredSkills: SKILLS_SPHERE,
    stem: '반지름 $r$ 인 구가 반지름 $r$, 높이 $2r$ 인 원기둥에 꼭 맞게 들어 있다. 구의 부피는 원기둥 부피의?',
    options: [
      { key: 'A', text: '$\\dfrac{2}{3}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{1}{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원뿔 비율과 혼동' },
      { key: 'C', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 약분' },
      { key: 'D', text: '$\\dfrac{4}{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '구 부피 계수 자체' },
      { key: 'E', text: '$1$ (같음)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '맞다고 가정' },
    ],
    solution: '구 $= \\dfrac{4}{3}\\pi r^3$, 원기둥 $= \\pi r^2 \\cdot 2r = 2\\pi r^3$. 비 $= \\dfrac{4/3}{2} = \\dfrac{2}{3}$.' },

  // S17 (어려움) 정육면체 내접 구 부피 (모서리 8)
  { chapterCode: CODE, difficulty: 'hard', concept: '정육면체 내접 구', requiredSkills: SKILLS_SPHERE,
    stem: '한 모서리 $8$ 인 정육면체에 꽉 끼는 구 (지름 = 모서리)를 넣었다. 구의 부피는?',
    options: [
      { key: 'A', text: '$\\dfrac{256}{3}\\pi$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{2048}{3}\\pi$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$r = 8$로 사용 (지름과 반지름 혼동)' },
      { key: 'C', text: '$\\dfrac{64}{3}\\pi$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$r = 2$로 잘못' },
      { key: 'D', text: '$64\\pi$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '구 겉넓이 $4\\pi r^2$ 답함' },
      { key: 'E', text: '$512\\pi$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '정육면체 부피' },
    ],
    solution: '지름 $= 8 \\to r = 4$. $V = \\dfrac{4}{3}\\pi \\times 64 = \\dfrac{256}{3}\\pi$.' },

  // S18 (어려움) 잠긴 구 = 넘친 물
  { chapterCode: CODE, difficulty: 'hard', concept: '잠긴 구 부피 = 넘친 물', requiredSkills: SKILLS_SPHERE,
    stem: '반지름 $4$, 높이 $7$ 인 원기둥 컵에 물이 가득 차 있다. 반지름 $3$ 구 한 개를 완전히 잠기게 넣었다 (구가 컵 안에 들어감). 넘쳐 흐른 물의 부피는?',
    options: [
      { key: 'A', text: '$36\\pi$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$112\\pi$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원기둥 부피 자체 답함' },
      { key: 'C', text: '$27\\pi$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '구 부피 공식 적용 누락 ($r^3$만)' },
      { key: 'D', text: '$76\\pi$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원기둥 - 구 차' },
      { key: 'E', text: '$12\\pi$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 계산' },
    ],
    solution: '넘친 물 부피 = 구 부피 $= \\dfrac{4}{3}\\pi \\times 27 = 36\\pi$.' },

  // S19 (어려움) 회전체 직각삼각형
  { chapterCode: CODE, difficulty: 'hard', concept: '직각삼각형 회전 → 원뿔', requiredSkills: SKILLS_ROTATE,
    stem: '직각을 낀 두 변이 $5,\\ 12$ 인 직각삼각형을 길이 $5$ 인 변을 축으로 회전시킨 원뿔의 부피는?',
    options: [
      { key: 'A', text: '$240\\pi$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$720\\pi$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\dfrac{1}{3}$ 누락' },
      { key: 'C', text: '$100\\pi$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$r, h$ 바꿈 ($r=5, h=12$)' },
      { key: 'D', text: '$60\\pi$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$r$ 제곱 안 함' },
      { key: 'E', text: '$300\\pi$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 계산' },
    ],
    solution: '축에 수직인 변($12$)이 반지름, 축 길이($5$)가 높이. $V = \\dfrac{1}{3}\\pi \\times 144 \\times 5 = 240\\pi$.' },

  // S20 (어려움) 닮음 → 겉넓이 비
  { chapterCode: CODE, difficulty: 'hard', concept: '닮음 → 겉넓이 비 (제곱)', requiredSkills: SKILLS_RATIO,
    stem: '정육면체의 한 모서리를 $3$ 배로 늘리면 겉넓이는 몇 배가 되는가?',
    options: [
      { key: 'A', text: '$9$ 배', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3$ 배', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '길이 비를 그대로 답함' },
      { key: 'C', text: '$27$ 배', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부피 비 (세제곱)' },
      { key: 'D', text: '$6$ 배', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2 \\times 3$ 등 잘못' },
      { key: 'E', text: '$18$ 배', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 곱' },
    ],
    solution: '닮음비 $k$일 때 겉넓이 비 $= k^2$. $3^2 = 9$ 배.' },
];

export const K_G7_MATH1_CH07_SOLID_FIG_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
