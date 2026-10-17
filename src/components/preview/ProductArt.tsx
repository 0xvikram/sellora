import type { CSSProperties, ReactNode } from "react";

// Code-drawn product "photography" for the sample store in the hero preview.
// Every object is a flat silhouette in one palette tone (--t), shaded with a
// shared cylinder gradient (a rim shadow, a soft highlight, a darker far
// side), standing on a tinted tabletop with a contact shadow and a longer
// cast shadow. No photographs, no generated images.
//
// Shapes are drawn on a 100 x 80 stage, centred on x = 50 with the base on
// y = 66, so a composition can place one anywhere with `at(x, y, scale)`.

export type Shape = "pump" | "dropper" | "jar" | "tube";
export type Tone = "sand" | "moss" | "clay" | "accent";

const INK = "#1c1a16";
const CARD = "#faf7f1";

export const toneVar = (tone: Tone) => ({ "--t": `var(--color-${tone})` }) as CSSProperties;

const fill = {
  body: { fill: "var(--t)" },
  dark: { fill: `color-mix(in oklab, var(--t) 62%, ${INK})` },
  darker: { fill: `color-mix(in oklab, var(--t) 38%, ${INK})` },
  label: { fill: `color-mix(in oklab, ${CARD} 90%, var(--t))` },
  labelInk: { fill: `color-mix(in oklab, var(--t) 45%, ${INK})` },
};

