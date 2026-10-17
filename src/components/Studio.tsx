import { STUDIO, TOOLS } from "@/lib/site";
import { AccentText } from "./AccentText";
import { Container } from "./Container";
import { SectionHead } from "./SectionHead";

export function Studio() {
  return (
    <section id="studio" aria-labelledby="studio-title" className="border-t border-line bg-ground-2">
      <Container className="grid gap-10 py-14 md:gap-12 md:py-24 lg:grid-cols-2 lg:py-28">
        <SectionHead index="04" label="Studio" id="studio-title">
          <AccentText text={STUDIO.line} accent={STUDIO.accent} />
        </SectionHead>
        <dl className="grid content-end gap-8 border-t border-line-2 pt-8 sm:grid-cols-2 lg:border-t-0 lg:pt-0">
          <div>
            <dt className="eyebrow">Where</dt>
            <dd className="mt-3 text-base text-ink">{STUDIO.location}</dd>
          </div>
          <div>
            <dt className="eyebrow">Hours</dt>
            <dd className="mt-3 text-base text-ink">{STUDIO.hours}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="eyebrow">Tools we work inside</dt>
            <dd className="mt-3 font-mono text-sm leading-relaxed text-ink">{TOOLS.join(" · ")}</dd>
          </div>
        </dl>
      </Container>
    </section>
  );
}
