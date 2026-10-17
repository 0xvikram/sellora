import type { Metadata } from "next";
import { Geist_Mono, Instrument_Sans, Newsreader } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Gsap } from "@/components/fx/Gsap";
import { JsonLd } from "@/lib/json-ld";
import { CONTACT_EMAIL, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

const TITLE = `${SITE_NAME} — AI and automation for e-commerce brands, at fixed prices`;

// Display: Newsreader roman (variable wght + optical size).
// font-optical-sizing: auto lets the opsz axis follow the font size.
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal"],
  axes: ["opsz"],
  display: "swap",
});

// Accent: Newsreader italic as one static instance (wght 400, opsz pinned at
// 48, latin subset), self-hosted. The italic is only ever the accent word, so
// the full variable italic (147 KB) is not worth preloading; this is 25 KB.
// Source: fonts.googleapis.com css2?family=Newsreader:ital,opsz,wght@1,48,400
const newsreaderItalic = localFont({
  src: "./fonts/Newsreader-Italic-400-opsz48.woff2",
  variable: "--font-newsreader-italic",
  weight: "400",
  style: "italic",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

// Body: Instrument Sans (variable wght, roman only: the site sets no sans italic).
const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  style: ["normal"],
  display: "swap",
});

// Mono: Geist Mono (variable wght) for eyebrows, prices and the receipt.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
      className={`${newsreader.variable} ${newsreaderItalic.variable} ${instrumentSans.variable} ${geistMono.variable}`}
    >
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-ground"
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
