# Sellora

The marketing site for Sellora, a small studio that sells AI and automation
work to e-commerce and D2C brands at fixed prices. The site is the first
step of the sale: the hero asks for a store address and opens the audit
workspace (the Oatleaf demo) with it, beside a scripted preview of what
that read looks like.

Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS 4, TypeScript.
Every page is static.

## Routes

| Route | What it is |
| --- | --- |
| `/` | Hero with the audit form and the crawl preview; 01 What changes (five services on the sample store, pinned scroll story on desktop); 02 Work (teardown cards); 03 The read, delivered (ink ground, a sample audit report sheet and the form again); 04 Prices (receipt); 05 Studio (pull-quote); proof row; 06 FAQ |
| `/teardowns` | Index of teardowns, numbers first |
| `/teardowns/[slug]` | One teardown: spec strip, before/after figures, method. Unknown slugs 404 |
| `/prices` | Receipt, price ladder, terms |
| `/about` | Studio: how we work, tools, 30-day timeline, what we do not do |
| `/contact` | Audit form, next steps, email with a Copy button, hours |
| `/opengraph-image`, `/icon.svg`, `/robots.txt`, `/sitemap.xml` | Generated metadata |

Every page ends with the ink closing section (`Close.tsx`), which is also
the footer and ends on a large, faint condensed "SELLORA" wordmark. On the
home page the report (`Report.tsx`) is on the ink ground too, and Work on
sage; the ground shifts as you scroll (see below).

## Where the copy lives

Almost all copy is in `src/lib/site.ts`: name, URLs, nav, services and
prices, the ladder, studio facts, tools, the "we do not do" list, proof
badges, teardowns and FAQs. Page-specific lines (headings, the terms list)
sit in the page files under `src/app/`.

### Placeholders to replace before launch

- **Name and domain**: `SITE_NAME` and `SITE_URL` (`https://sellora.example`) in `site.ts`. The domain is not bought yet.
- **Email**: `CONTACT_EMAIL` (`hello@sellora.example`) is a dummy inbox.
- **Booking link**: `BOOKING_URL` is `#contact`; replace with the real Cal.com (or similar) link.
- **Partner badges**: `PROOF` lists Shopify Partner and Klaviyo Partner with `status: "placeholder"`. Do not mark one `verified` until the partnership is real.
- **Teardowns are samples**: every entry in `TEARDOWNS` has `sample: true` and a "Sample:" store name. They show the format, not client results. Replace them with real teardowns (and set `sample: false`) as they exist.
- **Revisions line**: the "Two rounds of changes" term on `/prices` (`src/app/prices/page.tsx`) is marked `(placeholder)` until the founders confirm it.

`DEMO_START_URL` is real: the Oatleaf demo workspace, which accepts
`?url=<store>`.

## Design tokens and fonts

Theme **Bone & Lime** (since 2026-10-20), defined in `src/app/globals.css`
(`@theme`): bone ground `#f3f5ee`, ground-2 `#e8ebe0`, card `#ffffff`, ink
`#0a140f` with ink-2 `#2b352f` and ink-3 `#5a665e`, lines as ink at 12% /
22% (controls 50%), lime `#d3f502` (fill only; text on lime is always
ink), lime-ink `#3f5a00` for lime-coloured text, sage `#b7c3a7` (the Work
section's ground), clay `#ff5a2c` (fill-only warning / illustration), and
ink as the dark ground. `--color-bone` and `--color-dark` are fixed
copies that never remap. Radius: `--radius-pill` 999px, `--radius-panel`
8px, `--radius-frame` 12px. One shadow: `--shadow-float`. No grain.
Contrast ratios are listed at the top of `globals.css`; hex copies for the
OG image live in `src/lib/tokens.ts` (keep the two in sync).

Token scopes: on sage, ink-3 and lime-ink swap to darker values; on ink,
the text tokens map to bone (75% and 60% for ink-2 and ink-3) and
lime-ink becomes lime. White panels inside a dark scope use `.surface`
(also `.pv`, `.sfig`) to get the light tokens back. The drawn sample
store keeps its own product palette (`--store-*`).

Grounds: every home section sets `data-ground="bone" | "sage" | "ink"`.
`GroundShift.tsx` paints one fixed layer behind the page with the ground
of the section covering more than half the viewport (600 ms, instant
with reduced motion) and sets `html[data-ground-current]`, which the text
tokens of `<main>` follow. Without JavaScript each section paints its own
ground. The nav pill (`Nav.tsx`) reads the section under it and tints to
match.

Fonts, all via `next/font` (self-hosted, `display: swap`):

- **Archivo** roman, variable weight and width (`wdth` 62-125): headings,
  set condensed (`font-stretch: 70%`), 600, uppercase, line-height 0.92;
  H3 at normal width. `--font-display`.
- **Archivo italic**, one static cut (600, wdth 70, latin, 41 KB),
  self-hosted from `src/app/fonts/` and preloaded: the one accent word per
  heading (`.accent-word`, lime-ink). `--font-archivo-italic`.
- **Instrument Sans**, variable weight, roman only: body (17px, 18px from
  lg).
- **Geist Mono**: eyebrows (12px, uppercase, 0.14em), prices, the
  receipt, preview labels.

The OG image uses static Archivo TTFs in `src/app/og-fonts/` (OFL).

## Motion rules

- **Ground shift**: the home page ground eases between bone, sage and ink
  as sections take over the viewport (`GroundShift.tsx`, 600 ms); the nav
  pill tints to the section under it. Instant with reduced motion.
- **One signature motion**: the scan line. It runs once in the hero crawl
  preview (`Preview.tsx`, a GSAP timeline) and once per hover on teardown
  cards (CSS only, fine pointers only).
- **Story** (`Story.tsx`, `story/timeline.ts`): on lg and up with motion
  allowed, a 450vh track (3.5 screens of scroll) with a sticky stage that
  carries the section heading; one GSAP timeline scrubbed by ScrollTrigger
  (no pin, no snap). Before -> after numbers count inside each slide's
  window. Phones, tablets and reduced motion get the stacked layout.
- **Report** (`Report.tsx`): once in view, the sheet rises 24px and settles
  to -1deg (0.8 s) and its six figures count up (0.9 s, 80 ms apart).
  IntersectionObserver, Web Animations and requestAnimationFrame; static
  with reduced motion.
- **Reveal once**: section headings and the closing block fade up 8px the
  first time they enter the viewport (`Reveal.tsx`, IntersectionObserver +
  Web Animations). The hero text column has a short load stagger
  (`HeroIntro.tsx`); the H1 never animates.
- **Reduced motion**: with `prefers-reduced-motion: reduce` nothing moves.
  The preview shows its finished state (CSS default), reveals are skipped,
  and hover transforms are off. Without JavaScript the preview also shows
  its finished state.
- GSAP core is the only animation library. It is loaded with a dynamic
  import after first paint, only on the home page.

## Commands

```bash
npm install
npm run build                 # production build
npx next start -p 3457        # serve the build on http://localhost:3457
npm test                      # Playwright smoke tests (starts next start on 3457 if nothing is running there)
npm run lint                  # ESLint
```

First test run on a machine: `npx playwright install chromium` (project
local, nothing global).

**Never run `next dev` (or `npm run dev`) on this machine.** Use
`npm run build` and `next start -p 3457` to look at the site.

## Deploy

Hosted on Vercel from the GitHub repo `0xvikram/sellora`. `main` is
production; `dev` is the working branch. Nothing is pushed to `main`
directly.

Decisions and their reasons are logged in `docs/DECISIONS.md`.
