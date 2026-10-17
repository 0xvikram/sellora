import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

// Shared section header: optional mono index and label, then a heading.
// Use level "h1" for the top of an inner page.
export function SectionHead({
  index,
  label,
  children,
  aside,
  level = "h2",
  id,
  className,
}: {
  index?: string;
  label: string;
  children: ReactNode;
  aside?: ReactNode;
  level?: "h1" | "h2";
  id?: string;
  className?: string;
}) {
  const Heading = level;
  return (
    <Reveal className={className}>
      <p className="flex items-center gap-3">
        {index ? (
          <>
            <span className="eyebrow">{index}</span>
            <span className="h-px w-8 bg-line-2" aria-hidden="true" />
          </>
        ) : null}
        <span className="eyebrow">{label}</span>
      </p>
      <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <Heading
          id={id}
          className={cn(
            "max-w-3xl font-display leading-[1.04] font-semibold tracking-[-0.025em] text-balance",
            level === "h1" ? "text-4xl md:text-6xl" : "text-3xl md:text-5xl",
          )}
        >
          {children}
        </Heading>
        {aside ? (
          <p className="max-w-sm text-base leading-relaxed text-ink-2">{aside}</p>
        ) : null}
      </div>
    </Reveal>
  );
}
