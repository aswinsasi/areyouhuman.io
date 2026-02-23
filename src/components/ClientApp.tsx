"use client";

import React, { useState, useEffect } from "react";
import { useSignalCapture } from "@/hooks/useSignalCapture";
import { useAnalysis } from "@/hooks/useAnalysis";
import { useDeviceMotion } from "@/hooks/useDeviceMotion";
import WaveformDisplay from "./WaveformDisplay";
import CoherenceRing from "./CoherenceRing";
import Fingerprint from "./Fingerprint";
import BotComparison from "./BotComparison";
import ShareCard from "./ShareCard";
import { CHANNELS, STATUS_MESSAGES, COLORS } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";

export default function ClientApp() {
  const buffers = useSignalCapture();
  const analysis = useAnalysis(buffers);
  const { permissionGranted, available, requestPermission } = useDeviceMotion(buffers.motion);
  const [statusIdx, setStatusIdx] = useState(0);

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

  return (
    <main className="relative z-10 max-w-5xl mx-auto px-4 py-6 sm:px-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="text-2xl" style={{ color: COLORS.cyan }}>◉</span>
          <span className="font-display text-lg font-bold tracking-tight text-cyber-text">AREYOUHUMAN</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded" style={{ backgroundColor: COLORS.cyan + "15", color: COLORS.cyan }}>v0.1</span>
        </div>
        <a href="https://humansignprotocol.org" target="_blank" rel="noopener noreferrer"
          className="text-[10px] font-mono tracking-[0.2em] hidden sm:block hover:brightness-125 transition-all" style={{ color: COLORS.cyan + "60" }}>
          HUMANSIGN PROTOCOL
        </a>
      </header>

      {/* Hero */}
      <section className="text-center mb-8">
        <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3 tracking-tight">
          Prove You&apos;re <span style={{ color: COLORS.cyan }}>Human</span>
        </h1>
        <p className="text-cyber-muted text-sm sm:text-base max-w-xl mx-auto font-mono">
          No CAPTCHA. No biometrics. Just your involuntary micro-signals across 5 behavioral channels.
        </p>

        {/* Progress */}
        {analysis.phase === "scanning" && (
          <div className="mt-4 max-w-md mx-auto">
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
            <p className="text-xs font-mono animate-pulse" style={{ color: COLORS.amber }}>
              ↳ Move your mouse, scroll, or type to begin analysis...
            </p>
            {available && !permissionGranted && (
              <button onClick={requestPermission}
                className="px-4 py-2 rounded-lg font-mono text-xs border transition-all hover:brightness-125"
                style={{ borderColor: COLORS.amber + "40", color: COLORS.amber, backgroundColor: COLORS.amber + "10" }}>
                📱 Enable motion sensors for higher accuracy
              </button>
            )}
          </div>
        )}

        {/* Scan Again */}
        {analysis.phase === "complete" && (
          <div className="mt-4">
            <button onClick={analysis.reset}
              className="px-5 py-2.5 rounded-lg font-mono text-sm font-bold transition-all hover:brightness-125 hover:scale-105 active:scale-95"
              style={{ backgroundColor: COLORS.cyan + "15", color: COLORS.cyan, border: `1px solid ${COLORS.cyan}40` }}>
              ↻ Scan Again
            </button>
          </div>
        )}
      </section>

      {/* Typing input */}
      {analysis.phase !== "complete" && (
        <div className="max-w-md mx-auto mb-6">
          <input type="text"
            placeholder={analysis.phase === "idle" ? "Type anything to begin..." : "Keep typing for keystroke analysis..."}
            className="w-full px-4 py-2.5 rounded-lg font-mono text-sm bg-transparent border text-center focus:outline-none transition-colors"
            style={{ borderColor: COLORS.magenta + "30", color: COLORS.magenta }}
            onFocus={(e) => (e.target.style.borderColor = COLORS.magenta)}
            onBlur={(e) => (e.target.style.borderColor = COLORS.magenta + "30")}
          />
        </div>
      )}

      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-6 mb-8">
        <div className="flex flex-col gap-3 order-2 md:order-1">
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
        <div className="flex flex-col gap-6 mb-8">
          <ShareCard score={analysis.overallScore} channelScores={analysis.scores} signalData={analysis.signalData} />
          <BotComparison humanData={analysis.displayBuffers} />
        </div>
      )}

      {/* Feature cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        {[
          { icon: "◎", title: "5+ Signal Channels", desc: "Pointer dynamics, scroll entropy, keystroke rhythm, micro-tremor, and cross-channel coherence — all captured passively.", color: COLORS.cyan },
          { icon: "◈", title: "Cross-Channel Coherence", desc: "Individual signals can be faked. The physiological correlation between ALL channels simultaneously cannot.", color: COLORS.green },
          { icon: "⟐", title: "Verify Once, Use Everywhere", desc: "Your Human Token works across all HumanSign-enabled services. Never solve another CAPTCHA again.", color: COLORS.violet },
        ].map((card) => (
          <div key={card.title} className="rounded-lg border p-5 transition-all hover:brightness-110" style={{ backgroundColor: "#0C1018", borderColor: "#1A2030" }}>
            <span className="text-2xl mb-2 block" style={{ color: card.color }}>{card.icon}</span>
            <h3 className="font-display font-bold text-sm mb-1 text-cyber-text">{card.title}</h3>
            <p className="text-xs font-mono text-cyber-muted leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      {analysis.phase === "complete" && (
        <section className="text-center mb-12">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="https://github.com/AreYouHuman/sdk" target="_blank" rel="noopener noreferrer"
              onClick={() => trackEvent("cta_sdk")}
              className="px-6 py-3 rounded-lg font-mono text-sm font-bold transition-all hover:brightness-125"
              style={{ backgroundColor: COLORS.cyan + "20", color: COLORS.cyan, border: `1px solid ${COLORS.cyan}40` }}>
              Get the SDK →
            </a>
            <a href="https://humansignprotocol.org" target="_blank" rel="noopener noreferrer"
              onClick={() => trackEvent("cta_protocol")}
              className="px-6 py-3 rounded-lg font-mono text-sm font-bold transition-all hover:brightness-125"
              style={{ backgroundColor: "#1A2030", color: "#E0E8F0", border: "1px solid #2A3040" }}>
              Read the Protocol
            </a>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="text-center py-6 border-t" style={{ borderColor: "#1A2030" }}>
        <p className="text-[11px] font-mono text-cyber-muted">© 2026 HumanSign Protocol — Proving humanity through behavioral micro-signals</p>
      </footer>
    </main>
  );
}
