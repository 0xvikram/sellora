"use client";

import { useEffect, useRef } from "react";
import { EASE_OUT, prefersReducedMotion } from "@/lib/motion";
import { AuditForm } from "./AuditForm";
import { BeforeAfter } from "./BeforeAfter";
import { Container } from "./Container";

// "The read, delivered": the one dark moment inside <main>. A sample audit
// report sheet (card paper, A4 proportions, rotated -1deg, layered paper
// shadow) on the dark ground, beside three statements that define the
// labels, and the audit form once more.
//
// Motion (once, when the sheet first enters the viewport, never with
// reduced motion): the sheet rises 24px and settles to its -1deg rotation
// over 0.8 s, and the six figures count up over 0.9 s, 80 ms apart. The
// server HTML is the final state; the start state is only applied to a
// sheet that is still below the fold after mount.
//
// Every figure here is sample data for the drawn Oatleaf store.

type Kind = "Measured" | "Generated";

const FIGURES: {
  label: string;
  value: number;
  unit?: string;
  of?: number;
  kind: Kind;
}[] = [
  { label: "Repeat rate", value: 31, unit: "%", kind: "Measured" },
  { label: "AI assistants citing you", value: 1, of: 10, kind: "Generated" },
  { label: "Pixel to order match", value: 54, unit: "%", kind: "Measured" },
  { label: "Flows with gaps", value: 2, of: 5, kind: "Measured" },
  { label: "Pages assistants can read", value: 31, of: 48, kind: "Measured" },
  { label: "Ad hooks ready", value: 5, kind: "Generated" },
];

const STATEMENTS: { lead: string; rest: string }[] = [
  { lead: "Measured", rest: "means read from your store." },
  { lead: "Generated", rest: "means drafted by AI and labelled." },
  { lead: "Sample", rest: "means illustrative, until yours is read." },
];

const MARKER: Record<Kind, string> = {
  Measured: "bg-accent",
  Generated: "bg-moss",
};

const SETTLED = "translateY(0) rotate(-1deg)";

function countUp(el: HTMLElement, to: number, delay: number) {
  const start = performance.now() + delay;
  const tick = (now: number) => {
    const t = Math.min(1, Math.max(0, (now - start) / 900));
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = String(Math.round(to * eased));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export function Report() {
  const sheetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet || prefersReducedMotion() || typeof IntersectionObserver === "undefined") return;
    if (sheet.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    const nums = Array.from(sheet.querySelectorAll<HTMLElement>("[data-report-num]"));
    sheet.style.opacity = "0";
    sheet.style.transform = "translateY(24px) rotate(-2.5deg)";
    nums.forEach((n) => (n.textContent = "0"));

    const restore = () => {
      sheet.style.opacity = "";
      sheet.style.transform = "";
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        restore();
        sheet.animate(
          [
            { opacity: 0, transform: "translateY(24px) rotate(-2.5deg)" },
            { opacity: 1, transform: SETTLED },
          ],
          { duration: 800, easing: EASE_OUT },
        );
        nums.forEach((n, i) => countUp(n, Number(n.dataset.reportNum), 150 + i * 80));
      },
      { threshold: 0.2 },
    );
    observer.observe(sheet);
    return () => {
      observer.disconnect();
      restore();
      nums.forEach((n) => (n.textContent = n.dataset.reportNum ?? ""));
    };
  }, []);

  return (
    <section id="report" aria-labelledby="report-title" className="on-dark report overflow-hidden">
      <Container className="py-16 md:py-28">
        <p className="flex items-center gap-3">
          <span className="eyebrow">03</span>
          <span className="h-px w-8 bg-ground/25" aria-hidden="true" />
          <span className="eyebrow">The read, delivered</span>
        </p>
        <h2 id="report-title" className="type-h2 mt-5 max-w-3xl text-ground">
          One page. Every number <span className="accent-word">labelled.</span>
        </h2>

        <div className="mt-12 grid items-center gap-14 md:mt-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <div className="report-desk">
            <div className="report-stack">
              <span aria-hidden="true" className="report-under" />
              <figure ref={sheetRef} aria-label="Sample audit report" className="report-sheet">
                <p className="report-meta">
                  <span>oatleaf.example</span>
                  <span aria-hidden="true">·</span>
                  <span>17 Oct 2026</span>
                  <span aria-hidden="true">·</span>
                  <span>Prepared by Sellora</span>
                  <span className="chip">Sample</span>
                </p>
                <p className="report-title">Store read, page 1 of 1</p>

                <dl className="report-grid">
                  {FIGURES.map((f) => (
                    <div key={f.label} className="report-cell">
                      <dt className="report-label">{f.label}</dt>
                      <dd className="mt-2">
                        <span className="report-value">
                          <span data-report-num={f.value}>{f.value}</span>
                          {f.unit}
                        </span>
                        {f.of ? <span className="report-of"> of {f.of}</span> : null}
                      </dd>
                      <dd className="report-kind">
                        <span aria-hidden="true" className={`size-1.5 shrink-0 ${MARKER[f.kind]}`} />
                        {f.kind}
                      </dd>
                    </div>
                  ))}
                </dl>

                <BeforeAfter
                  className="report-bars"
                  finding={{
                    title: "",
                    body: "",
                    label: "Pixel to order match, before and after the fix",
                    before: 54,
                    after: 96,
                    unit: "%",
                  }}
                />

                <figcaption className="report-foot">Every figure links to the query that produced it.</figcaption>
              </figure>
            </div>
          </div>

          <div>
            <ul className="grid gap-6">
              {STATEMENTS.map((s) => (
                <li key={s.lead} className="report-statement">
                  <span aria-hidden="true" className="report-tick" />
                  <p>
                    <span className="text-accent-on-dark">{s.lead}</span> {s.rest}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-10 border-t border-ground/20 pt-8">
              <AuditForm />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
