# Bengali Blush

![Bengali Blush](./public/assets/versions/BengaliBlush_v0000_0.gif)

A Next.js, TypeScript, Sass, and PWA storefront for Bengali Blush Atelier. Lash & Beauty Studio.

## Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

- `npm run dev` — start the local development server
- `npm run typecheck` — check TypeScript
- `npm run lint` — check code quality
- `npm run build` — create the production PWA build
- `npm start` — serve the production build

## Structure

- `src/app` — App Router layouts, pages, and UI components
- `src/shared` — site configuration and browser storage
- `src/styles` — Sass theme, storefront, effects, and responsive styling
- `public` — images, icons, and the web app manifest

## Progressive Web App

The existing Next.js App Router app includes a web app manifest, home screen icons, Apple web app metadata, and a production service worker. No additional PWA package is required.

PWA registration is enabled in production on HTTPS or localhost. Run `npm run build` followed by `npm start` when you are ready to review installation and offline behavior. Development mode removes this app’s old workers and caches so source changes stay visible.

Install from your browser’s app menu. On iPhone or iPad, use Share → Add to Home Screen. The manifest includes shortcuts to About and Contact.

The worker warms Home, About, Contact, their Next.js assets, and essential brand images. Available public pages are cached separately and refresh from the network; unavailable pages show the themed offline fallback. Next.js server component requests, API responses, and external content are not cached. Optimized shop images and external maps may need a connection.

Worker updates activate after existing app windows close. Increment `CACHE_NAME` in `public/sw.js` when changing the cached shell or assets so the next installation refreshes them. Set `NEXT_PUBLIC_SITE_URL` to the production domain when deploying.
