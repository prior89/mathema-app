/**
 * seed-india-mastery-problems.ts
 *
 * Formula-driven NCERT/India Mastery seeder.
 *
 * Goal:
 *   - every ConceptLesson gets exactly 20 deterministic 3-step Mastery problems
 *   - every generated problem has:
 *       1 CONCEPT step, 1 PROCESS step, 1 ANSWER step
 *       5 choices per step
 *       exactly 1 correct choice per step
 *   - ConceptLesson.masterySetProblemIds is frozen to the 20 generated IDs
 *   - LessonProblemSet shadow inventory is upserted to READY
 *
 * Safety:
 *   - default mode is idempotent and non-destructive
 *   - only rows with source prefix "Matheo IN Formula Mastery v1" are reused
 *   - existing NCERT / LLM / admin-authored problems are not deleted
 *   - use --refresh only before launch if you deliberately want to delete and
 *     recreate this generated source prefix for the selected chapters
 *
 * Usage:
 *   DATABASE_URL=... npx ts-node scripts/seed-india-mastery-problems.ts
 *   DATABASE_URL=... npx ts-node scripts/seed-india-mastery-problems.ts --code C7-CH01-INTEGERS
 *   DATABASE_URL=... npx ts-node scripts/seed-india-mastery-problems.ts --refresh
 */

import {
  Difficulty,
  PrismaClient,
  StepType,
  SetStatus,
  SetType,
} from '@prisma/client';
import { NCERT_CHAPTERS, NCERT_BY_CLASS, NcertChapter } from '../src/common/curriculum/ncert-chapters';

const prisma = new PrismaClient();
const SOURCE_PREFIX = 'Matheo IN Formula Mastery v1';
const TARGET = 20;

const args = process.argv.slice(2);
const refresh = args.includes('--refresh');
const dryRun = args.includes('--dry-run');
const selfTest = args.includes('--self-test');
const codeIdx = args.indexOf('--code');
const onlyCode = codeIdx >= 0 ? args[codeIdx + 1] : null;

type ChoiceSeed = {
  text: string;
  isCorrect: boolean;
  distractorType?: 'CONCEPT_CONFUSION' | 'CALC_ERROR' | 'PROCESS_SKIP' | 'TIME_PRESSURE_GUESS';
  rationale?: string;
};

type ProblemSeed = {
  body: string;
  answer: string;
  formula: string;
  concept: string;
  hint: string;
  requiredSkills: string[];
  expectedSolutionSteps: string[];
  processPrompt: string;
  processCorrect: string;
  processDistractors: ChoiceSeed[];
  answerDistractors: string[];
};

type LessonRow = {
  id: string;
  unitId: string | null;
  subUnitId: string | null;
  chapterCode: string;
  ncertClass: NcertChapter['ncertClass'];
  chapterNumber: number;
  titleEn: string;
};

function difficultyForSlot(slot: number): { difficulty: Difficulty; level: number } {
  if (slot < 5) return { difficulty: Difficulty.MIDDLE, level: 2 };
  if (slot < 10) return { difficulty: Difficulty.UPPER_MIDDLE, level: 3 };
  if (slot < 15) return { difficulty: Difficulty.SEMI_KILLER, level: 4 };
  return { difficulty: Difficulty.KILLER, level: 5 };
}

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const t = a % b;
    a = b;
    b = t;
  }
  return a || 1;
}

function simplifyFraction(n: number, d: number): string {
  if (d < 0) {
    n *= -1;
    d *= -1;
  }
  const g = gcd(n, d);
  n /= g;
  d /= g;
  if (d === 1) return String(n);
  return `${n}/${d}`;
}

function factorial(n: number): number {
  let out = 1;
  for (let i = 2; i <= n; i++) out *= i;
  return out;
}

function nCr(n: number, r: number): number {
  return factorial(n) / (factorial(r) * factorial(n - r));
}

function nPr(n: number, r: number): number {
  return factorial(n) / factorial(n - r);
}

