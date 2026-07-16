import { useCallback, useEffect, useRef, useState } from 'react';
import { renderGoogleIdentityButton } from '../lib/google-identity';
import { isGoogleSignInConfigured } from '../lib/google-client-id';
import { GoogleAuth, isNativeGoogleAuthPlatform } from '../native/google-auth-bridge';
import {
  createGoogleSignInNonce,
  rememberGoogleSignInNonce,
} from '../lib/google-sign-in-nonce';

type UseGoogleSignInOpts = {
  onCredential: (idToken: string) => void | Promise<void>;
  onError?: (error: unknown) => void;
  /** When false, skip GIS init (e.g. onboarding step not visible). Default true. */
  enabled?: boolean;
  webContainer?: HTMLElement | null;
  mode?: 'continue' | 'signup';
  locale?: string;
};

export function useGoogleSignIn({
  onCredential,
  onError,
  enabled = true,
  webContainer = null,
  mode = 'continue',
  locale,
}: UseGoogleSignInOpts) {
  const callbackRef = useRef(onCredential);
  callbackRef.current = onCredential;
  const errorRef = useRef(onError);
  errorRef.current = onError;

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
    if (!webContainer) {
      setReady(false);
      return;
    }
    let nonce: string;
    try {
      nonce = createGoogleSignInNonce();
    } catch {
      setReady(false);
      setLoadError(true);
      return;
    }
    renderGoogleIdentityButton(webContainer, async (token) => {
      rememberGoogleSignInNonce(token, nonce);
      await callbackRef.current(token);
    }, { mode, locale, nonce })
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
    return () => {
      cancelled = true;
      webContainer.innerHTML = '';
    };
  }, [enabled, configured, nativePlatform, webContainer, mode, locale]);

  const signIn = useCallback(async () => {
    if (!ready) return;
    if (nativePlatform) {
      try {
        const nonce = createGoogleSignInNonce();
        const { idToken } = await GoogleAuth.signIn({ nonce });
        if (idToken) {
          rememberGoogleSignInNonce(idToken, nonce);
          await callbackRef.current(idToken);
        }
      } catch (error) {
        console.warn('Google sign-in was not completed', error);
        errorRef.current?.(error);
      }
      return;
    }
    // Web users click the visible official GIS button directly. Google does
    // not support initiating that flow from a custom/programmatic button.
  }, [nativePlatform, ready]);

  return {
    configured,
    nativePlatform,
    ready,
    loadError,
    signIn,
  };
}
