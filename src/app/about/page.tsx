import type { Metadata } from "next";
import { Close } from "@/components/Close";
import { Container } from "@/components/Container";
import { Nav } from "@/components/Nav";
import { SectionHead } from "@/components/SectionHead";
import { STUDIO } from "@/lib/site";

export const metadata: Metadata = {
  title: "Studio",
  description: STUDIO.line,
  alternates: { canonical: "/about" },
};

const FIRST_30_DAYS = [
  {
    when: "Days 1–3",
    title: "Read and scope",
    body: "We read the store, agree the scope and a fixed price, and put both in writing.",
  },
  {
    when: "Week 1",
    title: "Access and baseline",
    body: "Collaborator access to the accounts the job touches, then a baseline taken from your Shopify orders.",
  },
  {
    when: "Weeks 2–3",
    title: "Build",
    body: "The work happens inside your own tools, with a short written update each week.",
  },
  {
    when: "Week 4",
    title: "Measure and hand over",
    body: "Results compared with the baseline, plus a recording and notes your team can keep.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main id="main">
        <Container className="py-16 md:py-24">
          <SectionHead level="h1" label="Studio">
            {STUDIO.line}
          </SectionHead>
          <dl className="mt-12 grid max-w-3xl gap-8 sm:grid-cols-2">
            <div>
              <dt className="eyebrow">Where</dt>
              <dd className="mt-3 text-lg leading-relaxed text-ink">{STUDIO.location}</dd>
            </div>
            <div>
              <dt className="eyebrow">Hours</dt>
              <dd className="mt-3 text-lg leading-relaxed text-ink">{STUDIO.hours}</dd>
            </div>
          </dl>
        </Container>

        <section aria-labelledby="first-30-title" className="border-t border-line">
          <Container className="py-16 md:py-24">
            <SectionHead label="How a project runs" id="first-30-title">
              The first 30 days.
            </SectionHead>
            <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {FIRST_30_DAYS.map((step, i) => (
                <li key={step.title} className="rounded-2xl border border-line-2 bg-card p-6">
                  <p className="eyebrow">
                    {String(i + 1).padStart(2, "0")} · {step.when}
                  </p>
                  <h3 className="mt-4 font-display text-xl font-semibold tracking-[-0.02em]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-ink-2">{step.body}</p>
                </li>
              ))}
            </ol>
          </Container>
        </section>
      </main>
      <Close />
    </>
  );
}
