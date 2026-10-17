import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuditForm } from "@/components/AuditForm";
import { BeforeAfter } from "@/components/BeforeAfter";
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

  const index = TEARDOWNS.indexOf(teardown);
  const next = TEARDOWNS[(index + 1) % TEARDOWNS.length];

  const spec = [
    { term: "Store", detail: teardown.store.replace(/^Sample:\s*(.)/, (_, c: string) => c.toUpperCase()) },
    { term: "Period", detail: teardown.period },
    { term: "Method", detail: teardown.method },
  ];

  const how = [
    { term: "Source", detail: teardown.howFound.source },
    { term: "Query", detail: teardown.howFound.query },
    { term: "Check", detail: teardown.howFound.check },
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
          <Container className="py-12 md:py-20">
            <p className="text-sm">
              <Link href="/teardowns" className="text-ink-2 transition-colors hover:text-accent">
                <span aria-hidden="true">←</span> All teardowns
              </Link>
            </p>

            {/* Spec strip: Store · Period · Method · Status */}
            <dl className="mt-8 grid gap-px border border-line-2 bg-line-2 sm:grid-cols-2 lg:grid-cols-[1fr_0.7fr_2fr_0.7fr]">
              {spec.map((item) => (
                <div key={item.term} className="bg-card px-5 py-4">
                  <dt className="eyebrow">{item.term}</dt>
                  <dd className="mt-2 font-mono text-sm leading-snug text-ink">{item.detail}</dd>
                </div>
              ))}
              <div className="bg-card px-5 py-4">
                <dt className="eyebrow">Status</dt>
                <dd className="mt-2">
                  {teardown.sample ? (
                    <SampleChip />
                  ) : (
                    <span className="font-mono text-sm text-ink">Published</span>
                  )}
                </dd>
              </div>
            </dl>

            <Reveal className="mt-12 md:mt-16">
              <h1 className="type-h1 max-w-4xl text-ink">{teardown.metric}</h1>
              <p className="mt-4 text-lg text-ink-2">{teardown.store}</p>
            </Reveal>
            <p className="lead mt-6">{teardown.summary}</p>
            <p className="mt-4 font-mono text-sm text-ink-2">Baseline · {teardown.baseline}</p>

            <section aria-labelledby="findings-title" className="mt-16 md:mt-24">
              <h2 id="findings-title" className="type-h2">
                What we <span className="accent-word">found</span>
              </h2>
              <ol className="mt-8 border-t border-line-2">
                {teardown.findings.map((finding, i) => (
                  <li
                    key={finding.title}
                    className="grid gap-6 border-b border-line-2 py-8 md:grid-cols-[3rem_minmax(0,1fr)_minmax(0,22rem)] md:gap-10 md:py-10"
                  >
                    <span className="font-mono text-sm text-accent tabular-nums md:pt-1.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="type-h3 text-ink">{finding.title}</h3>
                      <p className="measure mt-3 text-base text-ink-2">{finding.body}</p>
                    </div>
                    <BeforeAfter finding={finding} className="md:pt-1.5" />
                  </li>
                ))}
              </ol>
            </section>

            <section aria-labelledby="how-title" className="mt-16 md:mt-24">
              <h2 id="how-title" className="type-h3">
                How we found it
              </h2>
              <dl className="mt-5 max-w-3xl border border-line-2 bg-card px-5 py-4 font-mono text-sm leading-relaxed">
                {how.map((line) => (
                  <div key={line.term} className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3 py-1">
                    <dt className="text-ink-2 uppercase tracking-[0.1em] text-xs leading-[1.7rem]">{line.term}</dt>
                    <dd className="text-ink">{line.detail}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {next && next.slug !== teardown.slug ? (
              <nav aria-label="Next teardown" className="mt-16 border-t border-line-2 pt-6 md:mt-24">
                <p className="eyebrow">Next teardown</p>
                <Link
                  href={`/teardowns/${next.slug}`}
                  className="group mt-3 flex items-baseline justify-between gap-6 text-ink transition-colors hover:text-accent"
                >
                  <span className="font-display text-[clamp(1.5rem,2.6vw,2.25rem)] leading-tight tracking-[-0.015em]">
                    {next.metric}
                  </span>
                  <span aria-hidden="true" className="font-mono text-accent transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
                <p className="mt-2 text-sm text-ink-3">{next.store}</p>
              </nav>
            ) : null}
          </Container>

          <section aria-labelledby="teardown-cta-title" className="border-t border-line bg-card">
            <Container className="grid gap-8 py-12 md:py-16 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
              <div>
                <h2 id="teardown-cta-title" className="type-h2 max-w-xl text-ink">
                  Run the same read on <span className="accent-word">your</span> store.
                </h2>
                <p className="mt-4 text-base text-ink-2">
                  The audit marks each number as measured or generated.
                </p>
              </div>
              <AuditForm id="teardown-audit" className="w-full lg:w-[32rem]" />
            </Container>
          </section>
        </article>
      </main>
      <Close />
    </>
  );
}
