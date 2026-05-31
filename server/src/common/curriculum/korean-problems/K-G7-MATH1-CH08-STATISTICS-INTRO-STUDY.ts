/**
 * K-G7-MATH1-CH08-STATISTICS-INTRO — STUDY pool (single-step, 20문제).
 * 자료 정리와 분석 — 평균/중앙값/최빈값, 도수분포·상대도수.
 * Mastery 3-step과 별도 변형 문제.
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5. LLM 미사용.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G7-MATH1-CH08-STATISTICS-INTRO';
const SKILLS_MEAN = ['arithmetic_mean', 'sum_divide_n'];
const SKILLS_MEDIAN = ['median_position', 'sorted_middle'];
const SKILLS_MODE = ['most_frequent', 'frequency_count'];
const SKILLS_FREQ = ['frequency_distribution', 'class_count'];
const SKILLS_RELFREQ = ['relative_frequency', 'frequency_total'];
const SKILLS_CHANGE = ['mean_after_change', 'sum_inverse'];
const SKILLS_UNKNOWN = ['mean_equation', 'find_unknown'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) 평균 등차
  { chapterCode: CODE, difficulty: 'easy', concept: '5개 자료 평균 (등차)', requiredSkills: SKILLS_MEAN,
    stem: '자료 $2, 4, 6, 8, 10$ 의 평균은?',
    options: [
      { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합 $30$을 $6$으로 나눔' },
      { key: 'C', text: '$30$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '합 자체를 답함' },
      { key: 'D', text: '$8$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '중앙값 위치와 혼동' },
      { key: 'E', text: '$10$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '최댓값' },
    ],
    solution: '합 $= 2+4+6+8+10 = 30$. 평균 $= 30/5 = 6$.' },

  // S2 (쉬움) 평균 (0 포함)
  { chapterCode: CODE, difficulty: 'easy', concept: '평균 ($0$ 포함)', requiredSkills: SKILLS_MEAN,
    stem: '자료 $0, 5, 10$ 의 평균은?',
    options: [
      { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$7.5$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$0$ 제외하고 두 값 평균' },
      { key: 'C', text: '$15$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '합 자체' },
      { key: 'D', text: '$3.33$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$10/3$ 잘못된 합' },
      { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '최솟값' },
    ],
    solution: '합 $= 0+5+10 = 15$. 평균 $= 15/3 = 5$.' },

  // S3 (쉬움) 중앙값 위치 (7개)
  { chapterCode: CODE, difficulty: 'easy', concept: '중앙값 위치 (홀수 $7$개)', requiredSkills: SKILLS_MEDIAN,
    stem: '$7$ 개 자료를 작은 순으로 정렬했을 때 중앙값의 위치는?',
    options: [
      { key: 'A', text: '$4$ 번째', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3$ 번째', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$7/2 = 3.5$ 내림' },
      { key: 'C', text: '$5$ 번째', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$7/2$ 올림' },
      { key: 'D', text: '$1$ 번째', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '최솟값 위치' },
      { key: 'E', text: '$7$ 번째', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '최댓값 위치' },
    ],
    solution: '홀수 $n$개: 중앙값 위치 $= \\dfrac{n+1}{2} = \\dfrac{8}{2} = 4$번째.' },

  // S4 (쉬움) 중앙값 5개
  { chapterCode: CODE, difficulty: 'easy', concept: '중앙값 (정렬 자료 5개)', requiredSkills: SKILLS_MEDIAN,
    stem: '$4, 8, 12, 16, 20$ 의 중앙값은?',
    options: [
      { key: 'A', text: '$12$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2$번째 값' },
      { key: 'C', text: '$16$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$4$번째 값' },
      { key: 'D', text: '$12$ 또는 $16$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '홀수 데이터는 단일 중앙값' },
      { key: 'E', text: '$10$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평균과 혼동' },
    ],
    solution: '$5$개 자료의 중앙값 $= 3$번째 값 $= 12$.' },

  // S5 (쉬움) 최빈값
  { chapterCode: CODE, difficulty: 'easy', concept: '최빈값 (3중복)', requiredSkills: SKILLS_MODE,
    stem: '자료 $5, 2, 5, 3, 1, 5, 7$ 의 최빈값은?',
    options: [
      { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '중앙값과 혼동' },
      { key: 'C', text: '$7$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '최댓값' },
      { key: 'D', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '최솟값' },
      { key: 'E', text: '$4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평균에 근접한 값' },
    ],
    solution: '$5$가 $3$번으로 가장 많이 등장 → 최빈값 $= 5$.' },

  // S6 (쉬움) 상대도수 정의
  { chapterCode: CODE, difficulty: 'easy', concept: '상대도수 정의', requiredSkills: SKILLS_RELFREQ,
    stem: '도수분포표에서 "한 계급의 도수 ÷ 전체 자료의 수" 의 이름은?',
    options: [
      { key: 'A', text: '상대도수', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '도수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '도수는 계급별 자료 수' },
      { key: 'C', text: '계급값', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '계급값은 계급의 중앙값' },
      { key: 'D', text: '누적도수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '누적도수는 도수를 더해감' },
      { key: 'E', text: '평균', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평균은 다른 통계량' },
    ],
    solution: '상대도수 $= \\dfrac{(계급의 도수)}{(전체 자료수)}$.' },

  // S7 (중) 평균 짝수 4개
  { chapterCode: CODE, difficulty: 'medium', concept: '평균 (짝수 4개)', requiredSkills: SKILLS_MEAN,
    stem: '자료 $2, 4, 6, 8$ 의 평균은?',
    options: [
      { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합 $20$을 $5$로 나눔' },
      { key: 'C', text: '$20$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '합 자체' },
      { key: 'D', text: '$6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '중앙값 잘못 (실제 $5$)' },
      { key: 'E', text: '$10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합 / $2$ 잘못' },
    ],
    solution: '합 $= 2+4+6+8 = 20$. 평균 $= 20/4 = 5$.' },

  // S8 (중) 중앙값 짝수 4개
  { chapterCode: CODE, difficulty: 'medium', concept: '중앙값 (짝수 4개)', requiredSkills: SKILLS_MEDIAN,
    stem: '$3, 5, 7, 9$ 의 중앙값은?',
    options: [
      { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2$번째 값' },
      { key: 'C', text: '$7$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3$번째 값' },
      { key: 'D', text: '$5$ 와 $7$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평균 미계산 (가운데 두 값만)' },
      { key: 'E', text: '$8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 평균' },
    ],
    solution: '$4$개 자료: 가운데 두 값 $5, 7$의 평균 $= 6$.' },

  // S9 (중) 최빈값 (가장 많이 나옴)
  { chapterCode: CODE, difficulty: 'medium', concept: '최빈값 ($3$이 3번)', requiredSkills: SKILLS_MODE,
    stem: '자료 $1, 1, 2, 2, 3, 3, 3$ 의 최빈값은?',
    options: [
      { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2$번 등장 (가장 많지 않음)' },
      { key: 'C', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2$번 등장' },
      { key: 'D', text: '$1$ 과 $2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '동률 가정 잘못' },
      { key: 'E', text: '$2$ (중앙값)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '중앙값과 혼동' },
    ],
    solution: '$3$이 $3$번으로 가장 많이 등장 → 최빈값 $= 3$.' },

  // S10 (중) 평균 7개 등차
  { chapterCode: CODE, difficulty: 'medium', concept: '7개 등차자료 평균', requiredSkills: SKILLS_MEAN,
    stem: '자료 $11, 13, 15, 17, 19, 21, 23$ 의 평균은?',
    options: [
      { key: 'A', text: '$17$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$19$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$5$번째 값' },
      { key: 'C', text: '$119$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '합 자체' },
      { key: 'D', text: '$15$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3$번째 값' },
      { key: 'E', text: '$23$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '최댓값' },
    ],
    solution: '등차자료 평균 $= $ 중앙값 $= 17$. (합 $= 119$, $119/7 = 17$).' },

  // S11 (중) 평균 → 합
  { chapterCode: CODE, difficulty: 'medium', concept: '평균 → 합 역추적', requiredSkills: SKILLS_CHANGE,
    stem: '$6$ 개 자료의 평균이 $60$ 이다. 자료의 합은?',
    options: [
      { key: 'A', text: '$360$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$60$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평균 자체' },
      { key: 'C', text: '$10$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$60/6$ 잘못된 식' },
      { key: 'D', text: '$66$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$60 + 6$' },
      { key: 'E', text: '$54$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$60 - 6$' },
    ],
    solution: '합 $= $ 평균 $\\times $ 개수 $= 60 \\times 6 = 360$.' },

  // S12 (중) 합 → 평균
  { chapterCode: CODE, difficulty: 'medium', concept: '합 → 평균 (5개)', requiredSkills: SKILLS_MEAN,
    stem: '$5$ 개 자료의 합이 $50$ 이다. 평균은?',
    options: [
      { key: 'A', text: '$10$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$50$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '합 자체' },
      { key: 'C', text: '$5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '개수 자체' },
      { key: 'D', text: '$250$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$50 \\times 5$ 곱셈' },
      { key: 'E', text: '$55$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$50 + 5$' },
    ],
    solution: '평균 $= $ 합 $/ $ 개수 $= 50 / 5 = 10$.' },

  // S13 (중) 도수의 합 = 자료 총수
  { chapterCode: CODE, difficulty: 'medium', concept: '도수의 합 = 자료 총수', requiredSkills: SKILLS_FREQ,
    stem: '도수분포표에서 모든 계급의 도수의 합은 무엇과 같은가?',
    options: [
      { key: 'A', text: '전체 자료의 수', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '평균', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평균과 혼동' },
      { key: 'C', text: '계급의 개수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '계급 수와 도수 합 혼동' },
      { key: 'D', text: '계급의 크기', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '계급의 너비와 혼동' },
      { key: 'E', text: '계급의 개수 $\\times $ 계급의 크기', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '의미 무관한 식' },
    ],
    solution: '도수의 합 = 자료 총 개수.' },

  // S14 (중) 상대도수의 합
  { chapterCode: CODE, difficulty: 'medium', concept: '상대도수의 합 = 1', requiredSkills: SKILLS_RELFREQ,
    stem: '도수분포표에서 모든 계급의 상대도수의 합은?',
    options: [
      { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '전체 자료의 수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '도수의 합과 혼동' },
      { key: 'C', text: '$100$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '백분율로 보면 $100\\%$' },
      { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '상대도수 정의 미적용' },
      { key: 'E', text: '계급의 개수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '계급 수와 혼동' },
    ],
    solution: '상대도수 $= $ 계급도수 $/ $ 전체수. 전체 합 $= \\dfrac{(전체수)}{(전체수)} = 1$.' },

  // S15 (중) 평균 한 명 추가
  { chapterCode: CODE, difficulty: 'medium', concept: '평균 한 명 추가 후 변화', requiredSkills: SKILLS_CHANGE,
    stem: '$5$ 명의 평균이 $70$ 점이다. 한 명을 더해서 $6$ 명 평균이 $72$ 점이 되었다. 추가된 점수는?',
    options: [
      { key: 'A', text: '$82$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$72$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '새 평균 자체' },
      { key: 'C', text: '$70$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '기존 평균' },
      { key: 'D', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평균 차이만' },
      { key: 'E', text: '$92$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$72 \\times 6 - 70 \\times 5$ 계산 실수' },
    ],
    solution: '$6 \\times 72 - 5 \\times 70 = 432 - 350 = 82$.' },

  // S16 (어려움) 평균 변동 — 한 값 교체
  { chapterCode: CODE, difficulty: 'hard', concept: '평균 변동 — 한 값 교체', requiredSkills: SKILLS_CHANGE,
    stem: '$5$ 개 자료의 평균이 $20$ 이다. 그 중 $30$ 인 자료를 $50$ 으로 바꿨다. 새 평균은?',
    options: [
      { key: 'A', text: '$24$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$20$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '값 변경 무시' },
      { key: 'C', text: '$50$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '교체된 값 자체' },
      { key: 'D', text: '$40$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$20 + 20$ 잘못된 합' },
      { key: 'E', text: '$26$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 분모' },
    ],
    solution: '기존 합 $= 100$. 새 합 $= 100 + (50 - 30) = 120$. 새 평균 $= 120/5 = 24$.' },

  // S17 (어려움) 변량 일괄 ×2
  { chapterCode: CODE, difficulty: 'hard', concept: '변량 일괄 곱셈 → 평균 변화', requiredSkills: SKILLS_CHANGE,
    stem: '자료 $4, 6, 8, 10$ 의 평균과 자료 $8, 12, 16, 20$ 의 평균의 관계는?',
    options: [
      { key: 'A', text: '두 번째 평균은 첫 번째의 $2$ 배', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '같다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '값이 모두 $2$ 배인데 평균 변화 무시' },
      { key: 'C', text: '두 번째 평균이 $4$ 더 큼', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '일괄 가산으로 잘못 해석' },
      { key: 'D', text: '두 번째 평균이 $3$ 배', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 배수' },
      { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '명확히 비례 관계' },
    ],
    solution: '첫 평균 $= 7$, 둘째 평균 $= 14 = 2 \\times 7$. 모든 값에 $\\times 2$ → 평균도 $\\times 2$.' },

  // S18 (어려움) 평균식 → 미지수
  { chapterCode: CODE, difficulty: 'hard', concept: '평균식 → 미지수', requiredSkills: SKILLS_UNKNOWN,
    stem: '자료 $a, 6, 10, 14$ 의 평균이 $9$ 이다. $a$ 는?',
    options: [
      { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평균 자체' },
      { key: 'C', text: '$36$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합 자체' },
      { key: 'D', text: '$4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$9 - 5$ 잘못된 식' },
      { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$30 - 36 = -6$ 부호 잘못' },
    ],
    solution: '$\\dfrac{a + 6 + 10 + 14}{4} = 9 \\to a + 30 = 36 \\to a = 6$.' },

  // S19 (어려움) 중앙값 조건 → 미지수
  { chapterCode: CODE, difficulty: 'hard', concept: '중앙값 조건 → 미지수', requiredSkills: SKILLS_UNKNOWN,
    stem: '자료 $4, 7, x, 11, 14$ 의 중앙값이 $9$ 이다. $x$ 는? (단, $7 < x < 11$ 가정)',
    options: [
      { key: 'A', text: '$9$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$7$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '경계값 — $x > 7$ 가정' },
      { key: 'C', text: '$11$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '경계값 — $x < 11$ 가정' },
      { key: 'D', text: '$8$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '중앙값 조건 무시' },
      { key: 'E', text: '$10$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '중앙값 조건 무시' },
    ],
    solution: '$7 < x < 11$ 이므로 정렬 시 $x$가 가운데 ($3$번째). 중앙값 $= x = 9$.' },

  // S20 (어려움) 평균식 → 두 변수 합
  { chapterCode: CODE, difficulty: 'hard', concept: '평균식 → 두 변수 합', requiredSkills: SKILLS_UNKNOWN,
    stem: '자료 $a, 5, b, 11$ 의 평균이 $8$ 이다. $a + b$ 의 값은?',
    options: [
      { key: 'A', text: '$16$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$8$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평균 자체' },
      { key: 'C', text: '$32$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합 자체 ($8 \\times 4$)' },
      { key: 'D', text: '$24$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$32 - 8$ 잘못된 차' },
      { key: 'E', text: '$4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 분배' },
    ],
    solution: '$\\dfrac{a + 5 + b + 11}{4} = 8 \\to a + b + 16 = 32 \\to a + b = 16$.' },
];

export const K_G7_MATH1_CH08_STATISTICS_INTRO_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
