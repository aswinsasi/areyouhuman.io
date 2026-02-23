"use client";

import React, { useState, useEffect, useCallback } from "react";
import { COLORS } from "@/lib/constants";

interface APIKeyData {
  id: string;
  siteKey: string;
  secretKey?: string;
  name: string;
  domain: string;
  plan: string;
  usage: { month: string; count: number };
  createdAt: string;
}

interface Stats {
  totalKeys: number;
  totalSessions: number;
  completedSessions: number;
  humanVerified: number;
  waitlistCount: number;
  avgScore: number;
}

export default function Dashboard() {
  const [keys, setKeys] = useState<APIKeyData[]>([]);
  const [demo, setDemo] = useState<{ siteKey: string; secretKey: string } | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [newKey, setNewKey] = useState<APIKeyData | null>(null);
  const [formName, setFormName] = useState("");
  const [formDomain, setFormDomain] = useState("");
  const [creating, setCreating] = useState(false);
  const [tab, setTab] = useState<"overview" | "keys" | "api-test" | "waitlist">("overview");
  const [testResult, setTestResult] = useState<string>("");
  const [waitlist, setWaitlist] = useState<{ email: string; createdAt: string }[]>([]);

  const fetchData = useCallback(async () => {
    const [keysRes, statsRes] = await Promise.all([
      fetch("/api/v1/keys").then((r) => r.json()),
      fetch("/api/v1/stats").then((r) => r.json()),
    ]);
    setKeys(keysRes.keys || []);
    setDemo(keysRes.demo || null);
    setStats(statsRes);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const createKey = async () => {
    if (!formName || !formDomain) return;
    setCreating(true);
    const res = await fetch("/api/v1/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: formName, domain: formDomain }),
    });
    const data = await res.json();
    if (data.success) {
      setNewKey(data);
      setFormName("");
      setFormDomain("");
      fetchData();
    }
    setCreating(false);
  };

  const testAPI = async () => {
    if (!demo) return;
    setTestResult("Testing...\n");

    // Step 1: Create session
    setTestResult((p) => p + "\n→ POST /api/v1/sessions\n");
    const s1 = await fetch("/api/v1/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteKey: demo.siteKey }),
    });
    const session = await s1.json();
    setTestResult((p) => p + JSON.stringify(session, null, 2) + "\n");

    if (!session.success) return;

    // Step 2: Complete session with mock data
    setTestResult((p) => p + "\n→ PATCH /api/v1/sessions/" + session.sessionId + "\n");
    const s2 = await fetch(`/api/v1/sessions/${session.sessionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        score: 0.87,
        channels: { pointer: 0.72, scroll: 0.65, keystroke: 0.81, tremor: 0.69, coherence: 0.74 },
      }),
    });
    const completed = await s2.json();
    setTestResult((p) => p + JSON.stringify(completed, null, 2) + "\n");

    if (!completed.token) return;

    // Step 3: Verify token
    setTestResult((p) => p + "\n→ POST /api/v1/verify\n");
    const s3 = await fetch("/api/v1/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${demo.secretKey}`,
      },
      body: JSON.stringify({ token: completed.token }),
    });
    const verified = await s3.json();
    setTestResult((p) => p + JSON.stringify(verified, null, 2) + "\n");
    setTestResult((p) => p + "\n✅ Full verification flow complete!");
    fetchData();
  };

  const fetchWaitlist = async () => {
    const res = await fetch("/api/v1/waitlist");
    const data = await res.json();
    setWaitlist(data.entries || []);
  };

  useEffect(() => { if (tab === "waitlist") fetchWaitlist(); }, [tab]);

  const StatCard = ({ label, value, color }: { label: string; value: string | number; color: string }) => (
    <div className="rounded-lg border p-4" style={{ backgroundColor: "#0C1018", borderColor: "#1A2030" }}>
      <div className="text-[10px] font-mono tracking-widest mb-1" style={{ color: "#667788" }}>{label}</div>
      <div className="text-2xl font-display font-bold" style={{ color }}>{value}</div>
    </div>
  );

  return (
    <main className="relative z-10 max-w-5xl mx-auto px-4 py-6 sm:px-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-3 hover:brightness-125 transition-all">
            <span className="text-2xl" style={{ color: COLORS.cyan }}>◉</span>
            <span className="font-display text-lg font-bold tracking-tight text-cyber-text">AREYOUHUMAN</span>
          </a>
          <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ backgroundColor: COLORS.amber + "15", color: COLORS.amber }}>Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="/sdk" className="text-xs font-mono px-3 py-1.5 rounded-lg hover:brightness-125"
            style={{ backgroundColor: "#1A2030", color: "#E0E8F0", border: "1px solid #2A3040" }}>SDK Docs</a>
          <a href="/" className="text-xs font-mono px-3 py-1.5 rounded-lg hover:brightness-125"
            style={{ backgroundColor: COLORS.cyan + "15", color: COLORS.cyan, border: `1px solid ${COLORS.cyan}30` }}>Demo</a>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-lg" style={{ backgroundColor: "#0A0E18" }}>
        {(["overview", "keys", "api-test", "waitlist"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-2 rounded-md text-xs font-mono font-bold transition-all capitalize"
            style={{ backgroundColor: tab === t ? COLORS.cyan + "15" : "transparent", color: tab === t ? COLORS.cyan : "#667788" }}>
            {t.replace("-", " ")}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === "overview" && stats && (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            <StatCard label="API KEYS" value={stats.totalKeys} color={COLORS.cyan} />
            <StatCard label="TOTAL SESSIONS" value={stats.totalSessions} color={COLORS.green} />
            <StatCard label="COMPLETED" value={stats.completedSessions} color={COLORS.magenta} />
            <StatCard label="HUMAN VERIFIED" value={stats.humanVerified} color={COLORS.green} />
            <StatCard label="AVG SCORE" value={`${Math.round(stats.avgScore * 100)}%`} color={COLORS.amber} />
            <StatCard label="WAITLIST" value={stats.waitlistCount} color={COLORS.violet} />
          </div>

          {/* API Endpoints */}
          <div className="rounded-lg border p-5" style={{ backgroundColor: "#0C1018", borderColor: "#1A2030" }}>
            <h3 className="font-display font-bold text-sm mb-4 text-cyber-text">Live API Endpoints</h3>
            <div className="space-y-2">
              {[
                { method: "POST", path: "/api/v1/sessions", desc: "Create verification session" },
                { method: "GET", path: "/api/v1/sessions/:id", desc: "Get session status & result" },
                { method: "PATCH", path: "/api/v1/sessions/:id", desc: "Submit analysis results" },
                { method: "POST", path: "/api/v1/verify", desc: "Server-side token verification" },
                { method: "POST", path: "/api/v1/keys", desc: "Generate API keys" },
                { method: "GET", path: "/api/v1/keys", desc: "List API keys" },
                { method: "GET", path: "/api/v1/stats", desc: "Platform statistics" },
                { method: "POST", path: "/api/v1/waitlist", desc: "Join waitlist" },
              ].map((ep) => (
                <div key={ep.path + ep.method} className="flex items-center gap-3 text-xs font-mono">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                    style={{ backgroundColor: ep.method === "GET" ? COLORS.green + "15" : ep.method === "POST" ? COLORS.cyan + "15" : COLORS.amber + "15",
                      color: ep.method === "GET" ? COLORS.green : ep.method === "POST" ? COLORS.cyan : COLORS.amber }}>
                    {ep.method}
                  </span>
                  <span style={{ color: "#E0E8F0" }}>{ep.path}</span>
                  <span style={{ color: "#667788" }}>— {ep.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Keys Tab */}
      {tab === "keys" && (
        <div>
          {/* Demo Key Info */}
          {demo && (
            <div className="rounded-lg border p-4 mb-6" style={{ backgroundColor: COLORS.cyan + "08", borderColor: COLORS.cyan + "20" }}>
              <div className="text-xs font-mono font-bold mb-2" style={{ color: COLORS.cyan }}>🔑 Demo API Keys (auto-generated)</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <div style={{ color: "#667788" }}>Site Key (public):</div>
                  <div className="mt-1 p-2 rounded" style={{ backgroundColor: "#0C1018", color: COLORS.green, wordBreak: "break-all" }}>{demo.siteKey}</div>
                </div>
                <div>
                  <div style={{ color: "#667788" }}>Secret Key (private):</div>
                  <div className="mt-1 p-2 rounded" style={{ backgroundColor: "#0C1018", color: COLORS.magenta, wordBreak: "break-all" }}>{demo.secretKey}</div>
                </div>
              </div>
            </div>
          )}

          {/* Create New Key */}
          <div className="rounded-lg border p-5 mb-6" style={{ backgroundColor: "#0C1018", borderColor: "#1A2030" }}>
            <h3 className="font-display font-bold text-sm mb-3 text-cyber-text">Generate New API Key</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input placeholder="App name (e.g. My SaaS)" value={formName} onChange={(e) => setFormName(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg font-mono text-sm bg-transparent border focus:outline-none"
                style={{ borderColor: "#1A2030", color: "#E0E8F0" }} />
              <input placeholder="Domain (e.g. myapp.com)" value={formDomain} onChange={(e) => setFormDomain(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg font-mono text-sm bg-transparent border focus:outline-none"
                style={{ borderColor: "#1A2030", color: "#E0E8F0" }} />
              <button onClick={createKey} disabled={creating || !formName || !formDomain}
                className="px-5 py-2 rounded-lg font-mono text-sm font-bold transition-all hover:brightness-125 disabled:opacity-40"
                style={{ backgroundColor: COLORS.cyan + "20", color: COLORS.cyan, border: `1px solid ${COLORS.cyan}40` }}>
                {creating ? "Creating..." : "Generate →"}
              </button>
            </div>
          </div>

          {/* Newly Created Key */}
          {newKey && (
            <div className="rounded-lg border p-4 mb-6 animate-fade-in" style={{ backgroundColor: COLORS.green + "08", borderColor: COLORS.green + "30" }}>
              <div className="text-xs font-mono font-bold mb-2" style={{ color: COLORS.green }}>✓ Key Created — Save your secret key now!</div>
              <div className="grid grid-cols-1 gap-2 text-xs font-mono">
                <div><span style={{ color: "#667788" }}>Site Key: </span><span style={{ color: COLORS.green }}>{newKey.siteKey}</span></div>
                <div><span style={{ color: "#667788" }}>Secret Key: </span><span style={{ color: COLORS.magenta }}>{newKey.secretKey}</span></div>
              </div>
            </div>
          )}

          {/* Existing Keys */}
          <div className="space-y-3">
            {keys.map((k) => (
              <div key={k.id} className="rounded-lg border p-4 flex items-center justify-between"
                style={{ backgroundColor: "#0C1018", borderColor: "#1A2030" }}>
                <div>
                  <div className="text-sm font-mono font-bold text-cyber-text">{k.name}</div>
                  <div className="text-[10px] font-mono" style={{ color: "#667788" }}>{k.domain} · {k.siteKey.slice(0, 20)}...</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono" style={{ color: COLORS.cyan }}>{k.usage.count.toLocaleString()} verifications</div>
                  <div className="text-[10px] font-mono" style={{ color: "#667788" }}>{k.plan} plan</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* API Test Tab */}
      {tab === "api-test" && (
        <div>
          <div className="rounded-lg border p-5 mb-4" style={{ backgroundColor: "#0C1018", borderColor: "#1A2030" }}>
            <h3 className="font-display font-bold text-sm mb-2 text-cyber-text">🧪 End-to-End API Test</h3>
            <p className="text-xs font-mono mb-4" style={{ color: "#667788" }}>
              Runs the full flow: create session → submit analysis → verify token. Uses the demo API key.
            </p>
            <button onClick={testAPI}
              className="px-5 py-2.5 rounded-lg font-mono text-sm font-bold transition-all hover:brightness-125 hover:scale-105"
              style={{ backgroundColor: COLORS.green + "20", color: COLORS.green, border: `1px solid ${COLORS.green}40` }}>
              ▶ Run Full Test
            </button>
          </div>
          {testResult && (
            <pre className="rounded-lg border p-4 overflow-x-auto text-xs font-mono leading-relaxed"
              style={{ backgroundColor: "#080C14", borderColor: "#1A2030", color: "#C8D0DC", maxHeight: 500 }}>
              {testResult}
            </pre>
          )}
        </div>
      )}

      {/* Waitlist Tab */}
      {tab === "waitlist" && (
        <div>
          <div className="rounded-lg border p-5 mb-4" style={{ backgroundColor: "#0C1018", borderColor: "#1A2030" }}>
            <h3 className="font-display font-bold text-sm mb-1 text-cyber-text">📋 Waitlist Signups</h3>
            <p className="text-xs font-mono" style={{ color: "#667788" }}>{waitlist.length} developers signed up</p>
          </div>
          {waitlist.length > 0 ? (
            <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: "#0C1018", borderColor: "#1A2030" }}>
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr style={{ borderBottom: "1px solid #1A2030", backgroundColor: "#0A0E18" }}>
                    <th className="text-left p-3" style={{ color: "#667788" }}>#</th>
                    <th className="text-left p-3" style={{ color: "#667788" }}>Email</th>
                    <th className="text-left p-3" style={{ color: "#667788" }}>Signed Up</th>
                  </tr>
                </thead>
                <tbody>
                  {waitlist.map((e, i) => (
                    <tr key={e.email} style={{ borderBottom: "1px solid #1A203060" }}>
                      <td className="p-3" style={{ color: COLORS.cyan }}>{i + 1}</td>
                      <td className="p-3" style={{ color: "#E0E8F0" }}>{e.email}</td>
                      <td className="p-3" style={{ color: "#667788" }}>{new Date(e.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs font-mono text-center py-8" style={{ color: "#667788" }}>No signups yet. Share areyouhuman.io!</p>
          )}
        </div>
      )}

      <footer className="text-center py-6 mt-12 border-t" style={{ borderColor: "#1A2030" }}>
        <p className="text-[11px] font-mono text-cyber-muted">© 2026 HumanSign Protocol — Dashboard</p>
      </footer>
    </main>
  );
}
