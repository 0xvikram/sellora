// The three grounds a section can sit on. Sections say which with
// data-ground; GroundShift paints it behind the page and the nav pill
// takes the matching tint.
export type Ground = "bone" | "ink" | "sage";

export const GROUND_SELECTOR = "main section[data-ground], footer[data-ground]";

export const GROUND_HEX: Record<Ground, string> = {
  bone: "#f3f5ee",
  ink: "#0a140f",
  sage: "#b7c3a7",
};

export function groundOf(el: Element | null | undefined): Ground {
  const v = el?.getAttribute("data-ground");
  return v === "ink" || v === "sage" ? v : "bone";
}
