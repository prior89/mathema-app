import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { get, post } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useT } from '../lib/i18n';
import type { Me } from '../lib/queries';
import { AuthShell } from './LoginPage';

export default function VerifyRequiredPage() {
  const nav = useNavigate();
  const { user, logout, refreshUser } = useAuth();
  const { lang } = useT();
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const isDev = import.meta.env.DEV;
  const copy = lang === 'ko'
    ? {
        title: '이메일 확인이 필요해요',
        subtitle: 'Matheo',
        body: '학습 기록과 결제 기능을 보호하려면 먼저 이메일 주소를 확인해야 해요.',
        sent: isDev
          ? '개발 환경에서는 실제 이메일 대신 서버 로그에 인증 링크가 출력돼요.'
          : '인증 메일을 보냈어요. 받은편지함과 스팸함을 확인해 주세요.',
        help: isDev
          ? '로컬 테스트 중이라면 서버 로그의 verify-email 링크를 열고, 이 화면으로 돌아와 인증 상태를 확인해 주세요.'
          : '메일이 보이지 않으면 스팸함을 확인하거나 잠시 뒤 다시 보내 주세요.',
        resend: '인증 메일 다시 보내기',
        refresh: '인증 상태 확인',
        logout: '다른 이메일로 로그인',
        failed: '메일을 보내지 못했어요. 잠시 후 다시 시도해 주세요.',
        notYet: '아직 인증이 확인되지 않았어요. 메일의 인증 링크를 연 뒤 다시 눌러 주세요.',
        refreshFailed: '인증 상태를 확인하지 못했어요. 연결을 확인하고 다시 시도해 주세요.',
      }
    : {
        title: 'Verify your email',
        subtitle: 'Matheo',
        body: 'Please confirm that this email belongs to you before using learning and billing features.',
        sent: isDev
          ? 'In development, the verification link is printed in the server log instead of being emailed.'
          : 'Verification email sent. Check your inbox and spam folder.',
        help: isDev
          ? 'Open the verify-email link from the server log, then come back here and check the status.'
          : 'If you do not see the email, check spam or resend it in a moment.',
        resend: 'Resend verification email',
        refresh: 'Check verification status',
        logout: 'Use a different email',
        failed: 'Could not send the email. Please try again in a moment.',
        notYet: 'This email is not verified yet. Open the email link, then check again.',
        refreshFailed: 'Could not check verification status. Check your connection and try again.',
      };

  const resend = async () => {
    setBusy(true);
    setErr(null);
    try {
      await post('/auth/resend-verification');
      setSent(true);
    } catch {
      setErr(copy.failed);
    } finally {
      setBusy(false);
    }
  };

  const refresh = async () => {
    setBusy(true);
    setErr(null);
    try {
      const me = await get<Me>('/users/me');
      await refreshUser();
      if (me.emailVerifiedAt) {
        nav('/app', { replace: true });
        return;
      }
      setErr(copy.notYet);
    } catch {
      setErr(copy.refreshFailed);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell title={copy.title} subtitle={copy.subtitle}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ padding: 14, background: '#F4F7FB', border: '1px solid #D8E1EF', borderRadius: 6 }}>
          <div style={{ fontSize: 13, color: '#5C6B85', lineHeight: 1.5 }}>{copy.body}</div>
          <div style={{ marginTop: 10, fontSize: 13, fontWeight: 700, color: '#142850', wordBreak: 'break-all' }}>
            {user?.email}
          </div>
        </div>
        {sent && (
          <div role="status" style={{ fontSize: 13, color: '#5A8A45', lineHeight: 1.45 }}>
            {copy.sent}
          </div>
        )}
        <div style={{ fontSize: 12.5, color: '#5C6B85', lineHeight: 1.45 }}>
          {copy.help}
        </div>
        {err && <div role="alert" style={{ fontSize: 13, color: '#C25E2E', lineHeight: 1.45 }}>{err}</div>}
        <button type="button" onClick={resend} disabled={busy} style={primaryButton}>
          {copy.resend}
        </button>
        <button type="button" onClick={refresh} disabled={busy} style={secondaryButton}>
          {copy.refresh}
        </button>
        <button type="button" onClick={logout} disabled={busy} style={linkButton}>
          {copy.logout}
        </button>
      </div>
    </AuthShell>
  );
}

const primaryButton = {
  width: '100%',
  padding: '12px 14px',
  border: 'none',
  borderRadius: 6,
  background: '#142850',
  color: 'white',
  fontWeight: 700,
  cursor: 'pointer',
} as const;

const secondaryButton = {
  ...primaryButton,
  background: '#EEF3FA',
  color: '#142850',
  border: '1px solid #D8E1EF',
} as const;

const linkButton = {
  border: 'none',
  background: 'transparent',
  color: '#5C6B85',
  fontWeight: 600,
  cursor: 'pointer',
  padding: 8,
} as const;
