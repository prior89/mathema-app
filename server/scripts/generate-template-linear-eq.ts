/**
 * Sprint 8 B3: deterministic template generator for 일차방정식 (linear-equation)
 * Study-pool problems. No LLM. Each problem's answer is computed by code,
 * so qualityStatus is written as APPROVED on insert — students see these
 * immediately, no Tier 2 grading needed.
 *
 * Target chapter: K-G7-MATH1-CH03-LETTERS-EQ (중1 수학1 — 일차방정식).
 *
 * Five templates:
 *   TYPE_A:  ax + b = c            → x = (c - b) / a
 *   TYPE_B:  x - b = c             → x = c + b
 *   TYPE_C:  ax - b = c            → x = (c + b) / a
 *   TYPE_D:  ax + b = cx + d       → x = (d - b) / (a - c)
 *   TYPE_E:  a(x + b) = c          → x = c / a - b
 *
 * For each generated problem, four distractors map to consistent error
 * codes from the KoreanStudyProblemSeed taxonomy:
 *   SIGN_ERROR              — sign flip on transposition
 *   ARITHMETIC_ERROR        — off-by-one in the final divide
 *   CONCEPT_MISUNDERSTANDING — adds b to c instead of subtracting (no transposition)
 *   CONDITION_MISSING       — divides only one side / forgets to distribute
 *
 * Run:
 *   npx ts-node --transpile-only scripts/generate-template-linear-eq.ts --count 20
 *   npx ts-node --transpile-only scripts/generate-template-linear-eq.ts --count 100 --seed 42
 */
import { PrismaClient, Difficulty, StepType, QualityStatus } from '@prisma/client';

type TemplateType = 'TYPE_A' | 'TYPE_B' | 'TYPE_C' | 'TYPE_D' | 'TYPE_E';

type Generated = {
  templateType: TemplateType;
  stem: string;
  correctText: string;
  distractors: { text: string; errorCode: string; errorReason: string }[];
  solution: string;
  difficulty: 'easy' | 'medium' | 'hard';
  concept: string;
  requiredSkills: string[];
  signatureHash: string; // dedup key
};

const CHAPTER_CODE = 'K-G7-MATH1-CH03-LETTERS-EQ';

// ---------- seedable RNG (mulberry32) ----------
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function int(r: () => number, lo: number, hi: number) {
  return Math.floor(r() * (hi - lo + 1)) + lo;
}
function pickNonZero(r: () => number, lo: number, hi: number) {
  let v = 0;
  while (v === 0) v = int(r, lo, hi);
  return v;
}

// ---------- templates ----------
function tmplA(r: () => number): Generated {
  // ax + b = c, picking (a, x, b) so c stays integer.
  const a = int(r, 2, 9);
  const x = int(r, -7, 7);
  const b = int(r, -9, 9);
  const c = a * x + b;
  const stem = `방정식 $${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)} = ${c}$ 의 해는?`;
  const correctText = `$x = ${x}$`;
  // Distractors
  const dist = [
    {
      text: `$x = ${(c + b) / a === Math.floor((c + b) / a) ? (c + b) / a : x + 1}$`,
      errorCode: 'SIGN_ERROR',
      errorReason: '이항 시 부호 안 바뀜',
    },
    {
      text: `$x = ${x + 1}$`,
      errorCode: 'ARITHMETIC_ERROR',
      errorReason: '마지막 나눗셈에서 1 더함',
    },
    {
      text: `$x = ${c + b}$`,
      errorCode: 'CONCEPT_MISUNDERSTANDING',
      errorReason: '이항 안 하고 $b$ 를 우변에 더함 + $a$ 안 나눔',
    },
    {
      text: `$x = ${c - b}$`,
      errorCode: 'CONDITION_MISSING',
      errorReason: '이항만 하고 $a$ 로 나누는 단계를 빠뜨림',
    },
  ];
  return {
    templateType: 'TYPE_A',
    stem, correctText, distractors: dist,
    solution: `$${b >= 0 ? '+' : '-'}${Math.abs(b)}$ 를 우변으로 이항: $${a}x = ${c} ${b >= 0 ? '-' : '+'} ${Math.abs(b)} = ${c - b}$. 양변을 $${a}$ 로 나눔: $x = ${x}$.`,
    difficulty: 'easy',
    concept: '일차방정식 $ax + b = c$',
    requiredSkills: ['linear_equation_solve', 'transposition'],
    signatureHash: `A:${a}:${x}:${b}`,
  };
}

