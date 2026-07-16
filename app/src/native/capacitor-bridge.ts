/**
 * Capacitor native plugin bridge — 안드로이드 래퍼에 한정된 동작 (web 빌드에서는 no-op).
 *
 *  - 뒤로가기 버튼: ProtectedRoute / Modal stack 위에서 자연스러운 종료/뒤로 동작
 *  - StatusBar: 색상·아이콘 톤 일치
 *
 * Push: initPushListeners() wires FCM registration + deep-link taps (PR-28).
 * Actual token sync runs after auth via usePushSync (respects pushRemindersEnabled).
 *
 * Capacitor의 web 구현은 안전한 no-op이다. 네이티브 모듈을 정적으로 번들해
 * Android WebView에 해석 불가능한 bare import가 남지 않도록 한다.
 */

import { App } from '@capacitor/app';
import { Capacitor, SystemBars, SystemBarsStyle, registerPlugin } from '@capacitor/core';
import { initPushListeners } from './push-bridge';

type NativeThemePlugin = {
  setSystemBarBackground(options: { color: string }): Promise<void>;
};

const NativeTheme = registerPlugin<NativeThemePlugin>('MatheoTheme');

/** Match the web light/dark shell across both native system bars; web no-op. */
export async function syncStatusBarTheme(isDark: boolean) {
  if (!Capacitor.isNativePlatform()) return;
  try {
    // Capacitor 8 SystemBars updates both the top status bar and the bottom
    // navigation/gesture bar. Android 16 ignores the legacy background-color
    // and overlay APIs, so the DayNight window theme owns the backdrop.
    await SystemBars.setStyle({
      style: isDark ? SystemBarsStyle.Dark : SystemBarsStyle.Light,
    });
    // On pre-edge-to-edge Android versions the bars still own an opaque
    // native backdrop. Match the independently stored app theme rather than
    // the device uiMode; Android 15+ simply uses this as the decor fallback.
    await NativeTheme.setSystemBarBackground({
      color: isDark ? '#11162A' : '#F6F7FC',
    });
  } catch { /* native theme bridge is unavailable in this shell */ }
}

export async function initCapacitorBridge() {
  if (!Capacitor.isNativePlatform()) return;

  // ----- System bars (respect bootstrapTheme / ThemeContext) -----
  const isDark = document.documentElement.classList.contains('dark');
  await syncStatusBarTheme(isDark);

  // ----- Push (native listeners only — token sync after auth) -----
  await initPushListeners();

  // ----- 뒤로가기 버튼 -----
  try {
    await App.addListener('backButton', async () => {
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
          App.exitApp();
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
