"use client";

import { useState, useEffect, useCallback } from "react";
import { RingBuffer, MotionSample } from "@/lib/signals";

export function useDeviceMotion(motionBuf: RingBuffer<MotionSample>) {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    setAvailable(typeof DeviceMotionEvent !== "undefined");
    if (typeof DeviceMotionEvent !== "undefined" && typeof (DeviceMotionEvent as any).requestPermission !== "function") {
      setPermissionGranted(true);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof (DeviceMotionEvent as any).requestPermission === "function") {
      try {
        const r = await (DeviceMotionEvent as any).requestPermission();
        if (r === "granted") setPermissionGranted(true);
      } catch { /* denied */ }
    } else {
      setPermissionGranted(true);
    }
  }, []);

  useEffect(() => {
    if (!permissionGranted) return;
    const handler = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      const rot = e.rotationRate;
      if (!acc || !rot) return;
      motionBuf.push({ ax: acc.x || 0, ay: acc.y || 0, az: acc.z || 0, gx: rot.alpha || 0, gy: rot.beta || 0, gz: rot.gamma || 0, t: performance.now() });
    };
    window.addEventListener("devicemotion", handler);
    return () => window.removeEventListener("devicemotion", handler);
  }, [permissionGranted, motionBuf]);

  return { permissionGranted, available, requestPermission };
}
