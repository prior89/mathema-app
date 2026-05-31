/**
 * seed-korean-curriculum.ts — populates KoreanConceptLesson rows for the
 * Korean 2022 개정 math curriculum (중1 ~ 고3 elective tracks).
 *
 * Phase 1 scope: metadata only.
 *   - titleKo (chapter name)
 *   - bigIdeaKo (1-sentence learning objective; placeholders for now)
 *   - prerequisiteCodes (DAG of chapter dependencies)
 *   - chapterNumber + chapterCode (stable identity)
 *
 * Out of scope for Phase 1:
 *   - KoreanConceptStep entries (LHS-rich content)
 *   - Mastery 20-set curation (needs a Korean problem pool first)
 *   - bigIdea content authoring (LLM pass in Phase 2)
 *
 * Run:
 *   npx ts-node scripts/seed-korean-curriculum.ts
 *
 * Idempotent — upserts by chapterCode.
 */

import { PrismaClient, KoreanGrade, KoreanSubject } from '@prisma/client';

type ChapterSeed = {
  grade: KoreanGrade;
  subject: KoreanSubject;
  chapterNumber: number;
  chapterCode: string;
  titleKo: string;
  titleEn?: string;
  bigIdeaKo: string;
  prerequisiteCodes?: string[];
  estimatedMin?: number;
  cognitiveLoad?: number; // 0=light, 3=killer
};

// ============================================================================
//  중학교 (Middle school)
// ============================================================================

const MIDDLE_1: ChapterSeed[] = [
  {
    grade: 'MIDDLE_1', subject: 'MIDDLE_MATH_1', chapterNumber: 1,
    chapterCode: 'K-G7-MATH1-CH01-FACTORIZATION',
    titleKo: '소인수분해',
    titleEn: 'Prime Factorization',
    bigIdeaKo: '모든 자연수는 단 한 가지 방법으로 소수의 곱으로 분해된다 — 이 사실이 약수·배수 문제의 출발점이다.',
    cognitiveLoad: 1,
  },
  {
    grade: 'MIDDLE_1', subject: 'MIDDLE_MATH_1', chapterNumber: 2,
    chapterCode: 'K-G7-MATH1-CH02-INTEGERS',
    titleKo: '정수와 유리수',
    titleEn: 'Integers and Rational Numbers',
    bigIdeaKo: '음수의 도입으로 수직선이 양쪽으로 확장되고, 부호 규칙은 곱셈·나눗셈의 새로운 언어가 된다.',
    prerequisiteCodes: ['K-G7-MATH1-CH01-FACTORIZATION'],
    cognitiveLoad: 2,
  },
  {
    grade: 'MIDDLE_1', subject: 'MIDDLE_MATH_1', chapterNumber: 3,
    chapterCode: 'K-G7-MATH1-CH03-LETTERS-EQ',
    titleKo: '문자와 식',
    titleEn: 'Letters and Expressions',
    bigIdeaKo: '문자는 모르는 수를 대신 표시하는 도구다. 일차방정식의 해를 구하는 과정은 양변의 균형을 깨지 않는 변형의 연속이다.',
    prerequisiteCodes: ['K-G7-MATH1-CH02-INTEGERS'],
    cognitiveLoad: 2,
  },
  {
    grade: 'MIDDLE_1', subject: 'MIDDLE_MATH_1', chapterNumber: 4,
    chapterCode: 'K-G7-MATH1-CH04-COORD-GRAPH',
    titleKo: '좌표평면과 그래프',
    titleEn: 'Coordinate Plane and Graph',
    bigIdeaKo: '좌표는 위치를 두 수로 표현하는 약속이다. 그래프를 통해 두 변수 사이의 관계를 시각적으로 읽을 수 있다.',
    prerequisiteCodes: ['K-G7-MATH1-CH03-LETTERS-EQ'],
    cognitiveLoad: 1,
  },
  {
    grade: 'MIDDLE_1', subject: 'MIDDLE_MATH_1', chapterNumber: 5,
    chapterCode: 'K-G7-MATH1-CH05-BASIC-FIGURES',
    titleKo: '기본도형',
    titleEn: 'Basic Figures',
    bigIdeaKo: '점·선·면의 기본 약속과 위치 관계가 모든 도형 추론의 토대가 된다.',
    cognitiveLoad: 1,
  },
  {
    grade: 'MIDDLE_1', subject: 'MIDDLE_MATH_1', chapterNumber: 6,
    chapterCode: 'K-G7-MATH1-CH06-PLANE-FIG',
    titleKo: '평면도형의 성질',
    titleEn: 'Properties of Plane Figures',
    bigIdeaKo: '삼각형·다각형의 각과 변 사이의 관계, 그리고 둘레와 넓이를 다루는 공식들의 출처를 이해한다.',
    prerequisiteCodes: ['K-G7-MATH1-CH05-BASIC-FIGURES'],
    cognitiveLoad: 2,
  },
  {
    grade: 'MIDDLE_1', subject: 'MIDDLE_MATH_1', chapterNumber: 7,
    chapterCode: 'K-G7-MATH1-CH07-SOLID-FIG',
    titleKo: '입체도형의 성질',
    titleEn: 'Properties of Solid Figures',
    bigIdeaKo: '다면체와 회전체의 겉넓이·부피는 입체를 평면 조각으로 분해해 합산하는 방식으로 구한다.',
    prerequisiteCodes: ['K-G7-MATH1-CH06-PLANE-FIG'],
    cognitiveLoad: 2,
  },
  {
    grade: 'MIDDLE_1', subject: 'MIDDLE_MATH_1', chapterNumber: 8,
    chapterCode: 'K-G7-MATH1-CH08-STATISTICS-INTRO',
    titleKo: '자료의 정리와 해석',
    titleEn: 'Organizing and Interpreting Data',
    bigIdeaKo: '자료를 표·그래프로 정리하면 패턴이 드러난다. 어떤 그래프를 쓰느냐가 메시지를 결정한다.',
    cognitiveLoad: 1,
  },
];

