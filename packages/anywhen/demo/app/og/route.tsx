import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function GET() {
  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        background: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        padding: "80px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "0px" }}>
          <span
            style={{
              fontSize: "96px",
              fontWeight: 900,
              fontStyle: "italic",
              color: "#c7e8ff",
              letterSpacing: "-4px",
              lineHeight: 1,
            }}
          >
            ANY
          </span>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "8px",
            }}
          >
            <span
              style={{
                fontSize: "40px",
                fontWeight: 700,
                color: "#4fffb0",
                lineHeight: 1.1,
              }}
            >
              when
            </span>
            <span
              style={{
                fontSize: "40px",
                fontWeight: 700,
                color: "#4fffb0",
                lineHeight: 1.1,
              }}
            >
              date
            </span>
            <span
              style={{
                fontSize: "40px",
                fontWeight: 700,
                color: "#4fffb0",
                lineHeight: 1.1,
              }}
            >
              ago
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <span
          style={{
            fontSize: "42px",
            fontWeight: 500,
            color: "rgba(255,255,255,0.85)",
            letterSpacing: "-1px",
            lineHeight: 1.2,
          }}
        >
          Date formatting for any locale.
        </span>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          {[
            "anydate(date, 'de')  // \"5. Feb. 2016\"",
            "anyago(date, 'ar')   // \"قبل 3 ساعات\"",
          ].map((line) => (
            <span
              key={line}
              style={{
                fontSize: "20px",
                color: "rgba(255,255,255,0.35)",
                fontFamily: "monospace",
              }}
            >
              {line}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: "40px", alignItems: "center" }}>
        {[
          ["~800b", "gzip"],
          ["0", "dependencies"],
          ["200+", "locales"],
        ].map(([val, label]) => (
          <div
            key={label}
            style={{ display: "flex", flexDirection: "column", gap: "4px" }}
          >
            <span
              style={{
                fontSize: "32px",
                fontWeight: 700,
                color: "#4fffb0",
                lineHeight: 1,
              }}
            >
              {val}
            </span>
            <span
              style={{
                fontSize: "16px",
                color: "rgba(255,255,255,0.3)",
                letterSpacing: "0.1em",
              }}
            >
              {label}
            </span>
          </div>
        ))}
        <div
          style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}
        >
          <span
            style={{
              fontSize: "18px",
              color: "rgba(255,255,255,0.2)",
              letterSpacing: "0.15em",
            }}
          >
            anywhen-kappa.vercel.app
          </span>
        </div>
      </div>
    </div>,
    { ...size },
  );
}
