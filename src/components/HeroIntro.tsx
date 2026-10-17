"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { EASE_OUT, RISE_FROM, RISE_TO, prefersReducedMotion } from "@/lib/motion";

/**
 * Load reveal for the hero text column. Only children marked [data-intro]
 * move (eyebrow, tagline, form, link): opacity + 8px rise, 60 ms stagger,
 * 0.68 s in total, with the Web Animations API. The H1 is never animated,
 * so LCP is the server paint. Server HTML is fully visible. Skipped under
 * reduced motion, and skipped when hydration lands late (after 1 s),
 * because by then the visitor has already seen the text and hiding it
 * again would read as a flicker.
 */
export function HeroIntro({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || performance.now() > 1000) return;
    const animations = Array.from(el.querySelectorAll<HTMLElement>("[data-intro]"), (item, i) =>
      item.animate([RISE_FROM, RISE_TO], {
        duration: 500,
        delay: i * 60,
        easing: EASE_OUT,
        fill: "backwards",
      }),
    );
    return () => animations.forEach((a) => a.cancel());
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
