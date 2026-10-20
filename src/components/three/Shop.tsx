"use client";

import { Block } from "./Box";
import { C } from "./palette";

/**
 * The shop: a box with a slightly extruded, taller facade (it reads as a
 * parapet), a roof cap, an ink sign band, a teal door with a step and a
 * handle, a white window in an ink frame with a mullion and a sill, and a
 * thin ink awning tilted toward the street. Back right of the slab.
 */
export function Shop() {
  const x = 1.0;
  const z = -0.72; // centre of the body
  const front = z + 0.5; // the body's front face
  const f = front + 0.06; // the facade's front face
  return (
    <group>
      {/* Body and roof cap */}
      <Block at={[x, 0, z]} size={[1.6, 1.0, 1.0]} color={C.wall} r={0.03} />
      <Block at={[x - 0.02, 1.0, z - 0.03]} size={[1.58, 0.05, 0.98]} color={C.facade} r={0.02} />
      {/* Roof membrane inset in the cap, and a small vent */}
      <Block at={[x - 0.02, 1.05, z - 0.03]} size={[1.42, 0.006, 0.84]} color={C.roof} rough={0.95} shadow={false} />
      <Block at={[x + 0.4, 1.05, z - 0.2]} size={[0.26, 0.12, 0.2]} color={C.wall} r={0.02} />
      <Block at={[x + 0.4, 1.17, z - 0.2]} size={[0.18, 0.012, 0.12]} color={C.roof} r={0.004} shadow={false} />
      {/* Facade, proud of the body by 0.06 and 0.16 taller */}
      <Block at={[x, 0, front + 0.03]} size={[1.7, 1.16, 0.06]} color={C.facade} r={0.02} />
      {/* Sign band */}
      <Block at={[x, 0.9, f]} size={[0.9, 0.12, 0.02]} color={C.ink} r={0.01} rough={0.5} />
      {/* Door, with a handle and a step */}
      <Block at={[0.6, 0, f]} size={[0.32, 0.6, 0.03]} color={C.door} r={0.012} rough={0.7} />
      <Block at={[0.7, 0.28, f + 0.03]} size={[0.025, 0.07, 0.02]} color={C.oak} r={0.008} shadow={false} />
      <Block at={[0.6, 0, f + 0.06]} size={[0.44, 0.03, 0.13]} color={C.facade} r={0.01} />
      {/* Window: white pane in an ink frame, a mullion, a sill */}
      <Block at={[1.32, 0.2, f]} size={[0.62, 0.44, 0.02]} color={C.ink} r={0.01} />
      <Block at={[1.32, 0.22, f + 0.012]} size={[0.58, 0.4, 0.02]} color={C.window}>
        <meshStandardMaterial color={C.window} emissive="#fff8ee" emissiveIntensity={0.35} roughness={0.3} metalness={0} />
      </Block>
      <Block at={[1.32, 0.22, f + 0.02]} size={[0.018, 0.4, 0.02]} color={C.ink} shadow={false} />
      <Block at={[1.32, 0.18, f + 0.03]} size={[0.68, 0.025, 0.08]} color={C.facade} r={0.008} />
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
