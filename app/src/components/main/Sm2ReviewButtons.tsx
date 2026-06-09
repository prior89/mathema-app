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
  const buttons: Array<{ key: ReviewQuality; label: string; sub: string }> = [
    { key: 'AGAIN', label: t('wn.detail.review.again'), sub: '~1d' },
    { key: 'HARD', label: t('wn.detail.review.hard'), sub: '~1d' },
    { key: 'GOOD', label: t('wn.detail.review.good'), sub: '~6d' },
    { key: 'EASY', label: t('wn.detail.review.easy'), sub: '~6d×EF' },
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
              padding: compact ? '8px 4px' : '10px 6px',
              cursor: disabled ? 'not-allowed' : 'pointer',
              borderColor: `${QUALITY_COLORS[b.key]}40`,
              opacity: disabled ? 0.5 : 1,
            }}
          >
            <div style={{ fontSize: compact ? 12 : 13, fontWeight: 600, color: QUALITY_COLORS[b.key] }}>
              {b.label}
            </div>
            <div style={{ fontSize: 10, color: 'var(--p-muted)', fontFamily: 'var(--font-mono)' }}>{b.sub}</div>
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