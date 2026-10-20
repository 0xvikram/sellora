# Decisions

Short, dated entries. Newest last.

## 2026-10-17: Theme "Linen & Moss"

A deeper warm linen ground, ink type and one deep-teal accent, with moss,
sand and clay only as illustrative fills, and one dark closing section.
Chosen from four light-ground directions (Ivory & Clay, Bone & Acid,
Mercury & Signal, Linen & Moss). Reasons: it reads calm and operational
rather than "AI startup"; it is the furthest from the old cream site while
staying warm; and every text token passes 4.5:1 on all three light grounds
(ratios in `globals.css`). Risk noted at the time: it had the thinnest
live-site precedent of the four.

## 2026-10-17: Newsreader, Instrument Sans and Geist Mono

Newsreader for display: a text-first serif with a real optical-size axis
and a true italic, so a large H1 with one italic word looks considered.
Instrument Sans for body: a quiet grotesk with good small-size spacing.
Geist Mono for eyebrows, prices and labels, where tabular figures matter.

Instrument Serif was rejected as the display face. In 2026 it is the most
recognisable free "AI-built site" cliché (named as such by several
commentators and by the "every website 2026" satire), and Instrument Serif
+ Instrument Sans is the exact template pairing. Didones (Playfair, Bodoni
Moda) were rejected for reading fashion and luxury.

Phase 5 (performance): the italic is only ever the accent word, so the full
variable italic (147 KB) was replaced by one static cut, weight 400 with
the optical size pinned at 48 (25 KB, self-hosted). The roman keeps its
variable optical size (132 KB). Pinning the roman's optical size too would
save about 75 KB (mobile Lighthouse LCP 3.3 s to 2.9 s, simulated) at the
cost of optical sizing across headings; not done.

## 2026-10-17: The site is the audit

The hero is a single field, "Your store address", that opens the real audit
workspace (`DEMO_START_URL?url=...`) in a new tab, beside a scripted
preview of a store being read, with every result labelled Measured,
Generated or Sample. The pitch is to show the work on the visitor's own
store instead of describing it. The form is a plain GET form, so it works
without JavaScript.

## 2026-10-17: Registry components removed

The earlier build used Magic UI, Aceternity and React Bits components, a
three.js hero, Lenis smooth scroll, a custom cursor and pinned scroll
scenes. All were removed (about 4,500 lines). They made the site look like
many other template sites, cost bundle size and main-thread time, and
fought with reduced motion and native scrolling. Motion is now one
signature (the scan line) plus a reveal-once fade.

## 2026-10-17: GSAP kept for the one timeline

The crawl preview is a sequenced timeline (status changes, an eased scan
line, labels timed to the line's position, a counter, staggered rows,
value swaps) with a Replay button. GSAP core expresses that clearly and
handles restart, so it stays. Everything else moved off it: ScrollTrigger
and `@gsap/react` were removed, the reveals use IntersectionObserver and
the Web Animations API, and GSAP itself is dynamically imported after first
paint on the home page only (70 KB raw, 27 KB gzip, off the critical path).

## 2026-10-17: Story section, ScrollTrigger back for one section only

"What changes" (between the hero and Work) applies the five services to the
sample store as five drawn figures, each with one headline number. On lg
and up with motion allowed it is a 600vh track with a CSS `position:
sticky` stage, and one GSAP timeline scrubbed by ScrollTrigger (scrub 0.6,
no snap). ScrollTrigger is used only to map scroll to the timeline, not to
pin: sticky keeps the layout stable from first paint (no pin-spacer, no
layout shift when the script arrives) and the page always scrolls natively.
GSAP and ScrollTrigger are dynamically imported only when that layout
applies, so phones never download them. Below lg, with reduced motion, and
without JavaScript, the five steps are stacked with figures in their final
state. The old three-step "How it works" strip became the section's intro
line, and the later section numbers moved up by one (Work is now 02).

## 2026-10-17: Story track shortened to 3.5 screens

