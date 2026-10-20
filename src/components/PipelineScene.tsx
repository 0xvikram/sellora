"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { useSceneActive, wantScene } from "./three/active";
import { hasWebGL, LIVE_QUERY } from "./three/live-gate";
import { SceneBoundary } from "./three/SceneBoundary";
import { PIPELINE_GATES } from "./three/pipeline-layout";
import type { Pointer } from "./three/Pipeline";

// The 3D chunk loads only once the gate below says yes (it shares three,
// fiber and drei with the hero's chunk).
const Pipeline = dynamic(() => import("./three/Pipeline"), { ssr: false });

type Still = "" | "still" | "still-m";
const noopSubscribe = () => () => {};

/** "?pipeline=still" (16:7) or "?pipeline=still-m" (4:3, 390 wide): poster capture. */
function stillMode(): Still {
  const v = new URLSearchParams(window.location.search).get("pipeline");
  return v === "still" || v === "still-m" ? v : "";
}

/**
 * The pipeline card. Server HTML is the poster (a rendered still of the
 * scene), lazy-loaded since it sits mid-page. On desktop with a mouse,
 * motion allowed and WebGL, the live scene mounts when the card comes
 * within 400px of the viewport (and the page has loaded), and cross-fades
 * in over the poster after its first frame. It renders only while it is
 * on screen, the tab is visible and the hero is not the scene rendering
 * (./three/active.ts); data-active says whether its loop is running.
 */
export function PipelineScene() {
  const root = useRef<HTMLElement>(null);
  const pointer = useRef<Pointer>({ x: 0, y: 0 });
  const progress = useRef(0);
  const still = useSyncExternalStore<Still>(noopSubscribe, stillMode, () => "");
  const [gated, setGated] = useState(false);
  // Set when the canvas throws or loses its context (SceneBoundary): the
  // card keeps its poster for the rest of the visit.
  const [failed, setFailed] = useState(false);
  const live = (gated && !failed) || !!still;
  const [ready, setReady] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);

  const wants = gated && !failed && !still && onScreen && tabVisible;
  useEffect(() => {
    wantScene("pipeline", wants);
    return () => wantScene("pipeline", false);
  }, [wants]);
  const running = useSceneActive("pipeline") && wants;

  // Gate: desktop, motion, WebGL, page loaded, and the card near the
  // viewport. Once mounted it stays mounted (paused when off-screen).
  useEffect(() => {
    const el = root.current;
    if (stillMode() || !el) return;
    const mq = window.matchMedia(LIVE_QUERY);
    let near = false;
    let loaded = document.readyState === "complete";
    const check = () => {
      if (near && loaded && mq.matches && hasWebGL()) setGated(true);
    };
    const onLoad = () => {
      loaded = true;
      check();
    };
    const io = new IntersectionObserver(
      ([e]) => {
        near = e.isIntersecting;
        check();
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    const onChange = () => {
      if (!mq.matches) {
        setGated(false);
        setReady(false);
      } else check();
    };
    if (!loaded) window.addEventListener("load", onLoad, { once: true });
    mq.addEventListener("change", onChange);
    return () => {
      io.disconnect();
      mq.removeEventListener("change", onChange);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  // On screen, tab visibility, scroll progress and pointer.
  useEffect(() => {
    const el = root.current;
    if (!live || still || !el) return;
    const section = el.closest("section") ?? el;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      progress.current = Math.max(0, Math.min(1, (vh - r.top) / Math.max(1, vh + r.height)));
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      pointer.current.x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      pointer.current.y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
    };
    const leave = () => {
      pointer.current.x = 0;
      pointer.current.y = 0;
    };
    const onVis = () => setTabVisible(document.visibilityState === "visible");
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    io.observe(el);
    section.addEventListener("pointermove", move, { passive: true });
    section.addEventListener("pointerleave", leave);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    onScroll();
    onVis();
    return () => {
      io.disconnect();
      section.removeEventListener("pointermove", move);
      section.removeEventListener("pointerleave", leave);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [live, still]);

  return (
    <figure
      ref={root}
      aria-label="A sample store's orders passing the five gates"
      data-pipeline={live ? (ready ? "live" : "loading") : "poster"}
      data-pipe-compact={still === "still-m" || undefined}
      data-active={gated && !failed && !still ? String(running) : undefined}
      className={cn("w-full", still === "still-m" && "w-[390px]")}
    >
      <div
        className={cn(
          "pipe-card relative isolate overflow-hidden",
          still === "still-m" ? "aspect-[4/3]" : still === "still" ? "aspect-[16/7]" : "aspect-[4/3] lg:aspect-[16/7]",
        )}
      >
        {!still && (
          <picture>
            <source media="(min-width: 1024px)" srcSet="/posters/pipeline.jpg" width={2112} height={924} />
            <img
              src="/posters/pipeline-m.jpg"
              width={780}
              height={586}
              alt=""
              loading="lazy"
              decoding="async"
              data-pipe-poster
              className={cn(
                "absolute inset-0 size-full object-cover transition-opacity duration-400 ease-out",
                ready && "opacity-0",
              )}
            />
          </picture>
        )}

        {live && (
          <SceneBoundary
            data-pipe-canvas
            onFail={() => {
              setFailed(true);
              setReady(false);
            }}
            className={cn(
              "absolute inset-0 transition-opacity duration-400 ease-out",
              ready || still ? "opacity-100" : "opacity-0",
            )}
          >
            <Pipeline
              progress={progress}
              pointer={pointer}
              active={running}
              still={!!still}
              onReady={() => setReady(true)}
            />
          </SceneBoundary>
        )}

        <ol className="sr-only">
          {PIPELINE_GATES.map((g) => (
            <li key={g.id}>
              {g.label}: {g.note}
            </li>
          ))}
        </ol>
      </div>
    </figure>
  );
}
