import { CONTACT_EMAIL, NAV_LINKS, SITE_NAME } from "@/lib/site";
import { Logo } from "./Nav";
import { Reveal } from "./Reveal";

export function Contact() {
  return (
    <>
      <section id="contact" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 py-24 text-center md:px-8 md:py-36">
          <Reveal>
            <p className="eyebrow">Start here</p>
            <h2 className="mx-auto mt-5 max-w-4xl text-5xl leading-[1.02] font-medium tracking-tight text-balance md:text-7xl">
              Tell us what is leaking. We will{" "}
              <span className="accent-word">price the fix.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-2">
              A 20-minute call, or a few lines by email. You get a fixed price
              and a scope in writing before any work starts.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Call request")}`}
                className="rounded-full bg-accent px-7 py-4 text-base font-medium text-white transition-transform hover:-translate-y-0.5"
              >
                Book a 20-minute call
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="rounded-full border border-line-2 px-7 py-4 font-mono text-sm transition-colors hover:border-ink"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-8">
          <Logo />
          <nav className="flex flex-wrap gap-x-7 gap-y-2" aria-label="Footer">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-ink-2 transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <p className="font-mono text-xs text-ink-3">
            © {new Date().getFullYear()} {SITE_NAME}
          </p>
        </div>
      </footer>
    </>
  );
}
