/* Build exercise index: for each page, detect "EXERCISE N.M" markers and classify by class boundary.
 * Output: scripts/ncert-import/exercise-index.json
 *   [{ class: 'CLASS_7', chapter: 1, exercise: '1.1', startPage: 19, endPage: 27 }, ...]
 */
import * as fs from 'node:fs';
import * as path from 'node:path';

const PAGES_DIR = path.join(__dirname, 'pages');
const OUT = path.join(__dirname, 'exercise-index.json');

// Class boundaries observed in PDF (verified by "Textbook for Class …" markers).
// Note: Class IX absent from this PDF.
const CLASS_RANGES: Array<{ cls: string; from: number; to: number }> = [
  { cls: 'CLASS_7',  from: 1,    to: 244  },
  { cls: 'CLASS_8',  from: 245,  to: 440  },
  { cls: 'CLASS_10', from: 441,  to: 716  },
  { cls: 'CLASS_11', from: 717,  to: 1092 },
  { cls: 'CLASS_12', from: 1093, to: 1576 },
];

function classifyPage(p: number): string | null {
  for (const r of CLASS_RANGES) {
    if (p >= r.from && p <= r.to) return r.cls;
  }
  return null;
}

type Marker = { page: number; cls: string; chapter: number; exercise: string };

function main() {
  const files = fs.readdirSync(PAGES_DIR).filter((f) => f.startsWith('page-') && f.endsWith('.txt')).sort();
  const markers: Marker[] = [];

  for (const f of files) {
    const page = parseInt(f.replace(/[^0-9]/g, ''), 10);
    const text = fs.readFileSync(path.join(PAGES_DIR, f), 'utf8');
    const m = text.match(/EXERCISE\s+(\d+)\.(\d+)/);
    if (!m) continue;
    const cls = classifyPage(page);
    if (!cls) continue;
    markers.push({ page, cls, chapter: parseInt(m[1], 10), exercise: `${m[1]}.${m[2]}` });
  }

  // Compute end-page for each marker as (next marker.page - 1) within the same class, else class.to.
  type Indexed = Marker & { endPage: number };
  const indexed: Indexed[] = [];
  for (let i = 0; i < markers.length; i++) {
    const m = markers[i];
    let endPage = CLASS_RANGES.find((r) => r.cls === m.cls)!.to;
    for (let j = i + 1; j < markers.length; j++) {
      if (markers[j].cls === m.cls) { endPage = markers[j].page - 1; break; }
      // crossing into another class
      endPage = markers[j].page - 1;
      break;
    }
    indexed.push({ ...m, endPage });
  }

  fs.writeFileSync(OUT, JSON.stringify(indexed, null, 2), 'utf8');

  console.log(`Indexed ${indexed.length} exercises`);
  // Summary per class & chapter:
  const byClassChap = new Map<string, number>();
  for (const e of indexed) {
    const k = `${e.cls} ch${e.chapter}`;
    byClassChap.set(k, (byClassChap.get(k) ?? 0) + 1);
  }
  console.log(`\n[Exercises per class·chapter]`);
  const keys = Array.from(byClassChap.keys()).sort();
  for (const k of keys) console.log(`  ${k}: ${byClassChap.get(k)} exercises`);
  console.log(`\n→ ${OUT}`);
}

main();
