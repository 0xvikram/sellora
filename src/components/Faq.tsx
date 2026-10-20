import { FAQS } from "@/lib/site";
import { Container } from "./Container";
import { SectionHead } from "./SectionHead";

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" data-ground="bone">
      <Container className="grid gap-10 py-14 md:gap-12 md:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:py-28">
        <SectionHead index="06" label="FAQ" id="faq-title">
          Questions, <span className="accent-word">answered.</span>
        </SectionHead>

        <div className="border-t border-line-2 self-start">
          {FAQS.map((item) => (
            <details key={item.q} className="group border-b border-line">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                <h3 className="font-sans text-lg font-medium tracking-normal">{item.q}</h3>
                <span
                  className="grid size-8 shrink-0 place-items-center rounded-full border border-dark bg-lime font-mono text-lg leading-none text-dark transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="measure pb-5 text-[17px] leading-[1.6] text-ink-2">{item.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
