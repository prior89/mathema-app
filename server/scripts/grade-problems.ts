/**
 * grade-problems.ts — Tier 2 quality grading via Gemini 3.1 Pro.
 *
 * Calls the model once per Problem with a 5-axis rubric (clarity, pedagogy,
 * distractorQuality, difficultyMatch, curriculumFit), parses the JSON
 * response, computes a weighted final score, and writes the result back
 * onto Problem.quality* columns.
 *
 * Usage:
 *   npx ts-node scripts/grade-problems.ts --dry-run                 # 5 random samples, no DB write
 *   npx ts-node scripts/grade-problems.ts --dry-run --limit 20      # 20 random, no DB write
 *   npx ts-node scripts/grade-problems.ts --apply                   # full sweep on all qualityScore IS NULL
 *   npx ts-node scripts/grade-problems.ts --apply --limit 100       # bounded sweep
 *   npx ts-node scripts/grade-problems.ts --apply --regrade         # ignore existing qualityScore, regrade all
 *
 * Reads GEMINI_API_KEY from process.env. Reads DATABASE_URL from .env per
 * Prisma's default loader.
 */
import { PrismaClient, QualityStatus } from '@prisma/client';
import * as fs from 'fs';

const PROMPT_VERSION = 'rubric-v1';
// 2026-05-23: swapped gemini-2.5-pro → gemini-3.5-flash. The 1301-remaining
// sweep hit 429 immediately on Pro (separate RPM bucket, 16-17x more $/token);
// Flash is on the same Tier 1 budget we already verified (₩54K of ₩150K used)
// and the rubric is a judgment task — model strength matters far less than for
// solving. The 888 already-graded rows stay on 2.5-pro; qualityModel column
// records which model judged each row so analytics can split if needed.
const MODEL_ID = 'gemini-3.5-flash';
const CONCURRENCY = 5;

const WEIGHTS = {
  clarity: 0.20,
  pedagogy: 0.25,
  distractorQuality: 0.15,
  difficultyMatch: 0.15,
  curriculumFit: 0.25,
};

const HARD_FLAGS = new Set([
  'CHAPTER_MISMATCH',
  'OUT_OF_CURRICULUM',
  'MULTIPLE_CORRECT_OPTIONS',
  'NO_CORRECT_OPTION',
  'MISSING_GIVEN',
  'MISSING_FIGURE',
  'LATEX_RENDERING_RISK',
]);

