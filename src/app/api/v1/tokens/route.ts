import { NextRequest } from "next/server";
import { issueHumanToken, listHumanTokens } from "@/lib/db";
import { jsonError } from "@/lib/api-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { sessionId, userId, deviceFingerprint } = body;
    if (!sessionId || !userId) return jsonError("Missing sessionId or userId", 400);
    const token = issueHumanToken(sessionId, userId, deviceFingerprint || "unknown");
    if (!token) return jsonError("Session invalid or not verified as human", 403);
    return Response.json({ success: true, token }, { status: 201 });
  } catch { return jsonError("Internal server error", 500); }
}

export async function GET() {
  return Response.json({ success: true, tokens: listHumanTokens() });
}