const MIDDLE_2: ChapterSeed[] = [
  {
    grade: 'MIDDLE_2', subject: 'MIDDLE_MATH_2', chapterNumber: 1,
    chapterCode: 'K-G8-MATH2-CH01-RATIONAL-REPEAT',
    titleKo: '유리수와 순환소수',
    titleEn: 'Rational Numbers and Repeating Decimals',
    bigIdeaKo: '모든 유리수는 유한소수 아니면 순환소수로 표현되며, 그 역도 성립한다. 이 동치성이 실수 체계 이해의 출발이다.',
    prerequisiteCodes: ['K-G7-MATH1-CH02-INTEGERS'],
    cognitiveLoad: 2,
  },
  {
    grade: 'MIDDLE_2', subject: 'MIDDLE_MATH_2', chapterNumber: 2,
    chapterCode: 'K-G8-MATH2-CH02-CALC-EXPR',
    titleKo: '식의 계산',
    titleEn: 'Calculation of Expressions',
    bigIdeaKo: '지수 법칙과 분배법칙을 이용해 다항식의 사칙연산을 일관된 규칙으로 다룬다.',
    prerequisiteCodes: ['K-G7-MATH1-CH03-LETTERS-EQ'],
    cognitiveLoad: 2,
  },
  {
    grade: 'MIDDLE_2', subject: 'MIDDLE_MATH_2', chapterNumber: 3,
    chapterCode: 'K-G8-MATH2-CH03-LINEAR-INEQ',
    titleKo: '일차부등식과 연립일차방정식',
    titleEn: 'Linear Inequalities and Systems',
    bigIdeaKo: '부등식 양변 조작 규칙은 등식과 거의 같지만 음수 곱·나눗셈에서 부등호가 뒤집힌다. 연립방정식은 두 조건을 동시에 만족하는 해를 찾는 것이다.',
    prerequisiteCodes: ['K-G8-MATH2-CH02-CALC-EXPR'],
    cognitiveLoad: 2,
  },
  {
    grade: 'MIDDLE_2', subject: 'MIDDLE_MATH_2', chapterNumber: 4,
    chapterCode: 'K-G8-MATH2-CH04-LINEAR-FN',
    titleKo: '일차함수',
    titleEn: 'Linear Functions',
    bigIdeaKo: '$y = ax + b$ 그래프의 기울기 $a$는 변화율을, $y$절편 $b$는 시작점을 의미한다. 두 일차함수의 교점이 곧 연립방정식의 해다.',
    prerequisiteCodes: ['K-G7-MATH1-CH04-COORD-GRAPH', 'K-G8-MATH2-CH03-LINEAR-INEQ'],
    cognitiveLoad: 2,
  },
  {
    grade: 'MIDDLE_2', subject: 'MIDDLE_MATH_2', chapterNumber: 5,
    chapterCode: 'K-G8-MATH2-CH05-PROPERTIES-FIG',
    titleKo: '도형의 성질',
    titleEn: 'Properties of Figures',
    bigIdeaKo: '삼각형·사각형의 합동 조건과 평행선의 성질은 증명의 기본 도구다. "왜"라는 질문에 가설→근거→결론의 사슬로 답한다.',
    prerequisiteCodes: ['K-G7-MATH1-CH06-PLANE-FIG'],
    cognitiveLoad: 3,
  },
  {
    grade: 'MIDDLE_2', subject: 'MIDDLE_MATH_2', chapterNumber: 6,
    chapterCode: 'K-G8-MATH2-CH06-SIMILARITY',
    titleKo: '도형의 닮음',
    titleEn: 'Similarity of Figures',
    bigIdeaKo: '닮은 도형은 모양은 같고 크기가 다르다. 닮음비를 통해 한 도형의 정보로 다른 도형을 추론할 수 있다.',
    prerequisiteCodes: ['K-G8-MATH2-CH05-PROPERTIES-FIG'],
    cognitiveLoad: 2,
  },
  {
    grade: 'MIDDLE_2', subject: 'MIDDLE_MATH_2', chapterNumber: 7,
    chapterCode: 'K-G8-MATH2-CH07-PROBABILITY',
    titleKo: '확률',
    titleEn: 'Probability',
    bigIdeaKo: '확률은 0과 1 사이의 수로 사건의 가능성을 정량화한다. 경우의 수 / 전체 경우의 수가 출발점이다.',
    cognitiveLoad: 2,
  },
];

