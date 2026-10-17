import { Faq } from "@/components/Faq";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Faq />
      </main>
    </>
  );
}
