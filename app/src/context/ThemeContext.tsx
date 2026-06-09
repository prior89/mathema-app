/**
 * ThemeContext — light / dark / system appearance for the sage shell.
 *
 * Persists to localStorage.mathema.theme and toggles `html.dark` so
 * onboarding.css token overrides apply app-wide (login + /app/*).
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { syncStatusBarTheme } from '../native/capacitor-bridge';

export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'mathema.theme';

function readStoredMode(): ThemeMode {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'light' || v === 'dark' || v === 'system') return v;
  } catch { /* private mode */ }
  return 'system';
}

function systemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function resolveIsDark(mode: ThemeMode): boolean {
  if (mode === 'dark') return true;
  if (mode === 'light') return false;
  return systemPrefersDark();
}

export function applyThemeMode(mode: ThemeMode): boolean {
  const isDark = resolveIsDark(mode);
  document.documentElement.classList.toggle('dark', isDark);
  void syncStatusBarTheme(isDark);
  return isDark;
}

/** Call before React mount to avoid a light flash on dark users. */
export function bootstrapTheme(): ThemeMode {
  const mode = readStoredMode();
  applyThemeMode(mode);
  return mode;
}

interface ThemeContextValue {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => readStoredMode());
  const [isDark, setIsDark] = useState(() => resolveIsDark(readStoredMode()));

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch { /* ignore */ }
    setIsDark(applyThemeMode(next));
  }, []);

  useEffect(() => {
    if (mode !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setIsDark(applyThemeMode('system'));
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [mode]);

  const value = useMemo(() => ({ mode, isDark, setMode }), [mode, isDark, setMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}