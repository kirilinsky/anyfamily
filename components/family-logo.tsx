/**
 * Parametrized "any|<suffix>" wordmark, generalized from the anyaround logo.
 * The cream italic "any" stays fixed; the mono suffix + caret take the
 * package's accent color and the viewBox widens to fit the suffix.
 */
export function FamilyLogo({
  suffix,
  accent,
  className,
}: {
  suffix: string;
  accent: string;
  className?: string;
}) {
  const CHAR = 56; // approx mono glyph advance at fontSize 100
  const suffixLen = suffix.length * CHAR;
  const suffixX = 230;
  const width = suffixX + suffixLen + 20;

  return (
    <svg
      viewBox={`0 0 ${width} 130`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={`any${suffix}`}
    >
      <defs>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,800;1,400&family=JetBrains+Mono:wght@700&display=swap');
        `}</style>
      </defs>

      <text
        x="10"
        y="92"
        fontFamily="'Inter', sans-serif"
        fontWeight="400"
        fontStyle="italic"
        fontSize="100"
        fill="#e9e4d4"
        textLength="180"
        lengthAdjust="spacingAndGlyphs"
      >
        any
      </text>

      <rect x="208" y="32" width="4" height="60" rx="1" fill={accent} />

      <text
        x={suffixX}
        y="92"
        fontFamily="'JetBrains Mono', monospace"
        fontWeight="700"
        fontSize="100"
        fill={accent}
        textLength={suffixLen}
        lengthAdjust="spacingAndGlyphs"
      >
        {suffix}
      </text>
    </svg>
  );
}
