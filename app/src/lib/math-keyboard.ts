/** Math keyboard helpers — pure logic shared by MathKeyboard / MathInput. */

export interface MathKeyDef {
  id: string;
  /** Button face (may differ from inserted LaTeX). */
  label: string;
  insert: string;
  /** Cursor lands this many chars before the end of `insert`. */
  cursorOffsetFromEnd?: number;
  wide?: boolean;
}

export const MATH_KEYBOARD_ROWS: MathKeyDef[][] = [
  [
    { id: '7', label: '7', insert: '7' },
    { id: '8', label: '8', insert: '8' },
    { id: '9', label: '9', insert: '9' },
    { id: 'div', label: '÷', insert: '/' },
  ],
  [
    { id: '4', label: '4', insert: '4' },
    { id: '5', label: '5', insert: '5' },
    { id: '6', label: '6', insert: '6' },
    { id: 'mul', label: '×', insert: '\\times ' },
  ],
  [
    { id: '1', label: '1', insert: '1' },
    { id: '2', label: '2', insert: '2' },
    { id: '3', label: '3', insert: '3' },
    { id: 'minus', label: '−', insert: '-' },
  ],
  [
    { id: '0', label: '0', insert: '0' },
    { id: 'dot', label: '.', insert: '.' },
    { id: 'plus', label: '+', insert: '+' },
    { id: 'eq', label: '=', insert: '=' },
  ],
  [
    { id: 'pow', label: 'x^', insert: '^{}', cursorOffsetFromEnd: 1 },
    { id: 'sub', label: 'x_', insert: '_{}', cursorOffsetFromEnd: 1 },
    { id: 'pi', label: 'π', insert: '\\pi ' },
    { id: 'pm', label: '±', insert: '\\pm ' },
  ],
  [
    { id: 'sqrt', label: '√', insert: '\\sqrt{}', cursorOffsetFromEnd: 1 },
    { id: 'frac', label: 'a/b', insert: '\\frac{}{}', cursorOffsetFromEnd: 3 },
    { id: 'lparen', label: '(', insert: '()', cursorOffsetFromEnd: 1 },
    { id: 'rparen', label: ')', insert: ')' },
  ],
  [
    { id: 'space', label: '␣', insert: ' ', wide: true },
    { id: 'backspace', label: '⌫', insert: '', wide: true },
  ],
];

export function insertAtCursor(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  insert: string,
  cursorOffsetFromEnd = 0,
): { nextValue: string; nextCursor: number } {
  const start = Math.max(0, Math.min(selectionStart, value.length));
  const end = Math.max(start, Math.min(selectionEnd, value.length));
  const before = value.slice(0, start);
  const after = value.slice(end);
  const nextValue = before + insert + after;
  const nextCursor = Math.max(0, before.length + insert.length - cursorOffsetFromEnd);
  return { nextValue, nextCursor };
}

export function deleteAtCursor(
  value: string,
  selectionStart: number,
  selectionEnd: number,
): { nextValue: string; nextCursor: number } {
  if (selectionStart !== selectionEnd) {
    return insertAtCursor(value, selectionStart, selectionEnd, '', 0);
  }
  if (selectionStart <= 0) {
    return { nextValue: value, nextCursor: 0 };
  }
  const before = value.slice(0, selectionStart - 1);
  const after = value.slice(selectionStart);
  return { nextValue: before + after, nextCursor: before.length };
}

/** Wrap free-form student input for MathText preview (inline KaTeX). */
export function previewLatex(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (/(\$|\\\(|\\\[)/.test(trimmed)) return trimmed;
  return `$${trimmed}$`;
}