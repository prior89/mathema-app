/**
 * K-G8-MATH2-CH06-SIMILARITY (도형의 닮음) — 20문제 3-step Mastery.
 * 중2 — 닮음 정의 → AA/SAS/SSS 닮음 조건 → 닮음비 → 넓이비 ($k^2$) →
 *        부피비 ($k^3$) → 둘레비 ($k$) → 역추적.
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5
 * 주요 errorCode 분배:
 *   AREA_RATIO_ERROR 6 (Q7,8,11,15,18,19) / VOLUME_RATIO_ERROR 4 (Q9,10,12,17)
 *   CONCEPT_MISUNDERSTANDING 3 (Q1,2,5) / FORMULA_SELECTION_ERROR 3 (Q6,13,14)
 *   ALGEBRA_ERROR 2 (Q4,16) / CONDITION_MISSING 2 (Q3,20)
 *
 * LLM-generated 아님. [[feedback-no-llm-for-problem-content]] 준수.
 */
import type { KoreanChapterProblems, KoreanProblemSeed } from './types';

const CODE = 'K-G8-MATH2-CH06-SIMILARITY';
const SKILLS_DEF = ['similarity_definition', 'similarity_symbol'];
const SKILLS_COND = ['similarity_conditions', 'aa_sas_sss_similar'];
const SKILLS_RATIO_LEN = ['similarity_ratio_to_length'];
const SKILLS_RATIO_AREA = ['similarity_ratio_squared', 'area_ratio'];
const SKILLS_RATIO_VOL = ['similarity_ratio_cubed', 'volume_ratio'];
const SKILLS_RATIO_INV = ['ratio_inverse', 'algebraic_root'];
const SKILLS_PERIM = ['perimeter_ratio_equals_similarity'];

