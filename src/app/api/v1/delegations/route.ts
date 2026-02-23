import { NextRequest } from "next/server";
import { createDelegation, listDelegations } from "@/lib/db";
import { jsonError } from "@/lib/api-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { humanTokenId, agentId, agentName, agentPlatform, scopes, constraints } = body;
    if (!humanTokenId || !agentId || !agentName) return jsonError("Missing humanTokenId, agentId, or agentName", 400);
    const delegation = createDelegation(
      humanTokenId, agentId, agentName, agentPlatform || "custom",
      scopes || ["read"], constraints || {}
    );
    if (!delegation) return jsonError("Human token invalid or expired", 403);
    return Response.json({ success: true, delegation }, { status: 201 });
  } catch { return jsonError("Internal server error", 500); }
}

export async function GET(req: NextRequest) {
  const tokenId = req.nextUrl.searchParams.get("humanTokenId") || undefined;
  return Response.json({ success: true, delegations: listDelegations(tokenId) });
}
