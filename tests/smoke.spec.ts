import { expect, test, type Page } from "@playwright/test";
import { DEMO_START_URL, TEARDOWNS } from "../src/lib/site";

const ROUTES = [
  "/",
  "/teardowns",
  "/prices",
  "/about",
  "/contact",
  ...TEARDOWNS.map((t) => `/teardowns/${t.slug}`),
];

/** Collects console errors and uncaught page errors. */
function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(String(e)));
  return errors;
}

// Never let a test reach the real demo workspace.
test.beforeEach(async ({ context }) => {
  const origin = new URL(DEMO_START_URL).origin;
  await context.route(`${origin}/**`, (route) =>
    route.fulfill({ status: 200, contentType: "text/html", body: "<title>stub</title>" }),
  );
});

for (const route of ROUTES) {
  test(`${route}: 200, one h1, no console errors, no sideways scroll at 390`, async ({ page }) => {
    const errors = trackErrors(page);
    await page.setViewportSize({ width: 390, height: 844 });
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main#main")).toHaveCount(1);
    await page.waitForLoadState("networkidle");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
    expect(errors).toEqual([]);
  });
}

test("unknown teardown slug is a 404 with the site 404 page", async ({ page }) => {
  const res = await page.goto("/teardowns/not-a-real-teardown");
  expect(res?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("main#main")).toHaveCount(1);
});

test("mobile menu opens with the button and closes with Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const button = page.getByRole("button", { name: "Menu" });
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await button.click();
  const toggle = page.locator("header button[aria-controls]");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  const mobileNav = page.getByRole("navigation", { name: "Mobile" });
  await expect(mobileNav).toBeVisible();
  await expect(mobileNav.getByRole("link").first()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(mobileNav).toBeHidden();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();
});

test("hero form opens DEMO_START_URL with the url param", async ({ page }) => {
  await page.goto("/");
  const form = page.locator("form#audit");
  await expect(form).toHaveAttribute("action", DEMO_START_URL);
  await form.getByLabel("Your store address").fill("  example-store.com ");
  const popupPromise = page.waitForEvent("popup");
  await form.getByRole("button", { name: "Start the audit" }).click();
  const popup = await popupPromise;
  await popup.waitForLoadState();
  const url = new URL(popup.url());
  expect(`${url.origin}${url.pathname}`).toBe(DEMO_START_URL);
  expect(url.searchParams.get("url")).toBe("example-store.com");
});

test("Copy button on /contact copies the email", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/contact");
  const button = page.getByRole("button", { name: "Copy email address" });
  await button.click();
  await expect(button).toHaveText("Copied");
  await expect(page.getByRole("status").filter({ hasText: "Email address copied" })).toHaveCount(1);
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toMatch(/^[^@\s]+@[^@\s]+$/);
  await expect(page.locator(`a[href="mailto:${copied}"]`).first()).toBeVisible();
});

// The hero diorama. Server HTML is the poster; the live scene mounts only
// on desktop with a mouse, motion allowed and WebGL (headless Chromium has
// SwiftShader WebGL, so it mounts here too, slowly).
const FINDING_IDS = ["shelves", "counter", "door", "parcels"];

