/* Seed Problems from extracted NCERT data.
 *
 * Conversion policy (deterministic — no LLM):
 *  problem.body  = the original NCERT problem (cleaned up)
 *  problem.unitId/subUnitId/conceptLessonId = mapped via ConceptLesson(class, chapter)
 *  3-step MC:
 *    1) CONCEPT — "Which concept area does this problem belong to?" (correct = current chapter
 *                  titleEn, distractors = 4 other chapters from the same class)
 *    2) PROCESS — 5-choice standard solution procedure based on the chapter category
 *    3) ANSWER  — 5-choice NCERT answer-verification self-report
 *
 * Even distribution: up to N problems per chapter (PER_CHAPTER). Class 9 gets 0 because the
 * PDFs are missing.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { PrismaClient, Difficulty } from '@prisma/client';

const prisma = new PrismaClient();
const PROBLEMS_PATH = path.join(__dirname, 'problems.json');
const PER_CHAPTER = 8;

type RawProblem = { cls: string; chapter: number; exercise: string; idx: number; text: string };

// ---- chapter category — used to classify the Step 2 PROCESS solution procedure ----
type Category = 'arithmetic' | 'algebra' | 'geometry' | 'trig' | 'calculus' | 'probability' | 'sets_functions' | 'linear_algebra' | 'mensuration' | 'statistics' | 'data_handling';

function categoryFor(titleEn: string): Category {
  const t = titleEn.toLowerCase();
  if (/integral|differen|derivativ|continuity|limit/.test(t)) return 'calculus';
  if (/matrix|matrices|determin|vector|three[ -]dimensional|linear program/.test(t)) return 'linear_algebra';
  if (/trigon|inverse trig/.test(t)) return 'trig';
  if (/probab/.test(t)) return 'probability';
  if (/statist|data handling/.test(t)) return 'statistics';
  if (/triangle|circle|quadrilat|polygon|euclid|geometr|line|angle|conic|symmetr|visualis/.test(t)) return 'geometry';
  if (/mensuration|surface|volume|area|perimeter/.test(t)) return 'mensuration';
  if (/equation|polynomial|expression|identit|factor|exponen|square|cube|progression|sequence|binomial|complex|inequa|permutation|combination|relation|function|set/.test(t)) return 'algebra';
  if (/integer|fraction|decimal|rational|real number|proportion|compar/.test(t)) return 'arithmetic';
  return 'algebra';
}

// ---- Step 2 PROCESS — correct answer + 4 distractors per category ----
type ProcSpec = { prompt: string; correct: string; distractors: Array<{ text: string; type: 'CONCEPT_CONFUSION' | 'CALC_ERROR' | 'PROCESS_SKIP' | 'TIME_PRESSURE_GUESS'; rationale: string }> };

const PROCESS_BY_CAT: Record<Category, ProcSpec> = {
  arithmetic: {
    prompt: 'Which procedure best fits this arithmetic problem?',
    correct: 'Apply place-value/operation rules step by step, then simplify',
    distractors: [
      { text: 'Apply geometric construction with compass and ruler', type: 'CONCEPT_CONFUSION', rationale: 'Tried to solve an arithmetic problem by construction' },
      { text: 'Differentiate w.r.t. x and find critical points', type: 'CONCEPT_CONFUSION', rationale: 'Mistook for a calculus procedure' },
      { text: 'Set up a probability tree and apply addition rule', type: 'CONCEPT_CONFUSION', rationale: 'Mistook for a probability procedure' },
      { text: 'Substitute a value without checking sign of operation', type: 'PROCESS_SKIP', rationale: 'Skipped a procedural step (sign check)' },
    ],
  },
  algebra: {
    prompt: 'Which procedure is the right first move?',
    correct: 'Identify the structure, manipulate algebraically (factor / substitute), then solve',
    distractors: [
      { text: 'Compute the area via integration', type: 'CONCEPT_CONFUSION', rationale: 'Mistook for an integration procedure' },
      { text: 'Use a coordinate axis to plot every term and read intersections', type: 'PROCESS_SKIP', rationale: 'Skipped the algebraic manipulation step (graphical estimation)' },
      { text: 'Apply Pythagoras theorem on the variables', type: 'CONCEPT_CONFUSION', rationale: 'Misapplied a geometric theorem' },
      { text: 'Take the mean of the coefficients', type: 'CALC_ERROR', rationale: 'Misapplied a statistical procedure' },
    ],
  },
  geometry: {
    prompt: 'Which procedure is the geometric approach?',
    correct: 'Identify the figure, apply the relevant theorem (Pythagoras / congruence / similarity), then conclude',
    distractors: [
      { text: 'Treat the figure as an equation in x and y and solve simultaneously', type: 'CONCEPT_CONFUSION', rationale: 'Wrongly tried to reduce a geometry problem to algebra' },
      { text: 'Compute the derivative of the perimeter', type: 'CONCEPT_CONFUSION', rationale: 'Detoured through calculus' },
      { text: 'Use probability of intersection of segments', type: 'CONCEPT_CONFUSION', rationale: 'Mistook for a probability question' },
      { text: 'Skip naming the figure and guess from a diagram', type: 'PROCESS_SKIP', rationale: 'Skipped the figure-identification step' },
    ],
  },
  trig: {
    prompt: 'Which procedure suits a trigonometric problem?',
    correct: 'Pick an identity (Pythagorean / sum-difference / double angle), substitute and simplify',
    distractors: [
      { text: 'Differentiate sin and cos with respect to time', type: 'CONCEPT_CONFUSION', rationale: 'Mistook for a differentiation / phase question' },
      { text: 'Apply Heron’s formula for area', type: 'CONCEPT_CONFUSION', rationale: 'Confused trigonometry with Heron’s formula' },
      { text: 'Set up a probability sample space of angles', type: 'CONCEPT_CONFUSION', rationale: 'Mistook for a probability procedure' },
      { text: 'Use only degrees regardless of context', type: 'PROCESS_SKIP', rationale: 'Skipped the unit conversion (radians) step' },
    ],
  },
  calculus: {
    prompt: 'Which procedure is correct here?',
    correct: 'Recognise the form (limit / derivative / integral), choose technique (substitution / by-parts / chain rule), evaluate',
    distractors: [
      { text: 'Treat the integrand as a constant and multiply by the interval', type: 'PROCESS_SKIP', rationale: 'Skipped the integration step' },
      { text: 'Apply Pythagoras between f(x) and x', type: 'CONCEPT_CONFUSION', rationale: 'Detoured through algebra / geometry' },
      { text: 'Set up a probability density and find P(X=a)', type: 'CONCEPT_CONFUSION', rationale: 'Mistook for a probability density' },
      { text: 'Square both sides and rearrange', type: 'CONCEPT_CONFUSION', rationale: 'Detoured through equation solving' },
    ],
  },
  probability: {
    prompt: 'Which procedure fits a probability problem?',
    correct: 'List the sample space, count favourable outcomes, apply P = favourable / total',
    distractors: [
      { text: 'Differentiate w.r.t. the random variable', type: 'CONCEPT_CONFUSION', rationale: 'Detoured through differentiation' },
      { text: 'Apply Pythagoras to outcomes', type: 'CONCEPT_CONFUSION', rationale: 'Misapplied a geometric theorem' },
      { text: 'Pick the mode of the listed outcomes', type: 'CALC_ERROR', rationale: 'Wrongly reduced to a statistical measure' },
      { text: 'Add the probabilities of disjoint events ignoring the total', type: 'PROCESS_SKIP', rationale: 'Skipped the denominator (total) step' },
    ],
  },
  sets_functions: {
    prompt: 'Which procedure is correct?',
    correct: 'Specify the set/function, use definitions (subset / image / inverse), apply operations',
    distractors: [
      { text: 'Differentiate the indicator function', type: 'CONCEPT_CONFUSION', rationale: 'Detoured the set/function definition through calculus' },
      { text: 'Compute Pythagorean distance between elements', type: 'CONCEPT_CONFUSION', rationale: 'Misapplied a geometric theorem' },
      { text: 'Take probability of a random element', type: 'CONCEPT_CONFUSION', rationale: 'Mistook for a probability procedure' },
      { text: 'Skip checking domain/codomain before mapping', type: 'PROCESS_SKIP', rationale: 'Skipped the domain/codomain check' },
    ],
  },
  linear_algebra: {
    prompt: 'Which procedure suits the matrix / vector setup?',
    correct: 'Form the matrix/vector, apply the right operation (determinant / row ops / dot product), conclude',
    distractors: [
      { text: 'Differentiate each entry', type: 'CONCEPT_CONFUSION', rationale: 'Mistook for a calculus procedure' },
      { text: 'Apply Pythagoras between rows', type: 'CONCEPT_CONFUSION', rationale: 'Misapplied a geometric theorem' },
      { text: 'Compute the mean of all entries', type: 'CALC_ERROR', rationale: 'Reduced to a statistical measure' },
      { text: 'Transpose and re-multiply without checking dimensions', type: 'PROCESS_SKIP', rationale: 'Skipped the dimension check' },
    ],
  },
  mensuration: {
    prompt: 'Which procedure measures the figure correctly?',
    correct: 'Identify the shape, pick the area/perimeter/volume formula, substitute given dimensions',
    distractors: [
      { text: 'Differentiate the area formula', type: 'CONCEPT_CONFUSION', rationale: 'Detoured through differentiation' },
      { text: 'Use probability of points lying inside', type: 'CONCEPT_CONFUSION', rationale: 'Mistook for a probability procedure' },
      { text: 'Square the perimeter to get the area', type: 'CALC_ERROR', rationale: 'Confused formulas' },
      { text: 'Skip unit conversion before substituting', type: 'PROCESS_SKIP', rationale: 'Skipped the unit conversion step' },
    ],
  },
  statistics: {
    prompt: 'Which procedure handles the statistical question?',
    correct: 'Tabulate data, choose the right measure (mean / median / mode / sd), compute',
    distractors: [
      { text: 'Differentiate the frequency function', type: 'CONCEPT_CONFUSION', rationale: 'Mistook for a differentiation procedure' },
      { text: 'Apply Pythagoras across class intervals', type: 'CONCEPT_CONFUSION', rationale: 'Misapplied a geometric theorem' },
      { text: 'Treat every value as equally probable without weighting frequencies', type: 'PROCESS_SKIP', rationale: 'Ignored frequency (weighting)' },
      { text: 'Add all class marks and divide by 2', type: 'CALC_ERROR', rationale: 'Confused the mean formula' },
    ],
  },
  data_handling: {
    prompt: 'Which procedure organises the data correctly?',
    correct: 'Read the chart/table carefully, identify the right quantity, then compute or compare',
    distractors: [
      { text: 'Differentiate the bar height', type: 'CONCEPT_CONFUSION', rationale: 'Mistook a data visual for a calculus question' },
      { text: 'Apply Pythagoras between bars', type: 'CONCEPT_CONFUSION', rationale: 'Misapplied a geometric theorem' },
      { text: 'Pick the tallest bar as the answer regardless of question', type: 'TIME_PRESSURE_GUESS', rationale: 'Time-pressure guess' },
      { text: 'Skip reading the legend / units', type: 'PROCESS_SKIP', rationale: 'Skipped reading the legend / units' },
    ],
  },
};

// ---- Step 3 ANSWER — NCERT self-check, 5 choices ----
const ANSWER_SPEC = {
  prompt: 'After working on paper and comparing with the NCERT solution, mark how this went:',
  correct: 'Reached the same answer on the first attempt',
  distractors: [
    { text: 'Reached the same answer after re-checking my working', type: 'TIME_PRESSURE_GUESS' as const, rationale: 'First-pass slip under time pressure or inattention' },
    { text: 'Approach was right but I made a calculation slip', type: 'CALC_ERROR' as const, rationale: 'Calculation step slip' },
    { text: 'Missed a step in the procedure', type: 'PROCESS_SKIP' as const, rationale: 'Skipped a procedural step' },
    { text: 'I picked the wrong concept and went the wrong way', type: 'CONCEPT_CONFUSION' as const, rationale: 'Concept misunderstanding' },
  ],
};

// Difficulty estimate — higher exercise sub-numbers are slightly harder, regardless of category.
function difficultyFor(exercise: string): { diff: Difficulty; level: number } {
  const minor = parseInt(exercise.split('.')[1] || '1', 10);
  if (minor >= 4) return { diff: 'KILLER', level: 5 };
  if (minor === 3) return { diff: 'SEMI_KILLER', level: 4 };
  if (minor === 2) return { diff: 'UPPER_MIDDLE', level: 3 };
  return { diff: 'MIDDLE', level: 2 };
}

// Pick 4 other chapter titles from the same class for use as CONCEPT step distractors.
function pickConceptDistractors(myTitle: string, sameClassTitles: string[]): string[] {
  const others = sameClassTitles.filter((t) => t !== myTitle);
  // shuffle deterministically (Fisher-Yates with seeded RNG)
  const shuffled = [...others];
  let seed = myTitle.length * 31;
  for (let i = shuffled.length - 1; i > 0; i--) {
    seed = (seed * 9301 + 49297) % 233280;
    const j = Math.floor((seed / 233280) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, 4);
}

async function main() {
  const raw: RawProblem[] = JSON.parse(fs.readFileSync(PROBLEMS_PATH, 'utf8'));
  console.log(`📥 ${raw.length} extracted problems`);

  // Group raw by (class, chapter)
  const byKey = new Map<string, RawProblem[]>();
  for (const r of raw) {
    const k = `${r.cls}__${r.chapter}`;
    if (!byKey.has(k)) byKey.set(k, []);
    byKey.get(k)!.push(r);
  }

  // Fetch all ConceptLessons (we'll pair to raw groups)
  const lessons = await prisma.conceptLesson.findMany({
    select: { id: true, ncertClass: true, chapterNumber: true, titleEn: true, unitId: true, subUnitId: true },
  });
  console.log(`📘 ${lessons.length} ConceptLessons`);

  // Lookup all titles per class for CONCEPT distractors
  const titlesByClass = new Map<string, string[]>();
  for (const l of lessons) {
    const k = l.ncertClass;
    if (!titlesByClass.has(k)) titlesByClass.set(k, []);
    titlesByClass.get(k)!.push(l.titleEn);
  }

  // ---- WIPE existing 'NCERT-PDF' sourced problems for re-runnability ----
  const SOURCE_PREFIX = 'NCERT PDF';
  const wipe = await prisma.problem.deleteMany({ where: { source: { startsWith: SOURCE_PREFIX } } });
  console.log(`🧹 cleared ${wipe.count} prior NCERT-PDF problems`);

  let createdProblems = 0;
  let skippedNoLesson = 0;
  let skippedNoRaw = 0;

  for (const lesson of lessons) {
    const key = `${lesson.ncertClass}__${lesson.chapterNumber}`;
    const pool = byKey.get(key) ?? [];
    if (pool.length === 0) {
      skippedNoRaw++;
      continue;
    }

    const category = categoryFor(lesson.titleEn);
    const sameClassTitles = titlesByClass.get(lesson.ncertClass) || [];
    const procSpec = PROCESS_BY_CAT[category];

    // pick first PER_CHAPTER problems (already roughly ordered by exercise number)
    const sample = pool.slice(0, PER_CHAPTER);

    for (const r of sample) {
      const { diff, level } = difficultyFor(r.exercise);
      const source = `${SOURCE_PREFIX} · ${lesson.ncertClass} · Ch${lesson.chapterNumber} ${lesson.titleEn} · Ex${r.exercise} · Q${r.idx}`;

      // Build CONCEPT choices
      const conceptDistractors = pickConceptDistractors(lesson.titleEn, sameClassTitles);
      const conceptChoices = [
        { text: lesson.titleEn, isCorrect: true, distractorType: null as any, rationale: null as any },
        ...conceptDistractors.map((t) => ({
          text: t, isCorrect: false, distractorType: 'CONCEPT_CONFUSION' as const, rationale: `May have classified this under a different chapter (${t})`,
        })),
      ];
      // simple shuffle (seeded) — keeps Q->step stable across reruns
      let seed = (source.length * 17) % 1000;
      const shuffleConcept = [...conceptChoices];
      for (let i = shuffleConcept.length - 1; i > 0; i--) {
        seed = (seed * 9301 + 49297) % 233280;
        const j = Math.floor((seed / 233280) * (i + 1));
        [shuffleConcept[i], shuffleConcept[j]] = [shuffleConcept[j], shuffleConcept[i]];
      }

      // Build PROCESS choices
      const processChoices = [
        { text: procSpec.correct, isCorrect: true, distractorType: null as any, rationale: null as any },
        ...procSpec.distractors.map((d) => ({ text: d.text, isCorrect: false, distractorType: d.type, rationale: d.rationale })),
      ];
      const shuffleProcess = [...processChoices];
      seed = (source.length * 23) % 1000;
      for (let i = shuffleProcess.length - 1; i > 0; i--) {
        seed = (seed * 9301 + 49297) % 233280;
        const j = Math.floor((seed / 233280) * (i + 1));
        [shuffleProcess[i], shuffleProcess[j]] = [shuffleProcess[j], shuffleProcess[i]];
      }

      // Build ANSWER choices
      const answerChoices = [
        { text: ANSWER_SPEC.correct, isCorrect: true, distractorType: null as any, rationale: null as any },
        ...ANSWER_SPEC.distractors.map((d) => ({ text: d.text, isCorrect: false, distractorType: d.type, rationale: d.rationale })),
      ];
      // do not shuffle — order is self-report scale and is meaningful

      const problem = await prisma.problem.create({
        data: {
          source,
          unitId: lesson.unitId!,
          subUnitId: lesson.subUnitId,
          conceptLessonId: lesson.id,
          difficulty: diff,
          difficultyLevel: level,
          body: r.text,
          answer: 'See NCERT solution',
          concept: `Concept area: ${lesson.titleEn}`,
          hint: `Read the problem carefully, identify what's given, decide which definition / theorem / formula from "${lesson.titleEn}" applies, then work step by step.`,
          expectedTimeSec: 90 + level * 60,
          steps: {
            create: [
              {
                stepIndex: 1, stepType: 'CONCEPT',
                prompt: `Which concept area does this problem belong to?`,
                choices: { create: shuffleConcept.map((c, i) => ({ choiceIndex: i + 1, text: c.text, isCorrect: c.isCorrect, distractorType: c.distractorType, rationale: c.rationale })) },
              },
              {
                stepIndex: 2, stepType: 'PROCESS',
                prompt: procSpec.prompt,
                choices: { create: shuffleProcess.map((c, i) => ({ choiceIndex: i + 1, text: c.text, isCorrect: c.isCorrect, distractorType: c.distractorType, rationale: c.rationale })) },
              },
              {
                stepIndex: 3, stepType: 'ANSWER',
                prompt: ANSWER_SPEC.prompt,
                choices: { create: answerChoices.map((c, i) => ({ choiceIndex: i + 1, text: c.text, isCorrect: c.isCorrect, distractorType: c.distractorType, rationale: c.rationale })) },
              },
            ],
          },
        },
        select: { id: true },
      });
      createdProblems++;
    }
  }

  console.log(`\n✅ created ${createdProblems} new Problems (with 3 steps · ~5 choices each)`);
  if (skippedNoRaw > 0) console.log(`   ${skippedNoRaw} lessons had no extracted problems (likely CLASS_9 — missing from the PDFs)`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
