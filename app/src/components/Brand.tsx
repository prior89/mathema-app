import { CSSProperties } from 'react';

/**
 * matheo official logo (matheo-logo.png, public/).
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

export function BrandLogo({ size = 'sm', style }: { size?: Size; style?: CSSProperties }) {
  return (
    <img
      src="/matheo-logo.png"
      alt="matheo"
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
        background: 'var(--p-bg, #f5f7f3)',
      }}
    >
      <div style={{ animation: 'mathema-fade 1.4s ease-in-out infinite' }}>
        <BrandLogo size="splash" />
      </div>
      <style>{`
        @keyframes mathema-fade {
          0%, 100% { opacity: 0.45; }
          50%      { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
