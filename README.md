# Bengali Blush

A Next.js, TypeScript, Sass, and PWA storefront for Bengali Blush Atelier.

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

Cart contents and booking requests are stored locally in the browser until a backend is connected.
