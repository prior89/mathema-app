import {
  recommenderArm,
  recommenderSplitPercent,
  userBucket,
} from './recommender-cohort.util';

describe('recommender-cohort', () => {
  it('defaults to 100% productive (no A/B) and clamps input', () => {
    expect(recommenderSplitPercent(undefined)).toBe(100);
    expect(recommenderSplitPercent('nonsense')).toBe(100);
    expect(recommenderSplitPercent('150')).toBe(100);
    expect(recommenderSplitPercent('-10')).toBe(0);
    expect(recommenderSplitPercent('0')).toBe(0);
    expect(recommenderSplitPercent('37')).toBe(37);
  });

  it('everyone is productive at 100 and legacy at 0', () => {
    for (const u of ['a', 'b', 'user-123', 'zzz']) {
      expect(recommenderArm(u, '100')).toBe('productive');
      expect(recommenderArm(u, '0')).toBe('legacy');
    }
  });

  it('assigns a STABLE arm (same user never flips between calls)', () => {
    const u = 'stable-user-42';
    const first = recommenderArm(u, '50');
    for (let i = 0; i < 20; i++) expect(recommenderArm(u, '50')).toBe(first);
  });

  it('bucket is deterministic and in [0,99]', () => {
    for (const u of ['x', 'y', 'a-longer-uuid-like-string']) {
      const b = userBucket(u);
      expect(b).toBe(userBucket(u));
      expect(b).toBeGreaterThanOrEqual(0);
      expect(b).toBeLessThan(100);
    }
  });

  it('splits roughly to the requested percentage across many users', () => {
    let productive = 0;
    const N = 4000;
    for (let i = 0; i < N; i++) {
      if (recommenderArm(`u-${i}`, '50') === 'productive') productive++;
    }
    const pct = (100 * productive) / N;
    expect(pct).toBeGreaterThan(44); // ~50%, allow sampling noise
    expect(pct).toBeLessThan(56);
  });
});
