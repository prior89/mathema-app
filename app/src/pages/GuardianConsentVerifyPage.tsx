/* Guardian consent confirmation — the page a parent lands on from the
 * consent email link. Rewritten 2026-06-13 (user feedback): it previously
 * reused the login AuthShell (parents thought they hit a signup screen),
 * auto-verified on page load (no affirmative action), and ended with a
 * "go to sign in" link that funneled account-less parents into signup.
 * Now: dedicated layout, explicit approve button, close-this-window end. */
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { post, get, tokens } from '../lib/api';
import { useT } from '../lib/i18n';
import { BrandLogo } from '../components/Brand';
import '../styles/onboarding.css';

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
  const [status, setStatus] = useState<'loading' | 'ready' | 'working' | 'success' | 'failed'>('loading');
  // Detect a student session already signed in on this device. A student
  // approving their own guardian consent defeats the entire purpose of the
  // gate, so we surface a dedicated screen rather than the approve button.
  // The check runs once on mount; the logout CTA reloads the page so the
  // user re-enters this route in an anonymous state.
  const [sameDevice, setSameDevice] = useState(false);

  useEffect(() => {
    if (tokens.get()) setSameDevice(true);
  }, []);

  useEffect(() => {
    if (!token) { setStatus('failed'); return; }
    get<Preview>(`/guardian-consent/preview?token=${encodeURIComponent(token)}`)
      .then((p) => { setPreview(p); setStatus('ready'); })
      .catch(() => setStatus('failed'));
  }, [token]);

  const approve = () => {
    if (status !== 'ready' || sameDevice) return;
    setStatus('working');
    post('/guardian-consent/verify', { token })
      .then(() => setStatus('success'))
      .catch(() => setStatus('failed'));
  };

  const signOutAndContinue = () => {
    tokens.clear();
    setSameDevice(false);
    // Hard reload so any in-memory React Query / AuthContext state tied to
    // the old session is wiped before the parent taps Approve.
    window.location.reload();
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
                <h2 className="title" style={{ marginTop: 8 }}>{t('guardianConsent.verify.title')}</h2>
                {preview && status !== 'failed' && (
                  <p className="subtitle">{t('guardianConsent.verify.forChild', { name: preview.childName })}</p>
                )}
              </div>

              {status === 'loading' && !sameDevice && (
                <div className="alert info">{t('common.loading')}</div>
              )}

              {sameDevice && status !== 'failed' && (
                <>
                  <div className="alert" style={{ background: 'var(--p-warn-tint, #fff4d6)', color: 'var(--p-ink)', border: '1px solid var(--p-warn, #d39517)' }}>
                    <strong>{t('guardianConsent.verify.alreadyLoggedIn.title')}</strong>
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--p-ink-2)' }}>
                    {t('guardianConsent.verify.alreadyLoggedIn.body')}
                  </p>
                  <button type="button" className="btn text" onClick={signOutAndContinue}>
                    {t('guardianConsent.verify.alreadyLoggedIn.logout')}
                  </button>
                </>
              )}

              {!sameDevice && (status === 'ready' || status === 'working') && (
                <>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--p-ink-2)' }}>
                    {t('guardianConsent.verify.intro')}
                  </p>
                  <button type="button" className="btn" disabled={status === 'working'} onClick={approve}>
                    {status === 'working' ? t('guardianConsent.verify.working') : t('guardianConsent.verify.approve')}
                  </button>
                </>
              )}

              {status === 'success' && (
                <>
                  <div className="alert success">{t('guardianConsent.verify.success')}</div>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--p-ink-2)' }}>
                    {t('guardianConsent.verify.done')}
                  </p>
                </>
              )}

              {status === 'failed' && (
                <div className="alert error">{t('guardianConsent.verify.failed')}</div>
              )}

              <p className="caption" style={{ fontSize: 11.5, marginTop: 'auto' }}>{t('guardianConsent.policy')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
