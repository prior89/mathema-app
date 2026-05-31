/* Bottom tab bar.
 *
 * Layout reflects the PDCA learning loop:
 *   Home (plan) → Mastery (learn) → Study (do) → Notes (check) → Test (act) → Me.
 *
 * Earlier iterations had separate Solver and Mocks tabs; both folded in:
 *   Solver  → absorbed by the Notes "+" button (photo / OCR / auto wrong-note).
 *   Mocks   → replaced by Test (weekly / monthly review of personal wrong notes).
 */
import { useNavigate, useLocation } from 'react-router-dom';
import { useT } from '../../lib/i18n';
import type { TranslationKey } from '../../lib/translations';

type TabId = 'home' | 'learn' | 'study' | 'notes' | 'test' | 'me';

const TABS: Array<{ id: TabId; labelKey: TranslationKey; path: string; icon: (c: string) => JSX.Element }> = [
  { id: 'home', labelKey: 'tabbar.home', path: '/app',
    icon: (c) => <svg viewBox="0 0 24 24" width="22" height="22"><path d="M 3 11 L 12 4 L 21 11 V 20 H 14 V 14 H 10 V 20 H 3 Z" fill="none" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/></svg> },
  { id: 'learn', labelKey: 'tabbar.learn', path: '/app/learn',
    icon: (c) => <svg viewBox="0 0 24 24" width="22" height="22"><path d="M 4 6 C 4 5, 5 4, 6 4 H 11 V 20 H 6 C 5 20, 4 19, 4 18 Z M 20 6 C 20 5, 19 4, 18 4 H 13 V 20 H 18 C 19 20, 20 19, 20 18 Z" fill="none" stroke={c} strokeWidth="1.7" strokeLinejoin="round"/></svg> },
  { id: 'study', labelKey: 'tabbar.study', path: '/app/study',
    /* pencil over a horizontal line — "do practice" glyph */
    icon: (c) => <svg viewBox="0 0 24 24" width="22" height="22"><path d="M 4 19 H 20 M 14 6 L 18 10 L 8 20 L 4 20 L 4 16 Z" fill="none" stroke={c} strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round"/></svg> },
  { id: 'notes', labelKey: 'tabbar.notes', path: '/app/notes',
    icon: (c) => <svg viewBox="0 0 24 24" width="22" height="22"><path d="M 6 3 H 16 L 19 6 V 21 H 6 Z M 8 8 H 17 M 8 12 H 17 M 8 16 H 14" fill="none" stroke={c} strokeWidth="1.7" strokeLinejoin="round"/></svg> },
  { id: 'test', labelKey: 'tabbar.test', path: '/app/test',
    /* clipboard with check — "scheduled review" glyph */
    icon: (c) => <svg viewBox="0 0 24 24" width="22" height="22"><rect x="5" y="4" width="14" height="17" rx="2" fill="none" stroke={c} strokeWidth="1.7"/><path d="M 9 3 H 15 V 6 H 9 Z" fill="none" stroke={c} strokeWidth="1.7" strokeLinejoin="round"/><path d="M 9 13 L 11 15 L 15 11" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { id: 'me', labelKey: 'tabbar.me', path: '/app/me',
    icon: (c) => <svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="8" r="3.5" fill="none" stroke={c} strokeWidth="1.7"/><path d="M 4 21 C 4 16, 8 14, 12 14 C 16 14, 20 16, 20 21" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round"/></svg> },
];

export function TabBar() {
  const nav = useNavigate();
  const loc = useLocation();
  const { t } = useT();
  const active: TabId =
    loc.pathname.startsWith('/app/learn') ? 'learn' :
    loc.pathname.startsWith('/app/study') ? 'study' :
    loc.pathname.startsWith('/app/notes') ? 'notes' :
    loc.pathname.startsWith('/app/test') ? 'test' :
    loc.pathname.startsWith('/app/me') ? 'me' : 'home';
  // 2026-05-27 a11y: tab items were plain <div onClick>. That meant no
  // keyboard focus, no Enter/Space activation, no role semantics for screen
  // readers, and Playwright locators by role had to fall back to text-only
  // matching. Rendering as native <button> picks up keyboard + focus ring +
  // the proper role for free; aria-current="page" marks the active tab.
  return (
    <nav className="tabbar" aria-label={t('tabbar.aria') || 'Main navigation'}>
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            className={`tab ${isActive ? 'active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
            aria-label={t(tab.labelKey)}
            onClick={() => nav(tab.path)}
          >
            <div className="icon">
              {tab.icon(isActive ? 'var(--p-primary)' : 'var(--p-muted)')}
            </div>
            <span>{t(tab.labelKey)}</span>
          </button>
        );
      })}
    </nav>
  );
}
