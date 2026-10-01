'use client';

import { useEffect } from 'react';

let developmentCleanup: Promise<boolean> | null = null;

const clearDevelopmentCache = async () => {
  const workerUrl = new URL(`/sw.js`, window.location.origin).href;
  const shouldReload = navigator.serviceWorker.controller?.scriptURL === workerUrl;
  const registrations = await navigator.serviceWorker.getRegistrations();
  const appRegistrations = registrations.filter(registration =>
    [registration.active, registration.waiting, registration.installing].some(worker => worker?.scriptURL === workerUrl),
  );

  await Promise.all(appRegistrations.map(registration => registration.unregister()));

  if (`caches` in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.filter(name => name.startsWith(`bengali-blush-`)).map(name => caches.delete(name)));
  }

  return shouldReload;
};

export default function PwaRegistration() {
  useEffect(() => {
    if (!(`serviceWorker` in navigator)) return;

    if (process.env.NODE_ENV !== `production`) {
      let active = true;
      developmentCleanup ??= clearDevelopmentCache();
      developmentCleanup.then(shouldReload => {
        if (active && shouldReload) window.location.reload();
      }).catch(error => {
        if (active) console.error(`Development Cache Cleanup Failed`, error);
      });

      return () => { active = false; };
    }

    navigator.serviceWorker.register(`/sw.js`).catch(error => {
      console.error(`Service Worker Registration Failed`, error);
    });
  }, []);

  return null;
}
