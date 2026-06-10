import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { post } from '../lib/api';
import { useT } from '../lib/i18n';
import { AuthShell } from './LoginPage';

type Action = 'approve' | 'reject';

export default function ParentLinkApprovePage({ action }: { action: Action }) {
  const { t } = useT();
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const [status, setStatus] = useState<'working' | 'success' | 'failed'>('working');

  useEffect(() => {
    if (!token) { setStatus('failed'); return; }
    const path = action === 'approve' ? '/parent-links/approve' : '/parent-links/reject';
    post(path, { token })
      .then(() => setStatus('success'))
      .catch(() => setStatus('failed'));
  }, [token, action]);

  const title = action === 'approve' ? t('parentLink.approve.title') : t('parentLink.reject.title');
  const msg =
    status === 'working' ? t('parentLink.working')
    : status === 'success'
      ? (action === 'approve' ? t('parentLink.approve.success') : t('parentLink.reject.success'))
      : t('parentLink.failed');

  const alertClass =
    status === 'success' ? 'alert success'
    : status === 'failed' ? 'alert error'
    : 'alert info';

  return (
    <AuthShell title={title} subtitle={t('app.brand')}>
      <div className={alertClass} style={{ marginBottom: 14 }}>{msg}</div>
      {status !== 'working' && (
        <div style={{ textAlign: 'center' }}>
          <Link to="/login" className="link-primary">{t('parentLink.goLogin')}</Link>
        </div>
      )}
    </AuthShell>
  );
}