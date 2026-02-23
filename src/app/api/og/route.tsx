import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const score = new URL(request.url).searchParams.get("score") || "97";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "#06080d", fontFamily: "monospace", position: "relative" }}>
        <div style={{ position: "absolute", top: 2, left: 2, right: 2, bottom: 2, border: "1px solid rgba(0,240,255,0.3)", borderRadius: 8 }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ color: "rgba(0,240,255,0.5)", fontSize: 16 }}>AREYOUHUMAN.IO</div>
          <div style={{ color: "#00F0FF", fontSize: 140, fontWeight: "bold", lineHeight: 1 }}>{score}%</div>
          <div style={{ color: "rgba(0,240,255,0.6)", fontSize: 18, letterSpacing: 6 }}>HUMAN VERIFIED</div>
          <div style={{ color: "#667788", fontSize: 14, marginTop: 20, textAlign: "center", maxWidth: 500 }}>
            Prove your humanity through involuntary behavioral micro-signals. No CAPTCHA. No biometrics.
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 20, color: "#667788", fontSize: 12 }}>HUMANSIGN PROTOCOL • areyouhuman.io</div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
