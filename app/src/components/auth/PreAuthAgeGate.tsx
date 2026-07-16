import { FormEvent, useCallback, useEffect, useId, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useT } from '../../lib/i18n';
import {
  derivePreAuthAgeBand,
  type PreAuthAgeBand,
  type PreAuthRegion,
} from '../../lib/pre-auth-age-gate';

export function usePreAuthAgeGate() {
  // Intentionally page-local. A remembered choice on a shared family device
  // could expose the Google SDK to the next user without a neutral age check.
  const [ageBand, setAgeBand] = useState<PreAuthAgeBand | null>(null);

  useEffect(() => {
    // One-time cleanup for builds that used to persist this decision.
    try { window.localStorage.removeItem('matheo.preAuthAgeBand'); } catch { /* unavailable */ }
  }, []);

  const selectAgeBand = useCallback((next: PreAuthAgeBand) => {
    setAgeBand(next);
  }, []);

  const resetAgeBand = useCallback(() => {
    setAgeBand(null);
  }, []);

  return { ageBand, selectAgeBand, resetAgeBand };
}

type Props = {
  ageBand: PreAuthAgeBand | null;
  onSelect: (ageBand: PreAuthAgeBand) => void;
  onReset: () => void;
};

function todayInputValue(): string {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
}

/**
 * Neutral date-of-birth check shown before any auth SDK mounts. The exact
 * value is kept only in this form and erased immediately after classification.
 */
export function PreAuthAgeGate({ ageBand, onSelect, onReset }: Props) {
  const { t, lang } = useT();
  const titleId = useId();
  const helpId = useId();
  const errorId = useId();
  const [birthDate, setBirthDate] = useState('');
  const [region, setRegion] = useState<PreAuthRegion>(lang === 'ko' ? 'KR' : 'OTHER');
  const [error, setError] = useState(false);

  const reset = () => {
    setBirthDate('');
    setError(false);
    onReset();
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const decision = derivePreAuthAgeBand(birthDate, region);
    if (!decision) {
      setError(true);
      return;
    }
    setBirthDate('');
    setError(false);
    onSelect(decision);
  };

  if (ageBand) {
    return (
      <div className="pre-auth-age-selection">
        <div>
          <span>{t('preAuthAge.selected')}</span>
          <strong>{t('preAuthAge.checked')}</strong>
        </div>
        <button type="button" onClick={reset}>{t('preAuthAge.change')}</button>
        {ageBand === 'child' && (
          <p className="pre-auth-age-help">
            <ShieldCheck size={16} aria-hidden="true" />
            <span>{t('preAuthAge.childHelp')}</span>
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
      <form onSubmit={submit} noValidate>
        <div className="pre-auth-age-fields">
          <label>
            <span>{t('preAuthAge.birthDate')}</span>
            <input
              className="pre-auth-age-birthdate"
              type="date"
              value={birthDate}
              max={todayInputValue()}
              aria-describedby={error ? errorId : undefined}
              onChange={(event) => {
                setBirthDate(event.target.value);
                setError(false);
              }}
              required
            />
          </label>
          <label>
            <span>{t('preAuthAge.region')}</span>
            <select
              className="pre-auth-age-region"
              value={region}
              onChange={(event) => setRegion(event.target.value as PreAuthRegion)}
            >
              <option value="KR">{t('preAuthAge.regionKR')}</option>
              <option value="IN">{t('preAuthAge.regionIN')}</option>
              <option value="OTHER">{t('preAuthAge.regionOther')}</option>
            </select>
          </label>
        </div>
        {error && <p id={errorId} className="pre-auth-age-error" role="alert">{t('preAuthAge.invalid')}</p>}
        <button className="pre-auth-age-submit" type="submit">{t('preAuthAge.continue')}</button>
      </form>
    </section>
  );
}
