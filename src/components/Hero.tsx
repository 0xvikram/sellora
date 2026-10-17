import Link from "next/link";
import { SITE_TAGLINE } from "@/lib/site";
import { AuditForm } from "./AuditForm";
import { Container } from "./Container";
import { HeroIntro } from "./HeroIntro";
import { Preview } from "./Preview";

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="bg-ground">
      <Container className="grid gap-12 pt-12 pb-16 md:pt-20 md:pb-24 lg:grid-cols-[46fr_54fr] lg:items-center lg:gap-14 lg:pt-14 lg:pb-20">
        <HeroIntro className="min-w-0">
          <p data-intro className="eyebrow">For e-commerce and D2C brands</p>
          <h1
            id="hero-title"
            className="type-h1 mt-6 text-ink lg:text-[clamp(2.75rem,4.3vw,4.25rem)]"
          >
            See what AI and automation would change on{" "}
            <span className="accent-word">your</span> store.
          </h1>
          <p data-intro className="lead mt-6">{SITE_TAGLINE}</p>

          <div data-intro>
            <AuditForm id="audit" className="mt-8" linkPreview />
          </div>

          <p data-intro className="mt-6">
            <Link href="/prices" className="text-link">
              See prices
            </Link>
          </p>
        </HeroIntro>

        <div className="flex min-w-0 justify-end">
          <div className="w-full max-w-[640px]">
            <Preview />
          </div>
        </div>
      </Container>
    </section>
  );
}
