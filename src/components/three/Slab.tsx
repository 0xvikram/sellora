"use client";

import { useMemo } from "react";
import { BufferAttribute, Color } from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { Block } from "./Box";
import { C } from "./palette";
import { SLAB } from "./layout";

/**
 * The floating base: one rounded box with a thick bevel. A vertex colour
 * blends bone on the top face into darker sage down the bevel and sides,
 * so the edge reads as one turned piece rather than a lid on a box.
 */
export function Slab() {
  const geometry = useMemo(() => {
    const g = new RoundedBoxGeometry(SLAB.w, SLAB.h, SLAB.d, 6, SLAB.radius);
    const normals = g.getAttribute("normal");
    const top = new Color(C.bone);
    const side = new Color(C.sageSide);
    const low = new Color(C.sageDeep);
    const colors = new Float32Array(normals.count * 3);
    const c = new Color();
    for (let i = 0; i < normals.count; i++) {
      const ny = normals.getY(i);
      // smoothstep(0.55, 0.92, ny): bone only where the surface faces up.
      const t = Math.min(1, Math.max(0, (ny - 0.55) / 0.37));
      const s = t * t * (3 - 2 * t);
      // The underside darkens a little more.
      c.copy(ny < -0.5 ? low : side).lerp(top, s);
      colors.set([c.r, c.g, c.b], i * 3);
    }
    g.setAttribute("color", new BufferAttribute(colors, 3));
    return g;
  }, []);

  return (
    <group>
      <mesh geometry={geometry} position={[0, -SLAB.h / 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.82} metalness={0} />
      </mesh>
      {/* A walkway from the gate to the door, a shade darker than the top */}
      <Block at={[-0.55, 0, 0.18]} size={[2.6, 0.004, 0.42]} color={C.path} r={0.002} rough={0.9} shadow={false} />
      <Block at={[0.6, 0, -0.04]} size={[0.44, 0.004, 0.44]} color={C.path} r={0.002} rough={0.9} shadow={false} />
    </group>
  );
}
