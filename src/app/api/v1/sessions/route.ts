import { NextRequest } from "next/server";
import { createSession } from "@/lib/db";
import { jsonError, getIP } from "@/lib/api-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const siteKey = body.siteKey || req.headers.get("x-site-key");

    if (!siteKey) return jsonError("Missing siteKey", 400);

    const ip = getIP(req);
    const userAgent = req.headers.get("user-agent") || "unknown";
    const session = createSession(siteKey, ip, userAgent);

    if (!session) return jsonError("Invalid site key or rate limit exceeded", 403);

    return Response.json({
      success: true,
      sessionId: session.id,
      clientToken: session.id, // Client uses this to submit signals
      expiresAt: session.expiresAt,
    }, { status: 201 });
  } catch {
    return jsonError("Internal server error", 500);
  }
}
