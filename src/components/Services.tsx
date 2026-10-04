"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { SERVICES } from "@/lib/site";
import { SectionHead } from "./SectionHead";

export function Services() {
  const [open, setOpen] = useState<string | null>(SERVICES[0].id);

  return (
    <section id="services" className="border-t border-line bg-card">
      <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
        <SectionHead
          index="01"
          label="Services"
          aside="Five ways to start. Each is a one-off job with a fixed price."
        >
          Pick one job. <span className="accent-word">See the price.</span>
        </SectionHead>

        <ul className="mt-14 border-t border-line-2">
          {SERVICES.map((service, i) => {
            const isOpen = open === service.id;
            return (
              <li key={service.id} className="border-b border-line-2">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : service.id)}
                  aria-expanded={isOpen}
                  aria-controls={`service-${service.id}`}
                  className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 py-7 text-left md:grid-cols-[4rem_1.1fr_1fr_10rem_2rem] md:gap-x-8"
                >
                  <span className="font-mono text-sm text-ink-3">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-2xl font-medium tracking-tight transition-colors group-hover:text-accent md:text-[2rem]">
                    {service.title}
                  </span>
                  <span className="col-start-2 mt-2 text-base leading-relaxed text-ink-2 md:col-start-3 md:mt-0">
                    {service.summary}
                  </span>
                  <span className="col-start-2 mt-3 font-mono text-base md:col-start-4 md:mt-0 md:text-right">
                    {service.price}
                    <span className="block text-xs text-ink-3">{service.unit}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`col-start-3 row-start-1 justify-self-end font-mono text-xl text-accent transition-transform md:col-start-5 ${isOpen ? "rotate-45" : ""}`}
                  >
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      id={`service-${service.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-6 pb-9 md:grid-cols-[4rem_1.1fr_1fr_10rem_2rem] md:gap-x-8">
                        <div className="md:col-span-2 md:col-start-2">
                          <p className="eyebrow">What you get</p>
                          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                            {service.includes.map((item) => (
                              <li
                                key={item}
                                className="flex gap-3 text-[0.95rem] leading-relaxed text-ink"
                              >
                                <span
                                  className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                                  aria-hidden="true"
                                />
                                {item}
                              </li>
                            ))}
                          </ul>
                          {service.note ? (
                            <p className="mt-6 inline-block rounded-lg bg-accent-soft px-4 py-3 text-sm leading-relaxed text-ink">
                              {service.note}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
