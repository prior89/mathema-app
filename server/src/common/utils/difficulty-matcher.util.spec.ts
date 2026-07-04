import {
  productiveStruggleWeight,
  PRODUCTIVE_STRUGGLE_FLOOR,
  PRODUCTIVE_STRUGGLE_KNEE,
} from './difficulty-matcher.util';

/**
 * Locks the research-critical shape of the selection weight (85% rule / Bjork /
 * ZPD): peak on the reachable-weak band, taper on BOTH the mastered end and the
 * hopeless-weak end. The single most important property is that the absolute
 * weakest no longer wins the weight (the failure mode of pure `100 - score`).
 */
describe('productiveStruggleWeight', () => {
  it('floors both extremes (hopeless-weak and mastered)', () => {
    expect(productiveStruggleWeight(0)).toBeCloseTo(PRODUCTIVE_STRUGGLE_FLOOR, 5);
    expect(productiveStruggleWeight(100)).toBeCloseTo(PRODUCTIVE_STRUGGLE_FLOOR, 5);
  });

  it('KEY: reachable-weak outranks the absolute weakest (fixes pure-weakness)', () => {
    // Under the old max(5, 100-score), score 2 would win everything. Now it must
    // lose to a reachable-weak concept.
    expect(productiveStruggleWeight(25)).toBeGreaterThan(productiveStruggleWeight(2));
    expect(productiveStruggleWeight(35)).toBeGreaterThan(productiveStruggleWeight(5));
  });

  it('reachable-weak also outranks a near-mastered concept', () => {
    expect(productiveStruggleWeight(30)).toBeGreaterThan(productiveStruggleWeight(88));
  });

  it('rises with reachability below the knee', () => {
    expect(productiveStruggleWeight(20)).toBeGreaterThan(productiveStruggleWeight(5));
    expect(productiveStruggleWeight(PRODUCTIVE_STRUGGLE_KNEE)).toBeGreaterThan(productiveStruggleWeight(10));
  });

  it('falls with shrinking room above the knee', () => {
    expect(productiveStruggleWeight(40)).toBeGreaterThan(productiveStruggleWeight(70));
    expect(productiveStruggleWeight(70)).toBeGreaterThan(productiveStruggleWeight(90));
  });

  it('never drops below the floor and clamps out-of-range input', () => {
    for (let s = -20; s <= 120; s += 5) {
      expect(productiveStruggleWeight(s)).toBeGreaterThanOrEqual(PRODUCTIVE_STRUGGLE_FLOOR - 1e-9);
    }
    expect(productiveStruggleWeight(-10)).toBeCloseTo(productiveStruggleWeight(0), 5);
    expect(productiveStruggleWeight(130)).toBeCloseTo(productiveStruggleWeight(100), 5);
  });

  it('peak sits in the reachable-weak band, not at either extreme', () => {
    let best = -1, bestScore = -1;
    for (let s = 0; s <= 100; s += 1) {
      const w = productiveStruggleWeight(s);
      if (w > best) { best = w; bestScore = s; }
    }
    expect(bestScore).toBeGreaterThanOrEqual(20);
    expect(bestScore).toBeLessThanOrEqual(45);
  });
});
