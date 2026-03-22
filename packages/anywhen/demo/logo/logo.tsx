export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 470 250"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="anywhen"
    >
      <defs>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@1,800&family=Barlow:wght@700&display=swap');

          @keyframes fadeInRight {
            from { opacity: 0; transform: translateX(18px); }
            to   { opacity: 1; transform: translateX(0); }
          }

          .word {
            opacity: 0;
            animation: fadeInRight 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }
          .w1 { animation-delay: 0.1s; }
          .w2 { animation-delay: 0.25s; }
          .w3 { animation-delay: 0.4s; }
        `}</style>
      </defs>
      <text
        x="0"
        y="175"
        fontFamily="'Barlow Condensed', sans-serif"
        fontWeight="800"
        fontStyle="italic"
        fontSize="200"
        fill="#c7e8ff"
        letterSpacing="-8"
      >
        ANY
      </text>

      <text
        x="280"
        y="75"
        fontFamily="'Barlow', sans-serif"
        fontWeight="700"
        fontSize="81"
        fill="#4fffb0"
        letterSpacing="-2"
        className="word w1"
      >
        when
      </text>

      <text
        x="260"
        y="155"
        fontFamily="'Barlow', sans-serif"
        fontWeight="700"
        fontSize="81"
        fill="#4fffb0"
        letterSpacing="-2"
        className="word w2"
      >
        date
      </text>

      <text
        x="250"
        y="235"
        fontFamily="'Barlow', sans-serif"
        fontWeight="700"
        fontSize="81"
        fill="#4fffb0"
        letterSpacing="-2"
        className="word w3"
      >
        ago
      </text>
    </svg>
  );
}
