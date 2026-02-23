import { getStats } from "@/lib/db";

export async function GET() {
  return Response.json({ success: true, ...getStats() });
}
