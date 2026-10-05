"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { LADDER } from "@/lib/site";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

// The three steps sit on a rising line that draws itself as you scroll.
export function Ladder() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.55"],
  });
  const drawn = useSpring(scrollYProgress, { stiffness: 80, damping: 22 });

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

        <div ref={ref} className="relative mt-16">
          <svg
            viewBox="0 0 1200 220"
            preserveAspectRatio="none"
            className="absolute inset-x-0 top-0 hidden h-56 w-full md:block"
            aria-hidden="true"
          >
            <path
              d="M0 196 H380 C 410 196, 400 116, 430 116 H780 C 810 116, 800 36, 830 36 H1200"
              fill="none"
              stroke="var(--color-line-2)"
              strokeWidth="2"
              strokeDasharray="2 8"
              vectorEffect="non-scaling-stroke"
            />
            <motion.path
              d="M0 196 H380 C 410 196, 400 116, 430 116 H780 C 810 116, 800 36, 830 36 H1200"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
              style={{ pathLength: reduced ? 1 : drawn }}
            />
          </svg>

          <ol className="relative grid gap-5 md:grid-cols-3">
            {LADDER.map((rung, i) => (
              // Each card sits a step higher than the one before it on desktop.
              <li
                key={rung.step}
                className="md:mt-[var(--step)]"
                style={
                  { "--step": `${(LADDER.length - 1 - i) * 5 + 3}rem` } as React.CSSProperties
                }
              >
                <Reveal
                  delay={i * 0.12}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-card p-7 transition-colors hover:border-accent"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent font-mono text-xs text-white">
                      {rung.step}
                    </span>
                    <span className="font-mono text-sm text-ink-2">{rung.price}</span>
                  </div>
                  <h3 className="mt-10 text-4xl font-medium tracking-tight">{rung.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-ink-2">{rung.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
