import type { Metadata } from "next";
import Link from "next/link";
import { Close } from "@/components/Close";
import { Container } from "@/components/Container";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

// Site 404: the same nav, main landmark and footer as every other page.
export default function NotFound() {
  return (
    <>
      <Nav />
      <main id="main">
        <Container className="py-16 md:py-28">
          <p className="eyebrow">404</p>
          <h1 className="type-h1 mt-6 max-w-3xl text-ink">
            This page is <span className="accent-word">not</span> here.
          </h1>
          <p className="lead mt-6">The address may be mistyped, or the page has moved.</p>
          <p className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            <Link href="/" className="text-link">
              Home
            </Link>
            <Link href="/teardowns" className="text-link">
              Teardowns
            </Link>
          </p>
        </Container>
      </main>
      <Close />
    </>
  );
}
