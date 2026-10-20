import { Container } from "./Container";
import { PipelineScene } from "./PipelineScene";
import { SectionHead } from "./SectionHead";

// "Five jobs": the five services as gates on one conveyor. The first sage
// section on the home page, between the story (bone) and the teardowns
// (sage). The heading sits in the container; the scene card runs full
// bleed with a 16px gutter. On lg the top padding is small: the pinned
// story stage above already ends in its own band of empty ground.
export function PipelineSection() {
  return (
    <section id="pipeline" aria-labelledby="pipeline-title" data-ground="sage">
      <Container className="pt-16 md:pt-24 lg:pt-8">
        <SectionHead label="Five jobs" id="pipeline-title">
          Every order passes five <span className="accent-word">gates.</span>
        </SectionHead>
      </Container>
      <div className="mt-10 px-4 md:mt-14">
        <PipelineScene />
      </div>
    </section>
  );
}
