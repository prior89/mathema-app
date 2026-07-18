import { PrismaClient, Difficulty, MockExamType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { GRADE_TO_UNITS, UNIT_NAMES, UNIT_TO_GRADES, SUB_UNIT_MAP } from '../src/common/enums/unit.enum';
import { seedSteps } from './seed-steps';
import { seedConceptLessons } from './seed-concepts';

const prisma = new PrismaClient();

/**
 * PoC seed — Korean middle/high-school units + sample problems.
 * Seed user: demo student (polopot123@gmail.com / password1234) — Korean high-school math.
 * Admin: admin@mathema.app / admin1234 (dev-login enters automatically when you type admin/admin).
 */
async function main() {
  // Guard: includes demo users and demo wrong-notes, so never run in production.
  // To override, set ALLOW_PROD_SEED=1.
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_PROD_SEED !== '1') {
    console.error('Refusing to seed in production. Set ALLOW_PROD_SEED=1 to override.');
    process.exit(1);
  }
  console.log('🌱 Seeding...');

  // ===== Unit + SubUnit (with per-grade mapping) =====
  const units: Record<string, { id: string; subs: Record<string, string> }> = {};
  for (let i = 0; i < UNIT_NAMES.length; i++) {
    const name = UNIT_NAMES[i];
    const grades = UNIT_TO_GRADES[name] ?? [];
    const unit = await prisma.unit.upsert({
      where: { name },
      update: { order: i, gradeLevels: grades as any },
      create: { name, order: i, gradeLevels: grades as any },
    });
    const subs: Record<string, string> = {};
    const subList = SUB_UNIT_MAP[name] ?? [];
    for (let j = 0; j < subList.length; j++) {
      const sub = await prisma.subUnit.upsert({
        where: { unitId_name: { unitId: unit.id, name: subList[j] } },
        update: { order: j },
        create: { unitId: unit.id, name: subList[j], order: j },
      });
      subs[subList[j]] = sub.id;
    }
    units[name] = { id: unit.id, subs };
  }

  // ===== Demo user — Korea-first PoC persona: 고2 수학 학습자 =====
  // CLASS_11 is retained as an internal compatibility code and displayed as 고2 in the app.
  const examDate = new Date();
  examDate.setDate(examDate.getDate() + 150);
  const user = await prisma.user.upsert({
    where: { email: 'polopot123@gmail.com' },
    update: { gradeLevel: 'CLASS_11', country: 'KR', name: '유도훈' } as any,
    create: {
      email: 'polopot123@gmail.com',
      passwordHash: await bcrypt.hash('password1234', 10),
      name: '유도훈',
      examDate,
      targetGrade: 1,
      gradeLevel: 'CLASS_11',
      country: 'KR' as any,
    },
  });

  // ===== Sample Problems =====
  await prisma.attempt.deleteMany({ where: { userId: user.id } });
  await prisma.wrongNote.deleteMany({ where: { userId: user.id } });

  type ProblemSpec = {
    source: string; unit: string; sub?: string;
    difficulty: Difficulty; body: string; answer: string;
  };

  // Featured Korean-market practice problems (3-step MC + distractor metadata).
  const featured: ProblemSpec[] = [];

  // Korean middle/high review problems. CLASS_* remains an internal grade code;
  // visible labels use 중/고 terminology.
  const general: ProblemSpec[] = [
    // ============ 중2 복습 (4) ============
    { source: '중2 · 유리수와 순환소수 · Q1', unit: '유리수와 순환소수', sub: '순환소수와 분수', difficulty: 'MIDDLE',
      body: '순환소수 0.\\overline{3}을 기약분수로 나타내세요.', answer: '1/3' },
    { source: '중2 · 곱셈공식 · Q1', unit: '식의 계산', sub: '곱셈공식', difficulty: 'UPPER_MIDDLE',
      body: '곱셈공식을 이용하여 (x + 5)²을 전개하세요.', answer: 'x² + 10x + 25' },
    { source: '중2 · 일차방정식 · Q1', unit: '식의 계산', sub: '동류항 정리', difficulty: 'MIDDLE',
      body: '방정식 2x − 3 = 5x + 9를 푸세요.', answer: 'x = -4' },
    { source: '중2 · 일차함수 · Q1', unit: '일차함수', sub: '기울기와 절편', difficulty: 'MIDDLE',
      body: '두 점 (0, 2), (3, 8)을 지나는 직선의 기울기를 구하세요.', answer: '2' },

    // ============ 중3 복습 (4) ============
    { source: '중3 · 제곱근과 실수 · Q1', unit: '제곱근과 실수', sub: '근호의 사칙연산', difficulty: 'MIDDLE',
      body: '√50 + √8을 간단히 하세요.', answer: '7√2' },
    { source: '중3 · 인수분해 · Q1', unit: '인수분해', sub: '인수분해 공식', difficulty: 'UPPER_MIDDLE',
      body: 'x² + 7x + 12를 인수분해하세요.', answer: '(x + 3)(x + 4)' },
    { source: '중3 · 좌표평면 · Q1', unit: '좌표평면과 그래프', sub: '순서쌍과 좌표', difficulty: 'MIDDLE',
      body: '두 점 A(2, 3), B(5, 7) 사이의 거리를 구하세요.', answer: '5' },
    { source: '중3 · 이차함수 · Q1', unit: '이차함수', sub: '이차함수의 그래프', difficulty: 'UPPER_MIDDLE',
      body: 'p(x) = 2x² − 3x − 2일 때 p(2)의 값을 구하세요.', answer: '0' },

    // ============ 고1 복습 (4) ============
    { source: '고1 · 나머지정리 · Q1', unit: '다항식', sub: '나머지정리', difficulty: 'UPPER_MIDDLE',
      body: 'p(x) = x³ − 3x² + 4를 (x − 2)로 나눌 때의 나머지를 구하세요.', answer: '0' },
    { source: '고1 · 이차방정식 · Q1', unit: '이차방정식', sub: '근의 공식', difficulty: 'UPPER_MIDDLE',
      body: 'x² − 4x − 5 = 0을 인수분해로 푸세요.', answer: 'x = 5 or x = -1' },
    { source: '고1 · 좌표기하 · Q1', unit: '도형의 방정식', sub: '직선의 방정식', difficulty: 'UPPER_MIDDLE',
      body: '두 점 A(-2, 4), B(6, -2)를 잇는 선분의 중점을 구하세요.', answer: '(2, 1)' },
    { source: '고1 · 삼각비 · Q1', unit: '도형의 방정식', sub: '직선의 방정식', difficulty: 'UPPER_MIDDLE',
      body: '직각삼각형에서 sin θ = 3/5일 때 cos θ를 구하세요.', answer: '4/5' },
  ];

  const problemsSpec: ProblemSpec[] = [...featured, ...general];

  // Delete and re-create the existing seed problems.
  for (const spec of problemsSpec) {
    await prisma.problem.deleteMany({ where: { source: spec.source } });
  }

  // source → the core formula (shown in the formula box on the concept panel). Null/empty hides it.
  const FORMULA_KO: Record<string, string> = {
    // 중2
    '중2 · 유리수와 순환소수 · Q1': 'x = 순환소수, 10ⁿx − x로 순환 부분을 제거',
    '중2 · 곱셈공식 · Q1':          '(a + b)² = a² + 2ab + b²',
    '중2 · 일차방정식 · Q1':        'ax + b = cx + d  ⇒  (a − c)x = d − b',
    '중2 · 일차함수 · Q1':          '기울기 m = (y₂ − y₁)/(x₂ − x₁)',
    // 중3
    '중3 · 제곱근과 실수 · Q1':     '√(a²·b) = a√b, 같은 근호끼리만 덧셈 가능',
    '중3 · 인수분해 · Q1':          'x² + (p+q)x + pq = (x + p)(x + q)',
    '중3 · 좌표평면 · Q1':          '두 점 사이의 거리 d = √[(x₂ − x₁)² + (y₂ − y₁)²]',
    '중3 · 이차함수 · Q1':          'p(c)는 다항식 p(x)에 x=c를 대입한 값',
    // 고1
    '고1 · 나머지정리 · Q1':        '(x − c)로 나눈 나머지 = p(c)',
    '고1 · 이차방정식 · Q1':        '합과 곱을 이용해 x² − (합)x + (곱)을 인수분해',
    '고1 · 좌표기하 · Q1':          '중점 M = ((x₁ + x₂)/2, (y₁ + y₂)/2)',
    '고1 · 삼각비 · Q1':            'sin²θ + cos²θ = 1',
  };

  // source → core concept explanation (shown in study feedback and wrong-note detail).
  const CONCEPT_KO: Record<string, string> = {
    // 중2
    '중2 · 유리수와 순환소수 · Q1': '순환소수는 10ⁿ을 곱해 순환 부분을 맞춘 뒤 빼면 분수로 바꿀 수 있습니다.',
    '중2 · 곱셈공식 · Q1':          '(a + b)² 전개에서 가운데 항 2ab를 빠뜨리는 실수가 가장 흔합니다.',
    '중2 · 일차방정식 · Q1':        '일차방정식은 x항과 상수항을 각각 한쪽으로 모으고 부호 변화를 확인한 뒤 계수로 나눕니다.',
    '중2 · 일차함수 · Q1':          '두 점 사이의 기울기는 y의 변화량을 x의 변화량으로 나눈 값입니다.',
    // 중3
    '중3 · 제곱근과 실수 · Q1':     '근호 안의 제곱인수를 밖으로 빼고, 같은 근호끼리만 계수를 더합니다.',
    '중3 · 인수분해 · Q1':          'x² + bx + c는 합이 b, 곱이 c인 두 수를 찾아 묶어 인수분해합니다.',
    '중3 · 좌표평면 · Q1':          '두 점 사이의 거리는 가로·세로 차이를 직각삼각형의 두 변으로 보고 피타고라스 정리를 적용합니다.',
    '중3 · 이차함수 · Q1':          'p(2)는 방정식을 푸는 것이 아니라 다항식에 x=2를 대입해 계산하는 값입니다.',
    // 고1
    '고1 · 나머지정리 · Q1':        '다항식 p(x)를 (x − c)로 나눌 때의 나머지는 p(c)입니다.',
    '고1 · 이차방정식 · Q1':        '인수분해로 풀 때는 상수항의 곱과 일차항 계수의 합을 동시에 만족하는 두 수를 찾습니다.',
    '고1 · 좌표기하 · Q1':          '중점은 두 x좌표의 평균과 두 y좌표의 평균으로 구합니다.',
    '고1 · 삼각비 · Q1':            'sin²θ + cos²θ = 1을 이용하면 한 삼각비에서 다른 삼각비를 구할 수 있습니다.',
  };

  // Korean launch seed keeps body/concept/formula in Korean so dev and smoke-test
  // accounts do not show legacy foreign-curriculum wording.

  // Legacy unit-name compatibility shim used while a few seed ProblemSpec.unit fields
  // still use old Korean curriculum names.
  const LEGACY_UNIT_ALIAS: Record<string, string> = {
    '정수와 유리수':       '정수',
    '문자와 식':           '대수식',
    '일차방정식':          '간단한 방정식',
    '좌표평면과 그래프':   '좌표기하 입문',
    '유리수와 순환소수':   '유리수의 성질',
    '식의 계산':           '대수식과 항등식',
    '일차함수':            '그래프 입문',
    '제곱근과 실수':       '수의 체계 (실수)',
    '인수분해':            '다항식',
    '이차함수':            '다항식',
    '도형의 방정식':       '좌표기하 II (분점·넓이)',
    '방정식과 부등식':     '두 변수 일차연립방정식',
    '미적분 I':            '연속과 미분가능성',
    '미적분 II':           '적분',
    '확률·통계':           '확률 III (조건부·베이즈)',
    '기하·벡터':           '벡터대수',
    '함수와 그래프':       '관계와 함수',
    '지수와 로그':         '관계와 함수',
    '삼각함수':            '삼각함수 (일반각)',
    '수열':                '수열과 급수',
    '함수의 극한':         '극한과 미분 입문',
    '일차부등식':          '일차부등식',
    '다항식':              '다항식 II (영점·계수 관계)',
    '이차방정식':          '이차방정식',
  };

  const problems: Record<string, string> = {};
  for (const p of problemsSpec) {
    const unitName = LEGACY_UNIT_ALIAS[p.unit] ?? p.unit;
    const u = units[unitName];
    if (!u) { console.warn(`Unit not found: ${p.unit} → ${unitName} (skipping ${p.source})`); continue; }
    const subUnitId = p.sub ? u.subs[p.sub] : null;
    const created = await prisma.problem.create({
      data: {
        source: p.source, unitId: u.id, subUnitId,
        difficulty: p.difficulty, body: p.body, answer: p.answer,
        concept: CONCEPT_KO[p.source] ?? null,
        formula: FORMULA_KO[p.source] ?? null,
        hint: '학습 화면의 AI 가이드를 열면 단계별 풀이 코칭을 볼 수 있어요.',
      },
    });
    problems[p.source] = created.id;
  }

  // ===== 3-step MC (CONCEPT → PROCESS → ANSWER) — applied to the 7 featured problems only =====
  console.log('🪜 Seeding problem steps + choices for featured problems...');
  await seedSteps(prisma, problems);

  // ===== Concept Lessons — compatibility concept lessons plus Korean lesson tables =====
  console.log('📚 Seeding concept lessons and Korean curriculum content...');
  await seedConceptLessons(prisma, units);

  // =============================================================
  //  Per-user cumulative data is NOT seeded.
  //
  //  Previously we pre-seeded demo attempts / wrongNotes / dailyActivity /
  //  masterySnapshot / mockExamResult / weeklyReport so the dashboard would
  //  not look empty — but that meant the seed user saw fake history they
  //  never produced (hallucinated stats like "Accuracy 73%" or "Predicted
  //  rank band 2").
  //
  //  Production policy:
  //  - All user cumulative data must come from real usage only.
  //  - The seed creates content only (Unit / SubUnit / Problem /
  //    ProblemChoice / MockExam / ConceptLesson / ConceptStep).
  //  - The seed user exists for the dev quick-login and starts with an empty account.
  //
  //  Idempotency — on re-seed, wipe any past fake data.
  // =============================================================
  await prisma.attempt.deleteMany({       where: { userId: user.id } });
  await prisma.wrongNote.deleteMany({     where: { userId: user.id } });
  await prisma.dailyActivity.deleteMany({ where: { userId: user.id } });
  await prisma.masterySnapshot.deleteMany({ where: { userId: user.id } });
  await prisma.mockExamResult.deleteMany({ where: { userId: user.id } });
  await prisma.weeklyReport.deleteMany({  where: { userId: user.id } });
  await prisma.conceptProgress.deleteMany({ where: { userId: user.id } });

  // ===== MockExam (system content) — register only the available mock exams that can be taken =====
  // User results (MockExamResult) are never seeded — they only exist after a real attempt.
  const systemMockExams: Array<{ name: string; type: MockExamType; totalProblems: number; totalMinutes: number }> = [
    { name: 'AI 맞춤형 약점 시험',       type: 'RECOMMENDED', totalProblems: 30, totalMinutes: 100 },
    { name: '단원 미니 테스트 · 고2',     type: 'MINI',        totalProblems: 10, totalMinutes: 25  },
    { name: '단원 미니 테스트 · 고3',     type: 'MINI',        totalProblems: 10, totalMinutes: 25  },
    { name: '오답 다시 풀기',             type: 'WRONG_REDO',  totalProblems: 15, totalMinutes: 40  },
    { name: '실전 모의고사 · 고1',        type: 'REAL',        totalProblems: 30, totalMinutes: 100 },
    { name: '실전 모의고사 · 고3',        type: 'REAL',        totalProblems: 30, totalMinutes: 100 },
  ];
  const seedExamProblemIds = featured
    .map((problem) => problems[problem.source])
    .filter((id): id is string => Boolean(id));
  if (seedExamProblemIds.length === 0) {
    throw new Error('Cannot seed MockExam templates without canonical problem IDs.');
  }
  for (const m of systemMockExams) {
    const exists = await prisma.mockExam.findFirst({ where: { name: m.name } });
    if (!exists) {
      const problemIds = seedExamProblemIds.slice(0, m.totalProblems);
      await prisma.mockExam.create({
        data: { ...m, totalProblems: problemIds.length, problemIds },
      });
    }
  }

  console.log(`✅ Seed completed — ${UNIT_NAMES.length} units, ${problemsSpec.length} problems, ${systemMockExams.length} mock exams.`);
  console.log(`👤 Seed user (empty account): ${user.email}`);
  console.log(`📊 Grades: ${Object.entries(GRADE_TO_UNITS).map(([g, u]) => `${g}=${u.length} units`).join(', ')}`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
