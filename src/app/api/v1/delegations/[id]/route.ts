import { NextRequest } from "next/server";
import { getDelegation, revokeDelegation } from "@/lib/db";
import { jsonError } from "@/lib/api-auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const d = getDelegation(id);
  if (!d) return jsonError("Delegation not found", 404);
  return Response.json({ success: true, delegation: d });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!revokeDelegation(id)) return jsonError("Delegation not found", 404);
  return Response.json({ success: true, message: "Delegation revoked" });
}
