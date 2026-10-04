import { REASONS } from "@/lib/site";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

export function WhyUs() {
  return (
    <section id="why" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
        <SectionHead index="03" label="Why us">
          Small on purpose. <span className="accent-word">Clear on price.</span>
        </SectionHead>

        <ul className="mt-14 grid gap-x-10 border-t border-line-2 md:grid-cols-2">
          {REASONS.map((reason, i) => (
            <li key={reason.title} className="border-b border-line-2">
              <Reveal delay={(i % 2) * 0.08} className="flex gap-6 py-8">
                <span className="font-mono text-sm text-ink-3">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-xl font-medium tracking-tight">{reason.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-ink-2">{reason.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
