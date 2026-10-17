import type { Metadata } from "next";
import { Close } from "@/components/Close";
import { Container } from "@/components/Container";
import { Nav } from "@/components/Nav";
import { SectionHead } from "@/components/SectionHead";
import { TeardownCard } from "@/components/TeardownCard";
import { TEARDOWNS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Work",
  description: "Store teardowns with the baseline, period and method stated.",
  alternates: { canonical: "/teardowns" },
};

export default function TeardownsPage() {
  const anySample = TEARDOWNS.some((t) => t.sample);
  return (
    <>
      <Nav />
      <main id="main">
        <Container className="py-16 md:py-24">
          <SectionHead
            level="h1"
            label="Work"
            aside="Each teardown states the baseline, the period and how it was measured."
          >
            Teardowns, with the <span className="accent-word">numbers</span> first.
          </SectionHead>
          {anySample ? (
            <p className="mt-8 max-w-2xl rounded-xl border border-line-2 bg-card px-5 py-4 text-base text-ink">
              The entries marked Sample are illustrations of the format, not client results.
            </p>
          ) : null}
          <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {TEARDOWNS.map((teardown) => (
              <li key={teardown.slug}>
                <TeardownCard teardown={teardown} headingLevel="h2" />
              </li>
            ))}
          </ul>
        </Container>
      </main>
      <Close />
    </>
  );
}
