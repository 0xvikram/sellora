import { DEMO_STORE_URL, SERVICES } from "@/lib/site";
import { Reveal } from "./Reveal";

const TILES = [
  "from-[#f3c98b] to-[#e2643c]",
  "from-[#aab4ff] to-[#2438e0]",
  "from-[#bfe3c6] to-[#2f8f5b]",
  "from-[#f0d9a8] to-[#f0b84a]",
];

// A drawn browser window standing in for the demo store.
function StoreMock() {
  return (
    <div className="overflow-hidden rounded-2xl border border-paper/15 bg-[#1f1c16] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)]">
      <div className="flex items-center gap-3 border-b border-paper/10 px-4 py-3">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-paper/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-paper/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-paper/20" />
        </div>
        <span className="flex-1 rounded-md bg-paper/8 px-3 py-1 font-mono text-[0.68rem] text-paper/50">
          demo-store · sample data
        </span>
      </div>
      <div className="grid gap-5 p-5 sm:grid-cols-[1fr_1.1fr]">
        <div className="grid grid-cols-2 gap-3" aria-hidden="true">
          {TILES.map((tile) => (
            <div key={tile}>
              <div className={`aspect-square rounded-lg bg-gradient-to-br ${tile}`} />
              <div className="mt-2 h-1.5 w-3/4 rounded-full bg-paper/20" />
              <div className="mt-1.5 h-1.5 w-1/3 rounded-full bg-paper/10" />
            </div>
          ))}
        </div>
        <ul className="space-y-2.5">
          {SERVICES.map((service) => (
            <li
              key={service.id}
              className="flex items-center justify-between gap-3 rounded-lg bg-paper/5 px-3.5 py-2.5 text-sm"
            >
              {service.short}
              <span
                className="flex h-5 w-9 items-center justify-end rounded-full bg-[#aab4ff] px-0.5"
                aria-hidden="true"
              >
                <span className="h-4 w-4 rounded-full bg-ink" />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Dark band that points at the live demo store. Shows "coming soon"
// until DEMO_STORE_URL is set in src/lib/site.ts.
export function DemoStore() {
  const live = DEMO_STORE_URL.length > 0;
  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      <div
        className="pointer-events-none absolute -right-40 -bottom-40 h-[34rem] w-[34rem] rounded-full bg-accent opacity-40 blur-[130px]"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-[1fr_1fr] lg:items-center">
        <Reveal>
          <p className="eyebrow !text-paper/50">Proof you can click</p>
          <h2 className="mt-5 text-4xl leading-[1.02] font-medium tracking-[-0.03em] text-balance md:text-7xl">
            A demo store with every service{" "}
            <span className="accent-word !text-[#aab4ff]">switched on.</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/70">
            We are building a sample store that runs each service live, so you
            can try the result before you pay for it. The data in it is sample
            data: it shows what we build, not client results.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-5">
            <a
              href={live ? DEMO_STORE_URL : "#contact"}
              className="inline-flex rounded-full bg-paper px-6 py-3.5 text-base font-medium text-ink transition-transform hover:-translate-y-0.5"
            >
              {live ? "Open the demo store" : "Ask for a walkthrough"}
            </a>
            <span className="flex items-center gap-2 font-mono text-xs tracking-[0.14em] text-paper/60 uppercase">
              <span
                className={`h-2 w-2 rounded-full ${live ? "bg-[#7ee0a1]" : "bg-sun"}`}
                aria-hidden="true"
              />
              {live ? "Live" : "Coming soon"}
            </span>
          </div>
        </Reveal>
        <Reveal delay={0.12} className="lg:rotate-[1.5deg]">
          <StoreMock />
        </Reveal>
      </div>
    </section>
  );
}
