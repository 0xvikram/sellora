"use client";

import { ContactShadows, Html, PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import {
  BoxGeometry,
  Color,
  CylinderGeometry,
  MathUtils,
  NeutralToneMapping,
  Object3D,
  Vector3,
  type InstancedMesh,
  type Mesh,
  type MeshBasicMaterial,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { Lights } from "./Lighting";
import { C, PRODUCT_TINTS } from "./palette";
import { PIPELINE_GATES } from "./pipeline-layout";

// The pipeline: every order passes five gates. A long ink conveyor on sage
// legs runs diagonally through the frame, from the far upper left toward
// the viewer. Parcels (sand, taped in ink both ways) and small product
// boxes ride it in a continuous loop. Five thin ink arches stand over the
// belt, one per job, each with a lime strip under its beam and a floating
// mono label. As an item passes a gate, the gate's strip flares lime, a
// faint lime sheet drops from the beam, and the item gets a small lime tag
// on its top, so items carry one to five tags by the end of the belt.
//
// Everything is derived from one clock and the items' positions (no
// per-item state), so a still frame is exact and a pause resumes cleanly.
//
// Camera: a slow dolly along the belt, tied to how far the section has
// scrolled through the viewport (`progress`, 0 to 1, damped), plus
// pointer parallax of at most 2 deg per axis.
//
// Draw calls stay low: the legs, braces, items, tapes, tags, slats, gate
// parts and strips are instanced meshes (one call each); only the five
// scan sheets are separate meshes, drawn only while they glow.

export type Pointer = { x: number; y: number };

const DEG = Math.PI / 180;

// Belt, in world units. x runs along the belt (items travel to +x).
const BELT_L = 17;
const BELT_W = 1.0;
const BELT_TOP = 0.86;
const BELT_T = 0.1;
const X0 = -BELT_L / 2;
const X1 = BELT_L / 2;
const LEG_XS = Array.from({ length: 9 }, (_, i) => X0 + 0.5 + i * ((BELT_L - 1) / 8));

// Gates.
const GATE_XS = [-5.2, -2.6, 0, 2.6, 5.2];
const GATE_H = 2.05;
const GATE_T = 0.07;
const GATE_Z = BELT_W / 2 + 0.22;
const SHEET_H = GATE_H - GATE_T - BELT_TOP - 0.02;

// Items.
const N = 26;
const PITCH = BELT_L / N;
const SPEED = 0.42; // units per second: an item passes a gate every ~6 s
const PARCEL: [number, number, number] = [0.44, 0.3, 0.38];
const PRODUCT: [number, number, number] = [0.24, 0.34, 0.24];
const TAG: [number, number, number] = [0.036, 0.014, 0.08];
const TAG_PITCH = 0.048;

// Belt slats: thin lighter bars across the belt that travel with it, so
// the belt itself reads as moving.
const SLATS = 60;
const SLAT_PITCH = BELT_L / SLATS;

// Lime strip and hairline: dim at rest, full lime (a little brighter) at a pass.
const STRIP_REST = new Color("#8fa31a");
const STRIP_HOT = new Color("#e4ff4a");
// The hairline along the beam's top edge rests nearer full lime.
const HAIR_REST = new Color("#b5cf10");

type ItemSpec = { product: boolean; scale: number; z: number; yaw: number; tint: number };

// Deterministic variety (no Math.random, so posters are stable).
const hash = (i: number, k: number) => {
  const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const ITEMS: ItemSpec[] = Array.from({ length: N }, (_, i) => ({
  product: i % 3 === 1,
  scale: 0.86 + 0.18 * hash(i, 1),
  z: (hash(i, 2) - 0.5) * 0.22,
  yaw: (hash(i, 3) - 0.5) * 0.22,
  tint: Math.floor(hash(i, 4) * PRODUCT_TINTS.length),
}));
const PARCEL_IDX = ITEMS.flatMap((it, i) => (it.product ? [] : [i]));
const PRODUCT_IDX = ITEMS.flatMap((it, i) => (it.product ? [i] : []));

const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};
const wrap = (v: number, m: number) => ((v % m) + m) % m;

/** Where item i is along the belt at time t. */
const itemX = (i: number, t: number) => X0 + wrap(i * PITCH + SPEED * t, BELT_L);

/** How hot gate g is at time t: it flares as an item crosses, then cools. */
function gateHeat(g: number, t: number) {
  let h = 0;
  for (let i = 0; i < N; i++) {
    const dx = itemX(i, t) - GATE_XS[g];
    if (dx >= -0.05 && dx < 0.6) h = Math.max(h, Math.exp(-Math.max(0, dx) * 7) * smooth(-0.05, 0.02, dx));
  }
  return h;
}

function useGeometries() {
  return useMemo(
    () => ({
      belt: new RoundedBoxGeometry(BELT_L, BELT_T, BELT_W, 2, 0.04),
      rail: new RoundedBoxGeometry(BELT_L + 0.08, 0.14, 0.05, 2, 0.02),
      roller: new CylinderGeometry(0.07, 0.07, BELT_W + 0.04, 20).rotateX(Math.PI / 2),
      leg: new RoundedBoxGeometry(0.08, BELT_TOP - BELT_T, 0.08, 2, 0.02),
      brace: new BoxGeometry(0.05, 0.05, 2 * 0.42),
      foot: new RoundedBoxGeometry(0.14, 0.02, 0.14, 2, 0.008),
      slat: new BoxGeometry(0.035, 0.004, BELT_W - 0.08),
      parcel: new RoundedBoxGeometry(...PARCEL, 2, 0.02),
      tapeA: new BoxGeometry(PARCEL[0] + 0.006, PARCEL[1] + 0.006, 0.05),
      tapeB: new BoxGeometry(0.045, PARCEL[1] + 0.008, PARCEL[2] + 0.006),
      product: new RoundedBoxGeometry(...PRODUCT, 2, 0.035),
      tag: new BoxGeometry(...TAG),
      post: new RoundedBoxGeometry(GATE_T, GATE_H, GATE_T, 2, 0.02),
      beam: new RoundedBoxGeometry(GATE_T, GATE_T, 2 * GATE_Z + GATE_T, 2, 0.02),
      gateFoot: new RoundedBoxGeometry(0.18, 0.02, 0.14, 2, 0.008),
      hairline: new BoxGeometry(0.006, 0.007, 2 * GATE_Z + GATE_T - 0.02),
      strip: new BoxGeometry(0.04, 0.016, 2 * GATE_Z - GATE_T),
      sheet: new BoxGeometry(0.02, SHEET_H, 2 * GATE_Z - 0.2),
    }),
    [],
  );
}

const dummy = new Object3D();

/** Static instanced parts: set the matrices once. */
function useStatic(ref: RefObject<InstancedMesh | null>, place: (i: number, o: Object3D) => void, count: number) {
  useEffect(() => {
    const m = ref.current;
    if (!m) return;
    for (let i = 0; i < count; i++) {
      dummy.position.set(0, 0, 0);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);
      place(i, dummy);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  }, [ref, place, count]);
}

function Conveyor({ g }: { g: ReturnType<typeof useGeometries> }) {
  const legs = useRef<InstancedMesh>(null);
  const braces = useRef<InstancedMesh>(null);
  const feet = useRef<InstancedMesh>(null);
  const placeLeg = useMemo(
    () => (i: number, o: Object3D) => o.position.set(LEG_XS[i >> 1], (BELT_TOP - BELT_T) / 2, i % 2 ? 0.42 : -0.42),
    [],
  );
  const placeBrace = useMemo(() => (i: number, o: Object3D) => o.position.set(LEG_XS[i], 0.26, 0), []);
  const placeFoot = useMemo(
    () => (i: number, o: Object3D) => o.position.set(LEG_XS[i >> 1], 0.01, i % 2 ? 0.42 : -0.42),
    [],
  );
  useStatic(legs, placeLeg, LEG_XS.length * 2);
  useStatic(braces, placeBrace, LEG_XS.length);
  useStatic(feet, placeFoot, LEG_XS.length * 2);
  return (
    <group>
      <mesh geometry={g.belt} position={[0, BELT_TOP - BELT_T / 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={C.ink} roughness={0.62} metalness={0} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} geometry={g.rail} position={[0, BELT_TOP - 0.04, s * (BELT_W / 2 + 0.025)]} castShadow receiveShadow>
          <meshStandardMaterial color={C.sageDeep} roughness={0.7} metalness={0} />
        </mesh>
      ))}
      {[X0, X1].map((x) => (
        <mesh key={x} geometry={g.roller} position={[x, BELT_TOP - BELT_T / 2, 0]} castShadow>
          <meshStandardMaterial color={C.sageDeep} roughness={0.55} metalness={0} />
        </mesh>
      ))}
      <instancedMesh ref={legs} args={[g.leg, undefined, LEG_XS.length * 2]} castShadow receiveShadow>
        <meshStandardMaterial color={C.sageSide} roughness={0.75} metalness={0} />
      </instancedMesh>
      <instancedMesh ref={braces} args={[g.brace, undefined, LEG_XS.length]} castShadow>
        <meshStandardMaterial color={C.sageSide} roughness={0.75} metalness={0} />
      </instancedMesh>
      <instancedMesh ref={feet} args={[g.foot, undefined, LEG_XS.length * 2]} receiveShadow>
        <meshStandardMaterial color={C.sageDeep} roughness={0.7} metalness={0} />
      </instancedMesh>
    </group>
  );
}

