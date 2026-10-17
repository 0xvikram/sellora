import Link from "next/link";
import { BOOKING_URL, CONTACT_EMAIL, NAV_LINKS, REPLY_PROMISE, SITE_NAME } from "@/lib/site";
import { Container } from "./Container";
import { Reveal } from "./Reveal";

// Dark closing section and site footer, shown on every page.
export function Close() {
  return (
    <footer id="contact" aria-labelledby="close-title" className="on-dark">
      <Container className="pt-20 pb-10 md:pt-28">
        <Reveal>
          <h2
            id="close-title"
            className="max-w-4xl font-display text-4xl leading-[1.02] font-semibold tracking-[-0.03em] text-balance md:text-6xl"
          >
            Tell us what is leaking. We will price the fix.
          </h2>
        </Reveal>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href={BOOKING_URL}
            className="inline-flex min-h-12 items-center rounded-full bg-ground px-6 text-base font-medium text-ink transition-colors hover:bg-accent hover:text-ground"
          >
            Book a 20-minute call
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex min-h-12 items-center rounded-full border border-ground/40 px-6 font-mono text-sm text-ground transition-colors hover:border-ground"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
        <p className="mt-5 text-base text-ground/75">{REPLY_PROMISE}</p>

        <div className="mt-20 flex flex-col gap-5 border-t border-ground/20 pt-8 md:flex-row md:items-center md:justify-between">
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-7 gap-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-ground/75 transition-colors hover:text-ground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="font-mono text-xs text-ground/75">
            © {new Date().getFullYear()} {SITE_NAME}
          </p>
        </div>
      </Container>
    </footer>
  );
}
