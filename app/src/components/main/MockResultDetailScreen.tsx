/* MockResultDetailScreen — Recent results 카드 클릭 시 review.
 * GET /mock-exams/results/:id → 점수 + 문제별 정·오답 + 내 선택 + rationale.
 */
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { BarChart3, RotateCcw } from 'lucide-react';
import { fetchMockResultDetail, fetchMockSummary } from '../../lib/queries';
import { startRecommendedExam } from '../../lib/mutations';
import { buildRecommendedExamLaunch } from '../../lib/mock-exam-flow';
import { normalizeScoreDelta, normalizeWeakAreas } from '../../lib/mock-result-report';
import { useT } from '../../lib/i18n';
import type { TranslationKey } from '../../lib/translations';
import { Glyph } from '../onboarding/Glyph';
import { TabBar } from './TabBar';
import MathText from '../MathText';
import { useAuth } from '../../context/AuthContext';

function gradeBand(n: number): string {
  if (n <= 1) return 'A1';
  if (n <= 2) return 'A2';
  if (n <= 3) return 'B1';
  if (n <= 4) return 'B2';
  if (n <= 5) return 'C1';
  if (n <= 6) return 'C2';
  return n <= 7 ? 'D' : 'E';
}

// Localized step labels (2026-06-12 audit): raw CONCEPT/PROCESS/ANSWER enum
// values were leaking into the per-step result rows.
const STEP_LABEL_KEY: Record<number, TranslationKey> = {
  1: 'study.step.concept', 2: 'study.step.process', 3: 'study.step.answer',
};

type ResultLocationState = {
  origin?: 'study' | 'test';
  examKind?: 'recommended';
  marks?: number | null;
  maxMarks?: number | null;
};

