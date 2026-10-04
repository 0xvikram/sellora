import { DEMO_STORE_URL } from "@/lib/site";
import { Reveal } from "./Reveal";

// Dark band that points at the live demo store. Shows "coming soon"
// until DEMO_STORE_URL is set in src/lib/site.ts.
export function DemoStore() {
  const live = DEMO_STORE_URL.length > 0;
  return (
    <section className="bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-[1.2fr_0.8fr] md:items-center md:px-8 md:py-28">
        <Reveal>
          <p className="eyebrow !text-paper/50">Proof you can click</p>
          <h2 className="mt-5 text-4xl leading-[1.05] font-medium tracking-tight text-balance md:text-6xl">
            A demo store with every service{" "}
            <span className="accent-word !text-[#aab4ff]">switched on.</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/70">
            We are building a sample store that runs each service live, so you
            can try the result before you pay for it. The data in it is sample
            data: it shows what we build, not client results.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="rounded-2xl border border-paper/15 p-7">
            <div className="flex items-center gap-2 font-mono text-xs tracking-[0.14em] text-paper/60 uppercase">
              <span
                className={`h-2 w-2 rounded-full ${live ? "bg-[#7ee0a1]" : "bg-[#f0c26b]"}`}
                aria-hidden="true"
              />
              {live ? "Live" : "Coming soon"}
            </div>
            <p className="mt-5 text-xl leading-snug font-medium">
              {live
                ? "Open the demo store and try each service yourself."
                : "The demo store opens soon. Ask us on a call and we will walk you through what is ready."}
            </p>
            <a
              href={live ? DEMO_STORE_URL : "#contact"}
              className="mt-7 inline-flex rounded-full bg-paper px-5 py-3 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5"
            >
              {live ? "Open the demo store" : "Ask for a walkthrough"}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
