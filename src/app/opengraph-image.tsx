import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";
import { TOKENS } from "@/lib/tokens";

export const alt = `${SITE_NAME}: ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Static Newsreader cuts (opsz 72; medium roman and regular italic, OFL),
// as TTF because the image renderer cannot read the woff2 files that
// next/font serves to the page. The image is rendered once at build time.
const FONT_DIR = join(process.cwd(), "src/app/og-fonts");

export default async function OpengraphImage() {
  const [medium, italic] = await Promise.all([
    readFile(join(FONT_DIR, "Newsreader-Display-Medium.ttf")),
    readFile(join(FONT_DIR, "Newsreader-Display-Italic.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: TOKENS.ground,
          color: TOKENS.ink,
          borderBottom: `16px solid ${TOKENS.lime}`,
        }}
      >
        <div style={{ fontFamily: "Newsreader", fontSize: 44, fontWeight: 500, letterSpacing: -0.5 }}>
          {SITE_NAME}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontFamily: "Newsreader",
              fontSize: 76,
              fontWeight: 500,
              lineHeight: 1.04,
              letterSpacing: -1.5,
              maxWidth: 1000,
            }}
          >
            <span>Prices, before the&nbsp;</span>
            <span style={{ fontStyle: "italic", fontWeight: 400, color: TOKENS.limeInk }}>first call.</span>
          </div>
          <div style={{ fontSize: 30, fontWeight: 500, lineHeight: 1.35, color: TOKENS.ink2, maxWidth: 980 }}>
            {SITE_TAGLINE}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Newsreader", data: medium, weight: 500, style: "normal" },
        { name: "Newsreader", data: italic, weight: 400, style: "italic" },
      ],
    },
  );
}
