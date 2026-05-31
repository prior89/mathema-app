/**
 * K-G8-MATH2-CH03-LINEAR-INEQ (일차부등식 + 연립일차방정식) — 20문제 3-step Mastery.
 * 중2 — 부등식의 성질 → 음수 곱·나누기 뒤집힘 → 분수/소수 부등식 →
 *        연립방정식 (가감법·대입법) → 단어문제 → 평행 케이스.
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 * 주요 errorCode 분배:
 *   SIGN_ERROR 6 (Q4,5,8,16) / ALGEBRA_ERROR 5 (Q1,2,7,14,19)
 *   ARITHMETIC_ERROR 3 (Q3,9,10) / CONDITION_MISSING 2 (Q15,20)
 *   CONCEPT_MISUNDERSTANDING 2 (Q6,18) / FORMULA_SELECTION_ERROR 2 (Q11,12)
 *
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G8-MATH2-CH03-LINEAR-INEQ';
const SKILLS_INEQ_BASIC = ['inequality_transposition', 'inequality_solving'];
const SKILLS_INEQ_SIGN = ['inequality_sign_flip', 'negative_multiplication'];
const SKILLS_INEQ_FRAC = ['inequality_fraction', 'common_denominator'];
const SKILLS_SYS_BASIC = ['system_of_equations', 'elimination_method', 'substitution_method'];
const SKILLS_SYS_HARD = ['system_elimination', 'system_substitution'];
const SKILLS_WORD = ['word_to_inequality', 'condition_check'];

const problems: KoreanProblemSeed[] = [
  // Q1
  { chapterCode: CODE, difficulty: 'easy', concept: '부등식 이항 (덧셈)', requiredSkills: SKILLS_INEQ_BASIC,
    stem: '부등식 $x + 3 > 7$ 의 해는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '부등식의 성질 (양변에 같은 수)?', options: [
        { key: 'A', text: '양변에 같은 수를 더하거나 빼도 부등식 유지', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '양변에 같은 수를 더하면 부등호 뒤집힘', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '덧셈은 뒤집기 없음' },
        { key: 'C', text: '한쪽에만 빼도 됨', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '균형 깨짐' },
        { key: 'D', text: '$x$ 와 상수를 자유롭게 이동', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '이항 부호 변환 필요' },
        { key: 'E', text: '부등식은 풀 수 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '풀이 가능' },
      ] },
      { stepType: 'PROCESS', prompt: '양변에서 $3$ 을 빼면?', options: [
        { key: 'A', text: '$x > 7 - 3 = 4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x > 7 + 3 = 10$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '이항 부호 잘못' },
        { key: 'C', text: '$x \\geq 4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '부등호 종류 변경' },
        { key: 'D', text: '$x < 4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부등호 뒤집힘 잘못' },
        { key: 'E', text: '$x = 4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '등식으로 오해' },
      ] },
      { stepType: 'ANSWER', prompt: '해는?', options: [
        { key: 'A', text: '$x > 4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x > 10$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '이항 부호' },
        { key: 'C', text: '$x < 4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부등호 뒤집힘' },
        { key: 'D', text: '$x \\geq 4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '부등호 종류' },
        { key: 'E', text: '$x = 4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '등식' },
      ] },
    ], solution: '$x + 3 > 7 \\Rightarrow x > 4$.' },

  // Q2
  { chapterCode: CODE, difficulty: 'easy', concept: '부등식 나눗셈 (양수)', requiredSkills: SKILLS_INEQ_BASIC,
    stem: '$2x \\leq 10$ 의 해는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '양수 나눗셈은 부등호?', options: [
        { key: 'A', text: '그대로 유지', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '뒤집힘', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '음수 곱·나누기일 때만' },
        { key: 'C', text: '$\\leq$ 가 $<$ 로', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\leq$ 가 $=$ 로', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '등식 변환' },
        { key: 'E', text: '풀 수 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '풀이 가능' },
      ] },
      { stepType: 'PROCESS', prompt: '양변을 $2$ 로 나누면?', options: [
        { key: 'A', text: '$x \\leq 5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x \\geq 5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '양수 나누기에 뒤집힘 잘못' },
        { key: 'C', text: '$x = 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '등식' },
        { key: 'D', text: '$x \\leq 8$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '계산 잘못' },
        { key: 'E', text: '$x \\leq 12$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '곱셈으로' },
      ] },
      { stepType: 'ANSWER', prompt: '해는?', options: [
        { key: 'A', text: '$x \\leq 5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x \\geq 5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '뒤집힘 잘못' },
        { key: 'C', text: '$x \\leq 12$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '곱' },
        { key: 'D', text: '$x = 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '등식' },
        { key: 'E', text: '$x < 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '부등호 종류' },
      ] },
    ], solution: '$2x \\leq 10 \\Rightarrow x \\leq 5$ (양수 나누기, 부등호 유지).' },

  // Q3
  { chapterCode: CODE, difficulty: 'easy', concept: '부등식 (음수 이항)', requiredSkills: SKILLS_INEQ_BASIC,
    stem: '$x - 5 < 0$ 의 해는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$-5$ 를 우변으로?', options: [
        { key: 'A', text: '$x < 0 + 5 = 5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x < -5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '이항 부호 안 바꿈' },
        { key: 'C', text: '$x < 0 - 5 = -5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '이항 부호 잘못' },
        { key: 'D', text: '$x > 5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부등호 뒤집힘' },
        { key: 'E', text: '$x = 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '등식' },
      ] },
      { stepType: 'PROCESS', prompt: '결과 식?', options: [
        { key: 'A', text: '$x < 5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x < -5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '이항 부호' },
        { key: 'C', text: '$x > 5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '뒤집힘' },
        { key: 'D', text: '$x \\leq 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '부등호 종류' },
        { key: 'E', text: '$x = 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '등식' },
      ] },
      { stepType: 'ANSWER', prompt: '해는?', options: [
        { key: 'A', text: '$x < 5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x > 5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '뒤집힘' },
        { key: 'C', text: '$x < -5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '이항 부호' },
        { key: 'D', text: '$x \\leq 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '부등호 종류' },
        { key: 'E', text: '$x = 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '등식' },
      ] },
    ], solution: '$x - 5 < 0 \\Rightarrow x < 5$.' },

  // Q4
  { chapterCode: CODE, difficulty: 'easy', concept: '부등식 (음수 곱)', requiredSkills: SKILLS_INEQ_SIGN,
    stem: '$-x < 3$ 의 해는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '음수로 곱하거나 나누면 부등호?', options: [
        { key: 'A', text: '뒤집힘 ($<$ 가 $>$ 가 되거나 반대로)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '그대로 유지', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '대표적 오개념' },
        { key: 'C', text: '항상 등호로 변환', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '음수면 부등호 없어짐', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '결과는 무의미', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '풀이 가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$-1$ 곱 (또는 $-1$ 로 나눔)', options: [
        { key: 'A', text: '$x > -3$ (부등호 뒤집힘)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x < -3$ (부등호 유지)', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '뒤집힘 잘못' },
        { key: 'C', text: '$x > 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
        { key: 'D', text: '$x < 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '둘 다 잘못' },
        { key: 'E', text: '$x = -3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '등식' },
      ] },
      { stepType: 'ANSWER', prompt: '해는?', options: [
        { key: 'A', text: '$x > -3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x < -3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '뒤집힘 잘못' },
        { key: 'C', text: '$x > 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
        { key: 'D', text: '$x < 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '잘못' },
        { key: 'E', text: '$x \\geq -3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '부등호 종류' },
      ] },
    ], solution: '$-x < 3 \\Rightarrow x > -3$ (양변에 $-1$ 곱·뒤집힘).' },

  // Q5
  { chapterCode: CODE, difficulty: 'easy', concept: '부등식 (음수 나눗셈)', requiredSkills: SKILLS_INEQ_SIGN,
    stem: '$-2x \\geq 6$ 의 해는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '음수로 나누면?', options: [
        { key: 'A', text: '부등호 뒤집힘', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '부등호 유지', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '음수 나누기 시 뒤집힘' },
        { key: 'C', text: '등호로 변환', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '부등호 없어짐', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '값이 바뀜', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '잘못' },
      ] },
      { stepType: 'PROCESS', prompt: '양변을 $-2$ 로 나눔: $\\geq$ → $\\leq$', options: [
        { key: 'A', text: '$x \\leq -3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x \\geq -3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '뒤집힘 잘못' },
        { key: 'C', text: '$x \\leq 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
        { key: 'D', text: '$x \\geq 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '둘 다 잘못' },
        { key: 'E', text: '$x = -3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '등식' },
      ] },
      { stepType: 'ANSWER', prompt: '해는?', options: [
        { key: 'A', text: '$x \\leq -3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x \\geq -3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '뒤집힘 잘못' },
        { key: 'C', text: '$x \\leq 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'D', text: '$x \\geq 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '잘못' },
        { key: 'E', text: '$x = -3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '등식' },
      ] },
    ], solution: '$-2x \\geq 6 \\Rightarrow x \\leq -3$.' },

  // Q6
  { chapterCode: CODE, difficulty: 'easy', concept: '연립방정식 정의', requiredSkills: SKILLS_SYS_BASIC,
    stem: '두 미지수 $x, y$ 가 있는 방정식 $x + y = 5$ 한 개의 해는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '미지수 2개 + 식 1개일 때 해는?', options: [
        { key: 'A', text: '무수히 많다 (예: $(0,5), (1,4), (2,3)\\ldots$)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '없다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '존재함' },
        { key: 'C', text: '$x = 5, y = 0$ 하나만', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '하나가 아님' },
        { key: 'D', text: '$x = y = 2.5$ 만', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '정수 해 5개', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '실수 범위' },
      ] },
      { stepType: 'PROCESS', prompt: '$y = 5 - x$ 로 풀면?', options: [
        { key: 'A', text: '$x$ 마다 $y$ 가 정해짐 → 무한 해', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 0$ 만 가능', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$x = y$ 만', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '특정' },
        { key: 'D', text: '$y > 0$ 만', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '음수도 가능' },
        { key: 'E', text: '해 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '존재' },
      ] },
      { stepType: 'ANSWER', prompt: '해의 개수?', options: [
        { key: 'A', text: '무수히 많다', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1$ 개', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '식 1개로 부족' },
        { key: 'C', text: '$0$ 개', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '존재' },
        { key: 'D', text: '$5$ 개', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '실수에선 무한' },
        { key: 'E', text: '$2$ 개', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '미지수 2개 + 식 1개 → 해 무수히 많음. 유일해 위해 식 2개 (연립) 필요.' },

  // Q7
  { chapterCode: CODE, difficulty: 'medium', concept: '두 단계 부등식', requiredSkills: SKILLS_INEQ_BASIC,
    stem: '$3x - 5 \\geq 7$ 의 해는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '먼저 상수 이항?', options: [
        { key: 'A', text: '양변에 $5$ 더하기 → $3x \\geq 12$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '양변에서 $5$ 빼기 → $3x \\geq 2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '이항 부호' },
        { key: 'C', text: '양변에 $3$ 나누기 먼저', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '순서 잘못 (계수 처리 어색)' },
        { key: 'D', text: '$3x - 5 + 5 \\geq 7 - 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '오른쪽도 같이 빼야 함이지만 식 자체 잘못' },
        { key: 'E', text: '$\\geq$ 를 $=$ 로 바꾸기', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$3x \\geq 12$ → 나누기 $3$', options: [
        { key: 'A', text: '$x \\geq 4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x \\leq 4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '양수 나누기 뒤집힘 잘못' },
        { key: 'C', text: '$x \\geq 9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '계산 잘못' },
        { key: 'D', text: '$x \\geq 12$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나누기 누락' },
        { key: 'E', text: '$x = 4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '등식' },
      ] },
      { stepType: 'ANSWER', prompt: '해는?', options: [
        { key: 'A', text: '$x \\geq 4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x \\leq 4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '뒤집힘 잘못' },
        { key: 'C', text: '$x \\geq 12$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나누기 누락' },
        { key: 'D', text: '$x > 4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '부등호 종류' },
        { key: 'E', text: '$x = 4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '등식' },
      ] },
    ], solution: '$3x \\geq 12 \\Rightarrow x \\geq 4$.' },

  // Q8
  { chapterCode: CODE, difficulty: 'medium', concept: '문자도 양변에 (음수 발생)', requiredSkills: SKILLS_INEQ_SIGN,
    stem: '$2x + 3 > 5x - 6$ 의 해는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$x$ 항을 한쪽으로 모으기', options: [
        { key: 'A', text: '$2x - 5x > -6 - 3 \\Rightarrow -3x > -9$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2x + 5x > 6 + 3 \\Rightarrow 7x > 9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '이항 부호' },
        { key: 'C', text: '$2x - 5x > 3 - 6 \\Rightarrow -3x > -3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '상수도 이항 부호' },
        { key: 'D', text: '$2x = 5x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '등식' },
        { key: 'E', text: '$2x > 5x$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '상수항 무시' },
      ] },
      { stepType: 'PROCESS', prompt: '$-3x > -9$ → $-3$ 으로 나눔', options: [
        { key: 'A', text: '$x < 3$ (부등호 뒤집힘)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x > 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '뒤집힘 잘못 (음수 나누기)' },
        { key: 'C', text: '$x > -3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
        { key: 'D', text: '$x < -3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '둘 다 잘못' },
        { key: 'E', text: '$x = 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '등식' },
      ] },
      { stepType: 'ANSWER', prompt: '해는?', options: [
        { key: 'A', text: '$x < 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x > 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '뒤집힘 누락' },
        { key: 'C', text: '$x < -3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
        { key: 'D', text: '$x > -3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '잘못' },
        { key: 'E', text: '$x = 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '등식' },
      ] },
    ], solution: '$2x - 5x > -6 - 3 \\Rightarrow -3x > -9 \\Rightarrow x < 3$ (음수로 나눠 뒤집힘).' },

  // Q9
  { chapterCode: CODE, difficulty: 'medium', concept: '분수 부등식', requiredSkills: SKILLS_INEQ_FRAC,
    stem: '$\\dfrac{x}{3} - 1 \\leq 2$ 의 해는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '먼저 양변에 $1$ 더하기', options: [
        { key: 'A', text: '$\\dfrac{x}{3} \\leq 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\dfrac{x}{3} \\leq 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '이항 부호' },
        { key: 'C', text: '$x \\leq 2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '분모 무시' },
        { key: 'D', text: '$x - 3 \\leq 6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3$ 곱 잘못' },
        { key: 'E', text: '$\\dfrac{x}{3} = 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '등식' },
      ] },
      { stepType: 'PROCESS', prompt: '양변에 $3$ 곱하면?', options: [
        { key: 'A', text: '$x \\leq 9$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x \\leq 3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '곱 안 함' },
        { key: 'C', text: '$x \\geq 9$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '양수 곱 뒤집힘 잘못' },
        { key: 'D', text: '$x \\leq 1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기로' },
        { key: 'E', text: '$x = 9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '등식' },
      ] },
      { stepType: 'ANSWER', prompt: '해는?', options: [
        { key: 'A', text: '$x \\leq 9$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x \\leq 3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '곱 안 함' },
        { key: 'C', text: '$x \\geq 9$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '뒤집힘 잘못' },
        { key: 'D', text: '$x < 9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '부등호 종류' },
        { key: 'E', text: '$x = 9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '등식' },
      ] },
    ], solution: '$\\dfrac{x}{3} \\leq 3 \\Rightarrow x \\leq 9$.' },

  // Q10
  { chapterCode: CODE, difficulty: 'medium', concept: '소수 부등식', requiredSkills: SKILLS_INEQ_BASIC,
    stem: '$0.3x + 0.1 > 0.7$ 의 해는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '소수 → 정수로 만들려면?', options: [
        { key: 'A', text: '양변에 $10$ 곱 → $3x + 1 > 7$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '소수점만 위로 올림', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '왼쪽만 $10$ 곱', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '균형 깨짐' },
        { key: 'D', text: '$x$ 계수 무시', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '양변에 $100$ 곱', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '소수점 한 자리만' },
      ] },
      { stepType: 'PROCESS', prompt: '$3x + 1 > 7 \\Rightarrow 3x > 6$', options: [
        { key: 'A', text: '$x > 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x > 6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나누기 누락' },
        { key: 'C', text: '$x < 2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '양수 나누기 뒤집힘' },
        { key: 'D', text: '$x > 1.8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '소수 그대로' },
        { key: 'E', text: '$x = 2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '등식' },
      ] },
      { stepType: 'ANSWER', prompt: '해는?', options: [
        { key: 'A', text: '$x > 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x < 2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '뒤집힘' },
        { key: 'C', text: '$x > 6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나누기 누락' },
        { key: 'D', text: '$x > 0.2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 잘못' },
        { key: 'E', text: '$x = 2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '등식' },
      ] },
    ], solution: '$\\times 10$: $3x + 1 > 7 \\Rightarrow x > 2$.' },

  // Q11
  { chapterCode: CODE, difficulty: 'medium', concept: '연립방정식 (가감법)', requiredSkills: SKILLS_SYS_BASIC,
    stem: '$\\begin{cases} x + y = 7 \\\\ 2x - y = 2 \\end{cases}$ 의 해는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '두 식을 더하면 어떤 미지수 소거?', options: [
        { key: 'A', text: '$y$ 소거 ($+y$ 와 $-y$ 가 합쳐 $0$)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x$ 소거', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$x$ 가 같이 합쳐짐' },
        { key: 'C', text: '둘 다 소거', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$x$ 는 남음' },
        { key: 'D', text: '없음', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$y$ 소거됨' },
        { key: 'E', text: '$y$ 의 부호만 바뀜', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '소거되어 없어짐' },
      ] },
      { stepType: 'PROCESS', prompt: '$3x = 9 \\Rightarrow x = 3$, 대입하면 $y = ?$', options: [
        { key: 'A', text: '$y = 4$ (첫 식 $3 + y = 7$)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = 7$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$x$ 대입 안 함' },
        { key: 'C', text: '$y = 2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$y = 10$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '잘못' },
        { key: 'E', text: '$y = -4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
      ] },
      { stepType: 'ANSWER', prompt: '해 $(x, y)$ 는?', options: [
        { key: 'A', text: '$(3, 4)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(4, 3)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '뒤바뀜' },
        { key: 'C', text: '$(3, 7)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$y$ 잘못' },
        { key: 'D', text: '$(7, 0)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '두 번째 식 무시' },
        { key: 'E', text: '$(0, 7)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
    ], solution: '두 식 합 → $3x = 9 \\Rightarrow x = 3$, $y = 7 - 3 = 4$. 해 $(3, 4)$.' },

  // Q12
  { chapterCode: CODE, difficulty: 'medium', concept: '연립방정식 (대입법)', requiredSkills: SKILLS_SYS_BASIC,
    stem: '$\\begin{cases} y = 2x + 1 \\\\ x + y = 7 \\end{cases}$ 의 해는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '첫 식을 둘째 식에 대입?', options: [
        { key: 'A', text: '$x + (2x + 1) = 7$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x + y = 2x + 1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '대입 잘못' },
        { key: 'C', text: '$x + 2x = 7 + 1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$y$ 만 따로' },
        { key: 'D', text: '$y \\cdot (x + y) = 7$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱셈' },
        { key: 'E', text: '$y = 7 - x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '두 번째 식만' },
      ] },
      { stepType: 'PROCESS', prompt: '$3x + 1 = 7 \\Rightarrow x = ?$', options: [
        { key: 'A', text: '$x = 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나누기 누락' },
        { key: 'C', text: '$x = 7$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x = 1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 잘못' },
        { key: 'E', text: '$x = 3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$y = 2(2) + 1 = 5$. 해는?', options: [
        { key: 'A', text: '$(2, 5)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(5, 2)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '바뀜' },
        { key: 'C', text: '$(2, 1)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$y$ 잘못' },
        { key: 'D', text: '$(2, 7)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(7, 0)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
    ], solution: '대입: $x + 2x + 1 = 7 \\Rightarrow x = 2$, $y = 5$.' },

  // Q13
  { chapterCode: CODE, difficulty: 'medium', concept: '연립 가감법 (재구성)', requiredSkills: SKILLS_SYS_BASIC,
    stem: '$\\begin{cases} 2x + y = 10 \\\\ x - y = 2 \\end{cases}$ 의 해는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '두 식 더하기 → 어떤 미지수 소거?', options: [
        { key: 'A', text: '$y$ 소거 → $3x = 12$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x$ 소거', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$x$ 합쳐짐' },
        { key: 'C', text: '둘 다 남음', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$y$ 소거됨' },
        { key: 'D', text: '$2y$ 가 됨', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '부호 잘못' },
        { key: 'E', text: '$x - 2x = -x$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '뺄셈' },
      ] },
      { stepType: 'PROCESS', prompt: '$x = 4$, 대입 → $y = ?$', options: [
        { key: 'A', text: '$4 - y = 2 \\Rightarrow y = 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = -2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '이항 부호' },
        { key: 'C', text: '$y = 6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$y = 4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
        { key: 'E', text: '$y = 10$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '해는?', options: [
        { key: 'A', text: '$(4, 2)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(2, 4)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '바뀜' },
        { key: 'C', text: '$(4, -2)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'D', text: '$(10, 2)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(0, 10)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
    ], solution: '두 식 합 → $3x = 12 \\Rightarrow x = 4$. 둘째 식 $4 - y = 2 \\Rightarrow y = 2$. 해 $(4, 2)$.' },

  // Q14
  { chapterCode: CODE, difficulty: 'medium', concept: '연립 (대입법 + 정리)', requiredSkills: SKILLS_SYS_BASIC,
    stem: '$\\begin{cases} 3x + 2y = 13 \\\\ x - y = 1 \\end{cases}$ 의 해는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$x = y + 1$ 대입?', options: [
        { key: 'A', text: '$3(y+1) + 2y = 13$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3y + 1 + 2y = 13$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '분배 잘못' },
        { key: 'C', text: '$3x + 2y = 13$ 그대로', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '대입 안 함' },
        { key: 'D', text: '$3 \\cdot 1 + 2y = 13$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$y$ 누락' },
        { key: 'E', text: '$x + y = 14$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '두 식 합' },
      ] },
      { stepType: 'PROCESS', prompt: '$3y + 3 + 2y = 13 \\Rightarrow 5y = 10$', options: [
        { key: 'A', text: '$y = 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나누기 잘못' },
        { key: 'C', text: '$y = 10$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나누기 누락' },
        { key: 'D', text: '$y = 3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 잘못' },
        { key: 'E', text: '$y = 1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$x = y + 1 = 3$. 해는?', options: [
        { key: 'A', text: '$(3, 2)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(2, 3)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '바뀜' },
        { key: 'C', text: '$(3, 1)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(1, 0)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(13, 1)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
    ], solution: '$x = y+1$ 대입 → $5y = 10 \\Rightarrow y = 2$, $x = 3$. 해 $(3, 2)$.' },

  // Q15
  { chapterCode: CODE, difficulty: 'medium', concept: '부등식 단어문제', requiredSkills: SKILLS_WORD,
    stem: '사과 $1$개 $1000$원, 사탕 $1$개 $100$원이다. 사과 $1$개와 사탕 $x$개를 사서 $1500$원 이하로 결제하려면 $x$의 최댓값은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '식 세우기:', options: [
        { key: 'A', text: '$1000 + 100x \\leq 1500$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1000 + 100x < 1500$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '"이하" = $\\leq$' },
        { key: 'C', text: '$1000 \\cdot 100x \\leq 1500$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '곱셈으로' },
        { key: 'D', text: '$100x \\leq 1500$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '사과값 누락' },
        { key: 'E', text: '$1000 + 100 \\cdot x = 1500$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '등식' },
      ] },
      { stepType: 'PROCESS', prompt: '$100x \\leq 500 \\Rightarrow x \\leq 5$', options: [
        { key: 'A', text: '$x \\leq 5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x < 5$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '"이하"는 $\\leq$' },
        { key: 'C', text: '$x \\leq 15$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
        { key: 'D', text: '$x \\leq 50$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$100$ 잘못' },
        { key: 'E', text: '$x = 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '등식' },
      ] },
      { stepType: 'ANSWER', prompt: '최댓값은?', options: [
        { key: 'A', text: '$5$ 개', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4$ 개', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '"이하" 미포함 잘못' },
        { key: 'C', text: '$6$ 개', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$x \\leq 5$ 초과' },
        { key: 'D', text: '$15$ 개', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$50$ 개', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$1000 + 100x \\leq 1500 \\Rightarrow x \\leq 5$. 최대 $5$ 개.' },

  // Q16 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '괄호 + 음수 부등식', requiredSkills: SKILLS_INEQ_SIGN,
    stem: '$-3(x - 2) \\geq 6$ 의 해는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '왼쪽 괄호 전개?', options: [
        { key: 'A', text: '$-3x + 6 \\geq 6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-3x - 6 \\geq 6$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-3 \\cdot (-2)$ 부호' },
        { key: 'C', text: '$-3x - 2 \\geq 6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$-3$ 곱 누락' },
        { key: 'D', text: '$3x - 6 \\geq 6$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 전체' },
        { key: 'E', text: '$-(3x - 6) \\geq 6$ (그대로)', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '괄호 안 풂' },
      ] },
      { stepType: 'PROCESS', prompt: '$-3x + 6 \\geq 6 \\Rightarrow -3x \\geq 0$', options: [
        { key: 'A', text: '$x \\leq 0$ (음수 나누기 뒤집힘)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x \\geq 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '뒤집힘 잘못' },
        { key: 'C', text: '$x \\leq -3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x < 0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '부등호 종류' },
        { key: 'E', text: '$x = 0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '등식' },
      ] },
      { stepType: 'ANSWER', prompt: '해는?', options: [
        { key: 'A', text: '$x \\leq 0$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x \\geq 0$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '뒤집힘 잘못' },
        { key: 'C', text: '$x \\leq -2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x < 0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '부등호 종류' },
        { key: 'E', text: '$x = 0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '등식' },
      ] },
    ], solution: '$-3(x-2) \\geq 6 \\Rightarrow -3x + 6 \\geq 6 \\Rightarrow -3x \\geq 0 \\Rightarrow x \\leq 0$.' },

  // Q17 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '연립 가감법 (양변 곱)', requiredSkills: SKILLS_SYS_HARD,
    stem: '$\\begin{cases} 2x + 3y = 7 \\\\ 3x - 2y = 4 \\end{cases}$ 의 해는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$y$ 를 소거하려면?', options: [
        { key: 'A', text: '첫 식 $\\times 2$, 둘째 식 $\\times 3$ 후 더하기', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '두 식을 그대로 더하기', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$y$ 계수 다름' },
        { key: 'C', text: '두 식을 빼기', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '계수 안 맞음' },
        { key: 'D', text: '$y = 0$ 가정', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x$ 를 0으로', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$4x + 6y = 14$ 와 $9x - 6y = 12$ 합 → $13x = 26$', options: [
        { key: 'A', text: '$x = 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 26$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나누기 누락' },
        { key: 'C', text: '$x = 13$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x = 0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x = -2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
      ] },
      { stepType: 'ANSWER', prompt: '$2(2) + 3y = 7 \\Rightarrow y = 1$. 해는?', options: [
        { key: 'A', text: '$(2, 1)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(1, 2)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '바뀜' },
        { key: 'C', text: '$(2, 3)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '계산 잘못' },
        { key: 'D', text: '$(0, 0)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(2, -1)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
      ] },
    ], solution: '$y$ 계수 통일 후 합 → $13x = 26 \\Rightarrow x = 2$, $y = 1$. 해 $(2, 1)$.' },

  // Q18 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '연립방정식 해 없음 (평행)', requiredSkills: SKILLS_SYS_BASIC,
    stem: '$\\begin{cases} y = 2x + 1 \\\\ y = 2x + 3 \\end{cases}$ 의 해는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '두 직선의 기울기와 $y$절편?', options: [
        { key: 'A', text: '기울기 같음 ($2$), $y$절편 다름 ($1, 3$) → 평행', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '기울기 다름', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '둘 다 $2$' },
        { key: 'C', text: '같은 직선 → 무수히 많은 해', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$y$ 절편 다름' },
        { key: 'D', text: '직각 교차', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '기울기 곱 $-1$ 아님' },
        { key: 'E', text: '한 점에서 만남', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평행이라 안 만남' },
      ] },
      { stepType: 'PROCESS', prompt: '두 식 대입: $2x + 1 = 2x + 3$', options: [
        { key: 'A', text: '$1 = 3$ — 모순 → 해 없음', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$0 = 2 \\Rightarrow x = 무한$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '모순은 무한 아닌 없음' },
        { key: 'C', text: '$x = 0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '식 풀이 잘못' },
        { key: 'D', text: '$x = 2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x = 1, 3$ 둘 다 가능', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x$ 값과 절편 혼동' },
      ] },
      { stepType: 'ANSWER', prompt: '해는?', options: [
        { key: 'A', text: '해 없음 (평행)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '무수히 많은 해 (일치)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$y$ 절편 다르면 평행' },
        { key: 'C', text: '$(0, 1)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '첫 식만' },
        { key: 'D', text: '$(0, 3)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '둘째 식만' },
        { key: 'E', text: '$(1, 3)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '두 직선이 평행 (기울기 같고 절편 다름) → 교점 없음 → 해 없음.' },

  // Q19 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '분수 부등식 (통분)', requiredSkills: SKILLS_INEQ_FRAC,
    stem: '$x - 1 \\leq \\dfrac{x + 1}{2}$ 의 해는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '분모를 없애기 위해?', options: [
        { key: 'A', text: '양변에 $2$ 곱 → $2(x-1) \\leq x+1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '오른쪽만 $2$ 곱', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '균형 깨짐' },
        { key: 'C', text: '왼쪽에서 분모 빼기', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x - 1 \\leq x + 1$ (분모 무시)', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '분모 처리 잘못' },
        { key: 'E', text: '$2x - 1 \\leq x + 1$ (왼쪽에 $2$ 곱)', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$-1$ 도 곱해야' },
      ] },
      { stepType: 'PROCESS', prompt: '$2x - 2 \\leq x + 1 \\Rightarrow x \\leq 3$', options: [
        { key: 'A', text: '$x \\leq 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x \\geq 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '뒤집힘 잘못' },
        { key: 'C', text: '$x \\leq -3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '계산 잘못' },
        { key: 'D', text: '$x \\leq 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x = 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '등식' },
      ] },
      { stepType: 'ANSWER', prompt: '해는?', options: [
        { key: 'A', text: '$x \\leq 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x \\geq 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '뒤집힘' },
        { key: 'C', text: '$x \\leq 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x < 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '부등호 종류' },
        { key: 'E', text: '$x = 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '등식' },
      ] },
    ], solution: '$\\times 2$: $2x - 2 \\leq x + 1 \\Rightarrow x \\leq 3$.' },

  // Q20 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '복합 부등식 (도형)', requiredSkills: SKILLS_WORD,
    stem: '정사각형 한 변 $x$ cm, 둘레가 $12$cm 이상 $24$cm 이하이다. $x$ 의 범위는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '둘레 식?', options: [
        { key: 'A', text: '둘레 $= 4x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '둘레 $= x^2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '넓이' },
        { key: 'C', text: '둘레 $= 2x$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '직사각형 한쪽만' },
        { key: 'D', text: '둘레 $= x$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '한 변만' },
        { key: 'E', text: '둘레 $= x \\cdot \\pi$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '원' },
      ] },
      { stepType: 'PROCESS', prompt: '$12 \\leq 4x \\leq 24 \\Rightarrow ?$', options: [
        { key: 'A', text: '$3 \\leq x \\leq 6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3 < x < 6$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '"이상/이하" 포함' },
        { key: 'C', text: '$48 \\leq x \\leq 96$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '곱셈으로 잘못' },
        { key: 'D', text: '$12 \\leq x \\leq 24$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '나누기 누락' },
        { key: 'E', text: '$x = 6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '등식' },
      ] },
      { stepType: 'ANSWER', prompt: '$x$ 범위?', options: [
        { key: 'A', text: '$3 \\leq x \\leq 6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3 < x < 6$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '경계 포함' },
        { key: 'C', text: '$x \\leq 6$ (한쪽만)', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '하한 누락' },
        { key: 'D', text: '$x \\geq 3$ (한쪽만)', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '상한 누락' },
        { key: 'E', text: '$12 \\leq x \\leq 24$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '나누기 누락' },
      ] },
    ], solution: '둘레 $4x$. $12 \\leq 4x \\leq 24 \\Rightarrow 3 \\leq x \\leq 6$.' },
];

export const K_G8_MATH2_CH03_LINEAR_INEQ_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
