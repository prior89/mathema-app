/**
 * K-G7-MATH1-CH07-SOLID-FIG (입체도형) — 20문제 3-step Mastery.
 * 중1 — 정육면체/직육면체 → 원기둥/원뿔/구 부피·겉넓이 → 회전체 → 닮음비.
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 * 주요 errorCode 분배:
 *   FORMULA_SELECTION_ERROR 6 (Q5,6,7,10,15,20) / ARITHMETIC_ERROR 4 (Q1,2,3,4)
 *   GEOMETRY_PROPERTY_ERROR 4 (Q12,13,16,19) / ALGEBRA_ERROR 3 (Q8,9,14)
 *   CONDITION_MISSING 2 (Q17,18) / EXPONENT_ERROR 1 (Q11)
 *
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G7-MATH1-CH07-SOLID-FIG';
const SKILLS_CUBE = ['cube_volume', 'cube_surface_area'];
const SKILLS_BOX = ['rectangular_box_volume', 'rectangular_box_surface'];
const SKILLS_CYL = ['cylinder_volume', 'cylinder_surface_area'];
const SKILLS_CONE = ['cone_volume', 'cone_surface_area', 'one_third_factor'];
const SKILLS_SPHERE = ['sphere_volume', 'sphere_surface_area'];
const SKILLS_ROTATE = ['rotation_solid_identification'];
const SKILLS_INV = ['inverse_solid', 'algebraic_inversion'];

const problems: KoreanProblemSeed[] = [
  // Q1 정육면체 4cm 부피
  { chapterCode: CODE, difficulty: 'easy', concept: '정육면체 부피', requiredSkills: SKILLS_CUBE,
    stem: '한 모서리의 길이가 $4$cm 인 정육면체의 부피는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '정육면체 부피 공식?', options: [
        { key: 'A', text: '$V = a^3$ (한 모서리 길이의 세제곱)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$V = 6a^2$ (겉넓이 공식)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '겉넓이와 혼동' },
        { key: 'C', text: '$V = a^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱 (넓이)' },
        { key: 'D', text: '$V = 4a$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$V = a + a + a$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합으로' },
      ] },
      { stepType: 'PROCESS', prompt: '$4^3 = ?$', options: [
        { key: 'A', text: '$64$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$12$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$4 \\times 3$' },
        { key: 'C', text: '$16$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$4^2$' },
        { key: 'D', text: '$256$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$4^4$' },
        { key: 'E', text: '$48$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$4 \\times 12$' },
      ] },
      { stepType: 'ANSWER', prompt: '부피는?', options: [
        { key: 'A', text: '$64$ cm³', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$16$ cm³', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$4^2$' },
        { key: 'C', text: '$96$ cm³', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '겉넓이 $6 \\cdot 16$' },
        { key: 'D', text: '$12$ cm³', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$256$ cm³', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$4^4$' },
      ] },
    ], solution: '$V = 4^3 = 64$ cm³.' },

  // Q2 정육면체 5cm 겉넓이
  { chapterCode: CODE, difficulty: 'easy', concept: '정육면체 겉넓이', requiredSkills: SKILLS_CUBE,
    stem: '한 모서리 $5$cm 정육면체의 겉넓이는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '정육면체 겉넓이 공식?', options: [
        { key: 'A', text: '$S = 6a^2$ (한 면 $a^2$ × 6면)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$S = a^3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '부피' },
        { key: 'C', text: '$S = a^2$ (한 면만)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '6면 누락' },
        { key: 'D', text: '$S = 4a^2$ (밑면 제외)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$S = 6a$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱 누락' },
      ] },
      { stepType: 'PROCESS', prompt: '$6 \\times 5^2$', options: [
        { key: 'A', text: '$6 \\times 25 = 150$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$6 \\times 5 = 30$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '제곱 누락' },
        { key: 'C', text: '$5^2 = 25$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\times 6$ 누락' },
        { key: 'D', text: '$6 \\times 125 = 750$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$5^3$로 잘못' },
        { key: 'E', text: '$30^2 = 900$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '곱하고 제곱' },
      ] },
      { stepType: 'ANSWER', prompt: '겉넓이는?', options: [
        { key: 'A', text: '$150$ cm²', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$125$ cm²', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '부피' },
        { key: 'C', text: '$25$ cm²', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '한 면' },
        { key: 'D', text: '$30$ cm²', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$6 \\times 5$' },
        { key: 'E', text: '$100$ cm²', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$S = 6 \\times 5^2 = 150$ cm².' },

  // Q3 직육면체 3·4·5 부피
  { chapterCode: CODE, difficulty: 'easy', concept: '직육면체 부피', requiredSkills: SKILLS_BOX,
    stem: '가로 $3$, 세로 $4$, 높이 $5$ 인 직육면체의 부피는? (단위 cm)',
    steps: [
      { stepType: 'CONCEPT', prompt: '직육면체 부피 공식?', options: [
        { key: 'A', text: '$V = $ 가로 $\\times$ 세로 $\\times$ 높이', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$V = $ 가로 $+$ 세로 $+$ 높이', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
        { key: 'C', text: '$V = 6 \\times $ (한 면)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '겉넓이' },
        { key: 'D', text: '$V = 2($ 가로 $\\times$ 세로 $)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$V = $ 가로 $^3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '정육면체' },
      ] },
      { stepType: 'PROCESS', prompt: '$3 \\times 4 \\times 5$', options: [
        { key: 'A', text: '$60$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$12$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3 \\times 4$만' },
        { key: 'C', text: '$20$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$4 \\times 5$만' },
        { key: 'D', text: '$15$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3 \\times 5$만' },
        { key: 'E', text: '$12$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합' },
      ] },
      { stepType: 'ANSWER', prompt: '부피는?', options: [
        { key: 'A', text: '$60$ cm³', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$12$ cm³', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '한 면만' },
        { key: 'C', text: '$94$ cm³', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '겉넓이' },
        { key: 'D', text: '$47$ cm³', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '겉넓이/2' },
        { key: 'E', text: '$120$ cm³', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\times 2$' },
      ] },
    ], solution: '$V = 3 \\times 4 \\times 5 = 60$ cm³.' },

  // Q4 직육면체 3·4·5 겉넓이
  { chapterCode: CODE, difficulty: 'easy', concept: '직육면체 겉넓이', requiredSkills: SKILLS_BOX,
    stem: '가로 $3$, 세로 $4$, 높이 $5$ 인 직육면체의 겉넓이는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '직육면체 겉넓이 공식?', options: [
        { key: 'A', text: '$S = 2(ab + bc + ca)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$S = abc$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '부피' },
        { key: 'C', text: '$S = a + b + c$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
        { key: 'D', text: '$S = 6abc$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$S = ab + bc + ca$ (×2 누락)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '한 쪽 면만' },
      ] },
      { stepType: 'PROCESS', prompt: '$2(3 \\cdot 4 + 4 \\cdot 5 + 3 \\cdot 5)$', options: [
        { key: 'A', text: '$2(12 + 20 + 15) = 2 \\cdot 47 = 94$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$12 + 20 + 15 = 47$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\times 2$ 누락' },
        { key: 'C', text: '$2(3 + 4 + 5) = 24$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱 누락' },
        { key: 'D', text: '$3 \\cdot 4 \\cdot 5 = 60$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '부피' },
        { key: 'E', text: '$6 \\cdot 60 = 360$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '잘못된 곱' },
      ] },
      { stepType: 'ANSWER', prompt: '겉넓이는?', options: [
        { key: 'A', text: '$94$ cm²', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$47$ cm²', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\times 2$ 누락' },
        { key: 'C', text: '$60$ cm²', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '부피' },
        { key: 'D', text: '$24$ cm²', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$12$ cm²', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '한 면' },
      ] },
    ], solution: '$S = 2(3\\cdot4 + 4\\cdot5 + 3\\cdot5) = 2 \\cdot 47 = 94$ cm².' },

  // Q5 원기둥 r=2, h=3 부피
  { chapterCode: CODE, difficulty: 'easy', concept: '원기둥 부피', requiredSkills: SKILLS_CYL,
    stem: '반지름 $2$cm, 높이 $3$cm 인 원기둥의 부피는? ($\\pi$ 그대로)',
    steps: [
      { stepType: 'CONCEPT', prompt: '원기둥 부피 공식?', options: [
        { key: 'A', text: '$V = \\pi r^2 h$ (밑넓이 × 높이)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$V = \\pi r h$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱 누락' },
        { key: 'C', text: '$V = 2\\pi r h$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '옆넓이' },
        { key: 'D', text: '$V = \\frac{1}{3} \\pi r^2 h$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '원뿔' },
        { key: 'E', text: '$V = \\frac{4}{3} \\pi r^3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '구' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\pi \\cdot 2^2 \\cdot 3$', options: [
        { key: 'A', text: '$\\pi \\cdot 4 \\cdot 3 = 12\\pi$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\pi \\cdot 2 \\cdot 3 = 6\\pi$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱 누락' },
        { key: 'C', text: '$\\pi \\cdot 4 = 4\\pi$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\times h$ 누락' },
        { key: 'D', text: '$4\\pi \\cdot 3 / 3 = 4\\pi$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '원뿔 공식' },
        { key: 'E', text: '$2\\pi \\cdot 6 = 12\\pi$ (옆넓이)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '우연한 동일값이지만 공식 다름' },
      ] },
      { stepType: 'ANSWER', prompt: '부피는?', options: [
        { key: 'A', text: '$12\\pi$ cm³', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$6\\pi$ cm³', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱 누락' },
        { key: 'C', text: '$4\\pi$ cm³', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$h$ 누락' },
        { key: 'D', text: '$\\frac{12\\pi}{3} = 4\\pi$ cm³', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '원뿔' },
        { key: 'E', text: '$36\\pi$ cm³', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '구 부피' },
      ] },
    ], solution: '$V = \\pi r^2 h = \\pi \\cdot 4 \\cdot 3 = 12\\pi$ cm³.' },

  // Q6 구 r=3 부피
  { chapterCode: CODE, difficulty: 'easy', concept: '구 부피', requiredSkills: SKILLS_SPHERE,
    stem: '반지름 $3$cm 구의 부피는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '구 부피 공식?', options: [
        { key: 'A', text: '$V = \\frac{4}{3}\\pi r^3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$V = 4\\pi r^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '겉넓이' },
        { key: 'C', text: '$V = \\frac{1}{3}\\pi r^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$V = \\pi r^3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$4/3$ 누락' },
        { key: 'E', text: '$V = \\frac{4}{3}\\pi r^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$r^3$이어야' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\frac{4}{3}\\pi \\cdot 3^3$', options: [
        { key: 'A', text: '$\\frac{4}{3}\\pi \\cdot 27 = 36\\pi$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\frac{4}{3}\\pi \\cdot 9 = 12\\pi$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$3^2$' },
        { key: 'C', text: '$4\\pi \\cdot 9 = 36\\pi$ (겉넓이 우연 일치)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '공식 다름' },
        { key: 'D', text: '$\\pi \\cdot 27 = 27\\pi$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$4/3$ 누락' },
        { key: 'E', text: '$\\frac{4}{3} \\cdot 27 = 36$ ($\\pi$ 누락)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\pi$ 누락' },
      ] },
      { stepType: 'ANSWER', prompt: '구 부피는?', options: [
        { key: 'A', text: '$36\\pi$ cm³', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$27\\pi$ cm³', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$4/3$ 누락' },
        { key: 'C', text: '$12\\pi$ cm³', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$r^2$로' },
        { key: 'D', text: '$9\\pi$ cm³', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$108\\pi$ cm³', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\times 3$' },
      ] },
    ], solution: '$V = \\frac{4}{3}\\pi \\cdot 27 = 36\\pi$ cm³.' },

  // Q7 원뿔 r=4, h=6 부피
  { chapterCode: CODE, difficulty: 'medium', concept: '원뿔 부피', requiredSkills: SKILLS_CONE,
    stem: '반지름 $4$cm, 높이 $6$cm 원뿔의 부피는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '원뿔 부피 공식?', options: [
        { key: 'A', text: '$V = \\frac{1}{3}\\pi r^2 h$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$V = \\pi r^2 h$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$1/3$ 누락 (원기둥)' },
        { key: 'C', text: '$V = \\frac{4}{3}\\pi r^3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '구' },
        { key: 'D', text: '$V = \\pi r h$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$V = \\frac{1}{2}\\pi r^2 h$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음 (1/3이지 1/2 아님)' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\frac{1}{3}\\pi \\cdot 4^2 \\cdot 6$', options: [
        { key: 'A', text: '$\\frac{1}{3}\\pi \\cdot 16 \\cdot 6 = 32\\pi$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\pi \\cdot 16 \\cdot 6 = 96\\pi$ ($1/3$ 누락)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '원기둥' },
        { key: 'C', text: '$\\frac{1}{3}\\pi \\cdot 4 \\cdot 6 = 8\\pi$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '제곱 누락' },
        { key: 'D', text: '$\\frac{1}{3} \\cdot 16 \\cdot 6 = 32$ ($\\pi$ 누락)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\pi$ 누락' },
        { key: 'E', text: '$\\frac{1}{3}\\pi \\cdot 64 \\cdot 6$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$4^3$' },
      ] },
      { stepType: 'ANSWER', prompt: '원뿔 부피는?', options: [
        { key: 'A', text: '$32\\pi$ cm³', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$96\\pi$ cm³', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '원기둥' },
        { key: 'C', text: '$8\\pi$ cm³', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '제곱 누락' },
        { key: 'D', text: '$48\\pi$ cm³', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$32$ cm³', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\pi$ 누락' },
      ] },
    ], solution: '$V = \\frac{1}{3}\\pi \\cdot 16 \\cdot 6 = 32\\pi$ cm³.' },

  // Q8 원기둥 부피 100π, r=5, h=?
  { chapterCode: CODE, difficulty: 'medium', concept: '원기둥 — 부피로 높이 역추적', requiredSkills: SKILLS_INV,
    stem: '반지름 $5$cm 인 원기둥의 부피가 $100\\pi$ cm³ 일 때 높이는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\pi r^2 h = 100\\pi$ 에서 $h$ 구하는 법?', options: [
        { key: 'A', text: '양변을 $\\pi r^2$ 로 나눈다', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '양변에서 $\\pi r^2$ 를 뺀다', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '곱셈 → 뺄셈' },
        { key: 'C', text: '$h = 100$ 그대로', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '식 정리 안 함' },
        { key: 'D', text: '양변에 $\\pi r^2$ 곱', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '곱셈 추가' },
        { key: 'E', text: '$h = 100\\pi - 25\\pi$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '뺄셈 잘못' },
      ] },
      { stepType: 'PROCESS', prompt: '$h = 100\\pi / (\\pi \\cdot 25)$', options: [
        { key: 'A', text: '$h = 100/25 = 4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$h = 100$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나눗셈 누락' },
        { key: 'C', text: '$h = 20$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$100/5$' },
        { key: 'D', text: '$h = 25$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$h = 0.25$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$25/100$ 거꾸로' },
      ] },
      { stepType: 'ANSWER', prompt: '높이는?', options: [
        { key: 'A', text: '$4$ cm', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5$ cm', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '반지름 자체' },
        { key: 'C', text: '$20$ cm', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$100$ cm', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나눗셈 누락' },
        { key: 'E', text: '$25$ cm', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\pi \\cdot 25 \\cdot h = 100\\pi \\Rightarrow h = 4$ cm.' },

  // Q9 구 겉넓이 144π → r
  { chapterCode: CODE, difficulty: 'medium', concept: '구 — 겉넓이로 반지름', requiredSkills: SKILLS_INV,
    stem: '구의 겉넓이가 $144\\pi$ cm² 이다. 반지름은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '구 겉넓이 공식?', options: [
        { key: 'A', text: '$S = 4\\pi r^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$S = \\frac{4}{3}\\pi r^3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '부피' },
        { key: 'C', text: '$S = \\pi r^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$4$ 누락' },
        { key: 'D', text: '$S = 4\\pi r$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱 누락' },
        { key: 'E', text: '$S = 2\\pi r^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$4\\pi r^2 = 144\\pi \\Rightarrow r^2 = 36$', options: [
        { key: 'A', text: '$r = 6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$r = 36$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '제곱근 누락' },
        { key: 'C', text: '$r = 18$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$r = 12$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$144/12$ 등 잘못' },
        { key: 'E', text: '$r = 4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '반지름은?', options: [
        { key: 'A', text: '$6$ cm', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$36$ cm', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '제곱근 누락' },
        { key: 'C', text: '$12$ cm', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$3$ cm', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sqrt{144}\\pi$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\pi$ 포함 오해' },
      ] },
    ], solution: '$4\\pi r^2 = 144\\pi \\Rightarrow r^2 = 36 \\Rightarrow r = 6$ cm.' },

  // Q10 원뿔 r=3, l=5 겉넓이
  { chapterCode: CODE, difficulty: 'medium', concept: '원뿔 겉넓이', requiredSkills: SKILLS_CONE,
    stem: '밑면 반지름 $3$, 모선 길이 $5$ 인 원뿔의 겉넓이는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '원뿔 겉넓이 공식?', options: [
        { key: 'A', text: '$S = \\pi r^2 + \\pi r l$ (밑넓이 + 옆넓이)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$S = \\pi r^2$ (밑넓이만)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '옆넓이 누락' },
        { key: 'C', text: '$S = \\pi r l$ (옆넓이만)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '밑넓이 누락' },
        { key: 'D', text: '$S = 4\\pi r^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '구' },
        { key: 'E', text: '$S = 2\\pi r h$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '원기둥 옆넓이' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\pi \\cdot 9 + \\pi \\cdot 3 \\cdot 5$', options: [
        { key: 'A', text: '$9\\pi + 15\\pi = 24\\pi$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$9\\pi$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '옆넓이 누락' },
        { key: 'C', text: '$15\\pi$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '밑넓이 누락' },
        { key: 'D', text: '$9\\pi - 15\\pi = -6\\pi$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '뺄셈' },
        { key: 'E', text: '$135\\pi$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '곱' },
      ] },
      { stepType: 'ANSWER', prompt: '겉넓이는?', options: [
        { key: 'A', text: '$24\\pi$ cm²', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$9\\pi$ cm²', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '밑만' },
        { key: 'C', text: '$15\\pi$ cm²', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '옆만' },
        { key: 'D', text: '$30\\pi$ cm²', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$45\\pi$ cm²', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$S = \\pi r^2 + \\pi r l = 9\\pi + 15\\pi = 24\\pi$ cm².' },

  // Q11 정육면체 부피 343 → 한 모서리
  { chapterCode: CODE, difficulty: 'medium', concept: '정육면체 — 부피로 모서리', requiredSkills: SKILLS_INV,
    stem: '부피가 $343$ cm³ 인 정육면체의 한 모서리는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$a^3 = 343$ 의 $a$ 는?', options: [
        { key: 'A', text: '세제곱근을 취한다: $a = \\sqrt[3]{343}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a = 343 / 3$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '나눗셈' },
        { key: 'C', text: '$a = 343$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '식 변형 안 함' },
        { key: 'D', text: '$a = \\sqrt{343}$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '제곱근 (2제곱)' },
        { key: 'E', text: '$a = 343 - 3$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '뺄셈' },
      ] },
      { stepType: 'PROCESS', prompt: '$7^3 = 343$ 확인', options: [
        { key: 'A', text: '$7 \\cdot 7 \\cdot 7 = 343$ ✓', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5^3 = 125 \\neq 343$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '다른 수' },
        { key: 'C', text: '$6^3 = 216 \\neq 343$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '다른 수' },
        { key: 'D', text: '$8^3 = 512 \\neq 343$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '다른 수' },
        { key: 'E', text: '$9^3 = 729 \\neq 343$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '다른 수' },
      ] },
      { stepType: 'ANSWER', prompt: '한 모서리는?', options: [
        { key: 'A', text: '$7$ cm', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5$ cm', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$5^3=125$' },
        { key: 'C', text: '$6$ cm', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$6^3=216$' },
        { key: 'D', text: '$8$ cm', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$8^3=512$' },
        { key: 'E', text: '$343$ cm', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '식 변형 안 함' },
      ] },
    ], solution: '$a^3 = 343 = 7^3 \\Rightarrow a = 7$ cm.' },

  // Q12 회전체 (직사각형 한 변 축으로) → 원기둥
  { chapterCode: CODE, difficulty: 'medium', concept: '회전체 (직사각형 → 원기둥)', requiredSkills: SKILLS_ROTATE,
    stem: '가로 $3$, 세로 $4$ 인 직사각형을 세로(길이 $4$)를 축으로 한 바퀴 회전시키면 어떤 입체와 부피는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '직사각형을 한 변을 축으로 회전시키면?', options: [
        { key: 'A', text: '원기둥 (밑 반지름 = 회전 안 한 변, 높이 = 축의 변)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '원뿔', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '직각삼각형의 경우' },
        { key: 'C', text: '구', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '반원의 경우' },
        { key: 'D', text: '정육면체', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '회전체 아님' },
        { key: 'E', text: '도넛(원환체)', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '축이 도형 밖일 때' },
      ] },
      { stepType: 'PROCESS', prompt: '밑 반지름 $r = 3$, 높이 $h = 4$ 의 원기둥 부피?', options: [
        { key: 'A', text: '$\\pi \\cdot 9 \\cdot 4 = 36\\pi$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\pi \\cdot 3 \\cdot 4 = 12\\pi$ (제곱 누락)', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '제곱 누락' },
        { key: 'C', text: '$\\pi \\cdot 16 \\cdot 3 = 48\\pi$ ($r,h$ 바꿔)', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '축/회전변 혼동' },
        { key: 'D', text: '$\\frac{1}{3}\\pi \\cdot 9 \\cdot 4 = 12\\pi$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '원뿔 공식' },
        { key: 'E', text: '$3 \\cdot 4 = 12$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '직사각형 넓이' },
      ] },
      { stepType: 'ANSWER', prompt: '부피는?', options: [
        { key: 'A', text: '원기둥, $36\\pi$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '원뿔, $12\\pi$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '원기둥인데 원뿔 공식' },
        { key: 'C', text: '원기둥, $12\\pi$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '제곱 누락' },
        { key: 'D', text: '원기둥, $48\\pi$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '$r,h$ 바꿈' },
        { key: 'E', text: '구, $36\\pi$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '구 아님' },
      ] },
    ], solution: '세로축 회전 → 원기둥 (반지름 $3$, 높이 $4$). $V = \\pi \\cdot 9 \\cdot 4 = 36\\pi$.' },

  // Q13 회전체 (반원 → 구)
  { chapterCode: CODE, difficulty: 'medium', concept: '회전체 (반원 → 구)', requiredSkills: SKILLS_ROTATE,
    stem: '반지름 $5$ 인 반원을 지름을 축으로 회전시킨 입체와 부피는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '반원을 지름 축으로 회전?', options: [
        { key: 'A', text: '구 (반지름 = 반원의 반지름)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '원기둥', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '직사각형 회전' },
        { key: 'C', text: '원뿔', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '직각삼각형 회전' },
        { key: 'D', text: '반구만', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '한 바퀴 회전이면 구 전체' },
        { key: 'E', text: '도넛', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '축이 도형 밖일 때만' },
      ] },
      { stepType: 'PROCESS', prompt: '$V = \\frac{4}{3}\\pi \\cdot 5^3$', options: [
        { key: 'A', text: '$\\frac{4}{3}\\pi \\cdot 125 = \\frac{500}{3}\\pi$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4\\pi \\cdot 25 = 100\\pi$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '겉넓이' },
        { key: 'C', text: '$\\frac{4}{3}\\pi \\cdot 25 = \\frac{100}{3}\\pi$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$r^2$' },
        { key: 'D', text: '$\\pi \\cdot 125 = 125\\pi$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$4/3$ 누락' },
        { key: 'E', text: '$\\frac{1}{3}\\pi \\cdot 25 \\cdot 5 = \\frac{125}{3}\\pi$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '원뿔' },
      ] },
      { stepType: 'ANSWER', prompt: '입체와 부피는?', options: [
        { key: 'A', text: '구, $\\frac{500}{3}\\pi$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '반구, $\\frac{250}{3}\\pi$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '한 바퀴 회전 = 구 전체' },
        { key: 'C', text: '원뿔, $\\frac{125}{3}\\pi$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '회전체 종류 잘못' },
        { key: 'D', text: '원기둥, $125\\pi$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '회전체 종류 잘못' },
        { key: 'E', text: '구, $100\\pi$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '겉넓이' },
      ] },
    ], solution: '반원의 지름 축 회전 → 구 (반지름 $5$). $V = \\frac{4}{3}\\pi \\cdot 125 = \\frac{500}{3}\\pi$.' },

  // Q14 원뿔 V=π, r=1 → h
  { chapterCode: CODE, difficulty: 'medium', concept: '원뿔 — 부피로 높이', requiredSkills: SKILLS_INV,
    stem: '반지름 $1$ 인 원뿔의 부피가 $\\pi$ cm³ 일 때 높이는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\frac{1}{3}\\pi r^2 h = V$ 에서 $h$ 식?', options: [
        { key: 'A', text: '$h = \\frac{3V}{\\pi r^2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$h = \\frac{V}{\\pi r^2}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '원기둥 공식 거꾸로' },
        { key: 'C', text: '$h = V - \\pi r^2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '뺄셈' },
        { key: 'D', text: '$h = 3V$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나누기 누락' },
        { key: 'E', text: '$h = \\frac{V}{3\\pi r^2}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$1/3$ 처리 잘못' },
      ] },
      { stepType: 'PROCESS', prompt: '$h = \\frac{3 \\cdot \\pi}{\\pi \\cdot 1}$', options: [
        { key: 'A', text: '$h = 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$h = 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$\\frac{1}{3}$ 처리 잘못' },
        { key: 'C', text: '$h = \\frac{1}{3}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '거꾸로 나눔' },
        { key: 'D', text: '$h = \\pi$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$\\pi$ 안 나눔' },
        { key: 'E', text: '$h = 0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '높이는?', options: [
        { key: 'A', text: '$3$ cm', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$ cm', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$1/3$ 잘못' },
        { key: 'C', text: '$\\pi$ cm', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$\\pi$ 누락 안 함' },
        { key: 'D', text: '$\\frac{1}{3}$ cm', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '거꾸로' },
        { key: 'E', text: '$\\frac{\\pi}{3}$ cm', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\frac{1}{3}\\pi h = \\pi \\Rightarrow h = 3$.' },

  // Q15 원기둥:원뿔 부피비 (같은 r,h)
  { chapterCode: CODE, difficulty: 'medium', concept: '원기둥 : 원뿔 부피비', requiredSkills: SKILLS_CONE,
    stem: '같은 밑면 반지름과 높이를 가진 원기둥과 원뿔의 부피비는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '원뿔 부피 = 원기둥 부피 × ?', options: [
        { key: 'A', text: '$\\frac{1}{3}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\frac{1}{2}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$\\frac{1}{4}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1$ (같음)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '원기둥과 다름' },
        { key: 'E', text: '$\\frac{2}{3}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '원뿔 : 원기둥 = ?', options: [
        { key: 'A', text: '$\\frac{1}{3} : 1 = 1 : 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1 : 1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$2 : 3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$3 : 1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '거꾸로' },
        { key: 'E', text: '$1 : 2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '원기둥 : 원뿔 = ?', options: [
        { key: 'A', text: '$3 : 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1 : 3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '거꾸로 (원뿔 : 원기둥)' },
        { key: 'C', text: '$1 : 1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '같다는 오해' },
        { key: 'D', text: '$2 : 1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$3 : 2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '같은 밑·높이 → 원뿔 = $\\frac{1}{3}$ 원기둥. 원기둥 : 원뿔 = $3 : 1$.' },

  // Q16 (hard) 구:원기둥 비율 (높이 = 2r)
  { chapterCode: CODE, difficulty: 'hard', concept: '구 : 원기둥 비율', requiredSkills: SKILLS_SPHERE,
    stem: '반지름 $r$ 인 구의 부피는, 반지름 $r$ 이고 높이가 $2r$ 인 원기둥 부피의 몇 배?',
    steps: [
      { stepType: 'CONCEPT', prompt: '두 공식 적용?', options: [
        { key: 'A', text: '구 $\\frac{4}{3}\\pi r^3$, 원기둥 $\\pi r^2 \\cdot 2r = 2\\pi r^3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '구 $4\\pi r^2$, 원기둥 $\\pi r^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '겉넓이' },
        { key: 'C', text: '구 $\\pi r^3$, 원기둥 $\\pi r^3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '계수 누락' },
        { key: 'D', text: '구 $\\frac{4}{3}\\pi r^3$, 원기둥 $\\pi r^2 r = \\pi r^3$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '높이 $2r$ 누락' },
        { key: 'E', text: '구 $\\frac{4}{3}\\pi r^2$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$r^2$' },
      ] },
      { stepType: 'PROCESS', prompt: '구 / 원기둥 = ?', options: [
        { key: 'A', text: '$\\frac{\\frac{4}{3}\\pi r^3}{2\\pi r^3} = \\frac{4}{6} = \\frac{2}{3}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\frac{4}{3}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '원기둥 $\\pi r^3$로 잘못' },
        { key: 'C', text: '$\\frac{1}{3}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '원뿔과 혼동' },
        { key: 'D', text: '$2$ (구가 큼)', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '구가 더 작음' },
        { key: 'E', text: '$\\frac{4}{9}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '몇 배?', options: [
        { key: 'A', text: '$\\frac{2}{3}$ 배', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\frac{1}{3}$ 배', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '원뿔과 혼동' },
        { key: 'C', text: '$\\frac{4}{3}$ 배', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '계산 잘못' },
        { key: 'D', text: '$2$ 배', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\frac{3}{2}$ 배', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '뒤집힘' },
      ] },
    ], solution: '구 = $\\frac{4}{3}\\pi r^3$, 원기둥 = $2\\pi r^3$. 비율 $= \\frac{4/3}{2} = \\frac{2}{3}$.' },

  // Q17 정육면체 안의 구 (지름 6) 부피
  { chapterCode: CODE, difficulty: 'hard', concept: '내접하는 구 부피', requiredSkills: SKILLS_SPHERE,
    stem: '한 모서리 $6$ 인 정육면체에 꽉 끼는 구 (지름 = 모서리)를 넣었다. 구의 부피는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '구의 반지름은?', options: [
        { key: 'A', text: '$r = $ 지름 / 2 $= 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$r = 6$ (지름과 같음)', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '지름 ≠ 반지름' },
        { key: 'C', text: '$r = 12$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'D', text: '$r = 6\\sqrt{3}$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '대각선 적용' },
        { key: 'E', text: '$r = 6\\sqrt{2}$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\frac{4}{3}\\pi \\cdot 3^3$', options: [
        { key: 'A', text: '$\\frac{4}{3}\\pi \\cdot 27 = 36\\pi$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\frac{4}{3}\\pi \\cdot 9 = 12\\pi$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$r^2$' },
        { key: 'C', text: '$\\frac{4}{3}\\pi \\cdot 216 = 288\\pi$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$r=6$ 사용' },
        { key: 'D', text: '$\\pi \\cdot 27 = 27\\pi$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$4/3$ 누락' },
        { key: 'E', text: '$6^3 = 216$ (정육면체 부피)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '정육면체 부피' },
      ] },
      { stepType: 'ANSWER', prompt: '구 부피는?', options: [
        { key: 'A', text: '$36\\pi$ cm³', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$216\\pi$ cm³', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$r=6$' },
        { key: 'C', text: '$216$ cm³', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '정육면체' },
        { key: 'D', text: '$12\\pi$ cm³', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$r^2$' },
        { key: 'E', text: '$288\\pi$ cm³', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
    ], solution: '지름 $6$ → 반지름 $3$. $V = \\frac{4}{3}\\pi \\cdot 27 = 36\\pi$.' },

  // Q18 컵에 구 넣었을 때 넘치는 물
  { chapterCode: CODE, difficulty: 'hard', concept: '잠긴 구의 부피 = 넘친 물 부피', requiredSkills: SKILLS_SPHERE,
    stem: '반지름 $5$, 높이 $10$ 원기둥 컵에 물이 가득. 반지름 $4$ 구 한 개를 완전히 잠기게 넣었다 (구가 컵 안에 들어감). 넘쳐 흐른 물의 부피는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '구가 잠기면 넘친 물 부피는?', options: [
        { key: 'A', text: '구의 부피와 같다 (아르키메데스 원리)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '컵의 부피와 같다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '컵 전체가 넘치진 않음' },
        { key: 'C', text: '구의 겉넓이와 같다', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '겉넓이는 차원이 다름' },
        { key: 'D', text: '구와 컵의 차', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '0 (안 넘침)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '물 가득 + 구 잠김 → 넘침' },
      ] },
      { stepType: 'PROCESS', prompt: '구의 부피 $\\frac{4}{3}\\pi \\cdot 4^3$', options: [
        { key: 'A', text: '$\\frac{4}{3}\\pi \\cdot 64 = \\frac{256}{3}\\pi$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\frac{4}{3}\\pi \\cdot 16 = \\frac{64}{3}\\pi$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$r^2$' },
        { key: 'C', text: '$4\\pi \\cdot 64 = 256\\pi$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$1/3$ 누락' },
        { key: 'D', text: '$\\pi \\cdot 64 = 64\\pi$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$4/3$ 누락' },
        { key: 'E', text: '$\\frac{4}{3}\\pi \\cdot 12 = 16\\pi$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$4 \\cdot 3$' },
      ] },
      { stepType: 'ANSWER', prompt: '넘친 물의 부피는?', options: [
        { key: 'A', text: '$\\frac{256}{3}\\pi$ cm³', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\frac{64}{3}\\pi$ cm³', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$r^2$' },
        { key: 'C', text: '$256\\pi$ cm³', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$1/3$ 누락' },
        { key: 'D', text: '$250\\pi$ cm³', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '컵 부피' },
        { key: 'E', text: '$0$ cm³', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '넘침' },
      ] },
    ], solution: '아르키메데스: 잠긴 구 부피 = 넘친 물. $V = \\frac{4}{3}\\pi \\cdot 64 = \\frac{256}{3}\\pi$ cm³.' },

  // Q19 (hard) 회전체 (직각삼각형 → 원뿔)
  { chapterCode: CODE, difficulty: 'hard', concept: '회전체 (직각삼각형 → 원뿔)', requiredSkills: SKILLS_ROTATE,
    stem: '직각을 낀 두 변이 $3$, $4$ 인 직각삼각형을 길이 $4$ 변을 축으로 회전시킨 원뿔의 부피는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '회전 후 원뿔의 반지름과 높이는?', options: [
        { key: 'A', text: '반지름 = $3$ (회전 안 한 직각변), 높이 = $4$ (축)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '반지름 = $4$, 높이 = $3$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '축과 회전변 혼동' },
        { key: 'C', text: '반지름 = $5$ (빗변), 높이 = $4$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '빗변은 모선' },
        { key: 'D', text: '반지름 = $3$, 높이 = $5$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '높이는 축' },
        { key: 'E', text: '회전체는 구', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '직각삼각형 회전 = 원뿔' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\frac{1}{3}\\pi \\cdot 3^2 \\cdot 4$', options: [
        { key: 'A', text: '$\\frac{1}{3}\\pi \\cdot 9 \\cdot 4 = 12\\pi$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\pi \\cdot 9 \\cdot 4 = 36\\pi$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '원기둥 공식' },
        { key: 'C', text: '$\\frac{1}{3}\\pi \\cdot 16 \\cdot 3$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '$r,h$ 바꿈' },
        { key: 'D', text: '$\\frac{1}{3}\\pi \\cdot 5^2 \\cdot 4$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '빗변 사용' },
        { key: 'E', text: '$\\frac{1}{3}\\pi \\cdot 3 \\cdot 4 = 4\\pi$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '제곱 누락' },
      ] },
      { stepType: 'ANSWER', prompt: '부피는?', options: [
        { key: 'A', text: '$12\\pi$ cm³', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$36\\pi$ cm³', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '원기둥' },
        { key: 'C', text: '$16\\pi$ cm³', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '$r,h$ 바꿈' },
        { key: 'D', text: '$4\\pi$ cm³', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '제곱 누락' },
        { key: 'E', text: '$60\\pi$ cm³', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '회전체 = 원뿔 (반지름 $3$, 높이 $4$). $V = \\frac{1}{3}\\pi \\cdot 9 \\cdot 4 = 12\\pi$.' },

  // Q20 (hard) 모서리 2배 → 부피 ?배
  { chapterCode: CODE, difficulty: 'hard', concept: '닮음 → 부피비', requiredSkills: SKILLS_CUBE,
    stem: '정육면체의 한 모서리를 $2$ 배로 늘리면 부피는 몇 배가 되는가?',
    steps: [
      { stepType: 'CONCEPT', prompt: '한 모서리가 $a \\to 2a$ 되면 부피는?', options: [
        { key: 'A', text: '$V \\to (2a)^3 = 8a^3$ → 8배', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$V \\to 2a^3$ → 2배', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '제곱 처리 잘못' },
        { key: 'C', text: '$V \\to 4a^3$ → 4배', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$2^2$' },
        { key: 'D', text: '변화 없음', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$V \\to 6a^3$ → 6배', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$2^3 = ?$', options: [
        { key: 'A', text: '$8$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '제곱 무시' },
        { key: 'C', text: '$4$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$2^2$' },
        { key: 'D', text: '$6$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$2 \\times 3$' },
        { key: 'E', text: '$16$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$2^4$' },
      ] },
      { stepType: 'ANSWER', prompt: '부피는 몇 배?', options: [
        { key: 'A', text: '$8$ 배', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2$ 배', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '제곱 무시' },
        { key: 'C', text: '$4$ 배 (제곱비)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '넓이비 규칙' },
        { key: 'D', text: '$6$ 배', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$16$ 배', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '모서리 $\\times 2$ → 부피 $\\times 2^3 = 8$ 배 (닮음비 $1:2$ → 부피비 $1:8$).' },
];

export const K_G7_MATH1_CH07_SOLID_FIG_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
