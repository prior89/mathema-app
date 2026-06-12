/* Top-bar avatar button — entry point to the Me screen after the bottom
 * tab bar shrank from 6 to 5 destinations (Material 3 caps nav bars at 5).
 * Rendered on the right side of each tab screen's .app-head. */
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchMe } from '../../lib/queries';
import { useT } from '../../lib/i18n';

export function HeadAvatar() {
  const nav = useNavigate();
  const { t } = useT();
  const me = useQuery({ queryKey: ['me'], queryFn: fetchMe });
  const initial = (me.data?.name ?? '').charAt(0).toUpperCase();

  return (
    <button
      type="button"
      className="avatar"
      aria-label={t('tabbar.me')}
      onClick={() => nav('/app/me')}
      style={{ border: 0, padding: 0, cursor: 'pointer', flexShrink: 0 }}
    >
      {initial || (
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <circle cx="12" cy="8" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
          <path d="M 4 21 C 4 16, 8 14, 12 14 C 16 14, 20 16, 20 21" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}
