"use client";

import { Block } from "./Box";
import { C } from "./palette";

type P = { size: [number, number, number]; y: number; rot: number; dx: number; dz: number };

// Bottom to top, each a little smaller and turned a few degrees.
const STACK: P[] = [
  { size: [0.36, 0.2, 0.28], y: 0, rot: 0.05, dx: 0, dz: 0 },
  { size: [0.3, 0.17, 0.24], y: 0.2, rot: -0.12, dx: 0.015, dz: -0.01 },
  { size: [0.22, 0.13, 0.18], y: 0.37, rot: 0.16, dx: -0.01, dz: 0.01 },
];

/** Three sand parcels stacked by the door, each with an ink tape band. */
export function Parcels() {
  const x = 1.2;
  const z = 0.4;
  return (
    <group position={[x, 0, z]}>
      {STACK.map((p, i) => (
        <group key={i} position={[p.dx, p.y, p.dz]} rotation={[0, p.rot, 0]}>
          <Block at={[0, 0, 0]} size={p.size} color={C.parcel} r={0.014} rough={0.9} />
          {/* Tape: a band over the top and down both ends */}
          <Block at={[0, -0.002, 0]} size={[p.size[0] + 0.006, p.size[1] + 0.006, 0.045]} color={C.ink} rough={0.55} />
        </group>
      ))}
    </group>
  );
}
