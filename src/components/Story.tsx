"use client";

import { useEffect, useId, useRef, type ComponentType } from "react";
import { SERVICES } from "@/lib/site";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { AdsFigure, AnswerFigure, ConnectFigure, FlowFigure, TrackingFigure } from "./story/figures";

// "What changes": the five services, each applied to the sample store as a
// drawn figure with one headline number.
//
// Two layouts, chosen by CSS so the server HTML is right from the first
// paint (see .story-* in globals.css):
//  - Stacked (below lg, any width with reduced motion, and without
//    JavaScript): each step is the service text with its figure under it,
//    figures in their final state, each step revealed once.
//  - Pinned (lg and up, motion allowed): a 350vh track (2.5 screens of
//    scroll) with a sticky 100vh stage. Left, the section eyebrow and H2
//    (the stacked header is hidden here, so the section is never headless
//    while pinned; the "how it works" line is left out, for height), then
//    the five services as an <ol> with a progress rail; right, the five
//    figures stacked in one place. GSAP core and ScrollTrigger are imported lazily (only when this layout applies) and
//    scrub one timeline over the track (./story/timeline.ts). The page
//    scrolls natively the whole time: no pin-spacer, no snap.
//
// Figures are aria-hidden drawings. The number and caption beside each are
// real text, and every service, number and caption is in the DOM whatever
// the scroll position.

const HOW = [
  "Paste your store address",
  "Read the audit, labelled measured or generated",
  "Pick one fixed-price job",
];

// A step's number is either plain text or a before -> after pair. In the
// pinned layout the "after" value counts up from the "before" value as
// that slide's window plays (./story/timeline.ts); the markup is final.
type Count = { from: number; to: number; unit?: string };
type Step = { number: string; count?: Count; caption: string; Figure: ComponentType<{ id: string }> };

const STEPS: Step[] = [
  { number: "3–5", caption: "ads per test batch", Figure: AdsFigure },
  { number: "1 → 4", count: { from: 1, to: 4 }, caption: "assistants citing the store, of 10", Figure: AnswerFigure },
  { number: "21% → 31%", count: { from: 21, to: 31, unit: "%" }, caption: "repeat rate, 90-day cohorts", Figure: FlowFigure },
  { number: "1", caption: "workflow, scoped first", Figure: ConnectFigure },
  { number: "54% → 96%", count: { from: 54, to: 96, unit: "%" }, caption: "pixel to order match", Figure: TrackingFigure },
];

const ITEMS = SERVICES.map((service, i) => ({ service, ...STEPS[i], index: String(i + 1).padStart(2, "0") }));

const PINNED = "(min-width: 64rem) and (prefers-reduced-motion: no-preference)";

let registered = false;

function Result({ number, count, caption }: { number: string; count?: Count; caption: string }) {
  return (
    <p className="story-result">
      {count ? (
        <span className="story-number">
          {count.from}
          {count.unit}
          <span data-num-after className="story-number-after">
            {" → "}
            <span data-num-to={count.to} data-num-from={count.from}>
              {count.to}
            </span>
            {count.unit}
          </span>
        </span>
      ) : (
        <span className="story-number">{number}</span>
      )}
      <span className="story-caption">{caption}</span>
    </p>
  );
}

function Head() {
  return (
    <>
      Five jobs, applied to <span className="accent-word">the store.</span>
    </>
  );
}

function How() {
  return (
    <ol className="story-how" aria-label="How it works">
      {HOW.map((line, i) => (
        <li key={line}>
          {i > 0 ? (
            <span aria-hidden="true" className="story-how-arrow">
              →
            </span>
          ) : null}
          {line}
        </li>
      ))}
    </ol>
  );
}

function Drawing({ Figure, id }: { Figure: Step["Figure"]; id: string }) {
  return (
    <div className="sfig" aria-hidden="true">
      <Figure id={id} />
    </div>
  );
}

