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
        <Container className="grid gap-12 py-12 md:py-24 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHead level="h1" label="Contact">
              Talk to the people who <span className="accent-word">do the work.</span>
            </SectionHead>
            <p className="lead mt-6">{REPLY_PROMISE}</p>
            <ul className="mt-8 flex flex-wrap items-center gap-3 md:gap-4">
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="btn btn-secondary bg-card font-mono text-sm font-normal"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={BOOKING_URL}
                  className="btn btn-primary"
                >
                  Book a 20-minute call
                </a>
              </li>
            </ul>
          </div>
          <section aria-labelledby="contact-audit-title" className="self-start border border-line-2 bg-card p-6 md:p-8">
            <h2
              id="contact-audit-title"
              className="type-h3"
            >
              Or start with your store
            </h2>
            <p className="mt-3 text-base text-ink-2">
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
