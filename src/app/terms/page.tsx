"use client";

import React from "react";
import { COLORS } from "@/lib/constants";

export default function TermsPage() {
  return (
    <main className="relative z-10 max-w-3xl mx-auto px-4 py-6 sm:px-6">
      <header className="flex items-center gap-3 mb-8">
        <a href="/" className="flex items-center gap-3 hover:brightness-125 transition-all">
          <span className="text-2xl" style={{ color: COLORS.cyan }}>◉</span>
          <span className="font-display text-lg font-bold tracking-tight text-cyber-text">AREYOUHUMAN</span>
        </a>
      </header>

      <h1 className="font-display text-3xl font-bold mb-2 tracking-tight">
        Terms of <span style={{ color: COLORS.cyan }}>Service</span>
      </h1>
      <p className="text-xs font-mono mb-8" style={{ color: "#667788" }}>Last updated: February 23, 2026</p>

      <div className="space-y-6 text-sm font-mono leading-relaxed" style={{ color: "#99AABB" }}>
        <section>
          <h2 className="font-display font-bold text-base text-cyber-text mb-2">1. Acceptance of Terms</h2>
          <p>By accessing or using AreYouHuman.io (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-base text-cyber-text mb-2">2. Description of Service</h2>
          <p>AreYouHuman provides behavioral human verification technology. The Service analyzes involuntary micro-signals from user interactions to distinguish humans from automated bots. The Service is offered as:</p>
          <div className="rounded-lg border p-4 mt-2 space-y-2" style={{ backgroundColor: "#0C1018", borderColor: "#1A2030" }}>
            <div className="flex items-start gap-2 text-xs"><span style={{ color: COLORS.cyan }}>•</span><span><strong className="text-cyber-text">Demo Site</strong> — Free interactive demonstration at areyouhuman.io</span></div>
            <div className="flex items-start gap-2 text-xs"><span style={{ color: COLORS.cyan }}>•</span><span><strong className="text-cyber-text">SDK</strong> — Developer toolkit for integrating verification into third-party applications</span></div>
            <div className="flex items-start gap-2 text-xs"><span style={{ color: COLORS.cyan }}>•</span><span><strong className="text-cyber-text">API</strong> — Server-side token verification endpoint</span></div>
          </div>
        </section>

        <section>
          <h2 className="font-display font-bold text-base text-cyber-text mb-2">3. Permitted Use</h2>
          <p>You may use the Service for lawful purposes to verify human users on your websites and applications. You agree not to:</p>
          <div className="rounded-lg border p-4 mt-2 space-y-2" style={{ backgroundColor: "#0C1018", borderColor: COLORS.magenta + "20" }}>
            {["Reverse-engineer, decompile, or attempt to extract the verification algorithms",
              "Use the Service to discriminate against individuals or groups",
              "Attempt to bypass or spoof the verification system",
              "Resell or redistribute the Service without authorization",
              "Use the Service in violation of any applicable laws or regulations",
              "Exceed API rate limits or abuse the verification endpoint"].map(item => (
              <div key={item} className="flex items-start gap-2 text-xs">
                <span style={{ color: COLORS.magenta }}>✗</span><span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display font-bold text-base text-cyber-text mb-2">4. SDK License</h2>
          <p>The AreYouHuman SDK is provided under the MIT License. You may use, modify, and distribute the SDK in your applications, subject to the license terms. The SDK must be used in conjunction with a valid site key obtained from the AreYouHuman dashboard.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-base text-cyber-text mb-2">5. API Usage & Rate Limits</h2>
          <div className="rounded-lg border overflow-hidden mt-2" style={{ backgroundColor: "#0C1018", borderColor: "#1A2030" }}>
            <table className="w-full text-xs font-mono">
              <thead><tr style={{ borderBottom: "1px solid #1A2030", backgroundColor: "#0A0E18" }}>
                <th className="text-left p-3" style={{ color: COLORS.cyan }}>Plan</th>
                <th className="text-left p-3" style={{ color: "#667788" }}>Verifications/month</th>
                <th className="text-left p-3" style={{ color: "#667788" }}>Rate Limit</th>
                <th className="text-left p-3" style={{ color: "#667788" }}>Price</th>
              </tr></thead>
              <tbody>
                {[["Free","10,000","100/min","$0"],["Pro","100,000","500/min","$29/mo"],["Enterprise","Unlimited","Custom","Contact us"]].map(([plan,v,r,p]) => (
                  <tr key={plan} style={{ borderBottom: "1px solid #1A203060" }}>
                    <td className="p-3" style={{ color: COLORS.green }}>{plan}</td>
                    <td className="p-3" style={{ color: "#667788" }}>{v}</td>
                    <td className="p-3" style={{ color: "#667788" }}>{r}</td>
                    <td className="p-3" style={{ color: "#667788" }}>{p}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="font-display font-bold text-base text-cyber-text mb-2">6. Accuracy & Limitations</h2>
          <p>The Service provides probabilistic human verification based on behavioral analysis. While highly accurate, it is not infallible. We do not guarantee 100% accuracy in all conditions. The Service should be used as one layer of security, not the sole protection against automated abuse.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-base text-cyber-text mb-2">7. Privacy</h2>
          <p>Your use of the Service is also governed by our <a href="/privacy" style={{ color: COLORS.cyan }}>Privacy Policy</a>, which describes how we handle (and don&apos;t handle) data.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-base text-cyber-text mb-2">8. Availability & Uptime</h2>
          <p>We strive for 99.9% uptime but do not guarantee uninterrupted service. The Service may be temporarily unavailable for maintenance, updates, or due to circumstances beyond our control.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-base text-cyber-text mb-2">9. Limitation of Liability</h2>
          <p>THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTY OF ANY KIND. IN NO EVENT SHALL AREYOUHUMAN OR THE HUMANSIGN PROTOCOL BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE SERVICE.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-base text-cyber-text mb-2">10. Changes to Terms</h2>
          <p>We may update these terms from time to time. Continued use of the Service after changes constitutes acceptance of the updated terms. Material changes will be communicated via the website.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-base text-cyber-text mb-2">11. Contact</h2>
          <p>For questions about these terms, contact <a href="mailto:legal@areyouhuman.io" style={{ color: COLORS.cyan }}>legal@areyouhuman.io</a></p>
        </section>
      </div>

      <footer className="text-center py-6 mt-12 border-t" style={{ borderColor: "#1A2030" }}>
        <p className="text-[11px] font-mono text-cyber-muted">© 2026 HumanSign Protocol</p>
      </footer>
    </main>
  );
}
