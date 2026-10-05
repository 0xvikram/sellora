"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { SERVICES } from "@/lib/site";
import { ILLUSTRATIONS } from "./Illustrations";
import { SectionHead } from "./SectionHead";

const EASE = [0.22, 1, 0.36, 1] as const;

// Desktop: the text scrolls on the left while one illustration stays
// pinned on the right and swaps to match the service in view.
// Phone: each service shows its illustration inline.
export function Services() {
  const [active, setActive] = useState(SERVICES[0].id);
  const activeIndex = SERVICES.findIndex((s) => s.id === active);
  const ActiveIllustration = ILLUSTRATIONS[active];

  return (
    <section id="services" className="border-t border-line bg-card">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <SectionHead
          index="01"
          label="Services"
          aside="Five ways to start. Each is a one-off job with a fixed price."
        >
          Pick one job. <span className="accent-word">See the price.</span>
        </SectionHead>

        <div className="mt-16 grid gap-x-16 lg:grid-cols-[1fr_1fr]">
          <ol>
            {SERVICES.map((service, i) => {
              const Illustration = ILLUSTRATIONS[service.id];
              return (
                <motion.li
                  key={service.id}
                  onViewportEnter={() => setActive(service.id)}
                  viewport={{ margin: "-45% 0px -45% 0px" }}
                  className="border-t border-line-2 py-12 lg:flex lg:min-h-[78vh] lg:flex-col lg:justify-center lg:py-16"
                >
                  <div className="flex items-baseline justify-between gap-6">
                    <span className="font-mono text-sm text-accent">
                      {String(i + 1).padStart(2, "0")} / {String(SERVICES.length).padStart(2, "0")}
                    </span>
                    <span className="text-right font-mono">
                      <span className="text-xl">{service.price}</span>
                      <span className="block text-xs text-ink-3">{service.unit}</span>
                    </span>
                  </div>
                  <h3 className="mt-6 text-4xl leading-[1.05] font-medium tracking-tight md:text-5xl">
                    {service.title}
                  </h3>
                  <p className="mt-4 max-w-lg text-lg leading-relaxed text-ink-2">
                    {service.summary}
                  </p>

                  <div className="mt-8 lg:hidden">
                    <Illustration />
                  </div>

                  <ul className="mt-8 space-y-3">
                    {service.includes.map((item) => (
                      <li key={item} className="flex gap-3 text-[0.97rem] leading-relaxed">
                        <span
                          className="mt-[0.62rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {service.note ? (
                    <p className="mt-7 w-fit rounded-lg bg-accent-soft px-4 py-3 text-sm leading-relaxed">
                      {service.note}
                    </p>
                  ) : null}
                </motion.li>
              );
            })}
          </ol>

          <div className="hidden lg:block">
            <div className="sticky top-24 flex h-[calc(100vh-8rem)] items-center">
              <div className="relative w-full">
                <div
                  className="absolute -inset-10 rounded-[3rem] bg-paper"
                  aria-hidden="true"
                />
                <div
                  className="absolute -inset-10 rounded-[3rem] opacity-70"
                  style={{
                    background:
                      "radial-gradient(circle at 70% 20%, var(--color-accent-soft), transparent 60%)",
                  }}
                  aria-hidden="true"
                />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 28, rotate: 1.5 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    exit={{ opacity: 0, y: -20, rotate: -1 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="relative"
                  >
                    <ActiveIllustration />
                  </motion.div>
                </AnimatePresence>
                <div className="relative mt-8 flex items-center gap-2" aria-hidden="true">
                  {SERVICES.map((service, i) => (
                    <span
                      key={service.id}
                      className={`h-1 rounded-full transition-all duration-500 ${i === activeIndex ? "w-10 bg-accent" : "w-4 bg-line-2"}`}
                    />
                  ))}
                  <span className="ml-auto font-mono text-xs text-ink-3">illustration</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
