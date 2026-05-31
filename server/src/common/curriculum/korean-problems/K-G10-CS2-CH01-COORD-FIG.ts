/**
 * K-G10-CS2-CH01-COORD-FIG (좌표·도형의 방정식) — 20문제 3-step Mastery.
 * 고1 — 두 점 거리 → 중점/내분/외분 → 직선 (점-기울기·평행·수직) →
 *        점과 직선의 거리 → 원의 방정식 (중심·반지름) → 원과 직선의 위치관계.
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 * 주요 errorCode:
 *   FORMULA_SELECTION_ERROR 7 (공식 혼동) / ARITHMETIC_ERROR 6
 *   SIGN_ERROR 4 (외분 / 수직 기울기) / CONCEPT_MISUNDERSTANDING 3
 *
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G10-CS2-CH01-COORD-FIG';
const SKILLS_DIST = ['distance_two_points'];
const SKILLS_MID = ['midpoint'];
const SKILLS_INT = ['internal_division'];
const SKILLS_EXT = ['external_division'];
const SKILLS_SLOPE = ['slope'];
const SKILLS_LINE_PT = ['line_point_slope'];
const SKILLS_PAR = ['parallel_lines'];
const SKILLS_PERP = ['perpendicular_lines'];
const SKILLS_PT_LINE = ['point_line_distance'];
const SKILLS_CIRCLE_EQ = ['circle_equation'];
const SKILLS_CIRCLE_LINE = ['circle_line_position'];

const problems: KoreanProblemSeed[] = [
  // Q1
  { chapterCode: CODE, difficulty: 'easy', concept: '두 점 거리', requiredSkills: SKILLS_DIST,
    stem: '$A(1, 2)$, $B(4, 6)$ 사이의 거리?',
    steps: [
      { stepType: 'CONCEPT', prompt: '거리 공식', options: [
        { key: 'A', text: '$\\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(x_2-x_1) + (y_2-y_1)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱·제곱근 누락' },
        { key: 'C', text: '$|x_2 - x_1|$ 만', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$y$ 누락' },
        { key: 'D', text: '$x_1 + y_1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sqrt{x_1 y_2}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\sqrt{9 + 16}$', options: [
        { key: 'A', text: '$\\sqrt{25} = 5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\sqrt{7}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3 + 4$' },
        { key: 'C', text: '$25$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱근 누락' },
        { key: 'D', text: '$\\sqrt{12}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$7$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$3+4$' },
      ] },
      { stepType: 'ANSWER', prompt: '거리?', options: [
        { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$7$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\Delta x + \\Delta y$' },
        { key: 'C', text: '$25$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$12$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sqrt{7}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\sqrt{(4-1)^2 + (6-2)^2} = \\sqrt{9+16} = 5$.' },

  // Q2
  { chapterCode: CODE, difficulty: 'easy', concept: '중점', requiredSkills: SKILLS_MID,
    stem: '$A(2, 4)$, $B(6, 8)$ 의 중점?',
    steps: [
      { stepType: 'CONCEPT', prompt: '중점 공식', options: [
        { key: 'A', text: '$((x_1+x_2)/2, (y_1+y_2)/2)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(x_2 - x_1, y_2 - y_1)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '차' },
        { key: 'C', text: '$(x_1 x_2, y_1 y_2)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱' },
        { key: 'D', text: '$(x_1 + x_2, y_1 + y_2)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '나누기 누락' },
        { key: 'E', text: '$(x_1, y_2)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$((2+6)/2, (4+8)/2)$', options: [
        { key: 'A', text: '$(4, 6)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(8, 12)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '나누기 누락' },
        { key: 'C', text: '$(4, 4)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(2, 4)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$A$' },
        { key: 'E', text: '$(6, 8)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$B$' },
      ] },
      { stepType: 'ANSWER', prompt: '중점?', options: [
        { key: 'A', text: '$(4, 6)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(8, 12)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합만' },
        { key: 'C', text: '$(4, 4)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(2, 4)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$A$' },
        { key: 'E', text: '$(6, 8)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$B$' },
      ] },
    ], solution: '중점 $(4, 6)$.' },

  // Q3
  { chapterCode: CODE, difficulty: 'easy', concept: '원점과 점 거리', requiredSkills: SKILLS_DIST,
    stem: '$O(0,0)$, $P(3, 4)$ 거리?',
    steps: [
      { stepType: 'CONCEPT', prompt: '거리 공식', options: [
        { key: 'A', text: '$\\sqrt{x^2 + y^2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x + y$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$|x| - |y|$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$xy$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x^2 + y^2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱근 누락' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\sqrt{9+16}$', options: [
        { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$7$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
        { key: 'C', text: '$25$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱근 누락' },
        { key: 'D', text: '$12$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3 \\cdot 4$' },
        { key: 'E', text: '$\\sqrt{7}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '거리?', options: [
        { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$7$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
        { key: 'C', text: '$25$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$12$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\sqrt{3^2 + 4^2} = 5$.' },

  // Q4
  { chapterCode: CODE, difficulty: 'easy', concept: '수평선 위 중점', requiredSkills: SKILLS_MID,
    stem: '$A(1, 2)$, $B(5, 2)$ 중점?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$y$ 같음 → $x$ 만 평균', options: [
        { key: 'A', text: '$((1+5)/2, 2)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$((1+5)/2, (2+2)/2) = (3, 2)$ — 같은 결과', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '같으나 우회' },
        { key: 'C', text: '$(5-1, 0) = (4, 0)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '차' },
        { key: 'D', text: '$(1 \\cdot 5, 4)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '곱' },
        { key: 'E', text: '$(6, 4)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
      ] },
      { stepType: 'PROCESS', prompt: '$(3, 2)$', options: [
        { key: 'A', text: '$(3, 2)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(3, 4)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$y$ 합 안 나눔' },
        { key: 'C', text: '$(6, 4)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(4, 0)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '차' },
        { key: 'E', text: '$(2, 2)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '중점?', options: [
        { key: 'A', text: '$(3, 2)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(3, 4)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$(4, 0)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '차' },
        { key: 'D', text: '$(6, 4)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합' },
        { key: 'E', text: '$(2, 2)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '중점 $(3, 2)$.' },

  // Q5
  { chapterCode: CODE, difficulty: 'easy', concept: '원 중심', requiredSkills: SKILLS_CIRCLE_EQ,
    stem: '$(x-2)^2 + (y-3)^2 = 16$ 의 중심?',
    steps: [
      { stepType: 'CONCEPT', prompt: '표준형 $(x-a)^2 + (y-b)^2 = r^2$', options: [
        { key: 'A', text: '중심 $(a, b)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '중심 $(-a, -b)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$(x-a)$ 가 $a$ 만큼 평행이동' },
        { key: 'C', text: '중심 $(a, -b)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '원점', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x^2+y^2$ 형태 시' },
        { key: 'E', text: '$(b, a)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '바뀜' },
      ] },
      { stepType: 'PROCESS', prompt: '$a = 2, b = 3$', options: [
        { key: 'A', text: '$(2, 3)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(-2, -3)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$(2, -3)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(0, 0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$(3, 2)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '바뀜' },
      ] },
      { stepType: 'ANSWER', prompt: '중심?', options: [
        { key: 'A', text: '$(2, 3)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(-2, -3)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$(2, -3)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(0, 0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$(3, 2)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '바뀜' },
      ] },
    ], solution: '중심 $(2, 3)$.' },

  // Q6
  { chapterCode: CODE, difficulty: 'easy', concept: '원 반지름', requiredSkills: SKILLS_CIRCLE_EQ,
    stem: '$(x-2)^2 + (y-3)^2 = 16$ 의 반지름?',
    steps: [
      { stepType: 'CONCEPT', prompt: '우변 $= r^2$', options: [
        { key: 'A', text: '$r = \\sqrt{16}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$r = 16$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '제곱근 누락' },
        { key: 'C', text: '$r = 8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$16/2$' },
        { key: 'D', text: '$r = 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$r = 32$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\sqrt{16}$', options: [
        { key: 'A', text: '$4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$/2$' },
        { key: 'C', text: '$16$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '제곱근 누락' },
        { key: 'D', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\sqrt{8}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '반지름?', options: [
        { key: 'A', text: '$4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$16$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '제곱근 누락' },
        { key: 'C', text: '$8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$32$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$r = \\sqrt{16} = 4$.' },

  // Q7
  { chapterCode: CODE, difficulty: 'medium', concept: '내분점', requiredSkills: SKILLS_INT,
    stem: '$A(1, 0)$, $B(7, 0)$ 을 $1:2$ 로 내분?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$AB$ 를 $m:n$ 내분', options: [
        { key: 'A', text: '$((m x_2 + n x_1)/(m+n), \\ldots)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$((n x_2 + m x_1)/(m+n), \\ldots)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '계수 바뀜' },
        { key: 'C', text: '중점 공식', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$1:1$ 만' },
        { key: 'D', text: '$(m x_2 - n x_1)/(m-n)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '외분' },
        { key: 'E', text: '$(x_2 + x_1) / 2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '중점' },
      ] },
      { stepType: 'PROCESS', prompt: '$(1 \\cdot 7 + 2 \\cdot 1)/(1+2)$', options: [
        { key: 'A', text: '$9/3 = 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$2:1$' },
        { key: 'C', text: '$4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '중점' },
        { key: 'D', text: '$6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3:0$' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '내분점?', options: [
        { key: 'A', text: '$(3, 0)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(5, 0)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$2:1$' },
        { key: 'C', text: '$(4, 0)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '중점' },
        { key: 'D', text: '$(6, 0)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(2, 0)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$x = (1 \\cdot 7 + 2 \\cdot 1)/3 = 3$ → $(3, 0)$.' },

  // Q8
  { chapterCode: CODE, difficulty: 'medium', concept: '기울기', requiredSkills: SKILLS_SLOPE,
    stem: '두 점 $(1, 2)$, $(3, 6)$ 을 지나는 직선의 기울기?',
    steps: [
      { stepType: 'CONCEPT', prompt: '기울기 공식', options: [
        { key: 'A', text: '$(y_2 - y_1)/(x_2 - x_1)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(x_2 - x_1)/(y_2 - y_1)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '바뀜' },
        { key: 'C', text: '$(y_2 + y_1)/(x_2 + x_1)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
        { key: 'D', text: '$y_2 - y_1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x_2 \\cdot y_2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$(6-2)/(3-1)$', options: [
        { key: 'A', text: '$4/2 = 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '뒤집힘' },
        { key: 'C', text: '$8/4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합' },
        { key: 'D', text: '$4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 누락' },
        { key: 'E', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '기울기?', options: [
        { key: 'A', text: '$2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '뒤집힘' },
        { key: 'C', text: '$4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 누락' },
        { key: 'D', text: '$3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '기울기 $(6-2)/(3-1) = 2$.' },

  // Q9
  { chapterCode: CODE, difficulty: 'medium', concept: '점-기울기 식', requiredSkills: SKILLS_LINE_PT,
    stem: '기울기 $2$, 점 $(1, 3)$ 지나는 직선?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$y - y_1 = m(x - x_1)$', options: [
        { key: 'A', text: '$y - 3 = 2(x - 1)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y + 3 = 2(x + 1)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$y - 1 = 2(x - 3)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x, y$ 바뀜' },
        { key: 'D', text: '$y = 2x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '점 무시' },
        { key: 'E', text: '$y = 3x + 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$y - 3 = 2x - 2$', options: [
        { key: 'A', text: '$y = 2x + 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = 2x + 3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$-2 + 3 = 1$' },
        { key: 'C', text: '$y = 2x - 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$y = 2x - 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$y = 2x$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '직선?', options: [
        { key: 'A', text: '$y = 2x + 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = 2x + 3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$y = 2x - 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$y = 3x + 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$y = 2x$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$y - 3 = 2(x - 1) \\Rightarrow y = 2x + 1$.' },

  // Q10
  { chapterCode: CODE, difficulty: 'medium', concept: '두 점 직선', requiredSkills: SKILLS_LINE_PT,
    stem: '두 점 $(0, 1)$, $(2, 5)$ 지나는 직선?',
    steps: [
      { stepType: 'CONCEPT', prompt: '기울기 먼저', options: [
        { key: 'A', text: '$m = (5-1)/(2-0) = 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$m = 4$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 누락' },
        { key: 'C', text: '$m = 1/2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '뒤집힘' },
        { key: 'D', text: '$m = 6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합' },
        { key: 'E', text: '$m = 0$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$y - 1 = 2(x - 0)$', options: [
        { key: 'A', text: '$y = 2x + 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = 2x$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$+ 1$ 누락' },
        { key: 'C', text: '$y = 2x + 5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$y = 2x - 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$y = x + 1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '기울기' },
      ] },
      { stepType: 'ANSWER', prompt: '직선?', options: [
        { key: 'A', text: '$y = 2x + 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = 2x$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$y = 2x + 5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$y = x + 1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$y = 4x + 1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$m = 2$, $y$ 절편 $1$ → $y = 2x + 1$.' },

  // Q11
  { chapterCode: CODE, difficulty: 'medium', concept: '평행', requiredSkills: SKILLS_PAR,
    stem: '$y = 2x + 1$ 과 평행하고 $(0, 3)$ 지나는 직선?',
    steps: [
      { stepType: 'CONCEPT', prompt: '평행 → 기울기 같음', options: [
        { key: 'A', text: '$m = 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$m = -1/2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '수직' },
        { key: 'C', text: '$m = -2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$m = 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$m = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$(0, 3)$ 지남', options: [
        { key: 'A', text: '$y = 2x + 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = 2x + 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$(0,3)$ 미반영' },
        { key: 'C', text: '$y = -x/2 + 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '수직' },
        { key: 'D', text: '$y = 3x + 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '바뀜' },
        { key: 'E', text: '$y = 2x$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '직선?', options: [
        { key: 'A', text: '$y = 2x + 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = 2x + 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '동일직선' },
        { key: 'C', text: '$y = -x/2 + 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '수직' },
        { key: 'D', text: '$y = 3x + 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$y = 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '평행 → $m = 2$, $(0, 3)$ → $y = 2x + 3$.' },

  // Q12
  { chapterCode: CODE, difficulty: 'medium', concept: '수직', requiredSkills: SKILLS_PERP,
    stem: '$y = 2x + 1$ 과 수직하고 $(0, 0)$ 지나는 직선?',
    steps: [
      { stepType: 'CONCEPT', prompt: '수직 → 기울기 곱 $-1$', options: [
        { key: 'A', text: '$m = -1/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$m = 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평행' },
        { key: 'C', text: '$m = -2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$-1/2$ 가 맞음' },
        { key: 'D', text: '$m = 1/2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'E', text: '$m = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$(0, 0)$ 지남', options: [
        { key: 'A', text: '$y = -x/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = -x/2 + 1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '원점' },
        { key: 'C', text: '$y = -2x$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '기울기 잘못' },
        { key: 'D', text: '$y = 2x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평행' },
        { key: 'E', text: '$y = x/2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
      ] },
      { stepType: 'ANSWER', prompt: '직선?', options: [
        { key: 'A', text: '$y = -x/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = -2x$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '기울기' },
        { key: 'C', text: '$y = 2x$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평행' },
        { key: 'D', text: '$y = x/2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'E', text: '$y = -x/2 + 1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '수직 $m = -1/2$, 원점 → $y = -x/2$.' },

  // Q13
  { chapterCode: CODE, difficulty: 'medium', concept: '원점 원', requiredSkills: SKILLS_CIRCLE_EQ,
    stem: '$x^2 + y^2 = 25$ 의 중심과 반지름?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$x^2 + y^2 = r^2$ → 원점 원', options: [
        { key: 'A', text: '중심 $(0, 0)$, $r = \\sqrt{25}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '중심 $(25, 25)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$r = 25$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '제곱근 누락' },
        { key: 'D', text: '중심 $(5, 5)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\sqrt{25}$', options: [
        { key: 'A', text: '$5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$25$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '제곱근 누락' },
        { key: 'C', text: '$12.5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$/2$' },
        { key: 'D', text: '$\\sqrt{5}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$15$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '중심·반지름?', options: [
        { key: 'A', text: '$(0,0)$, $5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(0,0)$, $25$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '제곱근' },
        { key: 'C', text: '$(5,5)$, $5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$(25,0)$, $5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$(0,0)$, $5^2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '중심 $(0,0)$, $r = 5$.' },

  // Q14
  { chapterCode: CODE, difficulty: 'medium', concept: '점이 원 위', requiredSkills: SKILLS_CIRCLE_EQ,
    stem: '$P(3, 4)$ 가 원 $x^2 + y^2 = 25$ 위에 있는가?',
    steps: [
      { stepType: 'CONCEPT', prompt: '대입 검증', options: [
        { key: 'A', text: '$x^2 + y^2 = r^2$ 이면 위에', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x + y = r$ 이면 위에', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '항상 안에', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '점은 원에 속하지 않음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$9 + 16$', options: [
        { key: 'A', text: '$25 = 25$ → 위에', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$> 25$ → 바깥', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산' },
        { key: 'C', text: '$< 25$ → 안쪽', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산' },
        { key: 'D', text: '$7$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3+4$' },
        { key: 'E', text: '$12$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '결과?', options: [
        { key: 'A', text: '원 위에 있음', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '원 안', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산' },
        { key: 'C', text: '원 밖', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '계산' },
        { key: 'D', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
        { key: 'E', text: '원의 중심', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$9 + 16 = 25$ → 원 위에 있음.' },

  // Q15
  { chapterCode: CODE, difficulty: 'medium', concept: '원점과 직선 거리', requiredSkills: SKILLS_PT_LINE,
    stem: '원점과 직선 $3x + 4y - 5 = 0$ 의 거리?',
    steps: [
      { stepType: 'CONCEPT', prompt: '점-직선 거리 공식', options: [
        { key: 'A', text: '$|a x_0 + b y_0 + c| / \\sqrt{a^2 + b^2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$|c| / (a + b)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱근 누락' },
        { key: 'C', text: '$(a + b) / c$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$|c|$ 만', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '분모 누락' },
        { key: 'E', text: '$|x_0 + y_0|$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$|{-5}| / \\sqrt{9 + 16}$', options: [
        { key: 'A', text: '$5 / 5 = 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-5 / 5 = -1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '절댓값' },
        { key: 'C', text: '$5 / 25$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱근 누락' },
        { key: 'D', text: '$5 / 7$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '합' },
        { key: 'E', text: '$1/5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '거리?', options: [
        { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '절댓값' },
        { key: 'C', text: '$5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '분모 누락' },
        { key: 'D', text: '$1/5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$5/7$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$|{-5}| / 5 = 1$.' },

  // Q16 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '외분점', requiredSkills: SKILLS_EXT,
    stem: '$A(1, 2)$, $B(4, 8)$ 을 $2 : 1$ 로 외분?',
    steps: [
      { stepType: 'CONCEPT', prompt: '외분 공식', options: [
        { key: 'A', text: '$((m x_2 - n x_1)/(m - n), \\ldots)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$((m x_2 + n x_1)/(m + n))$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '내분' },
        { key: 'C', text: '$(x_1 + x_2)/2$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '중점' },
        { key: 'D', text: '$|x_2 - x_1|$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '거리' },
        { key: 'E', text: '$(m + n)/(x_2 - x_1)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$x = (2 \\cdot 4 - 1 \\cdot 1)/(2-1) = 7$, $y = (2 \\cdot 8 - 1 \\cdot 2)/1 = 14$', options: [
        { key: 'A', text: '$(7, 14)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(3, 6)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '내분' },
        { key: 'C', text: '$(2.5, 5)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '중점' },
        { key: 'D', text: '$(9, 18)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$mx_2 + nx_1$' },
        { key: 'E', text: '$(5, 10)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '외분점?', options: [
        { key: 'A', text: '$(7, 14)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(3, 6)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '내분' },
        { key: 'C', text: '$(2.5, 5)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '중점' },
        { key: 'D', text: '$(9, 18)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(5, 10)$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '외분 $(7, 14)$.' },

  // Q17 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '수직 조건으로 $m$', requiredSkills: SKILLS_PERP,
    stem: '두 직선 $y = 2x + 1$ 과 $y = mx + 3$ 이 수직일 때 $m$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '수직 조건', options: [
        { key: 'A', text: '$2 \\cdot m = -1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2 + m = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합 $= 0$ 아님' },
        { key: 'C', text: '$2 \\cdot m = 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '평행 $= 1$ 도 아님' },
        { key: 'D', text: '$2 = m$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평행' },
        { key: 'E', text: '$m = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$m = -1/2$', options: [
        { key: 'A', text: '$m = -1/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$m = 1/2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$m = -2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$m = 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평행' },
        { key: 'E', text: '$m = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$m$?', options: [
        { key: 'A', text: '$-1/2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1/2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$-2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평행' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$2m = -1 \\Rightarrow m = -1/2$.' },

  // Q18 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '점-직선 거리 (일반점)', requiredSkills: SKILLS_PT_LINE,
    stem: '점 $(1, 1)$ 과 직선 $3x + 4y - 12 = 0$ 의 거리?',
    steps: [
      { stepType: 'CONCEPT', prompt: '공식', options: [
        { key: 'A', text: '$|3 \\cdot 1 + 4 \\cdot 1 - 12| / \\sqrt{9 + 16}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$|3 + 4| / 12$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$|x_0 - y_0|$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$|c| / (a+b)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱근 누락' },
        { key: 'E', text: '$\\sqrt{x_0^2 + y_0^2}$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '원점 거리' },
      ] },
      { stepType: 'PROCESS', prompt: '$|{-5}| / 5$', options: [
        { key: 'A', text: '$5 / 5 = 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '절댓값' },
        { key: 'C', text: '$5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '분모 누락' },
        { key: 'D', text: '$1/5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$5/7$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '거리?', options: [
        { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$-1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '절댓값' },
        { key: 'C', text: '$5$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$1/5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$5/7$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$|3 + 4 - 12| / 5 = 1$.' },

  // Q19 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '원과 직선 접', requiredSkills: SKILLS_CIRCLE_LINE,
    stem: '원 $x^2 + y^2 = 9$ 와 직선 $y = x + k$ 가 접하기 위한 $k$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '접 조건', options: [
        { key: 'A', text: '중심에서 직선까지 거리 $=$ 반지름', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '직선이 원점 통과', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '거리 $<$ 반지름', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '서로 다른 두 점' },
        { key: 'D', text: '거리 $>$ 반지름', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '안 만남' },
        { key: 'E', text: '$k = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$x - y + k = 0$. 거리 $= |k|/\\sqrt{2} = 3$', options: [
        { key: 'A', text: '$|k| = 3\\sqrt{2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$|k| = 3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\sqrt{2}$ 누락' },
        { key: 'C', text: '$|k| = 6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$k = 9$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$k = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$k$?', options: [
        { key: 'A', text: '$\\pm 3\\sqrt{2}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3\\sqrt{2}$ 만', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$\\pm$' },
        { key: 'C', text: '$\\pm 3$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$\\sqrt{2}$ 누락' },
        { key: 'D', text: '$\\pm 6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$|k|/\\sqrt{2} = 3 \\Rightarrow k = \\pm 3\\sqrt{2}$.' },

  // Q20 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '중심·반지름으로 식 구성', requiredSkills: SKILLS_CIRCLE_EQ,
    stem: '중심 $(2, 3)$, 반지름 $5$ 인 원의 방정식?',
    steps: [
      { stepType: 'CONCEPT', prompt: '표준형', options: [
        { key: 'A', text: '$(x - a)^2 + (y - b)^2 = r^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(x + a)^2 + (y + b)^2 = r^2$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'C', text: '$x^2 + y^2 = a^2 + b^2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$x + y = r$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '직선' },
        { key: 'E', text: '$xy = r$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '대입', options: [
        { key: 'A', text: '$(x-2)^2 + (y-3)^2 = 25$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(x-2)^2 + (y-3)^2 = 5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$r^2$ 누락' },
        { key: 'C', text: '$(x+2)^2 + (y+3)^2 = 25$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'D', text: '$x^2 + y^2 = 25$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원점 원' },
        { key: 'E', text: '$(x-3)^2 + (y-2)^2 = 25$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$a,b$ 바뀜' },
      ] },
      { stepType: 'ANSWER', prompt: '식?', options: [
        { key: 'A', text: '$(x-2)^2 + (y-3)^2 = 25$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(x-2)^2 + (y-3)^2 = 5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$r^2$ 누락' },
        { key: 'C', text: '$(x+2)^2 + (y+3)^2 = 25$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '부호' },
        { key: 'D', text: '$x^2 + y^2 = 25$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원점 원' },
        { key: 'E', text: '$(x-3)^2 + (y-2)^2 = 25$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '바뀜' },
      ] },
    ], solution: '$(x-2)^2 + (y-3)^2 = 25$.' },
];

export const K_G10_CS2_CH01_COORD_FIG_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
