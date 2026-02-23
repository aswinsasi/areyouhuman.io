"use client";
import dynamic from "next/dynamic";
const ControlPanel = dynamic(() => import("@/components/ControlPanel"), { ssr: false,
  loading: () => <main className="relative z-10 max-w-4xl mx-auto px-4 py-6"><div className="text-center py-20"><div className="text-2xl animate-pulse" style={{ color: "#00F0FF" }}>◉</div><p className="text-sm font-mono mt-3" style={{ color: "#667788" }}>Loading control panel...</p></div></main>,
});
export default function ControlPanelPage() { return <ControlPanel />; }
