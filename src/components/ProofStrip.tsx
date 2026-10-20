import { PROOF } from "@/lib/site";
import { Container } from "./Container";

// One row of three white proof cells: an Archivo condensed value where there is
// one, then a mono label. A badge whose status is still "placeholder" says
// so visibly, so nothing unverified reads as a claim.
export function ProofStrip() {
  return (
    <section aria-label="Proof" data-ground="bone">
      <Container className="py-8 md:py-10">
        <ul className="grid gap-3 sm:grid-cols-3">
          {PROOF.map((badge) => (
            <li key={badge.label} className="flex min-h-28 flex-col justify-between gap-3 rounded-panel border border-line bg-card px-5 py-4 md:px-6 md:py-5">
              {badge.value ? (
                <span className="font-display text-[40px] leading-none text-ink tabular-nums [font-stretch:70%] font-semibold uppercase">
                  {badge.value}
                </span>
              ) : (
                <span className="chip self-start">Placeholder</span>
              )}
              <span className="font-mono text-xs font-medium tracking-[0.12em] text-ink-2 uppercase">
                {badge.label}
                {badge.status === "placeholder" ? <span className="sr-only"> (placeholder)</span> : null}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