const MIDDLE_3: ChapterSeed[] = [
  {
    grade: 'MIDDLE_3', subject: 'MIDDLE_MATH_3', chapterNumber: 1,
    chapterCode: 'K-G9-MATH3-CH01-REAL-NUMBERS',
    titleKo: '실수와 그 연산',
    titleEn: 'Real Numbers and Their Operations',
    bigIdeaKo: '무리수의 도입으로 실수 체계가 완성된다. 제곱근 연산은 분모의 유리화를 핵심 도구로 삼는다.',
    prerequisiteCodes: ['K-G8-MATH2-CH01-RATIONAL-REPEAT'],
    cognitiveLoad: 2,
  },
  {
    grade: 'MIDDLE_3', subject: 'MIDDLE_MATH_3', chapterNumber: 2,
    chapterCode: 'K-G9-MATH3-CH02-FACTOR-QUAD',
    titleKo: '인수분해와 이차방정식',
    titleEn: 'Factorization and Quadratic Equations',
    bigIdeaKo: '인수분해는 곱셈 공식의 역연산이다. 이차방정식의 해는 인수분해·완전제곱·근의 공식 세 갈래로 구한다.',
    prerequisiteCodes: ['K-G8-MATH2-CH02-CALC-EXPR'],
    cognitiveLoad: 3,
  },
  {
    grade: 'MIDDLE_3', subject: 'MIDDLE_MATH_3', chapterNumber: 3,
    chapterCode: 'K-G9-MATH3-CH03-QUAD-FN',
    titleKo: '이차함수',
    titleEn: 'Quadratic Functions',
    bigIdeaKo: '$y = a(x-p)^2 + q$ 꼴이 이차함수의 본질을 보여준다 — 꼭짓점 $(p, q)$를 중심으로 좌우 대칭. 최댓값·최솟값이 꼭짓점에서 나온다.',
    prerequisiteCodes: ['K-G9-MATH3-CH02-FACTOR-QUAD', 'K-G8-MATH2-CH04-LINEAR-FN'],
    cognitiveLoad: 3,
  },
  {
    grade: 'MIDDLE_3', subject: 'MIDDLE_MATH_3', chapterNumber: 4,
    chapterCode: 'K-G9-MATH3-CH04-TRIG-RATIO',
    titleKo: '삼각비',
    titleEn: 'Trigonometric Ratios',
    bigIdeaKo: '직각삼각형의 각과 변의 길이의 비가 각도의 함수로 결정된다. sin·cos·tan은 측량의 보편적 언어다.',
    prerequisiteCodes: ['K-G8-MATH2-CH06-SIMILARITY'],
    cognitiveLoad: 2,
  },
  {
    grade: 'MIDDLE_3', subject: 'MIDDLE_MATH_3', chapterNumber: 5,
    chapterCode: 'K-G9-MATH3-CH05-CIRCLES',
    titleKo: '원의 성질',
    titleEn: 'Properties of Circles',
    bigIdeaKo: '원주각 정리는 원 위의 임의의 두 점이 만드는 각이 어떻게 관계되는지 알려준다. 접선·현·할선의 성질이 그 핵심이다.',
    prerequisiteCodes: ['K-G8-MATH2-CH05-PROPERTIES-FIG'],
    cognitiveLoad: 2,
  },
  {
    grade: 'MIDDLE_3', subject: 'MIDDLE_MATH_3', chapterNumber: 6,
    chapterCode: 'K-G9-MATH3-CH06-STATISTICS',
    titleKo: '통계',
    titleEn: 'Statistics',
    bigIdeaKo: '대푯값(평균·중앙값·최빈값)은 자료를 한 수로 요약하고, 산포도(표준편차)는 그 흩어짐을 측정한다.',
    prerequisiteCodes: ['K-G7-MATH1-CH08-STATISTICS-INTRO'],
    cognitiveLoad: 2,
  },
];

