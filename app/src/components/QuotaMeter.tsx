/**
 * QuotaMeter — inline AI Solver quota indicator.
 *
 * When billing UI is enabled (BILLING_UI_ENABLED), exhausted state links to paywall.
 * When disabled (v1.0 default), shows counter only — no upgrade CTA.
 */
import { useNavigate } from 'react-router-dom';
import { useBillingStatus } from '../hooks/useBillingStatus';
import { useBillingUiEnabled } from '../lib/billing-flags';
import { useT } from '../lib/i18n';

interface Props {
  className?: string;
  style?: React.CSSProperties;
}

export function QuotaMeter({ className, style }: Props) {
  const nav = useNavigate();
  const { t } = useT();
  const billingUi = useBillingUiEnabled();
  const status = useBillingStatus();

  const quota = status.data?.quota?.solver;
  if (!quota || quota.limit === null) return null;

  const { used, limit, inGrace, graceEndsAt } = quota;
  const exhausted = used >= limit;
  const left = Math.max(0, limit - used);
  // Pre-warning at <=2 left: nudge to paywall BEFORE the hard 403 wall so the
  // upgrade prompt arrives while the user still has agency, not as a punishment.
  const low = !exhausted && left <= 2;
  const graceDaysLeft =
    inGrace && graceEndsAt
      ? Math.max(1, Math.ceil((new Date(graceEndsAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000)))
      : 0;

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
        flexWrap: 'wrap',
        ...style,
      }}
    >
      {exhausted && billingUi ? (
        <button
          type="button"
          onClick={() => nav('/app/paywall?reason=quota')}
          style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            color: 'var(--p-danger)',
            fontWeight: 600,
            fontSize: 11.5,
            cursor: 'pointer',
            textDecoration: 'underline',
            fontFamily: 'inherit',
          }}
        >
          {t('quota.solver.exhausted', { used, limit })}
        </button>
      ) : low && billingUi ? (
        <button
          type="button"
          onClick={() => nav('/app/paywall?reason=quota')}
          style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            color: 'var(--p-accent-ink)',
            fontWeight: 600,
            fontSize: 11.5,
            cursor: 'pointer',
            textDecoration: 'underline',
            fontFamily: 'inherit',
          }}
        >
          {t('quota.solver.low', { left })}
        </button>
      ) : (
        <span style={exhausted ? { fontWeight: 600 } : undefined}>
          {t(exhausted ? 'quota.solver.exhausted' : 'quota.solver.remaining', { used, limit })}
        </span>
      )}
      {inGrace && !exhausted && graceDaysLeft > 0 && (
        <span style={{ color: 'var(--p-accent)', fontSize: 10.5 }}>
          {t('quota.solver.grace', { limit, daysLeft: graceDaysLeft })}
        </span>
      )}
    </div>
  );
}

export default QuotaMeter;