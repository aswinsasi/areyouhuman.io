"use client";

import React from "react";

interface Props {
  data: number[];
  color: string;
  label: string;
  icon: string;
  score: number;
  height?: number;
}

export default function WaveformDisplay({ data, color, label, icon, score, height = 48 }: Props) {
  const hasData = data.length > 2;
  const active = hasData && score > 0.005;
  const w = 240;

  // FIX: SVG IDs cannot have spaces — url(#wg-Pointer Dynamics) breaks!
  const safeId = label.replace(/\s+/g, "-");

  let pathD = "";
  if (data.length > 1) {
    const step = w / (data.length - 1);
    pathD = data.map((v, i) => {
      const x = i * step;
      const normalized = Math.min(v / 0.85, 1);
      const y = height * 0.95 - normalized * height * 0.9;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
  }

  return (
    <div className="relative rounded-lg border p-3 transition-all duration-300" style={{
      backgroundColor: "#0C1018",
      borderColor: active ? color + "40" : "#1A2030",
      borderLeftColor: active ? color : "#1A2030",
      borderLeftWidth: 3,
    }}>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-lg" style={{ color }}>{icon}</span>
          <span className="text-xs font-mono text-cyber-muted">{label}</span>
          {active && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded animate-pulse"
              style={{ backgroundColor: color + "20", color }}>LIVE</span>
          )}
        </div>
        <span className="text-sm font-mono font-bold" style={{ color: active ? color : "#334" }}>
          {(score * 100).toFixed(0)}%
        </span>
      </div>

      <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none">
        <defs>
          <linearGradient id={`wg-${safeId}`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor={color} stopOpacity={0} />
            <stop offset="20%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={1} />
          </linearGradient>
          <filter id={`wgl-${safeId}`}>
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <line x1="0" y1={height * 0.25} x2={w} y2={height * 0.25} stroke={color} strokeOpacity={0.05} />
        <line x1="0" y1={height * 0.5} x2={w} y2={height * 0.5} stroke={color} strokeOpacity={0.08} strokeDasharray="4 4" />
        <line x1="0" y1={height * 0.75} x2={w} y2={height * 0.75} stroke={color} strokeOpacity={0.05} />

        {pathD && (
          <path d={pathD} fill="none"
            stroke={active ? `url(#wg-${safeId})` : color}
            strokeWidth={active ? 2 : 1}
            strokeOpacity={active ? 1 : 0.3}
            filter={active ? `url(#wgl-${safeId})` : undefined}
            strokeLinejoin="round"
          />
        )}
      </svg>
    </div>
  );
}
