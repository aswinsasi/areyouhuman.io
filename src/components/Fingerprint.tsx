"use client";

import React from "react";
import { COLORS } from "@/lib/constants";

const CH_COLORS = [COLORS.cyan, COLORS.green, COLORS.magenta, COLORS.amber, COLORS.violet];

export default function Fingerprint({ signalData, elapsed, size = 180 }: {
  signalData: number[][]; elapsed: number; size?: number;
}) {
  const cx = size / 2, cy = size / 2, phase = elapsed / 1000, n = 64;

  const layers = CH_COLORS.map((color, li) => {
    const baseR = 20 + li * 14;
    const data = signalData[li] || [];
    const pts: string[] = [];
    for (let i = 0; i < n; i++) {
      const angle = (i / n) * Math.PI * 2;
      const di = Math.floor((i / n) * Math.max(data.length, 1));
      const val = data[di] || 0;
      const r = baseR + val * 10 + Math.sin(angle * 3 + phase * 0.8 + li * 1.2) * 2;
      pts.push(`${(cx + Math.cos(angle) * r).toFixed(1)},${(cy + Math.sin(angle) * r).toFixed(1)}`);
    }
    return { color, points: pts.join(" "), hasData: data.length > 5 };
  });

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-[10px] font-mono tracking-widest" style={{ color: COLORS.cyan + "80" }}>
        BEHAVIORAL FINGERPRINT
      </div>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs><filter id="fpg"><feGaussianBlur stdDeviation="2" /></filter></defs>
        {layers.map((l, i) => (
          <React.Fragment key={i}>
            <polygon points={l.points} fill="none" stroke={l.color} strokeWidth={2} strokeOpacity={l.hasData ? 0.15 : 0.05} filter="url(#fpg)" />
            <polygon points={l.points} fill={l.color} fillOpacity={l.hasData ? 0.03 : 0.01} stroke={l.color} strokeWidth={l.hasData ? 1.5 : 0.5} strokeOpacity={l.hasData ? 0.8 : 0.15} />
          </React.Fragment>
        ))}
        <circle cx={cx} cy={cy} r={3} fill={COLORS.cyan} fillOpacity={0.6} />
      </svg>
    </div>
  );
}
