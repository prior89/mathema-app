import { PrismaClient, Difficulty, MockExamType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { GRADE_TO_UNITS, UNIT_NAMES, UNIT_TO_GRADES, SUB_UNIT_MAP } from '../src/common/enums/unit.enum';
import { seedSteps } from './seed-steps';
import { seedConceptLessons } from './seed-concepts';

const prisma = new PrismaClient();

/**
 * PoC seed — NCERT Class 7~12 units + English sample problems for Class 8~11.
 * Seed user: Arjun Sharma (polopot123@gmail.com / password1234) — Class 11 / JEE prep.
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

  // ===== Demo user — PoC persona: Class 11 (JEE prep) =====
  // Seed user is a Class 11 student (G_HIGH_2 = NCERT Class 11), preparing for JEE Main
  // (January or April session). examDate ≈ 150 days out (close to the April session).
  // targetGrade=1 means "top rank band". mastery / wrongNote / mockExam are all seeded
  // consistently in a Class 11 context.
  const examDate = new Date();
  examDate.setDate(examDate.getDate() + 150);
  const user = await prisma.user.upsert({
    where: { email: 'polopot123@gmail.com' },
    update: { gradeLevel: 'G_HIGH_2', country: 'IN', name: 'Arjun Sharma' } as any,
    create: {
      email: 'polopot123@gmail.com',
      passwordHash: await bcrypt.hash('password1234', 10),
      name: 'Arjun Sharma',
      examDate,
      targetGrade: 1,
      gradeLevel: 'G_HIGH_2',
      country: 'IN' as any,
    },
  });

  // ===== Sample Problems =====
  await prisma.attempt.deleteMany({ where: { userId: user.id } });
  await prisma.wrongNote.deleteMany({ where: { userId: user.id } });

  type ProblemSpec = {
    source: string; unit: string; sub?: string;
    difficulty: Difficulty; body: string; answer: string;
  };

  // featured NCERT/JEE problems (3-step MC + distractor metadata) — paired with seed-steps.ts SPEC_NCERT.
  const featured: ProblemSpec[] = [];

  // Class 11 NCERT (JEE Main Class 11 syllabus) — the core chapters matching the PoC demo persona.
  // All sources use English labels (DB key) so they read naturally for English users without
  // any extra mapping in content-en.ts.
  const general: ProblemSpec[] = [
    // Sets
    { source: 'Class 11 · Sets · Q1', unit: '집합', difficulty: 'MIDDLE',
      body: 'If |A|=30, |B|=20, |A∩B|=10, find |A∪B|.', answer: '40' },
    { source: 'Class 11 · Sets · Q2', unit: '집합', difficulty: 'UPPER_MIDDLE',
      body: 'In a class of 60 students, 38 like Math and 27 like Physics, with 18 liking both. How many like neither?', answer: '13' },
    // Relations and Functions
    { source: 'Class 11 · Functions · Q1', unit: '관계와 함수', difficulty: 'MIDDLE',
      body: 'For f(x) = 2x + 1, evaluate f(3).', answer: '7' },
    { source: 'Class 11 · Functions · Q2', unit: '관계와 함수', difficulty: 'UPPER_MIDDLE',
      body: 'State the range of f: ℝ → ℝ, f(x) = x² + 1.', answer: '[1, ∞)' },
    // Trigonometric Functions
    { source: 'Class 11 · Trig · Q1', unit: '삼각함수 (일반각)', difficulty: 'UPPER_MIDDLE',
      body: 'Evaluate sin(120°).', answer: '√3/2' },
    { source: 'Class 11 · Trig · Q2', unit: '삼각함수 (일반각)', difficulty: 'SEMI_KILLER',
      body: 'Solve for x in [0, 2π): 2 sin x = 1.', answer: 'π/6, 5π/6' },
    // Complex Numbers
    { source: 'Class 11 · Complex · Q1', unit: '복소수와 이차방정식', difficulty: 'UPPER_MIDDLE',
      body: 'Compute (2 + 3i)(1 − i).', answer: '5 + i' },
    // Linear Inequalities
    { source: 'Class 11 · Inequalities · Q1', unit: '일차부등식', difficulty: 'MIDDLE',
      body: 'Solve: −2x + 5 < 11.', answer: 'x > −3' },
    // Permutations & Combinations
    { source: 'Class 11 · Permutations · Q1', unit: '순열과 조합', difficulty: 'UPPER_MIDDLE',
      body: 'How many ways can 5 books be arranged on a shelf?', answer: '120' },
    { source: 'Class 11 · Combinations · Q1', unit: '순열과 조합', difficulty: 'UPPER_MIDDLE',
      body: 'Evaluate ⁶C₂.', answer: '15' },
    // Sequences and Series
    { source: 'Class 11 · Sequences · Q1', unit: '수열과 급수', difficulty: 'UPPER_MIDDLE',
      body: 'Sum the A.P. 3, 7, 11, … up to the 10th term.', answer: '210' },
    // Limits and Derivatives
    { source: 'Class 11 · Limits · Q1', unit: '극한과 미분 입문', difficulty: 'SEMI_KILLER',
      body: 'Find d/dx of x³.', answer: '3x²' },

    // ============ Class 8 NCERT (4) — prerequisite review ============
    { source: 'Class 8 · Rational Numbers · Q1', unit: '유리수와 순환소수', sub: '순환소수와 분수', difficulty: 'MIDDLE',
      body: 'Express 0.\\overline{3} (0.3 repeating) as a fraction in lowest terms.', answer: '1/3' },
    { source: 'Class 8 · Algebraic Identities · Q1', unit: '식의 계산', sub: '곱셈공식', difficulty: 'UPPER_MIDDLE',
      body: 'Use an identity to expand (x + 5)².', answer: 'x² + 10x + 25' },
    { source: 'Class 8 · Linear Equations · Q1', unit: '식의 계산', sub: '동류항 정리', difficulty: 'MIDDLE',
      body: 'Solve for x:  2x − 3 = 5x + 9.', answer: 'x = -4' },
    { source: 'Class 8 · Graphs · Q1', unit: '일차함수', sub: '기울기와 절편', difficulty: 'MIDDLE',
      body: 'A line passes through (0, 2) and (3, 8). Find its slope.', answer: '2' },

    // ============ Class 9 NCERT (4) ============
    { source: 'Class 9 · Number Systems · Q1', unit: '제곱근과 실수', sub: '근호의 사칙연산', difficulty: 'MIDDLE',
      body: 'Simplify √50 + √8.', answer: '7√2' },
    { source: 'Class 9 · Polynomials · Q1', unit: '인수분해', sub: '인수분해 공식', difficulty: 'UPPER_MIDDLE',
      body: 'Factorise x² + 7x + 12.', answer: '(x + 3)(x + 4)' },
    { source: 'Class 9 · Coordinate Geometry · Q1', unit: '좌표평면과 그래프', sub: '순서쌍과 좌표', difficulty: 'MIDDLE',
      body: 'Find the distance between A(2, 3) and B(5, 7).', answer: '5' },
    { source: 'Class 9 · Polynomials · Q2', unit: '이차함수', sub: '이차함수의 그래프', difficulty: 'UPPER_MIDDLE',
      body: 'For p(x) = 2x² − 3x − 2, find p(2).', answer: '0' },

    // ============ Class 10 NCERT (4) ============
    { source: 'Class 10 · Polynomials · Q1', unit: '다항식', sub: '나머지정리', difficulty: 'UPPER_MIDDLE',
      body: 'Find the remainder when p(x) = x³ − 3x² + 4 is divided by (x − 2).', answer: '0' },
    { source: 'Class 10 · Quadratic Equations · Q1', unit: '이차방정식', sub: '근의 공식', difficulty: 'UPPER_MIDDLE',
      body: 'Solve x² − 4x − 5 = 0 using factorisation.', answer: 'x = 5 or x = -1' },
    { source: 'Class 10 · Coordinate Geometry · Q1', unit: '도형의 방정식', sub: '직선의 방정식', difficulty: 'UPPER_MIDDLE',
      body: 'Find the midpoint of the segment joining A(-2, 4) and B(6, -2).', answer: '(2, 1)' },
    { source: 'Class 10 · Trigonometry · Q1', unit: '도형의 방정식', sub: '직선의 방정식', difficulty: 'UPPER_MIDDLE',
      body: 'In a right triangle, sin θ = 3/5. Find cos θ.', answer: '4/5' },
  ];

  const problemsSpec: ProblemSpec[] = [...featured, ...general];

  // Delete and re-create the existing seed problems.
  for (const spec of problemsSpec) {
    await prisma.problem.deleteMany({ where: { source: spec.source } });
  }

  // source → the core formula (shown in the formula box on the concept panel). Null/empty hides it.
  const FORMULA_KO: Record<string, string> = {
    // Class 8
    'Class 8 · Rational Numbers · Q1':     'x = 0.\\overline{abc...n}  ⇒  10ⁿx − x = (integer part) ⇒ x = (integer part)/(10ⁿ − 1)',
    'Class 8 · Algebraic Identities · Q1': '(a + b)² = a² + 2ab + b²',
    'Class 8 · Linear Equations · Q1':     'ax + b = cx + d  ⇒  (a − c)x = d − b  ⇒  x = (d − b)/(a − c)',
    'Class 8 · Graphs · Q1':               'slope m = (y₂ − y₁)/(x₂ − x₁)',
    // Class 9
    'Class 9 · Number Systems · Q1':       '√(a²·b) = a√b ;  √m + √n can be combined only when they are like surds',
    'Class 9 · Polynomials · Q1':          'x² + (p+q)x + pq = (x + p)(x + q)',
    'Class 9 · Coordinate Geometry · Q1':  'd = √[(x₂ − x₁)² + (y₂ − y₁)²]',
    'Class 9 · Polynomials · Q2':          'p(c) = value of the polynomial with c substituted for the variable (function evaluation)',
    // Class 10
    'Class 10 · Polynomials · Q1':         'remainder on division by (x − c) = p(c)  (Remainder Theorem)',
    'Class 10 · Quadratic Equations · Q1': 'x² − (sum)x + (product) = 0  ⇒  factor as (x − r₁)(x − r₂) = 0',
    'Class 10 · Coordinate Geometry · Q1': 'midpoint M = ((x₁ + x₂)/2, (y₁ + y₂)/2)',
    'Class 10 · Trigonometry · Q1':        'sin²θ + cos²θ = 1  ⇒  cos θ = √(1 − sin²θ) (acute angle)',
  };

  // source → core concept explanation (shown in study feedback and wrong-note detail).
  const CONCEPT_KO: Record<string, string> = {
    // Class 8 NCERT
    'Class 8 · Rational Numbers · Q1':     'Repeating decimals: multiply by 10ⁿ (n = repeating block length), subtract original, solve for x. Every repeating decimal is rational.',
    'Class 8 · Algebraic Identities · Q1': 'Square of a binomial identity: (a + b)² = a² + 2ab + b². Always check the cross-term 2ab — most-missed step.',
    'Class 8 · Linear Equations · Q1':     'Linear equation in one variable: collect x terms on one side, constants on the other (transposition flips signs), then divide.',
    'Class 8 · Graphs · Q1':               'Slope (gradient) of a line through two points = rise / run = (Δy)/(Δx). Sign of slope tells direction.',
    // Class 9 NCERT
    'Class 9 · Number Systems · Q1':       'Surds: √(a²·b) simplifies to a√b. Only like surds (same b) can be added or subtracted directly.',
    'Class 9 · Polynomials · Q1':          'Factorising a quadratic x² + bx + c: find two numbers p, q with p + q = b and pq = c. Then split bx and group.',
    'Class 9 · Coordinate Geometry · Q1':  'Distance formula derives from the Pythagorean theorem applied to the horizontal and vertical legs of the segment.',
    'Class 9 · Polynomials · Q2':          'Evaluating a polynomial at x = c means substituting and computing — a building block for the Remainder Theorem (Class 10).',
    // Class 10 NCERT
    'Class 10 · Polynomials · Q1':         'Remainder Theorem: when polynomial p(x) is divided by (x − c), the remainder equals p(c). If p(c) = 0, then (x − c) is a factor (Factor Theorem).',
    'Class 10 · Quadratic Equations · Q1': 'Solving by factorisation: write as (x − r₁)(x − r₂) = 0. Look for two numbers that multiply to the constant term and add to the linear coefficient (with sign).',
    'Class 10 · Coordinate Geometry · Q1': 'Midpoint formula: average of x-coordinates and average of y-coordinates. Section formula generalises to any ratio.',
    'Class 10 · Trigonometry · Q1':        'Pythagorean identity sin²θ + cos²θ = 1. Given one ratio, the others can be derived (mind the sign by quadrant for general angles).',
  };

  // (NCERT problems already use English / math notation in body and formula — no extra EN
  // dictionary in content-en.ts is needed.)

  // Legacy Korean unit name → NCERT chapter Korean name mapping.
  // Compatibility shim used while a few seed ProblemSpec.unit fields still use the old
  // Korean curriculum names. New seeds should use NCERT unit names directly.
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
        hint: 'Open the AI Guide panel on the study page for step-by-step coaching.',
      },
    });
    problems[p.source] = created.id;
  }

  // ===== 3-step MC (CONCEPT → PROCESS → ANSWER) — applied to the 7 featured problems only =====
  console.log('🪜 Seeding problem steps + choices for featured problems...');
  await seedSteps(prisma, problems);

  // ===== Concept Lessons — preparatory concept lessons per NCERT 7~12 grade and chapter =====
  console.log('📚 Seeding NCERT concept lessons (Class 7~12)...');
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
    { name: 'AI Diagnostic Mock',        type: 'RECOMMENDED', totalProblems: 30, totalMinutes: 100 },
    { name: 'Mini · per unit (Class 11)', type: 'MINI',       totalProblems: 10, totalMinutes: 25  },
    { name: 'Mini · per unit (Class 12)', type: 'MINI',       totalProblems: 10, totalMinutes: 25  },
    { name: 'Wrong-note Redo',           type: 'WRONG_REDO',  totalProblems: 15, totalMinutes: 40  },
    { name: 'Board Simulation · Class 10', type: 'REAL',      totalProblems: 30, totalMinutes: 100 },
    { name: 'Board Simulation · Class 12', type: 'REAL',      totalProblems: 30, totalMinutes: 100 },
  ];
  for (const m of systemMockExams) {
    const exists = await prisma.mockExam.findFirst({ where: { name: m.name } });
    if (!exists) {
      await prisma.mockExam.create({ data: m });
    }
  }

  console.log(`✅ Seed completed — ${UNIT_NAMES.length} units, ${problemsSpec.length} problems, ${systemMockExams.length} mock exams.`);
  console.log(`👤 Seed user (empty account): ${user.email}`);
  console.log(`📊 Grades: ${Object.entries(GRADE_TO_UNITS).map(([g, u]) => `${g}=${u.length} units`).join(', ')}`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
