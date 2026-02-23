"use client";

import React from "react";
import { ChannelScores } from "@/lib/signals";
import { COLORS } from "@/lib/constants";
import { AnalysisPhase } from "@/hooks/useAnalysis";

const CH_COLORS = [COLORS.cyan, COLORS.green, COLORS.magenta, COLORS.amber, COLORS.violet];

export default function CoherenceRing({ score, phase, elapsed }: {
  score: number; channelScores: ChannelScores; phase: AnalysisPhase; elapsed: number;
}) {
  const size = 220, cx = size / 2, cy = size / 2, baseR = 85, segs = 60;
  const time = elapsed / 1000;

  const points = Array.from({ length: segs }, (_, i) => {
    const angle = (i / segs) * Math.PI * 2 - Math.PI / 2;
    const ci = Math.floor((i / segs) * 5);
    const amp = score * 8;
    const wave = Math.sin(angle * 3 + time * 2 + ci) * amp + Math.cos(angle * 5 - time * 1.5) * amp * 0.5;
    const r = baseR + wave;
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r, color: CH_COLORS[ci] };
  });

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + " Z";
  const pulseR = 30 + Math.sin(time * 2) * 5 * score;
  const displayScore = Math.round(score * 100);

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <radialGradient id="rg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={COLORS.cyan} stopOpacity={0.15 * score} />
            <stop offset="100%" stopColor={COLORS.cyan} stopOpacity={0} />
          </radialGradient>
          <filter id="rb"><feGaussianBlur stdDeviation="3" /></filter>
        </defs>

        <circle cx={cx} cy={cy} r={baseR + 20} fill="url(#rg)" />
        <path d={pathD} fill="none" stroke={COLORS.cyan} strokeWidth={4} strokeOpacity={0.2} filter="url(#rb)" />
        <path d={pathD} fill="none" stroke={COLORS.cyan} strokeWidth={2} strokeOpacity={0.3 + score * 0.7} />

        {points.map((p, i) => {
          const next = points[(i + 1) % segs];
          return <line key={i} x1={p.x.toFixed(1)} y1={p.y.toFixed(1)} x2={next.x.toFixed(1)} y2={next.y.toFixed(1)} stroke={p.color} strokeWidth={2} strokeOpacity={0.4 + score * 0.6} />;
        })}

        <circle cx={cx} cy={cy} r={pulseR} fill={COLORS.cyan} fillOpacity={0.05 + score * 0.1} stroke={COLORS.cyan} strokeWidth={1} strokeOpacity={0.2} />

        <text x={cx} y={cy - 8} textAnchor="middle" fill={COLORS.cyan} fontSize="36" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
          {displayScore}<tspan fontSize="16" fillOpacity={0.7}>%</tspan>
        </text>
        <text x={cx} y={cy + 18} textAnchor="middle" fill={COLORS.cyan} fontSize="10" fontFamily="JetBrains Mono, monospace" letterSpacing="3" fillOpacity={0.6}>
          HUMAN
        </text>
      </svg>

      {phase === "complete" && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-full font-mono text-sm font-bold"
          style={{ backgroundColor: COLORS.green + "15", color: COLORS.green, border: `1px solid ${COLORS.green}40` }}>
          <span className="text-lg">✓</span> HUMAN VERIFIED
        </div>
      )}
    </div>
  );
}
