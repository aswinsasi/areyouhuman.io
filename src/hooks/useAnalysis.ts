"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { SignalBuffers } from "./useSignalCapture";
import { ChannelScores, DisplayBuffers, emptyScores, emptyBuffers } from "@/lib/signals";
import { pointerJitter, scrollEntropy, keystrokeRhythm, microTremor, mobileTremor, crossChannelCoherence, humanScore, lerp, clamp } from "@/lib/math";
import { ANALYSIS_DURATION_MS, DISPLAY_BUFFER_SIZE } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import { feedbackScanStart, feedbackComplete, sfxProgressPing } from "@/lib/sfx";

export type AnalysisPhase = "idle" | "scanning" | "complete";

export interface AnalysisState {
  phase: AnalysisPhase;
  scores: ChannelScores;
  displayBuffers: DisplayBuffers;
  overallScore: number;
  elapsed: number;
  progress: number;
  signalData: number[][];
  reset: () => void;
}

function animatedWaveform(score: number, time: number, channelOffset: number, rawVal: number): number {
  if (score < 0.003) return 0;
  const amp = 0.15 + score * 0.5;
  const freq1 = 2.5 + channelOffset * 0.7;
  const freq2 = 4.1 + channelOffset * 1.1;
  const freq3 = 7.3 + channelOffset * 0.5;
  const wave = Math.sin(time * freq1) * 0.5
    + Math.sin(time * freq2 + channelOffset) * 0.3
    + Math.sin(time * freq3 + channelOffset * 2) * 0.2;
  const rawSpike = rawVal * 2;
  const center = 0.2 + score * 0.4;
  return clamp(center + wave * amp * 0.4 + rawSpike * 0.15, 0.03, 0.95);
}

