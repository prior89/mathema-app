import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { AnnualPlanPrice } from './AnnualPlanPrice';

describe('AnnualPlanPrice', () => {
  it('renders the annual total before and more prominently than the monthly equivalent', () => {
    const html = renderToStaticMarkup(createElement(AnnualPlanPrice, {
      annualTotal: '₩99,000',
      annualPeriod: '년',
      monthlyEquivalentLabel: '월 환산 ₩8,250 (연간 요금 ÷ 12)',
    }));

    const annualIndex = html.indexOf('₩99,000');
    const equivalentIndex = html.indexOf('₩8,250');
    expect(annualIndex).toBeGreaterThanOrEqual(0);
    expect(equivalentIndex).toBeGreaterThan(annualIndex);
    expect(html).toContain('data-price-prominence="primary"');
    expect(html).toContain('data-price-prominence="secondary"');
  });

  it('does not invent an equivalent when Play does not provide a usable total', () => {
    const html = renderToStaticMarkup(createElement(AnnualPlanPrice, {
      annualTotal: '$99.00',
      annualPeriod: 'yr',
    }));
    expect(html).not.toContain('data-price-prominence="secondary"');
  });
});
