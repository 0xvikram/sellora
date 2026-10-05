import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Cursor } from "@/components/fx/Cursor";
import { Gsap } from "@/components/fx/Gsap";
import { SmoothScroll } from "@/components/fx/SmoothScroll";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["italic"],
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
      className={`${hanken.variable} ${fraunces.variable} ${jetbrains.variable}`}
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
