// VoiceVillage Service Worker - Cache Buster
// Version: increment this number to force all devices to reload
var CACHE_VERSION = 'vv-v2.1';
var CACHE_NAME = CACHE_VERSION;

// On install - clear everything and take control immediately
self.addEventListener('install', function(e) {
  self.skipWaiting();
});

// On activate - delete all old caches and take control
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) { return key !== CACHE_NAME; })
            .map(function(key) { return caches.delete(key); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// On fetch - always go to network first, never serve stale cache
self.addEventListener('fetch', function(e) {
  e.respondWith(
    fetch(e.request, { cache: 'no-store' }).catch(function() {
      return caches.match(e.request);
    })
  );
});
