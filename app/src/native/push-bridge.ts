/**
 * Capacitor FCM push bridge (PR-28).
 * Native-only — web builds no-op. Token → POST /devices/register.
 * Deep links: wrongnote.due → /app/review, streak.reminder → /app.
 */
import { del, post, patch, tokens } from '../lib/api';

const PKG_CORE = '@capacitor/core';
const PKG_PUSH = '@capacitor/push-notifications';
const TOKEN_KEY = 'mathema.push.token';

const dynImport = (name: string): Promise<any> =>
  import(/* @vite-ignore */ name).catch(() => null);

export type PushSyncOptions = {
  enabled: boolean;
  marketingConsent?: boolean;
};

let listenersReady = false;
let deepLinkHandler: ((path: string) => void) | null = null;

export function setPushDeepLinkHandler(handler: ((path: string) => void) | null) {
  deepLinkHandler = handler;
}

export function routeForPushData(data: Record<string, string | undefined> | undefined): string {
  const type = data?.type ?? '';
  if (type === 'wrongnote.due') return '/app/review';
  if (type === 'streak.reminder') return '/app';
  return '/app';
}

function storeToken(token: string) {
  try { localStorage.setItem(TOKEN_KEY, token); } catch { /* ignore */ }
}

function readStoredToken(): string | null {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}

function clearStoredToken() {
  try { localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
}

async function nativePlatform(): Promise<'android' | 'ios' | null> {
  const core: any = await dynImport(PKG_CORE);
  const Capacitor = core?.Capacitor;
  if (!Capacitor?.isNativePlatform?.()) return null;
  const p = Capacitor.getPlatform?.();
  if (p === 'android' || p === 'ios') return p;
  return null;
}

async function registerTokenOnServer(token: string, platform: 'android' | 'ios', marketingConsent?: boolean) {
  if (!tokens.get()) return;
  await post('/devices/register', {
    token,
    platform,
    appVersion: (import.meta as any).env?.VITE_APP_VERSION ?? undefined,
  });
  storeToken(token);
  if (marketingConsent) {
    try {
      await patch(`/devices/${encodeURIComponent(token)}/marketing`, { enabled: true });
    } catch { /* MARKETING consent may not be granted yet */ }
  }
}

/** One-time listener setup — safe to call multiple times. */
export async function initPushListeners() {
  if (listenersReady) return;
  const platform = await nativePlatform();
  if (!platform) return;

  const pushMod: any = await dynImport(PKG_PUSH);
  const PushNotifications = pushMod?.PushNotifications;
  if (!PushNotifications) return;

  await PushNotifications.addListener('registration', async (ev: { value: string }) => {
    if (!ev?.value || !tokens.get()) return;
    await registerTokenOnServer(ev.value, platform).catch(() => {});
  });

  await PushNotifications.addListener('registrationError', () => {
    clearStoredToken();
  });

  await PushNotifications.addListener('pushNotificationActionPerformed', (ev: {
    notification?: { data?: Record<string, string> };
  }) => {
    const path = routeForPushData(ev?.notification?.data);
    deepLinkHandler?.(path);
  });

  listenersReady = true;
}

/** Request permission (when enabled) and register FCM token with backend. */
export async function syncPushRegistration(opts: PushSyncOptions) {
  const platform = await nativePlatform();
  if (!platform || !tokens.get()) return;

  const pushMod: any = await dynImport(PKG_PUSH);
  const PushNotifications = pushMod?.PushNotifications;
  if (!PushNotifications) return;

  await initPushListeners();

  if (!opts.enabled) {
    await unregisterPushToken();
    return;
  }

  let perm = await PushNotifications.checkPermissions();
  if (perm.receive !== 'granted') {
    perm = await PushNotifications.requestPermissions();
  }
  if (perm.receive !== 'granted') return;

  await PushNotifications.register();

  const existing = readStoredToken();
  if (existing && opts.marketingConsent) {
    try {
      await patch(`/devices/${encodeURIComponent(existing)}/marketing`, { enabled: true });
    } catch { /* ignore */ }
  }
}

export async function unregisterPushToken() {
  const token = readStoredToken();
  if (token && tokens.get()) {
    try {
      await del(`/devices/${encodeURIComponent(token)}`);
    } catch { /* best-effort */ }
  }
  clearStoredToken();

  const platform = await nativePlatform();
  if (!platform) return;
  const pushMod: any = await dynImport(PKG_PUSH);
  const PushNotifications = pushMod?.PushNotifications;
  if (!PushNotifications) return;
  try { await PushNotifications.removeAllListeners(); } catch { /* ignore */ }
  listenersReady = false;
}