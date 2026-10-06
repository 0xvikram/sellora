"use client";

import { motion, useMotionValue, useReducedMotion, useScroll } from "framer-motion";
import { useRef } from "react";
import { BOOKING_URL } from "@/lib/site";
import { Magnetic } from "./fx/Magnetic";
import { HeroScene } from "./HeroScene";

const EASE = [0.22, 1, 0.36, 1] as const;
const LINES = ["More orders from", "the customers you"];

export function Hero() {
  const reduced = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const rise = (delay: number) => ({
    initial: reduced ? false : ({ opacity: 0, y: 24 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE },
  });

  return (
    <section
      ref={section}
      id="top"
      className="relative overflow-hidden"
      onPointerMove={(e) => {
        if (reduced || e.pointerType !== "mouse") return;
        const box = e.currentTarget.getBoundingClientRect();
        px.set(((e.clientX - box.left) / box.width - 0.5) * 2);
        py.set(((e.clientY - box.top) / box.height - 0.5) * 2);
      }}
    >
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 pt-14 pb-20 md:px-8 md:pt-20 md:pb-28 xl:grid-cols-[1.25fr_0.75fr] xl:items-center">
        <div>
          <motion.p {...rise(0)} className="eyebrow flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            For e-commerce and D2C brands
          </motion.p>

          <h1 className="mt-6 font-display text-[clamp(2.1rem,10.2vw,2.75rem)] leading-[0.98] font-bold tracking-[-0.03em] sm:text-7xl xl:text-[5.2rem]">
            {LINES.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  className="block"
                  initial={reduced ? false : { y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.1 + i * 0.1, ease: EASE }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
            <span className="block overflow-hidden pb-[0.16em]">
              <motion.span
                className="accent-word block"
                initial={reduced ? false : { y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
              >
                already have.
              </motion.span>
            </span>
          </h1>

          <motion.p {...rise(0.45)} className="mt-7 max-w-xl text-lg leading-relaxed text-ink-2">
            AI creative, AI-search visibility, retention and automation for
            online stores. Fixed prices, shown here.
          </motion.p>

          <motion.div {...rise(0.55)} className="mt-9 flex flex-wrap items-center gap-5">
            <Magnetic>
              <a
                href={BOOKING_URL}
                className="inline-flex items-center gap-3 rounded-full bg-accent py-2 pr-2 pl-6 text-base font-medium text-white"
              >
                Book a 20-minute call
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-accent">
                  →
                </span>
              </a>
            </Magnetic>
            <a
              href="#services"
              className="group flex items-center gap-2 border-b border-ink pb-1 text-base font-medium"
            >
              See services and prices
              <span className="transition-transform group-hover:translate-y-0.5" aria-hidden="true">
                ↓
              </span>
            </a>
          </motion.div>
        </div>

        {/* The scene: the 3D reorder loop, alone, with a soft glow behind it */}
        <div className="relative mx-auto h-[17rem] w-full max-w-[26rem] sm:h-[24rem] xl:h-[35rem] xl:max-w-none" aria-hidden="true">
          <div className="pointer-events-none absolute top-1/2 left-1/2 h-[14rem] w-[14rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-soft opacity-50 blur-3xl sm:h-[20rem] sm:w-[20rem] xl:h-[26rem] xl:w-[26rem]" />
          <HeroScene
            pointerX={px}
            pointerY={py}
            progress={scrollYProgress}
            className="absolute inset-y-0 -inset-x-5 [mask-image:radial-gradient(ellipse_60%_55%_at_50%_50%,#000_70%,transparent_100%)] sm:-inset-x-16 xl:-right-28 xl:-left-14"
          />
        </div>
      </div>
    </section>
  );
}
