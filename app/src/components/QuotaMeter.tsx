/**
 * QuotaMeter — inline AI Solver quota indicator.
 *
 * Rendering rules:
 *   - loading / no quota field on server response: render nothing (avoid
 *     flashing "0/0" before /billing/status returns).
 *   - premium (limit === null): render nothing — premium users never see a counter.
 *   - free, under limit: small line showing "{used}/{limit} today".
 *   - free, at limit: red status text. No paywall link in v1.0 (the paywall
 *     route is gone); Phase 2 re-introduces the tappable upgrade CTA here.
 */
import { useBillingStatus } from '../hooks/useBillingStatus';
import { useT } from '../lib/i18n';

interface Props {
  /** Optional className passthrough for placement-specific tweaks. */
  className?: string;
  /** Inline style passthrough. */
  style?: React.CSSProperties;
}

export function QuotaMeter({ className, style }: Props) {
  const { t } = useT();
  const status = useBillingStatus();

  const quota = status.data?.quota?.solver;
  if (!quota || quota.limit === null) return null;

  const { used, limit } = quota;
  const exhausted = used >= limit;

  return (
    <div
      className={className}
      style={{
        fontSize: 11.5,
        color: exhausted ? 'var(--p-danger)' : 'var(--p-muted)',
        fontFamily: 'var(--font-mono)',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        ...style,
      }}
    >
      <span style={exhausted ? { fontWeight: 600 } : undefined}>
        {t(exhausted ? 'quota.solver.exhausted' : 'quota.solver.remaining', { used, limit })}
      </span>
    </div>
  );
}

export default QuotaMeter;
