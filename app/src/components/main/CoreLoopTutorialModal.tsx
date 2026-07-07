import { useState } from 'react';
import { Camera, RefreshCw, Target } from 'lucide-react';
import Modal from '../Modal';
import { useT } from '../../lib/i18n';
import type { TranslationKey } from '../../lib/translations';
import { Glyph } from '../onboarding/Glyph';

/**
 * First-run walkthrough of the core loop — solve → wrong-note + weakness →
 * weak-spot review. Shown once (localStorage-gated) the first time a learner
 * lands on Home, so the three-tab flow reads as one coherent system instead of
 * disconnected screens. Purely client-side; dismissing sets the seen flag.
 */
const STORAGE_KEY = 'mathema.tutorial.coreLoop.v1';

const STEPS: Array<{
  accent: string;
  tint: string;
  Icon: typeof Camera;
  title: TranslationKey;
  body: TranslationKey;
}> = [
  { accent: 'var(--p-primary)', tint: 'var(--p-primary-tint)', Icon: Camera, title: 'tutorial.loop.s1.title', body: 'tutorial.loop.s1.body' },
  { accent: 'var(--p-accent)', tint: 'var(--p-accent-tint)', Icon: Target, title: 'tutorial.loop.s2.title', body: 'tutorial.loop.s2.body' },
  { accent: 'var(--p-danger)', tint: 'var(--p-danger-tint)', Icon: RefreshCw, title: 'tutorial.loop.s3.title', body: 'tutorial.loop.s3.body' },
];

export function CoreLoopTutorialModal() {
  const { t } = useT();
  const [open, setOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem(STORAGE_KEY) !== 'seen';
    } catch {
      return false;
    }
  });
  const [step, setStep] = useState(0);

  const dismiss = () => {
    try { localStorage.setItem(STORAGE_KEY, 'seen'); } catch { /* private mode — show once per session */ }
    setOpen(false);
  };

  if (!open) return null;

  const s = STEPS[step];
  const StepIcon = s.Icon;
  const isLast = step === STEPS.length - 1;

  return (
    <Modal open onClose={dismiss} subtitle={t('tutorial.loop.eyebrow')} title={t(s.title)} width={440}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
        <div
          style={{
            width: 56, height: 56, borderRadius: 16, background: s.tint,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: s.accent, flexShrink: 0,
          }}
        >
          <StepIcon size={26} strokeWidth={2.1} />
        </div>
        <span style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--p-muted)' }}>
          {step + 1} / {STEPS.length}
        </span>
      </div>

      <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--p-ink-2)', margin: '0 0 22px' }}>
        {t(s.body)}
      </p>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {STEPS.map((_, i) => (
          <span
            key={i}
            style={{
              height: 6, borderRadius: 3, flex: i === step ? '0 0 22px' : '0 0 6px',
              background: i === step ? s.accent : 'var(--p-border)',
              transition: 'flex-basis 0.2s ease, background 0.2s ease',
            }}
          />
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          type="button"
          onClick={dismiss}
          style={{ background: 'none', border: 'none', color: 'var(--p-muted)', fontSize: 13, cursor: 'pointer', padding: '8px 4px' }}
        >
          {t('tutorial.loop.skip')}
        </button>
        <div style={{ flex: 1 }} />
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((n) => n - 1)}
            style={{ background: 'none', border: 'none', color: 'var(--p-ink-2)', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', padding: '8px 6px' }}
          >
            {t('common.back')}
          </button>
        )}
        <button
          className="btn"
          onClick={() => (isLast ? dismiss() : setStep((n) => n + 1))}
          style={{ minWidth: 116 }}
        >
          {isLast ? t('tutorial.loop.start') : t('common.next')}
          <Glyph.ChevronR />
        </button>
      </div>
    </Modal>
  );
}
