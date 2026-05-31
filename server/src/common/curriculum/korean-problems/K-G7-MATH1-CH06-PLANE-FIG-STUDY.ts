/**
 * K-G7-MATH1-CH06-PLANE-FIG — STUDY pool (single-step, 20문제).
 * 평면도형: 삼각형/다각형 내각·외각, 정다각형, 합동, 대각선.
 * Mastery 3-step과 별도 변형 문제.
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5. LLM 미사용.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G7-MATH1-CH06-PLANE-FIG';
const SKILLS_TRI = ['triangle_interior_sum_180', 'remaining_angle'];
const SKILLS_RIGHT = ['right_triangle', 'complement_angle'];
const SKILLS_ISOS = ['isosceles_triangle', 'base_angle'];
const SKILLS_POLY = ['polygon_interior_sum', 'side_count'];
const SKILLS_REG = ['regular_polygon_interior', 'angle_division'];
const SKILLS_EXT = ['polygon_exterior_sum_360', 'regular_exterior'];
const SKILLS_INV = ['polygon_inverse_n', 'interior_to_n'];
const SKILLS_DIAG = ['diagonal_count', 'polygon_diagonal_formula'];
const SKILLS_RATIO = ['interior_exterior_ratio', 'regular_polygon_solve'];
const SKILLS_PARALLEL = ['parallel_triangle', 'transversal_angle'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) 삼각형 나머지 각
  { chapterCode: CODE, difficulty: 'easy', concept: '삼각형 나머지 각', requiredSkills: SKILLS_TRI,
    stem: '$\\triangle ABC$ 에서 $\\angle A = 40°$, $\\angle B = 85°$ 일 때 $\\angle C$ 는?',
    options: [
      { key: 'A', text: '$55°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$125°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$40 + 85$ 합산을 답함' },
      { key: 'C', text: '$45°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$85 - 40$ 차로' },
      { key: 'D', text: '$95°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$180 - 85$만 처리' },
      { key: 'E', text: '$140°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$180 - 40$만 처리' },
    ],
    solution: '삼각형 내각 합 $= 180°$. $\\angle C = 180 - 40 - 85 = 55°$.' },

  // S2 (쉬움) 직각삼각형 예각
  { chapterCode: CODE, difficulty: 'easy', concept: '직각삼각형 두 예각의 합', requiredSkills: SKILLS_RIGHT,
    stem: '직각삼각형의 한 예각이 $30°$ 일 때, 다른 한 예각의 크기는?',
    options: [
      { key: 'A', text: '$60°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$30°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '두 예각이 같다고 가정' },
      { key: 'C', text: '$150°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$180 - 30$ 평각 적용' },
      { key: 'D', text: '$90°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '직각으로 답함' },
      { key: 'E', text: '$45°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 평균' },
    ],
    solution: '직각삼각형: 직각 + 두 예각 = $180°$. 두 예각 합 $= 90°$. $90 - 30 = 60°$.' },

  // S3 (쉬움) 이등변삼각형 밑각
  { chapterCode: CODE, difficulty: 'easy', concept: '이등변삼각형 밑각', requiredSkills: SKILLS_ISOS,
    stem: '이등변삼각형의 꼭지각이 $80°$ 이다. 한 밑각의 크기는?',
    options: [
      { key: 'A', text: '$50°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$100°$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$180 - 80$ 합 그대로 (둘로 안 나눔)' },
      { key: 'C', text: '$80°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '꼭지각과 밑각 혼동' },
      { key: 'D', text: '$40°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$80 / 2$ 잘못된 식' },
      { key: 'E', text: '$60°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '정삼각형 가정' },
    ],
    solution: '이등변삼각형 두 밑각 합 $= 180 - 80 = 100°$. 같으므로 한 밑각 $= 50°$.' },

  // S4 (쉬움) 사각형 한 각 추적
  { chapterCode: CODE, difficulty: 'easy', concept: '사각형 한 각 추적 (내각 합 360°)', requiredSkills: SKILLS_POLY,
    stem: '사각형의 세 내각이 $70°,\\ 95°,\\ 110°$ 이다. 나머지 한 내각은?',
    options: [
      { key: 'A', text: '$85°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$95°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 합 계산' },
      { key: 'C', text: '$275°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '세 각의 합을 답함' },
      { key: 'D', text: '$60°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '내각 합 $= 270°$로 오해' },
      { key: 'E', text: '$180°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '삼각형 내각 합 적용' },
    ],
    solution: '사각형 내각 합 $= 360°$. $360 - 70 - 95 - 110 = 85°$.' },

  // S5 (쉬움) 육각형 내각 합
  { chapterCode: CODE, difficulty: 'easy', concept: '육각형 내각 합', requiredSkills: SKILLS_POLY,
    stem: '육각형의 여섯 내각의 합은?',
    options: [
      { key: 'A', text: '$720°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$360°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '사각형 내각 합' },
      { key: 'C', text: '$540°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '오각형 내각 합' },
      { key: 'D', text: '$900°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$(6) \\times 180$ 잘못' },
      { key: 'E', text: '$1080°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '팔각형 내각 합' },
    ],
    solution: '$n$각형 내각 합 $= 180°(n - 2)$. $n = 6$ → $180 \\times 4 = 720°$.' },

  // S6 (쉬움) 정오각형 한 내각
  { chapterCode: CODE, difficulty: 'easy', concept: '정오각형 한 내각', requiredSkills: SKILLS_REG,
    stem: '정오각형 한 내각의 크기는?',
    options: [
      { key: 'A', text: '$108°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$72°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '한 외각을 답함' },
      { key: 'C', text: '$120°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '정육각형 한 내각' },
      { key: 'D', text: '$90°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '정사각형 한 내각' },
      { key: 'E', text: '$540°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '내각 합 자체' },
    ],
    solution: '정오각형 내각 합 $= 180 \\times 3 = 540°$. 한 내각 $= 540 / 5 = 108°$.' },

  // S7 (중) 정12각형 한 내각
  { chapterCode: CODE, difficulty: 'medium', concept: '정십이각형 한 내각', requiredSkills: SKILLS_REG,
    stem: '정십이각형 한 내각의 크기는?',
    options: [
      { key: 'A', text: '$150°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$120°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '정육각형과 혼동' },
      { key: 'C', text: '$135°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '정팔각형 한 내각' },
      { key: 'D', text: '$30°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '한 외각을 답함' },
      { key: 'E', text: '$1800°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '내각 합 자체' },
    ],
    solution: '정십이각형 내각 합 $= 180 \\times 10 = 1800°$. 한 내각 $= 1800 / 12 = 150°$.' },

  // S8 (중) 다각형 외각 합
  { chapterCode: CODE, difficulty: 'medium', concept: '외각 합은 항상 360°', requiredSkills: SKILLS_EXT,
    stem: '모든 $n$각형의 외각의 합은?',
    options: [
      { key: 'A', text: '$360°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$180°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '삼각형 내각 합과 혼동' },
      { key: 'C', text: '$180°(n - 2)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '내각 합 공식' },
      { key: 'D', text: '$n$에 따라 변함', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '외각 합은 항상 일정' },
      { key: 'E', text: '$720°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$360 \\times 2$ 잘못' },
    ],
    solution: '$n$ 과 무관하게 모든 볼록 다각형의 외각 합 = $360°$.' },

  // S9 (중) 정10각형 한 외각
  { chapterCode: CODE, difficulty: 'medium', concept: '정십각형 한 외각', requiredSkills: SKILLS_EXT,
    stem: '정십각형 한 외각의 크기는?',
    options: [
      { key: 'A', text: '$36°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$144°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '한 내각을 답함' },
      { key: 'C', text: '$45°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '정팔각형 외각' },
      { key: 'D', text: '$60°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '정육각형 외각' },
      { key: 'E', text: '$10°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$n$ 자체를 답함' },
    ],
    solution: '한 외각 $= 360 / n = 360 / 10 = 36°$.' },

  // S10 (중) 정12각형 한 외각
  { chapterCode: CODE, difficulty: 'medium', concept: '정십이각형 한 외각', requiredSkills: SKILLS_EXT,
    stem: '정십이각형 한 외각의 크기는?',
    options: [
      { key: 'A', text: '$30°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$150°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '한 내각' },
      { key: 'C', text: '$36°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '정십각형 외각' },
      { key: 'D', text: '$45°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '정팔각형 외각' },
      { key: 'E', text: '$60°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '정육각형 외각' },
    ],
    solution: '한 외각 $= 360 / 12 = 30°$.' },

  // S11 (중) 내각 합 720 → 다각형
  { chapterCode: CODE, difficulty: 'medium', concept: '내각 합으로 다각형 역추적', requiredSkills: SKILLS_INV,
    stem: '내각의 합이 $720°$ 인 다각형은 몇 각형인가?',
    options: [
      { key: 'A', text: '$6$각형', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$5$각형', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$540°$와 혼동' },
      { key: 'C', text: '$7$각형', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$180 \\times 5 = 900$와 잘못 매칭' },
      { key: 'D', text: '$4$각형', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '사각형 내각 합 $= 360°$인데 오해' },
      { key: 'E', text: '$8$각형', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$1080°$와 혼동' },
    ],
    solution: '$180(n - 2) = 720 \\to n - 2 = 4 \\to n = 6$.' },

  // S12 (중) 내각 합 1440 → 다각형
  { chapterCode: CODE, difficulty: 'medium', concept: '내각 합 큰 값 → 다각형', requiredSkills: SKILLS_INV,
    stem: '내각의 합이 $1440°$ 인 다각형은 몇 각형인가?',
    options: [
      { key: 'A', text: '$10$각형', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$8$각형', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$1080°$와 혼동' },
      { key: 'C', text: '$12$각형', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$1800°$와 혼동' },
      { key: 'D', text: '$9$각형', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$1260°$ 잘못 매칭' },
      { key: 'E', text: '$14$각형', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$1440 / 180$ 직접 계산 ($n$ 잘못)' },
    ],
    solution: '$180(n - 2) = 1440 \\to n - 2 = 8 \\to n = 10$.' },

  // S13 (중) 한 내각 120 → 정n각형
  { chapterCode: CODE, difficulty: 'medium', concept: '한 내각으로 정$n$각형 역추적', requiredSkills: SKILLS_INV,
    stem: '한 내각이 $120°$ 인 정$n$각형. $n$ 은?',
    options: [
      { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '정오각형 내각 $= 108°$과 혼동' },
      { key: 'C', text: '$8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$120°$를 정팔각형으로 오해' },
      { key: 'D', text: '$12$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '정십이각형 내각 $= 150°$' },
      { key: 'E', text: '$4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '정사각형 내각 $= 90°$' },
    ],
    solution: '한 외각 $= 180 - 120 = 60°$. $n = 360 / 60 = 6$.' },

  // S14 (중) 한 외각 45 → 정n각형
  { chapterCode: CODE, difficulty: 'medium', concept: '한 외각으로 정$n$각형 역추적', requiredSkills: SKILLS_INV,
    stem: '한 외각이 $45°$ 인 정$n$각형은?',
    options: [
      { key: 'A', text: '정팔각형', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '정육각형', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '정육각형 외각 $= 60°$' },
      { key: 'C', text: '정십각형', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '정십각형 외각 $= 36°$' },
      { key: 'D', text: '정사각형', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '정사각형 외각 $= 90°$' },
      { key: 'E', text: '정십이각형', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '정십이각형 외각 $= 30°$' },
    ],
    solution: '$n = 360 / 45 = 8$. 정팔각형.' },

  // S15 (중) 육각형 대각선 개수
  { chapterCode: CODE, difficulty: 'medium', concept: '다각형 대각선의 개수', requiredSkills: SKILLS_DIAG,
    stem: '육각형의 대각선의 개수는?',
    options: [
      { key: 'A', text: '$9$개', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$6$개', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '변의 개수와 혼동' },
      { key: 'C', text: '$15$개', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\binom{6}{2}=15$ — 변 포함' },
      { key: 'D', text: '$12$개', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 공식' },
      { key: 'E', text: '$3$개', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$n - 3$만' },
    ],
    solution: '$n$각형 대각선 개수 $= \\dfrac{n(n - 3)}{2} = \\dfrac{6 \\times 3}{2} = 9$개.' },

  // S16 (어려움) 삼각형 — 비례식 조건
  { chapterCode: CODE, difficulty: 'hard', concept: '삼각형 세 각의 비', requiredSkills: SKILLS_TRI,
    stem: '$\\triangle ABC$ 에서 세 내각의 크기 비가 $\\angle A : \\angle B : \\angle C = 2 : 3 : 4$ 일 때 $\\angle C$ 는?',
    options: [
      { key: 'A', text: '$80°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$60°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\angle B$ 답함' },
      { key: 'C', text: '$40°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\angle A$ 답함' },
      { key: 'D', text: '$90°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$4 \\times 22.5$ 잘못된 단위' },
      { key: 'E', text: '$120°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '비 합 $= 9$이 아닌 $6$으로 오인' },
    ],
    solution: '비의 합 $2 + 3 + 4 = 9$. 한 단위 $= 180 / 9 = 20°$. $\\angle C = 4 \\times 20 = 80°$.' },

  // S17 (어려움) 정n각형 — 내각 = 외각 × 5
  { chapterCode: CODE, difficulty: 'hard', concept: '내·외각 비율 → 정$n$각형', requiredSkills: SKILLS_RATIO,
    stem: '정$n$각형의 한 내각이 한 외각의 $5$ 배이다. $n$ 은?',
    options: [
      { key: 'A', text: '$12$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 외각 $= 36°$로 매칭' },
      { key: 'C', text: '$8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 외각 $= 45°$로 매칭' },
      { key: 'D', text: '$5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$n = 5$로 직접 답함' },
      { key: 'E', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 외각 $= 60°$로 매칭' },
    ],
    solution: '한 내각 $= 5 \\times$ 한 외각. 내각 + 외각 $= 180°$이므로 한 외각 $= 30°$. $n = 360 / 30 = 12$.' },

  // S18 (어려움) 삼각형 합동 비조건
  { chapterCode: CODE, difficulty: 'hard', concept: '삼각형 합동 조건 (비조건 판별)', requiredSkills: SKILLS_TRI,
    stem: '두 삼각형이 항상 합동이 되는 조건이 아닌 것은?',
    options: [
      { key: 'A', text: '세 각이 같다 (AAA)', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '세 변이 같다 (SSS)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: 'SSS는 합동조건' },
      { key: 'C', text: '두 변과 끼인각이 같다 (SAS)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: 'SAS는 합동조건' },
      { key: 'D', text: '한 변과 양 끝각이 같다 (ASA)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: 'ASA는 합동조건' },
      { key: 'E', text: '직각삼각형에서 빗변과 한 예각이 같다 (RHA)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: 'RHA는 직각삼각형 합동조건' },
    ],
    solution: 'AAA는 닮음 조건이고 합동 보장 X (크기 다른 닮은 삼각형 존재). 합동조건: SSS, SAS, ASA.' },

  // S19 (어려움) 내각 합 1800 → n
  { chapterCode: CODE, difficulty: 'hard', concept: '큰 내각 합 → 다각형', requiredSkills: SKILLS_INV,
    stem: '내각의 합이 $1800°$ 인 다각형은 몇 각형인가?',
    options: [
      { key: 'A', text: '$12$각형', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$10$각형', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$1440°$와 혼동' },
      { key: 'C', text: '$11$각형', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$1620°$와 혼동' },
      { key: 'D', text: '$14$각형', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 공식' },
      { key: 'E', text: '$15$각형', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$1800 / 120$ 같은 잘못된 식' },
    ],
    solution: '$180(n - 2) = 1800 \\to n - 2 = 10 \\to n = 12$.' },

  // S20 (어려움) 두 정n각형 외각 차이
  { chapterCode: CODE, difficulty: 'hard', concept: '두 정$n$각형 한 외각의 차', requiredSkills: SKILLS_EXT,
    stem: '정육각형의 한 외각과 정십이각형의 한 외각의 차이는?',
    options: [
      { key: 'A', text: '$30°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$60°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '정육각형 외각 자체' },
      { key: 'C', text: '$90°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$60 + 30$ 합으로' },
      { key: 'D', text: '$120°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '정육각형 한 내각' },
      { key: 'E', text: '$15°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '차의 절반' },
    ],
    solution: '정육각형 외각 $= 60°$, 정십이각형 외각 $= 30°$. 차이 $= 30°$.' },
];

export const K_G7_MATH1_CH06_PLANE_FIG_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
