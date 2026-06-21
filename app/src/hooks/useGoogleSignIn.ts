import { useCallback, useEffect, useRef, useState } from 'react';
import { ensureGoogleIdentity, triggerGoogleSignIn } from '../lib/google-identity';
import { isGoogleSignInConfigured } from '../lib/google-client-id';
import { GoogleAuth, isNativeGoogleAuthPlatform } from '../native/google-auth-bridge';

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

  const nativePlatform = isNativeGoogleAuthPlatform();
  const configured = nativePlatform || isGoogleSignInConfigured();

  useEffect(() => {
    if (!enabled || !configured) {
      setReady(false);
      return;
    }
    let cancelled = false;
    if (nativePlatform) {
      GoogleAuth.isAvailable()
        .then(({ available }) => {
          if (!cancelled) {
            setReady(available);
            setLoadError(!available);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setReady(false);
            setLoadError(true);
          }
        });
      return () => { cancelled = true; };
    }
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
  }, [enabled, configured, nativePlatform]);

  const signIn = useCallback(async () => {
    if (!ready) return;
    if (nativePlatform) {
      try {
        const { idToken } = await GoogleAuth.signIn();
        if (idToken) await callbackRef.current(idToken);
      } catch (error) {
        console.warn('Google sign-in was not completed', error);
      }
      return;
    }
    triggerGoogleSignIn();
  }, [nativePlatform, ready]);

  return {
    configured,
    ready,
    loadError,
    signIn,
  };
}
