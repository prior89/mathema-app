/* /app/admin/ingest — content ingestion dashboard. PDF upload + HTTP API registration + job-list polling. */
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api, get, post } from '../../lib/api';
import { TabBar } from '../main/TabBar';
import { Glyph } from '../onboarding/Glyph';

type IngestJob = {
  id: string;
  label: string;
  sourceType: 'PDF' | 'HTTP_API' | 'JSON_BULK' | 'CSV';
  status: 'QUEUED' | 'FETCHING' | 'EXTRACTING' | 'INDEXING' | 'DRAFTING' | 'READY' | 'FAILED';
  createdAt: string;
  startedAt: string | null;
  finishedAt: string | null;
  totalItems: number | null;
  extractedExercises: number | null;
  extractedProblems: number | null;
  draftsCreated: number | null;
  detectedClasses: string[];
  errorMessage: string | null;
  uploadedBy: { name: string; email: string };
};

const STATUS_TINTS: Record<IngestJob['status'], string> = {
  QUEUED: 'var(--p-surface-2)',
  FETCHING: 'oklch(0.92 0.05 240)',
  EXTRACTING: 'oklch(0.92 0.05 200)',
  INDEXING: 'oklch(0.92 0.05 180)',
  DRAFTING: 'var(--p-primary-tint)',
  READY: 'oklch(0.92 0.07 145)',
  FAILED: 'oklch(0.92 0.07 25)',
};

