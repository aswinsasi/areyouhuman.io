"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { COLORS } from "@/lib/constants";

type TaskType = "path-trace" | "rhythm-tap" | "hold-steady";
type Phase = "select" | "running" | "complete";

interface Point { x: number; y: number; t: number; }
interface TaskResult { taskType: TaskType; score: number; duration: number; accuracy: number; }

export default function MicroTask() {
  const [task, setTask] = useState<TaskType | null>(null);
  const [phase, setPhase] = useState<Phase>("select");
  const [result, setResult] = useState<TaskResult | null>(null);

  const startTask = (t: TaskType) => { setTask(t); setPhase("running"); setResult(null); };
  const completeTask = (r: TaskResult) => { setResult(r); setPhase("complete"); };
  const reset = () => { setTask(null); setPhase("select"); setResult(null); };

  return (
    <main className="relative z-10 max-w-3xl mx-auto px-4 py-6">
      <header className="flex items-center justify-between mb-8">
        <a href="/" className="flex items-center gap-3 hover:brightness-125 transition-all">
          <span className="text-2xl" style={{ color: COLORS.cyan }}>◉</span>
          <span className="font-display text-lg font-bold tracking-tight text-cyber-text">AREYOUHUMAN</span>
        </a>
        <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ backgroundColor: COLORS.magenta + "15", color: COLORS.magenta }}>High Security</span>
      </header>

      <div className="text-center mb-6">
        <h1 className="font-display text-3xl font-bold mb-2">Active <span style={{ color: COLORS.magenta }}>Micro-Tasks</span></h1>
        <p className="text-xs font-mono" style={{ color: "#667788" }}>High-security verification through interactive challenges. 3 seconds of fun, not friction.</p>
      </div>

      {phase === "select" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {([
            { type: "path-trace" as TaskType, icon: "◎", title: "Path Trace", desc: "Trace the glowing path with your pointer. Tests motor planning, precision, and micro-corrections.", color: COLORS.cyan },
            { type: "rhythm-tap" as TaskType, icon: "◈", title: "Rhythm Tap", desc: "Tap the beats as they pulse. Tests timing precision, reaction speed, and rhythmic consistency.", color: COLORS.green },
            { type: "hold-steady" as TaskType, icon: "⟐", title: "Hold Steady", desc: "Keep the cursor inside the target zone. Tests involuntary micro-tremor and physiological stability.", color: COLORS.amber },
          ]).map((t) => (
            <button key={t.type} onClick={() => startTask(t.type)}
              className="rounded-lg border p-5 text-left transition-all hover:brightness-125 hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: "#0C1018", borderColor: t.color + "30" }}>
              <span className="text-3xl block mb-2" style={{ color: t.color }}>{t.icon}</span>
              <h3 className="font-display font-bold text-sm mb-1 text-cyber-text">{t.title}</h3>
              <p className="text-[10px] font-mono leading-relaxed" style={{ color: "#667788" }}>{t.desc}</p>
            </button>
          ))}
        </div>
      )}

      {phase === "running" && task === "path-trace" && <PathTrace onComplete={completeTask} />}
      {phase === "running" && task === "rhythm-tap" && <RhythmTap onComplete={completeTask} />}
      {phase === "running" && task === "hold-steady" && <HoldSteady onComplete={completeTask} />}

      {phase === "complete" && result && (
        <div className="text-center animate-fade-in">
          <div className="rounded-lg border p-8 mb-6" style={{ backgroundColor: "#0C1018", borderColor: result.score > 0.7 ? COLORS.green + "30" : "#FF666630" }}>
            <div className="text-4xl mb-2">{result.score > 0.7 ? "✓" : "⚠"}</div>
            <div className="font-display text-2xl font-bold mb-1" style={{ color: result.score > 0.7 ? COLORS.green : "#FF6666" }}>
              {result.score > 0.7 ? "Human Confirmed" : "Try Again"}
            </div>
            <div className="text-xs font-mono mt-3" style={{ color: "#667788" }}>
              Score: <span style={{ color: COLORS.cyan }}>{Math.round(result.score * 100)}%</span> · Accuracy: <span style={{ color: COLORS.green }}>{Math.round(result.accuracy * 100)}%</span> · Duration: <span style={{ color: COLORS.amber }}>{(result.duration / 1000).toFixed(1)}s</span>
            </div>
          </div>
          <div className="flex justify-center gap-3">
            <button onClick={reset} className="px-5 py-2.5 rounded-lg font-mono text-sm font-bold transition-all hover:brightness-125"
              style={{ backgroundColor: COLORS.cyan + "15", color: COLORS.cyan, border: `1px solid ${COLORS.cyan}40` }}>Try Another Task</button>
            <a href="/" className="px-5 py-2.5 rounded-lg font-mono text-sm font-bold transition-all hover:brightness-125"
              style={{ backgroundColor: "#1A2030", color: "#E0E8F0", border: "1px solid #2A3040" }}>← Home</a>
          </div>
        </div>
      )}
    </main>
  );
}