function tmplB(r: () => number): Generated {
  const x = int(r, -9, 12);
  const b = pickNonZero(r, 2, 9);
  const c = x - b;
  const stem = `방정식 $x - ${b} = ${c}$ 의 해는?`;
  const correctText = `$x = ${x}$`;
  const dist = [
    {
      text: `$x = ${c - b}$`,
      errorCode: 'SIGN_ERROR',
      errorReason: '$-b$ 를 우변에 그대로 옮김 (부호 안 바뀜)',
    },
    {
      text: `$x = ${x + 1}$`,
      errorCode: 'ARITHMETIC_ERROR',
      errorReason: '단순 계산 실수',
    },
    {
      text: `$x = ${b}$`,
      errorCode: 'CONCEPT_MISUNDERSTANDING',
      errorReason: '좌변의 $b$ 만 그대로 답으로 적음',
    },
    {
      text: `$x = ${c}$`,
      errorCode: 'CONDITION_MISSING',
      errorReason: '우변 자체를 답으로 적음 (이항 안 함)',
    },
  ];
  return {
    templateType: 'TYPE_B',
    stem, correctText, distractors: dist,
    solution: `$-${b}$ 를 우변으로 이항하면 부호가 바뀌어 $+${b}$. $x = ${c} + ${b} = ${x}$.`,
    difficulty: 'easy',
    concept: '단순 이항 $x - b = c$',
    requiredSkills: ['linear_equation_solve', 'transposition'],
    signatureHash: `B:${x}:${b}`,
  };
}

function tmplC(r: () => number): Generated {
  const a = int(r, 2, 9);
  const x = int(r, -6, 8);
  const b = int(r, 1, 9); // positive so the stem reads "ax - b = c"
  const c = a * x - b;
  const stem = `방정식 $${a}x - ${b} = ${c}$ 의 해는?`;
  const correctText = `$x = ${x}$`;
  const dist = [
    {
      text: `$x = ${Math.floor((c - b) / a) || x - 1}$`,
      errorCode: 'SIGN_ERROR',
      errorReason: '$-b$ 이항 시 부호 안 바꿈',
    },
    {
      text: `$x = ${x - 1}$`,
      errorCode: 'ARITHMETIC_ERROR',
      errorReason: '나눗셈에서 1 작게',
    },
    {
      text: `$x = ${c + b}$`,
      errorCode: 'CONDITION_MISSING',
      errorReason: '이항만 하고 $a$ 로 나누는 단계 빠뜨림',
    },
    {
      text: `$x = ${c}$`,
      errorCode: 'CONCEPT_MISUNDERSTANDING',
      errorReason: '우변 자체를 답으로 적음',
    },
  ];
  return {
    templateType: 'TYPE_C',
    stem, correctText, distractors: dist,
    solution: `$-${b}$ 를 우변으로 이항: $${a}x = ${c} + ${b} = ${c + b}$. 양변을 $${a}$ 로 나눔: $x = ${x}$.`,
    difficulty: 'medium',
    concept: '음수 이항 $ax - b = c$',
    requiredSkills: ['linear_equation_solve', 'transposition'],
    signatureHash: `C:${a}:${x}:${b}`,
  };
}

