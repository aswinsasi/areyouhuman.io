// ============================================================
// SFX Engine: Cyberpunk-style synthesized sounds via Web Audio API
// No external audio files needed — everything is generated in code
// ============================================================

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return ctx;
}

// Ensure AudioContext is resumed (browsers require user gesture)
export function unlockAudio(): void {
  const c = getCtx();
  if (c && c.state === "suspended") c.resume();
}

// === Individual sound effects ===

// Short rising beep — scan started
export function sfxScanStart(): void {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(400, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(800, c.currentTime + 0.15);
  gain.gain.setValueAtTime(0.12, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.2);
  osc.connect(gain).connect(c.destination);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + 0.2);
}

// Soft tick — channel activated
export function sfxChannelTick(): void {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(1200, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(600, c.currentTime + 0.05);
  gain.gain.setValueAtTime(0.06, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.06);
  osc.connect(gain).connect(c.destination);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + 0.06);
}

// Progress ping — plays during scanning at intervals
export function sfxProgressPing(progress: number): void {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "triangle";
  // Pitch rises as progress increases
  const freq = 300 + progress * 500;
  osc.frequency.setValueAtTime(freq, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(freq * 1.2, c.currentTime + 0.04);
  gain.gain.setValueAtTime(0.04, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.08);
  osc.connect(gain).connect(c.destination);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + 0.08);
}

// Success chord — human verified
export function sfxComplete(): void {
  const c = getCtx();
  if (!c) return;
  const now = c.currentTime;
  // Three-note ascending chord
  [523, 659, 784].forEach((freq, i) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sine";
    const start = now + i * 0.08;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.1, start + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);
    osc.connect(gain).connect(c.destination);
    osc.start(start);
    osc.stop(start + 0.5);
  });
}

// Reset whoosh — scan again
export function sfxReset(): void {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(600, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, c.currentTime + 0.25);
  gain.gain.setValueAtTime(0.06, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.3);
  osc.connect(gain).connect(c.destination);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + 0.3);
}

// Share click
export function sfxClick(): void {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(800, c.currentTime);
  gain.gain.setValueAtTime(0.04, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.03);
  osc.connect(gain).connect(c.destination);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + 0.03);
}

// Mobile haptic feedback
export function haptic(style: "light" | "medium" | "heavy" = "light"): void {
  if (typeof navigator === "undefined" || !navigator.vibrate) return;
  const ms = style === "light" ? 10 : style === "medium" ? 25 : 50;
  navigator.vibrate(ms);
}

// Combined haptic + sound helpers
export function feedbackScanStart(): void { sfxScanStart(); haptic("medium"); }
export function feedbackChannelTick(): void { sfxChannelTick(); haptic("light"); }
export function feedbackComplete(): void { sfxComplete(); haptic("heavy"); }
export function feedbackReset(): void { sfxReset(); haptic("medium"); }
export function feedbackClick(): void { sfxClick(); haptic("light"); }
