// ============================================================
// Database Layer v2 — Human Tokens, AI Delegations, Audit Trail
// In-memory for MVP — swap for Upstash Redis / Vercel Postgres
// ============================================================

export interface APIKey {
  id: string; siteKey: string; secretKey: string; name: string; domain: string;
  createdAt: string; plan: "free" | "pro" | "enterprise";
  usage: { month: string; count: number }; rateLimit: number;
}
export interface ChannelScores { pointer: number; scroll: number; keystroke: number; tremor: number; coherence: number; }
export interface Session {
  id: string; siteKey: string; status: "pending" | "analyzing" | "completed" | "expired";
  score: number; channels: ChannelScores; isHuman: boolean; token: string;
  createdAt: string; completedAt: string | null; expiresAt: string; ip: string; userAgent: string;
}
export interface HumanToken {
  id: string; userId: string; status: "active" | "expired" | "revoked";
  score: number; issuedAt: string; expiresAt: string; refreshedAt: string;
  refreshCount: number; deviceFingerprint: string; sessionIds: string[];
  metadata: { userAgent: string; ip: string; verificationCount: number };
}
export type DelegationScope = "read" | "write" | "transact" | "communicate" | "travel-booking" | "purchase" | "data-access" | "sign-document" | "schedule" | "custom";
export interface Delegation {
  id: string; humanTokenId: string; agentId: string; agentName: string; agentPlatform: string;
  status: "active" | "expired" | "revoked" | "exhausted"; scopes: DelegationScope[];
  constraints: { maxActions: number; actionsUsed: number; maxSpend: number | null; spentAmount: number; allowedDomains: string[]; ipWhitelist: string[] };
  createdAt: string; expiresAt: string; revokedAt: string | null; lastUsedAt: string | null;
}
export interface AuditEntry {
  id: string; timestamp: string;
  type: "token_issued" | "token_refreshed" | "token_revoked" | "delegation_created" | "delegation_used" | "delegation_revoked" | "delegation_expired" | "verification_completed" | "micro_task_completed" | "agent_action" | "agent_blocked";
  humanTokenId: string | null; delegationId: string | null; sessionId: string | null; agentId: string | null;
  details: Record<string, unknown>; ip: string;
}
export interface Webhook {
  id: string; siteKey: string; url: string; events: string[]; secret: string;
  active: boolean; createdAt: string; lastTriggeredAt: string | null; failureCount: number;
}
export interface MicroTaskResult {
  id: string; sessionId: string; taskType: "path-trace" | "rhythm-tap" | "tilt-balance" | "hold-steady";
  score: number; duration: number; completedAt: string; signalData: Record<string, unknown>;
}
export interface WaitlistEntry { email: string; createdAt: string; source: string; }

// ---- Stores ----
const apiKeys = new Map<string, APIKey>();
const sessions = new Map<string, Session>();
const humanTokens = new Map<string, HumanToken>();
const delegations = new Map<string, Delegation>();
const auditLog: AuditEntry[] = [];
const webhooks = new Map<string, Webhook>();
const microTasks = new Map<string, MicroTaskResult>();
const waitlist: WaitlistEntry[] = [];
const siteKeyIndex = new Map<string, string>();
const secretKeyIndex = new Map<string, string>();
const userIdTokenIndex = new Map<string, string>();
const humanTokenDelegations = new Map<string, string[]>();

function genId(prefix: string): string {
  const c = "abcdefghijklmnopqrstuvwxyz0123456789"; let r = prefix;
  for (let i = 0; i < 24; i++) r += c[Math.floor(Math.random() * c.length)]; return r;
}
function genSecret(): string {
  const c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; let r = "";
  for (let i = 0; i < 32; i++) r += c[Math.floor(Math.random() * c.length)]; return r;
}

// ---- Demo Key ----
const DEMO_ID = "demo_areyouhuman_001";
export const DEMO_SITE_KEY = "ayh_live_demo_areyouhuman_2026";
export const DEMO_SECRET_KEY = "ayh_secret_demo_areyouhuman_2026";
function ensureDemoKey(): void {
  if (apiKeys.has(DEMO_ID)) return;
  const key: APIKey = { id: DEMO_ID, siteKey: DEMO_SITE_KEY, secretKey: DEMO_SECRET_KEY, name: "Demo", domain: "areyouhuman.io", createdAt: new Date().toISOString(), plan: "free", usage: { month: new Date().toISOString().slice(0, 7), count: 0 }, rateLimit: 100 };
  apiKeys.set(DEMO_ID, key); siteKeyIndex.set(key.siteKey, DEMO_ID); secretKeyIndex.set(key.secretKey, DEMO_ID);
}
ensureDemoKey();