export function MockResultDetailScreen() {
  const { resultId } = useParams<{ resultId: string }>();
  const nav = useNavigate();
  const loc = useLocation();
  const resultState = loc.state as ResultLocationState | null;
  const { t } = useT();
  const { user } = useAuth();
  const detail = useQuery({
    queryKey: ['mock-result', resultId],
    queryFn: () => fetchMockResultDetail(resultId!),
    enabled: !!resultId,
  });
  // Shared cache with the Mock tab; used only to show the "your score went up"
  // moment when THIS result is the most recent one (so scoreDelta applies).
  const summary = useQuery({ queryKey: ['mock-summary'], queryFn: fetchMockSummary });
  const [nextExamState, setNextExamState] = useState<'empty' | 'error' | null>(null);
  const startNextExam = useMutation({
    mutationFn: startRecommendedExam,
    onSuccess: (exam) => {
      const launch = buildRecommendedExamLaunch(exam, user?.id ?? '');
      if (!launch) {
        setNextExamState('empty');
        return;
      }
      nav(launch.path, { state: launch.state });
    },
    onError: () => setNextExamState('error'),
  });

  const correct = detail.data?.problems.filter((p) => p.allCorrect).length ?? 0;
  const total = detail.data?.problems.length ?? 0;
  const isWeakAreaExam = detail.data?.type === 'RECOMMENDED'
    || resultState?.examKind === 'recommended';
  const hasWeakAreaReport = Array.isArray(detail.data?.weakAreas);
  const weakAreas = normalizeWeakAreas(detail.data?.weakAreas);
  const isLatestResult = !!detail.data && detail.data.score === summary.data?.lastScore;
  const hasDetailScoreDelta = !!detail.data
    && Object.prototype.hasOwnProperty.call(detail.data, 'scoreDelta');
  const explicitScoreDelta = normalizeScoreDelta(detail.data?.scoreDelta)
    ?? normalizeScoreDelta(detail.data?.comparison?.delta);
  const scoreDelta = !isWeakAreaExam
    ? null
    : hasDetailScoreDelta
      ? explicitScoreDelta
      : explicitScoreDelta ?? (isLatestResult ? normalizeScoreDelta(summary.data?.scoreDelta) : null);
  const isBest = isWeakAreaExam
    && isLatestResult
    && summary.data?.bestScore != null
    && detail.data!.score >= summary.data.bestScore
    && (summary.data.attemptCount ?? 0) > 1;
  const deltaLabel = scoreDelta == null
    ? null
    : scoreDelta > 0
      ? t('mockResult.delta.improved', { n: scoreDelta })
      : scoreDelta < 0
        ? t('mockResult.delta.declined', { n: scoreDelta })
        : t('mockResult.delta.same');
  // Where to send the user when they tap Back — preserves the tab they came
  // from (Study for chapter tests, Test for weekly review).
  const backTarget = resultState?.origin === 'test' ? '/app/test' : '/app/study';
  // REAL full-paper exams carry raw JEE marks in nav state (not persisted).
  const marks = resultState?.marks;
  const maxMarks = resultState?.maxMarks;

  return (
    <div className="screen">
      <div className="prob-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <button onClick={() => nav(backTarget)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} aria-label={t('mockResult.back')}>
            <Glyph.ArrowL accent="var(--p-ink-2)" size={20} />
          </button>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11, color: 'var(--p-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>
              {t(isWeakAreaExam ? 'mockResult.eyebrow' : 'mockResult.eyebrow.general')}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {detail.data?.name ?? t('mockResult.loading')}
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '14px 22px 8px', minHeight: 0 }}>
        {detail.isLoading && (
          <div style={{ padding: 22, textAlign: 'center', color: 'var(--p-muted)' }}>{t('mockResult.loading')}</div>
        )}
        {detail.isError && (
          <div className="card" style={{ padding: 14, color: 'var(--p-danger-ink)' }}>
            {t('mockResult.errorLoad')}
          </div>
        )}

        {detail.data && (
          <>
            {/* Score summary */}
            <div className="card" style={{ padding: 18, textAlign: 'center' }}>
              <div style={{ fontSize: 10.5, color: 'var(--p-muted)', fontWeight: 750, letterSpacing: '0.04em' }}>
                {t(isWeakAreaExam ? 'mockResult.score.title' : 'mockResult.score.title.general')}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontStyle: 'italic', color: 'var(--p-primary)', lineHeight: 1 }}>
                {detail.data.score}
              </div>
              <div className="caption" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, marginTop: 6 }}>{t('mockResult.outOf')}</div>
            </div>

            {(deltaLabel || isBest) && (
              <div
                className="card"
                style={{
                  marginTop: 10,
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  background: scoreDelta != null && scoreDelta < 0 ? 'var(--p-warning-tint)' : 'var(--p-success-tint)',
                  borderColor: scoreDelta != null && scoreDelta < 0 ? 'var(--p-warning)' : 'var(--p-success)',
                }}
              >
                <span style={{ fontSize: 22 }} aria-hidden>
                  {isBest ? '🏆' : scoreDelta != null && scoreDelta > 0 ? '📈' : scoreDelta != null && scoreDelta < 0 ? '🧭' : '✓'}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: scoreDelta != null && scoreDelta < 0 ? 'var(--p-warning-ink)' : 'var(--p-success-ink)' }}>
                    {isBest ? t('mockResult.delta.best') : deltaLabel}
                  </div>
                  {isBest && deltaLabel && (
                    <div style={{ fontSize: 11.5, color: 'var(--p-ink-2)', marginTop: 2 }}>{deltaLabel}</div>
                  )}
                </div>
              </div>
            )}

            <div className="stat-grid" style={{ marginTop: 10 }}>
              <Cell k={t('mockResult.cell.grade')} v={gradeBand(detail.data.grade)} />
              <Cell k={t('mockResult.cell.percentile')} v={`${detail.data.percentile}`} u="%" />
              <Cell k={t('mockResult.cell.correct')} v={`${correct}/${total}`} />
              <Cell k={t('mockResult.cell.duration')} v={t('mockResult.duration.suffix', { n: detail.data.durationMin })} sub={t('mockResult.duration.sub', { total: detail.data.totalMinutes })} />
              {marks != null && maxMarks != null && (
                <Cell k={t('mockResult.cell.marks')} v={`${marks}/${maxMarks}`} sub={t('mockResult.marks.sub')} />
              )}
            </div>

            {hasWeakAreaReport && (
              <>
                <div className="section-h" style={{ marginTop: 18 }}>
                  <span className="label">
                    {t(isWeakAreaExam ? 'mockResult.weak.section' : 'mockResult.weak.section.general')}
                  </span>
                  {weakAreas.length > 0 && (
                    <span className="more">{t('mockResult.weak.count', { n: weakAreas.length })}</span>
                  )}
                </div>
                {weakAreas.length === 0 ? (
                  <div className="card" style={{ padding: 14, color: 'var(--p-success-ink)', background: 'var(--p-success-tint)', borderColor: 'var(--p-success)' }}>
                    {t(isWeakAreaExam ? 'mockResult.weak.empty' : 'mockResult.weak.empty.general')}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {weakAreas.map((area, index) => {
                      const accuracy = area.accuracyPct == null ? null : Math.round(area.accuracyPct);
                      const barWidth = accuracy == null ? 0 : Math.min(100, Math.max(0, accuracy));
                      return (
                        <div key={`${area.key}-${index}`} className="card" style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: 700, color: 'var(--p-ink)' }}>
                              {area.name}
                            </div>
                            {accuracy != null && (
                              <span className="chip" style={{ color: 'var(--p-danger-ink)', background: 'var(--p-danger-tint)' }}>
                                {t('mockResult.weak.accuracy', { pct: accuracy })}
                              </span>
                            )}
                          </div>
                          {accuracy != null && (
                            <div style={{ height: 5, marginTop: 9, borderRadius: 999, overflow: 'hidden', background: 'var(--p-surface-2)' }} aria-hidden>
                              <div style={{ height: '100%', width: `${barWidth}%`, borderRadius: 'inherit', background: 'var(--p-danger)' }} />
                            </div>
                          )}
                          {area.incorrectProblems != null && area.problemCount != null && (
                            <div style={{ marginTop: 6, fontSize: 11.5, color: 'var(--p-muted)' }}>
                              {t('mockResult.weak.missed', { wrong: area.incorrectProblems, total: area.problemCount })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            <div
              className="card"
              style={{
                marginTop: 12,
                padding: 16,
                background: 'linear-gradient(135deg, var(--p-primary-tint), var(--p-accent-tint))',
                borderColor: 'var(--p-primary)',
              }}
            >
              <div style={{ fontSize: 10, color: 'var(--p-primary)', fontWeight: 800, letterSpacing: '0.05em' }}>
                {t(isWeakAreaExam ? 'mockResult.next.eyebrow' : 'mockResult.next.eyebrow.general')}
              </div>
              <div style={{ marginTop: 3, fontFamily: 'var(--font-display)', fontSize: 19, color: 'var(--p-ink)', letterSpacing: '-0.005em' }}>
                {t(isWeakAreaExam ? 'mockResult.next.title' : 'mockResult.next.title.general')}
              </div>
              <div style={{ marginTop: 5, color: 'var(--p-ink-2)', fontSize: 12, lineHeight: 1.55 }}>
                {t(isWeakAreaExam ? 'mockResult.next.desc' : 'mockResult.next.desc.general')}
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: 8,
                  marginTop: 12,
                }}
              >
                <button
                  className="btn outline"
                  onClick={() => nav('/app/report')}
                  style={{ minWidth: 0, height: 44, padding: '0 10px', fontSize: 12.5 }}
                >
                  <BarChart3 size={16} />
                  {t(isWeakAreaExam ? 'mockResult.next.report' : 'mockResult.next.report.general')}
                </button>
                <button
                  className="btn"
                  disabled={startNextExam.isPending}
                  onClick={() => {
                    setNextExamState(null);
                    startNextExam.mutate();
                  }}
                  style={{ minWidth: 0, height: 44, padding: '0 10px', fontSize: 12.5 }}
                >
                  <RotateCcw size={16} />
                  {startNextExam.isPending
                    ? t('mockResult.next.starting')
                    : t(isWeakAreaExam ? 'mockResult.next.restart' : 'mockResult.next.restart.general')}
                </button>
              </div>
              {nextExamState && (
                <div
                  role="alert"
                  style={{ marginTop: 9, color: 'var(--p-danger-ink)', fontSize: 12, lineHeight: 1.45 }}
                >
                  {nextExamState === 'empty'
                    ? t('test.recommended.empty')
                    : t('test.recommended.error')}
                </div>
              )}
            </div>

            <div className="section-h">
              <span className="label">
                {t(isWeakAreaExam ? 'mockResult.review.section' : 'mockResult.review.section.general')}
              </span>
              <span className="more">{t('mockResult.review.count', { n: total })}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {detail.data.problems.length === 0 && (
                <div className="card" style={{ padding: 14, textAlign: 'center', color: 'var(--p-muted)' }}>
                  {t('mockResult.empty')}
                </div>
              )}
              {detail.data.problems.map((p, i) => (
                <div key={p.problemId} className="card" style={{ padding: 14, borderColor: p.allCorrect ? 'var(--p-success)' : 'var(--p-danger)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 18 }}>{i + 1}.</span>
                    {/* Attribution (p.source) intentionally not rendered. */}
                    <span className="chip" style={{ marginLeft: 'auto', fontSize: 10.5, background: p.allCorrect ? 'var(--p-success-tint)' : 'var(--p-danger-tint)', color: p.allCorrect ? 'var(--p-success-ink)' : 'var(--p-danger-ink)' }}>
                      {p.allCorrect ? t('mockResult.problem.allCorrect') : t('mockResult.problem.missed')}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--p-ink-2)', whiteSpace: 'pre-wrap', marginBottom: 8 }}><MathText text={p.body} /></div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {p.steps.map((s) => (
                      <div key={s.stepIndex} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12 }}>
                        <span className="chip" style={{ fontSize: 9.5, padding: '1px 6px', minWidth: 60, textAlign: 'center' }}>
                          {STEP_LABEL_KEY[s.stepIndex]
                            ? t('mockResult.step.pill', { n: s.stepIndex, label: t(STEP_LABEL_KEY[s.stepIndex]) })
                            : t('mockResult.step.pillNoLabel', { n: s.stepIndex })}
                        </span>
                        <span style={{ color: s.isCorrect ? 'var(--p-success-ink)' : 'var(--p-danger-ink)', fontWeight: 600 }}>
                          {s.isCorrect ? '✓' : '✗'}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ color: 'var(--p-ink-2)' }}>
                            <strong style={{ color: 'var(--p-ink)' }}>{t('mockResult.myPick')}</strong> {s.myChoice ? <MathText text={s.myChoice} /> : '—'}
                          </div>
                          {!s.isCorrect && s.rationale && (
                            <div style={{ marginTop: 2, color: 'var(--p-muted)', fontSize: 11.5 }}>
                              <MathText text={s.rationale} />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ height: 16 }} />
          </>
        )}
      </div>
      <TabBar />
    </div>
  );
}

function Cell({ k, v, u, sub }: { k: string; v: string; u?: string; sub?: string }) {
  return (
    <div className="stat">
      <div className="k">{k}</div>
      <div className="v italic">
        {v}
        {u && <span style={{ fontSize: 14, color: 'var(--p-muted)' }}>{u}</span>}
      </div>
      {sub && <div className="delta" style={{ color: 'var(--p-muted)' }}>{sub}</div>}
    </div>
  );
}