export function AdminIngestScreen() {
  const qc = useQueryClient();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // Polling — refetch every 3s while any job is still in progress.
  const jobs = useQuery({
    queryKey: ['admin-ingest-jobs'],
    queryFn: () => get<IngestJob[]>('/admin/ingest/jobs', { limit: 50 }),
    refetchInterval: (q) => {
      const data = q.state.data as IngestJob[] | undefined;
      if (!data) return false;
      return data.some((j) => j.status !== 'READY' && j.status !== 'FAILED') ? 3000 : false;
    },
  });

  const uploadPdf = useMutation({
    mutationFn: async (file: File) => {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('label', file.name);
      const res = await api.post('/admin/ingest/pdf', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      return res.data as { id: string };
    },
    onSuccess: () => { setMsg('Upload complete — processing in the background'); qc.invalidateQueries({ queryKey: ['admin-ingest-jobs'] }); },
    onError: (e: any) => setMsg(`Upload failed: ${e?.response?.data?.message ?? e?.message ?? 'unknown'}`),
  });

  const [apiUrl, setApiUrl] = useState('');
  const [apiLabel, setApiLabel] = useState('');
  const [apiAuthRef, setApiAuthRef] = useState('');
  const createApiJob = useMutation({
    mutationFn: () => post<{ id: string }>('/admin/ingest/http-api', { url: apiUrl, label: apiLabel || apiUrl, authRef: apiAuthRef || undefined }),
    onSuccess: () => { setMsg('API job created'); setApiUrl(''); setApiLabel(''); setApiAuthRef(''); qc.invalidateQueries({ queryKey: ['admin-ingest-jobs'] }); },
    onError: (e: any) => setMsg(`Registration failed: ${e?.response?.data?.message ?? 'unknown'}`),
  });

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true); setMsg(null);
    try { await uploadPdf.mutateAsync(f); }
    finally { setBusy(false); e.target.value = ''; }
  }

  return (
    <div className="screen">
      <div className="prob-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => nav('/app/me')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} aria-label="Back">
            <Glyph.ArrowL accent="var(--p-ink-2)" size={20} />
          </button>
          <div>
            <div style={{ fontSize: 11, color: 'var(--p-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>ADMIN</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Content ingestion</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '14px 22px 8px' }}>
        {/* PDF upload */}
        <div className="card" style={{ padding: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>PDF upload</div>
          <div style={{ fontSize: 11.5, color: 'var(--p-muted)', marginBottom: 10 }}>NCERT / EBS / other textbook PDFs — auto-extract + LLM draft + admin review.</div>
          <label className="btn outline" style={{ display: 'inline-flex', cursor: busy ? 'wait' : 'pointer', opacity: busy ? 0.5 : 1 }}>
            {busy ? 'Uploading…' : 'Choose PDF'}
            <input type="file" accept="application/pdf" hidden onChange={onFile} disabled={busy} />
          </label>
        </div>

        {/* HTTP API source */}
        <div className="card" style={{ padding: 14, marginTop: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>External API source</div>
          <div style={{ fontSize: 11.5, color: 'var(--p-muted)', marginBottom: 10 }}>REST endpoints such as EBS or public question banks. Responses are auto-normalized into NormalizedProblem.</div>
          <input className="input" placeholder="https://api.ebs.co.kr/..." value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} style={{ marginBottom: 6 }} />
          <input className="input" placeholder="Label (optional)" value={apiLabel} onChange={(e) => setApiLabel(e.target.value)} style={{ marginBottom: 6 }} />
          <input className="input" placeholder="Auth env var name (e.g. EBS_API_TOKEN)" value={apiAuthRef} onChange={(e) => setApiAuthRef(e.target.value)} style={{ marginBottom: 8 }} />
          <button className="btn" disabled={!apiUrl || createApiJob.isPending} onClick={() => createApiJob.mutate()}>
            {createApiJob.isPending ? 'Creating…' : 'Create API job'}
          </button>
        </div>

        {msg && <div className="card" style={{ marginTop: 10, padding: 10, fontSize: 12 }}>{msg}</div>}

        {/* Jobs list */}
        <div className="section-h">
          <span className="label">Recent ingest jobs</span>
          <span className="more">{jobs.data?.length ?? 0}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {(jobs.data ?? []).map((j) => <JobRow key={j.id} job={j} onOpenDrafts={() => nav(`/app/admin/drafts?jobId=${j.id}`)} />)}
          {jobs.data?.length === 0 && (
            <div className="card" style={{ padding: 14, textAlign: 'center', color: 'var(--p-muted)', fontSize: 12.5 }}>
              No ingest jobs yet.
            </div>
          )}
        </div>

        {/* All drafts shortcut */}
        <div style={{ marginTop: 16 }}>
          <button className="btn outline" onClick={() => nav('/app/admin/drafts')}>Review all drafts →</button>
        </div>

        <div style={{ height: 16 }} />
      </div>
      <TabBar />
    </div>
  );
}

function JobRow({ job, onOpenDrafts }: { job: IngestJob; onOpenDrafts: () => void }) {
  const tint = STATUS_TINTS[job.status];
  const date = new Date(job.createdAt).toLocaleString();
  return (
    <div className="card" style={{ padding: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 9.5, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', background: tint, padding: '2px 6px', borderRadius: 4, color: 'var(--p-ink)', fontWeight: 700 }}>{job.status}</span>
        <span style={{ fontSize: 9.5, fontFamily: 'var(--font-mono)', color: 'var(--p-muted)' }}>{job.sourceType}</span>
        <span style={{ fontSize: 10, color: 'var(--p-muted)', marginLeft: 'auto' }}>{date}</span>
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, wordBreak: 'break-all' }}>{job.label}</div>
      <div style={{ fontSize: 11.5, color: 'var(--p-muted)', fontFamily: 'var(--font-mono)' }}>
        {job.totalItems != null && <>items {job.totalItems} · </>}
        {job.extractedExercises != null && <>ex {job.extractedExercises} · </>}
        {job.extractedProblems != null && <>q {job.extractedProblems} · </>}
        {job.draftsCreated != null && <>drafts {job.draftsCreated}</>}
      </div>
      {job.detectedClasses.length > 0 && (
        <div style={{ fontSize: 10.5, color: 'var(--p-muted)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>
          classes: {job.detectedClasses.join(' · ')}
        </div>
      )}
      {job.errorMessage && (
        <div style={{ fontSize: 11.5, color: 'var(--p-danger)', marginTop: 6, lineHeight: 1.4 }}>{job.errorMessage}</div>
      )}
      {job.draftsCreated != null && job.draftsCreated > 0 && (
        <button className="btn outline" style={{ marginTop: 8, fontSize: 12 }} onClick={onOpenDrafts}>
          Review {job.draftsCreated} drafts from this job →
        </button>
      )}
    </div>
  );
}
