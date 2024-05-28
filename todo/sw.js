// Instantly update the service worker if available
self.skipWaiting();

const cacheName = "aw-tasks-v1";
const dynamicCacheName = "aw-tasks-dynamic-v1";
const paths = [
  "./index.html",
  "./app.js",
  "./manifest.json"
];

self.addEventListener("install", function (res) {
  res.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(paths);
    })
  );
});

self.addEventListener("activate", function (ent) {
  ent.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if ([cacheName, dynamicCacheName].indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    fetch(event.request).then(function (response) {
      // Check if we received a valid response
      if (!response || response.status !== 200 || response.type !== "basic") {
        return response;
      }

      // Update the dynamic cache with the new response
      const responseToCache = response.clone();
      caches.open(dynamicCacheName).then(function (cache) {
        cache.put(event.request, responseToCache);
      });

      return response;
    }).catch(function () {
      // Fetch failed (offline), fallback to cache
      return caches.match(event.request).then(function (response) {
        if (response) {
          return response;
        } else {
          // Optionally, return a fallback page if not found in cache
          return caches.match('./index.html');
        }
      });
    })
  );
});
