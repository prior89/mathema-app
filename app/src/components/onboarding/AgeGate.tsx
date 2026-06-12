import { AGE_PICKER_MAX, AGE_PICKER_MIN, type GuardianCountry } from '../../lib/guardian-consent';
import { useT } from '../../lib/i18n';

const AGES = Array.from(
  { length: AGE_PICKER_MAX - AGE_PICKER_MIN + 1 },
  (_, i) => AGE_PICKER_MIN + i,
);

type Props = {
  age: number | '';
  onChange: (age: number) => void;
  country?: GuardianCountry;
};

/** Duolingo-style self-reported age — no exact birth date. */
export function AgeGate({ age, onChange, country }: Props) {
  const { t } = useT();
  const hintKey = country === 'KR' ? 'ageGate.hint.kr' : 'ageGate.hint.default';
  return (
    <div className="field">
      <label>{t('ageGate.label')}</label>
      <div className="age-grid" role="radiogroup" aria-label={t('ageGate.label')}>
        {AGES.map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={age === n}
            className={`age-chip ${age === n ? 'selected' : ''}`}
            onClick={() => onChange(n)}
          >
            {n}
          </button>
        ))}
      </div>
      <span className="caption" style={{ marginTop: 6 }}>{t(hintKey)}</span>
    </div>
  );
}