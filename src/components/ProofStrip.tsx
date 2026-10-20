import { PROOF } from "@/lib/site";
import { Container } from "./Container";

// One bordered row of three proof cells: a Newsreader value where there is
// one, then a mono label. A badge whose status is still "placeholder" says
// so visibly, so nothing unverified reads as a claim.
export function ProofStrip() {
  return (
    <section aria-label="Proof" data-ground="bone">
      <Container className="py-8 md:py-10">
        <ul className="grid divide-y divide-line-2 border border-line-2 bg-card sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {PROOF.map((badge) => (
            <li key={badge.label} className="flex min-h-24 flex-col justify-between gap-3 px-5 py-4 md:px-6 md:py-5">
              {badge.value ? (
                <span className="font-display text-[28px] leading-none tracking-[-0.02em] text-ink tabular-nums">
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
