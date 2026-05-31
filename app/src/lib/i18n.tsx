import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { translations, TranslationKey } from './translations';

// Future expansion: add 'es' (Latin America) when ready. Keep in sync with
// `server/src/common/i18n/current-lang.decorator.ts` and `translations.ts`.
export type Lang = 'ko' | 'en' | 'hi';

type I18nContext = {
  lang: Lang;
  setLang: (l: Lang, opts?: { reload?: boolean }) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
};

const Ctx = createContext<I18nContext | null>(null);
const STORAGE_KEY = 'mathema.lang';

/**
 * 다국어 컨텍스트 — UI 라벨 번역 (ko/en).
 *
 * 백엔드 생성 텍스트(문제 본문·AI 코치 메시지·distractor rationale 등)는
 * KO/EN 양방향 사전(content-en.ts) 으로 동시 지원.
 * 1차 launch 인도 시장: EN 디폴트, 명시적 한국어 사용자만 KO.
 *
 * 사용:
 *   const { t, lang, setLang } = useT();
 *   <h1>{t('nav.dashboard')}</h1>
 */
export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'en';
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'ko' || saved === 'en' || saved === 'hi') return saved;
    // Default = EN. Browser language pick: hi / ko then EN fallback.
    // KO requires explicit user toggle (KO market not primary; only dev convenience).
    const nav = navigator.language.toLowerCase();
    if (nav.startsWith('hi')) return 'hi';
    return 'en';
  });

  const setLang = (l: Lang, opts?: { reload?: boolean }) => {
    const prev = lang;
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
    document.documentElement.lang = l;
    // 언어 변경 시 백엔드에서 가져온 콘텐츠(문제/AI코치/유닛명 등)도 새 언어로 다시 받아와야 하므로
    // 모든 쿼리 캐시를 무효화하고 재요청. 가장 단순·확실한 방법은 브라우저 새로고침.
    //
    // 2026-05-27: opts.reload=false escape hatch added for onboarding —
    // ScreenCountry needs to flip language so the next screens render in
    // KR, but reloading wipes the onboarding useState and bounces the user
    // back to welcome. In onboarding there's no backend content to invalidate
    // (lessons/problems come later, post-/app entry), so skipping the reload
    // is safe.
    const shouldReload = opts?.reload ?? true;
    if (prev !== l && shouldReload) {
      // setTimeout으로 setState 반영 후 reload
      setTimeout(() => window.location.reload(), 50);
    }
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    const dict = translations[lang] as Record<string, string>;
    // HI 가 누락된 키는 EN 으로, EN도 없으면 KO 로, 모두 없으면 key 그대로.
    const en = translations.en as Record<string, string>;
    const ko = translations.ko as Record<string, string>;
    let str = dict[key] ?? en[key] ?? ko[key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      }
    }
    return str;
  };

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useT() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('I18nProvider not mounted');
  return ctx;
}
