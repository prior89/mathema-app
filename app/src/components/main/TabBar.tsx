/* Bottom tab bar — ported from `App onboarding/features-a.jsx` */
import { useNavigate, useLocation } from 'react-router-dom';

type TabId = 'home' | 'learn' | 'notes' | 'mocks' | 'me';

const TABS: Array<{ id: TabId; label: string; path: string; icon: (c: string) => JSX.Element }> = [
  { id: 'home', label: 'Home', path: '/app',
    icon: (c) => <svg viewBox="0 0 24 24" width="22" height="22"><path d="M 3 11 L 12 4 L 21 11 V 20 H 14 V 14 H 10 V 20 H 3 Z" fill="none" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/></svg> },
  { id: 'learn', label: 'Learn', path: '/app/learn',
    icon: (c) => <svg viewBox="0 0 24 24" width="22" height="22"><path d="M 4 6 C 4 5, 5 4, 6 4 H 11 V 20 H 6 C 5 20, 4 19, 4 18 Z M 20 6 C 20 5, 19 4, 18 4 H 13 V 20 H 18 C 19 20, 20 19, 20 18 Z" fill="none" stroke={c} strokeWidth="1.7" strokeLinejoin="round"/></svg> },
  { id: 'notes', label: 'Notes', path: '/app/notes',
    icon: (c) => <svg viewBox="0 0 24 24" width="22" height="22"><path d="M 6 3 H 16 L 19 6 V 21 H 6 Z M 8 8 H 17 M 8 12 H 17 M 8 16 H 14" fill="none" stroke={c} strokeWidth="1.7" strokeLinejoin="round"/></svg> },
  { id: 'mocks', label: 'Mocks', path: '/app/mocks',
    icon: (c) => <svg viewBox="0 0 24 24" width="22" height="22"><rect x="4" y="3" width="16" height="18" rx="2" fill="none" stroke={c} strokeWidth="1.7"/><path d="M 8 8 H 16 M 8 12 H 16 M 8 16 H 12" stroke={c} strokeWidth="1.7" strokeLinecap="round"/></svg> },
  { id: 'me', label: 'Me', path: '/app/me',
    icon: (c) => <svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="8" r="3.5" fill="none" stroke={c} strokeWidth="1.7"/><path d="M 4 21 C 4 16, 8 14, 12 14 C 16 14, 20 16, 20 21" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round"/></svg> },
];

export function TabBar() {
  const nav = useNavigate();
  const loc = useLocation();
  const active: TabId =
    loc.pathname.startsWith('/app/learn') ? 'learn' :
    loc.pathname.startsWith('/app/notes') ? 'notes' :
    loc.pathname.startsWith('/app/mocks') ? 'mocks' :
    loc.pathname.startsWith('/app/me') ? 'me' : 'home';
  return (
    <div className="tabbar">
      {TABS.map((t) => (
        <div key={t.id} className={`tab ${active === t.id ? 'active' : ''}`} onClick={() => nav(t.path)}>
          <div className="icon">
            {t.icon(active === t.id ? 'var(--p-primary)' : 'var(--p-muted)')}
          </div>
          <span>{t.label}</span>
        </div>
      ))}
    </div>
  );
}
