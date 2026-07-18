/* PolicyPage — public Privacy / Terms screen.
 *
 * Reachable without login at /privacy and /terms. Play Store policy
 * require a public Privacy URL that opens in a browser without an account,
 * so this page intentionally bypasses ProtectedRoute. Pulls live content
 * from the @Public `GET /privacy/policy` endpoint and falls back to a
 * static fallback if the request fails (offline / backend cold-start), so the
 * URL always renders something.
 *
 * Terms are a standalone static document: the privacy endpoint must never be
 * presented as contractual terms.
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
    enabled: kind === 'privacy',
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const locale = lang === 'ko' ? 'ko' : 'en';
  const doc: PolicyDoc = kind === 'terms'
    ? STATIC_TERMS[locale]
    : policy.data ?? STATIC_PRIVACY_FALLBACK[locale];

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
              <h1 className="title" style={{ marginTop: 0, fontSize: 24 }}>{doc.title}</h1>
              <p className="caption" style={{ fontSize: 12 }}>v{doc.version} · {doc.effectiveDate}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {doc.sections.map((s) => (
                  <section key={s.heading}>
                    <h2 style={{ fontSize: 15, margin: '0 0 4px' }}>{s.heading}</h2>
                    <p style={{ fontSize: 13, lineHeight: 1.6, margin: 0, whiteSpace: 'pre-line' }}>{s.body}</p>
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
const STATIC_PRIVACY_FALLBACK: Record<'ko' | 'en', PolicyDoc> = {
  ko: {
    version: '2026-07-15',
    effectiveDate: '2026-07-15',
    title: '개인정보 처리방침 v2026-07-15',
    sections: [
      { heading: '수집 정보', body: '이메일, 이름, 시험 일정, 학습 활동(문제 풀이·정답률·소요 시간·디바이스 종류)' },
      { heading: '이용 목적', body: '학습 진단·맞춤 추천 제공, 서비스 개선, 안내 알림(선택 동의 시)' },
      { heading: '보관 기간', body: '계정 활성 기간 + 삭제 요청 후 30일' },
      { heading: '귀하의 권리', body: '열람·정정·삭제 요청, 동의 철회 (DATA_PROCESSING 철회는 계정 삭제로 처리됨)' },
      { heading: '아동·보호자', body: '대한민국 기준 만 14세 미만 학생은 보호자 이메일 확인이 필요합니다. 분석·AI 학습 활용·마케팅은 기본 OFF이며, 보호자 확인 대상 학생과 게스트 계정은 스스로 활성화할 수 없습니다.' },
    ],
  },
  en: {
    version: '2026-07-15',
    effectiveDate: '2026-07-15',
    title: 'Privacy Policy v2026-07-15',
    sections: [
      { heading: 'Data we collect', body: 'Email, name, exam date, study activity (attempts, accuracy, duration, device type)' },
      { heading: 'How we use it', body: 'Diagnostics, personalised recommendations, service improvement, notifications (with consent)' },
      { heading: 'Retention', body: 'Active account period + 30 days after deletion request' },
      { heading: 'Your rights', body: 'Access, rectify, erase data; withdraw consent. Withdrawing DATA_PROCESSING triggers account deletion.' },
      { heading: 'Children & guardians', body: 'Students under 14 in Korea need parent email confirmation. Analytics, AI-training use, and marketing are off by default; guardian-gated students and guest accounts cannot enable them themselves.' },
    ],
  },
};

const STATIC_TERMS: Record<'ko' | 'en', PolicyDoc> = {
  ko: {
    version: '2026-07-15',
    effectiveDate: '2026-07-15',
    title: 'Matheo 이용약관',
    sections: [
      {
        heading: '1. 약관의 목적과 동의',
        body: '이 약관은 VeraStudy가 운영하는 Matheo 학습 서비스(이하 “서비스”)의 이용 조건을 정합니다. 계정을 만들거나 서비스를 이용하면 이 약관에 동의한 것으로 봅니다. 동의하지 않으면 서비스를 이용하지 마세요.',
      },
      {
        heading: '2. 이용 자격과 보호자 확인',
        body: '이용자는 정확한 연령 및 계정 정보를 제공해야 합니다. 대한민국 법령 또는 서비스 정책상 보호자 동의가 필요한 미성년자는 법정대리인의 확인을 받은 뒤 서비스를 이용해야 합니다. 보호자는 미성년자의 이용과 결제 내역을 관리할 책임이 있습니다.',
      },
      {
        heading: '3. 계정과 보안',
        body: '계정은 본인만 사용해야 하며 로그인 정보의 보안을 유지해야 합니다. 무단 사용이 의심되면 즉시 비밀번호를 변경하고 VeraStudy01@gmail.com으로 알려주세요. 타인의 계정을 사용하거나 계정 접근 권한을 판매·양도해서는 안 됩니다.',
      },
      {
        heading: '4. 서비스 내용',
        body: 'Matheo는 수학 학습 콘텐츠, 문제 풀이, 진단, 복습, 노트 및 맞춤형 학습 안내를 제공합니다. 제공 범위와 기능은 학년, 국가, 기기, 구독 상태에 따라 달라질 수 있습니다.',
      },
      {
        heading: '5. 허용되지 않는 이용',
        body: '서비스를 불법·부정한 목적으로 사용하거나, 다른 이용자를 방해하거나, 보안 기능을 우회하거나, 자동화 도구로 과도한 요청을 보내거나, 소스 코드·모델·콘텐츠를 무단 복제·추출·역설계해서는 안 됩니다. 시험 부정행위나 타인의 과제를 대신 수행하는 용도로 사용해서도 안 됩니다.',
      },
      {
        heading: '6. AI 및 학습 안내의 한계',
        body: 'AI가 생성한 설명·추천·채점에는 오류나 누락이 있을 수 있습니다. 결과를 중요한 시험 성적, 진학 또는 기타 중대한 결정의 유일한 근거로 삼지 말고 교사·공식 교재 등 신뢰할 수 있는 자료와 함께 확인하세요. 서비스는 성적 향상이나 특정 결과를 보장하지 않습니다.',
      },
      {
        heading: '7. 이용자 콘텐츠',
        body: '이용자는 자신이 작성하거나 업로드한 노트·이미지 등 콘텐츠에 필요한 권리를 보유해야 합니다. 서비스 제공, 저장, 동기화 및 이용자가 요청한 AI 기능 처리를 위해 필요한 범위에서 해당 콘텐츠를 처리할 수 있도록 VeraStudy에 비독점적 권한을 부여합니다. 계정 삭제 후에는 법령상 보존 의무와 백업 처리 기간을 제외하고 관련 콘텐츠를 삭제합니다.',
      },
      {
        heading: '8. 지식재산권',
        body: '서비스의 소프트웨어, 디자인, 상표, 문제·해설 및 기타 콘텐츠에 관한 권리는 VeraStudy 또는 정당한 권리자에게 있습니다. 약관에서 허용한 개인적·비상업적 학습 목적 외의 복제, 배포, 공개, 판매 또는 2차적 이용은 허용되지 않습니다.',
      },
      {
        heading: '9. 유료 구독, 자동 갱신과 해지',
        body: '구독 상품의 가격, 결제 주기와 세금은 구매 화면에 표시됩니다. Google Play에서 구매한 구독은 표시된 결제 주기마다 자동 갱신되며, 다음 결제 전에 Google Play의 구독 관리에서 해지할 수 있습니다. 해지하면 이미 결제한 기간이 끝날 때까지 유료 기능을 이용할 수 있고 이후에는 갱신되지 않습니다. 앱 삭제만으로는 구독이 해지되지 않습니다.',
      },
      {
        heading: '10. 청약철회와 환불',
        body: '환불 및 청약철회는 구매에 사용한 Google Play 정책과 대한민국 전자상거래법 등 강행 법규에 따릅니다. 디지털 콘텐츠가 제공되기 시작한 경우 법령이 허용하는 범위에서 청약철회가 제한될 수 있으며, 그러한 제한은 구매 전에 안내합니다. 법령이 보장하는 이용자의 권리를 이 약관이 제한하지 않습니다.',
      },
      {
        heading: '11. 서비스 변경과 중단',
        body: '품질 개선, 보안, 유지보수, 법령 준수 또는 운영상 필요에 따라 기능을 변경하거나 일시 중단할 수 있습니다. 이용자에게 중대한 불이익이 예상되는 변경은 합리적인 기간 전에 서비스 내 공지 등으로 알립니다. 불가피한 장애나 긴급 보안 조치의 경우 사후에 알릴 수 있습니다.',
      },
      {
        heading: '12. 이용 제한과 계약 종료',
        body: '이용자는 앱의 계정 설정을 통해 언제든 탈퇴할 수 있습니다. VeraStudy는 법령 또는 약관 위반, 다른 이용자나 서비스의 안전을 해치는 행위가 확인되면 위반 정도에 따라 경고, 기능 제한, 정지 또는 계약 해지를 할 수 있습니다. 긴급한 위험이 없는 한 사유와 이의 제기 방법을 안내합니다.',
      },
      {
        heading: '13. 책임과 법정 권리',
        body: 'VeraStudy는 합리적인 주의로 서비스를 운영하지만 인터넷·기기·외부 플랫폼에 따른 중단이나 모든 콘텐츠의 완전한 정확성을 보장할 수는 없습니다. 다만 VeraStudy의 고의·중대한 과실에 따른 책임, 개인정보 보호 의무, 소비자에게 법령상 보장되는 권리와 그 밖의 강행 법규상 책임은 배제하거나 제한하지 않습니다.',
      },
      {
        heading: '14. 약관 변경, 준거법과 문의',
        body: '약관을 변경할 때에는 시행일과 변경 내용을 사전에 알립니다. 이용자에게 불리한 중대한 변경에는 관련 법령이 정한 통지 및 동의 절차를 적용합니다. 이 약관은 대한민국 법령을 따르며, 분쟁은 소비자분쟁해결기준 및 관할 법원 절차에 따라 해결합니다. 약관, 계정 또는 결제 문의: VeraStudy01@gmail.com',
      },
    ],
  },
  en: {
    version: '2026-07-15',
    effectiveDate: '2026-07-15',
    title: 'Matheo Terms of Service',
    sections: [
      { heading: '1. Purpose and acceptance', body: 'These terms govern the Matheo learning service operated by VeraStudy (the “Service”). By creating an account or using the Service, you agree to these terms. Do not use the Service if you do not agree.' },
      { heading: '2. Eligibility and guardian approval', body: 'You must provide accurate age and account information. A minor who requires guardian consent under Korean law or Service policy may use the Service only after approval by a legal guardian. Guardians are responsible for supervising the minor’s use and purchases.' },
      { heading: '3. Accounts and security', body: 'Keep your account credentials secure and do not sell, transfer, or use another person’s account. If you suspect unauthorized use, change your password and contact VeraStudy01@gmail.com promptly.' },
      { heading: '4. The Service', body: 'Matheo provides mathematics content, practice, diagnostics, review, notes, and personalized study guidance. Available features may vary by grade, country, device, and subscription status.' },
      { heading: '5. Acceptable use', body: 'Do not use the Service unlawfully, disrupt other users, bypass security, send excessive automated requests, extract or reverse engineer software, models, or content, or use it for exam misconduct or to complete another person’s work.' },
      { heading: '6. AI and educational limitations', body: 'AI-generated explanations, recommendations, and scoring may contain errors or omissions. Do not rely on them as the sole basis for important exam, admission, or other consequential decisions; verify them with teachers and authoritative materials. The Service does not guarantee grades or outcomes.' },
      { heading: '7. User content', body: 'You must have the necessary rights to notes, images, and other content you submit. You grant VeraStudy a non-exclusive permission to process that content only as needed to provide, store, sync, and perform the AI features you request. Content is deleted after account deletion, subject to legal retention duties and backup processing periods.' },
      { heading: '8. Intellectual property', body: 'The software, design, trademarks, questions, explanations, and other Service content belong to VeraStudy or their lawful owners. You may use them only for personal, non-commercial learning unless additional permission is given.' },
      { heading: '9. Paid subscriptions and auto-renewal', body: 'The purchase screen shows price, billing period, and applicable taxes. Google Play subscriptions renew automatically each billing period unless cancelled before the next charge in Google Play subscription settings. Cancellation takes effect after the paid period; deleting the app does not cancel a subscription.' },
      { heading: '10. Withdrawal and refunds', body: 'Refunds and withdrawal rights follow Google Play policy and mandatory Korean e-commerce and consumer law. Statutory withdrawal may be limited after digital content begins, where the law permits and the limitation was disclosed before purchase. These terms do not restrict non-waivable consumer rights.' },
      { heading: '11. Changes and availability', body: 'We may change or temporarily suspend features for quality, security, maintenance, legal compliance, or operational needs. Material adverse changes will be announced with reasonable advance notice where practicable; emergencies may be announced afterward.' },
      { heading: '12. Suspension and termination', body: 'You may close your account in account settings. VeraStudy may warn, restrict, suspend, or terminate an account for legal or terms violations or threats to users or the Service. Unless urgent risk prevents it, we will explain the reason and how to appeal.' },
      { heading: '13. Responsibility and statutory rights', body: 'VeraStudy uses reasonable care but cannot guarantee uninterrupted access or perfect accuracy across internet, device, and third-party platform conditions. Nothing excludes liability for intent or gross negligence, privacy obligations, non-waivable consumer rights, or other liability that mandatory law does not allow us to limit.' },
      { heading: '14. Changes to terms, law, and contact', body: 'We will announce the effective date and content of revised terms in advance and follow legally required notice or consent procedures for material adverse changes. Korean law applies, and disputes are handled under applicable consumer dispute standards and competent court procedures. Contact: VeraStudy01@gmail.com' },
    ],
  },
};
