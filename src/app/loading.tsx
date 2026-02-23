export default function Loading() {
  return (
    <main className="relative z-10 max-w-5xl mx-auto px-4 py-6 sm:px-6">
      <header className="flex items-center gap-3 mb-8">
        <span className="text-2xl animate-pulse" style={{ color: "#00F0FF" }}>◉</span>
        <span className="font-display text-lg font-bold tracking-tight" style={{ color: "#E0E8F0" }}>AREYOUHUMAN</span>
      </header>
      <div className="text-center py-20">
        <div className="inline-block w-10 h-10 rounded-full border-2 border-t-transparent animate-spin mb-4" style={{ borderColor: "#00F0FF40", borderTopColor: "transparent" }} />
        <p className="text-sm font-mono" style={{ color: "#667788" }}>Initializing behavioral analysis engine...</p>
        <div className="mt-6 max-w-sm mx-auto h-1 rounded-full overflow-hidden" style={{ backgroundColor: "#1A2030" }}>
          <div className="h-full rounded-full animate-shimmer" style={{ width: "60%", background: "linear-gradient(90deg, #00F0FF, #00FF88)" }} />
        </div>
      </div>
    </main>
  );
}
