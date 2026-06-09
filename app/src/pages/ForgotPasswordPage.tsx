import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { post } from '../lib/api';
import { useT } from '../lib/i18n';
import { AuthShell, Field } from './LoginPage';

export default function ForgotPasswordPage() {
  const { t } = useT();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await post('/auth/forgot-password', { email });
      setSent(true);
    } catch {
      setSent(true);
    } finally { setBusy(false); }
  };

  return (
    <AuthShell title={t('forgot.title')} subtitle={t('app.brand')}>
      {sent ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="alert success">{t('forgot.sent')}</div>
          <Link to="/login" className="link-primary" style={{ textAlign: 'center' }}>
            {t('forgot.backToLogin')}
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p className="caption" style={{ margin: 0 }}>{t('forgot.hint')}</p>
          <Field label={t('auth.email')} type="email" value={email} onChange={setEmail} />
          <button disabled={busy || !email} type="submit" className="btn">
            {busy ? t('auth.login.busy') : t('forgot.submit')}
          </button>
          <Link to="/login" className="link-muted" style={{ textAlign: 'center' }}>
            {t('forgot.backToLogin')}
          </Link>
        </form>
      )}
    </AuthShell>
  );
}