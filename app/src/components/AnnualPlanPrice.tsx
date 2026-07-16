type Props = {
  annualTotal: string;
  annualPeriod: string;
  monthlyEquivalentLabel?: string | null;
};

/** Keep the actual annual charge visually and semantically ahead of equivalents. */
export function AnnualPlanPrice({ annualTotal, annualPeriod, monthlyEquivalentLabel }: Props) {
  return (
    <>
      <span className="paywall-plan-card-price" data-price-prominence="primary">
        <strong>{annualTotal}</strong>
        <span>/ {annualPeriod}</span>
      </span>
      {monthlyEquivalentLabel && (
        <span className="paywall-plan-card-equivalent" data-price-prominence="secondary">
          {monthlyEquivalentLabel}
        </span>
      )}
    </>
  );
}
