type OrbitVariant = 'indigo' | 'teal' | 'sunny';

/**
 * Lightweight, code-native brand illustration. It makes math feel active
 * without adding a mascot that could skew too young for high-school users.
 * Symbols are decorative and intentionally hidden from assistive technology.
 */
export function LearningOrbit({ variant = 'indigo', compact = false }: {
  variant?: OrbitVariant;
  compact?: boolean;
}) {
  return (
    <div className={`learning-orbit ${variant} ${compact ? 'compact' : ''}`} aria-hidden="true">
      <span className="orbit-halo halo-one" />
      <span className="orbit-halo halo-two" />
      <span className="orbit-dot dot-one" />
      <span className="orbit-dot dot-two" />
      <span className="orbit-symbol symbol-one">π</span>
      <span className="orbit-symbol symbol-two">x²</span>
      <span className="orbit-symbol symbol-three">＋</span>
      <span className="orbit-card card-one">√16 = 4</span>
      <span className="orbit-card card-two">98%</span>
      <span className="orbit-core">
        <span className="orbit-core-glow" />
        <span className="orbit-core-copy">∑</span>
      </span>
    </div>
  );
}
