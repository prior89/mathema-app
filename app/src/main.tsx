import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Sentry from '@sentry/react';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { I18nProvider } from './lib/i18n';
import { initCapacitorBridge } from './native/capacitor-bridge';

// Sentry — VITE_SENTRY_DSN 미설정이면 no-op.
const dsn = (import.meta as any).env?.VITE_SENTRY_DSN as string | undefined;
if (dsn) {
  Sentry.init({
    dsn,
    environment: (import.meta as any).env?.MODE ?? 'development',
    tracesSampleRate: Number((import.meta as any).env?.VITE_SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
    // 개인식별정보 제거 — Default Privacy 강화
    sendDefaultPii: false,
  });
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false, retry: 1 } },
});

// 안드로이드 래퍼 전용 초기화 — web 빌드에서는 모두 no-op.
initCapacitorBridge().catch(() => { /* ignore */ });

// 인도 PoC — 한국인 개발자의 브라우저 ko-KR 이 자동으로 'ko' 로 저장돼버린 경우 강제로 'en' 으로 리셋.
// production 출시 시점에는 ko 토글로 명시 선택 가능 (그 때는 이 reset 제거).
try {
  if (localStorage.getItem('mathema.lang') === 'ko') {
    localStorage.setItem('mathema.lang', 'en');
  }
} catch { /* ignore */ }

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
    <I18nProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </I18nProvider>
  </React.StrictMode>,
);
