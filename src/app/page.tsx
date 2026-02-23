"use client";

import dynamic from "next/dynamic";

// The entire interactive app is client-only — zero hydration issues
const ClientApp = dynamic(() => import("@/components/ClientApp"), {
  ssr: false,
  loading: () => (
    <main className="relative z-10 max-w-5xl mx-auto px-4 py-6 sm:px-6">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="text-2xl" style={{ color: "#00F0FF" }}>◉</span>
          <span className="font-display text-lg font-bold tracking-tight" style={{ color: "#E0E8F0" }}>
            AREYOUHUMAN
          </span>
        </div>
      </header>
      <section className="text-center mb-8">
        <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3 tracking-tight" style={{ color: "#E0E8F0" }}>
          Prove You&apos;re <span style={{ color: "#00F0FF" }}>Human</span>
        </h1>
        <p className="text-sm sm:text-base max-w-xl mx-auto font-mono" style={{ color: "#667788" }}>
          Loading behavioral analysis engine...
        </p>
      </section>
    </main>
  ),
});

export default function Page() {
  return <ClientApp />;
}
