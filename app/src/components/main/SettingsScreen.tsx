/* SettingsScreen — sage-themed settings inside /app/me/settings.
 * Wires to existing backend: /privacy/policy, /privacy/consents, /privacy/consents/:kind, DELETE /users/me, GET /users/me/export.
 */
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { get, post, del, downloadExport, tokens } from '../../lib/api';
import { fetchMe } from '../../lib/queries';
import { Glyph } from '../onboarding/Glyph';
import { TabBar } from './TabBar';

// Backend /privacy/consents 응답 shape — 'active' (boolean) 사용. 이전엔 'granted' 라 매번 undefined 였음.
type Consent = {
  kind: 'DATA_PROCESSING' | 'ANALYTICS' | 'AI_TRAINING' | 'MARKETING';
  active: boolean;
  grantedAt: string | null;
  revokedAt: string | null;
  policyVersion: string | null;
};

export function SettingsScreen() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const me = useQuery({ queryKey: ['me'], queryFn: fetchMe });
  const consents = useQuery({
    queryKey: ['consents'],
    queryFn: () => get<Consent[]>('/privacy/consents'),
  });

  const toggle = useMutation({
    mutationFn: async (c: { kind: Consent['kind']; active: boolean }) => {
      if (c.active) await del(`/privacy/consents/${c.kind.toLowerCase()}`);
      else await post(`/privacy/consents/${c.kind.toLowerCase()}`, {});
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['consents'] }),
  });

  const [deletingConfirm, setDeletingConfirm] = useState(false);
  const deleteAccount = useMutation({
    mutationFn: () => del('/users/me'),
    onSuccess: () => {
      tokens.clear();
      nav('/login');
    },
  });

  const items: Array<{ kind: Consent['kind']; name: string; desc: string; req?: boolean }> = [
    { kind: 'DATA_PROCESSING', name: 'Essential data', desc: 'Required to run the app. Revoke = delete account.', req: true },
    { kind: 'ANALYTICS', name: 'Learning analytics', desc: 'Helps the AI coach surface your weak patterns.' },
    { kind: 'AI_TRAINING', name: 'Improve AI for everyone', desc: 'Anonymised samples for model training.' },
    { kind: 'MARKETING', name: 'Updates and offers', desc: 'Occasional emails on new chapters / mocks.' },
  ];

  return (
    <div className="screen">
      <div className="prob-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => nav('/app/me')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} aria-label="Back">
            <Glyph.ArrowL accent="var(--p-ink-2)" size={20} />
          </button>
          <div>
            <div style={{ fontSize: 11, color: 'var(--p-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>PROFILE</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Settings</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '14px 22px 8px', minHeight: 0 }}>
        {/* Account */}
        <div className="section-h">
          <span className="label">Account</span>
        </div>
        <div className="card" style={{ padding: 14 }}>
          <Row k="Name" v={me.data?.name ?? '—'} />
          <Row k="Email" v={me.data?.email ?? '—'} />
          <Row k="Role" v={me.data?.role ?? 'STUDENT'} />
          <Row k="Grade" v={({
            CLASS_7: 'Grade 7', CLASS_8: 'Grade 8', CLASS_9: 'Grade 9',
            CLASS_10: 'Grade 10', CLASS_11: 'Grade 11', CLASS_12: 'Grade 12',
          } as Record<string, string>)[me.data?.gradeLevel ?? ''] ?? me.data?.gradeLevel ?? '—'} last />
        </div>

        {/* Privacy */}
        <div className="section-h">
          <span className="label">Privacy · DPDP 2023</span>
        </div>
        <div className="card" style={{ padding: '4px 16px' }}>
          {items.map((it) => {
            const active = consents.data?.find((c) => c.kind === it.kind)?.active ?? !!it.req;
            return (
              <div key={it.kind} className="consent-row">
                <div
                  className={`ck ${active ? 'checked' : ''}`}
                  onClick={() => !it.req && !toggle.isPending && toggle.mutate({ kind: it.kind, active })}
                  style={{ opacity: it.req ? 0.85 : 1, cursor: it.req ? 'default' : 'pointer' }}
                >
                  {active && <Glyph.Check accent="#fff" size={12} />}
                </div>
                <div className="info">
                  <div className="name">
                    {it.name}
                    {it.req && <span className="req-pill">Required</span>}
                  </div>
                  <div className="desc">{it.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Data rights */}
        <div className="section-h">
          <span className="label">Your data</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button
            className="btn outline"
            onClick={() => { tokens.clear(); nav('/login'); }}
          >
            Log out
          </button>
          <button className="btn outline" onClick={() => downloadExport()}>
            Download my data (JSON)
          </button>
          {!deletingConfirm ? (
            <button
              className="btn outline"
              style={{ color: 'var(--p-danger)', borderColor: 'var(--p-danger)' }}
              onClick={() => setDeletingConfirm(true)}
            >
              Delete my account
            </button>
          ) : (
            <div className="card" style={{ padding: 14, borderColor: 'var(--p-danger)' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--p-danger)' }}>
                This will permanently delete your account.
              </div>
              <div style={{ fontSize: 12, color: 'var(--p-muted)', marginTop: 4 }}>
                You can re-register later but progress and notes will be lost.
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button className="btn outline" onClick={() => setDeletingConfirm(false)} style={{ flex: 1 }}>
                  Cancel
                </button>
                <button
                  className="btn"
                  onClick={() => deleteAccount.mutate()}
                  disabled={deleteAccount.isPending}
                  style={{ flex: 1, background: 'var(--p-danger)' }}
                >
                  {deleteAccount.isPending ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* About */}
        <div style={{ marginTop: 24, padding: 12, textAlign: 'center', fontSize: 11, color: 'var(--p-muted)' }}>
          Mathēma PoC · Policy v2026.05.01
        </div>
      </div>
      <TabBar />
    </div>
  );
}

function Row({ k, v, last }: { k: string; v: string; last?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: last ? 'none' : '1px solid var(--p-border)' }}>
      <span style={{ fontSize: 12, color: 'var(--p-muted)', letterSpacing: '0.04em' }}>{k}</span>
      <span style={{ fontSize: 14, color: 'var(--p-ink)', fontWeight: 500 }}>{v}</span>
    </div>
  );
}
