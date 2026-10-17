import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";
import { TOKENS } from "@/lib/tokens";

export const alt = `${SITE_NAME}: ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          background: TOKENS.paper,
          color: TOKENS.ink,
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -3 }}>{SITE_NAME}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ width: 96, height: 8, background: TOKENS.accent }} />
          <div style={{ fontSize: 40, lineHeight: 1.3, color: TOKENS.ink2, maxWidth: 1000 }}>
            {SITE_TAGLINE}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
