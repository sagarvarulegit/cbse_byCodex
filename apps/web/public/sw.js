/**
 * ChapterReady Service Worker
 *
 * Provides offline navigation resilience for Android TWA and mobile PWA,
 * caching visited study notes, formula sheets, and essential UI assets.
 * Explicitly bypasses APIs, user authentication, and Cashfree/Razorpay payment gateways.
 */

const STATIC_CACHE = 'cr-static-v1';
const PAGES_CACHE = 'cr-pages-v1';

const PRECACHE_URLS = [
  '/offline',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/brand/chapterready-logo.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch((err) => {
        console.warn('[SW] Precache warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== STATIC_CACHE && key !== PAGES_CACHE) {
            return caches.delete(key);
          }
          return null;
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // 1. Only process GET requests
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  // 2. Never intercept API calls, auth routes, or payment gateways
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/v1/') ||
    url.pathname.startsWith('/login') ||
    url.pathname.startsWith('/register') ||
    url.hostname.includes('cashfree.com') ||
    url.hostname.includes('razorpay.com') ||
    url.pathname.includes('_next/webpack-hmr')
  ) {
    return;
  }

  // 3. Navigation requests (HTML pages): Network-first with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(PAGES_CACHE).then((cache) => {
              cache.put(request, clone);
            });
          }
          return response;
        })
        .catch(async () => {
          // If offline, attempt to serve cached page
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // Fall back to branded offline page
          const offlinePage = await caches.match('/offline');
          return offlinePage || new Response('Offline', { status: 503, statusText: 'Offline' });
        })
    );
    return;
  }

  // 4. Static assets (images, icons, figures, fonts): Stale-while-revalidate
  if (
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/brand/') ||
    url.pathname.startsWith('/figures/') ||
    url.pathname.startsWith('/activity-illustrations/') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.svg')
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              caches.open(STATIC_CACHE).then((cache) => {
                cache.put(request, clone);
              });
            }
            return networkResponse;
          })
          .catch(() => cached);

        return cached || fetchPromise;
      })
    );
  }
});