The pinned story's track went from 600vh (5 screens of scroll) to 450vh
(3.5 screens, 0.7 per service). Five full screens read as a long hold for
five figures. The stage now carries the section eyebrow and H2 at the top
of its left column (the stacked header is hidden in that layout, so the
section is never headless while pinned) and its content is centred under
the nav, which removes the empty band above it. The "how it works" line is
left out of the stage for height; it stays in the stacked layout. Each
before -> after number (1 -> 4, 21% -> 31%, 54% -> 96%) now counts its
after value up from the before value inside its slide's window, so the
change reads as an event. The tracking step's headline became "54% ->
96%" (it was "96%") to match.

## 2026-10-17: The report section, the page's one dark moment

"The read, delivered" sits between Work and Prices on the closing
section's dark ground (#1a1c1b, above the grain). It shows what the audit
hands over: a sample one-page report on card paper, A4 proportions, turned
-1deg on a second sheet, with six labelled figures, a before/after bar row
and the line "Every figure links to the query that produced it", beside
three statements that define Measured, Generated and Sample, and the audit
form once more. Reasons: the lower half of the page was flat light
sections in a row; a dark band in the middle gives the page one dramatic
moment without a second animation library, and it makes the labelling
promise concrete. Motion is one entrance (rise and settle, figures count
up), once, static with reduced motion. It became section 03, so Prices,
Studio and FAQ moved to 04 to 06.

## 2026-10-20: Direction change to a 3D-led, motion-driven register (piece 1: foundation)

The client rejected the quiet editorial build (Linen & Moss, Newsreader)
and chose the register of squared-media.nl, lusion.co and iventions.com
on the palette of charle.co.uk, kept professional (no mascots, no jokes).
This supersedes the 2026-10-17 theme and type entries above. Piece 1 is
the foundation; the 3D scenes come in pieces 2 and 3, so the hero keeps
its drawn crawl preview for now (chrome moved to the new tokens).

- **Palette "Bone & Lime"**: bone ground `#f3f5ee`, ground-2 `#e8ebe0`,
  white cards, ink `#0a140f` (ink-2 `#2b352f`, ink-3 `#5a665e`), lime
  `#d3f502` as a fill only (text on lime is always ink, 15.03:1),
  lime-ink `#3f5a00` for lime-coloured text, sage `#b7c3a7` as the one
  secondary ground (Work), clay `#ff5a2c` as a fill-only warning colour,
  and ink as the dark ground (report and close). On sage, ink-3 and
  lime-ink fail (3.25 and 4.26), so the sage scope swaps them for
  `#3f4a43` (5.01) and `#2f4400` (5.84). Ratios are in `globals.css`.
- **No grain.** The new register is clean, not papery. Radius: pills for
  buttons and nav, 8px panels and cards, 12px browser frame; one ambient
  shadow token (`--shadow-float`).
- **Type**: Archivo (variable wght + wdth) for display, set condensed
  (`font-stretch: 70%`), 600, uppercase, line-height 0.92; H3 normal
  width. Instrument Sans body and Geist Mono labels stay.
- **Accent word**: Archivo's own italic, not Instrument Sans italic. Both
  were rendered on the hero. The Archivo italic keeps the word condensed
  and uppercase, so the headline stays one block in one family (the look
  of the reference sites); the Instrument Sans lowercase italic reads as
  the editorial "one italic word" trope the client had just rejected.
  Archivo does ship a real italic on Google Fonts (the brief assumed it
  did not), so no synthetic slant is needed. It is one static cut (600,
  wdth 70, latin, 41 KB) self-hosted and preloaded, because the accent
  word is in the H1 (the LCP element); the variable italic was 100 KB and
  pushed mobile LCP render delay out.
- **Floating pill nav** that takes the tint of the section beneath it
  (bone, sage, or ink at 70% with bone text).
- **Scroll-driven ground** (`GroundShift.tsx`): one fixed layer behind the
  home page eases to the ground of the section covering more than half
  the viewport (600 ms, instant with reduced motion). Sections are
  transparent while it runs. The text tokens of `<main>` follow the
  current ground too and cross-fade with it (registered custom
  properties), so the edge of the neighbouring section never shows ink on
  ink. Without JavaScript each section paints its own ground.
- **Receipt**: now a white panel with an ink border and a lime "None"
  pill; the perforated and torn mask edges, the 1deg turn and the "thank
  you, come again" line were removed as papery and jokey for the new
  register.
