/**
 * K-G8-MATH2-CH05-PROPERTIES-FIG (도형의 성질·합동 증명) — 20문제 3-step Mastery.
 * 중2 — 합동조건 (SSS/SAS/ASA/RHS) → AAA = 닮음 → SSA = 모호 →
 *        이등변삼각형 두 밑각 같음 → 평행선 동위/엇/동측내각.
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 * 주요 errorCode 분배:
 *   GEOMETRY_PROPERTY_ERROR 7 (Q1,2,5,7,8,15,17) / FORMULA_SELECTION_ERROR 4 (Q3,4,9,18)
 *   ARITHMETIC_ERROR 3 (Q11,12,14) / CONCEPT_MISUNDERSTANDING 3 (Q6,10,16)
 *   ALGEBRA_ERROR 2 (Q19,20) / CONDITION_MISSING 1 (Q13)
 *
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G8-MATH2-CH05-PROPERTIES-FIG';
const SKILLS_CONG = ['congruence_symbol', 'congruence_conditions'];
const SKILLS_SSS = ['sss_condition', 'three_sides'];
const SKILLS_SAS = ['sas_condition', 'included_angle'];
const SKILLS_ASA = ['asa_condition', 'included_side'];
const SKILLS_ISO = ['isosceles_triangle', 'base_angles_equal'];
const SKILLS_PARALLEL = ['corresponding_angle', 'alternate_angle', 'co_interior_angle'];
const SKILLS_NEGATIVE = ['aaa_not_congruent', 'ssa_ambiguous'];
const SKILLS_ALGEBRA_FIG = ['algebra_in_figure'];

const problems: KoreanProblemSeed[] = [
  // Q1
  { chapterCode: CODE, difficulty: 'easy', concept: '합동 기호', requiredSkills: SKILLS_CONG,
    stem: '두 도형이 합동임을 나타내는 기호는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '합동의 의미?', options: [
        { key: 'A', text: '두 도형의 모양과 크기가 같다', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '모양만 같다 (크기는 다름)', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '닮음 정의' },
        { key: 'C', text: '면적이 같다', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '면적 같음 ≠ 합동' },
        { key: 'D', text: '둘레가 같다', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '둘레 같음 ≠ 합동' },
        { key: 'E', text: '한 변이 같다', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '부족' },
      ] },
      { stepType: 'PROCESS', prompt: '기호 표기는?', options: [
        { key: 'A', text: '$\\equiv$ (세 줄 등호)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$=$ (등호)', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '수의 등호' },
        { key: 'C', text: '$\\sim$ (닮음 기호)', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '닮음' },
        { key: 'D', text: '$\\approx$ (근사)', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근사' },
        { key: 'E', text: '$\\neq$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '같지 않음' },
      ] },
      { stepType: 'ANSWER', prompt: '합동 기호는?', options: [
        { key: 'A', text: '$\\equiv$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$=$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '수의 등호' },
        { key: 'C', text: '$\\sim$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '닮음' },
        { key: 'D', text: '$\\approx$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근사' },
        { key: 'E', text: '$\\cong$ 이지만 한국 교과서는 $\\equiv$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '한국 교과서 기호 $\\equiv$' },
      ] },
    ], solution: '$\\triangle ABC \\equiv \\triangle DEF$ — 합동 기호 $\\equiv$.' },

  // Q2
  { chapterCode: CODE, difficulty: 'easy', concept: 'SSS 합동조건', requiredSkills: SKILLS_SSS,
    stem: 'SSS 합동조건은?',
    steps: [
      { stepType: 'CONCEPT', prompt: 'S = ?, A = ?', options: [
        { key: 'A', text: 'S = Side (변), A = Angle (각)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: 'S = Same, A = Angle', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '용어 잘못' },
        { key: 'C', text: 'S = Shape, A = Area', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: 'SSS = Same Shape Size', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '잘못' },
        { key: 'E', text: 'A = Adjacent', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: 'SSS = 세 개의 변', options: [
        { key: 'A', text: '세 변이 각각 같으면 합동', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '두 변과 한 각', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: 'SAS' },
        { key: 'C', text: '두 각과 한 변', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: 'ASA' },
        { key: 'D', text: '세 각이 모두 같음', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: 'AAA (닮음)' },
        { key: 'E', text: '하나의 변만', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '부족' },
      ] },
      { stepType: 'ANSWER', prompt: 'SSS는?', options: [
        { key: 'A', text: '세 변이 같음', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '세 각이 같음', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: 'AAA' },
        { key: 'C', text: '한 변과 두 각', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: 'ASA' },
        { key: 'D', text: '두 변과 끼인 각', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: 'SAS' },
        { key: 'E', text: '아무 두 변', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '부족' },
      ] },
    ], solution: 'SSS = Side-Side-Side, 세 변이 각각 같으면 합동.' },

  // Q3
  { chapterCode: CODE, difficulty: 'easy', concept: 'SAS 합동조건', requiredSkills: SKILLS_SAS,
    stem: 'SAS 합동조건은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '"끼인 각" 의 의미?', options: [
        { key: 'A', text: '두 변 사이에 있는 각', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '두 변과 반대편에 있는 각', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '반대편 각' },
        { key: 'C', text: '아무 한 각', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '구체 위치 명시' },
        { key: 'D', text: '꼭짓점의 각', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '두 각 사이에 있는 변', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: 'ASA의 "끼인 변" 정의' },
      ] },
      { stepType: 'PROCESS', prompt: 'SAS의 조건은?', options: [
        { key: 'A', text: '두 변과 그 끼인 각이 같음', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '두 변과 아무 각', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: 'SSA — 모호' },
        { key: 'C', text: '세 변', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: 'SSS' },
        { key: 'D', text: '두 각과 한 변', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: 'ASA' },
        { key: 'E', text: '세 각', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: 'AAA (닮음)' },
      ] },
      { stepType: 'ANSWER', prompt: 'SAS는?', options: [
        { key: 'A', text: '두 변 + 끼인 각', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '두 변 + 아무 각 (SSA)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '모호' },
        { key: 'C', text: '세 변 (SSS)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '다른 조건' },
        { key: 'D', text: '두 각 + 끼인 변 (ASA)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '다른 조건' },
        { key: 'E', text: '세 각 (AAA)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '닮음' },
      ] },
    ], solution: 'SAS = Side-Angle-Side, 두 변과 그 끼인 각이 같으면 합동.' },

  // Q4
  { chapterCode: CODE, difficulty: 'easy', concept: 'ASA 합동조건', requiredSkills: SKILLS_ASA,
    stem: 'ASA 합동조건은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '"끼인 변" 의 의미?', options: [
        { key: 'A', text: '두 각 사이에 있는 변', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '두 각의 반대편 변', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: 'AAS (다른 변형)' },
        { key: 'C', text: '아무 한 변', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '구체 위치' },
        { key: 'D', text: '가장 긴 변', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '두 변 사이의 각', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: 'SAS 정의와 혼동' },
      ] },
      { stepType: 'PROCESS', prompt: 'ASA = 두 각 + 끼인 변', options: [
        { key: 'A', text: '두 각과 두 각 사이의 변', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '두 각만', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: 'AA (닮음)' },
        { key: 'C', text: '세 각', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: 'AAA (닮음)' },
        { key: 'D', text: '한 변과 두 각 (위치 무관)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '위치 중요' },
        { key: 'E', text: '두 변과 한 각', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: 'SAS' },
      ] },
      { stepType: 'ANSWER', prompt: 'ASA는?', options: [
        { key: 'A', text: '두 각 + 끼인 변', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '두 각 + 아무 변', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: 'AAS (변형이지만 위치 차이)' },
        { key: 'C', text: '세 각', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: 'AAA' },
        { key: 'D', text: '두 변 + 끼인 각 (SAS)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '다른 조건' },
        { key: 'E', text: '한 각 + 한 변', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '부족' },
      ] },
    ], solution: 'ASA = Angle-Side-Angle, 두 각과 그 사잇변이 같으면 합동.' },

  // Q5
  { chapterCode: CODE, difficulty: 'easy', concept: '이등변삼각형 두 밑각', requiredSkills: SKILLS_ISO,
    stem: '이등변삼각형의 두 밑각의 관계는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '이등변삼각형 정의?', options: [
        { key: 'A', text: '두 변의 길이가 같은 삼각형', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '세 변이 같은 삼각형', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '정삼각형' },
        { key: 'C', text: '한 각이 직각인 삼각형', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '직각삼각형' },
        { key: 'D', text: '두 변과 한 각이 같음', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '두 각만 같음', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '변 정의' },
      ] },
      { stepType: 'PROCESS', prompt: '두 변 같으면 → 두 밑각?', options: [
        { key: 'A', text: '서로 같다 (이등변 정리)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '서로 보각 (합 180°)', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '한 각은 직각', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '서로 다름', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '같음' },
        { key: 'E', text: '꼭지각과 같음', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '정삼각형만' },
      ] },
      { stepType: 'ANSWER', prompt: '관계는?', options: [
        { key: 'A', text: '같다', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '합이 $90°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '합이 $180°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '한 쪽이 $90°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '두 밑각이 꼭지각과 같음', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '정삼각형만' },
      ] },
    ], solution: '이등변삼각형의 두 밑각은 같다.' },

  // Q6
  { chapterCode: CODE, difficulty: 'easy', concept: '평행선의 동위각', requiredSkills: SKILLS_PARALLEL,
    stem: '평행한 두 직선과 한 횡단선이 만들 때, 동위각의 관계는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '동위각이란?', options: [
        { key: 'A', text: '횡단선의 같은 쪽 + 두 직선에 대해 같은 위치의 두 각', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '한 점에서 만나는 두 각', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '맞꼭지각' },
        { key: 'C', text: '엇각과 같은 것', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '다른 종류' },
        { key: 'D', text: '직선 위 이웃한 두 각', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '아무 두 각', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '특정 위치' },
      ] },
      { stepType: 'PROCESS', prompt: '평행 조건 → 동위각?', options: [
        { key: 'A', text: '서로 같음', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '합 $180°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '동측내각' },
        { key: 'C', text: '차이 $90°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '서로 다름', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '같음' },
        { key: 'E', text: '직각', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '특수 경우만' },
      ] },
      { stepType: 'ANSWER', prompt: '관계는?', options: [
        { key: 'A', text: '같음', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '합 $180°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '동측내각' },
        { key: 'C', text: '보각', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '직각', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '관계 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '평행이면 있음' },
      ] },
    ], solution: '평행선 → 동위각 같음.' },

  // Q7
  { chapterCode: CODE, difficulty: 'medium', concept: '정삼각형 합동 (한 변)', requiredSkills: SKILLS_CONG,
    stem: '두 정삼각형이 합동임을 보이려면 어떤 정보가 필요한가?',
    steps: [
      { stepType: 'CONCEPT', prompt: '정삼각형의 특수성?', options: [
        { key: 'A', text: '세 변이 모두 같고 세 각이 모두 $60°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '두 변만 같음', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '이등변' },
        { key: 'C', text: '한 각이 $90°$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '직각' },
        { key: 'D', text: '한 변만 같음', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '아무 모양', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '정의 잘못' },
      ] },
      { stepType: 'PROCESS', prompt: '한 변만 같으면 나머지 두 변은?', options: [
        { key: 'A', text: '자동으로 같음 (정삼각형은 세 변 동일) → SSS 만족', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '알 수 없음', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '정삼각형 정의' },
        { key: 'C', text: '두 배', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '반', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '한 변과 같지 않음', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '정삼각형 정의' },
      ] },
      { stepType: 'ANSWER', prompt: '필요한 정보?', options: [
        { key: 'A', text: '한 변의 길이만', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '세 변 모두', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '한 변이면 충분' },
        { key: 'C', text: '한 변과 한 각', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '각도 60° 고정' },
        { key: 'D', text: '두 변', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '한 변으로 충분' },
        { key: 'E', text: '합동 불가능', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '가능' },
      ] },
    ], solution: '정삼각형: 한 변 같으면 SSS로 합동.' },

  // Q8
  { chapterCode: CODE, difficulty: 'medium', concept: '직각삼각형 RHS', requiredSkills: SKILLS_CONG,
    stem: '두 직각삼각형이 합동임을 보이는 RHS 조건은?',
    steps: [
      { stepType: 'CONCEPT', prompt: 'RHS = ?', options: [
        { key: 'A', text: 'Right angle, Hypotenuse, Side', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: 'Right, Half, Side', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '잘못' },
        { key: 'C', text: 'Right, Hypotenuse, Same', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '잘못' },
        { key: 'D', text: 'Reverse, Hypotenuse, Side', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '의미 없음', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '존재' },
      ] },
      { stepType: 'PROCESS', prompt: '조건의 의미?', options: [
        { key: 'A', text: '직각 + 빗변 + 한 변이 같음', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '직각만 같음', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '부족' },
        { key: 'C', text: '두 변과 직각', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: 'SAS 일반' },
        { key: 'D', text: '세 각이 같음', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: 'AAA (닮음)' },
        { key: 'E', text: '빗변만 같음', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '부족' },
      ] },
      { stepType: 'ANSWER', prompt: 'RHS는?', options: [
        { key: 'A', text: '직각 + 빗변 + 다른 한 변', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '직각만', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '부족' },
        { key: 'C', text: '두 변', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '부족' },
        { key: 'D', text: '두 각', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '빗변과 한 각', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: 'RHS = 직각삼각형에서 직각·빗변·다른 한 변이 같으면 합동.' },

  // Q9
  { chapterCode: CODE, difficulty: 'medium', concept: '합동조건 식별', requiredSkills: SKILLS_ASA,
    stem: '$\\triangle ABC$ 와 $\\triangle DEF$ 에서 $\\angle A = \\angle D = 50°$, $\\angle B = \\angle E = 70°$, $AB = DE = 5$. 어떤 합동조건?',
    steps: [
      { stepType: 'CONCEPT', prompt: '주어진 정보는?', options: [
        { key: 'A', text: '두 각 + 끼인 변 (AB는 $\\angle A, \\angle B$ 사이)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '세 변', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '변 1개만 주어짐' },
        { key: 'C', text: '두 변 + 한 각', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '변 1개만' },
        { key: 'D', text: '세 각', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '변 1개 포함' },
        { key: 'E', text: '한 변만', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '두 각 + 변' },
      ] },
      { stepType: 'PROCESS', prompt: '$AB$ 가 $\\angle A$ 와 $\\angle B$ 사이?', options: [
        { key: 'A', text: '맞음 (두 각의 사잇변) → ASA', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '반대편 변', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: 'AAS' },
        { key: 'C', text: '두 변 사이의 각', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: 'SAS' },
        { key: 'D', text: '관계 없음', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '관계 있음' },
        { key: 'E', text: '빗변', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '합동조건?', options: [
        { key: 'A', text: 'ASA', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: 'SAS', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '변 1개만' },
        { key: 'C', text: 'SSS', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '변 1개만' },
        { key: 'D', text: 'AAA', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '닮음' },
        { key: 'E', text: '합동 아님', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합동' },
      ] },
    ], solution: '두 각과 그 끼인 변이 같음 → ASA 합동.' },

  // Q10
  { chapterCode: CODE, difficulty: 'medium', concept: 'ASA "끼인 변"의 의미', requiredSkills: SKILLS_ASA,
    stem: 'ASA 합동조건에서 "끼인 변"이란 어떤 변인가?',
    steps: [
      { stepType: 'CONCEPT', prompt: '그림으로 보면?', options: [
        { key: 'A', text: '두 각의 꼭짓점을 잇는 변 (즉 두 각 사이)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '두 각의 반대편 변', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: 'AAS' },
        { key: 'C', text: '아무 변', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '위치 중요' },
        { key: 'D', text: '가장 짧은 변', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '가장 긴 변', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '두 각이 $\\angle B, \\angle C$ 라면?', options: [
        { key: 'A', text: '끼인 변은 $BC$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '끼인 변은 $AB$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\angle B$ 와 $\\angle A$ 사이' },
        { key: 'C', text: '끼인 변은 $AC$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$\\angle A$ 와 $\\angle C$ 사이' },
        { key: 'D', text: '아무 변', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '위치 중요' },
        { key: 'E', text: '존재 안 함', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '존재' },
      ] },
      { stepType: 'ANSWER', prompt: '"끼인 변" = ?', options: [
        { key: 'A', text: '두 각 사이의 변', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '두 각과 마주보는 변', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: 'AAS' },
        { key: 'C', text: '아무 변', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '위치 중요' },
        { key: 'D', text: '빗변', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '직각삼각형만' },
        { key: 'E', text: '가장 큰 각의 변', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
    ], solution: 'ASA의 "끼인 변" = 두 각의 꼭짓점을 잇는 변.' },

  // Q11
  { chapterCode: CODE, difficulty: 'medium', concept: '평행선 동위·엇각 응용', requiredSkills: SKILLS_PARALLEL,
    stem: '$l \\parallel m$, 횡단선이 $l$ 과 이루는 동위각이 $60°$. $m$ 과 이루는 엇각은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '평행선 동위각·엇각 관계?', options: [
        { key: 'A', text: '평행이면 동위각 = 엇각 (모두 같음)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '동위각만 같음', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '엇각도 같음' },
        { key: 'C', text: '엇각만 같음', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '동위각도 같음' },
        { key: 'D', text: '둘 다 보각', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '동측내각만 보각' },
        { key: 'E', text: '모두 다름', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '같음' },
      ] },
      { stepType: 'PROCESS', prompt: '동위각 $60°$ → 엇각?', options: [
        { key: 'A', text: '같은 $60°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$120°$ (보각)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$30°$ (여각)', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$90°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$0°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '엇각은?', options: [
        { key: 'A', text: '$60°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$120°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '보각' },
        { key: 'C', text: '$30°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '여각' },
        { key: 'D', text: '$180°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$90°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '평행선 → 동위각·엇각 모두 같음. 엇각 = $60°$.' },

  // Q12
  { chapterCode: CODE, difficulty: 'medium', concept: '평행선 동측내각', requiredSkills: SKILLS_PARALLEL,
    stem: '$l \\parallel m$, 횡단선과 만나는 한 동측내각이 $70°$. 다른 동측내각은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '동측내각의 관계?', options: [
        { key: 'A', text: '평행이면 합 $180°$ (보각)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '서로 같음', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '동위/엇각 규칙' },
        { key: 'C', text: '차이 $90°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '둘 다 $90°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '관계 없음', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '평행이면 관계' },
      ] },
      { stepType: 'PROCESS', prompt: '$180° - 70° = ?$', options: [
        { key: 'A', text: '$110°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$90°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$70°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '동위/엇각과 혼동' },
        { key: 'D', text: '$20°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '여각' },
        { key: 'E', text: '$140°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '다른 동측내각?', options: [
        { key: 'A', text: '$110°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$70°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '같음 (잘못)' },
        { key: 'C', text: '$90°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$20°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '여각' },
        { key: 'E', text: '$180°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '평각' },
      ] },
    ], solution: '동측내각 합 = $180°$. $180° - 70° = 110°$.' },

  // Q13
  { chapterCode: CODE, difficulty: 'medium', concept: '이등변 꼭지각 → 밑각', requiredSkills: SKILLS_ISO,
    stem: '이등변삼각형 $\\triangle ABC$ ($AB = AC$) 에서 $\\angle A = 80°$. $\\angle B$ 의 크기는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '내각의 합과 두 밑각 같음 이용?', options: [
        { key: 'A', text: '$\\angle B + \\angle C = 180° - 80° = 100°$, $\\angle B = \\angle C$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\angle B + \\angle C = 80°$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '내각 합 잘못' },
        { key: 'C', text: '$\\angle B = 80°$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '꼭지각과 같지 않음' },
        { key: 'D', text: '$\\angle B = \\angle A$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '정삼각형만' },
        { key: 'E', text: '내각 합 $360°$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '사각형' },
      ] },
      { stepType: 'PROCESS', prompt: '$100° / 2 = ?$', options: [
        { key: 'A', text: '$50°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$25°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못 나눔' },
        { key: 'C', text: '$100°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '나누기 누락' },
        { key: 'D', text: '$80°$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '꼭지각' },
        { key: 'E', text: '$40°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$\\angle B = ?$', options: [
        { key: 'A', text: '$50°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$80°$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '꼭지각' },
        { key: 'C', text: '$25°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못' },
        { key: 'D', text: '$100°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '두 밑각 합' },
        { key: 'E', text: '$40°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\angle B + \\angle C = 100°$, $\\angle B = \\angle C \\Rightarrow \\angle B = 50°$.' },

  // Q14
  { chapterCode: CODE, difficulty: 'medium', concept: '이등변 밑각 → 꼭지각', requiredSkills: SKILLS_ISO,
    stem: '이등변삼각형 ($AB=AC$) 의 한 밑각이 $65°$. 꼭지각은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\angle B = \\angle C = 65°$, $\\angle A = ?$', options: [
        { key: 'A', text: '$\\angle A = 180° - 65° - 65°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\angle A = 65°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '꼭지각도 같다고 잘못' },
        { key: 'C', text: '$\\angle A = 180° - 65°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '한 밑각만 뺌' },
        { key: 'D', text: '$\\angle A = 65° \\times 2 = 130°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\angle A = 90°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$180° - 130° = ?$', options: [
        { key: 'A', text: '$50°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$115°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '한 밑각만 뺌' },
        { key: 'C', text: '$65°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '밑각 자체' },
        { key: 'D', text: '$130°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '두 밑각 합 자체' },
        { key: 'E', text: '$80°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '꼭지각?', options: [
        { key: 'A', text: '$50°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$130°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '두 밑각 합' },
        { key: 'C', text: '$65°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '밑각 자체' },
        { key: 'D', text: '$115°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '한 밑각만 뺌' },
        { key: 'E', text: '$60°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음 (정삼각형)' },
      ] },
    ], solution: '$\\angle A = 180° - 2(65°) = 50°$.' },

  // Q15
  { chapterCode: CODE, difficulty: 'medium', concept: '합동 → 대응변', requiredSkills: SKILLS_CONG,
    stem: '$\\triangle ABC \\equiv \\triangle DEF$ 이고 $AB = 7$cm. $DE$ 의 길이는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '합동의 의미?', options: [
        { key: 'A', text: '대응하는 변과 각이 모두 같음', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '면적만 같음', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '합동 ≠ 면적 같음' },
        { key: 'C', text: '모양만 같음', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '닮음' },
        { key: 'D', text: '둘레만 같음', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '한 변만 같음', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '부족' },
      ] },
      { stepType: 'PROCESS', prompt: '대응: $A \\leftrightarrow D, B \\leftrightarrow E$', options: [
        { key: 'A', text: '$AB$ 의 대응변 = $DE$, 같은 길이 $7$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$DE = 14$ (두 배)', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$DE = 0$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$DE$ 알 수 없음', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '합동이라 알 수 있음' },
        { key: 'E', text: '$DE = 3.5$ (반)', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$DE = ?$', options: [
        { key: 'A', text: '$7$ cm', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$14$ cm', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$3.5$ cm', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$0$', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '알 수 없음', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '합동이라 같음' },
      ] },
    ], solution: '합동 → 대응변 같음. $DE = AB = 7$ cm.' },

  // Q16 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: 'AAA = 닮음 (합동 아님)', requiredSkills: SKILLS_NEGATIVE,
    stem: '두 삼각형의 세 각이 각각 같다면 두 삼각형은 항상 합동인가?',
    steps: [
      { stepType: 'CONCEPT', prompt: 'AAA의 의미?', options: [
        { key: 'A', text: 'Angle-Angle-Angle, 세 각이 같음', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: 'Always-All-Acute', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '약어 잘못' },
        { key: 'C', text: 'Area-Area-Area', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: 'AAA = SSS와 같음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '다름' },
        { key: 'E', text: 'AAA는 ASA와 같음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: 'ASA는 변 포함' },
      ] },
      { stepType: 'PROCESS', prompt: '같은 각을 가지지만 크기 다른 두 삼각형 예?', options: [
        { key: 'A', text: '정삼각형 한 변 $1$ vs $10$ — 모두 $60°$이지만 크기 다름', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '존재하지 않음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '존재함' },
        { key: 'C', text: '정사각형 두 개', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '삼각형 아님' },
        { key: 'D', text: '직각삼각형만', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '범위 좁음' },
        { key: 'E', text: '모든 두 삼각형', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '각도 같아야' },
      ] },
      { stepType: 'ANSWER', prompt: '합동인가?', options: [
        { key: 'A', text: '항상 합동은 아님 (닮음만 보장)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '항상 합동', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '닮음만' },
        { key: 'C', text: '한 변이 같으면 합동', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '맞지만 추가 정보' },
        { key: 'D', text: '직각삼각형이면 합동', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '면적이 같으면 합동', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '면적 ≠ 합동' },
      ] },
    ], solution: 'AAA는 닮음만 보장 (크기 다를 수 있음). 합동은 SSS, SAS, ASA 필요.' },

  // Q17 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: 'SSA 모호성', requiredSkills: SKILLS_NEGATIVE,
    stem: 'SSA (두 변과 끼지 않은 한 각) 가 합동조건이 아닌 이유?',
    steps: [
      { stepType: 'CONCEPT', prompt: 'SSA에서 "각"의 위치?', options: [
        { key: 'A', text: '두 변 사이가 아닌 다른 위치', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '두 변 사이', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: 'SAS' },
        { key: 'C', text: '직각', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: 'RHS' },
        { key: 'D', text: '예각만', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '둔각만', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '같은 SSA 조건 만족하는 두 다른 삼각형 가능?', options: [
        { key: 'A', text: '가능 (모호 케이스 — 두 가지 모양)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '불가능', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '모호 케이스 존재' },
        { key: 'C', text: '항상 합동', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '모호로 합동 아님' },
        { key: 'D', text: '크기만 다름', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '모양도 다름' },
        { key: 'E', text: '직각삼각형에서만', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '일반적' },
      ] },
      { stepType: 'ANSWER', prompt: '이유?', options: [
        { key: 'A', text: '서로 다른 두 삼각형이 가능 → 유일하게 결정 안 됨', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '면적이 다름', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '둘레가 다름', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '음각 가능', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '합동조건임 (잘못된 정설)', isCorrect: false, errorCode: 'GEOMETRY_PROPERTY_ERROR', errorReason: '합동조건 아님' },
      ] },
    ], solution: 'SSA는 같은 정보로 두 가지 다른 삼각형이 가능 → 유일 결정 X.' },

  // Q18 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: 'SAS 적용', requiredSkills: SKILLS_SAS,
    stem: '$\\triangle ABC, \\triangle DEF$: $AB = DE = 5$, $AC = DF = 4$, $\\angle A = \\angle D = 60°$. 두 삼각형은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\angle A$ 가 $AB$ 와 $AC$ 사이?', options: [
        { key: 'A', text: '맞음 — 두 변의 끼인 각', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '반대편', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\angle A$ 정의' },
        { key: 'C', text: '관련 없음', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '관련' },
        { key: 'D', text: '빗변의 각', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '외각', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '두 변 + 끼인 각 모두 같음 → ?', options: [
        { key: 'A', text: 'SAS 합동', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: 'SSS', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '한 변 부족' },
        { key: 'C', text: 'ASA', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '각 1개만' },
        { key: 'D', text: 'AAA — 닮음만', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '각 1개 + 변 2개' },
        { key: 'E', text: '합동 아님', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: 'SAS 만족' },
      ] },
      { stepType: 'ANSWER', prompt: '관계는?', options: [
        { key: 'A', text: '$\\triangle ABC \\equiv \\triangle DEF$ (SAS 합동)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '닮음만', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합동 만족' },
        { key: 'C', text: '관계 없음', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: 'SAS' },
        { key: 'D', text: '면적만 같음', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합동' },
        { key: 'E', text: '둘레만 같음', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합동' },
      ] },
    ], solution: 'SAS 만족 → $\\triangle ABC \\equiv \\triangle DEF$.' },

  // Q19 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '평행선 동측내각 미정', requiredSkills: SKILLS_ALGEBRA_FIG,
    stem: '$l \\parallel m$, 횡단선이 만드는 한 쪽 동측내각이 $(3x + 10)°$, 다른 쪽이 $(2x + 30)°$ 이다. $x$ 는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '동측내각 관계?', options: [
        { key: 'A', text: '합이 $180°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '서로 같음', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '동위/엇각 규칙' },
        { key: 'C', text: '차이 $90°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '곱 $360°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '관계 없음', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '평행이면 관계' },
      ] },
      { stepType: 'PROCESS', prompt: '$3x + 10 + 2x + 30 = 180$', options: [
        { key: 'A', text: '$5x + 40 = 180 \\Rightarrow x = 28$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5x = 180 \\Rightarrow x = 36$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '상수 합 누락' },
        { key: 'C', text: '$5x + 40 = 360$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '동측내각 합 $360°$ 잘못' },
        { key: 'D', text: '$x + 40 = 180$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '계수 합 잘못' },
        { key: 'E', text: '$x = 0$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '$x$ 는?', options: [
        { key: 'A', text: '$28$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$36$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '상수 누락' },
        { key: 'C', text: '$20$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '동위각 규칙 적용' },
        { key: 'D', text: '$10$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$30$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$5x + 40 = 180 \\Rightarrow x = 28$. 검산: $3(28)+10 = 94$, $2(28)+30 = 86$, 합 $180$ ✓.' },

  // Q20 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '이등변삼각형 외각 응용', requiredSkills: SKILLS_ISO,
    stem: '이등변삼각형 $\\triangle ABC$ ($AB = AC$) 에서 $\\angle B$ 의 외각이 $130°$ 이다. $\\angle A$ 는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$\\angle B$ 의 외각이 $130°$이면 $\\angle B$?', options: [
        { key: 'A', text: '$\\angle B = 180° - 130° = 50°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\angle B = 130°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '외각과 내각 혼동' },
        { key: 'C', text: '$\\angle B = 90°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\angle B = 130° - 180° = -50°$', isCorrect: false, errorCode: 'SIGN_ERROR', errorReason: '음수' },
        { key: 'E', text: '$\\angle B = 65°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\angle B = 50°$, 이등변 → $\\angle C = ?$', options: [
        { key: 'A', text: '$\\angle C = 50°$ (두 밑각 같음)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\angle C = 130°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '$\\angle B$ 외각' },
        { key: 'C', text: '$\\angle C = 80°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$\\angle C = 65°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '알 수 없음', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '이등변 → 같음' },
      ] },
      { stepType: 'ANSWER', prompt: '$\\angle A = 180° - 50° - 50° = ?$', options: [
        { key: 'A', text: '$80°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$50°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '밑각' },
        { key: 'C', text: '$130°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '외각' },
        { key: 'D', text: '$100°$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '두 밑각 합' },
        { key: 'E', text: '$90°$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\angle B = 180° - 130° = 50°$ (외각·내각 보각). 이등변 → $\\angle C = 50°$. $\\angle A = 180° - 100° = 80°$.' },
];

export const K_G8_MATH2_CH05_PROPERTIES_FIG_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
