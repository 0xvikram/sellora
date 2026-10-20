import type { Metadata } from "next";
import { Close } from "@/components/Close";
import { Container } from "@/components/Container";
import { Nav } from "@/components/Nav";
import { Receipt } from "@/components/Receipt";
import { SectionHead } from "@/components/SectionHead";
import { SampleChip } from "@/components/TeardownCard";
import { LADDER, SERVICES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Prices",
  description: "Fixed prices for every entry job, shown before the first call.",
  alternates: { canonical: "/prices" },
};

const TERMS: { term: string; detail: React.ReactNode }[] = [
  { term: "Price", detail: "Fixed price, agreed with the scope. It does not change once work starts." },
  {
    term: "Scope",
    detail: "Agreed in writing before work starts. Anything outside it is priced separately, before it is done.",
  },
  { term: "Payment", detail: "50% to start, 50% on delivery." },
  {
    term: "Timeline",
    detail: (
      <>
        <span className="flex items-center gap-3">
          Typical working days per job <SampleChip />
        </span>
        <ul className="mt-3 max-w-xl font-mono text-sm">
          {SERVICES.map((s) => (
            <li key={s.id} className="flex items-baseline justify-between gap-4 border-b border-line py-2">
              <span className="text-ink-2">{s.title}</span>
              <span className="whitespace-nowrap text-ink tabular-nums">{s.days} days</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    term: "Revisions",
    detail: (
      <>
        Two rounds of changes within the agreed scope.{" "}
        <span className="font-mono text-xs tracking-[0.1em] text-ink-2 uppercase">(placeholder)</span>
      </>
    ),
  },
  { term: "Access", detail: "Collaborator access, never passwords." },
];

export default function PricesPage() {
  return (
    <>
      <Nav />
      <main id="main">
        <Container className="py-12 md:py-24">
          <SectionHead level="h1" label="Prices">
            Prices, before the <span className="accent-word">first call.</span>
          </SectionHead>
          <p className="lead mt-6">
            Every entry job is a one-off at a fixed price. Start with one; nothing here needs a retainer.
          </p>
        </Container>

        <section aria-labelledby="range-title" className="desk border-t border-line">
          <Container className="grid gap-12 py-14 md:py-24 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-16">
            <div className="flex justify-center">
              <Receipt size="full" />
            </div>
            <div>
              <h2 id="range-title" className="type-h3 text-ink">
                What moves a job to the top of the range
              </h2>
              <ul className="mt-6 border-t border-line-2">
                {SERVICES.map((s) => (
                  <li key={s.id} className="border-b border-line-2 py-4">
                    <p className="font-medium text-ink">{s.title}</p>
                    <p className="mt-1 text-base text-ink-2">{s.rangeNote}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>

        <section aria-labelledby="ladder-title" className="border-t border-line bg-ground-2">
          <Container className="py-14 md:py-24">
            <SectionHead label="After the first job" id="ladder-title">
              How work <span className="accent-word">grows,</span> if it does.
            </SectionHead>
            <ol className="mt-10 max-w-4xl md:mt-14">
              {LADDER.map((rung, i) => (
                <li key={rung.step}>
                  {i > 0 ? <span aria-hidden="true" className="ml-8 block h-6 w-px bg-line-control" /> : null}
                  <div className="grid gap-x-6 gap-y-2 border border-line-2 bg-card p-5 md:grid-cols-[2.5rem_8rem_minmax(0,1fr)_auto] md:items-baseline md:p-6">
                    <p className="eyebrow">{rung.step}</p>
                    <h3 className="type-h3">{rung.title}</h3>
                    <p className="text-base text-ink-2">{rung.body}</p>
                    <p className="font-mono text-base font-medium whitespace-nowrap text-lime-ink tabular-nums">
                      {rung.price}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        <section aria-labelledby="terms-title" className="border-t border-line bg-card">
          <Container className="grid gap-8 py-14 md:grid-cols-[minmax(0,16rem)_1fr] md:gap-12 md:py-24">
            <h2 id="terms-title" className="type-h2">
              <span className="accent-word">Terms</span>
            </h2>
            <dl className="border-t border-line-2">
              {TERMS.map((t) => (
                <div key={t.term} className="grid gap-2 border-b border-line-2 py-5 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-6">
                  <dt className="eyebrow pt-1">{t.term}</dt>
                  <dd className="text-base text-ink">{t.detail}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </section>
      </main>
      <Close />
    </>
  );
}
