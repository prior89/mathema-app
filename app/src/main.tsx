import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { bootstrapTheme, ThemeProvider } from './context/ThemeContext';
import { I18nProvider } from './lib/i18n';
import { initCapacitorBridge } from './native/capacitor-bridge';

bootstrapTheme();

// Sentry is intentionally omitted in v1.0 — DSN provisioning is Phase 2.
// Keeping @sentry/react in the bundle for a no-op init wastes ~30KB; we'll
// re-introduce Sentry.init + tagSentry once the Sentry project exists.

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false, retry: 1 } },
});

// 안드로이드 래퍼 전용 초기화 — web 빌드에서는 모두 no-op.
initCapacitorBridge().catch(() => { /* ignore */ });

// Korean curriculum lands as a real country branch (User.country === 'KR'),
// so 'ko' is now a legitimate persisted language. The startup ko→en force-
// reset that protected the India PoC against dev browser locale ko-KR has
// been removed — i18n.tsx's init no longer picks ko from browser locale,
// and KR users get ko set explicitly via I18nCountrySync after login.

/**
 * Backspace guard — in some environments (Capacitor, old Edge, keyboard hook
 * extensions) Backspace fires history.back() when focus is outside an input,
 * which wipes the page and looks like "Backspace doesn't work" to the user.
 *
 * Policy:
 *   - IME composition (Korean / Japanese / Chinese): never interfere — let the
 *     IME consume the key to delete jamo / kana / hanzi normally.
 *   - <input>, <textarea>, contenteditable: never prevent default (normal char
 *     deletion).
 *   - Everywhere else (body, button, div, etc.): block history.back().
 */
window.addEventListener('keydown', (e) => {
  if (e.key !== 'Backspace') return;
  // IME composition — Korean Hangul jamo deletion, Japanese romaji, etc.
  // Letting the browser handle it is mandatory or composition state breaks.
  if (e.isComposing || (e as KeyboardEvent).keyCode === 229) return;

  const t = e.target as HTMLElement | null;
  if (!t) return;
  const tag = t.tagName?.toLowerCase();
  if (tag === 'textarea') return;
  if (tag === 'input') {
    const input = t as HTMLInputElement;
    // Only block when the input cannot receive edits anyway.
    if (input.disabled || input.readOnly) e.preventDefault();
    return;
  }
  if (t.isContentEditable) return;
  // body / button / div / etc. — block the browser's default "go back".
  e.preventDefault();
}, { capture: true });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <I18nProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AuthProvider>
              <App />
            </AuthProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </I18nProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
