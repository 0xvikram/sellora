import { formatValue, type Finding } from "@/lib/site";
import { cn } from "@/lib/utils";

// Code-drawn before/after figure for one finding: two bars on ground-2
// tracks. "Before" fills with the 3:1 control grey, "After" with lime;
// the values are mono text, so the bars are a visual aid only.
export function BeforeAfter({ finding, className }: { finding: Finding; className?: string }) {
  const max = finding.max ?? (finding.unit === "%" ? 100 : Math.max(finding.before, finding.after, 1));
  const rows = [
    { name: "Before", value: finding.before, fill: "bg-line-control" },
    { name: "After", value: finding.after, fill: "bg-lime shadow-[inset_0_0_0_1px_rgb(10_20_15/0.35)]" },
  ];
  return (
    <figure className={cn("w-full", className)}>
      <figcaption className="font-mono text-xs leading-snug text-ink-2">{finding.label}</figcaption>
      <div className="mt-3 grid grid-cols-[3.25rem_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2.5">
        {rows.map((row) => {
          const pct = Math.min(100, (row.value / max) * 100);
          return (
            <div key={row.name} className="contents">
              <span className="font-mono text-[11px] font-medium tracking-[0.12em] text-ink-2 uppercase">{row.name}</span>
              <div aria-hidden="true" className="h-2.5 rounded-full bg-ground-2">
                <div className={cn("h-full rounded-full", row.fill)} style={{ width: `${row.value > 0 ? Math.max(pct, 1.5) : 0}%` }} />
              </div>
              <span
                className={cn(
                  "text-right font-mono text-sm tabular-nums",
                  row.name === "After" ? "font-medium text-lime-ink" : "text-ink",
                )}
              >
                {formatValue(row.value, finding.unit)}
              </span>
            </div>
          );
        })}
      </div>
    </figure>
  );
}
