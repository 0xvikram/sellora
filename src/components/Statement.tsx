"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { useRef } from "react";

const TEXT =
  "Two people. No account managers, no hand-offs. You get the audit, the build and the numbers from the people doing the work, at a price you saw before the first call.";

function Word({
  word,
  range,
  progress,
}: {
  word: string;
  range: [number, number];
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return <motion.span style={{ opacity }}>{word} </motion.span>;
}

// Large statement whose words darken as the reader scrolls through it.
export function Statement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });
  const words = TEXT.split(" ");

  return (
    <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-36">
      <p className="eyebrow">Who you work with</p>
      <p
        ref={ref}
        className="mt-6 max-w-6xl text-3xl leading-[1.16] font-medium tracking-[-0.02em] text-balance md:text-6xl md:leading-[1.1]"
      >
        {reduced
          ? TEXT
          : words.map((word, i) => (
              <Word
                key={`${word}-${i}`}
                word={word}
                progress={scrollYProgress}
                range={[i / words.length, (i + 1) / words.length]}
              />
            ))}
      </p>
    </section>
  );
}
