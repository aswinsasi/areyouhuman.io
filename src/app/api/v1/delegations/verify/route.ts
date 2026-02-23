import { NextRequest } from "next/server";
import { verifyDelegation } from "@/lib/db";
import { authenticateSecretKey, jsonError } from "@/lib/api-auth";

export async function POST(req: NextRequest) {
  const apiKey = authenticateSecretKey(req);
  if (!apiKey) return jsonError("Invalid Authorization header", 401);
  try {
    const body = await req.json().catch(() => ({}));
    const { delegationId, action, domain, amount } = body;
    if (!delegationId || !action) return jsonError("Missing delegationId or action", 400);
    const result = verifyDelegation(delegationId, action, domain, amount);
    if (!result.authorized) {
      return Response.json({ success: false, authorized: false, reason: result.reason }, { status: 403 });
    }
    return Response.json({
      success: true, authorized: true,
      delegation: { id: result.delegation!.id, scopes: result.delegation!.scopes, actionsRemaining: result.delegation!.constraints.maxActions - result.delegation!.constraints.actionsUsed, spendRemaining: result.delegation!.constraints.maxSpend !== null ? result.delegation!.constraints.maxSpend - result.delegation!.constraints.spentAmount : null, expiresAt: result.delegation!.expiresAt },
      humanToken: { id: result.humanToken!.id, status: result.humanToken!.status, score: result.humanToken!.score },
    });
  } catch { return jsonError("Internal server error", 500); }
}
