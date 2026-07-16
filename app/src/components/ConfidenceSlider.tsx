import { useT } from '../lib/i18n';

type Props = {
  value: number | null;
  onChange: (v: number | null) => void;
  label?: string;
};

/* Pre-submit metacognition check — one-tap Low/Medium/High instead of the
 * old 0-100 slider (2026-06-11 audit: no market leader uses a per-question
 * slider; mandatory fine-grained input was friction without extra signal).
 * Optional: tapping the selected level again deselects it, and submission
 * proceeds with confidence omitted. Values 30/60/90 keep the stored 0-100
 * scale so existing Brier/calibration analytics stay comparable. */
export default function ConfidenceSlider({ value, onChange, label }: Props) {
  const { t } = useT();
  const levels = [
    {
      v: 30,
      text: t('study.confidence.low'),
      accent: 'var(--p-danger)',
      ink: 'var(--p-danger-ink)',
      tint: 'var(--p-danger-tint)',
    },
    {
      v: 60,
      text: t('study.confidence.medium'),
      accent: 'var(--p-warning)',
      ink: 'var(--p-warning-ink)',
      tint: 'var(--p-warning-tint)',
    },
    {
      v: 90,
      text: t('study.confidence.high'),
      accent: 'var(--p-success)',
      ink: 'var(--p-success-ink)',
      tint: 'var(--p-success-tint)',
    },
  ];
  const displayLabel = label ?? t('study.confidence.label');

  return (
    <div style={{ marginTop: 12, marginBottom: 12 }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 6,
        fontSize: 11, color: 'var(--p-muted)', marginBottom: 6,
        letterSpacing: '0.1em', textTransform: 'uppercase',
      }}>
        <span>{displayLabel}</span>
        <span style={{ fontSize: 10, color: 'var(--p-ink-2)', textTransform: 'none', letterSpacing: 0 }}>
          · {t('study.confidence.optional')}
        </span>
      </div>
      <div role="group" aria-label={displayLabel} style={{ display: 'flex', gap: 8 }}>
        {levels.map((lv) => {
          const active = value === lv.v;
          return (
            <button
              key={lv.v}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(active ? null : lv.v)}
              style={{
                flex: 1, padding: '9px 0', borderRadius: 10, cursor: 'pointer',
                fontSize: 12.5, fontWeight: 600, fontFamily: 'inherit',
                border: `1.5px solid ${active ? lv.accent : 'var(--p-border)'}`,
                background: active ? lv.tint : 'transparent',
                color: active ? lv.ink : 'var(--p-ink-2)',
                transition: 'border-color 0.12s, background 0.12s, color 0.12s',
              }}
            >
              {lv.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
