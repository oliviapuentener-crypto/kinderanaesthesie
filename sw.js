// Offline-Cache. Bei Änderungen an index.html die Versionsnummer erhöhen.
const CACHE = 'kinderanaesthesie-v3';
const FILES = ['./', './index.html', './manifest.json', './icon-180_1.png', './icon-192_1.png', './icon-512_1.png', './icon-maskable-512_1.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
// Network-first (immer aktuellste Version wenn online), Cache als Fallback offline
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
