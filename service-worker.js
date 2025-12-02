
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

// Push Notification Event
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: 'New Notification', body: 'Check it out!' };
  
  const options = {
    body: data.body || 'You have a new update from LuxeMarket.',
    icon: 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'LuxeMarket', options)
  );
});

// Notification Click Event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        if (clientList.length > 0) {
            let client = clientList[0];
            for (let i = 0; i < clientList.length; i++) {
                if (clientList[i].focused) {
                    client = clientList[i];
                }
            }
            return client.focus();
        }
        return clients.openWindow('/');
    })
  );
});
