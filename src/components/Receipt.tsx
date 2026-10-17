import { SERVICES } from "@/lib/site";
import { cn } from "@/lib/utils";

// The hand-torn price receipt, driven by SERVICES and printed on ground-2
// paper (ink-2 8.73:1, accent 5.78:1). "compact" sits on the
// home page; "full" is the /prices version and also shows each unit.
export function Receipt({ size = "compact" }: { size?: "compact" | "full" }) {
  const full = size === "full";
  return (
    <div
      className={cn(
        "receipt-edge w-full bg-ground-2 px-6 pt-6 pb-9 font-mono text-ink shadow-receipt",
        full ? "max-w-[34rem] text-sm md:px-9 md:pt-9" : "max-w-[22rem] text-[0.8rem]",
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
      <div className="dashed-rule my-4" />
      <div className="flex items-baseline justify-between">
        <span className="font-medium tracking-[0.14em] uppercase">Retainer required</span>
        <span className="font-semibold text-accent">None</span>
      </div>
      <p className="mt-4 text-center text-ink-2" aria-hidden="true">
        * * * thank you, come again * * *
      </p>
    </div>
  );
}
