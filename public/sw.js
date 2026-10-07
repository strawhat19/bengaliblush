const CACHE_PREFIX = `bengali-blush-`;
const CACHE_NAME = `${CACHE_PREFIX}shell-v10`;
const OFFLINE_URL = `/offline.html`;
const PUBLIC_PAGES = [`/`, `/about`, `/contact`];
const APP_SHELL = [
  `/manifest.json`,
  `/hero-beauty.jpg`,
  `/hair-styling.jpg`,
  `/party-makeup.jpg`,
  `/favicon.svg?v=bb-arc`,
  `/logo-mark-transparent.svg`,
  `/icon-192x192.png?v=bb-arc`,
  `/icon-512x512.png?v=bb-arc`,
  `/apple-icon-180x180.png?v=bb-arc`,
];

const isCacheableResponse = response => response.status === 200
  && response.type === `basic`
  && !response.redirected
  && !/\b(?:private|no-store)\b/i.test(response.headers.get(`Cache-Control`) ?? ``);

const cachePublicPage = async (cache, path, response) => {
  if (!isCacheableResponse(response) || !response.headers.get(`Content-Type`)?.includes(`text/html`)) return;
  const htmlResponse = response.clone();
  await cache.put(path, response.clone());
  const html = await htmlResponse.text();
  const nextAssets = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
    .map(match => new URL((match?.[1] ?? ``).replaceAll(`&amp;`, `&`), self.location.origin))
    .filter(url => url.origin === self.location.origin && url.pathname.startsWith(`/_next/static/`))
    .map(url => `${url.pathname}${url.search}`);

  await Promise.allSettled([...new Set(nextAssets)].map(asset => cache.add(asset)));
};

self.addEventListener(`install`, event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.add(new Request(OFFLINE_URL, { cache: `reload` }));
    await Promise.allSettled(APP_SHELL.map(asset => cache.add(new Request(asset, { cache: `reload` }))));
    await Promise.allSettled(PUBLIC_PAGES.map(async path => {
      const response = await fetch(path, { cache: `reload`, headers: { Accept: `text/html` } });
      await cachePublicPage(cache, path, response);
    }));
  })());
});

self.addEventListener(`activate`, event => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames
      .filter(name => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
      .map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener(`fetch`, event => {
  const { request } = event;
  const requestUrl = new URL(request.url);
  if (request.method !== `GET` || requestUrl.origin !== self.location.origin) return;
  if (request.headers.has(`RSC`) || requestUrl.pathname === `/api` || requestUrl.pathname.startsWith(`/api/`)) return;

  if (request.mode === `navigate`) {
    const networkResponse = fetch(request);
    const path = requestUrl.pathname;

    if (!requestUrl.search && PUBLIC_PAGES.includes(path)) {
      event.waitUntil(networkResponse.then(async response => {
        const pageResponse = response.clone();
        const cache = await caches.open(CACHE_NAME);
        await cachePublicPage(cache, path, pageResponse);
      }).catch(() => {}));
    }

    event.respondWith(networkResponse.catch(async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedPage = PUBLIC_PAGES.includes(path) ? await cache.match(path) : null;
      return cachedPage ?? await cache.match(OFFLINE_URL) ?? new Response(`Reconnect To Visit Bengali Blush`, {
        status: 503,
        headers: { 'Content-Type': `text/plain; charset=utf-8` },
      });
    }));
    return;
  }

  const isStaticAsset = requestUrl.pathname.startsWith(`/_next/static/`)
    || /^\/[^/]+\.(?:png|jpe?g|webp|svg|ico|woff2?)$/i.test(requestUrl.pathname)
    || requestUrl.pathname === `/manifest.json`;
  if (!isStaticAsset || request.headers.has(`Range`)) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cachedAsset = await cache.match(request);
    if (cachedAsset) return cachedAsset;

    const response = await fetch(request);
    if (isCacheableResponse(response)) await cache.put(request, response.clone()).catch(() => {});
    return response;
  })());
});
