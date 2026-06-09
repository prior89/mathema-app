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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const alertClass =
    status === 'success' ? 'alert success' :
    status === 'failed' ? 'alert error' : 'alert info';
  const msg = status === 'verifying' ? t('verify.verifying') : status === 'success' ? t('verify.success') : t('verify.failed');

  return (
    <AuthShell title={t('verify.title')} subtitle={t('app.brand')}>
      <div className={alertClass} style={{ marginBottom: 14 }}>
        {msg}
      </div>
      {status !== 'verifying' && (
        <div style={{ textAlign: 'center' }}>
          <Link to="/" className="link-primary">{t('verify.goHome')}</Link>
        </div>
      )}
    </AuthShell>
  );
}