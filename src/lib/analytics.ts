// ============================================================
// Analytics: Plausible (privacy-friendly, no cookies, GDPR-safe)
// ============================================================
// To enable: Add your domain at https://plausible.io/sites
// The script tag is loaded in layout.tsx

type EventName =
  | "page_view"
  | "analysis_started"
  | "analysis_completed"
  | "scan_again"
  | "share_twitter"
  | "share_linkedin"
  | "share_copy"
  | "share_download"
  | "bot_comparison_viewed"
  | "cta_sdk"
  | "cta_protocol"
  | "motion_permission_granted"
  | "motion_permission_denied";

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string | number | boolean> }) => void;
  }
}

export function trackEvent(name: EventName, data?: Record<string, string | number | boolean>): void {
  // Plausible
  if (typeof window !== "undefined" && window.plausible) {
    window.plausible(name, data ? { props: data } : undefined);
  }

  // Dev console
  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics] ${name}`, data || "");
  }
}