function tmplD(r: () => number): Generated {
  // ax + b = cx + d, choose so (a - c) divides (d - b) exactly.
  for (let attempt = 0; attempt < 20; attempt++) {
    const a = int(r, 2, 9);
    let c = int(r, 1, a - 1); // a > c so coefficient of x stays positive
    if (c === a) c -= 1;
    const x = int(r, -6, 8);
    const b = int(r, -9, 9);
    const d = (a - c) * x + b;
    if (!Number.isInteger(d)) continue;
    // Cosmetic: coefficient 1 written as "x", not "1x".
    const leftCoef = a === 1 ? 'x' : `${a}x`;
    const rightCoef = c === 1 ? 'x' : `${c}x`;
    const stem = `방정식 $${leftCoef} ${b >= 0 ? '+' : '-'} ${Math.abs(b)} = ${rightCoef} ${d >= 0 ? '+' : '-'} ${Math.abs(d)}$ 의 해는?`;
    const correctText = `$x = ${x}$`;
    const dist = [
      {
        text: `$x = ${x + 1}$`,
        errorCode: 'ARITHMETIC_ERROR',
        errorReason: '마지막 나눗셈 1 차이',
      },
      {
        text: `$x = ${-x}$`,
        errorCode: 'SIGN_ERROR',
        errorReason: '이항 시 부호 바꾸지 않음',
      },
      {
        text: `$x = ${d - b}$`,
        errorCode: 'CONDITION_MISSING',
        errorReason: '$(a - c)$ 로 나누는 단계 빠뜨림',
      },
      {
        text: `$x = ${d + b}$`,
        errorCode: 'CONCEPT_MISUNDERSTANDING',
        errorReason: '$+b$ 를 우변에 더해버림 (이항 부호 X)',
      },
    ];
    return {
      templateType: 'TYPE_D',
      stem, correctText, distractors: dist,
      solution: `양변에서 $${c}x$ 와 $${b >= 0 ? '+' : '-'}${Math.abs(b)}$ 를 이항: $${a - c}x = ${d - b}$. 양변을 $${a - c}$ 로 나눔: $x = ${x}$.`,
      difficulty: 'medium',
      concept: '양변에 미지수 $ax + b = cx + d$',
      requiredSkills: ['linear_equation_solve', 'transposition_both_sides'],
      signatureHash: `D:${a}:${c}:${x}:${b}`,
    };
  }
  // fallback: shouldn't hit, but keep the type happy
  return tmplA(r);
}

function tmplE(r: () => number): Generated {
  // a(x + b) = c, with x integer.
  const a = int(r, 2, 9);
  const x = int(r, -6, 8);
  const b = int(r, -7, 7);
  const c = a * (x + b);
  const stem = `방정식 $${a}(x ${b >= 0 ? '+' : '-'} ${Math.abs(b)}) = ${c}$ 의 해는?`;
  const correctText = `$x = ${x}$`;
  const dist = [
    {
      text: `$x = ${c - a * b}$`,
      errorCode: 'CONDITION_MISSING',
      errorReason: '분배만 하고 $a$ 로 나누는 단계 빠뜨림',
    },
    {
      text: `$x = ${c - b}$`,
      errorCode: 'CONCEPT_MISUNDERSTANDING',
      errorReason: '괄호 분배 안 하고 그대로 $-b$ 만 이항',
    },
    {
      text: `$x = ${x + 1}$`,
      errorCode: 'ARITHMETIC_ERROR',
      errorReason: '마지막 나눗셈 1 차이',
    },
    {
      text: `$x = ${x + 2 * b}$`,
      errorCode: 'SIGN_ERROR',
      errorReason: '$b$ 이항 시 부호 안 바꿈',
    },
  ];
  return {
    templateType: 'TYPE_E',
    stem, correctText, distractors: dist,
    solution: `분배법칙: $${a}x ${a * b >= 0 ? '+' : '-'} ${Math.abs(a * b)} = ${c}$. 이항: $${a}x = ${c - a * b}$. 양변을 $${a}$ 로 나눔: $x = ${x}$.`,
    difficulty: 'medium',
    concept: '괄호 분배 $a(x + b) = c$',
    requiredSkills: ['linear_equation_solve', 'distributive_law'],
    signatureHash: `E:${a}:${x}:${b}`,
  };
}

const GENERATORS: Array<(r: () => number) => Generated> = [tmplA, tmplB, tmplC, tmplD, tmplE];

// ---------- self-validate: every generated problem must have unique 5 options
// and exactly 1 correct, and the stem must mathematically yield the correct
// answer (sanity-checked by re-parsing — here we just ensure correct distinctness). ----------
function validate(g: Generated): string | null {
  const all = [g.correctText, ...g.distractors.map((d) => d.text)];
  const uniq = new Set(all);
  if (uniq.size !== 5) return `non-unique options: ${all.join(' | ')}`;
  return null;
}

