/**
 * K-G8-MATH2-CH03-LINEAR-INEQ — STUDY pool (single-step, 20문제).
 * 일차부등식 · 연립일차방정식.
 * Mastery 3-step과 별도 변형 문제. 중2 (G8).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5. LLM 미사용.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G8-MATH2-CH03-LINEAR-INEQ';
const SKILLS_INEQ_BASIC = ['inequality_transposition', 'positive_coefficient_divide'];
const SKILLS_INEQ_SIGN = ['negative_coefficient_flip', 'inequality_sign_reverse'];
const SKILLS_INEQ_FRAC = ['fraction_inequality', 'common_denominator'];
const SKILLS_SYS_BASIC = ['system_substitution', 'system_elimination'];
const SKILLS_SYS_HARD = ['system_multiply_both', 'no_solution_infinite'];
const SKILLS_WORD = ['inequality_word_problem', 'system_word_problem'];
const SKILLS_CONCEPT = ['inequality_definition', 'solution_set_notation'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) 부등식 이항 (뺄셈)
  { chapterCode: CODE, difficulty: 'easy', concept: '부등식 이항 (뺄셈 → 덧셈)', requiredSkills: SKILLS_INEQ_BASIC,
    stem: '부등식 $x - 2 > 5$ 의 해는?',
    options: [
      { key: 'A', text: '$x > 7$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x > 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$5 - 2$ 잘못된 이항' },
      { key: 'C', text: '$x < 7$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부등호 방향 잘못' },
      { key: 'D', text: '$x \\geq 7$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$>$ vs $\\geq$ 혼동' },
      { key: 'E', text: '$x > 10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$5 \\times 2$ 곱셈' },
    ],
    solution: '$-2$ 이항 → 우변에 $+2$: $x > 5 + 2 = 7$.' },

  // S2 (쉬움) 양수 나눗셈
  { chapterCode: CODE, difficulty: 'easy', concept: '부등식 양수 나눗셈', requiredSkills: SKILLS_INEQ_BASIC,
    stem: '$3x \\leq 9$ 의 해는?',
    options: [
      { key: 'A', text: '$x \\leq 3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x \\geq 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부등호 방향 잘못 (양수 나눗셈은 방향 유지)' },
      { key: 'C', text: '$x \\leq 27$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$3 \\times 9$ 곱셈' },
      { key: 'D', text: '$x \\leq 6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$9 - 3$' },
      { key: 'E', text: '$x < 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\leq$ vs $<$ 혼동' },
    ],
    solution: '양변을 $3$ (양수) 으로 나눔. 부등호 유지 → $x \\leq 3$.' },

  // S3 (쉬움) 이항 (덧셈 → 뺄셈)
  { chapterCode: CODE, difficulty: 'easy', concept: '부등식 이항 (덧셈 → 뺄셈)', requiredSkills: SKILLS_INEQ_BASIC,
    stem: '$x + 4 \\geq 10$ 의 해는?',
    options: [
      { key: 'A', text: '$x \\geq 6$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x \\geq 14$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$+4$를 우변에 $+4$로 그대로' },
      { key: 'C', text: '$x \\leq 6$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부등호 방향 잘못' },
      { key: 'D', text: '$x > 6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\geq$ vs $>$ 혼동' },
      { key: 'E', text: '$x \\geq 4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$10 - 6$ 잘못' },
    ],
    solution: '$+4$ 이항 → 우변에 $-4$: $x \\geq 10 - 4 = 6$.' },

  // S4 (쉬움) 음수 곱
  { chapterCode: CODE, difficulty: 'easy', concept: '음수 곱 → 부등호 뒤집기', requiredSkills: SKILLS_INEQ_SIGN,
    stem: '$-x > 4$ 의 해는?',
    options: [
      { key: 'A', text: '$x < -4$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x > -4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '음수 곱(나눗셈) 시 부등호 뒤집기 누락' },
      { key: 'C', text: '$x > 4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호도 누락' },
      { key: 'D', text: '$x < 4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 누락 (방향만 뒤집음)' },
      { key: 'E', text: '$x = -4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '등호로 잘못' },
    ],
    solution: '양변에 $-1$ 곱. 음수 곱 → 부등호 뒤집기: $x < -4$.' },

  // S5 (쉬움) 음수 나눗셈
  { chapterCode: CODE, difficulty: 'easy', concept: '음수 나눗셈 → 부등호 뒤집기', requiredSkills: SKILLS_INEQ_SIGN,
    stem: '$-3x \\leq 9$ 의 해는?',
    options: [
      { key: 'A', text: '$x \\geq -3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x \\leq -3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '음수 나눗셈 시 부등호 뒤집기 누락' },
      { key: 'C', text: '$x \\geq 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$9/3$의 부호 누락' },
      { key: 'D', text: '$x \\leq 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부등호 방향만 보존' },
      { key: 'E', text: '$x > -3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\geq$ vs $>$ 혼동' },
    ],
    solution: '양변을 $-3$으로 나눔 → 부등호 뒤집기: $x \\geq 9/(-3) = -3$.' },

  // S6 (쉬움) 부등식 정의
  { chapterCode: CODE, difficulty: 'easy', concept: '부등호 의미 ($>$)', requiredSkills: SKILLS_CONCEPT,
    stem: '$a > b$ 는 무엇을 의미하는가?',
    options: [
      { key: 'A', text: '$a$ 가 $b$ 보다 크다', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$a$ 가 $b$ 보다 작다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$<$ 의미' },
      { key: 'C', text: '$a$ 와 $b$ 가 같다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$=$ 의미' },
      { key: 'D', text: '$a$ 는 $b$ 의 배수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '관련 없는 관계' },
      { key: 'E', text: '$a$ 가 $b$ 보다 크거나 같다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\geq$ 의미' },
    ],
    solution: '$>$ 는 "크다", $<$ 는 "작다", $\\geq$ 는 "크거나 같다".' },

  // S7 (중) 두 단계 부등식
  { chapterCode: CODE, difficulty: 'medium', concept: '두 단계 부등식 풀이', requiredSkills: SKILLS_INEQ_BASIC,
    stem: '$4x + 1 < 13$ 의 해는?',
    options: [
      { key: 'A', text: '$x < 3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x > 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부등호 잘못 (양수 나눗셈은 유지)' },
      { key: 'C', text: '$x < 12$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '계수 $4$ 나눗셈 누락' },
      { key: 'D', text: '$x < 3.5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$14/4$ 잘못된 분자' },
      { key: 'E', text: '$x \\leq 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$<$ vs $\\leq$ 혼동' },
    ],
    solution: '$4x < 13 - 1 = 12 \\to x < 3$.' },

  // S8 (중) 문자 양변
  { chapterCode: CODE, difficulty: 'medium', concept: '문자 양변 부등식', requiredSkills: SKILLS_INEQ_BASIC,
    stem: '$3x - 1 \\geq x + 5$ 의 해는?',
    options: [
      { key: 'A', text: '$x \\geq 3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x \\leq 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$2x \\geq 6$인데 부등호 잘못' },
      { key: 'C', text: '$x \\geq 6$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '계수 $2$ 나눗셈 누락' },
      { key: 'D', text: '$x \\geq 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$4/2$ 잘못된 식' },
      { key: 'E', text: '$x > 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\geq$ vs $>$' },
    ],
    solution: '$3x - x \\geq 5 + 1 \\to 2x \\geq 6 \\to x \\geq 3$.' },

  // S9 (중) 분수 부등식
  { chapterCode: CODE, difficulty: 'medium', concept: '분자 일차식 부등식', requiredSkills: SKILLS_INEQ_FRAC,
    stem: '$\\dfrac{x - 1}{2} \\geq 3$ 의 해는?',
    options: [
      { key: 'A', text: '$x \\geq 7$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x \\geq 5$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '분모 곱 후 $-1$ 이항 누락' },
      { key: 'C', text: '$x \\geq 4$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '분모 무시 ($x - 1 \\geq 3$)' },
      { key: 'D', text: '$x \\geq 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$3/2 \\geq x$ 같이 잘못' },
      { key: 'E', text: '$x \\leq 7$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부등호 잘못' },
    ],
    solution: '양변 $\\times 2$: $x - 1 \\geq 6 \\to x \\geq 7$.' },

  // S10 (중) 소수 부등식
  { chapterCode: CODE, difficulty: 'medium', concept: '소수 부등식', requiredSkills: SKILLS_INEQ_BASIC,
    stem: '$0.4x - 0.2 \\leq 1$ 의 해는?',
    options: [
      { key: 'A', text: '$x \\leq 3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x \\leq 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 양수 곱' },
      { key: 'C', text: '$x \\geq 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부등호 잘못' },
      { key: 'D', text: '$x \\leq 0.8$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$0.4x \\leq 1.2$ 그대로 나눔' },
      { key: 'E', text: '$x \\leq 2.5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$1/0.4$ 잘못된 나눗셈' },
    ],
    solution: '양변 $\\times 10$: $4x - 2 \\leq 10 \\to 4x \\leq 12 \\to x \\leq 3$.' },

  // S11 (중) 연립 가감법 1
  { chapterCode: CODE, difficulty: 'medium', concept: '연립 가감법', requiredSkills: SKILLS_SYS_BASIC,
    stem: '$\\begin{cases} x + y = 8 \\\\ x - y = 2 \\end{cases}$ 의 해는?',
    options: [
      { key: 'A', text: '$x = 5,\\ y = 3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = 3,\\ y = 5$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$x, y$ 바꿈' },
      { key: 'C', text: '$x = 6,\\ y = 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2x = 10$인데 $12$로 잘못' },
      { key: 'D', text: '$x = 4,\\ y = 4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$x - y$ 미적용' },
      { key: 'E', text: '$x = 10,\\ y = 0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '두 식 합 그대로' },
    ],
    solution: '두 식을 더해: $2x = 10 \\to x = 5$. $y = 8 - 5 = 3$.' },

  // S12 (중) 연립 대입법
  { chapterCode: CODE, difficulty: 'medium', concept: '연립 대입법', requiredSkills: SKILLS_SYS_BASIC,
    stem: '$\\begin{cases} y = x - 1 \\\\ 2x + y = 8 \\end{cases}$ 의 해는?',
    options: [
      { key: 'A', text: '$x = 3,\\ y = 2$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = 2,\\ y = 1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3x - 1 = 8 \\to x = 3$인데 잘못' },
      { key: 'C', text: '$x = 1,\\ y = 0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 대입' },
      { key: 'D', text: '$x = 3,\\ y = 4$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '첫 식 대입 안 함' },
      { key: 'E', text: '$x = 5,\\ y = 4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
    ],
    solution: '$2x + (x - 1) = 8 \\to 3x = 9 \\to x = 3$. $y = 3 - 1 = 2$.' },

  // S13 (중) 연립 가감법 2
  { chapterCode: CODE, difficulty: 'medium', concept: '연립 가감법 (계수 조정)', requiredSkills: SKILLS_SYS_BASIC,
    stem: '$\\begin{cases} 3x + y = 11 \\\\ x + 2y = 12 \\end{cases}$ 의 해는?',
    options: [
      { key: 'A', text: '$x = 2,\\ y = 5$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = 5,\\ y = 2$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$x, y$ 바꿈' },
      { key: 'C', text: '$x = 3,\\ y = 4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 계수 조정' },
      { key: 'D', text: '$x = 1,\\ y = 8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3x + y = 11$ 미만족' },
      { key: 'E', text: '$x = 4,\\ y = 4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 풀이' },
    ],
    solution: '첫 식 $\\times 2$: $6x + 2y = 22$. 둘째 빼기: $5x = 10 \\to x = 2$. $y = 11 - 6 = 5$.' },

  // S14 (중) 연립 가감법 3
  { chapterCode: CODE, difficulty: 'medium', concept: '연립 가감법 (다른 계수)', requiredSkills: SKILLS_SYS_BASIC,
    stem: '$\\begin{cases} 2x - 3y = 1 \\\\ 5x + 2y = 12 \\end{cases}$ 의 해는?',
    options: [
      { key: 'A', text: '$x = 2,\\ y = 1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = 1,\\ y = 2$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$x, y$ 바꿈' },
      { key: 'C', text: '$x = 3,\\ y = -1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$y$ 부호 잘못' },
      { key: 'D', text: '$x = 0,\\ y = -1/3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 가감' },
      { key: 'E', text: '$x = 2,\\ y = -1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$y$ 부호 잘못' },
    ],
    solution: '첫 식 $\\times 2$, 둘째 $\\times 3$ → 더해: $19x = 38 \\to x = 2$. $4 - 3y = 1 \\to y = 1$.' },

  // S15 (중) 단어 — 부등식
  { chapterCode: CODE, difficulty: 'medium', concept: '부등식 단어문제 (개수 상한)', requiredSkills: SKILLS_WORD,
    stem: '책 $1$ 권 $5000$ 원, 노트 $1$ 권 $1000$ 원이다. 책 $1$ 권과 노트 $x$ 권을 사서 $15000$ 원 이하로 결제하려면 $x$ 의 최댓값은?',
    options: [
      { key: 'A', text: '$10$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$15$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$5000$ 누락 ($15000/1000$)' },
      { key: 'C', text: '$9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$<$로 잘못 (이하 → $\\leq$)' },
      { key: 'D', text: '$11$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 나눗셈' },
      { key: 'E', text: '$20$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
    ],
    solution: '$5000 + 1000x \\leq 15000 \\to 1000x \\leq 10000 \\to x \\leq 10$. 최댓값 $= 10$.' },

  // S16 (어려움) 음수 괄호 부등식
  { chapterCode: CODE, difficulty: 'hard', concept: '음수 괄호 분배 + 부등호', requiredSkills: SKILLS_INEQ_SIGN,
    stem: '$-2(x + 3) < 10$ 의 해는?',
    options: [
      { key: 'A', text: '$x > -8$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x < -8$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '음수 나눗셈 시 부등호 안 뒤집음' },
      { key: 'C', text: '$x > -2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$-2x < 16$인데 잘못된 차' },
      { key: 'D', text: '$x > -5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 분배' },
      { key: 'E', text: '$x < -2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '두 번 잘못' },
    ],
    solution: '$-2x - 6 < 10 \\to -2x < 16 \\to x > -8$ (음수 나눗셈으로 부등호 뒤집기).' },

  // S17 (어려움) 연립 양변 곱
  { chapterCode: CODE, difficulty: 'hard', concept: '연립 가감법 (양변 곱)', requiredSkills: SKILLS_SYS_HARD,
    stem: '$\\begin{cases} 3x + 4y = 18 \\\\ 2x - y = 1 \\end{cases}$ 의 해는?',
    options: [
      { key: 'A', text: '$x = 2,\\ y = 3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = 3,\\ y = 2$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '$x, y$ 바꿈' },
      { key: 'C', text: '$x = 1,\\ y = 1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 가감' },
      { key: 'D', text: '$x = 4,\\ y = 7$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '둘째 식 미만족' },
      { key: 'E', text: '$x = 2,\\ y = -3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
    ],
    solution: '대입법: $y = 2x - 1$. $3x + 4(2x - 1) = 18 \\to 11x = 22 \\to x = 2$. $y = 4 - 1 = 3$.' },

  // S18 (어려움) 무수히 많은 해
  { chapterCode: CODE, difficulty: 'hard', concept: '연립 — 무수히 많은 해 (같은 직선)', requiredSkills: SKILLS_SYS_HARD,
    stem: '$\\begin{cases} y = x + 2 \\\\ 2y = 2x + 4 \\end{cases}$ 의 해는?',
    options: [
      { key: 'A', text: '해가 무수히 많다', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '해가 없다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '같은 식 (평행이 아닌 일치)' },
      { key: 'C', text: '$x = 0,\\ y = 2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '한 해만 답함 (모든 해)' },
      { key: 'D', text: '$x = 2,\\ y = 4$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '한 해만 답함' },
      { key: 'E', text: '$x = 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x$ 한 값만' },
    ],
    solution: '둘째 식 $2y = 2x + 4 \\to y = x + 2$. 첫 식과 같음 → 일치 → 무수히 많은 해.' },

  // S19 (어려움) 분수 부등식 (양변 통분)
  { chapterCode: CODE, difficulty: 'hard', concept: '양변 분수 부등식 (통분)', requiredSkills: SKILLS_INEQ_FRAC,
    stem: '$\\dfrac{x + 1}{3} > \\dfrac{x - 1}{2}$ 의 해는?',
    options: [
      { key: 'A', text: '$x < 5$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x > 5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부등호 잘못 (음수 계수 발생)' },
      { key: 'C', text: '$x < 1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 통분' },
      { key: 'D', text: '$x > 1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
      { key: 'E', text: '$x \\leq 5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$<$ vs $\\leq$' },
    ],
    solution: '양변 $\\times 6$: $2(x+1) > 3(x-1) \\to 2x + 2 > 3x - 3 \\to -x > -5 \\to x < 5$.' },

  // S20 (어려움) 도형 부등식
  { chapterCode: CODE, difficulty: 'hard', concept: '도형 부등식 (직사각형 넓이)', requiredSkills: SKILLS_WORD,
    stem: '가로 $4$ cm, 세로 $x$ cm 인 직사각형의 넓이가 $16$ cm² 이상 $32$ cm² 이하이다. $x$ 의 범위는?',
    options: [
      { key: 'A', text: '$4 \\leq x \\leq 8$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x \\geq 4$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '상한 누락' },
      { key: 'C', text: '$x \\leq 8$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '하한 누락' },
      { key: 'D', text: '$16 \\leq x \\leq 32$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '넓이 값 자체' },
      { key: 'E', text: '$4 < x < 8$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '"이상/이하"는 $\\leq$' },
    ],
    solution: '넓이 $= 4x$. $16 \\leq 4x \\leq 32 \\to 4 \\leq x \\leq 8$ cm.' },
];

export const K_G8_MATH2_CH03_LINEAR_INEQ_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
