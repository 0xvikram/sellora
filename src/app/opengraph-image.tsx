import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";
import { TOKENS } from "@/lib/tokens";

export const alt = `${SITE_NAME}: ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Static Archivo cuts (OFL) from Google Fonts: condensed semibold (wdth 75)
// roman and italic for the headline, normal-width medium for the tagline.
// TTF because the image renderer cannot read the woff2 files next/font
// serves to the page. The image is rendered once at build time.
const FONT_DIR = join(process.cwd(), "src/app/og-fonts");

export default async function OpengraphImage() {
  const [condensed, condensedItalic, medium] = await Promise.all([
    readFile(join(FONT_DIR, "Archivo-Condensed-SemiBold.ttf")),
    readFile(join(FONT_DIR, "Archivo-Condensed-SemiBoldItalic.ttf")),
    readFile(join(FONT_DIR, "Archivo-Medium.ttf")),
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
          padding: 72,
          background: TOKENS.ground,
          color: TOKENS.ink,
          fontFamily: "Archivo",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              fontFamily: "Archivo Condensed",
              fontSize: 40,
              fontWeight: 600,
              letterSpacing: 0.5,
              textTransform: "uppercase",
            }}
          >
            {SITE_NAME}
          </div>
          <div
            style={{
              display: "flex",
              padding: "12px 26px",
              borderRadius: 999,
              border: `2px solid ${TOKENS.ink}`,
              background: TOKENS.lime,
              fontSize: 24,
              fontWeight: 500,
            }}
          >
            Start the audit
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontFamily: "Archivo Condensed",
              fontSize: 118,
              fontWeight: 600,
              lineHeight: 0.92,
              letterSpacing: -1,
              textTransform: "uppercase",
              maxWidth: 1060,
            }}
          >
            <span>Prices, before the&nbsp;</span>
            <span style={{ fontStyle: "italic", color: TOKENS.limeInk }}>first call.</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 500, lineHeight: 1.35, color: TOKENS.ink2, maxWidth: 980 }}>
            {SITE_TAGLINE}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Archivo Condensed", data: condensed, weight: 600, style: "normal" },
        { name: "Archivo Condensed", data: condensedItalic, weight: 600, style: "italic" },
        { name: "Archivo", data: medium, weight: 500, style: "normal" },
      ],
    },
  );
}
