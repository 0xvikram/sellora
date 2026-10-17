import Link from "next/link";
import { formatValue, type Teardown } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SampleChip({ className }: { className?: string }) {
  return <span className={cn("chip", className)}>Sample</span>;
}

// One teardown as a card on card paper. On hover (fine pointers) it lifts
// with a layered paper shadow and the scan line runs once. The headline
// finding is drawn as two bars, before in the 3:1 control grey and after
// in the accent, with the after value in Newsreader.
export function TeardownCard({
  teardown,
  headingLevel = "h3",
}: {
  teardown: Teardown;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  const key = teardown.findings[0];
  const max = key.max ?? (key.unit === "%" ? 100 : Math.max(key.before, key.after, 1));
  const width = (v: number) => `${v > 0 ? Math.max(Math.min(100, (v / max) * 100), 1.5) : 0}%`;
  return (
    <article className="card-scan card-lift group relative flex h-full flex-col overflow-hidden border border-line-2 bg-card p-6 transition-colors focus-within:border-ink hover:border-ink">
      <div className="flex items-start justify-between gap-4">
        <Heading className="type-h3 text-ink">
          <Link
            href={`/teardowns/${teardown.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {teardown.metric}
          </Link>
        </Heading>
        {teardown.sample ? <SampleChip className="mt-1 shrink-0" /> : null}
      </div>
      <p className="mt-2 text-sm text-ink-3">{teardown.store}</p>
      <p className="mt-5 flex-1 text-base text-ink-2">{teardown.summary}</p>
      <figure className="mt-6">
        <figcaption className="font-mono text-xs text-ink-2">{key.label}</figcaption>
        <p className="mt-1.5 flex items-baseline gap-3">
          <span className="sr-only">After </span>
          <span className="font-display text-[32px] leading-none tracking-[-0.02em] text-ink tabular-nums">
            {formatValue(key.after, key.unit)}
          </span>
          <span className="font-mono text-xs text-ink-2 tabular-nums">
            <span className="sr-only">, </span>from {formatValue(key.before, key.unit)}
          </span>
        </p>
        <div aria-hidden="true" className="mt-3 grid gap-1.5">
          <span className="block h-1.5 bg-ground-2">
            <span className="block h-full bg-line-control" style={{ width: width(key.before) }} />
          </span>
          <span className="block h-1.5 bg-ground-2">
            <span className="block h-full bg-accent" style={{ width: width(key.after) }} />
          </span>
        </div>
      </figure>
      <p className="mt-6 flex items-center justify-between border-t border-line pt-4 font-mono text-xs font-medium tracking-[0.12em] text-ink-2 uppercase">
        Over {teardown.period}
        <span aria-hidden="true" className="text-accent transition-transform group-hover:translate-x-1 motion-reduce:transition-none">
          →
        </span>
      </p>
    </article>
  );
}
