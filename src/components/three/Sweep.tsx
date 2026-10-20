"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, type RefObject } from "react";
import type { Group, MeshBasicMaterial } from "three";
import { C } from "./palette";
import { SLAB } from "./layout";

export type SweepState = { x: number; alpha: number };

const H = 1.16;
const D = SLAB.d - 0.4;

/**
 * The reading light: a thin translucent lime plane across the slab
 * (opacity 0.35), a faint trail behind it and a bright line where it meets
 * the slab top. Position and fade come from `state`, which the scene
 * timeline writes every frame.
 */
export function Sweep({ state }: { state: RefObject<SweepState> }) {
  const group = useRef<Group>(null);
  const plane = useRef<MeshBasicMaterial>(null);
  const trail = useRef<MeshBasicMaterial>(null);
  const line = useRef<MeshBasicMaterial>(null);

  useFrame(() => {
    const s = state.current;
    if (!group.current || !s) return;
    group.current.position.x = s.x;
    group.current.visible = s.alpha > 0.001;
    if (plane.current) plane.current.opacity = 0.35 * s.alpha;
    if (trail.current) trail.current.opacity = 0.12 * s.alpha;
    if (line.current) line.current.opacity = 0.95 * s.alpha;
  });

  const common = { color: C.lime, transparent: true, depthWrite: false, toneMapped: false } as const;
  return (
    <group ref={group} visible={false}>
      <mesh position={[0, H / 2, 0]} renderOrder={2}>
        <boxGeometry args={[0.03, H, D]} />
        <meshBasicMaterial ref={plane} {...common} opacity={0} />
      </mesh>
      <mesh position={[-0.17, H / 2, 0]} renderOrder={1}>
        <boxGeometry args={[0.32, H, D]} />
        <meshBasicMaterial ref={trail} {...common} opacity={0} />
      </mesh>
      <mesh position={[0, 0.004, 0]} renderOrder={3}>
        <boxGeometry args={[0.045, 0.006, D + 0.2]} />
        <meshBasicMaterial ref={line} {...common} opacity={0} />
      </mesh>
    </group>
  );
}