const RUBRIC_PROMPT = `You are a senior NCERT/CBSE/JEE math content auditor. Judge ONE problem on five axes (1-5 each) and emit a single JSON object.

Axes:

1) clarity — Is the statement, notation, and given data unambiguous?
   5 statement+notation+givens fully clear
   4 minor wording issue, no impact on solvability
   3 understandable but a symbol/phrasing is loose
   2 a given is missing or interpretation can split
   1 problem is ambiguous or unsolvable as stated
   reasonCodes (pick any that apply): CLEAR_STATEMENT, VALID_NOTATION, AMBIGUOUS_STATEMENT, MISSING_GIVEN, MISSING_FIGURE, LATEX_RENDERING_RISK
   Use MISSING_FIGURE when the body references a diagram/graph/figure that is not present in the text (e.g. "see the figure below", "in the diagram above"). Use MISSING_GIVEN when textual data (a number, a condition, a constraint) is missing instead.

2) pedagogy — Does solving it train the intended concept?
   5 trains the core skill, solution path is educational
   4 covers the target concept well
   3 solvable but learning value is thin
   2 trivial calculation or guessable
   1 reinforces a misconception or has no educational value
   reasonCodes: TARGETS_CORE_SKILL, REINFORCES_METHOD, GOOD_STEP_PROGRESSION, TOO_MECHANICAL, MISLEADING_PEDAGOGY

3) distractorQuality — MCQ wrong choices.
   5 distractors mirror real misconceptions/slips
   4 most are plausible
   3 only some are meaningful
   2 correct answer stands out trivially
   1 multiple correct, nonsense distractors, or correct missing
   reasonCodes: PLAUSIBLE_DISTRACTORS, MISCONCEPTION_BASED_DISTRACTORS, OBVIOUS_DISTRACTOR, MULTIPLE_CORRECT_OPTIONS, NO_CORRECT_OPTION
   If the problem has no choices (open-ended, not MCQ) set status="not_applicable", score=null, reasonCodes=["NOT_MCQ"].

4) difficultyMatch — Does the assigned difficulty fit the actual problem?
   5 exact match
   4 close
   3 slightly off
   2 noticeably mismatched
   1 wrong band entirely
   reasonCodes: MATCHES_ASSIGNED_DIFFICULTY, SLIGHTLY_TOO_EASY, SLIGHTLY_TOO_HARD, TOO_EASY, TOO_HARD

5) curriculumFit — Does it fit the assigned chapter and required skills under NCERT/CBSE/JEE conventions?
   5 chapter and skills both align
   4 chapter aligns, some skills missing
   3 adjacent chapter / nearby concept
   2 same class but wrong chapter
   1 class/chapter/skill mismatch
   reasonCodes: NCERT_ALIGNED, MATCHES_CHAPTER, MATCHES_REQUIRED_SKILLS, PARTIAL_SKILL_MISMATCH, CHAPTER_MISMATCH, OUT_OF_CURRICULUM

For each axis include ONE short comment in plain English (≤120 chars, no Korean, no LaTeX, no backticks, no backslashes). JSON escaping is unforgiving; if you would need to escape a character, paraphrase instead. Do not quote verbatim from the body.

Return ONLY this JSON shape (no markdown, no prose, no "evidence" field):

{
  "isMCQ": boolean,
  "summary": "<one line overall assessment, ≤160 chars>",
  "clarity":           { "score": 1-5, "reasonCodes": [...], "comment": "..." },
  "pedagogy":          { "score": 1-5, "reasonCodes": [...], "comment": "..." },
  "distractorQuality": { "score": 1-5 | null, "status": "scored" | "not_applicable", "reasonCodes": [...], "comment": "..." },
  "difficultyMatch":   { "score": 1-5, "reasonCodes": [...], "comment": "..." },
  "curriculumFit":     { "score": 1-5, "reasonCodes": [...], "comment": "..." }
}`;

type AxisResult = {
  score: number | null;
  status?: string;
  reasonCodes: string[];
  comment: string;
};
type Rubric = {
  isMCQ: boolean;
  summary: string;
  clarity: AxisResult;
  pedagogy: AxisResult;
  distractorQuality: AxisResult;
  difficultyMatch: AxisResult;
  curriculumFit: AxisResult;
};

// Gemini's response_schema follows OpenAPI 3 with a Proto-defined Type
// enum (STRING, NUMBER, INTEGER, BOOLEAN, ARRAY, OBJECT). Nullable scores
// use {type:"INTEGER", nullable:true} rather than ["integer","null"].
// Enforcing the schema is what guarantees the JSON parses cleanly even
// when the model wants to drop a stray quote in a comment.
function axisProps(nullableScore: boolean) {
  const score = nullableScore
    ? { type: 'INTEGER', nullable: true }
    : { type: 'INTEGER' };
  return {
    type: 'OBJECT',
    properties: {
      score,
      status: { type: 'STRING' },
      reasonCodes: { type: 'ARRAY', items: { type: 'STRING' } },
      comment: { type: 'STRING' },
    },
    required: ['score', 'reasonCodes', 'comment'],
  };
}
const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    isMCQ: { type: 'BOOLEAN' },
    summary: { type: 'STRING' },
    clarity: axisProps(false),
    pedagogy: axisProps(false),
    distractorQuality: axisProps(true),
    difficultyMatch: axisProps(false),
    curriculumFit: axisProps(false),
  },
  required: ['isMCQ', 'summary', 'clarity', 'pedagogy', 'distractorQuality', 'difficultyMatch', 'curriculumFit'],
};

