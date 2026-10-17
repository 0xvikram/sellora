import Link from "next/link";
import { BOOKING_URL, CONTACT_EMAIL, NAV_LINKS, REPLY_PROMISE, SITE_NAME, STUDIO } from "@/lib/site";
import { Container } from "./Container";
import { Reveal } from "./Reveal";

// The one dark section: closing call to action and site footer, on every
// page. Ground text on #1a1c1b (14.69:1), muted at 75% (8.75:1), accent
// brightened to #7fb8b0 (7.66:1). It sits above the grain layer. The
// brand wordmark at 20vw (ground at 8%, decorative) sits on its bottom
// edge behind the footer links, so the page ends with a mark.
export function Close() {
  return (
    <footer id="contact" aria-labelledby="close-title" className="on-dark overflow-hidden">
      <Container className="relative z-[1] pt-16 pb-[18vw] md:pt-28 md:pb-[9vw]">
        <Reveal>
          <p className="eyebrow">Contact</p>
          <h2
            id="close-title"
            className="mt-5 max-w-4xl text-[clamp(2.5rem,5.5vw,4.75rem)] leading-[1.04] text-ground"
          >
            Tell us what is leaking. We will price <span className="accent-word">the fix.</span>
          </h2>
        </Reveal>
        <div className="mt-10 flex flex-wrap items-center gap-3 md:gap-4">
          <a href={BOOKING_URL} className="btn btn-primary">
            Book a 20-minute call
          </a>
          <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn-secondary font-mono text-sm font-normal">
            {CONTACT_EMAIL}
          </a>
        </div>
        <p className="mt-5 text-base text-ground/75">{REPLY_PROMISE}</p>
        <p className="mt-1 text-base text-ground/75">{STUDIO.hours}.</p>

        <div className="mt-16 flex flex-col gap-5 border-t border-ground/20 pt-8 md:mt-20 md:flex-row md:items-center md:justify-between">
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
      <p aria-hidden="true" className="close-mark">
        {SITE_NAME}
      </p>
    </footer>
  );
}
