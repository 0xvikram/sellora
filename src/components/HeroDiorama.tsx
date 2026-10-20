"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePreviewDomain } from "@/lib/preview-domain";
import { cn } from "@/lib/utils";
import { wantScene, useSceneActive } from "./three/active";
import { FINDINGS } from "./three/layout";
import { hasWebGL, LIVE_QUERY } from "./three/live-gate";
import type { Pointer } from "./three/Diorama";

// The 3D chunk (three, fiber, drei) is never in the initial bundle: it is
// imported only once the gate below says yes.
const Diorama = dynamic(() => import("./three/Diorama"), { ssr: false });

export const SAMPLE_DOMAIN = "oatleaf.example";

type Still = "" | "still" | "still-m";
const noopSubscribe = () => () => {};

/** "?diorama=still" (4:5) or "?diorama=still-m" (4:3, 390 wide): poster capture. */
function stillMode(): Still {
  const v = new URLSearchParams(window.location.search).get("diorama");
  return v === "still" || v === "still-m" ? v : "";
}

// Local time, client only (the server renders an empty slot).
let clockListeners = new Set<() => void>();
let clockTimer: number | undefined;
function subscribeClock(cb: () => void) {
  clockListeners.add(cb);
  if (clockTimer === undefined) {
    clockTimer = window.setInterval(() => clockListeners.forEach((l) => l()), 15_000);
  }
  return () => {
    clockListeners.delete(cb);
    if (!clockListeners.size) {
      window.clearInterval(clockTimer);
      clockTimer = undefined;
      clockListeners = new Set();
    }
  };
}
const timeNow = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });

function Chip() {
  const domain = usePreviewDomain(SAMPLE_DOMAIN);
  const time = useSyncExternalStore(subscribeClock, timeNow, () => "");
  return (
    <p className="dio-chip" data-dio-chip>
      <span aria-hidden="true" className="size-1.5 shrink-0 bg-lime" />
      <span className="tabular-nums" suppressHydrationWarning>
        {time}
      </span>
      <span className="min-w-0 truncate">
        Reading <span data-dio-domain>{domain}</span>
      </span>
    </p>
  );
}

/**
 * The hero card. Server HTML is the poster (a rendered still of the scene,
 * end state) in a rounded card on a bone-peach-sage gradient, with the
 * "Reading <domain>" chip. On desktop with a mouse, motion allowed and
 * WebGL available, the live diorama mounts once the browser is idle and
 * cross-fades in over the poster after its first frame. Everything else
 * (phones, tablets, reduced motion, no WebGL, no JavaScript) keeps the
 * poster.
 */
export function HeroDiorama() {
  const root = useRef<HTMLElement>(null);
  const pointer = useRef<Pointer>({ x: 0, y: 0 });
  const scroll = useRef(0);
  const still = useSyncExternalStore<Still>(noopSubscribe, stillMode, () => "");
  const [gated, setGated] = useState(false);
  const live = gated || !!still;
  const [ready, setReady] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const [replay, setReplay] = useState(0);
  // One scene renders at a time (./three/active.ts): the hero asks to run
  // while it is mounted, on screen and the tab is visible.
  const wants = gated && !still && onScreen && tabVisible;
  useEffect(() => {
    wantScene("hero", wants);
    return () => wantScene("hero", false);
  }, [wants]);
  const running = useSceneActive("hero") && wants;

  // Gate and idle mount.
  useEffect(() => {
    if (stillMode()) return;
    const mq = window.matchMedia(LIVE_QUERY);
    let idle: number | undefined;
    let timer: number | undefined;
    const mount = () => {
      if (mq.matches && hasWebGL()) setGated(true);
    };
    const schedule = () => {
      if ("requestIdleCallback" in window) idle = window.requestIdleCallback(mount, { timeout: 1500 });
      else timer = (window as Window).setTimeout(mount, 300);
    };
    const onChange = () => {
      if (!mq.matches) {
        setGated(false);
        setReady(false);
      } else schedule();
    };
    if (mq.matches) {
      if (document.readyState === "complete") schedule();
      else window.addEventListener("load", schedule, { once: true });
    }
    mq.addEventListener("change", onChange);
    return () => {
      mq.removeEventListener("change", onChange);
      window.removeEventListener("load", schedule);
      if (idle !== undefined) window.cancelIdleCallback(idle);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, []);

  // Pointer over the whole hero, scroll progress of the hero, on-screen and
  // tab visibility (the frame loop pauses when either is false).
  useEffect(() => {
    const el = root.current;
    if (!live || still || !el) return;
    const hero = el.closest("section") ?? document.body;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = hero.getBoundingClientRect();
      pointer.current.x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      pointer.current.y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
    };
    const leave = () => {
      pointer.current.x = 0;
      pointer.current.y = 0;
    };
    const onScroll = () => {
      const r = hero.getBoundingClientRect();
      scroll.current = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height)));
    };
    const onVis = () => setTabVisible(document.visibilityState === "visible");
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    io.observe(el);
    hero.addEventListener("pointermove", move, { passive: true });
    hero.addEventListener("pointerleave", leave);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    onScroll();
    onVis();
    return () => {
      io.disconnect();
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", leave);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [live, still]);

  return (
    <figure
      ref={root}
      aria-label={`Sample read of ${SAMPLE_DOMAIN}`}
      data-diorama={live ? (ready ? "live" : "loading") : "poster"}
      data-dio-compact={still === "still-m" || undefined}
      data-active={gated && !still ? String(running) : undefined}
      className={cn("w-full", still === "still-m" && "w-[390px]")}
    >
      <div
        className={cn(
          "dio-card relative isolate overflow-hidden",
          still === "still-m" ? "aspect-[4/3]" : still === "still" ? "aspect-[4/5]" : "aspect-[4/3] lg:aspect-[4/5]",
        )}
      >
        {!still && (
          <picture>
            <source media="(min-width: 1024px)" srcSet="/posters/hero-diorama.jpg" width={1120} height={1400} />
            {/* A plain <img> on purpose: art-directed, sized, the LCP candidate. */}
            <img
              src="/posters/hero-diorama-m.jpg"
              width={780}
              height={586}
              alt=""
              fetchPriority="high"
              data-dio-poster
              className={cn(
                "absolute inset-0 size-full object-cover transition-opacity duration-400 ease-out",
                ready && "opacity-0",
              )}
            />
          </picture>
        )}

        {live && (
          <div
            data-dio-canvas
            className={cn(
              "absolute inset-0 transition-opacity duration-400 ease-out",
              ready || still ? "opacity-100" : "opacity-0",
            )}
          >
            <Diorama
              replay={replay}
              pointer={pointer}
              scroll={scroll}
              active={running}
              still={!!still}
              onReady={() => setReady(true)}
            />
          </div>
        )}

        {!still && <Chip />}

        <ul className="sr-only">
          {FINDINGS.map((f) => (
            <li key={f.id}>
              {f.label}: {f.value}
            </li>
          ))}
        </ul>
      </div>

      {!still && (
        <figcaption className="mt-3 flex items-baseline justify-between gap-4 font-mono text-[11px] leading-snug text-ink-2">
          <span>Sample read of {SAMPLE_DOMAIN}. Paste your store address to run it on yours.</span>
          {live && ready ? (
            <button
              type="button"
              onClick={() => setReplay((n) => n + 1)}
              className="shrink-0 underline decoration-line-2 underline-offset-4 hover:text-ink hover:decoration-ink"
            >
              Replay
            </button>
          ) : null}
        </figcaption>
      )}
    </figure>
  );
}