// ============================================================================
//  고등학교 — 공통 (고1)
// ============================================================================

const HIGH_COMMON_1_LIST: ChapterSeed[] = [
  {
    grade: 'HIGH_1', subject: 'HIGH_COMMON_1', chapterNumber: 1,
    chapterCode: 'K-G10-CS1-CH01-POLYNOMIAL',
    titleKo: '다항식',
    titleEn: 'Polynomials',
    bigIdeaKo: '다항식의 사칙연산은 정수의 연산과 매우 닮았다. 나머지정리·인수정리는 다항식 인수분해의 핵심 무기다.',
    prerequisiteCodes: ['K-G9-MATH3-CH02-FACTOR-QUAD'],
    cognitiveLoad: 2,
  },
  {
    grade: 'HIGH_1', subject: 'HIGH_COMMON_1', chapterNumber: 2,
    chapterCode: 'K-G10-CS1-CH02-EQ-INEQ',
    titleKo: '방정식과 부등식',
    titleEn: 'Equations and Inequalities',
    bigIdeaKo: '복소수의 도입으로 모든 이차방정식이 해를 갖는다. 이차·연립·고차 방정식과 부등식의 해법이 통합된다.',
    prerequisiteCodes: ['K-G10-CS1-CH01-POLYNOMIAL'],
    cognitiveLoad: 3,
  },
  {
    grade: 'HIGH_1', subject: 'HIGH_COMMON_1', chapterNumber: 3,
    chapterCode: 'K-G10-CS1-CH03-COUNTING',
    titleKo: '경우의 수',
    titleEn: 'Counting',
    bigIdeaKo: '곱의 법칙과 합의 법칙으로 경우를 헤아린다. 순열·조합은 "순서를 따지는가"의 차이로 갈린다.',
    prerequisiteCodes: ['K-G8-MATH2-CH07-PROBABILITY'],
    cognitiveLoad: 2,
  },
  {
    grade: 'HIGH_1', subject: 'HIGH_COMMON_1', chapterNumber: 4,
    chapterCode: 'K-G10-CS1-CH04-MATRIX',
    titleKo: '행렬',
    titleEn: 'Matrix',
    bigIdeaKo: '행렬은 연립일차방정식·일차변환·자료 표현을 한 묶음으로 다루는 도구다. 곱셈은 행과 열의 짝짓기로 정의된다. (2022 개정에서 부활)',
    prerequisiteCodes: ['K-G8-MATH2-CH03-LINEAR-INEQ'],
    cognitiveLoad: 2,
  },
];

