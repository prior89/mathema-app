/* /app/admin/drafts/:id — draft editor. Inline editing for 3 steps and 5 choices per step. */
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { get, patch, post } from '../../lib/api';
import { TabBar } from '../main/TabBar';
import { Glyph } from '../onboarding/Glyph';

type DraftChoice = {
  text: string;
  isCorrect: boolean;
  distractorType: 'CONCEPT_CONFUSION' | 'CALC_ERROR' | 'PROCESS_SKIP' | 'TIME_PRESSURE_GUESS' | null;
  rationale: string | null;
};
type DraftStep = { stepType: 'CONCEPT' | 'PROCESS' | 'ANSWER'; prompt: string; choices: DraftChoice[] };
type DraftPayload = {
  problemBody: string;
  hint: string;
  concept: string;
  difficulty: 'MIDDLE' | 'UPPER_MIDDLE' | 'SEMI_KILLER' | 'KILLER';
  difficultyLevel: number;
  expectedTimeSec: number;
  steps: DraftStep[];
};
type DraftDetail = {
  id: string;
  status: 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'PUBLISHED';
  sourceLabel: string;
  originalText: string;
  reviewerNote: string | null;
  aiResponseJson: DraftPayload | null;
  editedJson: DraftPayload | null;
  conceptLesson: { id: string; ncertClass: string; chapterNumber: number; titleEn: string; unitId: string | null } | null;
  publishedProblemId: string | null;
};

const DISTRACTOR_OPTS = ['CONCEPT_CONFUSION', 'CALC_ERROR', 'PROCESS_SKIP', 'TIME_PRESSURE_GUESS'] as const;
const DIFF_OPTS = ['MIDDLE', 'UPPER_MIDDLE', 'SEMI_KILLER', 'KILLER'] as const;

