import Link from "next/link";
import { SITE_TAGLINE } from "@/lib/site";
import { AuditForm } from "./AuditForm";
import { Container } from "./Container";

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title">
      <Container className="pt-14 pb-20 md:pt-24 md:pb-28">
        <p className="eyebrow">For e-commerce and D2C brands</p>
        <h1
          id="hero-title"
          className="mt-6 max-w-4xl font-display text-[clamp(2.25rem,8vw,5rem)] leading-[1] font-bold tracking-[-0.03em] text-balance"
        >
          See what AI and automation would change on{" "}
          <span className="accent-word">your</span> store.
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-2">{SITE_TAGLINE}</p>

        <AuditForm id="audit" className="mt-10" />

        <p className="mt-6">
          <Link
            href="/prices"
            className="border-b border-ink pb-0.5 text-base font-medium text-ink transition-colors hover:border-accent hover:text-accent"
          >
            See prices
          </Link>
        </p>
      </Container>
    </section>
  );
}
