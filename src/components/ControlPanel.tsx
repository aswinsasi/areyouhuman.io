"use client";
import React, { useState, useEffect, useCallback } from "react";
import { COLORS } from "@/lib/constants";

interface HToken { id: string; userId: string; status: string; score: number; issuedAt: string; expiresAt: string; refreshedAt: string; refreshCount: number; deviceFingerprint: string; metadata: { verificationCount: number } }
interface Deleg { id: string; humanTokenId: string; agentId: string; agentName: string; agentPlatform: string; status: string; scopes: string[]; constraints: { maxActions: number; actionsUsed: number; maxSpend: number | null; spentAmount: number; allowedDomains: string[] }; createdAt: string; expiresAt: string; lastUsedAt: string | null }
interface AuditE { id: string; timestamp: string; type: string; humanTokenId: string | null; delegationId: string | null; agentId: string | null; details: Record<string, unknown> }

export default function ControlPanel() {
  const [tab, setTab] = useState<"token" | "agents" | "audit" | "demo">("demo");
  const [tokens, setTokens] = useState<HToken[]>([]);
  const [delegs, setDelegs] = useState<Deleg[]>([]);
  const [audit, setAudit] = useState<AuditE[]>([]);
  const [demoLog, setDemoLog] = useState("");
  const [demoToken, setDemoToken] = useState<HToken | null>(null);
  const [demoDeleg, setDemoDeleg] = useState<Deleg | null>(null);

  const refresh = useCallback(async () => {
    const [t, d, a] = await Promise.all([
      fetch("/api/v1/tokens").then(r => r.json()),
      fetch("/api/v1/delegations").then(r => r.json()),
      fetch("/api/v1/audit?limit=50").then(r => r.json()),
    ]);
    setTokens(t.tokens || []); setDelegs(d.delegations || []); setAudit(a.entries || []);
  }, []);
  useEffect(() => { refresh(); }, [refresh]);

  const runDemo = async () => {
    setDemoLog(""); setDemoToken(null); setDemoDeleg(null);
    const log = (s: string) => setDemoLog(p => p + s + "\n");

    // 1. Create session
    log("━━━ Step 1: Verification Session ━━━");
    const s1 = await fetch("/api/v1/sessions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ siteKey: "ayh_live_demo_areyouhuman_2026" }) }).then(r => r.json());
    log("→ POST /api/v1/sessions\n" + JSON.stringify(s1, null, 2));

    // 2. Complete session
    log("\n━━━ Step 2: Submit Analysis ━━━");
    const s2 = await fetch(`/api/v1/sessions/${s1.sessionId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ score: 0.92, channels: { pointer: 0.88, scroll: 0.76, keystroke: 0.85, tremor: 0.79, coherence: 0.82 } }) }).then(r => r.json());
    log("→ PATCH /api/v1/sessions/" + s1.sessionId + "\n" + JSON.stringify(s2, null, 2));

    // 3. Issue Human Token
    log("\n━━━ Step 3: Issue Human Token ━━━");
    const userId = "user_" + Math.random().toString(36).slice(2, 10);
    const s3 = await fetch("/api/v1/tokens", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId: s1.sessionId, userId, deviceFingerprint: navigator.userAgent.slice(0, 30) }) }).then(r => r.json());
    log("→ POST /api/v1/tokens\n" + JSON.stringify(s3, null, 2));
    if (s3.token) setDemoToken(s3.token);

    // 4. Create Delegation
    log("\n━━━ Step 4: Delegate to AI Agent ━━━");
    const s4 = await fetch("/api/v1/delegations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ humanTokenId: s3.token?.id, agentId: "agent_claude_001", agentName: "Claude Travel Agent", agentPlatform: "claude", scopes: ["travel-booking", "purchase"], constraints: { maxActions: 10, maxSpend: 2000, durationMinutes: 60, allowedDomains: ["airline.com", "hotel.com"] } }) }).then(r => r.json());
    log("→ POST /api/v1/delegations\n" + JSON.stringify(s4, null, 2));
    if (s4.delegation) setDemoDeleg(s4.delegation);

    // 5. Agent uses delegation
    log("\n━━━ Step 5: Agent Uses Delegation ━━━");
    const s5 = await fetch("/api/v1/delegations/verify", { method: "POST", headers: { "Content-Type": "application/json", "Authorization": "Bearer ayh_secret_demo_areyouhuman_2026" }, body: JSON.stringify({ delegationId: s4.delegation?.id, action: "book_flight", domain: "airline.com", amount: 450 }) }).then(r => r.json());
    log("→ POST /api/v1/delegations/verify\n" + JSON.stringify(s5, null, 2));

    // 6. Agent tries blocked domain
    log("\n━━━ Step 6: Agent Tries Blocked Domain ━━━");
    const s6 = await fetch("/api/v1/delegations/verify", { method: "POST", headers: { "Content-Type": "application/json", "Authorization": "Bearer ayh_secret_demo_areyouhuman_2026" }, body: JSON.stringify({ delegationId: s4.delegation?.id, action: "send_money", domain: "crypto.com" }) }).then(r => r.json());
    log("→ POST /api/v1/delegations/verify (blocked domain)\n" + JSON.stringify(s6, null, 2));

    log("\n✅ Full 3-Layer Protocol Demo Complete!");
    log("VERIFY → Human verified through behavioral analysis");
    log("CARRY  → Portable Human Token issued, stored on-device");
    log("DELEGATE → AI agent authorized with scoped, time-limited credentials");
    refresh();
  };

  const revokeToken = async (id: string) => { await fetch(`/api/v1/tokens/${id}`, { method: "DELETE" }); refresh(); };
  const revokeDeleg = async (id: string) => { await fetch(`/api/v1/delegations/${id}`, { method: "DELETE" }); refresh(); };

  const StatusBadge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = { active: COLORS.green, expired: COLORS.amber, revoked: "#FF6666", exhausted: COLORS.magenta };
    return <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold" style={{ backgroundColor: (colors[status] || "#667788") + "15", color: colors[status] || "#667788" }}>{status}</span>;
  };

  return (
    <main className="relative z-10 max-w-5xl mx-auto px-4 py-6">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-3 hover:brightness-125 transition-all">
            <span className="text-2xl" style={{ color: COLORS.cyan }}>◉</span>
            <span className="font-display text-lg font-bold tracking-tight text-cyber-text">AREYOUHUMAN</span>
          </a>
          <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ backgroundColor: COLORS.violet + "15", color: COLORS.violet }}>Control Panel</span>
        </div>
        <div className="flex gap-2">
          <a href="/micro-task" className="text-xs font-mono px-3 py-1.5 rounded-lg hover:brightness-125" style={{ backgroundColor: COLORS.magenta + "15", color: COLORS.magenta, border: `1px solid ${COLORS.magenta}30` }}>Micro-Tasks</a>
          <a href="/dashboard" className="text-xs font-mono px-3 py-1.5 rounded-lg hover:brightness-125" style={{ backgroundColor: "#1A2030", color: "#E0E8F0", border: "1px solid #2A3040" }}>Dashboard</a>
        </div>
      </header>

      <div className="flex gap-1 mb-6 p-1 rounded-lg overflow-x-auto" style={{ backgroundColor: "#0A0E18" }}>
        {(["demo", "token", "agents", "audit"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className="px-4 py-2 rounded-md text-xs font-mono font-bold transition-all capitalize whitespace-nowrap"
            style={{ backgroundColor: tab === t ? COLORS.violet + "15" : "transparent", color: tab === t ? COLORS.violet : "#667788" }}>
            {t === "demo" ? "▶ Live Demo" : t === "token" ? "Human Tokens" : t === "agents" ? "AI Agents" : "Audit Trail"}
          </button>
        ))}
      </div>

      {/* DEMO TAB */}
      {tab === "demo" && (
        <div>
          <div className="rounded-lg border p-5 mb-4" style={{ backgroundColor: "#0C1018", borderColor: COLORS.violet + "20" }}>
            <h3 className="font-display font-bold text-sm mb-2" style={{ color: COLORS.violet }}>🧪 Full 3-Layer Protocol Demo</h3>
            <p className="text-xs font-mono mb-4" style={{ color: "#667788" }}>Runs the complete HumanSign flow: Verify → Issue Token → Delegate to AI Agent → Agent Acts → Agent Gets Blocked</p>
            <button onClick={runDemo} className="px-5 py-2.5 rounded-lg font-mono text-sm font-bold transition-all hover:brightness-125 hover:scale-105"
              style={{ backgroundColor: COLORS.violet + "20", color: COLORS.violet, border: `1px solid ${COLORS.violet}40` }}>▶ Run Full Protocol Demo</button>
          </div>
          {demoToken && (
            <div className="rounded-lg border p-4 mb-3" style={{ backgroundColor: COLORS.green + "05", borderColor: COLORS.green + "20" }}>
              <div className="text-xs font-mono font-bold mb-1" style={{ color: COLORS.green }}>🪪 Human Token Issued</div>
              <div className="text-[10px] font-mono" style={{ color: "#667788" }}>ID: {demoToken.id} · Score: {Math.round(demoToken.score * 100)}% · Expires: {new Date(demoToken.expiresAt).toLocaleDateString()}</div>
            </div>
          )}
          {demoDeleg && (
            <div className="rounded-lg border p-4 mb-3" style={{ backgroundColor: COLORS.cyan + "05", borderColor: COLORS.cyan + "20" }}>
              <div className="text-xs font-mono font-bold mb-1" style={{ color: COLORS.cyan }}>🤖 Delegation Created</div>
              <div className="text-[10px] font-mono" style={{ color: "#667788" }}>Agent: {demoDeleg.agentName} · Scopes: {demoDeleg.scopes.join(", ")} · Max spend: ${demoDeleg.constraints.maxSpend}</div>
            </div>
          )}
          {demoLog && (
            <pre className="rounded-lg border p-4 overflow-x-auto text-xs font-mono leading-relaxed"
              style={{ backgroundColor: "#080C14", borderColor: "#1A2030", color: "#C8D0DC", maxHeight: 500 }}>{demoLog}</pre>
          )}
        </div>
      )}

      {/* TOKENS TAB */}
      {tab === "token" && (
        <div>
          <div className="rounded-lg border p-4 mb-4" style={{ backgroundColor: "#0C1018", borderColor: "#1A2030" }}>
            <div className="text-xs font-mono font-bold mb-1 text-cyber-text">Human Tokens ({tokens.length})</div>
            <p className="text-[10px] font-mono" style={{ color: "#667788" }}>Portable cryptographic proof of human presence. Verify once, use everywhere.</p>
          </div>
          {tokens.length === 0 ? <p className="text-xs font-mono text-center py-8" style={{ color: "#667788" }}>No tokens issued yet. Run the demo to create one.</p> : (
            <div className="space-y-3">
              {tokens.map(t => (
                <div key={t.id} className="rounded-lg border p-4" style={{ backgroundColor: "#0C1018", borderColor: "#1A2030" }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyber-text">{t.id.slice(0, 16)}...</span>
                      <StatusBadge status={t.status} />
                    </div>
                    {t.status === "active" && <button onClick={() => revokeToken(t.id)} className="text-[10px] font-mono px-2 py-1 rounded hover:brightness-125" style={{ color: "#FF6666", backgroundColor: "#FF666610" }}>⚠ Revoke</button>}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono" style={{ color: "#667788" }}>
                    <div>Score: <span style={{ color: COLORS.cyan }}>{Math.round(t.score * 100)}%</span></div>
                    <div>Refreshes: <span style={{ color: COLORS.green }}>{t.refreshCount}</span></div>
                    <div>Issued: {new Date(t.issuedAt).toLocaleDateString()}</div>
                    <div>Expires: {new Date(t.expiresAt).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {tokens.some(t => t.status === "active") && (
            <div className="mt-4 rounded-lg border p-4 text-center" style={{ backgroundColor: COLORS.green + "05", borderColor: COLORS.green + "20" }}>
              <span className="text-lg">✓</span>
              <div className="text-sm font-mono font-bold" style={{ color: COLORS.green }}>Verified Human</div>
              <div className="text-[10px] font-mono" style={{ color: "#667788" }}>Your Human Token is active across all HumanSign-enabled services</div>
            </div>
          )}
        </div>
      )}

      {/* AGENTS TAB */}
      {tab === "agents" && (
        <div>
          <div className="rounded-lg border p-4 mb-4" style={{ backgroundColor: "#0C1018", borderColor: "#1A2030" }}>
            <div className="text-xs font-mono font-bold mb-1 text-cyber-text">AI Agent Delegations ({delegs.length})</div>
            <p className="text-[10px] font-mono" style={{ color: "#667788" }}>Scoped, time-limited credentials for AI agents acting on your behalf.</p>
          </div>
          {delegs.length === 0 ? <p className="text-xs font-mono text-center py-8" style={{ color: "#667788" }}>No delegations created. Run the demo to create one.</p> : (
            <div className="space-y-3">
              {delegs.map(d => (
                <div key={d.id} className="rounded-lg border p-4" style={{ backgroundColor: "#0C1018", borderColor: "#1A2030" }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🤖</span>
                      <span className="text-xs font-mono font-bold text-cyber-text">{d.agentName}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: "#1A2030", color: "#667788" }}>{d.agentPlatform}</span>
                      <StatusBadge status={d.status} />
                    </div>
                    {d.status === "active" && <button onClick={() => revokeDeleg(d.id)} className="text-[10px] font-mono px-2 py-1 rounded hover:brightness-125" style={{ color: "#FF6666", backgroundColor: "#FF666610" }}>⚠ Revoke</button>}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {d.scopes.map(s => <span key={s} className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: COLORS.cyan + "10", color: COLORS.cyan }}>{s}</span>)}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono" style={{ color: "#667788" }}>
                    <div>Actions: <span style={{ color: COLORS.cyan }}>{d.constraints.actionsUsed}/{d.constraints.maxActions}</span></div>
                    <div>Spend: <span style={{ color: COLORS.green }}>${d.constraints.spentAmount}{d.constraints.maxSpend !== null ? `/$${d.constraints.maxSpend}` : ""}</span></div>
                    <div>Domains: {d.constraints.allowedDomains.join(", ")}</div>
                    <div>Expires: {new Date(d.expiresAt).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* AUDIT TAB */}
      {tab === "audit" && (
        <div>
          <div className="rounded-lg border p-4 mb-4" style={{ backgroundColor: "#0C1018", borderColor: "#1A2030" }}>
            <div className="text-xs font-mono font-bold mb-1 text-cyber-text">Audit Trail ({audit.length} entries)</div>
            <p className="text-[10px] font-mono" style={{ color: "#667788" }}>Every action tracked. Full transparency and accountability.</p>
          </div>
          {audit.length === 0 ? <p className="text-xs font-mono text-center py-8" style={{ color: "#667788" }}>No audit entries yet.</p> : (
            <div className="space-y-1">
              {audit.map(e => {
                const colors: Record<string, string> = { token_issued: COLORS.green, token_refreshed: COLORS.cyan, token_revoked: "#FF6666", delegation_created: COLORS.violet, delegation_revoked: "#FF6666", agent_action: COLORS.cyan, agent_blocked: "#FF6666", verification_completed: COLORS.green, micro_task_completed: COLORS.amber, delegation_expired: COLORS.amber };
                return (
                  <div key={e.id} className="rounded border p-2.5 flex items-start gap-3" style={{ backgroundColor: "#0C1018", borderColor: "#1A203060" }}>
                    <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: colors[e.type] || "#667788" }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-mono font-bold" style={{ color: colors[e.type] || "#667788" }}>{e.type.replace(/_/g, " ")}</div>
                      <div className="text-[9px] font-mono truncate" style={{ color: "#667788" }}>{JSON.stringify(e.details).slice(0, 120)}</div>
                    </div>
                    <div className="text-[9px] font-mono flex-shrink-0" style={{ color: "#444" }}>{new Date(e.timestamp).toLocaleTimeString()}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <footer className="text-center py-6 mt-8 border-t" style={{ borderColor: "#1A2030" }}>
        <nav className="flex items-center justify-center gap-4 mb-2">
          <a href="/" className="text-[11px] font-mono hover:brightness-125" style={{ color: "#667788" }}>Home</a>
          <a href="/dashboard" className="text-[11px] font-mono hover:brightness-125" style={{ color: "#667788" }}>Dashboard</a>
          <a href="/micro-task" className="text-[11px] font-mono hover:brightness-125" style={{ color: COLORS.magenta + "80" }}>Micro-Tasks</a>
          <a href="/sdk" className="text-[11px] font-mono hover:brightness-125" style={{ color: COLORS.cyan + "60" }}>SDK</a>
        </nav>
      </footer>
    </main>
  );
}
