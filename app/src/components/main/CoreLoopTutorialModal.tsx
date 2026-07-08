import { useCallback, useEffect, useState } from 'react';
import { Camera, RefreshCw, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useT } from '../../lib/i18n';
import type { TranslationKey } from '../../lib/translations';
import { Glyph } from '../onboarding/Glyph';
import { track } from '../../lib/analytics';

/**
 * First-run walkthrough of the core loop — solve → wrong-note + weakness →
 * weak-spot review. Shown once (localStorage-gated) the first time a learner
 * lands on Home.
 *
 * Renders as a bottom sheet (same family as AnswerFeedbackSheet / .bottom-sheet),
 * not the shared centered Modal — phone viewport is ≤428px and the rest of the
 * app already speaks in full-width 54px CTAs + slide-up panels.
 */
const STORAGE_KEY = 'mathema.tutorial.coreLoop.v1';

const STEPS: Array<{
  accent: string;
  tint: string;
  border: string;
  Icon: typeof Camera;
  title: TranslationKey;
  body: TranslationKey;
}> = [
  {
    accent: 'var(--p-primary)',
    tint: 'var(--p-primary-tint)',
    border: 'var(--p-primary)',
    Icon: Camera,
    title: 'tutorial.loop.s1.title',
    body: 'tutorial.loop.s1.body',
  },
  {
    accent: 'var(--p-accent-ink)',
    tint: 'var(--p-accent-tint)',
    border: 'var(--p-accent)',
    Icon: Target,
    title: 'tutorial.loop.s2.title',
    body: 'tutorial.loop.s2.body',
  },
  {
    accent: 'var(--p-danger)',
    tint: 'var(--p-danger-tint)',
    border: 'var(--p-danger)',
    Icon: RefreshCw,
    title: 'tutorial.loop.s3.title',
    body: 'tutorial.loop.s3.body',
  },
];

export function CoreLoopTutorialModal() {
  const { t } = useT();
  const navigate = useNavigate();
  const [open, setOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem(STORAGE_KEY) !== 'seen';
    } catch {
      return false;
    }
  });
  const [step, setStep] = useState(0);

  const dismiss = useCallback((opts?: { startLearn?: boolean }) => {
    try {
      localStorage.setItem(STORAGE_KEY, 'seen');
    } catch {
      /* private mode — show once per session */
    }
    setOpen(false);
    track(opts?.startLearn ? 'tutorial.loop.start' : 'tutorial.loop.dismiss', {
      step: step + 1,
    });
    if (opts?.startLearn) navigate('/app/learn');
  }, [navigate, step]);

  // Escape closes (same as Modal) — but backdrop does NOT, so first-run isn't
  // dismissed by an accidental tap outside the sheet.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, dismiss]);

  if (!open) return null;

  const s = STEPS[step];
  const StepIcon = s.Icon;
  const isLast = step === STEPS.length - 1;

  return (
    <>
      <div className="tutorial-backdrop" aria-hidden />
      <div
        className="tutorial-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutorial-loop-title"
        style={{ borderTopColor: s.border }}
      >
        <div className="grip" aria-hidden />

        <div className="eyebrow" style={{ marginBottom: 10 }}>
          {t('tutorial.loop.eyebrow')}
        </div>

        <div className="tutorial-hero">
          <div className="tutorial-icon" style={{ background: s.tint, color: s.accent }}>
            <StepIcon size={26} strokeWidth={2.1} aria-hidden />
          </div>
          <span className="step-pill" style={{ background: s.tint, color: s.accent }}>
            {step + 1} / {STEPS.length}
          </span>
        </div>

        <h2 id="tutorial-loop-title" className="tutorial-title">
          {t(s.title)}
        </h2>
        <p className="tutorial-body">{t(s.body)}</p>

        {/* Onboarding-style segment progress (matches .mathema-app .steps) */}
        <div className="steps" style={{ padding: '4px 0 16px' }} aria-hidden>
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`dot${i === step ? ' active' : ''}${i < step ? ' done' : ''}`}
              style={i === step ? { background: s.border } : undefined}
            />
          ))}
        </div>

        <div className="tutorial-actions">
          <button
            type="button"
            className="btn"
            onClick={() => (isLast ? dismiss({ startLearn: true }) : setStep((n) => n + 1))}
          >
            {isLast ? t('tutorial.loop.start') : t('common.next')}
            <Glyph.ChevronR />
          </button>
          <div className="tutorial-secondary">
            {step > 0 ? (
              <button type="button" className="btn text" onClick={() => setStep((n) => n - 1)}>
                {t('common.back')}
              </button>
            ) : (
              <span />
            )}
            <button type="button" className="btn text" onClick={() => dismiss()}>
              {t('tutorial.loop.skip')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
