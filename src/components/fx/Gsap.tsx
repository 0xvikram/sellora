"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Registers ScrollTrigger and useGSAP once for the whole page. Sections then
 * import `gsap`, `ScrollTrigger` and `useGSAP` directly. ScrollTrigger reads
 * native scroll (no smooth-scroll library). Trigger positions are re-measured once the web fonts have loaded,
 * because the font swap changes section heights.
 */
export function Gsap() {
  useEffect(() => {
    let alive = true;
    document.fonts?.ready.then(() => {
      if (alive) ScrollTrigger.refresh();
    });
    return () => {
      alive = false;
    };
  }, []);

  return null;
}
