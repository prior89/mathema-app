/**
 * Read the recommender A/B: bucket every learner by their (stable, hash-derived)
 * arm and compare per-arm learning outcomes. No extra persistence is needed —
 * the arm is recomputed from userId with the SAME util the recommender uses, so
 * assignment and measurement can never drift.
 *
 *   RECOMMENDER_AB_SPLIT=50 npx ts-node --transpile-only scripts/analyze-recommender-ab.ts
 *
 * At split=100 (default) everyone is 'productive' → no contrast; set 50 to run
 * a real experiment, let it accrue for a few weeks, then read the winner here.
 */
import { PrismaClient } from '@prisma/client';
import { recommenderArm, recommenderSplitPercent } from '../src/common/utils/recommender-cohort.util';

const prisma = new PrismaClient();

function mean(xs: number[]): number {
  return xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0;
}

async function main() {
  const split = recommenderSplitPercent();
  console.log(`RECOMMENDER_AB_SPLIT = ${split}%  (percent of users on the new 'productive' rule)`);
  if (split >= 100) console.log("NOTE: 100 → everyone is 'productive'; set 50 to get a legacy contrast arm.");
  if (split <= 0) console.log("NOTE: 0 → everyone is 'legacy' (rule reverted).");

  const rows = await prisma.masteryTrajectory.groupBy({
    by: ['userId'],
    _avg: { masteryScore: true, recentAccuracy: true },
    _sum: { evidenceCount: true },
  });

  const arms: Record<'productive' | 'legacy', { n: number; mastery: number[]; acc: number[]; evid: number }> = {
    productive: { n: 0, mastery: [], acc: [], evid: 0 },
    legacy: { n: 0, mastery: [], acc: [], evid: 0 },
  };
  for (const r of rows) {
    const a = recommenderArm(r.userId);
    arms[a].n++;
    if (r._avg.masteryScore != null) arms[a].mastery.push(r._avg.masteryScore);
    if (r._avg.recentAccuracy != null) arms[a].acc.push(r._avg.recentAccuracy);
    arms[a].evid += r._sum.evidenceCount ?? 0;
  }

  console.log(`\nlearners with mastery data: ${rows.length}\n`);
  console.log(`${'arm'.padEnd(12)}${'users'.padStart(7)}${'meanMastery'.padStart(13)}${'meanRecentAcc'.padStart(15)}${'totalEvidence'.padStart(15)}${'mastery/evid'.padStart(14)}`);
  console.log('-'.repeat(76));
  for (const a of ['productive', 'legacy'] as const) {
    const g = arms[a];
    const perEvid = g.evid ? (mean(g.mastery) * g.n) / g.evid : 0;
    console.log(
      `${a.padEnd(12)}${String(g.n).padStart(7)}${mean(g.mastery).toFixed(1).padStart(13)}` +
      `${mean(g.acc).toFixed(2).padStart(15)}${String(g.evid).padStart(15)}${perEvid.toFixed(3).padStart(14)}`,
    );
  }

  if (arms.productive.n > 0 && arms.legacy.n > 0) {
    const dm = mean(arms.productive.mastery) - mean(arms.legacy.mastery);
    console.log(`\nΔ meanMastery (productive − legacy) = ${dm.toFixed(1)} points`);
    console.log('(Needs enough users + weeks of exposure to be conclusive; compare with CIs before adopting.)');
  } else {
    console.log('\nOnly one arm has data — set RECOMMENDER_AB_SPLIT=50 and let both arms accrue to compare.');
  }
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
