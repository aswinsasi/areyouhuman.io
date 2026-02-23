type EventName = "page_view" | "analysis_started" | "analysis_completed" | "scan_again"
  | "share_twitter" | "share_linkedin" | "share_copy" | "share_download"
  | "bot_comparison_viewed" | "cta_sdk" | "cta_protocol";

export function trackEvent(name: EventName, data?: Record<string, string | number | boolean>): void {
  if (typeof window !== "undefined") console.log(`[Analytics] ${name}`, data || "");
}
