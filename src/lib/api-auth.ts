import { NextRequest } from "next/server";
import { getAPIKeyBySiteKey, getAPIKeyBySecretKey, type APIKey } from "./db";

export function getSiteKey(req: NextRequest): string | null {
  return req.headers.get("x-site-key") || null;
}

export function getSecretKey(req: NextRequest): string | null {
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

export function authenticateSiteKey(req: NextRequest): APIKey | null {
  const siteKey = getSiteKey(req);
  if (!siteKey) return null;
  return getAPIKeyBySiteKey(siteKey);
}

export function authenticateSecretKey(req: NextRequest): APIKey | null {
  const secretKey = getSecretKey(req);
  if (!secretKey) return null;
  return getAPIKeyBySecretKey(secretKey);
}

export function jsonError(message: string, status: number) {
  return Response.json({ success: false, error: message }, { status });
}

export function getIP(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}
