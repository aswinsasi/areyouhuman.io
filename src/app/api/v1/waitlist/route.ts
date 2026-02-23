import { NextRequest } from "next/server";
import { addToWaitlist, getWaitlist } from "@/lib/db";
import { jsonError } from "@/lib/api-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, source } = body;

    if (!email || !email.includes("@")) return jsonError("Invalid email", 400);

    const added = addToWaitlist(email, source || "website");

    return Response.json({
      success: true,
      message: added ? "Added to waitlist!" : "Already on the waitlist.",
      position: getWaitlist().length,
    });
  } catch {
    return jsonError("Internal server error", 500);
  }
}

export async function GET() {
  const list = getWaitlist();
  return Response.json({ success: true, count: list.length, entries: list });
}
