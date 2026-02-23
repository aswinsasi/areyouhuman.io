"use client";

import React from "react";
import { COLORS } from "@/lib/constants";

export default function PrivacyPage() {
  return (
    <main className="relative z-10 max-w-3xl mx-auto px-4 py-6 sm:px-6">
      <header className="flex items-center gap-3 mb-8">
        <a href="/" className="flex items-center gap-3 hover:brightness-125 transition-all">
          <span className="text-2xl" style={{ color: COLORS.cyan }}>◉</span>
          <span className="font-display text-lg font-bold tracking-tight text-cyber-text">AREYOUHUMAN</span>
        </a>
      </header>

      <h1 className="font-display text-3xl font-bold mb-2 tracking-tight">
        Privacy <span style={{ color: COLORS.cyan }}>Policy</span>
      </h1>
      <p className="text-xs font-mono mb-8" style={{ color: "#667788" }}>Last updated: February 23, 2026</p>

      <div className="space-y-6 text-sm font-mono leading-relaxed" style={{ color: "#99AABB" }}>
        <section>
          <h2 className="font-display font-bold text-base text-cyber-text mb-2">Our Core Principle</h2>
          <p>AreYouHuman is built on a simple premise: <span style={{ color: COLORS.green }}>we don&apos;t need your personal data to verify you&apos;re human</span>. Our behavioral analysis is ephemeral, anonymous, and never stored.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-base text-cyber-text mb-2">What We Analyze (During the 8-Second Scan)</h2>
          <p className="mb-2">During verification, we temporarily process these behavioral signals in your browser:</p>
          <div className="rounded-lg border p-4 space-y-2" style={{ backgroundColor: "#0C1018", borderColor: "#1A2030" }}>
            {["Pointer movement patterns (velocity, acceleration, curvature)",
              "Scroll behavior (velocity distribution, entropy)",
              "Keystroke timing (inter-key intervals, rhythm variation)",
              "Micro-tremor patterns (involuntary oscillation in pointer movement)",
              "Cross-channel temporal coherence (correlation between signals)"].map(item => (
              <div key={item} className="flex items-start gap-2 text-xs">
                <span style={{ color: COLORS.green }}>✓</span><span>{item}</span>
              </div>
            ))}
          </div>
          <p className="mt-3">All processing happens <span style={{ color: COLORS.cyan }}>entirely in your browser</span>. Raw signal data is never transmitted to any server.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-base text-cyber-text mb-2">What We Do NOT Collect</h2>
          <div className="rounded-lg border p-4 space-y-2" style={{ backgroundColor: "#0C1018", borderColor: COLORS.magenta + "20" }}>
            {["Personal information (name, email, address, phone)",
              "Keystroke content (what you type — only timing between keys)",
              "Browsing history or activity on other sites",
              "Device fingerprints or hardware identifiers",
              "IP addresses for tracking purposes",
              "Cookies or local storage data",
              "Biometric data (fingerprints, face, voice)",
              "Location data"].map(item => (
              <div key={item} className="flex items-start gap-2 text-xs">
                <span style={{ color: COLORS.magenta }}>✗</span><span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display font-bold text-base text-cyber-text mb-2">Cookies & Tracking</h2>
          <p>AreYouHuman uses <span style={{ color: COLORS.green }}>zero cookies</span> and <span style={{ color: COLORS.green }}>zero cross-site tracking</span>. We use Plausible Analytics for aggregate, anonymous website traffic statistics — which is also cookie-free and GDPR-compliant.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-base text-cyber-text mb-2">Data Retention</h2>
          <p>Behavioral signal data exists only in your browser&apos;s memory during the 8-second analysis window. Once the scan completes, the raw data is discarded. Only the resulting verification token (a cryptographic proof with no personal data) is generated.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-base text-cyber-text mb-2">Third-Party SDK Usage</h2>
          <p>When websites integrate our SDK, the same privacy principles apply. The SDK runs entirely client-side. The only data transmitted to our API is the verification token for server-side validation — this token contains a score and timestamp, not personal data.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-base text-cyber-text mb-2">Your Rights</h2>
          <p>Since we don&apos;t collect personal data, traditional data subject rights (access, deletion, portability) are automatically satisfied — there is simply nothing to access, delete, or port.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-base text-cyber-text mb-2">GDPR & CCPA Compliance</h2>
          <p>Our architecture is privacy-by-design. No personal data processing means no GDPR consent requirements for the verification itself. No data selling means full CCPA compliance.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-base text-cyber-text mb-2">Contact</h2>
          <p>Questions about privacy? Email us at <a href="mailto:privacy@areyouhuman.io" style={{ color: COLORS.cyan }}>privacy@areyouhuman.io</a></p>
        </section>
      </div>

      <footer className="text-center py-6 mt-12 border-t" style={{ borderColor: "#1A2030" }}>
        <p className="text-[11px] font-mono text-cyber-muted">© 2026 HumanSign Protocol</p>
      </footer>
    </main>
  );
}
