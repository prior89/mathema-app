import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { getDeviceHash } from './deviceId';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL ?? '/api/v1';

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
});

const TOKEN_KEY = 'mathema.access';
const REFRESH_KEY = 'mathema.refresh';

export const tokens = {
  get: () => localStorage.getItem(TOKEN_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  set: (a: string, r: string) => {
    localStorage.setItem(TOKEN_KEY, a);
    localStorage.setItem(REFRESH_KEY, r);
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

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
let pending: Array<(t: string) => void> = [];

api.interceptors.response.use(
  (r) => r,
  async (err: AxiosError) => {
    const original = err.config as AxiosRequestConfig & { _retry?: boolean };

    // Phase 5: AI Solver server-side quota.
    // Backend throws 403 { error: 'QuotaExceeded', ... } from /math-helper/solve
    // and /math-helper/ocr-solve when the daily Free counter is exhausted.
    // Redirect the user straight to the paywall so we never let them stare at a
    // raw "Forbidden" toast. We narrow on body.error === 'QuotaExceeded' so
    // OTHER 403s (auth role mismatch, deleted account, etc.) still surface
    // normally to the caller.
    if (err.response?.status === 403) {
      const data: any = err.response.data;
      const code = data?.error?.code ?? data?.error;
      if (code === 'QuotaExceeded') {
        // Avoid bouncing the user mid-paywall if a stray request 403s there.
        try {
          if (!window.location.pathname.startsWith('/app/paywall')) {
            window.location.assign('/app/paywall?reason=quota');
          }
        } catch {
          /* SSR / non-browser — ignore */
        }
        // Fall through so the caller still sees the rejection (the modal will
        // unmount on navigation, but in-flight code may want the error).
        return Promise.reject(err);
      }
    }

    if (err.response?.status === 401 && !original?._retry && tokens.getRefresh()) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          pending.push((t) => {
            original.headers!.Authorization = `Bearer ${t}`;
            resolve(api(original));
          });
        });
      }
      original._retry = true;
      isRefreshing = true;
      try {
        // DEV-6: include X-Device-Hash so /auth/refresh can match against the
        // user's currently-bound AuthDevice. Without this, refresh from a
        // displaced device would silently succeed and break the single-session
        // invariant.
        const deviceHash = await getDeviceHash().catch(() => '');
        const { data } = await axios.post(
          `${API_BASE}/auth/refresh`,
          { refreshToken: tokens.getRefresh() },
          { headers: deviceHash ? { 'X-Device-Hash': deviceHash } : {} },
        );
        const access = data.data.accessToken;
        const refresh = data.data.refreshToken;
        tokens.set(access, refresh);
        pending.forEach((fn) => fn(access));
        pending = [];
        original.headers!.Authorization = `Bearer ${access}`;
        return api(original);
      } catch (e: any) {
        tokens.clear();
        // DEV-7 -- distinguish "logged out by another device" from generic
        // session expiry so the LoginPage can show the right banner instead
        // of a confusing "your session expired" message.
        const code = e?.response?.data?.error?.code
          ?? e?.response?.data?.code; // some responses are not wrapped
        if (code === 'device_displaced' || code === 'device_mismatch') {
          try { sessionStorage.setItem('matheo.loginNotice', code); } catch {}
        }
        window.location.href = '/login';
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
