/**
 * K-G8-MATH2-CH07-PROBABILITY — STUDY pool (single-step, 20문제).
 * 확률 — 사건의 경우의 수, 확률 정의, 여사건, 배반사건.
 * Mastery 3-step과 별도 변형 문제. 중2 (G8).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5. LLM 미사용.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G8-MATH2-CH07-PROBABILITY';
const SKILLS_DEF = ['probability_definition', 'favorable_over_total'];
const SKILLS_RANGE = ['probability_range', 'certain_impossible'];
const SKILLS_COIN = ['coin_toss', 'independent_trials'];
const SKILLS_DICE = ['dice_outcome', 'enumerate_favorable'];
const SKILLS_TWO_DICE = ['two_dice_36', 'sum_combinations'];
const SKILLS_COMPLEMENT = ['complement_event', 'one_minus_p'];
const SKILLS_MUTUAL = ['mutually_exclusive', 'addition_rule'];
const SKILLS_GAMBLER = ['independence_misconception', 'memoryless'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) 동전 뒷면
  { chapterCode: CODE, difficulty: 'easy', concept: '동전 뒷면 확률', requiredSkills: SKILLS_COIN,
    stem: '동전을 한 번 던질 때 뒷면이 나올 확률은?',
    options: [
      { key: 'A', text: '$\\dfrac{1}{2}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '확실한 사건으로 오해' },
      { key: 'C', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '불가능 사건으로 오해' },
      { key: 'D', text: '$\\dfrac{1}{4}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 분모' },
      { key: 'E', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$0 \\leq P \\leq 1$ 위반' },
    ],
    solution: '경우 $2$ (앞·뒤), 뒷면 $1$ → $P = 1/2$.' },

  // S2 (쉬움) 주사위 홀수
  { chapterCode: CODE, difficulty: 'easy', concept: '주사위 홀수 확률', requiredSkills: SKILLS_DICE,
    stem: '주사위 한 개를 던질 때 홀수가 나올 확률은?',
    options: [
      { key: 'A', text: '$\\dfrac{1}{2}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{1}{3}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2/6$ 잘못된 셈' },
      { key: 'C', text: '$\\dfrac{2}{3}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$4/6$ 잘못' },
      { key: 'D', text: '$\\dfrac{3}{5}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '분모 $5$ 잘못' },
      { key: 'E', text: '$\\dfrac{1}{6}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '한 눈만' },
    ],
    solution: '홀수 $= \\{1, 3, 5\\}$, $P = 3/6 = 1/2$.' },

  // S3 (쉬움) 주사위 5의 배수
  { chapterCode: CODE, difficulty: 'easy', concept: '주사위 $5$의 배수', requiredSkills: SKILLS_DICE,
    stem: '주사위 한 개를 던질 때 $5$ 의 배수가 나올 확률은?',
    options: [
      { key: 'A', text: '$\\dfrac{1}{6}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{2}{6}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$10$도 포함시킴' },
      { key: 'C', text: '$\\dfrac{1}{3}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 약분' },
      { key: 'D', text: '$\\dfrac{5}{6}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '여사건' },
      { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$5$가 주사위에 있음' },
    ],
    solution: '$5$ 의 배수는 $\\{5\\}$ 하나뿐 → $P = 1/6$.' },

  // S4 (쉬움) 불가능 사건
  { chapterCode: CODE, difficulty: 'easy', concept: '불가능 사건의 확률', requiredSkills: SKILLS_RANGE,
    stem: '일어날 수 없는 사건의 확률은?',
    options: [
      { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '확실한 사건' },
      { key: 'C', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '중간값으로 오해' },
      { key: 'D', text: '$-1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '확률은 음수 X' },
      { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '명확히 $0$' },
    ],
    solution: '불가능 사건 → $P = 0$ (경우의 수 = $0$).' },

  // S5 (쉬움) 카드 1-5 짝수
  { chapterCode: CODE, difficulty: 'easy', concept: '카드 짝수 확률', requiredSkills: SKILLS_DICE,
    stem: '$1$ 부터 $5$ 까지의 카드 중 한 장을 뽑을 때 짝수일 확률은?',
    options: [
      { key: 'A', text: '$\\dfrac{2}{5}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '주사위 짝수 비율 적용' },
      { key: 'C', text: '$\\dfrac{3}{5}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '홀수 비율' },
      { key: 'D', text: '$\\dfrac{2}{4}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$0$ 포함된 분모' },
      { key: 'E', text: '$\\dfrac{1}{5}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '한 짝수만' },
    ],
    solution: '짝수 $= \\{2, 4\\}$, $P = 2/5$.' },

  // S6 (쉬움) 확률 정의
  { chapterCode: CODE, difficulty: 'easy', concept: '확률 정의 공식', requiredSkills: SKILLS_DEF,
    stem: '사건 $A$ 의 확률 $P(A)$ 는?',
    options: [
      { key: 'A', text: '$\\dfrac{A \\text{가 일어나는 경우의 수}}{\\text{전체 경우의 수}}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{\\text{전체 경우의 수}}{A \\text{가 일어나는 경우의 수}}$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '분자분모 바꿈' },
      { key: 'C', text: '$A \\times \\text{전체}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 식' },
      { key: 'D', text: '$A - \\text{전체}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 식' },
      { key: 'E', text: '$A + \\text{전체}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 식' },
    ],
    solution: '$P(A) = \\dfrac{(A \\text{경우의 수})}{(\\text{전체 경우의 수})}$.' },

  // S7 (중) 두 주사위 합 8
  { chapterCode: CODE, difficulty: 'medium', concept: '두 주사위 합 $8$', requiredSkills: SKILLS_TWO_DICE,
    stem: '주사위 두 개의 눈의 합이 $8$ 일 확률은?',
    options: [
      { key: 'A', text: '$\\dfrac{5}{36}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{4}{36}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '$(6,2)$ 같은 경우 누락' },
      { key: 'C', text: '$\\dfrac{6}{36}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '합 $7$과 혼동' },
      { key: 'D', text: '$\\dfrac{1}{6}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '합 $7$ 확률 답함' },
      { key: 'E', text: '$\\dfrac{2}{36}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '극단 경우 누락' },
    ],
    solution: '합 $8$: $(2,6), (3,5), (4,4), (5,3), (6,2) = 5$ 가지. $P = 5/36$.' },

  // S8 (중) 두 주사위 합 12
  { chapterCode: CODE, difficulty: 'medium', concept: '두 주사위 합 최대 ($12$)', requiredSkills: SKILLS_TWO_DICE,
    stem: '주사위 두 개의 눈의 합이 $12$ 일 확률은?',
    options: [
      { key: 'A', text: '$\\dfrac{1}{36}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{2}{36}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '$(6,6)$ 두 번 셈' },
      { key: 'C', text: '$\\dfrac{1}{6}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '분모 잘못' },
      { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$12$는 가능한 합' },
      { key: 'E', text: '$\\dfrac{6}{36}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '합 $7$과 혼동' },
    ],
    solution: '합 $12$: $(6, 6)$ 하나뿐 → $P = 1/36$.' },

  // S9 (중) 동전 두 번 적어도 앞면
  { chapterCode: CODE, difficulty: 'medium', concept: '여사건 활용 (적어도)', requiredSkills: SKILLS_COMPLEMENT,
    stem: '동전을 두 번 던질 때 적어도 한 번 앞면이 나올 확률은?',
    options: [
      { key: 'A', text: '$\\dfrac{3}{4}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{1}{4}$', isCorrect: false, errorCode: 'COMPLEMENT_ERROR', errorReason: '둘 다 앞면 확률 답함' },
      { key: 'C', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '한 번 던지기 확률' },
      { key: 'D', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '확실한 사건 아님 (뒤뒤 가능)' },
      { key: 'E', text: '$\\dfrac{2}{4}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '잘못된 셈' },
    ],
    solution: '여사건 = 둘 다 뒷면 ($1/4$). $P = 1 - 1/4 = 3/4$.' },

  // S10 (중) 카드 4의 배수
  { chapterCode: CODE, difficulty: 'medium', concept: '카드 $4$의 배수', requiredSkills: SKILLS_DICE,
    stem: '$1$ 부터 $20$ 까지의 카드 중 한 장을 뽑을 때 $4$ 의 배수일 확률은?',
    options: [
      { key: 'A', text: '$\\dfrac{1}{4}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{1}{5}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '$5$ 개 잘못 셈' },
      { key: 'C', text: '$\\dfrac{4}{20}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '$20$ 누락 (4,8,12,16만)' },
      { key: 'D', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '짝수와 혼동' },
      { key: 'E', text: '$\\dfrac{5}{20}$', isCorrect: false, errorCode: 'SIMPLIFICATION_ERROR', errorReason: '약분 미수행' },
    ],
    solution: '$4$의 배수 $= \\{4, 8, 12, 16, 20\\} = 5$개. $P = 5/20 = 1/4$.' },

  // S11 (중) 여사건
  { chapterCode: CODE, difficulty: 'medium', concept: '여사건 $P(A^c)$', requiredSkills: SKILLS_COMPLEMENT,
    stem: '$P(A) = \\dfrac{2}{5}$ 일 때 $P(A^c)$ 는?',
    options: [
      { key: 'A', text: '$\\dfrac{3}{5}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{2}{5}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '같다고 가정' },
      { key: 'C', text: '$\\dfrac{5}{2}$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '뒤집음' },
      { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 여사건' },
      { key: 'E', text: '$1$', isCorrect: false, errorCode: 'COMPLEMENT_ERROR', errorReason: '$1$ 자체로 잘못' },
    ],
    solution: '$P(A^c) = 1 - P(A) = 1 - 2/5 = 3/5$.' },

  // S12 (중) 주사위 2 이하
  { chapterCode: CODE, difficulty: 'medium', concept: '주사위 $2$ 이하', requiredSkills: SKILLS_DICE,
    stem: '주사위 한 개에서 $2$ 이하의 수가 나올 확률은?',
    options: [
      { key: 'A', text: '$\\dfrac{1}{3}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{1}{6}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$1$만 셈' },
      { key: 'C', text: '$\\dfrac{2}{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '여사건 답함' },
      { key: 'D', text: '$\\dfrac{2}{6}$', isCorrect: false, errorCode: 'SIMPLIFICATION_ERROR', errorReason: '약분 미수행 (=A지만 표기)' },
      { key: 'E', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '잘못된 분자' },
    ],
    solution: '$\\{1, 2\\} = 2$개. $P = 2/6 = 1/3$.' },

  // S13 (중) 동전 세 번 모두 뒷면
  { chapterCode: CODE, difficulty: 'medium', concept: '독립 시행 (동전 세 번)', requiredSkills: SKILLS_COIN,
    stem: '동전을 세 번 던질 때 세 번 모두 뒷면이 나올 확률은?',
    options: [
      { key: 'A', text: '$\\dfrac{1}{8}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '한 번 던지기 확률' },
      { key: 'C', text: '$\\dfrac{1}{6}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '전체 경우 $6$로 오해' },
      { key: 'D', text: '$\\dfrac{3}{8}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '잘못된 분자' },
      { key: 'E', text: '$\\dfrac{1}{4}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '두 번만 곱함' },
    ],
    solution: '$P = (1/2)^3 = 1/8$. 또는 $2^3 = 8$가지 중 (뒤뒤뒤) $1$가지.' },

  // S14 (중) 두 주사위 둘 다 짝수
  { chapterCode: CODE, difficulty: 'medium', concept: '두 주사위 둘 다 짝수', requiredSkills: SKILLS_TWO_DICE,
    stem: '주사위 두 개를 던질 때 두 눈 모두 짝수일 확률은?',
    options: [
      { key: 'A', text: '$\\dfrac{1}{4}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '한 개만 짝수' },
      { key: 'C', text: '$\\dfrac{1}{3}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '잘못된 분자' },
      { key: 'D', text: '$\\dfrac{3}{36}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '$3$가지 잘못' },
      { key: 'E', text: '$\\dfrac{6}{36}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '한 쪽 짝수 만큼만 ($6$개)' },
    ],
    solution: '각각 $1/2$, 곱하면 $(1/2)(1/2) = 1/4$. (또는 $3 \\times 3 / 36 = 9/36 = 1/4$.)' },

  // S15 (중) 카드 짝수 또는 5의 배수
  { chapterCode: CODE, difficulty: 'medium', concept: '합집합 사건 (포함배제)', requiredSkills: SKILLS_MUTUAL,
    stem: '$1$ 부터 $10$ 까지 카드 중 한 장을 뽑을 때 짝수 또는 $5$ 의 배수일 확률은?',
    options: [
      { key: 'A', text: '$\\dfrac{3}{5}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '짝수만 ($5$의 배수 누락)' },
      { key: 'C', text: '$\\dfrac{7}{10}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '$10$을 두 번 셈' },
      { key: 'D', text: '$\\dfrac{1}{5}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$5$의 배수만' },
      { key: 'E', text: '$\\dfrac{4}{5}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '잘못된 셈' },
    ],
    solution: '$\\{2, 4, 5, 6, 8, 10\\} = 6$개 (중복 $10$ 한 번만). $P = 6/10 = 3/5$.' },

  // S16 (어려움) 합 10 이상
  { chapterCode: CODE, difficulty: 'hard', concept: '두 주사위 합 $10$ 이상', requiredSkills: SKILLS_TWO_DICE,
    stem: '주사위 두 개의 눈의 합이 $10$ 이상일 확률은?',
    options: [
      { key: 'A', text: '$\\dfrac{1}{6}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{3}{36}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '합 $11, 12$ 누락' },
      { key: 'C', text: '$\\dfrac{4}{36}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '경우 누락' },
      { key: 'D', text: '$\\dfrac{1}{4}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '잘못된 약분' },
      { key: 'E', text: '$\\dfrac{1}{12}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '합 $10$만' },
    ],
    solution: '합 $10$: $(4,6),(5,5),(6,4)$ 3개. 합 $11$: $(5,6),(6,5)$ 2개. 합 $12$: $(6,6)$ 1개. 총 $6 / 36 = 1/6$.' },

  // S17 (어려움) 공 뽑기 빨강 또는 파랑
  { chapterCode: CODE, difficulty: 'hard', concept: '합집합 (배반사건)', requiredSkills: SKILLS_MUTUAL,
    stem: '빨강 $3$, 파랑 $5$, 흰색 $2$ 의 공이 있다. 하나를 뽑을 때 빨강 또는 파랑일 확률은?',
    options: [
      { key: 'A', text: '$\\dfrac{4}{5}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{3}{10}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '빨강만' },
      { key: 'C', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '파랑만' },
      { key: 'D', text: '$\\dfrac{1}{5}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '흰색 확률' },
      { key: 'E', text: '$\\dfrac{8}{15}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '분모 잘못' },
    ],
    solution: '전체 $10$, 유리 $3 + 5 = 8$. $P = 8/10 = 4/5$.' },

  // S18 (어려움) 도박사의 오류
  { chapterCode: CODE, difficulty: 'hard', concept: '독립 시행 (도박사의 오류)', requiredSkills: SKILLS_GAMBLER,
    stem: '공정한 주사위를 $5$번 연속 던져 모두 $6$이 나왔다. $6$번째 던질 때 $6$이 나올 확률은?',
    options: [
      { key: 'A', text: '$\\dfrac{1}{6}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '매우 낮음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '도박사의 오류 (과거 영향 X)' },
      { key: 'C', text: '매우 높음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '추세 가정 (잘못)' },
      { key: 'D', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 비율' },
      { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '불가능 사건 아님' },
    ],
    solution: '각 던지기는 독립. 과거 결과와 무관 → $P = 1/6$.' },

  // S19 (어려움) 배반사건 합
  { chapterCode: CODE, difficulty: 'hard', concept: '배반사건 덧셈법칙', requiredSkills: SKILLS_MUTUAL,
    stem: '배반인 두 사건 $A, B$ 에 대해 $P(A) = \\dfrac{2}{5}$, $P(B) = \\dfrac{1}{4}$ 이다. $P(A \\cup B)$ 는?',
    options: [
      { key: 'A', text: '$\\dfrac{13}{20}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{3}{9}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '분자분모 따로 더함' },
      { key: 'C', text: '$\\dfrac{1}{10}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱셈 적용 ($P(A) \\times P(B)$)' },
      { key: 'D', text: '$\\dfrac{2}{20}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '분자 곱셈' },
      { key: 'E', text: '$\\dfrac{1}{20}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '뺄셈 잘못' },
    ],
    solution: '배반사건 → $P(A \\cup B) = P(A) + P(B) = \\dfrac{8}{20} + \\dfrac{5}{20} = \\dfrac{13}{20}$.' },

  // S20 (어려움) 합 4 또는 5
  { chapterCode: CODE, difficulty: 'hard', concept: '주사위 합 $4$ 또는 $5$', requiredSkills: SKILLS_MUTUAL,
    stem: '주사위 두 개의 눈의 합이 $4$ 또는 $5$ 일 확률은?',
    options: [
      { key: 'A', text: '$\\dfrac{7}{36}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{3}{36}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '합 $4$만 ($3$가지)' },
      { key: 'C', text: '$\\dfrac{4}{36}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '합 $5$만 ($4$가지)' },
      { key: 'D', text: '$\\dfrac{1}{6}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '$6/36$ 잘못' },
      { key: 'E', text: '$\\dfrac{12}{36}$', isCorrect: false, errorCode: 'PROBABILITY_COUNTING_ERROR', errorReason: '중복 셈' },
    ],
    solution: '합 $4$: $(1,3),(2,2),(3,1)$ 3가지. 합 $5$: $(1,4),(2,3),(3,2),(4,1)$ 4가지. 배반 → $3 + 4 = 7$. $P = 7/36$.' },
];

export const K_G8_MATH2_CH07_PROBABILITY_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
