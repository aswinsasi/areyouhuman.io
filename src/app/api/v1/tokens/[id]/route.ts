import { NextRequest } from "next/server";
import { getHumanToken, revokeHumanToken } from "@/lib/db";
import { jsonError } from "@/lib/api-auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = getHumanToken(id);
  if (!token) return jsonError("Human token not found", 404);
  return Response.json({ success: true, token });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const revoked = revokeHumanToken(id);
  if (!revoked) return jsonError("Token not found", 404);
  return Response.json({ success: true, message: "Token and all delegations revoked" });
}
