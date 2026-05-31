/**
 * reclassify-chapter-mismatch.ts
 *
 * Recovers Problem rows flagged with CHAPTER_MISMATCH by asking gemini-2.5-flash
 * to map them to their true ConceptLesson based on the body + the rubric's own
 * curriculumFit.comment (the judge already wrote the target chapter in plain
 * English, we just need to bind it to a chapterCode).
 *
 * Each successfully re-classified row:
 *   1) conceptLessonId      → new chapter's id
 *   2) qualityCriticalFlags → CHAPTER_MISMATCH stripped
 *   3) qualityRubric.curriculumFit → score bumped to 5, reasonCodes cleaned, comment annotated
 *   4) qualityScore         → recomputed (curriculumFit weight 0.25 swings the total notably)
 *   5) qualityStatus        → recomputed (often flips EXCLUDED → APPROVED/USABLE)
 *
 * Usage:
 *   npx ts-node scripts/reclassify-chapter-mismatch.ts --dry-run            # all 511, no DB write
 *   npx ts-node scripts/reclassify-chapter-mismatch.ts --dry-run --limit 20
 *   npx ts-node scripts/reclassify-chapter-mismatch.ts --apply
 *
 * Cost: ~511 × $0.001 (gemini-2.5-flash thinking off) ≈ ₩700.
 */

import { PrismaClient, NcertClass, QualityStatus } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const MODEL_ID = 'gemini-2.5-flash';
// Bumped 5 → 20 for "all grades in parallel" — Gemini 2.5 Flash Tier 1 RPM
// is 1000+/min so 20 concurrent calls × ~1.5s each (~800 RPM) stays well
// under the limit. Set CONCURRENCY env var to override per-run.
const CONCURRENCY = Number(process.env.CONCURRENCY ?? 20);
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

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const apply = args.includes('--apply');
if (!dryRun && !apply) {
  console.error('Must pass --dry-run or --apply.');
  process.exit(2);
}
const limitIdx = args.indexOf('--limit');
const limit = limitIdx >= 0 ? Number(args[limitIdx + 1]) : null;

const CLASS_FROM_SOURCE = /Class\s*(\d+)/i;
function classFromSource(source: string | null): NcertClass | null {
  if (!source) return null;
  const m = source.match(CLASS_FROM_SOURCE);
  if (!m) return null;
  const n = Number(m[1]);
  if (n >= 7 && n <= 12) return `CLASS_${n}` as NcertClass;
  return null;
}

type ChapterRef = { id: string; chapterCode: string; titleEn: string };

function buildPrompt(problem: { body: string; answer: string; rubricHint: string | null; currentTitle: string | null }, available: ChapterRef[]): string {
  const choices = available
    .map((c, i) => `${i + 1}. ${c.chapterCode}  ${c.titleEn}`)
    .join('\n');
  const hintLine = problem.rubricHint
    ? `\nWhat the previous reviewer wrote about the chapter mismatch:\n"${problem.rubricHint}"\n`
    : '';
  return `You are mapping a Class-level math problem to its true NCERT chapter.

Problem body:
${problem.body.slice(0, 800)}

Problem answer: ${problem.answer}

Currently assigned to: ${problem.currentTitle ?? '(none)'}
${hintLine}
Available chapters (use chapterCode exactly):
${choices}

Pick the single chapter that best matches the problem's actual mathematical content. If none of the listed chapters is appropriate (the problem is genuinely out of curriculum), return chapterCode "NONE".

Return ONLY this JSON object, no surrounding prose:
{ "chapterCode": "<exact code from list, or NONE>", "confidence": <number 0..1>, "reason": "<one short sentence>" }`;
}

type LlmResult = { chapterCode: string; confidence: number; reason: string };

