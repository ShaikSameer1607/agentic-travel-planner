// Service worker with basic precache and runtime caching.
const CACHE_NAME = 'agentic-trip-cache-v1';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png'
];

self.addEventListener('install', (event) => {
  // Precache the app shell
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Navigation requests: try cache-first (serve cached index.html), then network
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('/index.html').then((cached) => {
        if (cached) return cached;
        return fetch(event.request)
          .then((res) => {
            // Update cache with latest index.html
            const resClone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', resClone));
            return res;
          })
          .catch(() => cached);
      })
    );
    return;
  }

  // For other requests: try cache first, then network and cache response
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((networkResponse) => {
          // Cache assets for future offline use
          if (networkResponse && networkResponse.status === 200 && networkResponse.type !== 'opaque') {
            const resClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone)).catch(() => {});
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request));
    })
  );
});
