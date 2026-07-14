/**
 * Capacitor native plugin bridge — 안드로이드 래퍼에 한정된 동작 (web 빌드에서는 no-op).
 *
 *  - 뒤로가기 버튼: ProtectedRoute / Modal stack 위에서 자연스러운 종료/뒤로 동작
 *  - StatusBar: 색상·아이콘 톤 일치
 *
 * Push: initPushListeners() wires FCM registration + deep-link taps (PR-28).
 * Actual token sync runs after auth via usePushSync (respects pushRemindersEnabled).
 *
 * 플러그인은 동적 import — Capacitor.isNativePlatform() 일 때만 로드.
 * `@vite-ignore` + 변수 우회 — 패키지가 설치되어 있지 않은 web-only dev 환경에서도
 * Vite 가 모듈을 정적 분석하지 않도록 한다 (실제로 native 빌드에서만 로드됨).
 */

import { initPushListeners } from './push-bridge';

// Vite 가 string literal 이 아니라 변수만 보고 resolve 를 건너뛰게 한다.
const PKG_CORE = '@capacitor/core';
const PKG_STATUS = '@capacitor/status-bar';
const PKG_APP = '@capacitor/app';

const dynImport = (name: string): Promise<any> =>
  import(/* @vite-ignore */ name).catch(() => null);

/** Match sage light/dark shells — web no-op. */
export async function syncStatusBarTheme(isDark: boolean) {
  const core: any = await dynImport(PKG_CORE);
  const Capacitor = core?.Capacitor;
  if (!Capacitor?.isNativePlatform?.()) return;

  const status: any = await dynImport(PKG_STATUS);
  if (!status?.StatusBar || !status?.Style) return;
  try {
    if (isDark) {
      await status.StatusBar.setStyle({ style: status.Style.Dark });
      await status.StatusBar.setBackgroundColor({ color: '#1e2624' });
    } else {
      await status.StatusBar.setStyle({ style: status.Style.Light });
      await status.StatusBar.setBackgroundColor({ color: '#EFEBDF' });
    }
    await status.StatusBar.setOverlaysWebView({ overlay: false });
  } catch { /* plugin not installed in this build */ }
}

export async function initCapacitorBridge() {
  const core: any = await dynImport(PKG_CORE);
  const Capacitor = core?.Capacitor;
  if (!Capacitor?.isNativePlatform?.()) return;

  // ----- StatusBar (respect bootstrapTheme / ThemeContext) -----
  const isDark = document.documentElement.classList.contains('dark');
  await syncStatusBarTheme(isDark);

  // ----- Push (native listeners only — token sync after auth) -----
  await initPushListeners();

  // ----- 뒤로가기 버튼 -----
  const appPlugin: any = await dynImport(PKG_APP);
  if (appPlugin?.App) {
    try {
      appPlugin.App.addListener('backButton', async () => {
        // Give active sessions/modals the first chance to block native Back.
        const nativeBack = new CustomEvent('matheo:native-back', { cancelable: true });
        window.dispatchEvent(nativeBack);
        if (nativeBack.defaultPrevented) return;

        const path = window.location.pathname.replace(/\/$/, '') || '/';
        const isAppRoot = path === '/app' || path === '/parent' || path === '/teacher';
        if (!isAppRoot && window.history.length > 1 && path !== '/') {
          window.history.back();
          return;
        }
        if ((window as any).__matheoLastBack && Date.now() - (window as any).__matheoLastBack < 2000) {
          appPlugin.App.exitApp();
          return;
        }
        (window as any).__matheoLastBack = Date.now();
        let ko = false;
        try { ko = localStorage.getItem('mathema.lang') === 'ko'; } catch { /* ignore */ }
        window.dispatchEvent(new CustomEvent('mathema-toast', {
          detail: {
            id: Date.now(), kind: 'info',
            text: ko ? '뒤로 버튼을 한 번 더 누르면 종료돼요' : 'Press back again to exit',
          },
        }));
      });
    } catch { /* plugin not installed */ }
  }

}
