import { ImageResponse } from "next/og";

export const alt = "anyfamily — micro Intl tools for any locale";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PKGS = [
  { name: "anyaround", tagline: "names & flags", accent: "#c85a6e" },
  { name: "anyamount", tagline: "money & numbers", accent: "#b493e6" },
  { name: "anywhen", tagline: "dates & times", accent: "#7dd3fc" },
  { name: "anymany", tagline: "lists", accent: "#fcd34d" },
];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 50% 30%, #1a1420 0%, #0a0a0a 70%)",
          fontFamily: "sans-serif",
          padding: 64,
        }}
      >
        <div style={{ display: "flex", fontSize: 78, fontWeight: 800 }}>
          <span style={{ color: "#ffffff" }}>the&nbsp;</span>
          <span style={{ color: "#6b6b6b" }}>any</span>
          <span style={{ color: "#b493e6" }}>*</span>
          <span style={{ color: "#ffffff" }}>&nbsp;family</span>
        </div>

        <div style={{ marginTop: 20, fontSize: 28, color: "#a8a2b2" }}>
          micro Intl tools · zero data · any locale
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 56,
            gap: 20,
          }}
        >
          {PKGS.map((p) => (
            <div
              key={p.name}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "20px 26px",
                borderRadius: 18,
                background: "#ffffff08",
                border: `1px solid ${p.accent}55`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 12,
                    background: p.accent,
                  }}
                />
                <span style={{ fontSize: 26, fontWeight: 700, color: "#ffffff" }}>
                  {p.name}
                </span>
              </div>
              <span style={{ marginTop: 8, fontSize: 18, color: "#8a8590" }}>
                {p.tagline}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
