import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Only apply to API routes
  if (!request.nextUrl.pathname.startsWith("/api/v1")) {
    return NextResponse.next();
  }

  // Handle preflight OPTIONS
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Site-Key",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  // Add CORS headers to all API responses
  const response = NextResponse.next();
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Site-Key");
  return response;
}

export const config = {
  matcher: "/api/v1/:path*",
};