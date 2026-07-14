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
              locale?: string;
            },
          ) => void;
        };
      };
    };
  }
}

let scriptPromise: Promise<void> | null = null;
let initialized = false;
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
    s.onerror = () => {
      scriptPromise = null;
      reject(new Error('Google Identity Services script failed to load'));
    };
    document.head.appendChild(s);
  });
  return scriptPromise;
}

/** Render the official GIS control into a visible host. Google does not expose
 * an API for programmatically starting its button flow; the user must click
 * the button produced by renderButton(). */
export async function renderGoogleIdentityButton(
  parent: HTMLElement,
  onCredential: CredentialCallback,
  options: { mode?: 'continue' | 'signup'; locale?: string } = {},
): Promise<boolean> {
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
    initialized = true;
  }
  parent.innerHTML = '';
  g.renderButton(parent, {
    type: 'standard',
    theme: 'outline',
    size: 'large',
    text: options.mode === 'signup' ? 'signup_with' : 'continue_with',
    width: Math.max(220, Math.min(400, Math.floor(parent.clientWidth || 320))),
    locale: options.locale,
  });
  return true;
}
