/* Slide-up feedback sheet shown after an answer is checked.
 * Replaces the old inline result card: the verdict, the celebration, the
 * next action live in one anchored panel so the
 * student's eye never has to hunt between mid-scroll card and footer. */
import { useEffect, useId, useRef, type KeyboardEvent } from 'react';
import { useT } from '../../lib/i18n';
import MathText from '../MathText';

export function AnswerFeedbackSheet({
  correct,
  subText,
  rationale,
  correctAnswerText,
  actionLabel,
  actionPending,
  onAction,
  onDismiss,
  reteachCta,
}: {
  correct: boolean;
  /** Verdict subline — parent escalates the copy across retry attempts. */
  subText: string;
  /** Distractor rationale for the picked wrong choice — diagnostic feedback
      that doesn't give the answer away (retrieval practice). */
  rationale: string | null;
  correctAnswerText: string | null;
  streakDays: number | null;
  actionLabel: string;
  actionPending: boolean;
  onAction: () => void;
  onDismiss: () => void;
  /** Optional process-level feedback (Hattie & Timperley): a secondary CTA
   *  that sends the student back to the ConceptLesson step matched to the
   *  distractorType they hit. Caller resolves the label and route. Null
   *  hides the row entirely so older call sites stay unchanged. */
  reteachCta?: { label: string; onClick: () => void } | null;
}) {
  const { t, lang } = useT();
  const sheetRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLButtonElement>(null);
  const onDismissRef = useRef(onDismiss);
  const titleId = useId();
  const descriptionId = useId();
  const dismissLabel = lang === 'ko' ? '피드백 닫기' : lang === 'hi' ? 'फ़ीडबैक बंद करें' : 'Close feedback';

  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const firstFocusable = sheetRef.current?.querySelector<HTMLElement>('button:not([disabled])');
    (actionRef.current?.disabled ? firstFocusable : actionRef.current)?.focus();
    return () => {
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
    };
  }, []);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      onDismissRef.current();
      return;
    }
    if (event.key !== 'Tab') return;

    const focusable = Array.from(
      sheetRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? [],
    );
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || !sheetRef.current?.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || !sheetRef.current?.contains(active))) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <>
      <div className="fb-backdrop" aria-hidden="true" onClick={onDismiss} />
      <div
        ref={sheetRef}
        className={`fb-sheet ${correct ? 'correct' : 'wrong'}`}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onKeyDown={handleKeyDown}
      >
        <button
          type="button"
          className="grip"
          onClick={onDismiss}
          aria-label={dismissLabel}
          style={{
            width: 44,
            height: 32,
            padding: 0,
            border: 0,
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span aria-hidden="true" style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--p-border-strong)' }} />
        </button>
        <div className="fb-row">
          <div className="fb-icon">{correct ? '✓' : '↺'}</div>
          <div className="fb-copy">
            <div className="fb-title" id={titleId}>
              {correct ? t('practice.feedback.correct') : t('practice.feedback.wrong')}
            </div>
            <div className="fb-sub" id={descriptionId}>{subText}</div>
          </div>
        </div>
        {!correct && rationale && (
          <div className="fb-answer">
            {t('practice.wrong.rationale')} <MathText text={rationale} />
          </div>
        )}
        {!correct && correctAnswerText && (
          <div className="fb-answer">
            {t('practice.wrong.correctAnswer')} <MathText text={correctAnswerText} />
          </div>
        )}
        <button ref={actionRef} type="button" className="btn" onClick={onAction} disabled={actionPending}>
          {actionLabel}
        </button>
        {!correct && reteachCta && (
          <button type="button" className="btn text" style={{ marginTop: 6 }} onClick={reteachCta.onClick}>
            {reteachCta.label}
          </button>
        )}
      </div>
    </>
  );
}
