"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useSyncExternalStore } from "react";
import { usePreviewDomain } from "@/lib/preview-domain";
import { useHydratedReducedMotion } from "@/lib/use-hydrated-reduced-motion";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, useGSAP);

// The scripted crawl preview in the hero: a code-drawn storefront mock
// (blocks only, nothing readable), the labels a read of the store produces,
// and three result rows. Everything is local and scripted: no network, no
// real crawl. Every line is sample data for oatleaf.example.
//
// Server HTML is in the start state (.pv-anim, see globals.css). With
// reduced motion, or without JavaScript, CSS shows the final state and no
// timeline is built.
//
// Timeline (seconds), played once when the panel enters the viewport:
//   0.00  status "connecting"
//   0.60  status "reading"; scan line sweeps the body, 2.2 s, power2.inOut
//         labels appear as the line reaches each region (0.3 s fade, 6px)
//         the product counter runs 0 -> 48 while the line crosses the grid
//   2.80  status "measuring"; scan line fades (0.3 s)
//   3.00  result rows clip in from the left, 0.5 s each, 90 ms stagger
//   3.90  values resolve, 0.6 s apart: placeholder fades and scales to 0.96,
//         value fades in and rises 6px (0.35 s, ease-out)
//   5.60  status "done"; footer note fades in (0.4 s). Ends ~6.0, holds.

const SCAN_START = 0.6;
const SCAN_DUR = 2.2;
const SCAN_END = SCAN_START + SCAN_DUR;
const ROWS_AT = SCAN_END + 0.2;
const RESOLVE_AT = ROWS_AT + 0.9;
const RESOLVE_GAP = 0.6;
const DONE_AT = RESOLVE_AT + 2 * RESOLVE_GAP + 0.5;
const STATUSES = ["connecting", "reading", "measuring", "done"] as const;

/** Inverse of power2.inOut: the eased progress y -> linear time fraction. */
function invInOut(y: number) {
  const c = Math.min(1, Math.max(0, y));
  return c < 0.5 ? Math.sqrt(c / 2) : 1 - Math.sqrt((1 - c) / 2);
}

const noopSubscribe = () => () => {};

export const SAMPLE_DOMAIN = "oatleaf.example";

type Kind = "Measured" | "Generated" | "Sample";

const MARKER: Record<Kind, string> = {
  Measured: "bg-accent",
  Generated: "bg-moss",
  Sample: "bg-sand",
};

const RESULTS: { label: string; value: string; kind: Kind }[] = [
  { label: "Repeat rate", value: "31%", kind: "Measured" },
  { label: "AI assistants citing the store", value: "1 of 10", kind: "Generated" },
  { label: "Pixel to order match", value: "54%", kind: "Measured" },
];

function Marker({ kind }: { kind: Kind }) {
  return <span aria-hidden="true" className={cn("size-1.5 shrink-0", MARKER[kind])} />;
}

/** A finding label: marker square, sr-only kind, mono text. */
function Finding({
  kind = "Measured",
  children,
  className,
}: {
  kind?: Kind;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      data-pv="chip"
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 border border-line-2 bg-card px-1.5 py-[3px] font-mono text-[10px] leading-tight whitespace-nowrap text-ink",
        className,
      )}
    >
      <Marker kind={kind} />
      <span className="sr-only">{kind}: </span>
      <span className="truncate">{children}</span>
    </span>
  );
}

function KindChip({ kind }: { kind: Kind }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-medium tracking-[0.12em] text-ink-2 uppercase">
      <Marker kind={kind} />
      {kind}
    </span>
  );
}

function DomainText() {
  const domain = usePreviewDomain(SAMPLE_DOMAIN);
  return <span className="text-ink">{domain}</span>;
}

