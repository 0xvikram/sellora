import { Contact } from "@/components/Contact";
import { DemoStore } from "@/components/DemoStore";
import { Faq } from "@/components/Faq";
import { Hero } from "@/components/Hero";
import { Ladder } from "@/components/Ladder";
import { Nav } from "@/components/Nav";
import { Services } from "@/components/Services";
import { Statement } from "@/components/Statement";
import { ToolStrip } from "@/components/ToolStrip";
import { WhyUs } from "@/components/WhyUs";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ToolStrip />
        <Statement />
        <Services />
        <Ladder />
        <DemoStore />
        <WhyUs />
        <Faq />
        <Contact />
      </main>
    </>
  );
}
