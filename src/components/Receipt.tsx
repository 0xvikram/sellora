import { SERVICES } from "@/lib/site";

// The hand-torn price receipt. Removed from the hero in Oct 2026 to keep
// the ring alone; kept here, unused, so it can return later.
export function Receipt() {
  return (
    <div className="receipt-edge w-[19.5rem] bg-card px-6 pt-6 pb-9 font-mono text-[0.78rem] text-ink shadow-[0_30px_60px_-30px_rgba(22,20,15,0.45)]">
      <div className="flex items-baseline justify-between">
        <span className="tracking-[0.14em] uppercase">Price list</span>
        <span className="text-ink-3">No. 0001</span>
      </div>
      <p className="mt-1 text-ink-3">Priced before the first call</p>
      <div className="dashed-rule my-4" />
      <ul className="space-y-3">
        {SERVICES.map((service) => (
          <li key={service.id} className="flex items-baseline justify-between gap-3">
            <span>{service.short}</span>
            <span className="h-px flex-1 translate-y-[-3px] border-b border-dotted border-line-2" />
            <span className="whitespace-nowrap">{service.price}</span>
          </li>
        ))}
      </ul>
      <div className="dashed-rule my-4" />
      <div className="flex items-baseline justify-between">
        <span className="tracking-[0.14em] uppercase">Retainer required</span>
        <span className="font-semibold text-accent">None</span>
      </div>
      <p className="mt-4 text-center text-ink-3">* * * thank you, come again * * *</p>
    </div>
  );
}
