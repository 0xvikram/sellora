// Renders the poster images of the two 3D scenes (the hero diorama and
// the pipeline) from the live scenes.
//
//   npm run build && npx next start -p 3457   (in another terminal)
//   npm run posters
//
// Opens /?diorama=still (end state, findings shown, no idle motion, no
// pointer) in headless Chromium on the GPU (ANGLE Metal on macOS; set
// POSTER_GL=swiftshader elsewhere) and saves the card as JPEG, quality 80:
//   public/posters/hero-diorama.jpg    560 x 700 card at 2x = 1120 x 1400 (4:5, lg and up)
//   public/posters/hero-diorama-m.jpg  390 x 292.5 card at 2x = 780 x 586 (4:3, below lg)
// and /?pipeline=still (a fixed moment, no pointer, the dolly at its middle):
//   public/posters/pipeline.jpg        1408 x 616 card (16:7, lg and up) at 1.5x = 2112 x 924
//   public/posters/pipeline-m.jpg      390 x 292.5 card at 2x = 780 x 586 (4:3, below lg)
// If a scene changes, run it again and commit the files.
import { chromium } from "@playwright/test";
import { fileURLToPath } from "node:url";

const BASE = process.env.BASE_URL ?? "http://localhost:3457";
const OUT = fileURLToPath(new URL("../public/posters/", import.meta.url));
const GL =
  process.env.POSTER_GL === "swiftshader"
    ? ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"]
    : ["--use-gl=angle", "--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"];

const SHOTS = [
  { param: "diorama", mode: "still", file: "hero-diorama.jpg", card: ".dio-card", ready: 'figure[data-diorama="live"]', dpr: 2 },
  { param: "diorama", mode: "still-m", file: "hero-diorama-m.jpg", card: ".dio-card", ready: 'figure[data-diorama="live"]', dpr: 2 },
  { param: "pipeline", mode: "still", file: "pipeline.jpg", card: ".pipe-card", ready: 'figure[data-pipeline="live"]', dpr: 1.5 },
  { param: "pipeline", mode: "still-m", file: "pipeline-m.jpg", card: ".pipe-card", ready: 'figure[data-pipeline="live"]', dpr: 2 },
];

const browser = await chromium.launch({ args: GL });
try {
  for (const shot of SHOTS) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: shot.dpr });
    await page.goto(`${BASE}/?${shot.param}=${shot.mode}`, { waitUntil: "networkidle" });
    await page.locator(shot.ready).waitFor({ timeout: 20_000 });
    await page.evaluate(() => document.fonts.ready);
    // A few more frames for the contact shadow and environment.
    await page.waitForTimeout(800);
    const card = page.locator(shot.card);
    await card.screenshot({ path: `${OUT}${shot.file}`, type: "jpeg", quality: 80 });
    const box = await card.boundingBox();
    console.log(`${shot.file}: card ${box?.width} x ${box?.height} CSS px at ${shot.dpr}x`);
    await page.close();
  }
} finally {
  await browser.close();
}
