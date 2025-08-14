// sw.js — KILLSWITCH per tornare "puliti"
const VERSION = 'killswitch-1';

self.addEventListener('install', (e) => {
  // prendi subito il controllo
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    // 1) svuota tutte le cache
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));
    // 2) disinstalla questo service worker
    await self.registration.unregister();
    // 3) ricarica tutte le tab sotto controllo per applicare subito i cambi
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    clients.forEach(client => client.navigate(client.url));
  })());
});

// nessuna strategia di fetch: rete “nuda”
self.addEventListener('fetch', () => {});
