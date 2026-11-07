/**
 * TWA (Trusted Web Activity) Detection & Payment Safety Control
 *
 * Allows ChapterReady to run 1-tap Cashfree/Razorpay UPI payments natively inside
 * the Android TWA shell while providing an instant server-side switch
 * (NEXT_PUBLIC_TWA_PAYMENTS_MODE='enabled' | 'web_only') if ever needed during
 * Play Store review cycles without requiring app rebuilds.
 */

const TWA_STORAGE_KEY = 'cr_is_android_twa';

/**
 * Checks if the current browser session was launched from Android TWA.
 * Persists the result in sessionStorage so internal link navigation remembers
 * the TWA runtime state across page transitions.
 */
export function detectAndPersistTwaSession(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const isTwaReferrer = document.referrer.startsWith('android-app://in.chapterready.app') ||
      document.referrer.startsWith('android-app://');
    const urlParams = new URLSearchParams(window.location.search);
    const hasTwaSource = urlParams.get('utm_source') === 'twa' || urlParams.get('source') === 'twa';

    if (isTwaReferrer || hasTwaSource) {
      window.sessionStorage.setItem(TWA_STORAGE_KEY, '1');
      return true;
    }

    return window.sessionStorage.getItem(TWA_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * Returns true if the user is running inside the Android TWA shell.
 */
export function isAndroidTwa(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    return window.sessionStorage.getItem(TWA_STORAGE_KEY) === '1' || detectAndPersistTwaSession();
  } catch {
    return false;
  }
}

/**
 * Returns true only if TWA payments are explicitly toggled to 'web_only'
 * via environment variable AND the user is inside the Android TWA.
 * Default is false (payments enabled).
 */
export function isTwaWebOnlyPaymentMode(): boolean {
  const mode = process.env.NEXT_PUBLIC_TWA_PAYMENTS_MODE ?? 'enabled';
  if (mode !== 'web_only') {
    return false;
  }

  return isAndroidTwa();
}
