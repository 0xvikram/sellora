"use client";

import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState, useSyncExternalStore } from "react";
import { SERVICES } from "@/lib/site";
import type { Service } from "@/lib/site";
import { ILLUSTRATIONS } from "./Illustrations";
import { SectionHead } from "./SectionHead";
import { MacbookScroll } from "./ui/macbook-scroll";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Desktop: a stage pins (its content sits at the top, 2rem under the nav) for SERVICES.length viewport heights of
// scroll. The pinned progress (0..1) is split into equal slices, one per
// service; the laptop screen and the caption switch to the slice's service.
// The lid opens over the first LID_SHARE of the pin.
const PIN_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
const LID_SHARE = 0.2;
const EASE = [0.22, 1, 0.36, 1] as const;

const pad = (n: number) => String(n).padStart(2, "0");

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(PIN_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

// Server and first paint render the plain list; wide screens with motion
// allowed then switch to the pinned stage.
function usePinnedLayout() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(PIN_QUERY).matches,
    () => false,
  );
}

function Price({ service }: { service: Service }) {
  return (
    <span className="text-right font-mono">
      <span className="text-xl">{service.price}</span>
      <span className="block text-xs text-ink-3">{service.unit}</span>
    </span>
  );
}

function Caption({ service, index, headingId }: { service: Service; index: number; headingId?: string }) {
  return (
    <>
      <div className="flex w-full items-baseline justify-between gap-6">
        <span className="font-mono text-sm text-accent">
          {pad(index + 1)} / {pad(SERVICES.length)}
        </span>
        <Price service={service} />
      </div>
      <h3
        id={headingId}
        className="mt-4 font-display text-3xl leading-[1.05] font-semibold tracking-[-0.02em] md:text-4xl"
      >
        {service.title}
      </h3>
      <p className="mt-3 max-w-lg text-base leading-relaxed text-ink-2 md:text-[1.05rem]">
        {service.summary}
      </p>
      <ul className="mt-5 space-y-2">
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
        <p className="mt-5 w-fit rounded-lg bg-accent-soft px-4 py-3 text-sm leading-relaxed">
          {service.note}
        </p>
      ) : null}
    </>
  );
}

function Head() {
  return (
    <SectionHead index="01" label="Services" aside="Five one-off jobs, each with a fixed price.">
      Pick one job. <span className="accent-word">See the price.</span>
    </SectionHead>
  );
}

function PinnedStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);
  const lid = useTransform(progress, [0, LID_SHARE], [0, 1], { clamp: true });
  // `count` grows on every change, so a scene revisited while scrolling back
  // gets a new key, remounts and replays its entrance.
  const [scene, setScene] = useState({ index: 0, count: 0 });

  useGSAP(
    () => {
      const stage = stageRef.current;
      if (!stage) return;
      const n = SERVICES.length;
      const st = ScrollTrigger.create({
        trigger: stage,
        start: "top top",
        end: () => `+=${window.innerHeight * n}`,
        pin: true,
        scrub: true,
        refreshPriority: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          progress.set(self.progress);
          const index = Math.min(n - 1, Math.floor(self.progress * n));
          setScene((prev) =>
            prev.index === index ? prev : { index, count: prev.count + 1 },
          );
        },
      });
      progress.set(st.progress);
      // The pin adds n viewports of spacing; re-measure everything below it
      // (the Ladder beams and reveals) against the new layout.
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
      // Leaving the pinned layout (resize, motion setting) removes that
      // spacing again.
      return () => {
        requestAnimationFrame(() => ScrollTrigger.refresh());
      };
    },
    { scope: stageRef },
  );

  const service = SERVICES[scene.index];
  const Illustration = ILLUSTRATIONS[service.id];

  return (
    <div ref={stageRef} className="relative mx-auto max-w-7xl overflow-hidden px-8 pt-24 pb-8">
      {/* The heading pins with the stage, 2rem under the 4rem nav. */}
      <Head />
      {/* Laptop column ~46-47% of the row; the caption gets the rest. */}
      <div className="mt-10 grid grid-cols-[minmax(0,1fr)_minmax(0,0.94fr)] items-start gap-12 xl:gap-14">
        <div className="relative min-h-[26rem] pt-2" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={service.id}
              aria-labelledby={`svc-${service.id}`}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <Caption service={service} index={scene.index} headingId={`svc-${service.id}`} />
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="flex flex-col items-center">
          <MacbookScroll progress={lid}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${service.id}-${scene.count}`}
                className="mx-auto max-w-[35rem]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Illustration />
              </motion.div>
            </AnimatePresence>
          </MacbookScroll>
          <div className="mt-7 flex items-center gap-2.5" aria-hidden="true">
            {SERVICES.map((s, i) => (
              <span
                key={s.id}
                data-dot={i}
                data-active={i === scene.index ? "" : undefined}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === scene.index ? "w-7 bg-accent" : "w-2 bg-line-2"
                }`}
              />
            ))}
          </div>
          <p className="sr-only">
            Service {scene.index + 1} of {SERVICES.length}
          </p>
        </div>
      </div>
    </div>
  );
}

function ServiceList() {
  return (
    <ol className="mx-auto mt-12 max-w-7xl space-y-16 px-5 md:mt-16 md:px-8">
      {SERVICES.map((service, i) => {
        const Illustration = ILLUSTRATIONS[service.id];
        return (
          <li key={service.id}>
            <article
              aria-labelledby={`svc-${service.id}`}
              className="grid gap-7 md:gap-9 lg:grid-cols-2 lg:items-center lg:gap-12"
            >
              <MacbookScroll open>
                <div className="mx-auto max-w-[35rem]">
                  <Illustration />
                </div>
              </MacbookScroll>
              <div>
                <Caption service={service} index={i} headingId={`svc-${service.id}`} />
              </div>
            </article>
          </li>
        );
      })}
    </ol>
  );
}

export function Services() {
  const pinned = usePinnedLayout();

  return (
    <section
      id="services"
      className={`border-t border-line ${pinned ? "pb-10" : "pb-24 md:pb-32"}`}
    >
      {pinned ? (
        <PinnedStage />
      ) : (
        <>
          <div className="mx-auto max-w-7xl px-5 pt-24 md:px-8 md:pt-32">
            <Head />
          </div>
          <ServiceList />
        </>
      )}
    </section>
  );
}
