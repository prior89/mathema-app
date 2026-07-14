/* Slide-up feedback sheet shown after an answer is checked.
 * Replaces the old inline result card: the verdict, the celebration, the
 * next action live in one anchored panel so the
 * student's eye never has to hunt between mid-scroll card and footer. */
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
  const { t } = useT();
  return (
    <>
      <div className="fb-backdrop" onClick={onDismiss} />
      <div
        className={`fb-sheet ${correct ? 'correct' : 'wrong'}`}
        role="alertdialog"
        aria-label={correct ? t('practice.feedback.correct') : t('practice.feedback.wrong')}
      >
        <div className="grip" onClick={onDismiss} />
        <div className="fb-row">
          <div className="fb-icon">{correct ? '✓' : '↺'}</div>
          <div className="fb-copy">
            <div className="fb-title">
              {correct ? t('practice.feedback.correct') : t('practice.feedback.wrong')}
            </div>
            <div className="fb-sub">{subText}</div>
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
        <button className="btn" onClick={onAction} disabled={actionPending}>
          {actionLabel}
        </button>
        {!correct && reteachCta && (
          <button className="btn text" style={{ marginTop: 6 }} onClick={reteachCta.onClick}>
            {reteachCta.label}
          </button>
        )}
      </div>
    </>
  );
}
