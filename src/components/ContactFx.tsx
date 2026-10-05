"use client";

import { useEffect, useRef, useState } from "react";
import { Particles } from "./ui/particles";
import VariableProximity from "./ui/VariableProximity";

// Effects for the dark closing section. Both start as nothing / plain text
// and only switch on after hydration, for mouse pointers with motion allowed.
function useFancy(needsFinePointer: boolean) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(pointer: fine)");
    const update = () => setOn(!reduced.matches && (!needsFinePointer || fine.matches));
    update();
    reduced.addEventListener("change", update);
    fine.addEventListener("change", update);
    return () => {
      reduced.removeEventListener("change", update);
      fine.removeEventListener("change", update);
    };
  }, [needsFinePointer]);
  return on;
}

export function ContactParticles() {
  const on = useFancy(false);
  if (!on) return null;
  return (
    <Particles
      className="pointer-events-none absolute inset-0"
      quantity={55}
      staticity={40}
      ease={60}
      size={0.5}
      color="#8c98ff"
    />
  );
}

// Giant footer wordmark. Without JS, a touch screen or with reduced motion it
// is the plain outlined text; with a mouse the letters thicken near the cursor.
export function Wordmark({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const on = useFancy(true);
  return (
    <p
      ref={ref}
      className="text-outline-light -mb-[0.2em] text-center text-[15vw] leading-[0.85] font-semibold tracking-[-0.05em] whitespace-nowrap select-none"
      aria-hidden="true"
    >
      {on ? (
        <VariableProximity
          label={text}
          containerRef={ref}
          fromFontVariationSettings="'wght' 600"
          toFontVariationSettings="'wght' 900"
          radius={220}
          falloff="gaussian"
        />
      ) : (
        text
      )}
    </p>
  );
}
