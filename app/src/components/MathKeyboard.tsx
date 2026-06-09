/**
 * MathKeyboard — LaTeX token palette for student answer entry.
 *
 * Inserts tokens at the caller's cursor via `onInsert` / `onBackspace`.
 * Layout tokens: ^, _, \frac, \sqrt, π, ±, parentheses, digits, operators.
 */
import { MATH_KEYBOARD_ROWS, type MathKeyDef } from '../lib/math-keyboard';
import { useT } from '../lib/i18n';

export interface MathKeyboardProps {
  onInsert: (key: MathKeyDef) => void;
  onBackspace: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function MathKeyboard({ onInsert, onBackspace, className, style }: MathKeyboardProps) {
  const { t } = useT();

  return (
    <div
      className={className}
      role="group"
      aria-label={t('mathKeyboard.aria')}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        padding: 8,
        borderRadius: 12,
        border: '1px solid var(--p-border)',
        background: 'var(--p-surface-2)',
        ...style,
      }}
    >
      {MATH_KEYBOARD_ROWS.map((row, rowIdx) => (
        <div
          key={rowIdx}
          style={{
            display: 'grid',
            gridTemplateColumns: row.some((k) => k.wide) ? '1fr 1fr' : 'repeat(4, 1fr)',
            gap: 6,
          }}
        >
          {row.map((key) => (
            <button
              key={key.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                if (key.id === 'backspace') onBackspace();
                else onInsert(key);
              }}
              aria-label={
                key.id === 'backspace'
                  ? t('mathKeyboard.backspace')
                  : t('mathKeyboard.insert', { token: key.label })
              }
              style={{
                minHeight: 40,
                borderRadius: 10,
                border: '1px solid var(--p-border)',
                background: key.id === 'backspace' ? 'var(--p-surface)' : 'var(--p-surface)',
                color: 'var(--p-ink)',
                fontFamily: key.id === 'frac' ? 'inherit' : 'var(--font-mono)',
                fontSize: key.id === 'frac' ? 13 : 15,
                fontWeight: 600,
                cursor: 'pointer',
                padding: '6px 4px',
              }}
            >
              {key.label}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

export default MathKeyboard;