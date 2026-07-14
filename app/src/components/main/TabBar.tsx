/* Bottom tab bar.
 *
 * Layout reflects the PDCA learning loop:
 *   Home (plan) → Learn → Study (do) → Notes (check) → Test (act).
 *
 * Earlier iterations had separate Solver / Mocks / Me tabs; all folded in:
 *   Solver  → absorbed by the Notes "+" button (photo / OCR / auto wrong-note).
 *   Mocks   → replaced by Test (weekly / monthly review of personal wrong notes).
 *   Me      → moved to the .app-head avatar button (HeadAvatar) — Material 3
 *             caps bottom nav at 5 destinations and every market leader keeps
 *             profile in the top bar.
 */
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Dumbbell, Home, NotebookTabs, RefreshCw } from 'lucide-react';
import { useT } from '../../lib/i18n';
import type { TranslationKey } from '../../lib/translations';

type TabId = 'home' | 'learn' | 'study' | 'notes' | 'test' | 'me';

const TABS: Array<{ id: TabId; labelKey: TranslationKey; path: string; icon: typeof Home }> = [
  { id: 'home', labelKey: 'tabbar.home', path: '/app',
    icon: Home },
  { id: 'learn', labelKey: 'tabbar.learn', path: '/app/learn',
    icon: BookOpen },
  { id: 'study', labelKey: 'tabbar.study', path: '/app/study',
    icon: Dumbbell },
  { id: 'notes', labelKey: 'tabbar.notes', path: '/app/notes',
    icon: NotebookTabs },
  { id: 'test', labelKey: 'tabbar.test', path: '/app/test',
    icon: RefreshCw },
];

export function TabBar() {
  const nav = useNavigate();
  const loc = useLocation();
  const { t } = useT();
  // '/app/me' yields active='me' which matches no tab — Me lives in the
  // top-bar HeadAvatar, so no bottom tab highlights there.
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
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            type="button"
            className={`tab ${isActive ? 'active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
            aria-label={t(tab.labelKey)}
            onClick={() => nav(tab.path)}
          >
            <span className="icon"><Icon size={21} strokeWidth={isActive ? 2.5 : 2} /></span>
            <span>{t(tab.labelKey)}</span>
          </button>
        );
      })}
    </nav>
  );
}
