/* Wrong notes list — features-b.jsx ScreenNotesList ported with real backend data. */
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchWrongNotes, fetchWrongNotesStats, fetchPatterns } from '../../lib/queries';
import { Glyph } from '../onboarding/Glyph';
import { TabBar } from './TabBar';
import MathText from '../MathText';
import { UploadProblemModal } from './UploadProblemModal';

type StatusFilter = 'active' | 'mastered' | 'all';

const FILTERS: Array<{ id: StatusFilter; label: string }> = [
  { id: 'active', label: 'In progress' },
  { id: 'mastered', label: 'Mastered' },
  { id: 'all', label: 'All' },
];

export function NotesListScreen() {
  const nav = useNavigate();
  const [uploadOpen, setUploadOpen] = useState(false);
  // Default to 'active' so the grid surfaces what still needs attention.
  // Without a filter every MASTERED note stays visible forever, so heavy users
  // ended up scrolling past months of done items to reach their open queue.
  const [filter, setFilter] = useState<StatusFilter>('active');
  const stats = useQuery({ queryKey: ['wn-stats'], queryFn: fetchWrongNotesStats });
  const notes = useQuery({ queryKey: ['wn-list'], queryFn: () => fetchWrongNotes() });
  const patterns = useQuery({ queryKey: ['patterns'], queryFn: fetchPatterns });

  const visibleNotes = (notes.data ?? []).filter((n) => {
    const s = (n.status ?? '').toLowerCase();
    if (filter === 'all') return true;
    if (filter === 'mastered') return s === 'mastered';
    return s !== 'mastered';
  });

  return (
    <div className="screen" style={{ position: 'relative' }}>
      {/* Sticky top -- header + 4 stats + pattern banner + filter chips all
          stay frozen above the scroll. The grid below is the only thing that
          scrolls, so the user can swap filters without re-finding the stats. */}
      <div className="app-head" style={{ paddingBottom: 0, flexShrink: 0 }}>
        <div>
          <div className="hello" style={{ fontSize: 12, color: 'var(--p-muted)' }}>Library</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, marginTop: 2, letterSpacing: '-0.01em' }}>Wrong notes</div>
        </div>
      </div>
      <div style={{ padding: '12px 22px 0', flexShrink: 0 }}>
        {/* 4 stats compact */}
        <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
          <StatMini k="TOTAL" v={stats.data?.total ?? 0} />
          <StatMini k="ANALYZED" v={stats.data?.analyzed ?? 0} />
          <StatMini k="MASTERED" v={stats.data?.mastered ?? 0} />
          <StatMini k="REDO %" v={Math.round(stats.data?.retryAccuracy ?? 0)} />
        </div>

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

        {/* Status filter — defaults to "In progress" so the user reaches
            what still needs work without scrolling past every MASTERED card. */}
        <div className="filter-row" style={{ marginTop: 10, marginBottom: 4 }}>
          {FILTERS.map((f) => (
            <span
              key={f.id}
              className={`filter-chip ${filter === f.id ? 'active' : ''}`}
              style={{ flex: '0 0 calc((100% - 12px) / 3)', textAlign: 'center' }}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </span>
          ))}
        </div>
      </div>

      {/* Scrollable grid only */}
      <div style={{ flex: 1, overflow: 'auto', minHeight: 0, padding: '8px 22px' }}>
        {notes.isLoading && <Empty msg="Loading wrong notes…" />}
        {notes.data && notes.data.length === 0 && <Empty msg="No wrong notes yet — practice problems to start building." />}
        {notes.data && notes.data.length > 0 && visibleNotes.length === 0 && (
          <Empty msg={
            filter === 'mastered'
              ? 'No mastered notes yet — solve a wrong-note review to graduate one.'
              : filter === 'active'
                ? 'All caught up — every wrong note is mastered. Practice more chapters to grow the queue.'
                : 'No wrong notes match this filter.'
          } />
        )}
        <div className="notes-grid">
          {visibleNotes.map((n) => (
            <div
              key={n.id}
              className="note-card"
              onClick={() => nav(`/app/practice/${n.problemId}`)}
            >
                {/* Attribution (e.g. "NCERT Class 11 Mathematics, Ch.8 Ex.8.2
                    Q.11 (derived for matheo, Reprint 2024-25)") lives on
                    Problem.source for licence-safety reasons but isn't
                    user-facing — it dominated the card visually and added no
                    value to a student picking which note to retry. */}
                <div className="body">
                  <MathText text={stripTrailingDot(n.problemBody || n.insight)} />
                </div>
                <div className="foot">
                  {/* Backend serialises wrong-note status as lowercase
                      ('pending' / 'analyzing' / 'mastered'). Earlier code
                      compared against uppercase literals and silently
                      rendered nothing — normalise once and compare. */}
                  {(() => {
                    const s = (n.status ?? '').toLowerCase();
                    return (
                      <span className={`status-chip ${s}`}>
                        {s === 'pending' && '· PENDING'}
                        {s === 'analyzing' && '· ANALYZING'}
                        {s === 'mastered' && (
                          <>
                            <Glyph.Check accent="currentColor" size={10} />MASTERED
                          </>
                        )}
                      </span>
                    );
                  })()}
                  <span style={{ fontSize: 10.5, color: 'var(--p-muted)', fontFamily: 'var(--font-mono)' }}>{n.diff}</span>
                </div>
              </div>
            ))}
        </div>
        <div style={{ height: 90 }} />
      </div>

      <div className="fab" onClick={() => setUploadOpen(true)} aria-label="Upload a problem">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path d="M 12 5 V 19 M 5 12 H 19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </div>
      <UploadProblemModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
      <TabBar />
    </div>
  );
}

// Wrong-note bodies sometimes end with a question full-stop (e.g. "Find x.")
// which looks redundant once the card already frames it as a problem prompt.
// Strip any trailing whitespace + period combination so the card reads cleaner.
function stripTrailingDot(s: string | undefined | null): string {
  return (s ?? '').replace(/[\s.]+$/u, '');
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
