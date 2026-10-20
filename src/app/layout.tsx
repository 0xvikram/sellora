import type { Metadata } from "next";
import { Archivo, Geist_Mono, Instrument_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { JsonLd } from "@/lib/json-ld";
import { CONTACT_EMAIL, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

const TITLE = `${SITE_NAME} — AI and automation for e-commerce brands, at fixed prices`;

// Display: Archivo roman, variable weight and width (wdth 62-125). Headings
// set it condensed (font-stretch 70%) and uppercase.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  style: ["normal"],
  axes: ["wdth"],
  display: "swap",
});

// Accent: Archivo's own italic, one static cut (wght 600, wdth 70, latin
// subset, 41 KB, OFL) from Google Fonts, self-hosted. It sets the accent
// word in the H1 (the LCP element), so it is preloaded; the full variable
// italic would be 100 KB. No metric-adjusted fallback: the CSS stack falls
// back to the Archivo roman, which is already loaded and the same width.
// Source: fonts.googleapis.com css2?family=Archivo:ital,wdth,wght@1,70,600
const archivoItalic = localFont({
  src: "./fonts/Archivo-Italic-600-wdth70-latin.woff2",
  variable: "--font-archivo-italic",
  weight: "600",
  style: "italic",
  display: "swap",
  adjustFontFallback: false,
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
      className={`${archivo.variable} ${archivoItalic.variable} ${instrumentSans.variable} ${geistMono.variable}`}
    >
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-bone"
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
        {children}
      </body>
    </html>
  );
}
