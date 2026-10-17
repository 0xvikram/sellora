import Link from "next/link";
import { formatValue, type Teardown } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SampleChip({ className }: { className?: string }) {
  return <span className={cn("chip", className)}>Sample</span>;
}

export function TeardownCard({
  teardown,
  headingLevel = "h3",
}: {
  teardown: Teardown;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  const key = teardown.findings[0];
  return (
    <article className="card-scan group relative flex h-full flex-col overflow-hidden border border-line-2 bg-card p-6 transition-colors focus-within:border-ink hover:border-ink">
      {teardown.sample ? <SampleChip className="self-start" /> : null}
      <Heading className="type-h3 mt-5 text-ink">
        <Link
          href={`/teardowns/${teardown.slug}`}
          className="after:absolute after:inset-0 focus-visible:outline-none"
        >
          {teardown.metric}
        </Link>
      </Heading>
      <p className="mt-2 text-sm text-ink-3">{teardown.store}</p>
      <p className="mt-5 flex-1 text-base text-ink-2">{teardown.summary}</p>
      <p className="mt-6 font-mono text-sm text-ink">
        <span className="block text-xs text-ink-2">{key.label}</span>
        <span className="mt-1.5 block tabular-nums">
          <span className="sr-only">Before </span>
          {formatValue(key.before, key.unit)}
          <span aria-hidden="true" className="px-2 text-ink-2">
            →
          </span>
          <span className="sr-only"> after </span>
          <span className="font-medium text-accent">{formatValue(key.after, key.unit)}</span>
        </span>
      </p>
      <p className="mt-6 flex items-center justify-between border-t border-line pt-4 font-mono text-xs font-medium tracking-[0.12em] text-ink-2 uppercase">
        Over {teardown.period}
        <span aria-hidden="true" className="text-accent transition-transform group-hover:translate-x-1">
          →
        </span>
      </p>
    </article>
  );
}
