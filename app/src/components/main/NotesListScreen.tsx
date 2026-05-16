/* Wrong notes list — features-b.jsx ScreenNotesList ported with real backend data. */
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchWrongNotes, fetchWrongNotesStats, fetchPatterns } from '../../lib/queries';
import { Glyph } from '../onboarding/Glyph';
import { TabBar } from './TabBar';
import MathText from '../MathText';

export function NotesListScreen() {
  const nav = useNavigate();
  const [unitFilter, setUnitFilter] = useState<string | undefined>(undefined);
  const stats = useQuery({ queryKey: ['wn-stats'], queryFn: fetchWrongNotesStats });
  const notes = useQuery({ queryKey: ['wn-list', unitFilter], queryFn: () => fetchWrongNotes(unitFilter ? { unitName: unitFilter } : undefined) });
  const patterns = useQuery({ queryKey: ['patterns'], queryFn: fetchPatterns });

  // Unit list from data
  const units = Array.from(new Set((notes.data ?? []).map((n) => n.unit))).slice(0, 6);

  return (
    <div className="screen" style={{ position: 'relative' }}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div className="app-head" style={{ paddingBottom: 0 }}>
          <div>
            <div className="hello" style={{ fontSize: 12, color: 'var(--p-muted)' }}>Library</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, marginTop: 2, letterSpacing: '-0.01em' }}>Wrong notes</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: 'var(--p-surface)', border: '1px solid var(--p-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" width="18" height="18">
                <circle cx="11" cy="11" r="6" fill="none" stroke="var(--p-ink-2)" strokeWidth="1.8" />
                <path d="M 16 16 L 20 20" stroke="var(--p-ink-2)" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        <div style={{ padding: '12px 22px 0' }}>
          {/* 4 stats compact */}
          <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
            <StatMini k="TOTAL" v={stats.data?.total ?? 0} />
            <StatMini k="ANALYZED" v={stats.data?.analyzed ?? 0} />
            <StatMini k="MASTERED" v={stats.data?.mastered ?? 0} />
            <StatMini k="REDO %" v={Math.round(stats.data?.retryAccuracy ?? 0)} />
          </div>

          {/* Filters */}
          {units.length > 0 && (
            <div className="filter-row" style={{ marginTop: 14 }}>
              <span className={`filter-chip ${!unitFilter ? 'active' : ''}`} onClick={() => setUnitFilter(undefined)}>All units</span>
              {units.map((u) => (
                <span key={u} className={`filter-chip ${unitFilter === u ? 'active' : ''}`} onClick={() => setUnitFilter(u)}>{u}</span>
              ))}
            </div>
          )}

          {/* AI pattern banner */}
          {patterns.data && patterns.data.length > 0 && (
            <div className="card" style={{ background: 'var(--p-primary-tint)', borderColor: 'transparent', padding: 12, display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12, marginTop: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: 'var(--p-primary)', color: 'var(--p-primary-fg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Glyph.Sparkle accent="#fff" size={14} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--p-ink)' }}>Pattern detected · {patterns.data[0].title}</div>
                <div style={{ fontSize: 11.5, color: 'var(--p-ink-2)' }}>{patterns.data[0].desc}</div>
              </div>
              <Glyph.ChevronR accent="var(--p-primary)" size={16} />
            </div>
          )}

          {/* Notes grid */}
          {notes.isLoading && <Empty msg="Loading wrong notes…" />}
          {notes.data && notes.data.length === 0 && <Empty msg="No wrong notes yet — practice problems to start building." />}
          <div className="notes-grid">
            {(notes.data ?? []).map((n) => (
              <div
                key={n.id}
                className="note-card"
                onClick={() => nav(n.chapterCode ? `/app/learn/${n.chapterCode}` : `/app/notes/${n.id}`)}
              >
                <div className="src">{(n.problem || n.unit).replace(/Class\s+(\d+)/g, 'Grade $1')}</div>
                <div className="body"><MathText text={n.problemBody || n.insight} /></div>
                <div className="foot">
                  <span className={`status-chip ${n.status?.toLowerCase()}`}>
                    {n.status === 'PENDING' && '· PENDING'}
                    {n.status === 'ANALYZING' && '· ANALYZING'}
                    {n.status === 'MASTERED' && (
                      <>
                        <Glyph.Check accent="currentColor" size={10} />MASTERED
                      </>
                    )}
                  </span>
                  <span style={{ fontSize: 10.5, color: 'var(--p-muted)', fontFamily: 'var(--font-mono)' }}>{n.diff}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ height: 90 }} />
        </div>
      </div>

      <div className="fab" onClick={() => nav('/app/learn')}>
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path d="M 12 5 V 19 M 5 12 H 19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </div>
      <TabBar />
    </div>
  );
}

function StatMini({ k, v }: { k: string; v: number }) {
  return (
    <div className="stat" style={{ padding: '8px 10px' }}>
      <div className="k" style={{ fontSize: 9.5 }}>{k}</div>
      <div className="v italic" style={{ fontSize: 18 }}>{v}</div>
    </div>
  );
}

function Empty({ msg }: { msg: string }) {
  return (
    <div className="card" style={{ padding: 14, textAlign: 'center', color: 'var(--p-muted)', fontSize: 12.5, margin: '12px 0' }}>
      {msg}
    </div>
  );
}
