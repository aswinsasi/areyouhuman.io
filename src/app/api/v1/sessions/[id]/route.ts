import { NextRequest } from "next/server";
import { getSession, completeSession } from "@/lib/db";
import { jsonError } from "@/lib/api-auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = getSession(id);
  if (!session) return jsonError("Session not found", 404);

  return Response.json({
    success: true,
    sessionId: session.id,
    status: session.status,
    score: session.score,
    isHuman: session.isHuman,
    channels: session.channels,
    token: session.token || undefined,
    createdAt: session.createdAt,
    completedAt: session.completedAt,
    expiresAt: session.expiresAt,
  });
}

// PATCH — Submit analysis results (called by SDK)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { score, channels } = body;

    if (typeof score !== "number" || !channels) {
      return jsonError("Missing score or channels", 400);
    }

    const session = completeSession(id, score, channels);
    if (!session) return jsonError("Session not found", 404);

    return Response.json({
      success: true,
      sessionId: session.id,
      status: session.status,
      score: session.score,
      isHuman: session.isHuman,
      token: session.token || undefined,
      channels: session.channels,
    });
  } catch {
    return jsonError("Internal server error", 500);
  }
}
