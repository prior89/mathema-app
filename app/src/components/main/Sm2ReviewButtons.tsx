/**
 * SM-2 self-rating buttons — shared by WrongNoteDetailScreen + ReviewQueueScreen.
 */
import type { ReviewQuality } from '../../lib/mutations';
import { useT } from '../../lib/i18n';

const QUALITY_COLORS: Record<ReviewQuality, string> = {
  AGAIN: 'var(--p-danger)',
  HARD: 'var(--p-accent)',
  GOOD: 'var(--p-primary)',
  EASY: 'var(--p-success)',
};

export function Sm2ReviewButtons({
  disabled,
  onSelect,
  compact,
}: {
  disabled?: boolean;
  onSelect: (q: ReviewQuality) => void;
  compact?: boolean;
}) {
  const { t } = useT();
  // No interval hints on the buttons (2026-06-12 audit): showing "~6d×EF"
  // per button let students game the schedule (pick the rating that delays
  // the review) and leaked SM-2 internals. Rate honestly; the system decides.
  const buttons: Array<{ key: ReviewQuality; label: string }> = [
    { key: 'AGAIN', label: t('wn.detail.review.again') },
    { key: 'HARD', label: t('wn.detail.review.hard') },
    { key: 'GOOD', label: t('wn.detail.review.good') },
    { key: 'EASY', label: t('wn.detail.review.easy') },
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: compact ? 6 : 8 }}>
        {buttons.map((b) => (
          <button
            key={b.key}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(b.key)}
            className="card"
            style={{
              padding: compact ? '7px 4px' : '8px 6px',
              cursor: disabled ? 'not-allowed' : 'pointer',
              borderColor: `${QUALITY_COLORS[b.key]}40`,
              opacity: disabled ? 0.5 : 1,
            }}
          >
            <div style={{ fontSize: compact ? 12 : 13, fontWeight: 600, color: QUALITY_COLORS[b.key] }}>
              {b.label}
            </div>
          </button>
        ))}
      </div>
      {!compact && (
        <p style={{ marginTop: 8, fontSize: 11, color: 'var(--p-muted)', lineHeight: 1.5 }}>
          {t('wn.detail.review.note')}
        </p>
      )}
    </div>
  );
}