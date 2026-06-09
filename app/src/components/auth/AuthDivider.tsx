import { useT } from '../../lib/i18n';
import type { TranslationKey } from '../../lib/translations';

type AuthDividerProps = {
  /** Translation key for the center label. Defaults to auth.divider.or */
  labelKey?: TranslationKey;
};

export function AuthDivider({ labelKey = 'auth.divider.or' }: AuthDividerProps) {
  const { t } = useT();
  return (
    <div className="auth-divider" role="separator">
      <div className="auth-divider-line" />
      <span className="caption auth-divider-label">{t(labelKey)}</span>
      <div className="auth-divider-line" />
    </div>
  );
}