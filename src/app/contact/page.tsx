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
        <Container className="py-12 md:py-24">
          <SectionHead level="h1" label="Contact">
            Talk to the people who <span className="accent-word">do the work.</span>
          </SectionHead>

          <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-2 md:gap-0">
            <section aria-labelledby="contact-audit-title" className="md:border-r md:border-line-2 md:pr-12 lg:pr-16">
              <h2 id="contact-audit-title" className="type-h3">
                Start with your store
              </h2>
              <AuditForm id="contact-audit" size="lg" className="mt-6 max-w-none" />
              <p className="mt-6 text-base text-ink">{REPLY_PROMISE}</p>
              <h3 className="eyebrow mt-10 font-mono tracking-[0.14em]">What happens next</h3>
              <ol className="mt-4 border-t border-line-2">
                {NEXT_STEPS.map((step, i) => (
                  <li key={step} className="flex gap-5 border-b border-line-2 py-3.5 text-base text-ink">
                    <span className="pt-0.5 font-mono text-sm text-accent tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </section>

            <section aria-labelledby="contact-direct-title" className="border-t border-line-2 pt-10 md:border-t-0 md:pt-0 md:pl-12 lg:pl-16">
              <h2 id="contact-direct-title" className="type-h3">
                Or write to us
              </h2>
              <div className="mt-6">
                <CopyEmail email={CONTACT_EMAIL} />
              </div>
              <p className="mt-8">
                <a href={BOOKING_URL} className="btn btn-primary">
                  Book a 20-minute call
                </a>
              </p>
              <dl className="mt-10 border-t border-line-2 pt-6">
                <dt className="eyebrow">Hours</dt>
                <dd className="mt-3 text-base text-ink">{STUDIO.hours}</dd>
              </dl>
            </section>
          </div>
        </Container>
      </main>
      <Close />
    </>
  );
}