async function callGemini(apiKey: string, prompt: string, attempt = 1): Promise<LlmResult> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${apiKey}`;
  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: attempt > 1 ? 0.2 : 0,
      maxOutputTokens: 512,
      responseMimeType: 'application/json',
      thinkingConfig: { thinkingBudget: 0 },
    },
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`Gemini ${res.status}: ${t.slice(0, 200)}`);
  }
  const json: any = await res.json();
  const text: string = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  if (!text) {
    if (attempt < 2) return callGemini(apiKey, prompt, attempt + 1);
    throw new Error('empty model response');
  }
  try {
    return JSON.parse(text) as LlmResult;
  } catch (e) {
    if (attempt < 2) return callGemini(apiKey, prompt, attempt + 1);
    throw new Error(`parse failed: ${text.slice(0, 200)}`);
  }
}

function computeFinalScore(r: any): number {
  const W = WEIGHTS;
  const isScoredMCQ = r.isMCQ && r.distractorQuality?.score !== null && r.distractorQuality?.score !== undefined;
  if (isScoredMCQ) {
    return (
      r.clarity.score * W.clarity +
      r.pedagogy.score * W.pedagogy +
      r.distractorQuality.score * W.distractorQuality +
      r.difficultyMatch.score * W.difficultyMatch +
      r.curriculumFit.score * W.curriculumFit
    );
  }
  const activeSum = W.clarity + W.pedagogy + W.difficultyMatch + W.curriculumFit;
  return (
    (r.clarity.score * W.clarity +
      r.pedagogy.score * W.pedagogy +
      r.difficultyMatch.score * W.difficultyMatch +
      r.curriculumFit.score * W.curriculumFit) /
    activeSum
  );
}

function collectCriticalFlags(r: any): string[] {
  const all = [
    ...(r.clarity?.reasonCodes ?? []),
    ...(r.pedagogy?.reasonCodes ?? []),
    ...(r.distractorQuality?.reasonCodes ?? []),
    ...(r.difficultyMatch?.reasonCodes ?? []),
    ...(r.curriculumFit?.reasonCodes ?? []),
  ];
  return [...new Set(all.filter((c: string) => HARD_FLAGS.has(c)))];
}

function decideStatus(finalScore: number, criticalFlags: string[]): QualityStatus {
  if (criticalFlags.length > 0) return 'EXCLUDED';
  if (finalScore >= 4.2) return 'APPROVED';
  if (finalScore >= 3.5) return 'USABLE';
  return 'EXCLUDED';
}

async function main() {
  const url = fs.readFileSync(
    path.join('C:', 'Users', 'User', 'prod-db-url.txt'),
    'utf8',
  ).trim();
  const p = new PrismaClient({ datasources: { db: { url } } });
  const apiKey = process.env.GEMINI_API_KEY ?? require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') }).parsed?.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY missing.');
    process.exit(2);
  }

  console.log(`DB: ${url.replace(/:[^@]+@/, ':***@')}`);
  console.log(`Mode: ${dryRun ? 'DRY-RUN' : 'APPLY'}  model=${MODEL_ID}  concurrency=${CONCURRENCY}\n`);

  // Cache available chapters per class
  const chaptersByClass = new Map<NcertClass, ChapterRef[]>();
  for (const cls of ['CLASS_7', 'CLASS_8', 'CLASS_9', 'CLASS_10', 'CLASS_11', 'CLASS_12'] as NcertClass[]) {
    const rows = await p.conceptLesson.findMany({
      where: { ncertClass: cls },
      select: { id: true, chapterCode: true, titleEn: true },
      orderBy: { chapterNumber: 'asc' },
    });
    chaptersByClass.set(cls, rows);
  }

  // Pull all CHAPTER_MISMATCH problems
  const targets: any[] = await p.$queryRawUnsafe(
    `SELECT p.id, p.source, p.body, p.answer, p."conceptLessonId",
            cl."titleEn" AS current_title,
            p."qualityRubric", p."qualityCriticalFlags", p."qualityScore"
     FROM "Problem" p
     LEFT JOIN "ConceptLesson" cl ON cl.id = p."conceptLessonId"
     WHERE 'CHAPTER_MISMATCH' = ANY(p."qualityCriticalFlags")
     ${limit ? `LIMIT ${limit}` : ''}`,
  );

  console.log(`Targets: ${targets.length} CHAPTER_MISMATCH rows\n`);

  let recovered = 0;
  let stillExcluded = 0;
  let outOfCurriculum = 0;
  let failed = 0;
  let unchanged = 0;

  async function processOne(row: any) {
    try {
      const cls = classFromSource(row.source);
      if (!cls) {
        outOfCurriculum += 1;
        console.log(`[skip] ${row.id.slice(0, 8)}  no class extractable from source="${row.source}"`);
        return;
      }
      const available = chaptersByClass.get(cls);
      if (!available || available.length === 0) {
        outOfCurriculum += 1;
        return;
      }

      const rubric = row.qualityRubric as any;
      const rubricHint = rubric?.curriculumFit?.comment ?? rubric?.summary ?? null;

      const prompt = buildPrompt(
        {
          body: row.body || '',
          answer: row.answer || '',
          rubricHint,
          currentTitle: row.current_title,
        },
        available,
      );
      const res = await callGemini(apiKey, prompt);

      if (res.chapterCode === 'NONE' || res.confidence < 0.55) {
        outOfCurriculum += 1;
        console.log(`[skip] ${row.id.slice(0, 8)}  → NONE (confidence=${res.confidence})  ${res.reason}`);
        return;
      }
      const target = available.find((c) => c.chapterCode === res.chapterCode);
      if (!target) {
        failed += 1;
        console.log(`[fail] ${row.id.slice(0, 8)}  invalid chapterCode="${res.chapterCode}" not in class ${cls}`);
        return;
      }

      // Patch rubric — remove CHAPTER_MISMATCH from each axis reasonCodes,
      // bump curriculumFit score to 5 and annotate comment.
      const patched = JSON.parse(JSON.stringify(rubric));
      for (const axis of ['clarity', 'pedagogy', 'distractorQuality', 'difficultyMatch', 'curriculumFit']) {
        const a = patched[axis];
        if (a?.reasonCodes) {
          a.reasonCodes = a.reasonCodes.filter((c: string) => c !== 'CHAPTER_MISMATCH');
        }
      }
      patched.curriculumFit.score = 5;
      patched.curriculumFit.comment = `[reclassified ${new Date().toISOString().slice(0, 10)}] Moved to ${target.chapterCode}: ${target.titleEn}. Original judge note: ${rubricHint ?? '(none)'}`;
      const newFlags = collectCriticalFlags(patched);
      const newScore = computeFinalScore(patched);
      const newStatus = decideStatus(newScore, newFlags);

      if (apply) {
        await p.problem.update({
          where: { id: row.id },
          data: {
            conceptLessonId: target.id,
            qualityRubric: patched,
            qualityCriticalFlags: newFlags,
            qualityScore: newScore,
            qualityStatus: newStatus,
            qualityScoredAt: new Date(),
            qualityModel: `${MODEL_ID}+reclassify`,
          },
        });
      }

      const oldStatus = (row.qualityStatus ?? 'EXCLUDED') as string;
      if (newStatus === 'APPROVED' || newStatus === 'USABLE') recovered += 1;
      else if (newStatus === 'EXCLUDED') stillExcluded += 1;
      else unchanged += 1;

      const tag = (newStatus === 'APPROVED' || newStatus === 'USABLE') ? '[RECOVER]' : '[stays]';
      console.log(
        `${tag} ${row.id.slice(0, 8)}  ${row.current_title?.slice(0, 22) ?? '?'} → ${target.titleEn}  score=${newScore.toFixed(2)} status=${newStatus} conf=${res.confidence}`,
      );
    } catch (e) {
      failed += 1;
      console.log(`[err]  ${row.id.slice(0, 8)}  ${(e as Error).message.slice(0, 150)}`);
    }
  }

  // Concurrency batches
  for (let i = 0; i < targets.length; i += CONCURRENCY) {
    const slice = targets.slice(i, i + CONCURRENCY);
    await Promise.all(slice.map(processOne));
    if ((i + slice.length) % 25 === 0 || i + slice.length === targets.length) {
      const total = recovered + stillExcluded + outOfCurriculum + failed + unchanged;
      console.log(
        `\n--- progress ${total}/${targets.length}: recovered=${recovered} still-excluded=${stillExcluded} out-of-curriculum=${outOfCurriculum} failed=${failed}\n`,
      );
    }
  }

  console.log(`\nDone. recovered=${recovered} still-excluded=${stillExcluded} out-of-curriculum=${outOfCurriculum} failed=${failed}`);
  if (dryRun) console.log('(dry-run — no DB writes)');
  await p.$disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
