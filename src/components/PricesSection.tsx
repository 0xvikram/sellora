import Link from "next/link";
import { Container } from "./Container";
import { Receipt } from "./Receipt";
import { SectionHead } from "./SectionHead";

export function PricesSection() {
  return (
    <section id="prices" aria-labelledby="prices-title" className="border-t border-line bg-card">
      <Container className="grid gap-12 py-14 md:py-24 lg:grid-cols-[1fr_auto] lg:items-start lg:py-28">
        <div>
          <SectionHead index="04" label="Prices" id="prices-title">
            Prices, before the <span className="accent-word">first call.</span>
          </SectionHead>
          <p className="lead mt-6">
            Every entry job has a fixed price. Scope is agreed in writing before work starts.
          </p>
          <p className="mt-6">
            <Link href="/prices" className="text-link">
              Full price list and terms
            </Link>
          </p>
        </div>
        <Receipt />
      </Container>
    </section>
  );
}
