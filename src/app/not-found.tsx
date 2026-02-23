"use client";

import React from "react";
import { COLORS } from "@/lib/constants";

export default function NotFound() {
  return (
    <main className="relative z-10 min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4" style={{ color: COLORS.cyan }}>◉</div>
        <h1 className="font-display text-5xl font-bold mb-3 tracking-tight">
          4<span style={{ color: COLORS.cyan }}>0</span>4
        </h1>
        <p className="text-sm font-mono mb-6" style={{ color: "#667788" }}>
          This signal was not found. The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <a href="/" className="px-5 py-2.5 rounded-lg font-mono text-sm font-bold transition-all hover:brightness-125 hover:scale-105"
            style={{ backgroundColor: COLORS.cyan + "15", color: COLORS.cyan, border: `1px solid ${COLORS.cyan}40` }}>
            ← Back to Home
          </a>
          <a href="/sdk" className="px-5 py-2.5 rounded-lg font-mono text-sm font-bold transition-all hover:brightness-125"
            style={{ backgroundColor: "#1A2030", color: "#E0E8F0", border: "1px solid #2A3040" }}>
            SDK Docs
          </a>
        </div>
      </div>
    </main>
  );
}
