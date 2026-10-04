import { TOOLS } from "@/lib/site";

export function ToolStrip() {
  // The list is rendered twice so the marquee loops without a gap.
  const loop = [...TOOLS, ...TOOLS];
  return (
    <section className="border-y border-line bg-paper-2/50" aria-label="Tools we work with">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-7 md:flex-row md:items-center md:gap-10 md:px-8">
        <p className="eyebrow shrink-0">We work inside</p>
        <div className="marquee-mask overflow-hidden">
          <ul className="marquee-track flex w-max items-center gap-12">
            {loop.map((tool, i) => (
              <li
                key={`${tool}-${i}`}
                aria-hidden={i >= TOOLS.length}
                className="text-xl font-medium tracking-tight whitespace-nowrap text-ink-2"
              >
                {tool}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
