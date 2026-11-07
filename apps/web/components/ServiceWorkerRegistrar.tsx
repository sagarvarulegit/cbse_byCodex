'use client';

import { useEffect } from 'react';
import { detectAndPersistTwaSession } from '../lib/twa';

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    // Detect and persist Android TWA session indicator
    detectAndPersistTwaSession();

    // Register service worker if supported
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // In development, service workers can interfere with HMR unless in production,
      // but registration can be enabled everywhere or production only.
      window.addEventListener('load', () => {
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
      });
    }
  }, []);

  return null;
}
