// Basic service worker: provides an offline shell and caches requests.
const CACHE_NAME = 'agentic-trip-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // For navigation requests, try network first, fallback to cached index.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).then((res) => {
        return res;
      }).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // For other requests: try cache, then network, then cache fallback
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((networkResponse) => {
        // Cache a clone of the network response
        const resClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          // Only cache successful responses
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, resClone).catch(() => {});
          }
        });
        return networkResponse;
      }).catch(() => caches.match(event.request));
    })
  );
});
