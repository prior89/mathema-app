import { FormEvent, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { post } from '../lib/api';
import { useT } from '../lib/i18n';
import { AuthShell, Field } from './LoginPage';

export default function ResetPasswordPage() {
  const { t } = useT();
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const navigate = useNavigate();
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (pw.length < 8) { setErr(t('settings.new')); return; }
    if (pw !== confirm) { setErr(t('settings.passwordMismatch')); return; }
    setBusy(true);
    try {
      await post('/auth/reset-password', { token, password: pw });
      setDone(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (e: any) {
      setErr(e?.response?.data?.error?.message ?? t('reset.invalidToken'));
    } finally { setBusy(false); }
  };

  if (!token) {
    return (
      <AuthShell title={t('reset.title')} subtitle={t('app.brand')}>
        <div className="alert error">{t('reset.invalidToken')}</div>
        <div style={{ marginTop: 12, textAlign: 'center' }}>
          <Link to="/login" className="link-primary">{t('forgot.backToLogin')}</Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title={t('reset.title')} subtitle={t('app.brand')}>
      {done ? (
        <div className="alert success">{t('reset.success')}</div>
      ) : (
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label={t('reset.password')} type="password" value={pw} onChange={setPw} />
          <Field label={t('reset.confirm')} type="password" value={confirm} onChange={setConfirm} />
          {err && <div className="alert error" role="alert">{err}</div>}
          <button disabled={busy} type="submit" className="btn">
            {busy ? t('auth.login.busy') : t('reset.submit')}
          </button>
        </form>
      )}
    </AuthShell>
  );
}