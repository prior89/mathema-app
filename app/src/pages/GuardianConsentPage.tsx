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
  const { user, refreshUser, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useT();
  const qc = useQueryClient();
  const statusQ = useQuery({
    queryKey: ['guardian-consent-status'],
    queryFn: fetchGuardianConsentStatus,
    refetchInterval: (q) => (q.state.data?.verified ? false : 5_000),
  });

  // Advance to /app once the parent verifies. Earlier this fired once and
  // trusted whatever /users/me returned — if React Query handed back a stale
  // me snapshot (guardianConsentVerifiedAt still null), postAuthPath kept us
  // on /guardian-consent and polling had already stopped: silent deadlock.
  // Now we hard-invalidate the me query, retry briefly while the route is
  // still /guardian-consent, and re-arm status polling if we give up.
  useEffect(() => {
    if (!statusQ.data?.verified) return;
    let cancelled = false;
    const advance = async (attempt = 0): Promise<void> => {
      if (cancelled) return;
      await qc.invalidateQueries({ queryKey: ['me'] });
      await refreshUser();
      const me = await get<Me>('/users/me');
      if (cancelled) return;
      const target = postAuthPath(me);
      if (target.startsWith('/guardian-consent') && attempt < 3) {
        await new Promise((r) => setTimeout(r, 700));
        return advance(attempt + 1);
      }
      if (target.startsWith('/guardian-consent')) {
        // Give up gracefully — invalidating the status query re-arms the 5s
        // poll so the next tick re-checks rather than leaving the student
        // stranded on this screen.
        await qc.invalidateQueries({ queryKey: ['guardian-consent-status'] });
        return;
      }
      navigate(target, { replace: true });
    };
    void advance();
    return () => { cancelled = true; };
  }, [statusQ.data?.verified, refreshUser, navigate, qc]);

  const [parentEmail, setParentEmail] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  /* Escape hatch (user feedback 2026-06-13): a typo'd parent email used to
     trap the student — the waiting state only offered "resend". */
  const [changingEmail, setChangingEmail] = useState(false);

  const status = statusQ.data;
  const waiting = !changingEmail
    && (sent || (status?.requestStatus === 'PENDING' && !!status?.parentEmail));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isLikelyEmail(parentEmail)) return;
    setErr(null);
    setBusy(true);
    try {
      await requestGuardianConsent({ parentEmail: parentEmail.trim() });
      setSent(true);
      setChangingEmail(false);
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
                <p className="subtitle">{t(user?.country === 'KR' ? 'guardianConsent.sub.kr' : 'guardianConsent.sub')}</p>
              </div>

              {waiting ? (
                <>
                  <div className="alert success">
                    {t('guardianConsent.sent', { email: status?.parentEmail ?? parentEmail })}
                  </div>
                  <p className="caption">{t('guardianConsent.autoAdvance')}</p>
                  <button type="button" className="btn text" disabled={busy} onClick={resend}>
                    {busy ? t('guardianConsent.sending') : t('guardianConsent.resend')}
                  </button>
                  <button
                    type="button"
                    className="btn text"
                    disabled={busy}
                    onClick={() => {
                      setParentEmail(status?.parentEmail ?? parentEmail);
                      setSent(false);
                      setChangingEmail(true);
                    }}
                  >
                    {t('guardianConsent.changeEmail')}
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
              <button
                type="button"
                className="btn text"
                style={{ marginTop: 'auto', color: 'var(--p-muted)' }}
                onClick={() => { void logout().then(() => navigate('/login', { replace: true })); }}
              >
                {t('guardianConsent.logout')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}