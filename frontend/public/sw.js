// Retire the pre-Vite cache so returning visitors receive the React build.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith('techprep-cache-')) await caches.delete(key);
    }
    await self.clients.claim();
    await self.registration.unregister();
  })());
});
