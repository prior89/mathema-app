/**
 * K-G11-STAT-CH02-PROBABILITY — STUDY pool (single-step, 20문제).
 * 확률 — 표본공간, 여사건, 합사건, 배반사건, 조건부확률, 독립, 곱셈정리.
 * Mastery 3-step과 별도 변형 문제. 고2 확률과 통계 (G11).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5. LLM 미사용.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G11-STAT-CH02-PROBABILITY';
const SKILLS_DEF = ['probability_definition'];
const SKILLS_RANGE = ['probability_range'];
const SKILLS_COMP = ['complement_event'];
const SKILLS_UNION = ['union_event'];
const SKILLS_MUTEX = ['mutually_exclusive'];
const SKILLS_COND = ['conditional_probability'];
const SKILLS_INDEP = ['independent_events'];
const SKILLS_MULT = ['multiplication_rule'];
const SKILLS_SAMPLE = ['sample_space'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) 동전 뒷면
  { chapterCode: CODE, difficulty: 'easy', concept: '동전 뒷면', requiredSkills: SKILLS_DEF,
    stem: '동전 $1$ 번 던질 때 뒷면이 나올 확률?',
    options: [
      { key: 'A', text: '$\\dfrac{1}{2}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$P(S)$' },
      { key: 'C', text: '$\\dfrac{1}{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$P(\\emptyset)$' },
      { key: 'E', text: '$2$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '범위 벗어남' },
    ],
    solution: '뒷면 $= 1$ 가지 / 전체 $2$ 가지 $= \\dfrac{1}{2}$.' },

  // S2 (쉬움) 주사위 5
  { chapterCode: CODE, difficulty: 'easy', concept: '주사위 5', requiredSkills: SKILLS_DEF,
    stem: '주사위 던져 $5$ 가 나올 확률?',
    options: [
      { key: 'A', text: '$\\dfrac{1}{6}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{5}{6}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '여사건' },
      { key: 'C', text: '$\\dfrac{1}{5}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '동전' },
      { key: 'E', text: '$5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '범위 벗어남' },
    ],
    solution: '$\\dfrac{1}{6}$.' },

  // S3 (쉬움) 여사건 0.4
  { chapterCode: CODE, difficulty: 'easy', concept: '여사건 $0.4$', requiredSkills: SKILLS_COMP,
    stem: '$P(A) = 0.6$ 일 때 $P(A^c) = ?$',
    options: [
      { key: 'A', text: '$0.4$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0.6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$P(A)$ 자체' },
      { key: 'C', text: '$1.6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$1 + P(A)$' },
      { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$-0.6$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '음수 불가' },
    ],
    solution: '$P(A^c) = 1 - P(A) = 1 - 0.6 = 0.4$.' },

  // S4 (쉬움) P(S) = 1
  { chapterCode: CODE, difficulty: 'easy', concept: '전체 확률', requiredSkills: SKILLS_RANGE,
    stem: '$P(S)$ (전체 표본공간) $= ?$',
    options: [
      { key: 'A', text: '$1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$P(\\emptyset)$' },
      { key: 'C', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$n$ (원소 수)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$\\infty$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '전체 표본공간의 확률은 항상 $1$.' },

  // S5 (쉬움) 표본공간 정의
  { chapterCode: CODE, difficulty: 'easy', concept: '표본공간 정의', requiredSkills: SKILLS_SAMPLE,
    stem: '시행에서 표본공간 $S$ 의 정의?',
    options: [
      { key: 'A', text: '시행에서 일어날 수 있는 모든 결과의 집합', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '특정 결과만 모은 집합', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '사건' },
      { key: 'C', text: '결과의 개수', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$n(S)$' },
      { key: 'D', text: '확률의 합', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '빈 집합', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\emptyset$' },
    ],
    solution: '표본공간 = 시행 결과 전체의 집합.' },

  // S6 (쉬움) 확률 범위
  { chapterCode: CODE, difficulty: 'easy', concept: '확률 범위', requiredSkills: SKILLS_RANGE,
    stem: '확률 $P(A)$ 가 가질 수 있는 값의 범위?',
    options: [
      { key: 'A', text: '$0 \\leq P(A) \\leq 1$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0 < P(A) < 1$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '경계 포함' },
      { key: 'C', text: '$-1 \\leq P(A) \\leq 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '음수 불가' },
      { key: 'D', text: '$0 \\leq P(A)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '상한 누락' },
      { key: 'E', text: '$P(A) = 1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '한 값' },
    ],
    solution: '$0 \\leq P(A) \\leq 1$.' },

  // S7 (중) 주사위 홀수
  { chapterCode: CODE, difficulty: 'medium', concept: '주사위 홀수', requiredSkills: SKILLS_DEF,
    stem: '주사위 던져 홀수가 나올 확률?',
    options: [
      { key: 'A', text: '$\\dfrac{1}{2}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{1}{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'C', text: '$\\dfrac{1}{6}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '한 값' },
      { key: 'D', text: '$3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '개수' },
      { key: 'E', text: '$\\dfrac{2}{3}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '홀수 $\\{1, 3, 5\\}$ → $\\dfrac{3}{6} = \\dfrac{1}{2}$.' },

  // S8 (중) 카드 스페이드
  { chapterCode: CODE, difficulty: 'medium', concept: '카드 스페이드', requiredSkills: SKILLS_DEF,
    stem: '$52$ 장 카드 중 한 장 뽑기. 스페이드일 확률?',
    options: [
      { key: 'A', text: '$\\dfrac{1}{4}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{1}{13}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '한 숫자' },
      { key: 'C', text: '$\\dfrac{13}{52}$ $= \\dfrac{1}{2}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'D', text: '$\\dfrac{1}{52}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '특정 카드' },
      { key: 'E', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '스페이드 $13$ 장 / $52$ 장 $= \\dfrac{1}{4}$.' },

  // S9 (중) 두 주사위 합 8
  { chapterCode: CODE, difficulty: 'medium', concept: '두 주사위 합 $8$', requiredSkills: SKILLS_DEF,
    stem: '주사위 두 개 던질 때 합이 $8$ 일 확률?',
    options: [
      { key: 'A', text: '$\\dfrac{5}{36}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{6}{36}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합 7' },
      { key: 'C', text: '$\\dfrac{1}{8}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$\\dfrac{4}{36}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합 5 또는 9' },
      { key: 'E', text: '$\\dfrac{8}{36}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '합 $8$: $(2,6), (3,5), (4,4), (5,3), (6,2)$ → $5$ 가지. $\\dfrac{5}{36}$.' },

  // S10 (중) 합사건 공식
  { chapterCode: CODE, difficulty: 'medium', concept: '$P(A \\cup B)$', requiredSkills: SKILLS_UNION,
    stem: '$P(A) = 0.5, P(B) = 0.3, P(A \\cap B) = 0.1$. $P(A \\cup B) = ?$',
    options: [
      { key: 'A', text: '$0.7$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0.8$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$P(A \\cap B)$ 안 뺌' },
      { key: 'C', text: '$0.15$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곱' },
      { key: 'D', text: '$0.4$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '잘못' },
      { key: 'E', text: '$0.9$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '$P(A \\cup B) = P(A) + P(B) - P(A \\cap B) = 0.5 + 0.3 - 0.1 = 0.7$.' },

  // S11 (중) 배반
  { chapterCode: CODE, difficulty: 'medium', concept: '배반사건 합', requiredSkills: SKILLS_MUTEX,
    stem: '$P(A) = 0.2, P(B) = 0.5$, $A, B$ 배반. $P(A \\cup B) = ?$',
    options: [
      { key: 'A', text: '$0.7$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$0.1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '곱' },
      { key: 'C', text: '$0.6$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'D', text: '$0.5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$P(B)$' },
      { key: 'E', text: '$1$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '배반: $P(A \\cap B) = 0$. $P(A \\cup B) = 0.2 + 0.5 = 0.7$.' },

  // S12 (중) 조건부확률
  { chapterCode: CODE, difficulty: 'medium', concept: '조건부확률', requiredSkills: SKILLS_COND,
    stem: '$P(A) = 0.4, P(A \\cap B) = 0.1$. $P(B|A) = ?$',
    options: [
      { key: 'A', text: '$\\dfrac{1}{4}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{1}{10}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$P(A \\cap B)$ 자체' },
      { key: 'C', text: '$\\dfrac{2}{5}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$P(A)$' },
      { key: 'D', text: '$\\dfrac{4}{10}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '뒤집음' },
      { key: 'E', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
    ],
    solution: '$P(B|A) = \\dfrac{P(A \\cap B)}{P(A)} = \\dfrac{0.1}{0.4} = \\dfrac{1}{4}$.' },

  // S13 (중) 독립과 P(B|A)
  { chapterCode: CODE, difficulty: 'medium', concept: '독립과 $P(B|A)$', requiredSkills: SKILLS_INDEP,
    stem: '$A, B$ 가 독립일 때 $P(B|A) = ?$',
    options: [
      { key: 'A', text: '$P(B)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$P(A)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '뒤집음' },
      { key: 'C', text: '$P(A) \\cdot P(B)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$P(A \\cap B)$' },
      { key: 'D', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '배반' },
      { key: 'E', text: '$1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '독립이면 $A$ 가 일어났다는 정보가 $B$ 의 확률에 영향 X. $P(B|A) = P(B)$.' },

  // S14 (중) 독립 곱
  { chapterCode: CODE, difficulty: 'medium', concept: '독립 곱', requiredSkills: SKILLS_INDEP,
    stem: '$P(A) = 0.6, P(B) = 0.5$, $A, B$ 독립. $P(A \\cap B) = ?$',
    options: [
      { key: 'A', text: '$0.3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$1.1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합' },
      { key: 'C', text: '$0.1$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'D', text: '$0.6$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '배반' },
    ],
    solution: '독립: $P(A \\cap B) = P(A) \\cdot P(B) = 0.6 \\cdot 0.5 = 0.3$.' },

  // S15 (중) 곱셈정리 변형
  { chapterCode: CODE, difficulty: 'medium', concept: '곱셈정리 ($B$ 기준)', requiredSkills: SKILLS_MULT,
    stem: '$P(A \\cap B) = ?$ ($B$ 기준 조건부확률 이용)',
    options: [
      { key: 'A', text: '$P(B) \\cdot P(A|B)$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$P(A) + P(B)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\cup$' },
      { key: 'C', text: '$P(A) \\cdot P(B)$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '독립 가정 필요' },
      { key: 'D', text: '$P(B|A)$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$\\dfrac{P(A)}{P(B)}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '곱셈정리: $P(A \\cap B) = P(B) \\cdot P(A|B) = P(A) \\cdot P(B|A)$.' },

  // S16 (어려움) 비복원 검·검
  { chapterCode: CODE, difficulty: 'hard', concept: '비복원 (검 둘)', requiredSkills: SKILLS_MULT,
    stem: '항아리에 흰 $6$, 검 $4$. 비복원 $2$ 개 추출. 둘 다 검정?',
    options: [
      { key: 'A', text: '$\\dfrac{2}{15}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{4}{25}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '복원' },
      { key: 'C', text: '$\\dfrac{1}{5}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'D', text: '$\\dfrac{12}{45}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '약분 X' },
      { key: 'E', text: '$\\dfrac{1}{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$\\dfrac{4}{10} \\cdot \\dfrac{3}{9} = \\dfrac{12}{90} = \\dfrac{2}{15}$.' },

  // S17 (어려움) 동전 4번 앞면 3번
  { chapterCode: CODE, difficulty: 'hard', concept: '동전 4번 앞면 3번', requiredSkills: SKILLS_DEF,
    stem: '동전 $4$ 번 던질 때 앞면이 정확히 $3$ 번?',
    options: [
      { key: 'A', text: '$\\dfrac{1}{4}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{3}{8}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '3번 던질 때' },
      { key: 'C', text: '$\\dfrac{1}{16}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '한 결과만' },
      { key: 'D', text: '$\\dfrac{3}{16}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
      { key: 'E', text: '$\\dfrac{3}{4}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '잘못' },
    ],
    solution: '$\\dfrac{_4C_3}{2^4} = \\dfrac{4}{16} = \\dfrac{1}{4}$.' },

  // S18 (어려움) 독립 판정
  { chapterCode: CODE, difficulty: 'hard', concept: '독립 판정', requiredSkills: SKILLS_INDEP,
    stem: '$P(A) = 0.4, P(B) = 0.5, P(A \\cap B) = 0.15$. $A, B$ 독립인가?',
    options: [
      { key: 'A', text: '독립 아님 ($P(A) P(B) = 0.2 \\neq 0.15$)', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '독립 ($P(A) P(B) = 0.15$)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '곱 계산' },
      { key: 'C', text: '배반 ($P(A \\cap B) > 0$ 이지만 배반이라 판정)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$P(A \\cap B) = 0$이어야 배반' },
      { key: 'D', text: '판정 불가 (조건 부족)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '판정 가능' },
      { key: 'E', text: '독립 ($P(A) + P(B) = 0.9 \\neq 0.15$)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\cup$ 와 혼동' },
    ],
    solution: '독립 조건은 $P(A) P(B) = P(A \\cap B)$. $0.4 \\cdot 0.5 = 0.2 \\neq 0.15$. 독립 아님.' },

  // S19 (어려움) 적어도 1번 6 (주사위 2번)
  { chapterCode: CODE, difficulty: 'hard', concept: '여사건 활용 (적어도 1번)', requiredSkills: SKILLS_COMP,
    stem: '주사위 $2$ 번 던질 때 $6$ 이 적어도 한 번 나올 확률?',
    options: [
      { key: 'A', text: '$\\dfrac{11}{36}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{1}{3}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$2/6$' },
      { key: 'C', text: '$\\dfrac{25}{36}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '여사건 자체' },
      { key: 'D', text: '$\\dfrac{1}{6}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '한 번만' },
      { key: 'E', text: '$\\dfrac{1}{36}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '둘 다 6' },
    ],
    solution: '여사건 (둘 다 6 아님) $= \\left( \\dfrac{5}{6} \\right)^2 = \\dfrac{25}{36}$. 답 $= 1 - \\dfrac{25}{36} = \\dfrac{11}{36}$.' },

  // S20 (어려움) 비복원 둘 다 빨강 (5,5)
  { chapterCode: CODE, difficulty: 'hard', concept: '비복원 (빨 둘, $5$:$5$)', requiredSkills: SKILLS_MULT,
    stem: '항아리에 빨강 $5$, 파랑 $5$. 비복원 $2$ 개 추출. 둘 다 빨강?',
    options: [
      { key: 'A', text: '$\\dfrac{2}{9}$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\dfrac{1}{4}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '복원 ($1/2)^2$' },
      { key: 'C', text: '$\\dfrac{1}{2}$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '한 번만' },
      { key: 'D', text: '$\\dfrac{5}{18}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
      { key: 'E', text: '$\\dfrac{20}{90}$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '약분 X' },
    ],
    solution: '$\\dfrac{5}{10} \\cdot \\dfrac{4}{9} = \\dfrac{20}{90} = \\dfrac{2}{9}$.' },
];

export const K_G11_STAT_CH02_PROBABILITY_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