function buildUserMessage(problem: {
  id: string;
  body: string;
  difficulty: string;
  difficultyLevel: number;
  requiredSkills: string[];
  isMCQ: boolean;
  choices: Array<{ choiceIndex: number; isCorrect: boolean; text: string; stepType: string }>;
  chapter: { ncertClass: string; chapterNumber: number; titleEn: string; chapterCode: string } | null;
}): string {
  const lines: string[] = [];
  lines.push(`## Problem to grade`);
  lines.push(`id: ${problem.id}`);
  if (problem.chapter) {
    lines.push(
      `chapter: ${problem.chapter.chapterCode} — ${problem.chapter.ncertClass} Ch ${problem.chapter.chapterNumber} "${problem.chapter.titleEn}"`,
    );
  } else {
    lines.push(`chapter: <unmapped>`);
  }
  lines.push(`assignedDifficulty: ${problem.difficulty} (level ${problem.difficultyLevel})`);
  lines.push(`requiredSkills: ${problem.requiredSkills.join(', ') || '<none>'}`);
  lines.push('');
  lines.push(`### body`);
  lines.push(problem.body);
  lines.push('');
  if (problem.isMCQ && problem.choices.length > 0) {
    lines.push(`### choices`);
    for (const c of problem.choices) {
      const marker = c.isCorrect ? '✓' : ' ';
      lines.push(`[${c.stepType}/${c.choiceIndex}] ${marker} ${c.text}`);
    }
  } else {
    lines.push(`### no choices (open-ended)`);
  }
  return lines.join('\n');
}

