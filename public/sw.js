const CACHE_PREFIX = `bengali-blush`;
const CACHE_NAME = `${CACHE_PREFIX}-shell-v2`;
const APP_SHELL = [
  `/favicon.svg`,
  `/icon-192x192.png`,
  `/icon-512x512.png`,
  `/manifest.json`,
  `/hero-beauty.jpg`,
  `/hair-styling.jpg`,
  `/party-makeup.jpg`,
];

self.addEventListener(`install`, event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    const pageResponse = await fetch(`/`);
    const html = await pageResponse.clone().text();
    const nextAssets = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
      .map(match => new URL(match?.[1] ?? ``, self.location.origin))
      .filter(url => url.origin === self.location.origin && url.pathname.startsWith(`/_next/static/`))
      .map(url => `${url.pathname}${url.search}`);

    await cache.addAll([...new Set([...APP_SHELL, ...nextAssets])]);
    await cache.put(`/`, pageResponse);
  })());
  self.skipWaiting();
});

self.addEventListener(`activate`, event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys
        .filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
        .map(key => caches.delete(key)),
    )).then(() => self.clients.claim()),
  );
});

self.addEventListener(`fetch`, event => {
  const { request } = event;
  const requestUrl = new URL(request.url);
  if (request.method !== `GET` || requestUrl.origin !== self.location.origin) return;

  if (request.mode === `navigate`) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(`/`, copy));
          return response;
        })
        .catch(() => caches.match(`/`)),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => cached ?? fetch(request).then(response => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
      }
      return response;
    })),
  );
});
