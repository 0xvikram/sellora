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
| `/` | Hero with the audit form and the crawl preview; 01 What changes (five services on the sample store, pinned scroll story on desktop); 02 Work (teardown cards); 03 The read, delivered (dark section with a sample audit report sheet and the form again); 04 Prices (receipt on a desk); 05 Studio (pull-quote); proof row; 06 FAQ |
| `/teardowns` | Index of teardowns, numbers first |
| `/teardowns/[slug]` | One teardown: spec strip, before/after figures, method. Unknown slugs 404 |
| `/prices` | Receipt, price ladder, terms |
| `/about` | Studio: how we work, tools, 30-day timeline, what we do not do |
| `/contact` | Audit form, next steps, email with a Copy button, hours |
| `/opengraph-image`, `/icon.svg`, `/robots.txt`, `/sitemap.xml` | Generated metadata |

Every page ends with the dark closing section (`Close.tsx`), which is also
the footer and ends on a large, faint "Sellora" wordmark. The home page has
one more dark section, the report (`Report.tsx`), between Work and Prices.

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

Theme **Linen & Moss**, defined in `src/app/globals.css` (`@theme`):
linen ground `#f2ede4`, ground-2 `#e7e0d3`, card `#faf7f1`, ink `#1c1a16`
(with ink-2 and ink-3), one deep-teal accent `#1f5c63` with accent-soft,
moss, sand and clay as illustrative fills, and a tinted near-black
`#1a1c1b` for the closing section. Contrast ratios are listed at the top of
`globals.css`; hex copies for the OG image live in `src/lib/tokens.ts`
(keep the two in sync). A static 5% grain layer sits over the light page;
the two dark sections sit above it.

Fonts, all via `next/font` (self-hosted, `display: swap`, fallback metrics
set so the swap does not shift layout):

- **Newsreader** roman, variable weight and optical size: headings.
- **Newsreader italic**, one static cut (400, opsz 48, latin), self-hosted
  from `src/app/fonts/`: the one accent word per heading (`.accent-word`,
  `--font-display-italic`).
- **Instrument Sans**, variable weight, roman only: body.
- **Geist Mono**: eyebrows, prices, the receipt, preview labels.

The OG image uses its own static TTFs in `src/app/og-fonts/`.

## Motion rules

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
