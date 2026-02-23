export interface PointerSample { x: number; y: number; t: number; pressure: number; }
export interface ScrollSample { y: number; t: number; }
export interface KeystrokeSample { t: number; }
export interface MotionSample { ax: number; ay: number; az: number; gx: number; gy: number; gz: number; t: number; }

export class RingBuffer<T> {
  private buf: T[] = [];
  constructor(private maxSize: number) {}
  push(item: T): void {
    this.buf.push(item);
    if (this.buf.length > this.maxSize) this.buf.shift();
  }
  get data(): T[] { return this.buf; }
  get length(): number { return this.buf.length; }
  slice(start?: number, end?: number): T[] { return this.buf.slice(start, end); }
  clear(): void { this.buf = []; }
}

export interface ChannelScores {
  pointer: number; scroll: number; keystroke: number; tremor: number; coherence: number;
}

export interface DisplayBuffers {
  pointer: number[]; scroll: number[]; keystroke: number[]; tremor: number[]; coherence: number[];
}

export function emptyScores(): ChannelScores {
  return { pointer: 0, scroll: 0, keystroke: 0, tremor: 0, coherence: 0 };
}

export function emptyBuffers(): DisplayBuffers {
  return { pointer: [], scroll: [], keystroke: [], tremor: [], coherence: [] };
}
