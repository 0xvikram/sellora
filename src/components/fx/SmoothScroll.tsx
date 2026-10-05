"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

/**
 * Lenis smooth scroll, desktop pointers only. Touch devices keep native
 * momentum scrolling, and reduced-motion users get nothing at all.
 */
export function SmoothScroll() {
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    if (!fine || reduced) return;

    let lenis: {
      raf: (t: number) => void;
      destroy: () => void;
      scrollTo: (
        target: string | number | HTMLElement,
        options?: { offset?: number; duration?: number },
      ) => void;
    } | null = null;
    let tick: ((time: number) => void) | null = null;
    let cancelled = false;

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const instance = new Lenis({
        duration: 1.05,
        lerp: 0.1,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.6,
      });
      lenis = instance;
      // GSAP's ticker drives Lenis so ScrollTrigger and the smoothed scroll
      // update on the same frame (no jitter on pinned or scrubbed sections).
      instance.on("scroll", ScrollTrigger.update);
      tick = (time: number) => instance.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      ScrollTrigger.refresh();
    }).catch(() => {
      // Chunk never arrived (offline, or the page navigated away mid-fetch).
      // Native scrolling is a perfectly good fallback; don't leave an
      // unhandled rejection behind.
    });

    // Lenis owns the scroll position, so native anchor jumps have to be
    // re-routed through it or in-page links land in the wrong place.
    const onClick = (e: MouseEvent) => {
      if (!lenis || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey)
        return;
      const anchor = (e.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;
      const hash = href.startsWith("#")
        ? href
        : href.startsWith("/#")
          ? href.slice(1)
          : null;
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -72 });
      history.replaceState(null, "", hash);
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelled = true;
      if (tick) gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      document.removeEventListener("click", onClick);
      lenis?.destroy();
    };
  }, []);

  return null;
}
