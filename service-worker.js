const CACHE_NAME = 'luxemarket-cache-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install Event: Cache static assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: Network First, Fallback to Cache
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests (like Google Fonts or API calls) for strict caching
  // or handle them with a Stale-While-Revalidate strategy if desired.
  // For this demo, we try to cache everything to make it robust.
  
  if (event.request.method !== 'GET') return;

  event.respondWith(
    (async () => {
      try {
        // Network First
        const response = await fetch(event.request);
        
        // If valid response, clone and cache it
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, responseToCache);
        }
        
        return response;
      } catch (error) {
        // If Network fails, try Cache
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // Offline Fallback for Navigation (SPA Support)
        // If the user navigates to a page /shop but is offline, serve index.html
        if (event.request.mode === 'navigate') {
          const cache = await caches.open(CACHE_NAME);
          const cachedIndex = await cache.match('/index.html');
          return cachedIndex;
        }

        throw error;
      }
    })()
  );
});