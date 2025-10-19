// sw.js — offline cache for Архитектор таланта — Zen
const CACHE_NAME = 'ta-zen-cache-v1';
const CORE = ['./index.html?v=zen','./manifest.json','./icon-192.png','./icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(CORE)).then(()=> self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=> caches.delete(k)))) .then(()=> self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request; if (req.method !== 'GET') return;
  e.respondWith(caches.match(req).then(cached => {
    const fetchPromise = fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE_NAME).then(c=> c.put(req, copy)); return res; }).catch(()=> cached);
    return cached || fetchPromise;
  }));
});
