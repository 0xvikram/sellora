"use client";

import type { MotionValue } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const LoopScene = dynamic(
  () => import("./three/LoopScene").then((m) => m.LoopScene),
  { ssr: false },
);

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

const PARCEL_DOTS = [
  { x: 64, y: 118, w: 34, h: 26, fill: "var(--color-accent)", r: -12 },
  { x: 304, y: 96, w: 26, h: 26, fill: "var(--color-clay)", r: 14 },
  { x: 334, y: 214, w: 32, h: 22, fill: "var(--color-leaf)", r: -8 },
  { x: 236, y: 300, w: 24, h: 30, fill: "var(--color-sun)", r: 10 },
  { x: 96, y: 282, w: 20, h: 20, fill: "var(--color-ink)", r: 20 },
  { x: 168, y: 48, w: 30, h: 22, fill: "var(--color-card)", r: -6 },
];

// Static stand-in for the 3D loop: shown while three.js loads, and kept for
// reduced motion or when the browser has no WebGL.
function LoopPlaceholder() {
  return (
    <svg viewBox="0 0 400 360" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="loop-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="0.5" stopColor="var(--color-accent-soft)" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <ellipse cx="200" cy="318" rx="130" ry="12" fill="var(--color-ink)" opacity="0.06" />
      <ellipse cx="200" cy="186" rx="132" ry="70" fill="none" stroke="var(--color-line-2)" strokeWidth="40" />
      <ellipse cx="200" cy="186" rx="132" ry="70" fill="none" stroke="url(#loop-glass)" strokeWidth="36" />
      <ellipse cx="200" cy="172" rx="132" ry="66" fill="none" stroke="#fff" strokeOpacity="0.8" strokeWidth="3" />
      {PARCEL_DOTS.map((p) => (
        <rect
          key={p.fill}
          x={p.x}
          y={p.y}
          width={p.w}
          height={p.h}
          rx="5"
          fill={p.fill}
          stroke="var(--color-line)"
          transform={`rotate(${p.r} ${p.x + p.w / 2} ${p.y + p.h / 2})`}
        />
      ))}
    </svg>
  );
}

export function HeroScene({
  pointerX,
  pointerY,
  progress,
  className = "",
}: {
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  progress: MotionValue<number>;
  className?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"static" | "3d">("static");
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !hasWebGL()) return;
    // Let the headline animation finish first; three.js is ~250 kB.
    const id = window.setTimeout(() => setMode("3d"), 300);
    return () => window.clearTimeout(id);
  }, []);

  // Stop rendering entirely while the hero is off screen.
  useEffect(() => {
    const el = box.current;
    if (!el || mode !== "3d") return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: "80px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, [mode]);

  return (
    <div ref={box} className={`pointer-events-none ${className}`} aria-hidden="true">
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}
      >
        <LoopPlaceholder />
      </div>
      {mode === "3d" && (
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}
        >
          <LoopScene
            active={visible}
            pointerX={pointerX}
            pointerY={pointerY}
            progress={progress}
            onReady={() => setReady(true)}
          />
        </div>
      )}
    </div>
  );
}
