export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 130"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="anywhen"
    >
      <defs>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,800;1,400&family=JetBrains+Mono:wght@700&display=swap');

          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50%      { opacity: 0; }
          }

          .any {
            opacity: 0;
            transform-box: fill-box;
            animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.05s forwards;
          }
          .caret {
            opacity: 0;
            animation: fadeUp 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.25s forwards,
                       blink 1.1s step-end 0.7s infinite;
          }
          .when {
            opacity: 0;
            transform-box: fill-box;
            animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.4s forwards;
          }
          .accent {
            opacity: 0;
            transform-box: fill-box;
            transform-origin: left center;
            animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.6s forwards;
          }
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
        className="any"
      >
        any
      </text>

      <rect
        x="208"
        y="32"
        width="4"
        height="60"
        rx="1"
        fill="#f5b66b"
        className="caret"
      />

      <text
        x="230"
        y="92"
        fontFamily="'JetBrains Mono', monospace"
        fontWeight="700"
        fontSize="100"
        fill="#f5b66b"
        textLength="240"
        lengthAdjust="spacingAndGlyphs"
        className="when"
      >
        when
      </text>

    </svg>
  );
}