- The drawn sample store (Oatleaf) keeps its own product palette
  (`--store-*`), as the illustration of a different brand; site chrome
  around it uses the new tokens.

## 2026-10-20: Piece 2, the hero diorama

The drawn storefront panel (`Preview.tsx`, `preview/Storefront.tsx`, about
1,200 lines with its CSS) is replaced by a real-time 3D diorama, "a
miniature store being read", in a rounded card on a bone -> peach -> sage
gradient, after squared-media.nl's hero. The one signature motion moves
into the scene: a lime light plane sweeps from a scanner gate across the
slab and four findings rise in as it passes. Reasons and choices:

- **Code only.** three.js 0.186.1, `@react-three/fiber` 9.8.1,
  `@react-three/drei` 10.7.9 (pinned, each at least two weeks old). Every
  part is a box or a rounded box; no models, textures, HDR files or
  generated images. The environment is drei `Lightformer`s, not a preset
  (presets fetch an HDR from a CDN).
- **Poster first.** The server HTML is a rendered still of the scene's
  end state, so phones, tablets, reduced motion, no-WebGL and no-JS
  visitors get the same picture, and the LCP is an image that never
  shifts. The posters are generated from the live scene
  (`npm run posters`, `?diorama=still` / `still-m`), not drawn
  separately, so they cannot drift from it. The small one is a 4:3
  framing with shorter leaders and smaller pills, not a crop.
- **The live scene only where it runs well**: after `load` plus idle,
  `pointer: fine`, width >= 1024, motion allowed, WebGL. Lazy chunk
  (about 1 MB raw, 274 KB gzip: three, fiber, drei) via `next/dynamic`.
  DPR <= 1.5, PerformanceMonitor drops to DPR 1 and no shadows, the frame
  loop pauses off-screen and in hidden tabs.
- **Geometry is shared.** drei's `RoundedBox` builds an extruded rounded
  rectangle per mesh; with about 60 blocks that was a 161 ms main-thread
  task on mount and 440 ms of Lighthouse TBT. Blocks now share three's
  `RoundedBoxGeometry` per size and radius: 55 ms, TBT 0.
- **Shadows** are PCF (`shadows="percentage"`): three r186 removed
  PCFSoftShadowMap and warns if asked for it. Tone mapping is Neutral so
  the lime and the product tints are not desaturated by ACES.
- **Findings** are drei `Html`, mounted one frame after the canvas: in
  the first commit the first `Html` lost its content when fiber connected
  its event target (React 19 defers the old root's unmount until after
  the new root renders). Each finding sits above or below its part on a
  leader and can run off to one side, so the four never collide. They are
  `aria-hidden`; the card carries the same four as a visually hidden list.
- **Timeline**: the light leaves 0.35 s after the first frame and crosses
  in 2.4 s, so the findings are all in by about 2.8 s after the canvas
  appears (about 2.5 to 3 s after navigation on this machine). The
  brief's "mid-sweep at 4 s" assumed a later start; it was not slowed
  down to match.
- The chip shows local time (client only) and "Reading <domain>" from the
  hero form. The old Measured / Generated / Sample results column left
  with the drawn preview; the report section still defines the three
  labels.
- The crawl preview's GSAP timeline went with it; GSAP stays for the
  story and report sections. ProductArt keeps only `AdShot`, which the
  story figures use.
- Measured on 2026-10-20 (M5 MacBook Air, `next start`): Lighthouse
  12.8.2 desktop 100 / 100 / 100 / 100 (TBT 0-10 ms, LCP 0.8 s, the
  poster) and mobile 91 / 100 / 100 / 100 (LCP 3.5 s, the H1, as before
  this piece). 60 fps in headless Chromium on ANGLE Metal at DPR 1 and 2
  (rAF-capped); SwiftShader gives 15 to 24 fps and trips the
  PerformanceMonitor down to DPR 1.

## 2026-10-20: Piece 3, framing pass and the pipeline scene

