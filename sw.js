// sw.js — Service Worker de Cacos Quest

const NOMBRE_CACHE = 'cacos-quest-v1.3';

const ARCHIVOS_A_CACHEAR = [
  './',
  './index.html',
  './css/styles.css',
  './js/data.js',
  './js/storage.js',
  './js/players.js',
  './js/app.js',
  './js/missions.js',
  './js/cycles.js',
  './js/provisions.js',
  './js/battlepass.js',
  './js/firebase.js',
  './icons/icon.svg',
  './manifest.json'
];

// Al instalar: guardar todos los archivos en caché
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(NOMBRE_CACHE).then(function(cache) {
      return cache.addAll(ARCHIVOS_A_CACHEAR);
    })
  );
});

// Al activar: borrar cachés viejas si el nombre cambió
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(nombres) {
      return Promise.all(
        nombres
          .filter(function(nombre) { return nombre !== NOMBRE_CACHE; })
          .map(function(nombre) { return caches.delete(nombre); })
      );
    })
  );
});

// Al pedir recursos: responder con caché si existe, si no ir a la red
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(respuestaCacheada) {
      return respuestaCacheada || fetch(event.request);
    })
  );
});
