"use client";

import { ContactShadows, PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState, type RefObject } from "react";
import { MathUtils, NeutralToneMapping, Vector3, type Group } from "three";
import { Counter } from "./Counter";
import { Finding } from "./Finding";
import { Gate } from "./Gate";
import { Lights } from "./Lighting";
import { FINDINGS, GATE_X, SWEEP_END_X } from "./layout";
import { Parcels } from "./Parcels";
import { Shelves } from "./Shelves";
import { Shop } from "./Shop";
import { Slab } from "./Slab";
import { Sweep, type SweepState } from "./Sweep";

// The hero diorama: "a miniature store being read". A floating slab with a
// shop, three shelves of product, a counter with a card terminal, parcels
// by the door and a scanner gate. Everything is built from boxes in code:
// no models, no textures, no image files.
//
// Timeline (seconds from the first rendered frame; Replay restarts it):
//   0.00  first frame; the card cross-fades from the poster (400 ms, CSS)
//   0.35  the reading light leaves the gate (fades in over 0.15 s)
//   0.35 to 2.75  it crosses the slab, 2.4 s, ease in-out (cubic). Each
//         finding rises in (0.35 s, CSS) as the light passes its x.
//   2.75 to 3.10  the light fades out. The findings stay.
// Idle, always: the slab bobs 0.6 deg (6 s period, with a 0.03 lift) and
// drifts 1.5 deg in yaw (14 s period). The camera follows the pointer
// over the hero by at most 3 deg per axis (damped) and tilts down by up
// to 6 deg as the hero scrolls away.

export type Pointer = { x: number; y: number };

const SWEEP_DELAY = 0.35;
const SWEEP_DUR = 2.4;
const FADE_IN = 0.15;
const FADE_OUT = 0.35;

const DEG = Math.PI / 180;
const BASE_AZ = 30 * DEG; // camera to the right of front
const BASE_EL = 46 * DEG; // and above, high enough that the slab fills a portrait card
const POINTER_MAX = 3 * DEG;
const SCROLL_TILT = 6 * DEG;
// Framing: the camera sits closer than a fit of the whole slab (zoom) and
// looks at a point well above it, so the slab fills the card's width and
// its near corner runs off the card's bottom edge, the way an island runs
// off the frame in squared-media.nl's hero. The empty band above is the
// card's sunrise gradient.
const FRAME = {
  tall: { zoom: 0.8, target: new Vector3(0.15, 2.08, 0.55) },
  // On a landscape card (the small poster) a fit by height, a little
  // tighter, and a lower aim.
  wide: { zoom: 0.66, target: new Vector3(0.15, 1.5, 0.45) },
} as const;

const easeInOutCubic = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);

function Rig({ pointer, scroll, still }: { pointer: RefObject<Pointer>; scroll: RefObject<number>; still: boolean }) {
  const { camera, size } = useThree();
  const cur = useRef({ az: BASE_AZ, el: BASE_EL });

  // Fit the slab (its width on a portrait card, its height on a landscape
  // one), then come in by the frame's zoom.
  const aspect = size.width / Math.max(1, size.height);
  const fov = 24 * DEG;
  const hHalf = Math.atan(Math.tan(fov / 2) * aspect);
  const frame = aspect > 1 ? FRAME.wide : FRAME.tall;
  const dist = frame.zoom * Math.max(2.75 / Math.tan(hHalf), 2.95 / Math.tan(fov / 2));
  const target = frame.target;

  useFrame((_, dt) => {
    const p = still ? { x: 0, y: 0 } : (pointer.current ?? { x: 0, y: 0 });
    const s = still ? 0 : (scroll.current ?? 0);
    const az = BASE_AZ + p.x * POINTER_MAX;
    const el = BASE_EL - p.y * POINTER_MAX + s * SCROLL_TILT;
    const k = Math.min(dt, 0.1);
    cur.current.az = still ? az : MathUtils.damp(cur.current.az, az, 3.5, k);
    cur.current.el = still ? el : MathUtils.damp(cur.current.el, el, 3.5, k);
    camera.position.setFromSphericalCoords(dist, Math.PI / 2 - cur.current.el, cur.current.az).add(target);
    if ("fov" in camera && camera.fov !== fov / DEG) {
      camera.fov = fov / DEG;
      camera.updateProjectionMatrix();
    }
    camera.lookAt(target);
  });
  return null;
}