**Hero framing and materials.** The slab sat in the middle of the card
with empty bands above and below. The camera now comes in (0.8 of a full
fit), rises to 46 deg and aims well above the slab, so the slab fills the
card's width and its near corner runs off the bottom edge, after
squared-media.nl's island; the empty band above is the gradient. The
small (4:3) poster gets its own, gentler framing so its findings stay in
the card. The card gradient is now a real sunrise: bone, a peach band,
sage, with a warm radial glow behind the slab. The peach is
`color-mix(in srgb, color-mix(in srgb, clay 24%, bone) 92%, lime)`, about
#f3d3b0: clay and bone alone mix to a pink (#f6d3c3), so a touch of lime
warms it toward the asked-for #f6d5b8 without a new hex. Bevels (r 0.03
to 0.045, clamped by part thickness: shelf sides and top were thickened
to take them), roughness 0.55 to 0.8 per part, a lime hairline on the gate
beam, a rim light from behind, a larger and softer contact shadow. Craft
details: an ink sign plate with "48" in raised seven-segment strokes (one
merged geometry, so one draw call), tape both ways on the parcels, a door
mat, a second product and a folded bag on the counter. GL draw calls per
frame (counted by wrapping the WebGL draw functions, shadow pass
included, the same total renderer.info reports): 123 before, 126 after;
new small parts cast no shadows.

**The pipeline**, a new sage section between the story and the
teardowns: "Five jobs" / "Every order passes five gates." Choices:

- **No pinning.** The camera dolly is tied to how far the card has
  crossed the viewport, damped, while the page scrolls natively; the
  story above is the one pinned sequence on the page.
- **Deterministic.** Item positions come from one clock; tags, gate heat,
  label markers and the lime sheets are all functions of those
  positions, so there is no per-item state to drift, a pause resumes
  cleanly and the poster still is exact.
- **Instanced.** Legs, braces, feet, slats, items, both tapes, tags,
  posts, beams, strips and hairlines are instanced meshes; the five scan
  sheets are separate (per-gate opacity) and drawn only while they glow.
  About 34 GL draw calls per frame with shadows. Parcels on the belt use a
  yellower sand (`parcelSand`) because the diorama's parcel tint read pink
  on the sage card.
- **One scene at a time.** `three/active.ts`: each scene asks to run
  while it is mounted, on screen and the tab is visible; the most recent
  ask wins and the other's frame loop pauses. Both figures expose
  `data-active`.
- **Gate labels** are drei `Html` pills (the hero's findings' style, with
  a 01 to 05 index), mounted after the first frame for the same reason as
  the findings. A visually hidden list in the card names the five gates.
- **Posters**: 16:7 at 1.5x (2112 x 924, 115 KB) rather than 2x, since it
  is a lazy, below-the-fold image; 4:3 at 2x below lg. The 4:3 camera
  swings round to 62 deg and up to 30 deg so all five gates fit.
- **The section has no number** (the brief gives the eyebrow as "Five
  jobs"), so Work stays 02 and the rest keep their numbers.

**Home rhythm.** The story track goes from 450vh to 350vh (half a screen
of scroll per service) so two scroll-driven sequences do not run back to
back at full length, and the pipeline section's top padding drops to 2rem
on lg, since the sticky story stage already ends in a band of empty
ground. Report stays on ink, Prices on bone.

Measured on 2026-10-20 (M5 MacBook Air, `next start`, headless Chromium on
ANGLE Metal, 1440 x 900): hero 60 fps and pipeline 60 fps at DPR 1 and 2
(rAF-capped, p95 frame 16.8 ms). Lighthouse 12.8.2: desktop 100 / 100 /
100 / 100 on two runs (TBT 10 ms, LCP 0.8 s); the first run after a server
start gave 95 / 96 (TBT 180 ms, and a finding sampled mid fade-in failed
contrast). Mobile 90 / 100 / 100 / 100 (LCP 3.7 s, the H1, as before).

## 2026-10-20: Piece 4, final QA

**Inner pages.** `/prices`, `/about`, `/contact`, `/teardowns`, each
teardown and the 404 now follow the home page's register instead of the
light re-skin from piece 1: every section sits on bone (the ground-2 and
white full-width bands are gone, so the nav pill always reads bone on
bone until the ink footer), content lives in white 8px panels (`.panel`,
which also restores the light tokens), every H1 and H2 is Archivo
condensed uppercase with one lime-ink accent word, eyebrows are mono, and
the page head and sections use the home page's padding (`.page-head`,
`.page-section`). Teardown H1s (and the index rows and the next-teardown
link) accent their first figure ("+18%", "4", "94%") through
`MetricAccent`, so the number is the accent, which fits "numbers first".
Prices: receipt beside a white "range" panel, ladder rows as panels with
condensed titles and lime-ink prices, terms as a definition list in a
panel. Contact: the audit form large in its own panel with the next
steps, email with Copy and the booking button in a second panel, hours
(overlap, reply, location) in a third. 404: lime and ghost buttons. DOM
contrast check (every visible text node against its composited
background) on all routes at 1440 and 390: 1,431 nodes, 0 failures; the
nav pill's colour-mixed background and the diorama chip's gradient are
not machine-checked (bone 80% on bone, and the chip is a white panel).

