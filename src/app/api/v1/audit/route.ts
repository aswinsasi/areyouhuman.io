import { NextRequest } from "next/server";
import { getAuditLog } from "@/lib/db";

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const entries = getAuditLog({
    humanTokenId: p.get("humanTokenId") || undefined,
    delegationId: p.get("delegationId") || undefined,
    type: p.get("type") || undefined,
    limit: parseInt(p.get("limit") || "100"),
  });
  return Response.json({ success: true, count: entries.length, entries });
}
