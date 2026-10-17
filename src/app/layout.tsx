import type { Metadata } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Gsap } from "@/components/fx/Gsap";
import { JsonLd } from "@/lib/json-ld";
import { CONTACT_EMAIL, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

const TITLE = `${SITE_NAME} — AI and automation for e-commerce brands, at fixed prices`;

// Body: Inter (variable, wght 100-900).
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Headings: Inter Tight (variable, wght 100-900).
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
  title: { default: TITLE, template: `%s · ${SITE_NAME}` },
  description: SITE_TAGLINE,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: TITLE,
    description: SITE_TAGLINE,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: SITE_TAGLINE },
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
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
            email: CONTACT_EMAIL,
            description: SITE_TAGLINE,
            areaServed: ["US", "GB", "EU", "AU"],
          }}
        />
        <Gsap />
        {children}
      </body>
    </html>
  );
}
