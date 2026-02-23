import { NextRequest } from "next/server";
import { createAPIKey, listAPIKeys, DEMO_SITE_KEY, DEMO_SECRET_KEY } from "@/lib/db";
import { jsonError } from "@/lib/api-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name, domain } = body;

    if (!name || !domain) return jsonError("Missing name or domain", 400);

    const key = createAPIKey(name, domain);

    return Response.json({
      success: true,
      id: key.id,
      siteKey: key.siteKey,
      secretKey: key.secretKey,
      name: key.name,
      domain: key.domain,
      plan: key.plan,
      message: "Save your secret key now — it won't be shown again.",
    }, { status: 201 });
  } catch {
    return jsonError("Internal server error", 500);
  }
}

// GET — List all keys (demo only — in production, auth required)
export async function GET() {
  const keys = listAPIKeys().map((k) => ({
    id: k.id,
    siteKey: k.siteKey,
    name: k.name,
    domain: k.domain,
    plan: k.plan,
    usage: k.usage,
    createdAt: k.createdAt,
  }));

  return Response.json({
    success: true,
    keys,
    demo: { siteKey: DEMO_SITE_KEY, secretKey: DEMO_SECRET_KEY },
  });
}
