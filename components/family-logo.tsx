/**
 * Parametrized "any|<suffix>" wordmark, generalized from the anyaround logo.
 * The cream italic "any" stays fixed; the mono suffix takes the package's
 * accent color. `mark` swaps the divider: "bar" (default) for per-package
 * logos, "star" for the anyfamily hero flourish (the "any*" asterisk).
 * `animate` staggers the three pieces in on mount — used on the demo routes,
 * where the wordmark is the page's opening beat rather than a section label.
 */
export function FamilyLogo({
  suffix,
  accent,
  className,
  mark = "bar",
  animate = false,
  widthChars,
}: {
  suffix: string;
  accent: string;
  className?: string;
  mark?: "bar" | "star";
  animate?: boolean;
  /**
   * Pins the viewBox to this many suffix characters instead of measuring the
   * current one. Only needed where the suffix changes while the mark stays on
   * screen: without it a longer word widens the viewBox, and since the element
   * is sized by CSS width, the whole wordmark — "any" included — would rescale
   * on every swap.
   */
  widthChars?: number;
}) {
  const CHAR = 56; // approx mono glyph advance at fontSize 100
  const suffixLen = suffix.length * CHAR;
  const suffixX = 230;
  const width = suffixX + (widthChars ?? suffix.length) * CHAR + 20;
  /**
   * With a pinned viewBox the mark is drawn at its natural width and the slack
   * all lands on the right, so a short suffix leaves the wordmark visibly
   * off-centre. Shift the whole group by half the slack instead.
   */
  const dx = ((widthChars ?? suffix.length) - suffix.length) * CHAR * 0.5;

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

      <g transform={`translate(${dx} 0)`}>
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
        className={animate ? "logo-intro-any" : undefined}
      >
        any
      </text>

      {mark === "star" ? (
        <text
          x="196"
          y="70"
          fontFamily="'Inter', sans-serif"
          fontWeight="800"
          fontSize="64"
          fill="#c4b5fd"
          className={animate ? "logo-intro-mark" : undefined}
        >
          *
        </text>
      ) : (
        <rect
          x="208"
          y="32"
          width="4"
          height="60"
          rx="1"
          fill={accent}
          className={animate ? "logo-intro-mark" : undefined}
        />
      )}

      <text
        x={suffixX}
        y="92"
        fontFamily="'JetBrains Mono', monospace"
        fontWeight="700"
        fontSize="100"
        fill={accent}
        textLength={suffixLen}
        lengthAdjust="spacingAndGlyphs"
        className={animate ? "logo-intro-suffix" : undefined}
      >
        {suffix}
      </text>
      </g>
    </svg>
  );
}
