/**
 * QuotaMeter — inline AI Solver quota indicator.
 *
 * Rendering rules:
 *   - loading / no quota field on server response: render nothing (avoid
 *     flashing "0/0" before the first /billing/status returns).
 *   - premium (limit === null): render nothing — the cleanest UX. Premium
 *     users should never see a counter; the absence of a meter is the signal.
 *   - free, under limit: small line showing "{used}/{limit} today".
 *   - free, at limit: red text + tappable "Start Premium" link to the
 *     paywall. We pass ?reason=quota so PaywallPage can render the
 *     out-of-quota banner.
 *
 * Visual style follows the in-app sage palette (CSS variables defined in
 * styles/onboarding.css — --p-muted, --p-ink-2, --p-danger). No Tailwind in
 * this project; existing components use inline styles + CSS variables.
 *
 * Web preview: the meter renders even when Play Billing is not available.
 * Reason: the quota is enforced server-side regardless of platform, so a web
 * user testing the Solver from a desktop browser also benefits from seeing
 * the count. The paywall link is still useful as an information page on web.
 */
import { useNavigate } from 'react-router-dom';
import { useBillingStatus } from '../hooks/useBillingStatus';
import { useT } from '../lib/i18n';

interface Props {
  /** Optional className passthrough for placement-specific tweaks. */
  className?: string;
  /** Inline style passthrough. */
  style?: React.CSSProperties;
}

export function QuotaMeter({ className, style }: Props) {
  const nav = useNavigate();
  const { t } = useT();
  const status = useBillingStatus();

  const quota = status.data?.quota?.solver;
  // Render nothing while loading, for premium (limit === null), or when the
  // server has not yet populated the quota object.
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
      {exhausted ? (
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
      ) : (
        <span>
          {t('quota.solver.remaining', { used, limit })}
        </span>
      )}
    </div>
  );
}

export default QuotaMeter;
