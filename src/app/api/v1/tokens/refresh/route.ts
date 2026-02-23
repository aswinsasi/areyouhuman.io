import { NextRequest } from "next/server";
import { refreshHumanToken } from "@/lib/db";
import { jsonError } from "@/lib/api-auth";

export async function POST(req: NextRequest) {
  try {
    const { tokenId } = await req.json().catch(() => ({} as Record<string, string>));
    if (!tokenId) return jsonError("Missing tokenId", 400);
    const token = refreshHumanToken(tokenId);
    if (!token) return jsonError("Token not found or not active", 404);
    return Response.json({ success: true, token });
  } catch { return jsonError("Internal server error", 500); }
}
