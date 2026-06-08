import { useState } from 'react';
import { submitAiFeedback } from '../lib/mutations';
import { useT } from '../lib/i18n';

type Props = {
  targetId: string;
  targetType?: 'EXPLANATION' | 'AI_INSIGHT';
  onSubmitted?: () => void;
};

const RATINGS = [
  { score: 5, labelKey: 'ai.feedback.great' as const },
  { score: 3, labelKey: 'ai.feedback.ok' as const },
  { score: 1, labelKey: 'ai.feedback.bad' as const },
];

export function AiFeedbackBar({ targetId, targetType = 'EXPLANATION', onSubmitted }: Props) {
  const { t } = useT();
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);

  if (done) {
    return (
      <div style={{ marginTop: 12, fontSize: 12, color: 'var(--p-muted)', textAlign: 'center' }}>
        {t('ai.feedback.thanks')}
      </div>
    );
  }

  async function rate(score: number) {
    if (pending) return;
    setPending(true);
    try {
      await submitAiFeedback({
        targetType,
        targetId,
        aiInsightRating: score,
      });
      setDone(true);
      onSubmitted?.();
    } catch {
      // silent — feedback must not block the solver flow
    } finally {
      setPending(false);
    }
  }

  return (
    <div style={{ marginTop: 14, padding: '12px 14px', borderRadius: 10, background: 'var(--p-surface-2)', border: '1px solid var(--p-border)' }}>
      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: 'var(--p-ink-2)' }}>
        {t('ai.feedback.prompt')}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {RATINGS.map((r) => (
          <button
            key={r.score}
            type="button"
            className="btn outline"
            disabled={pending}
            onClick={() => rate(r.score)}
            style={{ flex: 1, fontSize: 12, padding: '8px 6px' }}
          >
            {t(r.labelKey)}
          </button>
        ))}
      </div>
    </div>
  );
}