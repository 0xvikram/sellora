"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Reduced-motion preference that is `false` on the server AND during the
 * hydration render, then switches to the real value. Use it (instead of
 * framer-motion's useReducedMotion) whenever the answer changes the markup,
 * so the first client render matches the server HTML (React error #418).
 */
export function useHydratedReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
