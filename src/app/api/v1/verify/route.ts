import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/db";
import { authenticateSecretKey, jsonError } from "@/lib/api-auth";

export async function POST(req: NextRequest) {
  try {
    // Authenticate with secret key
    const apiKey = authenticateSecretKey(req);
    if (!apiKey) return jsonError("Invalid or missing Authorization header. Use: Bearer ayh_secret_xxx", 401);

    const body = await req.json().catch(() => ({}));
    const { token } = body;

    if (!token) return jsonError("Missing token field", 400);

    const result = verifyToken(token);

    if (!result.valid || !result.session) {
      return Response.json({
        success: false,
        score: 0,
        message: "Token invalid or expired",
      }, { status: 403 });
    }

    return Response.json({
      success: true,
      score: result.session.score,
      channels: result.session.channels,
      timestamp: result.session.completedAt,
      hostname: apiKey.domain,
    });
  } catch {
    return jsonError("Internal server error", 500);
  }
}