function Gates({
  g,
  heat,
  labels,
}: {
  g: ReturnType<typeof useGeometries>;
  heat: RefObject<number[]>;
  labels: boolean;
}) {
  const posts = useRef<InstancedMesh>(null);
  const beams = useRef<InstancedMesh>(null);
  const feet = useRef<InstancedMesh>(null);
  const hairlines = useRef<InstancedMesh>(null);
  const strips = useRef<InstancedMesh>(null);
  const sheets = useRef<(Mesh | null)[]>([]);
  const labelEls = useRef<(HTMLDivElement | null)[]>([]);
  const n = GATE_XS.length;
  const placePost = useMemo(() => (i: number, o: Object3D) => o.position.set(GATE_XS[i >> 1], GATE_H / 2, i % 2 ? GATE_Z : -GATE_Z), []);
  const placeBeam = useMemo(() => (i: number, o: Object3D) => o.position.set(GATE_XS[i], GATE_H - GATE_T / 2, 0), []);
  const placeFoot = useMemo(() => (i: number, o: Object3D) => o.position.set(GATE_XS[i >> 1], 0.01, i % 2 ? GATE_Z : -GATE_Z), []);
  const placeHair = useMemo(
    () => (i: number, o: Object3D) => o.position.set(GATE_XS[i] + GATE_T / 2 - 0.002, GATE_H - 0.004, 0),
    [],
  );
  const placeStrip = useMemo(() => (i: number, o: Object3D) => o.position.set(GATE_XS[i], GATE_H - GATE_T - 0.008, 0), []);
  useStatic(posts, placePost, n * 2);
  useStatic(beams, placeBeam, n);
  useStatic(feet, placeFoot, n * 2);
  useStatic(hairlines, placeHair, n);
  useStatic(strips, placeStrip, n);

  const c = useMemo(() => new Color(), []);
  const on = useRef<boolean[]>(Array(n).fill(false));
  useFrame(() => {
    const h = heat.current;
    const s = strips.current;
    const hl = hairlines.current;
    if (!h || !s || !hl) return;
    for (let i = 0; i < n; i++) {
      c.copy(STRIP_REST).lerp(STRIP_HOT, h[i]);
      s.setColorAt(i, c);
      c.copy(HAIR_REST).lerp(STRIP_HOT, h[i]);
      hl.setColorAt(i, c);
      const sheet = sheets.current[i];
      if (sheet) {
        (sheet.material as MeshBasicMaterial).opacity = 0.11 * h[i];
        sheet.visible = h[i] > 0.02;
      }
      const hot = h[i] > 0.35;
      if (hot !== on.current[i]) {
        on.current[i] = hot;
        const el = labelEls.current[i];
        if (el) el.toggleAttribute("data-hot", hot);
      }
    }
    if (s.instanceColor) s.instanceColor.needsUpdate = true;
    if (hl.instanceColor) hl.instanceColor.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh ref={posts} args={[g.post, undefined, n * 2]} castShadow receiveShadow>
        <meshStandardMaterial color={C.ink} roughness={0.55} metalness={0} />
      </instancedMesh>
      <instancedMesh ref={beams} args={[g.beam, undefined, n]} castShadow>
        <meshStandardMaterial color={C.ink} roughness={0.55} metalness={0} />
      </instancedMesh>
      <instancedMesh ref={feet} args={[g.gateFoot, undefined, n * 2]} receiveShadow>
        <meshStandardMaterial color={C.ink} roughness={0.6} metalness={0} />
      </instancedMesh>
      <instancedMesh
        ref={(m) => {
          hairlines.current = m;
          if (m && !m.instanceColor) for (let i = 0; i < n; i++) m.setColorAt(i, HAIR_REST);
        }}
        args={[g.hairline, undefined, n]}
      >
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </instancedMesh>
      <instancedMesh
        ref={(m) => {
          strips.current = m;
          if (m && !m.instanceColor) for (let i = 0; i < n; i++) m.setColorAt(i, STRIP_REST);
        }}
        args={[g.strip, undefined, n]}
      >
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </instancedMesh>
      {GATE_XS.map((x, i) => (
        <mesh
          key={x}
          geometry={g.sheet}
          position={[x, BELT_TOP + 0.02 + SHEET_H / 2, 0]}
          visible={false}
          renderOrder={2}
          ref={(mesh) => {
            sheets.current[i] = mesh;
          }}
        >
          <meshBasicMaterial
            color={C.lime}
            transparent
            opacity={0}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
      {labels &&
        PIPELINE_GATES.map((gate, i) => (
          <Html key={gate.id} position={[GATE_XS[i], GATE_H + 0.02, 0]} zIndexRange={[4, 0]} style={{ pointerEvents: "none" }}>
            <div
              ref={(el) => {
                labelEls.current[i] = el;
              }}
              className="pipe-label"
              data-gate={gate.id}
              aria-hidden="true"
            >
              <span className="pipe-pill">
                <span className="pipe-marker" />
                <span className="pipe-index">{String(i + 1).padStart(2, "0")}</span>
                <span>{gate.label}</span>
              </span>
              <span className="pipe-leader" />
            </div>
          </Html>
        ))}
    </group>
  );
}

function Goods({
  g,
  clock,
}: {
  g: ReturnType<typeof useGeometries>;
  clock: RefObject<number>;
}) {
  const parcels = useRef<InstancedMesh>(null);
  const tapeA = useRef<InstancedMesh>(null);
  const tapeB = useRef<InstancedMesh>(null);
  const products = useRef<InstancedMesh>(null);
  const tags = useRef<InstancedMesh>(null);
  const tmp = useMemo(() => new Vector3(), []);

  // Product tints, once.
  useEffect(() => {
    const m = products.current;
    if (!m) return;
    const c = new Color();
    PRODUCT_IDX.forEach((idx, k) => m.setColorAt(k, c.set(PRODUCT_TINTS[ITEMS[idx].tint])));
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, []);

  useFrame(() => {
    const t = clock.current ?? 0;
    const P = parcels.current;
    const A = tapeA.current;
    const B = tapeB.current;
    const R = products.current;
    const T = tags.current;
    if (!P || !A || !B || !R || !T) return;
    let pk = 0;
    let rk = 0;
    for (let i = 0; i < N; i++) {
      const it = ITEMS[i];
      const x = itemX(i, t);
      // Rise out of the belt's start, sink into its end.
      const f = smooth(X0, X0 + 0.7, x) * smooth(X1, X1 - 0.7, x);
      const s = it.scale * f;
      const size = it.product ? PRODUCT : PARCEL;
      const h = size[1] * s;
      dummy.position.set(x, BELT_TOP + h / 2, it.z);
      dummy.rotation.set(0, it.yaw, 0);
      dummy.scale.setScalar(Math.max(s, 1e-4));
      dummy.updateMatrix();
      if (it.product) {
        R.setMatrixAt(rk++, dummy.matrix);
      } else {
        P.setMatrixAt(pk, dummy.matrix);
        A.setMatrixAt(pk, dummy.matrix);
        B.setMatrixAt(pk, dummy.matrix);
        pk++;
      }
      // Tags: one per gate passed, in a row across the top, each popping
      // up as its gate is crossed.
      const top = BELT_TOP + h + (TAG[1] / 2) * f;
      for (let k = 0; k < GATE_XS.length; k++) {
        const pop = smooth(0, 0.18, x - GATE_XS[k]) * f;
        tmp.set((k - 2) * TAG_PITCH * it.scale, 0, 0).applyAxisAngle(UP, it.yaw);
        dummy.position.set(x + tmp.x, top, it.z + tmp.z);
        dummy.rotation.set(0, it.yaw, 0);
        dummy.scale.set(Math.max(pop, 1e-4), Math.max(pop, 1e-4), Math.max(pop, 1e-4));
        dummy.updateMatrix();
        T.setMatrixAt(i * GATE_XS.length + k, dummy.matrix);
      }
    }
    P.instanceMatrix.needsUpdate = true;
    A.instanceMatrix.needsUpdate = true;
    B.instanceMatrix.needsUpdate = true;
    R.instanceMatrix.needsUpdate = true;
    T.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh ref={parcels} args={[g.parcel, undefined, PARCEL_IDX.length]} castShadow receiveShadow frustumCulled={false}>
        <meshStandardMaterial color={C.parcelSand} roughness={0.8} metalness={0} />
      </instancedMesh>
      <instancedMesh ref={tapeA} args={[g.tapeA, undefined, PARCEL_IDX.length]} frustumCulled={false}>
        <meshStandardMaterial color={C.ink} roughness={0.55} metalness={0} />
      </instancedMesh>
      <instancedMesh ref={tapeB} args={[g.tapeB, undefined, PARCEL_IDX.length]} frustumCulled={false}>
        <meshStandardMaterial color={C.ink} roughness={0.55} metalness={0} />
      </instancedMesh>
      <instancedMesh ref={products} args={[g.product, undefined, PRODUCT_IDX.length]} castShadow receiveShadow frustumCulled={false}>
        <meshStandardMaterial color="#ffffff" roughness={0.6} metalness={0} />
      </instancedMesh>
      <instancedMesh ref={tags} args={[g.tag, undefined, N * GATE_XS.length]} frustumCulled={false}>
        <meshStandardMaterial color={C.lime} emissive={C.lime} emissiveIntensity={0.45} roughness={0.4} metalness={0} />
      </instancedMesh>
    </group>
  );
}

const UP = new Vector3(0, 1, 0);

function Slats({ g, clock }: { g: ReturnType<typeof useGeometries>; clock: RefObject<number> }) {
  const ref = useRef<InstancedMesh>(null);
  useFrame(() => {
    const m = ref.current;
    if (!m) return;
    const t = clock.current ?? 0;
    for (let i = 0; i < SLATS; i++) {
      const x = X0 + 0.1 + wrap(i * SLAT_PITCH + SPEED * t, BELT_L - 0.2);
      dummy.position.set(x, BELT_TOP + 0.002, 0);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[g.slat, undefined, SLATS]} receiveShadow frustumCulled={false}>
      <meshStandardMaterial color="#26332b" roughness={0.7} metalness={0} />
    </instancedMesh>
  );
}

// Camera: the dolly runs the target from DOLLY[0] to DOLLY[1] along the
// belt as the section scrolls through the viewport.
const DOLLY = [-2.8, 2.8] as const;
// A wide card looks along the belt from the front right; a narrower one
// (the 4:3 small poster) swings further round and up, so the belt runs
// more steeply across the frame and all five gates fit.
const VIEW = {
  wide: { az: 34 * DEG, el: 25 * DEG, halfW: 6.2 },
  narrow: { az: 62 * DEG, el: 30 * DEG, halfW: 4.3 },
} as const;
const POINTER_MAX = 2 * DEG;
const FOV = 22;
const TARGET = new Vector3();

function Rig({
  progress,
  pointer,
  still,
}: {
  progress: RefObject<number>;
  pointer: RefObject<Pointer>;
  still: boolean;
}) {
  const size = useThree((s) => s.size);
  const cur = useRef({ p: -1, az: 0, el: 0 });
  const aspect = size.width / Math.max(1, size.height);
  // About 12 units of belt across a 16:7 card.
  const view = aspect > 2 ? VIEW.wide : VIEW.narrow;
  const dist = view.halfW / (Math.tan((FOV / 2) * DEG) * aspect);

  // The canvas's camera prop sets the fov; this moves and aims it.
  useFrame(({ camera }, dt) => {
    const k = Math.min(dt, 0.1);
    const p = still ? 0.5 : (progress.current ?? 0);
    const ptr = still ? { x: 0, y: 0 } : (pointer.current ?? { x: 0, y: 0 });
    const c = cur.current;
    // The first frame starts where the scroll is, without easing in.
    const first = c.p < 0;
    c.p = still || first ? p : MathUtils.damp(c.p, p, 4, k);
    const az = view.az + ptr.x * POINTER_MAX;
    const el = view.el - ptr.y * POINTER_MAX;
    c.az = still || first ? az : MathUtils.damp(c.az, az, 3.5, k);
    c.el = still || first ? el : MathUtils.damp(c.el, el, 3.5, k);
    TARGET.set(MathUtils.lerp(DOLLY[0], DOLLY[1], c.p), BELT_TOP + 0.4, 0);
    camera.position.setFromSphericalCoords(dist, Math.PI / 2 - c.el, c.az).add(TARGET);
    camera.lookAt(TARGET);
  });
  return null;
}

/** The poster's moment: items spread along the belt with their tags. */
const STILL_T = 9.3;

function Scene({ still, onReady }: { still: boolean; onReady: () => void }) {
  const g = useGeometries();
  const clock = useRef(still ? STILL_T : 0);
  const heat = useRef<number[]>(GATE_XS.map(() => 0));
  const frames = useRef(0);
  const [labels, setLabels] = useState(false);

  useFrame((_, dt) => {
    if (!still) clock.current += Math.min(dt, 0.1);
    for (let i = 0; i < GATE_XS.length; i++) heat.current[i] = gateHeat(i, clock.current);
    if (frames.current < 2) {
      frames.current += 1;
      // Labels mount after the first frame (see Diorama.tsx on drei Html).
      if (frames.current === 1) setLabels(true);
      if (frames.current === 2) onReady();
    }
  });

  return (
    <group>
      <Conveyor g={g} />
      <Slats g={g} clock={clock} />
      <Gates g={g} heat={heat} labels={labels} />
      <Goods g={g} clock={clock} />
    </group>
  );
}

export default function Pipeline({
  progress,
  pointer,
  active,
  still = false,
  onReady,
}: {
  progress: RefObject<number>;
  pointer: RefObject<Pointer>;
  /** False pauses the frame loop (off-screen, tab hidden, or the hero is
   *  the scene rendering). */
  active: boolean;
  still?: boolean;
  onReady: () => void;
}) {
  const [dpr, setDpr] = useState(() => Math.min(1.5, window.devicePixelRatio || 1));
  const [shadows, setShadows] = useState(true);
  return (
    <Canvas
      dpr={still ? Math.min(2, window.devicePixelRatio) : dpr}
      shadows="percentage"
      frameloop={active || still ? "always" : "never"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", preserveDrawingBuffer: still }}
      camera={{ fov: FOV, near: 0.5, far: 80, position: [6, 4, 9] }}
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
      <Rig progress={progress} pointer={pointer} still={still} />
      <Lights shadows={shadows} bounds={9} mapSize={2048} />
      <Scene still={still} onReady={onReady} />
      <ContactShadows
        position={[0, 0, 0]}
        scale={[22, 8]}
        resolution={1024}
        far={0.8}
        blur={2.4}
        opacity={0.3}
        color="#1c2a22"
        frames={1}
      />
    </Canvas>
  );
}
