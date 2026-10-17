import { FAQS } from "@/lib/site";
import { SectionHead } from "./SectionHead";

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="border-t border-line bg-card">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHead index="05" label="FAQ" id="faq-title">
          Questions, <span className="accent-word">answered.</span>
        </SectionHead>

        <div className="border-t border-line-2">
          {FAQS.map((item) => (
            <details key={item.q} className="group border-b border-line-2">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-medium tracking-tight [&::-webkit-details-marker]:hidden">
                <h3 className="font-sans text-lg font-medium">{item.q}</h3>
                <span
                  className="font-mono text-xl text-accent group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="max-w-2xl pb-7 text-base leading-relaxed text-ink-2">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
