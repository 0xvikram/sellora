"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type ReactNode } from "react";
import { useHydratedReducedMotion } from "@/lib/use-hydrated-reduced-motion";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Fades its content in with an 8px rise, once, the first time it scrolls
 * into view. The server HTML is fully visible; the start state is applied
 * only on the client, and never when the visitor prefers reduced motion.
 */
export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useHydratedReducedMotion();

  useGSAP(
    () => {
      if (reduced || !ref.current) return;
      gsap.from(ref.current, {
        opacity: 0,
        y: 8,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
      });
    },
    { dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
