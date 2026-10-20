"use client";

import { useEffect, useRef } from "react";
import { GROUND_HEX, GROUND_SELECTOR, groundOf } from "@/lib/ground";

/**
 * One fixed, full-screen layer behind the page that holds the ground
 * colour. Home sections are transparent and say which ground they want
 * with data-ground ("bone" | "ink" | "sage"); the section covering more
 * than half the viewport wins, and the layer eases to its colour over
 * 600 ms. With reduced motion the switch is instant (CSS).
 *
 * An IntersectionObserver (thresholds every 5%) keeps the set of sections
 * on screen and re-measures on each crossing; a passive, rAF-throttled
 * scroll listener re-measures only those sections in between, because a
 * tall section (the 350vh story track) crosses few thresholds.
 *
 * Until this runs, each section paints its own ground and scopes its own
 * text (globals.css). It sets html.ground-live, which makes the sections
 * transparent, and html[data-ground-current], which the text tokens of
 * <main> follow, cross-fading with the layer.
 */
export function GroundShift() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = ref.current;
    const sections = Array.from(document.querySelectorAll<HTMLElement>(GROUND_SELECTOR));
    if (!layer || !sections.length || typeof IntersectionObserver === "undefined") return;

    const visible = new Set<HTMLElement>();
    let current = "";
    let frame = 0;

    const measure = () => {
      frame = 0;
      const vh = window.innerHeight;
      for (const el of visible) {
        const r = el.getBoundingClientRect();
        const covered = Math.min(r.bottom, vh) - Math.max(r.top, 0);
        if (covered / vh > 0.5) {
          const ground = groundOf(el);
          if (ground !== current) {
            current = ground;
            layer.style.backgroundColor = GROUND_HEX[ground];
            layer.dataset.ground = ground;
            document.documentElement.dataset.groundCurrent = ground;
          }
          return;
        }
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) visible.add(el);
          else visible.delete(el);
        }
        schedule();
      },
      { threshold: Array.from({ length: 21 }, (_, i) => i / 20) },
    );
    sections.forEach((s) => observer.observe(s));
    document.documentElement.classList.add("ground-live");
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      document.documentElement.classList.remove("ground-live");
      delete document.documentElement.dataset.groundCurrent;
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={ref} aria-hidden="true" data-ground-layer="" className="ground-layer" />;
}
