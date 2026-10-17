import Link from "next/link";
import { SITE_TAGLINE } from "@/lib/site";
import { AuditForm } from "./AuditForm";
import { Container } from "./Container";

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="bg-ground">
      <Container className="pt-12 pb-16 md:pt-24 md:pb-28">
        <p className="eyebrow">For e-commerce and D2C brands</p>
        <h1
          id="hero-title"
          className="type-h1 mt-6 max-w-5xl text-ink"
        >
          See what AI and automation would change on{" "}
          <span className="accent-word">your</span> store.
        </h1>
        <p className="lead mt-7">{SITE_TAGLINE}</p>

        <AuditForm id="audit" className="mt-10" />

        <p className="mt-6">
          <Link href="/prices" className="text-link">
            See prices
          </Link>
        </p>
      </Container>
    </section>
  );
}
