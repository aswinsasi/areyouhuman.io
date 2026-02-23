import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "AreYouHuman.io | Prove You're Human",
  description:
    "Prove your humanity through involuntary behavioral micro-signals. No CAPTCHA. No biometrics. Part of the HumanSign Protocol.",
  metadataBase: new URL("https://areyouhuman.io"),
  openGraph: {
    title: "AreYouHuman.io | Prove You're Human",
    description: "Can you pass the 5-channel behavioral analysis?",
    url: "https://areyouhuman.io",
    siteName: "AreYouHuman",
    images: [{ url: "/api/og", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AreYouHuman.io | Prove You're Human",
    description: "Can you pass the 5-channel behavioral analysis?",
    images: ["/api/og"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {children}
        {/* Plausible Analytics — replace areyouhuman.io with your actual domain */}
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