const HIGH_COMMON_2_LIST: ChapterSeed[] = [
  {
    grade: 'HIGH_1', subject: 'HIGH_COMMON_2', chapterNumber: 1,
    chapterCode: 'K-G10-CS2-CH01-COORD-FIG',
    titleKo: '도형의 방정식',
    titleEn: 'Equations of Figures',
    bigIdeaKo: '직선·원·도형을 방정식으로 표현하면 기하 문제가 대수 계산으로 바뀐다. 두 점 사이의 거리·내분점·외분점이 출발점이다.',
    prerequisiteCodes: ['K-G7-MATH1-CH04-COORD-GRAPH', 'K-G10-CS1-CH02-EQ-INEQ'],
    cognitiveLoad: 3,
  },
  {
    grade: 'HIGH_1', subject: 'HIGH_COMMON_2', chapterNumber: 2,
    chapterCode: 'K-G10-CS2-CH02-SETS-PROP',
    titleKo: '집합과 명제',
    titleEn: 'Sets and Propositions',
    bigIdeaKo: '집합은 수학의 공용어다. 명제의 참·거짓을 가르고 역·이·대우의 관계를 이해하면 증명의 논리가 보인다.',
    cognitiveLoad: 2,
  },
  {
    grade: 'HIGH_1', subject: 'HIGH_COMMON_2', chapterNumber: 3,
    chapterCode: 'K-G10-CS2-CH03-FUNCTION-GRAPH',
    titleKo: '함수와 그래프',
    titleEn: 'Functions and Graphs',
    bigIdeaKo: '함수는 두 집합 사이의 짝짓기 규칙이다. 합성·역함수·유리함수·무리함수는 모두 그래프의 변환으로 해석된다.',
    prerequisiteCodes: ['K-G8-MATH2-CH04-LINEAR-FN', 'K-G9-MATH3-CH03-QUAD-FN'],
    cognitiveLoad: 3,
  },
];

// ============================================================================
//  고등학교 — 일반 선택 (고2, 수능 출제)
// ============================================================================

