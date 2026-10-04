import { LADDER } from "@/lib/site";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

export function Ladder() {
  return (
    <section id="how" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
        <SectionHead
          index="02"
          label="How it works"
          aside="Most brands start with one audit. The next two steps are there if the first one earns it."
        >
          Start small. Go further <span className="accent-word">only if it pays.</span>
        </SectionHead>

        <ol className="mt-14 grid gap-5 md:grid-cols-3">
          {LADDER.map((rung, i) => (
            // Each card sits a step higher than the one before it on desktop.
            <li
              key={rung.step}
              className="md:mt-[var(--step)]"
              style={{ "--step": `${(LADDER.length - 1 - i) * 1.75}rem` } as React.CSSProperties}
            >
              <Reveal
                delay={i * 0.1}
                className="flex h-full flex-col rounded-2xl border border-line bg-card p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-accent">{rung.step}</span>
                  <span className="font-mono text-sm text-ink-2">{rung.price}</span>
                </div>
                <h3 className="mt-8 text-3xl font-medium tracking-tight">{rung.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-ink-2">{rung.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
