import { describe, expect, it } from 'vitest';
import {
  annualSavingsPercent,
  formatMicros,
  microsToAmount,
  monthlyEquivalent,
  perDayPrice,
} from './billing-pricing';

describe('billing pricing helpers', () => {
  it('converts Play price micros without losing the currency unit', () => {
    expect(microsToAmount('12000000')).toBe(12);
    expect(microsToAmount('not-a-price')).toBeNull();
  });

  it('formats KRW without decimal places', () => {
    expect(formatMicros('14900000000', 'KRW', 'ko-KR')).toContain('14,900');
  });

  it('shows the monthly equivalent of an annual price', () => {
    expect(monthlyEquivalent('120000000', 'USD', 'en-US')).toBe('$10.00');
  });

  it('shows the per-day equivalent of an annual price', () => {
    expect(perDayPrice('365000000', 'USD', 'en-US')).toBe('$1.00');
    expect(perDayPrice('36500000000', 'KRW', 'ko-KR')).toContain('100');
    expect(perDayPrice('garbage', 'USD', 'en-US')).toBeNull();
  });

  it('calculates savings against twelve monthly payments', () => {
    expect(annualSavingsPercent('14900000000', '149000000000')).toBe(17);
    expect(annualSavingsPercent('10000000', '96000000')).toBe(20);
    expect(annualSavingsPercent('10000000', '120000000')).toBe(0);
  });
});
