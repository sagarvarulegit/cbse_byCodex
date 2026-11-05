declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Dispatches an event to Google Analytics (gtag) and Google Tag Manager (dataLayer).
 * Safe to call on both server and client (no-ops on server).
 */
export function trackAnalyticsEvent(action: string, params: Record<string, any> = {}) {
  if (typeof window === 'undefined') return;

  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', action, params);
    }

    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: action,
        ...params,
      });
    }
  } catch {
    // Fail silently so analytics never impacts user experience
  }
}
