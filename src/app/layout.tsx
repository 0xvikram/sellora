import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Cursor } from "@/components/fx/Cursor";
import { Gsap } from "@/components/fx/Gsap";
import { SmoothScroll } from "@/components/fx/SmoothScroll";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

// Body: Instrument Sans (variable, wght 400-700).
const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

// Headings: Bricolage Grotesque (variable, wght 200-800) with its optical
// size axis, so large headings get the tighter display cut.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME} — Growth work for e-commerce brands, at fixed prices`,
  description: SITE_TAGLINE,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Growth work for e-commerce brands, at fixed prices`,
    description: SITE_TAGLINE,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${instrument.variable} ${bricolage.variable} ${jetbrains.variable}`}
    >
      <body>
        <SmoothScroll />
        <Gsap />
        <Cursor />
        {children}
        <div className="grain pointer-events-none fixed inset-0 z-[90]" aria-hidden="true" />
      </body>
    </html>
  );
}
