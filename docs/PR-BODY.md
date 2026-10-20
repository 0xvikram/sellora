# Sellora: the 3D, motion-led direction (Bone & Lime)

Replaces the quiet editorial build (Linen & Moss, Newsreader) with the
direction the client chose: a 3D-led, motion-driven site in the register
of squared-media.nl and lusion.co, kept professional. Four pieces:
foundation, hero diorama, pipeline, final QA.

## What changed

- **Theme and type.** Bone & Lime: bone ground, near-black green ink,
  lime as a fill only (text on lime is always ink), lime-ink for lime
  text, sage and ink as secondary grounds. Archivo condensed uppercase
  for headings, with one accent word per heading in Archivo's own italic
  (one static 41 KB cut, preloaded); Instrument Sans body; Geist Mono
  labels. No grain.
- **Ground shift and pill nav.** One fixed ground behind the home page
  eases between bone, sage and ink as sections take over; text tokens
  follow it. A floating pill nav takes the tint of the section beneath it.
- **Hero diorama.** A real-time three.js / React Three Fiber scene, built
  in code (no models, no textures): a miniature store on a slab, read by
  a lime light that sweeps across it while four findings rise in. Replay
  button, pointer and scroll parallax.
- **Pipeline.** A new "Five jobs" section on sage: orders loop along a
  conveyor through five gates (Creative, AI search, Klaviyo, Connections,
  Tracking), each flaring lime and tagging the item. Instanced, about 34
  draw calls; the camera dollies with scroll, no pinning.
- **One scene at a time.** Only one canvas runs its frame loop; both
  pause off-screen and in hidden tabs.
- **Home sections re-skinned**: story (pinned, 350vh), teardown cards,
  the report on ink, receipt (white, ink border, lime "None"), studio,
  proof row, FAQ, ink closing footer with the wordmark.
- **Inner pages** (`/prices`, `/about`, `/contact`, `/teardowns`, each
  teardown, 404) brought into the same register: bone ground, white 8px
  panels, condensed headings with an accent word, lime buttons.
- **Robustness fix**: a renderer failure (context creation failing after
  the WebGL probe passed, or a lost GPU context) used to take the whole
  page down; `SceneBoundary` now returns the card to its poster.

## Fallbacks

Server HTML for both scenes is a poster image. The canvas mounts only on
desktop with a mouse, width >= 1024, motion allowed and WebGL, after the
load event (hero) or near the viewport (pipeline). Phones, tablets,
reduced motion, no WebGL, no JavaScript, resizing below 1024 and renderer
failure all show the poster. Floating labels are `aria-hidden`; hidden
lists carry the findings and gates.

## Verified (2026-10-20, `next build` + `next start`, M5 MacBook Air)

- Lighthouse 12.8.2, performance (accessibility, best practices and SEO
  100 on every run, CLS 0):

  | Route | Desktop | Mobile |
  | --- | --- | --- |
  | `/` | 100 (LCP 0.8 s) | 90 (LCP 3.7 s, the H1) |
  | `/prices` | 100 (0.6 s) | 95 (3.0 s) |
  | `/teardowns/sample-supplements-us` | 100 (0.6 s) | 94 (3.1 s) |

- Initial JS about 160 KB gzip on every route. The three.js chunk (270 KB
  gzip) never loads at 390 px and loads after the load event on desktop.
  Posters 45 to 115 KB.
- Both scenes at 60 fps at DPR 1 and 2 (headless Chromium on ANGLE Metal,
  1440 x 900); zero WebGL draw calls when off-screen or hidden.
- WCAG AA text contrast on every route at 1440 and 390 (DOM check, 0
  failures).
- `npm run lint`, `npm run build`, `npm test` (33 Playwright tests:
  every route at 390, posters, live mounts, one-scene-at-a-time, nav
  tint, resize, no WebGL, lost context, reduced motion, keyboard) clean.

## Placeholders still in `src/lib/site.ts`

- `SITE_URL` (`https://sellora.example`): the domain is not bought.
- `CONTACT_EMAIL` (`hello@sellora.example`): dummy inbox.
- `BOOKING_URL` is `#contact`: needs the real booking link.
- `PROOF`: Shopify Partner and Klaviyo Partner are `status: "placeholder"`.
- `TEARDOWNS`: all three are samples (`sample: true`), not client results.
- The "Two rounds of changes" term on `/prices` is marked placeholder.

## Not verified

- Real phones and Safari / Firefox: all checks ran in Chromium (desktop
  and mobile emulation); the live scenes were not tried on a discrete or
  low-end GPU, nor on Windows.
- Lighthouse numbers are local and simulated; not re-measured on the
  Vercel preview.
- Screen readers: checked through the accessibility tree and keyboard,
  not with VoiceOver or NVDA.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
