/**
 * Mastery tab surface — wires existing APIs only (PR-12).
 *   GET /recommendations/balance      → unit heatmap
 *   GET /recommendations/review-schedule → concepts to review
 *   GET /mastery/trajectory           → per-concept status
 */
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  fetchActivePatterns,
  fetchBalance,
  fetchConceptMastery,
  fetchReviewSchedule,
  type ConceptMastery,
  type ReviewScheduleRow,
} from '../../lib/queries';
import { useT } from '../../lib/i18n';
import { TabBar } from './TabBar';
import { MasteryHeatmap } from '../mastery/MasteryHeatmap';
import { ActiveErrorPatternList } from '../mastery/ActiveErrorPatterns';

const LABELS = {
  title: { ko: '이해도', en: 'Mastery', hi: 'दक्षता' },
  subtitle: {
    ko: '단원별 이해도와 복습이 필요한 개념을 한눈에 확인하세요.',
    en: 'See unit mastery and which concepts need review.',
    hi: 'अध्यायवार दक्षता और पुनरावलोकन के लिए अवधारणाएँ देखें।',
  },
  heatmap: { ko: '단원별 이해도 지도', en: 'Mastery heatmap', hi: 'दक्षता हीटमैप' },
  review: { ko: '복습이 필요한 개념', en: 'Concepts to review', hi: 'पुनरावलोकन अवधारणाएँ' },
  errorPatterns: { ko: '반복 실수 패턴', en: 'Repeated error patterns', hi: 'दोहराई गई गलतियाँ' },
  concepts: { ko: '개념별 상태', en: 'Concept status', hi: 'अवधारणा स्थिति' },
  loading: { ko: '불러오는 중…', en: 'Loading…', hi: 'लोड हो रहा है…' },
  noData: {
    ko: '아직 학습 데이터가 부족해요. 문제를 풀어보세요.',
    en: 'Not enough data yet — solve a few problems first.',
    hi: 'अभी पर्याप्त डेटा नहीं — कुछ प्रश्न हल करें।',
  },
  startLearn: { ko: '단원학습 시작', en: 'Start learning', hi: 'सीखना शुरू करें' },
  daysAgo: { ko: '일 전', en: 'd ago', hi: 'दिन पहले' },
  risk: { ko: '망각 위험', en: 'Forgetting risk', hi: 'भूलने का जोखिम' },
} as const;

function L(k: keyof typeof LABELS, lang: 'ko' | 'en' | 'hi'): string {
  const v = LABELS[k];
  return (typeof v === 'object' ? v[lang] ?? v.en : v) as string;
}

function masteryColor(score: number): string {
  if (score >= 80) return 'var(--p-success)';
  if (score >= 60) return 'var(--p-primary)';
  if (score >= 40) return 'var(--p-accent)';
  return 'var(--p-danger)';
}

