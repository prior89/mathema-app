/* Mathēma glyphs — ported from prototype `App onboarding/glyphs.jsx` */
import { CSSProperties } from 'react';

type AccentProps = { accent?: string };
type SizedProps = AccentProps & { size?: number };

export const Glyph = {
  WelcomeHero: ({ accent = '#fff' }: AccentProps) => (
    <svg viewBox="0 0 320 290" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <defs>
        <clipPath id="curveClip"><rect x="0" y="0" width="320" height="290" /></clipPath>
      </defs>
      <line x1="40" y1="220" x2="290" y2="220" stroke={accent} strokeOpacity="0.4" strokeWidth="1" />
      <line x1="40" y1="40" x2="40" y2="220" stroke={accent} strokeOpacity="0.4" strokeWidth="1" />
      {[80, 120, 160, 200, 240, 280].map((x) => (
        <line key={x} x1={x} y1="218" x2={x} y2="222" stroke={accent} strokeOpacity="0.4" />
      ))}
      <path d="M 40 220 Q 100 220, 130 160 T 220 80 L 220 220 Z" fill={accent} fillOpacity="0.18" />
      <path d="M 40 220 Q 100 220, 130 160 T 220 80" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
      <text x="48" y="78" fontFamily="Lora, serif" fontSize="56" fontStyle="italic" fill={accent}>∫</text>
      <text x="84" y="86" fontFamily="JetBrains Mono, monospace" fontSize="11" fill={accent} opacity="0.85">f(x) dx</text>
      <circle cx="130" cy="160" r="3.5" fill={accent} />
      <circle cx="220" cy="80" r="3.5" fill={accent} />
    </svg>
  ),

  Person: ({ accent = 'currentColor' }: AccentProps) => (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <circle cx="12" cy="8" r="3.5" fill="none" stroke={accent} strokeWidth="1.7" />
      <path d="M 4 21 C 4 16, 8 14, 12 14 C 16 14, 20 16, 20 21" fill="none" stroke={accent} strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),

  Parent: ({ accent = 'currentColor' }: AccentProps) => (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <circle cx="9" cy="8" r="2.8" fill="none" stroke={accent} strokeWidth="1.7" />
      <circle cx="16" cy="10" r="2.2" fill="none" stroke={accent} strokeWidth="1.7" />
      <path d="M 3 21 C 3 17, 6 15, 9 15 C 12 15, 15 17, 15 21" fill="none" stroke={accent} strokeWidth="1.7" strokeLinecap="round" />
      <path d="M 14 21 C 14 18.5, 15 17, 16 17 C 17 17, 18 18.5, 18 21" fill="none" stroke={accent} strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),

  Teacher: ({ accent = 'currentColor' }: AccentProps) => (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect x="13" y="3" width="9" height="7" rx="0.5" fill="none" stroke={accent} strokeWidth="1.5" />
      <path d="M 15 6 L 17 6 M 15 7.5 L 19 7.5" stroke={accent} strokeWidth="1" strokeLinecap="round" />
      <circle cx="7" cy="8" r="2.8" fill="none" stroke={accent} strokeWidth="1.7" />
      <path d="M 2 21 C 2 16, 4.5 14, 7 14 C 9.5 14, 12 16, 12 21" fill="none" stroke={accent} strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),

  Bell: ({ accent = 'currentColor' }: AccentProps) => (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <path d="M 5 17 C 5 16, 6 15.5, 6 14 V 11 C 6 7.5, 8.5 5, 12 5 C 15.5 5, 18 7.5, 18 11 V 14 C 18 15.5, 19 16, 19 17 Z" fill="none" stroke={accent} strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M 10 20 C 10 21, 11 22, 12 22 C 13 22, 14 21, 14 20" fill="none" stroke={accent} strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),

  Sparkle: ({ accent = 'currentColor', size = 16 }: SizedProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size}>
      <path d="M 12 2 L 13.5 9 L 21 12 L 13.5 15 L 12 22 L 10.5 15 L 3 12 L 10.5 9 Z" fill={accent} />
    </svg>
  ),

  Check: ({ accent = 'currentColor', size = 14 }: SizedProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size}>
      <path d="M 5 12 L 10 17 L 19 7" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  ChevronR: ({ accent = 'currentColor', size = 16 }: SizedProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size}>
      <path d="M 9 6 L 15 12 L 9 18" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  ArrowL: ({ accent = 'currentColor', size = 20 }: SizedProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size}>
      <path d="M 15 6 L 9 12 L 15 18 M 9 12 H 20" fill="none" stroke={accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  Google: () => (
    <svg viewBox="0 0 24 24" width="20" height="20">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.76c-.99.66-2.25 1.05-3.71 1.05-2.86 0-5.28-1.93-6.14-4.52H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.86 14.11A6.6 6.6 0 0 1 5.5 12c0-.74.13-1.45.36-2.11V7.05H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.95l3.68-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.65l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.68 2.84C6.72 7.31 9.14 5.38 12 5.38Z" />
    </svg>
  ),

  Mail: ({ accent = 'currentColor' }: AccentProps) => (
    <svg viewBox="0 0 24 24" width="20" height="20">
      <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke={accent} strokeWidth="1.8" />
      <path d="M 3 7 L 12 13 L 21 7" fill="none" stroke={accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  Logo: ({ accent = 'currentColor' }: AccentProps) => {
    const style: CSSProperties = { display: 'flex', alignItems: 'center', gap: 8 };
    return (
      <div style={style}>
        <svg viewBox="0 0 28 28" width="22" height="22">
          <circle cx="14" cy="14" r="12" fill="none" stroke={accent} strokeWidth="2" />
          <text x="14" y="20" textAnchor="middle" fontFamily="Lora, serif" fontSize="16" fontStyle="italic" fill={accent}>m</text>
        </svg>
        <span style={{ fontFamily: 'Lora, serif', fontSize: 18, fontStyle: 'italic', color: accent, letterSpacing: '-0.01em' }}>Mathēma</span>
      </div>
    );
  },
};
