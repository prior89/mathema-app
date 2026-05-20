/* Extract individual NCERT problems from EXERCISE page ranges.
 * Input: scripts/ncert-import/exercise-index.json + pages/*.txt
 * Output: scripts/ncert-import/problems.json (raw problem statements with metadata)
 */
import * as fs from 'node:fs';
import * as path from 'node:path';

const PAGES_DIR = path.join(__dirname, 'pages');
const INDEX_PATH = path.join(__dirname, 'exercise-index.json');
const OUT_PATH = path.join(__dirname, 'problems.json');

type Exercise = { page: number; cls: string; chapter: number; exercise: string; endPage: number };

function loadPage(p: number): string {
  return fs.readFileSync(path.join(PAGES_DIR, `page-${String(p).padStart(4, '0')}.txt`), 'utf8');
}

// Strip page headers/footers and ornamental noise so problem text reads cleanly.
function cleanText(t: string): string {
  return t
    .split('\n')
    .filter((line) => {
      const s = line.trim();
      if (!s) return false;
      if (/^Reprint\s+\d{4}/i.test(s)) return false;
      if (/^2024-25/.test(s)) return false;
      if (/^2026-27/.test(s)) return false;
      if (/^MATHEMATICS\s*\d*$/i.test(s)) return false;
      if (/^\d+\s+MATHEMATICS$/i.test(s)) return false;
      if (/^[A-Z\s]{4,}\s+\d+$/.test(s) && s.split(/\s+/).length <= 4) return false; // "INTEGERS 5"
      if (/^[A-Z\s\-']{4,}$/.test(s) && s.length <= 30) return false; // standalone caps title lines
      if (/^Fig\.\s*\d/i.test(s)) return false;
      if (/^TRY\s+THESE$/i.test(s)) return false;
      if (/^DO\s+THIS$/i.test(s)) return false;
      return true;
    })
    .join('\n');
}

// Extract Q1..QN starting from end of "EXERCISE X.Y" line, stopping at next exercise or sub-section.
function extractFromBlock(rawText: string, exerciseId: string): string[] {
  const t = rawText;

  // Find anchor: "EXERCISE <exerciseId>"
  const anchor = new RegExp(`EXERCISE\\s+${exerciseId.replace('.', '\\.')}`);
  const am = anchor.exec(t);
  if (!am) return [];
  let body = t.slice(am.index + am[0].length);

  // Stop at next EXERCISE marker or "WHAT HAVE WE DISCUSSED" or page-cross sub-section header.
  const endMatch = body.match(/EXERCISE\s+\d+\.\d+|WHAT\s+HAVE\s+WE\s+DISCUSSED|^\d+\.\d+\s+[A-Z][A-Z]/m);
  if (endMatch && typeof endMatch.index === 'number') body = body.slice(0, endMatch.index);

  body = cleanText(body);

  // Split on lines that begin with "N." where N is a small integer (problem number).
  const lines = body.split('\n');
  const problems: string[] = [];
  let cur = '';
  let started = false;

  for (const line of lines) {
    const m = line.match(/^(\d{1,2})\.\s+(.*)$/);
    if (m && parseInt(m[1], 10) <= 30) {
      if (started && cur.trim()) problems.push(cur.trim());
      cur = line.trim();
      started = true;
    } else if (started) {
      cur += ' ' + line.trim();
    }
  }
  if (started && cur.trim()) problems.push(cur.trim());

  // Filter trivial/short artifacts
  return problems
    .map((p) => p.replace(/\s+/g, ' '))
    .filter((p) => p.length >= 20 && p.length <= 600);
}

function main() {
  const exercises: Exercise[] = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf8'));
  type Out = { cls: string; chapter: number; exercise: string; idx: number; text: string };
  const all: Out[] = [];

  for (const ex of exercises) {
    // Concat all pages of this exercise range (cap at 4 pages for performance and to avoid drift).
    const last = Math.min(ex.endPage, ex.page + 3);
    let txt = '';
    for (let p = ex.page; p <= last; p++) {
      try { txt += '\n' + loadPage(p); } catch {}
    }
    const qs = extractFromBlock(txt, ex.exercise);
    qs.forEach((q, i) => all.push({ cls: ex.cls, chapter: ex.chapter, exercise: ex.exercise, idx: i + 1, text: q }));
  }

  fs.writeFileSync(OUT_PATH, JSON.stringify(all, null, 2), 'utf8');

  console.log(`Extracted ${all.length} problems`);

  // Per-class·chapter counts:
  const byCh = new Map<string, number>();
  for (const p of all) {
    const k = `${p.cls} ch${p.chapter}`;
    byCh.set(k, (byCh.get(k) ?? 0) + 1);
  }
  console.log(`\n[Problems per class·chapter — top/bottom]`);
  const sorted = Array.from(byCh.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  for (const [k, v] of sorted) console.log(`  ${k}: ${v}`);

  console.log(`\n[Sample problems — first 3]`);
  for (const p of all.slice(0, 3)) {
    console.log(`  · ${p.cls} ch${p.chapter} ex${p.exercise} Q${p.idx}`);
    console.log(`    ${p.text.slice(0, 180)}${p.text.length > 180 ? '…' : ''}`);
  }
}

main();
