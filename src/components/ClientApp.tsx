"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSignalCapture } from "@/hooks/useSignalCapture";
import { useAnalysis } from "@/hooks/useAnalysis";
import { useDeviceMotion } from "@/hooks/useDeviceMotion";
import WaveformDisplay from "./WaveformDisplay";
import CoherenceRing from "./CoherenceRing";
import Fingerprint from "./Fingerprint";
import BotComparison from "./BotComparison";
import ShareCard from "./ShareCard";
import HowItWorks from "./HowItWorks";
import { CHANNELS, STATUS_MESSAGES, COLORS } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import { unlockAudio, feedbackReset, feedbackClick } from "@/lib/sfx";

export default function ClientApp() {
  const buffers = useSignalCapture();
  const analysis = useAnalysis(buffers);
  const { permissionGranted, available, requestPermission } = useDeviceMotion(buffers.motion);
  const [statusIdx, setStatusIdx] = useState(0);
  const [muted, setMuted] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  const handleFirstInteraction = useCallback(() => {
    unlockAudio();
    window.removeEventListener("pointerdown", handleFirstInteraction);
    window.removeEventListener("keydown", handleFirstInteraction);
  }, []);

  useEffect(() => {
    window.addEventListener("pointerdown", handleFirstInteraction);
    window.addEventListener("keydown", handleFirstInteraction);
    return () => {
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };
  }, [handleFirstInteraction]);

  useEffect(() => {
    if (analysis.phase !== "scanning") return;
    const iv = setInterval(() => setStatusIdx((i) => (i + 1) % STATUS_MESSAGES.length), 1200);
    return () => clearInterval(iv);
  }, [analysis.phase]);

  useEffect(() => { trackEvent("page_view"); }, []);

  const channelData = CHANNELS.map((ch) => ({
    ...ch,
    data: analysis.displayBuffers[ch.key as keyof typeof analysis.displayBuffers],
    score: analysis.scores[ch.key as keyof typeof analysis.scores],
  }));

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail) return;
    try {
      await fetch("/api/v1/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: waitlistEmail, source: "homepage" }),
      });
    } catch { /* ignore */ }
    trackEvent("cta_sdk", { email: waitlistEmail });
    setWaitlistSubmitted(true);
    if (!muted) feedbackClick();
  };

  return (
    <main id="main-content" className="relative z-10 max-w-5xl mx-auto px-4 py-6 sm:px-6" role="main">
      {/* Header */}
      <header className="flex items-center justify-between mb-8 animate-fade-in" role="banner">
        <div className="flex items-center gap-3">
          <span className="text-2xl animate-pulse-glow" style={{ color: COLORS.cyan }} aria-hidden="true">◉</span>
          <span className="font-display text-lg font-bold tracking-tight text-cyber-text">AREYOUHUMAN</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded" style={{ backgroundColor: COLORS.cyan + "15", color: COLORS.cyan }}>v0.1</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMuted(!muted)}
            className="text-xs font-mono px-2 py-1 rounded transition-all hover:brightness-125"
            style={{ color: muted ? "#667788" : COLORS.cyan, backgroundColor: muted ? "#1A203040" : COLORS.cyan + "10" }}
            aria-label={muted ? "Unmute sound effects" : "Mute sound effects"}
            aria-pressed={muted}
          >
            {muted ? "🔇" : "🔊"}
          </button>
          <a href="https://areyouhuman.io/sdk" target="_blank" rel="noopener noreferrer"
            className="text-[10px] font-mono tracking-[0.2em] hidden sm:block hover:brightness-125 transition-all" style={{ color: COLORS.cyan + "60" }}
            aria-label="HumanSign Protocol documentation">
            HUMANSIGN PROTOCOL
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="text-center mb-8 animate-fade-in-up" aria-label="Hero">
        <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3 tracking-tight">
          Prove You&apos;re <span style={{ color: COLORS.cyan }}>Human</span>
        </h1>
        <p className="text-cyber-muted text-sm sm:text-base max-w-xl mx-auto font-mono">
          No CAPTCHA. No biometrics. Just your involuntary micro-signals across 5 behavioral channels.
        </p>

        {/* Progress */}
        {analysis.phase === "scanning" && (
          <div className="mt-4 max-w-md mx-auto" role="progressbar" aria-valuenow={Math.round(analysis.progress * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="Analysis progress">
            <div className="flex justify-between text-[10px] font-mono mb-1">
              <span style={{ color: COLORS.cyan + "80" }}>{STATUS_MESSAGES[statusIdx]}</span>
              <span style={{ color: COLORS.cyan }}>{Math.round(analysis.progress * 100)}%</span>
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: "#1A2030" }}>
              <div className="h-full rounded-full transition-all duration-300"
                style={{ width: `${analysis.progress * 100}%`, background: `linear-gradient(90deg, ${COLORS.cyan}, ${COLORS.green})` }} />
            </div>
          </div>
        )}

        {/* Idle prompt */}
        {analysis.phase === "idle" && (
          <div className="mt-6 flex flex-col items-center gap-3">
            <p className="text-xs font-mono animate-pulse" style={{ color: COLORS.amber }} role="status">
              ↳ Move your mouse, scroll, or type to begin analysis...
            </p>
            {available && !permissionGranted && (
              <button onClick={requestPermission}
                className="px-4 py-2 rounded-lg font-mono text-xs border transition-all hover:brightness-125"
                style={{ borderColor: COLORS.amber + "40", color: COLORS.amber, backgroundColor: COLORS.amber + "10" }}
                aria-label="Enable device motion sensors for improved accuracy">
                📱 Enable motion sensors for higher accuracy
              </button>
            )}
          </div>
        )}

        {/* Scan Again */}
        {analysis.phase === "complete" && (
          <div className="mt-4 animate-fade-in">
            <button onClick={() => { analysis.reset(); if (!muted) feedbackReset(); }}
              className="px-5 py-2.5 rounded-lg font-mono text-sm font-bold transition-all hover:brightness-125 hover:scale-105 active:scale-95"
              style={{ backgroundColor: COLORS.cyan + "15", color: COLORS.cyan, border: `1px solid ${COLORS.cyan}40` }}
              aria-label="Run the behavioral analysis again">
              ↻ Scan Again
            </button>
          </div>
        )}
      </section>

      {/* Typing input */}
      {analysis.phase !== "complete" && (
        <div className="max-w-md mx-auto mb-6">
          <label htmlFor="typing-input" className="sr-only">Type here for keystroke analysis</label>
          <input id="typing-input" type="text"
            placeholder={analysis.phase === "idle" ? "Type anything to begin..." : "Keep typing for keystroke analysis..."}
            className="w-full px-4 py-2.5 rounded-lg font-mono text-sm bg-transparent border text-center focus:outline-none transition-colors"
            style={{ borderColor: COLORS.magenta + "30", color: COLORS.magenta }}
            onFocus={(e) => (e.target.style.borderColor = COLORS.magenta)}
            onBlur={(e) => (e.target.style.borderColor = COLORS.magenta + "30")}
            autoComplete="off"
            aria-label="Type here for keystroke rhythm analysis"
          />
        </div>
      )}

      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-6 mb-8">
        <div className="flex flex-col gap-3 order-2 md:order-1 stagger-children" role="region" aria-label="Signal channels">
          {channelData.map((ch) => (
            <WaveformDisplay key={ch.key} data={ch.data} color={ch.color} label={ch.label} icon={ch.icon} score={ch.score} />
          ))}
        </div>
        <div className="flex flex-col items-center gap-4 order-1 md:order-2">
          <CoherenceRing score={analysis.overallScore} channelScores={analysis.scores} phase={analysis.phase} elapsed={analysis.elapsed} />
          <Fingerprint signalData={analysis.signalData} elapsed={analysis.elapsed} />
        </div>
      </div>

      {/* Post-analysis */}
      {analysis.phase === "complete" && (
        <div className="flex flex-col gap-6 mb-8 animate-fade-in-up">
          <ShareCard score={analysis.overallScore} channelScores={analysis.scores} signalData={analysis.signalData} onShare={() => { if (!muted) feedbackClick(); }} />
          <BotComparison humanData={analysis.displayBuffers} />
        </div>
      )}

      {/* Feature cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 stagger-children" aria-label="Key features">
        {[
          { icon: "◎", title: "5+ Signal Channels", desc: "Pointer dynamics, scroll entropy, keystroke rhythm, micro-tremor, and cross-channel coherence — all captured passively.", color: COLORS.cyan },
          { icon: "◈", title: "Cross-Channel Coherence", desc: "Individual signals can be faked. The physiological correlation between ALL channels simultaneously cannot.", color: COLORS.green },
          { icon: "⟐", title: "Verify Once, Use Everywhere", desc: "Your Human Token works across all HumanSign-enabled services. Never solve another CAPTCHA again.", color: COLORS.violet },
        ].map((card) => (
          <div key={card.title} className="rounded-lg border p-5 transition-all hover:brightness-110 animate-border-pulse" style={{ backgroundColor: "#0C1018", borderColor: "#1A2030" }}>
            <span className="text-2xl mb-2 block" style={{ color: card.color }} aria-hidden="true">{card.icon}</span>
            <h3 className="font-display font-bold text-sm mb-1 text-cyber-text">{card.title}</h3>
            <p className="text-xs font-mono text-cyber-muted leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </section>

      {/* How It Works + FAQ */}
      <HowItWorks />

      {/* Waitlist / Early Access CTA */}
      <section className="mb-12 rounded-lg border p-6 sm:p-8 text-center animate-border-pulse" style={{ backgroundColor: "#0C1018", borderColor: COLORS.cyan + "20" }} aria-label="Early access signup">
        <div className="text-[10px] font-mono tracking-[0.3em] mb-2" style={{ color: COLORS.cyan + "60" }}>EARLY ACCESS</div>
        <h2 className="font-display text-xl sm:text-2xl font-bold mb-2 tracking-tight">
          Get <span style={{ color: COLORS.cyan }}>Early Access</span> to the SDK
        </h2>
        <p className="text-xs font-mono mb-5 max-w-md mx-auto" style={{ color: "#667788" }}>
          Be among the first developers to integrate AreYouHuman into your apps. Free tier includes 10,000 verifications/month.
        </p>
        {waitlistSubmitted ? (
          <div className="animate-fade-in">
            <span className="text-sm font-mono font-bold" style={{ color: COLORS.green }}>✓ You&apos;re on the list! We&apos;ll be in touch soon.</span>
          </div>
        ) : (
          <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <label htmlFor="waitlist-email" className="sr-only">Email address</label>
            <input
              id="waitlist-email"
              type="email"
              required
              placeholder="you@company.com"
              value={waitlistEmail}
              onChange={(e) => setWaitlistEmail(e.target.value)}
              className="w-full sm:flex-1 px-4 py-2.5 rounded-lg font-mono text-sm bg-transparent border focus:outline-none transition-colors"
              style={{ borderColor: COLORS.cyan + "30", color: COLORS.cyan }}
              aria-label="Enter your email for early access"
            />
            <button type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-mono text-sm font-bold transition-all hover:brightness-125 hover:scale-105 active:scale-95 whitespace-nowrap"
              style={{ backgroundColor: COLORS.cyan + "20", color: COLORS.cyan, border: `1px solid ${COLORS.cyan}40` }}>
              Join Waitlist →
            </button>
          </form>
        )}
        <div className="flex items-center justify-center gap-4 mt-4 text-[10px] font-mono" style={{ color: "#667788" }}>
          <span>🔒 No spam, ever</span>
          <span>•</span>
          <span>📦 Free tier available</span>
          <span>•</span>
          <span>⚡ Launch Q2 2026</span>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center mb-12" aria-label="Call to action">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href="/sdk"
            onClick={() => { trackEvent("cta_sdk"); if (!muted) feedbackClick(); }}
            className="px-6 py-3 rounded-lg font-mono text-sm font-bold transition-all hover:brightness-125"
            style={{ backgroundColor: COLORS.cyan + "20", color: COLORS.cyan, border: `1px solid ${COLORS.cyan}40` }}>
            Get the SDK →
          </a>
          <a href="https://github.com/AreYouHuman" target="_blank" rel="noopener noreferrer"
            onClick={() => { trackEvent("cta_protocol"); if (!muted) feedbackClick(); }}
            className="px-6 py-3 rounded-lg font-mono text-sm font-bold transition-all hover:brightness-125"
            style={{ backgroundColor: "#1A2030", color: "#E0E8F0", border: "1px solid #2A3040" }}>
            View on GitHub
          </a>
        </div>
      </section>

      {/* Trust bar */}
      <section className="text-center mb-8" aria-label="Trust indicators">
        <div className="flex items-center justify-center gap-6 flex-wrap text-[10px] font-mono" style={{ color: "#667788" }}>
          <span>🔒 Zero cookies</span>
          <span>🛡️ GDPR compliant</span>
          <span>⚡ 8-second verification</span>
          <span>📱 Mobile ready</span>
          <span>♿ Accessible</span>
          <span>🌐 MIT Licensed</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 border-t" style={{ borderColor: "#1A2030" }} role="contentinfo">
        <nav className="flex items-center justify-center gap-4 mb-2" aria-label="Footer navigation">
          <a href="/dashboard" className="text-[11px] font-mono hover:brightness-125 transition-all" style={{ color: COLORS.amber + "60" }}>Dashboard</a>
          <a href="/sdk" className="text-[11px] font-mono hover:brightness-125 transition-all" style={{ color: COLORS.cyan + "60" }}>SDK</a>
          <a href="/privacy" className="text-[11px] font-mono hover:brightness-125 transition-all" style={{ color: "#667788" }}>Privacy</a>
          <a href="/terms" className="text-[11px] font-mono hover:brightness-125 transition-all" style={{ color: "#667788" }}>Terms</a>
          <a href="https://github.com/AreYouHuman" target="_blank" rel="noopener noreferrer" className="text-[11px] font-mono hover:brightness-125 transition-all" style={{ color: "#667788" }}>GitHub</a>
          <a href="https://www.npmjs.com/package/@areyouhuman/sdk" target="_blank" rel="noopener noreferrer" className="text-[11px] font-mono hover:brightness-125 transition-all" style={{ color: "#667788" }}>npm</a>
        </nav>
        <p className="text-[11px] font-mono text-cyber-muted">© 2026 HumanSign Protocol — Proving humanity through behavioral micro-signals</p>
      </footer>
    </main>
  );
}
