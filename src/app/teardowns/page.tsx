import type { Metadata } from "next";
import Link from "next/link";
import { Close } from "@/components/Close";
import { Container } from "@/components/Container";
import { Nav } from "@/components/Nav";
import { SectionHead } from "@/components/SectionHead";
import { SampleChip } from "@/components/TeardownCard";
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
        <Container className="py-12 md:py-24">
          <SectionHead level="h1" label="Work">
            Teardowns, with the <span className="accent-word">numbers</span> first.
          </SectionHead>
          <p className="lead mt-6">
            Each teardown states the baseline, the period and how it was measured.
          </p>
          {anySample ? (
            <p className="mt-6 max-w-2xl border-l-2 border-ink bg-lime/30 px-5 py-4 text-base text-ink">
              The entries marked Sample are illustrations of the format, not client results.
            </p>
          ) : null}

          <ul className="mt-10 border-t border-line-2 md:mt-14">
            {TEARDOWNS.map((t) => (
              <li key={t.slug} className="border-b border-line-2">
                <Link
                  href={`/teardowns/${t.slug}`}
                  className="group grid gap-x-8 gap-y-3 py-6 transition-colors hover:bg-card md:grid-cols-[minmax(0,1fr)_16rem_6rem_5.5rem_1.5rem] md:items-center md:px-4"
                >
                  <h2 className="font-display text-[clamp(1.5rem,2.4vw,2rem)] leading-tight font-[450] tracking-[-0.015em] text-ink">
                    {t.metric}
                  </h2>
                  <span className="text-sm text-ink-2">{t.store}</span>
                  <span className="font-mono text-sm text-ink-2 tabular-nums">
                    <span className="md:sr-only">Period: </span>
                    {t.period}
                  </span>
                  <span className="flex items-center justify-between md:block">
                    {t.sample ? <SampleChip /> : null}
                    <span aria-hidden="true" className="font-mono text-lime-ink md:hidden">
                      →
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="hidden font-mono text-lime-ink transition-transform group-hover:translate-x-1 motion-reduce:transition-none md:block"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </main>
      <Close />
    </>
  );
}
