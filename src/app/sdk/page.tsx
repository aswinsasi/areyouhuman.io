"use client";

import dynamic from "next/dynamic";

const SDKDocs = dynamic(() => import("@/components/SDKDocs"), {
  ssr: false,
  loading: () => (
    <main className="relative z-10 max-w-4xl mx-auto px-4 py-6 sm:px-6">
      <div className="text-center py-20">
        <div className="text-2xl" style={{ color: "#00F0FF" }}>◉</div>
        <p className="text-sm font-mono mt-3" style={{ color: "#667788" }}>Loading SDK documentation...</p>
      </div>
    </main>
  ),
});

export default function SDKPage() {
  return <SDKDocs />;
}
