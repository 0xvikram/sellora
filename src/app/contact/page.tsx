import type { Metadata } from "next";
import { AuditForm } from "@/components/AuditForm";
import { Close } from "@/components/Close";
import { Container } from "@/components/Container";
import { CopyEmail } from "@/components/CopyEmail";
import { Nav } from "@/components/Nav";
import { SectionHead } from "@/components/SectionHead";
import { BOOKING_URL, CONTACT_EMAIL, REPLY_PROMISE, STUDIO } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Email, book a call, or start the audit with your store address. ${REPLY_PROMISE}`,
  alternates: { canonical: "/contact" },
};

const NEXT_STEPS = ["We read the store.", "You get a written scope and a fixed price.", "You decide."];

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main id="main">
        <Container className="page-head">
          <SectionHead level="h1" label="Contact">
            Talk to the people who <span className="accent-word">do the work.</span>
          </SectionHead>
          <p className="lead mt-6">{REPLY_PROMISE} Start with your store address, or write to us.</p>
        </Container>

        <Container className="grid gap-4 pb-14 md:pb-20 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-5 lg:pb-24">
          <section aria-labelledby="contact-audit-title" className="panel p-6 md:p-10">
            <p className="eyebrow">01 · The audit</p>
            <h2 id="contact-audit-title" className="type-h2 mt-4 text-[clamp(2rem,4vw,3.25rem)]">
              Start with <span className="accent-word">your store.</span>
            </h2>
            <AuditForm id="contact-audit" size="lg" className="mt-8 max-w-none" />
            <h3 className="eyebrow mt-10">What happens next</h3>
            <ol className="mt-4 border-t border-line-2">
              {NEXT_STEPS.map((step, i) => (
                <li key={step} className="flex gap-5 border-b border-line-2 py-3.5 text-base text-ink">
                  <span className="pt-0.5 font-mono text-sm text-lime-ink tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </section>

          <div className="grid gap-4 lg:content-start lg:gap-5">
            <section aria-labelledby="contact-direct-title" className="panel p-6 md:p-8">
              <p className="eyebrow">02 · Write or book</p>
              <h2 id="contact-direct-title" className="type-h3 mt-4">
                Or write to us
              </h2>
              <div className="mt-5">
                <CopyEmail email={CONTACT_EMAIL} />
              </div>
              <p className="mt-8">
                <a href={BOOKING_URL} className="btn btn-primary">
                  Book a 20-minute call
                </a>
              </p>
            </section>
            <section aria-labelledby="contact-hours-title" className="panel p-6 md:p-8">
              <h2 id="contact-hours-title" className="eyebrow">
                Hours
              </h2>
              <dl className="mt-4 grid gap-4 text-base">
                <div>
                  <dt className="font-mono text-xs tracking-[0.12em] text-ink-2 uppercase">Overlap</dt>
                  <dd className="mt-1 text-ink">{STUDIO.hours}</dd>
                </div>
                <div>
                  <dt className="font-mono text-xs tracking-[0.12em] text-ink-2 uppercase">Reply</dt>
                  <dd className="mt-1 text-ink">{REPLY_PROMISE}</dd>
                </div>
                <div>
                  <dt className="font-mono text-xs tracking-[0.12em] text-ink-2 uppercase">Based</dt>
                  <dd className="mt-1 text-ink">{STUDIO.location}</dd>
                </div>
              </dl>
            </section>
          </div>
        </Container>
      </main>
      <Close />
    </>
  );
}