export function Preview() {
  const root = useRef<HTMLElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const reduced = useHydratedReducedMotion();
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const q = gsap.utils.selector(el);
      const body = q('[data-pv="body"]')[0] as HTMLElement;
      const scan = q('[data-pv="scan"]')[0] as HTMLElement;
      const counter = q('[data-pv="count"]')[0]?.firstChild as Text | null;
      const statusEls = q("[data-status]");

      const bodyTop = body.getBoundingClientRect().top;
      const H = body.offsetHeight;
      // The time at which the eased scan line reaches a given y in the body.
      const at = (y: number) => SCAN_START + SCAN_DUR * invInOut(y / H);
      const regionTop = (name: string) => {
        const r = q(`[data-region="${name}"]`)[0].getBoundingClientRect();
        return { top: r.top - bodyTop, bottom: r.bottom - bodyTop };
      };

      const t = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });
      const status = (name: (typeof STATUSES)[number], pos: number) => {
        t.set(statusEls, { opacity: 0 }, pos).set(q(`[data-status="${name}"]`), { opacity: 1 }, pos);
      };
      const chipIn = (chip: Element, pos: number) => {
        t.fromTo(chip, { opacity: 0, x: -6 }, { opacity: 1, x: 0, duration: 0.3 }, pos);
      };

      status("connecting", 0);
      status("reading", SCAN_START);

      // a. The scan line: the one signature motion.
      t.fromTo(
        scan,
        { y: 0, opacity: 1 },
        { y: H - 1, duration: SCAN_DUR, ease: "power2.inOut", immediateRender: false },
        SCAN_START,
      );
      t.to(scan, { opacity: 0, duration: 0.3 }, SCAN_END);

      // b. Labels, as the line passes each region.
      const header = regionTop("header");
      const hero = regionTop("hero");
      const grid = regionTop("products");
      chipIn(q('[data-region="header"] [data-pv="chip"]')[0], at(header.top + 8));
      chipIn(q('[data-region="hero"] [data-pv="chip"]')[0], at((hero.top + hero.bottom) / 2));
      chipIn(q('[data-region="products"] [data-pv="chip"]')[0], at(grid.top + 4));
      if (counter) {
        const n = { v: 0 };
        t.fromTo(
          n,
          { v: 0 },
          {
            v: 48,
            ease: "none",
            duration: Math.max(0.3, at(grid.bottom) - at(grid.top + 4)),
            onUpdate: () => {
              counter.nodeValue = String(Math.round(n.v));
            },
          },
          at(grid.top + 4),
        );
      }
      q('[data-region="scripts"] [data-pv="chip"]').forEach((chip) => {
        const r = chip.getBoundingClientRect();
        chipIn(chip, at(r.top - bodyTop + r.height / 2));
      });

      status("measuring", SCAN_END);

      // c. Result rows clip in from the left, then each value resolves.
      t.fromTo(
        q('[data-pv="row"]'),
        { clipPath: "inset(0% 100% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.5, stagger: 0.09 },
        ROWS_AT,
      );
      const placeholders = q('[data-pv="placeholder"]');
      q('[data-pv="value"]').forEach((value, i) => {
        const pos = RESOLVE_AT + i * RESOLVE_GAP;
        t.fromTo(placeholders[i], { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.96, duration: 0.35 }, pos);
        t.fromTo(value, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.35 }, pos + 0.08);
      });

      // d. Done.
      status("done", DONE_AT);
      t.fromTo(q('[data-pv="note"]'), { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: 0.4 }, DONE_AT);

      tl.current = t;
      ScrollTrigger.create({ trigger: el, start: "top 85%", once: true, onEnter: () => t.play() });
      return () => {
        tl.current = null;
      };
    },
    { scope: root },
  );

  const replay = () => tl.current?.restart();

  return (
    <figure
      ref={root}
      aria-label={`Sample read of ${SAMPLE_DOMAIN}`}
      className="pv pv-anim w-full border border-line-2 bg-card"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-2.5 font-mono text-xs text-ink-2">
        <p className="min-w-0 truncate">
          Reading <DomainText />
        </p>
        <p className="flex shrink-0 items-center gap-2">
          <span aria-hidden="true" className="size-1.5 bg-accent" />
          <span className="grid">
            {STATUSES.map((s) => (
              <span
                key={s}
                data-status={s}
                aria-hidden={s === "done" ? undefined : true}
                className="[grid-area:1/1]"
              >
                {s}
              </span>
            ))}
          </span>
        </p>
      </div>

      {/* Body: the mock storefront and the results column */}
      <div data-pv="body" className="relative grid gap-4 overflow-hidden p-4 sm:grid-cols-[minmax(0,1fr)_9.5rem]">
        <div className="flex flex-col gap-2.5 rounded-[3px] border border-line bg-ground p-2.5">
          {/* Store header */}
          <div data-region="header" className="relative flex h-7 items-center gap-2 rounded-[2px] bg-ground-2 px-2">
            <span className="h-2 w-7 rounded-[1px] bg-sand" />
            <span className="ml-auto h-1 w-4 rounded-full bg-sand/60" />
            <span className="h-1 w-4 rounded-full bg-sand/60" />
            <span className="h-1 w-4 rounded-full bg-sand/60" />
            <Finding className="absolute top-1/2 left-1 -mt-[9px]">Header · 1 nav, 6 links</Finding>
          </div>

          {/* Store hero */}
          <div data-region="hero" className="relative h-24 rounded-[2px] bg-ground-2 p-3">
            <span className="block h-2.5 w-3/5 rounded-[1px] bg-sand/80" />
            <span className="mt-2 block h-1.5 w-2/5 rounded-[1px] bg-sand/50" />
            <span className="mt-3 block h-3.5 w-12 rounded-full bg-sand" />
            <Finding className="absolute right-1.5 bottom-1.5">Hero · 1 offer, no social proof</Finding>
          </div>

          {/* Product grid, 3 x 2 */}
          <div data-region="products" className="relative grid grid-cols-3 gap-2">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i}>
                <span className="block h-12 rounded-[3px] bg-ground-2" />
                <span className="mt-1.5 block h-1 w-3/4 rounded-full bg-sand/60" />
              </div>
            ))}
            <Finding className="absolute top-1/2 left-1/2 -mt-[9px] -ml-[68px]">
              Products · <span data-pv="count" className="tabular-nums">48</span> pages read
            </Finding>
          </div>

          {/* What the page loads */}
          <div data-region="scripts" className="flex flex-col items-start gap-1.5 border-t border-dashed border-line-2 pt-2.5">
            <Finding>Tracking · Meta pixel found, CAPI missing</Finding>
            <Finding>Klaviyo · 3 flows, 2 gaps</Finding>
          </div>
        </div>

        <ul className="grid grid-cols-3 gap-2 sm:flex sm:flex-col" aria-label="Results">
          {RESULTS.map((r) => (
            <li key={r.label} data-pv="row" className="flex flex-col border border-line bg-ground px-2.5 py-2.5 sm:px-3">
              <p className="flex-1 text-xs leading-snug text-ink-2 sm:flex-none sm:text-[13px]">{r.label}</p>
              <div className="relative mt-1.5 h-8">
                <span
                  data-pv="placeholder"
                  aria-hidden="true"
                  className="absolute top-1.5 left-0 h-5 w-14 origin-left rounded-[2px] bg-ground-2 "
                />
                <span data-pv="value" className="absolute top-0 left-0 font-display text-[24px] leading-none whitespace-nowrap sm:text-[28px] text-ink tabular-nums">
                  {r.value}
                </span>
              </div>
              <div className="mt-1">
                <KindChip kind={r.kind} />
              </div>
            </li>
          ))}
        </ul>

        {/* The scan line: 1px accent with a 24px soft trail above it. */}
        <div data-pv="scan" aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-accent opacity-0 will-change-transform">
          <span className="absolute inset-x-0 bottom-full h-6 bg-gradient-to-b from-transparent to-accent-soft mix-blend-multiply" />
        </div>
      </div>

      {/* Footer */}
      <figcaption className="flex flex-col gap-3 border-t border-line px-4 py-3">
        <p data-pv="note" className="font-mono text-[11px] leading-snug text-ink-2">
          Sample read of {SAMPLE_DOMAIN}. Paste your store address to run it on yours.
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <KindChip kind="Measured" />
          <KindChip kind="Generated" />
          <KindChip kind="Sample" />
          {hydrated && !reduced ? (
            <button
              type="button"
              onClick={replay}
              className="ml-auto font-mono text-[11px] text-ink-2 underline decoration-line-2 underline-offset-4 hover:text-ink hover:decoration-ink"
            >
              Replay
            </button>
          ) : null}
        </div>
      </figcaption>
      <noscript>
        <style>{`.pv-anim [data-pv],.pv-anim [data-status]{opacity:1!important;clip-path:none!important}.pv-anim [data-pv="placeholder"],.pv-anim [data-pv="scan"],.pv-anim [data-status]:not([data-status="done"]){opacity:0!important}`}</style>
      </noscript>
    </figure>
  );
}
