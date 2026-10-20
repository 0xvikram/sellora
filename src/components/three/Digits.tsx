"use client";

import { useMemo } from "react";
import { BoxGeometry, type BufferGeometry } from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

// Seven-segment strokes, raised off a plate: a digit is the segments it
// lights. All the strokes of a number merge into one geometry, so "48" is
// one draw call however many strokes it has.
const SEGMENTS: Record<string, string> = {
  "0": "abcdef",
  "1": "bc",
  "2": "abdeg",
  "3": "abcdg",
  "4": "bcfg",
  "5": "acdfg",
  "6": "acdefg",
  "7": "abc",
  "8": "abcdefg",
  "9": "abcdfg",
};

function build(text: string, h: number, stroke: number, depth: number): BufferGeometry {
  const w = h * 0.56;
  const gap = h * 0.32;
  const parts: BufferGeometry[] = [];
  const total = text.length * w + (text.length - 1) * gap;
  [...text].forEach((ch, i) => {
    const cx = -total / 2 + w / 2 + i * (w + gap);
    for (const s of SEGMENTS[ch] ?? "") {
      const horizontal = s === "a" || s === "d" || s === "g";
      const g = horizontal ? new BoxGeometry(w, stroke, depth) : new BoxGeometry(stroke, h / 2 + stroke / 2, depth);
      const x = horizontal ? 0 : s === "b" || s === "c" ? w / 2 - stroke / 2 : -w / 2 + stroke / 2;
      const y =
        s === "a" ? h / 2 - stroke / 2 : s === "d" ? -h / 2 + stroke / 2 : s === "g" ? 0 : s === "b" || s === "f" ? h / 4 : -h / 4;
      g.translate(cx + x, y, depth / 2);
      parts.push(g);
    }
  });
  const merged = mergeGeometries(parts)!;
  parts.forEach((p) => p.dispose());
  return merged;
}

/** A number in raised strokes, centred on `position`, facing +z. */
export function Digits({
  text,
  height,
  color,
  position,
}: {
  text: string;
  height: number;
  color: string;
  position: [number, number, number];
}) {
  const geometry = useMemo(() => build(text, height, height * 0.16, 0.008), [text, height]);
  return (
    <mesh geometry={geometry} position={position}>
      <meshStandardMaterial color={color} roughness={0.55} metalness={0} />
    </mesh>
  );
}