// ===== API KEYS =====
export function createAPIKey(name: string, domain: string): APIKey {
  const id = genId(""); const key: APIKey = { id, siteKey: genId("ayh_live_"), secretKey: genId("ayh_secret_"), name, domain, createdAt: new Date().toISOString(), plan: "free", usage: { month: new Date().toISOString().slice(0, 7), count: 0 }, rateLimit: 100 };
  apiKeys.set(id, key); siteKeyIndex.set(key.siteKey, id); secretKeyIndex.set(key.secretKey, id); return key;
}
export function getAPIKeyBySiteKey(siteKey: string): APIKey | null { ensureDemoKey(); const id = siteKeyIndex.get(siteKey); return id ? apiKeys.get(id) || null : null; }
export function getAPIKeyBySecretKey(secretKey: string): APIKey | null { ensureDemoKey(); const id = secretKeyIndex.get(secretKey); return id ? apiKeys.get(id) || null : null; }
export function listAPIKeys(): APIKey[] { return Array.from(apiKeys.values()); }
export function incrementUsage(siteKey: string): void { const key = getAPIKeyBySiteKey(siteKey); if (!key) return; const m = new Date().toISOString().slice(0, 7); if (key.usage.month !== m) key.usage = { month: m, count: 0 }; key.usage.count++; }

// ===== SESSIONS =====
export function createSession(siteKey: string, ip: string, userAgent: string): Session | null {
  const apiKey = getAPIKeyBySiteKey(siteKey); if (!apiKey) return null;
  const m = new Date().toISOString().slice(0, 7);
  if (apiKey.usage.month === m) { const limits: Record<string, number> = { free: 10000, pro: 100000, enterprise: Infinity }; if (apiKey.usage.count >= (limits[apiKey.plan] || 10000)) return null; }
  const session: Session = { id: genId("ses_"), siteKey, status: "pending", score: 0, channels: { pointer: 0, scroll: 0, keystroke: 0, tremor: 0, coherence: 0 }, isHuman: false, token: "", createdAt: new Date().toISOString(), completedAt: null, expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(), ip, userAgent };
  sessions.set(session.id, session); incrementUsage(siteKey); return session;
}
export function getSession(id: string): Session | null { return sessions.get(id) || null; }
export function completeSession(id: string, score: number, channels: ChannelScores): Session | null {
  const session = sessions.get(id); if (!session) return null;
  session.status = "completed"; session.score = score; session.channels = channels; session.isHuman = score >= 0.5; session.completedAt = new Date().toISOString();
  if (session.isHuman) { const p = { sid: id, s: Math.round(score * 1000), t: Date.now(), r: Math.random().toString(36).slice(2, 10) }; session.token = "ayh_tok_" + btoa(JSON.stringify(p)).replace(/=/g, ""); }
  addAudit("verification_completed", null, null, id, null, { score, isHuman: session.isHuman }, session.ip);
  return session;
}
export function verifyToken(token: string): { valid: boolean; session?: Session } {
  for (const session of Array.from(sessions.values())) {
    if (session.token === token) { if (new Date(session.expiresAt) < new Date()) { session.status = "expired"; return { valid: false }; } return { valid: true, session }; }
  } return { valid: false };
}

