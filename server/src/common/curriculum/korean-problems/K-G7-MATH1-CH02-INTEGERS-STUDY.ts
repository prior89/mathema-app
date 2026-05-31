/**
 * K-G7-MATH1-CH02-INTEGERS — STUDY pool (single-step, 20문제).
 *
 * Mastery 3-step pool과 별도. 사용자가 Mastery에서 마스터한 챕터를 Study 탭에서
 * 선택하면 이 풀에서 single-step 문제 풀이 (body + 연습장 + 5지선다).
 *
 * 2026-05-24 사용자 spec:
 *   - 난이도: 쉬움 6 / 중간 9 / 어려움 5
 *   - 각 문제 5지선다, 오답 4개에 errorCode + rationale
 *   - Mastery와 다른 식·숫자 (Study는 Mastery 클리어 후 변형 문제 풀이)
 *   - 정답 검산 완료 (Claude+사용자 spec 통과 2026-05-24)
 *   - LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G7-MATH1-CH02-INTEGERS';
const SKILLS_BASIC = ['integer_addition', 'integer_subtraction', 'sign_handling'];
const SKILLS_MULT = ['integer_multiplication', 'integer_division', 'sign_rules'];
const SKILLS_FRAC = ['rational_addition', 'common_denominator', 'fraction_arithmetic'];
const SKILLS_MIXED = ['order_of_operations', 'integer_arithmetic', 'sign_handling'];
const SKILLS_PARENS = ['order_of_operations', 'parentheses', 'integer_arithmetic'];
const SKILLS_POWER = ['integer_power', 'negative_base_power', 'sign_rules'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) -7+(-2)=-9
  { chapterCode: CODE, difficulty: 'easy', concept: '음수의 덧셈', requiredSkills: SKILLS_BASIC,
    stem: '$-7 + (-2)$의 값은?',
    options: [
      { key: 'A', text: '$-9$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$9$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 누락' },
      { key: 'C', text: '$-5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '빼기로 계산 (7-2)' },
      { key: 'D', text: '$5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '빼기+부호 잘못' },
      { key: 'E', text: '$-14$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '곱셈으로 (7×2)' },
    ],
    solution: '같은 부호 두 수의 덧셈: 절댓값을 더하고 공통 부호. $|-7|+|-2|=9$, 두 수 음수 → $-9$.' },
  // S2 (쉬움) 6+(-9)=-3
  { chapterCode: CODE, difficulty: 'easy', concept: '부호 다른 두 수 덧셈', requiredSkills: SKILLS_BASIC,
    stem: '$6 + (-9)$의 값은?',
    options: [
      { key: 'A', text: '$-3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '큰 절댓값 쪽 부호 (음수) 누락' },
      { key: 'C', text: '$-15$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '두 절댓값 합 + 음수' },
      { key: 'D', text: '$15$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '절댓값 합 + 양수' },
      { key: 'E', text: '$-54$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '곱셈으로 오해' },
    ],
    solution: '$|-9|>|6|$, 차 $9-6=3$, 음수 쪽 부호 → $-3$.' },
  // S3 (쉬움) -8-(-3)=-5
  { chapterCode: CODE, difficulty: 'easy', concept: '음의 음수 처리', requiredSkills: SKILLS_BASIC,
    stem: '$-8 - (-3)$의 값은?',
    options: [
      { key: 'A', text: '$-5$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$-11$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-(-3)$=+3 미처리, $-8-3$으로' },
      { key: 'C', text: '$5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'D', text: '$11$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '절댓값 합 + 양수' },
      { key: 'E', text: '$-24$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '곱셈으로' },
    ],
    solution: '$-(-3)=+3$이므로 $-8+3=-5$.' },
  // S4 (쉬움) (-3)×5=-15
  { chapterCode: CODE, difficulty: 'easy', concept: '음수×양수', requiredSkills: SKILLS_MULT,
    stem: '$(-3) \\times 5$의 값은?',
    options: [
      { key: 'A', text: '$-15$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$15$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 누락' },
      { key: 'C', text: '$-8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '덧셈으로 (3+5)' },
      { key: 'D', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '뺄셈 (5-3)' },
      { key: 'E', text: '$-2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '뺄셈+부호' },
    ],
    solution: '부호 다른 두 수 곱은 음수: $3\\times5=15$, $\\therefore -15$.' },
  // S5 (쉬움) -12÷4=-3
  { chapterCode: CODE, difficulty: 'easy', concept: '음수÷양수', requiredSkills: SKILLS_MULT,
    stem: '$-12 \\div 4$의 값은?',
    options: [
      { key: 'A', text: '$-3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 누락' },
      { key: 'C', text: '$-8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '뺄셈 (12-4)' },
      { key: 'D', text: '$-48$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '곱셈 (12×4)' },
      { key: 'E', text: '$-4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나눗셈 실수' },
    ],
    solution: '부호 다른 나눗셈은 음수: $12\\div4=3$, $\\therefore -3$.' },
  // S6 (쉬움) |-9|-4=5
  { chapterCode: CODE, difficulty: 'easy', concept: '절댓값+뺄셈', requiredSkills: SKILLS_MIXED,
    stem: '$|-9| - 4$의 값은?',
    options: [
      { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$-13$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$|-9|$를 $-9$로 잘못 (절댓값 무시)' },
      { key: 'C', text: '$-5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '계산 후 부호 잘못' },
      { key: 'D', text: '$13$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '덧셈으로 (9+4)' },
      { key: 'E', text: '$36$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '곱셈으로 (9×4)' },
    ],
    solution: '$|-9|=9$, $9-4=5$.' },
  // S7 (중간) -2/3 + 1/4 = -5/12
  { chapterCode: CODE, difficulty: 'medium', concept: '분수 덧셈 (부호 다른)', requiredSkills: SKILLS_FRAC,
    stem: '$-\\dfrac{2}{3} + \\dfrac{1}{4}$의 값은?',
    options: [
      { key: 'A', text: '$-\\dfrac{5}{12}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{5}{12}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '결과 부호 잘못' },
      { key: 'C', text: '$-\\dfrac{1}{7}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '분모 합 (3+4)' },
      { key: 'D', text: '$-\\dfrac{11}{12}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '통분 후 분자 합 (-8-3)' },
      { key: 'E', text: '$-\\dfrac{1}{12}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '통분 후 분자 차 잘못' },
    ],
    solution: '공통분모 12: $-\\dfrac{2}{3}=-\\dfrac{8}{12}$, $\\dfrac{1}{4}=\\dfrac{3}{12}$. $-\\dfrac{8}{12}+\\dfrac{3}{12}=-\\dfrac{5}{12}$.' },
  // S8 (중간) 3/5 - (-1/10) = 7/10
  { chapterCode: CODE, difficulty: 'medium', concept: '분수 음의 음수', requiredSkills: SKILLS_FRAC,
    stem: '$\\dfrac{3}{5} - \\left(-\\dfrac{1}{10}\\right)$의 값은?',
    options: [
      { key: 'A', text: '$\\dfrac{7}{10}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{5}{10}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-(-1/10)$=+1/10 미처리, $3/5-1/10=5/10$' },
      { key: 'C', text: '$\\dfrac{2}{5}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '통분 안 함, 분모 5로 (3-1)/5' },
      { key: 'D', text: '$\\dfrac{4}{15}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '분자/분모 따로 합' },
      { key: 'E', text: '$-\\dfrac{7}{10}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 음수로 잘못' },
    ],
    solution: '$-(-1/10)=+1/10$. 통분 10: $3/5=6/10$, $6/10+1/10=7/10$.' },
  // S9 (중간) 4/9 × (-3/8) = -1/6
  { chapterCode: CODE, difficulty: 'medium', concept: '분수 곱셈 + 약분', requiredSkills: SKILLS_FRAC,
    stem: '$\\dfrac{4}{9} \\times \\left(-\\dfrac{3}{8}\\right)$의 값은?',
    options: [
      { key: 'A', text: '$-\\dfrac{1}{6}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{1}{6}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '음수 부호 누락' },
      { key: 'C', text: '$-\\dfrac{12}{72}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '약분 안 함' },
      { key: 'D', text: '$-\\dfrac{12}{17}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '분모 합 (9+8)' },
      { key: 'E', text: '$-\\dfrac{7}{17}$', isCorrect: false, errorCode: 'ADD_NUMERATOR_ONLY', errorReason: '분자분모 각각 더하기' },
    ],
    solution: '$\\dfrac{4\\times(-3)}{9\\times 8}=\\dfrac{-12}{72}=-\\dfrac{1}{6}$.' },
  // S10 (중간) (-1/2) ÷ (3/4) = -2/3
  { chapterCode: CODE, difficulty: 'medium', concept: '분수 나눗셈 (역수)', requiredSkills: SKILLS_FRAC,
    stem: '$\\left(-\\dfrac{1}{2}\\right) \\div \\dfrac{3}{4}$의 값은?',
    options: [
      { key: 'A', text: '$-\\dfrac{2}{3}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{2}{3}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 양수로' },
      { key: 'C', text: '$-\\dfrac{3}{8}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '역수 안 취하고 곱셈' },
      { key: 'D', text: '$-\\dfrac{4}{6}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '약분 안 함' },
      { key: 'E', text: '$-\\dfrac{8}{3}$', isCorrect: false, errorCode: 'DENOMINATOR_ERROR', errorReason: '분자분모 뒤집힘' },
    ],
    solution: '$\\dfrac{-1}{2}\\times\\dfrac{4}{3}=\\dfrac{-4}{6}=-\\dfrac{2}{3}$.' },
  // S11 (중간) -5+2-(-7)=4
  { chapterCode: CODE, difficulty: 'medium', concept: '정수 혼합 ± + 음의 음수', requiredSkills: SKILLS_MIXED,
    stem: '$-5 + 2 - (-7)$의 값은?',
    options: [
      { key: 'A', text: '$4$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$-10$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-(-7)$=+7 미처리, $-5+2-7$' },
      { key: 'C', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '단순 계산 실수' },
      { key: 'D', text: '$14$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-5$를 $+5$로' },
      { key: 'E', text: '$-4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '결과 부호 잘못' },
    ],
    solution: '$-5+2+7=4$.' },
  // S12 (중간) (-6)×(-2)÷3=4
  { chapterCode: CODE, difficulty: 'medium', concept: '곱셈+나눗셈 혼합', requiredSkills: SKILLS_MIXED,
    stem: '$(-6) \\times (-2) \\div 3$의 값은?',
    options: [
      { key: 'A', text: '$4$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$-4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '음수×음수=양수 누락' },
      { key: 'C', text: '$36$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\div 3$ 누락' },
      { key: 'D', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '단순 계산 실수' },
      { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '곱셈 잘못 (6×2=8?)' },
    ],
    solution: '$(-6)\\times(-2)=12$, $12\\div 3=4$.' },
  // S13 (중간) 2 - 3×(-4) = 14
  { chapterCode: CODE, difficulty: 'medium', concept: '곱셈 우선', requiredSkills: SKILLS_MIXED,
    stem: '$2 - 3 \\times (-4)$의 값은?',
    options: [
      { key: 'A', text: '$14$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$4$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '왼쪽부터 순차: (2-3)×(-4)=4' },
      { key: 'C', text: '$-10$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$3\\times(-4)=-12$, $2-(-12)$의 음의 음수 미처리' },
      { key: 'D', text: '$-14$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '결과 부호 잘못' },
      { key: 'E', text: '$0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
    ],
    solution: '곱셈 먼저: $3\\times(-4)=-12$. 그 다음 $2-(-12)=2+12=14$.' },
  // S14 (중간) -3+|-5|×2=7
  { chapterCode: CODE, difficulty: 'medium', concept: '절댓값+곱셈+덧셈', requiredSkills: SKILLS_MIXED,
    stem: '$-3 + |-5| \\times 2$의 값은?',
    options: [
      { key: 'A', text: '$7$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$-13$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$|-5|$을 $-5$로 (절댓값 무시): $-3+(-5)\\times2=-13$' },
      { key: 'C', text: '$-16$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '왼쪽부터 순차 (절댓값+우선) 무시' },
      { key: 'D', text: '$13$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-3$을 $+3$으로' },
      { key: 'E', text: '$-7$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '결과 부호 잘못' },
    ],
    solution: '$|-5|=5$, $5\\times2=10$, $-3+10=7$.' },
  // S15 (중간) (-2)^3 = -8
  { chapterCode: CODE, difficulty: 'medium', concept: '음수의 거듭제곱 (홀수 지수)', requiredSkills: SKILLS_POWER,
    stem: '$(-2)^3$의 값은?',
    options: [
      { key: 'A', text: '$-8$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$8$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '홀수 지수도 양수로 (거듭제곱 부호 규칙 잘못)' },
      { key: 'C', text: '$-6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '거듭제곱을 곱셈으로 (-2×3)' },
      { key: 'D', text: '$6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '거듭제곱을 곱셈+부호 잘못' },
      { key: 'E', text: '$-9$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$(-3)^2$으로 오해' },
    ],
    solution: '$(-2)^3=(-2)\\times(-2)\\times(-2)=4\\times(-2)=-8$. 홀수 지수는 음수.' },
  // S16 (어려움) (-1)^4 + (-1)^7 = 0
  { chapterCode: CODE, difficulty: 'hard', concept: '거듭제곱 부호 합', requiredSkills: SKILLS_POWER,
    stem: '$(-1)^4 + (-1)^7$의 값은?',
    options: [
      { key: 'A', text: '$0$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '둘 다 1로 (부호 무시)' },
      { key: 'C', text: '$-2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '둘 다 -1로 (짝수도 음수)' },
      { key: 'D', text: '$11$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '지수 합 (4+7)' },
      { key: 'E', text: '$-1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '둘 중 하나 빠뜨림' },
    ],
    solution: '짝수 지수 → $(-1)^4=1$. 홀수 지수 → $(-1)^7=-1$. $1+(-1)=0$.' },
  // S17 (어려움) 3/4 - (1/2 + 1/3) = -1/12
  { chapterCode: CODE, difficulty: 'hard', concept: '괄호 안 통분 + 분수 뺄셈', requiredSkills: SKILLS_PARENS,
    stem: '$\\dfrac{3}{4} - \\left(\\dfrac{1}{2} + \\dfrac{1}{3}\\right)$의 값은?',
    options: [
      { key: 'A', text: '$-\\dfrac{1}{12}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{1}{12}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '결과 부호 잘못' },
      { key: 'C', text: '$\\dfrac{1}{12}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$3/4-1/2+1/3$ (괄호 무시 + 부호 잘못 적용)' },
      { key: 'D', text: '$\\dfrac{5}{12}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '괄호 무시: $3/4-1/2=1/4$, $1/4+1/3=7/12$ 같은 변형 실수' },
      { key: 'E', text: '$\\dfrac{2}{9}$', isCorrect: false, errorCode: 'ADD_NUMERATOR_ONLY', errorReason: '분자분모 각각 처리' },
    ],
    solution: '괄호 안 먼저: $1/2+1/3=3/6+2/6=5/6$. $3/4-5/6=9/12-10/12=-1/12$.' },
  // S18 (어려움) {(-2)-(-5)}×(-3)=-9
  { chapterCode: CODE, difficulty: 'hard', concept: '괄호 + 음의 음수 + 곱셈', requiredSkills: SKILLS_PARENS,
    stem: '$\\{(-2) - (-5)\\} \\times (-3)$의 값은?',
    options: [
      { key: 'A', text: '$-9$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$9$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '곱셈 후 부호 잘못' },
      { key: 'C', text: '$-21$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-(-5)$=+5 미처리: $(-2-5)\\times(-3)=21$ 같은 실수' },
      { key: 'D', text: '$21$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '괄호 안 + 부호 다 잘못' },
      { key: 'E', text: '$-6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '괄호 계산 실수 (2 대신)' },
    ],
    solution: '괄호 안: $-2-(-5)=-2+5=3$. $3\\times(-3)=-9$.' },
  // S19 (어려움) (-2)^2 × (-3) ÷ (-1) = 12
  { chapterCode: CODE, difficulty: 'hard', concept: '거듭제곱+곱셈+나눗셈', requiredSkills: SKILLS_POWER,
    stem: '$(-2)^2 \\times (-3) \\div (-1)$의 값은?',
    options: [
      { key: 'A', text: '$12$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$-12$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '음수÷음수=양수 누락' },
      { key: 'C', text: '$-4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$(-2)^2=-4$로 잘못 (괄호 거듭제곱 vs 단항 혼동)' },
      { key: 'D', text: '$4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '단계 실수' },
      { key: 'E', text: '$-2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산 실수' },
    ],
    solution: '$(-2)^2=4$. $4\\times(-3)=-12$. $-12\\div(-1)=12$.' },
  // S20 (어려움) 1/2 × {(-3/4)+(1/6)} = -7/24
  { chapterCode: CODE, difficulty: 'hard', concept: '괄호 안 통분 + 분수 곱', requiredSkills: SKILLS_PARENS,
    stem: '$\\dfrac{1}{2} \\times \\left\\{\\left(-\\dfrac{3}{4}\\right) + \\dfrac{1}{6}\\right\\}$의 값은?',
    options: [
      { key: 'A', text: '$-\\dfrac{7}{24}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{7}{24}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호 잘못' },
      { key: 'C', text: '$-\\dfrac{7}{12}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$\\times \\dfrac{1}{2}$ 누락' },
      { key: 'D', text: '$-\\dfrac{5}{24}$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '괄호 안 통분 계산 실수' },
      { key: 'E', text: '$-\\dfrac{1}{3}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '곱셈 우선으로 잘못 처리' },
    ],
    solution: '괄호 안: $-3/4+1/6=-9/12+2/12=-7/12$. $1/2 \\times (-7/12)=-7/24$.' },
];

export const K_G7_MATH1_CH02_INTEGERS_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
