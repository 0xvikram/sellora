"use client";

import {
  AdaptiveDpr,
  ContactShadows,
  Environment,
  Float,
  Lightformer,
  MeshTransmissionMaterial,
  PerformanceMonitor,
  RoundedBox,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { Color, MathUtils } from "three";
import type { Group } from "three";

// The "reorder loop": a glass ring for repeat orders, with parcels
// travelling around it. Loaded client-side only, from HeroScene.

const PAPER = "#f5f1e8";

type Parcel = {
  color: string;
  size: [number, number, number];
  radius: number;
  speed: number;
  phase: number;
  lift: number;
};

const PARCELS: Parcel[] = [
  { color: "#2438e0", size: [0.5, 0.36, 0.36], radius: 1.75, speed: 0.22, phase: 0.2, lift: 0.18 },
  { color: "#e2643c", size: [0.34, 0.34, 0.34], radius: 1.6, speed: 0.27, phase: 1.8, lift: -0.12 },
  { color: "#2f8f5b", size: [0.42, 0.28, 0.3], radius: 1.65, speed: 0.19, phase: 3.3, lift: 0.08 },
  { color: "#f0b84a", size: [0.3, 0.3, 0.42], radius: 1.85, speed: 0.25, phase: 4.9, lift: -0.2 },
];

function OrbitingParcel({ parcel, index }: { parcel: Parcel; index: number }) {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    const g = ref.current;
    if (!g) return;
    const a = parcel.phase + clock.elapsedTime * parcel.speed;
    g.position.set(Math.cos(a) * parcel.radius, Math.sin(a) * parcel.radius, parcel.lift);
    g.rotation.set(a * 0.6, a * 0.9, a * 0.4);
  });
  return (
    <group ref={ref}>
      <Float speed={1.4 + index * 0.15} rotationIntensity={0.4} floatIntensity={0.5}>
        <RoundedBox args={parcel.size} radius={0.06} smoothness={3} castShadow>
          <meshStandardMaterial color={parcel.color} roughness={0.5} metalness={0.05} />
        </RoundedBox>
      </Float>
    </group>
  );
}

function Ring({ cheap }: { cheap: boolean }) {
  const paper = useMemo(() => new Color(PAPER), []);
  return (
    <mesh>
      <torusGeometry args={[1.15, 0.32, 48, 128]} />
      {cheap ? (
        <meshPhysicalMaterial
          color="#eef0ff"
          transmission={1}
          thickness={0.6}
          roughness={0.12}
          ior={1.3}
          clearcoat={1}
        />
      ) : (
        <MeshTransmissionMaterial
          background={paper}
          samples={6}
          resolution={512}
          thickness={0.45}
          roughness={0.08}
          ior={1.3}
          chromaticAberration={0.05}
          anisotropy={0.1}
          distortion={0.15}
          distortionScale={0.3}
          temporalDistortion={0}
          color="#eef0ff"
        />
      )}
    </mesh>
  );
}

// Eases the whole loop toward the pointer and turns it with scroll.
function Rig({
  pointerX,
  pointerY,
  progress,
  cheap,
}: {
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  progress: MotionValue<number>;
  cheap: boolean;
}) {
  const ref = useRef<Group>(null);
  useFrame((_, delta) => {
    const g = ref.current;
    if (!g) return;
    const scroll = progress.get();
    const ty = pointerX.get() * 0.15 + scroll * 0.9;
    const tx = -1.05 + pointerY.get() * 0.15 + scroll * 0.25;
    g.rotation.y = MathUtils.damp(g.rotation.y, ty, 3, delta);
    g.rotation.x = MathUtils.damp(g.rotation.x, tx, 3, delta);
    g.rotation.z += delta * 0.05;
  });
  return (
    <group ref={ref} rotation={[-1.05, 0, 0]}>
      <Ring cheap={cheap} />
      {PARCELS.map((parcel, i) => (
        <OrbitingParcel key={parcel.color} parcel={parcel} index={i} />
      ))}
    </group>
  );
}

export function LoopScene({
  active,
  pointerX,
  pointerY,
  progress,
  onReady,
}: {
  active: boolean;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  progress: MotionValue<number>;
  onReady: () => void;
}) {
  const [dpr, setDpr] = useState(1.5);
  const [cheap, setCheap] = useState(false);

  return (
    <Canvas
      dpr={[1, dpr]}
      frameloop={active ? "always" : "never"}
      performance={{ min: 0.5 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      flat
      camera={{ position: [0, 0.3, 7.2], fov: 34 }}
      onCreated={() => onReady()}
    >
      <PerformanceMonitor
        onDecline={() => setDpr(1)}
        onIncline={() => setDpr(1.5)}
        onFallback={() => {
          setDpr(1);
          setCheap(true);
        }}
        flipflops={3}
      />
      <AdaptiveDpr pixelated />

      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 4]} intensity={1.2} />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={2.4} position={[0, 4, -2]} scale={[8, 2, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={1.6} position={[-5, 1, 1]} scale={[3, 6, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" intensity={1.2} position={[5, 0, 2]} scale={[3, 5, 1]} rotation-y={-Math.PI / 2} />
        <Lightformer form="ring" color="#2438e0" intensity={0.8} position={[0, -3, 3]} scale={3} />
      </Environment>

      <Rig pointerX={pointerX} pointerY={pointerY} progress={progress} cheap={cheap} />

      <ContactShadows
        position={[0, -1.75, 0]}
        opacity={0.2}
        scale={6}
        blur={2.6}
        far={4.5}
        resolution={256}
        color="#16140f"
      />
    </Canvas>
  );
}
