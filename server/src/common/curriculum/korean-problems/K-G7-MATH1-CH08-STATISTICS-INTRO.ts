/**
 * K-G7-MATH1-CH08-STATISTICS-INTRO (자료의 정리와 해석) — 20문제 3-step Mastery.
 * 중1 — 평균/중앙값/최빈값 → 도수분포표 → 변량 변화 영향.
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 * 주요 errorCode 분배:
 *   STATISTICS_INTERPRETATION_ERROR 6 (Q1,5,8,14,18,20) / ARITHMETIC_ERROR 5 (Q2,7,10,12,16)
 *   FORMULA_SELECTION_ERROR 3 (Q3,4,6) / CONCEPT_MISUNDERSTANDING 3 (Q9,13,17)
 *   ALGEBRA_ERROR 2 (Q11,19) / CONDITION_MISSING 1 (Q15)
 *
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G7-MATH1-CH08-STATISTICS-INTRO';
const SKILLS_MEAN = ['mean_calculation', 'sum_divided_by_count'];
const SKILLS_MEDIAN = ['median_position', 'sorted_middle'];
const SKILLS_MODE = ['mode_identification', 'frequency_count'];
const SKILLS_FREQ = ['frequency_distribution', 'class_interval'];
const SKILLS_CHANGE = ['mean_after_change', 'algebraic_inverse'];

const problems: KoreanProblemSeed[] = [
  // Q1 평균 정의
  { chapterCode: CODE, difficulty: 'easy', concept: '평균의 정의', requiredSkills: SKILLS_MEAN,
    stem: '$n$ 개 자료의 평균은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '평균 = ?', options: [
        { key: 'A', text: '$\\bar{x} = \\dfrac{\\text{자료의 합}}{\\text{자료의 개수}}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\bar{x} = $ 자료의 곱 / 개수', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '곱 사용' },
        { key: 'C', text: '$\\bar{x} = $ 자료의 합', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '나눗셈 누락' },
        { key: 'D', text: '$\\bar{x} = $ 가운데 값', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '중앙값' },
        { key: 'E', text: '$\\bar{x} = $ 가장 많은 값', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '최빈값' },
      ] },
      { stepType: 'PROCESS', prompt: '합 $S$, 개수 $n$ 이면 평균 식은?', options: [
        { key: 'A', text: '$\\bar{x} = S / n$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\bar{x} = n / S$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '뒤집힘' },
        { key: 'C', text: '$\\bar{x} = S - n$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '뺄셈' },
        { key: 'D', text: '$\\bar{x} = S \\cdot n$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '곱셈' },
        { key: 'E', text: '$\\bar{x} = S^2 / n$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '평균의 정의는?', options: [
        { key: 'A', text: '합을 개수로 나눈 값', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '가장 많이 나오는 값', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '최빈값' },
        { key: 'C', text: '가운데 값', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '중앙값' },
        { key: 'D', text: '가장 큰 값', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '최댓값' },
        { key: 'E', text: '범위', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '다른 통계량' },
      ] },
    ], solution: '평균 = 합 / 개수 = $\\sum x_i / n$.' },

  // Q2 5,7,9,11,13 평균
  { chapterCode: CODE, difficulty: 'easy', concept: '평균 계산', requiredSkills: SKILLS_MEAN,
    stem: '자료 $5, 7, 9, 11, 13$ 의 평균은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '합 + 나누기', options: [
        { key: 'A', text: '합 / 5', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '합 / 4', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$n=4$ 잘못' },
        { key: 'C', text: '합 / 1', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '합 그대로', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 누락' },
        { key: 'E', text: '최대값', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '평균 아님' },
      ] },
      { stepType: 'PROCESS', prompt: '$5+7+9+11+13$', options: [
        { key: 'A', text: '$45$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$40$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
        { key: 'C', text: '$50$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
        { key: 'D', text: '$36$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$25$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '중앙값에 5 곱' },
      ] },
      { stepType: 'ANSWER', prompt: '평균은?', options: [
        { key: 'A', text: '$9$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합 잘못' },
        { key: 'C', text: '$10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
        { key: 'D', text: '$45$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 누락' },
        { key: 'E', text: '$13$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '최대값' },
      ] },
    ], solution: '$(5+7+9+11+13) / 5 = 45/5 = 9$.' },

  // Q3 5개 자료 중앙값 위치
  { chapterCode: CODE, difficulty: 'easy', concept: '중앙값 위치 (홀수 개)', requiredSkills: SKILLS_MEDIAN,
    stem: '$5$ 개 자료를 작은 순으로 정렬했을 때 중앙값의 위치는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '중앙값 정의?', options: [
        { key: 'A', text: '정렬했을 때 한가운데 값', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '평균', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '평균' },
        { key: 'C', text: '최빈값', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '최빈값' },
        { key: 'D', text: '최대값', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '최대' },
        { key: 'E', text: '최소값', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '최소' },
      ] },
      { stepType: 'PROCESS', prompt: '$n = 5$ → 중앙 위치?', options: [
        { key: 'A', text: '$(5+1)/2 = 3$ 번째', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5/2 = 2.5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '짝수 공식' },
        { key: 'C', text: '$2$ 번째', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$4$ 번째', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1$ 번째', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '몇 번째?', options: [
        { key: 'A', text: '$3$ 번째', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2$ 번째', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$4$ 번째', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2.5$ 번째', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '짝수 공식' },
        { key: 'E', text: '$5$ 번째', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '마지막' },
      ] },
    ], solution: '홀수 개: $(n+1)/2 = 3$ 번째 값.' },

  // Q4 [3,5,7,9,11] 중앙값
  { chapterCode: CODE, difficulty: 'easy', concept: '중앙값 (정렬 자료)', requiredSkills: SKILLS_MEDIAN,
    stem: '$3, 5, 7, 9, 11$ 의 중앙값은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '이미 정렬됨. 중앙은?', options: [
        { key: 'A', text: '$3$ 번째 = $7$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2$ 번째 = $5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '위치 잘못' },
        { key: 'C', text: '$4$ 번째 = $9$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '위치 잘못' },
        { key: 'D', text: '평균 = $7$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '우연 일치' },
        { key: 'E', text: '$\\frac{5+7}{2} = 6$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '짝수 공식' },
      ] },
      { stepType: 'PROCESS', prompt: '$3$ 번째 자료 값', options: [
        { key: 'A', text: '$7$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '위치 잘못' },
        { key: 'C', text: '$9$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '위치 잘못' },
        { key: 'D', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '첫 번째' },
        { key: 'E', text: '$11$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '마지막' },
      ] },
      { stepType: 'ANSWER', prompt: '중앙값은?', options: [
        { key: 'A', text: '$7$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '위치 잘못' },
        { key: 'C', text: '$9$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '위치 잘못' },
        { key: 'D', text: '$3.5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$11$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '최대' },
      ] },
    ], solution: '$3$ 번째 값 = $7$.' },

  // Q5 최빈값
  { chapterCode: CODE, difficulty: 'easy', concept: '최빈값', requiredSkills: SKILLS_MODE,
    stem: '자료 $2, 3, 3, 5, 3, 7$ 의 최빈값은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '최빈값 정의?', options: [
        { key: 'A', text: '가장 많이 나타나는 값', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '가장 큰 값', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '최대' },
        { key: 'C', text: '가운데 값', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '중앙값' },
        { key: 'D', text: '평균', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '평균' },
        { key: 'E', text: '가장 작은 값', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '최소' },
      ] },
      { stepType: 'PROCESS', prompt: '각 값의 빈도?', options: [
        { key: 'A', text: '$2: 1, 3: 3, 5: 1, 7: 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2: 1, 3: 2, 5: 1, 7: 1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3$의 개수 셈 잘못' },
        { key: 'C', text: '$3: 1$ (한 번씩)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '중복 인식 못함' },
        { key: 'D', text: '$5: 3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '값 잘못' },
        { key: 'E', text: '모두 동률', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '잘못' },
      ] },
      { stepType: 'ANSWER', prompt: '최빈값은?', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '최소' },
        { key: 'C', text: '$7$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '최대' },
        { key: 'D', text: '$5$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$4$ (평균 가까이)', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '평균 혼동' },
      ] },
    ], solution: '$3$ 이 3번 등장 → 최빈값 = $3$.' },

  // Q6 도수 정의
  { chapterCode: CODE, difficulty: 'easy', concept: '도수 정의', requiredSkills: SKILLS_FREQ,
    stem: '도수분포표에서 "한 계급에 속한 자료의 수" 의 이름은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '도수란?', options: [
        { key: 'A', text: '한 계급에 속하는 자료의 개수', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '계급의 너비', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '계급의 크기' },
        { key: 'C', text: '평균', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '다른 개념' },
        { key: 'D', text: '중앙값', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '다른 개념' },
        { key: 'E', text: '자료 총 수', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '도수의 합' },
      ] },
      { stepType: 'PROCESS', prompt: '도수의 합은?', options: [
        { key: 'A', text: '자료 총 수와 같다', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '항상 $100$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '상대도수와 혼동' },
        { key: 'C', text: '계급 수와 같다', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '평균과 같다', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '0', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '이름은?', options: [
        { key: 'A', text: '도수', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '계급', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '구간' },
        { key: 'C', text: '평균', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '다른 개념' },
        { key: 'D', text: '상대도수', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '도수/합' },
        { key: 'E', text: '계급값', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '구간 중앙' },
      ] },
    ], solution: '계급에 속하는 자료의 수 = 도수.' },

  // Q7 [4,6,6,8,10,14] 평균
  { chapterCode: CODE, difficulty: 'medium', concept: '평균 (짝수 개)', requiredSkills: SKILLS_MEAN,
    stem: '자료 $4, 6, 6, 8, 10, 14$ 의 평균은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '합 / 6', options: [
        { key: 'A', text: '합 구한 뒤 6으로 나눔', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '합 / 5', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$n$ 잘못' },
        { key: 'C', text: '합 / 7', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$n$ 잘못' },
        { key: 'D', text: '합 / 4', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$n$ 잘못' },
        { key: 'E', text: '합 그대로', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 누락' },
      ] },
      { stepType: 'PROCESS', prompt: '$4+6+6+8+10+14$', options: [
        { key: 'A', text: '$48$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$44$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
        { key: 'C', text: '$42$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '중복 6 한 번만' },
        { key: 'D', text: '$50$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
        { key: 'E', text: '$46$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
      ] },
      { stepType: 'ANSWER', prompt: '평균은?', options: [
        { key: 'A', text: '$8$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$7$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합 잘못' },
        { key: 'C', text: '$9$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
        { key: 'D', text: '$6$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '최빈값' },
        { key: 'E', text: '$48$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 누락' },
      ] },
    ], solution: '$(4+6+6+8+10+14)/6 = 48/6 = 8$.' },

  // Q8 [4,6,6,8,10,14] 중앙값 (짝수개)
  { chapterCode: CODE, difficulty: 'medium', concept: '중앙값 (짝수 개)', requiredSkills: SKILLS_MEDIAN,
    stem: '$4, 6, 6, 8, 10, 14$ 의 중앙값은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '짝수 개 자료의 중앙값?', options: [
        { key: 'A', text: '중앙 두 값의 평균', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3$ 번째 값', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '$n=6$이면 두 값' },
        { key: 'C', text: '$4$ 번째 값', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '비대칭' },
        { key: 'D', text: '$1$ 번째 값', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '최소' },
        { key: 'E', text: '최빈값', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '다른 개념' },
      ] },
      { stepType: 'PROCESS', prompt: '$n=6$ → $3$ 번째 $= 6$, $4$ 번째 $= 8$', options: [
        { key: 'A', text: '$(6 + 8) / 2 = 7$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$6$ ($3$ 번째)', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '한 값만' },
        { key: 'C', text: '$8$ ($4$ 번째)', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '한 값만' },
        { key: 'D', text: '$6 \\times 8 = 48$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '곱' },
        { key: 'E', text: '$6 + 8 = 14$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '나누기 누락' },
      ] },
      { stepType: 'ANSWER', prompt: '중앙값은?', options: [
        { key: 'A', text: '$7$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$6$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '한 값만' },
        { key: 'C', text: '$8$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '한 값만' },
        { key: 'D', text: '$48$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '곱' },
        { key: 'E', text: '$14$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '합' },
      ] },
    ], solution: '$n=6$ 짝수 → 중앙 두 값 $6, 8$ 평균 $= 7$.' },

  // Q9 같은 자료 최빈값
  { chapterCode: CODE, difficulty: 'medium', concept: '최빈값 (중복 카운트)', requiredSkills: SKILLS_MODE,
    stem: '$4, 6, 6, 8, 10, 14$ 의 최빈값은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '빈도 카운트?', options: [
        { key: 'A', text: '$4: 1, 6: 2, 8: 1, 10: 1, 14: 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$6: 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '중복 무시' },
        { key: 'C', text: '$4: 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$14: 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '값 셈 잘못' },
        { key: 'E', text: '모두 동률', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$6$이 두 번' },
      ] },
      { stepType: 'PROCESS', prompt: '가장 많이 나온 값?', options: [
        { key: 'A', text: '$6$ ($2$번)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$14$ (가장 큼)', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '최대' },
        { key: 'C', text: '$4$ (가장 작음)', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '최소' },
        { key: 'D', text: '$8$ (중간)', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '중앙값과 혼동' },
        { key: 'E', text: '$7$ (평균)', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '평균' },
      ] },
      { stepType: 'ANSWER', prompt: '최빈값은?', options: [
        { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$8$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$7$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '평균' },
        { key: 'D', text: '$14$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '최대' },
        { key: 'E', text: '최빈값 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$6$이 유일하게 2번' },
      ] },
    ], solution: '$6$ 이 두 번 등장 (나머지는 한 번씩) → 최빈값 $= 6$.' },

  // Q10 평균 [70,75,80,85,90,95,100]
  { chapterCode: CODE, difficulty: 'medium', concept: '7개 점수 평균', requiredSkills: SKILLS_MEAN,
    stem: '점수 $70, 75, 80, 85, 90, 95, 100$ 의 평균은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '합 / 7', options: [
        { key: 'A', text: '$\\sum / 7$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sum / 5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$n$ 잘못' },
        { key: 'C', text: '$\\sum / 10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$n$ 잘못' },
        { key: 'D', text: '$\\sum$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 누락' },
        { key: 'E', text: '$\\sum / 100$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$70+75+80+85+90+95+100 = ?$', options: [
        { key: 'A', text: '$595$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$590$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
        { key: 'C', text: '$600$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
        { key: 'D', text: '$525$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
        { key: 'E', text: '$700$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '평균은?', options: [
        { key: 'A', text: '$85$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$84$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
        { key: 'C', text: '$80$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '중앙값 부근' },
        { key: 'D', text: '$90$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$595$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 누락' },
      ] },
    ], solution: '$595/7 = 85$.' },

  // Q11 평균 50, n=5 → 합
  { chapterCode: CODE, difficulty: 'medium', concept: '평균 → 합 역추적', requiredSkills: SKILLS_CHANGE,
    stem: '$5$ 개 자료의 평균이 $50$ 이다. 자료의 합은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '평균 $\\times$ 개수 $= ?$', options: [
        { key: 'A', text: '합 $= $ 평균 $\\times$ 개수', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '합 $= $ 평균 $/$ 개수', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나눗셈' },
        { key: 'C', text: '합 $= $ 평균 $-$ 개수', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '뺄셈' },
        { key: 'D', text: '합 $= $ 평균', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '식 변형 안 함' },
        { key: 'E', text: '합 $= $ 개수 $/$ 평균', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '뒤집힘' },
      ] },
      { stepType: 'PROCESS', prompt: '$50 \\times 5$', options: [
        { key: 'A', text: '$250$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$55$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '덧셈' },
        { key: 'C', text: '$10$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나눗셈' },
        { key: 'D', text: '$45$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '뺄셈' },
        { key: 'E', text: '$500$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\times 10$' },
      ] },
      { stepType: 'ANSWER', prompt: '합은?', options: [
        { key: 'A', text: '$250$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$50$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '평균 자체' },
        { key: 'C', text: '$10$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$55$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '덧셈' },
        { key: 'E', text: '$5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '개수 자체' },
      ] },
    ], solution: '합 $= 50 \\times 5 = 250$.' },

  // Q12 합 28, n=4 → 평균
  { chapterCode: CODE, difficulty: 'medium', concept: '합 → 평균', requiredSkills: SKILLS_MEAN,
    stem: '$4$ 개 자료의 합이 $28$ 이다. 평균은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '평균 = 합 / 개수', options: [
        { key: 'A', text: '$28 / 4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$28 \\times 4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '곱' },
        { key: 'C', text: '$28 + 4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합' },
        { key: 'D', text: '$28 - 4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '차' },
        { key: 'E', text: '$4 / 28$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '뒤집힘' },
      ] },
      { stepType: 'PROCESS', prompt: '$28 / 4 = ?$', options: [
        { key: 'A', text: '$7$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
        { key: 'C', text: '$8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
        { key: 'D', text: '$112$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '곱' },
        { key: 'E', text: '$24$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '뺄셈' },
      ] },
      { stepType: 'ANSWER', prompt: '평균은?', options: [
        { key: 'A', text: '$7$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '개수' },
        { key: 'C', text: '$28$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합' },
        { key: 'D', text: '$112$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '곱' },
        { key: 'E', text: '$32$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합' },
      ] },
    ], solution: '$28 / 4 = 7$.' },

  // Q13 최빈값 (4번)
  { chapterCode: CODE, difficulty: 'medium', concept: '최빈값 (4 등장)', requiredSkills: SKILLS_MODE,
    stem: '자료 $1, 2, 2, 3, 3, 3, 4, 4, 4, 4$ 의 최빈값은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '빈도?', options: [
        { key: 'A', text: '$1: 1, 2: 2, 3: 3, 4: 4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '모두 동률', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '빈도 다름' },
        { key: 'C', text: '$3: 4$ (가장 많음)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '값 셈 잘못' },
        { key: 'D', text: '$4: 1$ (한 번만)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '4가 4번' },
        { key: 'E', text: '$2: 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '값 셈 잘못' },
      ] },
      { stepType: 'PROCESS', prompt: '가장 많이 나온 값?', options: [
        { key: 'A', text: '$4$ ($4$ 번)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$ ($1$ 번)', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '가장 적음' },
        { key: 'C', text: '$3$ ($3$ 번)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$4$가 더 많음' },
        { key: 'D', text: '평균 $\\approx 3$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '평균과 혼동' },
        { key: 'E', text: '중앙값 $3.5$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '중앙값과 혼동' },
      ] },
      { stepType: 'ANSWER', prompt: '최빈값은?', options: [
        { key: 'A', text: '$4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$4$가 더 많음' },
        { key: 'C', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$3.5$ (중앙값)', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '중앙값과 혼동' },
        { key: 'E', text: '$2.8$ (평균)', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '평균과 혼동' },
      ] },
    ], solution: '$4$ 가 $4$ 번 → 최빈값 $= 4$.' },

  // Q14 [10,15,20,25,30,35] 중앙값
  { chapterCode: CODE, difficulty: 'medium', concept: '중앙값 (짝수 6개)', requiredSkills: SKILLS_MEDIAN,
    stem: '$10, 15, 20, 25, 30, 35$ 의 중앙값은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$n = 6$ → ?', options: [
        { key: 'A', text: '$3, 4$ 번째 평균', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3$ 번째 = $20$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '짝수에 한 값만' },
        { key: 'C', text: '$4$ 번째 = $25$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '짝수에 한 값만' },
        { key: 'D', text: '평균 $= 22.5$ (모든 값)', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '전체 평균' },
        { key: 'E', text: '$22$ (대략 중간)', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$(20 + 25)/2$', options: [
        { key: 'A', text: '$22.5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$22$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
        { key: 'C', text: '$45$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 누락' },
        { key: 'D', text: '$20$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '한 값만' },
        { key: 'E', text: '$25$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '한 값만' },
      ] },
      { stepType: 'ANSWER', prompt: '중앙값은?', options: [
        { key: 'A', text: '$22.5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$20$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '한 값만' },
        { key: 'C', text: '$25$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '한 값만' },
        { key: 'D', text: '$22.5$ ($\\approx 22$)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '반올림 잘못' },
        { key: 'E', text: '$45$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 누락' },
      ] },
    ], solution: '짝수 → 중앙 두 값 $(20+25)/2 = 22.5$.' },

  // Q15 평균 80인 5명 + 1명 → 78. 새 점수?
  { chapterCode: CODE, difficulty: 'medium', concept: '평균 변동 — 추가 점수 역추적', requiredSkills: SKILLS_CHANGE,
    stem: '$5$ 명의 평균이 $80$ 점인데, 한 명을 더해 $6$ 명의 평균이 $78$ 점이 되었다. 추가된 점수는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '원래 합과 새 합 차이가 추가 점수', options: [
        { key: 'A', text: '추가 $= $ 새 합 $-$ 원래 합 $= 78 \\times 6 - 80 \\times 5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '추가 $= 78 - 80 = -2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '평균 차만 사용' },
        { key: 'C', text: '추가 $= 80$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'D', text: '추가 $= 78$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '새 평균 자체' },
        { key: 'E', text: '추가 $= 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$468 - 400 = ?$', options: [
        { key: 'A', text: '$68$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$70$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
        { key: 'C', text: '$58$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
        { key: 'D', text: '$78$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '평균 적용' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '평균 차만' },
      ] },
      { stepType: 'ANSWER', prompt: '추가된 점수는?', options: [
        { key: 'A', text: '$68$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$78$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '새 평균 자체' },
        { key: 'C', text: '$80$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '원래 평균' },
        { key: 'D', text: '$60$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$70$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '원래 합 $= 80 \\cdot 5 = 400$, 새 합 $= 78 \\cdot 6 = 468$. 추가 $= 68$.' },

  // Q16 (hard) 평균 75인 4개에서 한 자료 90 → 60 바꿨을 때 새 평균
  { chapterCode: CODE, difficulty: 'hard', concept: '평균 변동 — 한 값 교체', requiredSkills: SKILLS_CHANGE,
    stem: '$4$ 개 자료의 평균이 $75$ 이다. 그 중 $90$ 인 자료를 $60$ 으로 바꿨다. 새 평균은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '원래 합 - 90 + 60 = 새 합', options: [
        { key: 'A', text: '새 합 $= $ 원래 합 $- 90 + 60 = $ 원래 합 $- 30$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '새 합 $= $ 원래 합 $+ 60$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$90$ 제거 안 함' },
        { key: 'C', text: '새 합 $= $ 원래 합 $- 60$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '교체 잘못' },
        { key: 'D', text: '새 합 $= 60 \\times 4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '새 합 $= $ 원래 합', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '변화 무시' },
      ] },
      { stepType: 'PROCESS', prompt: '원래 합 $= 75 \\cdot 4 = 300$, 새 합 $= 270$, 새 평균?', options: [
        { key: 'A', text: '$270 / 4 = 67.5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$270 / 3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '개수 변화 없음' },
        { key: 'C', text: '$270$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 누락' },
        { key: 'D', text: '$67$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '소수점 무시' },
        { key: 'E', text: '$75 - 30 = 45$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '평균에 직접 적용' },
      ] },
      { stepType: 'ANSWER', prompt: '새 평균은?', options: [
        { key: 'A', text: '$67.5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$70$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$75$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '변화 무시' },
        { key: 'D', text: '$60$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '새 값 자체' },
        { key: 'E', text: '$90$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '예전 값' },
      ] },
    ], solution: '새 합 $= 300 - 30 = 270$. 새 평균 $= 270/4 = 67.5$.' },

  // Q17 (hard) 평균 80, n=4에 0 추가 → 새 평균
  { chapterCode: CODE, difficulty: 'hard', concept: '평균 변동 — 0 추가', requiredSkills: SKILLS_CHANGE,
    stem: '평균이 $80$ 인 $4$ 개 자료에 $0$ 한 개를 추가했다. 새 평균은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '추가는 합에 영향?', options: [
        { key: 'A', text: '합은 그대로 ($+0$), 개수만 $+1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '합도 $+1$, 개수도 $+1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '추가값 0이므로 합 변화 없음' },
        { key: 'C', text: '합은 $0$, 개수도 그대로', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '평균 그대로', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$0$도 자료에 들어감' },
        { key: 'E', text: '평균이 $0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '원래 합 $= 80 \\cdot 4 = 320$, 새 평균 $= 320 / 5$', options: [
        { key: 'A', text: '$64$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$80$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평균 그대로 오해' },
        { key: 'C', text: '$320$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 누락' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$60$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
      ] },
      { stepType: 'ANSWER', prompt: '새 평균은?', options: [
        { key: 'A', text: '$64$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$80$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '변화 없다고 오해' },
        { key: 'C', text: '$70$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$60$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '추가값만 봄' },
      ] },
    ], solution: '합 $320$ 그대로, $n$ 이 $5$ → 새 평균 $= 320/5 = 64$.' },

  // Q18 (hard) 모든 변량에 +2 → 평균 변화
  { chapterCode: CODE, difficulty: 'hard', concept: '변량 일괄 가산 → 평균 변화', requiredSkills: SKILLS_CHANGE,
    stem: '자료 $10, 20, 30, 40, 50$ 의 평균과 자료 $12, 22, 32, 42, 52$ 의 평균의 차이는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '모든 자료에 같은 수 $c$ 를 더하면 평균은?', options: [
        { key: 'A', text: '평균도 $c$ 만큼 증가', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '평균 변화 없음', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '평균이 $c \\times n$ 증가', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '$n$으로 나눠짐' },
        { key: 'D', text: '평균이 $c / n$ 증가', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '나누기 잘못' },
        { key: 'E', text: '평균은 $2$로 변함', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '모든 자료에 $+2$ → 평균 $+2$', options: [
        { key: 'A', text: '두 평균 차이 $= 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '두 평균 차이 $= 0$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '변화 무시' },
        { key: 'C', text: '두 평균 차이 $= 10$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '$2 \\times 5$' },
        { key: 'D', text: '두 평균 차이 $= 0.4$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '$2/5$' },
        { key: 'E', text: '두 평균 차이 $= 12$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '차이는?', options: [
        { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '변화 무시' },
        { key: 'C', text: '$10$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$32$ vs $30$ (값 자체)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '차 자체 정답이지만 답 형식 잘못' },
        { key: 'E', text: '$12$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '모든 변량에 $+2$ → 평균도 $+2$. 검산: 원 평균 $30$, 새 평균 $32$, 차이 $2$.' },

  // Q19 (hard) 평균 7, 한 변수 a
  { chapterCode: CODE, difficulty: 'hard', concept: '평균식 → 미지수', requiredSkills: SKILLS_CHANGE,
    stem: '자료 $a, 4, 6, 8, 10$ 의 평균이 $7$ 이다. $a$ 는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '평균식 → $a$ 식', options: [
        { key: 'A', text: '$\\dfrac{a + 4 + 6 + 8 + 10}{5} = 7$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a = 7$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '식 변형 안 함' },
        { key: 'C', text: '$a = 7 - 5 = 2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$a = 7 \\cdot 5 = 35$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '합과 평균 혼동' },
        { key: 'E', text: '$a = 4 + 6 + 8 + 10 = 28$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$a + 28 = 35 \\Rightarrow a = ?$', options: [
        { key: 'A', text: '$a = 7$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a = 28$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '이항 안 함' },
        { key: 'C', text: '$a = 35$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$a = 63$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '합' },
        { key: 'E', text: '$a = 5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$a$ 는?', options: [
        { key: 'A', text: '$7$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$28$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '이항 안 함' },
        { key: 'C', text: '$35$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '합' },
        { key: 'D', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$10$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(a + 28)/5 = 7 \\Rightarrow a = 35 - 28 = 7$.' },

  // Q20 (hard) 중앙값 10이 되는 x
  { chapterCode: CODE, difficulty: 'hard', concept: '중앙값 조건 → 미지수', requiredSkills: SKILLS_MEDIAN,
    stem: '자료 $5, 8, x, 12, 15$ 의 중앙값이 $10$ 이다. $x$ 는? (단, $8 < x < 12$ 가정)',
    steps: [
      { stepType: 'CONCEPT', prompt: '$8 < x < 12$ 면 정렬 결과?', options: [
        { key: 'A', text: '$5, 8, x, 12, 15$ — $3$ 번째가 $x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x, 5, 8, 12, 15$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '$x > 5$' },
        { key: 'C', text: '$5, 8, 12, 15, x$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '$x < 15$' },
        { key: 'D', text: '$5, x, 8, 12, 15$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '$x > 8$' },
        { key: 'E', text: '$5, 8, 12, x, 15$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '$x < 12$' },
      ] },
      { stepType: 'PROCESS', prompt: '중앙값 $= x = 10$ 이어야 함', options: [
        { key: 'A', text: '$x = 10$ (조건 $8 < 10 < 12$ ✓)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 8$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '조건 위배' },
        { key: 'C', text: '$x = 12$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '조건 위배' },
        { key: 'D', text: '$x = 11$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '중앙값 $11$ 됨' },
        { key: 'E', text: '$x = 9$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '중앙값 $9$ 됨' },
      ] },
      { stepType: 'ANSWER', prompt: '$x$ 는?', options: [
        { key: 'A', text: '$10$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$9$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$8$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '조건 위배' },
        { key: 'D', text: '$12$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '조건 위배' },
        { key: 'E', text: '$11$', isCorrect: false, errorCode: 'STATISTICS_INTERPRETATION_ERROR', errorReason: '중앙값 $\\neq 10$' },
      ] },
    ], solution: '$8 < x < 12$ 가정에서 정렬 시 $x$가 가운데(3번째). 중앙값 $= x = 10$.' },
];

export const K_G7_MATH1_CH08_STATISTICS_INTRO_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
