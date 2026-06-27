import { useState } from 'react';
import { acquireSocialToken, socialSignIn, AuthTokens, SocialProvider } from '../../lib/socialSignIn';

/**
 * KR social sign-in buttons (Kakao + Naver) — the default KR rails.
 *
 * Standalone/scaffold: NOT yet imported by LoginPage (that file is owned by the
 * frontend auth work-stream). To wire it, render <SocialSignInButtons onTokens=
 * {(t) => tokens.set(t.accessToken, t.refreshToken)} /> from the login screen.
 * In dev with VITE_SOCIAL_AUTH_MOCK=true it logs in end-to-end without any SDK.
 */
export function SocialSignInButtons({
  onTokens,
  onError,
}: {
  onTokens: (tokens: AuthTokens) => void | Promise<void>;
  onError?: (err: unknown) => void;
}) {
  const [busy, setBusy] = useState<SocialProvider | null>(null);

  const run = async (provider: SocialProvider) => {
    setBusy(provider);
    try {
      const token = await acquireSocialToken(provider);
      const tokens = await socialSignIn(provider, token);
      await onTokens(tokens);
    } catch (err) {
      onError?.(err);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <button
        type="button"
        disabled={busy !== null}
        onClick={() => run('kakao')}
        style={{
          width: '100%', padding: '12px', borderRadius: 10, border: 'none',
          background: '#FEE500', color: '#191600', fontWeight: 700, fontSize: 14,
          cursor: busy ? 'default' : 'pointer', opacity: busy && busy !== 'kakao' ? 0.6 : 1,
        }}
      >
        {busy === 'kakao' ? '…' : '카카오로 시작하기'}
      </button>
      <button
        type="button"
        disabled={busy !== null}
        onClick={() => run('naver')}
        style={{
          width: '100%', padding: '12px', borderRadius: 10, border: 'none',
          background: '#03C75A', color: '#FFFFFF', fontWeight: 700, fontSize: 14,
          cursor: busy ? 'default' : 'pointer', opacity: busy && busy !== 'naver' ? 0.6 : 1,
        }}
      >
        {busy === 'naver' ? '…' : '네이버로 시작하기'}
      </button>
    </div>
  );
}
