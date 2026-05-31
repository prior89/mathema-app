/**
 * K-G8-MATH2-CH06-SIMILARITY — STUDY pool (single-step, 20문제).
 * 도형의 닮음 — 닮음비·넓이비·부피비·둘레비.
 * Mastery 3-step과 별도 변형 문제. 중2 (G8).
 *
 * 난이도 분배: 쉬움 6 / 중간 9 / 어려움 5. LLM 미사용.
 */
import type { KoreanStudyChapterProblems, KoreanStudyProblemSeed } from './types';

const CODE = 'K-G8-MATH2-CH06-SIMILARITY';
const SKILLS_DEF = ['similarity_symbol', 'always_similar_shapes'];
const SKILLS_RATIO_LEN = ['similarity_ratio', 'corresponding_side_length'];
const SKILLS_RATIO_AREA = ['area_ratio_squared', 'similarity_to_area'];
const SKILLS_RATIO_VOL = ['volume_ratio_cubed', 'similarity_to_volume'];
const SKILLS_RATIO_INV = ['area_to_similarity', 'volume_to_similarity'];
const SKILLS_PERIM = ['perimeter_equals_similarity', 'perimeter_ratio'];
const SKILLS_COND = ['triangle_similarity_aa', 'triangle_similarity_sas'];

