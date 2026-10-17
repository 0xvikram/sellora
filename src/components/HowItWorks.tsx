import { Container } from "./Container";

const STEPS = [
  "Paste your store address",
  "Read the audit, labelled measured or generated",
  "Pick one fixed-price job",
];

// A thin strip between the hero and Work: three numbered steps in one
// bordered row. No heading, no animation.
export function HowItWorks() {
  return (
    <section aria-label="How it works" className="bg-ground">
      <Container className="pb-12 md:pb-16">
        <ol className="grid gap-px border border-line-2 bg-line-2 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step} className="flex items-baseline gap-4 bg-ground px-5 py-4 font-mono text-sm text-ink">
              <span className="text-accent tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              {step}
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
