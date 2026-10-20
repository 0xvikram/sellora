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
  // The stage is sticky inside a 350vh track (2.5 screens of scroll); the
  // timeline marks the active step once GSAP and ScrollTrigger have loaded.
  const track = await story.locator(".story-pin").boundingBox();
  expect(Math.round(track!.height)).toBe(900 * 3.5);
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

// The pipeline scene. Like the hero: server HTML is a poster (lazy, mid
// page); the live scene mounts on desktop when the card nears the viewport.
const GATE_IDS = ["creative", "ai-search", "klaviyo", "connections", "tracking"];

for (const [width, file, ratio] of [
  [390, "/posters/pipeline-m.jpg", 4 / 3],
  [1440, "/posters/pipeline.jpg", 16 / 7],
] as const) {
  test(`pipeline poster is present, loaded and sized at ${width}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height: width < 600 ? 844 : 900 });
    await page.goto("/");
    const section = page.locator("section#pipeline");
    await expect(section.getByRole("heading", { level: 2 })).toHaveText("Every order passes five gates.");
    const poster = section.locator("img[data-pipe-poster]");
    await poster.scrollIntoViewIfNeeded();
    await expect(poster).toBeVisible();
    await expect.poll(() => poster.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth)).toBeGreaterThan(0);
    expect(await poster.evaluate((img: HTMLImageElement) => new URL(img.currentSrc).pathname)).toBe(file);
    const box = (await section.locator(".pipe-card").boundingBox())!;
    expect(box.width / box.height).toBeCloseTo(ratio, 2);
    await expect(section.locator("figure[data-pipeline]")).toHaveAttribute("data-pipeline", "poster");
    await expect(section.locator(".pipe-card ol.sr-only > li")).toHaveCount(5);
  });
}

test("pipeline: on desktop the canvas mounts when scrolled into view, with the five gate labels", async ({ page }) => {
  const errors = trackErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.waitForLoadState("load");
  const figure = page.locator("figure[data-pipeline]");
  // Not mounted while far below the fold.
  await expect(figure.locator("canvas")).toHaveCount(0);
  await figure.scrollIntoViewIfNeeded();
  await expect(figure.locator("canvas")).toHaveCount(1, { timeout: 10_000 });
  await expect(figure).toHaveAttribute("data-pipeline", "live", { timeout: 10_000 });
  for (const id of GATE_IDS) await expect(figure.locator(`[data-gate="${id}"]`)).toHaveCount(1);
  await expect(figure.locator("[data-gate]")).toHaveText([/Creative/, /AI search/, /Klaviyo/, /Connections/, /Tracking/]);
  expect(errors).toEqual([]);
});

test("only one 3D scene renders at a time", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const hero = page.locator("figure[data-diorama]");
  const pipe = page.locator("figure[data-pipeline]");
  const running = page.locator('figure[data-active="true"]');
  await expect(hero).toHaveAttribute("data-active", "true", { timeout: 5_000 });
  await expect(running).toHaveCount(1);

  await pipe.scrollIntoViewIfNeeded();
  await expect(pipe).toHaveAttribute("data-active", "true", { timeout: 10_000 });
  await expect(hero).toHaveAttribute("data-active", "false");
  await expect(running).toHaveCount(1);

  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(hero).toHaveAttribute("data-active", "true");
  await expect(pipe).toHaveAttribute("data-active", "false");
  await expect(running).toHaveCount(1);
});

// Scene robustness (piece 4). The scenes must fall back to their posters
// whenever they cannot or should not run, and never take the page down.

/** Counts WebGL draw calls on the page (both scenes, shadow pass included). */
async function countDraws(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as { __draws: number };
    w.__draws = 0;
    for (const proto of [WebGLRenderingContext.prototype, WebGL2RenderingContext.prototype]) {
      for (const name of ["drawElements", "drawArrays", "drawElementsInstanced", "drawArraysInstanced"] as const) {
        const original = (proto as unknown as Record<string, (...a: unknown[]) => unknown>)[name];
        if (!original) continue;
        (proto as unknown as Record<string, unknown>)[name] = function (this: unknown, ...args: unknown[]) {
          w.__draws++;
          return original.apply(this, args);
        };
      }
    }
  });
  return async (ms = 600) => {
    const before = await page.evaluate(() => (window as unknown as { __draws: number }).__draws);
    await page.waitForTimeout(ms);
    return (await page.evaluate(() => (window as unknown as { __draws: number }).__draws)) - before;
  };
}

/** Pretends the tab is hidden (or visible again) and fires visibilitychange. */
async function setHidden(page: Page, hidden: boolean) {
  await page.evaluate((hidden) => {
    Object.defineProperty(document, "visibilityState", { configurable: true, get: () => (hidden ? "hidden" : "visible") });
    Object.defineProperty(document, "hidden", { configurable: true, get: () => hidden });
    document.dispatchEvent(new Event("visibilitychange"));
  }, hidden);
}

test("scenes: resizing below 1024 unmounts the canvas and shows the poster; back up remounts", async ({ page }) => {
  const errors = trackErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const hero = page.locator("figure[data-diorama]");
  await expect(hero).toHaveAttribute("data-diorama", "live", { timeout: 8_000 });
  await expect(hero.locator("canvas")).toHaveCount(1);

  await page.setViewportSize({ width: 900, height: 900 });
  await expect(hero).toHaveAttribute("data-diorama", "poster");
  await expect(page.locator("canvas")).toHaveCount(0);
  const poster = hero.locator("img[data-dio-poster]");
  await expect(poster).toBeVisible();
  await expect(poster).toHaveCSS("opacity", "1");
  await expect(hero.getByRole("button", { name: "Replay" })).toHaveCount(0);

  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(hero).toHaveAttribute("data-diorama", "live", { timeout: 8_000 });
  await expect(hero.locator("canvas")).toHaveCount(1);
  expect(errors).toEqual([]);
});

test("scenes: the frame loop stops when off-screen and when the tab is hidden", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const draws = await countDraws(page);
  await page.goto("/");
  const hero = page.locator("figure[data-diorama]");
  const pipe = page.locator("figure[data-pipeline]");
  await expect(hero).toHaveAttribute("data-diorama", "live", { timeout: 8_000 });
  expect(await draws()).toBeGreaterThan(0);

  await setHidden(page, true);
  await expect(hero).toHaveAttribute("data-active", "false");
  await page.waitForTimeout(200);
  expect(await draws()).toBe(0);
  await setHidden(page, false);
  await expect(hero).toHaveAttribute("data-active", "true");
  expect(await draws()).toBeGreaterThan(0);

  // Between the two scenes (the story): nothing renders.
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.8));
  await expect(hero).toHaveAttribute("data-active", "false");
  await page.waitForTimeout(200);
  expect(await draws()).toBe(0);

  await pipe.scrollIntoViewIfNeeded();
  await expect(pipe).toHaveAttribute("data-active", "true", { timeout: 10_000 });
  expect(await draws()).toBeGreaterThan(0);

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(pipe).toHaveAttribute("data-active", "false");
  await page.waitForTimeout(200);
  expect(await draws()).toBe(0);
});

test("scenes: without WebGL both cards keep their posters, no 3D chunk, no errors", async ({ page }) => {
  const errors = trackErrors(page);
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...rest: unknown[]) {
      if (/webgl/i.test(type)) return null;
      return (original as (...a: unknown[]) => unknown).call(this, type, ...rest);
    } as typeof original;
  });
  const threeChunks: string[] = [];
  page.on("response", async (res) => {
    if (res.request().resourceType() !== "script") return;
    const body = await res.text().catch(() => "");
    if (body.includes("WebGLRenderer")) threeChunks.push(res.url());
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500);
  const hero = page.locator("figure[data-diorama]");
  const pipe = page.locator("figure[data-pipeline]");
  await expect(hero).toHaveAttribute("data-diorama", "poster");
  await expect(hero.locator("img[data-dio-poster]")).toBeVisible();
  await pipe.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  await expect(pipe).toHaveAttribute("data-pipeline", "poster");
  await expect(pipe.locator("img[data-pipe-poster]")).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(0);
  expect(threeChunks).toEqual([]);
  expect(errors).toEqual([]);
});

test("scenes: a lost WebGL context falls back to the poster and the page stays up", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const hero = page.locator("figure[data-diorama]");
  await expect(hero).toHaveAttribute("data-diorama", "live", { timeout: 8_000 });
  await page.evaluate(() => {
    const canvas = document.querySelector<HTMLCanvasElement>("[data-dio-canvas] canvas")!;
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  });
  await expect(hero).toHaveAttribute("data-diorama", "poster");
  await expect(hero.locator("canvas")).toHaveCount(0);
  await expect(hero.locator("img[data-dio-poster]")).toHaveCSS("opacity", "1");
  await expect(page.locator("h1")).toBeVisible();
});

test("scenes: reduced motion on desktop shows both posters, no canvas", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const pipe = page.locator("figure[data-pipeline]");
  await pipe.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  await expect(pipe).toHaveAttribute("data-pipeline", "poster");
  await expect(pipe.locator("img[data-pipe-poster]")).toBeVisible();
  await expect(page.locator("figure[data-diorama]")).toHaveAttribute("data-diorama", "poster");
  await expect(page.locator("canvas")).toHaveCount(0);
});

test("scenes: keyboard reaches Replay, never the floating labels; hidden lists name findings and gates", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const hero = page.locator("figure[data-diorama]");
  await expect(hero).toHaveAttribute("data-diorama", "live", { timeout: 8_000 });
  const replay = hero.getByRole("button", { name: "Replay the sample read" });
  await expect(replay).toBeVisible();

  let reached = false;
  for (let i = 0; i < 20 && !reached; i++) {
    await page.keyboard.press("Tab");
    const where = await page.evaluate(() => {
      const el = document.activeElement;
      return {
        replay: el?.getAttribute("aria-label") === "Replay the sample read",
        inLabel: !!el?.closest(".dio-finding, .pipe-label, canvas"),
      };
    });
    expect(where.inLabel).toBe(false);
    reached = where.replay;
  }
  expect(reached).toBe(true);
  await page.keyboard.press("Enter");
  await expect(hero.locator('[data-finding][data-on]')).toHaveCount(4, { timeout: 6_000 });

  // Floating labels are decorative; the hidden lists carry the content.
  await expect(hero.locator(".dio-finding[aria-hidden='true']")).toHaveCount(4);
  await expect(hero.locator("ul.sr-only > li")).toHaveCount(4);
  const pipe = page.locator("figure[data-pipeline]");
  await pipe.scrollIntoViewIfNeeded();
  await expect(pipe).toHaveAttribute("data-pipeline", "live", { timeout: 10_000 });
  await expect(pipe.locator(".pipe-label[aria-hidden='true']")).toHaveCount(5);
  await expect(pipe.locator("ol.sr-only > li")).toHaveCount(5);
  expect(await page.locator(".dio-finding, .pipe-label").evaluateAll((els) =>
    els.flatMap((el) => [...el.querySelectorAll("a, button, input, [tabindex]")]).length,
  )).toBe(0);
});
