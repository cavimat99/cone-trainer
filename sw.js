// sw.js
const VERSION = 'v2';                  // <-- aumenta questo quando aggiorni
const CACHE = 'cone-trainer-' + VERSION;
const ASSETS = ['.', 'index.html', 'manifest.webmanifest'];

self.addEventListener('install', (e) => {
  // prendi subito il controllo
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim(); // controlla subito tutte le pagine
  })());
});

// Cache-first con aggiornamento in background
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith((async () => {
    const cached = await caches.match(req);
    const net = fetch(req).then(resp => {
      caches.open(CACHE).then(c => c.put(req, resp.clone()));
      return resp;
    }).catch(() => cached);
    return cached || net;
  })());
});
