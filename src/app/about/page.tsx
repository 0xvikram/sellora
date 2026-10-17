import type { Metadata } from "next";
import { Close } from "@/components/Close";
import { Container } from "@/components/Container";
import { Nav } from "@/components/Nav";
import { AccentText } from "@/components/AccentText";
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
        <Container className="py-12 md:py-24">
          <SectionHead level="h1" label="Studio" className="[&_h1]:max-w-4xl">
            <AccentText text={STUDIO.line} accent={STUDIO.accent} />
          </SectionHead>
          <dl className="mt-10 grid max-w-3xl gap-8 border-t border-line-2 pt-8 sm:grid-cols-2 md:mt-14">
            <div>
              <dt className="eyebrow">Where</dt>
              <dd className="mt-3 text-lg text-ink">{STUDIO.location}</dd>
            </div>
            <div>
              <dt className="eyebrow">Hours</dt>
              <dd className="mt-3 text-lg text-ink">{STUDIO.hours}</dd>
            </div>
          </dl>
        </Container>

        <section aria-labelledby="first-30-title" className="border-t border-line bg-ground-2">
          <Container className="py-14 md:py-24">
            <SectionHead label="How a project runs" id="first-30-title">
              The first <span className="accent-word">30 days.</span>
            </SectionHead>
            <ol className="mt-10 grid gap-4 md:mt-14 md:grid-cols-2 md:gap-5 lg:grid-cols-4">
              {FIRST_30_DAYS.map((step, i) => (
                <li key={step.title} className="border border-line-2 bg-card p-6">
                  <p className="eyebrow">
                    {String(i + 1).padStart(2, "0")} · {step.when}
                  </p>
                  <h3 className="type-h3 mt-4">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-base text-ink-2">{step.body}</p>
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
