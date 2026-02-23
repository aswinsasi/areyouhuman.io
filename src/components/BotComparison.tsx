"use client";

import React, { useState } from "react";
import { COLORS } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";

function MiniWave({ data, color, label, isBot }: { data: number[]; color: string; label: string; isBot?: boolean }) {
  const w = 200, h = 32;
  let pathD = "";
  if (data.length > 1) {
    const step = w / (data.length - 1);
    pathD = data.map((v, i) => {
      const x = i * step, y = h - v * h * 0.8 - h * 0.1;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
  }
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-mono" style={{ color: color + "80" }}>{label}</span>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: h }}>
        <line x1={0} y1={h / 2} x2={w} y2={h / 2} stroke={color} strokeOpacity={0.08} />
        {pathD && <path d={pathD} fill="none" stroke={color} strokeWidth={isBot ? 1 : 1.5} strokeOpacity={isBot ? 0.5 : 0.9} />}
      </svg>
    </div>
  );
}

export default function BotComparison({ humanData }: { humanData: { pointer: number[]; scroll: number[]; keystroke: number[] } }) {
  const [visible, setVisible] = useState(false);
  const botData = Array.from({ length: 60 }, (_, i) => 0.5 + Math.sin(i * 0.15) * 0.3);

  return (
    <div className="w-full">
      <button onClick={() => { if (!visible) trackEvent("bot_comparison_viewed"); setVisible(!visible); }}
        className="w-full py-3 px-4 rounded-lg font-mono text-sm transition-all border"
        style={{ backgroundColor: visible ? "#0C1018" : "transparent", borderColor: COLORS.amber + "40", color: COLORS.amber }}>
        {visible ? "▾" : "▸"} Compare with Bot Signals
      </button>
      {visible && (
        <div className="mt-3 rounded-lg border p-4" style={{ backgroundColor: "#0C1018", borderColor: "#1A2030" }}>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-xs font-mono font-bold mb-3 flex items-center gap-2" style={{ color: COLORS.green }}>
                <span className="w-2 h-2 rounded-full bg-current animate-pulse" /> YOUR SIGNALS
              </div>
              <div className="flex flex-col gap-3">
                <MiniWave data={humanData.pointer.slice(-60)} color={COLORS.cyan} label="Pointer" />
                <MiniWave data={humanData.scroll.slice(-60)} color={COLORS.green} label="Scroll" />
                <MiniWave data={humanData.keystroke.slice(-60)} color={COLORS.magenta} label="Keystroke" />
              </div>
            </div>
            <div>
              <div className="text-xs font-mono font-bold mb-3 flex items-center gap-2" style={{ color: COLORS.magenta + "80" }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.magenta + "60" }} /> SYNTHETIC BOT
              </div>
              <div className="flex flex-col gap-3">
                <MiniWave data={botData} color={COLORS.cyan} label="Pointer" isBot />
                <MiniWave data={botData} color={COLORS.green} label="Scroll" isBot />
                <MiniWave data={botData} color={COLORS.magenta} label="Keystroke" isBot />
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 text-xs font-mono leading-relaxed" style={{ borderTop: "1px solid #1A2030", color: "#667788" }}>
            Human signals show natural variance, micro-corrections, and cross-channel coherence from involuntary neuromotor activity. Bot signals are either too smooth (scripted) or too random (noise injection).
          </div>
        </div>
      )}
    </div>
  );
}
