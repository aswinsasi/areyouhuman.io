import { NextRequest } from "next/server";
import { completeMicroTask } from "@/lib/db";
import { jsonError } from "@/lib/api-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { sessionId, taskType, score, duration, signalData } = body;
    if (!sessionId || !taskType) return jsonError("Missing sessionId or taskType", 400);
    const result = completeMicroTask(sessionId, taskType, score || 0, duration || 0, signalData || {});
    return Response.json({ success: true, result }, { status: 201 });
  } catch { return jsonError("Internal server error", 500); }
}
