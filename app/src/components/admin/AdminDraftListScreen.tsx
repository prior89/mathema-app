/* /app/admin/drafts — content draft list with filters. */
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { get } from '../../lib/api';
import { TabBar } from '../main/TabBar';
import { Glyph } from '../onboarding/Glyph';

type DraftSummary = {
  id: string;
  sourceLabel: string;
  status: 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'PUBLISHED';
  createdAt: string;
  proposedDifficulty: string;
  proposedDifficultyLevel: number;
  reviewerNote: string | null;
  aiTokensIn: number | null;
  aiTokensOut: number | null;
  conceptLesson: { id: string; ncertClass: string; chapterNumber: number; titleEn: string } | null;
};

const STATUS_TINTS: Record<DraftSummary['status'], string> = {
  PENDING: 'var(--p-surface-2)',
  IN_REVIEW: 'oklch(0.92 0.05 200)',
  APPROVED: 'oklch(0.92 0.07 145)',
  REJECTED: 'oklch(0.92 0.07 25)',
  PUBLISHED: 'oklch(0.85 0.1 145)',
};

const CLASSES = ['', 'CLASS_7', 'CLASS_8', 'CLASS_9', 'CLASS_10', 'CLASS_11', 'CLASS_12'];
const STATUSES = ['', 'PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'PUBLISHED'];

export function AdminDraftListScreen() {
  const nav = useNavigate();
  const [sp, setSp] = useSearchParams();
  const status = sp.get('status') ?? '';
  const ncertClass = sp.get('ncertClass') ?? '';
  const jobId = sp.get('jobId') ?? '';

  const q = useQuery({
    queryKey: ['admin-drafts', status, ncertClass, jobId],
    queryFn: () => get<{ total: number; items: DraftSummary[] }>('/admin/ingest/drafts', {
      ...(status ? { status } : {}),
      ...(ncertClass ? { ncertClass } : {}),
      ...(jobId ? { jobId } : {}),
      limit: 100,
    }),
  });

  function setFilter(key: 'status' | 'ncertClass', value: string) {
    const next = new URLSearchParams(sp);
    if (value) next.set(key, value);
    else next.delete(key);
    setSp(next);
  }

  return (
    <div className="screen">
      <div className="prob-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => nav('/app/admin/ingest')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} aria-label="Back">
            <Glyph.ArrowL accent="var(--p-ink-2)" size={20} />
          </button>
          <div>
            <div style={{ fontSize: 11, color: 'var(--p-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>ADMIN</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Drafts · {q.data?.total ?? 0}</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '14px 22px 8px' }}>
        {/* filter */}
        <div className="card" style={{ padding: 10, marginBottom: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <label style={{ fontSize: 11, color: 'var(--p-muted)' }}>
              Status
              <select className="input" value={status} onChange={(e) => setFilter('status', e.target.value)}>
                {STATUSES.map((s) => <option key={s} value={s}>{s || 'all'}</option>)}
              </select>
            </label>
            <label style={{ fontSize: 11, color: 'var(--p-muted)' }}>
              Class
              <select className="input" value={ncertClass} onChange={(e) => setFilter('ncertClass', e.target.value)}>
                {CLASSES.map((c) => <option key={c} value={c}>{c || 'all'}</option>)}
              </select>
            </label>
          </div>
          {jobId && (
            <div style={{ fontSize: 11, color: 'var(--p-muted)', marginTop: 6, fontFamily: 'var(--font-mono)' }}>
              filtered by job {jobId.slice(0, 8)}… <button style={{ background: 'none', border: 'none', color: 'var(--p-primary)', cursor: 'pointer' }} onClick={() => { const n = new URLSearchParams(sp); n.delete('jobId'); setSp(n); }}>clear</button>
            </div>
          )}
        </div>

        {/* list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {(q.data?.items ?? []).map((d) => {
            const tint = STATUS_TINTS[d.status];
            return (
              <div key={d.id} className="card" style={{ padding: 12, cursor: 'pointer' }} onClick={() => nav(`/app/admin/drafts/${d.id}`)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 9.5, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', background: tint, padding: '2px 6px', borderRadius: 4, color: 'var(--p-ink)', fontWeight: 700 }}>{d.status}</span>
                  <span style={{ fontSize: 9.5, fontFamily: 'var(--font-mono)', color: 'var(--p-muted)' }}>L{d.proposedDifficultyLevel}</span>
                  <span style={{ fontSize: 10, color: 'var(--p-muted)', marginLeft: 'auto' }}>{new Date(d.createdAt).toLocaleDateString()}</span>
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 3 }}>
                  {d.conceptLesson ? `${d.conceptLesson.ncertClass} · Ch${d.conceptLesson.chapterNumber} ${d.conceptLesson.titleEn}` : <span style={{ color: 'var(--p-danger)' }}>UNMAPPED</span>}
                </div>
                <div style={{ fontSize: 11, color: 'var(--p-muted)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>{d.sourceLabel}</div>
                {d.reviewerNote && <div style={{ fontSize: 11, color: 'var(--p-danger)', marginTop: 4 }}>{d.reviewerNote.slice(0, 120)}</div>}
              </div>
            );
          })}
          {(q.data?.items ?? []).length === 0 && (
            <div className="card" style={{ padding: 14, textAlign: 'center', color: 'var(--p-muted)', fontSize: 12.5 }}>
              No drafts match this filter.
            </div>
          )}
        </div>

        <div style={{ height: 16 }} />
      </div>
      <TabBar />
    </div>
  );
}
