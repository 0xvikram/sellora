import { Close } from "@/components/Close";
import { Faq } from "@/components/Faq";
import { GroundShift } from "@/components/GroundShift";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { PipelineSection } from "@/components/PipelineSection";
import { PricesSection } from "@/components/PricesSection";
import { ProofStrip } from "@/components/ProofStrip";
import { Report } from "@/components/Report";
import { Story } from "@/components/Story";
import { Studio } from "@/components/Studio";
import { Teardowns } from "@/components/Teardowns";
import { JsonLd } from "@/lib/json-ld";
import { FAQS } from "@/lib/site";

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }}
      />
      <GroundShift />
      <Nav />
      <main id="main">
        <Hero />
        <Story />
        <PipelineSection />
        <Teardowns />
        <Report />
        <PricesSection />
        <Studio />
        <ProofStrip />
        <Faq />
      </main>
      <Close />
    </>
  );
}