export function MasteryScreen() {
  const nav = useNavigate();
  const { lang } = useT();
  const uiLang = (lang === 'ko' || lang === 'hi' ? lang : 'en') as 'ko' | 'en' | 'hi';

  const balance = useQuery({ queryKey: ['recommendations', 'balance'], queryFn: fetchBalance });
  const review = useQuery({ queryKey: ['review-schedule'], queryFn: fetchReviewSchedule });
  const concepts = useQuery({ queryKey: ['mastery', 'trajectory'], queryFn: fetchConceptMastery });
  const errorPatterns = useQuery({ queryKey: ['error-patterns', 'active'], queryFn: fetchActivePatterns });

  const hasHeatmap = (balance.data?.perUnit.length ?? 0) > 0;

  return (
    <div className="screen">
      <div className="app-head" style={{ flexShrink: 0 }}>
        <div className="greet">
          <div className="hello">{L('title', uiLang)}</div>
          <div className="name" style={{ fontSize: 14, fontWeight: 400, color: 'var(--p-muted)', marginTop: 4 }}>
            {L('subtitle', uiLang)}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', minHeight: 0, padding: '0 22px 16px' }}>
        {balance.isLoading && (
          <div className="card" style={{ padding: 14, color: 'var(--p-muted)', fontSize: 13 }}>
            {L('loading', uiLang)}
          </div>
        )}

        {!balance.isLoading && !hasHeatmap && (
          <div
            className="card"
            style={{ padding: 16, textAlign: 'center', cursor: 'pointer' }}
            onClick={() => nav('/app/learn')}
          >
            <div style={{ color: 'var(--p-muted)', fontSize: 13, marginBottom: 10 }}>{L('noData', uiLang)}</div>
            <span className="chip primary" style={{ fontSize: 12 }}>{L('startLearn', uiLang)} →</span>
          </div>
        )}

        {hasHeatmap && (
          <>
            <div className="section-h">
              <span className="label">{L('heatmap', uiLang)}</span>
            </div>
            <MasteryHeatmap perUnit={balance.data!.perUnit} lang={uiLang} embeddedInCard={false} />
          </>
        )}

        {(errorPatterns.data?.length ?? 0) > 0 && (
          <>
            <div className="section-h" style={{ marginTop: 20 }}>
              <span className="label">{L('errorPatterns', uiLang)}</span>
              <span className="more">{errorPatterns.data!.length}</span>
            </div>
            <ActiveErrorPatternList patterns={errorPatterns.data!} lang={uiLang} />
          </>
        )}

        {(review.data?.length ?? 0) > 0 && (
          <>
            <div className="section-h" style={{ marginTop: 20 }}>
              <span className="label">{L('review', uiLang)}</span>
              <span className="more">{review.data!.length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {review.data!.slice(0, 6).map((row) => (
                <ReviewConceptCard key={row.conceptId} row={row} lang={uiLang} />
              ))}
            </div>
          </>
        )}

        {(concepts.data?.length ?? 0) > 0 && (
          <>
            <div className="section-h" style={{ marginTop: 20 }}>
              <span className="label">{L('concepts', uiLang)}</span>
              <span className="more">{concepts.data!.length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {concepts.data!.slice(0, 8).map((row) => (
                <ConceptStatusCard key={row.conceptId} row={row} lang={uiLang} />
              ))}
            </div>
          </>
        )}
      </div>

      <TabBar />
    </div>
  );
}

function ReviewConceptCard({ row, lang }: { row: ReviewScheduleRow; lang: 'ko' | 'en' | 'hi' }) {
  const riskPct = Math.round(row.forgettingRisk * 100);
  return (
    <div className="card" style={{ padding: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--p-ink)' }}>{row.conceptName}</div>
        <span
          className="status-chip"
          style={{
            background: row.priority === 'high' ? 'var(--p-danger-tint)' : 'var(--p-accent-tint)',
            color: row.priority === 'high' ? 'var(--p-danger)' : 'var(--p-accent)',
          }}
        >
          {L('risk', lang)} {riskPct}%
        </span>
      </div>
      <div style={{ marginTop: 6, fontSize: 11.5, color: 'var(--p-muted)', fontFamily: 'var(--font-mono)' }}>
        {Math.round(row.masteryScore)}/100
        {row.daysSinceLast != null && (
          <> · {row.daysSinceLast}{L('daysAgo', lang)}</>
        )}
      </div>
    </div>
  );
}

function ConceptStatusCard({ row, lang }: { row: ConceptMastery; lang: 'ko' | 'en' | 'hi' }) {
  const score = Math.round(row.masteryScore);
  const lowEvidence = row.evidenceCount < 3;
  return (
    <div className="card" style={{ padding: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--p-ink)' }}>{row.concept.name}</div>
          <div style={{ fontSize: 11, color: 'var(--p-muted)', marginTop: 2 }}>
            {lowEvidence
              ? (lang === 'ko' ? '데이터 부족' : lang === 'hi' ? 'डेटा कम' : 'Low evidence')
              : row.trend === 'UP'
                ? (lang === 'ko' ? '상승 중' : lang === 'hi' ? 'बढ़ रहा' : 'Trending up')
                : row.trend === 'DOWN'
                  ? (lang === 'ko' ? '주의 필요' : lang === 'hi' ? 'ध्यान दें' : 'Needs attention')
                  : (lang === 'ko' ? '안정' : lang === 'hi' ? 'स्थिर' : 'Stable')}
          </div>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: masteryColor(score) }}>
          {lowEvidence ? '—' : score}
        </span>
      </div>
    </div>
  );
}