// ---------- main runner ----------
async function main() {
  const args = process.argv.slice(2);
  const countIdx = args.indexOf('--count');
  const count = countIdx >= 0 ? parseInt(args[countIdx + 1], 10) : 20;
  const seedIdx = args.indexOf('--seed');
  const seed = seedIdx >= 0 ? parseInt(args[seedIdx + 1], 10) : Date.now() % 100000;
  const dryRun = args.includes('--dry-run');

  console.log(`Generating ${count} problem(s) for ${CHAPTER_CODE} (seed=${seed}, dryRun=${dryRun})`);

  const r = rng(seed);
  const generated: Generated[] = [];
  const seenSignatures = new Set<string>();
  let attempts = 0;
  while (generated.length < count && attempts < count * 6) {
    attempts++;
    const gen = GENERATORS[attempts % GENERATORS.length](r);
    if (seenSignatures.has(gen.signatureHash)) continue;
    const err = validate(gen);
    if (err) {
      console.warn(`[skip] ${gen.signatureHash}  ${err}`);
      continue;
    }
    seenSignatures.add(gen.signatureHash);
    generated.push(gen);
  }

  if (generated.length < count) {
    console.warn(`Only generated ${generated.length}/${count} (saturated dedup)`);
  }

  if (dryRun) {
    for (const g of generated.slice(0, 5)) {
      console.log('---');
      console.log(`[${g.templateType}] ${g.stem}`);
      console.log(`  ✓ ${g.correctText}`);
      for (const d of g.distractors) console.log(`  ✗ ${d.text}  (${d.errorCode})`);
      console.log(`  📝 ${g.solution}`);
    }
    console.log(`\nDry-run complete: ${generated.length} problems generated.`);
    return;
  }

  const prisma = new PrismaClient();
  try {
    const lesson = await prisma.koreanConceptLesson.findUnique({
      where: { chapterCode: CHAPTER_CODE },
      select: { id: true },
    });
    if (!lesson) {
      console.error(`KoreanConceptLesson ${CHAPTER_CODE} not found`);
      process.exit(1);
    }
    const fallbackUnit = await prisma.unit.findFirst({ orderBy: { order: 'asc' }, select: { id: true } });
    if (!fallbackUnit) {
      console.error('No Unit fallback found');
      process.exit(1);
    }

    let created = 0;
    for (const g of generated) {
      const options = [
        { text: g.correctText, isCorrect: true, errorCode: null as string | null, errorReason: null as string | null },
        ...g.distractors.map((d) => ({
          text: d.text, isCorrect: false, errorCode: d.errorCode, errorReason: d.errorReason,
        })),
      ];
      // Shuffle so the correct answer isn't always option A.
      for (let i = options.length - 1; i > 0; i--) {
        const j = int(r, 0, i);
        [options[i], options[j]] = [options[j], options[i]];
      }

      const difficultyEnum: Difficulty =
        g.difficulty === 'easy' ? 'MIDDLE' :
        g.difficulty === 'medium' ? 'UPPER_MIDDLE' : 'SEMI_KILLER';
      const difficultyLevel = g.difficulty === 'easy' ? 2 : g.difficulty === 'medium' ? 3 : 4;

      await prisma.problem.create({
        data: {
          source: `template:linear-eq:v1#${g.signatureHash}`,
          unitId: fallbackUnit.id,
          koreanConceptLessonId: lesson.id,
          difficulty: difficultyEnum,
          body: g.stem,
          concept: g.concept,
          answer: g.correctText,
          requiredSkills: g.requiredSkills,
          difficultyLevel,
          expectedSolutionSteps: { explanation: g.solution } as any,
          // Sprint 8: deterministic generator → mark APPROVED on insert,
          // bypassing Tier 2 LLM grading. All answers are computed by code.
          qualityStatus: QualityStatus.APPROVED,
          qualityModel: 'template:linear-eq:v1',
          qualityPromptVersion: 'v1',
          qualityScoredAt: new Date(),
          steps: {
            create: [{
              stepIndex: 1,
              stepType: StepType.ANSWER,
              prompt: g.stem,
              choices: {
                create: options.map((o, i) => ({
                  choiceIndex: i + 1,
                  text: o.text,
                  isCorrect: o.isCorrect,
                  distractorErrorCode: o.errorCode,
                  rationale: o.errorReason,
                })),
              },
            }],
          },
        },
      });
      created++;
    }
    console.log(`\n[ok] Created ${created} template-generated problems in ${CHAPTER_CODE}.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
