import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Close } from "@/components/Close";
import { Container } from "@/components/Container";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { SampleChip } from "@/components/TeardownCard";
import { TEARDOWNS } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return TEARDOWNS.map((t) => ({ slug: t.slug }));
}

type Props = { params: Promise<{ slug: string }> };

function find(slug: string) {
  return TEARDOWNS.find((t) => t.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const teardown = find((await params).slug);
  if (!teardown) return {};
  return {
    title: `${teardown.sample ? "Sample: " : ""}${teardown.metric}`,
    description: teardown.summary,
    alternates: { canonical: `/teardowns/${teardown.slug}` },
  };
}

export default async function TeardownPage({ params }: Props) {
  const teardown = find((await params).slug);
  if (!teardown) notFound();

  const facts = [
    { term: "Baseline", detail: teardown.baseline },
    { term: "Period", detail: teardown.period },
    { term: "Method", detail: teardown.method },
  ];

  return (
    <>
      <Nav />
      <main id="main">
        {teardown.sample ? (
          <div role="note" className="border-b border-line-2 bg-ground-2">
            <Container className="flex flex-wrap items-center gap-3 py-3 text-sm text-ink">
              <SampleChip />
              This is a sample teardown that shows the format. It is not a client result.
            </Container>
          </div>
        ) : null}
        <article>
          <Container className="py-12 md:py-24">
            <p className="text-sm">
              <Link href="/teardowns" className="text-ink-2 transition-colors hover:text-accent">
                <span aria-hidden="true">←</span> All teardowns
              </Link>
            </p>
            <Reveal className="mt-8">
              <p className="eyebrow">{teardown.store}</p>
              <h1 className="type-h1 mt-5 max-w-4xl">
                {teardown.metric}
              </h1>
            </Reveal>
            <p className="lead mt-6">{teardown.summary}</p>

            <dl className="mt-10 grid gap-px border border-line-2 bg-line md:mt-14 md:grid-cols-3">
              {facts.map((fact) => (
                <div key={fact.term} className="bg-card p-6">
                  <dt className="eyebrow">{fact.term}</dt>
                  <dd className="mt-3 text-base text-ink">{fact.detail}</dd>
                </div>
              ))}
            </dl>

            <section aria-labelledby="findings-title" className="mt-14 md:mt-20">
              <h2 id="findings-title" className="type-h2">
                What we <span className="accent-word">found</span>
              </h2>
              <ol className="mt-6 max-w-3xl divide-y divide-line-2 border-y border-line-2">
                {teardown.findings.map((finding, i) => (
                  <li key={finding} className="flex gap-5 py-5 text-base text-ink">
                    <span className="pt-0.5 font-mono text-sm text-accent tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span>{finding}</span>
                  </li>
                ))}
              </ol>
            </section>
          </Container>
        </article>
      </main>
      <Close />
    </>
  );
}
