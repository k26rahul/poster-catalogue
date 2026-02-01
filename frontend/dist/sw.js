// Service Worker for Poster Catalogue App
// Full offline support with aggressive caching

const CACHE_NAME = 'poster-catalogue-v1';

// Static app shell resources to pre-cache
const APP_SHELL = ['/', '/index.html'];

// Paths with aggressive cache-first strategy
const CACHE_FIRST_PATHS = [
  '/pdfs-data/',
  '/poster-images/',
  '/assets/', // Vite bundled JS/CSS assets
];

// Install event - pre-cache app shell
self.addEventListener('install', event => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Pre-caching app shell...');
      return cache.addAll(APP_SHELL);
    }),
  );
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        // Take control of all pages immediately
        return self.clients.claim();
      }),
  );
});

// Helper to check if URL should use cache-first strategy
function shouldCacheFirst(url) {
  return CACHE_FIRST_PATHS.some(path => url.includes(path));
}

// Helper to check if this is a navigation request
function isNavigationRequest(request) {
  return request.mode === 'navigate';
}

// Helper to check if this is an API/external request we shouldn't cache
function shouldSkipCache(url) {
  const skipPatterns = [
    'chrome-extension://',
    'extensions/',
    'sockjs-node', // Vite HMR
    '/@vite', // Vite dev
    '/__vite', // Vite dev
    'hot-update', // HMR updates
  ];
  return skipPatterns.some(pattern => url.includes(pattern));
}

// Create offline response
function createOfflineResponse(resourceType) {
  const message = JSON.stringify({
    error: 'offline',
    message: `Network unavailable. ${resourceType} not found in cache.`,
  });
  return new Response(message, {
    status: 503,
    statusText: 'Service Unavailable',
    headers: { 'Content-Type': 'application/json' },
  });
}

// Fetch event - handle all requests
self.addEventListener('fetch', event => {
  const url = event.request.url;

  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip dev server and extension requests
  if (shouldSkipCache(url)) {
    return;
  }

  // Navigation requests (HTML pages) - network-first with offline fallback
  if (isNavigationRequest(event.request)) {
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          // Cache the page for offline use
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return networkResponse;
        })
        .catch(() => {
          // Offline - try cache, or return cached index.html for SPA
          return caches.match(event.request).then(cachedResponse => {
            return cachedResponse || caches.match('/index.html');
          });
        }),
    );
    return;
  }

  // Cache-first strategy for static assets (pdfs-data, poster-images, assets)
  if (shouldCacheFirst(url)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            console.log('[SW] Cache hit:', url);
            return cachedResponse;
          }

          // Not in cache, fetch from network
          return fetch(event.request)
            .then(networkResponse => {
              if (networkResponse && networkResponse.status === 200) {
                console.log('[SW] Caching:', url);
                cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => {
              // Network failed and not in cache
              console.log('[SW] Offline, resource not cached:', url);
              return createOfflineResponse('Resource');
            });
        });
      }),
    );
    return;
  }

  // Network-first for other requests (fallback to cache)
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Network failed and not in cache
          console.log('[SW] Offline, resource not cached:', url);
          return createOfflineResponse('Resource');
        });
      }),
  );
});

// Message handler for cache operations
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME).then(() => {
      console.log('[SW] Cache cleared');
      if (event.ports[0]) {
        event.ports[0].postMessage({ success: true });
      }
    });
  }

  if (event.data && event.data.type === 'GET_CACHE_INFO') {
    caches.open(CACHE_NAME).then(cache => {
      cache.keys().then(keys => {
        if (event.ports[0]) {
          event.ports[0].postMessage({
            cacheSize: keys.length,
            entries: keys.map(k => k.url),
          });
        }
      });
    });
  }

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
