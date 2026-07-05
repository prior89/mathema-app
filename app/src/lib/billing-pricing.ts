const MICROS_PER_UNIT = 1_000_000;

export function microsToAmount(micros: string): number | null {
  const value = Number(micros);
  if (!Number.isFinite(value) || value < 0) return null;
  return value / MICROS_PER_UNIT;
}

export function formatMicros(
  micros: string,
  currencyCode: string,
  locale: string,
): string | null {
  const amount = microsToAmount(micros);
  if (amount === null) return null;

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: 'symbol',
      maximumFractionDigits: currencyCode === 'KRW' ? 0 : 2,
    }).format(amount);
  } catch {
    return null;
  }
}

export function monthlyEquivalent(
  yearlyMicros: string,
  currencyCode: string,
  locale: string,
): string | null {
  const yearlyAmount = microsToAmount(yearlyMicros);
  if (yearlyAmount === null) return null;
  return formatMicros(
    String(Math.round((yearlyAmount / 12) * MICROS_PER_UNIT)),
    currencyCode,
    locale,
  );
}

// Regional pricing often uses a per-day frame in India/SEA paywalls.
export function perDayPrice(
  yearlyMicros: string,
  currencyCode: string,
  locale: string,
): string | null {
  const yearlyAmount = microsToAmount(yearlyMicros);
  if (yearlyAmount === null) return null;
  return formatMicros(
    String(Math.round((yearlyAmount / 365) * MICROS_PER_UNIT)),
    currencyCode,
    locale,
  );
}

// Human-readable duration of a promo phase: ISO-8601 billingPeriod (e.g. "P1M")
// multiplied by its billingCycleCount. Used for the launch-offer line
// ("첫 3개월 …" / "first 3 months …"). Returns null on an unparseable period.
export function phaseDurationLabel(
  billingPeriod: string,
  cycleCount: number,
  lang: string,
): string | null {
  const m = /^P(\d+)([DWMY])$/.exec(billingPeriod);
  if (!m) return null;
  const total = Number(m[1]) * (cycleCount > 0 ? cycleCount : 1);
  const unit = m[2];
  if (lang === 'ko') {
    const ko: Record<string, string> = { D: '일', W: '주', M: '개월', Y: '년' };
    return `${total}${ko[unit] ?? ''}`;
  }
  const en: Record<string, [string, string]> = {
    D: ['day', 'days'],
    W: ['week', 'weeks'],
    M: ['month', 'months'],
    Y: ['year', 'years'],
  };
  const [one, many] = en[unit] ?? ['period', 'periods'];
  return `${total} ${total === 1 ? one : many}`;
}

export function annualSavingsPercent(
  monthlyMicros: string,
  yearlyMicros: string,
): number | null {
  const monthly = microsToAmount(monthlyMicros);
  const yearly = microsToAmount(yearlyMicros);
  if (monthly === null || yearly === null || monthly <= 0) return null;

  const annualAtMonthlyRate = monthly * 12;
  const saving = Math.round((1 - yearly / annualAtMonthlyRate) * 100);
  return saving > 0 ? saving : 0;
}
