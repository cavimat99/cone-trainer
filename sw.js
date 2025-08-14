// sw.js
const VERSION = 'v8';                      // ↑ aumenta quando modifichi
const CACHE = 'cone-trainer-' + VERSION;
const ASSETS = [
  '.', 'index.html', 'trainer.html', 'manifest.webmanifest'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', e => {
  const req = e.request;
  const u = new URL(req.url);
  if (req.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith((async () => {
    const cached = await caches.match(req);
    const net = fetch(req).then(resp => {
      caches.open(CACHE).then(c => c.put(req, resp.clone()));
      return resp;
    }).catch(() => cached);
    return cached || net;
  })());
});
