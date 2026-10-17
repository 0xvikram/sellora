import { Container } from "./Container";
import { SectionHead } from "./SectionHead";

// Static frame for the scripted crawl preview that lands in a later phase.
// The legend explains how every line in the preview will be labelled; each
// label has its own marker colour (accent, moss, sand), used as fills only.
const LEGEND = [
  {
    term: "Measured",
    marker: "bg-accent",
    detail: "Read from the store itself: pages, products, tags and tracking.",
  },
  {
    term: "Generated",
    marker: "bg-moss",
    detail: "Drafted by AI from what was measured, and labelled as a draft.",
  },
  {
    term: "Sample",
    marker: "bg-sand",
    detail: "Illustrative only, shown until your own store has been read.",
  },
];

export function Preview() {
  return (
    <section id="preview" aria-labelledby="preview-title" className="border-t border-line bg-ground-2">
      <Container className="py-14 md:py-24 lg:py-28">
        <SectionHead index="01" label="What the audit shows" id="preview-title">
          A first read of the store, <span className="accent-word">labelled.</span>
        </SectionHead>

        <div className="mt-10 border border-line-2 bg-card md:mt-14">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-line px-5 py-4 font-mono text-sm text-ink-2 md:px-6">
            <span className="chip">Sample</span>
            Sample store: oatleaf.example, 48 product pages read
          </p>
          <dl className="grid gap-px bg-line md:grid-cols-3">
            {LEGEND.map((item) => (
              <div key={item.term} className="bg-card px-5 py-7 md:px-6 md:py-8">
                <dt className="eyebrow flex items-center gap-2.5">
                  <span className={`size-2 ${item.marker}`} aria-hidden="true" />
                  {item.term}
                </dt>
                <dd className="mt-3 text-base text-ink">{item.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
