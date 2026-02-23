"use client";

import React, { useState } from "react";
import { COLORS } from "@/lib/constants";

const STEPS = [
  {
    num: "01",
    title: "You Interact Naturally",
    desc: "Move your mouse, scroll, type — just use the page normally. Our sensors passively capture micro-signals from 5 behavioral channels.",
    icon: "👆",
    color: COLORS.cyan,
    detail: "We capture pointer velocity, scroll patterns, keystroke timing, micro-tremor oscillations, and cross-channel correlation — all from standard browser APIs with zero permissions required.",
  },
  {
    num: "02",
    title: "Real-Time Signal Analysis",
    desc: "Our engine computes instantaneous behavioral metrics at 60fps using windowed statistics, Shannon entropy, and EMA smoothing.",
    icon: "📊",
    color: COLORS.green,
    detail: "Each channel produces a score from 0–1 based on the statistical properties of your input. Pointer jitter uses acceleration variance, scroll uses velocity entropy, keystrokes use coefficient of variation, and tremor detects oscillation patterns.",
  },
  {
    num: "03",
    title: "Cross-Channel Coherence",
    desc: "The key insight: individual signals can be spoofed, but the involuntary physiological correlation between ALL channels simultaneously cannot.",
    icon: "◈",
    color: COLORS.magenta,
    detail: "We compute pairwise Pearson correlation across all active channels. Humans show natural cross-channel coherence because all signals originate from the same neuromotor system. Bots either produce perfectly correlated signals (scripted) or zero correlation (random noise injection).",
  },
  {
    num: "04",
    title: "Human Verified",
    desc: "In 8 seconds, you receive a verified Human Score with a shareable proof card. No passwords, no puzzles, no friction.",
    icon: "✓",
    color: COLORS.green,
    detail: "Your Human Token can be used across all HumanSign-enabled services. One verification works everywhere — replacing CAPTCHAs, age checks, and bot gates with a single seamless proof of humanity.",
  },
];

const FAQS = [
  {
    q: "What data do you collect?",
    a: "Only behavioral micro-signals (mouse movement patterns, scroll velocity, keystroke timing). We never collect personal information, keystrokes content, or biometric data. All processing happens in your browser — nothing is sent to a server.",
  },
  {
    q: "How is this different from reCAPTCHA?",
    a: "reCAPTCHA tracks you across sites, requires solving puzzles, and relies on cookies. AreYouHuman uses passive behavioral analysis that completes in 8 seconds with zero user friction and no tracking.",
  },
  {
    q: "Can bots fake these signals?",
    a: "Individual channels can be spoofed, but the cross-channel coherence from involuntary neuromotor activity is extremely difficult to simulate. Bots either produce signals that are too smooth (scripted), too random (noise injection), or lack the natural correlation between channels.",
  },
  {
    q: "Does it work on mobile?",
    a: "Yes. On mobile, we use touch events and device accelerometer/gyroscope data instead of mouse movements. The micro-tremor channel is especially effective on mobile since phones pick up hand tremor directly.",
  },
  {
    q: "Is this privacy-friendly?",
    a: "Extremely. No cookies, no fingerprinting, no personal data, no cross-site tracking. The behavioral analysis is ephemeral — it exists only during the 8-second scan and is never stored or transmitted.",
  },
];

