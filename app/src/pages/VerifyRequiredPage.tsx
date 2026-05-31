import { useState } from 'react';
import { post } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useT } from '../lib/i18n';
import { AuthShell } from './LoginPage';

export default function VerifyRequiredPage() {
  const { user, logout, refreshUser } = useAuth();
  const { lang } = useT();
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const copy = lang === 'ko'
    ? {
        title: '이메일 확인이 필요해요',
        subtitle: 'Matheo',
        body: '학습 기록과 결제를 보호하려면 먼저 이메일 주소가 본인 것인지 확인해야 합니다.',
        sent: '인증 메일을 다시 보냈어요. 받은 편지함과 스팸함을 확인해 주세요.',
        resend: '인증 메일 다시 보내기',
        refresh: '인증 완료했어요',
        logout: '다른 이메일로 가입하기',
        failed: '메일을 보내지 못했어요. 잠시 후 다시 시도해 주세요.',
      }
    : {
        title: 'Verify your email',
        subtitle: 'Matheo',
        body: 'Please confirm that this email belongs to you before using learning and billing features.',
        sent: 'Verification email sent. Check your inbox and spam folder.',
        resend: 'Resend verification email',
        refresh: "I've verified it",
        logout: 'Use a different email',
        failed: 'Could not send the email. Please try again in a moment.',
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
    try {
      await refreshUser();
      window.location.assign('/app');
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
        {sent && <div style={{ fontSize: 13, color: '#5A8A45' }}>{copy.sent}</div>}
        {err && <div style={{ fontSize: 13, color: '#C25E2E' }}>{err}</div>}
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
