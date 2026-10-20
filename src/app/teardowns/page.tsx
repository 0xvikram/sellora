import type { Metadata } from "next";
import Link from "next/link";
import { Close } from "@/components/Close";
import { Container } from "@/components/Container";
import { Nav } from "@/components/Nav";
import { SectionHead } from "@/components/SectionHead";
import { MetricAccent, SampleChip } from "@/components/TeardownCard";
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
        <Container className="page-head pb-14 md:pb-20 lg:pb-24">
          <SectionHead level="h1" label="Work">
            Teardowns, with the <span className="accent-word">numbers</span> first.
          </SectionHead>
          <p className="lead mt-6">
            Each teardown states the baseline, the period and how it was measured.
          </p>
          {anySample ? (
            <p className="mt-6 max-w-2xl rounded-panel border border-ink bg-lime px-5 py-4 text-base text-ink">
              The entries marked Sample are illustrations of the format, not client results.
            </p>
          ) : null}

          <ul className="panel mt-10 overflow-hidden md:mt-14">
            {TEARDOWNS.map((t) => (
              <li key={t.slug} className="border-b border-line last:border-b-0">
                <Link
                  href={`/teardowns/${t.slug}`}
                  className="group grid gap-x-8 gap-y-3 px-5 py-6 transition-colors hover:bg-ground-2 focus-visible:bg-ground-2 md:grid-cols-[minmax(0,1fr)_16rem_6rem_5.5rem_1.5rem] md:items-center md:px-7 md:py-7"
                >
                  <h2 className="text-[clamp(1.75rem,2.8vw,2.5rem)] text-ink">
                    <MetricAccent metric={t.metric} />
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
