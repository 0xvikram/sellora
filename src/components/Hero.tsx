import Link from "next/link";
import { SITE_TAGLINE } from "@/lib/site";
import { AuditForm } from "./AuditForm";
import { Container } from "./Container";
import { HeroIntro } from "./HeroIntro";
import { Preview } from "./Preview";

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" data-ground="bone">
      <Container className="grid gap-12 pt-12 pb-16 md:pt-20 md:pb-24 lg:grid-cols-[48fr_52fr] lg:items-start lg:gap-14 lg:pt-10 lg:pb-20">
        <HeroIntro className="min-w-0">
          <p data-intro className="eyebrow">For e-commerce and D2C brands</p>
          <h1
            id="hero-title"
            className="type-h1 mt-6 text-ink lg:text-[clamp(3.5rem,5.4vw,6rem)]"
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

        {/* On lg the panel starts 24px below the top of the H1 (the eyebrow
            line is 0.9rem plus its 1.5rem gap). On mobile it runs under the
            form with 16px gutters. */}
        <div className="-mx-1 min-w-0 md:mx-0 lg:mt-[calc(2.4rem+24px)]">
          <Preview />
        </div>
      </Container>
    </section>
  );
}
