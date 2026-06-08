import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { get } from '../../lib/api';
import { TabBar } from '../main/TabBar';

type Overview = {
  generatedAt: string;
  dataScope: 'real_learners_only';
  excludedTesterCount: number;
  northStar: {
    label: string;
    description: string;
    valuePct: number;
    numerator: number;
    denominator: number;
    windowDays: number;
  };
  retention: { cohortDays: number; cohortSize: number; d1Pct: number; d7Pct: number; d30Pct: number };
  mastery: { learnersStarted: number; chaptersMastered: number; masteryRatePct: number; avgDaysToMastery: number | null };
  errorPatterns: { total: number; active: number; improving: number; resolved: number; resolutionRatePct: number };
  wrongNotes: { total: number; mastered: number; masteredPct: number; retryAccuracyPct: number };
  aiSolver: { totalSolves: number; studentAnswered: number; studentCorrectPct: number | null; ocrEvents: number };
  engagement: { activeUsers7d: number; avgProblemsPerActiveDay: number; avgMinutesPerActiveDay: number };
  learningEvents7d: Array<{ eventType: string; count: number }>;
};

const EVENT_LABELS_KO: Record<string, string> = {
  'study.session.start': '학습 세션 시작',
  'study.problem.submit': '연습 문제 제출',
  'study.session.end': '학습 세션 종료',
  'review.queue.open': '복습 대기열 열기',
  'review.problem.submit': '복습 문제 제출',
  'review.problem.mastered': '복습 문제 마스터',
  'solver.ocr.start': 'OCR 시작',
  'solver.ocr.done': 'OCR 완료',
  'solver.ocr.retake': 'OCR 재촬영',
  'solver.result.shown': 'AI 풀이 결과 표시',
  'solver.practice.now': 'AI 풀이 → 연습 이동',
  'notes.tab.open': '오답노트 탭 열기',
  'notes.card.open': '오답노트 카드 열기',
  'chapter.concept.complete': '개념 학습 완료',
  'chapter.done': '챕터 완료',
  'chapter.practice.complete': '챕터 연습 완료',
  'chapter.practice.problem-complete': '챕터 연습 문제 완료',
};

function formatAvgDays(days: number | null): string {
  if (days == null) return '—';
  if (days < 0.1) return '당일';
  if (days < 1) return `${Math.round(days * 10) / 10}일`;
  return `${Math.round(days * 10) / 10}일`;
}

function MetricCard({ title, value, sub }: { title: string; value: string; sub?: string }) {
  return (
    <div className="card" style={{ padding: '12px 14px', background: 'var(--p-surface)', borderColor: 'var(--p-border)' }}>
      <div style={{ fontSize: 11, color: 'var(--p-muted)', fontWeight: 600, letterSpacing: '0.02em' }}>
        {title}
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, marginTop: 4, letterSpacing: '-0.02em' }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--p-ink-3)', marginTop: 4, lineHeight: 1.45 }}>{sub}</div>}
    </div>
  );
}

export function AdminLearningMetricsScreen() {
  const nav = useNavigate();
  const metrics = useQuery({
    queryKey: ['admin-learning-effectiveness'],
    queryFn: () => get<Overview>('/admin/learning-effectiveness'),
    refetchInterval: 60_000,
  });

  const d = metrics.data;

  return (
    <div className="screen">
      <div className="app-head" style={{ flexShrink: 0 }}>
        <div className="greet">
          <div className="hello">관리자</div>
          <div className="name">학습 효과 KPI</div>
        </div>
        <button
          onClick={() => nav('/app')}
          style={{ marginLeft: 'auto', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer' }}
        >
          닫기
        </button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', minHeight: 0, padding: '0 22px 24px' }}>
        {metrics.isLoading && (
          <div style={{ padding: 24, color: 'var(--p-muted)', fontSize: 13 }}>집계 중…</div>
        )}
        {metrics.isError && (
          <div style={{ padding: 24, color: 'var(--p-danger)', fontSize: 13 }}>KPI를 불러오지 못했습니다.</div>
        )}
        {d && (
          <>
            <div style={{ marginTop: 12, marginBottom: 8, fontSize: 11, color: 'var(--p-muted)' }}>
              갱신: {new Date(d.generatedAt).toLocaleString('ko-KR')}
            </div>

            <div className="card" style={{ padding: '10px 12px', marginBottom: 10, background: 'var(--p-surface-2)', fontSize: 11, color: 'var(--p-ink-3)', lineHeight: 1.5 }}>
              실제 학습자만 집계합니다. 시드·도그푸드·관리자·E2E 테스트 계정({d.excludedTesterCount}명)은 제외됩니다.
              North Star 분모와 리텐션 코호트는 집계 기준이 다릅니다.
            </div>

            <MetricCard
              title={`핵심 지표 — ${d.northStar.label}`}
              value={`${d.northStar.valuePct}%`}
              sub={`${d.northStar.numerator} / ${d.northStar.denominator}명 · ${d.northStar.description}`}
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 10 }}>
              <MetricCard title="D1 리텐션" value={`${d.retention.d1Pct}%`} sub={`가입 코호트 ${d.retention.cohortSize}명`} />
              <MetricCard title="D7 리텐션" value={`${d.retention.d7Pct}%`} sub={`최근 ${d.retention.cohortDays}일 가입자`} />
              <MetricCard title="D30 리텐션" value={`${d.retention.d30Pct}%`} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginTop: 10 }}>
              <MetricCard
                title="챕터 마스터리율"
                value={`${d.mastery.masteryRatePct}%`}
                sub={`마스터 ${d.mastery.chaptersMastered}건 / 시작 ${d.mastery.learnersStarted}건 (챕터 진행 row 기준)`}
              />
              <MetricCard title="평균 마스터리 소요" value={formatAvgDays(d.mastery.avgDaysToMastery)} sub="첫 시작 → masteredAt" />
              <MetricCard
                title="오답 패턴 해소율"
                value={`${d.errorPatterns.resolutionRatePct}%`}
                sub={`해소 ${d.errorPatterns.resolved} / 전체 ${d.errorPatterns.total} (활성 ${d.errorPatterns.active})`}
              />
              <MetricCard
                title="오답노트 마스터율"
                value={`${d.wrongNotes.masteredPct}%`}
                sub={`재시도 정답률 ${d.wrongNotes.retryAccuracyPct}% · ${d.wrongNotes.mastered}/${d.wrongNotes.total}건`}
              />
              <MetricCard
                title="AI 풀이 정확도"
                value={d.aiSolver.studentCorrectPct != null ? `${d.aiSolver.studentCorrectPct}%` : '—'}
                sub={`학생 검증 ${d.aiSolver.studentAnswered}건 / 전체 풀이 ${d.aiSolver.totalSolves}건`}
              />
              <MetricCard
                title="7일 참여도"
                value={`${d.engagement.activeUsers7d}명`}
                sub={`활성일당 ${d.engagement.avgProblemsPerActiveDay}문제 · ${d.engagement.avgMinutesPerActiveDay}분`}
              />
            </div>

            {d.learningEvents7d.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>학습 이벤트 (최근 7일)</div>
                <div className="card" style={{ padding: 12, background: 'var(--p-surface-2)' }}>
                  {d.learningEvents7d.map((e) => (
                    <div key={e.eventType} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '4px 0', borderBottom: '1px solid var(--p-border)' }}>
                      <span>{EVENT_LABELS_KO[e.eventType] ?? e.eventType}</span>
                      <span style={{ fontWeight: 600 }}>{e.count}회</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <TabBar />
    </div>
  );
}