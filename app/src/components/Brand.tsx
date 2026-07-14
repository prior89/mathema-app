import { CSSProperties } from 'react';

/**
 * Matheo official logo (matheo-logo.png, public/).
 *
 * Single source of truth — replaces the legacy <Glyph.Logo /> SVG fallback so
 * every brand placement in the app uses the same image asset. Sizes are tuned
 * to the visual rhythm of the host context, not arbitrary px values.
 *
 *   sm  — top-corner branding on auth/onboarding screens (compact)
 *   md  — hero "Sign in to ___" call-out
 *   lg  — standalone marketing surfaces
 *   splash — full-screen loading state
 */

const HEIGHTS = {
  sm: 32,
  md: 72,
  lg: 120,
  splash: 140,
} as const;

type Size = keyof typeof HEIGHTS;

/**
 * Compact brand mark cropped from the official artwork. The source PNG has a
 * large presentation canvas around the symbol, which made the old 32 px logo
 * look like a tiny speck in app bars. Keeping the crop in CSS lets us reuse the
 * approved asset without shipping a second, divergent logo file.
 */
export function BrandMark({ size = 42, className = '' }: { size?: number; className?: string }) {
  const scale = size / 50;
  return (
    <span
      className={`brand-mark ${className}`.trim()}
      aria-hidden="true"
      style={{ width: size, height: size }}
    >
      <img
        src="/matheo-logo.png"
        alt=""
        style={{
          width: 150 * scale,
          height: 'auto',
          left: -52 * scale,
          top: -8 * scale,
        }}
      />
    </span>
  );
}

/** Crisp horizontal lock-up for navigation and auth surfaces. */
export function BrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand-lockup" aria-label="Matheo">
      <BrandMark size={compact ? 34 : 42} />
      <span className="brand-lockup-name">matheo</span>
    </span>
  );
}

export function BrandLogo({ size = 'sm', style }: { size?: Size; style?: CSSProperties }) {
  return (
    <img
      src="/matheo-logo.png"
      alt="Matheo"
      style={{
        height: HEIGHTS[size],
        width: 'auto',
        objectFit: 'contain',
        // mixBlendMode multiplies the logo against the page bg, so the white
        // halo in the PNG disappears against the sage palette without needing
        // a separately exported transparent-bg asset.
        mixBlendMode: 'multiply',
        ...style,
      }}
    />
  );
}

/**
 * Full-viewport loading state. Centers the logo with a gentle opacity pulse so
 * users perceive progress instead of a frozen screen. Used by route guards
 * (App.tsx Suspense fallback, ProtectedRoute auth-not-ready).
 */
export function LoadingSplash() {
  return (
    <div
      style={{
        minHeight: '100vh',
        minWidth: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Brand sage tint instead of near-white — splash should read as the
        // app's signature colour, not a blank page.
        background: 'var(--p-primary-tint, oklch(0.95 0.022 175))',
      }}
    >
      {/* Animation must live on the <img> itself: animated opacity on a
          wrapper creates an isolated stacking context, which voids the
          child's mix-blend-mode and exposes the PNG's white box. */}
      <BrandLogo size="splash" style={{ animation: 'mathema-fade 1.4s ease-in-out infinite' }} />
      <style>{`
        @keyframes mathema-fade {
          0%, 100% { opacity: 0.45; }
          50%      { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
