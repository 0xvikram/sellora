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
        <Container className="page-head">
          <SectionHead level="h1" label="Studio" className="[&_h1]:max-w-5xl">
            <AccentText text={STUDIO.line} accent={STUDIO.accent} />
          </SectionHead>
          <div className="mt-10 grid gap-4 md:mt-14 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-5">
            <div className="panel p-6 md:p-8">
              <p className="eyebrow">How we work</p>
              <p className="lead mt-4">{STUDIO.how}</p>
            </div>
            <div className="panel p-6 md:p-8">
              <p className="eyebrow">Tools we work inside</p>
              <ul className="mt-4 flex flex-wrap gap-2 font-mono text-sm text-ink">
                {TOOLS.map((tool) => (
                  <li key={tool} className="rounded-chip border border-line-2 px-2.5 py-1">
                    {tool}
                  </li>
                ))}
              </ul>
              <p className="eyebrow mt-8">Where</p>
              <p className="mt-3 text-base text-ink">{STUDIO.location}</p>
            </div>
          </div>
        </Container>

        <section aria-labelledby="first-30-title" className="border-t border-line">
          <Container className="page-section">
            <SectionHead label="How a project runs" id="first-30-title">
              The first <span className="accent-word">30 days.</span>
            </SectionHead>
            <ol className="mt-10 grid gap-4 md:mt-14 md:grid-cols-2 md:gap-5 lg:grid-cols-4">
              {FIRST_30_DAYS.map((step, i) => (
                <li key={step.title} className="panel flex flex-col p-6">
                  <p className="flex items-center justify-between gap-3">
                    <span className="font-mono text-sm font-medium text-lime-ink tabular-nums">{step.when}</span>
                    <span className="eyebrow tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  </p>
                  <span aria-hidden="true" className="mt-4 block h-1.5 rounded-full bg-ground-2">
                    <span
                      className="block h-full rounded-full bg-lime shadow-[inset_0_0_0_1px_rgb(10_20_15/0.35)]"
                      style={{ width: `${((i + 1) / FIRST_30_DAYS.length) * 100}%` }}
                    />
                  </span>
                  <h3 className="type-h3 mt-5">{step.title}</h3>
                  <p className="mt-2 text-base text-ink-2">{step.body}</p>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        <section aria-labelledby="not-do-title" className="border-t border-line">
          <Container className="page-section grid gap-10 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-14">
            <SectionHead label="Lines we hold" id="not-do-title">
              What we do <span className="accent-word">not</span> do.
            </SectionHead>
            <ul className="panel px-5 md:px-8">
              {NOT_DO.map((item, i) => (
                <li key={item} className="flex gap-5 border-b border-line py-5 text-lg text-ink last:border-b-0 md:py-6">
                  <span className="pt-1 font-mono text-sm text-lime-ink tabular-nums">
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
