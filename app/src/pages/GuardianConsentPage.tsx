import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { useT } from '../lib/i18n';
import { isLikelyEmail } from '../lib/email';
import { fetchGuardianConsentStatus, requestGuardianConsent, type Me } from '../lib/queries';
import { get } from '../lib/api';
import { postAuthPath } from '../lib/post-auth-path';
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
    void (async () => {
      await refreshUser();
      const me = await get<Me>('/users/me');
      navigate(postAuthPath(me), { replace: true });
    })();
  }, [statusQ.data?.verified, refreshUser, navigate]);

  const [parentEmail, setParentEmail] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const status = statusQ.data;
  const waiting = sent || (status?.requestStatus === 'PENDING' && !!status?.parentEmail);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isLikelyEmail(parentEmail)) return;
    setErr(null);
    setBusy(true);
    try {
      await requestGuardianConsent({ parentEmail: parentEmail.trim() });
      setSent(true);
      await qc.invalidateQueries({ queryKey: ['guardian-consent-status'] });
      await refreshUser();
    } catch (ex: any) {
      const code = ex?.response?.data?.error?.code ?? ex?.response?.data?.code;
      if (code === 'pass_not_configured') {
        setErr(t('guardianConsent.passNotConfigured'));
      } else if (code === 'parent_email_same_as_student') {
        setErr(t('guardianConsent.parentEmailSameAsStudent'));
      } else {
        setErr(ex?.response?.data?.error?.message ?? t('guardianConsent.failed'));
      }
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    const email = status?.parentEmail ?? parentEmail;
    if (!email) return;
    setErr(null);
    setBusy(true);
    try {
      await requestGuardianConsent({ parentEmail: email.trim() });
      setSent(true);
      await qc.invalidateQueries({ queryKey: ['guardian-consent-status'] });
    } catch (ex: any) {
      setErr(ex?.response?.data?.error?.message ?? t('guardianConsent.failed'));
    } finally {
      setBusy(false);
    }
  };

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
                <h2 className="title" style={{ marginTop: 8 }}>
                  {waiting ? t('guardianConsent.waiting.title') : t('guardianConsent.title')}
                </h2>
                <p className="subtitle">{t('guardianConsent.sub')}</p>
              </div>

              {waiting ? (
                <>
                  <div className="alert success">
                    {t('guardianConsent.sent', { email: status?.parentEmail ?? parentEmail })}
                  </div>
                  <button type="button" className="btn text" disabled={busy} onClick={resend}>
                    {busy ? t('guardianConsent.sending') : t('guardianConsent.resend')}
                  </button>
                </>
              ) : (
                <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="field">
                    <label>{t('guardianConsent.parentEmail')}</label>
                    <input
                      type="email"
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      placeholder={t('ageGate.parentEmail.placeholder')}
                      required
                    />
                    <span className="caption" style={{ marginTop: 6 }}>{t('ageGate.parentEmail.hint')}</span>
                  </div>
                  {err && <div style={{ color: 'var(--p-danger)', fontSize: 13 }}>{err}</div>}
                  <button type="submit" className="btn" disabled={busy || !isLikelyEmail(parentEmail)}>
                    {busy ? t('guardianConsent.sending') : t('guardianConsent.send')}
                  </button>
                </form>
              )}

              {err && waiting && <div style={{ color: 'var(--p-danger)', fontSize: 13 }}>{err}</div>}
              <p className="caption" style={{ fontSize: 11.5 }}>{t('guardianConsent.policy')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}