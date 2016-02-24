'use strict';

var cacheVersion = 1;

var currentCache = {
  offline: 'offline-cache-' + cacheVersion
};

const offlineUrl = 'offline-page.html';

console.log('service-worker');

this.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(currentCache.offline)
      .then(function(cache) {
        console.log('cache', cache);

        return cache.addAll([
          offlineUrl
        ]);
      })
  );
});


this.addEventListener('fetch', event => {
  console.log('fetch', event.request.url);

  if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(event.request.url).catch(error => {
        return caches.match(offlineUrl);
      })
    );
  } else {
    event.respondWith(
      caches
        .match(event.request)
        .then(function (response) {
          return response || fetch(event.request);
        })
    );
  }
});