export function useAnalysis(buffers: SignalBuffers): AnalysisState {
  const [phase, setPhase] = useState<AnalysisPhase>("idle");
  const [scores, setScores] = useState<ChannelScores>(emptyScores());
  const [displayBuffers, setDisplayBuffers] = useState<DisplayBuffers>(emptyBuffers());
  const [overallScore, setOverallScore] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [signalData, setSignalData] = useState<number[][]>([[], [], [], [], []]);

  const startTimeRef = useRef(0);
  const rafRef = useRef(0);
  const smRef = useRef<ChannelScores>(emptyScores());
  const dbRef = useRef<DisplayBuffers>(emptyBuffers());
  const sdRef = useRef<number[][]>([[], [], [], [], []]);
  const startedRef = useRef(false);
  const phaseRef = useRef<AnalysisPhase>("idle");
  const frameRef = useRef(0);
  const lastPingRef = useRef(0); // for progress sound spacing

  const pushBuf = (arr: number[], val: number) => {
    arr.push(val);
    if (arr.length > DISPLAY_BUFFER_SIZE) arr.shift();
  };

  const tick = useCallback(() => {
    if (phaseRef.current === "complete") return;

    const now = performance.now();

    // Auto-start
    if (phaseRef.current === "idle") {
      if (buffers.pointer.length > 3 || buffers.scroll.length > 2 || buffers.keystroke.length > 2) {
        if (!startedRef.current) {
          startedRef.current = true;
          startTimeRef.current = now;
          phaseRef.current = "scanning";
          setPhase("scanning");
          trackEvent("analysis_started");
          feedbackScanStart();
        }
      }
    }

    if (phaseRef.current !== "scanning") {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }

    const el = now - startTimeRef.current;
    const time = el / 1000;
    frameRef.current++;

    // Raw values
    const pRaw = pointerJitter(buffers.pointer.slice(-60));
    const sRaw = scrollEntropy(buffers.scroll.slice(-30));
    const kRaw = keystrokeRhythm(buffers.keystroke.slice(-20));
    const mRaw = buffers.motion.length > 20
      ? mobileTremor(buffers.motion.slice(-40))
      : microTremor(buffers.pointer.slice(-20));

    // EMA scores
    const sm = smRef.current;
    sm.pointer = lerp(sm.pointer, pRaw, 0.12);
    sm.scroll = lerp(sm.scroll, sRaw, 0.12);
    sm.keystroke = lerp(sm.keystroke, kRaw, 0.15);
    sm.tremor = lerp(sm.tremor, mRaw, 0.12);

    // Animated display buffers
    const db = dbRef.current;
    pushBuf(db.pointer, animatedWaveform(sm.pointer, time, 0, pRaw));
    pushBuf(db.scroll, animatedWaveform(sm.scroll, time, 1.5, sRaw));
    pushBuf(db.keystroke, animatedWaveform(sm.keystroke, time, 3.0, kRaw));
    pushBuf(db.tremor, animatedWaveform(sm.tremor, time, 4.5, mRaw));

    // Coherence
    const coh = crossChannelCoherence({
      pointer: db.pointer, scroll: db.scroll,
      keystroke: db.keystroke, tremor: db.tremor,
    });
    sm.coherence = lerp(sm.coherence, coh, 0.1);
    pushBuf(db.coherence, animatedWaveform(sm.coherence, time, 6.0, coh));

    // Signal data
    const sd = sdRef.current;
    pushBuf(sd[0], sm.pointer);
    pushBuf(sd[1], sm.scroll);
    pushBuf(sd[2], sm.keystroke);
    pushBuf(sd[3], sm.tremor);
    pushBuf(sd[4], sm.coherence);

    const progress = clamp(el / ANALYSIS_DURATION_MS, 0, 1);
    const overall = humanScore(
      { pointer: sm.pointer, scroll: sm.scroll, keystroke: sm.keystroke, tremor: sm.tremor },
      sm.coherence, el
    );

    // Progress ping every 15% (plays at ~15%, 30%, 45%, 60%, 75%, 90%)
    const pingStep = Math.floor(progress / 0.15);
    if (pingStep > lastPingRef.current && pingStep < 7) {
      lastPingRef.current = pingStep;
      sfxProgressPing(progress);
    }

    // Throttle React updates
    if (frameRef.current % 3 === 0) {
      setScores({ ...sm });
      setDisplayBuffers({
        pointer: [...db.pointer], scroll: [...db.scroll],
        keystroke: [...db.keystroke], tremor: [...db.tremor], coherence: [...db.coherence],
      });
      setOverallScore(overall);
      setElapsed(el);
      setSignalData(sd.map((a) => [...a]));
    }

    if (el >= ANALYSIS_DURATION_MS) {
      phaseRef.current = "complete";
      setPhase("complete");
      setScores({ ...sm });
      setOverallScore(overall);
      setElapsed(el);
      setDisplayBuffers({
        pointer: [...db.pointer], scroll: [...db.scroll],
        keystroke: [...db.keystroke], tremor: [...db.tremor], coherence: [...db.coherence],
      });
      setSignalData(sd.map((a) => [...a]));
      trackEvent("analysis_completed", { score: Math.round(overall * 100) });
      feedbackComplete();
      return;
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [buffers]);

  const reset = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    buffers.pointer.clear();
    buffers.scroll.clear();
    buffers.keystroke.clear();
    buffers.motion.clear();
    startTimeRef.current = 0;
    smRef.current = emptyScores();
    dbRef.current = emptyBuffers();
    sdRef.current = [[], [], [], [], []];
    startedRef.current = false;
    phaseRef.current = "idle";
    frameRef.current = 0;
    lastPingRef.current = 0;
    setPhase("idle");
    setScores(emptyScores());
    setDisplayBuffers(emptyBuffers());
    setOverallScore(0);
    setElapsed(0);
    setSignalData([[], [], [], [], []]);
    trackEvent("scan_again");
    rafRef.current = requestAnimationFrame(tick);
  }, [buffers, tick]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  return { phase, scores, displayBuffers, overallScore, elapsed, progress: Math.min(1, elapsed / ANALYSIS_DURATION_MS), signalData, reset };
}
