import { REASONS } from "@/lib/site";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { MagicCard } from "./ui/magic-card";

// Per-card look for the bento grid: two large feature cards, three small.
// `fill` / `edge` feed MagicCard's --mc-bg / --mc-border; `glow` is the
// spotlight that follows the cursor.
const LOOKS = [
  { span: "md:col-span-3", fill: "[--mc-bg:var(--color-accent)] [--mc-border:var(--color-accent)]", text: "text-white", sub: "text-white/75", glow: "rgba(255,255,255,0.22)", mark: "$" },
  { span: "md:col-span-3", fill: "[--mc-bg:var(--color-ink)] [--mc-border:var(--color-ink)]", text: "text-paper", sub: "text-paper/65", glow: "rgba(36,56,224,0.55)", mark: "2" },
  { span: "md:col-span-2", fill: "[--mc-bg:var(--color-card)] [--mc-border:var(--color-line)]", text: "", sub: "text-ink-2", glow: "rgba(36,56,224,0.12)", mark: "=" },
  { span: "md:col-span-2", fill: "[--mc-bg:var(--color-card)] [--mc-border:var(--color-line)]", text: "", sub: "text-ink-2", glow: "rgba(36,56,224,0.12)", mark: "+" },
  { span: "md:col-span-2", fill: "[--mc-bg:var(--color-accent-soft)] [--mc-border:var(--color-line)]", text: "", sub: "text-ink-2", glow: "rgba(255,255,255,0.7)", mark: "1" },
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
                <Reveal delay={(i % 3) * 0.08} className="h-full rounded-3xl">
                  <MagicCard
                    gradientSize={280}
                    gradientColor={look.glow}
                    gradientOpacity={1}
                    gradientFrom="#aab4ff"
                    gradientTo="#e2643c"
                    className={`h-full rounded-3xl ${look.fill} ${look.text}`}
                  >
                    <div
                      className={`relative flex h-full flex-col justify-between overflow-hidden p-7 md:p-9 ${large ? "min-h-[19rem]" : "min-h-[15rem]"}`}
                    >
                      <span
                        className={`pointer-events-none absolute -right-4 -bottom-10 font-display leading-none font-bold opacity-15 select-none ${large ? "text-[15rem]" : "text-[11rem]"}`}
                        aria-hidden="true"
                      >
                        {look.mark}
                      </span>
                      <span className="font-mono text-sm opacity-70">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="relative">
                        <h3
                          className={`font-display font-semibold tracking-[-0.02em] ${large ? "text-3xl md:text-4xl" : "text-2xl"}`}
                        >
                          {reason.title}
                        </h3>
                        <p className={`mt-3 max-w-md text-base leading-relaxed ${look.sub}`}>
                          {reason.body}
                        </p>
                      </div>
                    </div>
                  </MagicCard>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
