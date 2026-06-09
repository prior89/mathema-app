import { useCallback, useEffect, useRef, useState } from 'react';
import { ensureGoogleIdentity, triggerGoogleSignIn } from '../lib/google-identity';
import { isGoogleSignInConfigured } from '../lib/google-client-id';

type UseGoogleSignInOpts = {
  onCredential: (idToken: string) => void | Promise<void>;
  /** When false, skip GIS init (e.g. onboarding step not visible). Default true. */
  enabled?: boolean;
};

export function useGoogleSignIn({ onCredential, enabled = true }: UseGoogleSignInOpts) {
  const callbackRef = useRef(onCredential);
  callbackRef.current = onCredential;

  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const configured = isGoogleSignInConfigured();

  useEffect(() => {
    if (!enabled || !configured) {
      setReady(false);
      return;
    }
    let cancelled = false;
    ensureGoogleIdentity((token) => callbackRef.current(token))
      .then((ok) => {
        if (!cancelled) {
          setReady(ok);
          setLoadError(!ok);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setReady(false);
          setLoadError(true);
        }
      });
    return () => { cancelled = true; };
  }, [enabled, configured]);

  const signIn = useCallback(() => {
    if (!ready) return;
    triggerGoogleSignIn();
  }, [ready]);

  return {
    configured,
    ready,
    loadError,
    signIn,
  };
}