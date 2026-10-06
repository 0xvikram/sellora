import type { Metadata } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Cursor } from "@/components/fx/Cursor";
import { Gsap } from "@/components/fx/Gsap";
import { SmoothScroll } from "@/components/fx/SmoothScroll";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

// Body: Inter (variable, wght 100-900).
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Headings: Inter Tight (variable, wght 100-900). Loaded as the variable font
// so the footer wordmark can animate its weight axis.
const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
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
      className={`${inter.variable} ${interTight.variable} ${jetbrains.variable}`}
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
