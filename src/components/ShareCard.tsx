"use client";

import React, { useRef, useCallback, useEffect } from "react";
import { ChannelScores } from "@/lib/signals";
import { COLORS, CHANNELS } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";

export default function ShareCard({ score, channelScores, signalData }: {
  score: number; channelScores: ChannelScores; signalData: number[][];
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const displayScore = Math.round(score * 100);
  const shareText = `I just proved I'm human with a ${displayScore}% coherence score across 5 behavioral channels.\n\nNo CAPTCHA. No biometrics. Just my involuntary micro-signals.\n\nTry it: areyouhuman.io\n\n#HumanSign #AreYouHuman`;

  const drawCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const W = 1200, H = 630;
    canvas.width = W; canvas.height = H;

    ctx.fillStyle = "#06080d"; ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "#00F0FF08"; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    ctx.strokeStyle = COLORS.cyan + "40"; ctx.lineWidth = 2; ctx.strokeRect(1, 1, W - 2, H - 2);

    ctx.font = "14px monospace"; ctx.fillStyle = COLORS.cyan + "80"; ctx.fillText("AREYOUHUMAN.IO", 60, 60);
    ctx.font = "bold 40px monospace"; ctx.fillStyle = "#E0E8F0"; ctx.fillText("I'm Verified Human ✓", 60, 120);
    ctx.font = "bold 120px monospace"; ctx.fillStyle = COLORS.cyan; ctx.fillText(`${displayScore}`, 60, 280);
    ctx.font = "bold 40px monospace"; ctx.fillStyle = COLORS.cyan + "80"; ctx.fillText("%", 60 + ctx.measureText(`${displayScore}`).width + 8, 280);
    ctx.font = "16px monospace"; ctx.fillStyle = "#667788"; ctx.fillText("CROSS-CHANNEL COHERENCE SCORE", 60, 310);

    const scoreValues = [channelScores.pointer, channelScores.scroll, channelScores.keystroke, channelScores.tremor, channelScores.coherence];
    CHANNELS.forEach((ch, i) => {
      const y = 350 + i * 40;
      ctx.font = "12px monospace"; ctx.fillStyle = "#667788"; ctx.fillText(ch.label.toUpperCase(), 60, y);
      ctx.fillStyle = "#1A2030"; ctx.fillRect(250, y - 12, 200, 14);
      ctx.fillStyle = ch.color; ctx.fillRect(250, y - 12, 200 * scoreValues[i], 14);
      ctx.font = "bold 12px monospace"; ctx.fillText(`${Math.round(scoreValues[i] * 100)}%`, 460, y);
    });

    // Fingerprint
    const fpCx = 850, fpCy = 280;
    [COLORS.cyan, COLORS.green, COLORS.magenta, COLORS.amber, COLORS.violet].forEach((color, li) => {
      const baseR = 50 + li * 30, data = signalData[li] || [];
      ctx.beginPath();
      for (let p = 0; p <= 64; p++) {
        const angle = (p / 64) * Math.PI * 2;
        const di = Math.floor((p / 64) * Math.max(data.length, 1));
        const r = baseR + (data[di] || 0) * 20 + Math.sin(angle * 3 + li) * 4;
        const x = fpCx + Math.cos(angle) * r, y = fpCy + Math.sin(angle) * r;
        p === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath(); ctx.strokeStyle = color + "80"; ctx.lineWidth = 1.5; ctx.stroke();
    });

    ctx.font = "12px monospace"; ctx.fillStyle = "#667788";
    ctx.fillText("HUMANSIGN PROTOCOL  •  Prove your humanity through behavioral micro-signals", 60, H - 30);
    return canvas;
  }, [displayScore, channelScores, signalData]);

  useEffect(() => { drawCard(); }, [drawCard]);

  const handleDownload = () => {
    const c = drawCard(); if (!c) return;
    const link = document.createElement("a"); link.download = `humansign-${displayScore}.png`; link.href = c.toDataURL("image/png"); link.click();
    trackEvent("share_download");
  };

  return (
    <div className="w-full rounded-lg border p-4" style={{ backgroundColor: "#0C1018", borderColor: "#1A2030" }}>
      <div className="text-xs font-mono tracking-widest mb-3" style={{ color: COLORS.cyan + "60" }}>SHARE YOUR RESULT</div>
      <canvas ref={canvasRef} className="w-full rounded border mb-4" style={{ borderColor: "#1A2030" }} />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { label: "Share on 𝕏", color: "#1DA1F2", onClick: () => { window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank"); trackEvent("share_twitter"); } },
          { label: "LinkedIn", color: "#0A66C2", onClick: () => { window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://areyouhuman.io")}`, "_blank"); trackEvent("share_linkedin"); } },
          { label: "Copy Text", color: COLORS.cyan, onClick: () => { navigator.clipboard.writeText(shareText).catch(() => {}); trackEvent("share_copy"); } },
          { label: "Save PNG", color: COLORS.green, onClick: handleDownload },
        ].map((btn) => (
          <button key={btn.label} onClick={btn.onClick}
            className="px-3 py-2.5 rounded-lg font-mono text-xs font-bold transition-all hover:brightness-125"
            style={{ backgroundColor: btn.color + "20", color: btn.color, border: `1px solid ${btn.color}30` }}>
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
