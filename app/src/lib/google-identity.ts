import { getGoogleClientId, isGoogleSignInConfigured } from './google-client-id';

type CredentialCallback = (idToken: string) => void | Promise<void>;

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (resp: { credential?: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: string;
              theme?: string;
              size?: string;
              text?: string;
              width?: number;
            },
          ) => void;
          prompt: (momentListener?: (n: {
            isNotDisplayed: () => boolean;
            isSkippedMoment: () => boolean;
          }) => void) => void;
        };
      };
    };
  }
}

let scriptPromise: Promise<void> | null = null;
let initialized = false;
let hiddenHost: HTMLDivElement | null = null;
let callbackRef: CredentialCallback = () => {};

function loadGoogleScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'));
  if (window.google?.accounts?.id) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]',
    );
    if (existing) {
      if (window.google?.accounts?.id) resolve();
      else existing.addEventListener('load', () => resolve(), { once: true });
      return;
    }
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Google Identity Services script failed to load'));
    document.head.appendChild(s);
  });
  return scriptPromise;
}

function ensureHiddenHost(): HTMLDivElement {
  if (!hiddenHost) {
    hiddenHost = document.createElement('div');
    hiddenHost.setAttribute('aria-hidden', 'true');
    hiddenHost.className = 'gsi-hidden-host';
    document.body.appendChild(hiddenHost);
  }
  return hiddenHost;
}

/** Load GIS once and keep a hidden official button for account-picker popups. */
export async function ensureGoogleIdentity(onCredential: CredentialCallback): Promise<boolean> {
  if (!isGoogleSignInConfigured()) return false;
  callbackRef = onCredential;

  await loadGoogleScript();
  const g = window.google?.accounts?.id;
  if (!g) return false;

  const clientId = getGoogleClientId();
  if (!initialized) {
    g.initialize({
      client_id: clientId,
      callback: (resp) => {
        if (resp.credential) void callbackRef(resp.credential);
      },
      auto_select: false,
      cancel_on_tap_outside: true,
    });
    const host = ensureHiddenHost();
    host.innerHTML = '';
    g.renderButton(host, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      width: 280,
    });
    initialized = true;
  }
  return true;
}

/** Programmatically open the Google account picker via the hidden GIS button. */
export function triggerGoogleSignIn(): boolean {
  const btn = hiddenHost?.querySelector<HTMLElement>('[role="button"]');
  if (!btn) {
    window.google?.accounts?.id?.prompt();
    return false;
  }
  btn.click();
  return true;
}