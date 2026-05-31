/**
 * K-G10-CS2-CH02-SETS-PROP (집합·명제) — 20문제 3-step Mastery.
 * 고1 — 집합 (원소·부분집합·합/교/차/여) → 드모르간 → 명제·진리집합 →
 *        부정 → 역·이·대우 → 충분/필요조건.
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 * 주요 errorCode:
 *   CONCEPT_MISUNDERSTANDING 9 / FORMULA_SELECTION_ERROR 5
 *   CONDITION_MISSING 4 / ARITHMETIC_ERROR 2
 *
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G10-CS2-CH02-SETS-PROP';
const SKILLS_SET = ['set_basics'];
const SKILLS_ELEM = ['set_element'];
const SKILLS_SUBSET = ['subset_count'];
const SKILLS_OPS = ['set_operations'];
const SKILLS_DEMORGAN = ['demorgan_laws'];
const SKILLS_PROP = ['proposition_truth'];
const SKILLS_NEG = ['negation'];
const SKILLS_CONVERSE = ['converse_inverse_contrapositive'];
const SKILLS_SUFNEC = ['sufficient_necessary'];
const SKILLS_CARD = ['inclusion_exclusion'];

const problems: KoreanProblemSeed[] = [
  // Q1
  { chapterCode: CODE, difficulty: 'easy', concept: '원소 수', requiredSkills: SKILLS_SET,
    stem: '$\\{1, 2, 3\\}$ 의 원소 수 $n(A)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$n(A)$ 의미', options: [
        { key: 'A', text: '원소의 개수', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '원소의 합', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합 아님' },
        { key: 'C', text: '원소의 곱', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곱 아님' },
        { key: 'D', text: '부분집합 수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '0', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$1, 2, 3$ 세 원소', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합' },
        { key: 'C', text: '$8$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$2^3$' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$n(A)$?', options: [
        { key: 'A', text: '$3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합' },
        { key: 'C', text: '$8$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부분집합 수' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$n(\\{1,2,3\\}) = 3$.' },

  // Q2
  { chapterCode: CODE, difficulty: 'easy', concept: '원소 판정', requiredSkills: SKILLS_ELEM,
    stem: '$2 \\in \\{1, 2, 3\\}$ 의 참/거짓?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\in$ 의 의미', options: [
        { key: 'A', text: '"속한다" (원소)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '"부분집합"', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\subset$' },
        { key: 'C', text: '"같다"', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '"공집합"', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '"여집합"', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$2$ 가 $\\{1,2,3\\}$ 의 원소인가?', options: [
        { key: 'A', text: '예 (참)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '아니오', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$2$ 있음' },
        { key: 'C', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
        { key: 'D', text: '항상 참', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '집합이 비어있어야', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '참/거짓?', options: [
        { key: 'A', text: '참', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '거짓', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$2$ 있음' },
        { key: 'C', text: '둘 다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
        { key: 'E', text: '조건부 참', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$2 \\in \\{1,2,3\\}$ → 참.' },

  // Q3
  { chapterCode: CODE, difficulty: 'easy', concept: '부분집합 수', requiredSkills: SKILLS_SUBSET,
    stem: '$A = \\{1, 2\\}$ 의 부분집합 수?',
    steps: [
      { stepType: 'CONCEPT', prompt: '공식', options: [
        { key: 'A', text: '$2^n$ ($n$ = 원소 수)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$n^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$n!$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2n$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$2^2$', options: [
        { key: 'A', text: '$4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '공집합 누락' },
        { key: 'D', text: '$8$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$2^3$' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '수?', options: [
        { key: 'A', text: '$4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '공집합 누락' },
        { key: 'C', text: '$2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$8$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$2^2 = 4$. ($\\emptyset, \\{1\\}, \\{2\\}, \\{1,2\\}$)' },

  // Q4
  { chapterCode: CODE, difficulty: 'easy', concept: '교집합', requiredSkills: SKILLS_OPS,
    stem: '$A = \\{1, 2, 3\\}$, $B = \\{2, 3, 4\\}$. $A \\cap B$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\cap$ 의미', options: [
        { key: 'A', text: '공통 원소', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '모든 원소', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합집합' },
        { key: 'C', text: '한쪽에만', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '차' },
        { key: 'D', text: '여집합', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '비어있음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\{2, 3\\}$ 양쪽에 있음', options: [
        { key: 'A', text: '$\\{2, 3\\}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\{1, 2, 3, 4\\}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합집합' },
        { key: 'C', text: '$\\{1\\}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '차집합' },
        { key: 'D', text: '$\\{4\\}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$\\emptyset$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$A \\cap B$?', options: [
        { key: 'A', text: '$\\{2, 3\\}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\{1, 2, 3, 4\\}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합집합' },
        { key: 'C', text: '$\\{1\\}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$A - B$' },
        { key: 'D', text: '$\\{4\\}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$B - A$' },
        { key: 'E', text: '$\\emptyset$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\{2, 3\\}$.' },

  // Q5
  { chapterCode: CODE, difficulty: 'easy', concept: '합집합', requiredSkills: SKILLS_OPS,
    stem: '위 $A, B$ 에 대해 $A \\cup B$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\cup$ 의미', options: [
        { key: 'A', text: '한 쪽이라도 포함되면', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '둘 다 포함', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '교집합' },
        { key: 'C', text: '없는 원소', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '여집합', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '비어있음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\{1,2,3\\} \\cup \\{2,3,4\\}$, 중복 제거', options: [
        { key: 'A', text: '$\\{1, 2, 3, 4\\}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\{2, 3\\}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '교집합' },
        { key: 'C', text: '$\\{1, 2, 2, 3, 3, 4\\}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '중복' },
        { key: 'D', text: '$\\{1\\}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$\\{4\\}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$A \\cup B$?', options: [
        { key: 'A', text: '$\\{1, 2, 3, 4\\}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\{2, 3\\}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '교집합' },
        { key: 'C', text: '$\\{1\\}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\{1, 4\\}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '대칭차' },
        { key: 'E', text: '$\\emptyset$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\{1, 2, 3, 4\\}$.' },

  // Q6
  { chapterCode: CODE, difficulty: 'easy', concept: '명제 진릿값', requiredSkills: SKILLS_PROP,
    stem: '명제 "$2$ 는 짝수" 의 진릿값?',
    steps: [
      { stepType: 'CONCEPT', prompt: '명제란?', options: [
        { key: 'A', text: '참/거짓이 명확한 문장', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '의문문', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '항상 거짓', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '변수 포함식', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '조건' },
        { key: 'E', text: '아무 문장', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$2 \\div 2 = 1$ 떨어짐', options: [
        { key: 'A', text: '참', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '거짓', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '짝수' },
        { key: 'C', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
        { key: 'D', text: '조건부 참', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '항상 거짓', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '진릿값?', options: [
        { key: 'A', text: '참', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '거짓', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
        { key: 'D', text: '명제 아님', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '조건부 참', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '참 ($2$ 가 $2$ 로 나누어 떨어지므로 짝수).' },

  // Q7
  { chapterCode: CODE, difficulty: 'medium', concept: '부분집합 수 (4원소)', requiredSkills: SKILLS_SUBSET,
    stem: '$\\{1, 2, 3, 4\\}$ 의 부분집합 수?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$2^n$', options: [
        { key: 'A', text: '$2^4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '밑·지수 바뀜' },
        { key: 'C', text: '$4!$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2 \\cdot 4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '계산', options: [
        { key: 'A', text: '$16$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$8$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$2^3$' },
        { key: 'C', text: '$24$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$4!$' },
        { key: 'D', text: '$4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$32$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$2^5$' },
      ] },
      { stepType: 'ANSWER', prompt: '수?', options: [
        { key: 'A', text: '$16$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$8$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$24$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$32$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$2^4 = 16$.' },

  // Q8
  { chapterCode: CODE, difficulty: 'medium', concept: '여집합', requiredSkills: SKILLS_OPS,
    stem: '$U = \\{1, 2, 3, 4, 5\\}$, $A = \\{1, 2, 3\\}$. $A^c$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '여집합 의미', options: [
        { key: 'A', text: '$U$ 안에서 $A$ 에 속하지 않는 원소', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$A$ 의 원소', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$A$ 의 부분집합', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\emptyset$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$U$ 전체', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$U - A$', options: [
        { key: 'A', text: '$\\{4, 5\\}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\{1, 2, 3\\}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$A$ 자체' },
        { key: 'C', text: '$\\{1, 2, 3, 4, 5\\}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$U$' },
        { key: 'D', text: '$\\emptyset$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$\\{4\\}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$A^c$?', options: [
        { key: 'A', text: '$\\{4, 5\\}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\{1, 2, 3\\}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$\\{1, 2, 3, 4, 5\\}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$\\emptyset$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$\\{0, 6\\}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$U$ 외부' },
      ] },
    ], solution: '$A^c = \\{4, 5\\}$.' },

  // Q9
  { chapterCode: CODE, difficulty: 'medium', concept: '차집합', requiredSkills: SKILLS_OPS,
    stem: '$A = \\{1, 2, 3\\}$, $B = \\{2, 3, 4\\}$. $A - B$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$A - B$ 의미', options: [
        { key: 'A', text: '$A$ 에서 $B$ 의 원소 제거', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$B$ 에서 $A$ 제거', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '바뀜' },
        { key: 'C', text: '교집합', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '합집합', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '여집합', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\{1, 2, 3\\}$ 에서 $2, 3$ 제거', options: [
        { key: 'A', text: '$\\{1\\}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\{4\\}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$B - A$' },
        { key: 'C', text: '$\\{2, 3\\}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '교집합' },
        { key: 'D', text: '$\\{1, 4\\}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '대칭차' },
        { key: 'E', text: '$\\emptyset$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$A - B$?', options: [
        { key: 'A', text: '$\\{1\\}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\{4\\}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$B-A$' },
        { key: 'C', text: '$\\{2, 3\\}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '교집합' },
        { key: 'D', text: '$\\{1, 4\\}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '대칭차' },
        { key: 'E', text: '$\\emptyset$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$A - B = \\{1\\}$.' },

  // Q10
  { chapterCode: CODE, difficulty: 'medium', concept: '드모르간', requiredSkills: SKILLS_DEMORGAN,
    stem: '$(A \\cup B)^c = ?$',
    steps: [
      { stepType: 'CONCEPT', prompt: '드모르간 법칙', options: [
        { key: 'A', text: '$A^c \\cap B^c$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$A^c \\cup B^c$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\cup$ 보존' },
        { key: 'C', text: '$A \\cap B$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '여집합 누락' },
        { key: 'D', text: '$A \\cup B$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(A \\cap B)^c$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$(\\cdot)^c$ 분배 + $\\cup \\to \\cap$', options: [
        { key: 'A', text: '$A^c \\cap B^c$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$A^c \\cup B^c$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\cup$ 보존' },
        { key: 'C', text: '$A^c \\cup B$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$A \\cap B$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$U$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$A^c \\cap B^c$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$A^c \\cup B^c$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\cup$ 유지' },
        { key: 'C', text: '$A \\cap B$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$A \\cup B$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$U$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '드모르간: $(A \\cup B)^c = A^c \\cap B^c$.' },

  // Q11
  { chapterCode: CODE, difficulty: 'medium', concept: '전체명제', requiredSkills: SKILLS_PROP,
    stem: '명제 "모든 실수 $x$ 에 대해 $x^2 \\geq 0$" 의 진릿값?',
    steps: [
      { stepType: 'CONCEPT', prompt: '"모든" → 반례 없는지', options: [
        { key: 'A', text: '반례 없으면 참', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '한 예 있으면 참', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '"어떤"' },
        { key: 'C', text: '항상 거짓', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
        { key: 'E', text: '명제 아님', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '명제임' },
      ] },
      { stepType: 'PROCESS', prompt: '음수 제곱도 양수 → 반례 없음', options: [
        { key: 'A', text: '참', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '거짓 ($x < 0$ 시 $x^2 < 0$)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '음수 제곱 양수' },
        { key: 'C', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
        { key: 'D', text: '조건부 참', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$x = 0$ 만 참', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\geq$ 부등호' },
      ] },
      { stepType: 'ANSWER', prompt: '진릿값?', options: [
        { key: 'A', text: '참', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '거짓', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
        { key: 'D', text: '조건부 참', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '명제 아님', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '음수의 제곱도 양수이므로 반례 없음 → 참.' },

  // Q12
  { chapterCode: CODE, difficulty: 'medium', concept: '대우', requiredSkills: SKILLS_CONVERSE,
    stem: '명제 "$x = 2$ 이면 $x^2 = 4$" 의 대우?',
    steps: [
      { stepType: 'CONCEPT', prompt: '대우 형태', options: [
        { key: 'A', text: '$\\neg q \\to \\neg p$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$q \\to p$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '역' },
        { key: 'C', text: '$\\neg p \\to \\neg q$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '이' },
        { key: 'D', text: '$p \\to q$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원명제' },
        { key: 'E', text: '$p \\land q$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '부정 + 뒤집기', options: [
        { key: 'A', text: '"$x^2 \\neq 4$ 이면 $x \\neq 2$"', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '"$x^2 = 4$ 이면 $x = 2$"', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '역' },
        { key: 'C', text: '"$x \\neq 2$ 이면 $x^2 \\neq 4$"', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '이' },
        { key: 'D', text: '"$x = 2$ 이면 $x^2 = 4$"', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원명제' },
        { key: 'E', text: '"$x = 2$ 이고 $x^2 = 4$"', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '대우?', options: [
        { key: 'A', text: '"$x^2 \\neq 4$ 이면 $x \\neq 2$"', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '"$x^2 = 4$ 이면 $x = 2$"', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '역' },
        { key: 'C', text: '"$x \\neq 2$ 이면 $x^2 \\neq 4$"', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '이' },
        { key: 'D', text: '"$x = 2$ 이면 $x^2 = 4$"', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원명제' },
        { key: 'E', text: '"$x = 2$ 또는 $x^2 = 4$"', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '대우 = "$x^2 \\neq 4$ 이면 $x \\neq 2$".' },

  // Q13
  { chapterCode: CODE, difficulty: 'medium', concept: '역', requiredSkills: SKILLS_CONVERSE,
    stem: '같은 명제의 역?',
    steps: [
      { stepType: 'CONCEPT', prompt: '역 형태', options: [
        { key: 'A', text: '$q \\to p$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\neg q \\to \\neg p$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '대우' },
        { key: 'C', text: '$\\neg p \\to \\neg q$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '이' },
        { key: 'D', text: '$p \\to q$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원명제' },
        { key: 'E', text: '$p \\land q$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$p, q$ 뒤바꿈', options: [
        { key: 'A', text: '"$x^2 = 4$ 이면 $x = 2$"', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '"$x^2 \\neq 4$ 이면 $x \\neq 2$"', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '대우' },
        { key: 'C', text: '"$x \\neq 2$ 이면 $x^2 \\neq 4$"', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '이' },
        { key: 'D', text: '"$x = 2$ 이면 $x^2 = 4$"', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원명제' },
        { key: 'E', text: '"$x^2 = 4$ 또는 $x = 2$"', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '역?', options: [
        { key: 'A', text: '"$x^2 = 4$ 이면 $x = 2$"', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '"$x^2 \\neq 4$ 이면 $x \\neq 2$"', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '대우' },
        { key: 'C', text: '"$x \\neq 2$ 이면 $x^2 \\neq 4$"', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '이' },
        { key: 'D', text: '"$x = 2$ 이면 $x^2 = 4$"', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원명제' },
        { key: 'E', text: '"$x = -2$ 이면 $x^2 = 4$"', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '역 = "$x^2 = 4$ 이면 $x = 2$".' },

  // Q14
  { chapterCode: CODE, difficulty: 'medium', concept: '대우 동치', requiredSkills: SKILLS_CONVERSE,
    stem: '$p \\to q$ 와 그 대우의 진릿값 관계?',
    steps: [
      { stepType: 'CONCEPT', prompt: '명제와 대우', options: [
        { key: 'A', text: '항상 진릿값 같음 (동치)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '항상 반대', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '무관', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '항상 둘 다 참', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '항상 둘 다 거짓', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '동치 → 한 쪽만 증명해도 됨', options: [
        { key: 'A', text: '대우 증명법 (귀류법의 친척)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '역만 증명', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '이만 증명', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '아무것도 안 됨', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '항상 가정 필요', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '관계?', options: [
        { key: 'A', text: '동치 (진릿값 같음)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '반대', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '무관', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '둘 다 참', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '둘 다 거짓', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '명제와 대우는 항상 진릿값이 같다 (동치).' },

  // Q15
  { chapterCode: CODE, difficulty: 'medium', concept: '부정', requiredSkills: SKILLS_NEG,
    stem: '"$x > 0$" 의 부정?',
    steps: [
      { stepType: 'CONCEPT', prompt: '부등호 부정', options: [
        { key: 'A', text: '$\\neg (x > 0) \\Leftrightarrow x \\leq 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x < 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$x = 0$ 누락' },
        { key: 'C', text: '$x \\geq 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'D', text: '$x = 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'E', text: '$x \\neq 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$x > 0$ 의 여집합', options: [
        { key: 'A', text: '$x \\leq 0$ (등호 포함)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x < 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$x=0$ 처리' },
        { key: 'C', text: '$x > 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '원조건' },
        { key: 'D', text: '$x = 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'E', text: '$x \\neq 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '부정?', options: [
        { key: 'A', text: '$x \\leq 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x < 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$x = 0$ 누락' },
        { key: 'C', text: '$x \\geq 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'D', text: '$x = 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'E', text: '$x \\neq 0$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\neg(x > 0) \\Leftrightarrow x \\leq 0$ (등호 포함).' },

  // Q16 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '조건제시 → 원소 나열', requiredSkills: SKILLS_SET,
    stem: '$A = \\{x | x^2 - 3x + 2 = 0\\}$ 를 원소 나열법으로?',
    steps: [
      { stepType: 'CONCEPT', prompt: '조건의 해 구하기', options: [
        { key: 'A', text: '$x^2 - 3x + 2 = 0$ 의 해', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^2 = 3x - 2$ 해', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '같지만 잘못' },
        { key: 'C', text: '$x^2 + 3x + 2 = 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'D', text: '$\\emptyset$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '실해 있음' },
        { key: 'E', text: '$\\mathbb{R}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$(x-1)(x-2) = 0$', options: [
        { key: 'A', text: '$x = 1, 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = -1, -2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$x = 1, -2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 섞임' },
        { key: 'D', text: '$x = 3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '해 없음', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$A$?', options: [
        { key: 'A', text: '$\\{1, 2\\}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\{-1, -2\\}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$\\{1, -2\\}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\{3\\}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\emptyset$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(x-1)(x-2) = 0 \\Rightarrow A = \\{1, 2\\}$.' },

  // Q17 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '포함-배제', requiredSkills: SKILLS_CARD,
    stem: '$n(A) = 3$, $n(B) = 4$, $n(A \\cap B) = 1$. $n(A \\cup B)$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '포함-배제 원리', options: [
        { key: 'A', text: '$n(A) + n(B) - n(A \\cap B)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$n(A) + n(B)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '중복 안 빼' },
        { key: 'C', text: '$n(A) - n(B)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$n(A) \\cdot n(B)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$n(A \\cap B)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$3 + 4 - 1$', options: [
        { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$7$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '중복 안 뺌' },
        { key: 'C', text: '$8$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$12$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱' },
      ] },
      { stepType: 'ANSWER', prompt: '$n(A \\cup B)$?', options: [
        { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$7$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '중복 안 뺌' },
        { key: 'C', text: '$8$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '교집합 만' },
      ] },
    ], solution: '$n(A \\cup B) = 3 + 4 - 1 = 6$.' },

  // Q18 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '역·이·대우 진릿값', requiredSkills: SKILLS_CONVERSE,
    stem: '"$x = 2$ 이면 $x^2 = 4$" 의 역, 이, 대우 중 참인 것?',
    steps: [
      { stepType: 'CONCEPT', prompt: '원명제 참 가정 → 어떤 형식이 참?', options: [
        { key: 'A', text: '대우만 보장 참, 역/이는 불확실', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '모두 참', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '역·이는 별개' },
        { key: 'C', text: '모두 거짓', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '역만 참', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '이만 참', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '역 "$x^2 = 4 \\to x = 2$" 의 진릿값', options: [
        { key: 'A', text: '거짓 ($x = -2$ 반례)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '참', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '반례 있음' },
        { key: 'C', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
        { key: 'D', text: '명제 아님', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$x = 2$ 만', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '참인 것?', options: [
        { key: 'A', text: '대우만 (원명제와 함께)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '역만', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '반례 $-2$' },
        { key: 'C', text: '이만', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '모두', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '대우는 원명제와 동치이므로 참. 역·이는 $x = -2$ 반례로 거짓.' },

  // Q19 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '충분/필요조건', requiredSkills: SKILLS_SUFNEC,
    stem: '$p: x > 2$, $q: x > 1$. $p$ 는 $q$ 의 무슨 조건?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$p \\to q$ 인가? $q \\to p$ 인가?', options: [
        { key: 'A', text: '$p \\to q$ 참 (충분), $q \\to p$ 거짓 ($x = 1.5$ 반례) → 필요조건 아님', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '둘 다 참', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$1.5$ 반례' },
        { key: 'C', text: '둘 다 거짓', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$p \\to q$ 참' },
        { key: 'D', text: '$q \\to p$ 만 참', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '반대' },
        { key: 'E', text: '관계 없음', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '용어', options: [
        { key: 'A', text: '$p$ 는 $q$ 의 충분조건 (필요조건 X)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '필요조건', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '바뀜' },
        { key: 'C', text: '필요충분', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '한쪽만 참' },
        { key: 'D', text: '관계 없음', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'E', text: '둘 다 아님', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$p$ 의 종류?', options: [
        { key: 'A', text: '충분조건', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '필요조건', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$q \\to p$ 거짓' },
        { key: 'C', text: '필요충분조건', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '쌍방 아님' },
        { key: 'D', text: '관계 없음', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'E', text: '둘 다 아님', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
    ], solution: '$x > 2 \\to x > 1$ 참. 역 거짓 ($1.5$). 따라서 $p$ 는 $q$ 의 충분조건.' },

  // Q20 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '특정 원소 포함 부분집합', requiredSkills: SKILLS_SUBSET,
    stem: '$\\{1, 2, 3, 4, 5\\}$ 의 부분집합 중 $1$ 을 포함하는 것의 수?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$1$ 고정, 나머지 자유', options: [
        { key: 'A', text: '나머지 $4$ 원소의 부분집합과 일대일 대응', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '전체 $2^5 = 32$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$1$ 제약 무시' },
        { key: 'C', text: '$5! = 120$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$2^4$', options: [
        { key: 'A', text: '$16$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$32$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '전체' },
        { key: 'C', text: '$8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2^3$' },
        { key: 'D', text: '$24$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '수?', options: [
        { key: 'A', text: '$16$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$32$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '전체' },
        { key: 'C', text: '$8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$24$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
    ], solution: '$1$ 은 고정, 나머지 $\\{2,3,4,5\\}$ 의 부분집합 $2^4 = 16$.' },
];

export const K_G10_CS2_CH02_SETS_PROP_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