/** Gradients shared by every shape in one <svg>. ids must be unique per svg. */
function Defs({ id }: { id: string }) {
  return (
    <defs>
      {/* Cylinder shading laid over each body. */}
      <linearGradient id={`${id}-cyl`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor={INK} stopOpacity="0.2" />
        <stop offset="0.16" stopColor="#fff" stopOpacity="0.05" />
        <stop offset="0.27" stopColor="#fff" stopOpacity="0.42" />
        <stop offset="0.4" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.74" stopColor={INK} stopOpacity="0.05" />
        <stop offset="1" stopColor={INK} stopOpacity="0.26" />
      </linearGradient>
      {/* Contact shadow under an object. */}
      <radialGradient id={`${id}-contact`}>
        <stop offset="0" stopColor={INK} stopOpacity="0.34" />
        <stop offset="1" stopColor={INK} stopOpacity="0" />
      </radialGradient>
      {/* Window light falling on the wall from the top left. */}
      <radialGradient id={`${id}-light`} cx="0.18" cy="0.05" r="0.9">
        <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
      {/* Tabletop darkens slightly towards the viewer. */}
      <linearGradient id={`${id}-floor`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor={INK} stopOpacity="0.02" />
        <stop offset="1" stopColor={INK} stopOpacity="0.1" />
      </linearGradient>
    </defs>
  );
}

/** Contact shadow plus a longer cast shadow to the right (light is top left). */
function Shadow({ id, w }: { id: string; w: number }) {
  return (
    <g>
      <ellipse cx={50 + w * 0.42} cy={65.6} rx={w * 0.95} ry={2.1} fill={`url(#${id}-contact)`} opacity="0.55" />
      <ellipse cx={50} cy={66} rx={w * 0.62} ry={1.7} fill={`url(#${id}-contact)`} />
    </g>
  );
}

function Pump({ id }: { id: string }) {
  const body = "M38 34.5Q38 30 42.5 30H57.5Q62 30 62 34.5V63Q62 66 59 66H41Q38 66 38 63Z";
  return (
    <g>
      <Shadow id={id} w={13} />
      <rect x="48.7" y="17.5" width="2.6" height="7" style={fill.darker} />
      <rect x="43" y="13.4" width="15.5" height="4.4" rx="2" style={fill.darker} />
      <rect x="57" y="14.2" width="8" height="2.4" rx="1.1" style={fill.darker} />
      <rect x="44.5" y="23.6" width="11" height="7" rx="1.2" style={fill.dark} />
      <path d={body} style={fill.body} />
      <rect x="41.5" y="40" width="17" height="17" rx="0.8" style={fill.label} />
      <rect x="44" y="44" width="12" height="1.6" rx="0.8" style={fill.labelInk} />
      <rect x="45.5" y="47.6" width="9" height="0.9" rx="0.45" style={fill.labelInk} opacity="0.55" />
      <rect x="46.5" y="52" width="7" height="0.9" rx="0.45" style={fill.labelInk} opacity="0.4" />
      <path d={body} fill={`url(#${id}-cyl)`} />
      <rect x="44.5" y="23.6" width="11" height="7" rx="1.2" fill={`url(#${id}-cyl)`} />
    </g>
  );
}

function Dropper({ id }: { id: string }) {
  const body = "M40 43Q40 36.5 46 36H54Q60 36.5 60 43V63Q60 66 57 66H43Q40 66 40 63Z";
  const bulb = "M46.4 30V21Q46.4 14 50 14Q53.6 14 53.6 21V30Z";
  return (
    <g>
      <Shadow id={id} w={11} />
      <path d={bulb} style={fill.darker} />
      <path d={bulb} fill={`url(#${id}-cyl)`} />
      <rect x="44.6" y="29" width="10.8" height="7.6" rx="1" style={fill.dark} />
      <rect x="44.6" y="29" width="10.8" height="7.6" rx="1" fill={`url(#${id}-cyl)`} />
      <path d={body} style={fill.body} />
      {/* Oil line seen through the glass. */}
      <path d="M40 50H60V63Q60 66 57 66H43Q40 66 40 63Z" style={fill.dark} opacity="0.35" />
      <rect x="42.6" y="46" width="14.8" height="11" rx="0.6" style={fill.label} />
      <rect x="45" y="49" width="10" height="1.4" rx="0.7" style={fill.labelInk} />
      <rect x="46.5" y="52.4" width="7" height="0.9" rx="0.45" style={fill.labelInk} opacity="0.5" />
      <path d={body} fill={`url(#${id}-cyl)`} />
    </g>
  );
}

function Jar({ id }: { id: string }) {
  const body = "M33 50H67V62.5Q67 66 63.5 66H36.5Q33 66 33 62.5Z";
  const lid = "M32 43.5Q32 41.5 34 41.5H66Q68 41.5 68 43.5V50.5H32Z";
  return (
    <g>
      <Shadow id={id} w={18} />
      <path d={body} style={fill.body} />
      <rect x="33" y="53.5" width="34" height="8.5" style={fill.label} />
      <rect x="44" y="56.4" width="12" height="1.5" rx="0.75" style={fill.labelInk} />
      <rect x="46" y="59.2" width="8" height="0.9" rx="0.45" style={fill.labelInk} opacity="0.5" />
      <path d={body} fill={`url(#${id}-cyl)`} />
      <path d={lid} style={fill.dark} />
      {/* Lid ridges. */}
      <g style={fill.darker} opacity="0.35">
        {[36, 40, 44, 48, 52, 56, 60, 64].map((x) => (
          <rect key={x} x={x} y="42.5" width="0.7" height="7" />
        ))}
      </g>
      <path d={lid} fill={`url(#${id}-cyl)`} />
    </g>
  );
}

function Tube({ id }: { id: string }) {
  const body = "M40.5 55.5L37.5 22H62.5L59.5 55.5Z";
  return (
    <g>
      <Shadow id={id} w={10} />
      <rect x="37" y="18" width="26" height="4.4" rx="0.6" style={fill.dark} />
      <g style={fill.darker} opacity="0.35">
        {[39, 42, 45, 48, 51, 54, 57, 60].map((x) => (
          <rect key={x} x={x} y="18.6" width="0.6" height="3.2" />
        ))}
      </g>
      <path d={body} style={fill.body} />
      <rect x="44" y="28" width="12" height="1.6" rx="0.8" style={fill.labelInk} />
      <rect x="45.5" y="31.6" width="9" height="0.9" rx="0.45" style={fill.labelInk} opacity="0.5" />
      <rect x="42.5" y="40" width="15" height="7" rx="0.6" style={fill.label} />
      <path d={body} fill={`url(#${id}-cyl)`} />
      <rect x="42.5" y="55" width="15" height="11" rx="1.6" style={fill.darker} />
      <rect x="42.5" y="55" width="15" height="11" rx="1.6" fill={`url(#${id}-cyl)`} />
    </g>
  );
}

const SHAPES: Record<Shape, (p: { id: string }) => ReactNode> = {
  pump: Pump,
  dropper: Dropper,
  jar: Jar,
  tube: Tube,
};

/** Place a shape with its base centre at (x, y), scaled by s. */
function Placed({ id, shape, tone, x, y, s }: { id: string; shape: Shape; tone: Tone; x: number; y: number; s: number }) {
  const Draw = SHAPES[shape];
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) translate(-50 -66)`} style={toneVar(tone)}>
      <Draw id={id} />
    </g>
  );
}

/** Wall, tabletop and window light, in a light version of the scene tone. */
function Backdrop({ id, w, h, horizon }: { id: string; w: number; h: number; horizon: number }) {
  return (
    <g>
      <rect width={w} height={h} style={{ fill: `color-mix(in oklab, var(--t) 24%, ${CARD})` }} />
      <rect width={w} height={h} fill={`url(#${id}-light)`} />
      <rect y={horizon} width={w} height={h - horizon} style={{ fill: `color-mix(in oklab, var(--t) 36%, ${CARD})` }} />
      <rect y={horizon} width={w} height={h - horizon} fill={`url(#${id}-floor)`} />
      <rect y={horizon} width={w} height="0.5" fill="#fff" opacity="0.5" />
    </g>
  );
}

/** One product shot for a grid card: 10:7, the object on a tinted set. */
export function ProductShot({ id, shape, tone, scene }: { id: string; shape: Shape; tone: Tone; scene: Tone }) {
  const scale = { pump: 1.04, dropper: 1.12, jar: 1.32, tube: 1.0 }[shape];
  return (
    <svg viewBox="0 0 100 70" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" style={toneVar(scene)}>
      <Defs id={id} />
      <Backdrop id={id} w={100} h={70} horizon={52} />
      <Placed id={id} shape={shape} tone={tone} x={50} y={63} s={scale} />
    </svg>
  );
}

/** The store hero's still life: an arch, a plinth and three products. */
export function HeroShot({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 120 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" style={toneVar("sand")}>
      <Defs id={id} />
      <Backdrop id={id} w={120} h={100} horizon={78} />
      {/* Arch in moss, with its own soft light. */}
      <g style={toneVar("moss")}>
        <path d="M34 78V44A26 26 0 0 1 86 44V78Z" style={{ fill: `color-mix(in oklab, var(--t) 42%, ${CARD})` }} />
        <path d="M34 78V44A26 26 0 0 1 86 44V78Z" fill={`url(#${id}-light)`} />
      </g>
      {/* Plinth. */}
      <g style={toneVar("sand")}>
        <ellipse cx="66" cy="84.5" rx="32" ry="2.6" fill={`url(#${id}-contact)`} opacity="0.7" />
        <rect x="36" y="72" width="54" height="12" rx="1" style={{ fill: `color-mix(in oklab, var(--t) 70%, ${CARD})` }} />
        <rect x="36" y="72" width="54" height="12" rx="1" fill={`url(#${id}-cyl)`} opacity="0.7" />
        <rect x="36" y="72" width="54" height="1" style={{ fill: `color-mix(in oklab, var(--t) 30%, #fff)` }} />
      </g>
      <Placed id={id} shape="pump" tone="accent" x={56} y={72.4} s={1.12} />
      <Placed id={id} shape="dropper" tone="clay" x={75} y={72.4} s={0.82} />
      <Placed id={id} shape="jar" tone="sand" x={42} y={90} s={0.72} />
    </svg>
  );
}
