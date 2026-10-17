import Link from "next/link";
import type { Teardown } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SampleChip({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-line-2 px-2.5 py-0.5 font-mono text-xs tracking-[0.1em] text-ink-2 uppercase",
        className,
      )}
    >
      Sample
    </span>
  );
}

export function TeardownCard({
  teardown,
  headingLevel = "h3",
}: {
  teardown: Teardown;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <article className="relative flex h-full flex-col rounded-2xl border border-line-2 bg-card p-6 transition-colors focus-within:border-ink hover:border-ink">
      {teardown.sample ? <SampleChip className="self-start" /> : null}
      <Heading className="mt-5 font-display text-2xl leading-tight font-semibold tracking-[-0.02em] text-ink">
        <Link
          href={`/teardowns/${teardown.slug}`}
          className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none"
        >
          {teardown.metric}
        </Link>
      </Heading>
      <p className="mt-2 text-sm text-ink-2">{teardown.store}</p>
      <p className="mt-5 flex-1 text-base leading-relaxed text-ink-2">{teardown.summary}</p>
      <p className="mt-6 font-mono text-xs tracking-[0.1em] text-ink-2 uppercase">
        Over {teardown.period} <span aria-hidden="true">→</span>
      </p>
    </article>
  );
}