const problems: KoreanStudyProblemSeed[] = [
  // S1 (쉬움) 두 정사각형 닮음
  { chapterCode: CODE, difficulty: 'easy', concept: '두 정사각형 닮음', requiredSkills: SKILLS_DEF,
    stem: '두 정사각형은 항상 닮음인가?',
    options: [
      { key: 'A', text: '예 — 항상 닮음', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '아니오 — 크기 다르면 닮음 아님', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '크기 차이는 닮음의 특성 (크기 같으면 합동)' },
      { key: 'C', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '명확히 항상 닮음' },
      { key: 'D', text: '대각선이 같을 때만', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '대각선 조건 무관' },
      { key: 'E', text: '한 변이 같을 때만 (= 합동)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '닮음은 크기 다른 것도 포함' },
    ],
    solution: '모든 정사각형은 모양(네 각 $90°$, 네 변 같음)이 같으므로 항상 닮음.' },

  // S2 (쉬움) 합동과 닮음
  { chapterCode: CODE, difficulty: 'easy', concept: '합동 도형은 닮음', requiredSkills: SKILLS_DEF,
    stem: '두 합동인 도형은 닮음 관계인가?',
    options: [
      { key: 'A', text: '예 — 합동은 닮음비 $1:1$ 인 특별한 경우', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '아니오 — 합동과 닮음은 별개', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합동은 닮음의 특수한 경우' },
      { key: 'C', text: '닮음만 가능 (합동 아님)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '관계 반대로 이해' },
      { key: 'D', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '명확한 관계' },
      { key: 'E', text: '한 변이 같을 때만 닮음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '합동이면 자동 닮음' },
    ],
    solution: '합동 → 모든 대응 요소 같음 → 닮음비 $1:1$ → 닮음.' },

  // S3 (쉬움) 닮음비 1:3 대응변
  { chapterCode: CODE, difficulty: 'easy', concept: '닮음비 $1:3$ 대응변 관계', requiredSkills: SKILLS_RATIO_LEN,
    stem: '닮음비 $1:3$ 인 두 도형에서 대응변 길이의 관계는?',
    options: [
      { key: 'A', text: '큰 쪽이 작은 쪽의 $3$ 배', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '큰 쪽이 작은 쪽의 $9$ 배', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '넓이비 적용 ($3^2$)' },
      { key: 'C', text: '큰 쪽이 작은 쪽의 $\\dfrac{1}{3}$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '비 방향 바꿈' },
      { key: 'D', text: '같다 (합동)', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$1:3$은 합동 아님' },
      { key: 'E', text: '큰 쪽이 작은 쪽의 $27$ 배', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부피비 ($3^3$)' },
    ],
    solution: '닮음비 $1:3$ → 대응변 비 그대로 $1:3$. 큰 쪽 = 작은 쪽 × 3.' },

  // S4 (쉬움) 닮음비 3:5 대응변 길이
  { chapterCode: CODE, difficulty: 'easy', concept: '닮음비로 대응변 길이', requiredSkills: SKILLS_RATIO_LEN,
    stem: '닮음비 $3:5$ 인 두 도형. 작은 쪽 한 변이 $9$ cm 라면 큰 쪽 대응변은?',
    options: [
      { key: 'A', text: '$15$ cm', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$5$ cm', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '비의 값 자체' },
      { key: 'C', text: '$25$ cm', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '넓이비 적용' },
      { key: 'D', text: '$11$ cm', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$9 + 2$ 등 잘못된 식' },
      { key: 'E', text: '$\\dfrac{27}{5}$ cm', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '큰 쪽에서 작은 쪽으로 잘못 계산' },
    ],
    solution: '$3 : 5 = 9 : x \\to 3x = 45 \\to x = 15$ cm.' },

  // S5 (쉬움) 정삼각형 닮음비
  { chapterCode: CODE, difficulty: 'easy', concept: '두 정삼각형의 닮음비', requiredSkills: SKILLS_RATIO_LEN,
    stem: '한 변이 $4$ cm 인 정삼각형과 한 변이 $6$ cm 인 정삼각형의 닮음비는?',
    options: [
      { key: 'A', text: '$2 : 3$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$4 : 6$', isCorrect: false, errorCode: 'SIMPLIFICATION_ERROR', errorReason: '약분 안 함' },
      { key: 'C', text: '$3 : 2$', isCorrect: false, errorCode: 'COORDINATE_ERROR', errorReason: '비 방향 바꿈' },
      { key: 'D', text: '$4 : 9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '넓이비 ($4 : 6$ 제곱 형태)' },
      { key: 'E', text: '$1 : 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 약분' },
    ],
    solution: '대응변 비 $4 : 6 = 2 : 3$.' },

  // S6 (쉬움) 직각삼각형 닮음 아님
  { chapterCode: CODE, difficulty: 'easy', concept: '직각삼각형은 항상 닮음 아님', requiredSkills: SKILLS_DEF,
    stem: '두 직각삼각형은 항상 닮음인가?',
    options: [
      { key: 'A', text: '아니오 — 다른 두 각이 같아야 닮음', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '예 — 항상 닮음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '직각만 같다고 닮음 아님' },
      { key: 'C', text: '예 — 빗변 비례하면 닮음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '두 각 또는 SAS 필요' },
      { key: 'D', text: '둘레가 같을 때만 닮음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '관련 없음' },
      { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '판별 가능' },
    ],
    solution: '직각 외에 다른 예각 하나가 더 같아야 닮음 (AA 조건).' },

  // S7 (중) 닮음비 → 넓이비 1:4
  { chapterCode: CODE, difficulty: 'medium', concept: '닮음비 1:4 → 넓이비', requiredSkills: SKILLS_RATIO_AREA,
    stem: '닮음비 $1:4$ 인 두 도형의 넓이비는?',
    options: [
      { key: 'A', text: '$1 : 16$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$1 : 4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '닮음비 그대로' },
      { key: 'C', text: '$1 : 64$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부피비 ($4^3$)' },
      { key: 'D', text: '$1 : 8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$4 \\times 2$ 잘못된 식' },
      { key: 'E', text: '$2 : 8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '단순 배수' },
    ],
    solution: '넓이비 $= ($닮음비$)^2 = 1^2 : 4^2 = 1 : 16$.' },

  // S8 (중) 닮음비 → 넓이비 3:4
  { chapterCode: CODE, difficulty: 'medium', concept: '닮음비 3:4 → 넓이비', requiredSkills: SKILLS_RATIO_AREA,
    stem: '닮음비 $3:4$ 인 두 도형의 넓이비는?',
    options: [
      { key: 'A', text: '$9 : 16$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3 : 4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '닮음비 그대로' },
      { key: 'C', text: '$6 : 8$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$2$배 단순' },
      { key: 'D', text: '$27 : 64$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부피비 ($3^3 : 4^3$)' },
      { key: 'E', text: '$12 : 16$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '한쪽만 제곱' },
    ],
    solution: '넓이비 $= 3^2 : 4^2 = 9 : 16$.' },

  // S9 (중) 닮음비 → 부피비 1:3
  { chapterCode: CODE, difficulty: 'medium', concept: '닮음비 1:3 → 부피비', requiredSkills: SKILLS_RATIO_VOL,
    stem: '닮음비 $1:3$ 인 두 입체의 부피비는?',
    options: [
      { key: 'A', text: '$1 : 27$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$1 : 9$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '넓이비 ($3^2$)' },
      { key: 'C', text: '$1 : 3$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '닮음비 그대로' },
      { key: 'D', text: '$3 : 9$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '단순 배수' },
      { key: 'E', text: '$1 : 81$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '$3^4$ 잘못' },
    ],
    solution: '부피비 $= ($닮음비$)^3 = 1^3 : 3^3 = 1 : 27$.' },

  // S10 (중) 닮음비 → 부피비 2:5
  { chapterCode: CODE, difficulty: 'medium', concept: '닮음비 2:5 → 부피비', requiredSkills: SKILLS_RATIO_VOL,
    stem: '닮음비 $2:5$ 인 두 입체의 부피비는?',
    options: [
      { key: 'A', text: '$8 : 125$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$4 : 25$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '넓이비 (제곱)' },
      { key: 'C', text: '$2 : 5$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '닮음비 그대로' },
      { key: 'D', text: '$6 : 15$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$3$배 단순' },
      { key: 'E', text: '$10 : 25$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '한쪽만 잘못' },
    ],
    solution: '부피비 $= 2^3 : 5^3 = 8 : 125$.' },

  // S11 (중) 넓이비 → 닮음비
  { chapterCode: CODE, difficulty: 'medium', concept: '넓이비 → 닮음비 (제곱근)', requiredSkills: SKILLS_RATIO_INV,
    stem: '넓이비 $4:25$ 인 두 도형의 닮음비는?',
    options: [
      { key: 'A', text: '$2 : 5$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$4 : 25$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '넓이비 그대로' },
      { key: 'C', text: '$16 : 625$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '제곱 다시 한 결과' },
      { key: 'D', text: '$1 : 5$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 제곱근' },
      { key: 'E', text: '$8 : 125$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부피비 형태' },
    ],
    solution: '닮음비 $= \\sqrt{넓이비} = \\sqrt{4} : \\sqrt{25} = 2 : 5$.' },

  // S12 (중) 부피비 → 닮음비
  { chapterCode: CODE, difficulty: 'medium', concept: '부피비 → 닮음비 (세제곱근)', requiredSkills: SKILLS_RATIO_INV,
    stem: '부피비 $1:64$ 인 두 입체의 닮음비는?',
    options: [
      { key: 'A', text: '$1 : 4$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$1 : 8$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '제곱근 (넓이비 처리)' },
      { key: 'C', text: '$1 : 64$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부피비 그대로' },
      { key: 'D', text: '$1 : 16$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 근' },
      { key: 'E', text: '$1 : 2$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 근' },
    ],
    solution: '닮음비 $= \\sqrt[3]{부피비} = \\sqrt[3]{1} : \\sqrt[3]{64} = 1 : 4$.' },

  // S13 (중) SSS 닮음
  { chapterCode: CODE, difficulty: 'medium', concept: 'SSS 닮음 조건', requiredSkills: SKILLS_COND,
    stem: '$\\triangle ABC, \\triangle DEF$ 에서 $AB:DE = BC:EF = CA:FD$ 이면 어떤 닮음 조건?',
    options: [
      { key: 'A', text: 'SSS', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: 'SAS', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '각 정보 없음' },
      { key: 'C', text: 'AA', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '각 정보 없음' },
      { key: 'D', text: '합동', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '같은 비율 — 합동은 같은 길이' },
      { key: 'E', text: '닮음 아님', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '세 변 비례 → SSS 닮음' },
    ],
    solution: '세 변의 비가 모두 같으면 SSS 닮음.' },

  // S14 (중) AA 닮음 적용
  { chapterCode: CODE, difficulty: 'medium', concept: 'AA 닮음 적용', requiredSkills: SKILLS_COND,
    stem: '$\\triangle ABC$ 에서 $\\angle A = 70°$, $\\angle B = 50°$. $\\triangle DEF$ 에서 $\\angle D = 70°$, $\\angle E = 50°$. 두 삼각형의 관계는?',
    options: [
      { key: 'A', text: '닮음 (AA)', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '합동', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '각만 같다고 합동 X' },
      { key: 'C', text: '관계 없음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: 'AA → 닮음' },
      { key: 'D', text: 'SAS 닮음', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '변 정보 없음' },
      { key: 'E', text: '판별 불가', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '판별 가능' },
    ],
    solution: '두 쌍의 대응각이 같음 → AA 닮음. (세 번째 각도 자동으로 $60°$.)' },

  // S15 (중) 닮음비 → 큰 넓이
  { chapterCode: CODE, difficulty: 'medium', concept: '닮음비로 넓이 계산', requiredSkills: SKILLS_RATIO_AREA,
    stem: '닮음비 $1:3$ 인 두 도형. 작은 도형의 넓이가 $5$ cm² 이면 큰 도형의 넓이는?',
    options: [
      { key: 'A', text: '$45$ cm²', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$15$ cm²', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '닮음비 그대로 곱함 ($5 \\times 3$)' },
      { key: 'C', text: '$135$ cm²', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부피비 적용 ($5 \\times 27$)' },
      { key: 'D', text: '$25$ cm²', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$5^2$ 잘못' },
      { key: 'E', text: '$8$ cm²', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$5 + 3$' },
    ],
    solution: '넓이비 $= 1 : 9$. 큰 넓이 $= 5 \\times 9 = 45$ cm².' },

  // S16 (어려움) 닮음비 = 둘레비
  { chapterCode: CODE, difficulty: 'hard', concept: '닮음비 = 둘레비', requiredSkills: SKILLS_PERIM,
    stem: '$\\triangle ABC \\sim \\triangle DEF$, 닮음비 $2:5$. $\\triangle ABC$ 둘레가 $12$ cm 라면 $\\triangle DEF$ 둘레는?',
    options: [
      { key: 'A', text: '$30$ cm', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$24$ cm', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$12 \\times 2$ 잘못된 비' },
      { key: 'C', text: '$75$ cm', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '넓이비 적용 ($12 \\times 25/4$)' },
      { key: 'D', text: '$15$ cm', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 식' },
      { key: 'E', text: '$60$ cm', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$12 \\times 5$' },
    ],
    solution: '둘레비 = 닮음비 $= 2 : 5$. $2 : 5 = 12 : x \\to x = 30$ cm.' },

  // S17 (어려움) 닮음비 → 큰 부피
  { chapterCode: CODE, difficulty: 'hard', concept: '부피비로 부피 계산', requiredSkills: SKILLS_RATIO_VOL,
    stem: '닮음비 $1:4$ 인 두 입체. 작은 입체의 부피가 $2$ cm³ 이면 큰 입체의 부피는?',
    options: [
      { key: 'A', text: '$128$ cm³', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$8$ cm³', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '닮음비 그대로 ($2 \\times 4$)' },
      { key: 'C', text: '$32$ cm³', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '넓이비 적용 ($2 \\times 16$)' },
      { key: 'D', text: '$64$ cm³', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '한 단계 누락' },
      { key: 'E', text: '$256$ cm³', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2 \\times 4^4$ 잘못' },
    ],
    solution: '부피비 $= 1 : 64$. 큰 부피 $= 2 \\times 64 = 128$ cm³.' },

  // S18 (어려움) 넓이비 → 둘레비 → 큰 둘레
  { chapterCode: CODE, difficulty: 'hard', concept: '넓이비 → 둘레비', requiredSkills: SKILLS_RATIO_INV,
    stem: '닮은 두 평면도형의 넓이비가 $25:36$ 이다. 작은 쪽 둘레가 $15$ cm 이면 큰 쪽 둘레는?',
    options: [
      { key: 'A', text: '$18$ cm', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$21$ cm', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '잘못된 비' },
      { key: 'C', text: '$25$ cm', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '넓이비 직접 적용' },
      { key: 'D', text: '$30$ cm', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '$2$ 배' },
      { key: 'E', text: '$36$ cm', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '넓이비 값 자체' },
    ],
    solution: '닮음비 $= \\sqrt{25} : \\sqrt{36} = 5 : 6$. 둘레비 같음. $5 : 6 = 15 : x \\to x = 18$ cm.' },

  // S19 (어려움) 둘레비 → 넓이비
  { chapterCode: CODE, difficulty: 'hard', concept: '둘레비 → 넓이비', requiredSkills: SKILLS_RATIO_AREA,
    stem: '닮은 두 원의 둘레비가 $3:8$ 이다. 두 원의 넓이비는?',
    options: [
      { key: 'A', text: '$9 : 64$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3 : 8$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '둘레비 그대로' },
      { key: 'C', text: '$6 : 16$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2$ 배 단순' },
      { key: 'D', text: '$27 : 512$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부피비 형태 ($3^3 : 8^3$)' },
      { key: 'E', text: '$9 : 16$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '한쪽만 제곱' },
    ],
    solution: '둘레비 = 닮음비 $= 3 : 8$. 넓이비 $= 3^2 : 8^2 = 9 : 64$.' },

  // S20 (어려움) 부피비 → 겉넓이비
  { chapterCode: CODE, difficulty: 'hard', concept: '부피비 → 겉넓이비', requiredSkills: SKILLS_RATIO_INV,
    stem: '닮은 두 입체의 부피비가 $27 : 64$ 이다. 두 입체의 겉넓이비는?',
    options: [
      { key: 'A', text: '$9 : 16$', isCorrect: true, errorCode: null, errorReason: null },
      { key: 'B', text: '$3 : 4$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '닮음비 답함' },
      { key: 'C', text: '$27 : 64$', isCorrect: false, errorCode: 'CONCEPT_MISUNDERSTANDING', errorReason: '부피비 그대로' },
      { key: 'D', text: '$81 : 256$', isCorrect: false, errorCode: 'EXPONENT_ERROR', errorReason: '제곱 다시 함' },
      { key: 'E', text: '$6 : 8$', isCorrect: false, errorCode: 'ARITHMETIC_ERROR', errorReason: '$2$ 배 단순' },
    ],
    solution: '닮음비 $= \\sqrt[3]{27} : \\sqrt[3]{64} = 3 : 4$. 겉넓이비 $= 3^2 : 4^2 = 9 : 16$.' },
];

export const K_G8_MATH2_CH06_SIMILARITY_STUDY_CHAPTER: KoreanStudyChapterProblems = {
  chapterCode: CODE,
  problems,
};
