/**
 * K-G10-CS2-CH02-SETS-PROP — STUDY pool (single-step, 20문제).
 * 집합과 명제 — 부분집합, 집합 연산, 명제 진릿값, 역·이·대우, 충분·필요조건.
 * Mastery 3-step과 별도 변형 문제. 고1 공통수학2 (G10).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5. LLM 미사용.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G10-CS2-CH02-SETS-PROP';
const SKILLS_SET = ['set_cardinality', 'set_notation'];
const SKILLS_ELEM = ['element_membership'];
const SKILLS_SUBSET = ['subset_count', 'power_set'];
const SKILLS_OPS = ['intersection', 'union', 'complement', 'difference'];
const SKILLS_DEMORGAN = ['de_morgan_laws'];
const SKILLS_PROP = ['proposition_truth_value', 'universal_existential'];
const SKILLS_CONVERSE = ['converse_inverse_contrapositive', 'contrapositive_equivalence'];
const SKILLS_NEG = ['negation'];
const SKILLS_CARD = ['inclusion_exclusion'];
const SKILLS_SUFNEC = ['sufficient_necessary_condition'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) 원소 수 4
  { chapterCode: CODE, difficulty: 'easy', concept: '집합 원소 수', requiredSkills: SKILLS_SET,
    stem: '$\\{a, b, c, d\\}$ 의 원소 수 $n(A)$?',
    options: [
      { key: 'A', text: '$4$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '한 원소 누락' },
      { key: 'C', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 셈' },
      { key: 'D', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '한 집합 개수' },
      { key: 'E', text: '$2^4 = 16$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부분집합 수' },
    ],
    solution: '원소 $a, b, c, d$ 의 개수 $= 4$.' },

  // S2 (쉬움) 원소 판정 (거짓)
  { chapterCode: CODE, difficulty: 'easy', concept: '원소 판정 (거짓 케이스)', requiredSkills: SKILLS_ELEM,
    stem: '$5 \\in \\{1, 2, 3\\}$ 의 참/거짓?',
    options: [
      { key: 'A', text: '거짓', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '참', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$5$는 집합에 없음' },
      { key: 'C', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '판별 가능' },
      { key: 'D', text: '집합 정의 X', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '집합 정의됨' },
      { key: 'E', text: '$5 \\notin$ 표기 필요', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '진릿값 묻는 것' },
    ],
    solution: '$5$ 는 $\\{1, 2, 3\\}$ 에 속하지 않으므로 거짓.' },

  // S3 (쉬움) 부분집합 1원소
  { chapterCode: CODE, difficulty: 'easy', concept: '부분집합 수 ($1$ 원소)', requiredSkills: SKILLS_SUBSET,
    stem: '$\\{1\\}$ 의 부분집합 수?',
    options: [
      { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '공집합 누락' },
      { key: 'C', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '항상 $\\geq 1$' },
      { key: 'D', text: '$4$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$2^2$' },
      { key: 'E', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
    ],
    solution: '$2^1 = 2$. ($\\emptyset, \\{1\\}$).' },

  // S4 (쉬움) 교집합 다른
  { chapterCode: CODE, difficulty: 'easy', concept: '교집합', requiredSkills: SKILLS_OPS,
    stem: '$A = \\{2, 4, 6\\}$, $B = \\{4, 6, 8\\}$. $A \\cap B$?',
    options: [
      { key: 'A', text: '$\\{4, 6\\}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\{2, 8\\}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '차집합 잘못' },
      { key: 'C', text: '$\\{2, 4, 6, 8\\}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합집합 답함' },
      { key: 'D', text: '$\\emptyset$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '서로소가 아님' },
      { key: 'E', text: '$\\{4\\}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$6$ 누락' },
    ],
    solution: '공통 원소: $4, 6$.' },

  // S5 (쉬움) 공집합
  { chapterCode: CODE, difficulty: 'easy', concept: '공집합 원소 수', requiredSkills: SKILLS_SET,
    stem: '$\\emptyset$ 의 원소 수?',
    options: [
      { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '집합 자체를 원소로 셈' },
      { key: 'C', text: '$\\emptyset$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '집합 그대로' },
      { key: 'D', text: '정의 안 됨', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '정의됨' },
      { key: 'E', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 추정' },
    ],
    solution: '공집합은 원소가 하나도 없는 집합 → $n(\\emptyset) = 0$.' },

  // S6 (쉬움) "3은 소수" 진릿값
  { chapterCode: CODE, difficulty: 'easy', concept: '명제 진릿값', requiredSkills: SKILLS_PROP,
    stem: '명제 "$3$ 은 소수이다" 의 진릿값?',
    options: [
      { key: 'A', text: '참', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '거짓', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$3$의 약수는 $1, 3$ → 소수' },
      { key: 'C', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '판별 가능' },
      { key: 'D', text: '명제 아님', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '참/거짓 판별 가능 → 명제' },
      { key: 'E', text: '두 가지 모두 가능', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '명제는 한 진릿값' },
    ],
    solution: '$3$ 은 약수가 $1$과 자기 자신 뿐 → 소수 → 참.' },

  // S7 (중) 부분집합 3원소
  { chapterCode: CODE, difficulty: 'medium', concept: '부분집합 수 ($3$ 원소)', requiredSkills: SKILLS_SUBSET,
    stem: '$\\{a, b, c\\}$ 의 부분집합 수?',
    options: [
      { key: 'A', text: '$8$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3!$' },
      { key: 'C', text: '$3$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$n$만' },
      { key: 'D', text: '$4$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$2^2$' },
      { key: 'E', text: '$9$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$3^2$' },
    ],
    solution: '$2^n = 2^3 = 8$ (공집합 포함).' },

  // S8 (중) 여집합
  { chapterCode: CODE, difficulty: 'medium', concept: '여집합', requiredSkills: SKILLS_OPS,
    stem: '$U = \\{1, 2, 3, 4, 5, 6\\}$, $A = \\{1, 3, 5\\}$. $A^c$?',
    options: [
      { key: 'A', text: '$\\{2, 4, 6\\}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\{1, 3, 5\\}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$A$ 그대로' },
      { key: 'C', text: '$U$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '전체집합' },
      { key: 'D', text: '$\\emptyset$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '공집합 잘못' },
      { key: 'E', text: '$\\{2, 4\\}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$6$ 누락' },
    ],
    solution: '$A^c = U - A = \\{2, 4, 6\\}$.' },

  // S9 (중) B - A
  { chapterCode: CODE, difficulty: 'medium', concept: '차집합 $B - A$', requiredSkills: SKILLS_OPS,
    stem: '$A = \\{2, 4, 6\\}$, $B = \\{4, 6, 8\\}$. $B - A$?',
    options: [
      { key: 'A', text: '$\\{8\\}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\{2\\}$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$A - B$' },
      { key: 'C', text: '$\\{2, 8\\}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '대칭차' },
      { key: 'D', text: '$\\{4, 6\\}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '교집합' },
      { key: 'E', text: '$\\emptyset$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$B$ 에는 $A$에 없는 원소 있음' },
    ],
    solution: '$B - A = B \\cap A^c = \\{8\\}$ ($B$에 있고 $A$에 없는 것).' },

  // S10 (중) 드모르간
  { chapterCode: CODE, difficulty: 'medium', concept: '드모르간 ($\\cap$ 형태)', requiredSkills: SKILLS_DEMORGAN,
    stem: '$(A \\cap B)^c = ?$',
    options: [
      { key: 'A', text: '$A^c \\cup B^c$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$A^c \\cap B^c$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$(A \\cup B)^c$' },
      { key: 'C', text: '$A \\cap B$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '여집합 미적용' },
      { key: 'D', text: '$A \\cup B$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 식' },
      { key: 'E', text: '$\\emptyset$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 식' },
    ],
    solution: '드모르간 법칙: $(A \\cap B)^c = A^c \\cup B^c$.' },

  // S11 (중) 존재명제 거짓
  { chapterCode: CODE, difficulty: 'medium', concept: '존재명제 진릿값', requiredSkills: SKILLS_PROP,
    stem: '명제 "어떤 실수 $x$ 에 대해 $x^2 < 0$" 의 진릿값?',
    options: [
      { key: 'A', text: '거짓', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '참', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '실수 제곱 $\\geq 0$' },
      { key: 'C', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '명확' },
      { key: 'D', text: '명제 아님', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '명제' },
      { key: 'E', text: '복소수면 참', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '실수 한정' },
    ],
    solution: '모든 실수 제곱 $\\geq 0$ → $x^2 < 0$ 인 실수 없음 → 거짓.' },

  // S12 (중) 역
  { chapterCode: CODE, difficulty: 'medium', concept: '명제의 역', requiredSkills: SKILLS_CONVERSE,
    stem: '명제 "$x = 3$ 이면 $x^2 = 9$" 의 역?',
    options: [
      { key: 'A', text: '$x^2 = 9$ 이면 $x = 3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x \\neq 3$ 이면 $x^2 \\neq 9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '이' },
      { key: 'C', text: '$x^2 \\neq 9$ 이면 $x \\neq 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '대우' },
      { key: 'D', text: '$x = 3$ 이면 $x^2 \\neq 9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 식' },
      { key: 'E', text: '$x^2 = 9$ 이면 $x \\neq 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 식' },
    ],
    solution: '역: 가정과 결론을 바꿈. $q \\to p$.' },

  // S13 (중) 이
  { chapterCode: CODE, difficulty: 'medium', concept: '명제의 이', requiredSkills: SKILLS_CONVERSE,
    stem: '같은 명제의 이?',
    options: [
      { key: 'A', text: '$x \\neq 3$ 이면 $x^2 \\neq 9$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x^2 = 9$ 이면 $x = 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '역' },
      { key: 'C', text: '$x^2 \\neq 9$ 이면 $x \\neq 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '대우' },
      { key: 'D', text: '$x = 3$ 이면 $x^2 = 9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원래 명제' },
      { key: 'E', text: '$x = -3$ 이면 $x^2 = 9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '이: $\\lnot p \\to \\lnot q$.' },

  // S14 (중) 대우
  { chapterCode: CODE, difficulty: 'medium', concept: '명제의 대우', requiredSkills: SKILLS_CONVERSE,
    stem: '같은 명제의 대우?',
    options: [
      { key: 'A', text: '$x^2 \\neq 9$ 이면 $x \\neq 3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x^2 = 9$ 이면 $x = 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '역' },
      { key: 'C', text: '$x \\neq 3$ 이면 $x^2 \\neq 9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '이' },
      { key: 'D', text: '$x = 3$ 이면 $x^2 \\neq 9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$x \\neq 3$ 이면 $x^2 = 9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '대우: $\\lnot q \\to \\lnot p$.' },

  // S15 (중) 부정
  { chapterCode: CODE, difficulty: 'medium', concept: '부등호 부정', requiredSkills: SKILLS_NEG,
    stem: '"$x \\geq 3$" 의 부정?',
    options: [
      { key: 'A', text: '$x < 3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x \\leq 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$\\geq$의 부정은 $<$' },
      { key: 'C', text: '$x \\neq 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$<$ 또는 $>$' },
      { key: 'D', text: '$x > 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$\\geq$의 일부' },
      { key: 'E', text: '$x = 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$\\geq$ 의 부정 $= <$. $x \\geq 3 \\to x < 3$.' },

  // S16 (어려움) 조건제시 → 나열
  { chapterCode: CODE, difficulty: 'hard', concept: '조건제시 → 원소 나열', requiredSkills: SKILLS_SET,
    stem: '$A = \\{x | x^2 - 5x + 6 = 0\\}$ 를 원소 나열법으로?',
    options: [
      { key: 'A', text: '$\\{2, 3\\}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\{-2, -3\\}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'C', text: '$\\{5, 6\\}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못된 인수' },
      { key: 'D', text: '$\\{1, 6\\}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
      { key: 'E', text: '$\\emptyset$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '해 있음' },
    ],
    solution: '$x^2 - 5x + 6 = (x - 2)(x - 3) = 0 \\to x = 2, 3$.' },

  // S17 (어려움) 포함-배제
  { chapterCode: CODE, difficulty: 'hard', concept: '포함-배제 원리', requiredSkills: SKILLS_CARD,
    stem: '$n(A) = 5$, $n(B) = 7$, $n(A \\cap B) = 2$. $n(A \\cup B)$?',
    options: [
      { key: 'A', text: '$10$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$12$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$A \\cap B$ 빼기 누락' },
      { key: 'C', text: '$14$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '두 번 더함' },
      { key: 'D', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$A \\cap B$' },
      { key: 'E', text: '$13$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
    ],
    solution: '$n(A \\cup B) = n(A) + n(B) - n(A \\cap B) = 5 + 7 - 2 = 10$.' },

  // S18 (어려움) 대우 진릿값
  { chapterCode: CODE, difficulty: 'hard', concept: '명제와 대우 진릿값 관계', requiredSkills: SKILLS_CONVERSE,
    stem: '명제 $p \\to q$ 가 참일 때, 그 대우 $\\lnot q \\to \\lnot p$ 의 진릿값?',
    options: [
      { key: 'A', text: '항상 참', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '항상 거짓', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '대우와 원명제는 동치' },
      { key: 'C', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '판별 가능' },
      { key: 'D', text: '경우에 따라 다름', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '동치 관계' },
      { key: 'E', text: '원 명제와 반대', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '대우와 원 명제 같음' },
    ],
    solution: '대우와 원 명제는 항상 같은 진릿값 (논리적 동치).' },

  // S19 (어려움) 필요조건
  { chapterCode: CODE, difficulty: 'hard', concept: '필요조건 판별', requiredSkills: SKILLS_SUFNEC,
    stem: '$p: x^2 = 1$, $q: x = 1$. $p$ 는 $q$ 의 무슨 조건?',
    options: [
      { key: 'A', text: '필요조건 (충분 X)', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '충분조건 (필요 X)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x = -1$도 $x^2 = 1$ → 충분 X' },
      { key: 'C', text: '필요충분조건', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '동치 아님' },
      { key: 'D', text: '관계 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '관계 있음' },
      { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '판별 가능' },
    ],
    solution: '$q \\to p$ 참 ($x=1 \\to x^2=1$). $p \\to q$ 거짓 ($x=-1$ 반례). → $p$ 는 $q$ 의 필요조건.' },

  // S20 (어려움) 특정 원소 포함 부분집합
  { chapterCode: CODE, difficulty: 'hard', concept: '$2$ 원소 포함 부분집합', requiredSkills: SKILLS_SUBSET,
    stem: '$\\{1, 2, 3, 4, 5\\}$ 의 부분집합 중 $1$ 과 $2$ 를 모두 포함하는 것의 수?',
    options: [
      { key: 'A', text: '$8$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$32$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '전체 부분집합' },
      { key: 'C', text: '$16$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$1$ 포함만' },
      { key: 'D', text: '$4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
      { key: 'E', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$1, 2$ 고정 → 나머지 $3$ 원소 $\\{3, 4, 5\\}$ 의 부분집합 수 $= 2^3 = 8$.' },
];

export const K_G10_CS2_CH02_SETS_PROP_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
