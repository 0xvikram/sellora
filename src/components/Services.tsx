"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { SERVICES } from "@/lib/site";
import { ILLUSTRATIONS } from "./Illustrations";
import { SectionHead } from "./SectionHead";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Stacking deck: every card is `position: sticky`, so the next one slides up
// over it. Card i sticks at BASE + i * STEP so the edges of the cards beneath
// stay visible. While a card is being covered it shrinks to COVERED_SCALE and
// a dark overlay fades up to COVERED_DIM.
const BASE_TOP_REM = 6.5; // 4rem nav + 2.5rem breathing room
const STEP_REM = 1.25;
const COVERED_SCALE = 0.94;
const COVERED_DIM = 0.35;
const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

const pad = (n: number) => String(n).padStart(2, "0");

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);

  // A card taller than the space below its sticky line would have its bottom
  // covered before anyone saw it (phones, short windows). For those, stick
  // lower than the viewport top so the whole card scrolls into view first.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const items = Array.from(list.children) as HTMLElement[];
    const place = () => {
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const vh = window.innerHeight;
      let changed = false;
      items.forEach((item, i) => {
        const wanted = (BASE_TOP_REM + i * STEP_REM) * rem;
        const fit = vh - item.offsetHeight - rem;
        const top = `${Math.round(Math.min(wanted, fit))}px`;
        if (item.style.top !== top) {
          item.style.top = top;
          changed = true;
        }
      });
      // The scale/dim tweens end where the next card settles; re-measure them.
      if (changed) ScrollTrigger.refresh();
    };
    place();
    const ro = new ResizeObserver(place);
    items.forEach((item) => ro.observe(item));
    window.addEventListener("resize", place);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", place);
    };
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERY, () => {
        const list = listRef.current;
        if (!list) return;
        const items = Array.from(list.children) as HTMLElement[];
        items.slice(0, -1).forEach((item, i) => {
          const next = items[i + 1];
          const card = item.querySelector<HTMLElement>("[data-stack-card]");
          const shade = item.querySelector<HTMLElement>("[data-stack-shade]");
          if (!card || !shade) return;
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: next,
              // From the next card entering the viewport until it has settled.
              start: "top bottom",
              end: () => `top ${parseFloat(getComputedStyle(next).top) || 0}px`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
          tl.fromTo(
            card,
            { scale: 1 },
            { scale: COVERED_SCALE, ease: "none", transformOrigin: "50% 0%" },
            0,
          ).fromTo(shade, { opacity: 0 }, { opacity: COVERED_DIM, ease: "none" }, 0);
        });
        // The old pinned layout added pin spacing; re-measure everything
        // below (the Ladder beams and reveals) against the new layout.
        ScrollTrigger.refresh();
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="services" className="border-t border-line">
      <div className="mx-auto max-w-7xl px-5 pt-24 md:px-8 md:pt-32">
        <SectionHead
          index="01"
          label="Services"
          aside="Five one-off jobs, each with a fixed price."
        >
          Pick one job. <span className="accent-word">See the price.</span>
        </SectionHead>
      </div>

      <ol
        ref={listRef}
        className="mx-auto mt-14 max-w-7xl space-y-8 px-5 pb-24 md:mt-16 md:px-8 md:pb-40"
      >
        {SERVICES.map((service, i) => {
          const Illustration = ILLUSTRATIONS[service.id];
          return (
            <li
              key={service.id}
              className="sticky"
              style={{ top: `${BASE_TOP_REM + i * STEP_REM}rem` }}
            >
              <div data-stack-card className="relative origin-top">
                <CardContainer
                  tilt={90}
                  containerClassName="block py-0"
                  className="block w-full"
                >
                  <CardBody className="h-auto w-full">
                    <article
                      tabIndex={0}
                      aria-labelledby={`svc-${service.id}`}
                      className="grid gap-8 rounded-3xl border border-line-2 bg-card p-6 shadow-[0_1px_2px_rgba(22,20,15,0.06),0_18px_40px_-18px_rgba(22,20,15,0.28)] transition-colors hover:border-accent focus-visible:border-accent md:p-9 lg:min-h-[70vh] lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-12 lg:p-12"
                    >
                      <div>
                        <CardItem
                          translateZ={20}
                          className="flex w-full items-baseline justify-between gap-6"
                        >
                          <span className="font-mono text-sm text-accent">
                            {pad(i + 1)} / {pad(SERVICES.length)}
                          </span>
                          <span className="text-right font-mono">
                            <span className="text-xl">{service.price}</span>
                            <span className="block text-xs text-ink-3">{service.unit}</span>
                          </span>
                        </CardItem>
                        <h3
                          id={`svc-${service.id}`}
                          className="mt-5 text-3xl leading-[1.05] font-medium tracking-tight md:text-4xl"
                        >
                          {service.title}
                        </h3>
                        <p className="mt-3 max-w-lg text-base leading-relaxed text-ink-2 md:text-[1.05rem]">
                          {service.summary}
                        </p>
                        <ul className="mt-6 space-y-2">
                          {service.includes.map((item) => (
                            <li key={item} className="flex gap-3 text-[0.95rem] leading-snug">
                              <span
                                className="mt-[0.5rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                                aria-hidden="true"
                              />
                              {item}
                            </li>
                          ))}
                        </ul>
                        {service.note ? (
                          <p className="mt-6 w-fit rounded-lg bg-accent-soft px-4 py-3 text-sm leading-relaxed">
                            {service.note}
                          </p>
                        ) : null}
                      </div>
                      <CardItem translateZ={45} className="w-full">
                        <Illustration />
                      </CardItem>
                    </article>
                  </CardBody>
                </CardContainer>
                <span
                  data-stack-shade
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-3xl bg-ink opacity-0"
                />
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
