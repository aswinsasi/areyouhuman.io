"use client";

import React from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="relative z-10 min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4" style={{ color: "#FF6B6B" }}>⚠</div>
        <h1 className="font-display text-3xl font-bold mb-3 tracking-tight text-cyber-text">
          Signal Interrupted
        </h1>
        <p className="text-sm font-mono mb-6" style={{ color: "#667788" }}>
          Something went wrong during analysis. This has been logged.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={reset} className="px-5 py-2.5 rounded-lg font-mono text-sm font-bold transition-all hover:brightness-125 hover:scale-105"
            style={{ backgroundColor: "#00F0FF15", color: "#00F0FF", border: "1px solid #00F0FF40" }}>
            ↻ Try Again
          </button>
          <a href="/" className="px-5 py-2.5 rounded-lg font-mono text-sm font-bold transition-all hover:brightness-125"
            style={{ backgroundColor: "#1A2030", color: "#E0E8F0", border: "1px solid #2A3040" }}>
            ← Home
          </a>
        </div>
      </div>
    </main>
  );
}
