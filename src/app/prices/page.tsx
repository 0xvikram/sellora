import type { Metadata } from "next";
import { Close } from "@/components/Close";
import { Container } from "@/components/Container";
import { Nav } from "@/components/Nav";
import { Receipt } from "@/components/Receipt";
import { SectionHead } from "@/components/SectionHead";
import { LADDER } from "@/lib/site";

export const metadata: Metadata = {
  title: "Prices",
  description: "Fixed prices for every entry job, shown before the first call.",
  alternates: { canonical: "/prices" },
};

export default function PricesPage() {
  return (
    <>
      <Nav />
      <main id="main">
        <Container className="grid gap-12 py-12 md:gap-14 md:py-24 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <SectionHead level="h1" label="Prices">
              Prices, before the <span className="accent-word">first call.</span>
            </SectionHead>
            <p className="lead mt-6">
              Every entry job is a one-off at a fixed price. Start with one; nothing here needs a
              retainer.
            </p>
          </div>
          <Receipt size="full" />
        </Container>

        <section aria-labelledby="ladder-title" className="border-t border-line bg-ground-2">
          <Container className="py-14 md:py-24">
            <SectionHead label="After the first job" id="ladder-title">
              How work <span className="accent-word">grows,</span> if it does.
            </SectionHead>
            <ol className="mt-10 grid gap-4 md:mt-14 md:grid-cols-3 md:gap-5">
              {LADDER.map((rung) => (
                <li key={rung.step} className="flex flex-col border border-line-2 bg-card p-6">
                  <p className="eyebrow">{rung.step}</p>
                  <h3 className="type-h3 mt-4">
                    {rung.title}
                  </h3>
                  <p className="mt-2 font-mono text-sm font-medium text-accent tabular-nums">{rung.price}</p>
                  <p className="mt-4 text-base text-ink-2">{rung.body}</p>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        <section aria-labelledby="terms-title" className="border-t border-line bg-card">
          <Container className="grid gap-6 py-14 md:grid-cols-[minmax(0,16rem)_1fr] md:gap-12 md:py-24">
            <h2 id="terms-title" className="type-h3">
              Terms
            </h2>
            <p className="lead">
              Every job is a fixed price. The scope is agreed in writing before work starts. We
              invoice 50% upfront and the remaining 50% on delivery.
            </p>
          </Container>
        </section>
      </main>
      <Close />
    </>
  );
}
