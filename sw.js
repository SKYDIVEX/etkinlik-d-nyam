var CACHE_NAME = "etkinlik-v1";
var URLS = [
  "/etkinlik-d-nyam/",
  "/etkinlik-d-nyam/index.html",
];

self.addEventListener("install", function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(URLS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function(e) {
  // Sadece aynı origin'den gelen istekleri cache'le
  if (!e.request.url.startsWith(self.location.origin)) return;
  // POST isteklerini cache'leme
  if (e.request.method !== "GET") return;

  e.respondWith(
    fetch(e.request).catch(function() {
      return caches.match(e.request);
    })
  );
});
