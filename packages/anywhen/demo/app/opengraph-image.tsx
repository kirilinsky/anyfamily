import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "anywhen — date formatting for any locale";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
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
      <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
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
        <div style={{ display: "flex", gap: "32px" }}>
          <span
            style={{
              fontSize: "20px",
              color: "rgba(255,255,255,0.35)",
              fontFamily: "monospace",
            }}
          >
            {"anyago(date, 'ar')  // \"قبل 3 ساعات\""}
          </span>
          <span
            style={{
              fontSize: "20px",
              color: "rgba(255,255,255,0.35)",
              fontFamily: "monospace",
            }}
          >
            {"anydate(date, 'ja')  // \"2016年2月5日\""}
          </span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "48px",
          alignItems: "flex-end",
          width: "100%",
        }}
      >
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
        <span
          style={{
            marginLeft: "auto",
            fontSize: "18px",
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.1em",
          }}
        >
          anywhen-kappa.vercel.app
        </span>
      </div>
    </div>,
    { ...size },
  );
}
