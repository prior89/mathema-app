import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { useT } from '../lib/i18n';
import { fetchGuardianConsentStatus, requestGuardianConsent } from '../lib/queries';
import { BrandLogo } from '../components/Brand';
import '../styles/onboarding.css';

export default function GuardianConsentPage() {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const { t } = useT();
  const qc = useQueryClient();
  const statusQ = useQuery({
    queryKey: ['guardian-consent-status'],
    queryFn: fetchGuardianConsentStatus,
    refetchInterval: (q) => (q.state.data?.verified ? false : 10_000),
  });

  useEffect(() => {
    if (!statusQ.data?.verified) return;
    void refreshUser().then(() => navigate('/app', { replace: true }));
  }, [statusQ.data?.verified, refreshUser, navigate]);

  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await requestGuardianConsent({ parentName, parentEmail, parentPhone: parentPhone || undefined });
      setSent(true);
      await qc.invalidateQueries({ queryKey: ['guardian-consent-status'] });
      await refreshUser();
    } catch (ex: any) {
      const code = ex?.response?.data?.error?.code ?? ex?.response?.data?.code;
      if (code === 'pass_not_configured') {
        setErr(t('guardianConsent.passNotConfigured'));
      } else {
        setErr(ex?.response?.data?.error?.message ?? t('guardianConsent.failed'));
      }
    } finally {
      setBusy(false);
    }
  };

  const status = statusQ.data;

  return (
    <div className="mathema-app">
      <div className="mathema-viewport">
        <div className="mathema-phone">
          <div className="screen">
            <div style={{ padding: '20px 24px 0' }}>
              <BrandLogo size="sm" />
            </div>
            <div className="screen-body" style={{ gap: 18, paddingTop: 16 }}>
              <div>
                <span className="eyebrow">{t('guardianConsent.eyebrow')}</span>
                <h2 className="title" style={{ marginTop: 8 }}>{t('guardianConsent.title')}</h2>
                <p className="subtitle">{t('guardianConsent.sub')}</p>
              </div>

              {sent || (status?.requestStatus === 'PENDING' && status?.parentEmail) ? (
                <div className="alert success">
                  {t('guardianConsent.sent', { email: status?.parentEmail ?? parentEmail })}
                </div>
              ) : (
                <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="field">
                    <label>{t('guardianConsent.parentName')}</label>
                    <input value={parentName} onChange={(e) => setParentName(e.target.value)} required minLength={2} />
                  </div>
                  <div className="field">
                    <label>{t('guardianConsent.parentEmail')}</label>
                    <input type="email" value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} required />
                  </div>
                  <div className="field">
                    <label>{t('guardianConsent.parentPhone')}</label>
                    <input type="tel" value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} />
                    <span className="caption" style={{ marginTop: 6 }}>{t('guardianConsent.parentPhone.hint')}</span>
                  </div>
                  {err && <div style={{ color: 'var(--p-danger)', fontSize: 13 }}>{err}</div>}
                  <button type="submit" className="btn" disabled={busy}>
                    {busy ? t('guardianConsent.sending') : t('guardianConsent.send')}
                  </button>
                </form>
              )}

              <p className="caption" style={{ fontSize: 11.5 }}>{t('guardianConsent.policy')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}