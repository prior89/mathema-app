import { useCallback, useId, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useT } from '../../lib/i18n';
import {
  clearPreAuthAgeBand,
  readPreAuthAgeBand,
  type PreAuthAgeBand,
  writePreAuthAgeBand,
} from '../../lib/pre-auth-age-gate';

export function usePreAuthAgeGate() {
  const [ageBand, setAgeBand] = useState<PreAuthAgeBand | null>(() => readPreAuthAgeBand());

  const selectAgeBand = useCallback((next: PreAuthAgeBand) => {
    writePreAuthAgeBand(next);
    setAgeBand(next);
  }, []);

  const resetAgeBand = useCallback(() => {
    clearPreAuthAgeBand();
    setAgeBand(null);
  }, []);

  return { ageBand, selectAgeBand, resetAgeBand };
}

type Props = {
  ageBand: PreAuthAgeBand | null;
  onSelect: (ageBand: PreAuthAgeBand) => void;
  onReset: () => void;
};

/**
 * Neutral, equally weighted age-band choice shown before any auth SDK mounts.
 * This is intentionally separate from the exact-age onboarding field.
 */
export function PreAuthAgeGate({ ageBand, onSelect, onReset }: Props) {
  const { t } = useT();
  const titleId = useId();
  const helpId = useId();

  if (ageBand) {
    return (
      <div className="pre-auth-age-selection">
        <div>
          <span>{t('preAuthAge.selected')}</span>
          <strong>
            {t(ageBand === 'under13' ? 'preAuthAge.under13' : 'preAuthAge.13plus')}
          </strong>
        </div>
        <button type="button" onClick={onReset}>{t('preAuthAge.change')}</button>
        {ageBand === 'under13' && (
          <p className="pre-auth-age-help">
            <ShieldCheck size={16} aria-hidden="true" />
            <span>{t('preAuthAge.under13Help')}</span>
          </p>
        )}
      </div>
    );
  }

  return (
    <section className="pre-auth-age-gate" aria-labelledby={titleId} aria-describedby={helpId}>
      <span className="eyebrow">{t('preAuthAge.eyebrow')}</span>
      <h3 id={titleId}>{t('preAuthAge.question')}</h3>
      <p id={helpId}>{t('preAuthAge.reason')}</p>
      <div className="pre-auth-age-options" role="group" aria-label={t('preAuthAge.question')}>
        <button type="button" onClick={() => onSelect('under13')}>
          {t('preAuthAge.under13')}
        </button>
        <button type="button" onClick={() => onSelect('13plus')}>
          {t('preAuthAge.13plus')}
        </button>
      </div>
    </section>
  );
}