// ===================== PATH TRACE =====================
function PathTrace({ onComplete }: { onComplete: (r: TaskResult) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const points = useRef<Point[]>([]);
  const pathRef = useRef<{ x: number; y: number }[]>([]);
  const startTime = useRef(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const w = canvas.width = canvas.offsetWidth * 2; const h = canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    // Generate smooth path
    const path: { x: number; y: number }[] = [];
    const cw = canvas.offsetWidth; const ch = canvas.offsetHeight;
    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      path.push({ x: cw * 0.15 + t * cw * 0.7 + Math.sin(t * Math.PI * 3) * 40, y: ch * 0.5 + Math.cos(t * Math.PI * 2.5) * (ch * 0.25) });
    }
    pathRef.current = path;
    // Draw path
    ctx.strokeStyle = COLORS.cyan + "30"; ctx.lineWidth = 20; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); path.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)); ctx.stroke();
    // Draw dots
    ctx.fillStyle = COLORS.cyan + "60";
    for (let i = 0; i < path.length; i += 6) { ctx.beginPath(); ctx.arc(path[i].x, path[i].y, 4, 0, Math.PI * 2); ctx.fill(); }
    // Start dot
    ctx.fillStyle = COLORS.green; ctx.beginPath(); ctx.arc(path[0].x, path[0].y, 8, 0, Math.PI * 2); ctx.fill();
    startTime.current = performance.now();
  }, []);

  const handleMove = useCallback((e: React.PointerEvent) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left; const y = e.clientY - rect.top;
    points.current.push({ x, y, t: performance.now() });
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    ctx.fillStyle = COLORS.green + "80"; ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
    const prog = Math.min(points.current.length / 80, 1); setProgress(prog);
    if (prog >= 1) {
      const path = pathRef.current;
      let totalDist = 0;
      for (const p of points.current) {
        let minD = Infinity;
        for (const pp of path) { const d = Math.sqrt((p.x - pp.x) ** 2 + (p.y - pp.y) ** 2); if (d < minD) minD = d; }
        totalDist += minD;
      }
      const avgDist = totalDist / points.current.length;
      const accuracy = Math.max(0, 1 - avgDist / 60);
      const duration = performance.now() - startTime.current;
      const score = accuracy * 0.7 + Math.min(1, 3000 / duration) * 0.3;
      onComplete({ taskType: "path-trace", score: Math.min(score, 0.99), duration, accuracy });
    }
  }, [onComplete]);

  return (
    <div className="animate-fade-in">
      <div className="text-center text-xs font-mono mb-3" style={{ color: COLORS.cyan }}>Trace the glowing path from start to end</div>
      <div className="h-1 rounded-full mb-3" style={{ backgroundColor: "#1A2030" }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${progress * 100}%`, background: `linear-gradient(90deg, ${COLORS.cyan}, ${COLORS.green})` }} />
      </div>
      <canvas ref={canvasRef} onPointerMove={handleMove} className="w-full rounded-lg border cursor-crosshair"
        style={{ height: 300, backgroundColor: "#0C1018", borderColor: COLORS.cyan + "20", touchAction: "none" }} />
    </div>
  );
}

// ===================== RHYTHM TAP =====================
function RhythmTap({ onComplete }: { onComplete: (r: TaskResult) => void }) {
  const [beats, setBeats] = useState<{ time: number; hit: boolean }[]>([]);
  const [taps, setTaps] = useState<number[]>([]);
  const [currentBeat, setCurrentBeat] = useState(0);
  const startTime = useRef(performance.now());
  const pattern = useRef([0, 500, 1000, 1700, 2200, 2700, 3400, 3900]);

  useEffect(() => {
    const p = pattern.current;
    const newBeats = p.map((t) => ({ time: t, hit: false }));
    setBeats(newBeats);
    const timers = p.map((t, i) => setTimeout(() => setCurrentBeat(i), t));
    const endTimer = setTimeout(() => {
      const tapTimes = taps;
      let hits = 0;
      for (const bt of p) {
        const closest = tapTimes.reduce((best, tap) => Math.abs(tap - bt) < Math.abs(best - bt) ? tap : best, Infinity);
        if (Math.abs(closest - bt) < 200) hits++;
      }
      const accuracy = hits / p.length;
      const duration = performance.now() - startTime.current;
      onComplete({ taskType: "rhythm-tap", score: accuracy * 0.85 + 0.1, duration, accuracy });
    }, 4500);
    return () => { timers.forEach(clearTimeout); clearTimeout(endTimer); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTap = () => { taps.push(performance.now() - startTime.current); setTaps([...taps]); };

  return (
    <div className="animate-fade-in text-center">
      <div className="text-xs font-mono mb-4" style={{ color: COLORS.green }}>Tap when the circles pulse!</div>
      <div className="flex justify-center gap-3 mb-6">
        {beats.map((_, i) => (
          <div key={i} className="w-8 h-8 rounded-full border-2 transition-all duration-200"
            style={{ borderColor: i <= currentBeat ? COLORS.green : "#1A2030", backgroundColor: i === currentBeat ? COLORS.green + "40" : "transparent", transform: i === currentBeat ? "scale(1.3)" : "scale(1)" }} />
        ))}
      </div>
      <button onClick={handleTap}
        className="w-32 h-32 rounded-full font-mono text-sm font-bold transition-all hover:scale-105 active:scale-95"
        style={{ backgroundColor: COLORS.green + "15", color: COLORS.green, border: `3px solid ${COLORS.green}60` }}>
        TAP<br /><span className="text-[10px]" style={{ color: "#667788" }}>{taps.length} taps</span>
      </button>
    </div>
  );
}

// ===================== HOLD STEADY =====================
function HoldSteady({ onComplete }: { onComplete: (r: TaskResult) => void }) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [insideTime, setInsideTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const targetRef = useRef({ x: 200, y: 150 });
  const startRef = useRef(0);
  const insideRef = useRef(0);
  const frameRef = useRef(0);

  useEffect(() => {
    startRef.current = performance.now();
    const tick = () => {
      const elapsed = performance.now() - startRef.current;
      setTotalTime(elapsed);
      if (elapsed >= 4000) {
        const accuracy = insideRef.current / elapsed;
        onComplete({ taskType: "hold-steady", score: Math.min(accuracy * 1.2 + 0.1, 0.99), duration: elapsed, accuracy });
        return;
      }
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMove = (e: React.PointerEvent) => {
    const rect = (e.target as HTMLElement).closest(".task-area")?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left; const y = e.clientY - rect.top;
    setPos({ x, y });
    const dx = x - targetRef.current.x; const dy = y - targetRef.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 40) insideRef.current += 16.67;
    setInsideTime(insideRef.current);
  };

  const progress = Math.min(totalTime / 4000, 1);
  const accuracy = totalTime > 0 ? insideTime / totalTime : 0;

  return (
    <div className="animate-fade-in">
      <div className="text-center text-xs font-mono mb-3" style={{ color: COLORS.amber }}>Keep your cursor inside the target zone for 4 seconds</div>
      <div className="h-1 rounded-full mb-3" style={{ backgroundColor: "#1A2030" }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${progress * 100}%`, background: `linear-gradient(90deg, ${COLORS.amber}, ${COLORS.green})` }} />
      </div>
      <div className="task-area relative w-full rounded-lg border cursor-none"
        onPointerMove={handleMove}
        style={{ height: 300, backgroundColor: "#0C1018", borderColor: COLORS.amber + "20", touchAction: "none" }}>
        {/* Target */}
        <div className="absolute rounded-full" style={{ left: targetRef.current.x - 40, top: targetRef.current.y - 40, width: 80, height: 80, border: `2px solid ${accuracy > 0.5 ? COLORS.green : COLORS.amber}40`, backgroundColor: `${accuracy > 0.5 ? COLORS.green : COLORS.amber}08` }} />
        <div className="absolute rounded-full" style={{ left: targetRef.current.x - 4, top: targetRef.current.y - 4, width: 8, height: 8, backgroundColor: COLORS.amber }} />
        {/* Cursor */}
        {pos && <div className="absolute rounded-full" style={{ left: pos.x - 6, top: pos.y - 6, width: 12, height: 12, backgroundColor: COLORS.cyan, boxShadow: `0 0 20px ${COLORS.cyan}60` }} />}
        {/* Stats */}
        <div className="absolute bottom-3 left-3 text-[10px] font-mono" style={{ color: "#667788" }}>
          Accuracy: <span style={{ color: accuracy > 0.5 ? COLORS.green : COLORS.amber }}>{Math.round(accuracy * 100)}%</span>
        </div>
      </div>
    </div>
  );
}
