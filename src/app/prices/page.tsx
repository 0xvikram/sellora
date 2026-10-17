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
        <Container className="grid gap-14 py-16 md:py-24 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <SectionHead level="h1" label="Prices">
              Prices, before the <span className="accent-word">first call.</span>
            </SectionHead>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-2">
              Every entry job is a one-off at a fixed price. Start with one; nothing here needs a
              retainer.
            </p>
          </div>
          <Receipt size="full" />
        </Container>

        <section aria-labelledby="ladder-title" className="border-t border-line">
          <Container className="py-16 md:py-24">
            <SectionHead label="After the first job" id="ladder-title">
              How work grows, if it does.
            </SectionHead>
            <ol className="mt-12 grid gap-5 md:grid-cols-3">
              {LADDER.map((rung) => (
                <li key={rung.step} className="rounded-2xl border border-line-2 bg-card p-6">
                  <p className="eyebrow">{rung.step}</p>
                  <h3 className="mt-4 font-display text-2xl font-semibold tracking-[-0.02em]">
                    {rung.title}
                  </h3>
                  <p className="mt-2 font-mono text-sm text-ink">{rung.price}</p>
                  <p className="mt-4 text-base leading-relaxed text-ink-2">{rung.body}</p>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        <section aria-labelledby="terms-title" className="border-t border-line">
          <Container className="py-16 md:py-24">
            <h2 id="terms-title" className="font-display text-2xl font-semibold tracking-[-0.02em]">
              Terms
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-2">
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
