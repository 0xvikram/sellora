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
