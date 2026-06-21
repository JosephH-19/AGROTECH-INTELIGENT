self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open('agrotech-v1'));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
