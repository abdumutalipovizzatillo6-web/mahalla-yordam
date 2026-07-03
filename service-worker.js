var CACHE_NAME = "mahalla-yordam-v1";
var SHELL_FILES = [
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(SHELL_FILES);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(key){
        if(key !== CACHE_NAME){ return caches.delete(key); }
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function(event){
  var url = event.request.url;
  if(url.indexOf("firebaseio.com") !== -1 || url.indexOf("firebasedatabase.app") !== -1){
    return;
  }
  event.respondWith(
    caches.match(event.request).then(function(cached){
      return cached || fetch(event.request);
    })
  );
});