// ===== HUMAN TOKENS =====
export function issueHumanToken(sessionId: string, userId: string, deviceFp: string): HumanToken | null {
  const session = getSession(sessionId); if (!session || !session.isHuman) return null;
  const existingId = userIdTokenIndex.get(userId);
  if (existingId) { const ex = humanTokens.get(existingId); if (ex && ex.status === "active") return refreshHumanToken(existingId); }
  const token: HumanToken = { id: genId("htk_"), userId, status: "active", score: session.score, issuedAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), refreshedAt: new Date().toISOString(), refreshCount: 0, deviceFingerprint: deviceFp, sessionIds: [sessionId], metadata: { userAgent: session.userAgent, ip: session.ip, verificationCount: 1 } };
  humanTokens.set(token.id, token); userIdTokenIndex.set(userId, token.id); humanTokenDelegations.set(token.id, []);
  addAudit("token_issued", token.id, null, sessionId, null, { score: session.score, userId }, session.ip);
  return token;
}
export function getHumanToken(id: string): HumanToken | null {
  const t = humanTokens.get(id); if (!t) return null;
  if (t.status === "active" && new Date(t.expiresAt) < new Date()) t.status = "expired";
  return t;
}
export function getHumanTokenByUserId(userId: string): HumanToken | null { const id = userIdTokenIndex.get(userId); return id ? getHumanToken(id) : null; }
export function refreshHumanToken(id: string): HumanToken | null {
  const t = humanTokens.get(id); if (!t || t.status !== "active") return null;
  t.refreshedAt = new Date().toISOString(); t.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); t.refreshCount++;
  addAudit("token_refreshed", id, null, null, null, { refreshCount: t.refreshCount }, "");
  return t;
}
export function revokeHumanToken(id: string): boolean {
  const t = humanTokens.get(id); if (!t) return false; t.status = "revoked";
  const dIds = humanTokenDelegations.get(id) || [];
  for (const dId of dIds) revokeDelegation(dId);
  addAudit("token_revoked", id, null, null, null, { revokedDelegations: dIds.length }, "");
  return true;
}
export function listHumanTokens(): HumanToken[] { return Array.from(humanTokens.values()); }

// ===== DELEGATIONS =====
export function createDelegation(humanTokenId: string, agentId: string, agentName: string, agentPlatform: string, scopes: DelegationScope[], constraints: { maxActions?: number; maxSpend?: number | null; allowedDomains?: string[]; ipWhitelist?: string[]; durationMinutes?: number }): Delegation | null {
  const token = getHumanToken(humanTokenId); if (!token || token.status !== "active") return null;
  const dur = (constraints.durationMinutes || 60) * 60 * 1000;
  const d: Delegation = { id: genId("del_"), humanTokenId, agentId, agentName, agentPlatform, status: "active", scopes, constraints: { maxActions: constraints.maxActions || 100, actionsUsed: 0, maxSpend: constraints.maxSpend ?? null, spentAmount: 0, allowedDomains: constraints.allowedDomains || ["*"], ipWhitelist: constraints.ipWhitelist || [] }, createdAt: new Date().toISOString(), expiresAt: new Date(Date.now() + dur).toISOString(), revokedAt: null, lastUsedAt: null };
  delegations.set(d.id, d);
  const existing = humanTokenDelegations.get(humanTokenId) || []; existing.push(d.id); humanTokenDelegations.set(humanTokenId, existing);
  addAudit("delegation_created", humanTokenId, d.id, null, agentId, { scopes, agentName, agentPlatform, maxActions: d.constraints.maxActions, maxSpend: d.constraints.maxSpend }, "");
  return d;
}
export function getDelegation(id: string): Delegation | null {
  const d = delegations.get(id); if (!d) return null;
  if (d.status === "active" && new Date(d.expiresAt) < new Date()) { d.status = "expired"; addAudit("delegation_expired", d.humanTokenId, d.id, null, d.agentId, {}, ""); }
  return d;
}
export function verifyDelegation(delegationId: string, action: string, domain?: string, amount?: number): { authorized: boolean; reason?: string; delegation?: Delegation; humanToken?: HumanToken } {
  const d = getDelegation(delegationId); if (!d) return { authorized: false, reason: "Delegation not found" };
  if (d.status !== "active") return { authorized: false, reason: "Delegation " + d.status };
  const token = getHumanToken(d.humanTokenId); if (!token || token.status !== "active") return { authorized: false, reason: "Human token invalid" };
  if (d.constraints.actionsUsed >= d.constraints.maxActions) { d.status = "exhausted"; addAudit("agent_blocked", d.humanTokenId, d.id, null, d.agentId, { reason: "action_limit" }, ""); return { authorized: false, reason: "Action limit reached" }; }
  if (domain && !d.constraints.allowedDomains.includes("*") && !d.constraints.allowedDomains.includes(domain)) { addAudit("agent_blocked", d.humanTokenId, d.id, null, d.agentId, { reason: "domain_blocked", domain }, ""); return { authorized: false, reason: "Domain not allowed" }; }
  if (amount && d.constraints.maxSpend !== null && d.constraints.spentAmount + amount > d.constraints.maxSpend) { addAudit("agent_blocked", d.humanTokenId, d.id, null, d.agentId, { reason: "spend_limit", amount }, ""); return { authorized: false, reason: "Spend limit exceeded" }; }
  if (amount) d.constraints.spentAmount += amount;
  d.constraints.actionsUsed++; d.lastUsedAt = new Date().toISOString();
  addAudit("agent_action", d.humanTokenId, d.id, null, d.agentId, { action, domain, amount }, "");
  return { authorized: true, delegation: d, humanToken: token };
}
export function revokeDelegation(id: string): boolean { const d = delegations.get(id); if (!d) return false; d.status = "revoked"; d.revokedAt = new Date().toISOString(); addAudit("delegation_revoked", d.humanTokenId, d.id, null, d.agentId, {}, ""); return true; }
export function listDelegations(humanTokenId?: string): Delegation[] { const all = Array.from(delegations.values()); return humanTokenId ? all.filter((d) => d.humanTokenId === humanTokenId) : all; }

