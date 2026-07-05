import { describe, expect, it } from 'vitest';
import {
  annualSavingsPercent,
  formatMicros,
  microsToAmount,
  monthlyEquivalent,
  perDayPrice,
  phaseDurationLabel,
} from './billing-pricing';

describe('billing pricing helpers', () => {
  it('converts Play price micros without losing the currency unit', () => {
    expect(microsToAmount('12000000')).toBe(12);
    expect(microsToAmount('not-a-price')).toBeNull();
  });

  it('formats KRW without decimal places', () => {
    expect(formatMicros('9900000000', 'KRW', 'ko-KR')).toContain('9,900');
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
    expect(annualSavingsPercent('9900000000', '99000000000')).toBe(17);
    expect(annualSavingsPercent('10000000', '96000000')).toBe(20);
    expect(annualSavingsPercent('10000000', '120000000')).toBe(0);
  });

  it('labels a promo phase duration (period × cycles) per language', () => {
    expect(phaseDurationLabel('P1M', 3, 'ko')).toBe('3개월');
    expect(phaseDurationLabel('P1M', 3, 'en')).toBe('3 months');
    expect(phaseDurationLabel('P1M', 1, 'en')).toBe('1 month');
    expect(phaseDurationLabel('P1Y', 1, 'ko')).toBe('1년');
    expect(phaseDurationLabel('not-a-period', 3, 'ko')).toBeNull();
  });
});
