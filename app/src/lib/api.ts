import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { readCachedBillingUiEnabled } from './billing-flags';
import { getDeviceHash } from './deviceId';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL ?? '/api/v1';

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
});

const TOKEN_KEY = 'mathema.access';
const REFRESH_KEY = 'mathema.refresh';
let tokenRevision = 0;

export const tokens = {
  get: () => localStorage.getItem(TOKEN_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  set: (a: string, r: string) => {
    tokenRevision += 1;
    localStorage.setItem(TOKEN_KEY, a);
    localStorage.setItem(REFRESH_KEY, r);
  },
  clear: () => {
    tokenRevision += 1;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

async function requestTokenRefresh(refreshToken: string): Promise<TokenPair> {
  const deviceHash = await getDeviceHash().catch(() => '');
  const { data } = await axios.post(
    `${API_BASE}/auth/refresh`,
    { refreshToken },
    {
      headers: deviceHash ? { 'X-Device-Hash': deviceHash } : {},
      timeout: 10_000,
    },
  );
  return data.data as TokenPair;
}

/**
 * Restore a persisted login when the short-lived access token is missing but
 * the refresh token is still valid. This is intentionally a raw axios call so
 * it cannot recurse through the API response interceptor.
 */
export async function restoreStoredSession(): Promise<boolean> {
  const refreshToken = tokens.getRefresh();
  if (!refreshToken) return false;

  const revision = tokenRevision;
  const next = await requestTokenRefresh(refreshToken);
  if (revision !== tokenRevision || tokens.getRefresh() !== refreshToken) {
    return false;
  }
  tokens.set(next.accessToken, next.refreshToken);
  return true;
}

/**
 * Best-effort server-side logout. Callers must still clear local state even
 * when this request is offline or times out.
 */
export async function revokeRefreshToken(refreshToken: string | null): Promise<void> {
  if (!refreshToken) return;
  await axios.post(
    `${API_BASE}/auth/logout`,
    { refreshToken },
    { timeout: 3_000 },
  );
}

api.interceptors.request.use(async (cfg) => {
  const t = tokens.get();
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  // 현재 i18n 언어를 매 요청마다 자동 첨부
  try {
    const lang = localStorage.getItem('mathema.lang');
    if (lang === 'ko' || lang === 'en') {
      cfg.headers['Accept-Language'] = lang;
    }
  } catch { /* ignore */ }
  // DEV-2 X-Device-Hash: stable per-install fingerprint. Server uses this to
  // enforce concurrent 1-account-1-device -- a new device login displaces
  // the previous session's refresh token (Netflix-style displacement).
  try {
    cfg.headers['X-Device-Hash'] = await getDeviceHash();
  } catch { /* ignore -- backend falls back to "unknown" device */ }
  return cfg;
});

let isRefreshing = false;
// Pending queue — each entry holds both resolve and reject so that a failed
// refresh can explicitly reject all in-flight requests instead of leaving them
// hanging or making them retry with an empty token (which would 401 again and
// recurse). Audit 2026-05-27: the prior (t: string) => void shape only had a
// resolve path; on refresh failure the queue was never drained, so pending
// callbacks could fire on the NEXT successful refresh against the wrong user.
type PendingEntry = { resolve: (t: string) => void; reject: (e: unknown) => void };
let pending: Array<PendingEntry> = [];

api.interceptors.response.use(
  (r) => r,
  async (err: AxiosError) => {
    const original = err.config as AxiosRequestConfig & { _retry?: boolean };

    if (err.response?.status === 403) {
      const data: any = err.response.data;
      const code = data?.error?.code ?? data?.error;
      if (readCachedBillingUiEnabled()) {
        try {
          if (code === 'QuotaExceeded' && !window.location.pathname.startsWith('/app/paywall')) {
            window.location.assign('/app/paywall?reason=quota');
            return Promise.reject(err);
          }
          if (code === 'PremiumRequired' && !window.location.pathname.startsWith('/app/paywall')) {
            const feature = data?.error?.feature ?? data?.feature ?? 'premium';
            window.location.assign(`/app/paywall?reason=premium&feature=${encodeURIComponent(feature)}`);
            return Promise.reject(err);
          }
        } catch {
          /* non-browser */
        }
      }
    }

    if (err.response?.status === 401 && !original?._retry && tokens.getRefresh()) {
      if (isRefreshing) {
        // Another request kicked off the refresh — wait for it. We hand both
        // resolve AND reject into the queue so a refresh failure can fan out
        // the rejection here instead of leaving us hanging.
        return new Promise((resolve, reject) => {
          pending.push({
            resolve: (t) => {
              original.headers!.Authorization = `Bearer ${t}`;
              resolve(api(original));
            },
            reject,
          });
        });
      }
      original._retry = true;
      isRefreshing = true;
      try {
        const refreshToken = tokens.getRefresh();
        const revision = tokenRevision;
        if (!refreshToken) {
          const drain = pending;
          pending = [];
          drain.forEach((p) => p.reject(err));
          return Promise.reject(err);
        }

        const next = await requestTokenRefresh(refreshToken);
        // An explicit logout or a newer login may have happened while the
        // refresh request was in flight. Never resurrect or overwrite that
        // changed session with this stale response.
        if (revision !== tokenRevision || tokens.getRefresh() !== refreshToken) {
          const drain = pending;
          pending = [];
          drain.forEach((p) => p.reject(err));
          return Promise.reject(err);
        }
        const access = next.accessToken;
        tokens.set(access, next.refreshToken);
        // Drain pending FIRST, then resolve original. Snapshot+empty before
        // notifying so any new 401s while we resolve queue up cleanly into
        // a fresh pending array (would-be-impossible today since
        // isRefreshing is still true, but defensive).
        const drain = pending;
        pending = [];
        drain.forEach((p) => p.resolve(access));
        original.headers!.Authorization = `Bearer ${access}`;
        return api(original);
      } catch (e: any) {
        const status = e?.response?.status;
        const code = e?.response?.data?.error?.code
          ?? e?.response?.data?.code; // some responses are not wrapped
        // Audit 2026-05-27: previously EVERY refresh failure cleared tokens
        // and hard-redirected to /login. That was too aggressive — a
        // transient network blip, a 5xx on /auth/refresh, or a 429 from
        // user-induced spam would log the user out for no good reason.
        // Distinguish "the server told us to go away" (401/403 + explicit
        // displacement/revoke codes) from "the network or backend hiccuped"
        // (offline, 5xx, 429). For the latter, keep tokens around and just
        // fail this request — the next user interaction will retry.
        const isAuthRejection =
          status === 401
          || status === 403
          || code === 'device_displaced'
          || code === 'device_mismatch'
          || code === 'token_revoked'
          || code === 'invalid_refresh_token';

        // Drain pending queue: every request waiting on this refresh has to
        // resolve one way or the other, otherwise the calling components
        // sit stuck on a never-settling promise.
        const drain = pending;
        pending = [];

        if (!isAuthRejection) {
          // Transient: hand the same error to each waiter so their UIs can
          // surface a normal "couldn't reach server" toast. Tokens stay so
          // the next call attempts auth again instead of yanking the user
          // back to /login.
          drain.forEach((p) => p.reject(e));
          return Promise.reject(e);
        }

        // Server-side auth rejection: tear down. Tell every waiter so they
        // don't hang, then send the user to /login. The hard redirect (vs.
        // a router navigate) is intentional here — we want every in-flight
        // query cancelled and the cache rebuilt against the new identity.
        tokens.clear();
        drain.forEach((p) => p.reject(e));
        try {
          sessionStorage.setItem(
            'matheo.loginNotice',
            code === 'device_displaced' || code === 'device_mismatch'
              ? code
              : 'session_expired',
          );
        } catch {}
        // P5 fix 2026-05-27: emit a custom event instead of forcing a hard
        // page reload. AuthContext listens, clears the QueryClient cache, and
        // performs a React Router navigate(). Falls back to window.location
        // if no listener is attached (e.g. test environment, SSR). Net effect
        // is the same teardown (tokens cleared, cache reset, user lands at
        // /login) but without the white-flash + full bundle reparse.
        try {
          if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
            const ev = new CustomEvent('matheo:auth-rejected', {
              detail: { code, status, reason: 'refresh_failed' },
            });
            const dispatched = window.dispatchEvent(ev);
            // If somehow not handled (no listener), fall back to hard reload
            // so the user doesn't sit on a stale authed page forever.
            if (!dispatched || !(window as any).__matheoAuthHandled) {
              setTimeout(() => {
                if (!(window as any).__matheoAuthHandled
                    && !window.location.pathname.startsWith('/login')) {
                  window.location.href = '/login';
                }
              }, 100);
            }
          }
        } catch { /* SSR — ignore */ }
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(err);
  },
);

// 백엔드는 { data, meta? } 로 감싸므로 unwrap 하는 helper
export async function get<T>(url: string, params?: any): Promise<T> {
  const r = await api.get(url, { params });
  return r.data.data as T;
}
export async function post<T>(url: string, body?: any, opts?: { isMultipart?: boolean }): Promise<T> {
  const cfg = opts?.isMultipart
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : undefined;
  const r = await api.post(url, body, cfg);
  return r.data.data as T;
}
export async function patch<T>(url: string, body?: any): Promise<T> {
  const r = await api.patch(url, body);
  return r.data.data as T;
}
export async function del<T>(url: string): Promise<T> {
  const r = await api.delete(url);
  return r.data.data as T;
}

/**
 * 인증된 사용자의 데이터 export — JSON 파일을 브라우저가 직접 다운받게 한다.
 * 백엔드는 Content-Disposition: attachment 로 응답.
 */
export async function downloadExport(): Promise<void> {
  const r = await api.get('/users/me/export', { responseType: 'blob' });
  const blob = new Blob([r.data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `matheo-data-export-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
