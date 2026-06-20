import { AGE_PICKER_MAX, AGE_PICKER_MIN, type GuardianCountry } from '../../lib/guardian-consent';
import { useT } from '../../lib/i18n';

const AGES = Array.from(
  { length: AGE_PICKER_MAX - AGE_PICKER_MIN + 1 },
  (_, i) => AGE_PICKER_MIN + i,
);

// Adults (older than the student picker range) need a way to pick an age too.
// A single "19+" chip stores 19 — at/over every guardian-consent threshold, so
// it skips the minor flow without forcing exact-age entry for grown-ups.
const ADULT_AGE = AGE_PICKER_MAX + 1;

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
        <button
          key="adult"
          type="button"
          role="radio"
          aria-checked={typeof age === 'number' && age >= ADULT_AGE}
          aria-label={t('ageGate.adult.aria')}
          className={`age-chip ${typeof age === 'number' && age >= ADULT_AGE ? 'selected' : ''}`}
          onClick={() => onChange(ADULT_AGE)}
        >
          {t('ageGate.adult')}
        </button>
      </div>
      <span className="caption" style={{ marginTop: 6 }}>{t(hintKey)}</span>
    </div>
  );
}