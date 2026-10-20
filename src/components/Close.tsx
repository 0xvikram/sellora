import Link from "next/link";
import { BOOKING_URL, CONTACT_EMAIL, NAV_LINKS, REPLY_PROMISE, SITE_NAME, STUDIO } from "@/lib/site";
import { Container } from "./Container";
import { Reveal } from "./Reveal";

// The closing call to action and site footer, on every page: the ink
// ground (its own background, and data-ground="ink" so the home ground and
// the nav pill follow it). Bone text (17.06:1), muted at 75% (9.84:1),
// lime accent (15.03:1), the lime CTA. The wordmark at 26vw (Archivo
// condensed, bone at 8%, decorative) sits on its bottom edge behind the
// footer links, so the page ends with a mark.
export function Close() {
  return (
    <footer id="contact" aria-labelledby="close-title" data-ground="ink" className="on-dark overflow-hidden">
      <Container className="relative z-[1] pt-16 pb-[22vw] md:pt-28 md:pb-[14vw]">
        <Reveal>
          <p className="eyebrow">Contact</p>
          <h2
            id="close-title"
            className="mt-5 max-w-5xl text-[clamp(2.75rem,7vw,6.5rem)] text-ink"
          >
            Tell us what is leaking. We will price <span className="accent-word">the fix.</span>
          </h2>
        </Reveal>
        <div className="mt-10 flex flex-wrap items-center gap-3 md:gap-4">
          <a href={BOOKING_URL} className="btn btn-primary">
            Book a 20-minute call
          </a>
          <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn-ghost font-mono text-sm font-normal">
            {CONTACT_EMAIL}
          </a>
        </div>
        <p className="mt-5 text-base text-ink-2">{REPLY_PROMISE}</p>
        <p className="mt-1 text-base text-ink-2">{STUDIO.hours}.</p>

        <div className="mt-16 flex flex-col gap-5 border-t border-line-2 pt-8 md:mt-20 md:flex-row md:items-center md:justify-between">
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-7 gap-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-ink-2 transition-colors hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="font-mono text-xs text-ink-2">
            © {new Date().getFullYear()} {SITE_NAME}
          </p>
        </div>
      </Container>
      <p aria-hidden="true" className="close-mark">
        {SITE_NAME}
      </p>
    </footer>
  );
}
