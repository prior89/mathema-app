/* /app/admin/mastery-set — Sprint 5 #76 E + Sprint 6 frontend.
 * Inspect a chapter's frozen canonical 20-set, see needsSwap rows highlighted,
 * pick a candidate from the lesson's broader pool, swap in. Country (KR/IN)
 * auto-detected from chapterCode prefix on the backend.
 *
 * Backed by:
 *   GET  /admin/mastery-set/:chapterCode
 *   POST /admin/mastery-set/:chapterCode/swap
 */
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { get, post } from '../../lib/api';
import { TabBar } from '../main/TabBar';

type CurrentRow = {
  index: number;
  problemId: string;
  present: boolean;
  source: string | null;
  body: string | null;
  difficulty: string | null;
  difficultyLevel: number | null;
  stepCount: number;
  qualityStatus: string | null;
  flags: string[];
  conceptMismatch: boolean;
  needsSwap: boolean;
};
type Candidate = {
  problemId: string;
  source: string;
  body: string;
  difficulty: string;
  difficultyLevel: number;
  qualityStatus: string | null;
};
type Inventory = {
  chapterCode: string;
  curriculum: 'KR' | 'IN';
  lessonId: string;
  title: string | null;
  canonicalCount: number;
  needsSwapCount: number;
  current: CurrentRow[];
  candidates: Candidate[];
  candidatePoolSize: number;
};

