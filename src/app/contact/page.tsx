import type { Metadata } from "next";
import { AuditForm } from "@/components/AuditForm";
import { Close } from "@/components/Close";
import { Container } from "@/components/Container";
import { Nav } from "@/components/Nav";
import { SectionHead } from "@/components/SectionHead";
import { BOOKING_URL, CONTACT_EMAIL, REPLY_PROMISE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Email, book a call, or start the audit with your store address. ${REPLY_PROMISE}`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main id="main">
        <Container className="grid gap-16 py-16 md:py-24 lg:grid-cols-2">
          <div>
            <SectionHead level="h1" label="Contact">
              Talk to the people who <span className="accent-word">do the work.</span>
            </SectionHead>
            <p className="mt-6 text-lg text-ink-2">{REPLY_PROMISE}</p>
            <ul className="mt-8 flex flex-wrap items-center gap-4">
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex min-h-12 items-center rounded-full border border-line-2 bg-card px-6 font-mono text-sm text-ink hover:border-ink"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={BOOKING_URL}
                  className="inline-flex min-h-12 items-center rounded-full bg-ink px-6 text-base font-medium text-ground hover:bg-accent"
                >
                  Book a 20-minute call
                </a>
              </li>
            </ul>
          </div>
          <section aria-labelledby="contact-audit-title" className="rounded-2xl border border-line-2 bg-card p-6 md:p-8">
            <h2
              id="contact-audit-title"
              className="font-display text-2xl font-semibold tracking-[-0.02em]"
            >
              Or start with your store
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-2">
              Paste the address and the audit workspace opens with a first read of the store.
            </p>
            <AuditForm id="contact-audit" className="mt-6" />
          </section>
        </Container>
      </main>
      <Close />
    </>
  );
}
