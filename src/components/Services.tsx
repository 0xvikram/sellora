"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { SERVICES } from "@/lib/site";
import { ILLUSTRATIONS } from "./Illustrations";
import { SectionHead } from "./SectionHead";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Only wide, tall-enough screens with motion allowed get the pinned
// horizontal scroll; everything else gets the same cards stacked.
const PIN_QUERY =
  "(min-width: 1024px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)";

const pad = (n: number) => String(n).padStart(2, "0");

// The `in-[.is-pinned]:` classes apply only while GSAP has the section pinned.
export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(PIN_QUERY, () => {
        const section = sectionRef.current;
        const track = trackRef.current;
        if (!section || !track) return;
        section.classList.add("is-pinned");

        // clientWidth, not innerWidth: the scrollbar would hide the last card's edge.
        const distance = () =>
          Math.max(0, track.scrollWidth - document.documentElement.clientWidth);
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pinRef.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
              if (countRef.current) {
                countRef.current.textContent = pad(
                  Math.round(self.progress * (SERVICES.length - 1)) + 1,
                );
              }
            },
          },
        });
        triggerRef.current = tween.scrollTrigger ?? null;

        return () => {
          triggerRef.current = null;
          section.classList.remove("is-pinned");
        };
      });
    },
    { scope: sectionRef },
  );

  // Keyboard users tabbing through pinned cards: scroll the page to the point
  // where that card has slid into view (the track moves by transform, so the
  // browser can't do it for us).
  const bringIntoView = (index: number) => {
    const st = triggerRef.current;
    const track = trackRef.current;
    const pin = pinRef.current;
    if (!st || !track || !pin) return;
    pin.scrollLeft = 0;
    const cards = track.children;
    const first = cards[0] as HTMLElement;
    const card = cards[index] as HTMLElement;
    const distance = Math.max(1, track.scrollWidth - document.documentElement.clientWidth);
    const progress = Math.min(1, (card.offsetLeft - first.offsetLeft) / distance);
    window.scrollTo({ top: st.start + progress * (st.end - st.start), behavior: "instant" });
  };

  return (
    <section ref={sectionRef} id="services" className="border-t border-line bg-card">
      <div className="mx-auto max-w-7xl px-5 pt-24 md:px-8 md:pt-32">
        <SectionHead
          index="01"
          label="Services"
          aside="Five one-off jobs, each with a fixed price."
        >
          Pick one job. <span className="accent-word">See the price.</span>
        </SectionHead>
      </div>

      <div
        ref={pinRef}
        className="pb-24 md:pb-32 in-[.is-pinned]:flex in-[.is-pinned]:h-screen in-[.is-pinned]:flex-col in-[.is-pinned]:justify-center in-[.is-pinned]:overflow-hidden in-[.is-pinned]:pt-16 in-[.is-pinned]:pb-0!"
      >
        <ol
          ref={trackRef}
          className="relative mx-auto mt-14 max-w-7xl space-y-6 px-5 md:px-8 in-[.is-pinned]:mx-0 in-[.is-pinned]:mt-0 in-[.is-pinned]:flex in-[.is-pinned]:w-max in-[.is-pinned]:max-w-none in-[.is-pinned]:gap-8 in-[.is-pinned]:space-y-0 in-[.is-pinned]:px-[max(2rem,calc((100vw-80rem)/2+2rem))]! in-[.is-pinned]:will-change-transform"
        >
          {SERVICES.map((service, i) => {
            const Illustration = ILLUSTRATIONS[service.id];
            return (
              <li
                key={service.id}
                className="in-[.is-pinned]:w-[min(66rem,calc(100vw-9rem))] in-[.is-pinned]:shrink-0"
              >
                <CardContainer
                  tilt={90}
                  containerClassName="block py-0"
                  className="block w-full"
                >
                  <CardBody className="h-auto w-full">
                    <article
                      tabIndex={0}
                      aria-labelledby={`svc-${service.id}`}
                      onFocus={() => bringIntoView(i)}
                      className="grid gap-8 rounded-3xl border border-line-2 bg-paper p-6 transition-colors hover:border-accent focus-visible:border-accent md:p-9 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-12 lg:p-10"
                    >
                      <div>
                        <CardItem translateZ={20} className="flex w-full items-baseline justify-between gap-6">
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
              </li>
            );
          })}
        </ol>

        <div
          className="mx-auto mt-8 hidden w-full max-w-7xl items-center gap-5 px-8 font-mono text-xs text-ink-3 in-[.is-pinned]:flex"
          aria-hidden="true"
        >
          <span>
            <span ref={countRef} className="text-accent">
              01
            </span>{" "}
            / {pad(SERVICES.length)}
          </span>
          <span className="h-0.5 flex-1 overflow-hidden rounded-full bg-line">
            <span
              ref={barRef}
              className="block h-full origin-left rounded-full bg-accent"
              style={{ transform: "scaleX(0)" }}
            />
          </span>
          <span>scroll</span>
        </div>
      </div>
    </section>
  );
}