const HIGH_ALGEBRA_LIST: ChapterSeed[] = [
  {
    grade: 'HIGH_2', subject: 'HIGH_ALGEBRA', chapterNumber: 1,
    chapterCode: 'K-G11-ALG-CH01-EXP-LOG',
    titleKo: '지수와 로그',
    titleEn: 'Exponents and Logarithms',
    bigIdeaKo: '지수의 정의를 정수 → 유리수 → 실수로 확장하면서 지수함수가 탄생한다. 로그는 지수의 역연산으로, 지수방정식·부등식 해결의 핵심 도구다.',
    prerequisiteCodes: ['K-G10-CS2-CH03-FUNCTION-GRAPH'],
    cognitiveLoad: 3,
  },
  {
    grade: 'HIGH_2', subject: 'HIGH_ALGEBRA', chapterNumber: 2,
    chapterCode: 'K-G11-ALG-CH02-TRIG-FN',
    titleKo: '삼각함수',
    titleEn: 'Trigonometric Functions',
    bigIdeaKo: '삼각비를 단위원으로 확장하면 임의의 실수에 대해 sin·cos·tan이 정의된다. 주기성이 자연 현상 모델링의 보편 언어다.',
    prerequisiteCodes: ['K-G9-MATH3-CH04-TRIG-RATIO', 'K-G10-CS2-CH03-FUNCTION-GRAPH'],
    cognitiveLoad: 3,
  },
  {
    grade: 'HIGH_2', subject: 'HIGH_ALGEBRA', chapterNumber: 3,
    chapterCode: 'K-G11-ALG-CH03-SEQUENCE',
    titleKo: '수열',
    titleEn: 'Sequences',
    bigIdeaKo: '등차·등비수열의 일반항과 합 공식은 점화식이라는 더 일반적 도구의 특수한 경우다. $S_n - S_{n-1} = a_n$ 이 핵심 관계.',
    prerequisiteCodes: ['K-G10-CS1-CH01-POLYNOMIAL'],
    cognitiveLoad: 3,
  },
];

const HIGH_CALCULUS_1_LIST: ChapterSeed[] = [
  {
    grade: 'HIGH_2', subject: 'HIGH_CALCULUS_1', chapterNumber: 1,
    chapterCode: 'K-G11-CAL1-CH01-LIMIT-CONT',
    titleKo: '함수의 극한과 연속',
    titleEn: 'Limits and Continuity',
    bigIdeaKo: '극한은 "한없이 가까워지지만 도달하진 않는다"의 정밀화다. 연속함수는 그래프를 연필을 떼지 않고 그릴 수 있는 함수다.',
    prerequisiteCodes: ['K-G10-CS2-CH03-FUNCTION-GRAPH'],
    cognitiveLoad: 3,
  },
  {
    grade: 'HIGH_2', subject: 'HIGH_CALCULUS_1', chapterNumber: 2,
    chapterCode: 'K-G11-CAL1-CH02-DIFFERENTIATION',
    titleKo: '미분',
    titleEn: 'Differentiation',
    bigIdeaKo: '미분계수는 순간변화율 — 그래프 위 한 점에서의 접선의 기울기. 도함수는 미분계수를 함수로 본 것이다. $f\'(x)=0$이 극값의 후보다.',
    prerequisiteCodes: ['K-G11-CAL1-CH01-LIMIT-CONT'],
    cognitiveLoad: 3,
  },
  {
    grade: 'HIGH_2', subject: 'HIGH_CALCULUS_1', chapterNumber: 3,
    chapterCode: 'K-G11-CAL1-CH03-INTEGRATION',
    titleKo: '적분',
    titleEn: 'Integration',
    bigIdeaKo: '적분은 미분의 역연산이자 넓이를 구하는 도구다. 미적분의 기본정리가 이 두 의미를 하나로 묶어준다.',
    prerequisiteCodes: ['K-G11-CAL1-CH02-DIFFERENTIATION'],
    cognitiveLoad: 3,
  },
];

