import { useState } from 'react';
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
  title: TranslationKey;
  body: TranslationKey;
}> = [
  { accent: 'var(--p-primary)', tint: 'var(--p-primary-tint)', title: 'tutorial.loop.s1.title', body: 'tutorial.loop.s1.body' },
  { accent: 'var(--p-accent)', tint: 'var(--p-accent-tint)', title: 'tutorial.loop.s2.title', body: 'tutorial.loop.s2.body' },
  { accent: 'var(--p-danger)', tint: 'var(--p-danger-tint)', title: 'tutorial.loop.s3.title', body: 'tutorial.loop.s3.body' },
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
  const isLast = step === STEPS.length - 1;

  return (
    <Modal open onClose={dismiss} subtitle={t('tutorial.loop.eyebrow')} title={t(s.title)} width={460}>
      <div
        style={{
          width: 52, height: 52, borderRadius: 14, background: s.tint,
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
          fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: s.accent,
        }}
      >
        {step + 1}
      </div>

      <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--p-ink-2)', margin: '0 0 22px' }}>
        {t(s.body)}
      </p>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {STEPS.map((_, i) => (
          <span
            key={i}
            style={{
              height: 6, borderRadius: 3, flex: i === step ? '0 0 20px' : '0 0 6px',
              background: i === step ? 'var(--p-primary)' : 'var(--p-border)',
              transition: 'flex-basis 0.2s ease',
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
        <button
          className="btn"
          onClick={() => (isLast ? dismiss() : setStep((n) => n + 1))}
          style={{ minWidth: 120 }}
        >
          {isLast ? t('tutorial.loop.start') : t('common.next')}
          <Glyph.ChevronR />
        </button>
      </div>
    </Modal>
  );
}
