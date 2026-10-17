"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { usePreviewDomain } from "@/lib/preview-domain";
import { useHydratedReducedMotion } from "@/lib/use-hydrated-reduced-motion";
import { cn } from "@/lib/utils";
import { Storefront } from "./preview/Storefront";

type Gsap = typeof import("gsap").gsap;
type Timeline = ReturnType<Gsap["timeline"]>;

// The scripted crawl preview in the hero: a code-drawn storefront mock
// (blocks only, nothing readable), the labels a read of the store produces,
// and three result rows. Everything is local and scripted: no network, no
// real crawl. Every line is sample data for oatleaf.example.
//
// Server HTML is in the start state (.pv-anim, see globals.css). With
// reduced motion, or without JavaScript, CSS shows the final state and no
// timeline is built.
//
// GSAP core is loaded with a dynamic import once the browser is idle after
// first paint, so it never sits on the critical path. The timeline is built
// then, and played once by an IntersectionObserver when the panel is in view
// (top edge above 85% of the viewport height).
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
const TILT = 2.5;
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

function Anchor({ children }: { children: React.ReactNode }) {
  return <span className="finding-anchor">{children}</span>;
}

function DomainText() {
  const domain = usePreviewDomain(SAMPLE_DOMAIN);
  return <span className="text-ink">{domain}</span>;
}

/** Builds the paused crawl timeline (see the schedule at the top). */
function buildTimeline(gsap: Gsap, el: HTMLElement): Timeline {
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
    t.set(statusEls, { opacity: 0, immediateRender: false }, pos).set(
      q(`[data-status="${name}"]`),
      { opacity: 1, immediateRender: false },
      pos,
    );
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
  const chipOf = (name: string) => q(`[data-region="${name}"] [data-pv="chip"]`)[0];
  const header = regionTop("header");
  const hero = regionTop("hero");
  const grid = regionTop("products");
  chipIn(chipOf("header"), at(header.top + 8));
  chipIn(chipOf("hero"), at((hero.top + hero.bottom) / 2));
  chipIn(chipOf("products"), at(grid.top + 4));
  if (counter) {
    const n = { v: 6 };
    t.fromTo(
      n,
      { v: 6 },
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
  for (const name of ["tracking", "email"]) {
    const r = regionTop(name);
    chipIn(chipOf(name), at((r.top + r.bottom) / 2));
  }

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

  return t;
}

export function Preview() {
  const root = useRef<HTMLElement>(null);
  const tl = useRef<Timeline | null>(null);
  const reduced = useHydratedReducedMotion();
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    let timeline: Timeline | null = null;
    let observer: IntersectionObserver | null = null;

    const start = async () => {
      const { gsap } = await import("gsap");
      if (cancelled) return;
      timeline = buildTimeline(gsap, el);
      tl.current = timeline;
      observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          observer?.disconnect();
          timeline?.play();
        },
        { rootMargin: "0px 0px -15% 0px" },
      );
      observer.observe(el);
    };

    // After first paint: idle callback where supported, else a short timeout.
    const hasIdle = "requestIdleCallback" in window;
    const idle = hasIdle
      ? window.requestIdleCallback(() => void start(), { timeout: 1200 })
      : window.setTimeout(() => void start(), 200);
    return () => {
      cancelled = true;
      if (hasIdle) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      observer?.disconnect();
      timeline?.kill();
      tl.current = null;
    };
  }, []);

  // Tilt toward the cursor, at most TILT degrees per axis (the CSS
  // transition on .pv gives the 300 ms ease). Fine pointers with hover
  // only, never with reduced motion; touch gets no tilt.
  useEffect(() => {
    const el = root.current;
    const ok = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    if (!el || !ok.matches) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      const px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) - 0.5;
      const py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)) - 0.5;
      // The edge nearest the cursor lifts toward the viewer.
      el.style.setProperty("--tilt-x", `${(py * 2 * TILT).toFixed(2)}deg`);
      el.style.setProperty("--tilt-y", `${(-px * 2 * TILT).toFixed(2)}deg`);
    };
    const leave = () => {
      el.style.removeProperty("--tilt-x");
      el.style.removeProperty("--tilt-y");
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      leave();
    };
  }, []);

  const replay = () => tl.current?.restart();

  return (
    <figure
      ref={root}
      aria-label={`Sample read of ${SAMPLE_DOMAIN}`}
      className="pv pv-anim w-full"
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

      {/* Body: the drawn storefront and the results column */}
      <div data-pv="body" className="pv-body relative overflow-hidden">
        <Storefront
          domain={<DomainText />}
          findings={{
            header: <Anchor><Finding>Header · 4 links, no search</Finding></Anchor>,
            hero: <Anchor><Finding>Hero · 1 offer, no reviews shown</Finding></Anchor>,
            products: (
              <Anchor>
                <Finding>
                  Products · <span data-pv="count" className="tabular-nums">48</span> of 48 read
                </Finding>
              </Anchor>
            ),
            tracking: <Anchor><Finding>Tracking · Meta pixel found, CAPI missing</Finding></Anchor>,
            email: <Anchor><Finding>Email · Klaviyo, 3 flows, 2 gaps</Finding></Anchor>,
          }}
        />

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