export default function HowItWorks() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <section className="mb-16">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="text-[10px] font-mono tracking-[0.3em] mb-2" style={{ color: COLORS.cyan + "60" }}>
          THE PROTOCOL
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-3">
          How It <span style={{ color: COLORS.cyan }}>Works</span>
        </h2>
        <p className="text-sm font-mono max-w-lg mx-auto" style={{ color: "#667788" }}>
          Four steps from stranger to verified human — no friction, no tracking, no puzzles.
        </p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {STEPS.map((step, i) => (
          <button
            key={step.num}
            onClick={() => setExpandedStep(expandedStep === i ? null : i)}
            className="text-left rounded-lg border p-5 transition-all hover:brightness-110"
            style={{
              backgroundColor: "#0C1018",
              borderColor: expandedStep === i ? step.color + "50" : "#1A2030",
              borderLeftWidth: 3,
              borderLeftColor: step.color,
            }}
          >
            <div className="flex items-start gap-3 mb-2">
              <span className="text-2xl">{step.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: step.color + "15", color: step.color }}>
                    STEP {step.num}
                  </span>
                </div>
                <h3 className="font-display font-bold text-sm text-cyber-text mb-1">{step.title}</h3>
                <p className="text-xs font-mono leading-relaxed" style={{ color: "#667788" }}>{step.desc}</p>
              </div>
            </div>
            {expandedStep === i && (
              <div className="mt-3 pt-3 text-xs font-mono leading-relaxed"
                style={{ borderTop: `1px solid ${step.color}20`, color: step.color + "CC" }}>
                {step.detail}
              </div>
            )}
            <div className="text-[10px] font-mono mt-2" style={{ color: step.color + "60" }}>
              {expandedStep === i ? "▾ less" : "▸ learn more"}
            </div>
          </button>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="rounded-lg border overflow-hidden mb-12" style={{ backgroundColor: "#0C1018", borderColor: "#1A2030" }}>
        <div className="p-4 border-b" style={{ borderColor: "#1A2030" }}>
          <h3 className="font-display font-bold text-sm text-cyber-text">AreYouHuman vs Traditional Verification</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr style={{ borderBottom: "1px solid #1A2030" }}>
                <th className="text-left p-3" style={{ color: "#667788" }}>Feature</th>
                <th className="text-center p-3" style={{ color: COLORS.cyan }}>AreYouHuman</th>
                <th className="text-center p-3" style={{ color: "#667788" }}>reCAPTCHA</th>
                <th className="text-center p-3" style={{ color: "#667788" }}>hCaptcha</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["User friction", "None", "Puzzles", "Puzzles"],
                ["Time to verify", "8 sec passive", "15-45 sec", "10-30 sec"],
                ["Cookies required", "No", "Yes", "Yes"],
                ["Cross-site tracking", "No", "Yes", "Limited"],
                ["Works without JS puzzles", "Yes", "No", "No"],
                ["Accessibility", "Full", "Limited", "Limited"],
                ["Mobile optimized", "Yes", "Partial", "Partial"],
                ["Privacy-first", "Yes", "No", "Partial"],
              ].map(([feature, ayh, recaptcha, hcaptcha]) => (
                <tr key={feature} style={{ borderBottom: "1px solid #1A203060" }}>
                  <td className="p-3" style={{ color: "#667788" }}>{feature}</td>
                  <td className="p-3 text-center" style={{ color: COLORS.green }}>
                    {ayh === "Yes" || ayh === "None" || ayh === "No" || ayh === "Full" ? "✓ " : ""}{ayh}
                  </td>
                  <td className="p-3 text-center" style={{ color: "#667788" }}>{recaptcha}</td>
                  <td className="p-3 text-center" style={{ color: "#667788" }}>{hcaptcha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto">
        <h3 className="font-display font-bold text-lg text-center mb-6 tracking-tight">
          Frequently Asked <span style={{ color: COLORS.cyan }}>Questions</span>
        </h3>
        <div className="flex flex-col gap-2">
          {FAQS.map((faq, i) => (
            <button
              key={i}
              onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
              className="text-left rounded-lg border p-4 transition-all hover:brightness-110"
              style={{
                backgroundColor: "#0C1018",
                borderColor: expandedFaq === i ? COLORS.cyan + "30" : "#1A2030",
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono font-bold text-cyber-text">{faq.q}</span>
                <span className="text-xs ml-3" style={{ color: COLORS.cyan }}>
                  {expandedFaq === i ? "▾" : "▸"}
                </span>
              </div>
              {expandedFaq === i && (
                <p className="mt-3 pt-3 text-xs font-mono leading-relaxed"
                  style={{ borderTop: "1px solid #1A2030", color: "#667788" }}>
                  {faq.a}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
