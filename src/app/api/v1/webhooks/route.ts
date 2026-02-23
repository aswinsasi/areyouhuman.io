import { NextRequest } from "next/server";
import { registerWebhook, listWebhooks, deleteWebhook } from "@/lib/db";
import { jsonError } from "@/lib/api-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { siteKey, url, events } = body;
    if (!siteKey || !url || !events?.length) return jsonError("Missing siteKey, url, or events", 400);
    const wh = registerWebhook(siteKey, url, events);
    return Response.json({ success: true, webhook: wh, message: "Save your webhook secret — it won't be shown again." }, { status: 201 });
  } catch { return jsonError("Internal server error", 500); }
}

export async function GET(req: NextRequest) {
  const siteKey = req.nextUrl.searchParams.get("siteKey") || undefined;
  return Response.json({ success: true, webhooks: listWebhooks(siteKey) });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return jsonError("Missing id param", 400);
  if (!deleteWebhook(id)) return jsonError("Webhook not found", 404);
  return Response.json({ success: true, message: "Webhook deleted" });
}
