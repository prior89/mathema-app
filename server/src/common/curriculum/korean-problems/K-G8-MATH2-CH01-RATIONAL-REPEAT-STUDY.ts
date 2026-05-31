/**
 * K-G8-MATH2-CH01-RATIONAL-REPEAT — STUDY pool (single-step, 20문제).
 * 유리수와 순환소수 — 분수/소수 변환, 유한·순환 판별, 순환마디.
 * Mastery 3-step과 별도 변형 문제. 중2 (G8).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5. LLM 미사용.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G8-MATH2-CH01-RATIONAL-REPEAT';
const SKILLS_BASIC = ['fraction_to_decimal', 'decimal_to_fraction'];
const SKILLS_FINITE = ['finite_decimal_condition', 'denominator_2_5_only'];
const SKILLS_REPEAT = ['repeating_decimal_to_fraction', 'recurring_period'];
const SKILLS_PERIOD = ['repeating_period_length', 'long_division'];
const SKILLS_ARITH = ['repeating_decimal_arithmetic', 'fraction_addition'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) 1/5 → 0.2
  { chapterCode: CODE, difficulty: 'easy', concept: '분수→소수 (유한)', requiredSkills: SKILLS_BASIC,
    stem: '$\\dfrac{1}{5}$ 를 소수로 표현하면?',
    options: [
      { key: 'A', text: '$0.2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0.5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '분자·분모 바꿈' },
      { key: 'C', text: '$0.\\overline{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '유한소수인데 순환 처리' },
      { key: 'D', text: '$0.02$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$1/50$' },
      { key: 'E', text: '$1.5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나눗셈 잘못' },
    ],
    solution: '$1 \\div 5 = 0.2$. 분모 $5$ → 유한소수.' },

  // S2 (쉬움) 2/3 순환
  { chapterCode: CODE, difficulty: 'easy', concept: '분수→소수 (순환)', requiredSkills: SKILLS_BASIC,
    stem: '$\\dfrac{2}{3}$ 를 소수로 표현하면?',
    options: [
      { key: 'A', text: '$0.\\overline{6}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0.6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '순환 무시' },
      { key: 'C', text: '$0.\\overline{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$1/3$ 답함' },
      { key: 'D', text: '$0.66$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '순환마디 표시 누락' },
      { key: 'E', text: '$1.5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$3/2$ 잘못된 방향' },
    ],
    solution: '$2 \\div 3 = 0.666\\ldots = 0.\\overline{6}$.' },

  // S3 (쉬움) 7/20 유한
  { chapterCode: CODE, difficulty: 'easy', concept: '유한 판별 (분모 $20$)', requiredSkills: SKILLS_FINITE,
    stem: '$\\dfrac{7}{20}$ 은 유한소수인가 순환소수인가?',
    options: [
      { key: 'A', text: '유한소수', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '순환소수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$20 = 2^2 \\times 5$ → 분모가 $2$와 $5$만 → 유한' },
      { key: 'C', text: '소수가 아님', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\dfrac{7}{20} = 0.35$' },
      { key: 'D', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '분모 소인수분해로 명확' },
      { key: 'E', text: '정수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\dfrac{7}{20}$은 정수 아님' },
    ],
    solution: '$20 = 2^2 \\times 5$. 분모 소인수가 $2$와 $5$뿐 → 유한소수.' },

  // S4 (쉬움) 1/6 순환
  { chapterCode: CODE, difficulty: 'easy', concept: '유한·순환 판별 ($6$)', requiredSkills: SKILLS_FINITE,
    stem: '$\\dfrac{1}{6}$ 은 유한 / 순환?',
    options: [
      { key: 'A', text: '순환소수', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '유한소수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$6 = 2 \\times 3$, $3$ 포함 → 순환' },
      { key: 'C', text: '정수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\dfrac{1}{6}$은 정수 아님' },
      { key: 'D', text: '소수가 아님', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$1/6 = 0.1666\\ldots$' },
      { key: 'E', text: '$0.1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '값을 답함' },
    ],
    solution: '$6 = 2 \\times 3$. $3$ 포함 → 순환소수 ($1/6 = 0.1\\overline{6}$).' },

  // S5 (쉬움) 0.4 → 2/5
  { chapterCode: CODE, difficulty: 'easy', concept: '소수→분수 (기약)', requiredSkills: SKILLS_BASIC,
    stem: '$0.4$ 를 기약분수로 나타내면?',
    options: [
      { key: 'A', text: '$\\dfrac{2}{5}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{4}{10}$', isCorrect: false, errorCode: 'SIMPLIFICATION_ERROR', errorReason: '약분 미수행' },
      { key: 'C', text: '$\\dfrac{1}{4}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$0.25$ 답함' },
      { key: 'D', text: '$\\dfrac{4}{1}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '소수점 무시' },
      { key: 'E', text: '$\\dfrac{5}{2}$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '분자분모 바꿈' },
    ],
    solution: '$0.4 = \\dfrac{4}{10} = \\dfrac{2}{5}$ (약분).' },

  // S6 (쉬움) 0.75 → 3/4
  { chapterCode: CODE, difficulty: 'easy', concept: '소수→분수 (약분 필요)', requiredSkills: SKILLS_BASIC,
    stem: '$0.75$ 를 기약분수로 나타내면?',
    options: [
      { key: 'A', text: '$\\dfrac{3}{4}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{75}{100}$', isCorrect: false, errorCode: 'SIMPLIFICATION_ERROR', errorReason: '약분 미수행' },
      { key: 'C', text: '$\\dfrac{7.5}{10}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '분자가 소수' },
      { key: 'D', text: '$\\dfrac{1}{4}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$0.25$ 답함' },
      { key: 'E', text: '$\\dfrac{4}{3}$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '분자분모 바꿈' },
    ],
    solution: '$0.75 = \\dfrac{75}{100} = \\dfrac{3}{4}$ (약분 — $25$ 나눔).' },

  // S7 (중) 9/40 유한
  { chapterCode: CODE, difficulty: 'medium', concept: '유한 판별 (분모 $40$)', requiredSkills: SKILLS_FINITE,
    stem: '$\\dfrac{9}{40}$ 은 유한 / 순환?',
    options: [
      { key: 'A', text: '유한소수', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '순환소수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$40 = 2^3 \\times 5$ → 유한' },
      { key: 'C', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '분모로 명확' },
      { key: 'D', text: '$0.\\overline{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '값을 답함' },
      { key: 'E', text: '정수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\dfrac{9}{40}$은 정수 아님' },
    ],
    solution: '$40 = 2^3 \\times 5$. 분모 소인수 $2, 5$뿐 → 유한소수 ($0.225$).' },

  // S8 (중) 5/24 순환
  { chapterCode: CODE, difficulty: 'medium', concept: '유한 판별 (분모 $24$)', requiredSkills: SKILLS_FINITE,
    stem: '$\\dfrac{5}{24}$ 은 유한 / 순환?',
    options: [
      { key: 'A', text: '순환소수', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '유한소수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$24 = 2^3 \\times 3$, $3$ 포함 → 순환' },
      { key: 'C', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '분모로 명확' },
      { key: 'D', text: '정수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\dfrac{5}{24}$은 정수 아님' },
      { key: 'E', text: '$0.2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '값을 답함' },
    ],
    solution: '$24 = 2^3 \\times 3$. $3$ 포함 → 순환소수.' },

  // S9 (중) 13/125 유한
  { chapterCode: CODE, difficulty: 'medium', concept: '유한 판별 (분모 $125$)', requiredSkills: SKILLS_FINITE,
    stem: '$\\dfrac{13}{125}$ 은 유한 / 순환?',
    options: [
      { key: 'A', text: '유한소수', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '순환소수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$125 = 5^3$ → 유한' },
      { key: 'C', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '분모로 명확' },
      { key: 'D', text: '정수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '정수 아님' },
      { key: 'E', text: '$0.13$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '값을 답함' },
    ],
    solution: '$125 = 5^3$. $5$만 → 유한소수 ($0.104$).' },

  // S10 (중) a/(2×5³) 유한 판별
  { chapterCode: CODE, difficulty: 'medium', concept: '지수형 분모 유한 판별', requiredSkills: SKILLS_FINITE,
    stem: '$\\dfrac{a}{2 \\times 5^3}$ 가 자연수 $a$ 와 서로소일 때 ($a$ 가 $2, 5$의 배수 아님), 유한소수인가?',
    options: [
      { key: 'A', text: '항상 유한소수', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '항상 순환소수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '분모 소인수 $2, 5$뿐 → 유한' },
      { key: 'C', text: '$a$ 값에 따라 다름', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '서로소 가정에서는 분모만 보면 됨' },
      { key: 'D', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '판별 가능' },
      { key: 'E', text: '$a$ 가 $10$의 배수일 때만 유한', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '분자 조건 무관' },
    ],
    solution: '기약분수의 분모 소인수가 $2$와 $5$뿐이면 유한소수.' },

  // S11 (중) 0.7 순환 → 7/9
  { chapterCode: CODE, difficulty: 'medium', concept: '순환소수→분수 (한 자리)', requiredSkills: SKILLS_REPEAT,
    stem: '$0.\\overline{7}$ 를 기약분수로?',
    options: [
      { key: 'A', text: '$\\dfrac{7}{9}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{7}{10}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$0.7$ 그대로' },
      { key: 'C', text: '$\\dfrac{7}{99}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '두 자리 순환과 혼동' },
      { key: 'D', text: '$\\dfrac{77}{100}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$0.77$로 잘못 해석' },
      { key: 'E', text: '$\\dfrac{9}{7}$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '분자분모 바꿈' },
    ],
    solution: '$x = 0.\\overline{7} \\to 10x = 7.\\overline{7} \\to 9x = 7 \\to x = \\dfrac{7}{9}$.' },

  // S12 (중) 0.45 순환 → 5/11
  { chapterCode: CODE, difficulty: 'medium', concept: '순환소수→분수 (두 자리)', requiredSkills: SKILLS_REPEAT,
    stem: '$0.\\overline{45}$ 를 기약분수로?',
    options: [
      { key: 'A', text: '$\\dfrac{5}{11}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{45}{100}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$0.45$ 그대로' },
      { key: 'C', text: '$\\dfrac{45}{99}$', isCorrect: false, errorCode: 'SIMPLIFICATION_ERROR', errorReason: '약분 안 함' },
      { key: 'D', text: '$\\dfrac{9}{20}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$0.45 = 9/20$ 답함' },
      { key: 'E', text: '$\\dfrac{11}{5}$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '분자분모 바꿈' },
    ],
    solution: '$\\dfrac{45}{99} = \\dfrac{5}{11}$ ($9$로 약분).' },

  // S13 (중) 0.8 순환 → 8/9
  { chapterCode: CODE, difficulty: 'medium', concept: '순환소수→분수 ($0.\\overline{8}$)', requiredSkills: SKILLS_REPEAT,
    stem: '$0.\\overline{8}$ 를 기약분수로?',
    options: [
      { key: 'A', text: '$\\dfrac{8}{9}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{8}{10}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$0.8$ 그대로' },
      { key: 'C', text: '$\\dfrac{4}{5}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$0.8$ 약분 답함' },
      { key: 'D', text: '$\\dfrac{8}{99}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '두 자리 순환' },
      { key: 'E', text: '$\\dfrac{9}{8}$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '분자분모 바꿈' },
    ],
    solution: '$x = 0.\\overline{8} \\to 9x = 8 \\to x = \\dfrac{8}{9}$.' },

  // S14 (중) 2.5 순환 → 23/9
  { chapterCode: CODE, difficulty: 'medium', concept: '순환소수→분수 (정수+순환)', requiredSkills: SKILLS_REPEAT,
    stem: '$2.\\overline{5}$ 를 기약분수로?',
    options: [
      { key: 'A', text: '$\\dfrac{23}{9}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{25}{9}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$25.\\overline{5} - 2 = 23.\\overline{5}$인데 잘못' },
      { key: 'C', text: '$\\dfrac{5}{9}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '정수부 $2$ 무시' },
      { key: 'D', text: '$\\dfrac{25}{10}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$2.5$ (유한)으로 잘못 해석' },
      { key: 'E', text: '$\\dfrac{255}{99}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '두 자리 순환으로 잘못 처리' },
    ],
    solution: '$x = 2.\\overline{5} \\to 10x = 25.\\overline{5} \\to 9x = 23 \\to x = \\dfrac{23}{9}$.' },

  // S15 (중) 0.234 순환 → 26/111
  { chapterCode: CODE, difficulty: 'medium', concept: '순환소수→분수 (세 자리)', requiredSkills: SKILLS_REPEAT,
    stem: '$0.\\overline{234}$ 를 기약분수로?',
    options: [
      { key: 'A', text: '$\\dfrac{26}{111}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{234}{999}$', isCorrect: false, errorCode: 'SIMPLIFICATION_ERROR', errorReason: '약분 미수행 ($9$로)' },
      { key: 'C', text: '$\\dfrac{234}{1000}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '유한소수로 잘못 처리' },
      { key: 'D', text: '$\\dfrac{2}{17}$', isCorrect: false, errorCode: 'SIMPLIFICATION_ERROR', errorReason: '잘못된 약분' },
      { key: 'E', text: '$\\dfrac{234}{99}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '두 자리 순환 분모 $99$ 적용' },
    ],
    solution: '$\\dfrac{234}{999} = \\dfrac{26}{111}$ ($9$로 약분).' },

  // S16 (어려움) 1/11 순환마디
  { chapterCode: CODE, difficulty: 'hard', concept: '순환마디 길이 ($1/11$)', requiredSkills: SKILLS_PERIOD,
    stem: '$\\dfrac{1}{11}$ 을 소수로 나타냈을 때 순환마디의 길이는?',
    options: [
      { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$1/11 = 0.0\\overline{9}$ 같이 잘못' },
      { key: 'C', text: '$11$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '분모 자체' },
      { key: 'D', text: '$10$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$n - 1$ 잘못 적용' },
      { key: 'E', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 나눗셈' },
    ],
    solution: '$\\dfrac{1}{11} = 0.0909\\ldots = 0.\\overline{09}$. 순환마디 $= 09$, 길이 $= 2$.' },

  // S17 (어려움) a/15 유한 조건
  { chapterCode: CODE, difficulty: 'hard', concept: '$a/15$가 유한 → $a$ 조건', requiredSkills: SKILLS_FINITE,
    stem: '$\\dfrac{a}{15}$ 가 유한소수가 되도록 하는 자연수 $a$ 의 조건은?',
    options: [
      { key: 'A', text: '$3$ 의 배수', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$5$ 의 배수', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$5$는 분모에 이미 있음 — $3$ 약분이 필요' },
      { key: 'C', text: '$15$ 의 배수', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$15$의 배수면 정수 — 너무 강한 조건' },
      { key: 'D', text: '$2$ 의 배수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$2$는 분모에 없음' },
      { key: 'E', text: '모든 자연수', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$3$의 배수가 아니면 순환' },
    ],
    solution: '$15 = 3 \\times 5$. $a$ 가 $3$의 배수여야 분모에서 $3$이 약분되어 분모가 $5$ 형태 → 유한.' },

  // S18 (어려움) 0.3 순환 + 0.6 순환
  { chapterCode: CODE, difficulty: 'hard', concept: '순환소수 덧셈 → 정수', requiredSkills: SKILLS_ARITH,
    stem: '$0.\\overline{3} + 0.\\overline{6}$ 의 값은?',
    options: [
      { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0.\\overline{9}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$0.\\overline{9} = 1$이지만 둘은 같은 값' },
      { key: 'C', text: '$0.99$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '순환 무시' },
      { key: 'D', text: '$0.9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '순환 무시' },
      { key: 'E', text: '$1.5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3 + 6 = 9$ 잘못된 덧셈' },
    ],
    solution: '$\\dfrac{3}{9} + \\dfrac{6}{9} = \\dfrac{9}{9} = 1$.' },

  // S19 (어려움) 2.9 순환 = 3
  { chapterCode: CODE, difficulty: 'hard', concept: '순환소수 변형 ($2.\\overline{9} = 3$)', requiredSkills: SKILLS_REPEAT,
    stem: '$2.\\overline{9}$ 의 값은?',
    options: [
      { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$2.99\\ldots$ (3 미만)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$0.\\overline{9} = 1$ 동일 원리' },
      { key: 'C', text: '$2.9$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '순환 무시' },
      { key: 'D', text: '$\\dfrac{29}{9}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$10x - x$ 잘못 적용' },
      { key: 'E', text: '$2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '소수부 무시' },
    ],
    solution: '$x = 2.\\overline{9} \\to 10x = 29.\\overline{9} \\to 9x = 27 \\to x = 3$.' },

  // S20 (어려움) a/45 유한 조건
  { chapterCode: CODE, difficulty: 'hard', concept: '$a/45$ 유한 → 9의 배수', requiredSkills: SKILLS_FINITE,
    stem: '$\\dfrac{a}{45}$ 가 유한소수가 되도록 하는 자연수 $a$ 의 가장 작은 값은?',
    options: [
      { key: 'A', text: '$9$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$3/45 = 1/15$ — $3$ 남아 순환' },
      { key: 'C', text: '$5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$5$는 분모에 이미 있음' },
      { key: 'D', text: '$45$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$45$는 정수 — 더 작은 값 가능' },
      { key: 'E', text: '$15$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 약수' },
    ],
    solution: '$45 = 3^2 \\times 5$. $a$가 $3^2 = 9$의 배수여야 $3^2$이 약분 → 분모가 $5$ 형태. 최소 $a = 9$ ($9/45 = 1/5 = 0.2$).' },
];

export const K_G8_MATH2_CH01_RATIONAL_REPEAT_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
