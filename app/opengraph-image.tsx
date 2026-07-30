import { ImageResponse } from "next/og";

export const alt = "anyfamily — micro Intl tools for any locale";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PKGS = [
  { name: "anywhen", tagline: "dates & times", accent: "#f5b66b" },
  { name: "anyamount", tagline: "money & numbers", accent: "#b493e6" },
  { name: "anymany", tagline: "lists", accent: "#2ce69d" },
  { name: "anyaround", tagline: "names & flags", accent: "#be2740" },
  { name: "anylong", tagline: "durations", accent: "#2cc2c9" },
  { name: "anyplural", tagline: "plurals", accent: "#e879c5" },
  { name: "anyword", tagline: "words & graphemes", accent: "#c9f53c" },
];

// Seven cards wrap unevenly on their own, so the rows are split by hand into a
// centered 4 / 3 pyramid. CARD_W is fixed to keep the columns aligned; it holds
// the widest content (the "anyamount" name row, "words & graphemes" tagline)
// with room to spare, and four of them plus gaps stay inside ROW_MAX.
const CARD_W = 232;
const ROW_MAX = 1040;
const ROWS = [PKGS.slice(0, 4), PKGS.slice(4)];

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
            flexDirection: "column",
            alignItems: "center",
            marginTop: 44,
            gap: 18,
          }}
        >
          {ROWS.map((row, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "center",
                maxWidth: ROW_MAX,
                gap: 18,
              }}
            >
              {row.map((p) => (
                <div
                  key={p.name}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    width: CARD_W,
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
                    <span
                      style={{ fontSize: 26, fontWeight: 700, color: "#ffffff" }}
                    >
                      {p.name}
                    </span>
                  </div>
                  <span style={{ marginTop: 8, fontSize: 18, color: "#8a8590" }}>
                    {p.tagline}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
