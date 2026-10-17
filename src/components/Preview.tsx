import { cn } from "@/lib/utils";

// The scripted crawl preview in the hero: a code-drawn storefront mock
// (blocks only, nothing readable), the labels a read of the store produces,
// and three result rows. Every line here is sample data for
// oatleaf.example; the footer legend explains the three labels.

export const SAMPLE_DOMAIN = "oatleaf.example";

type Kind = "Measured" | "Generated" | "Sample";

const MARKER: Record<Kind, string> = {
  Measured: "bg-accent",
  Generated: "bg-moss",
  Sample: "bg-sand",
};

const RESULTS: { label: string; value: string; kind: Kind }[] = [
  { label: "Repeat rate", value: "31%", kind: "Measured" },
  { label: "AI assistants citing the store", value: "1 of 10", kind: "Generated" },
  { label: "Pixel to order match", value: "54%", kind: "Measured" },
];

function Marker({ kind }: { kind: Kind }) {
  return <span aria-hidden="true" className={cn("size-1.5 shrink-0", MARKER[kind])} />;
}

/** A finding label: marker square, sr-only kind, mono text. */
function Finding({
  kind = "Measured",
  children,
  className,
}: {
  kind?: Kind;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      data-pv="chip"
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 border border-line-2 bg-card px-1.5 py-[3px] font-mono text-[10px] leading-tight whitespace-nowrap text-ink",
        className,
      )}
    >
      <Marker kind={kind} />
      <span className="sr-only">{kind}: </span>
      <span className="truncate">{children}</span>
    </span>
  );
}

function KindChip({ kind }: { kind: Kind }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-medium tracking-[0.12em] text-ink-2 uppercase">
      <Marker kind={kind} />
      {kind}
    </span>
  );
}

export function Preview({ domain = SAMPLE_DOMAIN }: { domain?: string }) {
  return (
    <figure
      aria-label={`Sample read of ${SAMPLE_DOMAIN}`}
      className="pv w-full border border-line-2 bg-card"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-2.5 font-mono text-xs text-ink-2">
        <p className="min-w-0 truncate">
          Reading <span className="text-ink">{domain}</span>
        </p>
        <p className="flex shrink-0 items-center gap-2">
          <span aria-hidden="true" className="size-1.5 bg-accent" />
          <span className="grid">
            {(["connecting", "reading", "measuring", "done"] as const).map((s) => (
              <span
                key={s}
                data-status={s}
                aria-hidden={s === "done" ? undefined : true}
                className={cn("[grid-area:1/1]", s !== "done" && "opacity-0")}
              >
                {s}
              </span>
            ))}
          </span>
        </p>
      </div>

      {/* Body: the mock storefront and the results column */}
      <div data-pv="body" className="relative grid gap-4 overflow-hidden p-4 sm:grid-cols-[minmax(0,1fr)_9.5rem]">
        <div aria-hidden="false" className="flex flex-col gap-2.5 rounded-[3px] border border-line bg-ground p-2.5">
          {/* Store header */}
          <div data-region="header" className="relative flex h-7 items-center gap-2 rounded-[2px] bg-ground-2 px-2">
            <span className="h-2 w-7 rounded-[1px] bg-sand" />
            <span className="ml-auto h-1 w-4 rounded-full bg-sand/60" />
            <span className="h-1 w-4 rounded-full bg-sand/60" />
            <span className="h-1 w-4 rounded-full bg-sand/60" />
            <Finding className="absolute top-1/2 left-1 -mt-[9px]">Header · 1 nav, 6 links</Finding>
          </div>

          {/* Store hero */}
          <div data-region="hero" className="relative h-24 rounded-[2px] bg-ground-2 p-3">
            <span className="block h-2.5 w-3/5 rounded-[1px] bg-sand/80" />
            <span className="mt-2 block h-1.5 w-2/5 rounded-[1px] bg-sand/50" />
            <span className="mt-3 block h-3.5 w-12 rounded-full bg-sand" />
            <Finding className="absolute right-1.5 bottom-1.5">Hero · 1 offer, no social proof</Finding>
          </div>

          {/* Product grid, 3 x 2 */}
          <div data-region="products" className="relative grid grid-cols-3 gap-2">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i}>
                <span className="block h-12 rounded-[3px] bg-ground-2" />
                <span className="mt-1.5 block h-1 w-3/4 rounded-full bg-sand/60" />
              </div>
            ))}
            <Finding className="absolute top-1/2 left-1/2 -mt-[9px] -ml-[68px]">
              Products · <span data-pv="count" className="tabular-nums">48</span> pages read
            </Finding>
          </div>

          {/* What the page loads */}
          <div data-region="scripts" className="flex flex-col items-start gap-1.5 border-t border-dashed border-line-2 pt-2.5">
            <Finding>Tracking · Meta pixel found, CAPI missing</Finding>
            <Finding>Klaviyo · 3 flows, 2 gaps</Finding>
          </div>
        </div>

        <ul className="grid grid-cols-3 gap-2 sm:flex sm:flex-col" aria-label="Results">
          {RESULTS.map((r) => (
            <li key={r.label} data-pv="row" className="flex flex-col border border-line bg-ground px-2.5 py-2.5 sm:px-3">
              <p className="flex-1 text-xs leading-snug text-ink-2 sm:flex-none sm:text-[13px]">{r.label}</p>
              <div className="relative mt-1.5 h-8">
                <span
                  data-pv="placeholder"
                  aria-hidden="true"
                  className="absolute top-1.5 left-0 h-5 w-14 origin-left rounded-[2px] bg-ground-2 opacity-0"
                />
                <span data-pv="value" className="absolute top-0 left-0 font-display text-[24px] leading-none whitespace-nowrap sm:text-[28px] text-ink tabular-nums">
                  {r.value}
                </span>
              </div>
              <div className="mt-1">
                <KindChip kind={r.kind} />
              </div>
            </li>
          ))}
        </ul>

        {/* The scan line: 1px accent with a 24px soft trail above it. */}
        <div data-pv="scan" aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-accent opacity-0">
          <span className="absolute inset-x-0 bottom-full h-6 bg-gradient-to-b from-transparent to-accent-soft mix-blend-multiply" />
        </div>
      </div>

      {/* Footer */}
      <figcaption className="flex flex-col gap-3 border-t border-line px-4 py-3">
        <p data-pv="note" className="font-mono text-[11px] leading-snug text-ink-2">
          Sample read of {SAMPLE_DOMAIN}. Paste your store address to run it on yours.
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <KindChip kind="Measured" />
          <KindChip kind="Generated" />
          <KindChip kind="Sample" />
        </div>
      </figcaption>
    </figure>
  );
}
