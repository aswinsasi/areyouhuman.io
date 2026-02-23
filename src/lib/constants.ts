export const COLORS = {
  cyan: "#00F0FF",
  green: "#00FF88",
  magenta: "#FF00AA",
  amber: "#FFAA00",
  violet: "#AA66FF",
} as const;

export const CHANNELS = [
  { key: "pointer", label: "Pointer Dynamics", icon: "◎", color: COLORS.cyan },
  { key: "scroll", label: "Scroll Entropy", icon: "≡", color: COLORS.green },
  { key: "keystroke", label: "Keystroke Rhythm", icon: "⌨", color: COLORS.magenta },
  { key: "tremor", label: "Micro-Tremor", icon: "∿", color: COLORS.amber },
  { key: "coherence", label: "Temporal Coherence", icon: "◈", color: COLORS.violet },
] as const;

export type ChannelKey = (typeof CHANNELS)[number]["key"];

export const ANALYSIS_DURATION_MS = 8000;
export const DISPLAY_BUFFER_SIZE = 120;
export const POINTER_BUFFER_SIZE = 300;
export const SCROLL_BUFFER_SIZE = 200;
export const KEY_BUFFER_SIZE = 100;
export const MOTION_BUFFER_SIZE = 200;

export const STATUS_MESSAGES = [
  "Initializing sensors...",
  "Capturing pointer dynamics...",
  "Analyzing scroll patterns...",
  "Measuring keystroke rhythm...",
  "Detecting micro-tremor...",
  "Computing cross-channel coherence...",
  "Finalizing behavioral signature...",
];
