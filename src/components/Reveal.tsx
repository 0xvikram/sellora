"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { EASE_OUT, RISE_FROM, RISE_TO, prefersReducedMotion } from "@/lib/motion";

/**
 * Fades its content in with an 8px rise, once, the first time its top edge
 * passes 90% of the viewport height. The server HTML is fully visible. On
 * the client the start state is applied only to blocks that are still
 * below that line after mount (never to what the visitor can already see),
 * and never when the visitor prefers reduced motion. IntersectionObserver
 * plus the Web Animations API; no animation library.
 */
export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || typeof IntersectionObserver === "undefined") return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    el.style.opacity = "0";
    el.style.transform = "translateY(8px)";
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        el.style.opacity = "";
        el.style.transform = "";
        el.animate([RISE_FROM, RISE_TO], { duration: 600, easing: EASE_OUT });
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      el.style.opacity = "";
      el.style.transform = "";
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
