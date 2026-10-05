"use client";

import { useRef } from "react";
import { LADDER } from "@/lib/site";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { AnimatedBeam } from "./ui/animated-beam";
import { NumberTicker } from "./ui/number-ticker";
import { ShineBorder } from "./ui/shine-border";

// Ticks only the numbers inside a price string such as "$2,000–3,500 / month";
// the currency sign, the dash and the unit stay as written in site.ts.
function TickerPrice({ text, delay = 0 }: { text: string; delay?: number }) {
  const parts = text.split(/(\d[\d,]*)/);
  return (
    <span className="whitespace-nowrap">
      {parts.map((part, i) =>
        /^\d/.test(part) ? (
          <NumberTicker key={i} value={Number(part.replace(/,/g, ""))} delay={delay + i * 0.05} />
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  );
}

const BEAM = {
  curvature: 70,
  pathColor: "var(--color-ink)",
  pathOpacity: 0.2,
  pathWidth: 2,
  gradientStartColor: "#aab4ff",
  gradientStopColor: "#2438e0",
  duration: 3.2,
  className: "overflow-visible",
};

// Three steps that rise left to right, joined on desktop by beams.
export function Ladder() {
  const containerRef = useRef<HTMLDivElement>(null);
  // Beam 1 runs Audit -> Build, beam 2 Build -> Retainer.
  const out1 = useRef<HTMLSpanElement>(null);
  const in1 = useRef<HTMLSpanElement>(null);
  const out2 = useRef<HTMLSpanElement>(null);
  const in2 = useRef<HTMLSpanElement>(null);

  return (
    <section id="how" className="border-t border-line">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <SectionHead
          index="02"
          label="How it works"
          aside="Start with an audit. Go further only if it earns it."
        >
          Start small. Go further <span className="accent-word">only if it pays.</span>
        </SectionHead>

        <div ref={containerRef} className="relative mt-16">
          <ol className="relative grid gap-5 md:grid-cols-3 md:gap-8">
            {LADDER.map((rung, i) => (
              // Each card sits a step higher than the one before it on desktop.
              <li
                key={rung.step}
                className="relative md:mt-[var(--step)]"
                style={
                  { "--step": `${(LADDER.length - 1 - i) * 5 + 1}rem` } as React.CSSProperties
                }
              >
                {/* Beam anchors on the card's top edge (outside Reveal, whose
                    transform would skew the measured positions). */}
                {i < LADDER.length - 1 ? (
                  <span ref={i === 0 ? out1 : out2} className="absolute top-0 right-10 h-px w-px" aria-hidden="true" />
                ) : null}
                {i > 0 ? (
                  <span ref={i === 1 ? in1 : in2} className="absolute top-0 left-10 h-px w-px" aria-hidden="true" />
                ) : null}
                <Reveal delay={i * 0.12} className="h-full">
                  <div
                    tabIndex={0}
                    aria-labelledby={`rung-${rung.step}`}
                    className="group relative flex h-full flex-col rounded-2xl border border-line bg-card p-7 outline-none"
                  >
                    <ShineBorder
                      borderWidth={1.5}
                      duration={10}
                      shineColor={["#2438e0", "#aab4ff", "#e2643c"]}
                      className="opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                    />
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent font-mono text-xs text-white">
                        {rung.step}
                      </span>
                      <span className="font-mono text-sm text-ink-2">
                        <span className="sr-only">{rung.price}</span>
                        <span aria-hidden="true">
                          <TickerPrice text={rung.price} delay={0.2 + i * 0.15} />
                        </span>
                      </span>
                    </div>
                    <h3 id={`rung-${rung.step}`} className="mt-10 text-4xl font-medium tracking-tight">
                      {rung.title}
                    </h3>
                    <p className="mt-3 text-base leading-relaxed text-ink-2">{rung.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>

          <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden="true">
            <AnimatedBeam containerRef={containerRef} fromRef={out1} toRef={in1} {...BEAM} />
            <AnimatedBeam containerRef={containerRef} fromRef={out2} toRef={in2} delay={1.2} {...BEAM} />
          </div>
        </div>
      </div>
    </section>
  );
}
