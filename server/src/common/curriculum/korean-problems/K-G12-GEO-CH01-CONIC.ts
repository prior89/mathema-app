/**
 * K-G12-GEO-CH01-CONIC (이차곡선) — 20문제 3-step Mastery.
 * 고3 기하 — 포물선 ($y^2 = 4px$: 초점 $(p,0)$, 준선 $x = -p$) →
 *   타원 ($x^2/a^2 + y^2/b^2 = 1$: $c^2 = a^2 - b^2$) →
 *   쌍곡선 ($x^2/a^2 - y^2/b^2 = 1$: $c^2 = a^2 + b^2$, 점근선 $y = \\pm(b/a) x$).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 * 주요 errorCode:
 *   FORMULA_SELECTION_ERROR 8 / ALGEBRA_ERROR 6
 *   SIGN_ERROR 3 / CONCEPT_MISUNDERSTANDING 3
 *
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G12-GEO-CH01-CONIC';
const SKILLS_PARAB = ['parabola_focus_directrix'];
const SKILLS_ELLIPSE = ['ellipse_foci_axes'];
const SKILLS_HYPERBOLA = ['hyperbola_foci_asymptote'];
const SKILLS_DEF = ['conic_definition'];

const problems: KoreanProblemSeed[] = [
  // Q1
  { chapterCode: CODE, difficulty: 'easy', concept: '$y^2=4x$ 초점', requiredSkills: SKILLS_PARAB,
    stem: '포물선 $y^2 = 4x$ 의 초점?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$y^2 = 4px$ → 초점 $(p, 0)$', options: [
        { key: 'A', text: '$4p = 4, p = 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$p = 4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$p = 1/4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$p = 2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$p = 0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '초점 $(p, 0)$', options: [
        { key: 'A', text: '$(1, 0)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(4, 0)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$p$ 잘못' },
        { key: 'C', text: '$(0, 1)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x^2 = 4py$ 시' },
        { key: 'D', text: '$(-1, 0)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '준선' },
        { key: 'E', text: '$(0, 0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '꼭짓점' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$(1, 0)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(4, 0)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$(0, 1)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$(-1, 0)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '준선' },
        { key: 'E', text: '$(0, 0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$4p = 4, p = 1$ → 초점 $(1, 0)$.' },

  // Q2
  { chapterCode: CODE, difficulty: 'easy', concept: '$y^2=4x$ 준선', requiredSkills: SKILLS_PARAB,
    stem: '$y^2 = 4x$ 의 준선?',
    steps: [
      { stepType: 'CONCEPT', prompt: '준선 $x = -p$', options: [
        { key: 'A', text: '$x = -1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '초점' },
        { key: 'C', text: '$y = -1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$x = -4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$x = -1$', options: [
        { key: 'A', text: '$x = -1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$y = -1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$x = -4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$x = -1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$y = -1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$x = -4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$x = -1$.' },

  // Q3
  { chapterCode: CODE, difficulty: 'easy', concept: '타원 $a, b$', requiredSkills: SKILLS_ELLIPSE,
    stem: '$x^2/9 + y^2/4 = 1$ 의 $a, b$?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$a^2 = 9, b^2 = 4$', options: [
        { key: 'A', text: '$a = 3, b = 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a = 9, b = 4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '제곱근 누락' },
        { key: 'C', text: '$a = 2, b = 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '바뀜' },
        { key: 'D', text: '$a = b = 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$a = 4, b = 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '제곱근', options: [
        { key: 'A', text: '$a = 3, b = 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a = 9, b = 4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$a = 2, b = 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$a = b = 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$a = 4, b = 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$a = 3, b = 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a = 9, b = 4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$a = 2, b = 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '바뀜' },
        { key: 'D', text: '$a = b = 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$a = 4, b = 5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$a = 3, b = 2$.' },

  // Q4
  { chapterCode: CODE, difficulty: 'easy', concept: '타원 장축', requiredSkills: SKILLS_ELLIPSE,
    stem: '같은 타원 ($a = 3$) 의 장축 길이?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$2a$', options: [
        { key: 'A', text: '$2 \\cdot 3 = 6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3$ (반장축)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\times 2$' },
        { key: 'C', text: '$9$ ($a^2$)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2b = 4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '단축' },
        { key: 'E', text: '$5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$6$', options: [
        { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$9$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$9$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$2a = 6$.' },

  // Q5
  { chapterCode: CODE, difficulty: 'easy', concept: '쌍곡선 점근선', requiredSkills: SKILLS_HYPERBOLA,
    stem: '$x^2/9 - y^2/16 = 1$ 의 점근선?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$y = \\pm (b/a) x$', options: [
        { key: 'A', text: '$y = \\pm (4/3) x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = \\pm (3/4) x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '뒤집힘' },
        { key: 'C', text: '$y = \\pm 4x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$y = \\pm 3x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$y = \\pm (16/9) x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱 그대로' },
      ] },
      { stepType: 'PROCESS', prompt: '$a = 3, b = 4$', options: [
        { key: 'A', text: '$y = \\pm (4/3) x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = \\pm (3/4) x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$y = \\pm 4x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$y = \\pm 3x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$y = \\pm (16/9) x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$y = \\pm (4/3) x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = \\pm (3/4) x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$y = \\pm 4x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$y = \\pm 3x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$y = \\pm (16/9) x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$y = \\pm (b/a) x = \\pm (4/3) x$.' },

  // Q6
  { chapterCode: CODE, difficulty: 'easy', concept: '포물선 표준형', requiredSkills: SKILLS_PARAB,
    stem: '$y^2 = 4px$ 의 초점 좌표?',
    steps: [
      { stepType: 'CONCEPT', prompt: '꼭짓점 원점, 축 $x$', options: [
        { key: 'A', text: '$(p, 0)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(0, p)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$x^2 = 4py$' },
        { key: 'C', text: '$(2p, 0)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(4p, 0)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(-p, 0)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '준선' },
      ] },
      { stepType: 'PROCESS', prompt: '$(p, 0)$', options: [
        { key: 'A', text: '$(p, 0)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(0, p)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$(2p, 0)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(4p, 0)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(-p, 0)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$(p, 0)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(0, p)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$(2p, 0)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(4p, 0)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(-p, 0)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$(p, 0)$.' },

  // Q7
  { chapterCode: CODE, difficulty: 'medium', concept: '$y^2 = 8x$ 초점', requiredSkills: SKILLS_PARAB,
    stem: '$y^2 = 8x$ 의 초점?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$4p = 8, p = 2$', options: [
        { key: 'A', text: '$p = 2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$p = 8$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$4p$' },
        { key: 'C', text: '$p = 4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$p = 1/2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '뒤집힘' },
        { key: 'E', text: '$p = 16$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$(2, 0)$', options: [
        { key: 'A', text: '$(2, 0)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(8, 0)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$(0, 2)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$(4, 0)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(-2, 0)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '준선' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$(2, 0)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(8, 0)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$(0, 2)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$(4, 0)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(-2, 0)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$p = 2$ → $(2, 0)$.' },

  // Q8
  { chapterCode: CODE, difficulty: 'medium', concept: '$x^2 = 4y$ 초점', requiredSkills: SKILLS_PARAB,
    stem: '$x^2 = 4y$ 의 초점?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$x^2 = 4py$: 초점 $(0, p)$', options: [
        { key: 'A', text: '$p = 1$, $(0, 1)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(1, 0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '축 방향' },
        { key: 'C', text: '$(0, 4)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(0, -1)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '준선' },
        { key: 'E', text: '$(0, 0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '꼭짓점' },
      ] },
      { stepType: 'PROCESS', prompt: '$(0, 1)$', options: [
        { key: 'A', text: '$(0, 1)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(1, 0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$(0, 4)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(0, -1)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(0, 0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$(0, 1)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(1, 0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$(0, 4)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$(0, -1)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(0, 0)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$(0, 1)$.' },

  // Q9
  { chapterCode: CODE, difficulty: 'medium', concept: '타원 초점', requiredSkills: SKILLS_ELLIPSE,
    stem: '$x^2/25 + y^2/9 = 1$ 의 초점?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$c^2 = a^2 - b^2$ ($a > b$)', options: [
        { key: 'A', text: '$c^2 = 25 - 9 = 16$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$c^2 = 25 + 9$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '쌍곡선' },
        { key: 'C', text: '$c = 25 - 9$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '제곱' },
        { key: 'D', text: '$c = a + b$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$c = a$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$c = 4$, 초점 $(\\pm 4, 0)$', options: [
        { key: 'A', text: '$(\\pm 4, 0)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(\\pm \\sqrt{34}, 0)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '쌍곡선 식' },
        { key: 'C', text: '$(0, \\pm 4)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '단축' },
        { key: 'D', text: '$(\\pm 16, 0)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '제곱 그대로' },
        { key: 'E', text: '$(\\pm 5, 0)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$a$' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$(\\pm 4, 0)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(\\pm \\sqrt{34}, 0)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$(0, \\pm 4)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$(\\pm 16, 0)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(\\pm 5, 0)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$c^2 = 16, c = 4$ → $(\\pm 4, 0)$.' },

  // Q10
  { chapterCode: CODE, difficulty: 'medium', concept: '타원 정의', requiredSkills: SKILLS_DEF,
    stem: '타원의 정의?',
    steps: [
      { stepType: 'CONCEPT', prompt: '두 초점에서의 거리 ...', options: [
        { key: 'A', text: '두 초점에서 거리의 합이 일정', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '두 초점에서 거리의 차의 절댓값 일정', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '쌍곡선' },
        { key: 'C', text: '한 점에서 거리와 한 직선에서 거리 같음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '포물선' },
        { key: 'D', text: '한 점에서 거리 일정', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$|PF| + |PF^{\\prime}| = $ 상수', options: [
        { key: 'A', text: '거리 합 일정', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '거리 차 일정', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '쌍곡선' },
        { key: 'C', text: '거리 곱 일정', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '거리 = 직선거리', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '포물선' },
        { key: 'E', text: '거리 같음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '거리 합 일정', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '거리 차 일정', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '쌍곡선' },
        { key: 'C', text: '거리 곱 일정', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '거리 = 직선거리', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '포물선' },
        { key: 'E', text: '거리 같음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '두 초점에서의 거리의 합이 일정.' },

  // Q11
  { chapterCode: CODE, difficulty: 'medium', concept: '쌍곡선 정의', requiredSkills: SKILLS_DEF,
    stem: '쌍곡선의 정의?',
    steps: [
      { stepType: 'CONCEPT', prompt: '거리 차', options: [
        { key: 'A', text: '두 초점에서 거리의 차의 절댓값 일정', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '거리의 합 일정', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '타원' },
        { key: 'C', text: '한 점에서 거리 일정', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원' },
        { key: 'D', text: '한 점·한 직선 거리 동일', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '포물선' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$||PF| - |PF^{\\prime}|| = $ 상수', options: [
        { key: 'A', text: '거리 차 절댓값 일정', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '합 일정', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '타원' },
        { key: 'C', text: '곱 일정', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '동일', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '직선거리 동일', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '거리 차 절댓값 일정', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '거리 합 일정', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '타원' },
        { key: 'C', text: '거리 곱 일정', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '거리 동일', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
    ], solution: '두 초점에서의 거리의 차의 절댓값이 일정.' },

  // Q12
  { chapterCode: CODE, difficulty: 'medium', concept: '장축 방향 ($b > a$)', requiredSkills: SKILLS_ELLIPSE,
    stem: '$x^2/16 + y^2/25 = 1$ 의 장축 방향?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$25 > 16$ → $y$ 분모가 큼', options: [
        { key: 'A', text: '$y$ 축', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x$ 축', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '분모 큰 쪽 = 장축' },
        { key: 'C', text: '$45°$ 방향', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$y$축 방향', options: [
        { key: 'A', text: '$y$ 축', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x$ 축', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '대각', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$x = y$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$y$ 축', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x$ 축', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '대각', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$x = y$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: '$y$ 분모가 더 크므로 장축은 $y$ 축 방향.' },

  // Q13
  { chapterCode: CODE, difficulty: 'medium', concept: '쌍곡선 초점', requiredSkills: SKILLS_HYPERBOLA,
    stem: '$x^2/9 - y^2/16 = 1$ 의 초점?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$c^2 = a^2 + b^2$ (쌍곡선)', options: [
        { key: 'A', text: '$c^2 = 9 + 16 = 25$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$c^2 = 9 - 16$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '타원' },
        { key: 'C', text: '$c = a$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$c = b$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$c = 0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$c = 5$, $(\\pm 5, 0)$', options: [
        { key: 'A', text: '$(\\pm 5, 0)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(\\pm \\sqrt{7}, 0)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '타원' },
        { key: 'C', text: '$(0, \\pm 5)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$(\\pm 3, 0)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$a$' },
        { key: 'E', text: '$(\\pm 4, 0)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$b$' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$(\\pm 5, 0)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(\\pm \\sqrt{7}, 0)$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$(0, \\pm 5)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$(\\pm 3, 0)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(\\pm 4, 0)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$c^2 = 25, c = 5$ → $(\\pm 5, 0)$.' },

  // Q14
  { chapterCode: CODE, difficulty: 'medium', concept: '포물선 정의', requiredSkills: SKILLS_DEF,
    stem: '포물선의 정의?',
    steps: [
      { stepType: 'CONCEPT', prompt: '초점·준선', options: [
        { key: 'A', text: '한 점(초점)에서 거리 = 한 직선(준선)에서 거리', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '두 초점 거리 합 일정', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '타원' },
        { key: 'C', text: '두 초점 거리 차 일정', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '쌍곡선' },
        { key: 'D', text: '한 점 거리 일정', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '거리 동일', options: [
        { key: 'A', text: '$|PF| = $ 거리(P, 준선)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$|PF_1| + |PF_2|$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '타원' },
        { key: 'C', text: '$|PF_1| - |PF_2|$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '쌍곡선' },
        { key: 'D', text: '$|PF|$ 만', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원' },
        { key: 'E', text: '$|PF|^2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '초점 거리 = 준선 거리', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '두 초점 거리 합', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '타원' },
        { key: 'C', text: '두 초점 거리 차', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '쌍곡선' },
        { key: 'D', text: '한 점 거리 일정', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '가능' },
      ] },
    ], solution: '한 점(초점)과 한 직선(준선)에서 같은 거리.' },

  // Q15
  { chapterCode: CODE, difficulty: 'medium', concept: '타원 단축', requiredSkills: SKILLS_ELLIPSE,
    stem: '$x^2/25 + y^2/16 = 1$ 의 단축 길이?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$b = 4$, 단축 $= 2b$', options: [
        { key: 'A', text: '$2 \\cdot 4 = 8$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4$ (반단축)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\times 2$' },
        { key: 'C', text: '$16$ ($b^2$)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$2a = 10$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '장축' },
        { key: 'E', text: '$\\sqrt{16} = 4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$8$', options: [
        { key: 'A', text: '$8$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$16$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$10$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$8$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$16$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$10$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$2b = 8$.' },

  // Q16 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '$y^2 = 12x$ 준선', requiredSkills: SKILLS_PARAB,
    stem: '$y^2 = 12x$ 의 준선?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$4p = 12, p = 3$', options: [
        { key: 'A', text: '$x = -3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '초점' },
        { key: 'C', text: '$x = -12$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$4p$' },
        { key: 'D', text: '$y = -3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '축' },
        { key: 'E', text: '$x = -6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$x = -p = -3$', options: [
        { key: 'A', text: '$x = -3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$x = -12$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$y = -3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$x = -6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$x = -3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x = 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$x = -12$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$y = -3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$x = -6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$4p = 12, p = 3 \\Rightarrow x = -3$.' },

  // Q17 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '타원 $c$ 계산', requiredSkills: SKILLS_ELLIPSE,
    stem: '$x^2/4 + y^2 = 1$ 의 초점?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$a^2 = 4, b^2 = 1, c^2 = 4 - 1 = 3$', options: [
        { key: 'A', text: '$c = \\sqrt{3}$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$c = 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '제곱근' },
        { key: 'C', text: '$c = \\sqrt{5}$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '쌍곡선' },
        { key: 'D', text: '$c = 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$c = 2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$(\\pm \\sqrt{3}, 0)$', options: [
        { key: 'A', text: '$(\\pm \\sqrt{3}, 0)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(\\pm 3, 0)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$(0, \\pm \\sqrt{3})$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$(\\pm \\sqrt{5}, 0)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(\\pm 2, 0)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$(\\pm \\sqrt{3}, 0)$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$(\\pm 3, 0)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$(0, \\pm \\sqrt{3})$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$(\\pm \\sqrt{5}, 0)$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$(\\pm 2, 0)$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$c = \\sqrt{3}$ → $(\\pm \\sqrt{3}, 0)$.' },

  // Q18 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '쌍곡선 점근선 (다른 값)', requiredSkills: SKILLS_HYPERBOLA,
    stem: '$x^2/16 - y^2/9 = 1$ 의 점근선?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$y = \\pm (b/a) x$, $a = 4, b = 3$', options: [
        { key: 'A', text: '$y = \\pm (3/4) x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = \\pm (4/3) x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '뒤집힘' },
        { key: 'C', text: '$y = \\pm 3x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$y = \\pm 4x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$y = \\pm (9/16) x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '제곱 그대로' },
      ] },
      { stepType: 'PROCESS', prompt: '$3/4$', options: [
        { key: 'A', text: '$y = \\pm (3/4) x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = \\pm (4/3) x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$y = \\pm 3x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$y = \\pm 4x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$y = 0$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$y = \\pm (3/4) x$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$y = \\pm (4/3) x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$y = \\pm 3x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$y = \\pm 4x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$y = \\pm (9/16) x$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$y = \\pm (3/4) x$.' },

  // Q19 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '타원 식 구성 ($y$축 장축)', requiredSkills: SKILLS_ELLIPSE,
    stem: '초점 $(0, \\pm 3)$, 단축 $4$ 인 타원의 식?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$y$축 장축: $x^2/b^2 + y^2/a^2 = 1$, $c = 3, 2b = 4 \\Rightarrow b = 2$', options: [
        { key: 'A', text: '$a^2 = b^2 + c^2 = 4 + 9 = 13$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$a^2 = c^2 - b^2 = 5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$a = 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$c$' },
        { key: 'D', text: '$a = 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$b$' },
        { key: 'E', text: '$a = 4$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$x^2/4 + y^2/13 = 1$', options: [
        { key: 'A', text: '$x^2/4 + y^2/13 = 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^2/13 + y^2/4 = 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '바뀜' },
        { key: 'C', text: '$x^2/4 + y^2/5 = 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x^2/9 + y^2/4 = 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x^2/4 - y^2/13 = 1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '쌍곡선' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$x^2/4 + y^2/13 = 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^2/13 + y^2/4 = 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '$x^2/4 + y^2/5 = 1$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$x^2/9 + y^2/4 = 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x^2/4 - y^2/13 = 1$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$b = 2, c = 3, a^2 = 13$ → $x^2/4 + y^2/13 = 1$.' },

  // Q20 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '정의로 타원 식', requiredSkills: SKILLS_DEF,
    stem: '두 초점 $F(2, 0), F^{\\prime}(-2, 0)$, $|PF| + |PF^{\\prime}| = 6$. 타원 방정식?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$2a = 6 \\Rightarrow a = 3, c = 2$', options: [
        { key: 'A', text: '$b^2 = a^2 - c^2 = 9 - 4 = 5$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$b^2 = c^2 - a^2 = -5$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '$a > c$' },
        { key: 'C', text: '$b = a$', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$b = c = 2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '$a = 6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$2a$ 잘못' },
      ] },
      { stepType: 'PROCESS', prompt: '$x^2/9 + y^2/5 = 1$', options: [
        { key: 'A', text: '$x^2/9 + y^2/5 = 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^2/9 + y^2/4 = 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$b^2$ 잘못' },
        { key: 'C', text: '$x^2/4 + y^2/9 = 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$x^2/36 + y^2/4 = 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$2a$ 자체' },
        { key: 'E', text: '$x^2 + y^2 = 9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원' },
      ] },
      { stepType: 'ANSWER', prompt: '?', options: [
        { key: 'A', text: '$x^2/9 + y^2/5 = 1$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$x^2/9 + y^2/4 = 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$x^2/4 + y^2/9 = 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '$x^2/36 + y^2/4 = 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x^2 + y^2 = 9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '원' },
      ] },
    ], solution: '$a = 3, c = 2, b^2 = 5$ → $x^2/9 + y^2/5 = 1$.' },
];

export const K_G12_GEO_CH01_CONIC_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
