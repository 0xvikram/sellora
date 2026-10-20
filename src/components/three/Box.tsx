"use client";

import { RoundedBox } from "@react-three/drei";
import type { ReactNode } from "react";

type Vec3 = [number, number, number];

/**
 * A matte box sitting with its base at `at` (y is the base, not the
 * centre). Rounded when `r` > 0. Every part of the scene is built from
 * these, so materials stay consistent: MeshStandardMaterial, metalness 0,
 * roughness around 0.8.
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
  const position: Vec3 = [at[0], at[1] + size[1] / 2, at[2]];
  const material = children ?? <meshStandardMaterial color={color} roughness={rough} metalness={0} />;
  if (r > 0) {
    return (
      <RoundedBox
        args={size}
        radius={Math.min(r, ...size.map((s) => s / 2 - 0.001))}
        smoothness={3}
        position={position}
        rotation={rotation}
        castShadow={shadow}
        receiveShadow
      >
        {material}
      </RoundedBox>
    );
  }
  return (
    <mesh position={position} rotation={rotation} castShadow={shadow} receiveShadow>
      <boxGeometry args={size} />
      {material}
    </mesh>
  );
}
