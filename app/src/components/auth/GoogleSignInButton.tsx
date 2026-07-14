import { useId } from 'react';
import { useGoogleSignIn } from '../../hooks/useGoogleSignIn';
import { Glyph } from '../onboarding/Glyph';
import { useT } from '../../lib/i18n';

export type GoogleSignInMode = 'continue' | 'signup';

type GoogleSignInButtonProps = {
  mode?: GoogleSignInMode;
  onCredential: (idToken: string) => void | Promise<void>;
  onError?: (error: unknown) => void;
  disabled?: boolean;
  busy?: boolean;
  enabled?: boolean;
  className?: string;
};

export function GoogleSignInButton({
  mode = 'continue',
  onCredential,
  onError,
  disabled = false,
  busy = false,
  enabled = true,
  className = '',
}: GoogleSignInButtonProps) {
  const { t } = useT();
  const statusId = useId();
  const { configured, ready, loadError, signIn } = useGoogleSignIn({
    onCredential,
    onError,
    enabled,
  });

  const labelKey = mode === 'signup' ? 'auth.google.signup' : 'auth.google.continue';
  const isDisabled = disabled || busy || !configured || !ready || loadError;
  const statusMessage = !configured
    ? t('auth.google.unavailable')
    : loadError
      ? t('auth.google.loadFailed')
      : null;

  return (
    <div className="google-signin-control">
      <button
        type="button"
        className={`btn outline google ${className}`.trim()}
        disabled={isDisabled}
        onClick={signIn}
        aria-busy={busy || undefined}
        aria-describedby={statusMessage ? statusId : undefined}
      >
        <Glyph.Google />
        <span>{busy ? t('auth.google.busy') : t(labelKey)}</span>
      </button>
      {statusMessage && (
        <div id={statusId} className="google-signin-status" role="status">
          {statusMessage}
        </div>
      )}
    </div>
  );
}
