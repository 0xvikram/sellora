"use client";

import { Block } from "./Box";
import { C } from "./palette";

/**
 * The counter: an off-white body under an oak top, with a small card
 * terminal (ink, a lime screen that glows a little: the scene's one
 * emissive and one slightly metallic surface) and two products waiting to be
 * rung up beside a folded bag.
 */
export function Counter() {
  const x = -0.2;
  const z = 0.78;
  return (
    <group>
      <Block at={[x, 0, z]} size={[0.82, 0.36, 0.34]} color={C.counter} r={0.035} rough={0.72} />
      <Block at={[x, 0.36, z]} size={[0.9, 0.04, 0.4]} color={C.oak} r={0.018} rough={0.6} />
      {/* Terminal, tilted toward the customer side */}
      <group position={[x + 0.2, 0.4, z + 0.02]} rotation={[-0.35, -0.25, 0]}>
        <Block at={[0, 0, 0]} size={[0.13, 0.05, 0.18]} color={C.ink} r={0.015} rough={0.5} />
        <Block at={[0, 0.05, -0.025]} size={[0.095, 0.006, 0.08]} color={C.lime} shadow={false}>
          <meshStandardMaterial
            color={C.lime}
            emissive={C.lime}
            emissiveIntensity={0.55}
            roughness={0.3}
            metalness={0.2}
          />
        </Block>
      </group>
      <Block at={[x - 0.2, 0.4, z - 0.02]} size={[0.13, 0.17, 0.11]} color={C.clay} r={0.03} rough={0.58} />
      {/* A second product beside it, taller, and a folded bag */}
      <Block at={[x - 0.05, 0.4, z + 0.06]} size={[0.08, 0.2, 0.08]} color={C.teal} r={0.03} rough={0.56} />
      <Block at={[x - 0.33, 0.4, z + 0.08]} size={[0.16, 0.012, 0.12]} color={C.sand} r={0.004} rough={0.8} shadow={false} />
    </group>
  );
}
