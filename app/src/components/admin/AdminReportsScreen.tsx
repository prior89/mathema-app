/* /app/admin/reports — Sprint 7: student-report review dashboard.
 *
 * Lists every Problem flagged STUDENT_REPORTED. Operator picks:
 *   - 복원: false alarm. Clears the flag; if no other critical flag remains,
 *           qualityStatus flips back to NULL and the row re-enters the pool.
 *   - 유지: legitimate report. Row stays EXCLUDED (no action needed; row
 *           stays in the list as a record).
 *
 * Pair with AdminMasterySetScreen: once a reported row is restored or
 * permanently swapped out of a chapter's canonical 20, the loop closes.
 */
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { get, post } from '../../lib/api';
import { TabBar } from '../main/TabBar';

type ReportRow = {
  problemId: string;
  source: string;
  body: string;
  difficulty: string;
  difficultyLevel: number;
  qualityStatus: string | null;
  flags: string[];
  curriculum: 'KR' | 'IN' | 'LEGACY';
  chapterCode: string | null;
  chapterTitle: string | null;
  reportedAt: string;
};

export function AdminReportsScreen() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const [curriculum, setCurriculum] = useState<'ALL' | 'KR' | 'IN'>('ALL');

  const reports = useQuery({
    queryKey: ['admin-reports', curriculum],
    queryFn: () =>
      get<ReportRow[]>(
        '/admin/reports' + (curriculum === 'ALL' ? '' : `?curriculum=${curriculum}`),
      ),
  });

  const restore = useMutation({
    mutationFn: (problemId: string) => post(`/admin/reports/${problemId}/restore`, {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-reports'] }),
    onError: (e: any) => {
      const msg = e?.response?.data?.message ?? e?.message ?? '복원 실패';
      window.alert(`복원 실패: ${msg}`);
    },
  });

  const rows = reports.data ?? [];
  const activeCount = rows.filter((r) => r.qualityStatus === 'EXCLUDED').length;

  return (
    <div className="screen">
      <div className="app-head" style={{ flexShrink: 0 }}>
        <div className="greet">
          <div className="hello">관리자</div>
          <div className="name">학생 신고 검토</div>
        </div>
        <button
          onClick={() => nav('/app')}
          style={{ marginLeft: 'auto', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer' }}
        >
          닫기
        </button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', minHeight: 0, padding: '0 22px' }}>
        {/* Filter chips */}
        <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
          {(['ALL', 'KR', 'IN'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCurriculum(c)}
              className="chip"
              style={{
                cursor: 'pointer',
                background: curriculum === c ? 'var(--p-primary)' : 'var(--p-bg-2)',
                color: curriculum === c ? 'var(--p-primary-fg)' : 'var(--p-ink-2)',
                border: 'none',
                fontSize: 12,
                padding: '4px 10px',
              }}
            >
              {c === 'ALL' ? '전체' : c}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 12, color: 'var(--p-ink-2)', alignSelf: 'center' }}>
            EXCLUDED <span style={{ color: 'var(--p-danger)', fontWeight: 600 }}>{activeCount}</span> / 전체 {rows.length}
          </span>
        </div>

        {reports.isLoading && (
          <div style={{ padding: 24, color: 'var(--p-muted)' }}>불러오는 중…</div>
        )}
        {reports.isError && (
          <div style={{ padding: 14, color: 'var(--p-danger)' }}>목록을 불러올 수 없어요.</div>
        )}
        {!reports.isLoading && rows.length === 0 && (
          <div style={{ padding: 24, color: 'var(--p-muted)', textAlign: 'center' }}>
            신고된 문제가 없습니다.
          </div>
        )}

        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {rows.map((r) => {
            const isStillExcluded = r.qualityStatus === 'EXCLUDED';
            return (
              <div
                key={r.problemId}
                className="card"
                style={{
                  padding: 12,
                  borderLeft: isStillExcluded ? '3px solid var(--p-danger)' : '3px solid var(--p-success)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                  <span className="chip" style={{ fontSize: 10, background: 'var(--p-accent-tint)' }}>
                    {r.curriculum}
                  </span>
                  {r.chapterCode && (
                    <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--p-ink-2)' }}>
                      {r.chapterCode}
                    </span>
                  )}
                  <span style={{ fontSize: 11, color: 'var(--p-ink-2)' }}>{r.source}</span>
                  <span
                    className="chip"
                    style={{
                      fontSize: 10,
                      background:
                        r.qualityStatus === 'EXCLUDED' ? 'var(--p-danger-tint)' :
                        r.qualityStatus === 'APPROVED' ? 'var(--p-success-tint)' :
                        'var(--p-accent-tint)',
                    }}
                  >
                    {r.qualityStatus ?? 'NULL'}
                  </span>
                  {r.flags
                    .filter((f) => f !== 'STUDENT_REPORTED')
                    .map((f) => (
                      <span key={f} className="chip" style={{ fontSize: 10, background: 'var(--p-danger-tint)', color: 'var(--p-danger)' }}>
                        {f}
                      </span>
                    ))}
                  <div style={{ flex: 1 }} />
                  <span style={{ fontSize: 10, color: 'var(--p-muted)' }}>
                    {new Date(r.reportedAt).toLocaleString('ko-KR', { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--p-ink-2)', marginTop: 6, lineHeight: 1.4 }}>
                  {r.body}…
                </div>
                {r.chapterTitle && (
                  <div style={{ fontSize: 11, color: 'var(--p-muted)', marginTop: 4 }}>
                    {r.chapterTitle}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                  {isStillExcluded ? (
                    <button
                      className="btn outline"
                      onClick={() => {
                        if (window.confirm('이 문제를 복원하시겠어요? 다시 학생에게 노출됩니다.')) {
                          restore.mutate(r.problemId);
                        }
                      }}
                      disabled={restore.isPending}
                      style={{ fontSize: 12, padding: '6px 14px' }}
                    >
                      복원
                    </button>
                  ) : (
                    <span style={{ fontSize: 11, color: 'var(--p-success)' }}>
                      ✓ 복원됨
                    </span>
                  )}
                  {r.chapterCode && (
                    <button
                      onClick={() => nav(`/app/admin/mastery-set`)}
                      style={{ fontSize: 11, background: 'none', border: 'none', color: 'var(--p-primary)', cursor: 'pointer' }}
                    >
                      canonical 20 검사 →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <TabBar />
    </div>
  );
}