export function Story() {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!pin || !track) return;
    const mq = window.matchMedia(PINNED);
    let cancelled = false;
    let loading = false;
    let revert: (() => void) | null = null;

    const start = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;
      if (!registered) {
        gsap.registerPlugin(ScrollTrigger);
        registered = true;
      }
      const { buildStory } = await import("./story/timeline");
      if (cancelled) return;
      const mm = gsap.matchMedia();
      mm.add(PINNED, () => buildStory(gsap, ScrollTrigger, pin, track));
      revert = () => mm.revert();
    };

    // Load only when the pinned layout applies (now or after a resize),
    // once the browser is idle after first paint.
    const maybeStart = () => {
      if (loading || !mq.matches) return;
      loading = true;
      if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(() => void start(), { timeout: 1500 });
      else setTimeout(() => void start(), 300);
    };
    maybeStart();
    mq.addEventListener("change", maybeStart);
    return () => {
      cancelled = true;
      mq.removeEventListener("change", maybeStart);
      revert?.();
    };
  }, []);

  return (
    <section id="what-changes" aria-labelledby="story-title" data-ground="bone" className="story">
      <Container className="story-stack pt-14 md:pt-24 lg:pt-28">
        <SectionHead index="01" label="What changes" id="story-title">
          <Head />
        </SectionHead>
        <Reveal>
          <How />
        </Reveal>
      </Container>

      {/* Stacked: phones, tablets, reduced motion, no JavaScript. */}
      <Container className="story-stack pt-10 pb-14 md:pt-14 md:pb-24 lg:pb-28">
        <ol className="grid gap-14 md:gap-20">
          {ITEMS.map(({ service, index, number, count, caption, Figure }) => (
            <li key={service.id}>
              <Reveal className="story-step">
                <div className="story-step-text">
                  <p className="story-step-head">
                    <span className="story-index">{index}</span>
                    <span className="story-price">
                      {service.price}
                      <span className="sr-only">, </span>
                      <span className="text-ink-3"> · {service.unit}</span>
                    </span>
                  </p>
                  <h3 className="type-h3 mt-3 text-ink">{service.title}</h3>
                  <p className="mt-2 max-w-prose text-base text-ink-2">{service.summary}</p>
                </div>
                <div className="story-step-figure">
                  <Drawing Figure={Figure} id={`${uid}s${index}`} />
                  <Result number={number} count={count} caption={caption} />
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>

      {/* Pinned: lg and up with motion allowed. */}
      <div ref={trackRef} className="story-pin">
        <div ref={pinRef} className="story-stage">
          <Container className="story-grid">
            <div className="story-side">
              <div className="story-head">
                <p className="flex items-center gap-3">
                  <span className="eyebrow">01</span>
                  <span className="h-px w-8 bg-line-2" aria-hidden="true" />
                  <span className="eyebrow">What changes</span>
                </p>
                <h2 className="story-title">
                  <Head />
                </h2>
              </div>
              <div className="story-listwrap">
              <span className="story-rail" aria-hidden="true">
                <span data-rail className="story-rail-fill" />
              </span>
              <ol className="story-list">
                {ITEMS.map(({ service, index, number, caption }, i) => (
                  <li key={service.id} data-item className={i === 0 ? "story-item is-active" : "story-item"}>
                    <p className="story-item-head">
                      <span className="story-index">{index}</span>
                      <span className="story-item-title">{service.title}</span>
                      <span className="story-price">{service.price}</span>
                    </p>
                    <p className="story-item-summary">{service.summary}</p>
                    <p className="sr-only">
                      Typical result: {number}, {caption}.
                    </p>
                  </li>
                ))}
              </ol>
              </div>
            </div>
            <div className="story-slides" aria-hidden="true">
              {ITEMS.map(({ service, index, number, count, caption, Figure }) => (
                <div key={service.id} data-slide className="story-slide">
                  <Drawing Figure={Figure} id={`${uid}p${index}`} />
                  <Result number={number} count={count} caption={caption} />
                </div>
              ))}
            </div>
          </Container>
        </div>
      </div>
      <noscript>
        <style>{`.story-pin{display:none!important}.story-stack{display:block!important}`}</style>
      </noscript>
    </section>
  );
}