function Scene({
  replay,
  still,
  onReady,
}: {
  replay: number;
  still: boolean;
  onReady: () => void;
}) {
  const root = useRef<Group>(null);
  const sweep = useRef<SweepState>({ x: GATE_X, alpha: 0 });
  const start = useRef<number | null>(null);
  const frames = useRef(0);
  const ready = useRef(false);
  const [shown, setShown] = useState(still ? FINDINGS.length : 0);
  const shownRef = useRef(shown);
  const lastReplay = useRef(replay);
  // drei Html mounted in the canvas's first commit can lose its content
  // when R3F connects its event target a moment later (the old React root
  // unmounts after the new one renders). Mounting the findings after the
  // first frame avoids that.
  const [labels, setLabels] = useState(false);

  // Replay: hide the findings and run the light again from the gate.
  useEffect(() => {
    if (replay === lastReplay.current) return;
    lastReplay.current = replay;
    start.current = -1; // resolved to a clock time on the next frame
  }, [replay]);

  useFrame(({ clock }) => {
    const now = clock.getElapsedTime();
    const g = root.current;
    if (g && !still) {
      const bob = Math.sin((now * 2 * Math.PI) / 6);
      g.rotation.x = 0.6 * DEG * bob;
      g.rotation.z = 0.3 * DEG * Math.cos((now * 2 * Math.PI) / 6);
      g.position.y = 0.03 * bob;
      g.rotation.y = 1.5 * DEG * Math.sin((now * 2 * Math.PI) / 14);
    }

    if (!ready.current) {
      frames.current += 1;
      if (frames.current === 1) setLabels(true);
      // useFrame runs before the render, so on the second call the first
      // frame is already on screen.
      if (frames.current >= 2) {
        ready.current = true;
        onReady();
        if (!still) start.current = now + SWEEP_DELAY;
      }
      return;
    }
    if (still) return;
    if (start.current === -1) start.current = now + 0.15;
    if (start.current === null) return;

    const t = now - start.current;
    const u = Math.min(1, Math.max(0, t / SWEEP_DUR));
    const x = GATE_X + (SWEEP_END_X - GATE_X) * easeInOutCubic(u);
    const fadeIn = Math.min(1, Math.max(0, t / FADE_IN));
    const fadeOut = t > SWEEP_DUR ? Math.max(0, 1 - (t - SWEEP_DUR) / FADE_OUT) : 1;
    sweep.current.x = x;
    sweep.current.alpha = t < 0 ? 0 : fadeIn * fadeOut;

    const count = t < 0 ? 0 : FINDINGS.filter((f) => x >= f.revealX).length;
    if (count !== shownRef.current) {
      shownRef.current = count;
      setShown(count);
    }
    if (t > SWEEP_DUR + FADE_OUT) start.current = null;
  });

  return (
    <group ref={root}>
      <Slab />
      <Gate />
      <Shelves />
      <Counter />
      <Shop />
      <Parcels />
      <Sweep state={sweep} />
      {labels && FINDINGS.map((f, i) => <Finding key={f.id} spec={f} on={i < shown} />)}
    </group>
  );
}

export default function Diorama({
  replay,
  pointer,
  scroll,
  active,
  still = false,
  onReady,
}: {
  replay: number;
  pointer: RefObject<Pointer>;
  scroll: RefObject<number>;
  /** False pauses the frame loop (hero off-screen, tab hidden, or the
   *  pipeline scene is the one rendering). */
  active: boolean;
  /** Poster mode: end state, no idle motion, no pointer. */
  still?: boolean;
  onReady: () => void;
}) {
  const [dpr, setDpr] = useState(() => Math.min(1.5, window.devicePixelRatio || 1));
  const [shadows, setShadows] = useState(true);

  return (
    <Canvas
      dpr={still ? window.devicePixelRatio : dpr}
      shadows="percentage"
      frameloop={active || still ? "always" : "never"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", preserveDrawingBuffer: still }}
      camera={{ fov: 24, near: 0.5, far: 80, position: [6, 5, 9] }}
      onCreated={({ gl }) => {
        gl.toneMapping = NeutralToneMapping;
        gl.toneMappingExposure = 1.0;
        gl.setClearColor(0x000000, 0);
      }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden="true"
    >
      {!still && (
        <PerformanceMonitor
          onDecline={() => {
            setDpr(1);
            setShadows(false);
          }}
        />
      )}
      <Rig pointer={pointer} scroll={scroll} still={still} />
      <Lights shadows={shadows} />
      <Scene replay={replay} still={still} onReady={onReady} />
      <ContactShadows
        position={[0, -0.95, 0]}
        scale={[13, 10]}
        resolution={512}
        far={2.6}
        blur={3.4}
        opacity={0.3}
        color="#1c2a22"
        frames={1}
      />
    </Canvas>
  );
}
