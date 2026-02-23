// ============================================================
// Database Layer — In-memory store for MVP
// Replace with Upstash Redis / Vercel Postgres for production
// The interface stays the same — just swap the implementation
// ============================================================

export interface APIKey {
  id: string;
  siteKey: string;      // ayh_live_xxxxx (public)
  secretKey: string;     // ayh_secret_xxxxx (private)
  name: string;
  domain: string;
  createdAt: string;
  plan: "free" | "pro" | "enterprise";
  usage: { month: string; count: number };
  rateLimit: number;     // per minute
}

export interface Session {
  id: string;
  siteKey: string;
  status: "pending" | "analyzing" | "completed" | "expired";
  score: number;
  channels: {
    pointer: number;
    scroll: number;
    keystroke: number;
    tremor: number;
    coherence: number;
  };
  isHuman: boolean;
  token: string;
  createdAt: string;
  completedAt: string | null;
  expiresAt: string;
  ip: string;
  userAgent: string;
}

export interface WaitlistEntry {
  email: string;
  createdAt: string;
  source: string;
}

// ---- In-memory stores (reset on cold start — fine for MVP) ----
const apiKeys = new Map<string, APIKey>();
const sessions = new Map<string, Session>();
const waitlist: WaitlistEntry[] = [];

// Indexes
const siteKeyIndex = new Map<string, string>(); // siteKey -> id
const secretKeyIndex = new Map<string, string>(); // secretKey -> id

// ---- Helpers ----
function generateId(prefix: string): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = prefix;
  for (let i = 0; i < 24; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

function generateToken(sessionId: string, score: number): string {
  const payload = { sid: sessionId, s: Math.round(score * 1000), t: Date.now(), r: Math.random().toString(36).slice(2, 10) };
  return "ayh_tok_" + btoa(JSON.stringify(payload)).replace(/=/g, "");
}

// ---- API Key Operations ----
export function createAPIKey(name: string, domain: string): APIKey {
  const id = generateId("");
  const key: APIKey = {
    id,
    siteKey: generateId("ayh_live_"),
    secretKey: generateId("ayh_secret_"),
    name,
    domain,
    createdAt: new Date().toISOString(),
    plan: "free",
    usage: { month: new Date().toISOString().slice(0, 7), count: 0 },
    rateLimit: 100,
  };
  apiKeys.set(id, key);
  siteKeyIndex.set(key.siteKey, id);
  secretKeyIndex.set(key.secretKey, id);
  return key;
}

export function getAPIKeyBySiteKey(siteKey: string): APIKey | null {
  ensureDemoKey();
  const id = siteKeyIndex.get(siteKey);
  return id ? apiKeys.get(id) || null : null;
}

export function getAPIKeyBySecretKey(secretKey: string): APIKey | null {
  ensureDemoKey();
  const id = secretKeyIndex.get(secretKey);
  return id ? apiKeys.get(id) || null : null;
}

export function listAPIKeys(): APIKey[] {
  return Array.from(apiKeys.values());
}

export function incrementUsage(siteKey: string): void {
  const key = getAPIKeyBySiteKey(siteKey);
  if (!key) return;
  const currentMonth = new Date().toISOString().slice(0, 7);
  if (key.usage.month !== currentMonth) {
    key.usage = { month: currentMonth, count: 0 };
  }
  key.usage.count++;
}

// ---- Session Operations ----
export function createSession(siteKey: string, ip: string, userAgent: string): Session | null {
  const apiKey = getAPIKeyBySiteKey(siteKey);
  if (!apiKey) return null;

  // Rate limit check
  const currentMonth = new Date().toISOString().slice(0, 7);
  if (apiKey.usage.month === currentMonth) {
    const limits: Record<string, number> = { free: 10000, pro: 100000, enterprise: Infinity };
    if (apiKey.usage.count >= (limits[apiKey.plan] || 10000)) return null;
  }

  const session: Session = {
    id: generateId("ses_"),
    siteKey,
    status: "pending",
    score: 0,
    channels: { pointer: 0, scroll: 0, keystroke: 0, tremor: 0, coherence: 0 },
    isHuman: false,
    token: "",
    createdAt: new Date().toISOString(),
    completedAt: null,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 min
    ip,
    userAgent,
  };
  sessions.set(session.id, session);
  incrementUsage(siteKey);
  return session;
}

export function getSession(id: string): Session | null {
  return sessions.get(id) || null;
}

export function completeSession(
  id: string,
  score: number,
  channels: Session["channels"]
): Session | null {
  const session = sessions.get(id);
  if (!session) return null;
  session.status = "completed";
  session.score = score;
  session.channels = channels;
  session.isHuman = score >= 0.5;
  session.completedAt = new Date().toISOString();
  if (session.isHuman) {
    session.token = generateToken(id, score);
  }
  return session;
}

export function verifyToken(token: string): { valid: boolean; session?: Session } {
  // Find session by token
  for (const session of Array.from(sessions.values())) {
    if (session.token === token) {
      const expired = new Date(session.expiresAt) < new Date();
      if (expired) {
        session.status = "expired";
        return { valid: false };
      }
      return { valid: true, session };
    }
  }
  return { valid: false };
}

// ---- Waitlist Operations ----
export function addToWaitlist(email: string, source: string = "website"): boolean {
  if (waitlist.some((e) => e.email === email)) return false;
  waitlist.push({ email, createdAt: new Date().toISOString(), source });
  return true;
}

export function getWaitlist(): WaitlistEntry[] {
  return [...waitlist];
}

export function getStats() {
  return {
    totalKeys: apiKeys.size,
    totalSessions: sessions.size,
    completedSessions: Array.from(sessions.values()).filter((s) => s.status === "completed").length,
    humanVerified: Array.from(sessions.values()).filter((s) => s.isHuman).length,
    waitlistCount: waitlist.length,
    avgScore: (() => {
      const completed = Array.from(sessions.values()).filter((s) => s.status === "completed");
      return completed.length > 0 ? completed.reduce((a, s) => a + s.score, 0) / completed.length : 0;
    })(),
  };
}

// ---- Deterministic demo key (same across all serverless instances) ----
const DEMO_ID = "demo_areyouhuman_001";
export const DEMO_SITE_KEY = "ayh_live_demo_areyouhuman_2026";
export const DEMO_SECRET_KEY = "ayh_secret_demo_areyouhuman_2026";

function ensureDemoKey(): void {
  if (apiKeys.has(DEMO_ID)) return;
  const key: APIKey = {
    id: DEMO_ID,
    siteKey: DEMO_SITE_KEY,
    secretKey: DEMO_SECRET_KEY,
    name: "Demo",
    domain: "areyouhuman.io",
    createdAt: new Date().toISOString(),
    plan: "free",
    usage: { month: new Date().toISOString().slice(0, 7), count: 0 },
    rateLimit: 100,
  };
  apiKeys.set(DEMO_ID, key);
  siteKeyIndex.set(key.siteKey, DEMO_ID);
  secretKeyIndex.set(key.secretKey, DEMO_ID);
}

// Auto-init on import
ensureDemoKey();