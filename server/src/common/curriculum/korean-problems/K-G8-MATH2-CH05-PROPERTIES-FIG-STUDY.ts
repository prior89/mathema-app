/**
 * K-G8-MATH2-CH05-PROPERTIES-FIG — STUDY pool (single-step, 20문제).
 * 도형의 성질 — 삼각형 합동, 이등변삼각형, 평행선 각, 대응 요소.
 * Mastery 3-step과 별도 변형 문제. 중2 (G8).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5. LLM 미사용.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G8-MATH2-CH05-PROPERTIES-FIG';
const SKILLS_CONG = ['congruence_symbol', 'congruence_definition'];
const SKILLS_SSS = ['three_sides_congruence'];
const SKILLS_SAS = ['two_sides_included_angle'];
const SKILLS_ASA = ['one_side_two_adjacent_angles'];
const SKILLS_RHA = ['right_hypotenuse_acute', 'right_triangle_congruence'];
const SKILLS_ISO = ['isosceles_base_angles', 'isosceles_vertex'];
const SKILLS_EQUI = ['equilateral_triangle', 'all_sides_equal'];
const SKILLS_PARALLEL = ['corresponding_angles', 'alternate_angles', 'cointerior_angles'];
const SKILLS_CORR = ['corresponding_sides', 'corresponding_angles_polygon'];
const SKILLS_NEGATIVE = ['aaa_similarity_not_congruence', 'ssa_ambiguous'];
const SKILLS_ALG_FIG = ['angle_equation', 'parallel_angle_solve'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) 닮음 기호
  { chapterCode: CODE, difficulty: 'easy', concept: '닮음 기호 ($\\sim$)', requiredSkills: SKILLS_CONG,
    stem: '두 도형이 닮음임을 나타내는 기호는?',
    options: [
      { key: 'A', text: '$\\sim$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$\\equiv$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합동 기호' },
      { key: 'C', text: '$=$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '등호' },
      { key: 'D', text: '$\\parallel$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평행 기호' },
      { key: 'E', text: '$\\perp$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '수직 기호' },
    ],
    solution: '닮음 — $\\sim$. 합동 — $\\equiv$. 모양은 같지만 크기 다를 수 있음 → 닮음.' },

  // S2 (쉬움) 합동의 정의
  { chapterCode: CODE, difficulty: 'easy', concept: '합동의 정의', requiredSkills: SKILLS_CONG,
    stem: '두 도형이 합동이라는 것의 의미는?',
    options: [
      { key: 'A', text: '모양과 크기가 모두 같다', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '모양은 같지만 크기는 다를 수 있다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '닮음 정의' },
      { key: 'C', text: '넓이가 같다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '넓이만 같다고 합동 X' },
      { key: 'D', text: '둘레가 같다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '둘레만 같다고 합동 X' },
      { key: 'E', text: '같은 위치에 있다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '위치와 무관' },
    ],
    solution: '합동: 두 도형을 겹쳤을 때 완전히 일치. 모든 대응변·대응각이 같음.' },

  // S3 (쉬움) RHA 정의
  { chapterCode: CODE, difficulty: 'easy', concept: '직각삼각형 RHA 합동조건', requiredSkills: SKILLS_RHA,
    stem: '두 직각삼각형이 합동이 되는 RHA 조건은?',
    options: [
      { key: 'A', text: '직각, 빗변, 한 예각이 같다', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '세 변이 같다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: 'SSS' },
      { key: 'C', text: '세 각이 같다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: 'AAA는 닮음만' },
      { key: 'D', text: '직각과 한 변이 같다', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '한 각 더 필요' },
      { key: 'E', text: '한 변과 한 각이 같다', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '조건 부족' },
    ],
    solution: 'RHA: Right angle, Hypotenuse, Acute angle — 직각·빗변·한 예각.' },

  // S4 (쉬움) 이등변삼각형 정의
  { chapterCode: CODE, difficulty: 'easy', concept: '이등변삼각형 정의', requiredSkills: SKILLS_ISO,
    stem: '이등변삼각형의 정의는?',
    options: [
      { key: 'A', text: '두 변의 길이가 같은 삼각형', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '세 변의 길이가 모두 같은 삼각형', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '정삼각형 정의' },
      { key: 'C', text: '한 각이 직각인 삼각형', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '직각삼각형' },
      { key: 'D', text: '세 변의 길이가 모두 다른 삼각형', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부등변삼각형' },
      { key: 'E', text: '두 각이 같은 삼각형', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '결과 (성질)이지 정의 아님' },
    ],
    solution: '이등변삼각형 — 두 변이 같음. 두 밑각이 같은 것은 그 결과(성질).' },

  // S5 (쉬움) 정삼각형 한 내각
  { chapterCode: CODE, difficulty: 'easy', concept: '정삼각형 한 내각', requiredSkills: SKILLS_EQUI,
    stem: '정삼각형 한 내각의 크기는?',
    options: [
      { key: 'A', text: '$60°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$90°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '직각 ($180/2$)' },
      { key: 'C', text: '$120°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '정육각형 내각' },
      { key: 'D', text: '$45°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$180/4$ 잘못' },
      { key: 'E', text: '$180°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평각' },
    ],
    solution: '정삼각형 = 세 각 같음. 내각 합 $180°$ → 한 각 $= 60°$.' },

  // S6 (쉬움) 합동 두 삼각형 넓이
  { chapterCode: CODE, difficulty: 'easy', concept: '합동 두 도형 넓이', requiredSkills: SKILLS_CONG,
    stem: '두 삼각형이 합동이면 두 넓이의 관계는?',
    options: [
      { key: 'A', text: '항상 같다', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '항상 다르다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합동이면 모든 측정값 동일' },
      { key: 'C', text: '비례 관계', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '닮음 비유' },
      { key: 'D', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '판별 가능' },
      { key: 'E', text: '한쪽이 두 배', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합동이면 크기 동일' },
    ],
    solution: '합동 → 모든 대응변·대응각 같음 → 넓이도 같음.' },

  // S7 (중) SAS 합동조건 진술
  { chapterCode: CODE, difficulty: 'medium', concept: 'SAS 합동조건 진술', requiredSkills: SKILLS_SAS,
    stem: 'SAS 합동조건의 정확한 진술은?',
    options: [
      { key: 'A', text: '두 변과 그 끼인각이 각각 같다', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '두 변과 한 각이 같다', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '"끼인" 조건 누락 — SSA 모호성' },
      { key: 'C', text: '한 변과 두 각이 같다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: 'ASA' },
      { key: 'D', text: '세 변이 같다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: 'SSS' },
      { key: 'E', text: '세 각이 같다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: 'AAA — 합동조건 아님' },
    ],
    solution: 'SAS — Side, Angle, Side. 두 변과 그 사이의 끼인각이 같으면 합동.' },

  // S8 (중) ASA 합동조건 진술
  { chapterCode: CODE, difficulty: 'medium', concept: 'ASA 합동조건 진술', requiredSkills: SKILLS_ASA,
    stem: 'ASA 합동조건의 정확한 진술은?',
    options: [
      { key: 'A', text: '한 변과 그 양 끝각이 각각 같다', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '두 각이 같다', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '변 정보 누락' },
      { key: 'C', text: '한 변과 한 각이 같다', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '조건 부족' },
      { key: 'D', text: '두 변과 끼인각이 같다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: 'SAS' },
      { key: 'E', text: '세 각이 같다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: 'AAA' },
    ],
    solution: 'ASA — Angle, Side, Angle. 한 변과 그 양 끝의 두 각이 같으면 합동.' },

  // S9 (중) SSS 합동조건 식별
  { chapterCode: CODE, difficulty: 'medium', concept: 'SSS 합동조건 식별', requiredSkills: SKILLS_SSS,
    stem: '$\\triangle ABC$ 와 $\\triangle DEF$ 에서 $AB = DE = 5$, $BC = EF = 7$, $CA = FD = 9$. 어떤 합동조건?',
    options: [
      { key: 'A', text: 'SSS', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: 'SAS', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '각 정보 없음' },
      { key: 'C', text: 'ASA', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '각 정보 없음' },
      { key: 'D', text: 'AAA', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: 'AAA는 합동조건 아님' },
      { key: 'E', text: '합동 아님', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '세 변이 같음 → 합동' },
    ],
    solution: '세 변이 각각 같음 → SSS 합동조건.' },

  // S10 (중) 평행선 동위각
  { chapterCode: CODE, difficulty: 'medium', concept: '평행선 동위각 크기 (45°)', requiredSkills: SKILLS_PARALLEL,
    stem: '$l \\parallel m$, 횡단선이 $l$ 과 이루는 동위각이 $45°$ 이다. $m$ 과 이루는 같은 위치의 동위각은?',
    options: [
      { key: 'A', text: '$45°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$135°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '보각 적용' },
      { key: 'C', text: '$90°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '직각으로 가정' },
      { key: 'D', text: '$180°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평각' },
      { key: 'E', text: '$315°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$360 - 45$' },
    ],
    solution: '평행선 동위각은 같다 → $45°$.' },

  // S11 (중) 평행선 엇각
  { chapterCode: CODE, difficulty: 'medium', concept: '평행선 엇각 크기 (110°)', requiredSkills: SKILLS_PARALLEL,
    stem: '$l \\parallel m$, 횡단선이 $l$ 과 이루는 한 각이 $110°$ 이다. $m$ 과 이루는 엇각은?',
    options: [
      { key: 'A', text: '$110°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$70°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '보각 적용 (동측내각)' },
      { key: 'C', text: '$220°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2 \\times 110$' },
      { key: 'D', text: '$180°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평각' },
      { key: 'E', text: '$90°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '직각으로 가정' },
    ],
    solution: '평행선 엇각은 같다 → $110°$.' },

  // S12 (중) 동측내각
  { chapterCode: CODE, difficulty: 'medium', concept: '평행선 동측내각 합 (75°)', requiredSkills: SKILLS_PARALLEL,
    stem: '$l \\parallel m$, 횡단선과 만나는 한 동측내각이 $75°$. 다른 동측내각은?',
    options: [
      { key: 'A', text: '$105°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$75°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '동위각·엇각과 혼동' },
      { key: 'C', text: '$15°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '여각 ($90 - 75$)' },
      { key: 'D', text: '$180°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합 자체' },
      { key: 'E', text: '$285°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$360 - 75$' },
    ],
    solution: '동측내각 합 $= 180°$ → $180 - 75 = 105°$.' },

  // S13 (중) 이등변 꼭지각 → 밑각
  { chapterCode: CODE, difficulty: 'medium', concept: '이등변 꼭지각으로 밑각', requiredSkills: SKILLS_ISO,
    stem: '이등변삼각형 $\\triangle ABC$ ($AB = AC$) 에서 $\\angle A = 100°$. $\\angle B$ 의 크기는?',
    options: [
      { key: 'A', text: '$40°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$80°$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '$180 - 100$ 차 그대로' },
      { key: 'C', text: '$100°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '꼭지각과 같다고 가정' },
      { key: 'D', text: '$50°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$100/2$ 잘못된 식' },
      { key: 'E', text: '$70°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 분배' },
    ],
    solution: '두 밑각 합 $= 180 - 100 = 80°$. 같으므로 $\\angle B = 40°$.' },

  // S14 (중) 이등변 밑각 → 꼭지각
  { chapterCode: CODE, difficulty: 'medium', concept: '이등변 밑각으로 꼭지각', requiredSkills: SKILLS_ISO,
    stem: '이등변삼각형 ($AB=AC$) 의 한 밑각이 $70°$. 꼭지각은?',
    options: [
      { key: 'A', text: '$40°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$70°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '밑각과 같다고 가정' },
      { key: 'C', text: '$110°$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '한 밑각만 빼고 합 잘못' },
      { key: 'D', text: '$140°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$70 \\times 2$' },
      { key: 'E', text: '$20°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 분배' },
    ],
    solution: '두 밑각 합 $= 70 + 70 = 140°$. 꼭지각 $= 180 - 140 = 40°$.' },

  // S15 (중) 합동 대응각
  { chapterCode: CODE, difficulty: 'medium', concept: '합동 → 대응각', requiredSkills: SKILLS_CORR,
    stem: '$\\triangle ABC \\equiv \\triangle DEF$ 이고 $\\angle A = 65°$. $\\angle D$ 의 크기는?',
    options: [
      { key: 'A', text: '$65°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$115°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '보각 적용' },
      { key: 'C', text: '$\\angle B$ 와 같다', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '대응 관계 오해 ($A \\leftrightarrow D$)' },
      { key: 'D', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합동이면 대응각 같음' },
      { key: 'E', text: '$0°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '관련 없음' },
    ],
    solution: '$A \\leftrightarrow D$ 대응. 합동 → $\\angle A = \\angle D = 65°$.' },

  // S16 (어려움) AAA는 합동 X
  { chapterCode: CODE, difficulty: 'hard', concept: 'AAA = 닮음이지 합동 아님', requiredSkills: SKILLS_NEGATIVE,
    stem: '두 삼각형의 세 각이 각각 같다면 두 삼각형의 관계는?',
    options: [
      { key: 'A', text: '닮음 — 합동은 아닐 수 있음', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '항상 합동', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '크기 다른 닮은 삼각형 존재' },
      { key: 'C', text: '관계 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '닮음 관계' },
      { key: 'D', text: '항상 같은 넓이', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '크기 다르면 넓이 다름' },
      { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '명확한 닮음' },
    ],
    solution: 'AAA → 두 삼각형은 항상 닮음이지만 크기는 다를 수 있어 합동은 아님.' },

  // S17 (어려움) SAS 적용
  { chapterCode: CODE, difficulty: 'hard', concept: 'SAS 조건 적용', requiredSkills: SKILLS_SAS,
    stem: '$\\triangle ABC, \\triangle DEF$: $AB = DE = 6$, $AC = DF = 8$, $\\angle A = \\angle D = 45°$. 두 삼각형의 관계는?',
    options: [
      { key: 'A', text: '합동 (SAS)', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '합동 (SSS)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '세 변 정보 없음' },
      { key: 'C', text: '닮음만', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: 'SAS는 합동 보장' },
      { key: 'D', text: '관계 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '명확한 합동' },
      { key: 'E', text: 'SSA — 합동 아님', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\angle A$는 두 변 사이의 끼인각 → SAS' },
    ],
    solution: '두 변($AB, AC$)과 그 사이 끼인각($\\angle A$) 같음 → SAS 합동.' },

  // S18 (어려움) ASA vs SAS 구분
  { chapterCode: CODE, difficulty: 'hard', concept: 'ASA vs SAS 구분', requiredSkills: SKILLS_ASA,
    stem: '$\\triangle ABC, \\triangle DEF$: $\\angle A = \\angle D$, $AB = DE$, $\\angle B = \\angle E$. 어떤 합동조건?',
    options: [
      { key: 'A', text: 'ASA', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: 'SAS', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '두 변 정보 없음 (한 변만)' },
      { key: 'C', text: 'SSS', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '변 정보 부족' },
      { key: 'D', text: 'AAA', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '변 $AB = DE$ 정보 있음' },
      { key: 'E', text: '합동 아님', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '명확한 ASA' },
    ],
    solution: '한 변 $AB$ 와 그 양 끝각 $\\angle A, \\angle B$ 같음 → ASA.' },

  // S19 (어려움) 평행선 동측내각 미정
  { chapterCode: CODE, difficulty: 'hard', concept: '평행선 동측내각 미정값', requiredSkills: SKILLS_ALG_FIG,
    stem: '$l \\parallel m$, 횡단선이 만드는 동측내각이 $(2x + 15)°$ 와 $(3x + 30)°$ 이다. $x$ 는?',
    options: [
      { key: 'A', text: '$x = 27$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$x = 3$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '두 각이 같다고 가정 ($2x+15=3x+30$)' },
      { key: 'C', text: '$x = 45$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 분배' },
      { key: 'D', text: '$x = 30$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 합' },
      { key: 'E', text: '$x = 0$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '관계식 적용 안 함' },
    ],
    solution: '동측내각 합 $= 180°$. $(2x + 15) + (3x + 30) = 180 \\to 5x + 45 = 180 \\to x = 27$.' },

  // S20 (어려움) 이등변 외각 응용
  { chapterCode: CODE, difficulty: 'hard', concept: '이등변삼각형 외각 응용', requiredSkills: SKILLS_ISO,
    stem: '이등변삼각형 $\\triangle ABC$ ($AB = AC$) 에서 $\\angle B$ 의 외각이 $110°$ 이다. $\\angle A$ 는?',
    options: [
      { key: 'A', text: '$40°$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$70°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\angle B$ 답함' },
      { key: 'C', text: '$110°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '외각 자체' },
      { key: 'D', text: '$60°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 차' },
      { key: 'E', text: '$140°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2 \\times 70$' },
    ],
    solution: '$\\angle B = 180 - 110 = 70°$. 이등변 → $\\angle C = 70°$. $\\angle A = 180 - 70 - 70 = 40°$.' },
];

export const K_G8_MATH2_CH05_PROPERTIES_FIG_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
