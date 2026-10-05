import { TOOLS } from "@/lib/site";
import { TOOL_LOGOS } from "@/lib/tool-logos";
import { Marquee } from "./ui/marquee";

function Tool({ name }: { name: string }) {
  const path = TOOL_LOGOS[name];
  return (
    <span className="flex items-center gap-2.5 px-4 text-xl font-medium tracking-tight whitespace-nowrap text-ink-2 transition-colors hover:text-ink">
      {path ? (
        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="currentColor" aria-hidden="true">
          <path d={path} />
        </svg>
      ) : null}
      {name}
    </span>
  );
}

// Two marquees of the tools we work in, running opposite ways on desktop.
// The moving rows are decorative; the list itself is read from the sr-only <ul>.
export function ToolStrip() {
  const reversed = [...TOOLS].reverse();
  return (
    <section className="border-y border-line bg-paper-2/50" aria-label="Tools we work with">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 md:flex-row md:items-center md:gap-10 md:px-8">
        <p className="eyebrow shrink-0">We work inside</p>
        <ul className="sr-only">
          {TOOLS.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
        <div className="marquee-mask min-w-0 flex-1" aria-hidden="true">
          <Marquee pauseOnHover repeat={3} className="p-0 [--duration:46s] [--gap:1.5rem]">
            {TOOLS.map((tool) => (
              <Tool key={tool} name={tool} />
            ))}
          </Marquee>
          <Marquee
            pauseOnHover
            reverse
            repeat={3}
            className="mt-3 hidden p-0 [--duration:52s] [--gap:1.5rem] md:flex"
          >
            {reversed.map((tool) => (
              <Tool key={tool} name={tool} />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
