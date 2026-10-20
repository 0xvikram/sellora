// Where things sit on the slab, in slab-local units (the slab top is y = 0,
// x runs from the scanner gate on the left to the far end on the right).
// The sweep reveals each finding as it passes the finding's x.

export const SLAB = { w: 4.3, d: 2.75, h: 0.46, radius: 0.2 } as const;

/** The sweep travels from the gate to just past the far edge. */
export const GATE_X = -1.95;
export const SWEEP_END_X = SLAB.w / 2 + 0.05;

export type FindingSpec = {
  id: string;
  label: string;
  value: string;
  /** Anchor of the label (slab-local): the point the leader touches. */
  at: [number, number, number];
  /** The sweep x at which the finding appears. */
  revealX: number;
  /** Pill above or below the anchor, the leader length in px, and which
   *  way the pill runs from the leader (centred, or off to one side). */
  place: "above" | "below";
  lead: number;
  align: "center" | "left" | "right";
};

// In the order the sweep reaches them.
export const FINDINGS: FindingSpec[] = [
  { id: "shelves", label: "Shelves", value: "48 products", at: [-0.95, 0.78, -0.55], revealX: -0.95, place: "above", lead: 44, align: "left" },
  { id: "counter", label: "Counter", value: "Meta pixel found, CAPI missing", at: [-0.05, 0.5, 0.82], revealX: -0.1, place: "below", lead: 118, align: "center" },
  { id: "door", label: "Door", value: "3 flows, 2 gaps", at: [0.62, 1.32, -0.42], revealX: 0.55, place: "above", lead: 44, align: "right" },
  { id: "parcels", label: "Parcels", value: "54% orders matched", at: [1.2, 0.2, 0.42], revealX: 1.15, place: "below", lead: 26, align: "center" },
];
