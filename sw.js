// sw.js — offline cache for Архитектор таланта — Zen (Fix)

const CACHE_NAME = 'ta-zen-fix-cache-v1';
const CORE = ['./index.html?v=fix1','./manifest.json','./icon-192.png','./icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(CORE)).then(()=> self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith((async () => {
    const cached = await caches.match(req);
    try {
      const fresh = await fetch(req);
      const copy = fresh.clone();
      const c = await caches.open(CACHE_NAME);
      c.put(req, copy);
      return fresh;
    } catch (err) {
      return cached || Response.error();
    }
  })());
});
