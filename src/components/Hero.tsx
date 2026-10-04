"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BOOKING_URL, SERVICES } from "@/lib/site";

const CHIPS = [
  { label: "Shopify", className: "right-full -mr-6 -top-4", r: "-6deg", d: "7s", delay: "0s" },
  { label: "Klaviyo", className: "left-full -ml-5 top-36", r: "5deg", d: "8s", delay: "-2s" },
  { label: "n8n", className: "right-full -mr-4 bottom-36", r: "4deg", d: "6.5s", delay: "-1s" },
  { label: "Meta Ads", className: "left-full -ml-8 -bottom-2", r: "-4deg", d: "9s", delay: "-3s" },
];

function Receipt() {
  return (
    <div className="receipt-edge w-full max-w-[22rem] bg-card px-6 pt-6 pb-9 font-mono text-[0.8rem] text-ink shadow-[0_30px_60px_-30px_rgba(22,20,15,0.35)]">
      <div className="flex items-baseline justify-between">
        <span className="tracking-[0.14em] uppercase">Price list</span>
        <span className="text-ink-3">No. 0001</span>
      </div>
      <p className="mt-1 text-ink-3">Every job, priced before the first call</p>
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

export function Hero() {
  const reduced = useReducedMotion();
  const rise = (delay: number) => ({
    initial: reduced ? false : ({ opacity: 0, y: 26 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section id="top" className="relative overflow-hidden">
      <div className="paper-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-6xl gap-14 px-5 pt-16 pb-20 md:px-8 md:pt-24 md:pb-28 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <motion.p {...rise(0)} className="eyebrow">
            For e-commerce and D2C brands
          </motion.p>
          <motion.h1
            {...rise(0.08)}
            className="mt-5 text-[2.75rem] leading-[1.02] font-medium tracking-tight text-balance sm:text-6xl lg:text-[4.5rem]"
          >
            More orders from the customers you{" "}
            <span className="accent-word">already have.</span>
          </motion.h1>
          <motion.p
            {...rise(0.16)}
            className="mt-6 max-w-xl text-lg leading-relaxed text-ink-2"
          >
            A two-person studio for online stores. We make AI ad creative, get
            your products found in AI search, fix retention and tracking, and
            connect your tools. Every job has a fixed price, shown on this page.
          </motion.p>
          <motion.div {...rise(0.24)} className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href={BOOKING_URL}
              className="rounded-full bg-accent px-6 py-3.5 text-base font-medium text-white transition-transform hover:-translate-y-0.5"
            >
              Book a 20-minute call
            </a>
            <a
              href="#services"
              className="group flex items-center gap-2 px-2 py-3 text-base font-medium"
            >
              See services and prices
              <span className="transition-transform group-hover:translate-y-0.5" aria-hidden="true">
                ↓
              </span>
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 40, rotate: 0 }}
          animate={{ opacity: 1, y: 0, rotate: 2.5 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-[22rem]"
        >
          <Receipt />
          {CHIPS.map((chip) => (
            <span
              key={chip.label}
              style={
                {
                  "--r": chip.r,
                  "--d": chip.d,
                  "--delay": chip.delay,
                } as React.CSSProperties
              }
              className={`chip-drift absolute hidden items-center gap-2 rounded-full border border-line bg-paper px-3.5 py-1.5 font-mono text-xs whitespace-nowrap shadow-sm sm:flex ${chip.className}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {chip.label}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
