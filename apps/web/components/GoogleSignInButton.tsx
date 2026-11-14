'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';

import { googleAuthAction } from '../app/auth-actions';
import { trackAnalyticsEvent } from '../lib/analytics';
import { getSafeNextPath, getSafePostSignupPath } from '../lib/auth-redirect';

type GoogleCredentialResponse = {
  credential?: string;
  select_by?: string;
};

type GoogleAccountsIdApi = {
  initialize: (config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
    context?: 'signin' | 'signup' | 'use';
    ux_mode?: 'popup' | 'redirect';
  }) => void;
  renderButton: (
    parent: HTMLElement,
    options: {
      type?: 'standard' | 'icon';
      theme?: 'outline' | 'filled_blue' | 'filled_black';
      size?: 'large' | 'medium' | 'small';
      text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
      shape?: 'rectangular' | 'pill' | 'circle' | 'square';
      logo_alignment?: 'left' | 'center';
      width?: number;
    },
  ) => void;
};

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: GoogleAccountsIdApi;
      };
    };
  }
}

const GSI_SCRIPT_ID = 'google-identity-services-sdk';
const GSI_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

type GoogleSignInButtonProps = {
  mode: 'login' | 'register';
};

export function GoogleSignInButton({ mode }: GoogleSignInButtonProps) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() ?? '';
  const router = useRouter();
  const searchParams = useSearchParams();
  const buttonHostRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!clientId) return;

    if (window.google?.accounts?.id) {
      setSdkReady(true);
      return;
    }

    let existingScript = document.getElementById(GSI_SCRIPT_ID) as HTMLScriptElement | null;
    const handleLoad = () => setSdkReady(true);

    if (!existingScript) {
      existingScript = document.createElement('script');
      existingScript.id = GSI_SCRIPT_ID;
      existingScript.src = GSI_SCRIPT_SRC;
      existingScript.async = true;
      existingScript.defer = true;
      document.head.appendChild(existingScript);
    }

    existingScript.addEventListener('load', handleLoad);
    return () => {
      existingScript?.removeEventListener('load', handleLoad);
    };
  }, [clientId]);

  useEffect(() => {
    if (!clientId || !sdkReady || !buttonHostRef.current) return;
    const idApi = window.google?.accounts?.id;
    if (!idApi) return;

    const host = buttonHostRef.current;

    idApi.initialize({
      client_id: clientId,
      context: mode === 'register' ? 'signup' : 'signin',
      ux_mode: 'popup',
      auto_select: false,
      cancel_on_tap_outside: true,
      callback: (response: GoogleCredentialResponse) => {
        if (!response?.credential) {
          setError('Google sign-in was cancelled. Please try again or use email below.');
          return;
        }

        setError(null);
        startTransition(async () => {
          const result = await googleAuthAction(response.credential!, 10);
          if (!result.ok) {
            setError(result.error ?? 'Unable to sign in with Google right now.');
            return;
          }

          trackAnalyticsEvent('student_google_auth_success', {
            mode,
            is_new_user: Boolean(result.isNewUser),
          });

          window.dispatchEvent(new Event('cbse:auth-change'));
          const rawNext = searchParams.get('next');
          const destination = result.isNewUser
            ? getSafePostSignupPath(rawNext)
            : getSafeNextPath(rawNext);
          router.push(destination);
          router.refresh();
        });
      },
    });

    let lastRenderedWidth = 0;
    const renderAtCurrentWidth = () => {
      const available = Math.floor((host.clientWidth || 320) - 4);
      const measuredWidth = Math.min(400, Math.max(200, available));
      if (Math.abs(measuredWidth - lastRenderedWidth) < 8) return;
      lastRenderedWidth = measuredWidth;

      host.innerHTML = '';
      idApi.renderButton(host, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: mode === 'register' ? 'signup_with' : 'continue_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: measuredWidth,
      });
    };

    renderAtCurrentWidth();

    let resizeTimer: number | undefined;
    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(renderAtCurrentWidth, 150);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [clientId, mode, router, sdkReady, searchParams]);

  if (!clientId) {
    if (process.env.NODE_ENV === 'development') {
      return (
        <p className="google-auth-dev-note">
          💡 Dev hint: Set <code>NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> &amp; <code>GOOGLE_CLIENT_ID</code> to show 1-Tap Google Sign-In here.
        </p>
      );
    }
    return null;
  }

  return (
    <div className="google-auth-section">
      <div className="google-auth-button-shell" aria-busy={isPending}>
        <div ref={buttonHostRef} className="google-auth-gsi-host" />
        {isPending ? (
          <p className="google-auth-status">Signing you into ChapterReady…</p>
        ) : null}
      </div>

      {error ? (
        <p className="auth-error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="auth-or-divider" aria-hidden="true">
        <span>or continue with email</span>
      </div>
    </div>
  );
}
