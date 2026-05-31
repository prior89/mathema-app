/* PolicyPage — public Privacy / Terms screen.
 *
 * Reachable without login at /privacy and /terms. Play Store and DPDP both
 * require a public Privacy URL that opens in a browser without an account,
 * so this page intentionally bypasses ProtectedRoute. Pulls live content
 * from the @Public `GET /privacy/policy` endpoint and falls back to a
 * static stub if the request fails (offline / backend cold-start), so the
 * URL always renders something.
 *
 * "Terms" reuses the same endpoint for now — the data model on the backend
 * only has one policy document. When a separate Terms doc ships we'll wire
 * an analogous endpoint and switch on `kind`.
 */
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { fetchPolicy, type PolicyDoc } from '../lib/queries';
import { useT } from '../lib/i18n';
import { BrandLogo } from '../components/Brand';

type Props = { kind: 'privacy' | 'terms' };

export default function PolicyPage({ kind }: Props) {
  const { t, lang } = useT();
  const nav = useNavigate();

  const policy = useQuery({
    queryKey: ['policy', lang],
    queryFn: fetchPolicy,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const fallback = STATIC_FALLBACK[lang === 'ko' ? 'ko' : lang === 'hi' ? 'hi' : 'en'];
  const doc: PolicyDoc = policy.data ?? fallback;
  const heading = kind === 'terms' ? t('policy.terms.title') : doc.title;

  return (
    <div className="mathema-app">
      <div className="mathema-viewport">
        <div className="mathema-phone">
          <div className="screen">
            <div style={{ padding: '20px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <BrandLogo size="sm" />
              <button
                type="button"
                onClick={() => nav(-1)}
                style={{
                  background: 'transparent', border: 'none', color: 'var(--p-muted)',
                  fontSize: 13, cursor: 'pointer', padding: '4px 8px',
                }}
              >
                {t('common.close')}
              </button>
            </div>
            <div className="screen-body" style={{ gap: 16, paddingTop: 24 }}>
              <h1 className="title" style={{ marginTop: 0, fontSize: 24 }}>{heading}</h1>
              <p className="caption" style={{ fontSize: 12 }}>v{doc.version} · {doc.effectiveDate}</p>
              {kind === 'terms' && (
                <p style={{ fontSize: 13, color: 'var(--p-muted)' }}>
                  {t('policy.terms.preamble')}
                </p>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {doc.sections.map((s) => (
                  <section key={s.heading}>
                    <h2 style={{ fontSize: 15, margin: '0 0 4px' }}>{s.heading}</h2>
                    <p style={{ fontSize: 13, lineHeight: 1.5, margin: 0 }}>{s.body}</p>
                  </section>
                ))}
              </div>
              <div style={{ marginTop: 24, fontSize: 12, color: 'var(--p-muted)' }}>
                <Link to="/onboarding" style={{ color: 'var(--p-primary)' }}>
                  {t('policy.backToOnboarding')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Last-ditch offline fallback so /privacy still renders if the backend is
// briefly unreachable. Mirrors the live API shape so the renderer is the
// same code path either way.
const STATIC_FALLBACK: Record<'ko' | 'en' | 'hi', PolicyDoc> = {
  ko: {
    version: '2025-05',
    effectiveDate: '2025-05',
    title: '개인정보 처리방침',
    sections: [
      { heading: '수집 정보', body: '이메일, 이름, 학습 활동 (문제 풀이·정답률·소요 시간·디바이스 종류)' },
      { heading: '이용 목적', body: '학습 진단·맞춤 추천 제공, 서비스 개선, 안내 알림(선택 동의 시)' },
      { heading: '보관 기간', body: '계정 활성 기간 + 삭제 요청 후 30일' },
      { heading: '귀하의 권리', body: '열람·정정·삭제 요청, 동의 철회' },
    ],
  },
  en: {
    version: '2025-05',
    effectiveDate: '2025-05',
    title: 'Privacy Policy',
    sections: [
      { heading: 'Data we collect', body: 'Email, name, exam date, study activity (attempts, accuracy, duration, device type)' },
      { heading: 'How we use it', body: 'Diagnostics, personalised recommendations, service improvement, notifications (with consent)' },
      { heading: 'Retention', body: 'Active account period + 30 days after deletion request' },
      { heading: 'Your rights', body: 'Access, rectify, erase data; withdraw consent.' },
    ],
  },
  hi: {
    version: '2025-05',
    effectiveDate: '2025-05',
    title: 'गोपनीयता नीति',
    sections: [
      { heading: 'एकत्रित जानकारी', body: 'ईमेल, नाम, अध्ययन गतिविधि' },
      { heading: 'उपयोग का उद्देश्य', body: 'निदान, व्यक्तिगत सिफारिशें, सेवा सुधार, सूचनाएँ (सहमति पर)' },
      { heading: 'संरक्षण अवधि', body: 'सक्रिय खाता अवधि + विलोपन अनुरोध के 30 दिन बाद तक' },
      { heading: 'आपके अधिकार', body: 'देखना, सुधारना, मिटाना; सहमति वापस लेना।' },
    ],
  },
};
