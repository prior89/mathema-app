import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { post, get } from '../lib/api';
import { useT } from '../lib/i18n';
import { AuthShell } from './LoginPage';

type Preview = {
  childName: string;
  parentName: string | null;
  country: string;
  method: string;
  policyVersion: string;
};

export default function GuardianConsentVerifyPage() {
  const { t } = useT();
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const [preview, setPreview] = useState<Preview | null>(null);
  const [status, setStatus] = useState<'loading' | 'working' | 'success' | 'failed'>('loading');

  useEffect(() => {
    if (!token) { setStatus('failed'); return; }
    get<Preview>(`/guardian-consent/preview?token=${encodeURIComponent(token)}`)
      .then((p) => { setPreview(p); setStatus('working'); })
      .catch(() => setStatus('failed'));
  }, [token]);

  useEffect(() => {
    if (status !== 'working' || !token) return;
    post('/guardian-consent/verify', { token })
      .then(() => setStatus('success'))
      .catch(() => setStatus('failed'));
  }, [status, token]);

  const msg =
    status === 'loading' || status === 'working' ? t('guardianConsent.verify.working')
    : status === 'success' ? t('guardianConsent.verify.success')
    : t('guardianConsent.verify.failed');

  const alertClass =
    status === 'success' ? 'alert success'
    : status === 'failed' ? 'alert error'
    : 'alert info';

  return (
    <AuthShell title={t('guardianConsent.verify.title')} subtitle={t('app.brand')}>
      {preview && status !== 'failed' && (
        <p style={{ fontSize: 14, color: 'var(--p-muted)', marginBottom: 14 }}>
          {t('guardianConsent.verify.forChild', { name: preview.childName })}
        </p>
      )}
      <div className={alertClass} style={{ marginBottom: 14 }}>{msg}</div>
      {status !== 'loading' && status !== 'working' && (
        <div style={{ textAlign: 'center' }}>
          <Link to="/login" className="link-primary">{t('guardianConsent.verify.goLogin')}</Link>
        </div>
      )}
    </AuthShell>
  );
}