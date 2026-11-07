/**
 * ChapterReady Service Worker
 *
 * Provides offline navigation resilience for Android TWA and mobile PWA,
 * caching visited public study notes, formula sheets, and essential UI assets.
 * Explicitly bypasses APIs, authenticated student routes, and Cashfree/Razorpay payment gateways.
 */

const STATIC_CACHE = 'cr-static-v2';
const PAGES_CACHE = 'cr-pages-v2';

const PRECACHE_URLS = [
  '/offline',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/brand/chapterready-logo.svg',
];

const PRIVATE_PATH_PREFIXES = [
  '/api/',
  '/v1/',
  '/login',
  '/register',
  '/recover-account',
  '/dashboard',
  '/orders',
  '/profile',
  '/my-mistakes',
  '/parent-summary',
  '/admin',
  '/store',
  '/feedback',
];

function isPrivateOrBypassedPath(pathname) {
  return PRIVATE_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix.endsWith('/') ? prefix : `${prefix}/`)
  );
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        return Promise.allSettled(
          PRECACHE_URLS.map((url) =>
            cache.add(url).catch((err) => {
              console.warn('[SW] Precache item skipped:', url, err);
            })
          )
        );
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== STATIC_CACHE && key !== PAGES_CACHE) {
              return caches.delete(key);
            }
            return null;
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_AUTH_CACHE') {
    event.waitUntil(caches.delete(PAGES_CACHE));
  }
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // 1. Only process GET requests
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  // 2. Never intercept cross-origin payment gateways, APIs, HMR, or RSC flight data
  if (
    url.hostname.includes('cashfree.com') ||
    url.hostname.includes('razorpay.com') ||
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/v1/') ||
    url.pathname.includes('_next/webpack-hmr') ||
    request.headers.get('RSC') === '1'
  ) {
    return;
  }

  // 3. Navigation requests (HTML pages): Network-first with offline fallback
  if (request.mode === 'navigate') {
    const isPrivatePage = isPrivateOrBypassedPath(url.pathname);

    event.respondWith(
      fetch(request)
        .then((response) => {
          // Only cache public study pages (never cache personalized student pages)
          if (!isPrivatePage && response && response.status === 200 && response.type === 'basic') {
            const clone = response.clone();
            caches.open(PAGES_CACHE).then((cache) => {
              cache.put(request, clone);
            });
          }
          return response;
        })
        .catch(async () => {
          if (!isPrivatePage) {
            const cachedResponse =
              (await caches.match(request)) || (await caches.match(url.pathname));
            if (cachedResponse) {
              return cachedResponse;
            }
          }
          // Fall back to branded offline page
          const offlinePage = await caches.match('/offline');
          return (
            offlinePage ||
            new Response('You are currently offline. Please check your internet connection.', {
              status: 503,
              statusText: 'Offline',
              headers: { 'Content-Type': 'text/plain; charset=utf-8' },
            })
          );
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
