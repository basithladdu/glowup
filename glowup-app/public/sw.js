const CACHE_NAME = 'glowup-v2';
const ASSETS = ['/', '/index.html', '/manifest.json', '/food_database.csv'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  // Navigation requests (the app shell) go network-first so a returning user always gets the
  // latest index.html — pointing at a stale cached shell after a deploy risks 404s on hashed
  // JS/CSS filenames Vite has since rotated out. Everything else (hashed, immutable build
  // assets) stays cache-first for speed and offline support.
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request).then((res) => res || caches.match('/')))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request).catch(() => caches.match('/')))
  );
});