**Scene robustness.** Checked: resizing a live page from 1440 to 900
unmounts both canvases and restores the posters (opacity 1, the 4:3
poster), and back to 1440 remounts the hero at once and the pipeline when
it is next near the viewport; WebGL draw calls drop to zero while a scene
is off-screen, between the two scenes and in a hidden tab, and resume
after; with WebGL blocked both cards keep their posters, the 3D chunk is
never fetched and nothing is logged; reduced motion on desktop shows both
posters; the floating labels are `aria-hidden` and hold nothing
focusable, the hidden lists name the four findings and five gates, and
Tab reaches Replay; 30 s idle on each live scene with four replays logs
no errors (one warning per canvas, `THREE.Clock` deprecated, comes from
`@react-three/fiber` 9.8.1 itself).

One real bug found and fixed: if WebGL context creation failed after the
`live-gate` probe had passed (simulated by refusing the second
`getContext`), three.js threw inside the canvas and React took down the
whole page to the Next error screen. `three/SceneBoundary.tsx` now wraps
each canvas in an error boundary and a capture-phase `webglcontextlost`
listener: on either, the card returns to its poster for the rest of the
visit. Losses on purpose (R3F forces one when it disposes an unmounted
canvas) are ignored because that canvas is no longer connected. Replay's
accessible name is now "Replay the sample read". Not changed: once GSAP
and ScrollTrigger have loaded (desktop home only), their tickers keep
about 120 `requestAnimationFrame` calls a second running even when
nothing moves; cheap, but it is not the 3D loop, which does stop.

**Performance** (Lighthouse 12.8.2, `next start`, M5 MacBook Air,
default simulated throttling):

| Route | Desktop perf | Desktop LCP | Mobile perf | Mobile LCP (element) |
| --- | --- | --- | --- | --- |
| `/` | 100 | 0.8 s (poster) | 90 | 3.7 s (H1) |
| `/prices` | 100 | 0.6 s | 95 | 3.0 s (H1) |
| `/teardowns/sample-supplements-us` | 100 | 0.6 s | 94 | 3.1 s (H1) |

Accessibility, best practices and SEO are 100 on all six runs; CLS 0,
TBT 0 to 10 ms. `font-display: optional` for the Archivo roman and the
static italic was tried because the home H1 is the mobile LCP at 3.7 s:
no change on any route (Lighthouse's simulation still counts the
preloaded fonts in the H1's render delay), and on a slow first visit it
would show the headings in a fallback that is not condensed, so `swap`
stays. The remaining mobile cost is bytes before the H1 can paint: the
variable Archivo roman (90 KB), the italic (41 KB), Instrument Sans and
Geist Mono, and on the home page the 45 KB poster at high priority.

The three.js chunk (one file, 270 KB gzip, 1,000 KB raw) is never
requested at 390 (checked on every route with a full scroll of the home
page) and on desktop it is requested after the load event (+94 ms).
Initial JS, the scripts in the HTML, gzip: about 160 KB on every route
(159.6 home, prices and about; 160.6 teardowns and a teardown; 161.2
contact), nearly all of it Next and React. Posters: hero 91 KB (1120 x
1400), hero mobile 45 KB (780 x 586), pipeline 115 KB (2112 x 926),
pipeline mobile 46 KB (780 x 588).
