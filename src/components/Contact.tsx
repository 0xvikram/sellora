import { CONTACT_EMAIL, NAV_LINKS, SITE_NAME } from "@/lib/site";
import { ContactParticles, Wordmark } from "./ContactFx";
import { Magnetic } from "./fx/Magnetic";
import { Reveal } from "./Reveal";

// Dark closing section: the call to action, then a giant wordmark.
export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden bg-ink text-paper">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-accent opacity-35 blur-[140px]"
        aria-hidden="true"
      />
      <ContactParticles />
      <div className="relative mx-auto max-w-7xl px-5 pt-24 text-center md:px-8 md:pt-36">
        <Reveal>
          <p className="eyebrow !text-paper/50">Start here</p>
          <h2 className="mx-auto mt-6 max-w-5xl font-display text-5xl leading-[0.98] font-semibold tracking-[-0.035em] text-balance md:text-8xl">
            Tell us what is leaking. We will{" "}
            <span className="accent-word !text-[#aab4ff]">price the fix.</span>
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-paper/65">
            A 20-minute call or an email. Fixed price and scope in writing
            before work starts.
          </p>
          <div className="mt-11 flex flex-wrap items-center justify-center gap-5">
            <Magnetic>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Call request")}`}
                className="inline-flex items-center gap-3 rounded-full bg-paper py-2 pr-2 pl-7 text-base font-medium text-ink"
              >
                Book a 20-minute call
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-white">
                  →
                </span>
              </a>
            </Magnetic>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="rounded-full border border-paper/25 px-7 py-4 font-mono text-sm transition-colors hover:border-paper"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </Reveal>
      </div>

      <footer className="relative mt-24 md:mt-32">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 border-t border-paper/15 px-5 py-8 md:flex-row md:items-center md:justify-between md:px-8">
          <nav className="flex flex-wrap gap-x-7 gap-y-2" aria-label="Footer">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-paper/60 transition-colors hover:text-paper"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <p className="font-mono text-xs text-paper/45">
            © {new Date().getFullYear()} {SITE_NAME}
          </p>
        </div>
        <Wordmark text={SITE_NAME} />
      </footer>
    </section>
  );
}
