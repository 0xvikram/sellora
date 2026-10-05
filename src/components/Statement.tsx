"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { useRef } from "react";

const TEXT =
  "Two people. No account managers. The audit, the build and the numbers, from the people doing the work.";

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
  // Reduced motion: the .statement-word rule in globals.css pins opacity to 1.
  return (
    <motion.span className="statement-word" style={{ opacity }}>
      {word}{" "}
    </motion.span>
  );
}

// Large statement whose words darken as the reader scrolls through it.
// Server and client always render the same word spans (no reduced-motion
// branch in markup), so hydration matches; reduced motion is handled in CSS.
export function Statement() {
  const ref = useRef<HTMLParagraphElement>(null);
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
        {words.map((word, i) => (
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
