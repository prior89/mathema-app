import * as Sentry from '@sentry/react';

/** No-op when VITE_SENTRY_DSN is unset — safe for PoC / IT builds. */
export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: Number(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
  });
}

export function tagSentryUser(user: { id: string; email?: string | null }) {
  if (!import.meta.env.VITE_SENTRY_DSN) return;
  Sentry.setUser({ id: user.id, email: user.email ?? undefined });
}

export function clearSentryUser() {
  if (!import.meta.env.VITE_SENTRY_DSN) return;
  Sentry.setUser(null);
}