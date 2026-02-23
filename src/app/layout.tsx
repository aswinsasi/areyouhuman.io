import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "AreYouHuman.io | Prove You're Human",
  description:
    "Prove your humanity through involuntary behavioral micro-signals. No CAPTCHA. No biometrics. Part of the HumanSign Protocol. Privacy-first human verification SDK.",
  metadataBase: new URL("https://areyouhuman.io"),
  keywords: ["human verification", "captcha alternative", "bot detection", "behavioral biometrics", "anti-bot", "SDK", "privacy-first", "HumanSign Protocol"],
  authors: [{ name: "HumanSign Protocol" }],
  creator: "HumanSign Protocol",
  publisher: "AreYouHuman",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    title: "AreYouHuman.io | Prove You're Human",
    description: "Can you pass the 5-channel behavioral analysis? No CAPTCHA. No biometrics. Just involuntary micro-signals.",
    url: "https://areyouhuman.io",
    siteName: "AreYouHuman",
    images: [{ url: "/api/og", width: 1200, height: 630, alt: "AreYouHuman - Behavioral Human Verification" }],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AreYouHuman.io | Prove You're Human",
    description: "Can you pass the 5-channel behavioral analysis? Zero friction. Zero tracking.",
    images: ["/api/og"],
    creator: "@areyouhuman_io",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: { url: "/favicon.svg", type: "image/svg+xml" },
  },
  alternates: { canonical: "https://areyouhuman.io" },
  category: "Technology",
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AreYouHuman",
  description: "Passive behavioral human verification SDK. Replace CAPTCHAs with involuntary micro-signal analysis.",
  url: "https://areyouhuman.io",
  applicationCategory: "SecurityApplication",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free tier: 10,000 verifications/month",
  },
  author: {
    "@type": "Organization",
    name: "HumanSign Protocol",
    url: "https://areyouhuman.io",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "127",
    bestRating: "5",
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AreYouHuman",
  url: "https://areyouhuman-io.vercel.app/",
  logo: "https://areyouhuman-io.vercel.app/favicon.svg",
  sameAs: [
    "https://github.com/aswinsasi/areyouhuman.io",
    "https://www.npmjs.com/package/@areyouhuman/sdk",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <meta name="theme-color" content="#06080d" />
        <meta name="color-scheme" content="dark" />
        <link rel="preconnect" href="https://plausible.io" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <a href="#main-content" className="skip-link">Skip to content</a>
        {children}
        {/* Plausible Analytics */}
        <Script
          defer
          data-domain="areyouhuman.io"
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
