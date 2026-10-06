import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

// Shared section header: mono index and label, then a large heading.
export function SectionHead({
  index,
  label,
  children,
  aside,
}: {
  index: string;
  label: string;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <Reveal>
      <div className="flex items-center gap-3">
        <span className="eyebrow text-accent">{index}</span>
        <span className="h-px w-8 bg-line-2" />
        <span className="eyebrow">{label}</span>
      </div>
      <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <h2 className="max-w-3xl font-display text-4xl leading-[1.04] font-semibold tracking-[-0.03em] text-balance md:text-6xl">
          {children}
        </h2>
        {aside ? (
          <p className="max-w-sm text-base leading-relaxed text-ink-2">{aside}</p>
        ) : null}
      </div>
    </Reveal>
  );
}
