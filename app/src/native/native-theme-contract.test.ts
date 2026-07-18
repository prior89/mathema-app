import { readFileSync } from 'node:fs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { applyThemeMode } from '../context/ThemeContext';

const originalDocument = globalThis.document;

afterEach(() => {
  if (originalDocument) globalThis.document = originalDocument;
  else delete (globalThis as { document?: Document }).document;
});

describe('web/native theme contract', () => {
  it.each([
    ['dark', true, 'dark'],
    ['light', false, 'light'],
  ] as const)('updates tokens and browser chrome for %s mode', (mode, expectedDark, scheme) => {
    const toggle = vi.fn();
    const style: { colorScheme?: string } = {};
    (globalThis as { document: unknown }).document = {
      documentElement: { classList: { toggle }, style },
    };

    expect(applyThemeMode(mode)).toBe(expectedDark);
    expect(toggle).toHaveBeenCalledWith('dark', expectedDark);
    expect(style.colorScheme).toBe(scheme);
  });

  it('does not leave Vite-ignored bare imports in the Android WebView bundle', () => {
    const bridgeSources = [
      new URL('./capacitor-bridge.ts', import.meta.url),
      new URL('./push-bridge.ts', import.meta.url),
    ].map((url) => readFileSync(url, 'utf8'));

    for (const source of bridgeSources) {
      expect(source).not.toMatch(/import\s*\(\s*\/\*\s*@vite-ignore/);
    }
  });
});