// ===== MICRO-TASKS =====
export function completeMicroTask(sessionId: string, taskType: MicroTaskResult["taskType"], score: number, duration: number, signalData: Record<string, unknown>): MicroTaskResult {
  const r: MicroTaskResult = { id: genId("mtk_"), sessionId, taskType, score, duration, completedAt: new Date().toISOString(), signalData };
  microTasks.set(r.id, r); addAudit("micro_task_completed", null, null, sessionId, null, { taskType, score, duration }, ""); return r;
}

// ===== AUDIT =====
function addAudit(type: AuditEntry["type"], humanTokenId: string | null, delegationId: string | null, sessionId: string | null, agentId: string | null, details: Record<string, unknown>, ip: string): void {
  auditLog.push({ id: genId("aud_"), timestamp: new Date().toISOString(), type, humanTokenId, delegationId, sessionId, agentId, details, ip });
  if (auditLog.length > 10000) auditLog.splice(0, auditLog.length - 10000);
}
export function getAuditLog(filters?: { humanTokenId?: string; delegationId?: string; type?: string; limit?: number }): AuditEntry[] {
  let result = [...auditLog];
  if (filters?.humanTokenId) result = result.filter((e) => e.humanTokenId === filters.humanTokenId);
  if (filters?.delegationId) result = result.filter((e) => e.delegationId === filters.delegationId);
  if (filters?.type) result = result.filter((e) => e.type === filters.type);
  result.reverse(); return result.slice(0, filters?.limit || 100);
}

// ===== WEBHOOKS =====
export function registerWebhook(siteKey: string, url: string, events: string[]): Webhook {
  const wh: Webhook = { id: genId("wh_"), siteKey, url, events, secret: genSecret(), active: true, createdAt: new Date().toISOString(), lastTriggeredAt: null, failureCount: 0 };
  webhooks.set(wh.id, wh); return wh;
}
export function listWebhooks(siteKey?: string): Webhook[] { const all = Array.from(webhooks.values()); return siteKey ? all.filter((w) => w.siteKey === siteKey) : all; }
export function deleteWebhook(id: string): boolean { return webhooks.delete(id); }

// ===== WAITLIST =====
export function addToWaitlist(email: string, source: string = "website"): boolean { if (waitlist.some((e) => e.email === email)) return false; waitlist.push({ email, createdAt: new Date().toISOString(), source }); return true; }
export function getWaitlist(): WaitlistEntry[] { return [...waitlist]; }

// ===== STATS =====
export function getStats() {
  const allS = Array.from(sessions.values()); const comp = allS.filter((s) => s.status === "completed");
  return { totalKeys: apiKeys.size, totalSessions: sessions.size, completedSessions: comp.length, humanVerified: allS.filter((s) => s.isHuman).length, waitlistCount: waitlist.length, avgScore: comp.length > 0 ? comp.reduce((a, s) => a + s.score, 0) / comp.length : 0,
    activeTokens: Array.from(humanTokens.values()).filter((t) => t.status === "active").length, totalTokens: humanTokens.size,
    activeDelegations: Array.from(delegations.values()).filter((d) => d.status === "active").length, totalDelegations: delegations.size,
    totalAgentActions: auditLog.filter((e) => e.type === "agent_action").length, blockedAgentActions: auditLog.filter((e) => e.type === "agent_blocked").length,
    totalAuditEntries: auditLog.length, webhookCount: webhooks.size, microTasksCompleted: microTasks.size };
}
