import Link from "next/link";
import { Container } from "./Container";
import { Receipt } from "./Receipt";
import { SectionHead } from "./SectionHead";

export function PricesSection() {
  return (
    <section id="prices" aria-labelledby="prices-title" className="border-t border-line bg-paper-2">
      <Container className="grid gap-12 py-20 md:py-28 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <SectionHead index="03" label="Prices" id="prices-title">
            Prices, before the <span className="accent-word">first call.</span>
          </SectionHead>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-2">
            Every entry job has a fixed price. Scope is agreed in writing before work starts.
          </p>
          <p className="mt-6">
            <Link
              href="/prices"
              className="border-b border-ink pb-0.5 text-base font-medium text-ink hover:border-accent hover:text-accent"
            >
              Full price list and terms
            </Link>
          </p>
        </div>
        <Receipt />
      </Container>
    </section>
  );
}
