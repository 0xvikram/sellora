// Shared motion values for the small CSS/WAAPI reveals. The one GSAP
// timeline (the crawl preview) keeps its own eases.

/** Same curve as GSAP's power2.out (ease-out quad). */
export const EASE_OUT = "cubic-bezier(0.5, 1, 0.89, 1)";

export const RISE_FROM: Keyframe = { opacity: 0, transform: "translateY(8px)" };
export const RISE_TO: Keyframe = { opacity: 1, transform: "none" };

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
