"use client";

import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { SERVICES } from "@/lib/site";
import type { Service } from "@/lib/site";
import { ILLUSTRATIONS } from "./Illustrations";
import { SectionHead } from "./SectionHead";
import { MacbookScroll } from "./ui/macbook-scroll";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Desktop: a full-viewport stage pins for SERVICES.length viewport heights of
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
        className="mt-4 text-3xl leading-[1.05] font-medium tracking-tight md:text-4xl"
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

// Scales an illustration down (never up) when it is taller than the screen.
// At scale 1 no transform is set, so beam measurements stay exact.
function FitToScreen({ children }: { children: ReactNode }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const inner = innerRef.current;
    if (!box || !inner) return;
    const fit = () => {
      const s = Math.min(1, (box.clientHeight - 24) / Math.max(1, inner.offsetHeight));
      setScale(Math.round(s * 1000) / 1000);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    ro.observe(inner);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={boxRef} className="absolute inset-0 flex items-center justify-center p-3">
      <div
        ref={innerRef}
        className="w-full max-w-[34rem] shrink-0"
        style={scale < 1 ? { transform: `scale(${scale})` } : undefined}
      >
        {children}
      </div>
    </div>
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
    <div ref={stageRef} className="relative h-screen overflow-hidden">
      <div className="mx-auto grid h-full max-w-7xl grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] items-center gap-10 px-8 pt-16 xl:gap-14">
        <div className="relative min-h-[26rem]" aria-live="polite">
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
          <MacbookScroll progress={lid} screenClassName="aspect-[16/10.4]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${service.id}-${scene.count}`}
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,var(--color-card),var(--color-paper-2))]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <FitToScreen>
                  <Illustration />
                </FitToScreen>
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
    <ol className="mx-auto mt-14 max-w-7xl space-y-16 px-5 md:mt-16 md:px-8">
      {SERVICES.map((service, i) => {
        const Illustration = ILLUSTRATIONS[service.id];
        return (
          <li key={service.id}>
            <article
              aria-labelledby={`svc-${service.id}`}
              className="grid gap-8 md:grid-cols-2 md:items-center md:gap-12"
            >
              <MacbookScroll open className="mx-auto max-w-xl">
                <div className="p-1.5 sm:p-4">
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
    <section id="services" className="border-t border-line pb-24 md:pb-32">
      <div className="mx-auto max-w-7xl px-5 pt-24 md:px-8 md:pt-32">
        <SectionHead
          index="01"
          label="Services"
          aside="Five one-off jobs, each with a fixed price."
        >
          Pick one job. <span className="accent-word">See the price.</span>
        </SectionHead>
      </div>

      {pinned ? <PinnedStage /> : <ServiceList />}
    </section>
  );
}
