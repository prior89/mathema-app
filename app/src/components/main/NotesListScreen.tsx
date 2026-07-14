/* Wrong notes list — features-b.jsx ScreenNotesList ported with real backend data. */
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { NotebookPen, Sparkles } from 'lucide-react';
import { fetchActivePatterns, fetchWrongNotes, fetchWrongNotesStats, fetchPatterns } from '../../lib/queries';
import { useT } from '../../lib/i18n';
import type { TranslationKey } from '../../lib/translations';
import { Glyph } from '../onboarding/Glyph';
import { TabBar } from './TabBar';
import { HeadAvatar } from './HeadAvatar';
import MathText from '../MathText';
import { ActiveErrorPatternBanner } from '../mastery/ActiveErrorPatterns';

type StatusFilter = 'active' | 'mastered' | 'all';

const FILTERS: Array<{ id: StatusFilter; labelKey: TranslationKey }> = [
  { id: 'active', labelKey: 'notes.filter.active' },
  { id: 'mastered', labelKey: 'notes.filter.mastered' },
  { id: 'all', labelKey: 'notes.filter.all' },
];

export function NotesListScreen() {
  const nav = useNavigate();
  const { t, lang } = useT();
  // Default to 'active' so the grid surfaces what still needs attention.
  // Without a filter every MASTERED note stays visible forever, so heavy users
  // ended up scrolling past months of done items to reach their open queue.
  const [filter, setFilter] = useState<StatusFilter>('active');
  const stats = useQuery({ queryKey: ['wn-stats'], queryFn: fetchWrongNotesStats });
  const notes = useQuery({ queryKey: ['wn-list'], queryFn: () => fetchWrongNotes() });
  const patterns = useQuery({ queryKey: ['patterns'], queryFn: fetchPatterns });
  const activePatterns = useQuery({ queryKey: ['error-patterns', 'active'], queryFn: fetchActivePatterns });
  const uiLang = (lang === 'ko' || lang === 'hi' ? lang : 'en') as 'ko' | 'en' | 'hi';

  const visibleNotes = (notes.data ?? []).filter((n) => {
    const s = (n.status ?? '').toLowerCase();
    if (filter === 'all') return true;
    if (filter === 'mastered') return s === 'mastered';
    return s !== 'mastered';
  });

  return (
    <div className="screen tabbed-screen notes-screen" style={{ position: 'relative' }}>
      {/* Mixed scroll model — header + 4-stat row stay pinned at top (those
          are quick orientation signals: total/analyzed/mastered/retry). AI
          pattern banner + filter chips + cards grid share one scroll surface
          so on mobile the grid grabs the full remaining viewport. TabBar
          stays pinned at the bottom.
          History (2026-06-01): first pass pinned NOTHING, header + stats
          scrolled away which lost orientation. This pass keeps the title +
          stats fixed and lets the banner + chips ride with the cards. */}
      <div className="app-head" style={{ paddingBottom: 0, flexShrink: 0 }}>
        <div>
          <div className="hello" style={{ fontSize: 12, color: 'var(--p-muted)' }}>{t('notes.tab.label')}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, marginTop: 2, letterSpacing: '-0.01em' }}>{t('notes.tab.title')}</div>
        </div>
        <HeadAvatar />
      </div>
      <div className="content-rail notes-overview" style={{ padding: '12px 22px 0', flexShrink: 0 }}>
        <div className="notes-intro">
          <span className="notes-intro-icon"><NotebookPen size={24} /></span>
          <div><span><Sparkles size={13} />{t('notes.hero.kicker')}</span><b>{t('notes.hero.title')}</b><small>{t('notes.hero.desc')}</small></div>
        </div>
        {/* 4 stats compact — stays pinned alongside the header. */}
        <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
          <StatMini k={t('notes.stat.total')} v={stats.data?.total ?? 0} />
          <StatMini k={t('notes.stat.analyzed')} v={stats.data?.analyzed ?? 0} />
          <StatMini k={t('notes.stat.mastered')} v={stats.data?.mastered ?? 0} />
          <StatMini k={t('notes.stat.retry')} v={Math.round(stats.data?.retryAccuracy ?? 0)} />
        </div>
      </div>

      {/* Scroll surface — banner + chips + grid all ride here together. */}
      <div className="app-scroll" style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        <div className="content-rail" style={{ padding: '12px 22px 0' }}>
        {/* Error DNA L2 — active patterns (PR-25); L1 ai-coach fallback */}
        {activePatterns.data && activePatterns.data.length > 0 ? (
          <ActiveErrorPatternBanner
            pattern={activePatterns.data[0]}
            lang={uiLang}
            onClick={() => nav('/app/mastery')}
          />
        ) : patterns.data && patterns.data.length > 0 ? (
          <div className="card" style={{ background: 'var(--p-primary-tint)', borderColor: 'transparent', padding: 12, display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12, marginTop: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: 'var(--p-primary)', color: 'var(--p-primary-fg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Glyph.Sparkle accent="var(--p-primary-fg)" size={14} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--p-ink)' }}>{t('notes.pattern.detected', { title: patterns.data[0].title })}</div>
              <div style={{ fontSize: 11.5, color: 'var(--p-ink-2)' }}>{patterns.data[0].desc}</div>
            </div>
            <Glyph.ChevronR accent="var(--p-primary)" size={16} />
          </div>
        ) : null}

        {/* Status filter — defaults to "In progress" so the user reaches
            what still needs work without scrolling past every MASTERED card. */}
        <div className="filter-row" style={{ marginTop: 10, marginBottom: 4 }}>
          {FILTERS.map((f) => (
            <button
              type="button"
              key={f.id}
              className={`filter-chip ${filter === f.id ? 'active' : ''}`}
              aria-pressed={filter === f.id}
              style={{ flex: '0 0 calc((100% - 12px) / 3)', textAlign: 'center' }}
              onClick={() => setFilter(f.id)}
            >
              {t(f.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {/* Cards grid — rides inside the same scroll surface as the top strip. */}
      <div className="content-rail" style={{ padding: '8px 22px' }}>
        {notes.isLoading && <Empty msg={t('notes.loading')} />}
        {notes.data && notes.data.length === 0 && <Empty msg={t('notes.empty.none')} />}
        {notes.data && notes.data.length > 0 && visibleNotes.length === 0 && (
          <Empty msg={
            filter === 'mastered'
              ? t('notes.empty.mastered')
              : filter === 'active'
                ? t('notes.empty.active')
                : t('notes.empty.noFilter')
          } />
        )}
        <div className="notes-grid">
          {visibleNotes.map((n) => (
            <button
              type="button"
              key={n.id}
              className="note-card"
              onClick={() => nav(`/app/notes/${n.id}`)}
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
                        {s === 'pending' && t('notes.status.pending')}
                        {s === 'analyzing' && t('notes.status.analyzing')}
                        {s === 'mastered' && (
                          <>
                            <Glyph.Check accent="currentColor" size={10} />{t('notes.status.mastered')}
                          </>
                        )}
                      </span>
                    );
                  })()}
                  <span style={{ fontSize: 10.5, color: 'var(--p-muted)', fontFamily: 'var(--font-mono)' }}>{n.diff}</span>
                </div>
              </button>
            ))}
        </div>
        <div style={{ height: 90 }} />
      </div>
      </div>

      <TabBar />
      {/* AI Solver removed from Notes (2026-05-23) — its place was a "+" FAB,
          which read as "add a note" but actually opens the upload-and-solve
          flow. With the solver now producing full step-by-step LaTeX
          solutions, it belongs alongside Study (SolverButton lives there).
          Notes stays focused on reviewing past wrongs. */}
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
