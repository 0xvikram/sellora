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
        <Container className="page-head pb-14 md:pb-20 lg:pb-24">
          <p className="eyebrow">Error 404</p>
          <h1 className="type-h1 mt-5 max-w-4xl text-ink">
            This page is <span className="accent-word">not</span> here.
          </h1>
          <p className="lead mt-6">The address may be mistyped, or the page has moved.</p>
          <div className="panel mt-10 flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
            <p className="text-base text-ink-2">Try the home page, or see the work.</p>
            <p className="flex flex-wrap gap-3">
              <Link href="/" className="btn btn-primary">
                Home
              </Link>
              <Link href="/teardowns" className="btn btn-ghost">
                Teardowns
              </Link>
            </p>
          </div>
        </Container>
      </main>
      <Close />
    </>
  );
}
