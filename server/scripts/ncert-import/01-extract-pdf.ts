/* Extract NCERT PDF → per-page text files under scripts/ncert-import/pages/page-NNNN.txt
 *
 * pdf-parse v2 API: new PDFParse({ data }).getText({ first, last }) → TextResult{ pages[] }.
 * 청크(50p)로 끊어서 메모리 안정 + 진행 표시.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { PDFParse } from 'pdf-parse';

const PDF_PATH = String.raw`C:\Users\User\Downloads\NCERT_Mathematics_Class_7_to_12_Final (1).pdf`;
const OUT_DIR = path.join(__dirname, 'pages');
const CHUNK = 50;

async function main() {
  if (!fs.existsSync(PDF_PATH)) {
    console.error(`PDF not found: ${PDF_PATH}`);
    process.exit(1);
  }
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log(`📄 Loading ${PDF_PATH}`);
  const buf = fs.readFileSync(PDF_PATH);
  console.log(`   ${(buf.length / 1e6).toFixed(1)} MB`);

  const parser = new PDFParse({ data: new Uint8Array(buf) });
  const info = await parser.getInfo();
  const total = info.total ?? (info as any).pages ?? 0;
  console.log(`   pages: ${total}`);

  const t0 = Date.now();
  for (let start = 1; start <= total; start += CHUNK) {
    const end = Math.min(start + CHUNK - 1, total);
    const r = await parser.getText({ first: start, last: end });
    for (const p of r.pages) {
      const fn = path.join(OUT_DIR, `page-${String(p.num).padStart(4, '0')}.txt`);
      fs.writeFileSync(fn, p.text, 'utf8');
    }
    console.log(`   ${end}/${total} (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
  }

  await parser.destroy();
  console.log(`\n✅ done → ${OUT_DIR}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
