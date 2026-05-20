/* MockResultDetailScreen — Recent results 카드 클릭 시 review.
 * GET /mock-exams/results/:id → 점수 + 문제별 정·오답 + 내 선택 + rationale.
 */
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { get } from '../../lib/api';
import { Glyph } from '../onboarding/Glyph';
import { TabBar } from './TabBar';
import MathText from '../MathText';

type StepRow = {
  stepIndex: number;
  isCorrect: boolean;
  myChoice: string | null;
  rationale: string | null;
};
type ProblemRow = {
  problemId: string;
  source: string;
  body: string;
  steps: StepRow[];
  allCorrect: boolean;
};
type ResultDetail = {
  id: string;
  name: string;
  takenAt: string;
  score: number;
  grade: number;
  percentile: number;
  durationMin: number;
  totalMinutes: number;
  problems: ProblemRow[];
};

function gradeBand(n: number): string {
  if (n <= 1) return 'A1';
  if (n <= 2) return 'A2';
  if (n <= 3) return 'B1';
  if (n <= 4) return 'B2';
  if (n <= 5) return 'C1';
  if (n <= 6) return 'C2';
  return n <= 7 ? 'D' : 'E';
}

const STEP_LABEL: Record<number, string> = { 1: 'CONCEPT', 2: 'PROCESS', 3: 'ANSWER' };

export function MockResultDetailScreen() {
  const { resultId } = useParams<{ resultId: string }>();
  const nav = useNavigate();
  const detail = useQuery({
    queryKey: ['mock-result', resultId],
    queryFn: () => get<ResultDetail>(`/mock-exams/results/${resultId}`),
    enabled: !!resultId,
  });

  const correct = detail.data?.problems.filter((p) => p.allCorrect).length ?? 0;
  const total = detail.data?.problems.length ?? 0;
  // Where to send the user when they tap Back — preserves the tab they came
  // from (Study for chapter tests, Test for weekly review).
  const loc = useLocation();
  const backTarget = ((loc.state as any)?.origin === 'test') ? '/app/test' : '/app/study';

  return (
    <div className="screen">
      <div className="prob-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <button onClick={() => nav(backTarget)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} aria-label="Back">
            <Glyph.ArrowL accent="var(--p-ink-2)" size={20} />
          </button>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11, color: 'var(--p-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>REVIEW</div>
            <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {detail.data?.name ?? 'Loading…'}
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '14px 22px 8px', minHeight: 0 }}>
        {detail.isLoading && (
          <div style={{ padding: 22, textAlign: 'center', color: 'var(--p-muted)' }}>Loading…</div>
        )}
        {detail.isError && (
          <div className="card" style={{ padding: 14, color: 'var(--p-danger)' }}>
            Could not load this result.
          </div>
        )}

        {detail.data && (
          <>
            {/* Score summary */}
            <div className="card" style={{ padding: 18, textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontStyle: 'italic', color: 'var(--p-primary)', lineHeight: 1 }}>
                {detail.data.score}
              </div>
              <div className="caption" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, marginTop: 6 }}>OUT OF 100</div>
            </div>

            <div className="stat-grid" style={{ marginTop: 10 }}>
              <Cell k="Grade" v={gradeBand(detail.data.grade)} />
              <Cell k="Percentile" v={`${detail.data.percentile}`} u="%" />
              <Cell k="Correct" v={`${correct}/${total}`} />
              <Cell k="Duration" v={`${detail.data.durationMin}m`} sub={`of ${detail.data.totalMinutes}m`} />
            </div>

            <div className="section-h">
              <span className="label">Question review</span>
              <span className="more">{total} questions</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {detail.data.problems.length === 0 && (
                <div className="card" style={{ padding: 14, textAlign: 'center', color: 'var(--p-muted)' }}>
                  No questions were attempted in this exam.
                </div>
              )}
              {detail.data.problems.map((p, i) => (
                <div key={p.problemId} className="card" style={{ padding: 14, borderColor: p.allCorrect ? 'var(--p-success)' : 'var(--p-danger)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 18 }}>{i + 1}.</span>
                    <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--p-muted)' }}>
                      {p.source}
                    </span>
                    <span className="chip" style={{ marginLeft: 'auto', fontSize: 10.5, background: p.allCorrect ? 'var(--p-success-tint)' : 'var(--p-danger-tint)', color: p.allCorrect ? 'var(--p-success)' : 'var(--p-danger)' }}>
                      {p.allCorrect ? '✓ ALL' : '✗ MISSED'}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--p-ink-2)', whiteSpace: 'pre-wrap', marginBottom: 8 }}><MathText text={p.body} /></div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {p.steps.map((s) => (
                      <div key={s.stepIndex} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12 }}>
                        <span className="chip" style={{ fontSize: 9.5, padding: '1px 6px', minWidth: 60, textAlign: 'center' }}>
                          STEP {s.stepIndex} {STEP_LABEL[s.stepIndex] ? `· ${STEP_LABEL[s.stepIndex]}` : ''}
                        </span>
                        <span style={{ color: s.isCorrect ? 'var(--p-success)' : 'var(--p-danger)', fontWeight: 600 }}>
                          {s.isCorrect ? '✓' : '✗'}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ color: 'var(--p-ink-2)' }}>
                            <strong style={{ color: 'var(--p-ink)' }}>Your pick:</strong> {s.myChoice ? <MathText text={s.myChoice} /> : '—'}
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
