import Link from "next/link";
import { TEARDOWNS } from "@/lib/site";
import { Container } from "./Container";
import { SectionHead } from "./SectionHead";
import { TeardownCard } from "./TeardownCard";

export function Teardowns() {
  return (
    <section id="work" aria-labelledby="work-title" className="border-t border-line bg-ground">
      <Container className="py-14 md:py-24 lg:py-28">
        <SectionHead
          index="02"
          label="Work"
          id="work-title"
          aside="Each teardown states the baseline, the period and how it was measured."
        >
          Teardowns, with the <span className="accent-word">numbers</span> first.
        </SectionHead>
        <ul className="mt-10 grid gap-4 md:mt-14 md:grid-cols-3 md:gap-5">
          {TEARDOWNS.map((teardown) => (
            <li key={teardown.slug}>
              <TeardownCard teardown={teardown} />
            </li>
          ))}
        </ul>
        <p className="mt-8">
          <Link href="/teardowns" className="text-link">
            All teardowns
          </Link>
        </p>
      </Container>
    </section>
  );
}
