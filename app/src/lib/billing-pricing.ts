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

// India-market price anchoring ("just ₹X a day") — Doubtnut/PW style framing.
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