async function callGemini(apiKey: string, userMsg: string, attempt = 1): Promise<Rubric> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${apiKey}`;
  // On retry, push the model harder on the quoting rule that's responsible
  // for most JSON parse failures (unescaped " mid-comment).
  const retryAddendum =
    attempt > 1
      ? '\n\nIMPORTANT: Do not use the " character anywhere inside string values. Replace any quoted phrase with a paraphrase. Keep all comments simple ASCII without quotes, backslashes, or backticks.'
      : '';
  const body = {
    systemInstruction: { parts: [{ text: RUBRIC_PROMPT + retryAddendum }] },
    contents: [{ role: 'user', parts: [{ text: userMsg }] }],
    generationConfig: {
      temperature: attempt > 1 ? 0.2 : 0,
      // 8192 = headroom for problems whose rubric needs verbose reasonCodes
      // arrays + summaries. 2.5-pro hit MAX_TOKENS at 4096 on ~1% of problems.
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
      responseSchema: RESPONSE_SCHEMA,
      // Rubric grading is a judgement task — no extended reasoning needed.
      // Thinking-mode on 3.5-flash spent ~₩24K of an hour's sweep otherwise.
      thinkingConfig: { thinkingBudget: 0 },
    },
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Gemini ${res.status}: ${errText.slice(0, 200)}`);
  }
  const json: any = await res.json();
  const text: string = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  if (!text) {
    // Empty response — usually safety filter trip or transient model hiccup.
    // Retry once with the more conservative addendum already in place.
    if (attempt < 2) return callGemini(apiKey, userMsg, attempt + 1);
    const finishReason = json?.candidates?.[0]?.finishReason ?? 'unknown';
    throw new Error(`empty model response after retry (finishReason=${finishReason})`);
  }
  // Sanitize: strip raw control chars (0x00-0x1F except \n \r \t which JSON allows
  // when properly escaped) and try to salvage common LaTeX backslash issues in
  // evidence strings.
  const cleaned = text
    .replace(/[ --]/g, '')
    .replace(/\\(?!["\\/bfnrtu])/g, '\\\\');
  try {
    return JSON.parse(cleaned) as Rubric;
  } catch (e) {
    if (attempt < 2) {
      return callGemini(apiKey, userMsg, attempt + 1);
    }
    throw new Error(`JSON parse failed after retry: ${(e as Error).message}. First 300 chars: ${cleaned.slice(0, 300)}`);
  }
}

function computeFinalScore(r: Rubric): number {
  const W = WEIGHTS;
  const isScoredMCQ = r.isMCQ && r.distractorQuality.score !== null && r.distractorQuality.score !== undefined;
  if (isScoredMCQ) {
    return (
      r.clarity.score! * W.clarity +
      r.pedagogy.score! * W.pedagogy +
      r.distractorQuality.score! * W.distractorQuality +
      r.difficultyMatch.score! * W.difficultyMatch +
      r.curriculumFit.score! * W.curriculumFit
    );
  }
  const activeSum = W.clarity + W.pedagogy + W.difficultyMatch + W.curriculumFit; // 0.85
  return (
    (r.clarity.score! * W.clarity +
      r.pedagogy.score! * W.pedagogy +
      r.difficultyMatch.score! * W.difficultyMatch +
      r.curriculumFit.score! * W.curriculumFit) /
    activeSum
  );
}

function collectCriticalFlags(r: Rubric): string[] {
  const all = [
    ...r.clarity.reasonCodes,
    ...r.pedagogy.reasonCodes,
    ...r.distractorQuality.reasonCodes,
    ...r.difficultyMatch.reasonCodes,
    ...r.curriculumFit.reasonCodes,
  ];
  return [...new Set(all.filter((c) => HARD_FLAGS.has(c)))];
}

function decideStatus(finalScore: number, criticalFlags: string[]): QualityStatus {
  if (criticalFlags.length > 0) return 'EXCLUDED';
  if (finalScore >= 4.2) return 'APPROVED';
  if (finalScore >= 3.5) return 'USABLE';
  return 'EXCLUDED';
}

async function processOne(
  prisma: PrismaClient,
  apiKey: string,
  problem: any,
  apply: boolean,
): Promise<{ id: string; finalScore: number; status: QualityStatus; flags: string[]; rubric: Rubric }> {
  const choices = problem.steps.flatMap((s: any) =>
    s.choices.map((c: any) => ({
      choiceIndex: c.choiceIndex,
      isCorrect: c.isCorrect,
      text: c.text,
      stepType: s.stepType,
    })),
  );
  const isMCQ = choices.length > 0;
  const chapter = problem.conceptLesson
    ? {
        ncertClass: problem.conceptLesson.ncertClass,
        chapterNumber: problem.conceptLesson.chapterNumber,
        titleEn: problem.conceptLesson.titleEn,
        chapterCode: problem.conceptLesson.chapterCode,
      }
    : null;
  const userMsg = buildUserMessage({
    id: problem.id,
    body: problem.body,
    difficulty: problem.difficulty,
    difficultyLevel: problem.difficultyLevel,
    requiredSkills: problem.requiredSkills,
    isMCQ,
    choices,
    chapter,
  });

  const rubric = await callGemini(apiKey, userMsg);
  const finalScore = computeFinalScore(rubric);
  const flags = collectCriticalFlags(rubric);
  const status = decideStatus(finalScore, flags);
  const conceptMismatch =
    flags.includes('CHAPTER_MISMATCH') || flags.includes('OUT_OF_CURRICULUM');

  if (apply) {
    await prisma.problem.update({
      where: { id: problem.id },
      data: {
        qualityScore: Number(finalScore.toFixed(3)),
        qualityRubric: rubric as any,
        qualityStatus: status,
        qualityModel: MODEL_ID,
        qualityPromptVersion: PROMPT_VERSION,
        qualityScoredAt: new Date(),
        qualityCriticalFlags: flags,
        conceptMismatch,
      },
    });
  }

  return { id: problem.id, finalScore, status, flags, rubric };
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const apply = args.includes('--apply');
  const regrade = args.includes('--regrade');
  const limitIdx = args.indexOf('--limit');
  const limit = limitIdx >= 0 ? Number(args[limitIdx + 1]) : dryRun ? 5 : Number.POSITIVE_INFINITY;

  if (!dryRun && !apply) {
    console.error('Must pass --dry-run or --apply.');
    process.exit(2);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY not set in env.');
    process.exit(2);
  }

  // Optional: --db-url-file <path> overrides DATABASE_URL from a one-line
  // text file. Used to target prod without editing server/.env, so the
  // prod URL never lands in a tracked file. Per
  // [[feedback_prisma_dotenv_override]] Prisma's .env loader uses
  // override:true, so we pass the URL directly via PrismaClient's
  // datasources arg instead of trying to set process.env.
  const dbUrlFileIdx = args.indexOf('--db-url-file');
  const dbUrlFile = dbUrlFileIdx >= 0 ? args[dbUrlFileIdx + 1] : null;
  const dbUrlOverride = dbUrlFile ? fs.readFileSync(dbUrlFile, 'utf8').trim() : null;
  if (dbUrlOverride) {
    const masked = dbUrlOverride.replace(/(postgres[a-z]*:\/\/[^:]+:)[^@]+(@.*)/, '$1***$2');
    console.log(`DB target: ${masked}`);
  }
  const prisma = dbUrlOverride
    ? new PrismaClient({ datasources: { db: { url: dbUrlOverride } } })
    : new PrismaClient();
  const where = regrade ? {} : { qualityScore: null };
  const take = Number.isFinite(limit) ? limit : undefined;
  const random = args.includes('--random');

  // For dry-run sampling we prefer random ordering so calibration sees
  // varied content. For the full sweep we want a deterministic order
  // (id asc) so progress + resumability are predictable.
  let problemIds: string[] | undefined;
  if (random) {
    const rows = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
      `SELECT id FROM "Problem" ${regrade ? '' : 'WHERE "qualityScore" IS NULL'} ORDER BY random() LIMIT ${take ?? 50}`,
    );
    problemIds = rows.map((r) => r.id);
  }

  const problems = await prisma.problem.findMany({
    where: problemIds ? { id: { in: problemIds } } : where,
    orderBy: problemIds ? undefined : { id: 'asc' as const },
    take: problemIds ? undefined : take,
    include: {
      conceptLesson: {
        select: { ncertClass: true, chapterNumber: true, titleEn: true, chapterCode: true },
      },
      steps: {
        orderBy: { stepIndex: 'asc' },
        select: {
          stepIndex: true,
          stepType: true,
          choices: {
            orderBy: { choiceIndex: 'asc' },
            select: { choiceIndex: true, isCorrect: true, text: true },
          },
        },
      },
    },
  });
  console.log(`Mode: ${dryRun ? 'DRY-RUN' : 'APPLY'}  count=${problems.length}  model=${MODEL_ID}  prompt=${PROMPT_VERSION}`);

  let done = 0;
  let approved = 0, usable = 0, excluded = 0, failed = 0;
  for (let i = 0; i < problems.length; i += CONCURRENCY) {
    const slice = problems.slice(i, i + CONCURRENCY);
    const results = await Promise.allSettled(slice.map((p) => processOne(prisma, apiKey, p, apply && !dryRun)));
    for (let j = 0; j < results.length; j++) {
      const r = results[j];
      const id = slice[j].id;
      done++;
      if (r.status === 'rejected') {
        failed++;
        console.error(`[${done}/${problems.length}] ${id} FAILED: ${(r.reason as Error).message}`);
        continue;
      }
      const v = r.value;
      if (v.status === 'APPROVED') approved++;
      else if (v.status === 'USABLE') usable++;
      else excluded++;
      if (dryRun || done <= 10) {
        console.log(
          `[${done}/${problems.length}] ${id}  score=${v.finalScore.toFixed(2)}  status=${v.status}  flags=[${v.flags.join(',')}]`,
        );
        if (dryRun) {
          console.log(`  summary: ${v.rubric.summary}`);
          console.log(`  axes: clarity=${v.rubric.clarity.score} pedagogy=${v.rubric.pedagogy.score} distractor=${v.rubric.distractorQuality.score} difficulty=${v.rubric.difficultyMatch.score} curriculum=${v.rubric.curriculumFit.score}`);
        }
      } else if (done % 25 === 0) {
        console.log(`[${done}/${problems.length}] approved=${approved} usable=${usable} excluded=${excluded} failed=${failed}`);
      }
    }
  }

  console.log(``);
  console.log(`Done. approved=${approved} usable=${usable} excluded=${excluded} failed=${failed} total=${done}`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
