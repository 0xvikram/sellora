import Link from "next/link";
import { TEARDOWNS } from "@/lib/site";
import { Container } from "./Container";
import { SectionHead } from "./SectionHead";
import { TeardownCard } from "./TeardownCard";

export function Teardowns() {
  return (
    <section id="work" aria-labelledby="work-title" className="border-t border-line">
      <Container className="py-20 md:py-28">
        <SectionHead
          index="02"
          label="Work"
          id="work-title"
          aside="Each teardown states the baseline, the period and how it was measured."
        >
          Teardowns, with the <span className="accent-word">numbers</span> first.
        </SectionHead>
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {TEARDOWNS.map((teardown) => (
            <li key={teardown.slug}>
              <TeardownCard teardown={teardown} />
            </li>
          ))}
        </ul>
        <p className="mt-8">
          <Link
            href="/teardowns"
            className="border-b border-ink pb-0.5 text-base font-medium text-ink hover:border-accent hover:text-accent"
          >
            All teardowns
          </Link>
        </p>
      </Container>
    </section>
  );
}
