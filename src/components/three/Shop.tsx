"use client";

import { Block } from "./Box";
import { Digits } from "./Digits";
import { C } from "./palette";

/**
 * The shop: a box with a bevelled facade standing proud of it (taller, so
 * it reads as a parapet), a roof cap, an ink sign plate with "48" in
 * raised bone strokes (the store's 48 products), a teal door with a step,
 * a handle and a mat, a white window in an ink frame with a mullion and a
 * sill, and a thin ink awning tilted toward the street. Back right of the
 * slab.
 */
export function Shop() {
  const x = 1.0;
  const z = -0.72; // centre of the body
  const front = z + 0.5; // the body's front face
  const f = front + 0.08; // the facade's front face
  return (
    <group>
      {/* Body and roof cap */}
      <Block at={[x, 0, z]} size={[1.6, 1.0, 1.0]} color={C.wall} r={0.045} rough={0.76} />
      <Block at={[x - 0.02, 1.0, z - 0.03]} size={[1.58, 0.05, 0.98]} color={C.facade} r={0.02} rough={0.7} />
      {/* Roof membrane inset in the cap, and a small vent */}
      <Block at={[x - 0.02, 1.05, z - 0.03]} size={[1.42, 0.006, 0.84]} color={C.roof} rough={0.8} shadow={false} />
      <Block at={[x + 0.4, 1.05, z - 0.2]} size={[0.26, 0.12, 0.2]} color={C.wall} r={0.03} rough={0.62} />
      <Block at={[x + 0.4, 1.17, z - 0.2]} size={[0.18, 0.012, 0.12]} color={C.roof} r={0.004} shadow={false} />
      {/* Facade, proud of the body by 0.08, 0.16 taller, bevelled */}
      <Block at={[x, 0, front + 0.04]} size={[1.7, 1.16, 0.08]} color={C.facade} r={0.04} rough={0.68} />
      {/* Sign plate with the number */}
      <Block at={[x, 0.86, f]} size={[0.9, 0.17, 0.03]} color={C.ink} r={0.012} rough={0.55} />
      <Digits text="48" height={0.11} color={C.counter} position={[x, 0.945, f + 0.03]} />
      {/* Door, with a handle, a step and a mat */}
      <Block at={[0.6, 0, f]} size={[0.32, 0.6, 0.03]} color={C.door} r={0.012} rough={0.6} />
      <Block at={[0.7, 0.28, f + 0.03]} size={[0.025, 0.07, 0.02]} color={C.oak} r={0.008} rough={0.55} shadow={false} />
      <Block at={[0.6, 0, f + 0.06]} size={[0.44, 0.03, 0.13]} color={C.facade} r={0.01} rough={0.7} />
      <Block at={[0.6, 0, f + 0.25]} size={[0.38, 0.01, 0.2]} color={C.mat} r={0.004} rough={0.8} shadow={false} />
      {/* Window: white pane in an ink frame, a mullion, a sill */}
      <Block at={[1.32, 0.2, f]} size={[0.62, 0.44, 0.02]} color={C.ink} r={0.01} rough={0.55} />
      <Block at={[1.32, 0.22, f + 0.012]} size={[0.58, 0.4, 0.02]} color={C.window}>
        <meshStandardMaterial color={C.window} emissive="#fff8ee" emissiveIntensity={0.35} roughness={0.3} metalness={0} />
      </Block>
      <Block at={[1.32, 0.22, f + 0.02]} size={[0.018, 0.4, 0.02]} color={C.ink} shadow={false} />
      <Block at={[1.32, 0.18, f + 0.03]} size={[0.68, 0.025, 0.08]} color={C.facade} r={0.01} rough={0.66} />
      {/* Awning over door and window, tilted down toward the street */}
      <Block
        at={[0.97, 0.7, f + 0.1]}
        size={[1.42, 0.025, 0.22]}
        color={C.ink}
        r={0.01}
        rough={0.6}
        rotation={[0.28, 0, 0]}
      />
    </group>
  );
}
