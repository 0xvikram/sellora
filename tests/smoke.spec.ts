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

test("reduced motion shows the crawl preview end state", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const preview = page.locator("figure.pv");
  await expect(preview.locator('[data-status="done"]')).toHaveCSS("opacity", "1");
  await expect(preview.locator('[data-status="connecting"]')).toHaveCSS("opacity", "0");
  for (const value of await preview.locator('[data-pv="value"]').all()) {
    await expect(value).toHaveCSS("opacity", "1");
  }
  for (const chip of await preview.locator('[data-pv="chip"]').all()) {
    await expect(chip).toHaveCSS("opacity", "1");
  }
  await expect(preview.locator('[data-pv="row"]').first()).toHaveCSS("clip-path", "none");
  await expect(preview.getByRole("button", { name: "Replay" })).toHaveCount(0);
});
