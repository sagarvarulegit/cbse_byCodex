'use client';

import { useEffect } from 'react';
import { detectAndPersistTwaSession } from '../lib/twa';

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    // Detect and persist Android TWA session indicator
    detectAndPersistTwaSession();

    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    const registerSw = () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          if (process.env.NODE_ENV !== 'production') {
            console.log('[SW] Service Worker registered with scope:', reg.scope);
          }
        })
        .catch((err) => {
          console.warn('[SW] Service Worker registration failed:', err);
        });
    };

    if (document.readyState === 'complete') {
      registerSw();
    } else {
      window.addEventListener('load', registerSw, { once: true });
    }

    const handleAuthChange = () => {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_AUTH_CACHE' });
      }
    };

    window.addEventListener('cbse:auth-change', handleAuthChange);
    return () => {
      window.removeEventListener('load', registerSw);
      window.removeEventListener('cbse:auth-change', handleAuthChange);
    };
  }, []);

  return null;
}
