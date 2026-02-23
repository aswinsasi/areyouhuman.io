import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SDK Documentation | AreYouHuman.io",
  description: "Integrate human verification into your app in 5 minutes. JavaScript SDK with React, Vue, and vanilla JS support.",
  openGraph: {
    title: "AreYouHuman SDK — Drop-in Human Verification",
    description: "Replace CAPTCHAs with passive behavioral verification. 3 lines of code.",
    url: "https://areyouhuman.io/sdk",
  },
};

export default function SDKLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
