"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { useEffect, useRef } from "react";
import type { DirectionalLight } from "three";

/**
 * The studio both scenes share: a warm key from the upper left front with
 * soft PCF shadows, a cool fill from the front right, a faint rim from
 * behind (it lifts the back edges off the card's gradient), a sage-tinted
 * hemisphere bounce and a code-built environment of soft boxes (no HDR
 * file). `bounds` is the half-size of the key light's shadow camera, and
 * `keyAt` moves the key along with a scene that is wider than the slab.
 */
export function Lights({
  shadows,
  bounds = 3.4,
  keyAt = [0, 0, 0],
}: {
  shadows: boolean;
  bounds?: number;
  keyAt?: [number, number, number];
}) {
  const key = useRef<DirectionalLight>(null);
  useEffect(() => {
    const l = key.current;
    if (!l) return;
    l.shadow.camera.left = -bounds;
    l.shadow.camera.right = bounds;
    l.shadow.camera.top = bounds;
    l.shadow.camera.bottom = -bounds;
    l.shadow.camera.near = 1;
    l.shadow.camera.far = 22;
    l.shadow.camera.updateProjectionMatrix();
    l.target.position.set(...keyAt);
    l.target.updateMatrixWorld();
  }, [bounds, keyAt]);
  const [kx, ky, kz] = keyAt;
  return (
    <>
      <directionalLight
        ref={key}
        color="#fff1df"
        intensity={2.8}
        position={[kx - 5, ky + 7.5, kz + 1.2]}
        castShadow={shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-radius={3}
      />
      <directionalLight color="#eef2f6" intensity={1.35} position={[kx + 6, ky + 3, kz + 3]} />
      {/* Rim: low, from behind and a little to the right, no shadows */}
      <directionalLight color="#fff7ec" intensity={1.6} position={[kx + 2.5, ky + 2.2, kz - 7]} />
      <hemisphereLight args={["#ffffff", "#b7c3a7", 0.4]} />
      <Environment resolution={64} frames={1} environmentIntensity={0.7}>
        <Lightformer form="rect" intensity={2.2} color="#fff6ea" position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[8, 8, 1]} />
        <Lightformer form="rect" intensity={1.1} color="#ffffff" position={[-6, 2, 3]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} />
        <Lightformer form="rect" intensity={0.7} color="#e8f0e2" position={[6, 1.5, -2]} rotation-y={-Math.PI / 2} scale={[6, 3, 1]} />
        <Lightformer form="rect" intensity={0.5} color="#f6e3d3" position={[0, 1, 7]} scale={[8, 2, 1]} />
        {/* A warm strip behind, for the rim in reflections */}
        <Lightformer form="rect" intensity={0.9} color="#ffe9d2" position={[0, 2, -7]} scale={[10, 1.5, 1]} />
      </Environment>
    </>
  );
}
