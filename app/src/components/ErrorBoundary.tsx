import { Component, type ErrorInfo, type ReactNode } from 'react';
import * as Sentry from '@sentry/react';
import { BrandLogo } from './Brand';

type Props = { children: ReactNode };
type State = { error: Error | null };

/**
 * Catches unhandled React render errors so a white screen doesn't brick the
 * Capacitor shell. Reports to Sentry when VITE_SENTRY_DSN is configured.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.VITE_SENTRY_DSN) {
      Sentry.captureException(error, {
        contexts: { react: { componentStack: info.componentStack ?? undefined } },
      });
    }
  }

  private reset = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;

    // Class component outside the i18n provider — read the stored language
    // directly so the crash screen isn't English-only for KR users.
    let ko = true;
    try {
      const pref = localStorage.getItem('mathema.lang');
      ko = pref ? pref === 'ko' : true; // KR-first default
    } catch { /* private mode — keep KR default */ }

    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          padding: 24,
          textAlign: 'center',
          background: 'var(--p-primary-tint, oklch(0.95 0.022 175))',
          color: 'var(--p-ink, #1a2e2a)',
        }}
      >
        <BrandLogo size="md" />
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
          {ko ? '문제가 발생했어요' : 'Something went wrong'}
        </h1>
        <p style={{ margin: 0, maxWidth: 360, lineHeight: 1.5, opacity: 0.85 }}>
          {ko
            ? '예상치 못한 오류가 발생했어요. 다시 시도하거나 앱을 새로고침해 주세요.'
            : 'An unexpected error occurred. You can try again or reload the app.'}
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button
            type="button"
            onClick={this.reset}
            style={{
              padding: '10px 18px',
              borderRadius: 8,
              border: 'none',
              background: 'var(--p-primary, #2d6a5a)',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            {ko ? '다시 시도' : 'Try again'}
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 18px',
              borderRadius: 8,
              border: '1px solid var(--p-primary, #2d6a5a)',
              background: 'transparent',
              color: 'var(--p-primary, #2d6a5a)',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            {ko ? '새로고침' : 'Reload'}
          </button>
        </div>
      </div>
    );
  }
}