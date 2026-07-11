import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "anyaround — localized names & flags for any locale";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

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
            "radial-gradient(circle at 50% 32%, #1a1420 0%, #0a0a0a 70%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            padding: "56px 72px",
            borderRadius: 32,
            background: "#faf7f2",
            boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={720} height={161} alt="anyaround" />
        </div>

        <div
          style={{
            marginTop: 56,
            fontSize: 34,
            color: "#e8e4ee",
            fontWeight: 600,
          }}
        >
          Intl knows every name. anyaround adds the flag.
        </div>

        <div
          style={{
            marginTop: 20,
            fontSize: 24,
            color: "#c4b5fd",
            fontFamily: "monospace",
          }}
        >
          npm i anyaround
        </div>
      </div>
    ),
    size,
  );
}
