/** Benchmark: how many of the 2,083 NCERT-extracted problems does deterministic_check match? */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { DeterministicCheckService } from './deterministic-check.service';

describe('deterministic_check match rate on NCERT extracted problems', () => {
  const svc = new DeterministicCheckService();
  const ROOT = path.resolve(__dirname, '../../../../scripts/ncert-pdf-extract/output');

  it('reports match rate per grade', () => {
    const grades = [7, 8, 9, 10, 11, 12];
    const summary: Record<number, { total: number; matched: number; byChecker: Record<string, number> }> = {};

    for (const g of grades) {
      const file = path.join(ROOT, `grade-${g}.problems.json`);
      if (!fs.existsSync(file)) continue;
      const items: Array<{ text: string }> = JSON.parse(fs.readFileSync(file, 'utf8')).problems ?? [];
      let matched = 0;
      const byChecker: Record<string, number> = {};
      for (const p of items) {
        const r = svc.check(p.text, null);
        if (r) {
          matched++;
          byChecker[r.checker] = (byChecker[r.checker] ?? 0) + 1;
        }
      }
      summary[g] = { total: items.length, matched, byChecker };
    }

    let totalAll = 0;
    let matchedAll = 0;
    const checkerTotals: Record<string, number> = {};
    console.log('\n=== deterministic_check match rate on extracted problems ===');
    for (const g of grades) {
      const s = summary[g];
      if (!s) continue;
      const pct = s.total ? ((s.matched / s.total) * 100).toFixed(1) : '0.0';
      const byList = Object.entries(s.byChecker)
        .sort((a, b) => b[1] - a[1])
        .map(([k, v]) => `${k}=${v}`)
        .join(', ');
      console.log(`Grade ${g}:  ${s.matched.toString().padStart(4)}/${s.total.toString().padStart(4)}  (${pct}%)  ${byList || '(none)'}`);
      totalAll += s.total;
      matchedAll += s.matched;
      for (const [k, v] of Object.entries(s.byChecker)) checkerTotals[k] = (checkerTotals[k] ?? 0) + v;
    }
    const overallPct = totalAll ? ((matchedAll / totalAll) * 100).toFixed(1) : '0.0';
    console.log(`TOTAL:    ${matchedAll}/${totalAll}  (${overallPct}%)`);
    console.log('By checker (sorted):');
    Object.entries(checkerTotals)
      .sort((a, b) => b[1] - a[1])
      .forEach(([k, v]) => console.log(`  ${k.padEnd(40)} ${v}`));

    expect(totalAll).toBeGreaterThan(2000);
  });
});
