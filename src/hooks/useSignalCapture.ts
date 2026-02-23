"use client";

import { useEffect, useRef } from "react";
import { RingBuffer, PointerSample, ScrollSample, KeystrokeSample, MotionSample } from "@/lib/signals";
import { POINTER_BUFFER_SIZE, SCROLL_BUFFER_SIZE, KEY_BUFFER_SIZE, MOTION_BUFFER_SIZE } from "@/lib/constants";

export interface SignalBuffers {
  pointer: RingBuffer<PointerSample>;
  scroll: RingBuffer<ScrollSample>;
  keystroke: RingBuffer<KeystrokeSample>;
  motion: RingBuffer<MotionSample>;
}

export function useSignalCapture(): SignalBuffers {
  const pointerBuf = useRef(new RingBuffer<PointerSample>(POINTER_BUFFER_SIZE));
  const scrollBuf = useRef(new RingBuffer<ScrollSample>(SCROLL_BUFFER_SIZE));
  const keyBuf = useRef(new RingBuffer<KeystrokeSample>(KEY_BUFFER_SIZE));
  const motionBuf = useRef(new RingBuffer<MotionSample>(MOTION_BUFFER_SIZE));
  const cumScroll = useRef(0);

  useEffect(() => {
    const onPointer = (e: PointerEvent) => {
      pointerBuf.current.push({ x: e.clientX, y: e.clientY, t: performance.now(), pressure: e.pressure || 0 });
    };
    const onScroll = () => {
      scrollBuf.current.push({ y: window.scrollY, t: performance.now() });
    };
    const onWheel = (e: WheelEvent) => {
      cumScroll.current += e.deltaY;
      scrollBuf.current.push({ y: cumScroll.current, t: performance.now() });
    };
    const onKey = () => {
      keyBuf.current.push({ t: performance.now() });
    };

    window.addEventListener("pointermove", onPointer);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return { pointer: pointerBuf.current, scroll: scrollBuf.current, keystroke: keyBuf.current, motion: motionBuf.current };
}
