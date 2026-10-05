"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import type { MotionValue } from "framer-motion";
import type { ReactNode } from "react";
import { BOOKING_URL, SERVICES } from "@/lib/site";
import { Magnetic } from "./fx/Magnetic";

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

function MiniCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl border border-line bg-card shadow-[0_18px_40px_-22px_rgba(22,20,15,0.45)] ${className}`}
    >
      {children}
    </div>
  );
}

function MiniChart() {
  return (
    <MiniCard className="w-44 p-3.5">
      <p className="font-mono text-[0.6rem] tracking-[0.12em] text-ink-3 uppercase">
        Repeat orders
      </p>
      <svg viewBox="0 0 150 60" className="mt-2 w-full" aria-hidden="true">
        <motion.path
          d="M2 52 C 22 50, 30 40, 48 38 S 78 30, 92 22 S 126 10, 148 6"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.8, delay: 1, ease: "easeInOut" }}
        />
        <motion.circle
          cx="148"
          cy="6"
          r="3.5"
          fill="var(--color-accent)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2.7, type: "spring", stiffness: 300 }}
        />
      </svg>
      <p className="mt-1 font-mono text-[0.6rem] text-ink-3">sample data</p>
    </MiniCard>
  );
}

function MiniAnswer() {
  return (
    <MiniCard className="w-56 p-3.5">
      <p className="font-mono text-[0.6rem] tracking-[0.12em] text-ink-3 uppercase">
        AI assistant
      </p>
      <p className="mt-2 text-[0.78rem] leading-snug">
        “For sensitive skin,{" "}
        <span className="rounded bg-accent-soft px-1 font-semibold text-accent">Your Brand</span>{" "}
        is often recommended…”
      </p>
    </MiniCard>
  );
}

function MiniAd() {
  return (
    <div className="relative aspect-[9/16] w-28 overflow-hidden rounded-xl bg-gradient-to-br from-[#f3c98b] to-[#e2643c] shadow-[0_18px_40px_-22px_rgba(22,20,15,0.55)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.5),transparent_55%)]" />
      <span className="absolute top-2 left-2 rounded-full bg-white/85 px-2 py-0.5 font-mono text-[0.55rem]">
        Hook A
      </span>
      <span className="absolute top-1/2 left-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90">
        <span className="ml-0.5 border-y-[5px] border-l-[9px] border-y-transparent border-l-ink" />
      </span>
      <div className="absolute inset-x-2 bottom-2 h-0.5 overflow-hidden rounded-full bg-white/35">
        <div className="illus-progress h-full bg-white" />
      </div>
    </div>
  );
}

function MiniFlow() {
  return (
    <MiniCard className="flex items-center gap-2 px-3.5 py-2.5 font-mono text-[0.68rem]">
      <span>Shopify</span>
      <span className="text-accent">→</span>
      <span className="rounded-md bg-accent px-1.5 py-0.5 text-white">n8n</span>
      <span className="text-accent">→</span>
      <span>CRM</span>
      <span className="ml-1 text-leaf">✓</span>
    </MiniCard>
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

        {/* The scene: a price receipt with small product panels around it */}
        <div className="relative mx-auto mt-16 h-[34rem] w-full max-w-[26rem] xl:mt-0" aria-hidden="true">
          <Layer className="top-14 left-1/2 -ml-[9.75rem]" depth={10} rotate={3} delay={0.35} mx={mx} my={my}>
            <Receipt />
          </Layer>
          <Layer className="-top-14 -left-2 sm:-left-20" depth={26} rotate={-6} delay={0.6} mx={mx} my={my}>
            <MiniChart />
          </Layer>
          <Layer className="top-6 -right-2 hidden sm:-right-12 sm:block" depth={34} rotate={7} delay={0.7} mx={mx} my={my}>
            <MiniAd />
          </Layer>
          <Layer className="bottom-14 -left-3 sm:-left-16" depth={30} rotate={-4} delay={0.8} mx={mx} my={my}>
            <MiniAnswer />
          </Layer>
          <Layer className="-right-1 bottom-2 sm:-right-8" depth={20} rotate={4} delay={0.9} mx={mx} my={my}>
            <MiniFlow />
          </Layer>
        </div>
      </div>
    </section>
  );
}
