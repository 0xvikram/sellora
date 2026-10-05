import { REASONS } from "@/lib/site";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

// Per-card look for the bento grid: two large feature cards, three small.
const LOOKS = [
  { span: "md:col-span-3", tone: "bg-accent text-white", sub: "text-white/75", mark: "$" },
  { span: "md:col-span-3", tone: "bg-ink text-paper", sub: "text-paper/65", mark: "2" },
  { span: "md:col-span-2", tone: "border border-line bg-card", sub: "text-ink-2", mark: "=" },
  { span: "md:col-span-2", tone: "border border-line bg-card", sub: "text-ink-2", mark: "+" },
  { span: "md:col-span-2", tone: "border border-line bg-accent-soft", sub: "text-ink-2", mark: "1" },
];

export function WhyUs() {
  return (
    <section id="why" className="border-t border-line">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <SectionHead index="03" label="Why us">
          Small on purpose. <span className="accent-word">Clear on price.</span>
        </SectionHead>

        <ul className="mt-14 grid gap-4 md:grid-cols-6">
          {REASONS.map((reason, i) => {
            const look = LOOKS[i % LOOKS.length];
            const large = i < 2;
            return (
              <li key={reason.title} className={look.span}>
                <Reveal
                  delay={(i % 3) * 0.08}
                  className={`relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-7 md:p-9 ${look.tone} ${large ? "min-h-[19rem]" : "min-h-[15rem]"}`}
                >
                  <span
                    className={`pointer-events-none absolute -right-4 -bottom-10 font-serif leading-none italic opacity-15 select-none ${large ? "text-[15rem]" : "text-[11rem]"}`}
                    aria-hidden="true"
                  >
                    {look.mark}
                  </span>
                  <span className="font-mono text-sm opacity-70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="relative">
                    <h3
                      className={`font-medium tracking-tight ${large ? "text-3xl md:text-4xl" : "text-2xl"}`}
                    >
                      {reason.title}
                    </h3>
                    <p className={`mt-3 max-w-md text-base leading-relaxed ${look.sub}`}>
                      {reason.body}
                    </p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