export function AdminDraftEditorScreen() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ['admin-draft', id],
    queryFn: () => get<DraftDetail>(`/admin/ingest/drafts/${id}`),
    enabled: !!id,
  });

  const [payload, setPayload] = useState<DraftPayload | null>(null);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (q.data) {
      setPayload(q.data.editedJson ?? q.data.aiResponseJson ?? null);
      setNote(q.data.reviewerNote ?? '');
    }
  }, [q.data]);

  const save = useMutation({
    mutationFn: () => patch(`/admin/ingest/drafts/${id}`, { editedJson: payload, reviewerNote: note }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-draft', id] }),
  });
  const approve = useMutation({
    mutationFn: () => post<{ status: string; problemId?: string }>(`/admin/ingest/drafts/${id}/approve`, { publish: true }),
    onSuccess: (r) => {
      qc.invalidateQueries({ queryKey: ['admin-draft', id] });
      qc.invalidateQueries({ queryKey: ['admin-drafts'] });
      alert(r.problemId ? `Published → Problem ${r.problemId}` : 'APPROVED');
    },
    onError: (e: any) => alert(`Publish failed: ${e?.response?.data?.message ?? 'unknown'}`),
  });
  const reject = useMutation({
    mutationFn: () => post(`/admin/ingest/drafts/${id}/reject`, { note }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-drafts'] }); nav('/app/admin/drafts'); },
  });
  const regen = useMutation({
    mutationFn: () => post(`/admin/ingest/drafts/${id}/regenerate`, {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-draft', id] }),
    onError: (e: any) => alert(`Regeneration failed: ${e?.response?.data?.message ?? 'unknown'}`),
  });

  if (q.isLoading) return <Shell title="Loading…"><div style={{ padding: 24, color: 'var(--p-muted)' }}>loading</div></Shell>;
  if (!q.data) return <Shell title="Not found"><div style={{ padding: 24 }}>draft not found</div></Shell>;
  const d = q.data;

  function patchStep(i: number, p: Partial<DraftStep>) {
    if (!payload) return;
    const next = { ...payload, steps: payload.steps.map((s, idx) => idx === i ? { ...s, ...p } : s) };
    setPayload(next);
  }
  function patchChoice(stepIdx: number, choiceIdx: number, p: Partial<DraftChoice>) {
    if (!payload) return;
    const next = {
      ...payload,
      steps: payload.steps.map((s, si) => si !== stepIdx ? s : {
        ...s,
        choices: s.choices.map((c, ci) => {
          if (ci !== choiceIdx) {
            // If marking another as correct, force this to non-correct
            if (p.isCorrect === true) return { ...c, isCorrect: false };
            return c;
          }
          return { ...c, ...p };
        }),
      }),
    };
    setPayload(next);
  }

  return (
    <Shell title={`Draft · ${d.status}`}>
      <div style={{ flex: 1, overflow: 'auto', padding: '14px 22px 8px' }}>
        {/* meta */}
        <div className="card" style={{ padding: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--p-muted)', fontFamily: 'var(--font-mono)' }}>{d.sourceLabel}</div>
          <div style={{ fontSize: 12.5, fontWeight: 600, marginTop: 4 }}>
            {d.conceptLesson ? `${d.conceptLesson.ncertClass} · Ch${d.conceptLesson.chapterNumber} ${d.conceptLesson.titleEn}` : <span style={{ color: 'var(--p-danger)' }}>UNMAPPED — chapter mapping required</span>}
          </div>
          {d.publishedProblemId && (
            <div style={{ fontSize: 11, color: 'var(--p-primary)', marginTop: 6 }}>
              Published → Problem {d.publishedProblemId.slice(0, 12)}…
            </div>
          )}
        </div>

        {/* original text */}
        <div className="card" style={{ padding: 12, marginTop: 10 }}>
          <div style={{ fontSize: 11, color: 'var(--p-muted)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>ORIGINAL (NCERT / source)</div>
          <div style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--p-ink-2)' }}>{d.originalText}</div>
        </div>

        {payload ? (
          <>
            {/* problem body */}
            <div className="card" style={{ padding: 12, marginTop: 10 }}>
              <Label>problem body</Label>
              <textarea className="input" rows={4} value={payload.problemBody} onChange={(e) => setPayload({ ...payload, problemBody: e.target.value })} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                <label style={{ fontSize: 10.5, color: 'var(--p-muted)' }}>
                  difficulty
                  <select className="input" value={payload.difficulty} onChange={(e) => setPayload({ ...payload, difficulty: e.target.value as DraftPayload['difficulty'] })}>
                    {DIFF_OPTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </label>
                <label style={{ fontSize: 10.5, color: 'var(--p-muted)' }}>
                  level (1-5)
                  <input className="input" type="number" min={1} max={5} value={payload.difficultyLevel} onChange={(e) => setPayload({ ...payload, difficultyLevel: parseInt(e.target.value || '3', 10) })} />
                </label>
              </div>
              <div style={{ marginTop: 8 }}><Label>hint</Label>
                <input className="input" value={payload.hint} onChange={(e) => setPayload({ ...payload, hint: e.target.value })} />
              </div>
              <div style={{ marginTop: 8 }}><Label>concept</Label>
                <textarea className="input" rows={2} value={payload.concept} onChange={(e) => setPayload({ ...payload, concept: e.target.value })} />
              </div>
            </div>

            {/* 3 steps */}
            {payload.steps.map((s, si) => (
              <div key={si} className="card" style={{ padding: 12, marginTop: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', background: 'var(--p-primary-tint)', padding: '2px 6px', borderRadius: 4, color: 'var(--p-primary)', fontWeight: 700 }}>STEP {si + 1} · {s.stepType}</span>
                </div>
                <Label>prompt</Label>
                <input className="input" value={s.prompt} onChange={(e) => patchStep(si, { prompt: e.target.value })} />
                <div style={{ marginTop: 6 }}>
                  {s.choices.map((c, ci) => (
                    <div key={ci} style={{ display: 'flex', gap: 6, alignItems: 'flex-start', padding: '6px 0', borderTop: ci > 0 ? '1px dashed var(--p-border)' : 'none' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, paddingTop: 6 }}>
                        <input type="radio" name={`correct-${si}`} checked={c.isCorrect} onChange={() => patchChoice(si, ci, { isCorrect: true })} />
                      </label>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <input className="input" placeholder={`choice ${ci + 1}`} value={c.text} onChange={(e) => patchChoice(si, ci, { text: e.target.value })} />
                        {!c.isCorrect && (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 4, marginTop: 4 }}>
                            <select className="input" value={c.distractorType ?? ''} onChange={(e) => patchChoice(si, ci, { distractorType: (e.target.value || null) as DraftChoice['distractorType'] })} style={{ fontSize: 11 }}>
                              <option value="">distractor…</option>
                              {DISTRACTOR_OPTS.map((d) => <option key={d} value={d}>{d}</option>)}
                            </select>
                            <input className="input" placeholder="rationale" value={c.rationale ?? ''} onChange={(e) => patchChoice(si, ci, { rationale: e.target.value })} style={{ fontSize: 11 }} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="card" style={{ padding: 14, marginTop: 10, fontSize: 12, color: 'var(--p-danger)' }}>
            No LLM payload. Hit "Regenerate" to retry or author one manually.
          </div>
        )}

        {/* reviewer note */}
        <div className="card" style={{ padding: 12, marginTop: 10 }}>
          <Label>reviewer note (optional)</Label>
          <textarea className="input" rows={2} placeholder="reject reason / memo" value={note} onChange={(e) => setNote(e.target.value)} />
        </div>

        {/* action row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
          <button className="btn outline" onClick={() => save.mutate()} disabled={save.isPending || d.status === 'PUBLISHED'}>
            {save.isPending ? 'Saving…' : 'Save draft'}
          </button>
          <button className="btn outline" onClick={() => regen.mutate()} disabled={regen.isPending || d.status === 'PUBLISHED'}>
            {regen.isPending ? 'Regenerating…' : 'Regenerate with AI'}
          </button>
          <button className="btn" onClick={async () => { await save.mutateAsync(); approve.mutate(); }} disabled={approve.isPending || !payload || d.status === 'PUBLISHED'}>
            {approve.isPending ? 'Publishing…' : 'Approve + Publish'}
          </button>
          <button className="btn outline" style={{ color: 'var(--p-danger)', borderColor: 'var(--p-danger)' }} onClick={() => { if (confirm('Reject this draft?')) reject.mutate(); }} disabled={reject.isPending || d.status === 'PUBLISHED'}>
            {reject.isPending ? '…' : 'Reject'}
          </button>
        </div>

        <div style={{ height: 16 }} />
      </div>
      <TabBar />
    </Shell>
  );
}

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  const nav = useNavigate();
  return (
    <div className="screen">
      <div className="prob-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => nav('/app/admin/drafts')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} aria-label="Back">
            <Glyph.ArrowL accent="var(--p-ink-2)" size={20} />
          </button>
          <div>
            <div style={{ fontSize: 11, color: 'var(--p-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>ADMIN</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 10.5, color: 'var(--p-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', marginBottom: 3 }}>{children}</div>;
}
