import type { Metadata } from "next";
import { AccentText } from "@/components/AccentText";
import { Close } from "@/components/Close";
import { Container } from "@/components/Container";
import { Nav } from "@/components/Nav";
import { ProofStrip } from "@/components/ProofStrip";
import { SectionHead } from "@/components/SectionHead";
import { NOT_DO, STUDIO, TOOLS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Studio",
  description: STUDIO.line,
  alternates: { canonical: "/about" },
};

const FIRST_30_DAYS = [
  {
    when: "Days 1–3",
    title: "Read and scope",
    body: "We read the store and put the scope and fixed price in writing.",
  },
  {
    when: "Days 4–7",
    title: "Access and baseline",
    body: "Collaborator access, then a baseline from your own data.",
  },
  {
    when: "Days 8–24",
    title: "Build",
    body: "The work, inside your tools, with a short written update each week.",
  },
  {
    when: "Days 25–30",
    title: "Measure and hand over",
    body: "Results against the baseline, plus a recording and notes to keep.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main id="main">
        <Container className="py-12 md:py-24">
          <SectionHead level="h1" label="Studio" className="[&_h1]:max-w-4xl">
            <AccentText text={STUDIO.line} accent={STUDIO.accent} />
          </SectionHead>
          <div className="mt-10 grid gap-10 border-t border-line-2 pt-8 md:mt-14 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16">
            <p className="lead">{STUDIO.how}</p>
            <div>
              <p className="eyebrow">Tools we work inside</p>
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-mono text-sm text-ink">
                {TOOLS.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            </div>
          </div>
        </Container>

        <section aria-labelledby="first-30-title" className="border-t border-line bg-ground-2">
          <Container className="py-14 md:py-24">
            <SectionHead label="How a project runs" id="first-30-title">
              The first <span className="accent-word">30 days.</span>
            </SectionHead>
            {/* Vertical list on mobile, a horizontal hairline with four nodes from md. */}
            <ol data-timeline className="relative mt-10 grid gap-9 md:mt-14 md:grid-cols-4 md:gap-8">
              <span
                aria-hidden="true"
                className="absolute top-1.5 bottom-1.5 left-[5px] w-px bg-line-control md:top-[5px] md:right-0 md:bottom-auto md:left-0 md:h-px md:w-auto"
              />
              {FIRST_30_DAYS.map((step) => (
                <li key={step.title} className="relative pl-9 md:pt-9 md:pl-0">
                  <span
                    aria-hidden="true"
                    className="absolute top-0.5 left-0 size-[11px] border border-ink bg-lime md:top-0"
                  />
                  <p className="font-mono text-sm font-medium text-lime-ink tabular-nums">{step.when}</p>
                  <h3 className="type-h3 mt-2">{step.title}</h3>
                  <p className="mt-2 text-base text-ink-2">{step.body}</p>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        <section aria-labelledby="not-do-title" className="border-t border-line bg-card">
          <Container className="grid gap-8 py-14 md:grid-cols-[minmax(0,16rem)_1fr] md:gap-12 md:py-24">
            <h2 id="not-do-title" className="type-h2">
              What we do <span className="accent-word">not</span> do
            </h2>
            <ul className="border-t border-line-2">
              {NOT_DO.map((item, i) => (
                <li key={item} className="flex gap-5 border-b border-line-2 py-5 text-lg text-ink">
                  <span className="pt-1 font-mono text-sm text-ink-2 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <ProofStrip />
      </main>
      <Close />
    </>
  );
}
