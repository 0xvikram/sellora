"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import type { MotionValue } from "framer-motion";
import { useRef } from "react";
import type { ReactNode } from "react";
import { BOOKING_URL, SERVICES } from "@/lib/site";
import { Magnetic } from "./fx/Magnetic";
import { HeroScene } from "./HeroScene";

const EASE = [0.22, 1, 0.36, 1] as const;
const LINES = ["More orders from", "the customers you"];

function Receipt() {
  return (
    <div className="receipt-edge w-[19.5rem] bg-card px-6 pt-6 pb-9 font-mono text-[0.78rem] text-ink shadow-[0_30px_60px_-30px_rgba(22,20,15,0.45)]">
      <div className="flex items-baseline justify-between">
        <span className="tracking-[0.14em] uppercase">Price list</span>
        <span className="text-ink-3">No. 0001</span>
      </div>
      <p className="mt-1 text-ink-3">Priced before the first call</p>
      <div className="dashed-rule my-4" />
      <ul className="space-y-3">
        {SERVICES.map((service) => (
          <li key={service.id} className="flex items-baseline justify-between gap-3">
            <span>{service.short}</span>
            <span className="h-px flex-1 translate-y-[-3px] border-b border-dotted border-line-2" />
            <span className="whitespace-nowrap">{service.price}</span>
          </li>
        ))}
      </ul>
      <div className="dashed-rule my-4" />
      <div className="flex items-baseline justify-between">
        <span className="tracking-[0.14em] uppercase">Retainer required</span>
        <span className="font-semibold text-accent">None</span>
      </div>
      <p className="mt-4 text-center text-ink-3">* * * thank you, come again * * *</p>
    </div>
  );
}

// One floating layer of the hero scene. `depth` sets how far it moves
// with the pointer, which is what gives the scene its sense of depth.
function Layer({
  children,
  className,
  depth,
  rotate,
  delay,
  mx,
  my,
}: {
  children: ReactNode;
  className: string;
  depth: number;
  rotate: number;
  delay: number;
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) {
  const reduced = useReducedMotion();
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform(my, (v) => v * depth);
  return (
    <motion.div className={`absolute ${className}`} style={{ x, y }}>
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 40, rotate: 0, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, rotate, scale: 1 }}
        transition={{ duration: 1, delay, ease: EASE }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  const reduced = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const mx = useSpring(px, { stiffness: 60, damping: 18 });
  const my = useSpring(py, { stiffness: 60, damping: 18 });

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
      <div className="paper-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-40 right-[-10%] h-[38rem] w-[38rem] rounded-full bg-accent-soft blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 pt-14 pb-20 md:px-8 md:pt-20 md:pb-28 xl:grid-cols-[1.25fr_0.75fr] xl:items-center">
        <div>
          <motion.p {...rise(0)} className="eyebrow flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            For e-commerce and D2C brands
          </motion.p>

          <h1 className="mt-6 text-[2.9rem] leading-[0.98] font-medium tracking-[-0.035em] sm:text-7xl xl:text-[5.4rem]">
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
                className="accent-word block text-[1.08em]"
                initial={reduced ? false : { y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
              >
                already have.
              </motion.span>
            </span>
          </h1>

          <motion.p {...rise(0.45)} className="mt-7 max-w-xl text-lg leading-relaxed text-ink-2">
            A two-person studio for online stores. We make AI ad creative, get
            your products found in AI search, fix retention and tracking, and
            connect your tools. Every job has a fixed price, shown on this page.
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

        {/* The scene: the 3D reorder loop, with the price receipt in front */}
        <div className="relative mx-auto -mt-8 h-[36rem] w-full max-w-[26rem] sm:h-[40rem] xl:mt-0 xl:h-[36rem]" aria-hidden="true">
          <HeroScene
            pointerX={px}
            pointerY={py}
            progress={scrollYProgress}
            className="absolute -inset-x-5 top-0 h-[21rem] sm:-inset-x-24 sm:h-[26rem] xl:-top-8 xl:right-[-9rem] xl:left-[-4rem] xl:h-[30rem]"
          />
          <Layer className="top-[11.5rem] left-1/2 -ml-[9.75rem] sm:top-[14rem] xl:top-[12.5rem] xl:-ml-[13rem]" depth={10} rotate={3} delay={0.35} mx={mx} my={my}>
            <Receipt />
          </Layer>
        </div>
      </div>
    </section>
  );
}
