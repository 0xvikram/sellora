import { STUDIO } from "@/lib/site";
import { Container } from "./Container";
import { SectionHead } from "./SectionHead";

export function Studio() {
  return (
    <section id="studio" aria-labelledby="studio-title" className="border-t border-line">
      <Container className="grid gap-12 py-20 md:py-28 lg:grid-cols-2">
        <SectionHead index="04" label="Studio" id="studio-title">
          {STUDIO.line}
        </SectionHead>
        <dl className="grid content-end gap-8 sm:grid-cols-2">
          <div>
            <dt className="eyebrow">Where</dt>
            <dd className="mt-3 text-base leading-relaxed text-ink">{STUDIO.location}</dd>
          </div>
          <div>
            <dt className="eyebrow">Hours</dt>
            <dd className="mt-3 text-base leading-relaxed text-ink">{STUDIO.hours}</dd>
          </div>
        </dl>
      </Container>
    </section>
  );
}
