/**
 * K-G12-GEO-CH01-CONIC — STUDY pool (single-step, 20문제).
 * 이차곡선 — 포물선, 타원, 쌍곡선 (초점, 준선, 점근선, 장축, 단축).
 * Mastery 3-step과 별도 변형 문제. 고3 기하 (G12).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5. LLM 미사용.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G12-GEO-CH01-CONIC';
const SKILLS_PARAB = ['parabola_focus_directrix'];
const SKILLS_ELLIPSE = ['ellipse_foci_axes'];
const SKILLS_HYPERBOLA = ['hyperbola_asymptote'];
const SKILLS_DEF = ['conic_definition'];
const SKILLS_BUILD = ['build_conic_equation'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) y²=12x 초점
  { chapterCode: CODE, difficulty: 'easy', concept: '$y^2 = 12x$ 초점', requiredSkills: SKILLS_PARAB,
    stem: '포물선 $y^2 = 12x$ 의 초점?',
    options: [
      { key: 'A', text: '$(3, 0)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(12, 0)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$4p$ 나눔 누락' },
      { key: 'C', text: '$(0, 3)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '축 잘못' },
      { key: 'D', text: '$(6, 0)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$12/2$' },
      { key: 'E', text: '$(-3, 0)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '준선' },
    ],
    solution: '$4p = 12 \\to p = 3$. 초점 $(p, 0) = (3, 0)$.' },

  // S2 (쉬움) x²=4y 준선
  { chapterCode: CODE, difficulty: 'easy', concept: '$x^2 = 4y$ 준선', requiredSkills: SKILLS_PARAB,
    stem: '$x^2 = 4y$ 의 준선?',
    options: [
      { key: 'A', text: '$y = -1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$y = 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '초점 좌표' },
      { key: 'C', text: '$x = -1$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '축 잘못' },
      { key: 'D', text: '$y = -4$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$4p$ 나눔 누락' },
      { key: 'E', text: '$y = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$x^2 = 4py, p = 1$. 준선 $y = -p = -1$.' },

  // S3 (쉬움) 타원 a, b
  { chapterCode: CODE, difficulty: 'easy', concept: '타원 $a, b$', requiredSkills: SKILLS_ELLIPSE,
    stem: '$\\dfrac{x^2}{25} + \\dfrac{y^2}{16} = 1$ 의 $a, b$ ($a > b > 0$)?',
    options: [
      { key: 'A', text: '$a = 5, b = 4$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$a = 25, b = 16$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '제곱 그대로' },
      { key: 'C', text: '$a = 4, b = 5$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$a > b$ 위배' },
      { key: 'D', text: '$a = 5, b = 5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'E', text: '$a = 25, b = 4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$a = \\sqrt{25} = 5, b = \\sqrt{16} = 4$.' },

  // S4 (쉬움) 단축
  { chapterCode: CODE, difficulty: 'easy', concept: '타원 단축', requiredSkills: SKILLS_ELLIPSE,
    stem: '같은 타원 ($a = 5, b = 4$) 의 단축 길이?',
    options: [
      { key: 'A', text: '$8$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$4$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\times 2$ 누락' },
      { key: 'C', text: '$10$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '장축' },
      { key: 'D', text: '$5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$a$' },
      { key: 'E', text: '$16$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$b^2$' },
    ],
    solution: '단축 $= 2b = 2 \\cdot 4 = 8$.' },

  // S5 (쉬움) 쌍곡선 점근선
  { chapterCode: CODE, difficulty: 'easy', concept: '쌍곡선 점근선', requiredSkills: SKILLS_HYPERBOLA,
    stem: '$\\dfrac{x^2}{4} - \\dfrac{y^2}{9} = 1$ 의 점근선?',
    options: [
      { key: 'A', text: '$y = \\pm \\dfrac{3}{2} x$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$y = \\pm \\dfrac{2}{3} x$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '뒤집음' },
      { key: 'C', text: '$y = \\pm \\dfrac{9}{4} x$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '제곱 그대로' },
      { key: 'D', text: '$y = \\pm 3 x$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$a$ 나눔 누락' },
      { key: 'E', text: '$y = \\pm \\dfrac{1}{2} x$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '$\\dfrac{x^2}{a^2} - \\dfrac{y^2}{b^2}$ 의 점근선 $y = \\pm \\dfrac{b}{a} x = \\pm \\dfrac{3}{2} x$.' },

  // S6 (쉬움) x² = 4py 초점
  { chapterCode: CODE, difficulty: 'easy', concept: '$x^2 = 4py$ 초점', requiredSkills: SKILLS_PARAB,
    stem: '$x^2 = 4py$ ($p > 0$) 의 초점?',
    options: [
      { key: 'A', text: '$(0, p)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(p, 0)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '축 잘못' },
      { key: 'C', text: '$(0, -p)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '준선' },
      { key: 'D', text: '$(0, 4p)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$4p$ 그대로' },
      { key: 'E', text: '$(0, 0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '꼭짓점' },
    ],
    solution: '$y$축 대칭 포물선의 초점은 $(0, p)$.' },

  // S7 (중) y²=4px 준선
  { chapterCode: CODE, difficulty: 'medium', concept: '$y^2 = 4px$ 준선', requiredSkills: SKILLS_PARAB,
    stem: '$y^2 = 4px$ ($p > 0$) 의 준선?',
    options: [
      { key: 'A', text: '$x = -p$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = p$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '초점' },
      { key: 'C', text: '$y = -p$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '축 잘못' },
      { key: 'D', text: '$x = -4p$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$4$ 잘못 포함' },
      { key: 'E', text: '$x = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$y$축' },
    ],
    solution: '준선은 초점 반대쪽 같은 거리: $x = -p$.' },

  // S8 (중) x²=8y 초점
  { chapterCode: CODE, difficulty: 'medium', concept: '$x^2 = 8y$ 초점', requiredSkills: SKILLS_PARAB,
    stem: '$x^2 = 8y$ 의 초점?',
    options: [
      { key: 'A', text: '$(0, 2)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(2, 0)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '축 잘못' },
      { key: 'C', text: '$(0, 8)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$4$ 나눔 누락' },
      { key: 'D', text: '$(0, 4)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$8/2$' },
      { key: 'E', text: '$(0, -2)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '준선' },
    ],
    solution: '$4p = 8 \\to p = 2$. 초점 $(0, 2)$.' },

  // S9 (중) 타원 초점
  { chapterCode: CODE, difficulty: 'medium', concept: '$x^2/16 + y^2/7 = 1$ 초점', requiredSkills: SKILLS_ELLIPSE,
    stem: '$\\dfrac{x^2}{16} + \\dfrac{y^2}{7} = 1$ 의 초점?',
    options: [
      { key: 'A', text: '$(\\pm 3, 0)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(0, \\pm 3)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '축 잘못' },
      { key: 'C', text: '$(\\pm \\sqrt{23}, 0)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$+$ 잘못' },
      { key: 'D', text: '$(\\pm 4, 0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$a$ 자체' },
      { key: 'E', text: '$(\\pm \\sqrt{7}, 0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$b$ 자체' },
    ],
    solution: '$c^2 = a^2 - b^2 = 16 - 7 = 9, c = 3$. 초점 $(\\pm 3, 0)$.' },

  // S10 (중) 타원 정의
  { chapterCode: CODE, difficulty: 'medium', concept: '타원의 정의', requiredSkills: SKILLS_DEF,
    stem: '평면 위 두 정점 $F, F^{\\prime}$ 에서 거리의 ___이 일정한 점의 자취는?',
    options: [
      { key: 'A', text: '합 → 타원', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '차 → 타원', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '차는 쌍곡선' },
      { key: 'C', text: '곱 → 타원', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '합 → 쌍곡선', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '비 → 타원', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '타원: 두 초점 거리의 합이 일정.' },

  // S11 (중) 쌍곡선 정의
  { chapterCode: CODE, difficulty: 'medium', concept: '쌍곡선의 정의', requiredSkills: SKILLS_DEF,
    stem: '평면 위 두 정점 $F, F^{\\prime}$ 에서 거리의 ___이 일정한 점의 자취는?',
    options: [
      { key: 'A', text: '차의 절댓값 → 쌍곡선', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '합 → 쌍곡선', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합은 타원' },
      { key: 'C', text: '곱 → 쌍곡선', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '차 → 직선', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '비 → 쌍곡선', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '쌍곡선: 두 초점 거리의 차의 절댓값이 일정.' },

  // S12 (중) 장축 방향 (y축)
  { chapterCode: CODE, difficulty: 'medium', concept: '장축 방향 ($b > a$)', requiredSkills: SKILLS_ELLIPSE,
    stem: '$\\dfrac{x^2}{4} + \\dfrac{y^2}{9} = 1$ 의 장축은?',
    options: [
      { key: 'A', text: '$y$ 축 ($2 \\cdot 3 = 6$)', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x$ 축 ($2 \\cdot 2 = 4$)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '단축' },
      { key: 'C', text: '대각선', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '원이므로 장축 X', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$a \\neq b$' },
      { key: 'E', text: '$y = x$ 방향', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$y^2$ 분모 ($9$) 가 더 크므로 $y$ 축이 장축, 장축 길이 $2 \\sqrt{9} = 6$.' },

  // S13 (중) 쌍곡선 초점
  { chapterCode: CODE, difficulty: 'medium', concept: '$x^2/4 - y^2/5 = 1$ 초점', requiredSkills: SKILLS_HYPERBOLA,
    stem: '$\\dfrac{x^2}{4} - \\dfrac{y^2}{5} = 1$ 의 초점?',
    options: [
      { key: 'A', text: '$(\\pm 3, 0)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(\\pm \\sqrt{1}, 0) = (\\pm 1, 0)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-$ 사용' },
      { key: 'C', text: '$(0, \\pm 3)$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '축 잘못' },
      { key: 'D', text: '$(\\pm 2, 0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$a$ 자체' },
      { key: 'E', text: '$(\\pm 9, 0)$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '잘못' },
    ],
    solution: '쌍곡선: $c^2 = a^2 + b^2 = 4 + 5 = 9, c = 3$. 초점 $(\\pm 3, 0)$.' },

  // S14 (중) 포물선 정의
  { chapterCode: CODE, difficulty: 'medium', concept: '포물선의 정의', requiredSkills: SKILLS_DEF,
    stem: '평면 위 한 점 $F$ 와 한 직선 $l$ 에서 ___이 같은 점의 자취는 포물선이다.',
    options: [
      { key: 'A', text: '거리', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '각도', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'C', text: '면적', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '비율', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '둘레', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '포물선: 한 점 (초점) 과 한 직선 (준선) 까지의 거리가 같은 점의 자취.' },

  // S15 (중) x²/16+y²/9 장축
  { chapterCode: CODE, difficulty: 'medium', concept: '타원 장축', requiredSkills: SKILLS_ELLIPSE,
    stem: '$\\dfrac{x^2}{16} + \\dfrac{y^2}{9} = 1$ 의 장축 길이?',
    options: [
      { key: 'A', text: '$8$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '단축' },
      { key: 'C', text: '$16$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$a^2$' },
      { key: 'D', text: '$4$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$\\times 2$ 누락' },
      { key: 'E', text: '$\\sqrt{16}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '미완' },
    ],
    solution: '$a = 4 > b = 3$. 장축 $= 2a = 8$.' },

  // S16 (어려움) y²=16x 준선
  { chapterCode: CODE, difficulty: 'hard', concept: '$y^2 = 16x$ 준선', requiredSkills: SKILLS_PARAB,
    stem: '$y^2 = 16x$ 의 준선?',
    options: [
      { key: 'A', text: '$x = -4$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = 4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '초점' },
      { key: 'C', text: '$x = -16$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$4$ 나눔 누락' },
      { key: 'D', text: '$y = -4$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '축 잘못' },
      { key: 'E', text: '$x = -8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$16/2$' },
    ],
    solution: '$4p = 16 \\to p = 4$. 준선 $x = -p = -4$.' },

  // S17 (어려움) x²/9+y²/4 초점
  { chapterCode: CODE, difficulty: 'hard', concept: '타원 초점 ($c = \\sqrt{5}$)', requiredSkills: SKILLS_ELLIPSE,
    stem: '$\\dfrac{x^2}{9} + \\dfrac{y^2}{4} = 1$ 의 초점?',
    options: [
      { key: 'A', text: '$(\\pm \\sqrt{5}, 0)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$(\\pm 5, 0)$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$\\sqrt{}$ 누락' },
      { key: 'C', text: '$(\\pm \\sqrt{13}, 0)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$+$ 잘못 사용' },
      { key: 'D', text: '$(0, \\pm \\sqrt{5})$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '축 잘못' },
      { key: 'E', text: '$(\\pm 3, 0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$a$' },
    ],
    solution: '$c^2 = 9 - 4 = 5, c = \\sqrt{5}$. 초점 $(\\pm \\sqrt{5}, 0)$.' },

  // S18 (어려움) 점근선 (12/5)
  { chapterCode: CODE, difficulty: 'hard', concept: '쌍곡선 점근선 (분수)', requiredSkills: SKILLS_HYPERBOLA,
    stem: '$\\dfrac{x^2}{25} - \\dfrac{y^2}{144} = 1$ 의 점근선?',
    options: [
      { key: 'A', text: '$y = \\pm \\dfrac{12}{5} x$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$y = \\pm \\dfrac{5}{12} x$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '뒤집음' },
      { key: 'C', text: '$y = \\pm \\dfrac{144}{25} x$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '제곱 그대로' },
      { key: 'D', text: '$y = \\pm 12 x$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$a$ 나눔 누락' },
      { key: 'E', text: '$y = \\pm \\dfrac{6}{5} x$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '$a = 5, b = 12$. 점근선 $y = \\pm \\dfrac{b}{a} x = \\pm \\dfrac{12}{5} x$.' },

  // S19 (어려움) 초점 (0,±5), 장축 12 → 식
  { chapterCode: CODE, difficulty: 'hard', concept: '타원 식 구성 ($y$축 장축)', requiredSkills: SKILLS_BUILD,
    stem: '초점 $(0, \\pm 5)$, 장축 $12$ 인 타원의 식?',
    options: [
      { key: 'A', text: '$\\dfrac{x^2}{11} + \\dfrac{y^2}{36} = 1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{x^2}{36} + \\dfrac{y^2}{11} = 1$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '축 뒤집음' },
      { key: 'C', text: '$\\dfrac{x^2}{6} + \\dfrac{y^2}{5} = 1$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '제곱 누락' },
      { key: 'D', text: '$\\dfrac{x^2}{25} + \\dfrac{y^2}{144} = 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$\\dfrac{x^2}{11} + \\dfrac{y^2}{25} = 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$a^2$ 잘못' },
    ],
    solution: '$y$축 장축. 장축 $12 \\to 2a = 12, a = 6, a^2 = 36$. $c = 5, b^2 = a^2 - c^2 = 36 - 25 = 11$. $\\dfrac{x^2}{11} + \\dfrac{y^2}{36} = 1$.' },

  // S20 (어려움) F(3,0) F'(-3,0) 합 10
  { chapterCode: CODE, difficulty: 'hard', concept: '정의로 타원 식', requiredSkills: SKILLS_DEF,
    stem: '두 초점 $F(3, 0), F^{\\prime}(-3, 0)$, $|PF| + |PF^{\\prime}| = 10$. 타원 방정식?',
    options: [
      { key: 'A', text: '$\\dfrac{x^2}{25} + \\dfrac{y^2}{16} = 1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{x^2}{16} + \\dfrac{y^2}{25} = 1$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '축 뒤집음' },
      { key: 'C', text: '$\\dfrac{x^2}{10} + \\dfrac{y^2}{9} = 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '제곱 누락' },
      { key: 'D', text: '$\\dfrac{x^2}{100} + \\dfrac{y^2}{91} = 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$2a$ 그대로' },
      { key: 'E', text: '$\\dfrac{x^2}{25} - \\dfrac{y^2}{16} = 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '쌍곡선' },
    ],
    solution: '$2a = 10 \\to a = 5, a^2 = 25$. $c = 3, b^2 = a^2 - c^2 = 16$. $\\dfrac{x^2}{25} + \\dfrac{y^2}{16} = 1$.' },
];

export const K_G12_GEO_CH01_CONIC_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