const HIGH_STATISTICS_LIST: ChapterSeed[] = [
  {
    grade: 'HIGH_2', subject: 'HIGH_STATISTICS', chapterNumber: 1,
    chapterCode: 'K-G11-STAT-CH01-COUNTING-ADV',
    titleKo: '경우의 수',
    titleEn: 'Counting (Advanced)',
    bigIdeaKo: '중복순열·중복조합·이항정리로 경우의 수 계산이 일반화된다. $(a+b)^n$의 전개는 조합 수의 기하적 패턴이다.',
    prerequisiteCodes: ['K-G10-CS1-CH03-COUNTING'],
    cognitiveLoad: 3,
  },
  {
    grade: 'HIGH_2', subject: 'HIGH_STATISTICS', chapterNumber: 2,
    chapterCode: 'K-G11-STAT-CH02-PROBABILITY',
    titleKo: '확률',
    titleEn: 'Probability',
    bigIdeaKo: '조건부 확률은 새 정보가 들어왔을 때 확률이 어떻게 갱신되는지 알려준다. 독립·종속·베이즈 사고의 출발점.',
    prerequisiteCodes: ['K-G8-MATH2-CH07-PROBABILITY', 'K-G11-STAT-CH01-COUNTING-ADV'],
    cognitiveLoad: 3,
  },
  {
    grade: 'HIGH_2', subject: 'HIGH_STATISTICS', chapterNumber: 3,
    chapterCode: 'K-G11-STAT-CH03-STATISTICS',
    titleKo: '통계',
    titleEn: 'Statistics',
    bigIdeaKo: '확률변수의 기댓값·분산을 통해 표본에서 모집단을 추정한다. 정규분포가 그 보편적 도구다.',
    prerequisiteCodes: ['K-G9-MATH3-CH06-STATISTICS', 'K-G11-STAT-CH02-PROBABILITY'],
    cognitiveLoad: 3,
  },
];

// ============================================================================
//  고등학교 — 진로 선택
// ============================================================================

const HIGH_CALCULUS_2_LIST: ChapterSeed[] = [
  {
    grade: 'HIGH_3', subject: 'HIGH_CALCULUS_2', chapterNumber: 1,
    chapterCode: 'K-G12-CAL2-CH01-SEQ-LIMIT',
    titleKo: '수열의 극한',
    titleEn: 'Limits of Sequences',
    bigIdeaKo: '수열의 극한은 함수의 극한의 이산판이다. 등비급수의 수렴 조건이 무한합 계산의 출발점이다.',
    prerequisiteCodes: ['K-G11-ALG-CH03-SEQUENCE', 'K-G11-CAL1-CH01-LIMIT-CONT'],
    cognitiveLoad: 3,
  },
  {
    grade: 'HIGH_3', subject: 'HIGH_CALCULUS_2', chapterNumber: 2,
    chapterCode: 'K-G12-CAL2-CH02-DIFF-METHOD',
    titleKo: '미분법',
    titleEn: 'Methods of Differentiation',
    bigIdeaKo: '여러 함수의 미분 — 삼각·지수·로그·합성·매개변수 — 을 위한 규칙들이 미분 도구함을 완성한다.',
    prerequisiteCodes: ['K-G11-CAL1-CH02-DIFFERENTIATION', 'K-G11-ALG-CH01-EXP-LOG', 'K-G11-ALG-CH02-TRIG-FN'],
    cognitiveLoad: 3,
  },
  {
    grade: 'HIGH_3', subject: 'HIGH_CALCULUS_2', chapterNumber: 3,
    chapterCode: 'K-G12-CAL2-CH03-INT-METHOD',
    titleKo: '적분법',
    titleEn: 'Methods of Integration',
    bigIdeaKo: '치환적분·부분적분이 적분의 양대 기술이다. 적분으로 회전체의 부피·곡선의 길이 같은 실세계 양을 계산한다.',
    prerequisiteCodes: ['K-G12-CAL2-CH02-DIFF-METHOD', 'K-G11-CAL1-CH03-INTEGRATION'],
    cognitiveLoad: 3,
  },
];