export function AdminMasterySetScreen() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const [chapterInput, setChapterInput] = useState('');
  const [activeCode, setActiveCode] = useState<string | null>(null);
  // Per-row swap state (which candidate is picked for which row + reason).
  const [pickedCandidate, setPickedCandidate] = useState<Record<string, string>>({});
  const [reason, setReason] = useState<Record<string, string>>({});

  const inventory = useQuery({
    queryKey: ['admin-mastery-set', activeCode],
    queryFn: () => get<Inventory>(`/admin/mastery-set/${activeCode}`),
    enabled: !!activeCode,
  });

  const swap = useMutation({
    mutationFn: (payload: { code: string; oldProblemId: string; newProblemId: string; reason: string }) =>
      post(`/admin/mastery-set/${payload.code}/swap`, {
        oldProblemId: payload.oldProblemId,
        newProblemId: payload.newProblemId,
        reason: payload.reason,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-mastery-set', activeCode] });
      setPickedCandidate({});
      setReason({});
    },
    onError: (e: any) => {
      const msg = e?.response?.data?.message ?? e?.message ?? '교체 실패';
      window.alert(`교체 실패: ${msg}`);
    },
  });

  function lookup() {
    const trimmed = chapterInput.trim();
    if (!trimmed) return;
    setActiveCode(trimmed);
  }

  function doSwap(row: CurrentRow) {
    const code = activeCode!;
    const newProblemId = pickedCandidate[row.problemId];
    const why = (reason[row.problemId] ?? '').trim();
    if (!newProblemId) {
      window.alert('후보를 먼저 선택해 주세요.');
      return;
    }
    if (!why) {
      window.alert('교체 사유를 입력해 주세요. (audit log용)');
      return;
    }
    swap.mutate({ code, oldProblemId: row.problemId, newProblemId, reason: why });
  }

  const inv = inventory.data;

  return (
    <div className="screen">
      <div className="app-head" style={{ flexShrink: 0 }}>
        <div className="greet">
          <div className="hello">관리자</div>
          <div className="name">Mastery 20-set 교체</div>
        </div>
        <button
          onClick={() => nav('/app')}
          style={{ marginLeft: 'auto', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer' }}
        >
          닫기
        </button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', minHeight: 0, padding: '0 22px' }}>
        {/* Lookup form */}
        <div className="card" style={{ padding: 14, marginTop: 12 }}>
          <div style={{ fontSize: 12, color: 'var(--p-ink-2)', marginBottom: 6 }}>
            단원 코드 (예: <code>C10-CH04-QUADRATIC-EQUATIONS</code>, <code>K-G7-MATH1-CH02-INTEGERS</code>)
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={chapterInput}
              onChange={(e) => setChapterInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') lookup(); }}
              placeholder="chapterCode"
              style={{ flex: 1, padding: 8, fontSize: 13, fontFamily: 'monospace' }}
            />
            <button
              className="btn"
              onClick={lookup}
              disabled={!chapterInput.trim()}
              style={{ width: 80 }}
            >
              조회
            </button>
          </div>
        </div>

        {inventory.isLoading && activeCode && (
          <div style={{ padding: 24, color: 'var(--p-muted)' }}>불러오는 중…</div>
        )}
        {inventory.isError && (
          <div style={{ padding: 14, color: 'var(--p-danger)' }}>
            조회 실패: 단원 코드를 확인해 주세요.
          </div>
        )}

        {inv && (
          <>
            {/* Summary */}
            <div className="card" style={{ padding: 14, marginTop: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                {inv.title} <span style={{ fontSize: 11, color: 'var(--p-ink-2)' }}>· {inv.curriculum}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--p-ink-2)', marginTop: 6 }}>
                canonical {inv.canonicalCount}/20 · 교체 필요{' '}
                <span style={{ color: inv.needsSwapCount > 0 ? 'var(--p-danger)' : 'var(--p-success)', fontWeight: 600 }}>
                  {inv.needsSwapCount}
                </span>{' '}
                · 후보 풀 {inv.candidatePoolSize}
              </div>
            </div>

            {/* Rows */}
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {inv.current.map((row) => (
                <div
                  key={row.problemId}
                  className="card"
                  style={{
                    padding: 12,
                    borderLeft: row.needsSwap ? '3px solid var(--p-danger)' : '3px solid transparent',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontSize: 11, color: 'var(--p-ink-2)', minWidth: 28 }}>
                      #{row.index + 1}
                    </span>
                    <span style={{ fontSize: 12, fontFamily: 'monospace' }}>{row.source ?? '(missing)'}</span>
                    {row.qualityStatus && (
                      <span
                        className="chip"
                        style={{
                          fontSize: 10,
                          background:
                            row.qualityStatus === 'EXCLUDED' ? 'var(--p-danger-tint)' :
                            row.qualityStatus === 'APPROVED' ? 'var(--p-success-tint)' :
                            'var(--p-accent-tint)',
                        }}
                      >
                        {row.qualityStatus}
                      </span>
                    )}
                    {row.conceptMismatch && (
                      <span className="chip" style={{ fontSize: 10, background: 'var(--p-danger-tint)', color: 'var(--p-danger)' }}>
                        MISMATCH
                      </span>
                    )}
                    {row.stepCount !== 3 && (
                      <span className="chip" style={{ fontSize: 10, background: 'var(--p-danger-tint)', color: 'var(--p-danger)' }}>
                        steps={row.stepCount}
                      </span>
                    )}
                    {row.flags.length > 0 && (
                      <span style={{ fontSize: 10, color: 'var(--p-ink-2)' }}>
                        {row.flags.join(', ')}
                      </span>
                    )}
                  </div>
                  {row.body && (
                    <div style={{ fontSize: 12, color: 'var(--p-ink-2)', marginTop: 6, lineHeight: 1.4 }}>
                      {row.body}…
                    </div>
                  )}

                  {row.needsSwap && (
                    <div style={{ marginTop: 10, padding: 10, background: 'var(--p-accent-tint)', borderRadius: 8 }}>
                      <div style={{ fontSize: 11, color: 'var(--p-ink-2)', marginBottom: 6 }}>
                        후보 선택 ({inv.candidates.length}개)
                      </div>
                      <select
                        value={pickedCandidate[row.problemId] ?? ''}
                        onChange={(e) =>
                          setPickedCandidate((s) => ({ ...s, [row.problemId]: e.target.value }))
                        }
                        style={{ width: '100%', padding: 6, fontSize: 12, fontFamily: 'monospace' }}
                      >
                        <option value="">— 후보 선택 —</option>
                        {inv.candidates.map((c) => (
                          <option key={c.problemId} value={c.problemId}>
                            [L{c.difficultyLevel}/{c.difficulty}] {c.source} — {c.body.slice(0, 60)}
                          </option>
                        ))}
                      </select>
                      <input
                        value={reason[row.problemId] ?? ''}
                        onChange={(e) =>
                          setReason((s) => ({ ...s, [row.problemId]: e.target.value }))
                        }
                        placeholder="교체 사유 (감사 로그용)"
                        style={{ width: '100%', marginTop: 6, padding: 6, fontSize: 12 }}
                      />
                      <button
                        className="btn"
                        onClick={() => doSwap(row)}
                        disabled={swap.isPending}
                        style={{ marginTop: 8, width: '100%' }}
                      >
                        {swap.isPending ? '교체 중…' : '교체 적용'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <TabBar />
    </div>
  );
}
