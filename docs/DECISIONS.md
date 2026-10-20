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
