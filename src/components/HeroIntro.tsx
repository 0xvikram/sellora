"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, type ReactNode } from "react";

if (typeof window !== "undefined") gsap.registerPlugin(useGSAP);

/**
 * Load reveal for the hero text column. Only children marked [data-intro]
 * move (eyebrow, tagline, form, link): opacity + 8px rise, 60 ms stagger,
 * 0.68 s in total. The H1 is never animated, so LCP is the server paint.
 * Server HTML is fully visible. Skipped under reduced motion, and skipped
 * when hydration lands late (after 1 s), because by then the visitor has
 * already seen the text and hiding it again would read as a flicker.
 */
export function HeroIntro({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (performance.now() > 1000) return;
      gsap.from(gsap.utils.toArray("[data-intro]", ref.current), {
        opacity: 0,
        y: 8,
        duration: 0.5,
        stagger: 0.06,
        ease: "power2.out",
        clearProps: "opacity,transform",
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
