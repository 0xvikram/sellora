import { STUDIO, TOOLS } from "@/lib/site";
import { AccentText } from "./AccentText";
import { Container } from "./Container";
import { Reveal } from "./Reveal";

// The studio line as a pull-quote at H2 scale (a hanging accent quote
// mark, the accent words in italic), then where / hours / tools in a
// bordered card on the linen ground.
export function Studio() {
  return (
    <section id="studio" aria-labelledby="studio-title" className="border-t border-line bg-ground-2">
      <Container className="py-14 md:py-24 lg:py-28">
        <Reveal>
          <p className="flex items-center gap-3">
          <span className="eyebrow">05</span>
          <span className="h-px w-8 bg-line-2" aria-hidden="true" />
          <span className="eyebrow">Studio</span>
        </p>
        <h2 id="studio-title" className="studio-quote mt-8 max-w-5xl text-ink">
          <span aria-hidden="true" className="studio-mark">
            “
          </span>
          <AccentText text={STUDIO.line} accent={STUDIO.accent} />
        </h2>
        </Reveal>
        <dl className="mt-12 grid gap-8 border border-line-2 bg-ground p-6 sm:grid-cols-2 md:mt-16 md:p-8 lg:grid-cols-[1fr_1fr_1.4fr] lg:gap-10">
          <div>
            <dt className="eyebrow">Where</dt>
            <dd className="mt-3 text-base text-ink">{STUDIO.location}</dd>
          </div>
          <div>
            <dt className="eyebrow">Hours</dt>
            <dd className="mt-3 text-base text-ink">{STUDIO.hours}</dd>
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <dt className="eyebrow">Tools we work inside</dt>
            <dd className="mt-3 font-mono text-sm leading-relaxed text-ink">{TOOLS.join(" · ")}</dd>
          </div>
        </dl>
      </Container>
    </section>
  );
}