for (const [width, file, ratio] of [
  [390, "/posters/hero-diorama-m.jpg", 4 / 3],
  [1440, "/posters/hero-diorama.jpg", 4 / 5],
] as const) {
  test(`diorama poster is present, loaded and sized at ${width}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height: width < 600 ? 844 : 900 });
    await page.goto("/");
    const poster = page.locator("img[data-dio-poster]");
    await expect(poster).toBeVisible();
    await expect(poster).toHaveAttribute("width", /\d+/);
    await expect(poster).toHaveAttribute("height", /\d+/);
    await expect.poll(() => poster.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth)).toBeGreaterThan(0);
    expect(await poster.evaluate((img: HTMLImageElement) => new URL(img.currentSrc).pathname)).toBe(file);
    const box = (await page.locator(".dio-card").boundingBox())!;
    expect(box.width / box.height).toBeCloseTo(ratio, 2);
    if (width >= 1024) expect(Math.round(box.width)).toBe(560);
  });
}

test("diorama: on desktop the canvas mounts within 5 s and the four findings appear by 6 s", async ({ page }) => {
  const errors = trackErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  const start = Date.now();
  await page.goto("/");
  const figure = page.locator("figure[data-diorama]");
  await expect(figure.locator("canvas")).toHaveCount(1, { timeout: 5_000 });
  for (const id of FINDING_IDS) {
    await expect(figure.locator(`[data-finding="${id}"]`)).toHaveAttribute("data-on", "true", {
      timeout: Math.max(500, 6_000 - (Date.now() - start)),
    });
  }
  await expect(figure).toHaveAttribute("data-diorama", "live");
  await expect(figure.getByRole("button", { name: "Replay" })).toBeVisible();
  expect(errors).toEqual([]);
});

test("diorama: reduced motion shows the poster only", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500);
  const figure = page.locator("figure[data-diorama]");
  await expect(figure).toHaveAttribute("data-diorama", "poster");
  await expect(figure.locator("canvas")).toHaveCount(0);
  await expect(figure.locator("img[data-dio-poster]")).toBeVisible();
  await expect(figure.getByRole("button", { name: "Replay" })).toHaveCount(0);
});

test("diorama: typing a store address updates the chip", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const domain = page.locator("[data-dio-chip] [data-dio-domain]");
  await expect(domain).toHaveText("oatleaf.example");
  await expect(page.locator("[data-dio-chip]")).toContainText(/\d{2}:\d{2}/);
  await page.locator("form#audit").getByLabel("Your store address").fill("https://www.my-shop.com/x");
  await expect(domain).toHaveText("my-shop.com");
});

const STORY_NUMBERS = ["3–5", "1 → 4", "21% → 31%", "1", "54% → 96%"];

test("story: five stacked steps with their numbers at 390, no pinned stage", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const story = page.locator("#what-changes");
  await expect(story.getByRole("heading", { level: 2 })).toHaveText("Five jobs, applied to the store.");
  await expect(story.locator(".story-pin")).toBeHidden();
  const steps = story.locator(".story-stack > ol > li");
  await expect(steps).toHaveCount(5);
  for (const [i, n] of STORY_NUMBERS.entries()) {
    await expect(steps.nth(i).locator(".story-number")).toHaveText(n);
    await expect(steps.nth(i).locator(".sfig")).toHaveAttribute("aria-hidden", "true");
  }
});

test("story: pinned stage at 1440, and the page still scrolls to the footer", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const story = page.locator("#what-changes");
  await expect(story.locator(".story-stack").first()).toBeHidden();
  await expect(story.locator(".story-stack").last()).toBeHidden();
  const stage = story.locator(".story-pin .story-stage");
  await expect(stage).toBeVisible();
  // The stage carries the section heading, so it is never headless.
  await expect(stage.getByRole("heading", { level: 2 })).toHaveText("Five jobs, applied to the store.");
  await expect(story.locator(".story-list > li")).toHaveCount(5);
  // The stage is sticky inside a 450vh track (3.5 screens of scroll); the
  // timeline marks the active step once GSAP and ScrollTrigger have loaded.
  const track = await story.locator(".story-pin").boundingBox();
  expect(Math.round(track!.height)).toBe(900 * 4.5);
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 450) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 25));
    }
    window.scrollTo(0, document.body.scrollHeight);
  });
  await expect(stage).toHaveAttribute("data-active", /[0-4]/);
  await expect(page.locator("footer#contact")).toBeInViewport();
});

test("story: reduced motion at 1440 shows all five steps, not pinned", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const story = page.locator("#what-changes");
  await expect(story.locator(".story-pin")).toBeHidden();
  await expect(story.locator(".story-stack > ol > li")).toHaveCount(5);
});

for (const width of [390, 1440]) {
  test(`report section: six labelled figures and a visible sheet at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 900 });
    await page.goto("/");
    const report = page.locator("section#report");
    await expect(report.getByRole("heading", { level: 2 })).toHaveText("One page. Every number labelled.");
    const sheet = report.getByRole("figure", { name: "Sample audit report" });
    await sheet.scrollIntoViewIfNeeded();
    await expect(sheet).toBeVisible();
    for (const label of [
      "Repeat rate",
      "AI assistants citing you",
      "Pixel to order match",
      "Flows with gaps",
      "Pages assistants can read",
      "Ad hooks ready",
    ]) {
      await expect(sheet.locator("dt", { hasText: label })).toHaveCount(1);
    }
    // The figures finish counting at their final values, and the sheet
    // settles fully opaque.
    await expect(sheet.locator("[data-report-num]")).toHaveText(["31", "1", "54", "2", "31", "5"]);
    await expect(sheet).toHaveCSS("opacity", "1");
    const box = await sheet.boundingBox();
    expect(box && box.width).toBeGreaterThan(300);
    await expect(sheet.getByText("Every figure links to the query that produced it.")).toBeVisible();
  });
}

test("nav pill is fixed and takes the tint of the section beneath it; the ground follows", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const pill = page.locator("[data-nav-pill]");
  const layer = page.locator("[data-ground-layer]");
  await expect(pill).toHaveAttribute("data-ground", "bone");
  await expect(page.locator("html")).toHaveClass(/ground-live/);
  // The heading sits well inside each section, so the band under the pill
  // and more than half the viewport are both on that section.
  const goTo = (id: string) =>
    page.evaluate((id) => {
      const el = document.getElementById(id)!;
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + 120);
    }, id);
  await goTo("work");
  await expect(pill).toHaveAttribute("data-ground", "sage");
  await expect(layer).toHaveAttribute("data-ground", "sage");
  await expect(layer).toHaveCSS("background-color", "rgb(183, 195, 167)");
  await goTo("report");
  await expect(pill).toHaveAttribute("data-ground", "ink");
  await expect(layer).toHaveAttribute("data-ground", "ink");
  await expect(pill.getByRole("link", { name: "Work" })).toHaveCSS("color", "rgba(243, 245, 238, 0.75)");
  await goTo("prices");
  await expect(pill).toHaveAttribute("data-ground", "bone");
  await expect(layer).toHaveAttribute("data-ground", "bone");
  const box = await pill.boundingBox();
  expect(Math.round(box!.y)).toBe(16);
  expect(Math.round(box!.height)).toBe(60);
});
