"use client";

import { Block } from "./Box";
import { C, PRODUCT_TINTS } from "./palette";

const UNITS = [-1.37, -0.95, -0.53];
const Z = -0.55;
const W = 0.38;
const D = 0.26;
const H = 0.74;
const BOARDS = [0.03, 0.36];
// Two products per board, two boards per unit: 12 in all. Heights vary so
// the row reads as stock, not a pattern.
const HEIGHTS = [0.2, 0.16, 0.24, 0.18, 0.15, 0.22, 0.19, 0.24, 0.17, 0.21, 0.23, 0.16];

/** A row of three open shelf units in oak with twelve rounded products. */
export function Shelves() {
  let n = 0;
  return (
    <group>
      {UNITS.map((x, u) => (
        <group key={x}>
          {/* Sides */}
          <Block at={[x - W / 2 + 0.0125, 0, Z]} size={[0.025, H, D]} color={C.oak} r={0.006} />
          <Block at={[x + W / 2 - 0.0125, 0, Z]} size={[0.025, H, D]} color={C.oak} r={0.006} />
          {/* Back panel, low and thin so the light gets in */}
          <Block at={[x, 0, Z - D / 2 + 0.01]} size={[W, H, 0.02]} color={C.oak} rough={0.85} />
          {/* Boards and the top */}
          {[...BOARDS, H - 0.025].map((y) => (
            <Block key={y} at={[x, y, Z]} size={[W, 0.025, D]} color={C.oak} r={0.006} />
          ))}
          {BOARDS.map((y) =>
            [-0.08, 0.08].map((dx) => {
              const i = n++;
              const h = HEIGHTS[i % HEIGHTS.length];
              return (
                <Block
                  key={`${y}-${dx}`}
                  at={[x + dx, y + 0.025, Z + 0.02]}
                  size={[0.12, h, 0.12]}
                  color={PRODUCT_TINTS[(i + u) % PRODUCT_TINTS.length]}
                  r={0.03}
                  rough={0.62}
                />
              );
            }),
          )}
        </group>
      ))}
    </group>
  );
}