const HIGH_GEOMETRY_LIST: ChapterSeed[] = [
  {
    grade: 'HIGH_3', subject: 'HIGH_GEOMETRY', chapterNumber: 1,
    chapterCode: 'K-G12-GEO-CH01-CONIC',
    titleKo: '이차곡선',
    titleEn: 'Conic Sections',
    bigIdeaKo: '포물선·타원·쌍곡선은 한 평면이 원뿔을 자를 때 생기는 단면들이다. 초점-준선 정의가 그 모든 성질의 출발이다.',
    prerequisiteCodes: ['K-G10-CS2-CH01-COORD-FIG'],
    cognitiveLoad: 3,
  },
  {
    grade: 'HIGH_3', subject: 'HIGH_GEOMETRY', chapterNumber: 2,
    chapterCode: 'K-G12-GEO-CH02-VECTOR-2D',
    titleKo: '평면벡터',
    titleEn: 'Vectors in the Plane',
    bigIdeaKo: '벡터는 크기와 방향을 함께 갖는 양이다. 내적을 통해 각도와 직각이 대수적으로 다뤄진다.',
    prerequisiteCodes: ['K-G10-CS1-CH04-MATRIX'],
    cognitiveLoad: 3,
  },
  {
    grade: 'HIGH_3', subject: 'HIGH_GEOMETRY', chapterNumber: 3,
    chapterCode: 'K-G12-GEO-CH03-SPACE-3D',
    titleKo: '공간도형과 공간좌표',
    titleEn: '3D Geometry and Coordinates',
    bigIdeaKo: '평면 좌표가 3차원으로 확장되면서 공간벡터·직선·평면의 방정식이 통합된다.',
    prerequisiteCodes: ['K-G12-GEO-CH02-VECTOR-2D'],
    cognitiveLoad: 3,
  },
];

// ============================================================================
//  Driver
// ============================================================================

const ALL_CHAPTERS: ChapterSeed[] = [
  ...MIDDLE_1,
  ...MIDDLE_2,
  ...MIDDLE_3,
  ...HIGH_COMMON_1_LIST,
  ...HIGH_COMMON_2_LIST,
  ...HIGH_ALGEBRA_LIST,
  ...HIGH_CALCULUS_1_LIST,
  ...HIGH_STATISTICS_LIST,
  ...HIGH_CALCULUS_2_LIST,
  ...HIGH_GEOMETRY_LIST,
];

async function main() {
  const prisma = new PrismaClient();
  let upserted = 0;
  for (const ch of ALL_CHAPTERS) {
    await prisma.koreanConceptLesson.upsert({
      where: { chapterCode: ch.chapterCode },
      create: {
        koreanGrade: ch.grade,
        koreanSubject: ch.subject,
        chapterNumber: ch.chapterNumber,
        chapterCode: ch.chapterCode,
        titleKo: ch.titleKo,
        titleEn: ch.titleEn ?? null,
        bigIdeaKo: ch.bigIdeaKo,
        prerequisiteCodes: ch.prerequisiteCodes ?? [],
        estimatedMin: ch.estimatedMin ?? 15,
        cognitiveLoad: ch.cognitiveLoad ?? 1,
      },
      update: {
        koreanGrade: ch.grade,
        koreanSubject: ch.subject,
        chapterNumber: ch.chapterNumber,
        titleKo: ch.titleKo,
        titleEn: ch.titleEn ?? null,
        bigIdeaKo: ch.bigIdeaKo,
        prerequisiteCodes: ch.prerequisiteCodes ?? [],
        estimatedMin: ch.estimatedMin ?? 15,
        cognitiveLoad: ch.cognitiveLoad ?? 1,
      },
    });
    upserted += 1;
  }
  console.log(`Done. KoreanConceptLesson rows upserted: ${upserted}`);

  // Brief summary
  const bySubject = await prisma.koreanConceptLesson.groupBy({
    by: ['koreanGrade', 'koreanSubject'],
    _count: { _all: true },
    orderBy: [{ koreanGrade: 'asc' }, { koreanSubject: 'asc' }],
  });
  console.log('\nBy grade × subject:');
  for (const row of bySubject) {
    console.log(`  ${row.koreanGrade.padEnd(10)} ${row.koreanSubject.padEnd(20)} ${row._count._all} chapters`);
  }
  await prisma.$disconnect();
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
