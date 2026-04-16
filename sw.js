const CACHE_NAME = 'inventario-pwa-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

// Instalación: Guarda la estructura visual en el celular
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Archivos cacheados exitosamente');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activación: Limpia versiones antiguas si actualizas la app
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Estrategia de Red: Intercepta las peticiones
self.addEventListener('fetch', event => {
  // Si la petición es hacia tu base de datos (Google Apps Script), SIEMPRE requiere internet
  if (event.request.url.includes('script.google.com')) {
    event.respondWith(fetch(event.request));
  } else {
    // Para la estructura gráfica de la app, usa la memoria del celular primero (Cache First)
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});