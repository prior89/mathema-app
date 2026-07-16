import { getCurrentWeek } from './iso-week.util';

describe('getCurrentWeek', () => {
  it('puts a Wednesday into the Mon-Sun ISO week containing it (IN)', () => {
    // 2026-06-03 Wed 12:00 UTC → 17:30 Asia/Kolkata, still Wed.
    // Monday of that week (Asia/Kolkata) is 2026-06-01 00:00 IST,
    // which is 2026-05-31 18:30 UTC.
    const w = getCurrentWeek('IN', new Date('2026-06-03T12:00:00Z'));
    expect(w.weekStart.toISOString()).toBe('2026-05-31T18:30:00.000Z');
    expect(w.weekEnd.toISOString()).toBe('2026-06-07T18:30:00.000Z');
    expect(w.calendarWeekStart.toISOString()).toBe('2026-06-01T00:00:00.000Z');
    expect(w.calendarWeekEnd.toISOString()).toBe('2026-06-08T00:00:00.000Z');
    expect(w.isoWeek).toBe('2026-W23');
    expect(w.timezone).toBe('Asia/Kolkata');
  });

  it('puts a Wednesday into the Mon-Sun ISO week containing it (KR)', () => {
    // 2026-06-03 12:00 UTC → 21:00 Asia/Seoul, still Wed.
    // Monday of that week (Asia/Seoul) is 2026-06-01 00:00 KST,
    // which is 2026-05-31 15:00 UTC.
    const w = getCurrentWeek('KR', new Date('2026-06-03T12:00:00Z'));
    expect(w.weekStart.toISOString()).toBe('2026-05-31T15:00:00.000Z');
    expect(w.weekEnd.toISOString()).toBe('2026-06-07T15:00:00.000Z');
    expect(w.calendarWeekStart.toISOString()).toBe('2026-06-01T00:00:00.000Z');
    expect(w.calendarWeekEnd.toISOString()).toBe('2026-06-08T00:00:00.000Z');
    expect(w.isoWeek).toBe('2026-W23');
    expect(w.timezone).toBe('Asia/Seoul');
  });

  it('treats a Sunday as the last day of the same ISO week, not the next', () => {
    // 2026-06-07 Sun 12:00 UTC → 17:30 IST. Still in week 23.
    const w = getCurrentWeek('IN', new Date('2026-06-07T12:00:00Z'));
    expect(w.isoWeek).toBe('2026-W23');
  });

  it('rolls to the next ISO week at local midnight Monday, not UTC midnight', () => {
    // 2026-06-07 19:00 UTC = 2026-06-08 00:30 IST → already Monday locally,
    // so this is week 24. If the helper had used UTC midnight it would
    // still report 23.
    const w = getCurrentWeek('IN', new Date('2026-06-07T19:00:00Z'));
    expect(w.isoWeek).toBe('2026-W24');
    expect(w.weekStart.toISOString()).toBe('2026-06-07T18:30:00.000Z');
  });

  it('defaults to IN (Asia/Kolkata) when country is null or unknown', () => {
    const w = getCurrentWeek(null, new Date('2026-06-03T12:00:00Z'));
    expect(w.timezone).toBe('Asia/Kolkata');
    const w2 = getCurrentWeek('XX', new Date('2026-06-03T12:00:00Z'));
    expect(w2.timezone).toBe('Asia/Kolkata');
  });

  it('formats the ISO week label as YYYY-Www with zero padding', () => {
    // 2026-01-05 Mon (a typical week 2)
    const w = getCurrentWeek('IN', new Date('2026-01-05T08:00:00Z'));
    expect(w.isoWeek).toMatch(/^2026-W\d{2}$/);
  });

  it('keeps the local calendar year boundary for date-only persistence', () => {
    const w = getCurrentWeek('KR', new Date('2026-01-01T03:00:00Z'));

    expect(w.isoWeek).toBe('2026-W01');
    expect(w.weekStart.toISOString()).toBe('2025-12-28T15:00:00.000Z');
    expect(w.calendarWeekStart.toISOString()).toBe('2025-12-29T00:00:00.000Z');
    expect(w.calendarWeekEnd.toISOString()).toBe('2026-01-05T00:00:00.000Z');
  });
});
