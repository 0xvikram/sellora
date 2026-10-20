import { SERVICES } from "@/lib/site";
import { cn } from "@/lib/utils";

// The price receipt, driven by SERVICES: a white panel with a 1px ink
// border, 8px radius and the ambient shadow (ink-2 12.70:1 on white). The
// "None" sits on a lime pill (ink on lime 15.03:1). "compact" sits on the
// home page; "full" is the /prices version and also shows each unit.
export function Receipt({ size = "compact" }: { size?: "compact" | "full" }) {
  const full = size === "full";
  return (
    <div className={cn("receipt-paper w-full", full ? "max-w-[38rem]" : "max-w-[22rem]")}>
      <div
        className={cn(
          "rounded-panel px-6 pt-7 pb-7 font-mono text-ink",
          full ? "text-sm md:px-10 md:pt-12 md:pb-12 md:text-base" : "text-[0.8rem]",
        )}
      >
        <div className="flex items-baseline justify-between">
          <span className="font-medium tracking-[0.14em] uppercase">Price list</span>
          <span className="text-ink-2">No. 0001</span>
        </div>
        <p className="mt-1 text-ink-2">Priced before the first call</p>
        <div className="dashed-rule my-4" />
        <ul className="space-y-3">
          {SERVICES.map((service) => (
            <li key={service.id}>
              <div className="flex items-baseline justify-between gap-3">
                <span>{full ? service.title : service.short}</span>
                <span
                  className="h-px min-w-4 flex-1 translate-y-[-3px] border-b border-dotted border-line-2"
                  aria-hidden="true"
                />
                <span className="whitespace-nowrap tabular-nums">{service.price}</span>
              </div>
              {full ? <p className="mt-1 text-ink-2">{service.unit}</p> : null}
            </li>
          ))}
        </ul>
        <div className="dashed-rule mt-4 mb-3" />
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-medium tracking-[0.14em] uppercase">Retainer required</span>
          <span className={"rounded-full border border-dark bg-lime px-3.5 pt-1.5 pb-1 font-display text-[28px] leading-none text-dark [font-stretch:70%] font-semibold uppercase"}>None</span>
        </div>
      </div>
    </div>
  );
}
