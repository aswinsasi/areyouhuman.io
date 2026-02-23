import { PointerSample, ScrollSample, KeystrokeSample, MotionSample } from "./signals";

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

// ===================================================================
// INSTANTANEOUS readings from last few samples. These fluctuate
// naturally between frames, creating visible waveform oscillation.
// WaveformDisplay auto-scales, so even small variations look good.
// Values capped at 0.85 to prevent flat-top saturation.
// ===================================================================

// Channel 1: Pointer Dynamics
// Instantaneous speed + acceleration from last few pointer moves
export function pointerJitter(samples: PointerSample[]): number {
  if (samples.length < 4) return 0;
  const r = samples.slice(-6);
  
  let speed = 0, accel = 0;
  const speeds: number[] = [];
  for (let i = 1; i < r.length; i++) {
    const dx = r[i].x - r[i - 1].x, dy = r[i].y - r[i - 1].y;
    const s = Math.sqrt(dx * dx + dy * dy);
    speeds.push(s);
    speed += s;
  }
  speed /= speeds.length;
  
  for (let i = 1; i < speeds.length; i++) {
    accel += Math.abs(speeds[i] - speeds[i - 1]);
  }
  accel /= Math.max(speeds.length - 1, 1);

  // Speed 0-20px/frame -> 0-0.4, accel 0-10 -> 0-0.45
  return clamp(speed * 0.02 + accel * 0.045, 0, 0.85);
}

// Channel 2: Scroll Entropy
// Instantaneous scroll speed variation
export function scrollEntropy(samples: ScrollSample[]): number {
  if (samples.length < 3) return 0;
  const r = samples.slice(-6);
  const speeds: number[] = [];
  for (let i = 1; i < r.length; i++) {
    const dt = r[i].t - r[i - 1].t;
    if (dt > 0) speeds.push(Math.abs(r[i].y - r[i - 1].y) / dt);
  }
  if (speeds.length < 2) return 0;
  
  const mean = speeds.reduce((a, b) => a + b, 0) / speeds.length;
  const latest = speeds[speeds.length - 1];
  // How different is current speed from average?
  const deviation = mean > 0.001 ? Math.abs(latest - mean) / mean : 0;
  
  // Also overall spread
  const max = Math.max(...speeds), min = Math.min(...speeds);
  const spread = max > 0 ? (max - min) / max : 0;
  
  return clamp(deviation * 0.3 + spread * 0.4 + (mean > 0 ? 0.1 : 0), 0, 0.85);
}

// Channel 3: Keystroke Rhythm
// How irregular is the latest key timing vs the rhythm?
export function keystrokeRhythm(samples: KeystrokeSample[]): number {
  if (samples.length < 3) return 0;
  const r = samples.slice(-8);
  const intervals: number[] = [];
  for (let i = 1; i < r.length; i++) intervals.push(r[i].t - r[i - 1].t);
  if (intervals.length < 2) return 0;
  
  const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  if (mean === 0) return 0;
  
  // Latest interval deviation from mean
  const latest = intervals[intervals.length - 1];
  const deviation = Math.abs(latest - mean) / mean;
  
  // Overall CV
  const std = Math.sqrt(intervals.reduce((a, b) => a + (b - mean) ** 2, 0) / intervals.length);
  const cv = std / mean;
  
  return clamp(deviation * 0.3 + cv * 0.4, 0, 0.85);
}

// Channel 4: Micro-Tremor (desktop)
// Frame-to-frame displacement jitter
export function microTremor(samples: PointerSample[]): number {
  const r = samples.slice(-10);
  if (r.length < 4) return 0;
  
  const disps: number[] = [];
  for (let i = 1; i < r.length; i++) {
    const dx = r[i].x - r[i - 1].x, dy = r[i].y - r[i - 1].y;
    disps.push(Math.sqrt(dx * dx + dy * dy));
  }
  
  const mean = disps.reduce((a, b) => a + b, 0) / disps.length;
  const variance = disps.reduce((a, b) => a + (b - mean) ** 2, 0) / disps.length;
  
  // Direction reversals
  let reversals = 0;
  for (let i = 2; i < disps.length; i++) {
    if ((disps[i] - disps[i-1]) * (disps[i-1] - disps[i-2]) < 0) reversals++;
  }
  const osc = disps.length > 2 ? reversals / (disps.length - 2) : 0;
  
  return clamp(Math.sqrt(variance) * 0.08 + osc * 0.4, 0, 0.85);
}

// Channel 4 (mobile)
export function mobileTremor(samples: MotionSample[]): number {
  if (samples.length < 20) return 0;
  const r = samples.slice(-20);
  const mags = r.map(s => Math.sqrt(s.ax * s.ax + s.ay * s.ay + s.az * s.az));
  const mean = mags.reduce((a, b) => a + b, 0) / mags.length;
  const variance = mags.reduce((a, b) => a + (b - mean) ** 2, 0) / mags.length;
  return clamp(Math.sqrt(variance) * 3, 0, 0.85);
}

// Channel 5: Cross-Channel Coherence
function pearson(x: number[], y: number[]): number {
  const n = x.length;
  if (n < 3) return 0;
  const mx = x.reduce((a, b) => a + b, 0) / n;
  const my = y.reduce((a, b) => a + b, 0) / n;
  let num = 0, dx2 = 0, dy2 = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - mx, dy = y[i] - my;
    num += dx * dy; dx2 += dx * dx; dy2 += dy * dy;
  }
  const d = Math.sqrt(dx2 * dy2);
  return d === 0 ? 0 : num / d;
}

export function crossChannelCoherence(channels: {
  pointer: number[]; scroll: number[]; keystroke: number[]; tremor: number[];
}): number {
  const all = [channels.pointer, channels.scroll, channels.keystroke, channels.tremor];
  const active = all.filter(ch => ch.length > 5);
  if (active.length < 2) return 0;
  let total = 0, pairs = 0;
  for (let i = 0; i < active.length; i++) {
    for (let j = i + 1; j < active.length; j++) {
      const len = Math.min(active[i].length, active[j].length, 30);
      if (len < 3) continue;
      total += Math.abs(pearson(active[i].slice(-len), active[j].slice(-len)));
      pairs++;
    }
  }
  return pairs === 0 ? 0 : clamp((total / pairs) * 0.8, 0, 0.85);
}

// Overall score
export function humanScore(
  scores: Record<string, number>, coherence: number, elapsedMs: number
): number {
  const vals = Object.values(scores).filter(v => v > 0.01);
  const avg = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  const time = clamp(elapsedMs / 8000, 0, 1);
  const bonus = clamp(vals.length * 0.06, 0, 0.2);
  return clamp(avg * 0.4 + coherence * 0.25 + time * 0.15 + bonus, 0, 0.99);
}
