import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { post } from '../lib/api';
import { useT } from '../lib/i18n';
import { AuthShell } from './LoginPage';
import { useAuth } from '../context/AuthContext';

export default function VerifyEmailPage() {
  const { t } = useT();
  const { refreshUser } = useAuth();
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');

  useEffect(() => {
    if (!token) { setStatus('failed'); return; }
    post('/auth/verify-email', { token })
      .then(async () => {
        await refreshUser();
        setStatus('success');
      })
      .catch(() => setStatus('failed'));
  // refreshUser is intentionally omitted: AuthContext recreates it on each
  // render, while verification should run exactly once per token.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const tone = status === 'success' ? '#5A8A45' : status === 'failed' ? '#C25E2E' : '#5C6B85';
  const msg = status === 'verifying' ? t('verify.verifying') : status === 'success' ? t('verify.success') : t('verify.failed');

  return (
    <AuthShell title={t('verify.title')} subtitle={t('app.brand')}>
      <div style={{ padding: 14, fontSize: 13, color: tone, backgroundColor: `${tone}15`, borderRadius: 4, marginBottom: 14 }}>
        {msg}
      </div>
      {status !== 'verifying' && (
        <div style={{ textAlign: 'center' }}>
          <Link to="/" style={{ color: '#142850', fontWeight: 600, fontSize: 13 }}>{t('verify.goHome')}</Link>
        </div>
      )}
    </AuthShell>
  );
}