function seededShuffle<T>(items: T[], seedText: string): T[] {
  const arr = [...items];
  let seed = 0;
  for (const ch of seedText) seed = (seed * 31 + ch.charCodeAt(0)) % 2147483647;
  for (let i = arr.length - 1; i > 0; i--) {
    seed = (seed * 48271) % 2147483647;
    const j = seed % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function uniqueFive(correct: string, candidates: string[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const x of [correct, ...candidates, `${correct} + 1`, `${correct} - 1`, 'Cannot be determined', 'None of these']) {
    const text = String(x).trim();
    if (!text || seen.has(text)) continue;
    seen.add(text);
    out.push(text);
    if (out.length === 5) break;
  }
  return out;
}

function titleDistractors(chapter: NcertChapter): string[] {
  const sameClass = NCERT_BY_CLASS[chapter.ncertClass] ?? [];
  return seededShuffle(
    sameClass.filter((c) => c.chapterCode !== chapter.chapterCode).map((c) => c.titleEn),
    chapter.chapterCode,
  ).slice(0, 4);
}

function kindFor(chapter: NcertChapter): string {
  const key = `${chapter.chapterCode} ${chapter.titleEn}`.toLowerCase();
  if (/inverse trig/.test(key)) return 'inverse_trig';
  if (/trig/.test(key)) return 'trig';
  if (/complex|quadratic/.test(key)) return 'quadratic';
  if (/linear ineq|inequal/.test(key)) return 'inequality';
  if (/permutation|combination/.test(key)) return 'perm_comb';
  if (/binomial/.test(key)) return 'binomial';
  if (/sequence|series|ap\b|progression/.test(key)) return 'sequence';
  if (/sets/.test(key)) return 'sets';
  if (/relation|function/.test(key)) return 'function';
  if (/straight line|coordinate|graph/.test(key)) return 'coordinate';
  if (/conic/.test(key)) return 'conic';
  if (/three dimensional|3d|vector/.test(key)) return 'vector_3d';
  if (/matrix|matrices/.test(key)) return 'matrix';
  if (/determinant/.test(key)) return 'determinant';
  if (/limit|continuity|differentiability|derivative/.test(key)) return 'calculus';
  if (/integral/.test(key)) return 'integral';
  if (/differential equation/.test(key)) return 'diff_eq';
  if (/linear programming/.test(key)) return 'linear_programming';
  if (/probability/.test(key)) return 'probability';
  if (/statistics|data handling/.test(key)) return 'statistics';
  if (/circle/.test(key)) return 'circle';
  if (/triangle|quadrilateral|euclid|lines and angles|symmetry/.test(key)) return 'geometry';
  if (/perimeter|area|mensuration|surface|volume|solid/.test(key)) return 'mensuration';
  if (/square|cube|exponent|power|number system|real number|integer|fraction|decimal|rational|comparing/.test(key)) return 'number';
  if (/polynomial|expression|identit|factor/.test(key)) return 'algebra';
  return 'algebra';
}

function processFor(kind: string, title: string): { prompt: string; correct: string; distractors: ChoiceSeed[] } {
  const generic: ChoiceSeed[] = [
    { text: 'Guess from the options without setting up the formula', isCorrect: false, distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Guessed before writing the model' },
    { text: 'Use a geometry formula even though the expression is algebraic', isCorrect: false, distractorType: 'CONCEPT_CONFUSION', rationale: 'Confused the chapter category' },
    { text: 'Substitute numbers before checking the required operation', isCorrect: false, distractorType: 'PROCESS_SKIP', rationale: 'Skipped the planning step' },
    { text: 'Change one sign or exponent and continue', isCorrect: false, distractorType: 'CALC_ERROR', rationale: 'Typical arithmetic slip' },
  ];
  const byKind: Record<string, string> = {
    number: 'Apply the arithmetic law or number formula, simplify carefully, then reduce if needed',
    algebra: 'Identify the algebraic structure, rewrite with identities or factors, then simplify',
    quadratic: 'Put the quadratic in standard form, factor or use the formula, then list the roots',
    inequality: 'Isolate the variable, remembering to flip the sign if multiplying by a negative',
    sequence: 'Identify AP/GP or the summation pattern, substitute into the correct formula',
    sets: 'Translate the statement into set cardinality or set operations, then apply inclusion-exclusion',
    function: 'Apply the function definition in the correct order, checking domain/range if needed',
    trig: 'Choose the correct trigonometric ratio or identity, substitute the angle/value, then simplify',
    inverse_trig: 'Use the principal-value range, convert the inverse ratio to the matching angle',
    perm_comb: 'Decide whether order matters, then use permutation or combination formula',
    binomial: 'Locate the required term with binomial coefficients and powers',
    coordinate: 'Pick the coordinate formula (distance, midpoint, slope, or line), then substitute points',
    conic: 'Match the conic standard form and read the required parameter',
    vector_3d: 'Write vectors component-wise, then apply dot/distance/vector formula',
    matrix: 'Use row-column or entry-wise matrix operations, checking dimensions first',
    determinant: 'Apply the determinant rule and simplify signs carefully',
    calculus: 'Use the limit/derivative rule appropriate to the expression, then evaluate',
    integral: 'Find the antiderivative or definite integral by the power rule, then substitute bounds',
    diff_eq: 'Separate variables or recognise the standard differential equation form',
    linear_programming: 'Evaluate the objective function at feasible vertices and choose the optimum',
    probability: 'Count favourable outcomes and total outcomes, then reduce the ratio',
    statistics: 'Choose the correct summary statistic, compute from the data, then interpret',
    geometry: 'Use the angle/shape theorem that matches the figure, then solve for the unknown',
    mensuration: 'Identify the shape, choose the matching area/volume formula, then substitute',
  };
  return {
    prompt: `Which process best solves this ${title} problem?`,
    correct: byKind[kind] ?? byKind.algebra,
    distractors: generic,
  };
}

function makeSeed(chapter: NcertChapter, slot: number): ProblemSeed {
  const kind = kindFor(chapter);
  const n = slot + 1;
  const a = 2 + (slot % 7);
  const b = 3 + ((slot * 2) % 9);
  const c = 4 + ((slot * 3) % 11);
  const d = 5 + ((slot * 5) % 13);
  const process = processFor(kind, chapter.titleEn);

  let body = '';
  let answer = '';
  let formula = '';
  let skills = [kind, chapter.chapterCode.toLowerCase()];
  let solution: string[] = [];
  let distractors: string[] = [];

  switch (kind) {
    case 'number': {
      const x = a * b - c;
      body = `Compute $${a} \\times ${b} - ${c}$.`;
      answer = String(x);
      formula = 'Use order of operations: multiply first, then subtract.';
      solution = [`${a} \\times ${b} = ${a * b}`, `${a * b} - ${c} = ${x}`];
      distractors = [String(a * (b - c)), String(a + b - c), String(a * b + c), String(x + a)];
      break;
    }
    case 'algebra': {
      body = `Expand and simplify: $(x+${a})(x+${b})$.`;
      answer = `$x^2+${a + b}x+${a * b}$`;
      formula = 'Use (x+a)(x+b)=x^2+(a+b)x+ab.';
      solution = [`a+b=${a + b}`, `ab=${a * b}`, `Result = ${answer}`];
      distractors = [`$x^2+${a * b}x+${a + b}$`, `$x^2+${a + b}x-${a * b}$`, `$x^2+${a}x+${b}$`, `$2x+${a + b}$`];
      break;
    }
    case 'quadratic': {
      const r1 = a;
      const r2 = b;
      body = `Solve $x^2-${r1 + r2}x+${r1 * r2}=0$.`;
      answer = `$x=${r1}$ or $x=${r2}$`;
      formula = 'If x^2-Sx+P=0 and P=r1r2, S=r1+r2, then roots are r1 and r2.';
      solution = [`${r1}+${r2}=${r1 + r2}`, `${r1}\\cdot ${r2}=${r1 * r2}`, `Roots are ${r1}, ${r2}`];
      distractors = [`$x=${-r1}$ or $x=${-r2}$`, `$x=${r1 + r2}$ only`, `$x=${r1 * r2}$ only`, `$x=${r1}$ or $x=${-r2}$`];
      break;
    }
    case 'inequality': {
      const rhs = a * b + c;
      const bound = simplifyFraction(rhs - c, a);
      body = `Solve the inequality $${a}x+${c}<${rhs}$.`;
      answer = `$x<${bound}$`;
      formula = 'Subtract the constant from both sides, then divide by the positive coefficient.';
      solution = [`${a}x < ${rhs - c}`, `x < ${bound}`];
      distractors = [`$x>${bound}$`, `$x<${rhs + c}$`, `$x>${rhs - c}$`, `$x<${simplifyFraction(rhs, a)}$`];
      break;
    }
    case 'sequence': {
      const first = a;
      const diff = b;
      const term = first + (n - 1) * diff;
      body = `In an AP with first term ${first} and common difference ${diff}, find $a_${n}$.`;
      answer = String(term);
      formula = 'AP nth term: a_n = a + (n-1)d.';
      solution = [`a_${n}=${first}+(${n}-1)${diff}`, `a_${n}=${term}`];
      distractors = [String(first + n * diff), String(first * n + diff), String(term - diff), String(term + diff)];
      break;
    }
    case 'sets': {
      const A = 20 + a;
      const B = 18 + b;
      const both = 5 + (slot % 6);
      const union = A + B - both;
      body = `If $n(A)=${A}$, $n(B)=${B}$ and $n(A\\cap B)=${both}$, find $n(A\\cup B)$.`;
      answer = String(union);
      formula = 'Inclusion-exclusion: n(A union B)=n(A)+n(B)-n(A intersection B).';
      solution = [`${A}+${B}-${both}=${union}`];
      distractors = [String(A + B), String(A + B + both), String(A - both), String(B - both)];
      break;
    }
    case 'function': {
      const k = 1 + (slot % 5);
      const value = a * k + b;
      body = `Let $f(x)=${a}x+${b}$. Find $f(${k})$.`;
      answer = String(value);
      formula = 'Substitute the input into the function rule.';
      solution = [`f(${k})=${a}\\cdot ${k}+${b}`, `f(${k})=${value}`];
      distractors = [String(a + k + b), String(a * (k + b)), String(value - b), String(value + a)];
      break;
    }
    case 'trig': {
      const triples = [
        ['sin 30', '1/2'], ['cos 60', '1/2'], ['tan 45', '1'], ['sin 45', '$\\sqrt{2}/2$'], ['cos 30', '$\\sqrt{3}/2$'],
      ];
      const [expr, val] = triples[slot % triples.length];
      body = `Find the exact value of $\\${expr}^{\\circ}$.`;
      answer = val;
      formula = 'Use the standard 30-45-60 trigonometric values.';
      solution = [`Standard value: ${expr} = ${val}`];
      distractors = ['0', '1', '$\\sqrt{3}/2$', '$\\sqrt{2}/2$', '1/2'].filter((x) => x !== val);
      break;
    }
    case 'inverse_trig': {
      body = `Find the principal value of $\\sin^{-1}(1/2)$.`;
      answer = `$\\pi/6$`;
      formula = 'sin^{-1}(1/2) is the angle in [-pi/2, pi/2] whose sine is 1/2.';
      solution = [`sin(pi/6)=1/2`, `Principal value = pi/6`];
      distractors = ['$\\pi/3$', '$\\pi/2$', '$5\\pi/6$', '$0$'];
      break;
    }
    case 'perm_comb': {
      const nn = 6 + (slot % 5);
      const rr = 2 + (slot % 3);
      const ordered = slot % 2 === 0;
      const value = ordered ? nPr(nn, rr) : nCr(nn, rr);
      body = ordered ? `How many ways can ${rr} positions be filled from ${nn} distinct students?` : `How many ways can ${rr} students be chosen from ${nn} distinct students?`;
      answer = String(value);
      formula = ordered ? 'Order matters: nPr = n!/(n-r)!.' : 'Order does not matter: nCr = n!/(r!(n-r)!).';
      solution = [ordered ? `${nn}P${rr}=${value}` : `${nn}C${rr}=${value}`];
      distractors = [String(nCr(nn, rr)), String(nPr(nn, rr)), String(nn * rr), String(nn + rr)].filter((x) => x !== String(value));
      break;
    }
    case 'binomial': {
      const nn = 5 + (slot % 6);
      const rr = 1 + (slot % Math.min(4, nn));
      const value = nCr(nn, rr);
      body = `Find the coefficient of $x^${rr}$ in $(1+x)^${nn}$.`;
      answer = String(value);
      formula = 'Coefficient of x^r in (1+x)^n is nCr.';
      solution = [`Coefficient = ${nn}C${rr} = ${value}`];
      distractors = [String(nCr(nn, rr - 1)), String(nCr(nn, Math.min(nn, rr + 1))), String(nn * rr), String(value + nn)];
      break;
    }
    case 'coordinate': {
      const x1 = a;
      const y1 = b;
      const x2 = a + 3;
      const y2 = b + 4;
      body = `Find the distance between $(${x1},${y1})$ and $(${x2},${y2})$.`;
      answer = '5';
      formula = 'Distance formula: sqrt((x2-x1)^2+(y2-y1)^2).';
      solution = [`sqrt(3^2+4^2)=5`];
      distractors = ['7', '$\\sqrt{7}$', '25', '1'];
      break;
    }
    case 'conic': {
      body = `For the circle $(x-${a})^2+(y-${b})^2=${c * c}$, find the radius.`;
      answer = String(c);
      formula = 'Circle standard form: (x-h)^2+(y-k)^2=r^2.';
      solution = [`r^2=${c * c}`, `r=${c}`];
      distractors = [String(c * c), String(a), String(b), String(a + b)];
      break;
    }
    case 'vector_3d': {
      const dot = a * b + c * d + (a + 1) * (b + 1);
      body = `Find the dot product of $\\vec u=(${a},${c},${a + 1})$ and $\\vec v=(${b},${d},${b + 1})$.`;
      answer = String(dot);
      formula = 'Dot product: u.v = x1x2 + y1y2 + z1z2.';
      solution = [`${a}\\cdot ${b}+${c}\\cdot ${d}+${a + 1}\\cdot ${b + 1}=${dot}`];
      distractors = [String(dot + a), String(dot - b), String(a + b + c + d), String(a * b)];
      break;
    }
    case 'matrix': {
      const value = a + d;
      body = `If $A=\\begin{pmatrix}${a}&${b}\\\\${c}&${d}\\end{pmatrix}$, find the trace of $A$.`;
      answer = String(value);
      formula = 'Trace of a square matrix is the sum of diagonal entries.';
      solution = [`trace(A)=${a}+${d}=${value}`];
      distractors = [String(a + b), String(b + c), String(c + d), String(a + b + c + d)];
      break;
    }
    case 'determinant': {
      const det = a * d - b * c;
      body = `Find $\\det\\begin{pmatrix}${a}&${b}\\\\${c}&${d}\\end{pmatrix}$.`;
      answer = String(det);
      formula = 'For a 2x2 matrix, determinant = ad-bc.';
      solution = [`${a}\\cdot ${d}-${b}\\cdot ${c}=${det}`];
      distractors = [String(a * d + b * c), String(b * c - a * d), String(a + d - b - c), String(a + b + c + d)];
      break;
    }
    case 'calculus': {
      const power = 2 + (slot % 4);
      const at = 1 + (slot % 4);
      const value = a * power * Math.pow(at, power - 1);
      body = `For $f(x)=${a}x^${power}$, find $f'(${at})$.`;
      answer = String(value);
      formula = 'Power rule: d/dx(ax^n)=anx^(n-1).';
      solution = [`f'(x)=${a * power}x^${power - 1}`, `f'(${at})=${value}`];
      distractors = [String(a * Math.pow(at, power)), String(value + power), String(value - a), String(a * power)];
      break;
    }
    case 'integral': {
      const upper = 1 + (slot % 5);
      const value = a * upper * upper;
      body = `Evaluate $\\int_0^${upper} ${2 * a}x\\,dx$.`;
      answer = String(value);
      formula = 'Integral of 2ax is ax^2; apply upper minus lower bound.';
      solution = [`[${a}x^2]_0^${upper}`, `${a}\\cdot ${upper * upper}=${value}`];
      distractors = [String(2 * a * upper), String(value + upper), String(value - a), String(a + upper)];
      break;
    }
    case 'diff_eq': {
      body = `Solve the differential equation $\\frac{dy}{dx}=${a}y$ with $y(0)=${b}$.`;
      answer = `$y=${b}e^{${a}x}$`;
      formula = 'For dy/dx=ky, solution is y=Ce^(kx); use initial value for C.';
      solution = [`y=Ce^{${a}x}`, `y(0)=C=${b}`];
      distractors = [`$y=${a}e^{${b}x}$`, `$y=${b}x+${a}$`, `$y=${b}e^{x}$`, `$y=${a + b}e^x$`];
      break;
    }
    case 'linear_programming': {
      const vals = [
        { x: 0, y: 0 },
        { x: a, y: 0 },
        { x: 0, y: b },
        { x: a, y: b },
      ];
      const p = 2 + (slot % 4);
      const q = 3 + (slot % 3);
      const best = vals.map((v) => ({ ...v, z: p * v.x + q * v.y })).sort((u, v) => v.z - u.z)[0];
      body = `Maximise $Z=${p}x+${q}y$ over the rectangle with vertices $(0,0),(${a},0),(0,${b}),(${a},${b})$.`;
      answer = String(best.z);
      formula = 'A linear objective reaches its optimum at a feasible vertex.';
      solution = [`Evaluate Z at all vertices`, `Maximum is ${best.z} at (${best.x},${best.y})`];
      distractors = vals.map((v) => String(p * v.x + q * v.y)).filter((x) => x !== String(best.z));
      break;
    }
    case 'probability': {
      const red = a;
      const blue = b;
      const total = red + blue;
      body = `A bag has ${red} red balls and ${blue} blue balls. One ball is drawn at random. Find $P(\\text{red})$.`;
      answer = simplifyFraction(red, total);
      formula = 'Probability = favourable outcomes / total outcomes.';
      solution = [`P(red)=${red}/${total}`, `Reduced = ${answer}`];
      distractors = [simplifyFraction(blue, total), simplifyFraction(red, blue), simplifyFraction(total, red), simplifyFraction(red + blue, total + red)];
      break;
    }
    case 'statistics': {
      const values = [a, b, c, d, a + b];
      const sum = values.reduce((x, y) => x + y, 0);
      const ans = simplifyFraction(sum, values.length);
      body = `Find the mean of the data set $[${values.join(', ')}]$.`;
      answer = ans;
      formula = 'Mean = sum of observations / number of observations.';
      solution = [`Sum=${sum}`, `Mean=${sum}/5=${ans}`];
      distractors = [String(sum), String(Math.min(...values)), String(Math.max(...values)), simplifyFraction(sum, 4)];
      break;
    }
    case 'circle': {
      const angle = [60, 90, 120, 180][slot % 4];
      const inscribed = angle / 2;
      body = `A central angle of a circle is ${angle} degrees. Find the angle subtended by the same arc at the circumference.`;
      answer = `${inscribed} degrees`;
      formula = 'An angle at the centre is twice the angle at the circumference on the same arc.';
      solution = [`Inscribed angle = ${angle}/2 = ${inscribed} degrees`];
      distractors = [`${angle} degrees`, `${angle * 2} degrees`, `${180 - inscribed} degrees`, `${90 - inscribed / 2} degrees`];
      break;
    }
    case 'geometry': {
      const angle1 = 40 + (slot % 5) * 5;
      const angle2 = 50 + (slot % 4) * 5;
      const angle3 = 180 - angle1 - angle2;
      body = `Two angles of a triangle are ${angle1} degrees and ${angle2} degrees. Find the third angle.`;
      answer = `${angle3} degrees`;
      formula = 'Interior angles of a triangle sum to 180 degrees.';
      solution = [`180-${angle1}-${angle2}=${angle3}`];
      distractors = [`${angle1 + angle2} degrees`, `${180 - angle1} degrees`, `${180 - angle2} degrees`, `${angle3 + 10} degrees`];
      break;
    }
    case 'mensuration': {
      const area = a * b;
      body = `A rectangle has length ${a} cm and breadth ${b} cm. Find its area.`;
      answer = `${area} cm^2`;
      formula = 'Area of rectangle = length x breadth.';
      solution = [`A=${a}\\times ${b}=${area}`];
      distractors = [`${2 * (a + b)} cm`, `${a + b} cm^2`, `${area + a} cm^2`, `${a * a + b * b} cm^2`];
      break;
    }
    default: {
      body = `Simplify $${a}x+${b}x-${c}x$.`;
      const coef = a + b - c;
      answer = `$${coef}x$`;
      formula = 'Combine like terms by adding coefficients.';
      solution = [`${a}+${b}-${c}=${coef}`, `Result = ${coef}x`];
      distractors = [`$${a + b + c}x$`, `$${a + b}x-${c}$`, `$${coef}$`, `$x+${coef}$`];
      skills = ['combine_like_terms', chapter.chapterCode.toLowerCase()];
    }
  }

  return {
    body,
    answer,
    formula,
    concept: `${chapter.titleEn}: ${formula}`,
    hint: `Use the ${chapter.titleEn} formula first, then simplify one step at a time.`,
    requiredSkills: skills,
    expectedSolutionSteps: solution,
    processPrompt: process.prompt,
    processCorrect: process.correct,
    processDistractors: process.distractors,
    answerDistractors: distractors,
  };
}

function buildSteps(chapter: NcertChapter, seed: ProblemSeed, slot: number) {
  const conceptChoices: ChoiceSeed[] = [
    { text: chapter.titleEn, isCorrect: true },
    ...titleDistractors(chapter).map((text) => ({
      text,
      isCorrect: false,
      distractorType: 'CONCEPT_CONFUSION' as const,
      rationale: `This belongs to ${text}, not ${chapter.titleEn}.`,
    })),
  ];

  const processChoices: ChoiceSeed[] = [
    { text: seed.processCorrect, isCorrect: true },
    ...seed.processDistractors,
  ];

  const answers = uniqueFive(seed.answer, seed.answerDistractors);
  const answerChoices: ChoiceSeed[] = answers.map((text, idx) => ({
    text,
    isCorrect: idx === 0,
    ...(idx === 0 ? {} : {
      distractorType: idx % 2 === 0 ? 'CALC_ERROR' as const : 'PROCESS_SKIP' as const,
      rationale: 'A plausible wrong answer from a common calculation or process slip.',
    }),
  }));

  const shuffledConcept = seededShuffle(conceptChoices, `${chapter.chapterCode}:concept:${slot}`);
  const shuffledProcess = seededShuffle(processChoices, `${chapter.chapterCode}:process:${slot}`);
  const shuffledAnswer = seededShuffle(answerChoices, `${chapter.chapterCode}:answer:${slot}`);

  return [
    {
      stepIndex: 1,
      stepType: StepType.CONCEPT,
      prompt: 'Which concept or chapter formula should be used first?',
      choices: shuffledConcept,
    },
    {
      stepIndex: 2,
      stepType: StepType.PROCESS,
      prompt: seed.processPrompt,
      choices: shuffledProcess,
    },
    {
      stepIndex: 3,
      stepType: StepType.ANSWER,
      prompt: 'What is the final answer?',
      choices: shuffledAnswer,
    },
  ];
}

function validateSeed(chapter: NcertChapter, seed: ProblemSeed, slot: number) {
  const steps = buildSteps(chapter, seed, slot);
  if (steps.length !== 3) throw new Error(`${chapter.chapterCode} slot ${slot}: steps != 3`);
  for (const s of steps) {
    if (s.choices.length !== 5) throw new Error(`${chapter.chapterCode} slot ${slot}: choices != 5`);
    const correct = s.choices.filter((c) => c.isCorrect).length;
    if (correct !== 1) throw new Error(`${chapter.chapterCode} slot ${slot}: correct choices != 1`);
  }
}

async function deleteGeneratedRows(lessonId: string) {
  const existing = await prisma.problem.findMany({
    where: { conceptLessonId: lessonId, source: { startsWith: SOURCE_PREFIX } },
    select: { id: true },
  });
  if (existing.length === 0) return 0;
  const ids = existing.map((p) => p.id);
  await prisma.attempt.deleteMany({ where: { problemId: { in: ids } } });
  await prisma.wrongNote.deleteMany({ where: { problemId: { in: ids } } }).catch(() => undefined);
  const deleted = await prisma.problem.deleteMany({ where: { id: { in: ids } } });
  return deleted.count;
}

async function ensureChapter(chapter: NcertChapter, lesson: LessonRow) {
  if (!lesson.unitId) {
    return { code: chapter.chapterCode, created: 0, reused: 0, status: 'SKIPPED_NO_UNIT' };
  }

  if (refresh && !dryRun) {
    await prisma.conceptLesson.update({
      where: { id: lesson.id },
      data: { masterySetProblemIds: [], masterySetCuratedAt: null },
    });
    await deleteGeneratedRows(lesson.id);
  }

  const ids: string[] = [];
  let created = 0;
  let reused = 0;

  for (let slot = 0; slot < TARGET; slot++) {
    const source = `${SOURCE_PREFIX} | ${chapter.chapterCode} | slot ${String(slot + 1).padStart(2, '0')}`;
    const found = await prisma.problem.findFirst({
      where: { conceptLessonId: lesson.id, source },
      select: { id: true },
    });
    if (found) {
      ids.push(found.id);
      reused++;
      continue;
    }

    const seed = makeSeed(chapter, slot);
    validateSeed(chapter, seed, slot);
    const diff = difficultyForSlot(slot);
    const steps = buildSteps(chapter, seed, slot);

    if (dryRun) {
      ids.push(`dry-${chapter.chapterCode}-${slot + 1}`);
      created++;
      continue;
    }

    const problem = await prisma.problem.create({
      data: {
        source,
        unitId: lesson.unitId,
        ...(lesson.subUnitId ? { subUnitId: lesson.subUnitId } : {}),
        conceptLessonId: lesson.id,
        difficulty: diff.difficulty,
        difficultyLevel: diff.level,
        body: seed.body,
        formula: seed.formula,
        concept: seed.concept,
        answer: seed.answer,
        hint: seed.hint,
        requiredSkills: seed.requiredSkills,
        expectedSolutionSteps: { steps: seed.expectedSolutionSteps } as any,
        expectedTimeSec: 90 + diff.level * 45,
        steps: {
          create: steps.map((s) => ({
            stepIndex: s.stepIndex,
            stepType: s.stepType,
            prompt: s.prompt,
            choices: {
              create: s.choices.map((c, idx) => ({
                choiceIndex: idx + 1,
                text: c.text,
                isCorrect: c.isCorrect,
                ...(c.distractorType ? { distractorType: c.distractorType } : {}),
                ...(c.rationale ? { rationale: c.rationale } : {}),
              })),
            },
          })),
        },
      },
      select: { id: true },
    });
    ids.push(problem.id);
    created++;
  }

  if (ids.length !== TARGET) {
    throw new Error(`${chapter.chapterCode}: generated/reused ${ids.length}/${TARGET}`);
  }

  if (!dryRun) {
    await prisma.conceptLesson.update({
      where: { id: lesson.id },
      data: {
        masterySetProblemIds: ids,
        masterySetCuratedAt: new Date(),
      },
    });

    await prisma.lessonProblemSet.upsert({
      where: {
        country_chapterCode_setType_version: {
          country: 'IN',
          chapterCode: chapter.chapterCode,
          setType: SetType.MASTERY_3STEP,
          version: 1,
        },
      },
      update: {
        conceptLessonId: lesson.id,
        koreanConceptLessonId: null,
        problemIds: ids,
        status: SetStatus.READY,
        curatedAt: new Date(),
        retiredAt: null,
      },
      create: {
        country: 'IN',
        chapterCode: chapter.chapterCode,
        setType: SetType.MASTERY_3STEP,
        version: 1,
        conceptLessonId: lesson.id,
        problemIds: ids,
        status: SetStatus.READY,
        curatedAt: new Date(),
      },
    });
  }

  return { code: chapter.chapterCode, created, reused, status: 'READY' };
}

async function main() {
  const chapters = onlyCode
    ? NCERT_CHAPTERS.filter((c) => c.chapterCode === onlyCode)
    : NCERT_CHAPTERS;
  if (onlyCode && chapters.length === 0) throw new Error(`Unknown chapterCode: ${onlyCode}`);

  if (selfTest) {
    let checked = 0;
    const byKind = new Map<string, number>();
    for (const chapter of chapters) {
      const kind = kindFor(chapter);
      byKind.set(kind, (byKind.get(kind) ?? 0) + 1);
      for (let slot = 0; slot < TARGET; slot++) {
        validateSeed(chapter, makeSeed(chapter, slot), slot);
        checked++;
      }
    }
    console.log(`Self-test passed: ${checked} generated problem templates checked.`);
    console.log('Chapter kind distribution:');
    for (const [kind, count] of [...byKind.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
      console.log(`  ${kind.padEnd(20)} ${count}`);
    }
    return;
  }

  console.log(`India Mastery formula seed: chapters=${chapters.length} target=${TARGET} refresh=${refresh} dryRun=${dryRun}`);
  console.log(`source prefix: ${SOURCE_PREFIX}\n`);

  let totalCreated = 0;
  let totalReused = 0;
  let skipped = 0;

  for (const chapter of chapters) {
    const lesson = await prisma.conceptLesson.findUnique({
      where: { chapterCode: chapter.chapterCode },
      select: {
        id: true,
        unitId: true,
        subUnitId: true,
        chapterCode: true,
        ncertClass: true,
        chapterNumber: true,
        titleEn: true,
      },
    });
    if (!lesson) {
      skipped++;
      console.log(`[skip] ${chapter.chapterCode} no ConceptLesson`);
      continue;
    }
    const result = await ensureChapter(chapter, lesson);
    if (result.status !== 'READY') {
      skipped++;
      console.log(`[skip] ${result.code} ${result.status}`);
      continue;
    }
    totalCreated += result.created;
    totalReused += result.reused;
    console.log(`[ready] ${result.code} created=${result.created} reused=${result.reused}`);
  }

  console.log('');
  console.log(`Done. created=${totalCreated} reused=${totalReused} skipped=${skipped}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
