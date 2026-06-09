/**
 * MathInput — text field with optional LaTeX math keyboard.
 *
 * Outputs a plain string (LaTeX-ish tokens) for server grading. PR-19 wires
 * this into ReviewQueueScreen / SoloProblemScreen; PR-19a normalizes on server.
 */
import { useCallback, useRef, useState } from 'react';
import MathText from './MathText';
import { MathKeyboard } from './MathKeyboard';
import {
  deleteAtCursor,
  insertAtCursor,
  previewLatex,
  type MathKeyDef,
} from '../lib/math-keyboard';
import { useT } from '../lib/i18n';

export interface MathInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
  style?: React.CSSProperties;
  /** Live KaTeX preview above the field. */
  showPreview?: boolean;
  defaultKeyboardOpen?: boolean;
}

export function MathInput({
  value,
  onChange,
  placeholder,
  disabled = false,
  onKeyDown,
  className,
  style,
  showPreview = true,
  defaultKeyboardOpen = false,
}: MathInputProps) {
  const { t } = useT();
  const inputRef = useRef<HTMLInputElement>(null);
  const [keyboardOpen, setKeyboardOpen] = useState(defaultKeyboardOpen);

  const applyEdit = useCallback(
    (nextValue: string, nextCursor: number) => {
      onChange(nextValue);
      requestAnimationFrame(() => {
        const el = inputRef.current;
        if (!el) return;
        el.focus();
        el.setSelectionRange(nextCursor, nextCursor);
      });
    },
    [onChange],
  );

  const handleInsert = useCallback(
    (key: MathKeyDef) => {
      const el = inputRef.current;
      const start = el?.selectionStart ?? value.length;
      const end = el?.selectionEnd ?? value.length;
      const { nextValue, nextCursor } = insertAtCursor(
        value,
        start,
        end,
        key.insert,
        key.cursorOffsetFromEnd ?? 0,
      );
      applyEdit(nextValue, nextCursor);
    },
    [applyEdit, value],
  );

  const handleBackspace = useCallback(() => {
    const el = inputRef.current;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    const { nextValue, nextCursor } = deleteAtCursor(value, start, end);
    applyEdit(nextValue, nextCursor);
  }, [applyEdit, value]);

  const preview = showPreview ? previewLatex(value) : '';

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }}>
      {preview && (
        <div
          aria-live="polite"
          style={{
            minHeight: 28,
            padding: '6px 10px',
            borderRadius: 10,
            background: 'var(--p-surface-2)',
            border: '1px solid var(--p-border)',
            fontSize: 15,
            color: 'var(--p-ink)',
            overflowX: 'auto',
          }}
        >
          <MathText text={preview} />
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          inputMode={keyboardOpen ? 'none' : 'text'}
          aria-label={t('mathInput.aria')}
          style={{
            flex: 1,
            minHeight: 44,
            padding: '0 14px',
            borderRadius: 12,
            border: '1px solid var(--p-border-strong)',
            background: 'var(--p-surface)',
            color: 'var(--p-ink)',
            fontFamily: 'var(--font-mono)',
            fontSize: 15,
            outline: 'none',
          }}
        />
        <button
          type="button"
          onClick={() => setKeyboardOpen((o) => !o)}
          disabled={disabled}
          aria-pressed={keyboardOpen}
          aria-label={keyboardOpen ? t('mathInput.hideKeyboard') : t('mathInput.showKeyboard')}
          style={{
            width: 44,
            minHeight: 44,
            borderRadius: 12,
            flexShrink: 0,
            background: keyboardOpen ? 'var(--p-primary-tint)' : 'var(--p-surface-2)',
            color: keyboardOpen ? 'var(--p-primary)' : 'var(--p-muted)',
            border: '1px solid var(--p-border)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            fontSize: 18,
          }}
        >
          ⌨
        </button>
      </div>

      {keyboardOpen && !disabled && (
        <MathKeyboard onInsert={handleInsert} onBackspace={handleBackspace} />
      )}
    </div>
  );
}

export default MathInput;