const problems: KoreanProblemSeed[] = [
  // Q1
  { chapterCode: CODE, difficulty: 'easy', concept: '닮음 기호', requiredSkills: SKILLS_DEF,
    stem: '두 도형이 닮음임을 나타내는 기호는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '닮음의 의미?', options: [
        { key: 'A', text: '모양이 같고 크기는 다를 수 있음', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '모양과 크기가 모두 같음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합동' },
        { key: 'C', text: '면적만 같음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '둘레만 같음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'E', text: '한 변만 같음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '닮음 기호?', options: [
        { key: 'A', text: '$\\sim$ (틸드)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\equiv$ (세 줄 등호)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합동 기호' },
        { key: 'C', text: '$=$ (등호)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '같음' },
        { key: 'D', text: '$\\approx$ (근사)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근사' },
        { key: 'E', text: '$\\neq$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '같지 않음' },
      ] },
      { stepType: 'ANSWER', prompt: '닮음 기호?', options: [
        { key: 'A', text: '$\\sim$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$\\equiv$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합동' },
        { key: 'C', text: '$=$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '등호' },
        { key: 'D', text: '$\\approx$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근사' },
        { key: 'E', text: '$\\cong$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '서양 합동 기호' },
      ] },
    ], solution: '$\\triangle ABC \\sim \\triangle DEF$ — 닮음 기호 $\\sim$.' },

  // Q2
  { chapterCode: CODE, difficulty: 'easy', concept: '항상 닮음인 도형', requiredSkills: SKILLS_DEF,
    stem: '두 정삼각형은 항상 닮음인가?',
    steps: [
      { stepType: 'CONCEPT', prompt: '정삼각형의 모든 각?', options: [
        { key: 'A', text: '모두 $60°$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$30°, 60°, 90°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '직각삼각형' },
        { key: 'C', text: '한 각 $90°$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '직각' },
        { key: 'D', text: '두 각 같음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '이등변' },
        { key: 'E', text: '모두 다름', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '정삼각형 정의 위배' },
      ] },
      { stepType: 'PROCESS', prompt: '세 각이 같은 두 삼각형은?', options: [
        { key: 'A', text: 'AA 닮음 (사실은 AAA)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '항상 합동', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '크기 다를 수 있음' },
        { key: 'C', text: '닮음이 아님', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '닮음' },
        { key: 'D', text: '직각삼각형만', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '범위 좁음' },
        { key: 'E', text: '같은 평면 위만', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '두 정삼각형은?', options: [
        { key: 'A', text: '항상 닮음', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '항상 합동', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '한 변 길이 다를 수' },
        { key: 'C', text: '한 변이 같을 때만 닮음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '항상' },
        { key: 'D', text: '닮음이 아님', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '닮음' },
        { key: 'E', text: '면적이 같을 때만 닮음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '면적과 무관' },
      ] },
    ], solution: '정삼각형은 모든 각이 $60°$이므로 두 정삼각형은 AA 닮음 → 항상 닮음.' },

  // Q3
  { chapterCode: CODE, difficulty: 'easy', concept: '닮음비 의미', requiredSkills: SKILLS_RATIO_LEN,
    stem: '닮음비 $1:2$인 두 도형에서 대응변 길이의 관계는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '닮음비란?', options: [
        { key: 'A', text: '대응변 길이의 비율', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '넓이의 비율', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '넓이비' },
        { key: 'C', text: '부피의 비율', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '부피비' },
        { key: 'D', text: '각도의 비율', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '각은 같음' },
        { key: 'E', text: '둘레의 곱', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$1:2$ 의미?', options: [
        { key: 'A', text: '큰 도형 변이 작은 도형의 $2$ 배', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '작은 도형이 큰 도형의 $2$ 배', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '거꾸로' },
        { key: 'C', text: '차이가 $2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '비율 ≠ 차' },
        { key: 'D', text: '두 도형이 합동', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '닮음 (다름)' },
        { key: 'E', text: '면적이 $2$ 배', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '넓이비는 $k^2$' },
      ] },
      { stepType: 'ANSWER', prompt: '대응변 관계?', options: [
        { key: 'A', text: '한 쪽이 다른 쪽의 $2$ 배', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$4$ 배 (넓이비 적용)', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '제곱 적용 잘못' },
        { key: 'C', text: '$8$ 배 (부피비)', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '세제곱' },
        { key: 'D', text: '같음', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '합동 아님' },
        { key: 'E', text: '반', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '큰 쪽 기준' },
      ] },
    ], solution: '닮음비 $1:2$ → 대응변 길이 $2$ 배.' },

  // Q4
  { chapterCode: CODE, difficulty: 'easy', concept: '닮음비로 대응변 찾기', requiredSkills: SKILLS_RATIO_LEN,
    stem: '닮음비 $2:3$인 두 도형. 작은 쪽 한 변이 $4$cm 라면 큰 쪽 대응변은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '비례식: $4 : x = 2 : 3$', options: [
        { key: 'A', text: '$2x = 4 \\times 3 = 12 \\Rightarrow x = 6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3x = 2 \\times 4 = 8 \\Rightarrow x = 8/3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '비례식 잘못' },
        { key: 'C', text: '$x = 4 \\times 2 / 3$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '비례식 잘못' },
        { key: 'D', text: '$x = 4 + 1$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$x = 4$ (같음)', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '같음 아님' },
      ] },
      { stepType: 'PROCESS', prompt: '$x = ?$', options: [
        { key: 'A', text: '$6$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$8/3 \\approx 2.67$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '비례식 잘못' },
        { key: 'C', text: '$12$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나누기 누락' },
        { key: 'D', text: '$5$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$2$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '큰 쪽 변?', options: [
        { key: 'A', text: '$6$ cm', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$8$ cm', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'C', text: '$12$ cm', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나누기 누락' },
        { key: 'D', text: '$2$ cm', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$\\dfrac{8}{3}$ cm', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '비례식 잘못' },
      ] },
    ], solution: '$4 : x = 2 : 3 \\Rightarrow 2x = 12 \\Rightarrow x = 6$ cm.' },

  // Q5
  { chapterCode: CODE, difficulty: 'easy', concept: '항상 닮음 (원)', requiredSkills: SKILLS_DEF,
    stem: '두 원은 항상 닮음인가?',
    steps: [
      { stepType: 'CONCEPT', prompt: '원의 모양?', options: [
        { key: 'A', text: '반지름에 관계없이 모든 원은 같은 모양', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '반지름이 다르면 모양도 다름', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'C', text: '큰 원은 사각형에 가까움', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '근거 없음' },
        { key: 'D', text: '같은 색깔만 닮음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '색 무관' },
        { key: 'E', text: '같은 반지름만 닮음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '같은 반지름 = 합동' },
      ] },
      { stepType: 'PROCESS', prompt: '두 원의 관계는?', options: [
        { key: 'A', text: '항상 닮음 (반지름비가 닮음비)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '항상 합동', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '반지름 다르면 합동 아님' },
        { key: 'C', text: '닮음이 아닐 수도', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '항상 닮음' },
        { key: 'D', text: '면적이 같을 때만', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '면적 무관' },
        { key: 'E', text: '둘레가 같을 때만', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '둘레 무관' },
      ] },
      { stepType: 'ANSWER', prompt: '두 원은?', options: [
        { key: 'A', text: '항상 닮음', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '같은 반지름일 때만 닮음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '항상' },
        { key: 'C', text: '닮음 아님', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '닮음' },
        { key: 'D', text: '면적이 같을 때만 닮음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '무관' },
        { key: 'E', text: '특정 위치일 때만', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '위치 무관' },
      ] },
    ], solution: '모든 원은 반지름에 관계없이 같은 모양 → 항상 닮음. (정사각형끼리, 정n각형끼리도 같음)' },

  // Q6
  { chapterCode: CODE, difficulty: 'easy', concept: '삼각형 닮음 조건', requiredSkills: SKILLS_COND,
    stem: '삼각형 닮음 조건이 아닌 것은?',
    steps: [
      { stepType: 'CONCEPT', prompt: '닮음 조건 종류?', options: [
        { key: 'A', text: 'SSS 닮음, SAS 닮음, AA 닮음', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: 'SSS, SAS, ASA', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '합동 조건' },
        { key: 'C', text: 'AAA만', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '여러 개' },
        { key: 'D', text: '없음', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '존재' },
        { key: 'E', text: '면적·둘레 비교', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '"두 각 비교"는?', options: [
        { key: 'A', text: 'AA 닮음 (두 각이 같으면 나머지 한 각도 같음)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: 'AAS 닮음 (없음)', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: 'AA로 충분' },
        { key: 'C', text: '닮음이 아님', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '닮음' },
        { key: 'D', text: '합동 조건', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '변 정보 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'ANSWER', prompt: '닮음 조건이 아닌 것은?', options: [
        { key: 'A', text: 'ASA (합동조건)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: 'AA', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '닮음 조건' },
        { key: 'C', text: 'SAS 닮음', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '닮음' },
        { key: 'D', text: 'SSS 닮음', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '닮음' },
        { key: 'E', text: '모두 닮음 조건', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: 'ASA는 합동' },
      ] },
    ], solution: '닮음 조건: SSS, SAS, AA. ASA는 합동조건 (변까지 같음).' },

  // Q7
  { chapterCode: CODE, difficulty: 'medium', concept: '닮음비 → 넓이비 (1:3)', requiredSkills: SKILLS_RATIO_AREA,
    stem: '닮음비 $1:3$ 인 두 도형의 넓이비는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '넓이비 공식?', options: [
        { key: 'A', text: '닮음비 $k$ → 넓이비 $k^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '넓이비 = 닮음비 (그대로)', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '대표적 오개념' },
        { key: 'C', text: '넓이비 = $k^3$ (세제곱)', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '부피 공식' },
        { key: 'D', text: '넓이비 = $2k$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '넓이비 = $k/2$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$1^2 : 3^2 = ?$', options: [
        { key: 'A', text: '$1 : 9$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1 : 3$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '제곱 안 함' },
        { key: 'C', text: '$1 : 6$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '두 배' },
        { key: 'D', text: '$1 : 27$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '세제곱' },
        { key: 'E', text: '$2 : 6$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '넓이비?', options: [
        { key: 'A', text: '$1 : 9$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1 : 3$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '대표적 오개념' },
        { key: 'C', text: '$1 : 27$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '부피비' },
        { key: 'D', text: '$3 : 1$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '거꾸로' },
        { key: 'E', text: '$1 : 6$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '닮음비 $1:3$ → 넓이비 $1^2 : 3^2 = 1 : 9$.' },

  // Q8
  { chapterCode: CODE, difficulty: 'medium', concept: '닮음비 → 넓이비 (2:5)', requiredSkills: SKILLS_RATIO_AREA,
    stem: '닮음비 $2:5$ 인 두 도형의 넓이비는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '공식 적용', options: [
        { key: 'A', text: '$2^2 : 5^2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2 : 5$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '제곱 안 함' },
        { key: 'C', text: '$2^3 : 5^3$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '부피' },
        { key: 'D', text: '$2 \\cdot 5 : 5 \\cdot 2$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$4 : 10$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '한쪽만 제곱' },
      ] },
      { stepType: 'PROCESS', prompt: '$4 : 25 = ?$', options: [
        { key: 'A', text: '$4 : 25$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2 : 5$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '제곱 안 함' },
        { key: 'C', text: '$8 : 125$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '세제곱' },
        { key: 'D', text: '$10 : 25$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '한쪽만' },
        { key: 'E', text: '$4 : 10$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '한쪽만' },
      ] },
      { stepType: 'ANSWER', prompt: '넓이비?', options: [
        { key: 'A', text: '$4 : 25$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2 : 5$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '제곱 안 함' },
        { key: 'C', text: '$8 : 125$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '부피비' },
        { key: 'D', text: '$10 : 25$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '한쪽만 제곱' },
        { key: 'E', text: '$25 : 4$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '거꾸로' },
      ] },
    ], solution: '닮음비 $2:5$ → 넓이비 $4:25$.' },

  // Q9
  { chapterCode: CODE, difficulty: 'medium', concept: '닮음비 → 부피비 (1:2)', requiredSkills: SKILLS_RATIO_VOL,
    stem: '닮음비 $1:2$ 인 두 입체의 부피비는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '부피비 공식?', options: [
        { key: 'A', text: '닮음비 $k$ → 부피비 $k^3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '닮음비 그대로', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '대표적 오개념' },
        { key: 'C', text: '$k^2$ (넓이 공식)', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '넓이' },
        { key: 'D', text: '$3k$', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$k/3$', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$1^3 : 2^3$', options: [
        { key: 'A', text: '$1 : 8$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1 : 2$', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '세제곱 안 함' },
        { key: 'C', text: '$1 : 4$', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '제곱 (넓이)' },
        { key: 'D', text: '$2 : 8$', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$1 : 6$', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '부피비?', options: [
        { key: 'A', text: '$1 : 8$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1 : 2$', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '대표적 오개념' },
        { key: 'C', text: '$1 : 4$', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '넓이비' },
        { key: 'D', text: '$8 : 1$', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '거꾸로' },
        { key: 'E', text: '$1 : 6$', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '닮음비 $1:2$ → 부피비 $1:8$.' },

  // Q10
  { chapterCode: CODE, difficulty: 'medium', concept: '닮음비 → 부피비 (3:5)', requiredSkills: SKILLS_RATIO_VOL,
    stem: '닮음비 $3:5$ 인 두 입체의 부피비는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '$3^3 : 5^3$', options: [
        { key: 'A', text: '$27 : 125$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3 : 5$', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '세제곱 안 함' },
        { key: 'C', text: '$9 : 25$', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '제곱 (넓이)' },
        { key: 'D', text: '$15 : 27$', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$9 : 27$', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '한쪽만' },
      ] },
      { stepType: 'PROCESS', prompt: '계산 확인', options: [
        { key: 'A', text: '$3^3 = 27, 5^3 = 125$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3^3 = 9, 5^3 = 25$', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '제곱으로' },
        { key: 'C', text: '$3 \\cdot 3 = 6, 5 \\cdot 5 = 10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '곱 잘못' },
        { key: 'D', text: '$3 + 3 + 3 = 9$', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '합' },
        { key: 'E', text: '계산 불가', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'ANSWER', prompt: '부피비?', options: [
        { key: 'A', text: '$27 : 125$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$3 : 5$', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '세제곱 안 함' },
        { key: 'C', text: '$9 : 25$', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '넓이비' },
        { key: 'D', text: '$125 : 27$', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '거꾸로' },
        { key: 'E', text: '$6 : 10$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$3^3 : 5^3 = 27 : 125$.' },

  // Q11
  { chapterCode: CODE, difficulty: 'medium', concept: '넓이비 → 닮음비 역추적', requiredSkills: SKILLS_RATIO_INV,
    stem: '넓이비 $9:16$ 인 두 도형의 닮음비는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '역추적 방법?', options: [
        { key: 'A', text: '제곱근을 취함 ($\\sqrt{9} : \\sqrt{16}$)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2$ 로 나눔', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '제곱근 필요' },
        { key: 'C', text: '$3$ 으로 나눔', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '그대로 ($9:16$)', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '넓이비 그대로 잘못' },
        { key: 'E', text: '세제곱근', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '부피비 역추적' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\sqrt{9} = 3, \\sqrt{16} = 4$', options: [
        { key: 'A', text: '$3 : 4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$9 : 16$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '제곱근 안 함' },
        { key: 'C', text: '$2 : 4$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '잘못' },
        { key: 'D', text: '$\\sqrt{9} : 4 = 3 : 4$ 같음', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '맞지만 표현 어색' },
        { key: 'E', text: '$4.5 : 8$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '닮음비?', options: [
        { key: 'A', text: '$3 : 4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$9 : 16$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '제곱근 누락' },
        { key: 'C', text: '$4 : 3$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '거꾸로' },
        { key: 'D', text: '$\\sqrt{25}$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '합 잘못' },
        { key: 'E', text: '$2 : 4$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\sqrt{9 : 16} = 3 : 4$.' },

  // Q12
  { chapterCode: CODE, difficulty: 'medium', concept: '부피비 → 닮음비 역추적', requiredSkills: SKILLS_RATIO_INV,
    stem: '부피비 $8:27$ 인 두 입체의 닮음비는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '역추적 방법?', options: [
        { key: 'A', text: '세제곱근을 취함', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '제곱근', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '넓이비 역추적' },
        { key: 'C', text: '그대로', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '부피비 잘못' },
        { key: 'D', text: '$3$ 으로 나눔', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\sqrt[3]{8} = 2, \\sqrt[3]{27} = 3$', options: [
        { key: 'A', text: '$2 : 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$8 : 27$', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '세제곱근 안 함' },
        { key: 'C', text: '$4 : 9$ (제곱근)', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '제곱근 잘못' },
        { key: 'D', text: '$1 : 2$', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$3 : 9$', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '닮음비?', options: [
        { key: 'A', text: '$2 : 3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$8 : 27$', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '세제곱근 누락' },
        { key: 'C', text: '$4 : 9$', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '잘못' },
        { key: 'D', text: '$3 : 2$', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '거꾸로' },
        { key: 'E', text: '$1 : 8$', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$\\sqrt[3]{8 : 27} = 2 : 3$.' },

  // Q13
  { chapterCode: CODE, difficulty: 'medium', concept: 'SAS 닮음 조건', requiredSkills: SKILLS_COND,
    stem: '$\\triangle ABC, \\triangle DEF$ 에서 $\\angle A = \\angle D$, $AB:DE = AC:DF$ 이다. 어떤 닮음 조건?',
    steps: [
      { stepType: 'CONCEPT', prompt: '주어진 정보?', options: [
        { key: 'A', text: '두 변의 비 + 끼인 각', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '세 변의 비', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '두 변만' },
        { key: 'C', text: '두 각만', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '변 비도 포함' },
        { key: 'D', text: '한 변만', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '부족' },
        { key: 'E', text: '한 각만', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '부족' },
      ] },
      { stepType: 'PROCESS', prompt: '$\\angle A$ 가 $AB, AC$ 의 끼인 각인가?', options: [
        { key: 'A', text: '맞음', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '반대편 각', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '$\\angle A$ 정의' },
        { key: 'C', text: '근거 없음', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '맞음' },
        { key: 'D', text: '$BC$의 각', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '직각', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '닮음 조건?', options: [
        { key: 'A', text: 'SAS 닮음', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: 'SSS 닮음', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '세 변 비 필요' },
        { key: 'C', text: 'AA 닮음', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '두 각 필요' },
        { key: 'D', text: 'AAA', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '세 각' },
        { key: 'E', text: '닮음 아님', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: 'SAS 만족' },
      ] },
    ], solution: '두 변의 비 + 끼인 각 → SAS 닮음.' },

  // Q14
  { chapterCode: CODE, difficulty: 'medium', concept: 'AA 닮음 조건', requiredSkills: SKILLS_COND,
    stem: '$\\triangle ABC, \\triangle DEF$ 에서 $\\angle A = \\angle D$, $\\angle B = \\angle E$ 이다. 닮음 조건?',
    steps: [
      { stepType: 'CONCEPT', prompt: '두 각 같으면?', options: [
        { key: 'A', text: '나머지 한 각도 같음 (내각 합 $180°$) → 닮음', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '닮음 아님', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '닮음' },
        { key: 'C', text: '합동', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '변 정보 없음' },
        { key: 'D', text: '세 변도 같아야 닮음', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: 'AA만으로 충분' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '조건명?', options: [
        { key: 'A', text: 'AA 닮음', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: 'SSS', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '변 정보 없음' },
        { key: 'C', text: 'SAS', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '변 정보 없음' },
        { key: 'D', text: 'ASA 닮음', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: 'ASA는 합동 (변 필요)' },
        { key: 'E', text: 'AAA', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: 'AA로 충분' },
      ] },
      { stepType: 'ANSWER', prompt: '닮음 조건?', options: [
        { key: 'A', text: 'AA 닮음', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: 'SSS 닮음', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '변 정보 없음' },
        { key: 'C', text: 'SAS 닮음', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '변 정보 없음' },
        { key: 'D', text: '합동 ASA', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: '변 필요' },
        { key: 'E', text: '닮음 아님', isCorrect: false, errorCode: 'FORMULA_SELECTION_ERROR', errorReason: 'AA 만족' },
      ] },
    ], solution: 'AA 닮음 — 두 각이 같으면 닮음.' },

  // Q15
  { chapterCode: CODE, difficulty: 'medium', concept: '닮음비로 넓이 계산', requiredSkills: SKILLS_RATIO_AREA,
    stem: '닮음비 $2:3$ 인 두 도형. 작은 도형의 넓이가 $8$cm² 이면 큰 도형의 넓이는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '넓이비?', options: [
        { key: 'A', text: '$2^2 : 3^2 = 4 : 9$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2 : 3$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '제곱 안 함' },
        { key: 'C', text: '$8 : 27$ (세제곱)', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '부피' },
        { key: 'D', text: '$2 \\cdot 3 : 3 \\cdot 2$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$4 : 6$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '한쪽만' },
      ] },
      { stepType: 'PROCESS', prompt: '$8 : S = 4 : 9$', options: [
        { key: 'A', text: '$4S = 72 \\Rightarrow S = 18$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$S = 8 \\cdot 2 / 3 = 16/3$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '닮음비 직접' },
        { key: 'C', text: '$S = 8 + 4 = 12$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '합' },
        { key: 'D', text: '$S = 36$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$S = 24$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '큰 도형 넓이?', options: [
        { key: 'A', text: '$18$ cm²', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$12$ cm² (닮음비 직접)', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '닮음비 그대로' },
        { key: 'C', text: '$36$ cm²', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$24$ cm²', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$8$ cm²', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '변화 없음' },
      ] },
    ], solution: '$8 : S = 4 : 9 \\Rightarrow S = 18$ cm².' },

  // Q16 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '닮음비 = 둘레비', requiredSkills: SKILLS_PERIM,
    stem: '$\\triangle ABC \\sim \\triangle DEF$, 닮음비 $1:2$. $\\triangle ABC$ 둘레 $12$ cm. $\\triangle DEF$ 둘레?',
    steps: [
      { stepType: 'CONCEPT', prompt: '둘레비는 닮음비와 같은가?', options: [
        { key: 'A', text: '같음 (둘레는 길이의 합 = 1차원)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '제곱 (넓이비)', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '둘레는 1차원' },
        { key: 'C', text: '세제곱 (부피비)', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '둘레는 1차원' },
        { key: 'D', text: '반', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '관계 없음', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '관계 있음' },
      ] },
      { stepType: 'PROCESS', prompt: '$12 : P = 1 : 2$', options: [
        { key: 'A', text: '$P = 24$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$P = 48$ (제곱)', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '넓이비 적용' },
        { key: 'C', text: '$P = 96$ (세제곱)', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '부피비 적용' },
        { key: 'D', text: '$P = 6$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나누기' },
        { key: 'E', text: '$P = 12$', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '변화 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '둘레?', options: [
        { key: 'A', text: '$24$ cm', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$48$ cm', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '넓이비' },
        { key: 'C', text: '$96$ cm', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '부피비' },
        { key: 'D', text: '$6$ cm', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '나누기' },
        { key: 'E', text: '$12$ cm', isCorrect: false, errorCode: 'ALGEBRA_ERROR', errorReason: '변화 없음' },
      ] },
    ], solution: '둘레비 = 닮음비 = $1:2$. $12 \\times 2 = 24$ cm.' },

  // Q17 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '부피비로 부피 계산', requiredSkills: SKILLS_RATIO_VOL,
    stem: '닮음비 $2:3$ 인 두 입체. 작은 입체 부피 $16$ cm³. 큰 입체 부피?',
    steps: [
      { stepType: 'CONCEPT', prompt: '부피비?', options: [
        { key: 'A', text: '$2^3 : 3^3 = 8 : 27$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$2 : 3$', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '세제곱 안 함' },
        { key: 'C', text: '$4 : 9$', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '넓이비' },
        { key: 'D', text: '$6 : 9$', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$16 : 27$', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '$16 : V = 8 : 27$', options: [
        { key: 'A', text: '$8V = 16 \\cdot 27 = 432 \\Rightarrow V = 54$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$V = 16 \\cdot 3/2 = 24$', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '닮음비 직접' },
        { key: 'C', text: '$V = 16 \\cdot 9/4 = 36$', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '넓이비 적용' },
        { key: 'D', text: '$V = 72$', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$V = 48$', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '큰 부피?', options: [
        { key: 'A', text: '$54$ cm³', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$24$ cm³', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '닮음비 직접' },
        { key: 'C', text: '$36$ cm³', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '넓이비' },
        { key: 'D', text: '$72$ cm³', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$48$ cm³', isCorrect: false, errorCode: 'VOLUME_RATIO_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '$16 : V = 8 : 27 \\Rightarrow V = 54$ cm³.' },

  // Q18 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '넓이비 → 둘레비', requiredSkills: SKILLS_RATIO_INV,
    stem: '닮은 두 평면도형 넓이비 $4:9$. 작은 쪽 둘레 $10$cm 이면 큰 쪽 둘레?',
    steps: [
      { stepType: 'CONCEPT', prompt: '넓이비 → 닮음비', options: [
        { key: 'A', text: '닮음비 $= \\sqrt{4:9} = 2:3$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '닮음비 $= 4:9$ (그대로)', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '제곱근 누락' },
        { key: 'C', text: '닮음비 $= 16:81$ (제곱)', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '제곱 잘못' },
        { key: 'D', text: '판별 불가', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '가능' },
        { key: 'E', text: '닮음비 $= 8 : 27$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '둘레비 = 닮음비. $10 : P = 2 : 3$', options: [
        { key: 'A', text: '$P = 15$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$P = 22.5$ (넓이비 직접)', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '둘레는 1차원' },
        { key: 'C', text: '$P = 30$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$P = 20$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$P = 5$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '큰 쪽 둘레?', options: [
        { key: 'A', text: '$15$ cm', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$22.5$ cm', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '넓이비 직접' },
        { key: 'C', text: '$30$ cm', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '근거 없음' },
        { key: 'D', text: '$45$ cm', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '근거 없음' },
        { key: 'E', text: '$10$ cm', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '변화 없음' },
      ] },
    ], solution: '넓이비 $4:9$ → 닮음비 $2:3$ → 둘레비 $2:3$. $10 \\times 3/2 = 15$.' },

  // Q19 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '둘레비 → 넓이비', requiredSkills: SKILLS_RATIO_AREA,
    stem: '닮은 두 원의 둘레비가 $5:7$. 넓이비는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '둘레비는?', options: [
        { key: 'A', text: '닮음비와 같음 ($5:7$)', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '제곱', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '둘레는 1차원' },
        { key: 'C', text: '세제곱', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '부피' },
        { key: 'D', text: '관계 없음', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '있음' },
        { key: 'E', text: '반', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '근거 없음' },
      ] },
      { stepType: 'PROCESS', prompt: '넓이비 $= 닮음비^2 = 5^2 : 7^2$', options: [
        { key: 'A', text: '$25 : 49$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5 : 7$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '제곱 안 함' },
        { key: 'C', text: '$125 : 343$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '세제곱' },
        { key: 'D', text: '$10 : 14$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '두 배' },
        { key: 'E', text: '$2.5 : 3.5$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '반' },
      ] },
      { stepType: 'ANSWER', prompt: '넓이비?', options: [
        { key: 'A', text: '$25 : 49$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$5 : 7$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '둘레비 그대로' },
        { key: 'C', text: '$125 : 343$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '부피비' },
        { key: 'D', text: '$49 : 25$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '거꾸로' },
        { key: 'E', text: '$10 : 14$', isCorrect: false, errorCode: 'AREA_RATIO_ERROR', errorReason: '근거 없음' },
      ] },
    ], solution: '둘레비 = 닮음비 = $5:7$. 넓이비 $= 5^2 : 7^2 = 25 : 49$.' },

  // Q20 (hard)
  { chapterCode: CODE, difficulty: 'hard', concept: '부피비 → 겉넓이비', requiredSkills: SKILLS_RATIO_INV,
    stem: '닮은 두 입체의 부피비가 $1:8$. 겉넓이비는?',
    steps: [
      { stepType: 'CONCEPT', prompt: '부피비 → 닮음비', options: [
        { key: 'A', text: '$\\sqrt[3]{1:8} = 1:2$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1 : 8$ (그대로)', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '세제곱근 누락' },
        { key: 'C', text: '$\\sqrt{1:8}$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '제곱근 잘못' },
        { key: 'D', text: '$1 : 64$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '제곱' },
        { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '가능' },
      ] },
      { stepType: 'PROCESS', prompt: '겉넓이비 = 닮음비$^2$', options: [
        { key: 'A', text: '$1^2 : 2^2 = 1 : 4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1 : 8$ (부피비 그대로)', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '제곱 안 함' },
        { key: 'C', text: '$1 : 2$ (닮음비 그대로)', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '제곱 안 함' },
        { key: 'D', text: '$1 : 16$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '세제곱' },
        { key: 'E', text: '$1 : 64$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
      { stepType: 'ANSWER', prompt: '겉넓이비?', options: [
        { key: 'A', text: '$1 : 4$', isCorrect: true, errorCode: null, errorReason: null },
        { key: 'B', text: '$1 : 8$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '부피비 그대로' },
        { key: 'C', text: '$1 : 2$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '닮음비 그대로' },
        { key: 'D', text: '$1 : 16$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
        { key: 'E', text: '$1 : 64$', isCorrect: false, errorCode: 'CONDITION_MISSING', errorReason: '근거 없음' },
      ] },
    ], solution: '부피비 $1:8$ → 닮음비 $1:2$ → 겉넓이비 $1:4$.' },
];

export const K_G8_MATH2_CH06_SIMILARITY_CHAPTER: KoreanChapterProblems = {
  chapterCode: CODE,
  problems,
};
