"use client";

import dynamic from "next/dynamic";
const MicroTaskUI = dynamic(() => import("@/components/MicroTask"), { ssr: false,
  loading: () => <main className="relative z-10 max-w-3xl mx-auto px-4 py-6"><div className="text-center py-20"><div className="text-2xl animate-pulse" style={{ color: "#00F0FF" }}>◉</div><p className="text-sm font-mono mt-3" style={{ color: "#667788" }}>Loading micro-task...</p></div></main>,
});
export default function MicroTaskPage() { return <MicroTaskUI />; }
