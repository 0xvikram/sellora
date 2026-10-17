import { Container } from "./Container";
import { SectionHead } from "./SectionHead";

// Static frame for the scripted crawl preview that lands in phase 2.
// The legend explains how every line in the preview will be labelled.
const LEGEND = [
  { term: "Measured", detail: "Read from the store itself: pages, products, tags and tracking." },
  { term: "Generated", detail: "Drafted by AI from what was measured, and labelled as a draft." },
  { term: "Sample", detail: "Illustrative only, shown until your own store has been read." },
];

export function Preview() {
  return (
    <section id="preview" aria-labelledby="preview-title" className="border-t border-line">
      <Container className="py-20 md:py-28">
        <SectionHead index="01" label="What the audit shows" id="preview-title">
          A first read of the store, <span className="accent-word">labelled.</span>
        </SectionHead>

        <div className="mt-12 rounded-2xl border border-line-2 bg-card">
          <p className="border-b border-line px-6 py-4 font-mono text-sm text-ink-2">
            <span className="mr-2 rounded-full border border-line-2 px-2 py-0.5 text-xs tracking-[0.1em] uppercase">
              Sample
            </span>
            Sample store: oatleaf.example, 48 product pages read
          </p>
          <dl className="grid gap-px bg-line md:grid-cols-3">
            {LEGEND.map((item) => (
              <div key={item.term} className="bg-card px-6 py-8">
                <dt className="eyebrow">{item.term}</dt>
                <dd className="mt-3 text-base leading-relaxed text-ink">{item.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
