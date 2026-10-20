"use client";

import type { ReactNode } from "react";
import { BoxGeometry, type BufferGeometry } from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

type Vec3 = [number, number, number];

// One geometry per distinct size and radius, shared by every block that
// uses it. three's RoundedBoxGeometry (a segmented box pushed onto rounded
// corners) is far cheaper to build than an extruded rounded rectangle, and
// with ~60 blocks building the geometries was most of the mount cost.
const cache = new Map<string, BufferGeometry>();
function geometryFor(size: Vec3, r: number): BufferGeometry {
  const key = `${size.join(",")}|${r}`;
  let g = cache.get(key);
  if (!g) {
    g =
      r > 0
        ? new RoundedBoxGeometry(size[0], size[1], size[2], 2, Math.min(r, ...size.map((s) => s / 2 - 0.001)))
        : new BoxGeometry(...size);
    cache.set(key, g);
  }
  return g;
}

/**
 * A matte box sitting with its base at `at` (y is the base, not the
 * centre), rounded when `r` > 0. Every part of the scene is built from
 * these, so materials stay consistent: MeshStandardMaterial, metalness 0,
 * roughness around 0.8. Pass a material as children to override.
 */
export function Block({
  at,
  size,
  color,
  r = 0,
  rough = 0.8,
  rotation,
  shadow = true,
  children,
}: {
  at: Vec3;
  size: Vec3;
  color: string;
  r?: number;
  rough?: number;
  rotation?: Vec3;
  shadow?: boolean;
  children?: ReactNode;
}) {
  return (
    <mesh
      geometry={geometryFor(size, r)}
      position={[at[0], at[1] + size[1] / 2, at[2]]}
      rotation={rotation}
      castShadow={shadow}
      receiveShadow
    >
      {children ?? <meshStandardMaterial color={color} roughness={rough} metalness={0} />}
    </mesh>
  );
}
