import { PROOF } from "@/lib/site";
import { Container } from "./Container";

// One row of proof badges. A badge whose status is still "placeholder"
// says so visibly, so nothing unverified reads as a claim.
export function ProofStrip() {
  return (
    <section aria-label="Proof" className="border-t border-line bg-ground">
      <Container className="py-7 md:py-8">
        <ul className="flex flex-wrap items-center gap-3 md:flex-nowrap">
          {PROOF.map((badge) => (
            <li
              key={badge.label}
              className="inline-flex items-center gap-2 rounded-[2px] border border-line-2 bg-card px-3.5 py-2 text-sm text-ink"
            >
              {badge.value ? <span className="font-mono font-medium">{badge.value}</span> : null}
              <span>{badge.label}</span>
              {badge.status === "placeholder" ? (
                <span className="font-mono text-xs tracking-[0.1em] text-ink-2 uppercase">
                  (placeholder)
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
