"use client";

import { Block } from "./Box";
import { C } from "./palette";
import { GATE_X, SLAB } from "./layout";

const H = 1.22;
const T = 0.07;
const SPAN = SLAB.d - 0.36;

/**
 * The scanner gate at the left end: a thin ink arch across the slab, with
 * a lime emitter strip under the beam where the sweep starts and a lime
 * hairline along the beam's top edge.
 */
export function Gate() {
  return (
    <group position={[GATE_X, 0, 0]}>
      <Block at={[0, 0, -SPAN / 2]} size={[T, H, T]} color={C.ink} r={0.02} rough={0.55} />
      <Block at={[0, 0, SPAN / 2]} size={[T, H, T]} color={C.ink} r={0.02} rough={0.55} />
      <Block at={[0, H - T, 0]} size={[T, T, SPAN + T]} color={C.ink} r={0.02} rough={0.55} />
      {/* Feet */}
      <Block at={[0, 0, -SPAN / 2]} size={[0.16, 0.02, 0.12]} color={C.ink} r={0.008} />
      <Block at={[0, 0, SPAN / 2]} size={[0.16, 0.02, 0.12]} color={C.ink} r={0.008} />
      {/* Edge light: a hairline of lime along the beam's lit top edge */}
      <Block at={[T / 2 - 0.002, H - 0.012, 0]} size={[0.006, 0.007, SPAN + T - 0.02]} color={C.lime} shadow={false}>
        <meshBasicMaterial color={C.lime} toneMapped={false} />
      </Block>
      {/* Emitter */}
      <Block at={[0.0, H - T - 0.014, 0]} size={[0.03, 0.014, SPAN - T]} color={C.lime} shadow={false}>
        <meshBasicMaterial color={C.lime} toneMapped={false} />
      </Block>
    </group>
  );
}
