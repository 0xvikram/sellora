// Renders the hero diorama's poster images from the live scene.
//
//   npm run build && npx next start -p 3457   (in another terminal)
//   npm run posters
//
// Opens /?diorama=still (end state, findings shown, no idle motion, no
// pointer) in headless Chromium on the GPU (ANGLE Metal on macOS; set
// POSTER_GL=swiftshader elsewhere) and saves the card as JPEG, quality 80:
//   public/posters/hero-diorama.jpg    560 x 700 card at 2x = 1120 x 1400 (4:5, lg and up)
//   public/posters/hero-diorama-m.jpg  390 x 292.5 card at 2x = 780 x 585 (4:3, below lg)
// If the scene changes, run it again and commit the two files.
import { chromium } from "@playwright/test";
import { fileURLToPath } from "node:url";

const BASE = process.env.BASE_URL ?? "http://localhost:3457";
const OUT = fileURLToPath(new URL("../public/posters/", import.meta.url));
const GL =
  process.env.POSTER_GL === "swiftshader"
    ? ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"]
    : ["--use-gl=angle", "--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"];

const SHOTS = [
  { mode: "still", file: "hero-diorama.jpg" },
  { mode: "still-m", file: "hero-diorama-m.jpg" },
];

const browser = await chromium.launch({ args: GL });
try {
  for (const shot of SHOTS) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
    await page.goto(`${BASE}/?diorama=${shot.mode}`, { waitUntil: "networkidle" });
    await page.locator('figure[data-diorama="live"]').waitFor({ timeout: 20_000 });
    await page.evaluate(() => document.fonts.ready);
    // A few more frames for the contact shadow and environment.
    await page.waitForTimeout(800);
    const card = page.locator(".dio-card");
    await card.screenshot({ path: `${OUT}${shot.file}`, type: "jpeg", quality: 80 });
    const box = await card.boundingBox();
    console.log(`${shot.file}: card ${box?.width} x ${box?.height} CSS px at 2x`);
    await page.close();
  }
} finally {
  await browser.close();
}
